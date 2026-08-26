// import {
//   AlertCircleIcon,
//   ArrowLeftIcon,
//   ArrowRightIcon,
//   EyeIcon,
//   EyeOffIcon,
//   LoaderCircleIcon,
//   LockKeyholeIcon,
//   MailIcon,
// } from "lucide-react";

// import {
//   useEffect,
//   useState,
//   type FormEvent,
// } from "react";

// import {
//   Link,
//   useNavigate,
// } from "react-router-dom";

// import {
//   motion,
// } from "framer-motion";

// import { useAuth } from "@/auth/useAuth";
// import assets from "@/assets/assets";

// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";

// export default function Login() {
//   const { login, user } = useAuth();
//   const navigate = useNavigate();

//   const [email, setEmail] =
//     useState("");

//   const [password, setPassword] =
//     useState("");

//   const [
//     showPassword,
//     setShowPassword,
//   ] = useState(false);

//   const [loading, setLoading] =
//     useState(false);

//   const [error, setError] =
//     useState("");

//   useEffect(() => {
//     if (user) {
//       navigate("/projects", {
//         replace: true,
//       });
//     }
//   }, [user, navigate]);

//   async function handleSubmit(
//     event: FormEvent<HTMLFormElement>,
//   ) {
//     event.preventDefault();

//     if (loading) {
//       return;
//     }

//     setError("");
//     setLoading(true);

//     try {
//       await login(
//         email.trim(),
//         password,
//       );

//       navigate("/projects", {
//         replace: true,
//       });
//     } catch (error: unknown) {
//       const message =
//         typeof error === "object" &&
//         error !== null &&
//         "response" in error
//           ? (
//               error as {
//                 response?: {
//                   data?: {
//                     message?: string;
//                   };
//                 };
//               }
//             ).response?.data
//               ?.message
//           : undefined;

//       setError(
//         message ||
//           "We could not sign you in. Check your details and try again.",
//       );
//     } finally {
//       setLoading(false);
//     }
//   }

//   return (
//     <main className="relative min-h-screen bg-background text-foreground">
//       {/* =====================================================
//           BACKGROUND
//       ===================================================== */}

//       <div className="pointer-events-none absolute inset-0 overflow-hidden">
//         <div className="absolute -left-40 -top-48 h-[32rem] w-[32rem] rounded-full bg-primary/[0.035] blur-3xl" />

//         <div className="absolute -bottom-48 -right-32 h-[34rem] w-[34rem] rounded-full bg-primary/[0.025] blur-3xl" />
//       </div>

//       {/* =====================================================
//           PAGE
//       ===================================================== */}

//       <div className="relative mx-auto flex min-h-screen w-full max-w-[1440px]">
//         {/* =================================================
//             BRAND PANEL
//         ================================================= */}

//         <section
//           className={[
//             "relative hidden w-[46%] overflow-hidden",
//             "border-r border-border/70",
//             "px-10 py-8 lg:flex lg:flex-col",
//             "xl:px-16 xl:py-10",
//           ].join(" ")}
//         >
//           {/* Logo */}

//           <Link
//             to="/"
//             className="group inline-flex w-fit items-center gap-2.5"
//             aria-label="Go to Allocatr home"
//           >
//             <img
//               src={assets.allocatrIcon}
//               alt=""
//               className={[
//                 "h-8 w-8 object-contain",
//                 "transition-transform duration-300",
//                 "group-hover:-rotate-3",
//               ].join(" ")}
//             />

//             <span className="text-lg font-black tracking-[-0.035em]">
//               Allocatr
//             </span>
//           </Link>

//           {/* Main statement */}

//           <div className="my-auto max-w-xl py-16">
//             <motion.div
//               initial={{
//                 opacity: 0,
//                 y: 22,
//               }}
//               animate={{
//                 opacity: 1,
//                 y: 0,
//               }}
//               transition={{
//                 duration: 0.65,
//                 ease: "easeOut",
//               }}
//             >
//               <p className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-primary">
//                 Your workspace
//               </p>

//               <h1 className="mt-5 text-5xl font-black leading-[1.03] tracking-[-0.035em] xl:text-[3.75rem]">
//                 Everything you need
//                 to keep work moving.
//               </h1>

//               <p className="mt-6 max-w-lg text-base leading-8 text-muted-foreground">
//                 Manage projects,
//                 collaborate with skilled
//                 professionals and keep
//                 progress visible from one
//                 place.
//               </p>
//             </motion.div>

//             {/* Product cues */}

//             <motion.div
//               className="mt-12 max-w-lg border-y border-border"
//               initial={{
//                 opacity: 0,
//                 y: 16,
//               }}
//               animate={{
//                 opacity: 1,
//                 y: 0,
//               }}
//               transition={{
//                 delay: 0.15,
//                 duration: 0.6,
//               }}
//             >
//               <FeatureRow
//                 number="01"
//                 title="Projects"
//                 description="Keep scope, progress and deadlines organized."
//               />

//               <FeatureRow
//                 number="02"
//                 title="People"
//                 description="Work with the right professionals for each job."
//               />

//               <FeatureRow
//                 number="03"
//                 title="Progress"
//                 description="See what is moving and what still needs attention."
//                 last
//               />
//             </motion.div>
//           </div>

//           {/* Footer detail */}

//           <div className="flex items-center justify-between text-xs text-muted-foreground">
//             <span>
//               Work, properly allocated.
//             </span>

//             <span>
//               ©{" "}
//               {new Date().getFullYear()}
//             </span>
//           </div>
//         </section>

//         {/* =================================================
//             LOGIN PANEL
//         ================================================= */}

//         <section className="flex min-h-screen flex-1 flex-col">
//           {/* Mobile header */}

//           <div className="flex h-16 items-center justify-between border-b border-border/60 px-5 lg:hidden">
//             <Link
//               to="/"
//               className="inline-flex items-center gap-2.5"
//               aria-label="Go to Allocatr home"
//             >
//               <img
//                 src={assets.allocatrIcon}
//                 alt=""
//                 className="h-7 w-7"
//               />

//               <span className="text-lg font-black tracking-[-0.035em]">
//                 Allocatr
//               </span>
//             </Link>
//           </div>

//           {/* Form area */}

//           <div className="flex flex-1 items-center justify-center px-5 py-10 sm:px-8 lg:px-12 xl:px-16">
//             <motion.div
//               className="w-full max-w-md"
//               initial={{
//                 opacity: 0,
//                 y: 18,
//               }}
//               animate={{
//                 opacity: 1,
//                 y: 0,
//               }}
//               transition={{
//                 delay: 0.08,
//                 duration: 0.6,
//                 ease: "easeOut",
//               }}
//             >
//               {/* Back */}

//               <Link
//                 to="/"
//                 className="mb-10 inline-flex items-center gap-2 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
//               >
//                 <ArrowLeftIcon
//                   size={14}
//                 />

//                 Back to website
//               </Link>

//               {/* Heading */}

//               <header>
//                 <p className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-primary">
//                   Sign in
//                 </p>

//                 <h2 className="mt-4 text-3xl font-black leading-[1.05] tracking-[-0.03em] sm:text-4xl">
//                   Welcome back.
//                 </h2>

//                 <p className="mt-3 max-w-sm text-sm leading-7 text-muted-foreground">
//                   Enter your account
//                   details to continue to
//                   your workspace.
//                 </p>
//               </header>

//               {/* Form */}

//               <form
//                 onSubmit={
//                   handleSubmit
//                 }
//                 className="mt-9 space-y-5"
//               >
//                 {/* Email */}

//                 <div className="space-y-2">
//                   <label
//                     htmlFor="email"
//                     className="text-sm font-semibold"
//                   >
//                     Email address
//                   </label>

//                   <div className="relative">
//                     <MailIcon
//                       size={17}
//                       className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
//                     />

//                     <Input
//                       id="email"
//                       name="email"
//                       type="email"
//                       autoComplete="email"
//                       placeholder="you@example.com"
//                       value={email}
//                       onChange={(event) =>
//                         setEmail(
//                           event.target
//                             .value,
//                         )
//                       }
//                       disabled={loading}
//                       className={[
//                         "h-12 rounded-xl",
//                         "border-border bg-background",
//                         "pl-11 pr-4 shadow-none",
//                         "focus-visible:ring-1",
//                         "focus-visible:ring-primary/50",
//                       ].join(" ")}
//                       required
//                     />
//                   </div>
//                 </div>

//                 {/* Password */}

//                 <div className="space-y-2">
//                   <div className="flex items-center justify-between gap-4">
//                     <label
//                       htmlFor="password"
//                       className="text-sm font-semibold"
//                     >
//                       Password
//                     </label>

//                     <Link
//                       to="/forgot-password"
//                       className="text-xs font-semibold text-primary transition-opacity hover:opacity-70"
//                     >
//                       Forgot password?
//                     </Link>
//                   </div>

//                   <div className="relative">
//                     <LockKeyholeIcon
//                       size={17}
//                       className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
//                     />

//                     <Input
//                       id="password"
//                       name="password"
//                       type={
//                         showPassword
//                           ? "text"
//                           : "password"
//                       }
//                       autoComplete="current-password"
//                       placeholder="Enter your password"
//                       value={password}
//                       onChange={(event) =>
//                         setPassword(
//                           event.target
//                             .value,
//                         )
//                       }
//                       disabled={loading}
//                       className={[
//                         "h-12 rounded-xl",
//                         "border-border bg-background",
//                         "pl-11 pr-12 shadow-none",
//                         "focus-visible:ring-1",
//                         "focus-visible:ring-primary/50",
//                       ].join(" ")}
//                       required
//                     />

//                     <button
//                       type="button"
//                       onClick={() =>
//                         setShowPassword(
//                           (
//                             current,
//                           ) =>
//                             !current,
//                         )
//                       }
//                       disabled={loading}
//                       className={[
//                         "absolute right-4 top-1/2 -translate-y-1/2",
//                         "text-muted-foreground transition-colors",
//                         "hover:text-foreground",
//                         "disabled:cursor-not-allowed disabled:opacity-50",
//                       ].join(" ")}
//                       aria-label={
//                         showPassword
//                           ? "Hide password"
//                           : "Show password"
//                       }
//                     >
//                       {showPassword ? (
//                         <EyeOffIcon
//                           size={18}
//                         />
//                       ) : (
//                         <EyeIcon
//                           size={18}
//                         />
//                       )}
//                     </button>
//                   </div>
//                 </div>

//                 {/* Error */}

//                 {error && (
//                   <div
//                     className={[
//                       "flex items-start gap-3 rounded-xl",
//                       "border border-destructive/20",
//                       "bg-destructive/[0.05]",
//                       "p-4 text-destructive",
//                     ].join(" ")}
//                     role="alert"
//                   >
//                     <AlertCircleIcon
//                       size={17}
//                       className="mt-0.5 shrink-0"
//                     />

//                     <p className="text-sm leading-6">
//                       {error}
//                     </p>
//                   </div>
//                 )}

//                 {/* Submit */}

//                 <Button
//                   type="submit"
//                   disabled={loading}
//                   className="group h-12 w-full rounded-xl font-semibold shadow-none"
//                 >
//                   {loading ? (
//                     <>
//                       <LoaderCircleIcon
//                         size={17}
//                         className="animate-spin"
//                       />

//                       Signing in
//                     </>
//                   ) : (
//                     <>
//                       Continue

//                       <ArrowRightIcon
//                         size={16}
//                         className="transition-transform duration-200 group-hover:translate-x-1"
//                       />
//                     </>
//                   )}
//                 </Button>
//               </form>

//               {/* Register */}

//               <div className="mt-8 border-t border-border pt-7">
//                 <p className="text-sm text-muted-foreground">
//                   New to Allocatr?{" "}

//                   <Link
//                     to="/register"
//                     className="font-semibold text-foreground transition-colors hover:text-primary"
//                   >
//                     Create an account
//                   </Link>
//                 </p>
//               </div>

//               {/* Security note */}

//               <p className="mt-8 flex items-center gap-2 text-xs text-muted-foreground/70">
//                 <LockKeyholeIcon
//                   size={13}
//                 />

//                 Secure access to your
//                 Allocatr account.
//               </p>
//             </motion.div>
//           </div>
//         </section>
//       </div>
//     </main>
//   );
// }

// /* =========================================================
//    FEATURE ROW
// ========================================================= */

// function FeatureRow({
//   number,
//   title,
//   description,
//   last = false,
// }: {
//   number: string;
//   title: string;
//   description: string;
//   last?: boolean;
// }) {
//   return (
//     <div
//       className={[
//         "grid grid-cols-[42px_110px_1fr] gap-4 py-5",
//         !last
//           ? "border-b border-border"
//           : "",
//       ].join(" ")}
//     >
//       <span className="text-xs font-semibold text-primary">
//         {number}
//       </span>

//       <span className="text-sm font-bold">
//         {title}
//       </span>

//       <p className="text-xs leading-6 text-muted-foreground">
//         {description}
//       </p>
//     </div>
//   );
// }



import {
  AlertCircleIcon,
  ArrowLeftIcon,
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

import {
  Link,
  useNavigate,
} from "react-router-dom";

import {
  motion,
} from "framer-motion";

import { useAuth } from "@/auth/useAuth";

import assets from "@/assets/assets";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const LOGIN_IMAGE =
  "https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg";

export default function Login() {
  const {
    login,
    user,
  } = useAuth();

  const navigate =
    useNavigate();

  const [
    email,
    setEmail,
  ] = useState("");

  const [
    password,
    setPassword,
  ] = useState("");

  const [
    showPassword,
    setShowPassword,
  ] = useState(false);

  const [
    loading,
    setLoading,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState("");

  useEffect(() => {
    if (user) {
      navigate(
        "/projects",
        {
          replace: true,
        },
      );
    }
  }, [
    user,
    navigate,
  ]);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (loading) {
      return;
    }

    setError("");
    setLoading(true);

    try {
      await login(
        email.trim(),
        password,
      );

      navigate(
        "/projects",
        {
          replace: true,
        },
      );
    } catch (
      error: unknown
    ) {
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
            ).response?.data
              ?.message
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
    <main className="relative min-h-screen bg-background text-foreground">
      {/* =====================================================
          BACKGROUND
      ===================================================== */}

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-48 h-[32rem] w-[32rem] rounded-full bg-primary/[0.03] blur-3xl" />

        <div className="absolute -bottom-48 -right-32 h-[34rem] w-[34rem] rounded-full bg-primary/[0.025] blur-3xl" />
      </div>

      {/* =====================================================
          PAGE
      ===================================================== */}

      <div className="relative mx-auto flex min-h-screen w-full max-w-[1440px]">

        {/* =================================================
            BRAND / IMAGE PANEL
        ================================================= */}

        <section
          className={[
            "relative hidden w-[48%] overflow-hidden",
            "border-r border-border/70",
            "px-10 py-8 lg:flex lg:flex-col",
            "xl:px-14 xl:py-10",
          ].join(" ")}
        >
          {/* Logo */}

          <Link
            to="/"
            className="group relative z-20 inline-flex w-fit items-center gap-2.5"
            aria-label="Go to Allocatr home"
          >
            <img
              src={
                assets.allocatrIcon
              }
              alt=""
              className={[
                "h-8 w-8 object-contain",
                "transition-transform duration-300",
                "group-hover:-rotate-3",
              ].join(" ")}
            />

            <span className="text-lg font-black tracking-[-0.035em]">
              Allocatr
            </span>
          </Link>

          {/* Main content */}

          <div className="relative z-10 my-auto grid gap-8 py-10">
            <motion.div
              className="max-w-xl"
              initial={{
                opacity: 0,
                y: 22,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.65,
                ease: "easeOut",
              }}
            >
              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-primary">
                Your workspace
              </p>

              <h1 className="mt-5 text-5xl font-black leading-[1.03] tracking-[-0.035em] xl:text-[3.55rem]">
                Everything you need
                to keep work moving.
              </h1>

              <p className="mt-6 max-w-lg text-base leading-8 text-muted-foreground">
                Manage projects,
                collaborate with skilled
                professionals and keep
                progress visible from one
                place.
              </p>
            </motion.div>

            {/* Image */}

            <motion.div
              className="relative overflow-hidden rounded-[1.75rem] border border-border bg-muted shadow-sm"
              initial={{
                opacity: 0,
                y: 22,
                scale: 0.98,
              }}
              animate={{
                opacity: 1,
                y: 0,
                scale: 1,
              }}
              transition={{
                delay: 0.1,
                duration: 0.7,
                ease: "easeOut",
              }}
            >
              <div className="aspect-[16/10] overflow-hidden">
                <motion.img
                  src={
                    LOGIN_IMAGE
                  }
                  alt="Professionals collaborating on a project"
                  className="h-full w-full object-cover"
                  initial={{
                    scale: 1.04,
                  }}
                  animate={{
                    scale: 1,
                  }}
                  transition={{
                    duration: 1.2,
                    ease: "easeOut",
                  }}
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/[0.03] to-transparent" />
              </div>

              {/* Image overlay */}

              <div className="absolute inset-x-0 bottom-0 p-5 text-white sm:p-6">
                <div className="flex items-end justify-between gap-5">
                  <div>
                    <p className="text-[0.58rem] font-semibold uppercase tracking-[0.16em] text-white/55">
                      Project workspace
                    </p>

                    <p className="mt-1 text-sm font-semibold">
                      People, progress and
                      delivery in one place.
                    </p>
                  </div>

                  <span className="hidden items-center gap-2 rounded-full border border-white/15 bg-black/20 px-3 py-1.5 text-[0.62rem] font-medium text-white/85 backdrop-blur-md xl:flex">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary" />

                    Active
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Product cues */}

            <motion.div
              className="grid grid-cols-3 border-y border-border py-5"
              initial={{
                opacity: 0,
                y: 14,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay: 0.2,
                duration: 0.6,
              }}
            >
              <BrandMetric
                label="Projects"
                value="Organised"
              />

              <BrandMetric
                label="People"
                value="Connected"
                divided
              />

              <BrandMetric
                label="Progress"
                value="Visible"
                divided
              />
            </motion.div>
          </div>

          {/* Footer */}

          <div className="relative z-10 flex items-center justify-between text-xs text-muted-foreground">
            <span>
              Work, properly allocated.
            </span>

            <span>
              ©{" "}
              {new Date().getFullYear()}
            </span>
          </div>
        </section>

        {/* =================================================
            LOGIN PANEL
        ================================================= */}

        <section className="flex min-h-screen flex-1 flex-col">
          {/* Mobile header */}

          <div className="flex h-16 items-center border-b border-border/60 px-5 lg:hidden">
            <Link
              to="/"
              className="inline-flex items-center gap-2.5"
              aria-label="Go to Allocatr home"
            >
              <img
                src={
                  assets.allocatrIcon
                }
                alt=""
                className="h-7 w-7 object-contain"
              />

              <span className="text-lg font-black tracking-[-0.035em]">
                Allocatr
              </span>
            </Link>
          </div>

          {/* Form area */}

          <div className="flex flex-1 items-center justify-center px-5 py-10 sm:px-8 lg:px-12 xl:px-16">
            <motion.div
              className="w-full max-w-md"
              initial={{
                opacity: 0,
                y: 18,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay: 0.08,
                duration: 0.6,
                ease: "easeOut",
              }}
            >
              {/* Back */}

              <Link
                to="/"
                className="mb-10 inline-flex items-center gap-2 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                <ArrowLeftIcon
                  size={14}
                />

                Back to website
              </Link>

              {/* Heading */}

              <header>
                <p className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-primary">
                  Sign in
                </p>

                <h2 className="mt-4 text-3xl font-black leading-[1.05] tracking-[-0.03em] sm:text-4xl">
                  Welcome back.
                </h2>

                <p className="mt-3 max-w-sm text-sm leading-7 text-muted-foreground">
                  Enter your account
                  details to continue to
                  your workspace.
                </p>
              </header>

              {/* Form */}

              <form
                onSubmit={
                  handleSubmit
                }
                className="mt-9 space-y-5"
              >
                {/* Email */}

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
                        setEmail(
                          event.target
                            .value,
                        )
                      }
                      disabled={
                        loading
                      }
                      className={[
                        "h-12 rounded-xl",
                        "border-border bg-background",
                        "pl-11 pr-4 shadow-none",
                        "focus-visible:ring-1",
                        "focus-visible:ring-primary/50",
                      ].join(" ")}
                      required
                    />
                  </div>
                </div>

                {/* Password */}

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
                      className="text-xs font-semibold text-primary transition-opacity hover:opacity-70"
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
                      type={
                        showPassword
                          ? "text"
                          : "password"
                      }
                      autoComplete="current-password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(event) =>
                        setPassword(
                          event.target
                            .value,
                        )
                      }
                      disabled={
                        loading
                      }
                      className={[
                        "h-12 rounded-xl",
                        "border-border bg-background",
                        "pl-11 pr-12 shadow-none",
                        "focus-visible:ring-1",
                        "focus-visible:ring-primary/50",
                      ].join(" ")}
                      required
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword(
                          (
                            current,
                          ) =>
                            !current,
                        )
                      }
                      disabled={
                        loading
                      }
                      className={[
                        "absolute right-4 top-1/2 -translate-y-1/2",
                        "text-muted-foreground transition-colors",
                        "hover:text-foreground",
                        "disabled:cursor-not-allowed disabled:opacity-50",
                      ].join(" ")}
                      aria-label={
                        showPassword
                          ? "Hide password"
                          : "Show password"
                      }
                    >
                      {showPassword ? (
                        <EyeOffIcon
                          size={18}
                        />
                      ) : (
                        <EyeIcon
                          size={18}
                        />
                      )}
                    </button>
                  </div>
                </div>

                {/* Error */}

                {error && (
                  <div
                    className={[
                      "flex items-start gap-3 rounded-xl",
                      "border border-destructive/20",
                      "bg-destructive/[0.05]",
                      "p-4 text-destructive",
                    ].join(" ")}
                    role="alert"
                  >
                    <AlertCircleIcon
                      size={17}
                      className="mt-0.5 shrink-0"
                    />

                    <p className="text-sm leading-6">
                      {error}
                    </p>
                  </div>
                )}

                {/* Submit */}

                <Button
                  type="submit"
                  disabled={
                    loading
                  }
                  className="group h-12 w-full rounded-xl font-semibold shadow-none"
                >
                  {loading ? (
                    <>
                      <LoaderCircleIcon
                        size={17}
                        className="animate-spin"
                      />

                      Signing in
                    </>
                  ) : (
                    <>
                      Continue

                      <ArrowRightIcon
                        size={16}
                        className="transition-transform duration-200 group-hover:translate-x-1"
                      />
                    </>
                  )}
                </Button>
              </form>

              {/* Register */}

              <div className="mt-8 border-t border-border pt-7">
                <p className="text-sm text-muted-foreground">
                  New to Allocatr?{" "}

                  <Link
                    to="/register"
                    className="font-semibold text-foreground transition-colors hover:text-primary"
                  >
                    Create an account
                  </Link>
                </p>
              </div>

              {/* Security */}

              <p className="mt-8 flex items-center gap-2 text-xs text-muted-foreground/70">
                <LockKeyholeIcon
                  size={13}
                />

                Secure access to your
                Allocatr account.
              </p>
            </motion.div>
          </div>
        </section>
      </div>
    </main>
  );
}

/* =========================================================
   BRAND METRIC
========================================================= */

function BrandMetric({
  label,
  value,
  divided = false,
}: {
  label: string;
  value: string;
  divided?: boolean;
}) {
  return (
    <div
      className={[
        "min-w-0 px-4 first:pl-0 last:pr-0",
        divided
          ? "border-l border-border"
          : "",
      ].join(" ")}
    >
      <p className="text-[0.58rem] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
        {label}
      </p>

      <p className="mt-1.5 truncate text-sm font-bold">
        {value}
      </p>
    </div>
  );
}