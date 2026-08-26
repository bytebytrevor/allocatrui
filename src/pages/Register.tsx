// import {
//   AlertCircleIcon,
//   ArrowLeftIcon,
//   ArrowRightIcon,
//   BriefcaseBusinessIcon,
//   CheckIcon,
//   EyeIcon,
//   EyeOffIcon,
//   LoaderCircleIcon,
//   LockKeyholeIcon,
//   MailIcon,
//   UserIcon,
// } from "lucide-react";

// import {
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

// const REGISTER_IMAGE =
//   "https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg";

// export default function Register() {
//   const {
//     register,
//   } = useAuth();

//   const navigate =
//     useNavigate();

//   const [
//     fullName,
//     setFullName,
//   ] = useState("");

//   const [
//     email,
//     setEmail,
//   ] = useState("");

//   const [
//     password,
//     setPassword,
//   ] = useState("");

//   const [
//     isAllocat,
//     setIsAllocat,
//   ] = useState(false);

//   const [
//     showPassword,
//     setShowPassword,
//   ] = useState(false);

//   const [
//     loading,
//     setLoading,
//   ] = useState(false);

//   const [
//     error,
//     setError,
//   ] = useState("");

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
//       await register(
//         fullName.trim(),
//         email.trim(),
//         password,
//         isAllocat,
//       );

//       navigate(
//         "/projects",
//         {
//           replace: true,
//         },
//       );
//     } catch (
//       error: unknown
//     ) {
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
//           "We could not create your account. Please check your details and try again.",
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
//         <div className="absolute -left-40 -top-48 h-[32rem] w-[32rem] rounded-full bg-primary/[0.03] blur-3xl" />

//         <div className="absolute -bottom-48 -right-32 h-[34rem] w-[34rem] rounded-full bg-primary/[0.025] blur-3xl" />
//       </div>

//       {/* =====================================================
//           PAGE
//       ===================================================== */}

//       <div className="relative mx-auto flex min-h-screen w-full max-w-[1440px]">

//         {/* =================================================
//             BRAND / IMAGE PANEL
//         ================================================= */}

//         <section
//           className={[
//             "relative hidden w-[46%] overflow-hidden",
//             "border-r border-border/70",
//             "px-10 py-8 lg:flex lg:flex-col",
//             "xl:px-14 xl:py-10",
//           ].join(" ")}
//         >
//           {/* Logo */}

//           <Link
//             to="/"
//             className="group relative z-20 inline-flex w-fit items-center gap-2.5"
//             aria-label="Go to Allocatr home"
//           >
//             <img
//               src={
//                 assets.allocatrIcon
//               }
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

//           {/* Content */}

//           <div className="relative z-10 my-auto grid gap-8 py-10">
//             <motion.div
//               className="max-w-xl"
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
//                 Get started
//               </p>

//               <h1 className="mt-5 text-5xl font-black leading-[1.03] tracking-[-0.035em] xl:text-[3.55rem]">
//                 One account.
//                 <span className="block">
//                   More ways to work.
//                 </span>
//               </h1>

//               <p className="mt-6 max-w-lg text-base leading-8 text-muted-foreground">
//                 Create projects, find skilled
//                 professionals or offer your own
//                 expertise — all from the same
//                 Allocatr account.
//               </p>
//             </motion.div>

//             {/* Image */}

//             <motion.div
//               className="relative overflow-hidden rounded-[1.75rem] border border-border bg-muted shadow-sm"
//               initial={{
//                 opacity: 0,
//                 y: 22,
//                 scale: 0.98,
//               }}
//               animate={{
//                 opacity: 1,
//                 y: 0,
//                 scale: 1,
//               }}
//               transition={{
//                 delay: 0.1,
//                 duration: 0.7,
//                 ease: "easeOut",
//               }}
//             >
//               <div className="aspect-[16/10] overflow-hidden">
//                 <motion.img
//                   src={
//                     REGISTER_IMAGE
//                   }
//                   alt="Professionals working together"
//                   className="h-full w-full object-cover"
//                   initial={{
//                     scale: 1.04,
//                   }}
//                   animate={{
//                     scale: 1,
//                   }}
//                   transition={{
//                     duration: 1.2,
//                     ease: "easeOut",
//                   }}
//                 />

//                 <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/[0.04] to-transparent" />
//               </div>

//               <div className="absolute inset-x-0 bottom-0 p-5 text-white sm:p-6">
//                 <p className="text-[0.58rem] font-semibold uppercase tracking-[0.16em] text-white/55">
//                   Built for both sides of the work
//                 </p>

//                 <p className="mt-1 max-w-sm text-sm font-semibold leading-6">
//                   Hire the skill you need or put
//                   your own experience to work.
//                 </p>
//               </div>
//             </motion.div>

//             {/* Feature strip */}

//             <motion.div
//               className="grid grid-cols-3 border-y border-border py-5"
//               initial={{
//                 opacity: 0,
//                 y: 14,
//               }}
//               animate={{
//                 opacity: 1,
//                 y: 0,
//               }}
//               transition={{
//                 delay: 0.2,
//                 duration: 0.6,
//               }}
//             >
//               <BrandMetric
//                 label="Projects"
//                 value="Create"
//               />

//               <BrandMetric
//                 label="Skills"
//                 value="Discover"
//                 divided
//               />

//               <BrandMetric
//                 label="Work"
//                 value="Manage"
//                 divided
//               />
//             </motion.div>
//           </div>

//           {/* Footer */}

//           <div className="relative z-10 flex items-center justify-between text-xs text-muted-foreground">
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
//             REGISTER PANEL
//         ================================================= */}

//         <section className="flex min-h-screen flex-1 flex-col">
//           {/* Mobile header */}

//           <div className="flex h-16 items-center border-b border-border/60 px-5 lg:hidden">
//             <Link
//               to="/"
//               className="inline-flex items-center gap-2.5"
//               aria-label="Go to Allocatr home"
//             >
//               <img
//                 src={
//                   assets.allocatrIcon
//                 }
//                 alt=""
//                 className="h-7 w-7 object-contain"
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
//                 className="mb-9 inline-flex items-center gap-2 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
//               >
//                 <ArrowLeftIcon
//                   size={14}
//                 />

//                 Back to website
//               </Link>

//               {/* Heading */}

//               <header>
//                 <p className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-primary">
//                   Create account
//                 </p>

//                 <h2 className="mt-4 text-3xl font-black leading-[1.05] tracking-[-0.03em] sm:text-4xl">
//                   Join Allocatr.
//                 </h2>

//                 <p className="mt-3 max-w-sm text-sm leading-7 text-muted-foreground">
//                   Create your account and choose
//                   how you want to start using
//                   the platform.
//                 </p>
//               </header>

//               {/* =================================================
//                   FORM
//               ================================================= */}

//               <form
//                 onSubmit={
//                   handleSubmit
//                 }
//                 className="mt-8 space-y-5"
//               >
//                 {/* Name */}

//                 <div className="space-y-2">
//                   <label
//                     htmlFor="fullName"
//                     className="text-sm font-semibold"
//                   >
//                     Full name
//                   </label>

//                   <div className="relative">
//                     <UserIcon
//                       size={17}
//                       className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
//                     />

//                     <Input
//                       id="fullName"
//                       name="fullName"
//                       type="text"
//                       autoComplete="name"
//                       placeholder="Your full name"
//                       value={
//                         fullName
//                       }
//                       onChange={(
//                         event,
//                       ) =>
//                         setFullName(
//                           event.target
//                             .value,
//                         )
//                       }
//                       disabled={
//                         loading
//                       }
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
//                       value={
//                         email
//                       }
//                       onChange={(
//                         event,
//                       ) =>
//                         setEmail(
//                           event.target
//                             .value,
//                         )
//                       }
//                       disabled={
//                         loading
//                       }
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
//                   <label
//                     htmlFor="password"
//                     className="text-sm font-semibold"
//                   >
//                     Password
//                   </label>

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
//                       autoComplete="new-password"
//                       placeholder="Create a secure password"
//                       value={
//                         password
//                       }
//                       onChange={(
//                         event,
//                       ) =>
//                         setPassword(
//                           event.target
//                             .value,
//                         )
//                       }
//                       disabled={
//                         loading
//                       }
//                       minLength={
//                         8
//                       }
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
//                       disabled={
//                         loading
//                       }
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

//                   <p className="text-xs leading-5 text-muted-foreground">
//                     Use at least eight characters.
//                   </p>
//                 </div>

//                 {/* =================================================
//                     ACCOUNT TYPE
//                 ================================================= */}

//                 <fieldset className="space-y-3 pt-1">
//                   <div>
//                     <legend className="text-sm font-semibold">
//                       How will you use Allocatr?
//                     </legend>

//                     <p className="mt-1 text-xs leading-5 text-muted-foreground">
//                       Allocats can still create and
//                       manage their own client projects.
//                     </p>
//                   </div>

//                   <div className="grid gap-3 sm:grid-cols-2">
//                     {/* Client */}

//                     <AccountTypeOption
//                       selected={
//                         !isAllocat
//                       }
//                       title="Client"
//                       description="Post projects and hire skilled professionals."
//                       icon={
//                         UserIcon
//                       }
//                       onClick={() =>
//                         setIsAllocat(
//                           false,
//                         )
//                       }
//                       disabled={
//                         loading
//                       }
//                     />

//                     {/* Allocat */}

//                     <AccountTypeOption
//                       selected={
//                         isAllocat
//                       }
//                       title="Allocat"
//                       description="Offer your skills and work on client projects."
//                       icon={
//                         BriefcaseBusinessIcon
//                       }
//                       onClick={() =>
//                         setIsAllocat(
//                           true,
//                         )
//                       }
//                       disabled={
//                         loading
//                       }
//                     />
//                   </div>
//                 </fieldset>

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
//                   disabled={
//                     loading
//                   }
//                   className="group h-12 w-full rounded-xl font-semibold shadow-none"
//                 >
//                   {loading ? (
//                     <>
//                       <LoaderCircleIcon
//                         size={17}
//                         className="animate-spin"
//                       />

//                       Creating account
//                     </>
//                   ) : (
//                     <>
//                       Create account

//                       <ArrowRightIcon
//                         size={16}
//                         className="transition-transform duration-200 group-hover:translate-x-1"
//                       />
//                     </>
//                   )}
//                 </Button>
//               </form>

//               {/* Login */}

//               <div className="mt-8 border-t border-border pt-7">
//                 <p className="text-sm text-muted-foreground">
//                   Already have an account?{" "}

//                   <Link
//                     to="/login"
//                     className="font-semibold text-foreground transition-colors hover:text-primary"
//                   >
//                     Sign in
//                   </Link>
//                 </p>
//               </div>

//               {/* Terms */}

//               <p className="mt-7 max-w-sm text-xs leading-5 text-muted-foreground/70">
//                 By creating an account, you agree
//                 to Allocatr&apos;s{" "}

//                 <Link
//                   to="/terms"
//                   className="underline underline-offset-2 hover:text-foreground"
//                 >
//                   Terms
//                 </Link>

//                 {" "}and{" "}

//                 <Link
//                   to="/privacy"
//                   className="underline underline-offset-2 hover:text-foreground"
//                 >
//                   Privacy Policy
//                 </Link>
//                 .
//               </p>
//             </motion.div>
//           </div>
//         </section>
//       </div>
//     </main>
//   );
// }

// /* =========================================================
//    ACCOUNT TYPE OPTION
// ========================================================= */

// function AccountTypeOption({
//   selected,
//   title,
//   description,
//   icon: Icon,
//   onClick,
//   disabled,
// }: {
//   selected: boolean;
//   title: string;
//   description: string;

//   icon: React.ComponentType<{
//     size?: number;
//     className?: string;
//   }>;

//   onClick: () => void;
//   disabled: boolean;
// }) {
//   return (
//     <button
//       type="button"
//       onClick={
//         onClick
//       }
//       disabled={
//         disabled
//       }
//       aria-pressed={
//         selected
//       }
//       className={[
//         "relative min-h-[138px] w-full rounded-[1.25rem]",
//         "border p-4 text-left",
//         "transition-all duration-200",
//         "disabled:cursor-not-allowed disabled:opacity-60",

//         selected
//           ? [
//               "border-primary/50",
//               "bg-primary/[0.065]",
//               "ring-1 ring-primary/15",
//             ].join(" ")
//           : [
//               "border-border",
//               "bg-background",
//               "hover:border-primary/30",
//               "hover:bg-muted/30",
//             ].join(" "),
//       ].join(" ")}
//     >
//       <div className="flex items-start justify-between gap-3">
//         <span
//           className={[
//             "flex h-9 w-9 items-center justify-center rounded-xl",
//             selected
//               ? "bg-primary/12 text-primary"
//               : "bg-muted text-muted-foreground",
//           ].join(" ")}
//         >
//           <Icon
//             size={17}
//           />
//         </span>

//         <span
//           className={[
//             "flex h-5 w-5 items-center justify-center rounded-full border",
//             "transition-all duration-200",

//             selected
//               ? "border-primary bg-primary text-primary-foreground"
//               : "border-border bg-background",
//           ].join(" ")}
//         >
//           {selected && (
//             <CheckIcon
//               size={11}
//               strokeWidth={3}
//             />
//           )}
//         </span>
//       </div>

//       <p className="mt-5 text-sm font-bold">
//         {title}
//       </p>

//       <p className="mt-1.5 text-xs leading-5 text-muted-foreground">
//         {description}
//       </p>
//     </button>
//   );
// }

// /* =========================================================
//    BRAND METRIC
// ========================================================= */

// function BrandMetric({
//   label,
//   value,
//   divided = false,
// }: {
//   label: string;
//   value: string;
//   divided?: boolean;
// }) {
//   return (
//     <div
//       className={[
//         "min-w-0 px-4 first:pl-0 last:pr-0",
//         divided
//           ? "border-l border-border"
//           : "",
//       ].join(" ")}
//     >
//       <p className="text-[0.58rem] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
//         {label}
//       </p>

//       <p className="mt-1.5 truncate text-sm font-bold">
//         {value}
//       </p>
//     </div>
//   );
// }

import {
  AlertCircleIcon,
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

import {
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

const REGISTER_IMAGE =
  "https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg";

export default function Register() {
  const { register } = useAuth();

  const navigate =
    useNavigate();

  const [
    fullName,
    setFullName,
  ] = useState("");

  const [
    email,
    setEmail,
  ] = useState("");

  const [
    password,
    setPassword,
  ] = useState("");

  const [
    isAllocat,
    setIsAllocat,
  ] = useState(false);

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
      await register(
        fullName.trim(),
        email.trim(),
        password,
        isAllocat,
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
          "We could not create your account. Please check your details and try again.",
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
            "relative hidden w-[46%] overflow-hidden",
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
              src={assets.allocatrIcon}
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

          {/* Content */}

          <div className="relative z-10 my-auto grid gap-7 py-9">
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
                Get started
              </p>

              <h1 className="mt-5 text-5xl font-black leading-[1.03] tracking-[-0.035em] xl:text-[3.55rem]">
                One account.

                <span className="block">
                  More ways to work.
                </span>
              </h1>

              <p className="mt-6 max-w-lg text-base leading-8 text-muted-foreground">
                Create projects, find skilled
                professionals or offer your own
                expertise — all from the same
                Allocatr account.
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
              <div className="aspect-[16/9] overflow-hidden">
                <motion.img
                  src={REGISTER_IMAGE}
                  alt="Professionals working together"
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

              <div className="absolute inset-x-0 bottom-0 p-5 text-white sm:p-6">
                <p className="text-[0.58rem] font-semibold uppercase tracking-[0.16em] text-white/55">
                  One account, two sides of work
                </p>

                <p className="mt-1 max-w-sm text-sm font-semibold leading-6">
                  Hire the skills you need or
                  offer your own expertise.
                </p>
              </div>
            </motion.div>

            {/* Feature strip */}

            <motion.div
              className="grid grid-cols-3 border-y border-border py-4"
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
                value="Create"
              />

              <BrandMetric
                label="Skills"
                value="Discover"
                divided
              />

              <BrandMetric
                label="Work"
                value="Manage"
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
              © {new Date().getFullYear()}
            </span>
          </div>
        </section>

        {/* =================================================
            REGISTER PANEL
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
                src={assets.allocatrIcon}
                alt=""
                className="h-7 w-7 object-contain"
              />

              <span className="text-lg font-black tracking-[-0.035em]">
                Allocatr
              </span>
            </Link>
          </div>

          {/* Form area */}

          <div className="flex flex-1 items-center justify-center px-5 py-8 sm:px-8 lg:px-12 xl:px-16">
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
                className="mb-7 inline-flex items-center gap-2 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                <ArrowLeftIcon
                  size={14}
                />

                Back to website
              </Link>

              {/* Heading */}

              <header>
                <p className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-primary">
                  Create account
                </p>

                <h2 className="mt-3 text-3xl font-black leading-[1.05] tracking-[-0.03em] sm:text-4xl">
                  Join Allocatr.
                </h2>

                <p className="mt-2 max-w-sm text-sm leading-6 text-muted-foreground">
                  Set up your account and
                  choose how you want to
                  start using the platform.
                </p>
              </header>

              {/* =================================================
                  FORM
              ================================================= */}

              <form
                onSubmit={handleSubmit}
                className="mt-7 space-y-4"
              >
                {/* Name */}

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
                      placeholder="Your full name"
                      value={fullName}
                      onChange={(event) =>
                        setFullName(
                          event.target.value,
                        )
                      }
                      disabled={loading}
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
                          event.target.value,
                        )
                      }
                      disabled={loading}
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
                      type={
                        showPassword
                          ? "text"
                          : "password"
                      }
                      autoComplete="new-password"
                      placeholder="Create a secure password"
                      value={password}
                      onChange={(event) =>
                        setPassword(
                          event.target.value,
                        )
                      }
                      disabled={loading}
                      minLength={8}
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
                          (current) =>
                            !current,
                        )
                      }
                      disabled={loading}
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

                  <p className="text-[0.7rem] leading-5 text-muted-foreground">
                    Use at least eight characters.
                  </p>
                </div>

                {/* =================================================
                    ACCOUNT TYPE
                ================================================= */}

                <fieldset className="space-y-2.5 pt-1">
                  <div>
                    <legend className="text-sm font-semibold">
                      How will you use Allocatr?
                    </legend>

                    <p className="mt-1 text-[0.7rem] leading-5 text-muted-foreground">
                      Allocats can still create
                      and manage client projects.
                    </p>
                  </div>

                  <div className="grid overflow-hidden rounded-xl ring-1 ring-border sm:grid-cols-2">
                    <AccountTypeOption
                      selected={!isAllocat}
                      title="Client"
                      description="Create projects and hire professionals."
                      icon={UserIcon}
                      onClick={() =>
                        setIsAllocat(false)
                      }
                      disabled={loading}
                    />

                    <AccountTypeOption
                      selected={isAllocat}
                      title="Allocat"
                      description="Offer your skills and work on projects."
                      icon={
                        BriefcaseBusinessIcon
                      }
                      onClick={() =>
                        setIsAllocat(true)
                      }
                      disabled={loading}
                      divided
                    />
                  </div>
                </fieldset>

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
                  disabled={loading}
                  className="group h-12 w-full rounded-xl font-semibold shadow-none"
                >
                  {loading ? (
                    <>
                      <LoaderCircleIcon
                        size={17}
                        className="animate-spin"
                      />

                      Creating account
                    </>
                  ) : (
                    <>
                      Create account

                      <ArrowRightIcon
                        size={16}
                        className="transition-transform duration-200 group-hover:translate-x-1"
                      />
                    </>
                  )}
                </Button>
              </form>

              {/* Login */}

              <div className="mt-6 border-t border-border pt-5">
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

              {/* Terms */}

              <p className="mt-4 max-w-sm text-[0.68rem] leading-5 text-muted-foreground/70">
                By creating an account,
                you agree to Allocatr&apos;s{" "}

                <Link
                  to="/terms"
                  className="underline underline-offset-2 transition-colors hover:text-foreground"
                >
                  Terms
                </Link>

                {" "}and{" "}

                <Link
                  to="/privacy"
                  className="underline underline-offset-2 transition-colors hover:text-foreground"
                >
                  Privacy Policy
                </Link>
                .
              </p>
            </motion.div>
          </div>
        </section>
      </div>
    </main>
  );
}

/* =========================================================
   ACCOUNT TYPE OPTION
========================================================= */

function AccountTypeOption({
  selected,
  title,
  description,
  icon: Icon,
  onClick,
  disabled,
  divided = false,
}: {
  selected: boolean;
  title: string;
  description: string;

  icon: React.ComponentType<{
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
        "group relative flex min-h-[88px] w-full items-center gap-3",
        "px-3.5 py-3 text-left",
        "transition-colors duration-200",
        "disabled:cursor-not-allowed disabled:opacity-60",

        divided
          ? "border-t border-border sm:border-l sm:border-t-0"
          : "",

        selected
          ? "bg-primary/[0.055]"
          : "bg-background hover:bg-muted/30",
      ].join(" ")}
    >
      {/* Icon */}

      <span
        className={[
          "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
          "transition-colors duration-200",

          selected
            ? "bg-primary/10 text-primary"
            : "bg-muted/70 text-muted-foreground group-hover:text-foreground",
        ].join(" ")}
      >
        <Icon
          size={15}
        />
      </span>

      {/* Copy */}

      <span className="min-w-0 flex-1">
        <span className="flex items-center gap-1.5">
          <span className="text-sm font-semibold">
            {title}
          </span>

          {selected && (
            <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <CheckIcon
                size={9}
                strokeWidth={3}
              />
            </span>
          )}
        </span>

        <span className="mt-0.5 block text-[0.68rem] leading-[1.15rem] text-muted-foreground">
          {description}
        </span>
      </span>
    </button>
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