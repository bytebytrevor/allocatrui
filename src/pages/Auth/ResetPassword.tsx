import { useEffect, useRef, useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { isAxiosError } from "axios";
import {
  CheckCircle2Icon,
  EyeIcon,
  EyeOffIcon,
  LoaderCircleIcon,
} from "lucide-react";
import api from "@/api/axios";
import PasswordRecoveryLayout, {
  recoveryButton,
  recoveryInput,
  recoveryLink,
} from "@/components/PasswordRecoveryLayout";
function resetLink() {
  const params = new URLSearchParams(
    window.location.hash.slice(1) || window.location.search,
  );
  const userId = params.get("userId") ?? "",
    token = params.get("token") ?? "";
  const valid =
    params.getAll("userId").length === 1 &&
    params.getAll("token").length === 1 &&
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
      userId,
    ) &&
    token.length > 0 &&
    token.length <= 4096 &&
    /^[A-Za-z0-9_-]+$/.test(token);
  return valid ? { userId, token } : null;
}
export default function ResetPassword() {
  const [link] = useState(resetLink);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [invalid, setInvalid] = useState(!link);
  const [done, setDone] = useState(false);
  const [busy, setBusy] = useState(false);
  const request = useRef<AbortController | null>(null);
  useEffect(() => {
    // Keep the token only in this component's memory, never web storage.
    window.history.replaceState(
      window.history.state,
      "",
      window.location.pathname,
    );
    return () => request.current?.abort();
  }, []);
  async function submit(event: FormEvent) {
    event.preventDefault();
    if (request.current || !link || invalid || done) return;
    if (
      password.length < 8 ||
      password.length > 128 ||
      !/[a-z]/.test(password) ||
      !/[A-Z]/.test(password) ||
      !/[0-9]/.test(password)
    ) {
      setError(
        "Use at least 8 characters, including uppercase and lowercase letters and a number.",
      );
      return;
    }
    if (password !== confirm) {
      setError("Your passwords don’t match.");
      return;
    }
    const controller = new AbortController();
    request.current = controller;
    setBusy(true);
    setError(null);
    try {
      await api.post(
        "/auth/reset-password",
        { ...link, password },
        { withCredentials: true, signal: controller.signal },
      );
      if (!controller.signal.aborted) {
        setPassword("");
        setConfirm("");
        setDone(true);
      }
    } catch (failure) {
      if (controller.signal.aborted) return;
      if (
        isAxiosError(failure) &&
        failure.response?.data?.code === "invalid_reset_link"
      )
        setInvalid(true);
      else if (
        isAxiosError(failure) &&
        failure.response?.data?.code === "password_requirements"
      )
        setError(
          "The password does not meet the account requirements. Try a longer password with uppercase and lowercase letters and a number.",
        );
      else if (isAxiosError(failure) && failure.response?.status === 429)
        setError("Too many attempts. Wait a moment before trying again.");
      else setError("We couldn’t reset your password. Please try again.");
    } finally {
      if (request.current === controller) request.current = null;
      if (!controller.signal.aborted) setBusy(false);
    }
  }
  return (
    <PasswordRecoveryLayout
      title={
        done
          ? "You’re ready to sign in."
          : invalid
            ? "Let’s get you a new link."
            : "Choose a new password."
      }
      description={
        done
          ? "Your Allocatr password has been reset."
          : invalid
            ? "This reset link is invalid or has expired. Request another link to continue."
            : "Make it a strong one that you don’t use for another account."
      }
    >
      {done ? (
        <div>
          <CheckCircle2Icon
            size={28}
            aria-hidden="true"
            className="mb-5 text-brand-primary"
          />
          <a href="/login" className={recoveryButton}>
            Sign in with your new password
          </a>
        </div>
      ) : invalid ? (
        <Link to="/forgot-password" className={recoveryButton}>
          Request a new reset link
        </Link>
      ) : (
        <form
          onSubmit={submit}
          noValidate
          aria-busy={busy}
          className="space-y-5"
        >
          <div>
            <label
              htmlFor="new-password"
              className="mb-2 block text-xs font-medium"
            >
              New password
            </label>
            <div className="relative">
              <input
                id="new-password"
                type={show ? "text" : "password"}
                autoComplete="new-password"
                required
                maxLength={128}
                value={password}
                onChange={(event) => {
                  setPassword(event.target.value);
                  setError(null);
                }}
                disabled={busy}
                aria-describedby="password-guidance"
                className={`${recoveryInput} pr-12`}
              />
              <button
                type="button"
                disabled={busy}
                onClick={() => setShow((current) => !current)}
                aria-label={show ? "Hide password" : "Show password"}
                className="absolute inset-y-0 right-1 flex w-10 items-center justify-center rounded text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary/40"
              >
                {show ? (
                  <EyeOffIcon size={16} aria-hidden="true" />
                ) : (
                  <EyeIcon size={16} aria-hidden="true" />
                )}
              </button>
            </div>
            <p
              id="password-guidance"
              className="mt-2 text-[11px] leading-6 text-muted-foreground"
            >
              8–128 characters, with uppercase and lowercase letters and a
              number.
            </p>
          </div>
          <div>
            <label
              htmlFor="confirm-password"
              className="mb-2 block text-xs font-medium"
            >
              Confirm password
            </label>
            <input
              id="confirm-password"
              type={show ? "text" : "password"}
              autoComplete="new-password"
              required
              maxLength={128}
              value={confirm}
              disabled={busy}
              onChange={(event) => {
                setConfirm(event.target.value);
                setError(null);
              }}
              className={recoveryInput}
            />
          </div>
          {error && (
            <p
              role="alert"
              className="text-xs leading-6 text-[var(--login-error)]"
            >
              {error}
            </p>
          )}
          <button type="submit" disabled={busy} className={recoveryButton}>
            {busy && (
              <LoaderCircleIcon
                size={15}
                aria-hidden="true"
                className="animate-spin motion-reduce:animate-none"
              />
            )}
            {busy ? "Resetting password…" : "Reset password"}
          </button>
        </form>
      )}
      {!done && (
        <p className="mt-6">
          <Link to="/login" className={recoveryLink}>
            Back to sign in
          </Link>
        </p>
      )}
    </PasswordRecoveryLayout>
  );
}
