import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useRef,
    useState,
    type ReactNode,
} from "react";
import api from "@/api/axios";
import { useAuth } from "@/auth/useAuth";
import ProjectInvitationDialog, {
    type InvitationAction,
} from "@/components/ProjectInvitationDialog";

export type Notification = {
    id: string;
    kind: string;
    projectId: string;
    projectTitle: string;
    text: string;
    href: string;
    createdAt: string;
    readAt: string | null;
};
type Page = {
    items: Notification[];
    nextCursor: string | null;
    unreadCount: number;
    latestId: string | null;
};
type Inbox = {
    items: Notification[];
    unreadCount: number;
    loading: boolean;
    busy: boolean;
    error: string | null;
    hasMore: boolean;
    refresh: () => Promise<void>;
    loadMore: () => Promise<void>;
    markRead: (item: Notification) => Promise<void>;
    markAllRead: () => Promise<void>;
    reviewInvitation: (item: Notification) => void;
};
const Context = createContext<Inbox | null>(null);

export function NotificationProvider({ children }: { children: ReactNode }) {
    const { user } = useAuth();
    // Remount the store on account changes; no former account's items can leak.
    return (
        <AccountNotifications
            key={user?.userId ?? "guest"}
            enabled={Boolean(user?.userId)}
        >
            {children}
        </AccountNotifications>
    );
}

function AccountNotifications({
    children,
    enabled,
}: {
    children: ReactNode;
    enabled: boolean;
}) {
    const [items, setItems] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [nextCursor, setNextCursor] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [invitation, setInvitation] = useState<Notification | null>(null);
    const [responding, setResponding] = useState<InvitationAction | null>(null);
    const alive = useRef(false);
    const version = useRef(0);
    const request = useRef(0);
    const loadingRef = useRef(false);
    const busyRef = useRef(false);
    const mutations = useRef<Promise<void>>(Promise.resolve());
    const respondRef = useRef(false);
    const controllers = useRef(new Set<AbortController>());

    useEffect(() => {
        alive.current = true;
        return () => {
            alive.current = false;
            request.current++;
            loadingRef.current = false;
            for (const controller of controllers.current) controller.abort();
            controllers.current.clear();
        };
    }, []);

    const fetchPage = useCallback(
        async (before?: string) => {
            if (!enabled || loadingRef.current || busyRef.current) return;
            const seq = ++request.current;
            const atVersion = version.current;
            const controller = new AbortController();
            controllers.current.add(controller);
            loadingRef.current = true;
            setLoading(true);
            setError(null);
            try {
                const { data } = await api.get<Page>("/notifications", {
                    params: { take: 30, ...(before ? { before } : {}) },
                    withCredentials: true,
                    signal: controller.signal,
                });
                if (
                    !alive.current ||
                    seq !== request.current ||
                    atVersion !== version.current
                )
                    return;
                setItems((current) =>
                    before
                        ? [
                              ...current,
                              ...data.items.filter(
                                  (item) =>
                                      !current.some(
                                          (old) => old.id === item.id,
                                      ),
                              ),
                          ]
                        : data.items,
                );
                setNextCursor(data.nextCursor);
                setUnreadCount(data.unreadCount);
            } catch {
                if (
                    alive.current &&
                    !controller.signal.aborted &&
                    atVersion === version.current
                )
                    setError("Notifications could not be loaded. Try again.");
            } finally {
                controllers.current.delete(controller);
                if (seq === request.current) {
                    loadingRef.current = false;
                    if (alive.current) setLoading(false);
                }
            }
        },
        [enabled],
    );
    const refresh = useCallback(() => fetchPage(), [fetchPage]);
    const loadMore = useCallback(async () => {
        if (nextCursor) await fetchPage(nextCursor);
    }, [nextCursor, fetchPage]);

    useEffect(() => {
        void refresh();
    }, [refresh]);
    useEffect(() => {
        if (!enabled) return;
        let checking = false;
        const count = async () => {
            if (
                document.visibilityState === "hidden" ||
                checking ||
                busyRef.current
            )
                return;
            checking = true;
            const atVersion = version.current;
            const controller = new AbortController();
            controllers.current.add(controller);
            try {
                const { data } = await api.get<{ unreadCount: number }>(
                    "/notifications/unread-count",
                    {
                        withCredentials: true,
                        signal: controller.signal,
                    },
                );
                if (alive.current && atVersion === version.current)
                    setUnreadCount(data.unreadCount);
            } catch {
                // Background failures retain the last count; explicit refresh shows errors.
            } finally {
                checking = false;
                controllers.current.delete(controller);
            }
        };
        const onFocus = () => {
            void count();
        };
        const timer = window.setInterval(onFocus, 30_000);
        window.addEventListener("focus", onFocus);
        document.addEventListener("visibilitychange", onFocus);
        return () => {
            window.clearInterval(timer);
            window.removeEventListener("focus", onFocus);
            document.removeEventListener("visibilitychange", onFocus);
        };
    }, [enabled]);

    const updateRead = useCallback(
        async (item?: Notification) => {
            if (!enabled || (item && item.readAt)) return;
            const throughId = items[0]?.id;
            if (!item && !throughId) return;
            const run = mutations.current.then(async () => {
                if (!alive.current) return;
                busyRef.current = true;
                version.current++;
                setBusy(true);
                setError(null);
                try {
                    await api.patch(
                        item
                            ? `/notifications/${encodeURIComponent(item.id)}/read`
                            : "/notifications/read-all",
                        item ? {} : { throughId },
                        { withCredentials: true },
                    );
                    if (!alive.current) return;
                    const now = new Date().toISOString();
                    setItems((current) =>
                        current.map((row) =>
                            (!item || row.id === item.id) && !row.readAt
                                ? { ...row, readAt: now }
                                : row,
                        ),
                    );
                    // Use server count: arrivals outside the loaded page must remain unread.
                    const { data } = await api.get<{ unreadCount: number }>(
                        "/notifications/unread-count",
                        { withCredentials: true },
                    );
                    if (alive.current) setUnreadCount(data.unreadCount);
                } catch {
                    if (alive.current)
                        setError(
                            "The read status could not be refreshed. Try again.",
                        );
                } finally {
                    // Also invalidate background reads started during the mutation.
                    version.current++;
                    busyRef.current = false;
                    if (alive.current) setBusy(false);
                }
            });
            mutations.current = run;
            await run;
        },
        [enabled, items],
    );

    async function respond(action: InvitationAction) {
        if (!invitation || respondRef.current) return;
        respondRef.current = true;
        setResponding(action);
        try {
            await api.patch(
                `/projects/${encodeURIComponent(invitation.projectId)}/allocats/invite/${action}`,
                {},
                { withCredentials: true },
            );
            if (alive.current) {
                setInvitation(null);
                window.dispatchEvent(new Event("allocatr:projects-updated"));
            }
        } catch {
            if (alive.current)
                setError(
                    "The invitation could not be updated. It may have already been answered or removed.",
                );
        } finally {
            respondRef.current = false;
            if (alive.current) setResponding(null);
        }
    }

    return (
        <Context.Provider
            value={{
                items,
                unreadCount,
                loading,
                busy,
                error,
                hasMore: Boolean(nextCursor),
                refresh,
                loadMore,
                markRead: (item) => updateRead(item),
                markAllRead: () => updateRead(),
                reviewInvitation: (item) => {
                    setError(null);
                    setInvitation(item);
                },
            }}
        >
            {children}
            {invitation && (
                <ProjectInvitationDialog
                    project={{
                        id: invitation.projectId,
                        title: invitation.projectTitle,
                    }}
                    open
                    onOpenChange={(open) => {
                        if (!open && !respondRef.current) {
                            setInvitation(null);
                            setError(null);
                        }
                    }}
                    responding={responding}
                    onAccept={() => respond("accept")}
                    onDecline={() => respond("decline")}
                />
            )}
            {invitation && error && (
                <p
                    role="alert"
                    className="fixed bottom-4 left-1/2 z-[100] w-[calc(100%-2rem)] max-w-md -translate-x-1/2 rounded-lg border border-border bg-popover p-4 text-sm text-destructive"
                >
                    {error}
                </p>
            )}
        </Context.Provider>
    );
}

export function useNotifications() {
    const value = useContext(Context);
    if (!value)
        throw new Error(
            "NotificationProvider must be inside AuthProvider and wrap the router.",
        );
    return value;
}
