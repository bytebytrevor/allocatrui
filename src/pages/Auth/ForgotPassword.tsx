import { useEffect, useRef, useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { isAxiosError } from "axios";
import { LoaderCircleIcon, MailCheckIcon } from "lucide-react";
import * as z from "zod";
import api from "@/api/axios";
import PasswordRecoveryLayout, {
  recoveryButton,
  recoveryInput,
  recoveryLink,
} from "@/components/PasswordRecoveryLayout";
const emailSchema = z
  .string()
  .trim()
  .email("Enter a valid email address.")
  .max(254);
export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [sentTo, setSentTo] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [deadline, setDeadline] = useState(0);
  const [now, setNow] = useState(Date.now());
  const request = useRef<AbortController | null>(null);
  const remaining = Math.max(0, Math.ceil((deadline - now) / 1000));
  useEffect(() => () => request.current?.abort(), []);
  useEffect(() => {
    if (deadline <= Date.now()) return;
    setNow(Date.now());
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, [deadline]);
  async function send(event?: FormEvent) {
    event?.preventDefault();
    if (request.current || deadline > Date.now()) return;
    const parsed = emailSchema.safeParse(sentTo ?? email);
    if (!parsed.success) {
      setError("Enter a valid email address.");
      return;
    }
    const controller = new AbortController();
    request.current = controller;
    setBusy(true);
    setError(null);
    try {
      await api.post(
        "/auth/forgot-password",
        { email: parsed.data },
        { withCredentials: true, signal: controller.signal },
      );
      if (controller.signal.aborted) return;
      setSentTo(parsed.data);
      setDeadline(Date.now() + 60000);
    } catch (failure) {
      if (controller.signal.aborted) return;
      if (isAxiosError(failure) && failure.response?.status === 429) {
        const raw = Number(
          failure.response.data?.retryAfterSeconds ??
            failure.response.headers?.["retry-after"] ??
            60,
        );
        const seconds = Number.isFinite(raw)
          ? Math.min(3600, Math.max(1, raw))
          : 60;
        setDeadline(Date.now() + seconds * 1000);
        setError("Please wait a moment before requesting another link.");
      } else setError("We couldn’t request a reset link. Please try again.");
    } finally {
      if (request.current === controller) request.current = null;
      if (!controller.signal.aborted) setBusy(false);
    }
  }
  return (
    <PasswordRecoveryLayout
      title={sentTo ? "Check your inbox." : "Forgot your password?"}
      description={
        sentTo
          ? "If an account uses that email address, a password reset link will be sent."
          : "Enter your email address and we’ll help you get back into your workspace."
      }
    >
      {sentTo ? (
        <div>
          <MailCheckIcon
            size={25}
            aria-hidden="true"
            className="mb-4 text-brand-primary"
          />
          <p className="break-words text-sm leading-6 text-foreground/85">
            {sentTo}
          </p>
          <p className="mt-3 text-xs leading-6 text-muted-foreground">
            Check your spam folder too. The reset link expires after one hour.
          </p>
          <button
            type="button"
            onClick={() => void send()}
            disabled={busy || remaining > 0}
            className={`${recoveryButton} mt-6`}
          >
            {busy ? (
              <LoaderCircleIcon
                size={15}
                aria-hidden="true"
                className="animate-spin motion-reduce:animate-none"
              />
            ) : null}
            {remaining ? `Send again in ${remaining}s` : "Send another link"}
          </button>
          <button
            type="button"
            disabled={busy}
            onClick={() => {
              setSentTo(null);
              setError(null);
            }}
            className={`${recoveryLink} mt-4`}
          >
            Use another email address
          </button>
        </div>
      ) : (
        <form onSubmit={send} noValidate aria-busy={busy}>
          <label
            htmlFor="recovery-email"
            className="mb-2 block text-xs font-medium"
          >
            Email address
          </label>
          <input
            id="recovery-email"
            type="email"
            autoComplete="email"
            inputMode="email"
            maxLength={254}
            required
            value={email}
            disabled={busy}
            onChange={(event) => {
              setEmail(event.target.value);
              setError(null);
            }}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? "recovery-error" : undefined}
            className={recoveryInput}
            placeholder="you@example.com"
          />
          <button
            type="submit"
            disabled={busy || remaining > 0}
            className={`${recoveryButton} mt-5`}
          >
            {busy ? (
              <LoaderCircleIcon
                size={15}
                aria-hidden="true"
                className="animate-spin motion-reduce:animate-none"
              />
            ) : null}
            {busy
              ? "Requesting link…"
              : remaining
                ? `Try again in ${remaining}s`
                : "Send reset link"}
          </button>
        </form>
      )}
      {error && (
        <p
          id="recovery-error"
          role="alert"
          className="mt-4 text-xs leading-6 text-[var(--login-error)]"
        >
          {error}
        </p>
      )}
      <p className="mt-6">
        <Link to="/login" className={recoveryLink}>
          Back to sign in
        </Link>
      </p>
    </PasswordRecoveryLayout>
  );
}
