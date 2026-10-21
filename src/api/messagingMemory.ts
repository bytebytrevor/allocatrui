import type {
  ConversationDetail,
  ConversationMessage,
} from "@/Types/conversation";

const THREAD_TTL = 5 * 60 * 1000;
const DRAFT_TTL = 30 * 60 * 1000;
const MAX_THREADS = 20;
const MAX_MESSAGES = 300;
const MAX_THREAD_BYTES = 4 * 1024 * 1024;
const MAX_DRAFTS = 20;
const MAX_DRAFT_FILE_BYTES = 50 * 1024 * 1024;
export type DraftRequest = { signature: string; id: string };
export type ConversationDraft = {
  body: string;
  files: File[];
  request: DraftRequest | null;
};
type Entry = {
  detail: ConversationDetail;
  scrollTop?: number;
  expires: number;
  bytes: number;
};
export type MemoryNotice = {
  id?: string;
  reason: "denied" | "clear" | "expired";
};
const copy = (detail: ConversationDetail): ConversationDetail => ({
  ...detail,
  participants: detail.participants.map((p) => ({ ...p })),
  messages: detail.messages.map((m) => ({
    ...m,
    attachments: m.attachments.map((a) => ({ ...a })),
  })),
});

// One instance belongs to one mounted user/project workspace. Never persisted or shared
// between accounts, projects, browser tabs, localStorage, sessionStorage, or IndexedDB.
export function createMessagingMemory(userId: string, projectId: string) {
  const entries = new Map<string, Entry>();
  const drafts = new Map<
    string,
    { draft: ConversationDraft; expires: number }
  >();
  const listeners = new Set<(notice: MemoryNotice) => void>();
  let epoch = 0;
  let fileIds = new WeakMap<File, string>();
  function emit(notice: MemoryNotice) {
    for (const fn of listeners) fn(notice);
  }
  function sweep() {
    const now = Date.now();
    for (const [id, entry] of entries)
      if (entry.expires <= now) {
        entries.delete(id);
        emit({ id, reason: "expired" });
      }
    for (const [id, entry] of drafts)
      if (entry.expires <= now) drafts.delete(id);
  }
  function capacity() {
    let total = [...entries.values()].reduce((sum, e) => sum + e.bytes, 0);
    while (entries.size > MAX_THREADS || total > MAX_THREAD_BYTES) {
      const key = entries.keys().next().value;
      if (key === undefined) break;
      total -= entries.get(key)!.bytes;
      entries.delete(key);
    }
  }
  function fitsDraft(id: string, draft: ConversationDraft): string | null {
    sweep();
    if (draft.body.length > 10000)
      return "Messages can contain up to 10,000 characters.";
    if (
      draft.files.length > 8 ||
      draft.files.some((f) => f.size > 25 * 1024 * 1024)
    )
      return "Attach up to 8 files, no larger than 25 MB each.";
    const nonempty = Boolean(draft.body || draft.files.length);
    if (nonempty && !drafts.has(id) && drafts.size >= MAX_DRAFTS)
      return "You have 20 unfinished drafts. Send or clear one before starting another.";
    let bytes = draft.files.reduce((sum, f) => sum + f.size, 0);
    for (const [otherId, entry] of drafts)
      if (otherId !== id)
        bytes += entry.draft.files.reduce((sum, f) => sum + f.size, 0);
    return bytes > MAX_DRAFT_FILE_BYTES
      ? "Your unfinished drafts already contain 50 MB of attachments. Remove or send some before attaching more."
      : null;
  }
  return {
    matches: (actor: string, project: string) =>
      actor === userId && project === projectId,
    token: () => epoch,
    valid: (token: number) => token === epoch,
    subscribe(fn: (notice: MemoryNotice) => void) {
      listeners.add(fn);
      return () => {
        listeners.delete(fn);
      };
    },
    sweep,
    read(id: string) {
      const entry = entries.get(id);
      if (!entry) return null;
      if (entry.expires <= Date.now()) {
        entries.delete(id);
        return null;
      }
      entries.delete(id);
      entries.set(id, entry);
      return { detail: copy(entry.detail), scrollTop: entry.scrollTop };
    },
    write(id: string, detail: ConversationDetail, token: number) {
      if (token !== epoch || detail.id !== id) return false;
      let snapshot = copy(detail);
      if (snapshot.messages.length > MAX_MESSAGES)
        snapshot = {
          ...snapshot,
          hasOlder: true,
          messages: snapshot.messages.slice(-MAX_MESSAGES),
        };
      let bytes = JSON.stringify(snapshot).length * 2;
      while (bytes > MAX_THREAD_BYTES && snapshot.messages.length > 1) {
        snapshot.messages.shift();
        snapshot.hasOlder = true;
        bytes = JSON.stringify(snapshot).length * 2;
      }
      if (bytes > MAX_THREAD_BYTES) return false;
      const scrollTop =
        snapshot.messages.length === detail.messages.length
          ? entries.get(id)?.scrollTop
          : undefined;
      entries.delete(id);
      entries.set(id, {
        detail: snapshot,
        scrollTop,
        bytes,
        expires: Date.now() + THREAD_TTL,
      });
      capacity();
      return true;
    },
    scroll(id: string, scrollTop: number) {
      const entry = entries.get(id);
      if (entry) entry.scrollTop = Math.max(0, scrollTop);
    },
    patch(
      id: string,
      update: (detail: ConversationDetail) => ConversationDetail,
    ) {
      epoch++;
      const entry = entries.get(id);
      if (entry) {
        const detail = copy(update(copy(entry.detail)));
        const bytes = JSON.stringify(detail).length * 2;
        if (bytes <= MAX_THREAD_BYTES)
          entries.set(id, { ...entry, detail, bytes });
        else entries.delete(id);
        capacity();
      }
    },
    message(id: string, message: ConversationMessage) {
      this.patch(id, (detail) => ({
        ...detail,
        messages: detail.messages.map((m) =>
          m.id === message.id && m.version <= message.version ? message : m,
        ),
      }));
    },
    invalidate(id: string) {
      epoch++;
      entries.delete(id);
    },
    deny(id?: string) {
      epoch++;
      if (id) {
        entries.delete(id);
        drafts.delete(id);
      } else {
        entries.clear();
        drafts.clear();
        fileIds = new WeakMap();
      }
      emit({ id, reason: "denied" });
    },
    clear() {
      epoch++;
      entries.clear();
      drafts.clear();
      fileIds = new WeakMap();
      emit({ reason: "clear" });
    },
    draft(id: string): ConversationDraft | null {
      const entry = drafts.get(id);
      if (!entry) return null;
      if (entry.expires <= Date.now()) {
        drafts.delete(id);
        return null;
      }
      return {
        ...entry.draft,
        files: [...entry.draft.files],
        request: entry.draft.request ? { ...entry.draft.request } : null,
      };
    },
    saveDraft(
      id: string,
      draft: ConversationDraft,
      token?: number,
    ): string | null {
      if (token !== undefined && token !== epoch)
        return "Refresh this conversation before continuing your draft.";
      const issue = fitsDraft(id, draft);
      if (issue) return issue;
      if (!draft.body && draft.files.length === 0) drafts.delete(id);
      else
        drafts.set(id, {
          draft: {
            ...draft,
            files: [...draft.files],
            request: draft.request ? { ...draft.request } : null,
          },
          expires: Date.now() + DRAFT_TTL,
        });
      return null;
    },
    clearDraft(id: string) {
      drafts.delete(id);
    },
    fileId(file: File) {
      let id = fileIds.get(file);
      if (!id) {
        id = crypto.randomUUID();
        fileIds.set(file, id);
      }
      return id;
    },
  };
}
export type MessagingMemory = ReturnType<typeof createMessagingMemory>;
