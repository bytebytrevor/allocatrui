import type { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";

import { ArrowRightIcon } from "lucide-react";

import allocatrLogoLight from "@/assets/allocatr-neg-light.svg";
import allocatrLogoDark from "@/assets/allocatr-dark-02.svg";

import { useAuth } from "@/auth/useAuth";

/* =========================================================
   LINKS
========================================================= */

const productLinks = [
  {
    label: "Find Allocats",
    href: "/discover",
  },
  {
    label: "How it works",
    href: "/how-it-works",
  },
];

const companyLinks = [
  {
    label: "About Allocatr",
    href: "/about",
  },
  {
    label: "Contact",
    href: "/contact",
  },
];

const legalLinks = [
  {
    label: "Terms",
    href: "/terms",
  },
  {
    label: "Privacy",
    href: "/privacy",
  },
];

/* =========================================================
   FOOTER
========================================================= */

function SiteFooter() {
  const { user } = useAuth();
  const location = useLocation();

  const isLandingPage = location.pathname === "/";

  const postProjectHref = user ? "/projects/new" : "/register";

  const allocatHref = user?.isAllocat ? "/projects" : "/become-an-allocat";

  const allocatLabel = user?.isAllocat ? "View my work" : "Become an Allocat";

  return (
    <footer
      className={[
        "relative overflow-hidden border-t border-border/60",
        "bg-surface-1 text-foreground",
        "dark:bg-sidebar",
      ].join(" ")}
    >
      {isLandingPage && <LandingFooterAtmosphere />}

      <div className="container relative mx-auto px-4 sm:px-5 md:px-8">
        {/* =================================================
            TOP BRAND / PATHS
        ================================================= */}

        {isLandingPage && (
          <div className="grid gap-8 border-b border-border/55 py-10 sm:grid-cols-2 sm:py-12 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
            <div>
              <p className="max-w-xl text-2xl font-semibold leading-tight tracking-[-0.03em] text-foreground sm:text-3xl">
                Start with the work.
                <span className="block text-brand-secondary-highlight dark:text-secondary">
                  Allocate it properly.
                </span>
              </p>

              <p className="mt-3 max-w-lg text-sm leading-7 text-muted-foreground">
                Find the capability, bring in the right people and keep the
                project connected from brief to completion.
              </p>
            </div>

            <div className="flex flex-col gap-2.5 sm:flex-row lg:justify-end">
              <FooterAction
                href={postProjectHref}
                label="Create a project"
                primary
              />

              <FooterAction href={allocatHref} label={allocatLabel} />
            </div>
          </div>
        )}

        {/* =================================================
            MAIN FOOTER
        ================================================= */}

        <div
          className={[
            "grid grid-cols-2 gap-x-8 gap-y-11 py-14",
            "sm:gap-x-12 sm:gap-y-12 sm:py-16",
            "lg:grid-cols-[1.45fr_0.7fr_0.85fr_0.7fr_0.7fr]",
            "lg:gap-12 lg:py-20",
          ].join(" ")}
        >
          {/* ===============================================
              BRAND
          =============================================== */}

          <div className="col-span-2 max-w-md lg:col-span-1">
            <Link
              to="/"
              aria-label="Allocatr home"
              className={[
                "inline-block rounded-sm",
                "focus-visible:outline-none",
                "focus-visible:ring-2",
                "focus-visible:ring-ring/30",
                "focus-visible:ring-offset-4",
                "focus-visible:ring-offset-surface-1",
                "dark:focus-visible:ring-offset-sidebar",
              ].join(" ")}
            >
              <img
                src={allocatrLogoDark}
                alt="Allocatr"
                className="h-8 w-auto object-contain dark:hidden sm:h-9"
              />

              <img
                src={allocatrLogoLight}
                alt="Allocatr"
                className="hidden h-8 w-auto object-contain dark:block sm:h-9"
              />
            </Link>

            <p className="mt-6 max-w-sm text-sm leading-7 text-muted-foreground sm:mt-7">
              Find the right people, manage the work and keep every project
              moving from brief to completion.
            </p>

            <div className="mt-7 flex items-center gap-3">
              <FooterEyeMark />

              <p className="text-[0.55rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                Work, properly allocated
              </p>
            </div>
          </div>

          {/* ===============================================
              PRODUCT
          =============================================== */}

          <FooterColumn title="Product" links={productLinks} />

          {/* ===============================================
              GET STARTED
          =============================================== */}

          <div>
            <FooterHeading>Get started</FooterHeading>

            <nav
              aria-label="Get started"
              className="mt-5 flex flex-col items-start gap-3.5"
            >
              <FooterLink href={postProjectHref} label="Create a project" />

              <FooterLink href={allocatHref} label={allocatLabel} />
            </nav>
          </div>

          {/* ===============================================
              COMPANY
          =============================================== */}

          <FooterColumn title="Company" links={companyLinks} />

          {/* ===============================================
              LEGAL
          =============================================== */}

          <FooterColumn title="Legal" links={legalLinks} />
        </div>

        {/* =================================================
            BOTTOM
        ================================================= */}

        <div
          className={[
            "flex flex-col gap-3 border-t border-border/55 py-6",
            "text-[0.68rem] text-muted-foreground",
            "sm:flex-row sm:items-center sm:justify-between sm:gap-6",
          ].join(" ")}
        >
          <p>© {new Date().getFullYear()} Allocatr. All rights reserved.</p>

          <div className="flex items-center gap-2.5 sm:justify-end">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-secondary-highlight dark:bg-secondary" />

            <p>Work, properly allocated.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* =========================================================
   COLUMN
========================================================= */

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: {
    label: string;
    href: string;
  }[];
}) {
  return (
    <div>
      <FooterHeading>{title}</FooterHeading>

      <nav
        aria-label={title}
        className="mt-5 flex flex-col items-start gap-3.5"
      >
        {links.map((link) => (
          <FooterLink key={link.href} href={link.href} label={link.label} />
        ))}
      </nav>
    </div>
  );
}

/* =========================================================
   HEADING
========================================================= */

function FooterHeading({ children }: { children: ReactNode }) {
  return (
    <p className="text-[0.55rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground/75">
      {children}
    </p>
  );
}

/* =========================================================
   LINK
========================================================= */

function FooterLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      to={href}
      className={[
        "group inline-flex items-center gap-1.5 rounded-sm",
        "text-sm font-medium text-foreground/60",
        "transition-colors duration-200",

        "hover:text-foreground",
        "focus-visible:text-foreground",
        "focus-visible:outline-none",
      ].join(" ")}
    >
      {label}

      <ArrowRightIcon
        size={11}
        className={[
          "-translate-x-1 opacity-0",
          "text-brand-secondary-highlight",
          "transition-all duration-200",

          "group-hover:translate-x-0",
          "group-hover:opacity-100",

          "group-focus-visible:translate-x-0",
          "group-focus-visible:opacity-100",

          "dark:text-secondary",
        ].join(" ")}
      />
    </Link>
  );
}

/* =========================================================
   ACTION
========================================================= */

function FooterAction({
  href,
  label,
  primary = false,
}: {
  href: string;
  label: string;
  primary?: boolean;
}) {
  return (
    <Link
      to={href}
      className={[
        "group inline-flex h-11 items-center justify-center gap-2",
        "rounded-lg border px-5",
        "text-xs font-semibold",
        "shadow-none",

        "transition-[background-color,border-color,color,transform] duration-200",

        "hover:-translate-y-0.5",

        primary
          ? [
              "border-brand-secondary-highlight/15",
              "bg-brand-secondary-highlight",
              "text-primary-foreground",

              "hover:bg-brand-secondary-highlight/90",

              "dark:border-secondary/10",
              "dark:bg-secondary",
              "dark:text-secondary-foreground",

              "dark:hover:bg-secondary/90",
            ].join(" ")
          : [
              "border-border/65",
              "bg-surface-2/35",
              "text-foreground/70",

              "hover:border-border/85",
              "hover:bg-surface-3/60",
              "hover:text-foreground",

              "dark:border-border",
              "dark:bg-surface-2/65",
              "dark:text-foreground/75",

              "dark:hover:bg-surface-3/70",
              "dark:hover:text-foreground",
            ].join(" "),
      ].join(" ")}
    >
      {label}

      <ArrowRightIcon
        size={12}
        className="transition-transform duration-200 group-hover:translate-x-0.5"
      />
    </Link>
  );
}

/* =========================================================
   LANDING ATMOSPHERE
========================================================= */

function LandingFooterAtmosphere() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      {/* WHISKER / ROUTE LANGUAGE */}

      <svg
        viewBox="0 0 1440 680"
        preserveAspectRatio="none"
        className="absolute inset-0 h-full w-full"
      >
        <path
          d="M-120 455 C180 285 410 268 645 375 C860 474 1080 440 1540 145"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          className="text-border/32"
        />

        <path
          d="M-120 515 C205 355 435 335 675 430 C920 528 1160 424 1540 230"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          strokeDasharray="7 11"
          className="text-border/20"
        />

        <path
          d="M-135 565 C210 430 440 408 690 485"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          className="text-border/12"
        />
      </svg>

      {/* SMALL ACCENT DETAILS */}

      <span className="absolute left-[7%] top-[18%] h-2.5 w-2.5 rounded-full border border-border/70" />

      <span className="absolute right-[8%] top-[15%] h-1.5 w-12 rounded-full bg-brand-secondary-highlight/10 dark:bg-secondary/10" />

      <span className="absolute bottom-[16%] right-[18%] h-2 w-2 rounded-full bg-brand-secondary-highlight/25 dark:bg-secondary/25" />

      <FooterLargeEye />
    </div>
  );
}

/* =========================================================
   CAT / FOCUS LANGUAGE
========================================================= */

function FooterEyeMark() {
  return (
    <span
      aria-hidden
      className="flex h-5 w-9 shrink-0 items-center justify-center"
    >
      <svg viewBox="0 0 42 24" className="h-full w-full">
        <path
          d="M3 12C8.2 5.3 14.2 2 21 2s12.8 3.3 18 10c-5.2 6.7-11.2 10-18 10S8.2 18.7 3 12Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          className="text-border"
        />

        <ellipse
          cx="21"
          cy="12"
          rx="1.7"
          ry="5"
          fill="currentColor"
          className="text-brand-secondary-highlight dark:text-secondary"
        />
      </svg>
    </span>
  );
}

function FooterLargeEye() {
  return (
    <div className="absolute -bottom-16 -left-20 hidden h-56 w-96 opacity-[0.22] sm:block">
      <svg viewBox="0 0 420 240" className="h-full w-full">
        <path
          d="M20 120C73 47 136 12 210 12s137 35 190 108c-53 73-116 108-190 108S73 193 20 120Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          className="text-border"
        />

        <ellipse
          cx="210"
          cy="120"
          rx="9"
          ry="36"
          fill="currentColor"
          className="text-brand-secondary-highlight/30 dark:text-secondary/25"
        />
      </svg>
    </div>
  );
}

export default SiteFooter;
