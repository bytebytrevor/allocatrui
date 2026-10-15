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
//   PawPrintIcon,
//   UserIcon,
// } from "lucide-react";

// import { useEffect, useState, type ComponentType } from "react";

// import { Link, useNavigate, useSearchParams } from "react-router-dom";

// import { motion, useReducedMotion } from "framer-motion";

// import { zodResolver } from "@hookform/resolvers/zod";
// import { Controller, useForm } from "react-hook-form";
// import * as z from "zod";

// import { useAuth } from "@/auth/useAuth";

// import assets from "@/assets/assets";

// import allocatrLogoLight from "@/assets/allocatr-neg-light.svg";
// import allocatrLogoDark from "@/assets/allocatr-dark-02.svg";

// import { Button } from "@/components/ui/button";

// import { Field, FieldError, FieldLabel } from "@/components/ui/field";

// import { Input } from "@/components/ui/input";

// /* =========================================================
//    VALIDATION
// ========================================================= */

// const registerSchema = z.object({
//   fullName: z
//     .string()
//     .trim()
//     .min(1, "Full name is required.")
//     .min(2, "Enter at least 2 characters.")
//     .max(100, "Keep your name below 100 characters."),

//   email: z
//     .string()
//     .trim()
//     .min(1, "Email address is required.")
//     .email("Enter a valid email address."),

//   password: z
//     .string()
//     .min(1, "Password is required.")
//     .min(8, "Password must be at least 8 characters."),

//   isAllocat: z.boolean(),
// });

// type RegisterFormValues = z.infer<typeof registerSchema>;

// /* =========================================================
//    SHARED STYLES
// ========================================================= */

// const primaryButton = [
//   "border border-brand-secondary-highlight/15",
//   "bg-brand-secondary-highlight",
//   "text-primary-foreground",
//   "shadow-none",

//   "transition-opacity duration-150",

//   "hover:border-brand-secondary-highlight/15",
//   "hover:bg-brand-secondary-highlight",
//   "hover:text-primary-foreground",
//   "hover:opacity-90",

//   "focus-visible:ring-2",
//   "focus-visible:ring-brand-secondary-highlight/15",

//   "dark:border-secondary/10",
//   "dark:bg-secondary",
//   "dark:text-secondary-foreground",

//   "dark:hover:border-secondary/10",
//   "dark:hover:bg-secondary",
//   "dark:hover:text-secondary-foreground",
//   "dark:hover:opacity-90",

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
//    REGISTER
// ========================================================= */

// export default function Register() {
//   const { register, user } = useAuth();

//   const navigate = useNavigate();
//   const [searchParams] = useSearchParams();

//   const reduceMotion = useReducedMotion();

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

//      If someone is already authenticated and reaches the
//      register page, route them according to their account type.

//      Allocats go through initial professional setup first.
//   ======================================================= */

//   useEffect(() => {
//     if (!user) {
//       return;
//     }

//     navigate(getPostRegisterPath(user.isAllocat, returnTo), {
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

//       /*
//        * New Allocats must complete their professional profile
//        * before entering the normal project flow.
//        *
//        * Clients continue to returnTo or /projects.
//        */
//       navigate(getPostRegisterPath(values.isAllocat, returnTo), {
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
//       {/* ===================================================
//           AUTOFILL
//       =================================================== */}

//       <style>
//         {`
//           .allocatr-auth-input:-webkit-autofill,
//           .allocatr-auth-input:-webkit-autofill:hover,
//           .allocatr-auth-input:-webkit-autofill:focus,
//           .allocatr-auth-input:-webkit-autofill:active {
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

//           .allocatr-auth-input:-moz-autofill {
//             color: var(--foreground) !important;
//             caret-color: var(--foreground) !important;
//             background-color: var(--surface-2) !important;
//             box-shadow:
//               0 0 0 1000px var(--surface-2) inset !important;
//           }

//           .allocatr-auth-input:-webkit-autofill::first-line {
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

//         <div aria-hidden className="pointer-events-none absolute inset-0">
//           <div
//             className={[
//               "absolute inset-x-0 top-0 hidden h-[420px]",
//               "opacity-[0.18]",
//               "sm:block",
//             ].join(" ")}
//             style={{
//               backgroundImage:
//                 "linear-gradient(to right, color-mix(in srgb, var(--border) 45%, transparent) 1px, transparent 1px), linear-gradient(to bottom, color-mix(in srgb, var(--border) 45%, transparent) 1px, transparent 1px)",

//               backgroundSize: "44px 44px",

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
//                 "inline-flex h-9 items-center gap-2 rounded-lg px-2",
//                 "text-[0.68rem] font-medium",
//                 "text-muted-foreground",
//                 "transition-opacity duration-150",
//                 "hover:text-foreground hover:opacity-75",
//               ].join(" ")}
//             >
//               <ArrowLeftIcon size={13} />

//               <span className="hidden sm:inline">Back to website</span>
//             </Link>
//           </div>
//         </header>

//         {/* =================================================
//             REGISTER AREA
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
//             className="w-full max-w-[500px]"
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
//                   "mx-auto flex h-12 w-12 items-center justify-center",
//                   "rounded-xl border",
//                   "border-border/65",
//                   "bg-surface-2/55",
//                   "ring-1 ring-inset ring-border/20",
//                   "transition-opacity duration-150",
//                   "hover:opacity-75",
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
//                 Create your account
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
//                 Join Allocatr.
//               </h1>

//               <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-muted-foreground">
//                 {returnTo
//                   ? "Create your account to continue where you left off."
//                   : "Start projects, find the right capability or offer your own."}
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
//                 onSubmit={form.handleSubmit(handleRegister)}
//                 noValidate
//                 className="space-y-5"
//               >
//                 {/* =========================================
//                     FULL NAME
//                 ========================================= */}

//                 <Controller
//                   name="fullName"
//                   control={form.control}
//                   render={({ field, fieldState }) => {
//                     const invalid = fieldState.invalid;

//                     return (
//                       <Field data-invalid={invalid}>
//                         <FieldLabel
//                           htmlFor="fullName"
//                           className={[
//                             "mb-2 block",
//                             "text-[0.68rem] font-semibold",
//                             "text-foreground/75",
//                           ].join(" ")}
//                         >
//                           Full name
//                         </FieldLabel>

//                         <div className="relative">
//                           <UserIcon
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
//                             id="fullName"
//                             type="text"
//                             autoComplete="name"
//                             placeholder="Your full name"
//                             disabled={isSubmitting}
//                             aria-invalid={invalid}
//                             onChange={(event) => {
//                               field.onChange(event);
//                               clearServerError();
//                             }}
//                             className={[
//                               "allocatr-auth-input",
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
//                     EMAIL
//                 ========================================= */}

//                 <Controller
//                   name="email"
//                   control={form.control}
//                   render={({ field, fieldState }) => {
//                     const invalid = fieldState.invalid;

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
//                               clearServerError();
//                             }}
//                             className={[
//                               "allocatr-auth-input",
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
//                   render={({ field, fieldState }) => {
//                     const invalid = fieldState.invalid;

//                     return (
//                       <Field data-invalid={invalid}>
//                         <div className="mb-2 flex items-center justify-between gap-4">
//                           <FieldLabel
//                             htmlFor="password"
//                             className="text-[0.68rem] font-semibold text-foreground/75"
//                           >
//                             Password
//                           </FieldLabel>

//                           <span className="text-[0.6rem] text-muted-foreground">
//                             8+ characters
//                           </span>
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
//                             type={showPassword ? "text" : "password"}
//                             autoComplete="new-password"
//                             placeholder="Create a password"
//                             disabled={isSubmitting}
//                             aria-invalid={invalid}
//                             onChange={(event) => {
//                               field.onChange(event);
//                               clearServerError();
//                             }}
//                             className={[
//                               "allocatr-auth-input",
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
//                               setShowPassword((current) => !current)
//                             }
//                             disabled={isSubmitting}
//                             className={[
//                               "absolute right-3.5 top-1/2 z-10",
//                               "-translate-y-1/2",
//                               "text-muted-foreground",
//                               "transition-opacity duration-150",
//                               "hover:text-foreground hover:opacity-75",
//                               "focus-visible:outline-none",
//                               "focus-visible:text-foreground",
//                               "disabled:cursor-not-allowed",
//                               "disabled:opacity-50",
//                             ].join(" ")}
//                             aria-label={
//                               showPassword ? "Hide password" : "Show password"
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
//                     ACCOUNT TYPE
//                 ========================================= */}

//                 <Controller
//                   name="isAllocat"
//                   control={form.control}
//                   render={({ field }) => (
//                     <Field>
//                       <div>
//                         <p className="text-[0.68rem] font-semibold text-foreground/75">
//                           How will you use Allocatr?
//                         </p>

//                         <p className="mt-1 text-[0.62rem] leading-5 text-muted-foreground">
//                           Choose how you want to get started.
//                         </p>
//                       </div>

//                       <div className="grid gap-2 sm:grid-cols-2">
//                         <AccountTypeOption
//                           selected={!field.value}
//                           title="Client"
//                           description="I need work done"
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
//                           description="I offer capability"
//                           icon={BriefcaseBusinessIcon}
//                           onClick={() => {
//                             field.onChange(true);
//                             clearServerError();
//                           }}
//                           disabled={isSubmitting}
//                         />
//                       </div>

//                       <p className="text-[0.58rem] leading-5 text-muted-foreground/75">
//                         Allocats can still create their own projects.
//                       </p>
//                     </Field>
//                   )}
//                 />

//                 {/* =========================================
//                     SERVER ERROR
//                 ========================================= */}

//                 {serverError && (
//                   <div
//                     className={[
//                       "rounded-lg border px-3.5 py-3",
//                       "border-destructive/20",
//                       "bg-destructive/[0.045]",
//                       "text-[0.68rem] leading-5",
//                       "text-destructive",
//                     ].join(" ")}
//                   >
//                     {serverError.message}
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
//                     "h-11 w-full rounded-lg",
//                     "text-xs font-semibold",
//                     primaryButton,
//                   ].join(" ")}
//                 >
//                   {isSubmitting ? (
//                     <>
//                       <LoaderCircleIcon size={15} className="animate-spin" />
//                       Creating account
//                     </>
//                   ) : (
//                     <>
//                       Create account
//                       <ArrowRightIcon size={14} />
//                     </>
//                   )}
//                 </Button>

//                 {/* =========================================
//                     LOGIN
//                 ========================================= */}

//                 <p className="text-center text-xs text-muted-foreground">
//                   Already have an account?{" "}
//                   <Link
//                     to={loginUrl}
//                     className={[
//                       "font-semibold",
//                       "text-brand-secondary-highlight",
//                       "transition-opacity",
//                       "hover:opacity-70",
//                       "dark:text-secondary",
//                     ].join(" ")}
//                   >
//                     Sign in
//                   </Link>
//                 </p>
//               </form>
//             </div>

//             {/* =============================================
//                 TERMS
//             ============================================= */}

//             <p className="mx-auto mt-5 max-w-md text-center text-[0.6rem] leading-5 text-muted-foreground/70">
//               By creating an account, you agree to our{" "}
//               <Link
//                 to="/terms"
//                 className="underline underline-offset-2 transition-opacity hover:opacity-70"
//               >
//                 Terms
//               </Link>{" "}
//               and{" "}
//               <Link
//                 to="/privacy"
//                 className="underline underline-offset-2 transition-opacity hover:opacity-70"
//               >
//                 Privacy Policy
//               </Link>
//               .
//             </p>

//             <div className="mt-4 flex items-center justify-center gap-2 text-[0.58rem] text-muted-foreground/65">
//               <LockKeyholeIcon size={10} />
//               Secure Allocatr registration
//             </div>
//           </motion.div>
//         </section>

//         {/* =================================================
//             FOOTER
//         ================================================= */}

//         <footer className="relative z-20 border-t border-border/50 px-4 py-5 sm:px-6 md:px-8">
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
//    ACCOUNT TYPE
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
//   icon: ComponentType<{
//     size?: number;
//     className?: string;
//   }>;
//   onClick: () => void;
//   disabled: boolean;
// }) {
//   return (
//     <button
//       type="button"
//       onClick={onClick}
//       disabled={disabled}
//       aria-pressed={selected}
//       className={[
//         "group relative flex min-h-[68px] items-center gap-3",
//         "rounded-xl border px-3.5 py-3",
//         "text-left",
//         "transition-[background-color,border-color,color] duration-200",
//         "focus-visible:outline-none",
//         "focus-visible:ring-2",
//         "focus-visible:ring-brand-secondary-highlight/15",
//         "disabled:cursor-not-allowed",
//         "disabled:opacity-50",

//         selected
//           ? [
//               "border-brand-secondary-highlight/25",
//               "bg-brand-secondary-highlight/[0.07]",
//               "text-foreground",
//               "dark:border-secondary/15",
//               "dark:bg-secondary/[0.055]",
//               "dark:focus-visible:ring-secondary/15",
//             ].join(" ")
//           : [
//               "border-border/60",
//               "bg-surface-2/25",
//               "text-foreground/70",
//               "hover:border-border/85",
//               "hover:bg-surface-3/45",
//               "hover:text-foreground",
//               "dark:border-border",
//               "dark:bg-surface-2/45",
//               "dark:hover:bg-surface-3/60",
//             ].join(" "),
//       ].join(" ")}
//     >
//       <span
//         className={[
//           "flex h-8 w-8 shrink-0 items-center justify-center",
//           "rounded-lg",
//           "transition-colors",

//           selected
//             ? [
//                 "bg-brand-secondary-highlight/[0.10]",
//                 "text-brand-secondary-highlight",
//                 "dark:bg-secondary/[0.10]",
//                 "dark:text-secondary",
//               ].join(" ")
//             : [
//                 "bg-surface-3/70",
//                 "text-muted-foreground",
//                 "dark:bg-surface-2",
//               ].join(" "),
//         ].join(" ")}
//       >
//         <Icon size={14} />
//       </span>

//       <span className="min-w-0 flex-1">
//         <span className="flex items-center gap-1.5">
//           <span className="text-xs font-semibold">{title}</span>

//           {selected && (
//             <span
//               className={[
//                 "flex h-4 w-4 items-center justify-center",
//                 "rounded-full",
//                 "bg-brand-secondary-highlight",
//                 "text-primary-foreground",
//                 "dark:bg-secondary",
//                 "dark:text-secondary-foreground",
//               ].join(" ")}
//             >
//               <CheckIcon size={9} strokeWidth={3} />
//             </span>
//           )}
//         </span>

//         <span className="mt-0.5 block text-[0.52rem] leading-4 text-muted-foreground">
//           {description}
//         </span>
//       </span>
//     </button>
//   );
// }

// /* =========================================================
//    POST REGISTER PATH
// ========================================================= */

// function getPostRegisterPath(isAllocat: boolean, returnTo: string | null) {
//   if (isAllocat) {
//     return "/allocats/profile/create";
//   }

//   return returnTo || "/projects";
// }

// /* =========================================================
//    RETURN PATH
// ========================================================= */

// function getSafeReturnTo(value: string | null): string | null {
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
//    REGISTER ERROR
// ========================================================= */

// function getRegisterErrorMessage(error: unknown): string {
//   const fallback =
//     "We couldn’t create your account. Check your details and try again.";

//   if (typeof error !== "object" || error === null || !("response" in error)) {
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

//   const backendMessage = response?.data?.message?.trim();

//   if (!backendMessage) {
//     return fallback;
//   }

//   const normalizedMessage = backendMessage.toLowerCase();

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

import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowRightIcon,
  BriefcaseBusinessIcon,
  EyeIcon,
  EyeOffIcon,
  LoaderCircleIcon,
  LockKeyholeIcon,
  MailIcon,
  UserIcon,
  type LucideIcon,
} from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm, type Control } from "react-hook-form";
import * as z from "zod";

import { useAuth } from "@/auth/useAuth";
import allocatrLogoLight from "@/assets/allocatr-neg-light.svg";
import allocatrLogoDark from "@/assets/allocatr-dark-02.svg";

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

const inputBase =
  "allocatr-register-input h-12 w-full min-w-0 rounded-lg border bg-surface-2 pl-10 pr-4 text-base text-foreground outline-none placeholder:text-muted-foreground/65 transition-[border-color,box-shadow] duration-150 disabled:cursor-wait disabled:opacity-60 motion-reduce:transition-none sm:text-sm";
const inputNormal =
  "border-input hover:border-ring/45 focus-visible:border-ring/65 focus-visible:ring-2 focus-visible:ring-ring/15 dark:focus-visible:border-secondary/45 dark:focus-visible:ring-secondary/15";
const inputInvalid =
  "border-[var(--register-error)] focus-visible:border-[var(--register-error)] focus-visible:ring-2 focus-visible:ring-[color-mix(in_srgb,var(--register-error)_15%,transparent)]";
const accentLink =
  "rounded-sm font-medium text-brand-secondary-highlight transition-opacity duration-150 hover:opacity-75 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40 dark:text-secondary motion-reduce:transition-none";
const primaryButton =
  "inline-flex h-12 w-full items-center justify-center gap-2.5 rounded-lg border border-brand-secondary-highlight/20 bg-brand-secondary-highlight px-4 text-sm font-medium text-primary-foreground shadow-none transition-opacity duration-150 hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/45 focus-visible:ring-offset-2 focus-visible:ring-offset-card disabled:cursor-wait disabled:opacity-65 dark:border-secondary/20 dark:bg-secondary dark:text-secondary-foreground dark:focus-visible:ring-secondary/40 motion-reduce:transition-none";

const AUTOFILL_CSS = `
.allocatr-register-page .allocatr-register-input:-webkit-autofill,
.allocatr-register-page .allocatr-register-input:-webkit-autofill:hover,
.allocatr-register-page .allocatr-register-input:-webkit-autofill:focus,
.allocatr-register-page .allocatr-register-input:-webkit-autofill:active {
  -webkit-text-fill-color: var(--foreground) !important;
  caret-color: var(--foreground) !important;
  -webkit-box-shadow: 0 0 0 1000px var(--surface-2) inset !important;
  box-shadow: 0 0 0 1000px var(--surface-2) inset !important;
}
.allocatr-register-page .allocatr-register-input:-moz-autofill {
  color: var(--foreground) !important;
  caret-color: var(--foreground) !important;
  background-color: var(--surface-2) !important;
  box-shadow: 0 0 0 1000px var(--surface-2) inset !important;
}
`;

export default function Register() {
  const { register, user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const reducedMotion = useReducedMotion();
  const [showPassword, setShowPassword] = useState(false);
  const returnTo = getSafeReturnTo(searchParams.get("returnTo"));
  const loginUrl = returnTo
    ? `/login?returnTo=${encodeURIComponent(returnTo)}`
    : "/login";
  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    mode: "onBlur",
    reValidateMode: "onChange",
    defaultValues: { fullName: "", email: "", password: "", isAllocat: false },
  });
  const { isSubmitting } = form.formState;
  const serverError = form.formState.errors.root?.server;
  const isAllocat = form.watch("isAllocat");

  useEffect(() => {
    if (user)
      navigate(getPostRegisterPath(user.isAllocat, returnTo), {
        replace: true,
      });
  }, [user, returnTo, navigate]);
  function clearServerError() {
    if (form.formState.errors.root?.server) form.clearErrors("root.server");
  }
  async function handleRegister(values: RegisterFormValues) {
    form.clearErrors("root.server");
    try {
      await register(
        values.fullName.trim(),
        values.email.trim(),
        values.password,
        values.isAllocat,
      );
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
    <main className="allocatr-register-page [--register-error:var(--destructive)] dark:[--register-error:color-mix(in_srgb,var(--destructive)_52%,white)] relative isolate flex min-h-[100svh] flex-col overflow-x-clip bg-background text-foreground">
      <style>{AUTOFILL_CSS}</style>
      <header className="relative z-10 shrink-0">
        <div className="mx-auto flex h-16 w-full max-w-[1440px] items-center px-5 sm:px-8 lg:px-14">
          <Link
            to="/"
            aria-label="Allocatr home"
            className="rounded-md transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
          >
            <img
              src={allocatrLogoDark}
              alt="Allocatr"
              className="h-6 w-auto object-contain dark:hidden"
            />
            <img
              src={allocatrLogoLight}
              alt="Allocatr"
              className="hidden h-6 w-auto object-contain dark:block"
            />
          </Link>
        </div>
      </header>

      <section
        aria-label="Create an Allocatr account"
        className="relative z-10 flex flex-1 items-center justify-center px-4 py-7 sm:px-8 sm:py-10"
      >
        <div className="mx-auto w-full max-w-[480px]">
          <motion.div
            initial={reducedMotion ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: reducedMotion ? 0 : 0.45,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="w-full max-w-[480px] rounded-2xl border border-border bg-card px-5 py-7 shadow-none sm:px-7 sm:py-8"
          >
            <div className="mb-6 text-center">
              <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-brand-secondary-highlight dark:text-secondary">
                Your Allocatr workspace
              </p>
              <h1 className="mt-3 text-[1.7rem] font-medium leading-tight tracking-[-0.035em]">
                Join Allocatr.
              </h1>
              <p className="mx-auto mt-2 max-w-xs text-xs leading-6 text-muted-foreground">
                {returnTo
                  ? "Create your account to continue where you left off."
                  : "Start projects. Find capability. Put your skills to work."}
              </p>
            </div>

            <form
              onSubmit={form.handleSubmit(handleRegister)}
              noValidate
              aria-busy={isSubmitting}
              className="space-y-5"
            >
              <RegisterTextField
                name="fullName"
                label="Full name"
                placeholder="Your full name"
                icon={UserIcon}
                control={form.control}
                disabled={isSubmitting}
                onEdited={clearServerError}
              />
              <RegisterTextField
                name="email"
                label="Email address"
                placeholder="you@example.com"
                icon={MailIcon}
                control={form.control}
                disabled={isSubmitting}
                onEdited={clearServerError}
              />
              <Controller
                name="password"
                control={form.control}
                render={({ field, fieldState }) => (
                  <div>
                    <div className="mb-2 flex items-center justify-between gap-3">
                      <label
                        htmlFor="register-password"
                        className="text-xs font-medium"
                      >
                        Password
                      </label>
                      <span
                        id="register-password-hint"
                        className="text-[11px] text-muted-foreground"
                      >
                        8+ characters
                      </span>
                    </div>
                    <div className="relative">
                      <LockKeyholeIcon
                        size={16}
                        aria-hidden="true"
                        className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
                      />
                      <input
                        {...field}
                        id="register-password"
                        type={showPassword ? "text" : "password"}
                        autoComplete="new-password"
                        placeholder="Create a password"
                        disabled={isSubmitting}
                        aria-invalid={fieldState.invalid}
                        aria-describedby={`register-password-hint${fieldState.error ? " register-password-error" : ""}`}
                        onChange={(event) => {
                          field.onChange(event);
                          clearServerError();
                        }}
                        className={`${inputBase} pr-12 ${fieldState.invalid ? inputInvalid : inputNormal}`}
                      />
                      <button
                        type="button"
                        disabled={isSubmitting}
                        onClick={() => setShowPassword((value) => !value)}
                        aria-label={
                          showPassword ? "Hide password" : "Show password"
                        }
                        aria-pressed={showPassword}
                        aria-controls="register-password"
                        className="absolute inset-y-0 right-0 flex w-11 items-center justify-center rounded-r-lg text-muted-foreground transition-opacity hover:text-foreground hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring/40 disabled:opacity-50"
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
                        id="register-password-error"
                        className="mt-2 text-xs leading-5 text-[var(--register-error)]"
                      >
                        {fieldState.error.message}
                      </p>
                    )}
                  </div>
                )}
              />

              <Controller
                name="isAllocat"
                control={form.control}
                render={({ field }) => (
                  <fieldset
                    aria-describedby="register-account-hint"
                    disabled={isSubmitting}
                    className="min-w-0 border-0 p-0"
                  >
                    <legend className="p-0 text-xs font-medium">
                      How will you use Allocatr?
                    </legend>
                    <div className="mt-3 grid min-w-0 grid-cols-2 items-stretch gap-3">
                      <AccountTypeOption
                        value="client"
                        selected={!field.value}
                        title="Client"
                        description="I need work done"
                        icon={UserIcon}
                        inputRef={field.ref}
                        onBlur={field.onBlur}
                        disabled={isSubmitting}
                        onChange={() => {
                          field.onChange(false);
                          clearServerError();
                        }}
                      />
                      <AccountTypeOption
                        value="allocat"
                        selected={field.value}
                        title="Allocat"
                        description="I offer capability"
                        icon={BriefcaseBusinessIcon}
                        onBlur={field.onBlur}
                        disabled={isSubmitting}
                        onChange={() => {
                          field.onChange(true);
                          clearServerError();
                        }}
                      />
                    </div>
                    <p
                      id="register-account-hint"
                      aria-live="polite"
                      className="mt-3 block text-[11px] leading-5 text-muted-foreground"
                    >
                      {isAllocat
                        ? "Next, complete your professional profile. You can also create projects."
                        : "Find skilled people and manage your projects."}
                    </p>
                  </fieldset>
                )}
              />

              {serverError && (
                <div
                  role="alert"
                  id="register-server-error"
                  className="rounded-lg border border-[color-mix(in_srgb,var(--register-error)_30%,transparent)] bg-[color-mix(in_srgb,var(--register-error)_6%,transparent)] px-3.5 py-3 text-xs leading-6 text-foreground"
                >
                  {serverError.message}
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className={primaryButton}
              >
                {isSubmitting ? (
                  <>
                    <LoaderCircleIcon
                      size={16}
                      aria-hidden="true"
                      className="animate-spin motion-reduce:animate-none"
                    />
                    Creating account…
                  </>
                ) : (
                  <>
                    Create account
                    <ArrowRightIcon
                      size={16}
                      aria-hidden="true"
                      className="text-inherit"
                    />
                  </>
                )}
              </button>
              <p className="text-center text-xs leading-6 text-muted-foreground">
                Already have an account?{" "}
                <Link to={loginUrl} className={`${accentLink} ml-1`}>
                  Sign in
                </Link>
              </p>
            </form>

            <div className="mt-5 border-t border-border/60 pt-4 text-center">
              <p className="text-[11px] leading-6 text-muted-foreground">
                By creating an account, you agree to our{" "}
                <Link to="/terms" className={accentLink}>
                  Terms
                </Link>{" "}
                and{" "}
                <Link to="/privacy" className={accentLink}>
                  Privacy Policy
                </Link>
                .
              </p>
              <p className="mt-3 flex items-center justify-center gap-1.5 text-[10px] text-muted-foreground">
                <LockKeyholeIcon size={11} aria-hidden="true" />
                Secure Allocatr registration
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      <footer className="relative z-10 shrink-0 border-t border-border/40 px-5 py-4 sm:px-8 lg:px-14">
        <div className="mx-auto flex w-full max-w-[1328px] flex-wrap items-center justify-between gap-x-5 gap-y-2 text-[10px] leading-5 text-muted-foreground">
          <p>© {new Date().getFullYear()} Allocatr</p>
          <p className="hidden sm:block">Work, properly allocated.</p>
        </div>
      </footer>
    </main>
  );
}

function RegisterTextField({
  name,
  label,
  placeholder,
  icon: Icon,
  control,
  disabled,
  onEdited,
}: {
  name: "fullName" | "email";
  label: string;
  placeholder: string;
  icon: LucideIcon;
  control: Control<RegisterFormValues>;
  disabled: boolean;
  onEdited: () => void;
}) {
  const id = `register-${name}`;
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <div>
          <label htmlFor={id} className="mb-2 block text-xs font-medium">
            {label}
          </label>
          <div className="relative">
            <Icon
              size={16}
              aria-hidden="true"
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <input
              {...field}
              id={id}
              type={name === "email" ? "email" : "text"}
              autoComplete={name === "email" ? "email" : "name"}
              inputMode={name === "email" ? "email" : "text"}
              autoCapitalize={name === "email" ? "none" : "words"}
              spellCheck={false}
              placeholder={placeholder}
              disabled={disabled}
              aria-invalid={fieldState.invalid}
              aria-describedby={fieldState.error ? `${id}-error` : undefined}
              onChange={(event) => {
                field.onChange(event);
                onEdited();
              }}
              className={`${inputBase} ${fieldState.invalid ? inputInvalid : inputNormal}`}
            />
          </div>
          {fieldState.error && (
            <p
              id={`${id}-error`}
              className="mt-2 text-xs leading-5 text-[var(--register-error)]"
            >
              {fieldState.error.message}
            </p>
          )}
        </div>
      )}
    />
  );
}

function AccountTypeOption({
  value,
  selected,
  title,
  description,
  icon: Icon,
  inputRef,
  onBlur,
  disabled,
  onChange,
}: {
  value: "client" | "allocat";
  selected: boolean;
  title: string;
  description: string;
  icon: LucideIcon;
  inputRef?: (element: HTMLInputElement | null) => void;
  onBlur: () => void;
  disabled: boolean;
  onChange: () => void;
}) {
  const reducedMotion = useReducedMotion();
  const accent = "text-brand-secondary-highlight dark:text-secondary";
  return (
    <label
      className={`relative grid min-h-[76px] min-w-0 items-center rounded-lg border border-border px-3 py-3 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring/40 has-[:focus-visible]:ring-offset-2 has-[:focus-visible]:ring-offset-card ${disabled ? "cursor-wait opacity-60" : "cursor-pointer"} ${selected ? "bg-surface-1" : "bg-surface-2"}`}
    >
      <input
        ref={inputRef}
        type="radio"
        name="isAllocat"
        value={value}
        checked={selected}
        disabled={disabled}
        onChange={onChange}
        onBlur={onBlur}
        className="sr-only"
      />
      <span className="grid min-w-0 grid-cols-[minmax(0,1fr)_18px] items-center gap-2 sm:grid-cols-[18px_minmax(0,1fr)_18px] sm:gap-3">
        <Icon
          size={18}
          strokeWidth={1.8}
          aria-hidden="true"
          className={`hidden shrink-0 sm:block ${selected ? accent : "text-muted-foreground"}`}
        />
        <span className="min-w-0">
          <span className="block text-xs font-medium leading-5 text-foreground">
            {title}
          </span>
          <span className="mt-1 block text-[11px] leading-5 text-muted-foreground">
            {description}
          </span>
        </span>
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="none"
          className={`h-[18px] w-[18px] shrink-0 ${accent}`}
        >
          <motion.path
            d="M5 12.5 9.5 17 19 7"
            stroke="currentColor"
            strokeWidth={2.3}
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={false}
            animate={{
              pathLength: selected ? 1 : 0,
              opacity: selected ? 1 : 0,
            }}
            transition={{
              duration: reducedMotion ? 0 : selected ? 0.25 : 0.12,
              ease: "easeOut",
            }}
          />
        </svg>
      </span>
    </label>
  );
}

function getPostRegisterPath(isAllocat: boolean, returnTo: string | null) {
  return isAllocat ? "/allocats/profile/create" : returnTo || "/projects";
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
function getRegisterErrorMessage(error: unknown): string {
  const fallback =
    "We couldn’t create your account. Check your details and try again.";
  if (typeof error !== "object" || error === null || !("response" in error))
    return fallback;
  const response = (error as { response?: { data?: { message?: unknown } } })
    .response;
  const message =
    typeof response?.data?.message === "string"
      ? response.data.message.trim()
      : "";
  if (!message) return fallback;
  if (
    [
      "duplicate email",
      "email already",
      "already registered",
      "already exists",
    ].some((term) => message.toLowerCase().includes(term))
  ) {
    return "An account with that email may already exist. Try signing in instead.";
  }
  return message;
}
