import { useState, type CSSProperties, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import logo from "@/assets/allocatr-neg-light.svg";
const LOGIN_CAT_IMAGE =
  "https://images.pexels.com/photos/730896/pexels-photo-730896.jpeg?auto=compress&cs=tinysrgb&w=2400";
const RECOVERY_TOKENS = {
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

export const recoveryInput =
  "allocatr-recovery-input h-12 w-full min-w-0 rounded-lg border border-border bg-surface-2 px-3 text-base text-foreground outline-none placeholder:text-muted-foreground/60 focus-visible:border-brand-primary/55 focus-visible:ring-2 focus-visible:ring-brand-primary/15 disabled:opacity-60 sm:text-sm";
export const recoveryButton =
  "inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-brand-primary px-4 py-3 text-sm font-medium !text-[var(--brand-charcoal)] hover:!text-[var(--brand-charcoal)] focus-visible:!text-[var(--brand-charcoal)] disabled:!text-[var(--brand-charcoal)] transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary/40 disabled:opacity-50";
export const recoveryLink =
  "rounded text-xs leading-6 text-brand-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary/40";
const AUTOFILL_CSS = `
.allocatr-password-recovery .allocatr-recovery-input:-webkit-autofill,
.allocatr-password-recovery .allocatr-recovery-input:-webkit-autofill:hover,
.allocatr-password-recovery .allocatr-recovery-input:-webkit-autofill:focus,
.allocatr-password-recovery .allocatr-recovery-input:-webkit-autofill:active {
  -webkit-text-fill-color: var(--foreground) !important;
  caret-color: var(--foreground) !important;
  -webkit-box-shadow: 0 0 0 1000px var(--surface-2) inset !important;
  box-shadow: 0 0 0 1000px var(--surface-2) inset !important;
}
.allocatr-password-recovery .allocatr-recovery-input:-moz-autofill {
  color: var(--foreground) !important;
  caret-color: var(--foreground) !important;
  background-color: var(--surface-2) !important;
  box-shadow: 0 0 0 1000px var(--surface-2) inset !important;
}
`;

export default function PasswordRecoveryLayout({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <main
      className="allocatr-password-recovery relative isolate flex min-h-svh flex-col overflow-hidden bg-background text-foreground"
      style={RECOVERY_TOKENS}
    >
      <style>{AUTOFILL_CSS}</style>
      <LoginAtmosphere />
      <header className="relative z-10 mx-auto flex h-16 w-full max-w-[1440px] shrink-0 items-center px-5 sm:px-8 lg:px-14">
        <Link to="/" aria-label="Allocatr home" className={recoveryLink}>
          <img src={logo} alt="Allocatr" className="h-6 w-auto" />
        </Link>
      </header>
      <div className="relative z-10 flex flex-1 items-center px-4 py-10 sm:px-8">
        <div className="mx-auto grid w-full max-w-[1200px] items-center gap-10 lg:grid-cols-[minmax(0,1fr)_440px] lg:gap-16">
          <div className="hidden max-w-sm lg:block">
            <p className="mb-4 text-[10px] uppercase tracking-[0.16em] text-brand-primary">
              Work, better allocated
            </p>
            <h2 className="text-4xl font-medium leading-tight tracking-[-0.035em]">
              Back to your people.
              <br />
              Back to good work.
            </h2>
          </div>
          <section
            className="mx-auto w-full max-w-[440px] rounded-2xl border border-border bg-surface-1/95 p-6 backdrop-blur-xl sm:p-8"
            aria-labelledby="recovery-heading"
          >
            <h1
              id="recovery-heading"
              className="text-[1.7rem] font-medium leading-tight tracking-[-0.035em]"
            >
              {title}
            </h1>
            <p className="mb-7 mt-3 text-sm leading-7 text-muted-foreground">
              {description}
            </p>
            {children}
          </section>
        </div>
      </div>
      <footer className="relative z-10 px-5 py-5 text-center text-[11px] text-muted-foreground">
        © {new Date().getFullYear()} Allocatr
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
