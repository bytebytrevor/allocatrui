import { isAxiosError } from "axios";
import {
  createMessagingMemory,
  type MessagingMemory,
} from "@/api/messagingMemory";
import {
  invalidateUnread,
  publishUnread,
  unreadVersion,
} from "@/api/projectMessagingUnread";
import { Fragment, useCallback, useEffect, useRef, useState } from "react";
import {
  Link,
  useOutletContext,
  useParams,
  useSearchParams,
} from "react-router-dom";
import {
  ArchiveIcon,
  ArrowLeftIcon,
  CheckIcon,
  ChevronDownIcon,
  InboxIcon,
  LockKeyholeIcon,
  MailIcon,
  MessageSquareIcon,
  PlusIcon,
  RefreshCwIcon,
  SearchIcon,
  UsersIcon,
  XIcon,
  PinIcon,
  PinOffIcon,
  PaperclipIcon,
  EllipsisVerticalIcon,
  ForwardIcon,
  PencilIcon,
  Trash2Icon,
} from "lucide-react";
import api from "@/api/axios";
import { useAuth } from "@/auth/useAuth";
import {
  archiveConversation,
  getConversation,
  getConversations,
  getMembers,
  markRead,
  messagingError,
  pinConversation,
  editMessage,
  deleteMessage,
  forwardMessage,
  messageActionError,
} from "@/api/projectMessaging";
import type {
  ConversationDetail,
  ConversationList,
  ConversationMember,
  MessageDraft,
  ConversationMessage,
} from "@/Types/conversation";
import type { Task } from "@/Types/task";
import MessageComposer from "@/components/MessageComposer";
import MessageAttachment from "@/components/MessageAttachment";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  BusyIcon,
  menuItem,
  menuSurface,
  primaryAction,
  quietAction,
  secondaryAction,
} from "@/components/workspace-ui";
type Workspace = {
  currentProject: {
    id: string;
    title: string;
  };
};
const hoverMenuTrigger =
  "transition-opacity duration-150 motion-reduce:transition-none [@media(hover:hover)_and_(pointer:fine)]:opacity-0 [@media(hover:hover)_and_(pointer:fine)]:pointer-events-none [@media(hover:hover)_and_(pointer:fine)]:data-[state=open]:opacity-100 [@media(hover:hover)_and_(pointer:fine)]:data-[state=open]:pointer-events-auto";
const conversationMenuReveal =
  "group-hover/conversation:opacity-100 group-hover/conversation:pointer-events-auto group-focus-within/conversation:opacity-100 group-focus-within/conversation:pointer-events-auto";
const messageMenuReveal =
  "group-hover/message:opacity-100 group-hover/message:pointer-events-auto group-focus-within/message:opacity-100 group-focus-within/message:pointer-events-auto";
const field =
  "h-10 w-full rounded-lg border border-input bg-card px-3 text-base text-foreground outline-none placeholder:text-muted-foreground/70 focus-visible:border-ring/50 sm:text-sm";
const messageDateFormatter = new Intl.DateTimeFormat(undefined, {
  month: "short",
  day: "numeric",
  hour: "numeric",
  minute: "2-digit",
});
const fullDateFormatter = new Intl.DateTimeFormat(undefined, {
  dateStyle: "full",
  timeStyle: "short",
});
function date(value: string) {
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime())
    ? ""
    : messageDateFormatter.format(parsed);
}
function fullDate(value: string): string | undefined {
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime())
    ? undefined
    : fullDateFormatter.format(parsed);
}
function Person({ name, url }: { name: string; url?: string | null }) {
  return (
    <Avatar className="h-8 w-8 shrink-0 border border-border/70">
      <AvatarImage src={url ?? undefined} alt="" className="object-cover" />
      <AvatarFallback className="bg-surface-3 text-[10px] font-medium text-brand-secondary-highlight dark:text-secondary">
        {name
          .trim()
          .split(/\s+/)
          .slice(0, 2)
          .map((v) => v[0])
          .join("") || "?"}
      </AvatarFallback>
    </Avatar>
  );
}
export default function Messaging() {
  const { projectId } = useParams();
  const { user } = useAuth();
  const { currentProject } = useOutletContext<Workspace>();
  if (!projectId || projectId !== currentProject.id || !user?.userId)
    return (
      <p className="text-sm text-muted-foreground">
        Select a project to open Messaging.
      </p>
    );
  return (
    <MessagingWorkspace
      key={`${projectId}:${user.userId}`}
      projectId={projectId}
      projectTitle={currentProject.title}
      userId={user.userId}
    />
  );
}
function MessagingWorkspace({
  projectId,
  projectTitle,
  userId,
}: {
  projectId: string;
  projectTitle: string;
  userId: string;
}) {
  const [memory] = useState(() => createMessagingMemory(userId, projectId));
  useEffect(() => {
    const timer = window.setInterval(() => memory.sweep(), 30000);
    const clear = () => memory.clear();
    window.addEventListener("pagehide", clear);
    return () => {
      window.clearInterval(timer);
      window.removeEventListener("pagehide", clear);
      memory.clear();
    };
  }, [memory]);
  const [params, setParams] = useSearchParams();
  const conversationId = params.get("conversationId");
  const [search, setSearch] = useState("");
  const searchInput = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("inbox");
  const [page, setPage] = useState(1);
  const [list, setList] = useState<ConversationList | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [manualRefreshing, setManualRefreshing] = useState(false);
  const [revision, setRevision] = useState(0);
  const [threadRevision, setThreadRevision] = useState(0);
  const [newOpen, setNewOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [pinningId, setPinningId] = useState<string | null>(null);
  const [pinError, setPinError] = useState("");
  const pinLock = useRef(false);
  const mounted = useRef(true);
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);
  useEffect(
    () =>
      memory.subscribe((notice) => {
        if (notice.reason === "expired") return;
        if (notice.id)
          setList((current) =>
            current
              ? {
                  ...current,
                  items: current.items.filter((item) => item.id !== notice.id),
                }
              : current,
          );
        else {
          setList(null);
          setNewOpen(false);
          setBusy(false);
        }
      }),
    [memory],
  );
  const listScope = useRef("");
  useEffect(() => {
    const timer = window.setTimeout(() => {
      setQuery(search.trim());
      setPage(1);
    }, 250);
    return () => window.clearTimeout(timer);
  }, [search]);
  useEffect(() => {
    const controller = new AbortController();
    const scope = JSON.stringify([query, filter, page]);
    if (listScope.current !== scope) {
      setList(null);
      listScope.current = scope;
    }
    setLoading(true);
    setError("");
    const version = unreadVersion(projectId, userId);
    void getConversations(projectId, query, filter, page, controller.signal)
      .then((data) => {
        if (!controller.signal.aborted) {
          setList(data);
          publishUnread(projectId, userId, data.unreadCount, version);
          if (page > 1 && data.items.length === 0 && data.totalCount > 0)
            setPage(Math.ceil(data.totalCount / 30));
          if (page > 1 && data.totalCount === 0) setPage(1);
        }
      })
      .catch((cause) => {
        if (!controller.signal.aborted) {
          if (
            isAxiosError(cause) &&
            [401, 403, 404].includes(cause.response?.status ?? 0)
          ) {
            memory.deny();
            setList(null);
          }
          setError(
            messagingError(
              cause,
              "Conversations could not be refreshed. Your current view has been kept.",
            ),
          );
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setLoading(false);
          setManualRefreshing(false);
        }
      });
    return () => controller.abort();
  }, [projectId, userId, query, filter, page, revision]);
  // Quietly revalidate while visible; preserve the mounted composer and current rows.
  useEffect(() => {
    function refresh() {
      memory.sweep();
      if (document.visibilityState === "visible" && !busy && !newOpen) {
        setRevision((v) => v + 1);
        setThreadRevision((v) => v + 1);
      }
    }
    const timer = window.setInterval(refresh, 15000);
    window.addEventListener("focus", refresh);
    window.addEventListener("pageshow", refresh);
    document.addEventListener("visibilitychange", refresh);
    return () => {
      window.clearInterval(timer);
      window.removeEventListener("focus", refresh);
      window.removeEventListener("pageshow", refresh);
      document.removeEventListener("visibilitychange", refresh);
    };
  }, [busy, newOpen, memory]);
  function openConversation(id: string | null) {
    if (busy) return;
    setParams((current) => {
      const next = new URLSearchParams(current);
      if (id) next.set("conversationId", id);
      else next.delete("conversationId");
      return next;
    });
  }
  async function togglePin(id: string, pinned: boolean) {
    if (busy || pinLock.current) return;
    pinLock.current = true;
    setPinningId(id);
    setBusy(true);
    setPinError("");
    try {
      await pinConversation(projectId, id, pinned);
      if (!mounted.current) return;
      memory.patch(id, (detail) => ({ ...detail, isPinned: pinned }));
      setList((current) =>
        current
          ? {
              ...current,
              items: current.items.map((item) =>
                item.id === id ? { ...item, isPinned: pinned } : item,
              ),
            }
          : current,
      );
      // Re-fetch page one: global pinned-first ordering must happen BEFORE pagination.
      setPage(1);
      setRevision((value) => value + 1);
      setThreadRevision((value) => value + 1);
    } catch (cause) {
      if (mounted.current) {
        if (
          isAxiosError(cause) &&
          [401, 403, 404].includes(cause.response?.status ?? 0)
        )
          memory.deny(cause.response?.status === 401 ? undefined : id);
        setPinError(
          messagingError(
            cause,
            "The conversation pin could not be updated. Please try again.",
          ),
        );
      }
    } finally {
      pinLock.current = false;
      if (mounted.current) {
        setPinningId(null);
        setBusy(false);
      }
    }
  }
  async function archiveFromList(conversation: {
    id: string;
    isArchived: boolean;
  }) {
    if (pinLock.current || busy) return;
    pinLock.current = true;
    setBusy(true);
    setPinError("");
    try {
      await archiveConversation(
        projectId,
        conversation.id,
        !conversation.isArchived,
      );
      if (mounted.current) {
        memory.patch(conversation.id, (detail) => ({
          ...detail,
          isArchived: !conversation.isArchived,
        }));
        setPage(1);
        invalidateUnread(projectId, userId);
        setRevision((v) => v + 1);
        setThreadRevision((v) => v + 1);
      }
    } catch (cause) {
      if (mounted.current) {
        if (
          isAxiosError(cause) &&
          [401, 403, 404].includes(cause.response?.status ?? 0)
        )
          memory.deny(
            cause.response?.status === 401 ? undefined : conversation.id,
          );
        setPinError(
          messagingError(cause, "The conversation could not be updated."),
        );
      }
    } finally {
      pinLock.current = false;
      if (mounted.current) setBusy(false);
    }
  }
  const changed = useCallback(() => {
    invalidateUnread(projectId, userId);
    setRevision((v) => v + 1);
  }, [projectId, userId]);
  return (
    <div className="min-w-0 pb-5">
      <header className="mb-5 flex flex-wrap items-start justify-between gap-4 border-b border-border/70 pb-5">
        <div className="min-w-0">
          <p className="truncate text-[11px] text-muted-foreground">
            {projectTitle}
          </p>
          <h1 className="mt-2 flex items-center gap-2.5 text-2xl font-medium tracking-[-0.03em]">
            <MailIcon
              size={22}
              aria-hidden="true"
              className="text-brand-secondary-highlight dark:text-secondary"
            />
            Messaging
          </h1>
          <p className="mt-2 text-xs leading-6 text-muted-foreground">
            Project updates, decisions and conversations with your team.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label="Refresh messages"
            title="Refresh messages"
            aria-busy={manualRefreshing || (loading && !list)}
            disabled={busy || manualRefreshing || (loading && !list)}
            onClick={() => {
              setManualRefreshing(true);
              setRevision((v) => v + 1);
              setThreadRevision((v) => v + 1);
            }}
            className={`${secondaryAction} h-10 w-10 px-0`}
          >
            {loading && (manualRefreshing || !list) ? (
              <BusyIcon />
            ) : (
              <RefreshCwIcon size={14} aria-hidden="true" />
            )}
          </button>
          <button
            type="button"
            disabled={busy}
            onClick={() => setNewOpen(true)}
            className={`${primaryAction} min-h-10 px-4`}
          >
            <PlusIcon size={14} className="text-inherit" />
            New message
          </button>
        </div>
      </header>
      {pinError && (
        <p
          role="alert"
          className="mb-3 text-xs leading-6 text-status-overdue-foreground"
        >
          {pinError}
        </p>
      )}
      <div className="grid min-w-0 items-stretch overflow-hidden rounded-xl border border-border/80 bg-card lg:h-[clamp(560px,calc(100dvh-var(--workspace-header-height,64px)-180px),900px)] lg:min-h-0 lg:grid-cols-[300px_minmax(0,1fr)] xl:grid-cols-[340px_minmax(0,1fr)]">
        <section
          aria-label="Conversations"
          className={`${conversationId ? "hidden lg:flex" : "flex"} min-h-0 min-w-0 flex-col lg:border-r lg:border-border/70`}
        >
          <div className="shrink-0 border-b border-border/70 p-4">
            <div className="relative">
              <SearchIcon
                size={14}
                aria-hidden="true"
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              />
              <input
                ref={searchInput}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                maxLength={100}
                aria-label="Search conversations"
                placeholder="Search messages"
                className={`${field} pl-9 pr-9`}
              />
              {search && (
                <button
                  type="button"
                  aria-label="Clear conversation search"
                  title="Clear search"
                  onClick={() => {
                    setSearch("");
                    setQuery("");
                    setPage(1);
                    searchInput.current?.focus();
                  }}
                  className="absolute right-1 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground transition-opacity hover:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/35"
                >
                  <XIcon size={12} aria-hidden="true" />
                </button>
              )}
            </div>
            <div
              aria-label="Conversation filters"
              className="mt-3 flex gap-1 rounded-lg bg-surface-2 p-1"
            >
              {[
                { value: "inbox", label: "Inbox", icon: InboxIcon },
                { value: "unread", label: "Unread", icon: MailIcon },
                { value: "archived", label: "Archived", icon: ArchiveIcon },
              ].map(({ value, label, icon: Icon }) => (
                <button
                  key={value}
                  type="button"
                  aria-pressed={filter === value}
                  disabled={busy}
                  onClick={() => {
                    setFilter(value);
                    setPage(1);
                  }}
                  className={`flex min-h-10 flex-1 items-center justify-center gap-1.5 rounded-md px-1 text-[11px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/35 ${filter === value ? "bg-card font-medium text-brand-secondary-highlight dark:text-secondary" : "text-muted-foreground hover:text-foreground"}`}
                >
                  <Icon size={12} aria-hidden="true" />
                  {label}
                </button>
              ))}
            </div>
            <p
              aria-live="polite"
              className="mt-3 text-[10px] text-muted-foreground"
            >
              {list
                ? `${list.unreadCount.toLocaleString()} unread ${list.unreadCount === 1 ? "message" : "messages"}`
                : "Project conversations"}
            </p>
          </div>
          <div className="max-h-[65dvh] min-h-64 overflow-y-auto lg:max-h-none lg:min-h-0 lg:flex-1">
            {error && (
              <div role="alert" className="px-4 py-7">
                <p className="text-xs leading-6 text-muted-foreground">
                  {error}
                </p>
                <button
                  type="button"
                  onClick={changed}
                  className={`${quietAction} mt-2`}
                >
                  <RefreshCwIcon size={13} />
                  Try again
                </button>
              </div>
            )}
            {loading && !list ? (
              <div
                role="status"
                className="flex min-h-48 items-center justify-center gap-2 text-xs text-muted-foreground"
              >
                <BusyIcon />
                Loading conversations…
              </div>
            ) : list?.items.length ? (
              list.items.map((item, index) => (
                <Fragment key={item.id}>
                  {index === 0 && item.isPinned && (
                    <div className="flex items-center gap-2 px-4 pb-2 pt-4 text-[10px] font-medium uppercase tracking-[0.08em] text-muted-foreground">
                      <PinIcon size={11} aria-hidden="true" />
                      Pinned
                    </div>
                  )}
                  {!item.isPinned &&
                    index > 0 &&
                    list.items[index - 1].isPinned && (
                      <div
                        className="flex items-center gap-3 bg-card px-4 py-3"
                        role="separator"
                        aria-label="Other conversations"
                      >
                        <span className="h-px flex-1 bg-border/65" />
                        <span className="shrink-0 text-[10px] font-medium tracking-[0.02em] text-muted-foreground">
                          Other conversations
                        </span>
                        <span className="h-px flex-1 bg-border/65" />
                      </div>
                    )}
                  <div
                    className={`group/conversation relative border-b border-border/60 ${conversationId === item.id ? "bg-brand-secondary-highlight/[0.085] dark:bg-secondary/[0.10]" : ""}`}
                  >
                    {conversationId === item.id && (
                      <span
                        aria-hidden="true"
                        className="pointer-events-none absolute bottom-3 left-0 top-3 w-[3px] rounded-r-full bg-brand-secondary-highlight dark:bg-secondary"
                      />
                    )}
                    <button
                      type="button"
                      aria-current={
                        conversationId === item.id ? "true" : undefined
                      }
                      disabled={busy}
                      onClick={() => openConversation(item.id)}
                      className={`block w-full py-4 pl-4 pr-12 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring/35 ${conversationId === item.id ? "" : "hover:bg-surface-2/45"}`}
                    >
                      <div className="flex items-center gap-2">
                        {item.isPinned && (
                          <PinIcon
                            size={12}
                            aria-label="Pinned conversation"
                            className="shrink-0 text-brand-secondary-highlight dark:text-secondary"
                          />
                        )}
                        <span
                          title={item.subject}
                          className={`min-w-0 flex-1 truncate text-xs ${conversationId === item.id ? "font-semibold text-brand-secondary-highlight dark:text-secondary" : item.unreadCount > 0 ? "font-semibold" : "font-medium"}`}
                        >
                          {item.subject}
                        </span>
                        {item.unreadCount > 0 && (
                          <>
                            <span
                              aria-hidden="true"
                              title={`${item.unreadCount.toLocaleString()} unread ${item.unreadCount === 1 ? "message" : "messages"}`}
                              className="inline-flex min-w-5 shrink-0 items-center justify-center rounded-md bg-brand-secondary-highlight px-1.5 py-0.5 text-[10px] font-semibold tabular-nums text-white dark:bg-secondary dark:text-background"
                            >
                              {item.unreadCount.toLocaleString()}
                            </span>
                            <span className="sr-only">
                              {item.unreadCount.toLocaleString()} unread{" "}
                              {item.unreadCount === 1 ? "message" : "messages"}
                            </span>
                          </>
                        )}
                      </div>
                      <div className="mt-2 flex items-center gap-1.5 text-[10px] text-muted-foreground">
                        {item.isProjectWide ? (
                          <UsersIcon size={11} />
                        ) : (
                          <LockKeyholeIcon size={11} />
                        )}
                        {item.isProjectWide
                          ? "Everyone on this project"
                          : "Selected recipients"}
                      </div>
                      <p className="mt-2 truncate text-xs leading-5 text-muted-foreground">
                        {item.preview ||
                          (item.hasAttachments
                            ? "Attachment"
                            : "No message text")}
                      </p>
                      <div className="mt-2 flex min-w-0 items-center gap-2 text-[10px] text-muted-foreground">
                        <time
                          dateTime={item.updatedAt}
                          title={fullDate(item.updatedAt)}
                          className="truncate"
                        >
                          {date(item.updatedAt)}
                        </time>
                        {item.hasAttachments && (
                          <span
                            className="inline-flex shrink-0 items-center"
                            title="Contains attachments"
                          >
                            <PaperclipIcon size={12} aria-hidden="true" />
                            <span className="sr-only">
                              Contains attachments
                            </span>
                          </span>
                        )}
                      </div>
                    </button>
                    <div className="absolute bottom-3 right-2 top-3 flex w-8 flex-col items-center gap-1">
                      <button
                        type="button"
                        disabled={busy || !!pinningId}
                        aria-label={`${item.isPinned ? "Unpin" : "Pin"} conversation: ${item.subject}`}
                        aria-pressed={Boolean(item.isPinned)}
                        title={
                          item.isPinned
                            ? "Unpin conversation for you"
                            : "Pin conversation for you"
                        }
                        onClick={() => void togglePin(item.id, !item.isPinned)}
                        className={`${quietAction} h-8 min-h-8 w-8 shrink-0 px-0 ${item.isPinned ? "text-brand-secondary-highlight dark:text-secondary" : "text-muted-foreground"}`}
                      >
                        {pinningId === item.id ? (
                          <BusyIcon />
                        ) : item.isPinned ? (
                          <PinOffIcon size={14} aria-hidden="true" />
                        ) : (
                          <PinIcon size={14} aria-hidden="true" />
                        )}
                      </button>
                      <DropdownMenu modal={false}>
                        <DropdownMenuTrigger asChild>
                          <button
                            type="button"
                            disabled={busy}
                            aria-label={`More actions for ${item.subject}`}
                            className={`${quietAction} ${hoverMenuTrigger} ${conversationMenuReveal} h-8 min-h-8 w-8 px-0`}
                          >
                            <EllipsisVerticalIcon
                              size={15}
                              aria-hidden="true"
                            />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="end"
                          sideOffset={6}
                          collisionPadding={12}
                          className={`${menuSurface} w-48`}
                        >
                          <DropdownMenuItem
                            className={menuItem}
                            onSelect={() => openConversation(item.id)}
                          >
                            <MailIcon size={13} />
                            Open conversation
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className={menuItem}
                            onSelect={() =>
                              void togglePin(item.id, !item.isPinned)
                            }
                          >
                            <PinIcon size={13} />
                            {item.isPinned
                              ? "Unpin conversation"
                              : "Pin conversation"}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className={menuItem}
                            onSelect={() => void archiveFromList(item)}
                          >
                            <ArchiveIcon size={13} />
                            {item.isArchived
                              ? "Restore to inbox"
                              : "Archive for me"}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </Fragment>
              ))
            ) : !error ? (
              <div className="px-5 py-12 text-center">
                <MessageSquareIcon
                  size={24}
                  aria-hidden="true"
                  className="mx-auto text-muted-foreground/60"
                />
                <p className="mt-4 text-sm font-medium">
                  {query
                    ? "No matching conversations"
                    : filter === "unread"
                      ? "You’re all caught up"
                      : filter === "archived"
                        ? "No archived conversations"
                        : "Start a conversation"}
                </p>
                <p className="mt-2 text-xs leading-6 text-muted-foreground">
                  {query
                    ? "Try another subject or a word from the messages."
                    : filter === "unread"
                      ? "New unread messages will appear here."
                      : filter === "archived"
                        ? "Conversations you archive will appear here. You can restore them to your inbox anytime."
                        : "Use New message to reach your project team."}
                </p>
                {(query || filter !== "inbox") && (
                  <button
                    type="button"
                    onClick={() => {
                      if (query) {
                        setSearch("");
                        setQuery("");
                        searchInput.current?.focus();
                      } else setFilter("inbox");
                      setPage(1);
                    }}
                    className={`${quietAction} mt-4`}
                  >
                    {query ? "Clear search" : "Back to inbox"}
                  </button>
                )}
              </div>
            ) : null}
          </div>
          {list && list.totalCount > 30 && (
            <div className="flex shrink-0 items-center justify-between border-t border-border/70 p-3">
              <button
                type="button"
                disabled={page <= 1 || manualRefreshing || busy}
                onClick={() => setPage((v) => v - 1)}
                className={quietAction}
              >
                Previous
              </button>
              <span className="text-[10px] text-muted-foreground">
                {page} / {Math.ceil(list.totalCount / 30)}
              </span>
              <button
                type="button"
                disabled={
                  page * 30 >= list.totalCount || manualRefreshing || busy
                }
                onClick={() => setPage((v) => v + 1)}
                className={quietAction}
              >
                Next
              </button>
            </div>
          )}
        </section>
        <section
          aria-label="Open conversation"
          className={`${conversationId ? "flex" : "hidden lg:flex"} min-h-0 min-w-0 flex-col`}
        >
          {conversationId ? (
            <ConversationThread
              key={conversationId}
              memory={memory}
              projectId={projectId}
              id={conversationId}
              userId={userId}
              revision={threadRevision}
              onBack={() => openConversation(null)}
              onChanged={changed}
              onBusy={setBusy}
              pinning={!!pinningId}
              onPin={(pinned) => void togglePin(conversationId, pinned)}
            />
          ) : (
            <div className="flex min-h-[480px] flex-col items-center justify-center px-8 text-center">
              <MailIcon
                size={30}
                aria-hidden="true"
                className="text-muted-foreground/50"
              />
              <h2 className="mt-5 text-base font-medium">
                Your project conversations
              </h2>
              <p className="mt-2 max-w-xs text-xs leading-6 text-muted-foreground">
                Select a conversation or start a new message with everyone or
                specific members of the team.
              </p>
            </div>
          )}
        </section>
      </div>
      {newOpen && (
        <NewConversation
          projectId={projectId}
          userId={userId}
          onDenied={() => memory.deny()}
          onClose={() => setNewOpen(false)}
          onSent={(id) => {
            setNewOpen(false);
            setFilter("inbox");
            setPage(1);
            changed();
            openConversation(id);
          }}
        />
      )}
    </div>
  );
}
function ConversationThread({
  memory,
  projectId,
  id,
  userId,
  revision,
  onBack,
  onChanged,
  onBusy,
  pinning,
  onPin,
}: {
  projectId: string;
  id: string;
  userId: string;
  revision: number;
  onBack: () => void;
  onChanged: () => void;
  onBusy: (busy: boolean) => void;
  pinning: boolean;
  onPin: (pinned: boolean) => void;
  memory: MessagingMemory;
}) {
  const [cached, setCached] = useState(() =>
    memory.matches(userId, projectId) ? memory.read(id) : null,
  );
  useEffect(() => setCached(null), []);
  const [detail, setDetail] = useState<ConversationDetail | null>(
    cached?.detail ?? null,
  );
  const detailRef = useRef(detail);
  detailRef.current = detail;
  const [accessReady, setAccessReady] = useState(false);
  const access = useRef(false);
  const restoreScroll = useRef(cached?.scrollTop);
  const pending = useRef<AbortController | null>(null);
  useEffect(
    () =>
      memory.subscribe((notice) => {
        if (notice.id && notice.id !== id) return;
        access.current = false;
        detailRef.current = null;
        setCached(null);
        setAccessReady(false);
        setDetail(null);
        setAction(null);
        setActionBusy(false);
        setBusy(false);
        setArchiveBusy(false);
        setLoadingOlder(false);
        setForwardedId(null);
        pending.current?.abort();
        olderRequest.current?.abort();
        setError(
          notice.reason === "expired"
            ? "Refresh this conversation to continue."
            : "This conversation is no longer available.",
        );
        onBusy(false);
      }),
    [memory, id],
  );
  const [error, setError] = useState("");
  const [reload, setReload] = useState(0);
  const [loadingOlder, setLoadingOlder] = useState(false);
  const [busy, setBusy] = useState(false);
  const [archiveBusy, setArchiveBusy] = useState(false);
  const [action, setAction] = useState<{
    kind: "edit" | "delete" | "forward";
    message: ConversationMessage;
  } | null>(null);
  const [actionBusy, setActionBusy] = useState(false);
  const [forwardedId, setForwardedId] = useState<string | null>(null);
  const [clock, setClock] = useState(Date.now);
  useEffect(() => {
    const timer = window.setInterval(() => setClock(Date.now()), 10000);
    return () => window.clearInterval(timer);
  }, []);
  const [readWarning, setReadWarning] = useState("");
  const mounted = useRef(true);
  const olderRequest = useRef<AbortController | null>(null);
  const olderLock = useRef(false);
  const readPosition = useRef(0);
  const reading = useRef(false);
  const wantedRead = useRef(0);
  const forceScroll = useRef(cached?.scrollTop === undefined);
  const archiveLock = useRef(false);
  const list = useRef<HTMLDivElement>(null);
  const refreshScroll = useRef(cached?.scrollTop === undefined);
  const loadedFloor = useRef<number | undefined>(undefined);
  loadedFloor.current = detail?.messages[0]?.sequence;
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
      olderRequest.current?.abort();
      pending.current?.abort();
      onBusy(false);
    };
  }, []);
  useEffect(() => {
    if (restoreScroll.current !== undefined && list.current) {
      list.current.scrollTop = restoreScroll.current;
      restoreScroll.current = undefined;
    }
  }, [detail]);
  async function read(through: number) {
    if (
      !access.current ||
      through <= readPosition.current ||
      document.visibilityState !== "visible"
    )
      return;
    wantedRead.current = Math.max(wantedRead.current, through);
    if (reading.current) return;
    reading.current = true;
    try {
      while (mounted.current && wantedRead.current > readPosition.current) {
        const target = wantedRead.current;
        await markRead(projectId, id, target);
        if (!mounted.current) return;
        readPosition.current = Math.max(readPosition.current, target);
        setReadWarning("");
        onChanged();
      }
    } catch (cause) {
      if (
        isAxiosError(cause) &&
        [401, 403, 404].includes(cause.response?.status ?? 0)
      )
        memory.deny(cause.response?.status === 401 ? undefined : id);
      if (mounted.current)
        setReadWarning("Read status could not be saved. Refresh to retry.");
    } finally {
      reading.current = false;
    }
  }
  useEffect(() => {
    const controller = new AbortController();
    pending.current = controller;
    const token = memory.token();
    setError("");
    void (async () => {
      const latest = await getConversation(
        projectId,
        id,
        undefined,
        controller.signal,
      );
      let batch = latest;
      const messages = [...latest.messages];
      // Refresh already displayed history too, so edits/deletions beyond the latest
      // 50 messages are not left visible indefinitely in an open thread.
      const floor = loadedFloor.current;
      while (
        floor !== undefined &&
        batch.hasOlder &&
        (batch.messages[0]?.sequence ?? 0) > floor
      ) {
        const before = batch.messages[0]?.sequence;
        batch = await getConversation(projectId, id, before, controller.signal);
        if (
          !batch.messages.length ||
          (batch.messages[0]?.sequence ?? 0) >= (before ?? 0)
        )
          break;
        messages.unshift(...batch.messages);
      }
      return { ...latest, messages, hasOlder: batch.hasOlder };
    })()
      .then((data) => {
        if (controller.signal.aborted || !memory.valid(token)) return;
        access.current = true;
        setAccessReady(true);
        const nearBottom =
          forceScroll.current ||
          !list.current ||
          list.current.scrollHeight -
            list.current.scrollTop -
            list.current.clientHeight <
            100;
        refreshScroll.current = nearBottom;
        forceScroll.current = false;
        const current = detailRef.current;
        const lastOld = current?.messages.at(-1)?.sequence ?? 0;
        let next = data;
        if (current && (data.messages[0]?.sequence ?? 0) <= lastOld + 1) {
          const combined = new Map(current.messages.map((m) => [m.id, m]));
          for (const m of data.messages)
            if (
              !combined.has(m.id) ||
              (combined.get(m.id)?.version ?? 0) <= m.version
            )
              combined.set(m.id, m);
          next = {
            ...data,
            messages: [...combined.values()].sort(
              (a, b) => a.sequence - b.sequence,
            ),
          };
        }
        memory.write(id, next, token);
        detailRef.current = next;
        setDetail(next);
        // Only mark displayed messages as read; do not consume a newer unseen server sequence.
        if (nearBottom) void read(data.messages.at(-1)?.sequence ?? 0);
      })
      .catch((cause) => {
        if (!controller.signal.aborted && memory.valid(token)) {
          if (
            isAxiosError(cause) &&
            [401, 403, 404].includes(cause.response?.status ?? 0)
          )
            memory.deny(cause.response?.status === 401 ? undefined : id);
          setError(
            messagingError(
              cause,
              access.current
                ? "The conversation could not be refreshed. Your draft and current view have been kept."
                : "Access could not be verified. The saved view is read-only; refresh to retry.",
            ),
          );
        }
      });
    return () => controller.abort();
    // read() uses this keyed component's stable project/conversation scope.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId, id, revision, reload, memory]);
  useEffect(() => {
    if (refreshScroll.current && list.current)
      list.current.scrollTop = list.current.scrollHeight;
  }, [detail?.messages.length]);
  async function older() {
    if (!access.current || !detail?.hasOlder || olderLock.current) return;
    olderLock.current = true;
    setLoadingOlder(true);
    setError("");
    const controller = new AbortController();
    olderRequest.current = controller;
    const height = list.current?.scrollHeight ?? 0;
    const token = memory.token();
    try {
      const data = await getConversation(
        projectId,
        id,
        detail.messages[0]?.sequence,
        controller.signal,
      );
      if (!mounted.current || controller.signal.aborted || !memory.valid(token))
        return;
      refreshScroll.current = false;
      const current = detailRef.current;
      if (!current) return;
      const combined = new Map(current.messages.map((m) => [m.id, m]));
      for (const m of data.messages)
        if (
          !combined.has(m.id) ||
          (combined.get(m.id)?.version ?? 0) <= m.version
        )
          combined.set(m.id, m);
      const next = {
        ...current,
        hasOlder: data.hasOlder,
        messages: [...combined.values()].sort(
          (a, b) => a.sequence - b.sequence,
        ),
      };
      memory.write(id, next, token);
      detailRef.current = next;
      setDetail(next);
      requestAnimationFrame(() => {
        if (mounted.current && list.current)
          list.current.scrollTop += list.current.scrollHeight - height;
      });
    } catch (cause) {
      if (mounted.current && !controller.signal.aborted) {
        if (
          isAxiosError(cause) &&
          [401, 403, 404].includes(cause.response?.status ?? 0)
        )
          memory.deny(cause.response?.status === 401 ? undefined : id);
        setError(messagingError(cause, "Older messages could not be loaded."));
      }
    } finally {
      olderLock.current = false;
      if (mounted.current) setLoadingOlder(false);
    }
  }
  async function archive() {
    if (
      !access.current ||
      !detail ||
      busy ||
      action ||
      pinning ||
      archiveLock.current
    )
      return;
    archiveLock.current = true;
    setArchiveBusy(true);
    onBusy(true);
    setError("");
    try {
      await archiveConversation(projectId, id, !detail.isArchived);
      if (mounted.current) {
        memory.patch(id, (current) => ({
          ...current,
          isArchived: !detail.isArchived,
        }));
        setDetail((current) =>
          current ? { ...current, isArchived: !detail.isArchived } : current,
        );
        onChanged();
      }
    } catch (cause) {
      if (mounted.current) {
        if (
          isAxiosError(cause) &&
          [401, 403, 404].includes(cause.response?.status ?? 0)
        )
          memory.deny(cause.response?.status === 401 ? undefined : id);
        setError(
          messagingError(cause, "The conversation could not be archived."),
        );
      }
    } finally {
      archiveLock.current = false;
      if (mounted.current) {
        setArchiveBusy(false);
        onBusy(false);
      }
    }
  }
  function openAction(
    kind: "edit" | "delete" | "forward",
    message: ConversationMessage,
  ) {
    if (!access.current || busy || archiveBusy || pinning || action) return;
    setAction({ kind, message });
    onBusy(true);
  }
  function closeAction() {
    if (!actionBusy) {
      setAction(null);
      onBusy(false);
    }
  }
  const onAttachmentDenied = useCallback(
    (all: boolean) => memory.deny(all ? undefined : id),
    [memory, id],
  );
  if (!detail)
    return (
      <div className="min-h-72 p-5 lg:min-h-[480px]">
        <button
          type="button"
          onClick={onBack}
          className={`${quietAction} mb-5 lg:hidden`}
        >
          <ArrowLeftIcon size={14} />
          Conversations
        </button>
        {error ? (
          <div role="alert">
            <p className="text-xs leading-6 text-muted-foreground">{error}</p>
            <button
              type="button"
              onClick={() => setReload((v) => v + 1)}
              className={`${quietAction} mt-2`}
            >
              <RefreshCwIcon size={13} />
              Try again
            </button>
          </div>
        ) : (
          <div
            role="status"
            className="flex min-h-64 items-center justify-center gap-2 text-xs text-muted-foreground"
          >
            <BusyIcon />
            Loading conversation…
          </div>
        )}
      </div>
    );
  return (
    <div className="flex h-full min-h-0 min-w-0 flex-col">
      <header className="shrink-0 border-b border-border/70 px-4 py-4 sm:px-5">
        <div className="flex items-start gap-2">
          <button
            type="button"
            aria-label="Back to conversations"
            disabled={busy || archiveBusy || pinning || !!action}
            onClick={onBack}
            className={`${quietAction} h-8 w-8 shrink-0 px-0 lg:hidden`}
          >
            <ArrowLeftIcon size={15} />
          </button>
          <div className="min-w-0 flex-1">
            <h2 className="break-words text-base font-medium leading-6">
              {detail.subject}
            </h2>
            <p className="mt-2 flex items-center gap-1.5 text-[10px] text-muted-foreground">
              {detail.isProjectWide ? (
                <UsersIcon size={12} />
              ) : (
                <LockKeyholeIcon size={12} />
              )}
              {detail.isProjectWide
                ? "Everyone on this project"
                : "Private · selected recipients"}
            </p>
          </div>
          <button
            type="button"
            aria-label={
              detail.isPinned ? "Unpin conversation" : "Pin conversation"
            }
            title={
              detail.isPinned
                ? "Unpin conversation for you"
                : "Pin conversation for you"
            }
            aria-pressed={Boolean(detail.isPinned)}
            disabled={
              !accessReady || busy || archiveBusy || pinning || !!action
            }
            onClick={() => onPin(!detail.isPinned)}
            className={`${quietAction} h-8 w-8 shrink-0 px-0 ${detail.isPinned ? "text-brand-secondary-highlight dark:text-secondary" : ""}`}
          >
            {pinning ? (
              <BusyIcon />
            ) : detail.isPinned ? (
              <PinOffIcon size={15} />
            ) : (
              <PinIcon size={15} />
            )}
          </button>
          <button
            type="button"
            aria-label={
              detail.isArchived
                ? "Restore conversation"
                : "Archive conversation"
            }
            title={detail.isArchived ? "Restore to inbox" : "Archive for you"}
            disabled={
              !accessReady || busy || archiveBusy || pinning || !!action
            }
            onClick={() => void archive()}
            className={`${quietAction} h-8 w-8 shrink-0 px-0`}
          >
            {archiveBusy ? <BusyIcon /> : <ArchiveIcon size={15} />}
          </button>
        </div>
        <details className="mt-3 text-[11px] text-muted-foreground">
          <summary className="cursor-pointer">
            {detail.participants.length}{" "}
            {detail.participants.length === 1 ? "participant" : "participants"}
          </summary>
          <ul className="mt-3 flex max-h-40 flex-wrap gap-2 overflow-y-auto">
            {detail.participants.map((p) => (
              <li
                key={p.userId}
                className="flex items-center gap-2 rounded-lg border border-border/60 px-2 py-1.5"
              >
                <Person name={p.name} url={p.avatarUrl} />
                <span className="break-words">
                  {p.name}
                  {p.userId === userId ? " (you)" : ""}
                </span>
              </li>
            ))}
          </ul>
        </details>
        {accessReady && detail.taskId && (
          <Link
            to={`/projects/${projectId}?taskId=${encodeURIComponent(detail.taskId)}`}
            className="mt-3 inline-block text-xs text-brand-secondary-highlight dark:text-secondary"
          >
            Task: {detail.taskTitle || "View linked task"}
          </Link>
        )}
      </header>
      {!accessReady && !error && (
        <p
          role="status"
          className="px-5 pt-3 text-[10px] text-muted-foreground"
        >
          Checking for updates…
        </p>
      )}
      {error && (
        <div
          role="alert"
          className="px-5 pt-3 text-xs text-status-overdue-foreground"
        >
          {error}
          <button
            type="button"
            onClick={() => setReload((v) => v + 1)}
            className={`${quietAction} ml-1`}
          >
            Refresh
          </button>
        </div>
      )}
      <div
        ref={list}
        className="max-h-[55dvh] min-h-64 overflow-y-auto overscroll-contain px-4 py-3 sm:px-5 lg:max-h-none lg:min-h-0 lg:flex-1"
        onScroll={() => {
          const el = list.current;
          if (el) memory.scroll(id, el.scrollTop);
          if (el && el.scrollHeight - el.scrollTop - el.clientHeight < 50)
            void read(detail.messages.at(-1)?.sequence ?? 0);
        }}
      >
        {detail.hasOlder && (
          <div className="py-2 text-center">
            <button
              type="button"
              disabled={!accessReady || loadingOlder}
              onClick={() => void older()}
              className={quietAction}
            >
              {loadingOlder && <BusyIcon />}Load earlier messages
            </button>
          </div>
        )}
        {detail.messages.map((message) => (
          <article
            key={message.id}
            className="group/message flex min-w-0 gap-3 border-b border-border/60 py-4 last:border-b-0"
          >
            <Person name={message.senderName} url={message.avatarUrl} />
            <div className="min-w-0 flex-1">
              <div className="flex items-start gap-2">
                <div className="flex min-w-0 flex-1 flex-wrap items-center gap-x-2 gap-y-1">
                  <p className="max-w-full break-words text-xs font-medium">
                    {message.senderName}
                  </p>
                  {message.senderId === userId && (
                    <span className="text-[10px] text-brand-secondary-highlight dark:text-secondary">
                      You
                    </span>
                  )}
                  <time
                    dateTime={message.createdAt}
                    title={fullDate(message.createdAt)}
                    className="text-[10px] text-muted-foreground"
                  >
                    {date(message.createdAt)}
                  </time>
                  {message.editedAt && !message.deletedAt && (
                    <span
                      title={`Edited ${date(message.editedAt)}`}
                      className="text-[10px] text-muted-foreground"
                    >
                      Edited
                    </span>
                  )}
                </div>
                {!message.deletedAt && (
                  <DropdownMenu modal={false}>
                    <DropdownMenuTrigger asChild>
                      <button
                        type="button"
                        aria-label={`Message actions for ${message.senderName}`}
                        disabled={
                          !accessReady ||
                          busy ||
                          archiveBusy ||
                          pinning ||
                          !!action
                        }
                        className={`${quietAction} ${hoverMenuTrigger} ${messageMenuReveal} h-8 min-h-8 w-8 shrink-0 px-0`}
                      >
                        <EllipsisVerticalIcon size={15} aria-hidden="true" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="end"
                      sideOffset={6}
                      collisionPadding={12}
                      className={`${menuSurface} w-48`}
                    >
                      <DropdownMenuItem
                        className={menuItem}
                        onSelect={() => openAction("forward", message)}
                      >
                        <ForwardIcon size={13} />
                        Forward message
                      </DropdownMenuItem>
                      {message.canEdit &&
                        clock < Date.parse(message.actionExpiresAt) && (
                          <DropdownMenuItem
                            className={menuItem}
                            onSelect={() => openAction("edit", message)}
                          >
                            <PencilIcon size={13} />
                            {message.forwardedFromName
                              ? "Edit note"
                              : "Edit message"}
                          </DropdownMenuItem>
                        )}
                      {message.canDelete &&
                        (message.canModerate ||
                          clock < Date.parse(message.actionExpiresAt)) && (
                          <DropdownMenuItem
                            className={`${menuItem} text-destructive focus:text-destructive focus:bg-destructive/[0.06]`}
                            onSelect={() => openAction("delete", message)}
                          >
                            <Trash2Icon size={13} />
                            Delete message
                          </DropdownMenuItem>
                        )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
              {message.deletedAt ? (
                <p className="mt-2 text-xs italic leading-6 text-muted-foreground">
                  This message was deleted.
                </p>
              ) : (
                <>
                  {message.forwardedFromName && (
                    <div className="mt-3 rounded-lg border border-border/60 bg-surface-2/35 px-3 py-2 text-[11px] leading-6 text-muted-foreground">
                      <span className="flex items-center gap-1.5">
                        <ForwardIcon size={12} aria-hidden="true" />
                        Forwarded message
                      </span>
                      <p className="break-words">
                        From {message.forwardedFromName}
                        {message.forwardedCreatedAt
                          ? ` · ${date(message.forwardedCreatedAt)}`
                          : ""}
                      </p>
                    </div>
                  )}
                  {message.attachments.length > 0 && (
                    <div
                      role="group"
                      aria-label="Message attachments"
                      className="mb-3 mt-3 flex min-w-0 flex-wrap gap-2"
                    >
                      {message.attachments.map((file) =>
                        accessReady ? (
                          <MessageAttachment
                            key={file.id}
                            file={file}
                            projectId={projectId}
                            conversationId={id}
                            onAccessDenied={onAttachmentDenied}
                          />
                        ) : (
                          <div
                            key={file.id}
                            className="flex min-h-14 w-[240px] min-w-0 max-w-full items-center gap-2 rounded-lg border border-border/65 bg-surface-2/35 px-3 py-2 text-muted-foreground"
                          >
                            <PaperclipIcon
                              size={17}
                              aria-hidden="true"
                              className="shrink-0"
                            />
                            <span className="min-w-0">
                              <span className="block truncate text-[11px] font-medium">
                                {file.originalFileName}
                              </span>
                              <span className="block text-[10px]">
                                Checking access…
                              </span>
                            </span>
                          </div>
                        ),
                      )}
                    </div>
                  )}
                  {message.forwardNote && (
                    <p className="mt-2 whitespace-pre-wrap break-words text-sm leading-7">
                      {message.forwardNote}
                    </p>
                  )}
                  {message.body && (
                    <p
                      className={`mt-2 whitespace-pre-wrap break-words text-sm leading-7 ${message.forwardedFromName ? "border-l-2 border-border/70 pl-3" : ""}`}
                    >
                      {message.body}
                    </p>
                  )}
                </>
              )}
            </div>
          </article>
        ))}
      </div>
      {forwardedId && (
        <p role="status" className="px-5 py-2 text-xs text-muted-foreground">
          Message forwarded.{" "}
          <Link
            className="text-brand-secondary-highlight underline dark:text-secondary"
            to={`?conversationId=${encodeURIComponent(forwardedId)}`}
          >
            Open conversation
          </Link>
        </p>
      )}
      {readWarning && (
        <p
          role="status"
          className="px-5 py-2 text-[10px] text-muted-foreground"
        >
          {readWarning}
        </p>
      )}
      <div className="max-h-[42dvh] shrink-0 overflow-y-auto border-t border-border/70 bg-surface-2/40 p-4 sm:p-5">
        <MessageComposer
          memory={memory}
          projectId={projectId}
          conversationId={id}
          disabled={!accessReady || archiveBusy || pinning || !!action}
          onBusy={(value) => {
            setBusy(value);
            onBusy(value);
          }}
          onSent={() => {
            memory.invalidate(id);
            forceScroll.current = true;
            refreshScroll.current = true;
            setReload((v) => v + 1);
            onChanged();
          }}
        />
      </div>
      {action && (
        <MessageActionDialog
          key={`${action.kind}:${action.message.id}:${action.message.version}`}
          kind={action.kind}
          message={action.message}
          projectId={projectId}
          conversationId={id}
          userId={userId}
          subject={detail.subject}
          onClose={closeAction}
          onBusy={setActionBusy}
          onDenied={onAttachmentDenied}
          onDone={(updated, forwardedId) => {
            if (!mounted.current) return;
            if (updated) memory.message(id, updated);
            else memory.invalidate(id);
            if (updated)
              setDetail((current) =>
                current
                  ? {
                      ...current,
                      messages: current.messages.map((m) =>
                        m.id === updated.id ? updated : m,
                      ),
                    }
                  : current,
              );
            setAction(null);
            setActionBusy(false);
            onBusy(false);
            setReload((v) => v + 1);
            onChanged();
            if (forwardedId) setForwardedId(forwardedId);
          }}
        />
      )}
    </div>
  );
}
function MessageActionDialog({
  kind,
  message,
  projectId,
  conversationId,
  userId,
  subject: originalSubject,
  onClose,
  onBusy,
  onDone,
  onDenied,
}: {
  kind: "edit" | "delete" | "forward";
  message: ConversationMessage;
  projectId: string;
  conversationId: string;
  userId: string;
  subject: string;
  onClose: () => void;
  onBusy: (value: boolean) => void;
  onDone: (updated?: ConversationMessage, forwardedId?: string) => void;
  onDenied?: (all: boolean) => void;
}) {
  const [body, setBody] = useState(
    message.forwardedFromName ? (message.forwardNote ?? "") : message.body,
  );
  const [note, setNote] = useState("");
  const [subject, setSubject] = useState(
    `Fwd: ${originalSubject}`.slice(0, 200),
  );
  const [everyone, setEveryone] = useState(false);
  const [recipients, setRecipients] = useState<string[]>([]);
  const [members, setMembers] = useState<ConversationMember[]>([]);
  const [loading, setLoading] = useState(kind === "forward");
  const [retry, setRetry] = useState(0);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const lock = useRef(false);
  const alive = useRef(true);
  const request = useRef<{
    signature: string;
    id: string;
  } | null>(null);
  useEffect(() => {
    alive.current = true;
    return () => {
      alive.current = false;
    };
  }, []);
  useEffect(() => {
    if (kind !== "forward") return;
    const controller = new AbortController();
    setLoading(true);
    setError("");
    void getMembers(projectId, controller.signal)
      .then((data) => {
        if (!controller.signal.aborted) setMembers(data);
      })
      .catch((cause) => {
        if (!controller.signal.aborted) {
          if (
            isAxiosError(cause) &&
            [401, 403, 404].includes(cause.response?.status ?? 0)
          )
            onDenied?.(cause.response?.status === 401);
          setError(messagingError(cause, "Recipients could not be loaded."));
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [projectId, kind, retry, onDenied]);
  async function submit() {
    if (lock.current) return;
    if (
      kind === "forward" &&
      (loading || !subject.trim() || (!everyone && recipients.length === 0))
    )
      return;
    lock.current = true;
    setBusy(true);
    onBusy(true);
    setError("");
    try {
      if (kind === "forward") {
        const draft = {
          version: message.version,
          subject: subject.trim(),
          isProjectWide: everyone,
          recipientIds: everyone ? [] : [...recipients].sort(),
          note: note.trim(),
        };
        const signature = JSON.stringify(draft);
        if (request.current?.signature !== signature)
          request.current = { signature, id: crypto.randomUUID() };
        const result = await forwardMessage(
          projectId,
          conversationId,
          message.id,
          { ...draft, clientRequestId: request.current.id },
        );
        if (alive.current) onDone(undefined, result.conversationId);
      } else if (kind === "edit") {
        await editMessage(
          projectId,
          conversationId,
          message.id,
          body,
          message.version,
        );
        if (alive.current)
          onDone({
            ...message,
            ...(message.forwardedFromName
              ? { forwardNote: body.trim() }
              : { body: body.trim() }),
            version: message.version + 1,
            editedAt: new Date().toISOString(),
          });
      } else {
        await deleteMessage(
          projectId,
          conversationId,
          message.id,
          message.version,
        );
        if (alive.current)
          onDone({
            ...message,
            body: "",
            attachments: [],
            forwardNote: null,
            forwardedFromName: null,
            forwardedCreatedAt: null,
            deletedAt: new Date().toISOString(),
            version: message.version + 1,
            canEdit: false,
            canDelete: false,
          });
      }
    } catch (cause) {
      if (
        alive.current &&
        isAxiosError(cause) &&
        [401, 403, 404].includes(cause.response?.status ?? 0)
      )
        onDenied?.(cause.response?.status === 401);
      if (alive.current)
        setError(
          messageActionError(
            cause,
            kind === "forward"
              ? "The message could not be forwarded. Your selections and note have been kept; retry to confirm delivery."
              : "The message could not be updated. Your changes have been kept.",
          ),
        );
    } finally {
      lock.current = false;
      if (alive.current) {
        setBusy(false);
        onBusy(false);
      }
    }
  }
  const title =
    kind === "forward"
      ? "Forward message"
      : kind === "delete"
        ? "Delete message?"
        : message.forwardedFromName
          ? "Edit your note"
          : "Edit message";
  return (
    <Dialog
      open
      onOpenChange={(value) => {
        if (!value && !lock.current) onClose();
      }}
    >
      <DialogContent className="flex max-h-[90dvh] w-[calc(100vw-24px)] flex-col gap-0 overflow-hidden rounded-xl border-border bg-card p-0 text-card-foreground sm:max-w-xl">
        <DialogHeader className="shrink-0 border-b border-border/70 px-5 py-5 pr-12 text-left">
          <DialogTitle className="text-lg font-medium">{title}</DialogTitle>
          <DialogDescription className="mt-1 text-xs leading-6">
            {kind === "delete"
              ? "The content and attachments will be hidden for everyone in this conversation. A deleted-message placeholder will remain. Previously forwarded copies remain separate."
              : kind === "edit"
                ? "You can make corrections for 15 minutes after sending. An Edited label will appear."
                : "Send this message and its attachments in a new project conversation. Recipients cannot access the original thread."}
          </DialogDescription>
        </DialogHeader>
        <div className="min-h-0 overflow-y-auto p-5">
          {error && (
            <div
              role="alert"
              className="mb-4 text-xs leading-6 text-status-overdue-foreground"
            >
              {error}
              {kind === "forward" && !busy && (
                <button
                  type="button"
                  onClick={() => setRetry((v) => v + 1)}
                  className={`${quietAction} ml-1`}
                >
                  Reload recipients
                </button>
              )}
            </div>
          )}
          {kind === "forward" && (
            <>
              <div
                className="grid grid-cols-2 gap-2"
                aria-label="Forward audience"
              >
                {[
                  { value: false, label: "Select recipients" },
                  { value: true, label: "Everyone" },
                ].map((item) => (
                  <button
                    key={item.label}
                    type="button"
                    disabled={busy}
                    aria-pressed={everyone === item.value}
                    onClick={() => setEveryone(item.value)}
                    className={`${secondaryAction} ${everyone === item.value ? "border-brand-secondary-highlight/30 bg-brand-secondary-highlight/[0.06] text-brand-secondary-highlight dark:border-secondary/30 dark:bg-secondary/[0.08] dark:text-secondary" : ""}`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
              {everyone ? (
                <p className="mt-3 text-xs leading-6 text-muted-foreground">
                  Current and future accepted project members can read this
                  forwarded conversation.
                </p>
              ) : (
                <RecipientPicker
                  members={members}
                  userId={userId}
                  value={recipients}
                  onChange={setRecipients}
                  loading={loading}
                  disabled={busy}
                />
              )}
              <label className="mt-4 block text-xs font-medium">
                Subject
                <input
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  disabled={busy}
                  maxLength={200}
                  className={`${field} mt-2`}
                />
              </label>
              <label className="mt-4 block text-xs font-medium">
                Optional note
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  disabled={busy}
                  maxLength={10000}
                  rows={3}
                  className="mt-2 w-full resize-y rounded-lg border border-input bg-card p-3 text-base font-normal outline-none focus-visible:border-ring/50 sm:text-sm"
                />
              </label>
              <div className="mt-4 rounded-lg border border-border/70 bg-surface-2/35 p-3">
                <p className="text-[11px] text-muted-foreground">
                  From {message.senderName} · {date(message.createdAt)}
                </p>
                <p className="mt-2 line-clamp-4 whitespace-pre-wrap break-words text-xs leading-6">
                  {message.forwardNote ? `${message.forwardNote}\n\n` : ""}
                  {message.body || "Attachment-only message"}
                </p>
                {message.attachments.length > 0 && (
                  <p className="mt-2 flex items-center gap-1.5 text-[11px] text-muted-foreground">
                    <PaperclipIcon size={12} />
                    {message.attachments.length}{" "}
                    {message.attachments.length === 1
                      ? "attachment"
                      : "attachments"}{" "}
                    included
                  </p>
                )}
              </div>
            </>
          )}
          {kind === "edit" && (
            <>
              <label className="block text-xs font-medium">
                {message.forwardedFromName ? "Your note" : "Message"}
                <textarea
                  autoFocus
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  disabled={busy}
                  maxLength={10000}
                  rows={7}
                  className="mt-2 w-full resize-y rounded-lg border border-input bg-card p-3 text-base font-normal outline-none focus-visible:border-ring/50 sm:text-sm"
                />
              </label>
              <p className="mt-2 text-[11px] text-muted-foreground">
                {message.forwardedFromName
                  ? "The forwarded message and its original attribution stay unchanged."
                  : "Attachments stay attached. Editing changes the text only."}
              </p>
            </>
          )}
          {kind === "delete" && (
            <p className="break-words text-xs leading-6 text-muted-foreground">
              Sent by {message.senderName} · {date(message.createdAt)}
            </p>
          )}
        </div>
        <div className="flex shrink-0 justify-end gap-2 border-t border-border/70 px-5 py-4">
          <button
            type="button"
            disabled={busy}
            onClick={onClose}
            className={secondaryAction}
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={
              busy ||
              (kind === "forward" &&
                (loading ||
                  !subject.trim() ||
                  (!everyone && recipients.length === 0))) ||
              (kind === "edit" &&
                !message.forwardedFromName &&
                !body.trim() &&
                message.attachments.length === 0)
            }
            onClick={() => void submit()}
            className={
              kind === "delete"
                ? "inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-destructive px-4 text-xs font-medium text-destructive-foreground transition-opacity hover:opacity-85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/35 disabled:pointer-events-none disabled:opacity-50"
                : primaryAction
            }
          >
            {busy ? (
              <BusyIcon />
            ) : kind === "delete" ? (
              <Trash2Icon size={13} />
            ) : kind === "forward" ? (
              <ForwardIcon size={13} />
            ) : (
              <CheckIcon size={13} />
            )}{" "}
            {kind === "delete"
              ? "Delete message"
              : kind === "forward"
                ? "Forward message"
                : "Save changes"}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
function NewConversation({
  projectId,
  userId,
  onClose,
  onSent,
  onDenied,
}: {
  projectId: string;
  userId: string;
  onClose: () => void;
  onSent: (id: string) => void;
  onDenied: () => void;
}) {
  const [members, setMembers] = useState<ConversationMember[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reload, setReload] = useState(0);
  const [subject, setSubject] = useState("");
  const [everyone, setEveryone] = useState(true);
  const [recipients, setRecipients] = useState<string[]>([]);
  const [taskId, setTaskId] = useState("");
  const [busy, setBusy] = useState(false);
  const busyRef = useRef(false);
  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError("");
    void getMembers(projectId, controller.signal)
      .then((data) => {
        if (!controller.signal.aborted) setMembers(data);
      })
      .catch((cause) => {
        if (!controller.signal.aborted) {
          if (
            isAxiosError(cause) &&
            [401, 403, 404].includes(cause.response?.status ?? 0)
          )
            onDenied();
          setError(
            messagingError(cause, "Project members could not be loaded."),
          );
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    // Task linking is optional; a failed task lookup never blocks messaging.
    void api
      .get<Task[]>(`/projects/tasks/${projectId}`, {
        withCredentials: true,
        signal: controller.signal,
      })
      .then((r) => {
        if (!controller.signal.aborted)
          setTasks(Array.isArray(r.data) ? r.data : []);
      })
      .catch(() => {});
    return () => controller.abort();
  }, [projectId, reload]);
  const audience: Omit<MessageDraft, "body" | "files"> = {
    subject,
    isProjectWide: everyone,
    recipientIds: everyone ? [] : recipients,
    taskId: taskId || undefined,
  };
  return (
    <Dialog
      open
      onOpenChange={(value) => {
        if (!value && !busyRef.current) onClose();
      }}
    >
      <DialogContent className="flex max-h-[92dvh] w-[calc(100vw-24px)] flex-col overflow-hidden rounded-xl border-border bg-card p-0 text-card-foreground shadow-none sm:max-w-2xl">
        <DialogHeader className="shrink-0 border-b border-border/70 px-5 py-5 pr-12 text-left">
          <DialogTitle className="text-lg font-medium">New message</DialogTitle>
          <DialogDescription className="text-xs leading-6">
            Choose who can read and reply to this conversation.
          </DialogDescription>
        </DialogHeader>
        <div className="min-h-0 overflow-y-auto p-5">
          {error && (
            <div
              role="alert"
              className="mb-4 text-xs leading-6 text-status-overdue-foreground"
            >
              {error}
              <button
                type="button"
                onClick={() => setReload((v) => v + 1)}
                className={`${quietAction} ml-2`}
              >
                Retry
              </button>
            </div>
          )}
          <div
            aria-label="Conversation audience"
            className="grid grid-cols-2 gap-2"
          >
            {[
              { value: true, label: "Everyone", icon: UsersIcon },
              {
                value: false,
                label: "Select recipients",
                icon: LockKeyholeIcon,
              },
            ].map(({ value, label, icon: Icon }) => (
              <button
                key={label}
                type="button"
                disabled={busy}
                aria-pressed={everyone === value}
                onClick={() => setEveryone(value)}
                className={`flex min-h-11 items-center justify-center gap-2 rounded-lg border px-3 text-xs font-medium ${everyone === value ? "border-brand-secondary-highlight/25 bg-brand-secondary-highlight/[0.045] text-brand-secondary-highlight dark:border-secondary/25 dark:bg-secondary/[0.055] dark:text-secondary" : "border-border/70 text-muted-foreground"}`}
              >
                <Icon size={14} />
                {label}
              </button>
            ))}
          </div>
          <p className="mt-2 text-[11px] leading-6 text-muted-foreground">
            {everyone
              ? "Current and future accepted project members can see the full conversation."
              : "Only you and the selected recipients can see this conversation. The recipient list is fixed once sent."}
          </p>
          {!everyone && (
            <RecipientPicker
              members={members}
              userId={userId}
              value={recipients}
              onChange={setRecipients}
              loading={loading}
              disabled={busy}
            />
          )}
          <label
            htmlFor="conversation-subject"
            className="mb-2 mt-4 block text-xs font-medium"
          >
            Subject
          </label>
          <input
            id="conversation-subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            disabled={busy}
            maxLength={200}
            placeholder="What would you like to discuss?"
            className={field}
          />
          {tasks.length > 0 && (
            <div className="mt-3">
              <DropdownMenu modal={false}>
                <DropdownMenuTrigger asChild>
                  <button
                    type="button"
                    disabled={busy}
                    className={`${secondaryAction} max-w-full`}
                  >
                    <span className="truncate">
                      {taskId
                        ? tasks.find((t) => t.id === taskId)?.title
                        : "Link a task (optional)"}
                    </span>
                    <ChevronDownIcon size={12} className="shrink-0" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="start"
                  collisionPadding={12}
                  className={`${menuSurface} max-h-60 w-72 max-w-[calc(100vw-48px)] overflow-y-auto`}
                >
                  <DropdownMenuItem
                    className={menuItem}
                    onSelect={() => setTaskId("")}
                  >
                    No linked task
                  </DropdownMenuItem>
                  {tasks.map((task) => (
                    <DropdownMenuItem
                      key={task.id}
                      className={menuItem}
                      onSelect={() => setTaskId(task.id)}
                    >
                      <span className="break-words">{task.title}</span>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
          <div className="mt-4">
            <MessageComposer
              onAccessDenied={onDenied}
              projectId={projectId}
              conversationId={null}
              audience={audience}
              disabled={
                loading ||
                !!error ||
                !subject.trim() ||
                (!everyone && recipients.length === 0)
              }
              onBusy={(value) => {
                busyRef.current = value;
                setBusy(value);
              }}
              onSent={(result) => onSent(result.conversationId)}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
function RecipientPicker({
  members,
  userId,
  value,
  onChange,
  loading,
  disabled,
}: {
  members: ConversationMember[];
  userId: string;
  value: string[];
  onChange: (value: string[]) => void;
  loading: boolean;
  disabled: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const input = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (!open) {
      setSearch("");
      return;
    }
    const frame = requestAnimationFrame(() => input.current?.focus());
    return () => cancelAnimationFrame(frame);
  }, [open]);
  useEffect(() => {
    if (disabled) setOpen(false);
  }, [disabled]);
  const eligible = members.filter((member) => member.userId !== userId);
  const matches = eligible.filter((member) =>
    member.name.toLowerCase().includes(search.trim().toLowerCase()),
  );
  const selected = value.map((id) =>
    members.find((member) => member.userId === id),
  );
  function toggle(id: string) {
    if (disabled) return;
    onChange(
      value.includes(id)
        ? value.filter((item) => item !== id)
        : value.length < 100
          ? [...value, id]
          : value,
    );
  }
  return (
    <div className="mt-3 min-w-0">
      <DropdownMenu
        modal={false}
        open={open}
        onOpenChange={(next) => {
          if (!disabled) setOpen(next);
        }}
      >
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            disabled={disabled || loading}
            aria-label="Select recipients"
            className="flex min-h-11 w-full min-w-0 items-center gap-2.5 rounded-lg border border-input bg-card px-3 text-left text-sm text-foreground outline-none transition-colors hover:border-ring/30 focus-visible:ring-2 focus-visible:ring-ring/35 disabled:opacity-60"
          >
            <UsersIcon
              size={15}
              aria-hidden="true"
              className="shrink-0 text-muted-foreground"
            />
            <span className="min-w-0 flex-1 truncate">
              {loading
                ? "Loading recipients…"
                : value.length
                  ? `${value.length} ${value.length === 1 ? "recipient" : "recipients"} selected`
                  : "Select recipients"}
            </span>
            <ChevronDownIcon
              size={13}
              aria-hidden="true"
              className="shrink-0 text-muted-foreground"
            />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="start"
          sideOffset={6}
          collisionPadding={16}
          className={`${menuSurface} flex max-h-[var(--radix-dropdown-menu-content-available-height)] w-[var(--radix-dropdown-menu-trigger-width)] min-w-0 max-w-[calc(100vw-48px)] flex-col overflow-hidden`}
        >
          <div className="relative m-1 mb-2 shrink-0">
            <SearchIcon
              size={13}
              aria-hidden="true"
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <input
              ref={input}
              value={search}
              maxLength={100}
              onChange={(event) => setSearch(event.target.value)}
              aria-label="Search recipients"
              placeholder="Search by name"
              className={`${field} pl-9`}
              onKeyDown={(event) => {
                if (event.key === "Escape") return;
                if (event.key === "ArrowDown") {
                  event.preventDefault();
                  event.currentTarget
                    .closest('[role="menu"]')
                    ?.querySelector<HTMLElement>(
                      '[role="menuitemcheckbox"]:not([aria-disabled="true"])',
                    )
                    ?.focus();
                }
                event.stopPropagation();
              }}
            />
          </div>
          <div className="max-h-60 min-h-0 overflow-y-auto overscroll-contain">
            {matches.length ? (
              matches.map((member) => {
                const checked = value.includes(member.userId);
                return (
                  <DropdownMenuItem
                    key={member.userId}
                    role="menuitemcheckbox"
                    aria-checked={checked}
                    disabled={!checked && value.length >= 100}
                    className={`${menuItem} min-h-12 gap-3`}
                    onSelect={(event) => {
                      event.preventDefault();
                      toggle(member.userId);
                    }}
                  >
                    <Person name={member.name} url={member.avatarUrl} />
                    <span className="min-w-0 flex-1">
                      <span className="block break-words text-xs">
                        {member.name}
                      </span>
                      {member.isOwner && (
                        <span className="mt-0.5 block text-[10px] text-muted-foreground">
                          Project owner
                        </span>
                      )}
                    </span>
                    <span
                      aria-hidden="true"
                      className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border ${checked ? "border-brand-secondary-highlight/30 bg-brand-secondary-highlight/[0.06] text-brand-secondary-highlight dark:border-secondary/30 dark:bg-secondary/[0.08] dark:text-secondary" : "border-border"}`}
                    >
                      {checked && <CheckIcon size={11} />}
                    </span>
                  </DropdownMenuItem>
                );
              })
            ) : (
              <p className="px-3 py-6 text-center text-xs leading-6 text-muted-foreground">
                {search.trim()
                  ? "No recipients match your search."
                  : "No other project members are available."}
              </p>
            )}
          </div>
          <div className="mt-2 flex shrink-0 items-center justify-between gap-3 border-t border-border/70 px-2 pb-1 pt-2">
            <p role="status" className="text-[10px] text-muted-foreground">
              {value.length} selected
              {value.length >= 100 ? " · Limit reached" : ""}
            </p>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className={`${quietAction} min-h-8 px-2`}
            >
              Done
            </button>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
      {value.length > 0 && (
        <div
          aria-label="Selected recipients"
          className="mt-2 flex flex-wrap items-center gap-1.5"
        >
          {selected.slice(0, 3).map((member, index) => (
            <button
              key={value[index]}
              type="button"
              disabled={disabled}
              aria-label={`Remove ${member?.name ?? "recipient"}`}
              onClick={() => toggle(value[index])}
              className="inline-flex max-w-full items-center gap-1.5 rounded-md border border-border/70 bg-surface-2/50 px-2 py-1.5 text-[11px] text-foreground transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/35 disabled:opacity-60"
            >
              <span className="max-w-40 truncate">
                {member?.name ?? "Unavailable recipient"}
              </span>
              <XIcon
                size={11}
                aria-hidden="true"
                className="shrink-0 text-muted-foreground"
              />
            </button>
          ))}
          {value.length > 3 && (
            <button
              type="button"
              disabled={disabled}
              onClick={() => setOpen(true)}
              aria-label={`View all ${value.length} selected recipients`}
              className={`${quietAction} min-h-8 px-2 text-[11px]`}
            >
              +{value.length - 3} more
            </button>
          )}
        </div>
      )}
    </div>
  );
}
