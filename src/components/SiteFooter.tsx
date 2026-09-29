import type { ReactNode } from "react";
import { Link } from "react-router-dom";

import { ArrowRightIcon } from "lucide-react";

import allocatrLogoLight from "@/assets/allocatr-neg-light.svg";
import allocatrLogoDark from "@/assets/allocatr-dark-02.svg";

import { useAuth } from "@/auth/useAuth";

/* =========================================================
   LINKS
========================================================= */

const productLinks = [
  { label: "Find Allocats", href: "/discover" },
  { label: "How it works", href: "/how-it-works" },
];

const companyLinks = [
  { label: "About Allocatr", href: "/about" },
  { label: "Contact", href: "/contact" },
];

const legalLinks = [
  { label: "Terms", href: "/terms" },
  { label: "Privacy", href: "/privacy" },
];

/* =========================================================
   FOOTER
========================================================= */

function SiteFooter() {
  const { user } = useAuth();

  const postProjectHref = user ? "/projects/new" : "/register";

  const allocatHref = user?.isAllocat
    ? "/projects"
    : "/become-an-allocat";

  const allocatLabel = user?.isAllocat
    ? "View my work"
    : "Become an Allocat";

  return (
    <footer
      className={[
        "border-t border-black/[0.07] bg-[#f1f1ed] text-[#303030]",
        "dark:border-white/[0.07] dark:bg-[#0d0d0d] dark:text-white",
      ].join(" ")}
    >
      <div className="container mx-auto px-5 md:px-8">
        {/* =================================================
            MAIN FOOTER
        ================================================= */}

        <div
          className={[
            "grid grid-cols-2 gap-x-8 gap-y-11 py-14 sm:gap-x-12 sm:gap-y-12 sm:py-16",
            "lg:grid-cols-[1.45fr_0.7fr_0.8fr_0.7fr_0.7fr] lg:gap-12 lg:py-20",
          ].join(" ")}
        >
          {/* BRAND */}

          <div className="col-span-2 max-w-md lg:col-span-1">
            <Link
              to="/"
              aria-label="Allocatr home"
              className="inline-block rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#303030]/25 dark:focus-visible:ring-[#DEDA00]/35"
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

            <p className="mt-6 max-w-sm text-sm leading-7 text-black/52 dark:text-white/42 sm:mt-7">
              Find the right people, manage the work and keep every project
              moving from brief to completion.
            </p>

            <div className="mt-6 flex items-center gap-2.5 sm:mt-7">
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#303030] dark:bg-[#DEDA00]" />

              <p className="text-[0.56rem] font-semibold uppercase tracking-[0.18em] text-black/40 dark:text-white/32">
                Work, properly allocated
              </p>
            </div>
          </div>

          {/* PRODUCT */}

          <FooterColumn
            title="Product"
            links={productLinks}
          />

          {/* GET STARTED */}

          <div>
            <FooterHeading>
              Get started
            </FooterHeading>

            <nav
              aria-label="Get started"
              className="mt-5 flex flex-col items-start gap-3.5"
            >
              <FooterLink
                href={postProjectHref}
                label="Create a project"
              />

              <FooterLink
                href={allocatHref}
                label={allocatLabel}
              />
            </nav>
          </div>

          {/* COMPANY */}

          <FooterColumn
            title="Company"
            links={companyLinks}
          />

          {/* LEGAL */}

          <FooterColumn
            title="Legal"
            links={legalLinks}
          />
        </div>

        {/* =================================================
            BOTTOM BAR
        ================================================= */}

        <div
          className={[
            "flex flex-col gap-3 border-t border-black/[0.07] py-6",
            "text-xs text-black/42",
            "dark:border-white/[0.07] dark:text-white/32",
            "sm:flex-row sm:items-center sm:justify-between sm:gap-6",
          ].join(" ")}
        >
          <p>
            © {new Date().getFullYear()} Allocatr. All rights reserved.
          </p>

          <p className="sm:text-right">
            Work, properly allocated.
          </p>
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
  links: { label: string; href: string }[];
}) {
  return (
    <div>
      <FooterHeading>
        {title}
      </FooterHeading>

      <nav
        aria-label={title}
        className="mt-5 flex flex-col items-start gap-3.5"
      >
        {links.map(link => (
          <FooterLink
            key={link.href}
            href={link.href}
            label={link.label}
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
    <p className="text-[0.56rem] font-semibold uppercase tracking-[0.18em] text-black/38 dark:text-white/30">
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
}: {
  href: string;
  label: string;
}) {
  return (
    <Link
      to={href}
      className={[
        "group inline-flex items-center gap-1.5 rounded-sm",
        "text-sm font-medium text-black/60",
        "transition-colors duration-200",
        "hover:text-[#303030]",
        "focus-visible:outline-none focus-visible:text-[#303030]",
        "dark:text-white/50",
        "dark:hover:text-white",
        "dark:focus-visible:text-white",
      ].join(" ")}
    >
      {label}

      <ArrowRightIcon
        size={11}
        className={[
          "-translate-x-1 opacity-0",
          "text-[#303030] dark:text-[#DEDA00]",
          "transition-all duration-200",
          "group-hover:translate-x-0 group-hover:opacity-100",
          "group-focus-visible:translate-x-0 group-focus-visible:opacity-100",
        ].join(" ")}
      />
    </Link>
  );
}

export default SiteFooter;