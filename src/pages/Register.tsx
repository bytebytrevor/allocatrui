import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRightIcon, BriefcaseBusinessIcon, EyeIcon, EyeOffIcon, LoaderCircleIcon, LockKeyholeIcon, MailIcon, UserIcon, type LucideIcon } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm, type Control } from "react-hook-form";
import * as z from "zod";

import { useAuth } from "@/auth/useAuth";
import { nextAccountPath, rememberReturnTo, safeReturnTo } from "@/auth/onboarding";
import allocatrLogoLight from "@/assets/allocatr-neg-light.svg";
import allocatrLogoDark from "@/assets/allocatr-dark-02.svg";

const registerSchema = z.object({
  fullName: z.string().trim().min(1, "Full name is required.").min(2, "Enter at least 2 characters.").max(100, "Keep your name below 100 characters."),
  email: z.string().trim().min(1, "Email address is required.").email("Enter a valid email address."),
  password: z.string().min(1, "Password is required.").min(8, "Password must be at least 8 characters."),
  isAllocat: z.boolean(),
});
type RegisterFormValues = z.infer<typeof registerSchema>;

const inputBase = "allocatr-register-input h-12 w-full min-w-0 rounded-lg border bg-surface-2 pl-10 pr-4 text-base text-foreground outline-none placeholder:text-muted-foreground/65 transition-[border-color,box-shadow] duration-150 disabled:cursor-wait disabled:opacity-60 motion-reduce:transition-none sm:text-sm";
const inputNormal = "border-input hover:border-ring/45 focus-visible:border-ring/65 focus-visible:ring-2 focus-visible:ring-ring/15 dark:focus-visible:border-secondary/45 dark:focus-visible:ring-secondary/15";
const inputInvalid = "border-[var(--register-error)] focus-visible:border-[var(--register-error)] focus-visible:ring-2 focus-visible:ring-[color-mix(in_srgb,var(--register-error)_15%,transparent)]";
const accentLink = "rounded-sm font-medium text-brand-secondary-highlight transition-opacity duration-150 hover:opacity-75 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40 dark:text-secondary motion-reduce:transition-none";
const primaryButton = "inline-flex h-12 w-full items-center justify-center gap-2.5 rounded-lg border border-brand-secondary-highlight/20 bg-brand-secondary-highlight px-4 text-sm font-medium text-primary-foreground shadow-none transition-opacity duration-150 hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/45 focus-visible:ring-offset-2 focus-visible:ring-offset-card disabled:cursor-wait disabled:opacity-65 dark:border-secondary/20 dark:bg-secondary dark:text-secondary-foreground dark:focus-visible:ring-secondary/40 motion-reduce:transition-none";

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
  const returnTo = safeReturnTo(searchParams.get("returnTo"));
  const loginUrl = returnTo ? `/login?returnTo=${encodeURIComponent(returnTo)}` : "/login";
  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema), mode: "onBlur", reValidateMode: "onChange",
    defaultValues: { fullName: "", email: "", password: "", isAllocat: false },
  });
  const { isSubmitting } = form.formState;
  const serverError = form.formState.errors.root?.server;
  const isAllocat = form.watch("isAllocat");

  useEffect(() => {
    if (user) {
      rememberReturnTo(user.userId, returnTo);
      navigate(nextAccountPath(user, returnTo), { replace: true });
    }
  }, [user, returnTo, navigate]);
  function clearServerError() {
    if (form.formState.errors.root?.server) form.clearErrors("root.server");
  }
  async function handleRegister(values: RegisterFormValues) {
    form.clearErrors("root.server");
    try {
      const current = await register(values.fullName.trim(), values.email.trim(), values.password, values.isAllocat);
      rememberReturnTo(current.userId, returnTo);
      navigate(nextAccountPath(current, returnTo), { replace: true });
    } catch (error: unknown) {
      form.setError("root.server", { type: "server", message: error instanceof Error && !("response" in error) ? error.message : getRegisterErrorMessage(error) });
    }
  }

  return (
    <main className="allocatr-register-page [--register-error:var(--destructive)] dark:[--register-error:color-mix(in_srgb,var(--destructive)_52%,white)] relative isolate flex min-h-[100svh] flex-col overflow-x-clip bg-background text-foreground">
      <style>{AUTOFILL_CSS}</style>
      <header className="relative z-10 shrink-0">
        <div className="mx-auto flex h-16 w-full max-w-[1440px] items-center px-5 sm:px-8 lg:px-14">
          <Link to="/" aria-label="Allocatr home" className="rounded-md transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40">
            <img src={allocatrLogoDark} alt="Allocatr" className="h-6 w-auto object-contain dark:hidden" />
            <img src={allocatrLogoLight} alt="Allocatr" className="hidden h-6 w-auto object-contain dark:block" />
          </Link>
        </div>
      </header>

      <section aria-label="Create an Allocatr account" className="relative z-10 flex flex-1 items-center justify-center px-4 py-7 sm:px-8 sm:py-10">
        <div className="mx-auto w-full max-w-[480px]">
          <motion.div initial={reducedMotion ? false : { opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reducedMotion ? 0 : 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="w-full max-w-[480px] rounded-2xl border border-border bg-card px-5 py-7 shadow-none sm:px-7 sm:py-8">
            <div className="mb-6 text-center">
              <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-brand-secondary-highlight dark:text-secondary">Your Allocatr workspace</p>
              <h1 className="mt-3 text-[1.7rem] font-medium leading-tight tracking-[-0.035em]">Join Allocatr.</h1>
              <p className="mx-auto mt-2 max-w-xs text-xs leading-6 text-muted-foreground">{returnTo ? "Create your account to continue where you left off." : "Start projects. Find capability. Put your skills to work."}</p>
            </div>

            <form onSubmit={form.handleSubmit(handleRegister)} noValidate aria-busy={isSubmitting} className="space-y-5">
              <RegisterTextField name="fullName" label="Full name" placeholder="Your full name" icon={UserIcon}
                control={form.control} disabled={isSubmitting} onEdited={clearServerError} />
              <RegisterTextField name="email" label="Email address" placeholder="you@example.com" icon={MailIcon}
                control={form.control} disabled={isSubmitting} onEdited={clearServerError} />
              <Controller name="password" control={form.control} render={({ field, fieldState }) => <div>
                <div className="mb-2 flex items-center justify-between gap-3">
                  <label htmlFor="register-password" className="text-xs font-medium">Password</label>
                  <span id="register-password-hint" className="text-[11px] text-muted-foreground">8+ characters</span>
                </div>
                <div className="relative">
                  <LockKeyholeIcon size={16} aria-hidden="true" className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input {...field} id="register-password" type={showPassword ? "text" : "password"} autoComplete="new-password"
                    placeholder="Create a password" disabled={isSubmitting} aria-invalid={fieldState.invalid}
                    aria-describedby={`register-password-hint${fieldState.error ? " register-password-error" : ""}`}
                    onChange={event => { field.onChange(event); clearServerError(); }}
                    className={`${inputBase} pr-12 ${fieldState.invalid ? inputInvalid : inputNormal}`} />
                  <button type="button" disabled={isSubmitting} onClick={() => setShowPassword(value => !value)}
                    aria-label={showPassword ? "Hide password" : "Show password"} aria-pressed={showPassword} aria-controls="register-password"
                    className="absolute inset-y-0 right-0 flex w-11 items-center justify-center rounded-r-lg text-muted-foreground transition-opacity hover:text-foreground hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring/40 disabled:opacity-50">
                    {showPassword ? <EyeOffIcon size={16} aria-hidden="true" /> : <EyeIcon size={16} aria-hidden="true" />}
                  </button>
                </div>
                {fieldState.error && <p id="register-password-error" className="mt-2 text-xs leading-5 text-[var(--register-error)]">{fieldState.error.message}</p>}
              </div>} />

              <Controller name="isAllocat" control={form.control} render={({ field }) => (
                <fieldset aria-describedby="register-account-hint" disabled={isSubmitting} className="min-w-0 border-0 p-0">
                  <legend className="p-0 text-xs font-medium">How will you use Allocatr?</legend>
                  <div className="mt-3 grid min-w-0 grid-cols-2 items-stretch gap-3">
                    <AccountTypeOption value="client" selected={!field.value} title="Client" description="I need work done" icon={UserIcon}
                      inputRef={field.ref} onBlur={field.onBlur} disabled={isSubmitting} onChange={() => { field.onChange(false); clearServerError(); }} />
                    <AccountTypeOption value="allocat" selected={field.value} title="Allocat" description="I offer capability" icon={BriefcaseBusinessIcon}
                      onBlur={field.onBlur} disabled={isSubmitting} onChange={() => { field.onChange(true); clearServerError(); }} />
                  </div>
                  <p id="register-account-hint" aria-live="polite" className="mt-3 block text-[11px] leading-5 text-muted-foreground">{isAllocat ? "First, verify your email. Then complete your professional profile." : "Verify your email, then find skilled people and manage your projects."}</p>
                </fieldset>
              )} />

              {serverError && <div role="alert" id="register-server-error" className="rounded-lg border border-[color-mix(in_srgb,var(--register-error)_30%,transparent)] bg-[color-mix(in_srgb,var(--register-error)_6%,transparent)] px-3.5 py-3 text-xs leading-6 text-foreground">{serverError.message}</div>}

              <button type="submit" disabled={isSubmitting} className={primaryButton}>
                {isSubmitting ? <><LoaderCircleIcon size={16} aria-hidden="true" className="animate-spin motion-reduce:animate-none" />Creating account…</> : <>Create account<ArrowRightIcon size={16} aria-hidden="true" className="text-inherit" /></>}
              </button>
              <p className="text-center text-xs leading-6 text-muted-foreground">Already have an account? <Link to={loginUrl} className={`${accentLink} ml-1`}>Sign in</Link></p>
            </form>

            <div className="mt-5 border-t border-border/60 pt-4 text-center">
              <p className="text-[11px] leading-6 text-muted-foreground">By creating an account, you agree to our <Link to="/terms" className={accentLink}>Terms</Link> and <Link to="/privacy" className={accentLink}>Privacy Policy</Link>.</p>
              <p className="mt-3 flex items-center justify-center gap-1.5 text-[10px] text-muted-foreground"><LockKeyholeIcon size={11} aria-hidden="true" />Secure Allocatr registration</p>
            </div>
          </motion.div>
        </div>
      </section>

      <footer className="relative z-10 shrink-0 border-t border-border/40 px-5 py-4 sm:px-8 lg:px-14">
        <div className="mx-auto flex w-full max-w-[1328px] flex-wrap items-center justify-between gap-x-5 gap-y-2 text-[10px] leading-5 text-muted-foreground">
          <p>© {new Date().getFullYear()} Allocatr</p><p className="hidden sm:block">Work, properly allocated.</p>
        </div>
      </footer>
    </main>
  );
}

function RegisterTextField({ name, label, placeholder, icon: Icon, control, disabled, onEdited }: {
  name: "fullName" | "email"; label: string; placeholder: string; icon: LucideIcon;
  control: Control<RegisterFormValues>; disabled: boolean; onEdited: () => void;
}) {
  const id = `register-${name}`;
  return <Controller name={name} control={control} render={({ field, fieldState }) => <div>
    <label htmlFor={id} className="mb-2 block text-xs font-medium">{label}</label>
    <div className="relative">
      <Icon size={16} aria-hidden="true" className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
      <input {...field} id={id} type={name === "email" ? "email" : "text"} autoComplete={name === "email" ? "email" : "name"}
        inputMode={name === "email" ? "email" : "text"} autoCapitalize={name === "email" ? "none" : "words"} spellCheck={false}
        placeholder={placeholder} disabled={disabled} aria-invalid={fieldState.invalid} aria-describedby={fieldState.error ? `${id}-error` : undefined}
        onChange={event => { field.onChange(event); onEdited(); }} className={`${inputBase} ${fieldState.invalid ? inputInvalid : inputNormal}`} />
    </div>
    {fieldState.error && <p id={`${id}-error`} className="mt-2 text-xs leading-5 text-[var(--register-error)]">{fieldState.error.message}</p>}
  </div>} />;
}

function AccountTypeOption({ value, selected, title, description, icon: Icon, inputRef, onBlur, disabled, onChange }: {
  value: "client" | "allocat"; selected: boolean; title: string; description: string; icon: LucideIcon;
  inputRef?: (element: HTMLInputElement | null) => void; onBlur: () => void; disabled: boolean; onChange: () => void;
}) {
  const reducedMotion = useReducedMotion();
  const accent = "text-brand-secondary-highlight dark:text-secondary";
  return <label className={`relative grid min-h-[76px] min-w-0 items-center rounded-lg border border-border px-3 py-3 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring/40 has-[:focus-visible]:ring-offset-2 has-[:focus-visible]:ring-offset-card ${disabled ? "cursor-wait opacity-60" : "cursor-pointer"} ${selected ? "bg-surface-1" : "bg-surface-2"}`}>
    <input ref={inputRef} type="radio" name="isAllocat" value={value} checked={selected} disabled={disabled}
      onChange={onChange} onBlur={onBlur} className="sr-only" />
    <span className="grid min-w-0 grid-cols-[minmax(0,1fr)_18px] items-center gap-2 sm:grid-cols-[18px_minmax(0,1fr)_18px] sm:gap-3">
      <Icon size={18} strokeWidth={1.8} aria-hidden="true" className={`hidden shrink-0 sm:block ${selected ? accent : "text-muted-foreground"}`} />
      <span className="min-w-0"><span className="block text-xs font-medium leading-5 text-foreground">{title}</span>
        <span className="mt-1 block text-[11px] leading-5 text-muted-foreground">{description}</span>
      </span>
      <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className={`h-[18px] w-[18px] shrink-0 ${accent}`}>
        <motion.path d="M5 12.5 9.5 17 19 7" stroke="currentColor" strokeWidth={2.3} strokeLinecap="round" strokeLinejoin="round"
          initial={false} animate={{ pathLength: selected ? 1 : 0, opacity: selected ? 1 : 0 }}
          transition={{ duration: reducedMotion ? 0 : selected ? 0.25 : 0.12, ease: "easeOut" }} />
      </svg>
    </span>
  </label>;
}

function getRegisterErrorMessage(error: unknown): string {
  const fallback = "We couldn’t create your account. Check your details and try again.";
  if (typeof error !== "object" || error === null || !("response" in error)) return fallback;
  const response = (error as { response?: { data?: { message?: unknown } } }).response;
  const message = typeof response?.data?.message === "string" ? response.data.message.trim() : "";
  if (!message) return fallback;
  if (["duplicate email", "email already", "already registered", "already exists"].some(term => message.toLowerCase().includes(term))) {
    return "An account with that email may already exist. Try signing in instead.";
  }
  return message;
}
