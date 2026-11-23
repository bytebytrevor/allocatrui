import { Link } from "react-router-dom";
import { forwardRef, type HTMLAttributes, type Ref } from "react";
import {
  CheckCircle2Icon,
  InboxIcon,
  MessageSquareIcon,
  ClipboardListIcon,
  PaperclipIcon,
} from "lucide-react";
import { type Notification, useNotifications } from "./NotificationProvider";

export function notificationTime(value: string) {
  const date = new Date(value);
  if (!Number.isFinite(date.getTime())) return "";
  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

type Props = {
  item: Notification;
  onOpen?: () => void;
} & HTMLAttributes<HTMLElement>;
const NotificationRow = forwardRef<HTMLElement, Props>(function NotificationRow(
  { item, onOpen, onClick, className: extraClass, ...rest },
  ref,
) {
  const { markRead, reviewInvitation } = useNotifications();
  const Icon = item.kind.startsWith("invitation")
    ? InboxIcon
    : ["message-received", "task-comment"].includes(item.kind)
      ? MessageSquareIcon
      : item.kind === "file-added"
        ? PaperclipIcon
        : ["task-assigned", "task-created"].includes(item.kind)
          ? ClipboardListIcon
          : CheckCircle2Icon;
  const content = (
    <>
      <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-surface-2 text-muted-foreground">
        <Icon size={15} aria-hidden="true" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block break-words text-xs font-medium leading-5 text-foreground">
          {item.text}
        </span>
        <span className="mt-0.5 block truncate text-xs text-muted-foreground">
          {item.projectTitle}
        </span>
        <time
          dateTime={item.createdAt}
          className="mt-1.5 block text-[10px] text-muted-foreground"
        >
          {notificationTime(item.createdAt)}
        </time>
      </span>
      {!item.readAt && (
        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-secondary-highlight dark:bg-secondary">
          <span className="sr-only">Unread</span>
        </span>
      )}
    </>
  );
  const className =
    "flex w-full min-w-0 items-start gap-3 px-3 py-4 text-left transition-colors hover:bg-surface-2/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring/35 motion-reduce:transition-none " +
    (extraClass ?? "");
  const open = () => {
    void markRead(item);
    onOpen?.();
  };
  if (item.kind === "invitation-received")
    return (
      <button
        {...rest}
        ref={ref as Ref<HTMLButtonElement>}
        type="button"
        className={className}
        onClick={(event) => {
          onClick?.(event);
          open();
          reviewInvitation(item);
        }}
      >
        {content}
      </button>
    );
  // Only internal project routes are accepted, even if older stored data is malformed.
  const href =
    /^\/projects\/[a-f\d-]+(?:(?:\/(?:messaging|files))|(?:\?taskId=[a-f\d-]+(?:&commentId=[a-f\d-]+)?))?$/i.test(
      item.href,
    )
      ? item.href
      : "/projects";
  return (
    <Link
      {...rest}
      ref={ref as Ref<HTMLAnchorElement>}
      to={href}
      className={className}
      onClick={(event) => {
        onClick?.(event);
        open();
      }}
    >
      {content}
    </Link>
  );
});
export default NotificationRow;
