// import { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { Loader2 } from "lucide-react";
// import { useAuth } from "../auth/useAuth";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { Label } from "@/components/ui/label";
// import AllocatrLogo from "@/components/AllocatrLogo";

// export default function Register() {
//   const theme = localStorage.getItem("theme") || "dark";
//   const { register } = useAuth();
//   const navigate = useNavigate();

//   const [fullName, setFullName] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [isAllocat, setIsAllocat] = useState(false);
//   const [loading, setLoading] = useState(false);

//   async function handleSubmit(e: React.FormEvent) {
//     e.preventDefault();
//     if (loading) return;

//     try {
//       setLoading(true);
//       await register(fullName, email, password, isAllocat);
//       navigate("/projects");
//     } finally {
//       setLoading(false);
//     }
//   }

//   return (
//     <>    
//     <main className="flex flex-col items-center">
//       <AllocatrLogo theme={theme} className="w-24 py-6 mt-[5%]"/>
//       <form className="container max-w-lg space-y-6 border bg-muted-foreground/5 pt-4 pb-8 px-8 rounded-sm" onSubmit={handleSubmit}>
//         <span className="flex items-center justify-between">
//           <h1 className="text-2xl font-bold">Create account</h1>
//         </span>

//         <span className="flex flex-col gap-3">
//           {/* <Label htmlFor="fullName">Full name</Label> */}
//           <Input
//             id="fullName"
//             type="text"
//             value={fullName}
//             placeholder="Full name"
//             onChange={e => setFullName(e.target.value)}
//             required
//             className="h-12 border-none px-4 shadow-none"
//           />
//         </span>

//         <span className="flex flex-col gap-3">
//           {/* <Label htmlFor="email">Email</Label> */}
//           <Input
//             id="email"
//             type="email"
//             value={email}
//             placeholder="Email"
//             onChange={e => setEmail(e.target.value)}
//             required
//             className="h-12 border-none px-4 shadow-none"
//           />
//         </span>

//         <span className="flex flex-col gap-3">
//           {/* <Label htmlFor="password">Password</Label> */}
//           <Input
//             id="password"
//             type="password"
//             value={password}
//             placeholder="Password"
//             onChange={e => setPassword(e.target.value)}
//             required
//             className="h-12 border-none px-4 shadow-none"
//           />
//         </span>

//         {/* <span className="flex items-center gap-2">
//           <input
//             id="isAllocat"
//             type="checkbox"
//             className="border-2 bg-red-500"
//           />
//           <Label htmlFor="isAllocat">Sign up as allocat</Label>          
//         </span> */}

//         <label className="flex items-center gap-3 cursor-pointer">
//           <input
//             type="checkbox"
//             checked={isAllocat}
//             onChange={(e) => setIsAllocat(e.target.checked)}
//             className="
//               appearance-none
//               w-5 h-5
//               border-2 border-gray-300
//               rounded-md
//               bg-muted-foreground/20
//               checked:bg-dark-gray
//               checked:border-none
//               checked:after:content-['✓']
//               checked:after:text-brand-primary
//               checked:after:text-sm
//               checked:after:flex
//               checked:after:items-center
//               checked:after:justify-center
//               checked:after:w-full
//               checked:after:h-full
//               transition
//               duration-150
//             "
//           />
//           <span className="text-sm font-medium">Sign up as allocat</span>
//         </label>


//         <Button type="submit" disabled={loading} className="flex gap-2 h-12 w-full">
//           {loading && <Loader2 className="h-4 w-4 animate-spin" />}
//           {loading ? "Creating account…" : "Create Account"}
//         </Button>
//         <span
//           className="flex gap-2 text-sm text-muted-foreground"
//         >
//             Already have an account?
//             <Link
//               to="/login"
//               className="text-accent-3 font-medium"
//             >
//               Login
//             </Link>
//         </span>
//       </form>      
//     </main>
//     </>
//   );
// }


import {
  AlertCircleIcon,
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
import {
  useState,
  type FormEvent,
} from "react";
import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "@/auth/useAuth";
import AllocatrLogo from "@/components/AllocatrLogo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const theme =
    localStorage.getItem("theme") === "light"
      ? "light"
      : "dark";

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isAllocat, setIsAllocat] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (loading) return;

    setError("");
    setLoading(true);

    try {
      await register(
        fullName.trim(),
        email.trim(),
        password,
        isAllocat,
      );

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
          "We could not create your account. Please check your details and try again.",
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
              className="relative inline-flex w-fit"
              aria-label="Go to Allocatr home"
            >
              <AllocatrLogo
                theme={theme}
                className="w-28"
              />
            </Link>

            <div className="relative max-w-lg">
              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-primary">
                Start with a clear workspace
              </p>

              <h1 className="mt-6 text-5xl font-black uppercase leading-[0.92] tracking-[-0.055em] xl:text-6xl">
                Build better work from day one.
              </h1>

              <p className="mt-7 max-w-md text-base leading-8 text-muted-foreground">
                Create projects, coordinate deadlines and work
                with clients or Allocats from one shared workspace.
              </p>
            </div>

            <p className="relative text-xs text-muted-foreground">
              One workspace for clients and professionals
            </p>
          </section>

          {/* Register form */}
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
                  Create your account
                </p>

                <h2 className="mt-4 text-3xl font-black uppercase tracking-[-0.035em] sm:text-4xl">
                  Join Allocatr.
                </h2>

                <p className="mt-3 text-sm leading-7 text-muted-foreground">
                  Set up your workspace and choose how you want
                  to use the platform.
                </p>
              </header>

              <form
                className="mt-10 space-y-6"
                onSubmit={handleSubmit}
              >
                <div className="space-y-2">
                  <label
                    htmlFor="fullName"
                    className="text-sm font-semibold"
                  >
                    Full name
                  </label>

                  <div className="relative">
                    <UserIcon
                      size={17}
                      className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
                    />

                    <Input
                      id="fullName"
                      name="fullName"
                      type="text"
                      autoComplete="name"
                      placeholder="Trevor Ngwenya"
                      value={fullName}
                      onChange={(event) =>
                        setFullName(event.target.value)
                      }
                      disabled={loading}
                      className="h-[52px] rounded-2xl border-border bg-background pl-11 pr-4 shadow-none"
                      required
                    />
                  </div>
                </div>

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
                      className="h-[52px] rounded-2xl border-border bg-background pl-11 pr-4 shadow-none"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="password"
                    className="text-sm font-semibold"
                  >
                    Password
                  </label>

                  <div className="relative">
                    <LockKeyholeIcon
                      size={17}
                      className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
                    />

                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="new-password"
                      placeholder="Create a secure password"
                      value={password}
                      onChange={(event) =>
                        setPassword(event.target.value)
                      }
                      disabled={loading}
                      minLength={8}
                      className="h-[52px] rounded-2xl border-border bg-background pl-11 pr-12 shadow-none"
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

                  <p className="text-xs leading-5 text-muted-foreground">
                    Use at least eight characters.
                  </p>
                </div>

                {/* Account type */}                
                <fieldset className="space-y-3">
                  <legend className="text-sm font-semibold">
                    Account type
                  </legend>

                  <button
                    type="button"
                    onClick={() => setIsAllocat(false)}
                    disabled={loading}
                    className={[
                      "relative flex w-full items-start gap-4 rounded-2xl border p-4 text-left transition-all duration-200",
                      !isAllocat
                        ? "border-primary bg-primary text-primary-foreground shadow-lg shadow-primary/20 ring-2 ring-primary/15 scale-[1.015]"
                        : "border-border bg-background hover:border-primary/30 hover:bg-muted/40",
                    ].join(" ")}
                  >
                    {!isAllocat && (
                      <div className="absolute right-4 top-4 flex h-6 w-6 items-center justify-center rounded-full bg-primary-foreground text-primary">
                        <CheckIcon size={14} strokeWidth={3} />
                      </div>
                    )}

                    <span
                      className={[
                        "mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-colors",
                        !isAllocat
                          ? "bg-primary-foreground/15 text-primary-foreground"
                          : "bg-muted text-muted-foreground",
                      ].join(" ")}
                    >
                      <UserIcon size={18} />
                    </span>

                    <span className="min-w-0">
                      <span className="block text-sm font-bold">
                        Client account
                      </span>

                      <span
                        className={[
                          "mt-1 block text-xs leading-5",
                          !isAllocat
                            ? "text-primary-foreground/80"
                            : "text-muted-foreground",
                        ].join(" ")}
                      >
                        Create projects, manage work and hire Allocats.
                      </span>
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsAllocat(true)}
                    disabled={loading}
                    className={[
                      "relative flex w-full items-start gap-4 rounded-2xl border p-4 text-left transition-all duration-200",
                      isAllocat
                        ? "border-primary bg-primary text-primary-foreground shadow-lg shadow-primary/20 ring-2 ring-primary/15 scale-[1.015]"
                        : "border-border bg-background hover:border-primary/30 hover:bg-muted/40",
                    ].join(" ")}
                  >
                    {isAllocat && (
                      <div className="absolute right-4 top-4 flex h-6 w-6 items-center justify-center rounded-full bg-primary-foreground text-primary">
                        <CheckIcon size={14} strokeWidth={3} />
                      </div>
                    )}

                    <span
                      className={[
                        "mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-colors",
                        isAllocat
                          ? "bg-primary-foreground/15 text-primary-foreground"
                          : "bg-muted text-muted-foreground",
                      ].join(" ")}
                    >
                      <BriefcaseBusinessIcon size={18} />
                    </span>

                    <span className="min-w-0">
                      <span className="block text-sm font-bold">
                        Allocat account
                      </span>

                      <span
                        className={[
                          "mt-1 block text-xs leading-5",
                          isAllocat
                            ? "text-primary-foreground/80"
                            : "text-muted-foreground",
                        ].join(" ")}
                      >
                        Offer your professional skills and work on client projects.
                      </span>
                    </span>
                  </button>
                </fieldset>

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
                  className="h-[52px] w-full rounded-2xl font-semibold"
                >
                  {loading ? (
                    <>
                      <LoaderCircleIcon className="animate-spin" />
                      Creating account
                    </>
                  ) : (
                    <>
                      Create account
                      <ArrowRightIcon />
                    </>
                  )}
                </Button>
              </form>

              <div className="mt-8 border-t border-border pt-7">
                <p className="text-sm text-muted-foreground">
                  Already have an account?{" "}
                  <Link
                    to="/login"
                    className="font-semibold text-foreground transition-colors hover:text-primary"
                  >
                    Sign in
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