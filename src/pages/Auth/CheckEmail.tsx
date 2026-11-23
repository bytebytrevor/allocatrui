import { useCallback, useEffect, useRef, useState } from "react";
import { Link, Navigate, useNavigate, useSearchParams } from "react-router-dom";
import { isAxiosError } from "axios";
import {
  AlertCircleIcon,
  LoaderCircleIcon,
  MailCheckIcon,
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
  "min-h-11 w-full whitespace-normal rounded-lg px-4 py-2.5 text-xs font-semibold shadow-none sm:w-auto " +
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
    <main className="flex min-h-[100svh] items-center justify-center bg-surface-2/40 px-5 py-10 text-foreground dark:bg-background">
      <div className="w-full max-w-[420px]">
        <Link
          to="/"
          aria-label="Allocatr home"
          className={`mx-auto mb-7 flex w-fit items-center rounded-md transition-opacity hover:opacity-80 motion-reduce:transition-none ${resultsControlFocus}`}
        >
          <img
            src={lightLogo}
            alt="Allocatr"
            className="h-6 w-auto max-w-[120px] object-contain dark:hidden"
          />
          <img
            src={darkLogo}
            alt="Allocatr"
            className="hidden h-6 w-auto max-w-[120px] object-contain dark:block"
          />
        </Link>

        <section
          aria-labelledby="check-email-title"
          className="rounded-2xl border border-border/60 bg-card px-6 py-8 text-center sm:px-8 sm:py-9 dark:border-border"
        >
          <div
            aria-hidden="true"
            className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-brand-secondary-highlight/[0.08] text-brand-secondary-highlight dark:bg-secondary/[0.07] dark:text-secondary"
          >
            <MailCheckIcon size={21} strokeWidth={1.7} />
          </div>
          <h1
            id="check-email-title"
            className="mt-5 text-2xl font-semibold leading-snug tracking-[-0.025em] text-foreground/90"
          >
            Check your email
          </h1>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Open the verification link for
          </p>
          <p className="mt-1 break-all text-sm font-medium leading-6 text-foreground/85">
            {user.email}
          </p>
          <p className="mt-3 text-xs leading-5 text-muted-foreground">
            Can’t find it? Check your spam or junk folder.
          </p>

          {error ? (
            <p
              role="alert"
              className="mt-4 flex items-start justify-center gap-2 text-left text-xs leading-6 text-destructive"
            >
              <AlertCircleIcon
                size={14}
                className="mt-1 shrink-0"
                aria-hidden="true"
              />
              {error}
            </p>
          ) : notice ? (
            <p
              role="status"
              className="mt-4 text-xs leading-6 text-muted-foreground"
            >
              {notice}
            </p>
          ) : registrationDelivery === "failed" && !sent ? (
            <p
              role="status"
              className="mt-4 text-xs leading-6 text-status-pending-foreground"
            >
              Your account is saved. The email couldn’t be sent. Select Resend
              email to try again.
            </p>
          ) : null}

          <div className="mt-6 flex flex-col justify-center gap-2 sm:flex-row sm:flex-wrap">
            <Button
              type="button"
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
                <RefreshCwIcon size={13} aria-hidden="true" />
              )}
              {sending
                ? "Sending…"
                : remaining > 0
                  ? `Resend in ${remaining}s`
                  : "Resend email"}
            </Button>
          </div>
        </section>

        <div className="mt-3 text-center">
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
            className={`inline-flex min-h-11 items-center justify-center rounded-md px-2 text-xs text-muted-foreground transition-colors hover:text-foreground disabled:opacity-50 motion-reduce:transition-none ${resultsControlFocus}`}
          >
            {signingOut ? "Signing out…" : "Use another account"}
          </button>
        </div>
      </div>
    </main>
  );
}
