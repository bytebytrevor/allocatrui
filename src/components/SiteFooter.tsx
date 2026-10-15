import {
  createContext,
  useContext,
  type CSSProperties,
  type ReactNode,
} from "react";
import { Link, useLocation } from "react-router-dom";
import { ArrowRightIcon, PawPrintIcon } from "lucide-react";

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
const FooterThemeContext = createContext(false);

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
    <FooterThemeContext.Provider value={landing}>
      <footer
        style={landing ? LANDING_FOOTER_TOKENS : undefined}
        className={`relative isolate overflow-hidden border-t border-border/55 text-foreground ${landing ? "bg-background" : "bg-surface-1 dark:bg-sidebar"}`}
      >
        {landing && <FooterAtmosphere />}
        <div
          className={`relative mx-auto w-full ${landing ? "max-w-[1440px] px-5 sm:px-8 lg:px-14 xl:px-20" : "max-w-7xl px-4 sm:px-6 md:px-8 xl:px-10"}`}
        >
          <div className="grid grid-cols-2 gap-x-7 gap-y-9 py-12 sm:gap-x-10 sm:py-16 lg:grid-cols-[1.4fr_repeat(4,minmax(0,1fr))] lg:gap-8 lg:py-16 xl:gap-10">
            <div className="col-span-2 max-w-sm lg:col-span-1">
              <Link
                to="/"
                aria-label="Allocatr home"
                className="inline-flex rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:ring-offset-4 focus-visible:ring-offset-background"
              >
                {landing ? (
                  <img
                    src={allocatrLogoLight}
                    alt="Allocatr"
                    className="h-7 w-auto object-contain"
                  />
                ) : (
                  <>
                    <img
                      src={allocatrLogoDark}
                      alt="Allocatr"
                      className="h-7 w-auto object-contain dark:hidden"
                    />
                    <img
                      src={allocatrLogoLight}
                      alt="Allocatr"
                      className="hidden h-7 w-auto object-contain dark:block"
                    />
                  </>
                )}
              </Link>
              <p className="mt-5 max-w-[290px] text-[13px] leading-7 text-muted-foreground">
                Find the right capability. Bring people together. Keep the work
                connected from brief to delivery.
              </p>
              <div className="mt-6 flex items-center gap-2.5">
                <FooterPawMark />
                <p className="text-[10px] font-medium uppercase tracking-[0.12em] text-muted-foreground">
                  Work, properly allocated
                </p>
              </div>
            </div>
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
          <div className="flex flex-col gap-4 border-t border-border/50 py-5 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
            <p className="text-[11px] leading-6 text-muted-foreground">
              © {new Date().getFullYear()} Allocatr. All rights reserved.
            </p>
            <nav
              aria-label="Legal"
              className="flex flex-wrap items-center gap-x-6 gap-y-1"
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
    </FooterThemeContext.Provider>
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
    <div>
      <FooterHeading>{title}</FooterHeading>
      <nav
        aria-label={title}
        className="mt-3 flex flex-col items-start gap-1 sm:mt-4"
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
    <h2 className="text-[11px] font-medium uppercase tracking-[0.12em] text-foreground/85">
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
  const landing = useContext(FooterThemeContext);
  const active = currentPath === href;
  return (
    <Link
      to={href}
      aria-current={active ? "page" : undefined}
      className={`group inline-flex min-h-9 max-w-full items-center gap-1.5 rounded-md font-normal transition-colors duration-150 hover:text-foreground focus-visible:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/35 focus-visible:ring-offset-2 focus-visible:ring-offset-background motion-reduce:transition-none ${compact ? "text-[11px]" : "text-[13px]"} ${active ? "text-foreground" : "text-muted-foreground"}`}
    >
      <span>{label}</span>
      {badge && (
        <span className="shrink-0 rounded border border-border/60 px-1.5 py-0.5 text-[8px] font-medium text-muted-foreground">
          {badge}
        </span>
      )}
      <ArrowRightIcon
        size={11}
        aria-hidden="true"
        className={`shrink-0 transition-[transform,opacity] duration-150 group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100 motion-reduce:transition-none ${active ? "translate-x-0 opacity-70" : "-translate-x-1 opacity-0"} ${landing ? "text-brand-primary" : "text-brand-secondary-highlight dark:text-secondary"}`}
      />
    </Link>
  );
}

function FooterAtmosphere() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 select-none"
    >
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 0% 100%, color-mix(in srgb, var(--brand-secondary) 12%, transparent), transparent 65%)",
        }}
      />
      <PawPrintIcon
        strokeWidth={1}
        className="absolute -bottom-14 -left-12 hidden h-64 w-64 -rotate-12 text-foreground/[0.025] sm:block"
      />
    </div>
  );
}

function FooterPawMark() {
  const landing = useContext(FooterThemeContext);
  return (
    <span
      aria-hidden="true"
      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-border/60 bg-surface-2 ${landing ? "text-brand-primary" : "text-brand-secondary-highlight dark:text-secondary"}`}
    >
      <PawPrintIcon size={13} strokeWidth={1.8} className="-rotate-6" />
    </span>
  );
}
