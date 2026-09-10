import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
  ArrowRightIcon,
} from "lucide-react";


import allocatrLogoLight from "@/assets/allocatr-neg-light.svg";
import allocatrLogoDark from "@/assets/allocatr-dark-02.svg";
import { useAuth } from "@/auth/useAuth";

type Theme = "light" | "dark";

const productLinks = [
  {
    label: "Find Allocats",
    href: "/allocats",
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

function getCurrentTheme(): Theme {
  if (
    typeof document !== "undefined" &&
    document.documentElement.classList.contains("dark")
  ) {
    return "dark";
  }

  return "light";
}

function SiteFooter() {
  const { user } = useAuth();
  const [theme, setTheme] = useState<Theme>(getCurrentTheme);

  const postTaskHref = user
    ? "/projects/new"
    : "/register";

  const allocatHref = user?.isAllocat
    ? "/projects"
    : "/become-an-allocat";

  const allocatLabel = user?.isAllocat
    ? "View projects"
    : "Become an Allocat";

  useEffect(() => {
    const root = document.documentElement;

    function syncTheme() {
      setTheme(
        root.classList.contains("dark")
          ? "dark"
          : "light",
      );
    }

    syncTheme();

    const observer = new MutationObserver(syncTheme);

    observer.observe(root, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  const footerLogo =
    theme === "dark"
      ? allocatrLogoLight
      : allocatrLogoDark;

  return (
    <footer className="relative overflow-hidden border-t border-border bg-background">
      <div className="pointer-events-none absolute inset-0">
        <div
          className={[
            "absolute -bottom-52 -left-44 h-96 w-96 rounded-full blur-[120px]",
            "bg-dark-gray/[0.02]",
            "dark:bg-brand-primary/[0.025]",
          ].join(" ")}
        />

        <div className="absolute -right-48 top-10 h-96 w-96 rounded-full bg-violet-500/[0.02] blur-[120px]" />
      </div>

      <div className="container relative mx-auto px-5 md:px-8">
        <div className="grid gap-10 border-b border-border py-12 lg:grid-cols-[1fr_auto] lg:items-end lg:py-14">
          <div className="max-w-2xl">
            <Link
              to="/"
              className="inline-block"
              aria-label="Allocatr home"
            >
              <img
                src={footerLogo}
                alt="Allocatr"
                className="h-8 w-auto object-contain sm:h-9"
              />
            </Link>

            <p className="mt-6 max-w-xl text-sm leading-7 text-muted-foreground sm:text-base">
              Find skilled people, bring them into your project and keep
              tasks, progress and conversations together in one shared
              workspace.
            </p>
          </div>

          <div className="flex items-center gap-3 text-xs font-medium text-muted-foreground">
            <span>
              Find
            </span>

            <FooterDot />

            <span>
              Allocate
            </span>

            <FooterDot />

            <span>
              Deliver
            </span>
          </div>
        </div>

        <div
          className={[
            "grid gap-10 border-b border-border py-12",
            "sm:grid-cols-2",
            "lg:grid-cols-[1.45fr_0.9fr_0.9fr_0.9fr] lg:gap-16",
          ].join(" ")}
        >
          <div className="max-w-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Work, properly allocated
            </p>

            <p className="mt-5 text-sm leading-7 text-muted-foreground">
              Start with the job, find the skills it needs and keep the
              project moving through to final review.
            </p>

            <div className="mt-7 flex items-center gap-3">
              <span className="h-2 w-2 rounded-full bg-dark-gray dark:bg-brand-primary" />

              <p className="text-xs font-medium text-foreground/65">
                One workspace from brief to delivery.
              </p>
            </div>
          </div>

          <FooterColumn
            title="Product"
            links={productLinks}
          />

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Get started
            </p>

            <nav className="mt-5 flex flex-col items-start gap-3.5">
              <FooterLink
                href={postTaskHref}
                label="Post a task"
              />

              <FooterLink
                href={allocatHref}
                label={allocatLabel}
              />
            </nav>
          </div>

          <div className="grid gap-8">
            <FooterColumn
              title="Company"
              links={companyLinks}
            />

            <FooterColumn
              title="Legal"
              links={legalLinks}
            />
          </div>
        </div>

        <div className="flex flex-col gap-4 py-7 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} Allocatr. All rights reserved.
          </p>

          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-dark-gray dark:bg-brand-primary" />

            <span>
              Work, properly allocated.
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

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
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
        {title}
      </p>

      <nav className="mt-5 flex flex-col items-start gap-3.5">
        {links.map((link) => (
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
        "group inline-flex items-center gap-1.5",
        "text-sm font-medium text-foreground/70",
        "transition-colors duration-200",
        "hover:text-foreground",
      ].join(" ")}
    >
      {label}

      <ArrowRightIcon
        size={12}
        className={[
          "-translate-x-1 opacity-0",
          "transition-all duration-200",
          "group-hover:translate-x-0 group-hover:opacity-100",
        ].join(" ")}
      />
    </Link>
  );
}

function FooterDot() {
  return (
    <span className="h-1 w-1 rounded-full bg-dark-gray dark:bg-brand-primary" />
  );
}

export default SiteFooter;