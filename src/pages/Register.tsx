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
  UserIcon,
} from "lucide-react";

import { useEffect, useState, type ComponentType } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";

import { useAuth } from "@/auth/useAuth";

import assets from "@/assets/assets";
import AllocatrLogo from "@/components/AllocatrLogo";

import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

/* =========================================================
   IMAGE
========================================================= */

const REGISTER_IMAGE =
  "https://images.pexels.com/photos/730896/pexels-photo-730896.jpeg?cs=srgb&dl=pexels-snapwire-730896.jpg&fm=jpg";

/* =========================================================
   VALIDATION
========================================================= */

const registerSchema = z.object({
  fullName: z.string().trim().min(1, "Full name is required.").min(2, "Enter at least 2 characters.").max(100, "Keep your name below 100 characters."),
  email: z.string().trim().min(1, "Email address is required.").email("Enter a valid email address."),
  password: z.string().min(1, "Password is required.").min(8, "Password must be at least 8 characters."),
  isAllocat: z.boolean(),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

/* =========================================================
   REGISTER
========================================================= */

export default function Register() {
  const { register, user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

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
  ======================================================= */

  useEffect(() => {
    if (!user) return;

    navigate(returnTo || "/projects", {
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

      navigate(returnTo || "/projects", {
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
      <style>
        {`
          .allocatr-auth {
            color-scheme: dark;
          }

          .allocatr-auth input {
            color-scheme: dark;
          }

          .allocatr-auth-input:-webkit-autofill,
          .allocatr-auth-input:-webkit-autofill:hover,
          .allocatr-auth-input:-webkit-autofill:focus,
          .allocatr-auth-input:-webkit-autofill:active {
            -webkit-text-fill-color: #ffffff !important;
            caret-color: #ffffff !important;
            background-color: #151515 !important;
            -webkit-box-shadow: 0 0 0 1000px #151515 inset !important;
            box-shadow: 0 0 0 1000px #151515 inset !important;
            transition: background-color 9999s ease-out 0s, color 9999s ease-out 0s;
          }

          .allocatr-auth-input:-moz-autofill {
            color: #ffffff !important;
            caret-color: #ffffff !important;
            background-color: #151515 !important;
            box-shadow: 0 0 0 1000px #151515 inset !important;
          }

          .allocatr-auth-input:-webkit-autofill::first-line {
            color: #ffffff !important;
            font-family: inherit !important;
            font-size: inherit !important;
          }
        `}
      </style>

      <main className="allocatr-auth dark relative min-h-screen overflow-hidden bg-[#111111] text-white">

        {/* BACKGROUND */}

        <div className="absolute inset-0">
          <img
            src={REGISTER_IMAGE}
            alt=""
            className="h-full w-full object-cover object-center"
          />

          <div className="absolute inset-0 bg-black/20" />

          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.08)_0%,rgba(0,0,0,0.02)_40%,rgba(0,0,0,0.32)_100%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.18)_0%,transparent_28%,transparent_70%,rgba(0,0,0,0.32)_100%)]" />
        </div>

        {/* TOP BAR */}

        <header className="relative z-20 flex h-[76px] items-center border-b border-white/[0.06] bg-[#171717]/95 px-5 backdrop-blur-xl sm:px-8">
          <Link
            to="/"
            className="group inline-flex items-center"
            aria-label="Go to Allocatr home"
          >
            <AllocatrLogo
              theme="dark"
              className="w-[7.25rem] sm:w-[8rem]"
            />
          </Link>
        </header>

        {/* REGISTER AREA */}

        <section className="relative z-10 flex min-h-[calc(100vh-126px)] items-center justify-center px-5 py-8 sm:px-8 sm:py-10">
          <motion.div
            initial={{
              opacity: 0,
              y: 16,
              scale: 0.985,
            }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
            }}
            transition={{
              duration: 0.55,
              ease: "easeOut",
            }}
            className="w-full max-w-[430px]"
          >
            <div className="overflow-hidden rounded-[1.4rem] border border-white/[0.10] bg-[#242424]/90 shadow-2xl shadow-black/40 backdrop-blur-xl">

              {/* CARD BRAND */}

              <div className="px-7 pb-5 pt-7 text-center sm:px-8 sm:pt-8">
                <Link
                  to="/"
                  aria-label="Allocatr home"
                  className="mx-auto flex h-20 w-20 items-center justify-center rounded-[1.25rem] bg-black/30 ring-1 ring-white/[0.07] transition-transform duration-300 hover:scale-[1.03]"
                >
                  <img
                    src={assets.allocatrIcon}
                    alt="Allocatr"
                    className="h-12 w-12 object-contain"
                  />
                </Link>

                <h1 className="mt-5 text-xl font-black tracking-[-0.025em] text-white">
                  Join Allocatr
                </h1>

                <p className="mt-1.5 text-xs text-white/45">
                  {returnTo
                    ? "Create your account to continue"
                    : "Create your account and get started"}
                </p>
              </div>

              {/* FORM */}

              <form
                onSubmit={form.handleSubmit(handleRegister)}
                noValidate
                className="space-y-4 px-7 pb-7 sm:px-8"
              >

                {/* FULL NAME */}

                <Controller
                  name="fullName"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel
                        htmlFor="fullName"
                        className="sr-only"
                      >
                        Full name
                      </FieldLabel>

                      <div className="relative">
                        <UserIcon
                          size={16}
                          className={[
                            "pointer-events-none absolute left-3.5 top-1/2 z-10 -translate-y-1/2",
                            fieldState.invalid
                              ? "text-destructive"
                              : "text-white/35",
                          ].join(" ")}
                        />

                        <Input
                          {...field}
                          id="fullName"
                          type="text"
                          autoComplete="name"
                          placeholder="Full name"
                          disabled={isSubmitting}
                          aria-invalid={fieldState.invalid}
                          onChange={event => {
                            field.onChange(event);
                            clearServerError();
                          }}
                          className={[
                            "allocatr-auth-input",
                            "h-11 rounded-lg",
                            "!bg-[#151515]",
                            "!text-white",
                            "pl-10 pr-4",
                            "shadow-none",
                            "placeholder:!text-white/30",
                            "focus-visible:ring-1",
                            fieldState.invalid
                              ? "!border-destructive/70 focus-visible:!border-destructive focus-visible:ring-destructive/25"
                              : "!border-white/[0.12] focus-visible:!border-brand-primary/60 focus-visible:ring-brand-primary/30",
                          ].join(" ")}
                        />
                      </div>

                      <FieldError
                        errors={[fieldState.error]}
                        className="text-[0.68rem] text-destructive"
                      />
                    </Field>
                  )}
                />

                {/* EMAIL */}

                <Controller
                  name="email"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel
                        htmlFor="email"
                        className="sr-only"
                      >
                        Email address
                      </FieldLabel>

                      <div className="relative">
                        <MailIcon
                          size={16}
                          className={[
                            "pointer-events-none absolute left-3.5 top-1/2 z-10 -translate-y-1/2",
                            fieldState.invalid
                              ? "text-destructive"
                              : "text-white/35",
                          ].join(" ")}
                        />

                        <Input
                          {...field}
                          id="email"
                          type="email"
                          autoComplete="email"
                          placeholder="Email address"
                          disabled={isSubmitting}
                          aria-invalid={fieldState.invalid}
                          onChange={event => {
                            field.onChange(event);
                            clearServerError();
                          }}
                          className={[
                            "allocatr-auth-input",
                            "h-11 rounded-lg",
                            "!bg-[#151515]",
                            "!text-white",
                            "pl-10 pr-4",
                            "shadow-none",
                            "placeholder:!text-white/30",
                            "focus-visible:ring-1",
                            fieldState.invalid
                              ? "!border-destructive/70 focus-visible:!border-destructive focus-visible:ring-destructive/25"
                              : "!border-white/[0.12] focus-visible:!border-brand-primary/60 focus-visible:ring-brand-primary/30",
                          ].join(" ")}
                        />
                      </div>

                      <FieldError
                        errors={[fieldState.error]}
                        className="text-[0.68rem] text-destructive"
                      />
                    </Field>
                  )}
                />

                {/* PASSWORD */}

                <Controller
                  name="password"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel
                        htmlFor="password"
                        className="sr-only"
                      >
                        Password
                      </FieldLabel>

                      <div className="relative">
                        <LockKeyholeIcon
                          size={16}
                          className={[
                            "pointer-events-none absolute left-3.5 top-1/2 z-10 -translate-y-1/2",
                            fieldState.invalid
                              ? "text-destructive"
                              : "text-white/35",
                          ].join(" ")}
                        />

                        <Input
                          {...field}
                          id="password"
                          type={showPassword ? "text" : "password"}
                          autoComplete="new-password"
                          placeholder="Create a password"
                          disabled={isSubmitting}
                          aria-invalid={fieldState.invalid}
                          onChange={event => {
                            field.onChange(event);
                            clearServerError();
                          }}
                          className={[
                            "allocatr-auth-input",
                            "h-11 rounded-lg",
                            "!bg-[#151515]",
                            "!text-white",
                            "pl-10 pr-11",
                            "shadow-none",
                            "placeholder:!text-white/30",
                            "focus-visible:ring-1",
                            fieldState.invalid
                              ? "!border-destructive/70 focus-visible:!border-destructive focus-visible:ring-destructive/25"
                              : "!border-white/[0.12] focus-visible:!border-brand-primary/60 focus-visible:ring-brand-primary/30",
                          ].join(" ")}
                        />

                        <button
                          type="button"
                          onClick={() => setShowPassword(current => !current)}
                          disabled={isSubmitting}
                          className="absolute right-3.5 top-1/2 z-10 -translate-y-1/2 text-white/35 transition-colors hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                          aria-label={
                            showPassword
                              ? "Hide password"
                              : "Show password"
                          }
                        >
                          {showPassword ? (
                            <EyeOffIcon size={16} />
                          ) : (
                            <EyeIcon size={16} />
                          )}
                        </button>
                      </div>

                      <FieldError
                        errors={[fieldState.error]}
                        className="text-[0.68rem] text-destructive"
                      />
                    </Field>
                  )}
                />

                {/* ACCOUNT TYPE */}

                <Controller
                  name="isAllocat"
                  control={form.control}
                  render={({ field }) => (
                    <Field>
                      <div>
                        <p className="text-[0.68rem] font-semibold text-white/70">
                          How will you use Allocatr?
                        </p>

                        <p className="mt-1 text-[0.64rem] leading-5 text-white/35">
                          You can still create projects as an Allocat.
                        </p>
                      </div>

                      <div className="grid grid-cols-2 overflow-hidden rounded-lg border border-white/[0.10] bg-black/20">
                        <AccountTypeOption
                          selected={!field.value}
                          title="Client"
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
                          icon={BriefcaseBusinessIcon}
                          onClick={() => {
                            field.onChange(true);
                            clearServerError();
                          }}
                          disabled={isSubmitting}
                          divided
                        />
                      </div>
                    </Field>
                  )}
                />

                {/* SERVER ERROR */}

                {serverError && (
                  <Field data-invalid>
                    <FieldError
                      errors={[serverError]}
                      className="text-[0.68rem] text-destructive"
                    />
                  </Field>
                )}

                {/* SUBMIT */}

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="group mt-1 h-11 w-full rounded-lg bg-brand-primary font-bold text-dark-gray shadow-none hover:bg-brand-primary/90"
                >
                  {isSubmitting ? (
                    <>
                      <LoaderCircleIcon
                        size={16}
                        className="animate-spin"
                      />

                      Creating account
                    </>
                  ) : (
                    <>
                      Create account

                      <ArrowRightIcon
                        size={15}
                        className="transition-transform duration-200 group-hover:translate-x-0.5"
                      />
                    </>
                  )}
                </Button>

                {/* LOGIN */}

                <p className="pt-1 text-center text-xs text-white/55">
                  Already have an account?{" "}

                  <Link
                    to={loginUrl}
                    className="font-semibold text-brand-primary transition-opacity hover:opacity-75"
                  >
                    Sign in
                  </Link>
                </p>

                {/* TERMS */}

                <p className="text-center text-[0.62rem] leading-5 text-white/30">
                  By creating an account, you agree to our{" "}

                  <Link
                    to="/terms"
                    className="underline underline-offset-2 transition-colors hover:text-white/60"
                  >
                    Terms
                  </Link>

                  {" "}and{" "}

                  <Link
                    to="/privacy"
                    className="underline underline-offset-2 transition-colors hover:text-white/60"
                  >
                    Privacy Policy
                  </Link>
                  .
                </p>
              </form>
            </div>

            <p className="mt-4 text-center text-[0.62rem] text-white/40">
              Work, properly allocated.
            </p>
          </motion.div>
        </section>

        {/* BOTTOM BAR */}

        <footer className="relative z-20 flex min-h-[50px] items-center justify-between gap-4 border-t border-white/[0.06] bg-[#171717]/95 px-5 backdrop-blur-xl sm:px-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-[0.68rem] font-medium uppercase tracking-[0.08em] text-white/45 transition-colors hover:text-brand-primary"
          >
            <ArrowLeftIcon size={12} />
            Back to website
          </Link>

          <div className="flex items-center gap-3 text-[0.65rem] text-white/30">
            <LockKeyholeIcon size={11} />

            <span className="hidden sm:inline">
              Secure Allocatr access
            </span>

            <span>
              © {new Date().getFullYear()}
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
  icon: Icon,
  onClick,
  disabled,
  divided = false,
}: {
  selected: boolean;
  title: string;
  icon: ComponentType<{
    size?: number;
    className?: string;
  }>;
  onClick: () => void;
  disabled: boolean;
  divided?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-pressed={selected}
      className={[
        "relative flex h-12 items-center justify-center gap-2",
        "text-xs font-semibold",
        "transition-colors duration-200",
        "disabled:cursor-not-allowed",
        "disabled:opacity-50",
        divided
          ? "border-l border-white/[0.10]"
          : "",
        selected
          ? "bg-brand-primary text-dark-gray"
          : "text-white/45 hover:bg-white/[0.04] hover:text-white",
      ].join(" ")}
    >
      <Icon size={14} />

      {title}

      {selected && (
        <CheckIcon
          size={12}
          strokeWidth={3}
        />
      )}
    </button>
  );
}

/* =========================================================
   RETURN PATH
========================================================= */

function getSafeReturnTo(value: string | null): string | null {
  if (!value) return null;

  const trimmed = value.trim();

  if (!trimmed.startsWith("/")) return null;
  if (trimmed.startsWith("//")) return null;
  if (trimmed.startsWith("/login")) return null;
  if (trimmed.startsWith("/register")) return null;

  return trimmed;
}

/* =========================================================
   REGISTER ERROR
========================================================= */

function getRegisterErrorMessage(error: unknown): string {
  const fallback =
    "We couldn’t create your account. Check your details and try again.";

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
        data?: {
          message?: string;
        };
      };
    }
  ).response;

  const backendMessage =
    response?.data?.message?.trim();

  if (!backendMessage) return fallback;

  const normalizedMessage =
    backendMessage.toLowerCase();

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