import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { isAxiosError } from "axios";
import {
    AlertCircleIcon,
    CheckIcon,
    LoaderCircleIcon,
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
    "verifying" | "verified" | "already-verified" | "error";
type ConfirmEmailResponse = { message: string; alreadyVerified: boolean };

const actionClass =
    "min-h-11 w-full whitespace-normal rounded-lg px-4 py-2.5 text-xs font-semibold shadow-none transition-colors duration-150 motion-reduce:transition-none sm:w-auto " +
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
                setMessage(
                    "Your email address has been successfully verified.",
                );
            }

            // Session refresh must not turn a successful confirmation into a failure.
            window.history.replaceState({}, document.title, "/verify-email");
            try {
                await refreshUser();
            } catch {
                // Continue resolves through RequireAuth.
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
    const destination = user
        ? failed
            ? withReturnTo("/check-email", returnTo)
            : nextAccountPath(user, returnTo)
        : withReturnTo("/login", returnTo);

    return (
        <main className="flex min-h-[100svh] items-center justify-center bg-surface-2/40 px-5 py-10 text-foreground dark:bg-background">
            <div className="w-full max-w-[420px]">
                <Link
                    to="/"
                    aria-label="Allocatr home"
                    className={`mx-auto mb-7 flex w-fit items-center rounded-md transition-opacity hover:opacity-80 motion-reduce:transition-none ${resultsControlFocus}`}
                >
                    <img
                        src={allocatrLogoDark}
                        alt="Allocatr"
                        className="h-6 w-auto max-w-[120px] object-contain dark:hidden"
                    />
                    <img
                        src={allocatrLogoLight}
                        alt="Allocatr"
                        className="hidden h-6 w-auto max-w-[120px] object-contain dark:block"
                    />
                </Link>

                <section
                    aria-labelledby="verification-title"
                    aria-busy={verifying}
                    className="rounded-2xl border border-border/60 bg-card px-6 py-8 text-center sm:px-8 sm:py-9 dark:border-border"
                >
                    <VerificationMark status={status} />
                    <h1
                        id="verification-title"
                        className="mt-5 break-words text-2xl font-semibold leading-snug tracking-[-0.025em] text-foreground/90"
                    >
                        {title}
                    </h1>
                    <p
                        role={failed ? "alert" : "status"}
                        aria-live={failed ? "assertive" : "polite"}
                        aria-atomic="true"
                        className="mt-2 break-words text-sm leading-6 text-muted-foreground"
                    >
                        {completed
                            ? "You can now continue to Allocatr."
                            : message}
                    </p>

                    {!verifying && (
                        <div className="mt-6 flex flex-col justify-center gap-2 sm:flex-row sm:flex-wrap">
                            <Button
                                asChild
                                className={`${actionClass} ${primaryActionButton}`}
                            >
                                <Link to={destination}>
                                    {user
                                        ? failed
                                            ? "Request a fresh link"
                                            : "Continue"
                                        : failed
                                          ? "Go to sign in"
                                          : "Sign in to continue"}
                                </Link>
                            </Button>
                            {failed && userId && token && (
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => void verifyEmail()}
                                    className={`${actionClass} ${secondaryActionButton}`}
                                >
                                    <RefreshCwIcon
                                        size={13}
                                        aria-hidden="true"
                                    />
                                    Try again
                                </Button>
                            )}
                        </div>
                    )}
                </section>
            </div>
        </main>
    );
}

function VerificationMark({ status }: { status: VerificationState }) {
    const verifying = status === "verifying";
    const failed = status === "error";
    const Icon = verifying
        ? LoaderCircleIcon
        : failed
          ? AlertCircleIcon
          : CheckIcon;

    return (
        <div
            aria-hidden="true"
            className={`mx-auto flex h-11 w-11 items-center justify-center rounded-xl ${
                failed
                    ? "bg-destructive/[0.07] text-destructive"
                    : "bg-brand-secondary-highlight/[0.08] text-brand-secondary-highlight dark:bg-secondary/[0.07] dark:text-secondary"
            }`}
        >
            <Icon
                size={21}
                strokeWidth={verifying || failed ? 1.7 : 2.2}
                className={
                    verifying ? "animate-spin motion-reduce:animate-none" : ""
                }
            />
        </div>
    );
}
