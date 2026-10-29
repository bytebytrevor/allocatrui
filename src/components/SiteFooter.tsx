import { type CSSProperties, type ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { PawPrintIcon } from "lucide-react";

import allocatrLogoLight from "@/assets/allocatr-neg-light.svg";
import allocatrLogoDark from "@/assets/allocatr-dark-02.svg";
import { useAuth } from "@/auth/useAuth";

type FooterLinkItem = { label: string; href: string; badge?: string };

const platformLinks: FooterLinkItem[] = [
  { label: "How it works", href: "/how-it-works" },
  { label: "Project workspace", href: "/platform/workspace" },
  { label: "Project management", href: "/platform/project-management" },
  { label: "Review & approval", href: "/platform/review-and-approval" },
];
const resourceLinks: FooterLinkItem[] = [
  { label: "Getting started", href: "/getting-started" },
  { label: "Help Centre", href: "/help" },
  { label: "FAQs", href: "/faq" },
  { label: "Trust & verification", href: "/trust" },
  { label: "Safety", href: "/safety" },
];
const companyLinks: FooterLinkItem[] = [
  { label: "About Allocatr", href: "/about" },
  { label: "Contact", href: "/contact" },
];
const legalLinks: FooterLinkItem[] = [
  { label: "Terms", href: "/terms" },
  { label: "Privacy", href: "/privacy" },
];

// The landing footer matches the hero/nav, independent of the app's theme.
const LANDING_FOOTER_TOKENS = {
  colorScheme: "dark",
  "--footer-canvas":
    "var(--landing-hero-bg, color-mix(in srgb, var(--brand-charcoal) 34%, black))",
  "--background": "var(--footer-canvas)",
  "--foreground": "var(--primary-foreground)",
  "--surface-1": "var(--footer-canvas)",
  "--surface-2":
    "color-mix(in srgb, var(--footer-canvas) 92%, var(--primary-foreground))",
  "--muted-foreground":
    "color-mix(in srgb, var(--primary-foreground) 68%, var(--footer-canvas))",
  "--border":
    "color-mix(in srgb, var(--primary-foreground) 16%, var(--footer-canvas))",
  "--ring": "var(--brand-primary)",
} as CSSProperties;

export default function SiteFooter() {
  const { user } = useAuth();
  const { pathname } = useLocation();
  const landing = pathname === "/";
  const startLinks: FooterLinkItem[] = [
    { label: "Find Allocats", href: "/discover" },
    { label: "Post a project", href: user ? "/projects/new" : "/register" },
    {
      label: user?.isAllocat ? "View my work" : "Become an Allocat",
      href: user?.isAllocat ? "/projects" : "/become-an-allocat",
    },
    { label: "For clients", href: "/for-clients" },
    { label: "Allocatr Pro", href: "/pro", badge: "Coming soon" },
  ];
  return (
    <footer
      style={landing ? LANDING_FOOTER_TOKENS : undefined}
      className={`relative isolate overflow-hidden border-t border-border/55 text-foreground ${landing ? "bg-background" : "bg-surface-1 dark:bg-sidebar"}`}
    >
      <div
        className={`relative mx-auto w-full ${landing ? "max-w-[1440px] px-4 sm:px-8 lg:px-12 xl:px-16" : "max-w-7xl px-4 sm:px-6 md:px-8 xl:px-10"}`}
      >
        <div className="grid min-w-0 gap-10 py-10 sm:gap-12 sm:py-14 xl:grid-cols-[minmax(0,1fr)_minmax(0,2.6fr)] xl:gap-16 xl:py-16">
          <div className="min-w-0 max-w-sm">
            <Link
              to="/"
              aria-label="Allocatr home"
              className="inline-flex rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:ring-offset-4 focus-visible:ring-offset-background"
            >
              {landing ? (
                <img
                  src={allocatrLogoLight}
                  alt="Allocatr"
                  className="h-7 max-w-full w-auto object-contain"
                />
              ) : (
                <>
                  <img
                    src={allocatrLogoDark}
                    alt="Allocatr"
                    className="h-7 max-w-full w-auto object-contain dark:hidden"
                  />
                  <img
                    src={allocatrLogoLight}
                    alt="Allocatr"
                    className="hidden h-7 max-w-full w-auto object-contain dark:block"
                  />
                </>
              )}
            </Link>
            <p className="mt-4 max-w-[32ch] text-[13px] leading-7 text-muted-foreground">
              Find the right capability. Bring people together. Keep the work
              connected from brief to delivery.
            </p>
            <div className="mt-5 flex items-center gap-2">
              <FooterPawMark />
              <p className="text-[11px] font-normal tracking-[0.01em] text-muted-foreground">
                Work, properly allocated
              </p>
            </div>
          </div>
          <div className="grid min-w-0 grid-cols-1 gap-x-6 gap-y-7 min-[360px]:grid-cols-2 sm:gap-x-8 sm:gap-y-9 md:grid-cols-4">
            <FooterColumn
              title="Platform"
              links={platformLinks}
              currentPath={pathname}
            />
            <FooterColumn
              title="Get started"
              links={startLinks}
              currentPath={pathname}
            />
            <FooterColumn
              title="Resources"
              links={resourceLinks}
              currentPath={pathname}
            />
            <FooterColumn
              title="Company"
              links={companyLinks}
              currentPath={pathname}
            />
          </div>
        </div>
        <div className="flex flex-col-reverse items-start gap-3 border-t border-border/50 py-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:gap-x-6 sm:gap-y-2">
          <p className="text-[11px] leading-6 text-muted-foreground">
            © {new Date().getFullYear()} Allocatr. All rights reserved.
          </p>
          <nav
            aria-label="Legal"
            className="flex flex-wrap items-center gap-x-5 gap-y-1"
          >
            {legalLinks.map((item) => (
              <FooterLink
                key={item.href}
                {...item}
                currentPath={pathname}
                compact
              />
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  links,
  currentPath,
}: {
  title: string;
  links: FooterLinkItem[];
  currentPath: string;
}) {
  return (
    <div className="min-w-0">
      <FooterHeading>{title}</FooterHeading>
      <nav
        aria-label={title}
        className="mt-2 flex flex-col items-start sm:mt-3"
      >
        {links.map((item) => (
          <FooterLink key={item.href} {...item} currentPath={currentPath} />
        ))}
      </nav>
    </div>
  );
}

function FooterHeading({ children }: { children: ReactNode }) {
  return (
    <h2 className="text-xs font-semibold tracking-[0.01em] text-foreground/90">
      {children}
    </h2>
  );
}

function FooterLink({
  href,
  label,
  badge,
  currentPath,
  compact = false,
}: FooterLinkItem & {
  currentPath: string;
  compact?: boolean;
}) {
  const active = currentPath === href;
  return (
    <Link
      to={href}
      aria-current={active ? "page" : undefined}
      className={`inline-flex min-h-11 min-w-0 max-w-full flex-wrap items-center gap-x-2 gap-y-1 rounded-sm py-2 leading-6 no-underline transition-colors duration-150 hover:text-foreground hover:no-underline focus-visible:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background motion-reduce:transition-none ${compact ? "text-xs" : "text-[13px]"} ${active ? "text-foreground" : "text-muted-foreground"}`}
    >
      <span className="min-w-0 break-words [overflow-wrap:anywhere]">
        {label}
      </span>
      {badge && (
        <span className="max-w-full rounded bg-surface-2 px-1.5 py-0.5 text-[9px] font-medium leading-4 text-muted-foreground">
          {badge}
        </span>
      )}
    </Link>
  );
}

function FooterPawMark() {
  return (
    <span
      aria-hidden="true"
      className={
        "flex h-5 w-5 shrink-0 items-center justify-center text-muted-foreground"
      }
    >
      <PawPrintIcon size={13} strokeWidth={1.8} className="-rotate-6" />
    </span>
  );
}
