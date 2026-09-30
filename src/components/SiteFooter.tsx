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
  const location = useLocation();

  const isLandingPage = location.pathname === "/";
  const postProjectHref = user ? "/projects/new" : "/register";
  const allocatHref = user?.isAllocat ? "/projects" : "/become-an-allocat";
  const allocatLabel = user?.isAllocat ? "View my work" : "Become an Allocat";

  return (
    <footer
      className={[
        "relative overflow-hidden border-t",
        isLandingPage
          ? "border-white/[0.07] bg-[#07171C] text-white"
          : "border-black/[0.07] bg-[#f1f1ed] text-[#303030] dark:border-white/[0.07] dark:bg-[#0d0d0d] dark:text-white",
      ].join(" ")}
    >
      {isLandingPage && <LandingFooterAtmosphere />}

      <div className="container relative mx-auto px-5 md:px-8">
        <div className={[
          "grid grid-cols-2 gap-x-8 gap-y-11 py-14 sm:gap-x-12 sm:gap-y-12 sm:py-16",
          "lg:grid-cols-[1.45fr_0.7fr_0.8fr_0.7fr_0.7fr] lg:gap-12 lg:py-20",
        ].join(" ")}>
          <div className="col-span-2 max-w-md lg:col-span-1">
            <Link
              to="/"
              aria-label="Allocatr home"
              className={[
                "inline-block rounded-sm focus-visible:outline-none focus-visible:ring-2",
                isLandingPage
                  ? "focus-visible:ring-[#DEDA00]/35"
                  : "focus-visible:ring-[#303030]/25 dark:focus-visible:ring-[#DEDA00]/35",
              ].join(" ")}
            >
              {isLandingPage ? (
                <img
                  src={allocatrLogoLight}
                  alt="Allocatr"
                  className="h-8 w-auto object-contain sm:h-9"
                />
              ) : (
                <>
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
                </>
              )}
            </Link>

            <p className={[
              "mt-6 max-w-sm text-sm leading-7 sm:mt-7",
              isLandingPage ? "text-white/48" : "text-black/52 dark:text-white/42",
            ].join(" ")}>
              Find the right people, manage the work and keep every project moving from brief to completion.
            </p>

            <div className="mt-6 flex items-center gap-2.5 sm:mt-7">
              <span className={[
                "h-1.5 w-1.5 shrink-0 rounded-full",
                isLandingPage ? "bg-[#DEDA00]" : "bg-[#303030] dark:bg-[#DEDA00]",
              ].join(" ")} />

              <p className={[
                "text-[0.56rem] font-semibold uppercase tracking-[0.18em]",
                isLandingPage ? "text-white/35" : "text-black/40 dark:text-white/32",
              ].join(" ")}>
                Work, properly allocated
              </p>
            </div>
          </div>

          <FooterColumn title="Product" links={productLinks} landing={isLandingPage} />

          <div>
            <FooterHeading landing={isLandingPage}>Get started</FooterHeading>

            <nav aria-label="Get started" className="mt-5 flex flex-col items-start gap-3.5">
              <FooterLink href={postProjectHref} label="Create a project" landing={isLandingPage} />
              <FooterLink href={allocatHref} label={allocatLabel} landing={isLandingPage} />
            </nav>
          </div>

          <FooterColumn title="Company" links={companyLinks} landing={isLandingPage} />
          <FooterColumn title="Legal" links={legalLinks} landing={isLandingPage} />
        </div>

        <div className={[
          "flex flex-col gap-3 border-t py-6 text-xs",
          "sm:flex-row sm:items-center sm:justify-between sm:gap-6",
          isLandingPage
            ? "border-white/[0.07] text-white/30"
            : "border-black/[0.07] text-black/42 dark:border-white/[0.07] dark:text-white/32",
        ].join(" ")}>
          <p>© {new Date().getFullYear()} Allocatr. All rights reserved.</p>

          <div className="flex items-center gap-2 sm:justify-end">
            {isLandingPage && <span className="h-1.5 w-1.5 rounded-full bg-[#DEDA00]" />}
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
  landing,
}: {
  title: string;
  links: { label: string; href: string }[];
  landing: boolean;
}) {
  return (
    <div>
      <FooterHeading landing={landing}>{title}</FooterHeading>

      <nav aria-label={title} className="mt-5 flex flex-col items-start gap-3.5">
        {links.map(link => (
          <FooterLink
            key={link.href}
            href={link.href}
            label={link.label}
            landing={landing}
          />
        ))}
      </nav>
    </div>
  );
}

/* =========================================================
   HEADING
========================================================= */

function FooterHeading({ children, landing }: { children: ReactNode; landing: boolean }) {
  return (
    <p className={[
      "text-[0.56rem] font-semibold uppercase tracking-[0.18em]",
      landing ? "text-[#9FC0C9]/55" : "text-black/38 dark:text-white/30",
    ].join(" ")}>
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
  landing,
}: {
  href: string;
  label: string;
  landing: boolean;
}) {
  return (
    <Link
      to={href}
      className={[
        "group inline-flex items-center gap-1.5 rounded-sm text-sm font-medium transition-colors duration-200",
        "focus-visible:outline-none",
        landing
          ? "text-white/52 hover:text-white focus-visible:text-white"
          : "text-black/60 hover:text-[#303030] focus-visible:text-[#303030] dark:text-white/50 dark:hover:text-white dark:focus-visible:text-white",
      ].join(" ")}
    >
      {label}

      <ArrowRightIcon
        size={11}
        className={[
          "-translate-x-1 opacity-0 transition-all duration-200",
          "group-hover:translate-x-0 group-hover:opacity-100",
          "group-focus-visible:translate-x-0 group-focus-visible:opacity-100",
          landing ? "text-[#DEDA00]" : "text-[#303030] dark:text-[#DEDA00]",
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
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute -left-52 top-8 h-96 w-96 rounded-full bg-[#033D4F]/45 blur-[150px]" />

      <div className="absolute -right-52 bottom-0 h-96 w-96 rounded-full bg-[#DEDA00]/[0.045] blur-[150px]" />

      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.018) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.018) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
          maskImage:
            "linear-gradient(to bottom, transparent 0%, black 28%, black 70%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(to bottom, transparent 0%, black 28%, black 70%, transparent 100%)",
        }}
      />

      <div className="absolute left-1/2 top-0 h-px w-[72%] -translate-x-1/2 bg-gradient-to-r from-transparent via-[#DEDA00]/20 to-transparent" />
    </div>
  );
}

export default SiteFooter;