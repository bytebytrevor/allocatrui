import type { ReactNode } from "react";

import { Link, useLocation } from "react-router-dom";

import { ArrowRightIcon, PawPrintIcon } from "lucide-react";

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
        "relative overflow-hidden",

        "border-t border-border/55",

        "bg-surface-1",

        "text-foreground",

        "dark:bg-sidebar",
      ].join(" ")}
    >
      {isLandingPage && <LandingFooterAtmosphere />}

      <div className="container relative mx-auto px-4 sm:px-5 md:px-8">
        {/* =================================================
            MAIN FOOTER
        ================================================= */}

        <div
          className={[
            "grid grid-cols-2 gap-x-8 gap-y-11",

            "py-12",

            "sm:gap-x-12",

            "sm:gap-y-14",

            "sm:py-16",

            "lg:grid-cols-[1.45fr_0.7fr_0.85fr_0.7fr_0.7fr]",

            "lg:gap-12",

            "lg:py-20",
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

            <p className="mt-5 max-w-sm text-sm leading-7 text-muted-foreground sm:mt-6">
              Bring the right capability around the work and keep projects
              connected from brief to delivery.
            </p>

            <div className="mt-6 flex items-center gap-3">
              <FooterPawMark />

              <p className="text-[0.52rem] font-semibold uppercase tracking-[0.17em] text-muted-foreground">
                Work, properly allocated
              </p>
            </div>
          </div>

          {/* ===============================================
              PRODUCT
          =============================================== */}

          <FooterColumn
            title="Product"
            links={productLinks}
            currentPath={location.pathname}
          />

          {/* ===============================================
              GET STARTED
          =============================================== */}

          <div>
            <FooterHeading>Get started</FooterHeading>

            <nav
              aria-label="Get started"
              className="mt-5 flex flex-col items-start gap-3.5"
            >
              <FooterLink
                href={postProjectHref}
                label="Post a project"
                currentPath={location.pathname}
              />

              <FooterLink
                href={allocatHref}
                label={allocatLabel}
                currentPath={location.pathname}
              />
            </nav>
          </div>

          {/* ===============================================
              COMPANY
          =============================================== */}

          <FooterColumn
            title="Company"
            links={companyLinks}
            currentPath={location.pathname}
          />

          {/* ===============================================
              LEGAL
          =============================================== */}

          <FooterColumn
            title="Legal"
            links={legalLinks}
            currentPath={location.pathname}
          />
        </div>

        {/* =================================================
            BOTTOM
        ================================================= */}

        <div
          className={[
            "flex flex-col gap-3",

            "border-t border-border/55",

            "py-6",

            "text-[0.68rem] text-muted-foreground",

            "sm:flex-row",

            "sm:items-center",

            "sm:justify-between",

            "sm:gap-6",
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
  currentPath,
}: {
  title: string;

  links: {
    label: string;
    href: string;
  }[];

  currentPath: string;
}) {
  return (
    <div>
      <FooterHeading>{title}</FooterHeading>

      <nav
        aria-label={title}
        className="mt-5 flex flex-col items-start gap-3.5"
      >
        {links.map((link) => (
          <FooterLink
            key={link.href}
            href={link.href}
            label={link.label}
            currentPath={currentPath}
          />
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

function FooterLink({
  href,
  label,
  currentPath,
}: {
  href: string;
  label: string;
  currentPath: string;
}) {
  const active =
    href === "/"
      ? currentPath === "/"
      : currentPath === href || currentPath.startsWith(`${href}/`);

  return (
    <Link
      to={href}
      aria-current={active ? "page" : undefined}
      className={[
        "group inline-flex items-center gap-1.5 rounded-sm",

        "text-sm font-medium",

        "transition-colors duration-200",

        active ? "text-foreground" : "text-foreground/60",

        "hover:text-foreground",

        "focus-visible:text-foreground",

        "focus-visible:outline-none",
      ].join(" ")}
    >
      {label}

      <ArrowRightIcon
        size={11}
        className={[
          "transition-[transform,opacity] duration-200",

          "text-brand-secondary-highlight",

          active ? "translate-x-0 opacity-50" : "-translate-x-1 opacity-0",

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
   LANDING ATMOSPHERE
========================================================= */

function LandingFooterAtmosphere() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      {/* ===============================================
          QUIET ROUTE LANGUAGE
      =============================================== */}

      <svg
        viewBox="0 0 1440 640"
        preserveAspectRatio="none"
        className="absolute inset-0 h-full w-full"
      >
        <path
          d="M-120 470 C180 330 410 310 650 390 C900 472 1140 420 1540 170"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          className="text-border/22"
        />

        <path
          d="M-120 530 C200 390 440 365 690 440 C930 513 1170 430 1540 250"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          strokeDasharray="5 13"
          className="text-border/12"
        />
      </svg>

      {/* ===============================================
          SMALL ACCENT DETAILS
      =============================================== */}

      <span className="absolute right-[9%] top-[16%] h-1.5 w-10 rounded-full bg-brand-secondary-highlight/[0.08] dark:bg-secondary/[0.08]" />

      <span className="absolute bottom-[18%] right-[20%] h-1.5 w-1.5 rounded-full bg-brand-secondary-highlight/20 dark:bg-secondary/20" />

      <span className="absolute left-[7%] top-[17%] h-2 w-2 rounded-full border border-border/50" />

      {/* ===============================================
          LARGE PAW WATERMARK
      =============================================== */}

      <PawPrintIcon
        className={[
          "absolute -bottom-20 -left-16",

          "hidden h-56 w-56",

          "-rotate-12",

          "text-foreground/[0.018]",

          "sm:block",

          "dark:text-foreground/[0.014]",
        ].join(" ")}
      />
    </div>
  );
}

/* =========================================================
   BRAND MARK
========================================================= */

function FooterPawMark() {
  return (
    <span
      aria-hidden
      className={[
        "flex h-7 w-7 shrink-0 items-center justify-center",

        "rounded-lg",

        "border border-border/55",

        "bg-surface-2/55",

        "text-brand-secondary-highlight",

        "dark:bg-surface-2/65",

        "dark:text-secondary",
      ].join(" ")}
    >
      <PawPrintIcon size={12} strokeWidth={1.8} className="-rotate-6" />
    </span>
  );
}

export default SiteFooter;
