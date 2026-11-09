import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { isAxiosError } from "axios";
import {
  AlertCircleIcon,
  BadgeCheckIcon,
  CheckIcon,
  LoaderCircleIcon,
  LogInIcon,
  PawPrintIcon,
  RefreshCwIcon,
} from "lucide-react";
import api from "@/api/axios";
import { useAuth } from "@/auth/useAuth";
import { nextAccountPath, safeReturnTo, withReturnTo } from "@/auth/onboarding";
import { Button } from "@/components/ui/button";
import {
  primaryActionButton,
  secondaryActionButton,
  resultsControlFocus,
} from "@/components/allocat-results-theme";
import allocatrLogoDark from "@/assets/allocatr-dark-02.svg";
import allocatrLogoLight from "@/assets/allocatr-neg-light.svg";

type VerificationState =
  | "verifying"
  | "verified"
  | "already-verified"
  | "error";
type ConfirmEmailResponse = { message: string; alreadyVerified: boolean };

const actionClass =
  "h-auto min-h-11 w-full whitespace-normal rounded-lg px-5 py-3 text-xs font-semibold shadow-none transition-colors duration-150 motion-reduce:transition-none sm:w-auto " +
  resultsControlFocus;

function getApiErrorMessage(error: unknown, fallback: string) {
  if (
    isAxiosError(error) &&
    typeof error.response?.data?.message === "string"
  ) {
    return error.response.data.message;
  }
  return fallback;
}

export default function VerifyEmail() {
  const { user, refreshUser } = useAuth();
  const [searchParams] = useSearchParams();
  const userId = searchParams.get("userId");
  const token = searchParams.get("token");
  const hasStarted = useRef(false);
  const returnTo = safeReturnTo(searchParams.get("returnTo"));
  const [status, setStatus] = useState<VerificationState>("verifying");
  const [message, setMessage] = useState(
    "We're confirming your email address.",
  );

  const verifyEmail = useCallback(async () => {
    if (!userId || !token) {
      setStatus("error");
      setMessage("This verification link is incomplete or invalid.");
      return;
    }

    try {
      setStatus("verifying");
      setMessage("We're confirming your email address.");
      const response = await api.post<ConfirmEmailResponse>(
        "/auth/confirm-email",
        { userId, token },
        { withCredentials: true },
      );

      if (response.data.alreadyVerified) {
        setStatus("already-verified");
        setMessage("Your email address has already been verified.");
      } else {
        setStatus("verified");
        setMessage("Your email address has been successfully verified.");
      }

      // Confirmation succeeded independently of session refresh. A temporary
      // /me failure must not turn a confirmed email into a verification failure.
      window.history.replaceState({}, document.title, "/verify-email");
      try {
        await refreshUser();
      } catch {
        /* Continue resolves through RequireAuth. */
      }
    } catch (error) {
      console.error("Could not verify email:", error);
      setStatus("error");
      setMessage(
        getApiErrorMessage(
          error,
          "Your verification link could not be confirmed. It may have expired.",
        ),
      );
    }
  }, [userId, token, refreshUser]);

  useEffect(() => {
    if (hasStarted.current) return;
    hasStarted.current = true;
    void verifyEmail();
  }, [verifyEmail]);

  const verifying = status === "verifying";
  const failed = status === "error";
  const completed = status === "verified" || status === "already-verified";
  const title = verifying
    ? "Verifying your email"
    : failed
      ? "We couldn't verify this link"
      : status === "already-verified"
        ? "Your email is already verified"
        : "Email verified";
  const eyebrow = verifying
    ? "Email verification"
    : failed
      ? "Verification failed"
      : status === "already-verified"
        ? "Already confirmed"
        : "Verification complete";

  return (
    <main className="flex min-h-[100svh] items-center justify-center bg-surface-2/55 px-3 py-4 text-foreground sm:px-6 sm:py-8 dark:bg-background">
      <section
        aria-labelledby="verification-title"
        aria-busy={verifying}
        className="flex min-h-[calc(100svh-2rem)] w-full max-w-[720px] flex-col items-center rounded-3xl border border-border/40 bg-card px-5 py-7 text-center sm:min-h-[680px] sm:px-12 sm:py-9 dark:border-border"
      >
        <Link
          to="/"
          aria-label="Allocatr home"
          className={`inline-flex shrink-0 rounded-md transition-opacity hover:opacity-80 motion-reduce:transition-none ${resultsControlFocus}`}
        >
          <img
            src={allocatrLogoDark}
            alt="Allocatr"
            className="h-7 w-auto max-w-full object-contain dark:hidden"
          />
          <img
            src={allocatrLogoLight}
            alt="Allocatr"
            className="hidden h-7 w-auto max-w-full object-contain dark:block"
          />
        </Link>

        <div className="flex w-full flex-1 flex-col items-center justify-center pb-8 pt-14 sm:pb-12 sm:pt-16">
          <p
            className={`text-[0.58rem] font-semibold uppercase tracking-[0.17em] ${failed ? "text-destructive" : "text-brand-secondary-highlight dark:text-secondary"}`}
          >
            {eyebrow}
          </p>
          <h1
            id="verification-title"
            className="mt-3 max-w-lg break-words text-3xl font-semibold leading-tight tracking-[-0.035em] text-foreground/85 sm:text-4xl"
          >
            {title}
          </h1>

          <div className="mt-9 sm:mt-11">
            <VerificationMark status={status} />
          </div>

          <div
            role={failed ? "alert" : "status"}
            aria-live={failed ? "assertive" : "polite"}
            aria-atomic="true"
            className="mt-7 max-w-sm"
          >
            <p className="text-base font-semibold leading-7 text-foreground/85">
              {verifying
                ? "Paws at work…"
                : completed
                  ? "Purr-fect. You’re all set."
                  : "A little cat-ch in the link."}
            </p>
            <p className="mt-2 break-words text-sm leading-7 text-muted-foreground">
              {message}
            </p>
          </div>

          {!verifying && (
            <div className="mt-7 flex w-full flex-col justify-center gap-2 sm:w-auto sm:flex-row sm:flex-wrap">
              {failed && userId && token && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => void verifyEmail()}
                  className={`${actionClass} ${secondaryActionButton}`}
                >
                  <RefreshCwIcon size={14} aria-hidden="true" />
                  Try again
                </Button>
              )}
              <Button
                asChild
                variant="ghost"
                className={`${actionClass} ${primaryActionButton}`}
              >
                <Link
                  to={
                    user
                      ? failed
                        ? withReturnTo("/check-email", returnTo)
                        : nextAccountPath(user, returnTo)
                      : withReturnTo("/login", returnTo)
                  }
                >
                  {user ? (
                    <BadgeCheckIcon size={14} aria-hidden="true" />
                  ) : (
                    <LogInIcon size={14} aria-hidden="true" />
                  )}
                  {user
                    ? failed
                      ? "Request a fresh link"
                      : "Continue"
                    : failed
                      ? "Go to sign in"
                      : "Sign in to continue"}
                </Link>
              </Button>
            </div>
          )}

          {failed && user && (
            <p className="mx-auto mt-5 max-w-sm text-xs leading-6 text-muted-foreground">
              If the link has expired, request a fresh verification email from
              the inbox screen.
            </p>
          )}
        </div>

        <p className="text-[10px] font-medium uppercase tracking-[0.12em] text-muted-foreground/65">
          Work, properly allocated
        </p>
      </section>
    </main>
  );
}

function VerificationMark({ status }: { status: VerificationState }) {
  const verifying = status === "verifying";
  const failed = status === "error";
  const Badge = verifying
    ? LoaderCircleIcon
    : failed
      ? AlertCircleIcon
      : CheckIcon;

  return (
    <div aria-hidden="true">
      <div
        className={`mx-auto flex h-32 w-32 items-center justify-center rounded-full sm:h-36 sm:w-36 ${
          failed
            ? "bg-destructive/[0.08] text-destructive ring-1 ring-inset ring-destructive/15"
            : "bg-gradient-to-br from-brand-secondary-highlight via-brand-secondary-highlight to-primary text-primary-foreground dark:from-secondary dark:via-secondary dark:to-brand-secondary-highlight dark:text-secondary-foreground"
        }`}
      >
        <Badge
          size={64}
          strokeWidth={verifying || failed ? 1.8 : 3.5}
          className={verifying ? "animate-spin motion-reduce:animate-none" : ""}
        />
      </div>
      <div className="mt-5 flex justify-center gap-2.5 text-brand-secondary-highlight/50 dark:text-secondary/50">
        {[0, 150, 300].map((delay) => (
          <PawPrintIcon
            key={delay}
            size={12}
            strokeWidth={1.7}
            className={
              verifying ? "animate-pulse motion-reduce:animate-none" : ""
            }
            style={verifying ? { animationDelay: `${delay}ms` } : undefined}
          />
        ))}
      </div>
    </div>
  );
}
