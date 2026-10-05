import {
  ArrowLeftIcon,
  ArrowRightIcon,
  EyeIcon,
  EyeOffIcon,
  LoaderCircleIcon,
  LockKeyholeIcon,
  MailIcon,
  PawPrintIcon,
} from "lucide-react";

import {
  useEffect,
  useState,
} from "react";

import {
  Link,
  useNavigate,
  useSearchParams,
} from "react-router-dom";

import {
  motion,
  useReducedMotion,
} from "framer-motion";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";

import { useAuth } from "@/auth/useAuth";

import assets from "@/assets/assets";

import allocatrLogoLight from "@/assets/allocatr-neg-light.svg";
import allocatrLogoDark from "@/assets/allocatr-dark-02.svg";

import { Button } from "@/components/ui/button";

import {
  Field,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";

import { Input } from "@/components/ui/input";

/* =========================================================
   VALIDATION
========================================================= */

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

/* =========================================================
   SHARED STYLES
========================================================= */

const primaryButton = [
  "border border-brand-secondary-highlight/15",
  "bg-brand-secondary-highlight",
  "text-primary-foreground",
  "shadow-none",

  "transition-[background-color,border-color,color,transform] duration-200",

  "hover:-translate-y-0.5",
  "hover:border-brand-secondary-highlight/20",
  "hover:bg-brand-secondary-highlight/90",
  "hover:text-primary-foreground",

  "focus-visible:ring-2",
  "focus-visible:ring-brand-secondary-highlight/15",

  "dark:border-secondary/10",
  "dark:bg-secondary",
  "dark:text-secondary-foreground",

  "dark:hover:border-secondary/15",
  "dark:hover:bg-secondary/90",
  "dark:hover:text-secondary-foreground",

  "dark:focus-visible:ring-secondary/15",
].join(" ");

const inputStyle = [
  "h-11 rounded-lg",
  "border-border/70",

  "bg-surface-2/35",
  "text-foreground",

  "shadow-none",

  "placeholder:text-muted-foreground/55",

  "transition-[background-color,border-color,box-shadow] duration-200",

  "hover:border-border",

  "focus-visible:border-brand-secondary-highlight/55",
  "focus-visible:ring-2",
  "focus-visible:ring-brand-secondary-highlight/10",

  "dark:border-border",
  "dark:bg-surface-2/65",

  "dark:focus-visible:border-secondary/45",
  "dark:focus-visible:ring-secondary/10",
].join(" ");

/* =========================================================
   LOGIN
========================================================= */

export default function Login() {
  const { login, user } = useAuth();

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const reduceMotion = useReducedMotion();

  const [showPassword, setShowPassword] = useState(false);

  const returnTo = getSafeReturnTo(
    searchParams.get("returnTo"),
  );

  const registerUrl = returnTo
    ? `/register?returnTo=${encodeURIComponent(returnTo)}`
    : "/register";

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    mode: "onBlur",
    reValidateMode: "onChange",

    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { isSubmitting } = form.formState;

  const credentialsError =
    form.formState.errors.root?.credentials;

  /* =======================================================
     AUTH REDIRECT
  ======================================================= */

  useEffect(() => {
    if (!user) {
      return;
    }

    navigate(returnTo || "/projects", {
      replace: true,
    });
  }, [
    user,
    returnTo,
    navigate,
  ]);

  /* =======================================================
     CLEAR AUTH ERROR
  ======================================================= */

  function clearCredentialsError() {
    if (form.formState.errors.root?.credentials) {
      form.clearErrors("root.credentials");
    }
  }

  /* =======================================================
     LOGIN
  ======================================================= */

  async function handleLogin(
    values: LoginFormValues,
  ) {
    form.clearErrors("root.credentials");

    try {
      await login(
        values.email.trim(),
        values.password,
      );

      navigate(returnTo || "/projects", {
        replace: true,
      });
    } catch (error: unknown) {
      form.setError("root.credentials", {
        type: "server",
        message: getLoginErrorMessage(error),
      });
    }
  }

  return (
    <>
      {/* ===================================================
          AUTOFILL
      =================================================== */}

      <style>
        {`
          .allocatr-login-input:-webkit-autofill,
          .allocatr-login-input:-webkit-autofill:hover,
          .allocatr-login-input:-webkit-autofill:focus,
          .allocatr-login-input:-webkit-autofill:active {
            -webkit-text-fill-color: var(--foreground) !important;
            caret-color: var(--foreground) !important;

            -webkit-box-shadow:
              0 0 0 1000px var(--surface-2) inset !important;

            box-shadow:
              0 0 0 1000px var(--surface-2) inset !important;

            transition:
              background-color 9999s ease-out 0s,
              color 9999s ease-out 0s;
          }

          .allocatr-login-input:-moz-autofill {
            color: var(--foreground) !important;
            caret-color: var(--foreground) !important;

            background-color:
              var(--surface-2) !important;

            box-shadow:
              0 0 0 1000px var(--surface-2) inset !important;
          }

          .allocatr-login-input:-webkit-autofill::first-line {
            color: var(--foreground) !important;
            font-family: inherit !important;
            font-size: inherit !important;
          }
        `}
      </style>

      <main className="relative flex min-h-screen flex-col overflow-hidden bg-background text-foreground">
        {/* =================================================
            BACKGROUND DETAIL
        ================================================= */}

        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
        >
          <div
            className={[
              "absolute inset-x-0 top-0 hidden h-[420px]",

              "opacity-[0.18]",

              "sm:block",
            ].join(" ")}
            style={{
              backgroundImage:
                "linear-gradient(to right, color-mix(in srgb, var(--border) 45%, transparent) 1px, transparent 1px), linear-gradient(to bottom, color-mix(in srgb, var(--border) 45%, transparent) 1px, transparent 1px)",

              backgroundSize:
                "44px 44px",

              maskImage:
                "linear-gradient(to bottom, black 0%, transparent 90%)",

              WebkitMaskImage:
                "linear-gradient(to bottom, black 0%, transparent 90%)",
            }}
          />

          <PawPrintIcon
            className={[
              "absolute -right-12 top-[18%]",

              "hidden h-44 w-44 -rotate-12",

              "text-foreground/[0.012]",

              "lg:block",
            ].join(" ")}
          />

          <PawPrintIcon
            className={[
              "absolute -left-8 bottom-[15%]",

              "hidden h-28 w-28 rotate-12",

              "text-foreground/[0.008]",

              "xl:block",
            ].join(" ")}
          />
        </div>

        {/* =================================================
            HEADER
        ================================================= */}

        <header
          className={[
            "relative z-30",

            "border-b border-border/50",

            "bg-background/88",

            "backdrop-blur-xl",
          ].join(" ")}
        >
          <div
            className={[
              "mx-auto flex h-16 w-full max-w-7xl items-center justify-between",

              "px-4",
              "sm:px-6",
              "md:px-8",
            ].join(" ")}
          >
            {/* LOGO */}

            <Link
              to="/"
              aria-label="Go to Allocatr home"
              className={[
                "group inline-flex items-center rounded-md",

                "outline-none",

                "focus-visible:ring-2",
                "focus-visible:ring-brand-secondary-highlight/20",

                "dark:focus-visible:ring-secondary/20",
              ].join(" ")}
            >
              <img
                src={allocatrLogoDark}
                alt="Allocatr"
                className={[
                  "h-[24px] w-auto",

                  "transition-opacity duration-200",

                  "group-hover:opacity-75",

                  "dark:hidden",
                ].join(" ")}
              />

              <img
                src={allocatrLogoLight}
                alt="Allocatr"
                className={[
                  "hidden h-[24px] w-auto",

                  "transition-opacity duration-200",

                  "group-hover:opacity-75",

                  "dark:block",
                ].join(" ")}
              />
            </Link>

            {/* BACK */}

            <Link
              to="/"
              className={[
                "group inline-flex h-9 items-center gap-2 rounded-lg px-2",

                "text-[0.68rem] font-medium",

                "text-muted-foreground",

                "transition-colors",

                "hover:text-foreground",
              ].join(" ")}
            >
              <ArrowLeftIcon
                size={13}
                className="transition-transform duration-200 group-hover:-translate-x-0.5"
              />

              <span className="hidden sm:inline">
                Back to website
              </span>
            </Link>
          </div>
        </header>

        {/* =================================================
            LOGIN AREA
        ================================================= */}

        <section
          className={[
            "relative z-10 flex flex-1 items-center justify-center",

            "px-4 py-10",

            "sm:px-6 sm:py-14",

            "md:px-8 md:py-16",
          ].join(" ")}
        >
          <motion.div
            initial={
              reduceMotion
                ? false
                : {
                    opacity: 0,
                    y: 16,
                  }
            }
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.5,
              ease: "easeOut",
            }}
            className="w-full max-w-[460px]"
          >
            {/* =============================================
                INTRO
            ============================================= */}

            <div className="mb-7 text-center sm:mb-8">
              {/* ICON TILE */}

              <Link
                to="/"
                aria-label="Allocatr home"
                className={[
                  "group mx-auto flex h-12 w-12 items-center justify-center",

                  "rounded-xl border",

                  "border-border/65",

                  "bg-surface-2/55",

                  "ring-1 ring-inset ring-border/20",

                  "transition-[background-color,border-color,transform] duration-200",

                  "hover:-translate-y-0.5",

                  "hover:border-border/85",

                  "hover:bg-surface-3/60",

                  "focus-visible:outline-none",

                  "focus-visible:ring-2",

                  "focus-visible:ring-brand-secondary-highlight/15",

                  "dark:border-border",

                  "dark:bg-surface-2/70",

                  "dark:focus-visible:ring-secondary/15",
                ].join(" ")}
              >
                <img
                  src={assets.allocatrIcon}
                  alt=""
                  className="h-[21px] w-[21px] object-contain"
                />
              </Link>

              <p
                className={[
                  "mt-6",

                  "text-[0.5rem] font-semibold uppercase",

                  "tracking-[0.17em]",

                  "text-muted-foreground",
                ].join(" ")}
              >
                Allocatr workspace
              </p>

              <h1
                className={[
                  "mt-3",

                  "text-[2rem] font-semibold",

                  "leading-[1.02]",

                  "tracking-[-0.04em]",

                  "text-foreground",

                  "sm:text-[2.3rem]",
                ].join(" ")}
              >
                Welcome back.
              </h1>

              <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-muted-foreground">
                {returnTo
                  ? "Sign in to continue where you left off."
                  : "Sign in to access your projects, work and account."}
              </p>
            </div>

            {/* =============================================
                FORM CARD
            ============================================= */}

            <div
              className={[
                "rounded-[1.35rem] border",

                "border-border/60",

                "bg-card",

                "px-5 py-6",

                "sm:px-8 sm:py-8",

                "dark:border-border",
                "dark:bg-card",
              ].join(" ")}
            >
              <form
                onSubmit={form.handleSubmit(handleLogin)}
                noValidate
                className="space-y-5"
              >
                {/* =========================================
                    EMAIL
                ========================================= */}

                <Controller
                  name="email"
                  control={form.control}
                  render={({
                    field,
                    fieldState,
                  }) => {
                    const invalid =
                      fieldState.invalid ||
                      Boolean(credentialsError);

                    return (
                      <Field data-invalid={invalid}>
                        <FieldLabel
                          htmlFor="email"
                          className={[
                            "mb-2 block",

                            "text-[0.68rem] font-semibold",

                            "text-foreground/75",
                          ].join(" ")}
                        >
                          Email address
                        </FieldLabel>

                        <div className="relative">
                          <MailIcon
                            size={15}
                            className={[
                              "pointer-events-none",

                              "absolute left-3.5 top-1/2 z-10",

                              "-translate-y-1/2",

                              invalid
                                ? "text-destructive"
                                : "text-muted-foreground/70",
                            ].join(" ")}
                          />

                          <Input
                            {...field}
                            id="email"
                            type="email"
                            autoComplete="email"
                            placeholder="you@example.com"
                            disabled={isSubmitting}
                            aria-invalid={invalid}
                            onChange={(event) => {
                              field.onChange(event);
                              clearCredentialsError();
                            }}
                            className={[
                              "allocatr-login-input",

                              inputStyle,

                              "pl-10 pr-4",

                              invalid
                                ? [
                                    "border-destructive/65",

                                    "focus-visible:border-destructive",

                                    "focus-visible:ring-destructive/10",
                                  ].join(" ")
                                : "",
                            ].join(" ")}
                          />
                        </div>

                        <FieldError
                          errors={[fieldState.error]}
                          className="mt-1.5 text-[0.68rem] text-destructive"
                        />
                      </Field>
                    );
                  }}
                />

                {/* =========================================
                    PASSWORD
                ========================================= */}

                <Controller
                  name="password"
                  control={form.control}
                  render={({
                    field,
                    fieldState,
                  }) => {
                    const invalid =
                      fieldState.invalid ||
                      Boolean(credentialsError);

                    return (
                      <Field data-invalid={invalid}>
                        <div className="mb-2 flex items-center justify-between gap-4">
                          <FieldLabel
                            htmlFor="password"
                            className="text-[0.68rem] font-semibold text-foreground/75"
                          >
                            Password
                          </FieldLabel>

                          <Link
                            to="/forgot-password"
                            className={[
                              "text-[0.65rem] font-medium",

                              "text-brand-secondary-highlight",

                              "transition-opacity",

                              "hover:opacity-70",

                              "dark:text-secondary",
                            ].join(" ")}
                          >
                            Forgot password?
                          </Link>
                        </div>

                        <div className="relative">
                          <LockKeyholeIcon
                            size={15}
                            className={[
                              "pointer-events-none",

                              "absolute left-3.5 top-1/2 z-10",

                              "-translate-y-1/2",

                              invalid
                                ? "text-destructive"
                                : "text-muted-foreground/70",
                            ].join(" ")}
                          />

                          <Input
                            {...field}
                            id="password"
                            type={
                              showPassword
                                ? "text"
                                : "password"
                            }
                            autoComplete="current-password"
                            placeholder="Enter your password"
                            disabled={isSubmitting}
                            aria-invalid={invalid}
                            onChange={(event) => {
                              field.onChange(event);
                              clearCredentialsError();
                            }}
                            className={[
                              "allocatr-login-input",

                              inputStyle,

                              "pl-10 pr-11",

                              invalid
                                ? [
                                    "border-destructive/65",

                                    "focus-visible:border-destructive",

                                    "focus-visible:ring-destructive/10",
                                  ].join(" ")
                                : "",
                            ].join(" ")}
                          />

                          <button
                            type="button"
                            onClick={() =>
                              setShowPassword(
                                (current) => !current,
                              )
                            }
                            disabled={isSubmitting}
                            className={[
                              "absolute right-3.5 top-1/2 z-10",

                              "-translate-y-1/2",

                              "text-muted-foreground",

                              "transition-colors",

                              "hover:text-foreground",

                              "focus-visible:outline-none",

                              "focus-visible:text-foreground",

                              "disabled:cursor-not-allowed",

                              "disabled:opacity-50",
                            ].join(" ")}
                            aria-label={
                              showPassword
                                ? "Hide password"
                                : "Show password"
                            }
                          >
                            {showPassword ? (
                              <EyeOffIcon size={15} />
                            ) : (
                              <EyeIcon size={15} />
                            )}
                          </button>
                        </div>

                        <FieldError
                          errors={[fieldState.error]}
                          className="mt-1.5 text-[0.68rem] text-destructive"
                        />
                      </Field>
                    );
                  }}
                />

                {/* =========================================
                    CREDENTIAL ERROR
                ========================================= */}

                {credentialsError && (
                  <div
                    className={[
                      "rounded-lg border px-3.5 py-3",

                      "border-destructive/20",

                      "bg-destructive/[0.045]",

                      "text-[0.68rem] leading-5",

                      "text-destructive",
                    ].join(" ")}
                  >
                    {credentialsError.message}
                  </div>
                )}

                {/* =========================================
                    SUBMIT
                ========================================= */}

                <Button
                  type="submit"
                  variant="ghost"
                  disabled={isSubmitting}
                  className={[
                    "group h-11 w-full rounded-lg",

                    "text-xs font-semibold",

                    primaryButton,
                  ].join(" ")}
                >
                  {isSubmitting ? (
                    <>
                      <LoaderCircleIcon
                        size={15}
                        className="animate-spin"
                      />

                      Signing in
                    </>
                  ) : (
                    <>
                      Sign in

                      <ArrowRightIcon
                        size={14}
                        className="transition-transform duration-200 group-hover:translate-x-0.5"
                      />
                    </>
                  )}
                </Button>

                {/* =========================================
                    REGISTER
                ========================================= */}

                <p className="text-center text-xs text-muted-foreground">
                  Don&apos;t have an account?{" "}

                  <Link
                    to={registerUrl}
                    className={[
                      "font-semibold",

                      "text-brand-secondary-highlight",

                      "transition-opacity",

                      "hover:opacity-70",

                      "dark:text-secondary",
                    ].join(" ")}
                  >
                    Create account
                  </Link>
                </p>
              </form>
            </div>

            {/* =============================================
                TRUST
            ============================================= */}

            <div className="mt-5 flex items-center justify-center gap-2 text-[0.58rem] text-muted-foreground/65">
              <LockKeyholeIcon size={10} />

              Secure Allocatr access
            </div>
          </motion.div>
        </section>

        {/* =================================================
            FOOTER
        ================================================= */}

        <footer
          className={[
            "relative z-20",

            "border-t border-border/50",

            "px-4 py-5",

            "sm:px-6",

            "md:px-8",
          ].join(" ")}
        >
          <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4">
            <span className="text-[0.58rem] text-muted-foreground/70">
              © {new Date().getFullYear()} Allocatr
            </span>

            <span className="hidden text-[0.58rem] text-muted-foreground/70 sm:inline">
              Work, properly allocated.
            </span>
          </div>
        </footer>
      </main>
    </>
  );
}

/* =========================================================
   RETURN PATH
========================================================= */

function getSafeReturnTo(
  value: string | null,
): string | null {
  if (!value) {
    return null;
  }

  const trimmed = value.trim();

  if (!trimmed.startsWith("/")) {
    return null;
  }

  if (trimmed.startsWith("//")) {
    return null;
  }

  if (trimmed.startsWith("/login")) {
    return null;
  }

  if (trimmed.startsWith("/register")) {
    return null;
  }

  return trimmed;
}

/* =========================================================
   LOGIN ERROR
========================================================= */

function getLoginErrorMessage(
  error: unknown,
): string {
  const fallback =
    "We couldn’t sign you in with those details. Check your email and password, then try again.";

  if (
    typeof error !== "object" ||
    error === null ||
    !("response" in error)
  ) {
    return fallback;
  }

  const response = (
    error as {
      response?: {
        status?: number;

        data?: {
          message?: string;
        };
      };
    }
  ).response;

  const status =
    response?.status;

  const backendMessage =
    response?.data?.message?.trim();

  const normalizedMessage =
    backendMessage?.toLowerCase();

  if (status === 401) {
    return fallback;
  }

  if (!normalizedMessage) {
    return fallback;
  }

  const credentialMessages = [
    "invalid credentials",
    "invalid credential",
    "invalid email or password",
    "incorrect email or password",
    "incorrect password",
    "authentication failed",
    "login failed",
    "unauthorized",
  ];

  if (
    credentialMessages.some((message) =>
      normalizedMessage.includes(message),
    )
  ) {
    return fallback;
  }

  return backendMessage || fallback;
}