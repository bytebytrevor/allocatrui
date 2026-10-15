// import {
//   ArrowLeftIcon,
//   ArrowRightIcon,
//   EyeIcon,
//   EyeOffIcon,
//   LoaderCircleIcon,
//   LockKeyholeIcon,
//   MailIcon,
//   PawPrintIcon,
// } from "lucide-react";

// import {
//   useEffect,
//   useState,
// } from "react";

// import {
//   Link,
//   useNavigate,
//   useSearchParams,
// } from "react-router-dom";

// import {
//   motion,
//   useReducedMotion,
// } from "framer-motion";

// import { zodResolver } from "@hookform/resolvers/zod";
// import { Controller, useForm } from "react-hook-form";
// import * as z from "zod";

// import { useAuth } from "@/auth/useAuth";

// import assets from "@/assets/assets";

// import allocatrLogoLight from "@/assets/allocatr-neg-light.svg";
// import allocatrLogoDark from "@/assets/allocatr-dark-02.svg";

// import { Button } from "@/components/ui/button";

// import {
//   Field,
//   FieldError,
//   FieldLabel,
// } from "@/components/ui/field";

// import { Input } from "@/components/ui/input";

// /* =========================================================
//    VALIDATION
// ========================================================= */

// const loginSchema = z.object({
//   email: z
//     .string()
//     .trim()
//     .min(1, "Email address is required.")
//     .email("Enter a valid email address."),

//   password: z
//     .string()
//     .min(1, "Password is required.")
//     .min(8, "Password must be at least 8 characters."),
// });

// type LoginFormValues = z.infer<typeof loginSchema>;

// /* =========================================================
//    SHARED STYLES
// ========================================================= */

// const primaryButton = [
//   "border border-brand-secondary-highlight/15",
//   "bg-brand-secondary-highlight",
//   "text-primary-foreground",
//   "shadow-none",

//   "transition-[background-color,border-color,color,transform] duration-200",

//   "hover:-translate-y-0.5",
//   "hover:border-brand-secondary-highlight/20",
//   "hover:bg-brand-secondary-highlight/90",
//   "hover:text-primary-foreground",

//   "focus-visible:ring-2",
//   "focus-visible:ring-brand-secondary-highlight/15",

//   "dark:border-secondary/10",
//   "dark:bg-secondary",
//   "dark:text-secondary-foreground",

//   "dark:hover:border-secondary/15",
//   "dark:hover:bg-secondary/90",
//   "dark:hover:text-secondary-foreground",

//   "dark:focus-visible:ring-secondary/15",
// ].join(" ");

// const inputStyle = [
//   "h-11 rounded-lg",
//   "border-border/70",

//   "bg-surface-2/35",
//   "text-foreground",

//   "shadow-none",

//   "placeholder:text-muted-foreground/55",

//   "transition-[background-color,border-color,box-shadow] duration-200",

//   "hover:border-border",

//   "focus-visible:border-brand-secondary-highlight/55",
//   "focus-visible:ring-2",
//   "focus-visible:ring-brand-secondary-highlight/10",

//   "dark:border-border",
//   "dark:bg-surface-2/65",

//   "dark:focus-visible:border-secondary/45",
//   "dark:focus-visible:ring-secondary/10",
// ].join(" ");

// /* =========================================================
//    LOGIN
// ========================================================= */

// export default function Login() {
//   const { login, user } = useAuth();

//   const navigate = useNavigate();
//   const [searchParams] = useSearchParams();

//   const reduceMotion = useReducedMotion();

//   const [showPassword, setShowPassword] = useState(false);

//   const returnTo = getSafeReturnTo(
//     searchParams.get("returnTo"),
//   );

//   const registerUrl = returnTo
//     ? `/register?returnTo=${encodeURIComponent(returnTo)}`
//     : "/register";

//   const form = useForm<LoginFormValues>({
//     resolver: zodResolver(loginSchema),
//     mode: "onBlur",
//     reValidateMode: "onChange",

//     defaultValues: {
//       email: "",
//       password: "",
//     },
//   });

//   const { isSubmitting } = form.formState;

//   const credentialsError =
//     form.formState.errors.root?.credentials;

//   /* =======================================================
//      AUTH REDIRECT
//   ======================================================= */

//   useEffect(() => {
//     if (!user) {
//       return;
//     }

//     navigate(returnTo || "/projects", {
//       replace: true,
//     });
//   }, [
//     user,
//     returnTo,
//     navigate,
//   ]);

//   /* =======================================================
//      CLEAR AUTH ERROR
//   ======================================================= */

//   function clearCredentialsError() {
//     if (form.formState.errors.root?.credentials) {
//       form.clearErrors("root.credentials");
//     }
//   }

//   /* =======================================================
//      LOGIN
//   ======================================================= */

//   async function handleLogin(
//     values: LoginFormValues,
//   ) {
//     form.clearErrors("root.credentials");

//     try {
//       await login(
//         values.email.trim(),
//         values.password,
//       );

//       navigate(returnTo || "/projects", {
//         replace: true,
//       });
//     } catch (error: unknown) {
//       form.setError("root.credentials", {
//         type: "server",
//         message: getLoginErrorMessage(error),
//       });
//     }
//   }

//   return (
//     <>
//       {/* ===================================================
//           AUTOFILL
//       =================================================== */}

//       <style>
//         {`
//           .allocatr-login-input:-webkit-autofill,
//           .allocatr-login-input:-webkit-autofill:hover,
//           .allocatr-login-input:-webkit-autofill:focus,
//           .allocatr-login-input:-webkit-autofill:active {
//             -webkit-text-fill-color: var(--foreground) !important;
//             caret-color: var(--foreground) !important;

//             -webkit-box-shadow:
//               0 0 0 1000px var(--surface-2) inset !important;

//             box-shadow:
//               0 0 0 1000px var(--surface-2) inset !important;

//             transition:
//               background-color 9999s ease-out 0s,
//               color 9999s ease-out 0s;
//           }

//           .allocatr-login-input:-moz-autofill {
//             color: var(--foreground) !important;
//             caret-color: var(--foreground) !important;

//             background-color:
//               var(--surface-2) !important;

//             box-shadow:
//               0 0 0 1000px var(--surface-2) inset !important;
//           }

//           .allocatr-login-input:-webkit-autofill::first-line {
//             color: var(--foreground) !important;
//             font-family: inherit !important;
//             font-size: inherit !important;
//           }
//         `}
//       </style>

//       <main className="relative flex min-h-screen flex-col overflow-hidden bg-background text-foreground">
//         {/* =================================================
//             BACKGROUND DETAIL
//         ================================================= */}

//         <div
//           aria-hidden
//           className="pointer-events-none absolute inset-0"
//         >
//           <div
//             className={[
//               "absolute inset-x-0 top-0 hidden h-[420px]",

//               "opacity-[0.18]",

//               "sm:block",
//             ].join(" ")}
//             style={{
//               backgroundImage:
//                 "linear-gradient(to right, color-mix(in srgb, var(--border) 45%, transparent) 1px, transparent 1px), linear-gradient(to bottom, color-mix(in srgb, var(--border) 45%, transparent) 1px, transparent 1px)",

//               backgroundSize:
//                 "44px 44px",

//               maskImage:
//                 "linear-gradient(to bottom, black 0%, transparent 90%)",

//               WebkitMaskImage:
//                 "linear-gradient(to bottom, black 0%, transparent 90%)",
//             }}
//           />

//           <PawPrintIcon
//             className={[
//               "absolute -right-12 top-[18%]",

//               "hidden h-44 w-44 -rotate-12",

//               "text-foreground/[0.012]",

//               "lg:block",
//             ].join(" ")}
//           />

//           <PawPrintIcon
//             className={[
//               "absolute -left-8 bottom-[15%]",

//               "hidden h-28 w-28 rotate-12",

//               "text-foreground/[0.008]",

//               "xl:block",
//             ].join(" ")}
//           />
//         </div>

//         {/* =================================================
//             HEADER
//         ================================================= */}

//         <header
//           className={[
//             "relative z-30",

//             "border-b border-border/50",

//             "bg-background/88",

//             "backdrop-blur-xl",
//           ].join(" ")}
//         >
//           <div
//             className={[
//               "mx-auto flex h-16 w-full max-w-7xl items-center justify-between",

//               "px-4",
//               "sm:px-6",
//               "md:px-8",
//             ].join(" ")}
//           >
//             {/* LOGO */}

//             <Link
//               to="/"
//               aria-label="Go to Allocatr home"
//               className={[
//                 "group inline-flex items-center rounded-md",

//                 "outline-none",

//                 "focus-visible:ring-2",
//                 "focus-visible:ring-brand-secondary-highlight/20",

//                 "dark:focus-visible:ring-secondary/20",
//               ].join(" ")}
//             >
//               <img
//                 src={allocatrLogoDark}
//                 alt="Allocatr"
//                 className={[
//                   "h-[24px] w-auto",

//                   "transition-opacity duration-200",

//                   "group-hover:opacity-75",

//                   "dark:hidden",
//                 ].join(" ")}
//               />

//               <img
//                 src={allocatrLogoLight}
//                 alt="Allocatr"
//                 className={[
//                   "hidden h-[24px] w-auto",

//                   "transition-opacity duration-200",

//                   "group-hover:opacity-75",

//                   "dark:block",
//                 ].join(" ")}
//               />
//             </Link>

//             {/* BACK */}

//             <Link
//               to="/"
//               className={[
//                 "group inline-flex h-9 items-center gap-2 rounded-lg px-2",

//                 "text-[0.68rem] font-medium",

//                 "text-muted-foreground",

//                 "transition-colors",

//                 "hover:text-foreground",
//               ].join(" ")}
//             >
//               <ArrowLeftIcon
//                 size={13}
//                 className="transition-transform duration-200 group-hover:-translate-x-0.5"
//               />

//               <span className="hidden sm:inline">
//                 Back to website
//               </span>
//             </Link>
//           </div>
//         </header>

//         {/* =================================================
//             LOGIN AREA
//         ================================================= */}

//         <section
//           className={[
//             "relative z-10 flex flex-1 items-center justify-center",

//             "px-4 py-10",

//             "sm:px-6 sm:py-14",

//             "md:px-8 md:py-16",
//           ].join(" ")}
//         >
//           <motion.div
//             initial={
//               reduceMotion
//                 ? false
//                 : {
//                     opacity: 0,
//                     y: 16,
//                   }
//             }
//             animate={{
//               opacity: 1,
//               y: 0,
//             }}
//             transition={{
//               duration: 0.5,
//               ease: "easeOut",
//             }}
//             className="w-full max-w-[460px]"
//           >
//             {/* =============================================
//                 INTRO
//             ============================================= */}

//             <div className="mb-7 text-center sm:mb-8">
//               {/* ICON TILE */}

//               <Link
//                 to="/"
//                 aria-label="Allocatr home"
//                 className={[
//                   "group mx-auto flex h-12 w-12 items-center justify-center",

//                   "rounded-xl border",

//                   "border-border/65",

//                   "bg-surface-2/55",

//                   "ring-1 ring-inset ring-border/20",

//                   "transition-[background-color,border-color,transform] duration-200",

//                   "hover:-translate-y-0.5",

//                   "hover:border-border/85",

//                   "hover:bg-surface-3/60",

//                   "focus-visible:outline-none",

//                   "focus-visible:ring-2",

//                   "focus-visible:ring-brand-secondary-highlight/15",

//                   "dark:border-border",

//                   "dark:bg-surface-2/70",

//                   "dark:focus-visible:ring-secondary/15",
//                 ].join(" ")}
//               >
//                 <img
//                   src={assets.allocatrIcon}
//                   alt=""
//                   className="h-[21px] w-[21px] object-contain"
//                 />
//               </Link>

//               <p
//                 className={[
//                   "mt-6",

//                   "text-[0.5rem] font-semibold uppercase",

//                   "tracking-[0.17em]",

//                   "text-muted-foreground",
//                 ].join(" ")}
//               >
//                 Allocatr workspace
//               </p>

//               <h1
//                 className={[
//                   "mt-3",

//                   "text-[2rem] font-semibold",

//                   "leading-[1.02]",

//                   "tracking-[-0.04em]",

//                   "text-foreground",

//                   "sm:text-[2.3rem]",
//                 ].join(" ")}
//               >
//                 Welcome back.
//               </h1>

//               <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-muted-foreground">
//                 {returnTo
//                   ? "Sign in to continue where you left off."
//                   : "Sign in to access your projects, work and account."}
//               </p>
//             </div>

//             {/* =============================================
//                 FORM CARD
//             ============================================= */}

//             <div
//               className={[
//                 "rounded-[1.35rem] border",

//                 "border-border/60",

//                 "bg-card",

//                 "px-5 py-6",

//                 "sm:px-8 sm:py-8",

//                 "dark:border-border",
//                 "dark:bg-card",
//               ].join(" ")}
//             >
//               <form
//                 onSubmit={form.handleSubmit(handleLogin)}
//                 noValidate
//                 className="space-y-5"
//               >
//                 {/* =========================================
//                     EMAIL
//                 ========================================= */}

//                 <Controller
//                   name="email"
//                   control={form.control}
//                   render={({
//                     field,
//                     fieldState,
//                   }) => {
//                     const invalid =
//                       fieldState.invalid ||
//                       Boolean(credentialsError);

//                     return (
//                       <Field data-invalid={invalid}>
//                         <FieldLabel
//                           htmlFor="email"
//                           className={[
//                             "mb-2 block",

//                             "text-[0.68rem] font-semibold",

//                             "text-foreground/75",
//                           ].join(" ")}
//                         >
//                           Email address
//                         </FieldLabel>

//                         <div className="relative">
//                           <MailIcon
//                             size={15}
//                             className={[
//                               "pointer-events-none",

//                               "absolute left-3.5 top-1/2 z-10",

//                               "-translate-y-1/2",

//                               invalid
//                                 ? "text-destructive"
//                                 : "text-muted-foreground/70",
//                             ].join(" ")}
//                           />

//                           <Input
//                             {...field}
//                             id="email"
//                             type="email"
//                             autoComplete="email"
//                             placeholder="you@example.com"
//                             disabled={isSubmitting}
//                             aria-invalid={invalid}
//                             onChange={(event) => {
//                               field.onChange(event);
//                               clearCredentialsError();
//                             }}
//                             className={[
//                               "allocatr-login-input",

//                               inputStyle,

//                               "pl-10 pr-4",

//                               invalid
//                                 ? [
//                                     "border-destructive/65",

//                                     "focus-visible:border-destructive",

//                                     "focus-visible:ring-destructive/10",
//                                   ].join(" ")
//                                 : "",
//                             ].join(" ")}
//                           />
//                         </div>

//                         <FieldError
//                           errors={[fieldState.error]}
//                           className="mt-1.5 text-[0.68rem] text-destructive"
//                         />
//                       </Field>
//                     );
//                   }}
//                 />

//                 {/* =========================================
//                     PASSWORD
//                 ========================================= */}

//                 <Controller
//                   name="password"
//                   control={form.control}
//                   render={({
//                     field,
//                     fieldState,
//                   }) => {
//                     const invalid =
//                       fieldState.invalid ||
//                       Boolean(credentialsError);

//                     return (
//                       <Field data-invalid={invalid}>
//                         <div className="mb-2 flex items-center justify-between gap-4">
//                           <FieldLabel
//                             htmlFor="password"
//                             className="text-[0.68rem] font-semibold text-foreground/75"
//                           >
//                             Password
//                           </FieldLabel>

//                           <Link
//                             to="/forgot-password"
//                             className={[
//                               "text-[0.65rem] font-medium",

//                               "text-brand-secondary-highlight",

//                               "transition-opacity",

//                               "hover:opacity-70",

//                               "dark:text-secondary",
//                             ].join(" ")}
//                           >
//                             Forgot password?
//                           </Link>
//                         </div>

//                         <div className="relative">
//                           <LockKeyholeIcon
//                             size={15}
//                             className={[
//                               "pointer-events-none",

//                               "absolute left-3.5 top-1/2 z-10",

//                               "-translate-y-1/2",

//                               invalid
//                                 ? "text-destructive"
//                                 : "text-muted-foreground/70",
//                             ].join(" ")}
//                           />

//                           <Input
//                             {...field}
//                             id="password"
//                             type={
//                               showPassword
//                                 ? "text"
//                                 : "password"
//                             }
//                             autoComplete="current-password"
//                             placeholder="Enter your password"
//                             disabled={isSubmitting}
//                             aria-invalid={invalid}
//                             onChange={(event) => {
//                               field.onChange(event);
//                               clearCredentialsError();
//                             }}
//                             className={[
//                               "allocatr-login-input",

//                               inputStyle,

//                               "pl-10 pr-11",

//                               invalid
//                                 ? [
//                                     "border-destructive/65",

//                                     "focus-visible:border-destructive",

//                                     "focus-visible:ring-destructive/10",
//                                   ].join(" ")
//                                 : "",
//                             ].join(" ")}
//                           />

//                           <button
//                             type="button"
//                             onClick={() =>
//                               setShowPassword(
//                                 (current) => !current,
//                               )
//                             }
//                             disabled={isSubmitting}
//                             className={[
//                               "absolute right-3.5 top-1/2 z-10",

//                               "-translate-y-1/2",

//                               "text-muted-foreground",

//                               "transition-colors",

//                               "hover:text-foreground",

//                               "focus-visible:outline-none",

//                               "focus-visible:text-foreground",

//                               "disabled:cursor-not-allowed",

//                               "disabled:opacity-50",
//                             ].join(" ")}
//                             aria-label={
//                               showPassword
//                                 ? "Hide password"
//                                 : "Show password"
//                             }
//                           >
//                             {showPassword ? (
//                               <EyeOffIcon size={15} />
//                             ) : (
//                               <EyeIcon size={15} />
//                             )}
//                           </button>
//                         </div>

//                         <FieldError
//                           errors={[fieldState.error]}
//                           className="mt-1.5 text-[0.68rem] text-destructive"
//                         />
//                       </Field>
//                     );
//                   }}
//                 />

//                 {/* =========================================
//                     CREDENTIAL ERROR
//                 ========================================= */}

//                 {credentialsError && (
//                   <div
//                     className={[
//                       "rounded-lg border px-3.5 py-3",

//                       "border-destructive/20",

//                       "bg-destructive/[0.045]",

//                       "text-[0.68rem] leading-5",

//                       "text-destructive",
//                     ].join(" ")}
//                   >
//                     {credentialsError.message}
//                   </div>
//                 )}

//                 {/* =========================================
//                     SUBMIT
//                 ========================================= */}

//                 <Button
//                   type="submit"
//                   variant="ghost"
//                   disabled={isSubmitting}
//                   className={[
//                     "group h-11 w-full rounded-lg",

//                     "text-xs font-semibold",

//                     primaryButton,
//                   ].join(" ")}
//                 >
//                   {isSubmitting ? (
//                     <>
//                       <LoaderCircleIcon
//                         size={15}
//                         className="animate-spin"
//                       />

//                       Signing in
//                     </>
//                   ) : (
//                     <>
//                       Sign in

//                       <ArrowRightIcon
//                         size={14}
//                         className="transition-transform duration-200 group-hover:translate-x-0.5"
//                       />
//                     </>
//                   )}
//                 </Button>

//                 {/* =========================================
//                     REGISTER
//                 ========================================= */}

//                 <p className="text-center text-xs text-muted-foreground">
//                   Don&apos;t have an account?{" "}

//                   <Link
//                     to={registerUrl}
//                     className={[
//                       "font-semibold",

//                       "text-brand-secondary-highlight",

//                       "transition-opacity",

//                       "hover:opacity-70",

//                       "dark:text-secondary",
//                     ].join(" ")}
//                   >
//                     Create account
//                   </Link>
//                 </p>
//               </form>
//             </div>

//             {/* =============================================
//                 TRUST
//             ============================================= */}

//             <div className="mt-5 flex items-center justify-center gap-2 text-[0.58rem] text-muted-foreground/65">
//               <LockKeyholeIcon size={10} />

//               Secure Allocatr access
//             </div>
//           </motion.div>
//         </section>

//         {/* =================================================
//             FOOTER
//         ================================================= */}

//         <footer
//           className={[
//             "relative z-20",

//             "border-t border-border/50",

//             "px-4 py-5",

//             "sm:px-6",

//             "md:px-8",
//           ].join(" ")}
//         >
//           <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4">
//             <span className="text-[0.58rem] text-muted-foreground/70">
//               © {new Date().getFullYear()} Allocatr
//             </span>

//             <span className="hidden text-[0.58rem] text-muted-foreground/70 sm:inline">
//               Work, properly allocated.
//             </span>
//           </div>
//         </footer>
//       </main>
//     </>
//   );
// }

// /* =========================================================
//    RETURN PATH
// ========================================================= */

// function getSafeReturnTo(
//   value: string | null,
// ): string | null {
//   if (!value) {
//     return null;
//   }

//   const trimmed = value.trim();

//   if (!trimmed.startsWith("/")) {
//     return null;
//   }

//   if (trimmed.startsWith("//")) {
//     return null;
//   }

//   if (trimmed.startsWith("/login")) {
//     return null;
//   }

//   if (trimmed.startsWith("/register")) {
//     return null;
//   }

//   return trimmed;
// }

// /* =========================================================
//    LOGIN ERROR
// ========================================================= */

// function getLoginErrorMessage(
//   error: unknown,
// ): string {
//   const fallback =
//     "We couldn’t sign you in with those details. Check your email and password, then try again.";

//   if (
//     typeof error !== "object" ||
//     error === null ||
//     !("response" in error)
//   ) {
//     return fallback;
//   }

//   const response = (
//     error as {
//       response?: {
//         status?: number;

//         data?: {
//           message?: string;
//         };
//       };
//     }
//   ).response;

//   const status =
//     response?.status;

//   const backendMessage =
//     response?.data?.message?.trim();

//   const normalizedMessage =
//     backendMessage?.toLowerCase();

//   if (status === 401) {
//     return fallback;
//   }

//   if (!normalizedMessage) {
//     return fallback;
//   }

//   const credentialMessages = [
//     "invalid credentials",
//     "invalid credential",
//     "invalid email or password",
//     "incorrect email or password",
//     "incorrect password",
//     "authentication failed",
//     "login failed",
//     "unauthorized",
//   ];

//   if (
//     credentialMessages.some((message) =>
//       normalizedMessage.includes(message),
//     )
//   ) {
//     return fallback;
//   }

//   return backendMessage || fallback;
// }

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
  const returnTo = getSafeReturnTo(searchParams.get("returnTo"));
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
    if (user) navigate(returnTo || "/projects", { replace: true });
  }, [user, returnTo, navigate]);

  function clearCredentialsError() {
    if (form.formState.errors.root?.credentials)
      form.clearErrors("root.credentials");
  }
  async function handleLogin(values: LoginFormValues) {
    form.clearErrors("root.credentials");
    try {
      await login(values.email.trim(), values.password);
      navigate(returnTo || "/projects", { replace: true });
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

function getSafeReturnTo(value: string | null): string | null {
  if (!value) return null;
  const trimmed = value.trim();
  if (
    !trimmed.startsWith("/") ||
    trimmed.startsWith("//") ||
    /[\\\u0000-\u001f\u007f]/.test(trimmed) ||
    /%(?:5c|0[0-9a-f]|1[0-9a-f]|7f)/i.test(trimmed)
  )
    return null;
  try {
    const base = "https://allocatr.invalid";
    const url = new URL(trimmed, base);
    if (
      url.origin !== base ||
      /^\/(?:login|register)(?:\/|$)/i.test(url.pathname)
    )
      return null;
    return `${url.pathname}${url.search}${url.hash}`;
  } catch {
    return null;
  }
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
