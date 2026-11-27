import { LoaderCircleIcon, RefreshCwIcon } from "lucide-react";
import DashboardMainNav from "@/components/DashboardMainNav";
import { Button } from "@/components/ui/button";
import { useNotifications } from "@/notifications/NotificationProvider";
import NotificationRow from "@/notifications/NotificationRow";

export default function Notifications() {
    const {
        items,
        unreadCount,
        loading,
        busy,
        error,
        hasMore,
        refresh,
        loadMore,
        markAllRead,
    } = useNotifications();
    return (
        <div className="min-h-screen bg-background text-foreground">
            <header className="border-b border-border">
                <div className="container mx-auto px-4 sm:px-5 md:px-8">
                    <DashboardMainNav />
                </div>
            </header>
            <main className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight">
                            Notifications
                        </h1>
                        <p
                            className="mt-1.5 text-xs text-muted-foreground"
                            role="status"
                        >
                            {unreadCount
                                ? `${unreadCount} unread`
                                : "You’re all caught up."}
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            type="button"
                            variant="ghost"
                            disabled={
                                loading ||
                                busy ||
                                !items.some((item) => !item.readAt)
                            }
                            onClick={() => void markAllRead()}
                            className="h-9 rounded-lg text-xs"
                        >
                            Mark all read
                        </Button>
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            disabled={loading || busy}
                            aria-label="Refresh notifications"
                            onClick={() => void refresh()}
                            className="h-9 w-9 rounded-lg"
                        >
                            <RefreshCwIcon size={14} aria-hidden="true" />
                        </Button>
                    </div>
                </div>
                {error && (
                    <p
                        role="alert"
                        className="mt-5 text-xs leading-6 text-destructive"
                    >
                        {error}
                    </p>
                )}
                <section
                    aria-label="Notification inbox"
                    aria-busy={loading}
                    className="mt-6 divide-y divide-border/60 border-y border-border/60"
                >
                    {items.map((item) => (
                        <NotificationRow key={item.id} item={item} />
                    ))}
                    {loading && items.length === 0 && (
                        <p
                            role="status"
                            className="flex items-center justify-center gap-2 py-12 text-sm text-muted-foreground"
                        >
                            <LoaderCircleIcon
                                size={16}
                                className="animate-spin motion-reduce:animate-none"
                            />
                            Loading notifications
                        </p>
                    )}
                    {!loading && !error && items.length === 0 && (
                        <p className="py-12 text-center text-sm text-muted-foreground">
                            Project updates will appear here.
                        </p>
                    )}
                </section>
                {hasMore && (
                    <div className="mt-5 text-center">
                        <Button
                            type="button"
                            variant="outline"
                            disabled={loading || busy}
                            onClick={() => void loadMore()}
                            className="h-9 rounded-lg text-xs"
                        >
                            {loading ? "Loading…" : "Load older notifications"}
                        </Button>
                    </div>
                )}
            </main>
        </div>
    );
}
