import {
  ArrowLeftIcon,
  ArrowRightIcon,
  EyeIcon,
  EyeOffIcon,
  LoaderCircleIcon,
  LockKeyholeIcon,
  MailIcon,
} from "lucide-react";

import { useEffect, useState } from "react";
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

const LOGIN_IMAGE =
  "https://images.pexels.com/photos/730896/pexels-photo-730896.jpeg?cs=srgb&dl=pexels-snapwire-730896.jpg&fm=jpg";

/* =========================================================
   VALIDATION
========================================================= */

const loginSchema = z.object({
  email: z.string().trim().min(1, "Email address is required.").email("Enter a valid email address."),
  password: z.string().min(1, "Password is required.").min(8, "Password must be at least 8 characters."),
});

type LoginFormValues = z.infer<typeof loginSchema>;

/* =========================================================
   LOGIN
========================================================= */

export default function Login() {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [showPassword, setShowPassword] = useState(false);

  const returnTo = getSafeReturnTo(searchParams.get("returnTo"));
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
  const credentialsError = form.formState.errors.root?.credentials;

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

  async function handleLogin(values: LoginFormValues) {
    form.clearErrors("root.credentials");

    try {
      await login(values.email.trim(), values.password);

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
      <style>
        {`
          .allocatr-login {
            color-scheme: dark;
          }

          .allocatr-login input {
            color-scheme: dark;
          }

          .allocatr-login-input:-webkit-autofill,
          .allocatr-login-input:-webkit-autofill:hover,
          .allocatr-login-input:-webkit-autofill:focus,
          .allocatr-login-input:-webkit-autofill:active {
            -webkit-text-fill-color: #ffffff !important;
            caret-color: #ffffff !important;
            background-color: #151515 !important;
            -webkit-box-shadow: 0 0 0 1000px #151515 inset !important;
            box-shadow: 0 0 0 1000px #151515 inset !important;
            transition: background-color 9999s ease-out 0s, color 9999s ease-out 0s;
          }

          .allocatr-login-input:-moz-autofill {
            color: #ffffff !important;
            caret-color: #ffffff !important;
            background-color: #151515 !important;
            box-shadow: 0 0 0 1000px #151515 inset !important;
          }

          .allocatr-login-input:-webkit-autofill::first-line {
            color: #ffffff !important;
            font-family: inherit !important;
            font-size: inherit !important;
          }
        `}
      </style>

      <main className="allocatr-login dark relative min-h-screen overflow-hidden bg-[#111111] text-white">

        {/* BACKGROUND */}

        <div className="absolute inset-0">
          <img
            src={LOGIN_IMAGE}
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

        {/* LOGIN AREA */}

        <section className="relative z-10 flex min-h-[calc(100vh-126px)] items-center justify-center px-5 py-10 sm:px-8">
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
            className="w-full max-w-[390px]"
          >
            <div className="overflow-hidden rounded-[1.4rem] border border-white/[0.10] bg-[#242424]/90 shadow-2xl shadow-black/40 backdrop-blur-xl">

              {/* CARD BRAND */}

              <div className="px-7 pb-5 pt-8 text-center sm:px-8">
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
                  Welcome back
                </h1>

                <p className="mt-1.5 text-xs text-white/45">
                  {returnTo
                    ? "Sign in to continue where you left off"
                    : "Sign in to your workspace"}
                </p>
              </div>

              {/* FORM */}

              <form
                onSubmit={form.handleSubmit(handleLogin)}
                noValidate
                className="space-y-4 px-7 pb-7 sm:px-8"
              >

                {/* EMAIL */}

                <Controller
                  name="email"
                  control={form.control}
                  render={({ field, fieldState }) => {
                    const invalid = fieldState.invalid || Boolean(credentialsError);

                    return (
                      <Field data-invalid={invalid}>
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
                              invalid
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
                            aria-invalid={invalid}
                            onChange={event => {
                              field.onChange(event);
                              clearCredentialsError();
                            }}
                            className={[
                              "allocatr-login-input",
                              "h-11 rounded-lg",
                              "!bg-[#151515]",
                              "!text-white",
                              "pl-10 pr-4",
                              "shadow-none",
                              "placeholder:!text-white/30",
                              "focus-visible:ring-1",
                              invalid
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
                    );
                  }}
                />

                {/* PASSWORD */}

                <Controller
                  name="password"
                  control={form.control}
                  render={({ field, fieldState }) => {
                    const invalid = fieldState.invalid || Boolean(credentialsError);

                    return (
                      <Field data-invalid={invalid}>
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
                              invalid
                                ? "text-destructive"
                                : "text-white/35",
                            ].join(" ")}
                          />

                          <Input
                            {...field}
                            id="password"
                            type={showPassword ? "text" : "password"}
                            autoComplete="current-password"
                            placeholder="Password"
                            disabled={isSubmitting}
                            aria-invalid={invalid}
                            onChange={event => {
                              field.onChange(event);
                              clearCredentialsError();
                            }}
                            className={[
                              "allocatr-login-input",
                              "h-11 rounded-lg",
                              "!bg-[#151515]",
                              "!text-white",
                              "pl-10 pr-11",
                              "shadow-none",
                              "placeholder:!text-white/30",
                              "focus-visible:ring-1",
                              invalid
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
                    );
                  }}
                />

                {/* CREDENTIAL ERROR */}

                {credentialsError && (
                  <Field data-invalid>
                    <FieldError
                      errors={[credentialsError]}
                      className="text-[0.68rem] text-destructive"
                    />
                  </Field>
                )}

                {/* FORGOT PASSWORD */}

                <div className="flex justify-end">
                  <Link
                    to="/forgot-password"
                    className="text-[0.68rem] font-medium text-white/45 transition-colors hover:text-brand-primary"
                  >
                    Forgot password?
                  </Link>
                </div>

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

                      Signing in
                    </>
                  ) : (
                    <>
                      Sign in

                      <ArrowRightIcon
                        size={15}
                        className="transition-transform duration-200 group-hover:translate-x-0.5"
                      />
                    </>
                  )}
                </Button>

                {/* CREATE ACCOUNT */}

                <p className="pt-2 text-center text-xs text-white/55">
                  Don't have an account?{" "}

                  <Link
                    to={registerUrl}
                    className="font-semibold text-brand-primary transition-opacity hover:opacity-75"
                  >
                    Create account
                  </Link>
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
   LOGIN ERROR
========================================================= */

function getLoginErrorMessage(error: unknown): string {
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

  const status = response?.status;
  const backendMessage = response?.data?.message?.trim();
  const normalizedMessage = backendMessage?.toLowerCase();

  if (status === 401) return fallback;
  if (!normalizedMessage) return fallback;

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
    credentialMessages.some(message =>
      normalizedMessage.includes(message),
    )
  ) {
    return fallback;
  }

  return backendMessage || fallback;
}