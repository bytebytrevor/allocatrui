import { useEffect } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "./useAuth";
import {
  clearReturnTo,
  nextAccountPath,
  rememberedReturnTo,
  safeReturnTo,
  withReturnTo,
} from "./onboarding";

export function RequireAuth() {
  const { user, loading } = useAuth();
  const location = useLocation();
  const returnTo = safeReturnTo(
    `${location.pathname}${location.search}${location.hash}`,
  );
  useEffect(() => {
    if (!user?.emailConfirmed || (user.isAllocat && !user.hasAllocatProfile))
      return;
    if (
      rememberedReturnTo(user.userId) ===
      `${location.pathname}${location.search}${location.hash}`
    )
      clearReturnTo(user.userId);
  }, [
    user?.userId,
    user?.emailConfirmed,
    user?.isAllocat,
    user?.hasAllocatProfile,
    location.pathname,
    location.search,
    location.hash,
  ]);
  if (loading)
    return (
      <p role="status" className="p-6 text-sm text-muted-foreground">
        Loading your account…
      </p>
    );
  if (!user) return <Navigate to={withReturnTo("/login", returnTo)} replace />;
  if (!user.emailConfirmed)
    return <Navigate to={withReturnTo("/check-email", returnTo)} replace />;
  if (
    user.isAllocat &&
    !user.hasAllocatProfile &&
    location.pathname !== "/allocats/profile/create"
  )
    return <Navigate to={nextAccountPath(user, returnTo)} replace />;
  return <Outlet />;
}
