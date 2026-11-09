import type { User } from "@/Types/user";

const ORIGIN = "https://allocatr.invalid";
export function safeReturnTo(value: string | null | undefined): string | null {
  if (
    !value ||
    !value.startsWith("/") ||
    value.startsWith("//") ||
    /[\\\u0000-\u001f]/.test(value)
  )
    return null;
  try {
    const url = new URL(value, ORIGIN);
    const path = decodeURIComponent(url.pathname);
    if (
      url.origin !== ORIGIN ||
      path.startsWith("//") ||
      /[\\\u0000-\u001f]/.test(path) ||
      /^\/(?:login|register|check-email|verify-email)(?:\/|$)/i.test(path) ||
      /^\/allocats\/profile\/create(?:\/|$)/i.test(path)
    )
      return null;
    return `${url.pathname}${url.search}${url.hash}`;
  } catch {
    return null;
  }
}
export function withReturnTo(path: string, target?: string | null): string {
  const safe = safeReturnTo(target);
  return safe ? `${path}?returnTo=${encodeURIComponent(safe)}` : path;
}
export function rememberReturnTo(userId: string, target: string | null): void {
  const safe = safeReturnTo(target);
  if (!safe) return;
  try {
    sessionStorage.setItem(`allocatr:onboarding:${userId}`, safe);
  } catch {
    /* Storage can be disabled. */
  }
}
export function rememberedReturnTo(userId: string): string | null {
  try {
    return safeReturnTo(
      sessionStorage.getItem(`allocatr:onboarding:${userId}`),
    );
  } catch {
    return null;
  }
}
export function clearReturnTo(userId: string): void {
  try {
    sessionStorage.removeItem(`allocatr:onboarding:${userId}`);
  } catch {
    /* Optional storage. */
  }
}
export function nextAccountPath(user: User, returnTo?: string | null): string {
  const target = safeReturnTo(returnTo) ?? rememberedReturnTo(user.userId);
  if (!user.emailConfirmed) return withReturnTo("/check-email", target);
  if (user.isAllocat && !user.hasAllocatProfile)
    return withReturnTo("/allocats/profile/create", target);
  return target ?? "/projects";
}
