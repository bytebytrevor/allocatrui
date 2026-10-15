import { useEffect, useRef, useState } from "react";

import {
  CalendarDaysIcon,
  Clock3Icon,
  MessageSquareIcon,
  MoreHorizontalIcon,
  PencilIcon,
  RefreshCwIcon,
  SendIcon,
  Trash2Icon,
  TriangleAlertIcon,
  UserRoundIcon,
} from "lucide-react";

import api from "@/api/axios";
import { useAuth } from "@/auth/useAuth";

import type { Task } from "@/Types/task";
import type { TaskComment } from "@/Types/taskComment";

import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";

import {
  BusyIcon,
  menuItem,
  menuSurface,
  primaryAction,
  quietAction,
  secondaryAction,
  TaskPriority,
  TaskStatus,
} from "./workspace-ui";

import {
  formatDate,
  formatStatus,
  getAssignedName,
  getTaskPriority,
  getWorkflowStatus,
  initials,
  isTaskOverdue,
} from "./workspace-utils";

type Props = {
  task: Task;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function TaskDialog({ task, open, onOpenChange }: Props) {
  const { user } = useAuth();

  const [comment, setComment] = useState("");
  const [comments, setComments] = useState<TaskComment[]>([]);

  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const [reload, setReload] = useState(0);
  const [sending, setSending] = useState(false);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [savingId, setSavingId] = useState<string | null>(null);

  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<TaskComment | null>(null);

  const [actionError, setActionError] = useState<string | null>(null);

  const epochRef = useRef(0);
  const busyRef = useRef(new Set<string>());
  const mountedRef = useRef(true);

  const scopeRef = useRef({
    taskId: task.id,
    open,
  });

  scopeRef.current = {
    taskId: task.id,
    open,
  };

  const status = getWorkflowStatus(task);
  const overdue = isTaskOverdue(task);
  const priority = getTaskPriority(task);

  /* =======================================================
     MOUNT STATE
  ======================================================= */

  useEffect(() => {
    mountedRef.current = true;

    return () => {
      mountedRef.current = false;
      epochRef.current += 1;
    };
  }, []);

  /* =======================================================
     LOAD DISCUSSION
  ======================================================= */

  useEffect(() => {
    const epoch = ++epochRef.current;
    let cancelled = false;

    setComment("");
    setComments([]);
    setEditingId(null);
    setEditValue("");
    setDeleteTarget(null);
    setSending(false);
    setSavingId(null);
    setDeletingId(null);
    setActionError(null);
    setLoadError(false);

    busyRef.current.clear();

    if (!open || !task.id) {
      setLoading(false);
      return;
    }

    setLoading(true);

    void api
      .get<TaskComment[]>(`/tasks/${task.id}/comments`, {
        withCredentials: true,
      })
      .then((response) => {
        if (cancelled || epoch !== epochRef.current) return;

        setComments(Array.isArray(response.data) ? response.data : []);
      })
      .catch(() => {
        if (!cancelled && epoch === epochRef.current) {
          setLoadError(true);
        }
      })
      .finally(() => {
        if (!cancelled && epoch === epochRef.current) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [open, task.id, reload]);

  function stillCurrent(epoch: number, taskId: string) {
    return (
      mountedRef.current &&
      epoch === epochRef.current &&
      scopeRef.current.open &&
      taskId === scopeRef.current.taskId
    );
  }

  /* =======================================================
     CREATE COMMENT
  ======================================================= */

  async function sendComment() {
    const value = comment.trim();
    const epoch = epochRef.current;
    const taskId = task.id;
    const key = `${epoch}:send`;

    if (
      !value ||
      value.length > 2000 ||
      !user?.userId ||
      busyRef.current.has(key) ||
      loading ||
      loadError
    ) {
      return;
    }

    busyRef.current.add(key);
    setSending(true);
    setActionError(null);

    try {
      const response = await api.post<TaskComment>(
        `/tasks/${taskId}/comments`,
        { comment: value },
        { withCredentials: true },
      );

      if (!stillCurrent(epoch, taskId)) return;

      setComments((current) =>
        current.some((item) => item.id === response.data.id)
          ? current
          : [...current, response.data],
      );

      setComment("");
    } catch {
      if (stillCurrent(epoch, taskId)) {
        setActionError(
          "Your comment could not be sent. Your draft has been kept.",
        );
      }
    } finally {
      busyRef.current.delete(key);

      if (stillCurrent(epoch, taskId)) {
        setSending(false);
      }
    }
  }

  /* =======================================================
     EDIT COMMENT
  ======================================================= */

  function startEditing(item: TaskComment) {
    if (!user?.userId || user.userId !== item.createdById || savingId) {
      return;
    }

    setEditingId(item.id);
    setEditValue(item.comment);
    setActionError(null);
  }

  function cancelEditing() {
    if (savingId) return;

    setEditingId(null);
    setEditValue("");
  }

  async function saveComment(commentId: string) {
    const value = editValue.trim();
    const original = comments.find((item) => item.id === commentId);

    const epoch = epochRef.current;
    const taskId = task.id;
    const key = `${epoch}:edit:${commentId}`;

    if (
      !value ||
      value.length > 2000 ||
      !user?.userId ||
      original?.createdById !== user.userId ||
      savingId ||
      busyRef.current.has(key)
    ) {
      return;
    }

    busyRef.current.add(key);
    setSavingId(commentId);
    setActionError(null);

    try {
      const response = await api.patch<TaskComment>(
        `/tasks/${taskId}/comments/${commentId}`,
        { comment: value },
        { withCredentials: true },
      );

      if (!stillCurrent(epoch, taskId)) return;

      setComments((current) =>
        current.map((item) => (item.id === commentId ? response.data : item)),
      );

      setEditingId(null);
      setEditValue("");
    } catch {
      if (stillCurrent(epoch, taskId)) {
        setActionError("Your changes could not be saved. Please try again.");
      }
    } finally {
      busyRef.current.delete(key);

      if (stillCurrent(epoch, taskId)) {
        setSavingId(null);
      }
    }
  }

  /* =======================================================
     DELETE COMMENT
  ======================================================= */

  async function deleteComment(commentId: string) {
    const original = comments.find((item) => item.id === commentId);

    const epoch = epochRef.current;
    const taskId = task.id;
    const key = `${epoch}:delete:${commentId}`;

    if (
      !user?.userId ||
      original?.createdById !== user.userId ||
      deletingId ||
      busyRef.current.has(key)
    ) {
      return;
    }

    busyRef.current.add(key);
    setDeletingId(commentId);
    setActionError(null);

    try {
      await api.delete(`/tasks/${taskId}/comments/${commentId}`, {
        withCredentials: true,
      });

      if (!stillCurrent(epoch, taskId)) return;

      setComments((current) => current.filter((item) => item.id !== commentId));

      if (editingId === commentId) {
        cancelEditing();
      }

      setDeleteTarget(null);
    } catch {
      if (stillCurrent(epoch, taskId)) {
        setActionError("The comment could not be deleted. Please try again.");
      }
    } finally {
      busyRef.current.delete(key);

      if (stillCurrent(epoch, taskId)) {
        setDeletingId(null);
      }
    }
  }

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <>
      <Dialog
        open={open}
        onOpenChange={(nextOpen) => {
          if (!deletingId) {
            onOpenChange(nextOpen);
          }
        }}
      >
        <DialogContent
          className={[
            "flex max-h-[92dvh] w-[calc(100vw-24px)] flex-col",
            "overflow-hidden rounded-xl border-border",
            "bg-card p-0 text-card-foreground shadow-none",
            "sm:max-w-[780px]",
          ].join(" ")}
        >
          {/* HEADER */}

          <DialogHeader className="shrink-0 border-b border-border/70 px-5 py-5 text-left sm:px-7">
            <div className="pr-8">
              <div className="flex flex-wrap items-center gap-3">
                <TaskStatus status={status} />

                {priority && <TaskPriority priority={priority} />}

                {overdue && (
                  <span className="inline-flex items-center gap-1 text-[11px] text-status-overdue-foreground">
                    <TriangleAlertIcon size={12} aria-hidden="true" />
                    Overdue
                  </span>
                )}
              </div>

              <DialogTitle className="mt-3 break-words text-xl font-medium leading-7 tracking-[-0.025em] sm:text-2xl">
                {task.title}
              </DialogTitle>

              <DialogDescription className="mt-2 text-xs leading-6 text-muted-foreground">
                Task details and discussion
              </DialogDescription>
            </div>
          </DialogHeader>

          {/* SCROLLABLE BODY */}

          <div className="min-h-0 flex-1 overflow-y-auto">
            <section
              aria-label="Task details"
              className="px-5 py-5 sm:px-7 sm:py-6"
            >
              <div className="grid gap-5 sm:grid-cols-[minmax(0,1fr)_190px] sm:gap-7">
                <div className="min-w-0">
                  <h2 className="text-[10px] font-medium uppercase tracking-[0.1em] text-muted-foreground">
                    Description
                  </h2>

                  <p className="mt-3 whitespace-pre-wrap break-words text-sm leading-7 text-foreground">
                    {task.description || "No description added."}
                  </p>
                </div>

                <dl className="grid grid-cols-2 gap-4 rounded-lg border border-border/70 bg-surface-2/60 p-4 sm:grid-cols-1">
                  <Meta
                    icon={CalendarDaysIcon}
                    label="Due date"
                    value={formatDate(task.dueDate)}
                  />

                  <AssigneeMeta task={task} />

                  <Meta
                    icon={Clock3Icon}
                    label="Status"
                    value={
                      status === "active" ? "In progress" : formatStatus(status)
                    }
                  />
                </dl>
              </div>
            </section>

            {/* DISCUSSION */}

            <section
              aria-labelledby="task-discussion-title"
              className="border-t border-border/70 px-5 py-5 sm:px-7"
            >
              <div className="flex items-center justify-between gap-3">
                <h2
                  id="task-discussion-title"
                  className="inline-flex items-center gap-2 text-sm font-medium"
                >
                  <MessageSquareIcon
                    size={16}
                    aria-hidden="true"
                    className="text-brand-secondary-highlight dark:text-secondary"
                  />
                  Discussion
                </h2>

                {!loading && !loadError && (
                  <span className="text-[11px] tabular-nums text-muted-foreground">
                    {comments.length}{" "}
                    {comments.length === 1 ? "comment" : "comments"}
                  </span>
                )}
              </div>

              <div className="mt-4">
                {loading ? (
                  <div
                    role="status"
                    className="flex min-h-24 items-center justify-center gap-2 text-xs text-muted-foreground"
                  >
                    <BusyIcon />
                    Loading discussion…
                  </div>
                ) : loadError ? (
                  <div
                    role="alert"
                    className="rounded-lg border border-border px-4 py-5"
                  >
                    <p className="text-xs text-muted-foreground">
                      The discussion could not be loaded.
                    </p>

                    <button
                      type="button"
                      onClick={() => setReload((value) => value + 1)}
                      className={`${quietAction} mt-2 px-0`}
                    >
                      <RefreshCwIcon size={13} aria-hidden="true" />
                      Try again
                    </button>
                  </div>
                ) : comments.length > 0 ? (
                  <div className="divide-y divide-border/65">
                    {comments.map((item) => (
                      <CommentItem
                        key={item.id}
                        comment={item}
                        own={Boolean(
                          user?.userId && user.userId === item.createdById,
                        )}
                        editing={editingId === item.id}
                        value={editValue}
                        saving={savingId === item.id}
                        disabled={Boolean(savingId || deletingId)}
                        onEdit={() => startEditing(item)}
                        onValue={setEditValue}
                        onSave={() => void saveComment(item.id)}
                        onCancel={cancelEditing}
                        onDelete={() => setDeleteTarget(item)}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="py-7 text-center">
                    <p className="text-xs font-medium">Start the discussion</p>

                    <p className="mx-auto mt-2 max-w-xs text-xs leading-6 text-muted-foreground">
                      Share a question, decision or update so everyone can
                      follow the work.
                    </p>
                  </div>
                )}
              </div>
            </section>
          </div>

          {/* COMMENT COMPOSER */}

          <div className="shrink-0 border-t border-border/70 bg-surface-2/50 px-5 py-4 sm:px-7">
            {actionError && (
              <p
                role="alert"
                className="mb-3 text-xs leading-6 text-status-overdue-foreground"
              >
                {actionError}
              </p>
            )}

            <div className="flex items-end gap-3">
              <PersonAvatar
                name={user?.fullName}
                url={user?.avatarUrl ?? undefined}
              />

              <div className="min-w-0 flex-1">
                <label htmlFor={`comment-${task.id}`} className="sr-only">
                  Write a comment
                </label>

                <textarea
                  id={`comment-${task.id}`}
                  value={comment}
                  onChange={(event) => setComment(event.target.value)}
                  rows={2}
                  maxLength={2000}
                  disabled={sending || loading || loadError || !user?.userId}
                  placeholder="Share an update or ask a question…"
                  onKeyDown={(event) => {
                    if (event.nativeEvent.isComposing) return;

                    if (event.key === "Enter" && !event.shiftKey) {
                      event.preventDefault();
                      void sendComment();
                    }
                  }}
                  className={[
                    "min-h-[72px] w-full resize-y rounded-lg",
                    "border border-input bg-card px-3 py-2.5",
                    "text-base leading-6 text-foreground outline-none",
                    "placeholder:text-muted-foreground/70",
                    "focus-visible:border-ring/50",
                    "disabled:opacity-60 sm:text-xs",
                  ].join(" ")}
                />

                <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
                  <p className="text-[10px] leading-5 text-muted-foreground">
                    Enter to send · Shift + Enter for a new line
                  </p>

                  <button
                    type="button"
                    disabled={
                      !comment.trim() ||
                      sending ||
                      loading ||
                      loadError ||
                      !user?.userId
                    }
                    onClick={() => void sendComment()}
                    className={`${primaryAction} min-h-9 px-3 py-1.5`}
                  >
                    {sending ? (
                      <BusyIcon />
                    ) : (
                      <SendIcon
                        size={13}
                        aria-hidden="true"
                        className="text-inherit"
                      />
                    )}

                    {sending ? "Sending…" : "Send"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* DELETE CONFIRMATION */}

      <AlertDialog
        open={deleteTarget !== null}
        onOpenChange={(nextOpen) => {
          if (!nextOpen && !deletingId) {
            setDeleteTarget(null);
          }
        }}
      >
        <AlertDialogContent className="rounded-xl border-border bg-card text-card-foreground shadow-none sm:max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-lg font-medium">
              Delete comment?
            </AlertDialogTitle>

            <AlertDialogDescription className="text-sm leading-7 text-muted-foreground">
              This comment will be permanently removed from the task discussion.
            </AlertDialogDescription>
          </AlertDialogHeader>

          {actionError && (
            <p role="alert" className="text-xs text-status-overdue-foreground">
              {actionError}
            </p>
          )}

          <AlertDialogFooter>
            <AlertDialogCancel
              disabled={Boolean(deletingId)}
              className={secondaryAction}
            >
              Cancel
            </AlertDialogCancel>

            <AlertDialogAction
              disabled={Boolean(deletingId)}
              onClick={(event) => {
                event.preventDefault();

                if (deleteTarget) {
                  void deleteComment(deleteTarget.id);
                }
              }}
              style={{
                backgroundColor: "var(--destructive)",
                color: "var(--destructive-foreground)",
              }}
              className="rounded-lg transition-opacity hover:opacity-90"
            >
              {deletingId ? (
                <BusyIcon />
              ) : (
                <Trash2Icon
                  size={13}
                  aria-hidden="true"
                  className="text-inherit"
                />
              )}

              {deletingId ? "Deleting…" : "Delete comment"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

/* =========================================================
   ASSIGNED PERSON
========================================================= */

function AssigneeMeta({ task }: { task: Task }) {
  const assigned = getAssignedName(task);
  const hasAssignee = Boolean(task.assignedToId);

  const assigneeName =
    task.assignedToName?.trim() ||
    (task.assignedToId && task.assignedToId === task.createdByUserId
      ? task.createdByName?.trim()
      : "") ||
    "";

  const avatarUrl = hasAssignee
    ? task.assignedToAvatarUrl?.trim() || undefined
    : undefined;

  return (
    <div className="min-w-0">
      <dt className="text-[10px] text-muted-foreground">Assigned to</dt>

      <dd className="mt-2 flex min-w-0 items-center gap-2.5">
        <Avatar
          aria-hidden="true"
          className="h-8 w-8 shrink-0 border border-border/80"
        >
          <AvatarImage src={avatarUrl} alt="" className="object-cover" />

          <AvatarFallback className="bg-surface-3 text-[10px] font-medium text-brand-secondary-highlight">
            {hasAssignee && assigneeName ? (
              initials(assigneeName)
            ) : (
              <UserRoundIcon size={14} aria-hidden="true" />
            )}
          </AvatarFallback>
        </Avatar>

        <span className="min-w-0 break-words text-xs font-medium leading-5">
          {assigned}
        </span>
      </dd>
    </div>
  );
}

/* =========================================================
   COMMENT AVATAR
========================================================= */

function PersonAvatar({ name, url }: { name?: string; url?: string }) {
  return (
    <Avatar className="h-8 w-8 shrink-0 border border-border/80">
      <AvatarImage
        src={url}
        alt={name || "User profile"}
        className="object-cover"
      />

      <AvatarFallback className="bg-surface-3 text-[10px] font-medium text-brand-secondary-highlight dark:text-secondary">
        {initials(name)}
      </AvatarFallback>
    </Avatar>
  );
}

/* =========================================================
   COMMENT ITEM
========================================================= */

type CommentItemProps = {
  comment: TaskComment;
  own: boolean;
  editing: boolean;
  value: string;
  saving: boolean;
  disabled: boolean;
  onEdit: () => void;
  onValue: (value: string) => void;
  onSave: () => void;
  onCancel: () => void;
  onDelete: () => void;
};

function CommentItem({
  comment,
  own,
  editing,
  value,
  saving,
  disabled,
  onEdit,
  onValue,
  onSave,
  onCancel,
  onDelete,
}: CommentItemProps) {
  return (
    <article className="flex gap-3 py-4">
      <PersonAvatar
        name={comment.createdByName}
        url={comment.avatarUrl ?? undefined}
      />

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <div className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1">
            <p className="break-words text-xs font-medium">
              {comment.createdByName || "Allocatr user"}
            </p>

            {own && (
              <span className="text-[10px] text-brand-secondary-highlight dark:text-secondary">
                You
              </span>
            )}

            <span
              className="text-[10px] text-muted-foreground"
              title={formatDate(comment.createdAt)}
            >
              {formatCommentDate(comment.createdAt)}
            </span>

            {comment.updatedAt && (
              <span
                className="text-[10px] text-muted-foreground"
                title={`Edited ${formatCommentDate(comment.updatedAt)}`}
              >
                Edited
              </span>
            )}
          </div>

          {own && !editing && (
            <DropdownMenu modal={false}>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  disabled={disabled}
                  aria-label="Comment options"
                  className={`${quietAction} h-8 min-h-8 w-8 shrink-0 px-0`}
                >
                  <MoreHorizontalIcon size={15} aria-hidden="true" />
                </button>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                align="end"
                sideOffset={6}
                className={`${menuSurface} w-36`}
              >
                <DropdownMenuItem
                  className={menuItem}
                  onSelect={() => requestAnimationFrame(onEdit)}
                >
                  <PencilIcon size={13} aria-hidden="true" />
                  Edit
                </DropdownMenuItem>

                <DropdownMenuItem
                  className={`${menuItem} text-status-overdue-foreground focus:text-status-overdue-foreground`}
                  onSelect={() => requestAnimationFrame(onDelete)}
                >
                  <Trash2Icon size={13} aria-hidden="true" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        {editing ? (
          <div className="mt-3">
            <textarea
              aria-label="Edit comment"
              value={value}
              onChange={(event) => onValue(event.target.value)}
              rows={3}
              maxLength={2000}
              autoFocus
              disabled={saving}
              onKeyDown={(event) => {
                if (event.nativeEvent.isComposing) return;

                if (event.key === "Escape" && !saving) {
                  onCancel();
                }

                if (
                  event.key === "Enter" &&
                  !event.shiftKey &&
                  !saving &&
                  value.trim()
                ) {
                  event.preventDefault();
                  onSave();
                }
              }}
              className={[
                "w-full resize-y rounded-lg border border-input",
                "bg-surface-2 px-3 py-2",
                "text-base leading-6 outline-none",
                "focus-visible:border-ring/50 sm:text-xs",
              ].join(" ")}
            />

            <div className="mt-2 flex justify-end gap-2">
              <button
                type="button"
                disabled={saving}
                onClick={onCancel}
                className={quietAction}
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={saving || !value.trim()}
                onClick={onSave}
                className={`${primaryAction} min-h-9 px-3 py-1.5`}
              >
                {saving && <BusyIcon />}
                {saving ? "Saving…" : "Save"}
              </button>
            </div>
          </div>
        ) : (
          <p className="mt-2 whitespace-pre-wrap break-words text-sm leading-7 text-foreground">
            {comment.comment}
          </p>
        )}
      </div>
    </article>
  );
}

/* =========================================================
   METADATA
========================================================= */

function Meta({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof CalendarDaysIcon;
  label: string;
  value: string;
}) {
  return (
    <div className="min-w-0">
      <dt className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
        <Icon size={12} aria-hidden="true" />
        {label}
      </dt>

      <dd className="mt-1.5 break-words text-xs font-medium leading-5">
        {value}
      </dd>
    </div>
  );
}

function formatCommentDate(value: string) {
  const date = new Date(value);

  if (!Number.isFinite(date.getTime())) return "";

  return new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}
