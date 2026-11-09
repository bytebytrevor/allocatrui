import { useEffect, useState, type CSSProperties } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowRightIcon,
  EyeIcon,
  EyeOffIcon,
  LoaderCircleIcon,
  LockKeyholeIcon,
  MailIcon,
} from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";

import { useAuth } from "@/auth/useAuth";
import {
  nextAccountPath,
  rememberReturnTo,
  safeReturnTo,
} from "@/auth/onboarding";
import allocatrLogoLight from "@/assets/allocatr-neg-light.svg";

const LOGIN_CAT_IMAGE =
  "https://images.pexels.com/photos/730896/pexels-photo-730896.jpeg?auto=compress&cs=tinysrgb&w=2400";

const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Email address is required.")
    .email("Enter a valid email address."),
  password: z
    .string()
    .min(1, "Password is required.")
    .min(8, "Password must be at least 8 characters."),
});
type LoginFormValues = z.infer<typeof loginSchema>;

// A local, permanent dark palette. The application theme is never changed.
const LOGIN_TOKENS = {
  colorScheme: "dark",
  "--login-base": "color-mix(in srgb, var(--brand-charcoal) 34%, black)",
  "--login-canvas":
    "color-mix(in srgb, var(--login-base) 88%, var(--brand-secondary))",
  "--background": "var(--login-canvas)",
  "--foreground":
    "color-mix(in srgb, var(--primary-foreground) 90%, var(--brand-charcoal))",
  "--surface-1":
    "color-mix(in srgb, var(--login-canvas) 80%, var(--brand-charcoal))",
  "--surface-2":
    "color-mix(in srgb, var(--login-canvas) 68%, var(--brand-charcoal))",
  "--muted-foreground":
    "color-mix(in srgb, var(--foreground) 70%, var(--login-canvas))",
  "--border": "color-mix(in srgb, var(--foreground) 11%, var(--login-canvas))",
  "--ring": "var(--brand-primary)",
  "--login-error": "color-mix(in srgb, var(--brand-red) 52%, white)",
} as CSSProperties;

const inputStyle =
  "allocatr-login-input h-12 w-full min-w-0 rounded-lg border bg-surface-2 pl-10 pr-4 text-base text-foreground outline-none placeholder:text-muted-foreground/60 transition-[border-color,box-shadow] duration-150 hover:border-foreground/25 focus-visible:ring-2 disabled:cursor-wait disabled:opacity-60 motion-reduce:transition-none sm:text-sm";
const inputValid =
  "border-border focus-visible:border-brand-primary/55 focus-visible:ring-brand-primary/15";
const inputInvalid =
  "border-[var(--login-error)] focus-visible:border-[var(--login-error)] focus-visible:ring-[color-mix(in_srgb,var(--login-error)_20%,transparent)]";
const textLink =
  "rounded-sm text-brand-primary transition-opacity duration-150 hover:opacity-75 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background motion-reduce:transition-none";

const AUTOFILL_CSS = `
.allocatr-login-page .allocatr-login-input:-webkit-autofill,
.allocatr-login-page .allocatr-login-input:-webkit-autofill:hover,
.allocatr-login-page .allocatr-login-input:-webkit-autofill:focus,
.allocatr-login-page .allocatr-login-input:-webkit-autofill:active {
  -webkit-text-fill-color: var(--foreground) !important;
  caret-color: var(--foreground) !important;
  -webkit-box-shadow: 0 0 0 1000px var(--surface-2) inset !important;
  box-shadow: 0 0 0 1000px var(--surface-2) inset !important;
}
.allocatr-login-page .allocatr-login-input:-moz-autofill {
  color: var(--foreground) !important;
  caret-color: var(--foreground) !important;
  background-color: var(--surface-2) !important;
  box-shadow: 0 0 0 1000px var(--surface-2) inset !important;
}
`;

export default function Login() {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const reducedMotion = useReducedMotion();
  const [showPassword, setShowPassword] = useState(false);
  const returnTo = safeReturnTo(searchParams.get("returnTo"));
  const registerUrl = returnTo
    ? `/register?returnTo=${encodeURIComponent(returnTo)}`
    : "/register";
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    mode: "onBlur",
    reValidateMode: "onChange",
    defaultValues: { email: "", password: "" },
  });
  const { isSubmitting } = form.formState;
  const credentialsError = form.formState.errors.root?.credentials;

  useEffect(() => {
    if (user) {
      rememberReturnTo(user.userId, returnTo);
      navigate(nextAccountPath(user, returnTo), { replace: true });
    }
  }, [user, returnTo, navigate]);

  function clearCredentialsError() {
    if (form.formState.errors.root?.credentials)
      form.clearErrors("root.credentials");
  }
  async function handleLogin(values: LoginFormValues) {
    form.clearErrors("root.credentials");
    try {
      const current = await login(values.email.trim(), values.password);
      rememberReturnTo(current.userId, returnTo);
      navigate(nextAccountPath(current, returnTo), { replace: true });
    } catch (error: unknown) {
      form.setError("root.credentials", {
        type: "server",
        message: getLoginErrorMessage(error),
      });
    }
  }

  return (
    <main
      style={LOGIN_TOKENS}
      className="allocatr-login-page relative isolate flex min-h-[100svh] flex-col overflow-x-clip bg-background text-foreground"
    >
      <style>{AUTOFILL_CSS}</style>
      <LoginAtmosphere />
      <header className="relative z-10 shrink-0">
        <div className="mx-auto flex h-16 w-full max-w-[1440px] items-center justify-between gap-4 px-5 sm:px-8 lg:px-14">
          <Link
            to="/"
            aria-label="Allocatr home"
            className="rounded-md transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary/40"
          >
            <img
              src={allocatrLogoLight}
              alt="Allocatr"
              className="h-6 w-auto object-contain"
            />
          </Link>
        </div>
      </header>

      <section
        aria-label="Sign in to Allocatr"
        className="relative z-10 flex flex-1 items-center px-4 py-8 sm:px-8 sm:py-12 lg:px-14"
      >
        <div className="mx-auto grid w-full max-w-[1200px] items-center justify-items-center gap-10 lg:grid-cols-[minmax(0,1fr)_440px] lg:justify-items-stretch lg:gap-16">
          <div className="hidden max-w-[410px] self-end pb-10 lg:block">
            <p className="mb-4 text-[10px] font-medium uppercase tracking-[0.16em] text-brand-primary">
              Work, better allocated
            </p>
            <h2 className="text-[clamp(2rem,3vw,3rem)] font-medium leading-[1.12] tracking-[-0.035em]">
              Good work.
              <br />
              Better allocated.
            </h2>
            <p className="mt-4 max-w-sm text-sm leading-7 text-muted-foreground">
              Bring skills, people and projects together in one connected
              workspace.
            </p>
          </div>
          <motion.div
            initial={reducedMotion ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: reducedMotion ? 0 : 0.45,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="w-full max-w-[440px] rounded-2xl border border-border bg-surface-1/95 pb-5 backdrop-blur-xl"
          >
            <div className="px-5 pb-6 pt-7 sm:px-7 sm:pb-7 sm:pt-8">
              <div className="mb-7 text-center">
                <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-brand-primary">
                  Your Allocatr workspace
                </p>
                <h1 className="mt-3 text-[1.7rem] font-medium leading-tight tracking-[-0.035em]">
                  Welcome back.
                </h1>
                <p className="mx-auto mt-2 max-w-xs text-xs leading-6 text-muted-foreground">
                  {returnTo
                    ? "Sign in to continue where you left off."
                    : "Your people. Your projects. One workspace."}
                </p>
              </div>

              <form
                onSubmit={form.handleSubmit(handleLogin)}
                noValidate
                aria-busy={isSubmitting}
                className="space-y-5"
              >
                <Controller
                  name="email"
                  control={form.control}
                  render={({ field, fieldState }) => {
                    const invalid =
                      fieldState.invalid || Boolean(credentialsError);
                    const describedBy =
                      [
                        fieldState.error ? "login-email-error" : "",
                        credentialsError ? "login-credentials-error" : "",
                      ]
                        .filter(Boolean)
                        .join(" ") || undefined;
                    return (
                      <div>
                        <label
                          htmlFor="login-email"
                          className="mb-2 block text-xs font-medium text-foreground/85"
                        >
                          Email address
                        </label>
                        <div className="relative">
                          <MailIcon
                            size={16}
                            aria-hidden="true"
                            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
                          />
                          <input
                            {...field}
                            id="login-email"
                            type="email"
                            autoComplete="email"
                            inputMode="email"
                            autoCapitalize="none"
                            spellCheck={false}
                            placeholder="you@example.com"
                            disabled={isSubmitting}
                            aria-invalid={invalid}
                            aria-describedby={describedBy}
                            onChange={(event) => {
                              field.onChange(event);
                              clearCredentialsError();
                            }}
                            className={`${inputStyle} ${invalid ? inputInvalid : inputValid}`}
                          />
                        </div>
                        {fieldState.error && (
                          <p
                            id="login-email-error"
                            className="mt-2 text-xs leading-5 text-[var(--login-error)]"
                          >
                            {fieldState.error.message}
                          </p>
                        )}
                      </div>
                    );
                  }}
                />

                <Controller
                  name="password"
                  control={form.control}
                  render={({ field, fieldState }) => {
                    const invalid =
                      fieldState.invalid || Boolean(credentialsError);
                    const describedBy =
                      [
                        fieldState.error ? "login-password-error" : "",
                        credentialsError ? "login-credentials-error" : "",
                      ]
                        .filter(Boolean)
                        .join(" ") || undefined;
                    return (
                      <div>
                        <div className="mb-2 flex items-center justify-between gap-3">
                          <label
                            htmlFor="login-password"
                            className="text-xs font-medium text-foreground/85"
                          >
                            Password
                          </label>
                          <Link
                            to="/forgot-password"
                            className={`${textLink} text-[11px]`}
                          >
                            Forgot password?
                          </Link>
                        </div>
                        <div className="relative">
                          <LockKeyholeIcon
                            size={16}
                            aria-hidden="true"
                            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
                          />
                          <input
                            {...field}
                            id="login-password"
                            type={showPassword ? "text" : "password"}
                            autoComplete="current-password"
                            placeholder="Enter your password"
                            disabled={isSubmitting}
                            aria-invalid={invalid}
                            aria-describedby={describedBy}
                            onChange={(event) => {
                              field.onChange(event);
                              clearCredentialsError();
                            }}
                            className={`${inputStyle} pr-12 ${invalid ? inputInvalid : inputValid}`}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword((value) => !value)}
                            disabled={isSubmitting}
                            aria-label={
                              showPassword ? "Hide password" : "Show password"
                            }
                            aria-pressed={showPassword}
                            aria-controls="login-password"
                            className="absolute inset-y-0 right-0 flex w-11 items-center justify-center rounded-r-lg text-muted-foreground transition-opacity hover:text-foreground hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand-primary/40 disabled:opacity-50"
                          >
                            {showPassword ? (
                              <EyeOffIcon size={16} aria-hidden="true" />
                            ) : (
                              <EyeIcon size={16} aria-hidden="true" />
                            )}
                          </button>
                        </div>
                        {fieldState.error && (
                          <p
                            id="login-password-error"
                            className="mt-2 text-xs leading-5 text-[var(--login-error)]"
                          >
                            {fieldState.error.message}
                          </p>
                        )}
                      </div>
                    );
                  }}
                />

                {credentialsError && (
                  <div
                    id="login-credentials-error"
                    role="alert"
                    className="rounded-lg border border-[color-mix(in_srgb,var(--login-error)_30%,transparent)] bg-[color-mix(in_srgb,var(--login-error)_8%,transparent)] px-3.5 py-3 text-xs leading-6 text-[var(--login-error)]"
                  >
                    {credentialsError.message}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex h-12 w-full items-center justify-center gap-2.5 rounded-lg border border-brand-primary/20 bg-brand-primary px-4 text-sm font-medium text-dark-gray transition-opacity duration-150 hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary/45 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-wait disabled:opacity-65 motion-reduce:transition-none"
                >
                  {isSubmitting ? (
                    <>
                      <LoaderCircleIcon
                        size={16}
                        aria-hidden="true"
                        className="animate-spin motion-reduce:animate-none"
                      />
                      Signing in…
                    </>
                  ) : (
                    <>
                      Sign in
                      <ArrowRightIcon
                        size={16}
                        aria-hidden="true"
                        className="text-inherit"
                      />
                    </>
                  )}
                </button>
              </form>
            </div>
            <p className="px-2 pb-1 pt-5 text-center text-xs leading-6 text-muted-foreground">
              Don’t have an account?{" "}
              <Link to={registerUrl} className={`${textLink} ml-1 font-medium`}>
                Create account
              </Link>
            </p>
            <div className="mt-3 flex items-center justify-center gap-1.5 text-[10px] text-muted-foreground">
              <LockKeyholeIcon size={11} aria-hidden="true" />
              Secure Allocatr access
            </div>
          </motion.div>
        </div>
      </section>

      <footer className="relative z-10 shrink-0 border-t border-border/35 bg-background/60 px-5 py-4 sm:px-8 lg:px-14">
        <div className="mx-auto flex w-full max-w-[1328px] flex-wrap items-center justify-between gap-x-5 gap-y-2 text-[10px] leading-5 text-muted-foreground">
          <p>© {new Date().getFullYear()} Allocatr</p>
          <nav aria-label="Legal" className="flex items-center gap-4">
            <Link
              to="/privacy"
              className="rounded-sm hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary/35"
            >
              Privacy
            </Link>
            <Link
              to="/terms"
              className="rounded-sm hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary/35"
            >
              Terms
            </Link>
          </nav>
        </div>
      </footer>
    </main>
  );
}

function LoginAtmosphere() {
  const [available, setAvailable] = useState(true);
  const [loaded, setLoaded] = useState(false);
  const reducedMotion = useReducedMotion();
  const feather =
    "radial-gradient(ellipse at 48% 46%, white 24%, color-mix(in srgb, white 85%, transparent) 48%, transparent 78%)";
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden select-none"
    >
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 20% 42%, color-mix(in srgb, var(--brand-secondary) 8%, transparent), transparent 70%)",
        }}
      />
      {available && (
        <div
          className="absolute -left-[20%] top-0 h-full w-[130%] opacity-35 mix-blend-lighten sm:-left-[14%] sm:w-[110%] sm:opacity-45 lg:-left-[8%] lg:w-[78%] lg:opacity-80"
          style={{ maskImage: feather, WebkitMaskImage: feather }}
        >
          <motion.img
            src={LOGIN_CAT_IMAGE}
            alt=""
            fetchPriority="high"
            decoding="async"
            onLoad={() => setLoaded(true)}
            onError={() => setAvailable(false)}
            initial={false}
            animate={{ opacity: loaded ? 1 : 0 }}
            transition={{ duration: reducedMotion ? 0 : 0.8, ease: "easeOut" }}
            className="h-full w-full object-cover object-[50%_42%]"
          />
        </div>
      )}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to right, color-mix(in srgb, var(--login-canvas) 24%, transparent), transparent 24%, color-mix(in srgb, var(--login-canvas) 55%, transparent) 58%, var(--login-canvas) 90%), linear-gradient(to top, var(--login-canvas), transparent 32%, transparent 80%, color-mix(in srgb, var(--login-canvas) 60%, transparent))",
        }}
      />
    </div>
  );
}

function getLoginErrorMessage(error: unknown): string {
  const fallback =
    "We couldn’t sign you in with those details. Check your email and password, then try again.";
  if (typeof error !== "object" || error === null || !("response" in error))
    return fallback;
  const response = (
    error as { response?: { status?: number; data?: { message?: unknown } } }
  ).response;
  if (response?.status === 401) return fallback;
  const message =
    typeof response?.data?.message === "string"
      ? response.data.message.trim()
      : "";
  if (!message) return fallback;
  const normalized = message.toLowerCase();
  if (
    [
      "invalid credentials",
      "invalid credential",
      "invalid email or password",
      "incorrect email or password",
      "incorrect password",
      "authentication failed",
      "login failed",
      "unauthorized",
    ].some((term) => normalized.includes(term))
  )
    return fallback;
  return message;
}
