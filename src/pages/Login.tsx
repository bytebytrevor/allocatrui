import {
  AlertCircleIcon,
  ArrowRightIcon,
  EyeIcon,
  EyeOffIcon,
  LoaderCircleIcon,
  LockKeyholeIcon,
  MailIcon,
} from "lucide-react";
import {
  useEffect,
  useState,
  type FormEvent,
} from "react";
import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "@/auth/useAuth";
import AllocatrLogo from "@/components/AllocatrLogo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Login() {
  const { login, user } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const theme =
    localStorage.getItem("theme") === "light"
      ? "light"
      : "dark";

  useEffect(() => {
    if (user) {
      navigate("/projects", {
        replace: true,
      });
    }
  }, [user, navigate]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (loading) return;

    setError("");
    setLoading(true);

    try {
      await login(email.trim(), password);

      navigate("/projects", {
        replace: true,
      });
    } catch (error: unknown) {
      const message =
        typeof error === "object" &&
        error !== null &&
        "response" in error
          ? (
              error as {
                response?: {
                  data?: {
                    message?: string;
                  };
                };
              }
            ).response?.data?.message
          : undefined;

      setError(
        message ||
          "We could not sign you in. Check your details and try again.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-background text-foreground">
      {/* Background decoration */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-40 -top-40 h-[32rem] w-[32rem] rounded-full bg-primary/[0.08] blur-3xl" />

        <div className="absolute -bottom-48 -right-32 h-[34rem] w-[34rem] rounded-full bg-primary/[0.06] blur-3xl" />

        <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--border)/0.16)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border)/0.16)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:linear-gradient(to_bottom,black,transparent_85%)]" />
      </div>

      <div className="container relative mx-auto flex min-h-screen items-center justify-center px-5 py-10 md:px-8">
        <div className="grid w-full max-w-6xl overflow-hidden rounded-[2.25rem] border border-border bg-card text-card-foreground lg:grid-cols-[1.05fr_0.95fr]">
          {/* Brand panel */}
          <section className="relative hidden overflow-hidden border-r border-border bg-primary/[0.04] p-12 lg:flex lg:flex-col lg:justify-between xl:p-16">
            <div className="absolute -right-24 top-12 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />

            <Link
              to="/"
              className="relative inline-flex w-fit items-center"
              aria-label="Go to Allocatr home"
            >
              <AllocatrLogo
                theme={theme}
                className="w-28"
              />
            </Link>

            <div className="relative max-w-lg">
              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-primary">
                Your work. Clearly organised.
              </p>

              <h1 className="mt-6 text-5xl font-black uppercase leading-[0.92] tracking-[-0.055em] xl:text-6xl">
                Welcome back to your workspace.
              </h1>

              <p className="mt-7 max-w-md text-base leading-8 text-muted-foreground">
                Manage your projects, collaborate with Allocats and
                keep every deadline in view.
              </p>
            </div>

            <p className="relative text-xs text-muted-foreground">
              Allocatr project workspace
            </p>
          </section>

          {/* Login form */}
          <section className="flex items-center px-6 py-10 sm:px-10 md:px-14 lg:px-12 xl:px-16">
            <div className="mx-auto w-full max-w-md">
              <Link
                to="/"
                className="mb-12 inline-flex lg:hidden"
                aria-label="Go to Allocatr home"
              >
                <AllocatrLogo
                  theme={theme}
                  className="w-28"
                />
              </Link>

              <header>
                <p className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-primary">
                  Account access
                </p>

                <h2 className="mt-4 text-3xl font-black uppercase tracking-[-0.035em] sm:text-4xl">
                  Welcome back.
                </h2>

                <p className="mt-3 text-sm leading-7 text-muted-foreground">
                  Sign in to continue to your Allocatr workspace.
                </p>
              </header>

              <form
                className="mt-10 space-y-6"
                onSubmit={handleSubmit}
              >
                <div className="space-y-2">
                  <label
                    htmlFor="email"
                    className="text-sm font-semibold"
                  >
                    Email address
                  </label>

                  <div className="relative">
                    <MailIcon
                      size={17}
                      className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
                    />

                    <Input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(event) =>
                        setEmail(event.target.value)
                      }
                      disabled={loading}
                      className="h-13 rounded-2xl border-border bg-background pl-11 pr-4 shadow-none"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-4">
                    <label
                      htmlFor="password"
                      className="text-sm font-semibold"
                    >
                      Password
                    </label>

                    <Link
                      to="/forgot-password"
                      className="text-xs font-semibold text-primary transition-opacity hover:opacity-75"
                    >
                      Forgot password?
                    </Link>
                  </div>

                  <div className="relative">
                    <LockKeyholeIcon
                      size={17}
                      className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
                    />

                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(event) =>
                        setPassword(event.target.value)
                      }
                      disabled={loading}
                      className="h-13 rounded-2xl border-border bg-background pl-11 pr-12 shadow-none"
                      required
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword((current) => !current)
                      }
                      disabled={loading}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50"
                      aria-label={
                        showPassword
                          ? "Hide password"
                          : "Show password"
                      }
                    >
                      {showPassword ? (
                        <EyeOffIcon size={18} />
                      ) : (
                        <EyeIcon size={18} />
                      )}
                    </button>
                  </div>
                </div>

                {error && (
                  <div
                    className="flex items-start gap-3 rounded-2xl border border-destructive/20 bg-destructive/[0.06] p-4 text-destructive"
                    role="alert"
                  >
                    <AlertCircleIcon
                      size={18}
                      className="mt-0.5 shrink-0"
                    />

                    <p className="text-sm leading-6">
                      {error}
                    </p>
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={loading}
                  className="h-13 w-full rounded-2xl font-semibold"
                >
                  {loading ? (
                    <>
                      <LoaderCircleIcon className="animate-spin" />
                      Signing in
                    </>
                  ) : (
                    <>
                      Sign in
                      <ArrowRightIcon />
                    </>
                  )}
                </Button>
              </form>

              <div className="mt-8 border-t border-border pt-7">
                <p className="text-sm text-muted-foreground">
                  Don&apos;t have an account?{" "}
                  <Link
                    to="/register"
                    className="font-semibold text-foreground transition-colors hover:text-primary"
                  >
                    Create an account
                  </Link>
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}