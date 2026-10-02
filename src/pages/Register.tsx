// import {
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

// import { useEffect, useState, type ComponentType } from "react";
// import { Link, useNavigate, useSearchParams } from "react-router-dom";
// import { motion } from "framer-motion";

// import { zodResolver } from "@hookform/resolvers/zod";
// import { Controller, useForm } from "react-hook-form";
// import * as z from "zod";

// import { useAuth } from "@/auth/useAuth";

// import assets from "@/assets/assets";
// import AllocatrLogo from "@/components/AllocatrLogo";

// import { Button } from "@/components/ui/button";
// import { Field, FieldError, FieldLabel } from "@/components/ui/field";
// import { Input } from "@/components/ui/input";

// /* =========================================================
//    IMAGE
// ========================================================= */

// const REGISTER_IMAGE =
//   "https://images.pexels.com/photos/730896/pexels-photo-730896.jpeg?cs=srgb&dl=pexels-snapwire-730896.jpg&fm=jpg";

// /* =========================================================
//    VALIDATION
// ========================================================= */

// const registerSchema = z.object({
//   fullName: z.string().trim().min(1, "Full name is required.").min(2, "Enter at least 2 characters.").max(100, "Keep your name below 100 characters."),
//   email: z.string().trim().min(1, "Email address is required.").email("Enter a valid email address."),
//   password: z.string().min(1, "Password is required.").min(8, "Password must be at least 8 characters."),
//   isAllocat: z.boolean(),
// });

// type RegisterFormValues = z.infer<typeof registerSchema>;

// /* =========================================================
//    REGISTER
// ========================================================= */

// export default function Register() {
//   const { register, user } = useAuth();
//   const navigate = useNavigate();
//   const [searchParams] = useSearchParams();

//   const [showPassword, setShowPassword] = useState(false);

//   const returnTo = getSafeReturnTo(searchParams.get("returnTo"));
//   const loginUrl = returnTo
//     ? `/login?returnTo=${encodeURIComponent(returnTo)}`
//     : "/login";

//   const form = useForm<RegisterFormValues>({
//     resolver: zodResolver(registerSchema),
//     mode: "onBlur",
//     reValidateMode: "onChange",
//     defaultValues: {
//       fullName: "",
//       email: "",
//       password: "",
//       isAllocat: false,
//     },
//   });

//   const { isSubmitting } = form.formState;
//   const serverError = form.formState.errors.root?.server;

//   /* =======================================================
//      AUTH REDIRECT
//   ======================================================= */

//   useEffect(() => {
//     if (!user) return;

//     navigate(returnTo || "/projects", {
//       replace: true,
//     });
//   }, [user, returnTo, navigate]);

//   /* =======================================================
//      CLEAR SERVER ERROR
//   ======================================================= */

//   function clearServerError() {
//     if (form.formState.errors.root?.server) {
//       form.clearErrors("root.server");
//     }
//   }

//   /* =======================================================
//      SUBMIT
//   ======================================================= */

//   async function handleRegister(values: RegisterFormValues) {
//     form.clearErrors("root.server");

//     try {
//       await register(
//         values.fullName.trim(),
//         values.email.trim(),
//         values.password,
//         values.isAllocat,
//       );

//       navigate(returnTo || "/projects", {
//         replace: true,
//       });
//     } catch (error: unknown) {
//       form.setError("root.server", {
//         type: "server",
//         message: getRegisterErrorMessage(error),
//       });
//     }
//   }

//   return (
//     <>
//       <style>
//         {`
//           .allocatr-auth {
//             color-scheme: dark;
//           }

//           .allocatr-auth input {
//             color-scheme: dark;
//           }

//           .allocatr-auth-input:-webkit-autofill,
//           .allocatr-auth-input:-webkit-autofill:hover,
//           .allocatr-auth-input:-webkit-autofill:focus,
//           .allocatr-auth-input:-webkit-autofill:active {
//             -webkit-text-fill-color: #ffffff !important;
//             caret-color: #ffffff !important;
//             background-color: #151515 !important;
//             -webkit-box-shadow: 0 0 0 1000px #151515 inset !important;
//             box-shadow: 0 0 0 1000px #151515 inset !important;
//             transition: background-color 9999s ease-out 0s, color 9999s ease-out 0s;
//           }

//           .allocatr-auth-input:-moz-autofill {
//             color: #ffffff !important;
//             caret-color: #ffffff !important;
//             background-color: #151515 !important;
//             box-shadow: 0 0 0 1000px #151515 inset !important;
//           }

//           .allocatr-auth-input:-webkit-autofill::first-line {
//             color: #ffffff !important;
//             font-family: inherit !important;
//             font-size: inherit !important;
//           }
//         `}
//       </style>

//       <main className="allocatr-auth dark relative min-h-screen overflow-hidden bg-[#111111] text-white">

//         {/* BACKGROUND */}

//         <div className="absolute inset-0">
//           <img
//             src={REGISTER_IMAGE}
//             alt=""
//             className="h-full w-full object-cover object-center"
//           />

//           <div className="absolute inset-0 bg-black/20" />

//           <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.08)_0%,rgba(0,0,0,0.02)_40%,rgba(0,0,0,0.32)_100%)]" />
//           <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.18)_0%,transparent_28%,transparent_70%,rgba(0,0,0,0.32)_100%)]" />
//         </div>

//         {/* TOP BAR */}

//         <header className="relative z-20 flex h-[76px] items-center border-b border-white/[0.06] bg-[#171717]/95 px-5 backdrop-blur-xl sm:px-8">
//           <Link
//             to="/"
//             className="group inline-flex items-center"
//             aria-label="Go to Allocatr home"
//           >
//             <AllocatrLogo
//               theme="dark"
//               className="w-[7.25rem] sm:w-[8rem]"
//             />
//           </Link>
//         </header>

//         {/* REGISTER AREA */}

//         <section className="relative z-10 flex min-h-[calc(100vh-126px)] items-center justify-center px-5 py-8 sm:px-8 sm:py-10">
//           <motion.div
//             initial={{
//               opacity: 0,
//               y: 16,
//               scale: 0.985,
//             }}
//             animate={{
//               opacity: 1,
//               y: 0,
//               scale: 1,
//             }}
//             transition={{
//               duration: 0.55,
//               ease: "easeOut",
//             }}
//             className="w-full max-w-[430px]"
//           >
//             <div className="overflow-hidden rounded-[1.4rem] border border-white/[0.10] bg-[#242424]/90 shadow-2xl shadow-black/40 backdrop-blur-xl">

//               {/* CARD BRAND */}

//               <div className="px-7 pb-5 pt-7 text-center sm:px-8 sm:pt-8">
//                 <Link
//                   to="/"
//                   aria-label="Allocatr home"
//                   className="mx-auto flex h-20 w-20 items-center justify-center rounded-[1.25rem] bg-black/30 ring-1 ring-white/[0.07] transition-transform duration-300 hover:scale-[1.03]"
//                 >
//                   <img
//                     src={assets.allocatrIcon}
//                     alt="Allocatr"
//                     className="h-12 w-12 object-contain"
//                   />
//                 </Link>

//                 <h1 className="mt-5 text-xl font-black tracking-[-0.025em] text-white">
//                   Join Allocatr
//                 </h1>

//                 <p className="mt-1.5 text-xs text-white/45">
//                   {returnTo
//                     ? "Create your account to continue"
//                     : "Create your account and get started"}
//                 </p>
//               </div>

//               {/* FORM */}

//               <form
//                 onSubmit={form.handleSubmit(handleRegister)}
//                 noValidate
//                 className="space-y-4 px-7 pb-7 sm:px-8"
//               >

//                 {/* FULL NAME */}

//                 <Controller
//                   name="fullName"
//                   control={form.control}
//                   render={({ field, fieldState }) => (
//                     <Field data-invalid={fieldState.invalid}>
//                       <FieldLabel
//                         htmlFor="fullName"
//                         className="sr-only"
//                       >
//                         Full name
//                       </FieldLabel>

//                       <div className="relative">
//                         <UserIcon
//                           size={16}
//                           className={[
//                             "pointer-events-none absolute left-3.5 top-1/2 z-10 -translate-y-1/2",
//                             fieldState.invalid
//                               ? "text-destructive"
//                               : "text-white/35",
//                           ].join(" ")}
//                         />

//                         <Input
//                           {...field}
//                           id="fullName"
//                           type="text"
//                           autoComplete="name"
//                           placeholder="Full name"
//                           disabled={isSubmitting}
//                           aria-invalid={fieldState.invalid}
//                           onChange={event => {
//                             field.onChange(event);
//                             clearServerError();
//                           }}
//                           className={[
//                             "allocatr-auth-input",
//                             "h-11 rounded-lg",
//                             "!bg-[#151515]",
//                             "!text-white",
//                             "pl-10 pr-4",
//                             "shadow-none",
//                             "placeholder:!text-white/30",
//                             "focus-visible:ring-1",
//                             fieldState.invalid
//                               ? "!border-destructive/70 focus-visible:!border-destructive focus-visible:ring-destructive/25"
//                               : "!border-white/[0.12] focus-visible:!border-brand-primary/60 focus-visible:ring-brand-primary/30",
//                           ].join(" ")}
//                         />
//                       </div>

//                       <FieldError
//                         errors={[fieldState.error]}
//                         className="text-[0.68rem] text-destructive"
//                       />
//                     </Field>
//                   )}
//                 />

//                 {/* EMAIL */}

//                 <Controller
//                   name="email"
//                   control={form.control}
//                   render={({ field, fieldState }) => (
//                     <Field data-invalid={fieldState.invalid}>
//                       <FieldLabel
//                         htmlFor="email"
//                         className="sr-only"
//                       >
//                         Email address
//                       </FieldLabel>

//                       <div className="relative">
//                         <MailIcon
//                           size={16}
//                           className={[
//                             "pointer-events-none absolute left-3.5 top-1/2 z-10 -translate-y-1/2",
//                             fieldState.invalid
//                               ? "text-destructive"
//                               : "text-white/35",
//                           ].join(" ")}
//                         />

//                         <Input
//                           {...field}
//                           id="email"
//                           type="email"
//                           autoComplete="email"
//                           placeholder="Email address"
//                           disabled={isSubmitting}
//                           aria-invalid={fieldState.invalid}
//                           onChange={event => {
//                             field.onChange(event);
//                             clearServerError();
//                           }}
//                           className={[
//                             "allocatr-auth-input",
//                             "h-11 rounded-lg",
//                             "!bg-[#151515]",
//                             "!text-white",
//                             "pl-10 pr-4",
//                             "shadow-none",
//                             "placeholder:!text-white/30",
//                             "focus-visible:ring-1",
//                             fieldState.invalid
//                               ? "!border-destructive/70 focus-visible:!border-destructive focus-visible:ring-destructive/25"
//                               : "!border-white/[0.12] focus-visible:!border-brand-primary/60 focus-visible:ring-brand-primary/30",
//                           ].join(" ")}
//                         />
//                       </div>

//                       <FieldError
//                         errors={[fieldState.error]}
//                         className="text-[0.68rem] text-destructive"
//                       />
//                     </Field>
//                   )}
//                 />

//                 {/* PASSWORD */}

//                 <Controller
//                   name="password"
//                   control={form.control}
//                   render={({ field, fieldState }) => (
//                     <Field data-invalid={fieldState.invalid}>
//                       <FieldLabel
//                         htmlFor="password"
//                         className="sr-only"
//                       >
//                         Password
//                       </FieldLabel>

//                       <div className="relative">
//                         <LockKeyholeIcon
//                           size={16}
//                           className={[
//                             "pointer-events-none absolute left-3.5 top-1/2 z-10 -translate-y-1/2",
//                             fieldState.invalid
//                               ? "text-destructive"
//                               : "text-white/35",
//                           ].join(" ")}
//                         />

//                         <Input
//                           {...field}
//                           id="password"
//                           type={showPassword ? "text" : "password"}
//                           autoComplete="new-password"
//                           placeholder="Create a password"
//                           disabled={isSubmitting}
//                           aria-invalid={fieldState.invalid}
//                           onChange={event => {
//                             field.onChange(event);
//                             clearServerError();
//                           }}
//                           className={[
//                             "allocatr-auth-input",
//                             "h-11 rounded-lg",
//                             "!bg-[#151515]",
//                             "!text-white",
//                             "pl-10 pr-11",
//                             "shadow-none",
//                             "placeholder:!text-white/30",
//                             "focus-visible:ring-1",
//                             fieldState.invalid
//                               ? "!border-destructive/70 focus-visible:!border-destructive focus-visible:ring-destructive/25"
//                               : "!border-white/[0.12] focus-visible:!border-brand-primary/60 focus-visible:ring-brand-primary/30",
//                           ].join(" ")}
//                         />

//                         <button
//                           type="button"
//                           onClick={() => setShowPassword(current => !current)}
//                           disabled={isSubmitting}
//                           className="absolute right-3.5 top-1/2 z-10 -translate-y-1/2 text-white/35 transition-colors hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
//                           aria-label={
//                             showPassword
//                               ? "Hide password"
//                               : "Show password"
//                           }
//                         >
//                           {showPassword ? (
//                             <EyeOffIcon size={16} />
//                           ) : (
//                             <EyeIcon size={16} />
//                           )}
//                         </button>
//                       </div>

//                       <FieldError
//                         errors={[fieldState.error]}
//                         className="text-[0.68rem] text-destructive"
//                       />
//                     </Field>
//                   )}
//                 />

//                 {/* ACCOUNT TYPE */}

//                 <Controller
//                   name="isAllocat"
//                   control={form.control}
//                   render={({ field }) => (
//                     <Field>
//                       <div>
//                         <p className="text-[0.68rem] font-semibold text-white/70">
//                           How will you use Allocatr?
//                         </p>

//                         <p className="mt-1 text-[0.64rem] leading-5 text-white/35">
//                           You can still create projects as an Allocat.
//                         </p>
//                       </div>

//                       <div className="grid grid-cols-2 overflow-hidden rounded-lg border border-white/[0.10] bg-black/20">
//                         <AccountTypeOption
//                           selected={!field.value}
//                           title="Client"
//                           icon={UserIcon}
//                           onClick={() => {
//                             field.onChange(false);
//                             clearServerError();
//                           }}
//                           disabled={isSubmitting}
//                         />

//                         <AccountTypeOption
//                           selected={field.value}
//                           title="Allocat"
//                           icon={BriefcaseBusinessIcon}
//                           onClick={() => {
//                             field.onChange(true);
//                             clearServerError();
//                           }}
//                           disabled={isSubmitting}
//                           divided
//                         />
//                       </div>
//                     </Field>
//                   )}
//                 />

//                 {/* SERVER ERROR */}

//                 {serverError && (
//                   <Field data-invalid>
//                     <FieldError
//                       errors={[serverError]}
//                       className="text-[0.68rem] text-destructive"
//                     />
//                   </Field>
//                 )}

//                 {/* SUBMIT */}

//                 <Button
//                   type="submit"
//                   disabled={isSubmitting}
//                   className="group mt-1 h-11 w-full rounded-lg bg-brand-primary font-bold text-dark-gray shadow-none hover:bg-brand-primary/90"
//                 >
//                   {isSubmitting ? (
//                     <>
//                       <LoaderCircleIcon
//                         size={16}
//                         className="animate-spin"
//                       />

//                       Creating account
//                     </>
//                   ) : (
//                     <>
//                       Create account

//                       <ArrowRightIcon
//                         size={15}
//                         className="transition-transform duration-200 group-hover:translate-x-0.5"
//                       />
//                     </>
//                   )}
//                 </Button>

//                 {/* LOGIN */}

//                 <p className="pt-1 text-center text-xs text-white/55">
//                   Already have an account?{" "}

//                   <Link
//                     to={loginUrl}
//                     className="font-semibold text-brand-primary transition-opacity hover:opacity-75"
//                   >
//                     Sign in
//                   </Link>
//                 </p>

//                 {/* TERMS */}

//                 <p className="text-center text-[0.62rem] leading-5 text-white/30">
//                   By creating an account, you agree to our{" "}

//                   <Link
//                     to="/terms"
//                     className="underline underline-offset-2 transition-colors hover:text-white/60"
//                   >
//                     Terms
//                   </Link>

//                   {" "}and{" "}

//                   <Link
//                     to="/privacy"
//                     className="underline underline-offset-2 transition-colors hover:text-white/60"
//                   >
//                     Privacy Policy
//                   </Link>
//                   .
//                 </p>
//               </form>
//             </div>

//             <p className="mt-4 text-center text-[0.62rem] text-white/40">
//               Work, properly allocated.
//             </p>
//           </motion.div>
//         </section>

//         {/* BOTTOM BAR */}

//         <footer className="relative z-20 flex min-h-[50px] items-center justify-between gap-4 border-t border-white/[0.06] bg-[#171717]/95 px-5 backdrop-blur-xl sm:px-8">
//           <Link
//             to="/"
//             className="inline-flex items-center gap-2 text-[0.68rem] font-medium uppercase tracking-[0.08em] text-white/45 transition-colors hover:text-brand-primary"
//           >
//             <ArrowLeftIcon size={12} />
//             Back to website
//           </Link>

//           <div className="flex items-center gap-3 text-[0.65rem] text-white/30">
//             <LockKeyholeIcon size={11} />

//             <span className="hidden sm:inline">
//               Secure Allocatr access
//             </span>

//             <span>
//               © {new Date().getFullYear()}
//             </span>
//           </div>
//         </footer>
//       </main>
//     </>
//   );
// }

// /* =========================================================
//    ACCOUNT TYPE
// ========================================================= */

// function AccountTypeOption({
//   selected,
//   title,
//   icon: Icon,
//   onClick,
//   disabled,
//   divided = false,
// }: {
//   selected: boolean;
//   title: string;
//   icon: ComponentType<{
//     size?: number;
//     className?: string;
//   }>;
//   onClick: () => void;
//   disabled: boolean;
//   divided?: boolean;
// }) {
//   return (
//     <button
//       type="button"
//       onClick={onClick}
//       disabled={disabled}
//       aria-pressed={selected}
//       className={[
//         "relative flex h-12 items-center justify-center gap-2",
//         "text-xs font-semibold",
//         "transition-colors duration-200",
//         "disabled:cursor-not-allowed",
//         "disabled:opacity-50",
//         divided
//           ? "border-l border-white/[0.10]"
//           : "",
//         selected
//           ? "bg-brand-primary text-dark-gray"
//           : "text-white/45 hover:bg-white/[0.04] hover:text-white",
//       ].join(" ")}
//     >
//       <Icon size={14} />

//       {title}

//       {selected && (
//         <CheckIcon
//           size={12}
//           strokeWidth={3}
//         />
//       )}
//     </button>
//   );
// }

// /* =========================================================
//    RETURN PATH
// ========================================================= */

// function getSafeReturnTo(value: string | null): string | null {
//   if (!value) return null;

//   const trimmed = value.trim();

//   if (!trimmed.startsWith("/")) return null;
//   if (trimmed.startsWith("//")) return null;
//   if (trimmed.startsWith("/login")) return null;
//   if (trimmed.startsWith("/register")) return null;

//   return trimmed;
// }

// /* =========================================================
//    REGISTER ERROR
// ========================================================= */

// function getRegisterErrorMessage(error: unknown): string {
//   const fallback =
//     "We couldn’t create your account. Check your details and try again.";

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
//         data?: {
//           message?: string;
//         };
//       };
//     }
//   ).response;

//   const backendMessage =
//     response?.data?.message?.trim();

//   if (!backendMessage) return fallback;

//   const normalizedMessage =
//     backendMessage.toLowerCase();

//   if (
//     normalizedMessage.includes("duplicate email") ||
//     normalizedMessage.includes("email already") ||
//     normalizedMessage.includes("already registered") ||
//     normalizedMessage.includes("already exists")
//   ) {
//     return "An account with that email may already exist. Try signing in instead.";
//   }

//   return backendMessage;
// }

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

import { useEffect, useState, type ComponentType, type ReactNode } from "react";

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
   IMAGE
========================================================= */

const REGISTER_IMAGE =
  "https://images.pexels.com/photos/730896/pexels-photo-730896.jpeg?cs=srgb&dl=pexels-snapwire-730896.jpg&fm=jpg";

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

  "placeholder:text-muted-foreground/60",

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
  ======================================================= */

  useEffect(() => {
    if (!user) {
      return;
    }

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

      <main className="relative min-h-screen overflow-hidden bg-background text-foreground">
        {/* =================================================
            HEADER
        ================================================= */}

        <header
          className={[
            "relative z-30",
            "border-b border-border/50",
            "bg-background/90",
            "backdrop-blur-xl",
          ].join(" ")}
        >
          <div
            className={[
              "mx-auto flex h-16 w-full max-w-7xl items-center justify-between",
              "px-4 sm:px-6 md:px-8",
            ].join(" ")}
          >
            {/* LOGO */}

            <Link
              to="/"
              aria-label="Go to Allocatr home"
              className={[
                "group inline-flex items-center rounded-md outline-none",

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

                "text-[0.68rem] font-medium text-muted-foreground",

                "transition-colors",

                "hover:text-foreground",
              ].join(" ")}
            >
              <ArrowLeftIcon
                size={13}
                className="transition-transform duration-200 group-hover:-translate-x-0.5"
              />

              <span className="hidden sm:inline">Back to website</span>
            </Link>
          </div>
        </header>

        {/* =================================================
            PAGE
        ================================================= */}

        <div
          className={[
            "mx-auto grid min-h-[calc(100vh-4rem)] w-full max-w-7xl",

            "lg:grid-cols-[0.92fr_1.08fr]",
          ].join(" ")}
        >
          {/* ===============================================
              FORM SIDE
          =============================================== */}

          <section
            className={[
              "relative flex items-center",

              "px-4 py-10",
              "sm:px-6 sm:py-14",
              "md:px-8",
              "lg:py-16",
            ].join(" ")}
          >
            {/* SUBTLE PAW */}

            <PawPrintIcon
              aria-hidden
              className={[
                "pointer-events-none absolute -left-4 top-[20%]",

                "hidden h-32 w-32 rotate-12",

                "text-foreground/[0.012]",

                "md:block",
              ].join(" ")}
            />

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
              className="relative mx-auto w-full max-w-[440px]"
            >
              {/* ===========================================
                  BRAND TILE
              =========================================== */}

              <Link
                to="/"
                aria-label="Allocatr home"
                className={[
                  "group flex h-12 w-12 items-center justify-center",

                  "rounded-xl border",

                  "border-border/65",
                  "bg-surface-2/55",

                  "ring-1 ring-inset ring-border/20",

                  "transition-[background-color,border-color,transform]",
                  "duration-200",

                  "hover:-translate-y-0.5",
                  "hover:border-border/85",
                  "hover:bg-surface-3/60",

                  "dark:border-border",
                  "dark:bg-surface-2/70",
                ].join(" ")}
              >
                <span className="flex h-7 w-7 items-center justify-center">
                  <img
                    src={assets.allocatrIcon}
                    alt=""
                    className="h-[22px] w-[22px] object-contain"
                  />
                </span>
              </Link>

              {/* ===========================================
                  INTRO
              =========================================== */}

              <div className="mt-7">
                <p
                  className={[
                    "text-[0.52rem] font-semibold uppercase",

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

                    "sm:text-[2.25rem]",
                  ].join(" ")}
                >
                  Join Allocatr.
                </h1>

                <p className="mt-3 max-w-sm text-sm leading-6 text-muted-foreground">
                  {returnTo
                    ? "Create your account to continue where you left off."
                    : "Create an account to start projects, find capability or offer your own."}
                </p>
              </div>

              {/* ===========================================
                  FORM
              =========================================== */}

              <form
                onSubmit={form.handleSubmit(handleRegister)}
                noValidate
                className="mt-8 space-y-5"
              >
                {/* FULL NAME */}

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

                {/* EMAIL */}

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

                {/* PASSWORD */}

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

                          <span className="text-[0.62rem] text-muted-foreground">
                            Minimum 8 characters
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

                              "transition-colors",

                              "hover:text-foreground",

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
                          Choose how you want to get started. Allocats can still
                          create their own projects.
                        </p>
                      </div>

                      <div
                        className={[
                          "grid grid-cols-2 overflow-hidden rounded-xl border",

                          "border-border/65",

                          "bg-surface-2/35",

                          "dark:border-border",
                          "dark:bg-surface-2/60",
                        ].join(" ")}
                      >
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
                          divided
                        />
                      </div>
                    </Field>
                  )}
                />

                {/* SERVER ERROR */}

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

                {/* SUBMIT */}

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
                      <LoaderCircleIcon size={15} className="animate-spin" />
                      Creating account
                    </>
                  ) : (
                    <>
                      Create account
                      <ArrowRightIcon
                        size={14}
                        className={[
                          "transition-transform duration-200",

                          "group-hover:translate-x-0.5",
                        ].join(" ")}
                      />
                    </>
                  )}
                </Button>

                {/* LOGIN */}

                <p className="pt-1 text-center text-xs text-muted-foreground">
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

                {/* TERMS */}

                <p className="text-center text-[0.62rem] leading-5 text-muted-foreground/75">
                  By creating an account, you agree to our{" "}
                  <Link
                    to="/terms"
                    className={[
                      "underline underline-offset-2",

                      "transition-colors",

                      "hover:text-foreground",
                    ].join(" ")}
                  >
                    Terms
                  </Link>{" "}
                  and{" "}
                  <Link
                    to="/privacy"
                    className={[
                      "underline underline-offset-2",

                      "transition-colors",

                      "hover:text-foreground",
                    ].join(" ")}
                  >
                    Privacy Policy
                  </Link>
                  .
                </p>
              </form>

              {/* ===========================================
                  TRUST LINE
              =========================================== */}

              <div className="mt-8 flex items-center justify-center gap-2 text-[0.58rem] text-muted-foreground/75">
                <LockKeyholeIcon size={11} />

                <span>Secure Allocatr registration</span>
              </div>
            </motion.div>
          </section>

          {/* ===============================================
              VISUAL SIDE
          =============================================== */}

          <section className="hidden p-4 pl-0 lg:block">
            <motion.div
              initial={
                reduceMotion
                  ? false
                  : {
                      opacity: 0,
                      x: 18,
                    }
              }
              animate={{
                opacity: 1,
                x: 0,
              }}
              transition={{
                delay: 0.08,
                duration: 0.6,
                ease: "easeOut",
              }}
              className={[
                "relative h-full min-h-[calc(100vh-6rem)]",

                "overflow-hidden rounded-[2rem]",

                "border border-border/55",

                "bg-surface-2",
              ].join(" ")}
            >
              <img
                src={REGISTER_IMAGE}
                alt=""
                className={[
                  "absolute inset-0 h-full w-full object-cover",

                  "saturate-[0.78]",

                  "dark:brightness-[0.7]",
                  "dark:saturate-[0.65]",
                ].join(" ")}
              />

              <div aria-hidden className="absolute inset-0 bg-black/15" />

              <div
                aria-hidden
                className={[
                  "absolute inset-0",

                  "bg-gradient-to-t",

                  "from-black/75",
                  "via-black/10",
                  "to-black/5",
                ].join(" ")}
              />

              {/* PAWS */}

              <div
                aria-hidden
                className="absolute right-9 top-9 flex items-center gap-3"
              >
                <PawPrintIcon className="h-5 w-5 -rotate-12 text-white/45" />

                <PawPrintIcon className="h-4 w-4 rotate-6 text-white/25" />

                <PawPrintIcon className="h-3 w-3 -rotate-6 text-white/15" />
              </div>

              {/* CONTENT */}

              <div className="absolute inset-x-0 bottom-0 p-10 xl:p-12">
                <div className="max-w-xl">
                  <div className="flex items-center gap-2.5">
                    <span className="h-1.5 w-7 rounded-full bg-brand-primary" />

                    <p className="text-[0.52rem] font-semibold uppercase tracking-[0.18em] text-white/60">
                      One platform. Two ways to participate.
                    </p>
                  </div>

                  <h2
                    className={[
                      "mt-5 max-w-[11ch]",

                      "text-[3rem] font-semibold",

                      "leading-[0.96]",

                      "tracking-[-0.045em]",

                      "text-white",

                      "xl:text-[3.5rem]",
                    ].join(" ")}
                  >
                    Bring work in. Or bring your capability.
                  </h2>

                  <p className="mt-5 max-w-lg text-sm leading-7 text-white/65">
                    Create projects, find the people they need, or build your
                    professional record around the work you can deliver.
                  </p>

                  <div className="mt-8 grid grid-cols-2 gap-3 border-t border-white/15 pt-6">
                    <VisualAccountType
                      icon={UserIcon}
                      title="For clients"
                      text="Start with the work."
                    />

                    <VisualAccountType
                      icon={BriefcaseBusinessIcon}
                      title="For Allocats"
                      text="Lead with capability."
                    />
                  </div>

                  <div className="mt-7 flex flex-wrap gap-x-6 gap-y-3">
                    <VisualDetail>Project first</VisualDetail>

                    <VisualDetail>Capability led</VisualDetail>

                    <VisualDetail>Clear ownership</VisualDetail>
                  </div>
                </div>
              </div>
            </motion.div>
          </section>
        </div>

        {/* =================================================
            MOBILE FOOTER
        ================================================= */}

        <footer
          className={[
            "relative z-20",

            "border-t border-border/50",

            "px-4 py-5",

            "sm:px-6",

            "md:px-8",

            "lg:hidden",
          ].join(" ")}
        >
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
            <p className="text-[0.58rem] text-muted-foreground">
              © {new Date().getFullYear()} Allocatr
            </p>

            <p className="text-[0.58rem] text-muted-foreground">
              Work, properly allocated.
            </p>
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
  divided = false,
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
  divided?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-pressed={selected}
      className={[
        "relative flex min-h-[72px] items-center gap-3 px-3.5 py-3",

        "text-left",

        "transition-[background-color,color] duration-200",

        "focus-visible:z-10",
        "focus-visible:outline-none",
        "focus-visible:ring-2",
        "focus-visible:ring-inset",
        "focus-visible:ring-brand-secondary-highlight/20",

        "disabled:cursor-not-allowed",
        "disabled:opacity-50",

        divided ? "border-l border-border/60" : "",

        selected
          ? [
              "bg-brand-secondary-highlight",
              "text-primary-foreground",

              "dark:bg-secondary",
              "dark:text-secondary-foreground",

              "dark:focus-visible:ring-secondary/30",
            ].join(" ")
          : [
              "text-foreground/70",

              "hover:bg-surface-3/55",
              "hover:text-foreground",

              "dark:hover:bg-surface-3/65",
            ].join(" "),
      ].join(" ")}
    >
      <span
        className={[
          "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",

          selected
            ? [
                "bg-white/10",
                "text-current",

                "dark:bg-secondary-foreground/[0.08]",
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

          {selected && <CheckIcon size={11} strokeWidth={3} />}
        </span>

        <span
          className={[
            "mt-0.5 block text-[0.52rem] leading-4",

            selected ? "text-current opacity-65" : "text-muted-foreground",
          ].join(" ")}
        >
          {description}
        </span>
      </span>
    </button>
  );
}

/* =========================================================
   VISUAL ACCOUNT TYPE
========================================================= */

function VisualAccountType({
  icon: Icon,
  title,
  text,
}: {
  icon: ComponentType<{
    size?: number;
    className?: string;
  }>;
  title: string;
  text: string;
}) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-white/10 bg-black/10 p-3.5 backdrop-blur-sm">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/[0.06] text-brand-primary">
        <Icon size={13} />
      </span>

      <div>
        <p className="text-[0.62rem] font-semibold text-white/85">{title}</p>

        <p className="mt-1 text-[0.52rem] text-white/45">{text}</p>
      </div>
    </div>
  );
}

/* =========================================================
   VISUAL DETAIL
========================================================= */

function VisualDetail({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 text-[0.57rem] font-medium text-white/60">
      <span className="h-1.5 w-1.5 rounded-full bg-brand-primary" />

      {children}
    </span>
  );
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
