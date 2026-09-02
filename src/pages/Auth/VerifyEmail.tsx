import api from "@/api/axios";
import { useAuth } from "@/auth/useAuth";

import { Button } from "@/components/ui/button";

import {
  AlertCircleIcon,
  BadgeCheckIcon,
  CheckCircle2Icon,
  LoaderCircleIcon,
  LogInIcon,
  RefreshCwIcon,
} from "lucide-react";

import { isAxiosError } from "axios";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import {
  Link,
  useSearchParams,
} from "react-router";

/* =========================================================
   TYPES
========================================================= */

type VerificationState =
  | "verifying"
  | "verified"
  | "already-verified"
  | "error";

type ConfirmEmailResponse = {
  message: string;
  alreadyVerified: boolean;
};

/* =========================================================
   HELPERS
========================================================= */

function getApiErrorMessage(
  error: unknown,
  fallback: string,
) {
  if (
    isAxiosError(error) &&
    typeof error.response?.data?.message === "string"
  ) {
    return error.response.data.message;
  }

  return fallback;
}

/* =========================================================
   PAGE
========================================================= */

export default function VerifyEmail() {
  const { user, refreshUser } = useAuth();

  const [searchParams] = useSearchParams();

  const userId = searchParams.get("userId");
  const token = searchParams.get("token");

  const hasStarted = useRef(false);

  const [status, setStatus] =
    useState<VerificationState>("verifying");

  const [message, setMessage] = useState(
    "We're confirming your email address.",
  );

  /* =======================================================
     VERIFY
  ======================================================= */

  const verifyEmail = useCallback(async () => {
    if (!userId || !token) {
      setStatus("error");

      setMessage(
        "This verification link is incomplete or invalid.",
      );

      return;
    }

    try {
      setStatus("verifying");

      setMessage(
        "We're confirming your email address.",
      );

      const response =
        await api.post<ConfirmEmailResponse>(
          "/auth/confirm-email",
          {
            userId,
            token,
          },
          {
            withCredentials: true,
          },
        );

      if (response.data.alreadyVerified) {
        setStatus("already-verified");

        setMessage(
          "Your email address has already been verified.",
        );
      } else {
        setStatus("verified");

        setMessage(
          "Your email address has been successfully verified.",
        );
      }

      /*
       * If the user still has an active Allocatr session,
       * refresh global authentication state.
       *
       * If they are not signed in, refreshUser simply leaves
       * AuthContext unauthenticated.
       */
      await refreshUser();

      /*
       * Remove the token from the visible browser URL after
       * successful verification.
       *
       * There is no reason to leave a security token sitting
       * in browser history longer than necessary.
       */
      window.history.replaceState(
        {},
        document.title,
        "/verify-email",
      );
    } catch (error) {
      console.error(
        "Could not verify email:",
        error,
      );

      setStatus("error");

      setMessage(
        getApiErrorMessage(
          error,
          "Your verification link could not be confirmed. It may have expired.",
        ),
      );
    }
  }, [userId, token, refreshUser]);

  /* =======================================================
     AUTO VERIFY
  ======================================================= */

  useEffect(() => {
    /*
     * React StrictMode can run effects twice in development.
     * This guard prevents us from submitting the same token
     * twice unnecessarily.
     */
    if (hasStarted.current) {
      return;
    }

    hasStarted.current = true;

    void verifyEmail();
  }, [verifyEmail]);

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-5 py-16 text-foreground">
      <div className="w-full max-w-md">
        {/* =================================================
            BRAND
        ================================================= */}

        <div className="mb-10 text-center">
          <p className="text-xl font-black tracking-[-0.04em]">
            Allocatr
          </p>
        </div>

        {/* =================================================
            VERIFYING
        ================================================= */}

        {status === "verifying" && (
          <section className="text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/[0.07] text-primary">
              <LoaderCircleIcon
                size={24}
                className="animate-spin"
              />
            </div>

            <p className="mt-7 text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-primary">
              Email verification
            </p>

            <h1 className="mt-2 text-2xl font-black tracking-[-0.035em] sm:text-3xl">
              Verifying your email
            </h1>

            <p className="mx-auto mt-3 max-w-sm text-sm leading-7 text-muted-foreground">
              {message}
            </p>
          </section>
        )}

        {/* =================================================
            VERIFIED
        ================================================= */}

        {status === "verified" && (
          <section className="text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-400/[0.08] text-emerald-600 dark:text-emerald-300">
              <CheckCircle2Icon size={25} />
            </div>

            <p className="mt-7 text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-emerald-600 dark:text-emerald-300">
              Verification complete
            </p>

            <h1 className="mt-2 text-2xl font-black tracking-[-0.035em] sm:text-3xl">
              Email verified
            </h1>

            <p className="mx-auto mt-3 max-w-sm text-sm leading-7 text-muted-foreground">
              {message}
            </p>

            <div className="mt-8">
              {user ? (
                <Button
                  asChild
                  className="h-11 rounded-lg px-5 text-xs font-semibold shadow-none"
                >
                  <Link to="/profile">
                    <BadgeCheckIcon size={14} />
                    Return to profile
                  </Link>
                </Button>
              ) : (
                <Button
                  asChild
                  className="h-11 rounded-lg px-5 text-xs font-semibold shadow-none"
                >
                  <Link to="/login">
                    <LogInIcon size={14} />
                    Sign in to Allocatr
                  </Link>
                </Button>
              )}
            </div>
          </section>
        )}

        {/* =================================================
            ALREADY VERIFIED
        ================================================= */}

        {status === "already-verified" && (
          <section className="text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-400/[0.08] text-emerald-600 dark:text-emerald-300">
              <BadgeCheckIcon size={25} />
            </div>

            <p className="mt-7 text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-emerald-600 dark:text-emerald-300">
              Account verified
            </p>

            <h1 className="mt-2 text-2xl font-black tracking-[-0.035em] sm:text-3xl">
              You're already verified
            </h1>

            <p className="mx-auto mt-3 max-w-sm text-sm leading-7 text-muted-foreground">
              {message}
            </p>

            <div className="mt-8">
              {user ? (
                <Button
                  asChild
                  className="h-11 rounded-lg px-5 text-xs font-semibold shadow-none"
                >
                  <Link to="/profile">
                    Return to profile
                  </Link>
                </Button>
              ) : (
                <Button
                  asChild
                  className="h-11 rounded-lg px-5 text-xs font-semibold shadow-none"
                >
                  <Link to="/login">
                    <LogInIcon size={14} />
                    Sign in
                  </Link>
                </Button>
              )}
            </div>
          </section>
        )}

        {/* =================================================
            ERROR
        ================================================= */}

        {status === "error" && (
          <section className="text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-destructive/[0.07] text-destructive">
              <AlertCircleIcon size={25} />
            </div>

            <p className="mt-7 text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-destructive">
              Verification failed
            </p>

            <h1 className="mt-2 text-2xl font-black tracking-[-0.035em] sm:text-3xl">
              We couldn't verify this link
            </h1>

            <p className="mx-auto mt-3 max-w-sm text-sm leading-7 text-muted-foreground">
              {message}
            </p>

            <div className="mt-8 flex flex-col justify-center gap-2 sm:flex-row">
              {userId && token && (
                <Button
                  type="button"
                  onClick={() => void verifyEmail()}
                  variant="outline"
                  className="h-11 rounded-lg bg-transparent px-5 text-xs font-semibold shadow-none"
                >
                  <RefreshCwIcon size={14} />
                  Try again
                </Button>
              )}

              <Button
                asChild
                className="h-11 rounded-lg px-5 text-xs font-semibold shadow-none"
              >
                <Link
                  to={
                    user
                      ? "/profile"
                      : "/login"
                  }
                >
                  {user
                    ? "Return to profile"
                    : "Go to sign in"}
                </Link>
              </Button>
            </div>

            {user && (
              <p className="mx-auto mt-6 max-w-sm text-[0.68rem] leading-5 text-muted-foreground">
                If the link has expired, return to your profile
                and request a new verification email.
              </p>
            )}
          </section>
        )}
      </div>
    </main>
  );
}