import { useCallback, useEffect, useRef, useState } from "react";
import { Link, Navigate, useNavigate, useSearchParams } from "react-router-dom";
import { isAxiosError } from "axios";
import {
  AlertCircleIcon,
  LoaderCircleIcon,
  LogOutIcon,
  MailCheckIcon,
  PawPrintIcon,
  RefreshCwIcon,
} from "lucide-react";
import api from "@/api/axios";
import { useAuth } from "@/auth/useAuth";
import {
  nextAccountPath,
  rememberReturnTo,
  rememberedReturnTo,
  safeReturnTo,
  withReturnTo,
} from "@/auth/onboarding";
import { Button } from "@/components/ui/button";
import {
  primaryActionButton,
  secondaryActionButton,
  resultsControlFocus,
} from "@/components/allocat-results-theme";
import lightLogo from "@/assets/allocatr-dark-02.svg";
import darkLogo from "@/assets/allocatr-neg-light.svg";

const action =
  "h-auto min-h-11 whitespace-normal rounded-lg px-5 py-3 text-xs font-semibold shadow-none " +
  resultsControlFocus;
function apiMessage(error: unknown, fallback: string) {
  return isAxiosError(error) &&
    typeof error.response?.data?.message === "string"
    ? error.response.data.message
    : fallback;
}
function readDeadline(key: string): number {
  try {
    const value = Number(sessionStorage.getItem(key));
    return Number.isFinite(value) ? Math.max(0, value) : 0;
  } catch {
    return 0;
  }
}

export default function CheckEmail() {
  const { user, loading, refreshUser, logout, registrationDelivery } =
    useAuth();
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const returnTo = safeReturnTo(params.get("returnTo"));
  const [sending, setSending] = useState(false);
  const [checking, setChecking] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [deadline, setDeadline] = useState(0);
  const [now, setNow] = useState(Date.now());
  const checkingRef = useRef(false);
  const sendingRef = useRef(false);
  const mounted = useRef(true);
  const key = user ? `allocatr:verification-cooldown:${user.userId}` : "";
  const remaining = Math.max(0, Math.ceil((deadline - now) / 1000));

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);
  useEffect(() => {
    if (!user || !key) return;
    rememberReturnTo(user.userId, returnTo);
    let value = readDeadline(key);
    if (!value && registrationDelivery === "sent") value = Date.now() + 60_000;
    setDeadline(value);
    try {
      if (value) sessionStorage.setItem(key, String(value));
    } catch {
      /* Server enforces throttling. */
    }
  }, [user?.userId, key, returnTo, registrationDelivery]);
  useEffect(() => {
    if (deadline <= Date.now()) return;
    setNow(Date.now());
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, [deadline]);

  const checkStatus = useCallback(
    async (manual = false) => {
      if (!user || checkingRef.current) return;
      checkingRef.current = true;
      if (manual) {
        setChecking(true);
        setError(null);
        setNotice(null);
      }
      try {
        const current = await refreshUser();
        if (!mounted.current) return;
        if (!current) {
          navigate(withReturnTo("/login", returnTo), { replace: true });
        } else if (current.emailConfirmed) {
          navigate(nextAccountPath(current, returnTo), { replace: true });
        } else if (manual) {
          setNotice(
            "Not confirmed yet. Open the verification link in your email, then check again.",
          );
        }
      } catch (error) {
        if (manual && mounted.current)
          setError(
            apiMessage(
              error,
              "We couldn't check your email status. Please try again.",
            ),
          );
      } finally {
        checkingRef.current = false;
        if (mounted.current) setChecking(false);
      }
    },
    [user?.userId, refreshUser, navigate, returnTo],
  );

  useEffect(() => {
    if (!user || user.emailConfirmed) return;
    const onFocus = () => {
      void checkStatus();
    };
    const onVisibility = () => {
      if (document.visibilityState === "visible") void checkStatus();
    };
    window.addEventListener("focus", onFocus);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      window.removeEventListener("focus", onFocus);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [user?.userId, user?.emailConfirmed, checkStatus]);

  async function resend() {
    if (!user || sendingRef.current || deadline > Date.now()) return;
    sendingRef.current = true;
    setSending(true);
    setError(null);
    setNotice(null);
    try {
      const response = await api.post<{
        alreadyVerified: boolean;
        retryAfterSeconds?: number;
      }>("/auth/email-verification", {}, { withCredentials: true });
      if (!mounted.current) return;
      if (response.data.alreadyVerified) {
        await checkStatus(true);
        return;
      }
      const seconds = Math.max(
        60,
        Number(response.data.retryAfterSeconds) || 60,
      );
      const next = Date.now() + seconds * 1000;
      setDeadline(next);
      setNow(Date.now());
      setSent(true);
      try {
        sessionStorage.setItem(key, String(next));
      } catch {
        /* Optional UX persistence. */
      }
      setNotice(
        "A fresh link is on its way. Check your inbox and spam folder.",
      );
    } catch (error) {
      if (!mounted.current) return;
      if (isAxiosError(error) && error.response?.status === 429) {
        const seconds =
          Number(error.response.data?.retryAfterSeconds) ||
          Number(error.response.headers?.["retry-after"]) ||
          60;
        const next = Date.now() + Math.max(1, seconds) * 1000;
        setDeadline(next);
        setNow(Date.now());
        try {
          sessionStorage.setItem(key, String(next));
        } catch {
          /* Optional. */
        }
      }
      setError(
        apiMessage(
          error,
          "We couldn't send your verification email. Please try again shortly.",
        ),
      );
    } finally {
      sendingRef.current = false;
      if (mounted.current) setSending(false);
    }
  }

  if (loading)
    return (
      <p role="status" className="p-6 text-sm text-muted-foreground">
        Loading your account…
      </p>
    );
  if (!user) return <Navigate to={withReturnTo("/login", returnTo)} replace />;
  if (user.emailConfirmed)
    return <Navigate to={nextAccountPath(user, returnTo)} replace />;
  const target = returnTo ?? rememberedReturnTo(user.userId);

  return (
    <main className="flex min-h-[100svh] items-center justify-center bg-surface-2/55 px-3 py-4 text-foreground sm:px-6 sm:py-8 dark:bg-background">
      <section
        aria-labelledby="check-email-title"
        className="flex min-h-[calc(100svh-2rem)] w-full max-w-[720px] flex-col items-center rounded-3xl border border-border/40 bg-card px-5 py-7 text-center sm:min-h-[680px] sm:px-12 sm:py-9 dark:border-border"
      >
        <Link
          to="/"
          aria-label="Allocatr home"
          className={`inline-flex rounded-md ${resultsControlFocus}`}
        >
          <img
            src={lightLogo}
            alt="Allocatr"
            className="h-7 w-auto dark:hidden"
          />
          <img
            src={darkLogo}
            alt="Allocatr"
            className="hidden h-7 w-auto dark:block"
          />
        </Link>
        <div className="flex w-full flex-1 flex-col items-center justify-center py-12 sm:py-16">
          <p className="text-[0.58rem] font-semibold uppercase tracking-[0.17em] text-brand-secondary-highlight dark:text-secondary">
            Email verification
          </p>
          <h1
            id="check-email-title"
            className="mt-3 text-3xl font-semibold leading-tight tracking-[-0.035em] text-foreground/85 sm:text-4xl"
          >
            You’ve got meow.
          </h1>
          <div
            aria-hidden="true"
            className="mt-9 flex h-28 w-28 items-center justify-center rounded-full bg-brand-secondary-highlight/[0.08] text-brand-secondary-highlight dark:bg-secondary/[0.08] dark:text-secondary"
          >
            <MailCheckIcon size={48} strokeWidth={1.5} />
          </div>
          <p className="mt-7 max-w-sm text-sm leading-7 text-muted-foreground">
            Confirm your email address to{" "}
            {user.isAllocat
              ? "start setting up your professional profile"
              : "continue to your workspace"}
            .
          </p>
          <p className="mt-2 max-w-full break-all text-sm font-semibold text-foreground/85">
            {user.email}
          </p>
          <p className="mt-3 max-w-sm text-xs leading-6 text-muted-foreground">
            Open the verification link in your inbox. If it’s hiding, check your
            spam or junk folder.
          </p>
          {registrationDelivery === "failed" && !sent && (
            <p
              role="status"
              className="mt-4 max-w-sm text-xs leading-6 text-status-pending-foreground"
            >
              Your account is saved. We couldn’t send the first email—use Resend
              email below.
            </p>
          )}
          {notice && (
            <p
              role="status"
              className="mt-4 max-w-sm text-xs leading-6 text-muted-foreground"
            >
              {notice}
            </p>
          )}
          {error && (
            <p
              role="alert"
              className="mt-4 flex max-w-sm items-start gap-2 text-left text-xs leading-6 text-destructive"
            >
              <AlertCircleIcon
                size={14}
                className="mt-1 shrink-0"
                aria-hidden="true"
              />
              {error}
            </p>
          )}
          <div className="mt-7 flex w-full flex-col justify-center gap-2 sm:w-auto sm:flex-row sm:flex-wrap">
            <Button
              type="button"
              variant="ghost"
              disabled={checking || signingOut || sending}
              onClick={() => void checkStatus(true)}
              className={`${action} ${primaryActionButton}`}
            >
              {checking && (
                <LoaderCircleIcon
                  size={14}
                  className="animate-spin motion-reduce:animate-none"
                  aria-hidden="true"
                />
              )}
              I’ve verified my email
            </Button>
            <Button
              type="button"
              variant="outline"
              disabled={sending || checking || remaining > 0 || signingOut}
              onClick={() => void resend()}
              className={`${action} ${secondaryActionButton}`}
            >
              {sending ? (
                <LoaderCircleIcon
                  size={14}
                  className="animate-spin motion-reduce:animate-none"
                  aria-hidden="true"
                />
              ) : (
                <RefreshCwIcon size={14} aria-hidden="true" />
              )}
              {sending
                ? "Sending…"
                : remaining > 0
                  ? `Resend in ${remaining}s`
                  : "Resend email"}
            </Button>
          </div>
          <p className="mt-5 inline-flex items-center gap-2 text-[11px] text-muted-foreground">
            <PawPrintIcon
              size={12}
              className="text-brand-secondary-highlight dark:text-secondary"
              aria-hidden="true"
            />
            One small paw-step before you’re in.
          </p>
          <button
            type="button"
            disabled={signingOut || sending || checking}
            onClick={async () => {
              setSigningOut(true);
              setError(null);
              try {
                await logout();
                navigate(withReturnTo("/login", target), { replace: true });
              } catch {
                setError("We couldn't sign you out. Please try again.");
              } finally {
                if (mounted.current) setSigningOut(false);
              }
            }}
            className={`mt-6 inline-flex min-h-9 items-center gap-2 rounded-md px-2 text-xs text-muted-foreground hover:text-foreground disabled:opacity-50 ${resultsControlFocus}`}
          >
            <LogOutIcon size={13} aria-hidden="true" />
            {signingOut ? "Signing out…" : "Use another account"}
          </button>
        </div>
        <p className="text-[10px] font-medium uppercase tracking-[0.12em] text-muted-foreground/65">
          Work, properly allocated
        </p>
      </section>
    </main>
  );
}
