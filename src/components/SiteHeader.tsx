import { useEffect, useMemo, useState, type ReactNode } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";

import {
  ArrowRightIcon,
  BookOpenIcon,
  BriefcaseBusinessIcon,
  ChevronDownIcon,
  CircleHelpIcon,
  ClipboardCheckIcon,
  FolderOpenIcon,
  LayoutDashboardIcon,
  LifeBuoyIcon,
  LockKeyholeIcon,
  LogInIcon,
  LogOutIcon,
  MenuIcon,
  RocketIcon,
  SearchIcon,
  SettingsIcon,
  ShieldCheckIcon,
  SparklesIcon,
  User2Icon,
  UserCircleIcon,
  UsersIcon,
  XIcon,
  type LucideIcon,
} from "lucide-react";

import allocatrLogoLight from "@/assets/allocatr-neg-light.svg";
import allocatrLogoDark from "@/assets/allocatr-dark-02.svg";
import allocatrIcon from "@/assets/icon-variant-01.svg";

import { useAuth } from "@/auth/useAuth";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

/* =========================================================
   TYPES
========================================================= */

type AccountUser = {
  fullName?: string;
  email?: string;
  avatarUrl?: string;
  isAllocat?: boolean;
};

type MenuLink = {
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
  comingSoon?: boolean;
};

type AccountMenuProps = {
  user: AccountUser;
  initials: string;
  loggingOut: boolean;
  onProjects: () => void;
  onProfile: () => void;
  onSettings: () => void;
  onLogout: () => void;
};

/* =========================================================
   NAVIGATION
========================================================= */

const platformLinks: MenuLink[] = [
  {
    title: "How Allocatr works",
    description:
      "See how work moves from project brief through execution and final approval.",
    href: "/how-it-works",
    icon: BookOpenIcon,
  },
  {
    title: "Project workspace",
    description:
      "Keep tasks, people, communication and project progress connected.",
    href: "/platform/workspace",
    icon: LayoutDashboardIcon,
  },
  {
    title: "Project management",
    description:
      "Structure the work, track delivery and keep responsibilities clear.",
    href: "/platform/project-management",
    icon: FolderOpenIcon,
  },
  {
    title: "Review & approval",
    description:
      "Move completed work through submission, review and client confirmation.",
    href: "/platform/review-and-approval",
    icon: ClipboardCheckIcon,
  },
];

const solutionLinks: MenuLink[] = [
  {
    title: "For clients",
    description:
      "Find the right capability and manage work from brief to completion.",
    href: "/for-clients",
    icon: UsersIcon,
  },
  {
    title: "For Allocats",
    description:
      "Build your professional presence and deliver work through Allocatr.",
    href: "/become-an-allocat",
    icon: BriefcaseBusinessIcon,
  },
  {
    title: "Allocatr Pro",
    description:
      "For larger, multidisciplinary work and AI-assisted team building.",
    href: "/pro",
    icon: SparklesIcon,
    comingSoon: true,
  },
];

const resourceLinks: MenuLink[] = [
  {
    title: "Help Centre",
    description: "Guidance for using Allocatr and managing your account.",
    href: "/help",
    icon: LifeBuoyIcon,
  },
  {
    title: "FAQs",
    description:
      "Answers to common questions about projects, accounts and Allocats.",
    href: "/faq",
    icon: CircleHelpIcon,
  },
  {
    title: "Getting started",
    description: "A practical introduction for new clients and Allocats.",
    href: "/getting-started",
    icon: RocketIcon,
  },
  {
    title: "Trust & verification",
    description:
      "Learn how profiles, identity information and verification work.",
    href: "/trust",
    icon: ShieldCheckIcon,
  },
  {
    title: "Safety",
    description:
      "Guidance for working responsibly and protecting your information.",
    href: "/safety",
    icon: LockKeyholeIcon,
  },
];

/* =========================================================
   HELPERS
========================================================= */

function getInitials(name?: string) {
  if (!name?.trim()) {
    return "U";
  }

  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
}

function isPathWithin(pathname: string, prefixes: string[]) {
  return prefixes.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

/* =========================================================
   STYLES
========================================================= */

const primaryActionButton = [
  "border border-brand-secondary-highlight/15 bg-brand-secondary-highlight text-primary-foreground shadow-none",
  "transition-opacity duration-150",
  "hover:border-brand-secondary-highlight/15 hover:bg-brand-secondary-highlight hover:text-primary-foreground hover:opacity-90",
  "focus-visible:ring-2 focus-visible:ring-brand-secondary-highlight/20 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
  "dark:border-secondary/10 dark:bg-secondary dark:text-secondary-foreground",
  "dark:hover:border-secondary/10 dark:hover:bg-secondary dark:hover:text-secondary-foreground dark:hover:opacity-90",
  "dark:focus-visible:ring-secondary/20",
].join(" ");

const secondaryActionButton = [
  "border border-border/65 bg-surface-2/35 text-foreground/75 shadow-none",
  "transition-opacity duration-150",
  "hover:border-border/65 hover:bg-surface-2/35 hover:text-foreground/75 hover:opacity-75",
  "focus-visible:ring-2 focus-visible:ring-brand-secondary-highlight/15 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
  "dark:border-border dark:bg-surface-2/65 dark:text-foreground/75",
  "dark:hover:border-border dark:hover:bg-surface-2/65 dark:hover:text-foreground/75 dark:hover:opacity-75",
  "dark:focus-visible:ring-secondary/15",
].join(" ");

const ghostActionButton = [
  "bg-transparent text-muted-foreground shadow-none transition-opacity duration-150",
  "hover:bg-transparent hover:text-foreground hover:opacity-75",
  "focus-visible:ring-2 focus-visible:ring-brand-secondary-highlight/15",
  "dark:hover:bg-transparent dark:hover:text-foreground",
  "dark:focus-visible:ring-secondary/15",
].join(" ");

const headerIconButton = [
  "text-muted-foreground shadow-none transition-[background-color,color] duration-150",
  "hover:bg-surface-3/55 hover:text-foreground",
  "focus-visible:ring-2 focus-visible:ring-brand-secondary-highlight/15",
  "dark:hover:bg-surface-3/65 dark:hover:text-foreground",
  "dark:focus-visible:ring-secondary/15",
].join(" ");

const dropdownSurface = [
  "rounded-xl border border-border/70 bg-popover text-popover-foreground shadow-none",
  "dark:border-border",
].join(" ");

const dropdownItem = [
  "rounded-lg px-2.5 py-2 text-sm text-foreground/75 transition-colors duration-150",
  "focus:bg-surface-3/60 focus:text-foreground",
  "dark:focus:bg-surface-3/70",
].join(" ");

const accentIconSurface = [
  "bg-brand-secondary-highlight/[0.08] text-brand-secondary-highlight ring-1 ring-inset ring-brand-secondary-highlight/10",
  "dark:bg-secondary/[0.07] dark:text-secondary dark:ring-secondary/10",
].join(" ");

/* =========================================================
   HEADER
========================================================= */

function SiteHeader() {
  const { user, logout } = useAuth();

  const location = useLocation();
  const navigate = useNavigate();

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const initials = useMemo(() => getInitials(user?.fullName), [user?.fullName]);

  const filteredSolutionLinks = useMemo(
    () =>
      user?.isAllocat
        ? solutionLinks.filter((item) => item.href !== "/become-an-allocat")
        : solutionLinks,
    [user?.isAllocat],
  );

  const platformActive = isPathWithin(location.pathname, [
    "/how-it-works",
    "/platform",
  ]);

  const solutionsActive = isPathWithin(location.pathname, [
    "/for-clients",
    "/become-an-allocat",
    "/pro",
  ]);

  const resourcesActive = isPathWithin(location.pathname, [
    "/help",
    "/faq",
    "/getting-started",
    "/trust",
    "/safety",
  ]);

  /* =======================================================
     STABLE SCROLLBAR GUTTER

     This prevents width changes when background scrolling
     is locked by the mobile navigation.
  ======================================================= */

  useEffect(() => {
    const root = document.documentElement;
    const previousScrollbarGutter = root.style.scrollbarGutter;

    root.style.scrollbarGutter = "stable";

    return () => {
      root.style.scrollbarGutter = previousScrollbarGutter;
    };
  }, []);

  /* =======================================================
     SCROLL
  ======================================================= */

  useEffect(() => {
    function handleScroll() {
      setIsScrolled(window.scrollY > 12);
    }

    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  /* =======================================================
     MOBILE BODY LOCK
  ======================================================= */

  useEffect(() => {
    if (!isMenuOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    const previousOverscrollBehavior = document.body.style.overscrollBehavior;

    document.body.style.overflow = "hidden";
    document.body.style.overscrollBehavior = "none";

    return () => {
      document.body.style.overflow = previousOverflow;
      document.body.style.overscrollBehavior = previousOverscrollBehavior;
    };
  }, [isMenuOpen]);

  /* =======================================================
     ESCAPE
  ======================================================= */

  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsMenuOpen(false);
      }
    }

    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, []);

  /* =======================================================
     RESIZE
  ======================================================= */

  useEffect(() => {
    function handleResize() {
      if (window.innerWidth >= 1024) {
        setIsMenuOpen(false);
      }
    }

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  /* =======================================================
     ROUTE CHANGE
  ======================================================= */

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  /* =======================================================
     ACTIONS
  ======================================================= */

  function closeMenu() {
    setIsMenuOpen(false);
  }

  function handleLogin() {
    closeMenu();
    navigate("/login");
  }

  function handlePostProject() {
    closeMenu();
    navigate(user ? "/projects/new" : "/register");
  }

  function handleProjects() {
    closeMenu();
    navigate("/projects");
  }

  function handleProfile() {
    closeMenu();
    navigate(user?.isAllocat ? "/allocats/profile" : "/profile");
  }

  function handleSettings() {
    closeMenu();
    navigate("/settings");
  }

  async function handleLogout() {
    if (loggingOut) {
      return;
    }

    setLoggingOut(true);
    closeMenu();

    try {
      await logout();

      navigate("/login", {
        replace: true,
      });
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setLoggingOut(false);
    }
  }

  const headerSurface = isScrolled
    ? "border-border/60 bg-background/95 backdrop-blur-xl"
    : "border-transparent bg-background/90 backdrop-blur-xl";

  return (
    <>
      <header
        className={[
          "fixed inset-x-0 top-0 z-50 border-b text-foreground shadow-none",
          "transition-[background-color,border-color,backdrop-filter] duration-200",
          headerSurface,
        ].join(" ")}
      >
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 md:px-8 xl:px-10">
          {/* BRAND */}

          <Link
            to="/"
            onClick={closeMenu}
            aria-label="Allocatr home"
            className={[
              "group flex shrink-0 items-center rounded-md outline-none",
              "focus-visible:ring-2 focus-visible:ring-brand-secondary-highlight/20",
              "dark:focus-visible:ring-secondary/20",
            ].join(" ")}
          >
            <img
              src={allocatrIcon}
              alt=""
              className="h-7 w-7 object-contain transition-opacity duration-150 group-hover:opacity-75 sm:hidden"
            />

            <img
              src={allocatrLogoDark}
              alt="Allocatr"
              className="hidden h-[25px] w-auto object-contain transition-opacity duration-150 group-hover:opacity-75 sm:block dark:sm:hidden"
            />

            <img
              src={allocatrLogoLight}
              alt="Allocatr"
              className="hidden h-[25px] w-auto object-contain transition-opacity duration-150 group-hover:opacity-75 dark:sm:block"
            />
          </Link>

          {/* DESKTOP NAV */}

          <nav
            className="hidden h-full items-center lg:flex"
            aria-label="Primary navigation"
          >
            <EnterpriseMenu
              label="Platform"
              active={platformActive}
              links={platformLinks}
              introTitle="The Allocatr platform"
              introDescription="Structure work from the first brief through execution and final approval."
              footerLabel="See how Allocatr works"
              footerDescription="Explore the complete project workflow"
              footerHref="/how-it-works"
            />

            <EnterpriseMenu
              label="Solutions"
              active={solutionsActive}
              links={filteredSolutionLinks}
              introTitle="Built for both sides of the work"
              introDescription="Whether you need capability or provide it, Allocatr keeps the relationship structured."
              footerLabel="Why Allocatr?"
              footerDescription="Learn more about the thinking behind the platform"
              footerHref="/about"
            />

            <NavLink
              to="/discover"
              className={({ isActive }) =>
                [
                  "flex h-full items-center px-3 text-[0.78rem] font-medium transition-opacity duration-150 xl:px-4 xl:text-[0.8rem]",
                  isActive
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground hover:opacity-80",
                ].join(" ")
              }
            >
              Discover Allocats
            </NavLink>

            <EnterpriseMenu
              label="Resources"
              active={resourcesActive}
              links={resourceLinks}
              introTitle="Learn, get started and get support"
              introDescription="Practical guidance for using Allocatr confidently."
              footerLabel="Visit the Help Centre"
              footerDescription="Find guidance for using Allocatr"
              footerHref="/help"
            />
          </nav>

          {/* DESKTOP ACTIONS */}

          <div className="hidden items-center gap-1.5 lg:flex">
            {!user && (
              <Button
                type="button"
                variant="ghost"
                onClick={handleLogin}
                className={[
                  "h-9 rounded-lg px-3 text-xs font-semibold",
                  ghostActionButton,
                ].join(" ")}
              >
                Log in
              </Button>
            )}

            <Button
              type="button"
              variant="ghost"
              onClick={handlePostProject}
              className={[
                "h-9 rounded-lg px-4 text-xs font-semibold",
                primaryActionButton,
              ].join(" ")}
            >
              Post a project
            </Button>

            {user && (
              <>
                <span className="mx-1 h-5 w-px bg-border/65" />

                <AccountMenu
                  user={user}
                  initials={initials}
                  loggingOut={loggingOut}
                  onProjects={handleProjects}
                  onProfile={handleProfile}
                  onSettings={handleSettings}
                  onLogout={handleLogout}
                />
              </>
            )}
          </div>

          {/* MOBILE TRIGGER */}

          <div className="flex items-center lg:hidden">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen((current) => !current)}
              aria-label={isMenuOpen ? "Close navigation" : "Open navigation"}
              aria-expanded={isMenuOpen}
              aria-controls="mobile-navigation"
              className={["h-9 w-9 rounded-lg", headerIconButton].join(" ")}
            >
              {isMenuOpen ? <XIcon size={18} /> : <MenuIcon size={18} />}
            </Button>
          </div>
        </div>
      </header>

      {/* ===================================================
          MOBILE NAVIGATION
      =================================================== */}

      <div
        className={[
          "fixed inset-0 z-40 lg:hidden",
          "transition-[opacity,visibility] duration-200",
          isMenuOpen
            ? "pointer-events-auto visible opacity-100"
            : "pointer-events-none invisible opacity-0",
        ].join(" ")}
        aria-hidden={!isMenuOpen}
      >
        <button
          type="button"
          onClick={closeMenu}
          aria-label="Close navigation"
          className="absolute inset-0 top-16 bg-foreground/15 backdrop-blur-[2px] dark:bg-background/55"
        />

        <aside
          id="mobile-navigation"
          className={[
            "absolute inset-x-0 top-16 border-b border-border/70 bg-background/98 text-foreground shadow-none backdrop-blur-xl",
            "transition-[transform,opacity] duration-200",
            isMenuOpen
              ? "translate-y-0 opacity-100"
              : "-translate-y-2 opacity-0",
          ].join(" ")}
        >
          <div className="mx-auto max-h-[calc(100vh-64px)] w-full max-w-7xl overflow-y-auto px-4 pb-6 sm:px-6 md:px-8">
            {user && (
              <MobileAccountSummary
                user={user}
                initials={initials}
                onProfile={handleProfile}
              />
            )}

            <MobileMenuSection title="Platform">
              <MobileNavigationLink
                label="How Allocatr works"
                href="/how-it-works"
                onClick={closeMenu}
              />

              <MobileNavigationLink
                label="Project workspace"
                href="/platform/workspace"
                onClick={closeMenu}
              />

              <MobileNavigationLink
                label="Project management"
                href="/platform/project-management"
                onClick={closeMenu}
              />

              <MobileNavigationLink
                label="Review & approval"
                href="/platform/review-and-approval"
                onClick={closeMenu}
              />
            </MobileMenuSection>

            <MobileMenuSection title="Solutions">
              <MobileNavigationLink
                label="For clients"
                href="/for-clients"
                onClick={closeMenu}
              />

              {!user?.isAllocat && (
                <MobileNavigationLink
                  label="For Allocats"
                  href="/become-an-allocat"
                  onClick={closeMenu}
                />
              )}

              <MobileNavigationLink
                label="Allocatr Pro"
                href="/pro"
                badge="Coming soon"
                onClick={closeMenu}
              />
            </MobileMenuSection>

            <MobileMenuSection title="Discover">
              <MobileNavigationLink
                label="Discover Allocats"
                href="/discover"
                onClick={closeMenu}
              />
            </MobileMenuSection>

            <MobileMenuSection title="Resources">
              <MobileNavigationLink
                label="Help Centre"
                href="/help"
                onClick={closeMenu}
              />

              <MobileNavigationLink
                label="FAQs"
                href="/faq"
                onClick={closeMenu}
              />

              <MobileNavigationLink
                label="Getting started"
                href="/getting-started"
                onClick={closeMenu}
              />

              <MobileNavigationLink
                label="Trust & verification"
                href="/trust"
                onClick={closeMenu}
              />

              <MobileNavigationLink
                label="Safety"
                href="/safety"
                onClick={closeMenu}
              />
            </MobileMenuSection>

            {user && (
              <div className="mt-6 border-t border-border/60 pt-5">
                <p className="text-[0.52rem] font-semibold uppercase tracking-[0.15em] text-muted-foreground">
                  Your workspace
                </p>

                <div className="mt-3 grid grid-cols-2 gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleProjects}
                    className={[
                      "h-10 rounded-lg text-xs font-semibold",
                      secondaryActionButton,
                    ].join(" ")}
                  >
                    <FolderOpenIcon size={13} />
                    Projects
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleSettings}
                    className={[
                      "h-10 rounded-lg text-xs font-semibold",
                      secondaryActionButton,
                    ].join(" ")}
                  >
                    <SettingsIcon size={13} />
                    Settings
                  </Button>
                </div>
              </div>
            )}

            <div
              className={[
                "mt-6 grid gap-2.5",
                !user ? "sm:grid-cols-2" : "",
              ].join(" ")}
            >
              {!user && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleLogin}
                  className={[
                    "h-11 rounded-lg text-xs font-semibold",
                    secondaryActionButton,
                  ].join(" ")}
                >
                  <LogInIcon size={14} />
                  Log in
                </Button>
              )}

              <Button
                type="button"
                variant="ghost"
                onClick={handlePostProject}
                className={[
                  "h-11 rounded-lg text-xs font-semibold",
                  primaryActionButton,
                ].join(" ")}
              >
                Post a project
              </Button>
            </div>

            {user && (
              <button
                type="button"
                disabled={loggingOut}
                onClick={() => void handleLogout()}
                className={[
                  "mt-6 flex w-full items-center justify-center gap-2 border-t border-border/60 pt-5",
                  "text-xs font-medium text-muted-foreground transition-colors duration-150",
                  "hover:text-destructive focus-visible:outline-none focus-visible:text-destructive",
                  "disabled:pointer-events-none disabled:opacity-50",
                ].join(" ")}
              >
                <LogOutIcon size={13} />
                {loggingOut ? "Logging out..." : "Log out"}
              </button>
            )}
          </div>
        </aside>
      </div>
    </>
  );
}

/* =========================================================
   ENTERPRISE MENU

   modal={false} is important.

   Radix DropdownMenu defaults to modal behaviour, which
   applies scroll locking to the page. That removes the
   browser scrollbar and causes the header/content to jump.

   A normal site navigation menu should not lock page scroll.
========================================================= */

function EnterpriseMenu({
  label,
  active,
  links,
  introTitle,
  introDescription,
  footerLabel,
  footerDescription,
  footerHref,
}: {
  label: string;
  active: boolean;
  links: MenuLink[];
  introTitle: string;
  introDescription: string;
  footerLabel: string;
  footerDescription: string;
  footerHref: string;
}) {
  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className={[
            "flex h-full items-center gap-1.5 px-3 text-[0.78rem] font-medium xl:px-4 xl:text-[0.8rem]",
            "transition-opacity duration-150",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-secondary-highlight/15",
            "dark:focus-visible:ring-secondary/15",
            active
              ? "text-foreground"
              : "text-muted-foreground hover:text-foreground hover:opacity-80",
          ].join(" ")}
        >
          {label}

          <ChevronDownIcon size={12} className="text-muted-foreground" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="start"
        sideOffset={8}
        collisionPadding={16}
        className={["w-[420px] p-2", dropdownSurface].join(" ")}
      >
        <div className="px-3 pb-3 pt-2">
          <p className="text-xs font-semibold text-foreground">{introTitle}</p>

          <p className="mt-1.5 max-w-sm text-[0.63rem] leading-5 text-muted-foreground">
            {introDescription}
          </p>
        </div>

        <DropdownMenuSeparator className="bg-border/60" />

        <div className="space-y-0.5 py-1">
          {links.map((item) => (
            <EnterpriseMenuItem key={item.href} item={item} />
          ))}
        </div>

        <DropdownMenuSeparator className="bg-border/60" />

        <DropdownMenuItem
          asChild
          className="rounded-lg p-0 focus:bg-surface-3/60 dark:focus:bg-surface-3/70"
        >
          <Link
            to={footerHref}
            className="flex items-center justify-between gap-4 px-3 py-3"
          >
            <div>
              <p className="text-xs font-semibold text-foreground">
                {footerLabel}
              </p>

              <p className="mt-0.5 text-[0.61rem] text-muted-foreground">
                {footerDescription}
              </p>
            </div>

            <ArrowRightIcon
              size={13}
              className="shrink-0 text-muted-foreground"
            />
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

/* =========================================================
   ENTERPRISE MENU ITEM
========================================================= */

function EnterpriseMenuItem({ item }: { item: MenuLink }) {
  const Icon = item.icon;

  return (
    <DropdownMenuItem
      asChild
      className="rounded-lg p-0 focus:bg-surface-3/60 dark:focus:bg-surface-3/70"
    >
      <Link to={item.href} className="flex items-start gap-3 px-3 py-3">
        <span
          className={[
            "mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
            accentIconSurface,
          ].join(" ")}
        >
          <Icon size={14} />
        </span>

        <span className="min-w-0 flex-1">
          <span className="flex items-center gap-2">
            <span className="text-xs font-semibold text-foreground">
              {item.title}
            </span>

            {item.comingSoon && (
              <span className="rounded-md border border-border/60 bg-surface-2/50 px-1.5 py-0.5 text-[0.48rem] font-semibold uppercase tracking-[0.08em] text-muted-foreground dark:bg-surface-2/70">
                Coming soon
              </span>
            )}
          </span>

          <span className="mt-1 block text-[0.62rem] leading-5 text-muted-foreground">
            {item.description}
          </span>
        </span>
      </Link>
    </DropdownMenuItem>
  );
}

/* =========================================================
   MOBILE SECTION
========================================================= */

function MobileMenuSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="border-b border-border/60 py-5">
      <p className="text-[0.52rem] font-semibold uppercase tracking-[0.15em] text-muted-foreground">
        {title}
      </p>

      <nav className="mt-2">{children}</nav>
    </section>
  );
}

/* =========================================================
   MOBILE LINK
========================================================= */

function MobileNavigationLink({
  label,
  href,
  onClick,
  badge,
}: {
  label: string;
  href: string;
  onClick: () => void;
  badge?: string;
}) {
  return (
    <NavLink
      to={href}
      onClick={onClick}
      className={({ isActive }) =>
        [
          "flex min-h-[48px] items-center justify-between gap-4",
          "text-sm font-medium transition-opacity duration-150",
          isActive
            ? "text-foreground"
            : "text-foreground/70 hover:text-foreground hover:opacity-75",
        ].join(" ")
      }
    >
      {({ isActive }) => (
        <>
          <span className="flex min-w-0 items-center gap-3">
            <span
              aria-hidden
              className={[
                "h-1.5 w-5 shrink-0 rounded-full",
                isActive
                  ? "bg-brand-secondary-highlight dark:bg-secondary"
                  : "bg-border",
              ].join(" ")}
            />

            <span className="truncate">{label}</span>
          </span>

          <span className="flex shrink-0 items-center gap-2">
            {badge && (
              <span className="rounded-md bg-surface-2/70 px-1.5 py-0.5 text-[0.48rem] font-semibold uppercase tracking-[0.08em] text-muted-foreground dark:bg-surface-2">
                {badge}
              </span>
            )}

            <ArrowRightIcon size={13} className="text-muted-foreground" />
          </span>
        </>
      )}
    </NavLink>
  );
}

/* =========================================================
   MOBILE ACCOUNT
========================================================= */

function MobileAccountSummary({
  user,
  initials,
  onProfile,
}: {
  user: AccountUser;
  initials: string;
  onProfile: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onProfile}
      className={[
        "flex w-full items-center gap-3 border-b border-border/60 py-5 text-left",
        "transition-opacity duration-150 hover:opacity-80",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-secondary-highlight/15",
        "dark:focus-visible:ring-secondary/15",
      ].join(" ")}
    >
      <Avatar className="h-10 w-10 shrink-0 border border-border/80">
        <AvatarImage
          src={user.avatarUrl}
          alt={user.fullName ? `${user.fullName}'s profile` : "User profile"}
          className="object-cover"
        />

        <AvatarFallback
          className={[
            "bg-surface-3/70 text-xs font-semibold text-brand-secondary-highlight",
            "dark:bg-surface-2 dark:text-secondary",
          ].join(" ")}
        >
          {user.fullName ? initials : <UserCircleIcon size={17} />}
        </AvatarFallback>
      </Avatar>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-foreground">
          {user.fullName || "Allocatr user"}
        </p>

        <p className="mt-0.5 truncate text-[0.68rem] text-muted-foreground">
          {user.email ||
            (user.isAllocat ? "Allocat account" : "Client account")}
        </p>
      </div>

      <ArrowRightIcon size={13} className="shrink-0 text-muted-foreground" />
    </button>
  );
}

/* =========================================================
   ACCOUNT MENU

   modal={false} is also required here so opening the account
   dropdown never removes the browser scrollbar.
========================================================= */

function AccountMenu({
  user,
  initials,
  loggingOut,
  onProjects,
  onProfile,
  onSettings,
  onLogout,
}: AccountMenuProps) {
  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label="Open account menu"
          className={[
            "flex h-9 items-center gap-2 rounded-lg px-1.5 text-foreground",
            "transition-colors duration-150 hover:bg-surface-3/55",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-secondary-highlight/15",
            "dark:hover:bg-surface-3/65 dark:focus-visible:ring-secondary/15",
          ].join(" ")}
        >
          <Avatar className="h-7 w-7 border border-border/80">
            <AvatarImage
              src={user.avatarUrl}
              alt={
                user.fullName ? `${user.fullName}'s profile` : "User profile"
              }
              className="object-cover"
            />

            <AvatarFallback
              className={[
                "bg-surface-3/70 text-[0.62rem] font-semibold text-brand-secondary-highlight",
                "dark:bg-surface-2 dark:text-secondary",
              ].join(" ")}
            >
              {user.fullName ? initials : <UserCircleIcon size={15} />}
            </AvatarFallback>
          </Avatar>

          <span className="hidden max-w-28 truncate text-xs font-semibold xl:block">
            {user.fullName || "Account"}
          </span>

          <ChevronDownIcon
            size={11}
            className="hidden shrink-0 text-muted-foreground xl:block"
          />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        sideOffset={10}
        collisionPadding={16}
        className={["w-64 p-1.5", dropdownSurface].join(" ")}
      >
        <DropdownMenuLabel className="p-3 font-normal">
          <div className="flex min-w-0 items-center gap-3">
            <Avatar className="h-10 w-10 shrink-0 border border-border">
              <AvatarImage
                src={user.avatarUrl}
                alt={
                  user.fullName ? `${user.fullName}'s profile` : "User profile"
                }
                className="object-cover"
              />

              <AvatarFallback
                className={[
                  "bg-surface-3/70 text-xs font-semibold text-brand-secondary-highlight",
                  "dark:bg-surface-2 dark:text-secondary",
                ].join(" ")}
              >
                {user.fullName ? initials : <UserCircleIcon size={17} />}
              </AvatarFallback>
            </Avatar>

            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-foreground">
                {user.fullName || "Allocatr user"}
              </p>

              {user.email && (
                <p className="mt-1 truncate text-[0.68rem] text-muted-foreground">
                  {user.email}
                </p>
              )}

              <p className="mt-1 text-[0.58rem] font-medium text-muted-foreground">
                {user.isAllocat ? "Allocat account" : "Client account"}
              </p>
            </div>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator className="bg-border/60" />

        <DropdownMenuItem onSelect={onProjects} className={dropdownItem}>
          <FolderOpenIcon size={14} />
          Projects
        </DropdownMenuItem>

        <DropdownMenuGroup>
          <DropdownMenuItem onSelect={onProfile} className={dropdownItem}>
            <User2Icon size={14} />
            {user.isAllocat ? "Allocat profile" : "Profile"}
          </DropdownMenuItem>

          <DropdownMenuItem onSelect={onSettings} className={dropdownItem}>
            <SettingsIcon size={14} />
            Settings
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator className="bg-border/60" />

        <DropdownMenuItem
          disabled={loggingOut}
          onSelect={(event) => {
            event.preventDefault();
            void onLogout();
          }}
          className={[
            "rounded-lg px-2.5 py-2 font-medium text-muted-foreground",
            "transition-colors duration-150",
            "focus:bg-destructive/[0.07] focus:text-destructive",
            "dark:focus:bg-destructive/[0.10] dark:focus:text-destructive",
          ].join(" ")}
        >
          <LogOutIcon size={14} />
          {loggingOut ? "Logging out..." : "Log out"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default SiteHeader;
