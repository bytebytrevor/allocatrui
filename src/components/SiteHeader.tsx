import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
type SiteHeaderProps = {
  /** Auto uses the fixed dark navigation on / and the app theme elsewhere. */
  appearance?: "auto" | "landing";
};

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

/* The header reads the hero canvas locally. Radix portals use the identical
   brand-token fallback because they do not inherit page-scoped variables. */
const LANDING_NAV_TOKENS = {
  colorScheme: "dark",
  "--nav-canvas":
    "var(--landing-hero-bg, color-mix(in srgb, var(--brand-charcoal) 34%, black))",
  "--background": "var(--nav-canvas)",
  "--foreground": "var(--primary-foreground)",
  "--card": "var(--nav-canvas)",
  "--card-foreground": "var(--primary-foreground)",
  "--popover": "var(--nav-canvas)",
  "--popover-foreground": "var(--primary-foreground)",
  "--surface-1": "var(--nav-canvas)",
  "--surface-2":
    "color-mix(in srgb, var(--nav-canvas) 92%, var(--primary-foreground))",
  "--surface-3":
    "color-mix(in srgb, var(--nav-canvas) 85%, var(--primary-foreground))",
  "--muted-foreground":
    "color-mix(in srgb, var(--primary-foreground) 72%, var(--nav-canvas))",
  "--border":
    "color-mix(in srgb, var(--primary-foreground) 16%, var(--nav-canvas))",
  "--ring": "var(--brand-primary)",
  "--secondary": "var(--brand-primary)",
  "--secondary-foreground": "var(--brand-charcoal)",
  "--brand-secondary-highlight": "var(--brand-primary)",
} as CSSProperties;

const HeaderThemeContext = createContext(false);

const actionBase =
  "inline-flex items-center justify-center gap-2 rounded-lg border text-xs font-medium shadow-none transition-opacity duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background";
const landingPrimary =
  "border-brand-primary/20 bg-brand-primary text-dark-gray hover:bg-brand-primary hover:text-dark-gray hover:opacity-90 focus-visible:ring-brand-primary/30";
const autoPrimary =
  "border-brand-secondary-highlight/15 bg-brand-secondary-highlight text-primary-foreground hover:bg-brand-secondary-highlight hover:text-primary-foreground hover:opacity-90 focus-visible:ring-brand-secondary-highlight/20 dark:border-secondary/10 dark:bg-secondary dark:text-secondary-foreground dark:hover:bg-secondary dark:hover:text-secondary-foreground dark:focus-visible:ring-secondary/20";
const secondaryAction =
  "border-border/65 bg-surface-2/35 text-foreground/75 hover:bg-surface-2/35 hover:text-foreground/75 hover:opacity-75 focus-visible:ring-ring/25";
const ghostAction =
  "border-transparent bg-transparent text-muted-foreground hover:text-foreground hover:opacity-80 focus-visible:ring-ring/25";
const itemStyle =
  "rounded-lg px-2.5 py-2 text-sm text-foreground/75 transition-colors duration-150 focus:bg-surface-3/60 focus:text-foreground";
const dropdownSurface =
  "z-[150] rounded-xl border border-border/70 bg-popover text-popover-foreground shadow-none origin-[var(--radix-dropdown-menu-content-transform-origin)] data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0 data-[state=open]:zoom-in-95 data-[state=closed]:zoom-out-95 motion-reduce:animate-none";

function useNavAppearance() {
  const landing = useContext(HeaderThemeContext);
  return {
    landing,
    portalStyle: landing ? LANDING_NAV_TOKENS : undefined,
    accent: landing
      ? "text-brand-primary"
      : "text-brand-secondary-highlight dark:text-secondary",
    iconSurface: landing
      ? "bg-brand-primary/[0.08] text-brand-primary ring-1 ring-inset ring-brand-primary/10"
      : "bg-brand-secondary-highlight/[0.08] text-brand-secondary-highlight ring-1 ring-inset ring-brand-secondary-highlight/10 dark:bg-secondary/[0.07] dark:text-secondary dark:ring-secondary/10",
  };
}

function getInitials(name?: string) {
  return name?.trim()
    ? name
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map((part) => part.charAt(0).toUpperCase())
        .join("")
    : "U";
}
function isPathWithin(pathname: string, prefixes: string[]) {
  return prefixes.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

export default function SiteHeader({ appearance = "auto" }: SiteHeaderProps) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const landing = appearance === "landing" || location.pathname === "/";
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const mobileRef = useRef<HTMLDivElement | null>(null);
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

  useEffect(() => {
    const root = document.documentElement;
    const previous = root.style.scrollbarGutter;
    root.style.scrollbarGutter = "stable";
    return () => {
      root.style.scrollbarGutter = previous;
    };
  }, []);
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 12);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  useEffect(() => {
    if (!isMenuOpen) return;
    const previousOverflow = document.body.style.overflow;
    const previousOverscroll = document.body.style.overscrollBehavior;
    document.body.style.overflow = "hidden";
    document.body.style.overscrollBehavior = "none";
    return () => {
      document.body.style.overflow = previousOverflow;
      document.body.style.overscrollBehavior = previousOverscroll;
    };
  }, [isMenuOpen]);
  useEffect(() => {
    const escape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsMenuOpen(false);
    };
    const resize = () => {
      if (window.innerWidth >= 1024) setIsMenuOpen(false);
    };
    window.addEventListener("keydown", escape);
    window.addEventListener("resize", resize);
    return () => {
      window.removeEventListener("keydown", escape);
      window.removeEventListener("resize", resize);
    };
  }, []);
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);
  useEffect(() => {
    if (isMenuOpen) mobileRef.current?.removeAttribute("inert");
    else mobileRef.current?.setAttribute("inert", "");
  }, [isMenuOpen]);

  const closeMenu = () => setIsMenuOpen(false);
  const goTo = (href: string) => {
    closeMenu();
    navigate(href);
  };
  const handleProjects = () => goTo("/projects");
  const handleProfile = () =>
    goTo(user?.isAllocat ? "/allocats/profile" : "/profile");
  const handleSettings = () => goTo("/settings");
  const postProjectHref = user ? "/projects/new" : "/register";
  async function handleLogout() {
    if (loggingOut) return;
    setLoggingOut(true);
    closeMenu();
    try {
      await logout();
      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setLoggingOut(false);
    }
  }

  const cta = `${actionBase} ${landing ? landingPrimary : autoPrimary}`;
  const navContainer = landing
    ? "mx-auto flex h-16 w-full max-w-[1440px] items-center justify-between px-5 sm:px-8 lg:px-14 xl:px-20"
    : "mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 md:px-8 xl:px-10";
  const drawerContainer = landing
    ? "mx-auto max-h-[calc(100dvh-64px)] w-full max-w-[1440px] overflow-y-auto px-5 pb-6 sm:px-8"
    : "mx-auto max-h-[calc(100dvh-64px)] w-full max-w-7xl overflow-y-auto px-4 pb-6 sm:px-6 md:px-8";
  const headerSurface = landing
    ? isScrolled || isMenuOpen
      ? "border-border/60 bg-background/95 backdrop-blur-xl"
      : "border-transparent bg-background"
    : isScrolled
      ? "border-border/60 bg-background/95 backdrop-blur-xl"
      : "border-transparent bg-background/90 backdrop-blur-xl";
  const accountActions = {
    initials,
    loggingOut,
    onProjects: handleProjects,
    onProfile: handleProfile,
    onSettings: handleSettings,
    onLogout: () => void handleLogout(),
  };

  return (
    <HeaderThemeContext.Provider value={landing}>
      {/* Fixed navigation needs real layout space on the full-screen landing hero. */}
      {landing && <div aria-hidden="true" className="h-16 w-full" />}
      <header
        style={landing ? LANDING_NAV_TOKENS : undefined}
        className={`fixed inset-x-0 top-0 z-[120] border-b text-foreground shadow-none transition-[background-color,border-color,backdrop-filter] duration-300 motion-reduce:transition-none ${headerSurface}`}
      >
        <div className={navContainer}>
          <Link
            to="/"
            onClick={closeMenu}
            aria-label="Allocatr home"
            className="group flex shrink-0 items-center rounded-md outline-none focus-visible:ring-2 focus-visible:ring-ring/30"
          >
            {landing ? (
              <img
                src={allocatrLogoLight}
                alt="Allocatr"
                className="h-[23px] w-auto object-contain transition-opacity duration-150 group-hover:opacity-80 sm:h-[25px]"
              />
            ) : (
              <>
                <img
                  src={allocatrIcon}
                  alt=""
                  className="h-7 w-7 object-contain sm:hidden"
                />
                <img
                  src={allocatrLogoDark}
                  alt="Allocatr"
                  className="hidden h-[25px] w-auto object-contain group-hover:opacity-80 sm:block dark:sm:hidden"
                />
                <img
                  src={allocatrLogoLight}
                  alt="Allocatr"
                  className="hidden h-[25px] w-auto object-contain group-hover:opacity-80 dark:sm:block"
                />
              </>
            )}
          </Link>

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
                `flex h-full items-center px-3 text-[0.78rem] font-medium transition-opacity xl:px-4 ${isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground hover:opacity-80"}`
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

          <div className="hidden items-center gap-1.5 lg:flex">
            {!user && (
              <Link
                to="/login"
                className={`${actionBase} ${ghostAction} h-9 px-3`}
              >
                Log in
              </Link>
            )}
            {/* Direct links avoid shared Button variant styles overriding contrast. */}
            <Link to={postProjectHref} className={`${cta} h-9 px-4`}>
              Post a project
            </Link>
            {user && (
              <>
                <span className="mx-1 h-5 w-px bg-border/65" />
                <AccountMenu user={user} {...accountActions} />
              </>
            )}
          </div>
          <button
            type="button"
            onClick={() => setIsMenuOpen((current) => !current)}
            aria-label={isMenuOpen ? "Close navigation" : "Open navigation"}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-navigation"
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-surface-3/55 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/25 lg:hidden"
          >
            {isMenuOpen ? <XIcon size={18} /> : <MenuIcon size={18} />}
          </button>
        </div>
      </header>

      <div
        ref={mobileRef}
        style={landing ? LANDING_NAV_TOKENS : undefined}
        className={`fixed inset-0 z-[110] transition-[opacity,visibility] duration-200 motion-reduce:transition-none lg:hidden ${isMenuOpen ? "pointer-events-auto visible opacity-100" : "pointer-events-none invisible opacity-0"}`}
        aria-hidden={!isMenuOpen}
      >
        <button
          type="button"
          onClick={closeMenu}
          aria-label="Close navigation"
          className="absolute inset-0 top-16 bg-background/55 backdrop-blur-[2px]"
        />
        <aside
          id="mobile-navigation"
          className={`absolute inset-x-0 top-16 border-b border-border/70 bg-background/98 text-foreground backdrop-blur-xl transition-[transform,opacity] duration-200 motion-reduce:transition-none ${isMenuOpen ? "translate-y-0 opacity-100" : "-translate-y-2 opacity-0"}`}
        >
          <div className={drawerContainer}>
            {user && (
              <MobileAccountSummary
                user={user}
                initials={initials}
                onProfile={handleProfile}
              />
            )}
            <MobileMenuSection title="Platform">
              {platformLinks.map((item) => (
                <MobileNavigationLink
                  key={item.href}
                  label={item.title}
                  href={item.href}
                  onClick={closeMenu}
                />
              ))}
            </MobileMenuSection>
            <MobileMenuSection title="Solutions">
              {filteredSolutionLinks.map((item) => (
                <MobileNavigationLink
                  key={item.href}
                  label={item.title}
                  href={item.href}
                  badge={item.comingSoon ? "Coming soon" : undefined}
                  onClick={closeMenu}
                />
              ))}
            </MobileMenuSection>
            <MobileMenuSection title="Discover">
              <MobileNavigationLink
                label="Discover Allocats"
                href="/discover"
                onClick={closeMenu}
              />
            </MobileMenuSection>
            <MobileMenuSection title="Resources">
              {resourceLinks.map((item) => (
                <MobileNavigationLink
                  key={item.href}
                  label={item.title}
                  href={item.href}
                  onClick={closeMenu}
                />
              ))}
            </MobileMenuSection>
            {user && (
              <div className="mt-6 border-t border-border/60 pt-5">
                <p className="text-[0.52rem] font-medium uppercase tracking-[0.15em] text-muted-foreground">
                  Your workspace
                </p>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  <Link
                    to="/projects"
                    onClick={closeMenu}
                    className={`${actionBase} ${secondaryAction} h-10`}
                  >
                    <FolderOpenIcon size={13} />
                    Projects
                  </Link>
                  <Link
                    to="/settings"
                    onClick={closeMenu}
                    className={`${actionBase} ${secondaryAction} h-10`}
                  >
                    <SettingsIcon size={13} />
                    Settings
                  </Link>
                </div>
              </div>
            )}
            <div
              className={`mt-6 grid gap-2.5 ${!user ? "sm:grid-cols-2" : ""}`}
            >
              {!user && (
                <Link
                  to="/login"
                  onClick={closeMenu}
                  className={`${actionBase} ${secondaryAction} h-11`}
                >
                  <LogInIcon size={14} />
                  Log in
                </Link>
              )}
              <Link
                to={postProjectHref}
                onClick={closeMenu}
                className={`${cta} h-11`}
              >
                Post a project
              </Link>
            </div>
            {user && (
              <button
                type="button"
                disabled={loggingOut}
                onClick={() => void handleLogout()}
                className="mt-6 flex w-full items-center justify-center gap-2 border-t border-border/60 pt-5 text-xs font-medium text-muted-foreground hover:text-destructive focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/25 disabled:pointer-events-none disabled:opacity-50"
              >
                <LogOutIcon size={13} />
                {loggingOut ? "Logging out..." : "Log out"}
              </button>
            )}
          </div>
        </aside>
      </div>
    </HeaderThemeContext.Provider>
  );
}

/* Non-modal Radix menus keep the page scrollbar and layout stable. */
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
  const { portalStyle } = useNavAppearance();
  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className={`group flex h-full items-center gap-1.5 px-3 text-[0.78rem] font-medium transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/25 data-[state=open]:text-foreground xl:px-4 ${active ? "text-foreground" : "text-muted-foreground hover:text-foreground hover:opacity-80"}`}
        >
          {label}
          <ChevronDownIcon
            size={12}
            className="text-muted-foreground transition-transform duration-200 group-data-[state=open]:rotate-180 motion-reduce:transition-none"
          />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        sideOffset={8}
        collisionPadding={16}
        style={portalStyle}
        className={`${dropdownSurface} w-[420px] max-w-[calc(100vw-32px)] p-2`}
      >
        <div className="px-3 pb-3 pt-2">
          <p className="text-xs font-medium text-foreground">{introTitle}</p>
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
          className="rounded-lg p-0 focus:bg-surface-3/60"
        >
          <Link
            to={footerHref}
            className="flex items-center justify-between gap-4 px-3 py-3"
          >
            <div>
              <p className="text-xs font-medium text-foreground">
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

function EnterpriseMenuItem({ item }: { item: MenuLink }) {
  const Icon = item.icon;
  const { iconSurface } = useNavAppearance();
  return (
    <DropdownMenuItem asChild className="rounded-lg p-0 focus:bg-surface-3/60">
      <Link to={item.href} className="flex items-start gap-3 px-3 py-3">
        <span
          className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${iconSurface}`}
        >
          <Icon size={14} />
        </span>
        <span className="min-w-0 flex-1">
          <span className="flex items-center gap-2">
            <span className="text-xs font-medium text-foreground">
              {item.title}
            </span>
            {item.comingSoon && (
              <span className="rounded-md border border-border/60 bg-surface-2/50 px-1.5 py-0.5 text-[0.48rem] font-medium uppercase tracking-[0.08em] text-muted-foreground">
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

function MobileMenuSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="border-b border-border/60 py-5">
      <p className="text-[0.52rem] font-medium uppercase tracking-[0.15em] text-muted-foreground">
        {title}
      </p>
      <nav className="mt-2" aria-label={title}>
        {children}
      </nav>
    </section>
  );
}

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
  const { landing } = useNavAppearance();
  return (
    <NavLink
      to={href}
      onClick={onClick}
      className={({ isActive }) =>
        `flex min-h-[48px] items-center justify-between gap-4 text-sm font-medium transition-opacity ${isActive ? "text-foreground" : "text-foreground/70 hover:text-foreground hover:opacity-75"}`
      }
    >
      {({ isActive }) => (
        <>
          <span className="flex min-w-0 items-center gap-3">
            <span
              aria-hidden="true"
              className={`h-1.5 w-5 shrink-0 rounded-full ${isActive ? (landing ? "bg-brand-primary" : "bg-brand-secondary-highlight dark:bg-secondary") : "bg-border"}`}
            />
            <span className="truncate">{label}</span>
          </span>
          <span className="flex shrink-0 items-center gap-2">
            {badge && (
              <span className="rounded-md bg-surface-2/70 px-1.5 py-0.5 text-[0.48rem] font-medium uppercase tracking-[0.08em] text-muted-foreground">
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

function UserAvatar({
  user,
  initials,
  size = "h-7 w-7",
}: {
  user: AccountUser;
  initials: string;
  size?: string;
}) {
  const { accent } = useNavAppearance();
  return (
    <Avatar className={`${size} shrink-0 border border-border/80`}>
      <AvatarImage
        src={user.avatarUrl}
        alt={user.fullName ? `${user.fullName}'s profile` : "User profile"}
        className="object-cover"
      />
      <AvatarFallback
        className={`bg-surface-3/70 text-xs font-medium ${accent}`}
      >
        {user.fullName ? initials : <UserCircleIcon size={16} />}
      </AvatarFallback>
    </Avatar>
  );
}

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
      className="flex w-full items-center gap-3 border-b border-border/60 py-5 text-left transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/25"
    >
      <UserAvatar user={user} initials={initials} size="h-10 w-10" />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-foreground">
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

function AccountMenu({
  user,
  initials,
  loggingOut,
  onProjects,
  onProfile,
  onSettings,
  onLogout,
}: AccountMenuProps) {
  const { portalStyle } = useNavAppearance();
  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label="Open account menu"
          className="flex h-9 items-center gap-2 rounded-lg px-1.5 text-foreground transition-colors hover:bg-surface-3/55 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/25"
        >
          <UserAvatar user={user} initials={initials} />
          <span className="hidden max-w-28 truncate text-xs font-medium xl:block">
            {user.fullName || "Account"}
          </span>
          <ChevronDownIcon
            size={11}
            className="hidden text-muted-foreground xl:block"
          />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        sideOffset={10}
        collisionPadding={16}
        style={portalStyle}
        className={`${dropdownSurface} w-64 p-1.5`}
      >
        <DropdownMenuLabel className="p-3 font-normal">
          <div className="flex min-w-0 items-center gap-3">
            <UserAvatar user={user} initials={initials} size="h-10 w-10" />
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-foreground">
                {user.fullName || "Allocatr user"}
              </p>
              {user.email && (
                <p className="mt-1 truncate text-[0.68rem] text-muted-foreground">
                  {user.email}
                </p>
              )}
              <p className="mt-1 text-[0.58rem] text-muted-foreground">
                {user.isAllocat ? "Allocat account" : "Client account"}
              </p>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-border/60" />
        <DropdownMenuItem onSelect={onProjects} className={itemStyle}>
          <FolderOpenIcon size={14} />
          Projects
        </DropdownMenuItem>
        <DropdownMenuGroup>
          <DropdownMenuItem onSelect={onProfile} className={itemStyle}>
            <User2Icon size={14} />
            {user.isAllocat ? "Allocat profile" : "Profile"}
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={onSettings} className={itemStyle}>
            <SettingsIcon size={14} />
            Settings
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator className="bg-border/60" />
        <DropdownMenuItem
          disabled={loggingOut}
          onSelect={(event) => {
            event.preventDefault();
            onLogout();
          }}
          className="rounded-lg px-2.5 py-2 text-muted-foreground transition-colors focus:bg-destructive/[0.07] focus:text-destructive"
        >
          <LogOutIcon size={14} />
          {loggingOut ? "Logging out..." : "Log out"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
