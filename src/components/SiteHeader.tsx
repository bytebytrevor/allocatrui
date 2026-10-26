import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type FormEvent,
} from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
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
  LogOutIcon,
  SearchIcon,
  RocketIcon,
  SettingsIcon,
  ShieldCheckIcon,
  SparklesIcon,
  User2Icon,
  UserCircleIcon,
  UsersIcon,
  MenuIcon,
  XIcon,
  LogInIcon,
  CompassIcon,
  PawPrintIcon,
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
  "--menu-platform": "var(--brand-cyan)",
  "--menu-solutions": "var(--brand-primary)",
  "--menu-resources": "var(--brand-amber)",
  "--secondary": "var(--brand-primary)",
  "--secondary-foreground": "var(--brand-charcoal)",
  "--brand-secondary-highlight": "var(--brand-primary)",
} as CSSProperties;
const HeaderThemeContext = createContext(false);
const actionBase =
  "inline-flex items-center justify-center gap-2 rounded-lg border text-xs font-medium shadow-none transition-opacity duration-150 motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background";
// Set the pair directly as well as through utilities: the landing palette
// changes the accent to lime, so inherited white foreground is unsuitable.
const LANDING_CTA_STYLE: CSSProperties = {
  backgroundColor: "var(--brand-primary)",
  color: "var(--brand-charcoal)",
  borderColor: "color-mix(in srgb, var(--brand-primary) 80%, transparent)",
};
const landingPrimary =
  "border-brand-primary/20 bg-brand-primary !text-[color:var(--brand-charcoal)] hover:bg-brand-primary hover:!text-[color:var(--brand-charcoal)] focus-visible:!text-[color:var(--brand-charcoal)] [&_span]:!text-inherit [&_svg]:!text-inherit hover:brightness-95 focus-visible:ring-brand-primary/60";
const autoPrimary =
  "border-brand-secondary-highlight/15 bg-brand-secondary-highlight text-primary-foreground hover:bg-brand-secondary-highlight hover:text-primary-foreground hover:opacity-90 focus-visible:ring-brand-secondary-highlight/20 dark:border-secondary/10 dark:bg-secondary dark:text-secondary-foreground dark:hover:bg-secondary dark:hover:text-secondary-foreground dark:focus-visible:ring-secondary/20";
const ghostAction =
  "border-transparent bg-transparent text-muted-foreground hover:text-foreground hover:opacity-80 focus-visible:ring-ring/25";
const itemStyle =
  "min-h-11 gap-3 rounded-lg px-3 py-2.5 text-xs text-foreground/85 transition-colors duration-150 focus:bg-surface-3/70 focus:!text-foreground data-[highlighted]:bg-surface-3/70 data-[highlighted]:!text-foreground motion-reduce:transition-none";
const dropdownSurface =
  "[--menu-platform:var(--brand-secondary-highlight)] [--menu-solutions:color-mix(in_srgb,var(--brand-primary-muted)_45%,var(--brand-charcoal))] [--menu-resources:color-mix(in_srgb,var(--brand-amber)_40%,var(--brand-charcoal))] dark:[--menu-solutions:var(--brand-primary-muted)] dark:[--menu-resources:var(--brand-amber)] z-[150] rounded-2xl border border-border/80 bg-popover text-popover-foreground shadow-[0_18px_55px_-18px_color-mix(in_srgb,var(--brand-charcoal)_35%,transparent)] origin-[var(--radix-dropdown-menu-content-transform-origin)] data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0 duration-150 motion-reduce:animate-none";
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
type SearchLayout = "small" | "tablet" | "desktop";
function getSearchLayout(width: number): SearchLayout {
  return width < 640 ? "small" : width < 1024 ? "tablet" : "desktop";
}
export default function SiteHeader({ appearance = "auto" }: SiteHeaderProps) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const landing = appearance === "landing" || location.pathname === "/";
  const [isScrolled, setIsScrolled] = useState(false);
  const [exploreOpen, setExploreOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const searchTriggerRef = useRef<HTMLButtonElement>(null);
  const floatingSearchRef = useRef<HTMLDivElement>(null);
  const inlineSearchRef = useRef<HTMLDivElement>(null);
  const [searchLayout, setSearchLayout] = useState<SearchLayout>(() =>
    typeof window === "undefined"
      ? "small"
      : getSearchLayout(window.innerWidth),
  );
  const reducedMotion = useReducedMotion();
  const [query, setQuery] = useState(() =>
    location.pathname === "/discover"
      ? (new URLSearchParams(location.search).get("search") ?? "")
      : "",
  );
  const initials = useMemo(() => getInitials(user?.fullName), [user?.fullName]);
  const filteredSolutionLinks = useMemo(
    () =>
      user?.isAllocat
        ? solutionLinks.filter((item) => item.href !== "/become-an-allocat")
        : solutionLinks,
    [user?.isAllocat],
  );
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 12);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  useEffect(() => {
    setExploreOpen(false);
    setMobileMenuOpen(false);
    setMobileSearchOpen(false);
    if (location.pathname === "/discover") {
      setQuery(new URLSearchParams(location.search).get("search") ?? "");
    }
  }, [location.pathname, location.search]);
  useEffect(() => {
    const smallBoundary = window.matchMedia("(min-width: 640px)");
    const desktopBoundary = window.matchMedia("(min-width: 1024px)");
    function updateLayout() {
      setSearchLayout(getSearchLayout(window.innerWidth));
      setMobileSearchOpen(false);
      setMobileMenuOpen(false);
      setExploreOpen(false);
    }
    updateLayout();
    smallBoundary.addEventListener("change", updateLayout);
    desktopBoundary.addEventListener("change", updateLayout);
    return () => {
      smallBoundary.removeEventListener("change", updateLayout);
      desktopBoundary.removeEventListener("change", updateLayout);
    };
  }, []);
  useEffect(() => {
    if (!mobileSearchOpen) return;
    function dismiss(event: PointerEvent) {
      const target = event.target;
      if (!(target instanceof Node)) return;
      if (
        !floatingSearchRef.current?.contains(target) &&
        !inlineSearchRef.current?.contains(target) &&
        !searchTriggerRef.current?.contains(target)
      ) {
        setMobileSearchOpen(false);
      }
    }
    function escape(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      setMobileSearchOpen(false);
      searchTriggerRef.current?.focus();
    }
    function dismissOnFocus(event: FocusEvent) {
      const target = event.target;
      if (!(target instanceof Node)) return;
      if (
        !floatingSearchRef.current?.contains(target) &&
        !inlineSearchRef.current?.contains(target) &&
        !searchTriggerRef.current?.contains(target)
      )
        setMobileSearchOpen(false);
    }
    document.addEventListener("focusin", dismissOnFocus);
    document.addEventListener("pointerdown", dismiss);
    document.addEventListener("keydown", escape);
    return () => {
      document.removeEventListener("focusin", dismissOnFocus);
      document.removeEventListener("pointerdown", dismiss);
      document.removeEventListener("keydown", escape);
    };
  }, [mobileSearchOpen]);
  const goTo = (href: string) => {
    setExploreOpen(false);
    setMobileMenuOpen(false);
    setMobileSearchOpen(false);
    navigate(href);
  };
  const postProjectHref = user ? "/projects/new" : "/register";
  async function handleLogout() {
    if (loggingOut) return;
    setLoggingOut(true);
    setMobileMenuOpen(false);
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
  const container = landing
    ? "max-w-[1440px] px-5 sm:px-8 lg:px-14 xl:px-20"
    : "max-w-7xl px-4 sm:px-6 md:px-8 xl:px-10";
  const accountActions = {
    initials,
    loggingOut,
    onProjects: () => goTo("/projects"),
    onProfile: () => goTo(user?.isAllocat ? "/allocats/profile" : "/profile"),
    onSettings: () => goTo("/settings"),
    onLogout: () => void handleLogout(),
  };
  return (
    <HeaderThemeContext.Provider value={landing}>
      {/* This component reserves its own fixed-header space on every route. */}
      <div aria-hidden="true" className="h-16 w-full" />
      <header
        style={landing ? LANDING_NAV_TOKENS : undefined}
        className={`fixed inset-x-0 top-0 z-[120] border-b bg-background text-foreground transition-[border-color,box-shadow] duration-200 motion-reduce:transition-none ${isScrolled ? "border-border/65 shadow-[0_4px_20px_-12px_color-mix(in_srgb,var(--brand-charcoal)_30%,transparent)]" : "border-transparent"}`}
      >
        <div
          className={`mx-auto flex h-16 w-full items-center justify-between gap-3 lg:gap-4 ${container}`}
        >
          <Link
            to="/"
            aria-label="Allocatr home"
            className="group flex h-11 shrink-0 items-center rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30"
          >
            {landing ? (
              <img
                src={allocatrLogoLight}
                alt="Allocatr"
                className="h-[23px] w-auto object-contain group-hover:opacity-80 sm:h-[25px]"
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
          <div className="hidden min-w-0 lg:mx-2 lg:block lg:max-w-[480px] lg:flex-1 xl:mx-6 xl:max-w-[520px]">
            <NavSearch query={query} onQueryChange={setQuery} />
          </div>
          <AnimatePresence initial={false}>
            {mobileSearchOpen && searchLayout === "tablet" && (
              <motion.div
                key="tablet-search"
                ref={inlineSearchRef}
                id="tablet-nav-search"
                className="hidden min-w-0 flex-1 sm:block lg:hidden"
                initial={{ opacity: 0, y: reducedMotion ? 0 : -3 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: reducedMotion ? 0 : -3 }}
                transition={{
                  duration: reducedMotion ? 0 : 0.16,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                <NavSearch
                  query={query}
                  onQueryChange={setQuery}
                  autoFocus
                  onSubmitted={() => {
                    setMobileSearchOpen(false);
                    searchTriggerRef.current?.focus();
                  }}
                />
              </motion.div>
            )}
          </AnimatePresence>
          <nav
            aria-label="Primary navigation"
            className="hidden shrink-0 lg:block"
          >
            <ExploreMenu
              links={filteredSolutionLinks}
              open={exploreOpen}
              onOpenChange={setExploreOpen}
            />
          </nav>
          <span
            aria-hidden="true"
            className="hidden h-5 w-px shrink-0 bg-border/45 lg:block"
          />
          <div className="hidden min-w-0 items-center justify-end gap-2 lg:flex lg:shrink-0">
            {!user && (
              <Link
                to="/login"
                className={`${actionBase} ${ghostAction} h-10 whitespace-nowrap px-1.5 sm:px-3`}
              >
                Log in
              </Link>
            )}
            <Link
              to={postProjectHref}
              aria-label="Post a project"
              style={landing ? LANDING_CTA_STYLE : undefined}
              className={`${cta} h-11 whitespace-nowrap px-3 sm:px-4`}
            >
              <span
                style={landing ? { color: "inherit" } : undefined}
                className="sm:hidden"
              >
                Post
              </span>
              <span
                style={landing ? { color: "inherit" } : undefined}
                className="hidden sm:inline"
              >
                Post a project
              </span>
            </Link>
            {user && <AccountMenu user={user} {...accountActions} />}
          </div>
          <div className="flex shrink-0 items-center gap-1.5 lg:hidden">
            <button
              ref={searchTriggerRef}
              type="button"
              aria-label={mobileSearchOpen ? "Close search" : "Open search"}
              aria-expanded={mobileSearchOpen}
              aria-controls={
                mobileSearchOpen
                  ? searchLayout === "tablet"
                    ? "tablet-nav-search"
                    : "mobile-nav-search"
                  : undefined
              }
              onClick={() => {
                setMobileMenuOpen(false);
                setMobileSearchOpen((value) => !value);
              }}
              className={`${actionBase} ${ghostAction} h-11 w-11`}
            >
              {mobileSearchOpen ? (
                <XIcon size={20} aria-hidden="true" />
              ) : (
                <SearchIcon size={20} aria-hidden="true" />
              )}
            </button>
            <MobileMenu
              user={user}
              links={filteredSolutionLinks}
              postProjectHref={postProjectHref}
              open={mobileMenuOpen}
              onOpenChange={(open) => {
                setMobileMenuOpen(open);
                if (open) setMobileSearchOpen(false);
              }}
              {...accountActions}
            />
          </div>
        </div>
        <AnimatePresence initial={false}>
          {mobileSearchOpen && searchLayout === "small" && (
            <motion.div
              key="mobile-search"
              ref={floatingSearchRef}
              id="mobile-nav-search"
              role="region"
              aria-label="Search Allocats"
              className="absolute inset-x-4 top-[76px] rounded-2xl border border-border/80 bg-popover p-4 text-popover-foreground shadow-[0_16px_40px_-16px_color-mix(in_srgb,var(--brand-charcoal)_35%,transparent)] sm:hidden"
              initial={{
                opacity: 0,
                y: reducedMotion ? 0 : -8,
                scale: reducedMotion ? 1 : 0.98,
              }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{
                opacity: 0,
                y: reducedMotion ? 0 : -6,
                scale: reducedMotion ? 1 : 0.98,
              }}
              transition={{
                duration: reducedMotion ? 0 : 0.2,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <div className="mb-2 flex items-center justify-between gap-3">
                <p className="text-xs font-medium">Find the right Allocat</p>
                <button
                  type="button"
                  aria-label="Close search"
                  onClick={() => {
                    setMobileSearchOpen(false);
                    searchTriggerRef.current?.focus();
                  }}
                  className={`${actionBase} ${ghostAction} h-10 w-10`}
                >
                  <XIcon size={16} aria-hidden="true" />
                </button>
              </div>
              <NavSearch
                query={query}
                onQueryChange={setQuery}
                autoFocus
                onSubmitted={() => {
                  setMobileSearchOpen(false);
                  searchTriggerRef.current?.focus();
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </HeaderThemeContext.Provider>
  );
}
function ExploreMenu({
  links,
  open,
  onOpenChange,
}: {
  links: MenuLink[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { portalStyle, accent, iconSurface } = useNavAppearance();
  const groups = [
    {
      label: "Platform",
      caption: "From brief to delivery",
      items: platformLinks,
    },
    { label: "Solutions", caption: "Find your way to work", items: links },
    {
      label: "Resources",
      caption: "Guidance at every step",
      items: resourceLinks,
    },
  ];
  return (
    <DropdownMenu modal={false} open={open} onOpenChange={onOpenChange}>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="group inline-flex h-10 shrink-0 items-center gap-2 rounded-lg border border-transparent px-3 text-xs font-medium text-foreground/85 transition-colors duration-150 hover:bg-surface-2 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30 data-[state=open]:bg-surface-2 data-[state=open]:text-foreground motion-reduce:transition-none"
        >
          <CompassIcon
            size={16}
            strokeWidth={1.7}
            aria-hidden="true"
            className={accent}
          />
          Explore
          <ChevronDownIcon
            size={12}
            aria-hidden="true"
            className="text-muted-foreground transition-transform duration-150 group-data-[state=open]:rotate-180 motion-reduce:transition-none"
          />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        aria-label="Explore Allocatr"
        align="end"
        sideOffset={14}
        collisionPadding={20}
        style={portalStyle}
        className={`${dropdownSurface} max-h-[min(82dvh,var(--radix-dropdown-menu-content-available-height))] w-[900px] max-w-[calc(100vw-40px)] overflow-y-auto p-3 sm:p-4`}
      >
        <DropdownMenuItem
          asChild
          className="group rounded-xl p-0 focus:bg-surface-2"
        >
          <Link
            to="/discover"
            className="flex items-center gap-4 rounded-xl border border-border/65 bg-surface-2/65 px-5 py-4 outline-none transition-opacity duration-150 hover:opacity-85 data-[highlighted]:opacity-85 motion-reduce:transition-none"
          >
            <span
              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${iconSurface}`}
            >
              <UsersIcon size={21} strokeWidth={1.7} aria-hidden="true" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-sm font-medium tracking-[-0.015em]">
                Discover Allocats
              </span>
              <span className="mt-1 block text-xs leading-5 text-muted-foreground">
                Find the right skills for what needs doing.
              </span>
            </span>
            <ArrowRightIcon
              size={17}
              aria-hidden="true"
              className={`shrink-0 ${accent}`}
            />
          </Link>
        </DropdownMenuItem>
        <div className="my-4 grid sm:grid-cols-3 sm:divide-x sm:divide-border/60">
          {groups.map(({ label, caption, items }) => (
            <DropdownMenuGroup
              key={label}
              className="min-w-0 px-1 first:pl-0 last:pr-0 sm:px-3"
            >
              <DropdownMenuLabel className="px-3 pb-3 pt-2 font-normal">
                <span className="block text-[10px] font-medium uppercase tracking-[0.12em] text-muted-foreground">
                  {label}
                </span>
                <span className="mt-1.5 block text-xs font-medium text-foreground/85">
                  {caption}
                </span>
              </DropdownMenuLabel>
              {items.map((item) => (
                <EnterpriseMenuItem key={item.href} item={item} />
              ))}
            </DropdownMenuGroup>
          ))}
        </div>
        <DropdownMenuSeparator className="mx-0 mb-2 bg-border/65" />
        <div className="flex items-center justify-between gap-4">
          <DropdownMenuItem
            asChild
            className="rounded-lg p-0 focus:bg-surface-2"
          >
            <Link
              to="/about"
              className="flex min-h-10 items-center gap-2 px-3 text-xs font-medium"
            >
              Why Allocatr?
              <ArrowRightIcon size={13} aria-hidden="true" className={accent} />
            </Link>
          </DropdownMenuItem>
          <span className="flex items-center gap-2 pr-3 text-[10px] text-muted-foreground">
            <PawPrintIcon size={12} aria-hidden="true" className={accent} />
            Work, properly allocated
          </span>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
function MobileMenu({
  user,
  links,
  postProjectHref,
  open,
  onOpenChange,
  initials,
  loggingOut,
  onProjects,
  onProfile,
  onSettings,
  onLogout,
}: {
  user?: AccountUser | null;
  links: MenuLink[];
  postProjectHref: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
} & Omit<AccountMenuProps, "user">) {
  const { portalStyle, landing } = useNavAppearance();
  return (
    <DropdownMenu modal={false} open={open} onOpenChange={onOpenChange}>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label={open ? "Close navigation" : "Open navigation"}
          className={`${actionBase} ${ghostAction} h-11 w-11`}
        >
          {open ? (
            <XIcon size={21} aria-hidden="true" />
          ) : (
            <MenuIcon size={21} aria-hidden="true" />
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        sideOffset={12}
        collisionPadding={16}
        style={portalStyle}
        className={`${dropdownSurface} w-[380px] max-w-[calc(100vw-32px)] max-h-[min(80dvh,var(--radix-dropdown-menu-content-available-height))] overscroll-contain overflow-y-auto p-3 lg:hidden`}
      >
        <DropdownMenuItem asChild className="rounded-lg p-0">
          <Link
            to={postProjectHref}
            style={
              landing
                ? LANDING_CTA_STYLE
                : {
                    backgroundColor: "var(--menu-cta-bg)",
                    color: "var(--menu-cta-text)",
                    borderColor:
                      "color-mix(in srgb, var(--menu-cta-bg) 80%, transparent)",
                  }
            }
            className={`${actionBase} ${landing ? landingPrimary : ""} mb-2 min-h-11 w-full hover:opacity-90 focus:opacity-90 data-[highlighted]:opacity-90 motion-reduce:transition-none ${
              landing
                ? "[--menu-cta-bg:var(--brand-primary)] [--menu-cta-text:var(--brand-charcoal)]"
                : "[--menu-cta-bg:var(--brand-secondary-highlight)] [--menu-cta-text:var(--primary-foreground)] dark:[--menu-cta-bg:var(--secondary)] dark:[--menu-cta-text:var(--secondary-foreground)]"
            }`}
          >
            <BriefcaseBusinessIcon
              size={15}
              aria-hidden="true"
              style={{
                color: landing
                  ? "var(--brand-charcoal)"
                  : "var(--menu-cta-text)",
              }}
              className="text-inherit"
            />
            Post a project
          </Link>
        </DropdownMenuItem>
        {!user ? (
          <DropdownMenuItem asChild className={itemStyle}>
            <Link to="/login">
              <LogInIcon size={15} />
              Log in
            </Link>
          </DropdownMenuItem>
        ) : (
          <>
            <DropdownMenuLabel className="flex items-center gap-3 px-3 py-3 font-normal">
              <UserAvatar user={user} initials={initials} size="h-9 w-9" />
              <span className="min-w-0">
                <span className="block truncate text-xs font-medium">
                  {user.fullName || "Account"}
                </span>
                {user.email && (
                  <span className="block truncate text-[11px] text-muted-foreground">
                    {user.email}
                  </span>
                )}
              </span>
            </DropdownMenuLabel>
            <DropdownMenuItem onSelect={onProjects} className={itemStyle}>
              <FolderOpenIcon size={14} />
              Projects
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={onProfile} className={itemStyle}>
              <User2Icon size={14} />
              {user.isAllocat ? "Allocat profile" : "Profile"}
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={onSettings} className={itemStyle}>
              <SettingsIcon size={14} />
              Settings
            </DropdownMenuItem>
          </>
        )}
        <DropdownMenuSeparator className="bg-border/60" />
        <DropdownMenuItem asChild className={itemStyle}>
          <Link to="/discover">
            <UsersIcon size={15} />
            Discover Allocats
          </Link>
        </DropdownMenuItem>
        {[
          ["Platform", platformLinks],
          ["Solutions", links],
          ["Resources", resourceLinks],
        ].map(([label, items]) => (
          <DropdownMenuGroup key={String(label)}>
            <DropdownMenuLabel className="px-3 pb-1 pt-4 text-[10px] font-medium uppercase tracking-[0.12em] text-muted-foreground">
              {String(label)}
            </DropdownMenuLabel>
            {(items as MenuLink[]).map((item) => (
              <EnterpriseMenuItem key={item.href} item={item} compact />
            ))}
          </DropdownMenuGroup>
        ))}
        <DropdownMenuSeparator className="bg-border/60" />
        <DropdownMenuItem asChild className={itemStyle}>
          <Link to="/about">
            Why Allocatr?
            <ArrowRightIcon size={13} />
          </Link>
        </DropdownMenuItem>
        {user && (
          <DropdownMenuItem
            disabled={loggingOut}
            onSelect={(event) => {
              event.preventDefault();
              onLogout();
            }}
            className="min-h-11 gap-3 rounded-lg px-3 py-3 text-xs text-muted-foreground focus:bg-destructive/[0.07] focus:text-destructive"
          >
            <LogOutIcon size={14} />
            {loggingOut ? "Logging out…" : "Log out"}
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
function NavSearch({
  query,
  onQueryChange,
  autoFocus = false,
  onSubmitted,
}: {
  query: string;
  onQueryChange: (value: string) => void;
  autoFocus?: boolean;
  onSubmitted?: () => void;
}) {
  const navigate = useNavigate();
  const { accent } = useNavAppearance();
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (autoFocus) inputRef.current?.focus({ preventScroll: true });
  }, [autoFocus]);
  function submitSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const params = new URLSearchParams();
    const term = query.trim().replace(/\s+/g, " ");
    if (term) params.set("search", term);
    navigate({
      pathname: "/discover",
      search: params.size ? `?${params.toString()}` : "",
    });
    onSubmitted?.();
  }
  return (
    <form
      action="/discover"
      method="get"
      role="search"
      aria-label="Find Allocats"
      onSubmit={submitSearch}
      className="flex h-11 w-full min-w-0 items-center gap-1 rounded-lg border border-border/65 bg-surface-2/50 pl-3 pr-1 transition-[border-color,box-shadow] duration-150 focus-within:border-ring/45 focus-within:ring-2 focus-within:ring-ring/10 motion-reduce:transition-none"
    >
      <SearchIcon
        size={15}
        strokeWidth={1.7}
        aria-hidden="true"
        className="shrink-0 text-muted-foreground"
      />
      <input
        ref={inputRef}
        name="search"
        type="search"
        aria-label="Search skills or categories"
        value={query}
        onChange={(event) => onQueryChange(event.target.value)}
        autoComplete="off"
        enterKeyHint="search"
        placeholder="Search skills or categories"
        className="h-full min-w-0 flex-1 border-0 bg-transparent pl-1.5 pr-1 text-base text-foreground outline-none placeholder:text-muted-foreground/75 lg:text-xs [&::-webkit-search-cancel-button]:appearance-none"
      />
      {query && (
        <button
          type="button"
          aria-label="Clear search"
          onClick={() => {
            onQueryChange("");
            inputRef.current?.focus();
          }}
          className={`${actionBase} ${ghostAction} h-10 w-9 shrink-0 sm:h-9`}
        >
          <XIcon size={14} aria-hidden="true" />
        </button>
      )}
      <button
        type="submit"
        aria-label="Find Allocats"
        className={`${actionBase} h-9 w-9 shrink-0 border-transparent bg-surface-3/65 hover:opacity-75 focus-visible:ring-ring/30 ${accent}`}
      >
        <ArrowRightIcon size={16} strokeWidth={1.8} aria-hidden="true" />
      </button>
    </form>
  );
}
function EnterpriseMenuItem({
  item,
  compact = false,
}: {
  item: MenuLink;
  compact?: boolean;
}) {
  const Icon = item.icon;
  const itemColor = platformLinks.some((link) => link.href === item.href)
    ? "var(--menu-platform)"
    : solutionLinks.some((link) => link.href === item.href)
      ? "var(--menu-solutions)"
      : "var(--menu-resources)";
  const { pathname } = useLocation();
  const active = pathname === item.href;
  return (
    <DropdownMenuItem asChild className="rounded-lg p-0 focus:bg-transparent">
      <Link
        to={item.href}
        aria-current={active ? "page" : undefined}
        style={{ "--menu-item-color": itemColor } as CSSProperties}
        className={`group flex min-h-11 items-start gap-2.5 rounded-lg px-3 py-2.5 outline-none transition-colors duration-150 hover:bg-surface-3/45 data-[highlighted]:bg-surface-3/45 motion-reduce:transition-none ${active ? "bg-surface-3/65" : ""}`}
      >
        <span
          aria-hidden="true"
          style={{
            color: itemColor,
            backgroundColor:
              "color-mix(in srgb, var(--menu-item-color) 7%, transparent)",
          }}
          className={`flex shrink-0 items-center justify-center rounded-lg ${compact ? "h-6 w-6" : "mt-0.5 h-8 w-8"}`}
        >
          <Icon size={compact ? 16 : 17} strokeWidth={1.7} />
        </span>
        <span className="min-w-0 flex-1 self-center">
          <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <span className="text-xs font-medium leading-5 text-foreground">
              {item.title}
            </span>
            {item.comingSoon && (
              <span className="rounded border border-border/65 px-1.5 py-0.5 text-[8px] leading-3 text-muted-foreground">
                Coming soon
              </span>
            )}
          </span>
          {!compact && (
            <span className="mt-1 block text-[11px] leading-5 text-muted-foreground">
              {item.description}
            </span>
          )}
        </span>
        <ArrowRightIcon
          size={12}
          aria-hidden="true"
          className={`shrink-0 self-center text-muted-foreground transition-opacity duration-150 group-hover:opacity-100 group-data-[highlighted]:opacity-100 motion-reduce:transition-none ${active ? "opacity-100" : "opacity-0"}`}
        />
      </Link>
    </DropdownMenuItem>
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
          className="group flex h-10 items-center gap-2 rounded-lg border border-transparent px-2 text-foreground transition-colors duration-150 hover:bg-surface-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30 data-[state=open]:border-border/65 data-[state=open]:bg-surface-2 motion-reduce:transition-none"
        >
          <UserAvatar user={user} initials={initials} />
          <span className="hidden max-w-28 truncate text-xs font-medium xl:block">
            {user.fullName || "Account"}
          </span>
          <ChevronDownIcon
            size={11}
            aria-hidden="true"
            className="hidden text-muted-foreground transition-transform duration-150 group-data-[state=open]:rotate-180 motion-reduce:transition-none xl:block"
          />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        sideOffset={10}
        collisionPadding={16}
        style={portalStyle}
        className={`${dropdownSurface} w-72 max-w-[calc(100vw-32px)] p-2`}
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
              <p className="mt-1 text-[10px] text-muted-foreground">
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
          className="min-h-11 gap-3 rounded-lg px-3 py-2.5 text-xs text-muted-foreground transition-colors duration-150 focus:bg-destructive/[0.07] focus:text-destructive motion-reduce:transition-none"
        >
          <LogOutIcon size={14} />
          {loggingOut ? "Logging out..." : "Log out"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
