import { useEffect, useState } from "react";
import api from "@/api/axios";
import { isAxiosError } from "axios";
const EVENT = "allocatr:messaging-unread";
const epochs = new Map<string, number>();
let nextEpoch = 0;
function key(projectId: string, userId: string) {
  return JSON.stringify([projectId, userId]);
}
export function unreadVersion(projectId: string, userId: string): number {
  const scope = key(projectId, userId);
  let version = epochs.get(scope);
  if (version === undefined) {
    version = ++nextEpoch;
    epochs.set(scope, version);
    if (epochs.size > 100) epochs.delete(epochs.keys().next().value!);
  }
  return version;
}
type UnreadEvent = {
  projectId: string;
  userId: string;
  version: number;
  count?: number;
};
export function invalidateUnread(projectId: string, userId: string): void {
  const version = ++nextEpoch;
  epochs.set(key(projectId, userId), version);
  if (epochs.size > 100) epochs.delete(epochs.keys().next().value!);
  window.dispatchEvent(
    new CustomEvent<UnreadEvent>(EVENT, {
      detail: { projectId, userId, version },
    }),
  );
}
export function publishUnread(
  projectId: string,
  userId: string,
  count: number,
  version: number,
): void {
  if (
    version !== unreadVersion(projectId, userId) ||
    !Number.isSafeInteger(count) ||
    count < 0
  )
    return;
  window.dispatchEvent(
    new CustomEvent<UnreadEvent>(EVENT, {
      detail: { projectId, userId, count, version },
    }),
  );
}
// One Dashboard subscriber. The Messaging page publishes its existing list result,
// so its normal 15-second polling does not also require a badge request.
export function useProjectUnread(
  projectId: string | undefined,
  userId: string | undefined,
  enabled: boolean,
  messagingOpen: boolean,
): number | null {
  const scope = projectId && userId ? key(projectId, userId) : "";
  const [snapshot, setSnapshot] = useState<{
    scope: string;
    count: number | null;
  }>({ scope: "", count: null });
  useEffect(() => {
    setSnapshot((current) =>
      current.scope === scope ? current : { scope, count: null },
    );
    if (!enabled || !projectId || !userId) return;
    let disposed = false;
    let request: AbortController | null = null;
    function refresh(force = false) {
      if (disposed || document.visibilityState !== "visible") return;
      if (request && !force) return;
      request?.abort();
      const controller = new AbortController();
      request = controller;
      const version = unreadVersion(projectId!, userId!);
      void api
        .get<{
          unreadCount: number;
        }>(`/projects/${encodeURIComponent(projectId!)}/conversations`, {
          withCredentials: true,
          signal: controller.signal,
          params: { page: 1, filter: "inbox" },
        })
        .then(({ data }) => {
          if (
            !disposed &&
            !controller.signal.aborted &&
            version === unreadVersion(projectId!, userId!) &&
            Number.isSafeInteger(data.unreadCount) &&
            data.unreadCount >= 0
          )
            setSnapshot({ scope, count: data.unreadCount });
        })
        .catch((error) => {
          if (
            !disposed &&
            !controller.signal.aborted &&
            isAxiosError(error) &&
            [401, 403, 404].includes(error.response?.status ?? 0)
          ) {
            epochs.set(scope, ++nextEpoch); // Reject older in-flight page totals after access denial.
            setSnapshot({ scope, count: null });
          }
          // Transient failures retain the last confirmed total; never pretend it is zero.
        })
        .finally(() => {
          if (request === controller) request = null;
        });
    }
    function changed(event: Event) {
      const data = (event as CustomEvent<UnreadEvent>).detail;
      if (
        !data ||
        data.projectId !== projectId ||
        data.userId !== userId ||
        data.version !== unreadVersion(projectId!, userId!)
      )
        return;
      if (
        data.count !== undefined &&
        Number.isSafeInteger(data.count) &&
        data.count >= 0
      ) {
        request?.abort();
        request = null;
        setSnapshot({ scope, count: data.count });
      } else refresh(true);
    }
    function visible() {
      if (document.visibilityState === "visible") refresh();
    }
    window.addEventListener(EVENT, changed);
    window.addEventListener("focus", visible);
    document.addEventListener("visibilitychange", visible);
    refresh();
    const timer = window.setInterval(() => {
      if (!messagingOpen) refresh();
    }, 30000);
    return () => {
      disposed = true;
      request?.abort();
      window.clearInterval(timer);
      window.removeEventListener(EVENT, changed);
      window.removeEventListener("focus", visible);
      document.removeEventListener("visibilitychange", visible);
    };
  }, [projectId, userId, enabled, messagingOpen, scope]);
  return enabled && snapshot.scope === scope ? snapshot.count : null;
}
