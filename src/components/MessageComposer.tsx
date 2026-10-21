import { useEffect, useRef, useState } from "react";
import EmojiPicker from "./EmojiPicker";
import { isAxiosError } from "axios";
import type { MessagingMemory } from "@/api/messagingMemory";
import { PaperclipIcon, SendIcon, XIcon } from "lucide-react";
import { FILE_ACCEPT, formatFileSize } from "@/api/projectFiles";
import {
  messagingError,
  sendMessage,
  validateMessageFiles,
} from "@/api/projectMessaging";
import type { MessageDraft, SendResult } from "@/Types/conversation";
import { BusyIcon, primaryAction, quietAction } from "./workspace-ui";
type Props = {
  projectId: string;
  conversationId: string | null;
  audience?: Omit<MessageDraft, "body" | "files">;
  disabled?: boolean;
  onSent: (result: SendResult) => void;
  onBusy?: (busy: boolean) => void;
  memory?: MessagingMemory;
  onAccessDenied?: () => void;
};
export default function MessageComposer({
  projectId,
  conversationId,
  audience,
  disabled,
  onSent,
  onBusy,
  memory,
  onAccessDenied,
}: Props) {
  const renderToken = memory?.token();
  const [saved, setSaved] = useState(() =>
    conversationId ? memory?.draft(conversationId) : null,
  );
  useEffect(() => setSaved(null), []);
  const [body, setBody] = useState(saved?.body ?? "");
  const [files, setFiles] = useState<File[]>(saved?.files ?? []);
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);
  const [progress, setProgress] = useState(0);
  const input = useRef<HTMLInputElement>(null);
  const textarea = useRef<HTMLTextAreaElement>(null);
  const selection = useRef<{
    start: number;
    end: number;
  } | null>(null);
  const emojiCaret = useRef<number | null>(null);
  const lock = useRef(false);
  const mounted = useRef(true);
  const controller = useRef<AbortController | null>(null);
  const request = useRef<{
    signature: string;
    id: string;
  } | null>(saved?.request ?? null);
  // Distinguish two different File objects even when name, size and modified date match.
  const fileIds = useRef(new WeakMap<File, string>());
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
      controller.current?.abort();
    };
  }, []);
  useEffect(
    () =>
      memory?.subscribe((notice) => {
        if (
          notice.reason === "expired" ||
          (notice.id && notice.id !== conversationId)
        )
          return;
        controller.current?.abort();
        request.current = null;
        setSaved(null);
        setBody("");
        setFiles([]);
        selection.current = null;
        emojiCaret.current = null;
        setError("");
      }),
    [memory, conversationId],
  );
  function stage(nextBody: string, nextFiles: File[]) {
    if (lock.current || disabled) return false;
    const issue = conversationId
      ? memory?.saveDraft(
          conversationId,
          { body: nextBody, files: nextFiles, request: request.current },
          renderToken,
        )
      : null;
    if (issue) {
      setError(issue);
      return false;
    }
    setBody(nextBody);
    setFiles(nextFiles);
    setError("");
    return true;
  }
  function insertEmoji(emoji: string) {
    if (lock.current || disabled) return false;
    const savedSelection = selection.current ?? {
      start: body.length,
      end: body.length,
    };
    const start = Math.max(0, Math.min(body.length, savedSelection.start));
    const end = Math.max(start, Math.min(body.length, savedSelection.end));
    const next = body.slice(0, start) + emoji + body.slice(end);
    if (next.length > 10000) {
      setError("Messages can contain up to 10,000 characters.");
      return false;
    }
    if (!stage(next, files)) return false;
    const caret = start + emoji.length;
    selection.current = { start: caret, end: caret };
    emojiCaret.current = caret;
    return true;
  }
  function restoreEmojiFocus() {
    requestAnimationFrame(() => {
      if (
        !mounted.current ||
        lock.current ||
        disabled ||
        (memory && renderToken !== undefined && !memory.valid(renderToken))
      )
        return;
      const element = textarea.current;
      if (!element) return;
      element.focus({ preventScroll: true });
      const caret = emojiCaret.current;
      if (caret !== null) element.setSelectionRange(caret, caret);
      emojiCaret.current = null;
    });
  }
  function choose(selected: File[]) {
    if (lock.current || disabled) return;
    const next = [...files, ...selected];
    const issue = validateMessageFiles(next);
    if (issue) {
      setError(issue);
      return;
    }
    stage(body, next);
  }
  async function send() {
    if (
      lock.current ||
      disabled ||
      (!body.trim() && files.length === 0) ||
      body.trim().length > 10000
    )
      return;
    const issue = validateMessageFiles(files);
    if (issue) {
      setError(issue);
      return;
    }
    const draft: MessageDraft = { ...audience, body, files };
    const signature = JSON.stringify({
      ...draft,
      body: body.trim(),
      files: files.map((file) => {
        if (memory) return memory.fileId(file);
        let id = fileIds.current.get(file);
        if (!id) {
          id = crypto.randomUUID();
          fileIds.current.set(file, id);
        }
        return id;
      }),
    });
    if (request.current?.signature !== signature)
      request.current = { signature, id: crypto.randomUUID() };
    if (conversationId) {
      const issue = memory?.saveDraft(
        conversationId,
        { body, files, request: request.current },
        renderToken,
      );
      if (issue) {
        setError(issue);
        return;
      }
    }
    const token = memory?.token();
    lock.current = true;
    setSending(true);
    setError("");
    setProgress(0);
    onBusy?.(true);
    const pending = new AbortController();
    controller.current = pending;
    let sent: SendResult | null = null;
    try {
      sent = await sendMessage(
        projectId,
        conversationId,
        draft,
        request.current.id,
        pending.signal,
        (value) => {
          if (mounted.current) setProgress(value);
        },
      );
      if (
        !mounted.current ||
        (memory && token !== undefined && !memory.valid(token))
      )
        return;
      if (conversationId) memory?.clearDraft(conversationId);
      setBody("");
      setFiles([]);
      selection.current = null;
      emojiCaret.current = null;
      request.current = null;
    } catch (cause) {
      if (
        mounted.current &&
        !pending.signal.aborted &&
        isAxiosError(cause) &&
        [401, 403, 404].includes(cause.response?.status ?? 0)
      ) {
        memory?.deny(
          cause.response?.status === 401
            ? undefined
            : (conversationId ?? undefined),
        );
        onAccessDenied?.();
      }
      if (mounted.current && !pending.signal.aborted)
        setError(
          messagingError(
            cause,
            "Your message could not be sent. Your draft has been kept. Press Send to retry.",
          ),
        );
    } finally {
      lock.current = false;
      if (mounted.current) {
        setSending(false);
        onBusy?.(false);
      }
    }
    if (
      sent &&
      mounted.current &&
      (!memory || (token !== undefined && memory.valid(token)))
    )
      onSent(sent);
  }
  return (
    <div className="min-w-0">
      {error && (
        <p
          role="alert"
          className="mb-3 text-xs leading-6 text-status-overdue-foreground"
        >
          {error}
        </p>
      )}
      <label className="sr-only" htmlFor={`message-${conversationId ?? "new"}`}>
        Message
      </label>
      <textarea
        ref={textarea}
        onSelect={(event) => {
          selection.current = {
            start: event.currentTarget.selectionStart,
            end: event.currentTarget.selectionEnd,
          };
        }}
        id={`message-${conversationId ?? "new"}`}
        value={body}
        onChange={(event) => stage(event.target.value, files)}
        rows={3}
        maxLength={10000}
        disabled={sending || disabled}
        placeholder="Write your message…"
        className="min-h-24 w-full resize-y rounded-lg border border-input bg-card px-3 py-3 text-base leading-6 text-foreground outline-none placeholder:text-muted-foreground/70 focus-visible:border-ring/50 disabled:opacity-60 sm:text-sm"
      />
      {files.length > 0 && (
        <ul
          aria-label="Selected attachments"
          className="mt-3 max-h-36 space-y-2 overflow-y-auto"
        >
          {files.map((file, index) => (
            <li
              key={index}
              className="flex items-center gap-3 rounded-lg border border-border/70 bg-card px-3 py-2"
            >
              <div className="min-w-0 flex-1">
                <p className="break-all text-xs font-medium">{file.name}</p>
                <p className="mt-1 text-[10px] text-muted-foreground">
                  {formatFileSize(file.size)} ·{" "}
                  {sending ? "Sending" : "Uploads when you send"}
                </p>
              </div>
              <button
                type="button"
                aria-label={`Remove ${file.name}`}
                disabled={sending || disabled}
                onClick={() =>
                  stage(
                    body,
                    files.filter((_, i) => i !== index),
                  )
                }
                className={`${quietAction} h-8 w-8 shrink-0 px-0`}
              >
                <XIcon size={13} aria-hidden="true" />
              </button>
            </li>
          ))}
        </ul>
      )}
      <input
        ref={input}
        type="file"
        multiple
        accept={FILE_ACCEPT}
        className="hidden"
        aria-label="Choose message attachments"
        disabled={sending || disabled}
        onChange={(event) => {
          const selected = Array.from(event.target.files ?? []);
          event.target.value = "";
          choose(selected);
        }}
      />
      <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-1">
          <button
            type="button"
            disabled={sending || disabled || files.length >= 8}
            onClick={() => input.current?.click()}
            className={`${quietAction} px-2`}
          >
            <PaperclipIcon size={14} aria-hidden="true" />
            Attach files
          </button>
          <EmojiPicker
            disabled={sending || disabled}
            onChoose={insertEmoji}
            onRestoreFocus={restoreEmojiFocus}
          />
        </div>
        <button
          type="button"
          disabled={sending || disabled || (!body.trim() && files.length === 0)}
          onClick={() => void send()}
          className={`${primaryAction} min-h-10 px-4`}
        >
          {sending ? (
            <BusyIcon />
          ) : (
            <SendIcon size={14} aria-hidden="true" className="text-inherit" />
          )}
          {sending
            ? files.length && progress < 100
              ? `Uploading ${progress}%`
              : "Sending…"
            : "Send"}
        </button>
      </div>
      <p className="mt-2 text-[10px] leading-5 text-muted-foreground">
        Up to 8 files · 25 MB each · 50 MB combined
      </p>
    </div>
  );
}
