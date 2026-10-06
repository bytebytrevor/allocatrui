import {
  ArrowLeftIcon,
  ArrowRightIcon,
  BriefcaseBusinessIcon,
  CheckIcon,
  EyeIcon,
  EyeOffIcon,
  LoaderCircleIcon,
  LockKeyholeIcon,
  MailIcon,
  PawPrintIcon,
  UserIcon,
} from "lucide-react";

import { useEffect, useState, type ComponentType } from "react";

import { Link, useNavigate, useSearchParams } from "react-router-dom";

import { motion, useReducedMotion } from "framer-motion";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";

import { useAuth } from "@/auth/useAuth";

import assets from "@/assets/assets";

import allocatrLogoLight from "@/assets/allocatr-neg-light.svg";
import allocatrLogoDark from "@/assets/allocatr-dark-02.svg";

import { Button } from "@/components/ui/button";

import { Field, FieldError, FieldLabel } from "@/components/ui/field";

import { Input } from "@/components/ui/input";

/* =========================================================
   VALIDATION
========================================================= */

const registerSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(1, "Full name is required.")
    .min(2, "Enter at least 2 characters.")
    .max(100, "Keep your name below 100 characters."),

  email: z
    .string()
    .trim()
    .min(1, "Email address is required.")
    .email("Enter a valid email address."),

  password: z
    .string()
    .min(1, "Password is required.")
    .min(8, "Password must be at least 8 characters."),

  isAllocat: z.boolean(),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

/* =========================================================
   SHARED STYLES
========================================================= */

const primaryButton = [
  "border border-brand-secondary-highlight/15",
  "bg-brand-secondary-highlight",
  "text-primary-foreground",
  "shadow-none",

  "transition-opacity duration-150",

  "hover:border-brand-secondary-highlight/15",
  "hover:bg-brand-secondary-highlight",
  "hover:text-primary-foreground",
  "hover:opacity-90",

  "focus-visible:ring-2",
  "focus-visible:ring-brand-secondary-highlight/15",

  "dark:border-secondary/10",
  "dark:bg-secondary",
  "dark:text-secondary-foreground",

  "dark:hover:border-secondary/10",
  "dark:hover:bg-secondary",
  "dark:hover:text-secondary-foreground",
  "dark:hover:opacity-90",

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
   REGISTER
========================================================= */

export default function Register() {
  const { register, user } = useAuth();

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const reduceMotion = useReducedMotion();

  const [showPassword, setShowPassword] = useState(false);

  const returnTo = getSafeReturnTo(searchParams.get("returnTo"));

  const loginUrl = returnTo
    ? `/login?returnTo=${encodeURIComponent(returnTo)}`
    : "/login";

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    mode: "onBlur",
    reValidateMode: "onChange",

    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      isAllocat: false,
    },
  });

  const { isSubmitting } = form.formState;

  const serverError = form.formState.errors.root?.server;

  /* =======================================================
     AUTH REDIRECT

     If someone is already authenticated and reaches the
     register page, route them according to their account type.

     Allocats go through initial professional setup first.
  ======================================================= */

  useEffect(() => {
    if (!user) {
      return;
    }

    navigate(getPostRegisterPath(user.isAllocat, returnTo), {
      replace: true,
    });
  }, [user, returnTo, navigate]);

  /* =======================================================
     CLEAR SERVER ERROR
  ======================================================= */

  function clearServerError() {
    if (form.formState.errors.root?.server) {
      form.clearErrors("root.server");
    }
  }

  /* =======================================================
     SUBMIT
  ======================================================= */

  async function handleRegister(values: RegisterFormValues) {
    form.clearErrors("root.server");

    try {
      await register(
        values.fullName.trim(),
        values.email.trim(),
        values.password,
        values.isAllocat,
      );

      /*
       * New Allocats must complete their professional profile
       * before entering the normal project flow.
       *
       * Clients continue to returnTo or /projects.
       */
      navigate(getPostRegisterPath(values.isAllocat, returnTo), {
        replace: true,
      });
    } catch (error: unknown) {
      form.setError("root.server", {
        type: "server",
        message: getRegisterErrorMessage(error),
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
          .allocatr-auth-input:-webkit-autofill,
          .allocatr-auth-input:-webkit-autofill:hover,
          .allocatr-auth-input:-webkit-autofill:focus,
          .allocatr-auth-input:-webkit-autofill:active {
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

          .allocatr-auth-input:-moz-autofill {
            color: var(--foreground) !important;
            caret-color: var(--foreground) !important;
            background-color: var(--surface-2) !important;
            box-shadow:
              0 0 0 1000px var(--surface-2) inset !important;
          }

          .allocatr-auth-input:-webkit-autofill::first-line {
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

        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div
            className={[
              "absolute inset-x-0 top-0 hidden h-[420px]",
              "opacity-[0.18]",
              "sm:block",
            ].join(" ")}
            style={{
              backgroundImage:
                "linear-gradient(to right, color-mix(in srgb, var(--border) 45%, transparent) 1px, transparent 1px), linear-gradient(to bottom, color-mix(in srgb, var(--border) 45%, transparent) 1px, transparent 1px)",

              backgroundSize: "44px 44px",

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
                "inline-flex h-9 items-center gap-2 rounded-lg px-2",
                "text-[0.68rem] font-medium",
                "text-muted-foreground",
                "transition-opacity duration-150",
                "hover:text-foreground hover:opacity-75",
              ].join(" ")}
            >
              <ArrowLeftIcon size={13} />

              <span className="hidden sm:inline">Back to website</span>
            </Link>
          </div>
        </header>

        {/* =================================================
            REGISTER AREA
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
            className="w-full max-w-[500px]"
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
                  "mx-auto flex h-12 w-12 items-center justify-center",
                  "rounded-xl border",
                  "border-border/65",
                  "bg-surface-2/55",
                  "ring-1 ring-inset ring-border/20",
                  "transition-opacity duration-150",
                  "hover:opacity-75",
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
                Create your account
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
                Join Allocatr.
              </h1>

              <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-muted-foreground">
                {returnTo
                  ? "Create your account to continue where you left off."
                  : "Start projects, find the right capability or offer your own."}
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
                onSubmit={form.handleSubmit(handleRegister)}
                noValidate
                className="space-y-5"
              >
                {/* =========================================
                    FULL NAME
                ========================================= */}

                <Controller
                  name="fullName"
                  control={form.control}
                  render={({ field, fieldState }) => {
                    const invalid = fieldState.invalid;

                    return (
                      <Field data-invalid={invalid}>
                        <FieldLabel
                          htmlFor="fullName"
                          className={[
                            "mb-2 block",
                            "text-[0.68rem] font-semibold",
                            "text-foreground/75",
                          ].join(" ")}
                        >
                          Full name
                        </FieldLabel>

                        <div className="relative">
                          <UserIcon
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
                            id="fullName"
                            type="text"
                            autoComplete="name"
                            placeholder="Your full name"
                            disabled={isSubmitting}
                            aria-invalid={invalid}
                            onChange={(event) => {
                              field.onChange(event);
                              clearServerError();
                            }}
                            className={[
                              "allocatr-auth-input",
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
                    EMAIL
                ========================================= */}

                <Controller
                  name="email"
                  control={form.control}
                  render={({ field, fieldState }) => {
                    const invalid = fieldState.invalid;

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
                              clearServerError();
                            }}
                            className={[
                              "allocatr-auth-input",
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
                  render={({ field, fieldState }) => {
                    const invalid = fieldState.invalid;

                    return (
                      <Field data-invalid={invalid}>
                        <div className="mb-2 flex items-center justify-between gap-4">
                          <FieldLabel
                            htmlFor="password"
                            className="text-[0.68rem] font-semibold text-foreground/75"
                          >
                            Password
                          </FieldLabel>

                          <span className="text-[0.6rem] text-muted-foreground">
                            8+ characters
                          </span>
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
                            type={showPassword ? "text" : "password"}
                            autoComplete="new-password"
                            placeholder="Create a password"
                            disabled={isSubmitting}
                            aria-invalid={invalid}
                            onChange={(event) => {
                              field.onChange(event);
                              clearServerError();
                            }}
                            className={[
                              "allocatr-auth-input",
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
                              setShowPassword((current) => !current)
                            }
                            disabled={isSubmitting}
                            className={[
                              "absolute right-3.5 top-1/2 z-10",
                              "-translate-y-1/2",
                              "text-muted-foreground",
                              "transition-opacity duration-150",
                              "hover:text-foreground hover:opacity-75",
                              "focus-visible:outline-none",
                              "focus-visible:text-foreground",
                              "disabled:cursor-not-allowed",
                              "disabled:opacity-50",
                            ].join(" ")}
                            aria-label={
                              showPassword ? "Hide password" : "Show password"
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
                    ACCOUNT TYPE
                ========================================= */}

                <Controller
                  name="isAllocat"
                  control={form.control}
                  render={({ field }) => (
                    <Field>
                      <div>
                        <p className="text-[0.68rem] font-semibold text-foreground/75">
                          How will you use Allocatr?
                        </p>

                        <p className="mt-1 text-[0.62rem] leading-5 text-muted-foreground">
                          Choose how you want to get started.
                        </p>
                      </div>

                      <div className="grid gap-2 sm:grid-cols-2">
                        <AccountTypeOption
                          selected={!field.value}
                          title="Client"
                          description="I need work done"
                          icon={UserIcon}
                          onClick={() => {
                            field.onChange(false);
                            clearServerError();
                          }}
                          disabled={isSubmitting}
                        />

                        <AccountTypeOption
                          selected={field.value}
                          title="Allocat"
                          description="I offer capability"
                          icon={BriefcaseBusinessIcon}
                          onClick={() => {
                            field.onChange(true);
                            clearServerError();
                          }}
                          disabled={isSubmitting}
                        />
                      </div>

                      <p className="text-[0.58rem] leading-5 text-muted-foreground/75">
                        Allocats can still create their own projects.
                      </p>
                    </Field>
                  )}
                />

                {/* =========================================
                    SERVER ERROR
                ========================================= */}

                {serverError && (
                  <div
                    className={[
                      "rounded-lg border px-3.5 py-3",
                      "border-destructive/20",
                      "bg-destructive/[0.045]",
                      "text-[0.68rem] leading-5",
                      "text-destructive",
                    ].join(" ")}
                  >
                    {serverError.message}
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
                    "h-11 w-full rounded-lg",
                    "text-xs font-semibold",
                    primaryButton,
                  ].join(" ")}
                >
                  {isSubmitting ? (
                    <>
                      <LoaderCircleIcon size={15} className="animate-spin" />
                      Creating account
                    </>
                  ) : (
                    <>
                      Create account
                      <ArrowRightIcon size={14} />
                    </>
                  )}
                </Button>

                {/* =========================================
                    LOGIN
                ========================================= */}

                <p className="text-center text-xs text-muted-foreground">
                  Already have an account?{" "}
                  <Link
                    to={loginUrl}
                    className={[
                      "font-semibold",
                      "text-brand-secondary-highlight",
                      "transition-opacity",
                      "hover:opacity-70",
                      "dark:text-secondary",
                    ].join(" ")}
                  >
                    Sign in
                  </Link>
                </p>
              </form>
            </div>

            {/* =============================================
                TERMS
            ============================================= */}

            <p className="mx-auto mt-5 max-w-md text-center text-[0.6rem] leading-5 text-muted-foreground/70">
              By creating an account, you agree to our{" "}
              <Link
                to="/terms"
                className="underline underline-offset-2 transition-opacity hover:opacity-70"
              >
                Terms
              </Link>{" "}
              and{" "}
              <Link
                to="/privacy"
                className="underline underline-offset-2 transition-opacity hover:opacity-70"
              >
                Privacy Policy
              </Link>
              .
            </p>

            <div className="mt-4 flex items-center justify-center gap-2 text-[0.58rem] text-muted-foreground/65">
              <LockKeyholeIcon size={10} />
              Secure Allocatr registration
            </div>
          </motion.div>
        </section>

        {/* =================================================
            FOOTER
        ================================================= */}

        <footer className="relative z-20 border-t border-border/50 px-4 py-5 sm:px-6 md:px-8">
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
   ACCOUNT TYPE
========================================================= */

function AccountTypeOption({
  selected,
  title,
  description,
  icon: Icon,
  onClick,
  disabled,
}: {
  selected: boolean;
  title: string;
  description: string;
  icon: ComponentType<{
    size?: number;
    className?: string;
  }>;
  onClick: () => void;
  disabled: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-pressed={selected}
      className={[
        "group relative flex min-h-[68px] items-center gap-3",
        "rounded-xl border px-3.5 py-3",
        "text-left",
        "transition-[background-color,border-color,color] duration-200",
        "focus-visible:outline-none",
        "focus-visible:ring-2",
        "focus-visible:ring-brand-secondary-highlight/15",
        "disabled:cursor-not-allowed",
        "disabled:opacity-50",

        selected
          ? [
              "border-brand-secondary-highlight/25",
              "bg-brand-secondary-highlight/[0.07]",
              "text-foreground",
              "dark:border-secondary/15",
              "dark:bg-secondary/[0.055]",
              "dark:focus-visible:ring-secondary/15",
            ].join(" ")
          : [
              "border-border/60",
              "bg-surface-2/25",
              "text-foreground/70",
              "hover:border-border/85",
              "hover:bg-surface-3/45",
              "hover:text-foreground",
              "dark:border-border",
              "dark:bg-surface-2/45",
              "dark:hover:bg-surface-3/60",
            ].join(" "),
      ].join(" ")}
    >
      <span
        className={[
          "flex h-8 w-8 shrink-0 items-center justify-center",
          "rounded-lg",
          "transition-colors",

          selected
            ? [
                "bg-brand-secondary-highlight/[0.10]",
                "text-brand-secondary-highlight",
                "dark:bg-secondary/[0.10]",
                "dark:text-secondary",
              ].join(" ")
            : [
                "bg-surface-3/70",
                "text-muted-foreground",
                "dark:bg-surface-2",
              ].join(" "),
        ].join(" ")}
      >
        <Icon size={14} />
      </span>

      <span className="min-w-0 flex-1">
        <span className="flex items-center gap-1.5">
          <span className="text-xs font-semibold">{title}</span>

          {selected && (
            <span
              className={[
                "flex h-4 w-4 items-center justify-center",
                "rounded-full",
                "bg-brand-secondary-highlight",
                "text-primary-foreground",
                "dark:bg-secondary",
                "dark:text-secondary-foreground",
              ].join(" ")}
            >
              <CheckIcon size={9} strokeWidth={3} />
            </span>
          )}
        </span>

        <span className="mt-0.5 block text-[0.52rem] leading-4 text-muted-foreground">
          {description}
        </span>
      </span>
    </button>
  );
}

/* =========================================================
   POST REGISTER PATH
========================================================= */

function getPostRegisterPath(isAllocat: boolean, returnTo: string | null) {
  if (isAllocat) {
    return "/allocats/profile/create";
  }

  return returnTo || "/projects";
}

/* =========================================================
   RETURN PATH
========================================================= */

function getSafeReturnTo(value: string | null): string | null {
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
   REGISTER ERROR
========================================================= */

function getRegisterErrorMessage(error: unknown): string {
  const fallback =
    "We couldn’t create your account. Check your details and try again.";

  if (typeof error !== "object" || error === null || !("response" in error)) {
    return fallback;
  }

  const response = (
    error as {
      response?: {
        data?: {
          message?: string;
        };
      };
    }
  ).response;

  const backendMessage = response?.data?.message?.trim();

  if (!backendMessage) {
    return fallback;
  }

  const normalizedMessage = backendMessage.toLowerCase();

  if (
    normalizedMessage.includes("duplicate email") ||
    normalizedMessage.includes("email already") ||
    normalizedMessage.includes("already registered") ||
    normalizedMessage.includes("already exists")
  ) {
    return "An account with that email may already exist. Try signing in instead.";
  }

  return backendMessage;
}
