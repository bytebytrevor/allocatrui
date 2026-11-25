import { useState } from "react";
import { Link } from "react-router-dom";
import { BellIcon, LoaderCircleIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNotifications } from "@/notifications/NotificationProvider";
import NotificationRow from "@/notifications/NotificationRow";

export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const { items, unreadCount, loading, busy, error, refresh, markAllRead } =
    useNotifications();
  return (
    <DropdownMenu
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (next) void refresh();
      }}
    >
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label={
            unreadCount
              ? `${unreadCount} unread notifications`
              : "Notifications"
          }
          className="relative h-11 w-11 shrink-0 rounded-xl text-muted-foreground shadow-none hover:bg-surface-2/80 hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/35 data-[state=open]:bg-surface-2 dark:hover:bg-surface-3/65 lg:h-8 lg:w-8 lg:rounded-md"
        >
          <BellIcon size={16} aria-hidden="true" />
          {unreadCount > 0 && (
            <span
              aria-hidden="true"
              className="absolute -right-0.5 -top-0.5 min-w-4 rounded-md bg-brand-secondary-highlight px-1 text-center text-[9px] font-semibold leading-4 text-primary-foreground dark:bg-secondary dark:text-secondary-foreground"
            >
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        sideOffset={8}
        className="w-[360px] max-w-[calc(100vw-1.5rem)] overflow-hidden rounded-xl border border-border bg-popover p-0 text-popover-foreground shadow-lg shadow-black/5"
      >
        <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-3">
          <p className="text-sm font-semibold">Notifications</p>
          <DropdownMenuItem
            disabled={busy || loading || !items.some((item) => !item.readAt)}
            onSelect={(event) => {
              event.preventDefault();
              void markAllRead();
            }}
            className="cursor-pointer rounded-md px-1 py-2 text-[11px] font-medium text-muted-foreground focus:bg-surface-2 data-[disabled]:opacity-40"
          >
            Mark all read
          </DropdownMenuItem>
        </div>
        {error && (
          <div role="alert" className="px-4 py-3 text-xs text-destructive">
            {error}
            <button
              type="button"
              onClick={() => void refresh()}
              className="ml-2 underline"
            >
              Retry
            </button>
          </div>
        )}
        <div className="max-h-[min(440px,60svh)] overflow-y-auto divide-y divide-border/60">
          {loading && items.length === 0 ? (
            <p
              role="status"
              className="flex items-center justify-center gap-2 p-8 text-xs text-muted-foreground"
            >
              <LoaderCircleIcon
                size={14}
                className="animate-spin motion-reduce:animate-none"
              />
              Loading notifications
            </p>
          ) : items.length === 0 && !error ? (
            <p className="px-4 py-9 text-center text-xs text-muted-foreground">
              You’re all caught up.
            </p>
          ) : (
            items.slice(0, 6).map((item) => (
              <DropdownMenuItem key={item.id} asChild>
                <NotificationRow item={item} onOpen={() => setOpen(false)} />
              </DropdownMenuItem>
            ))
          )}
        </div>
        <DropdownMenuItem asChild>
          <Link
            to="/notifications"
            onClick={() => setOpen(false)}
            className="block border-t border-border px-4 py-3 text-center text-xs font-medium text-brand-secondary-highlight focus:bg-surface-2 dark:text-secondary"
          >
            View all notifications
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
