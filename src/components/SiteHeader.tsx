import { useEffect, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";

import {
  ArrowRightIcon,
  ArrowUpRightIcon,
  FolderOpenIcon,
  LogInIcon,
  LogOutIcon,
  MenuIcon,
  MoonIcon,
  SettingsIcon,
  SunIcon,
  User2Icon,
  UserCircleIcon,
  XIcon,
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

type Theme = "light" | "dark";

type NavigationItem = {
  label: string;
  href: string;
};

type AccountUser = {
  fullName?: string;
  email?: string;
  avatarUrl?: string;
  isAllocat?: boolean;
};

/* =========================================================
   NAVIGATION
========================================================= */

const landingNavigation: NavigationItem[] = [
  { label: "Explore", href: "/discover" },
  { label: "How it works", href: "/how-it-works" },
  { label: "Become an Allocat", href: "/become-an-allocat" },
];

const publicNavigation: NavigationItem[] = [
  { label: "About", href: "/about" },
  { label: "How it works", href: "/how-it-works" },
  { label: "Become an Allocat", href: "/become-an-allocat" },
  { label: "Contact", href: "/contact" },
];

/* =========================================================
   THEME POLICY

   Routes listed here have a fixed dark presentation.
   The user's saved dashboard/app theme is preserved.
========================================================= */

const fixedDarkRoutes = new Set(["/"]);

function getFixedTheme(pathname: string): Theme | null {
  return fixedDarkRoutes.has(pathname) ? "dark" : null;
}

/* =========================================================
   HELPERS
========================================================= */

function getInitialTheme(): Theme {
  if (typeof window === "undefined") return "light";

  const storedTheme = window.localStorage.getItem("theme");

  if (storedTheme === "light" || storedTheme === "dark") return storedTheme;

  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function applyDocumentTheme(theme: Theme) {
  const root = document.documentElement;

  root.classList.toggle("dark", theme === "dark");
  root.classList.toggle("light", theme === "light");
  root.style.colorScheme = theme;
}

function getInitials(name?: string) {
  if (!name) return "U";

  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map(part => part.charAt(0).toUpperCase())
    .join("");
}

/* =========================================================
   HEADER
========================================================= */

function SiteHeader() {
  const { user, logout } = useAuth();

  const location = useLocation();
  const navigate = useNavigate();

  const [theme, setTheme] = useState<Theme>(getInitialTheme);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const isLandingPage = location.pathname === "/";
  const fixedTheme = getFixedTheme(location.pathname);
  const activeTheme = fixedTheme ?? theme;
  const canToggleTheme = fixedTheme === null;

  const baseNavigation = isLandingPage ? landingNavigation : publicNavigation;

  const navigation = user?.isAllocat
    ? baseNavigation.filter(item => item.href !== "/become-an-allocat")
    : baseNavigation;

  const initials = getInitials(user?.fullName);

  /*
   * Logo follows the theme actually being displayed,
   * not simply the user's saved preference.
   *
   * dark surface  -> negative/light logo
   * light surface -> dark logo
   */
  const headerLogo =
    activeTheme === "dark"
      ? allocatrLogoLight
      : allocatrLogoDark;

  /* =======================================================
     THEME
  ======================================================= */

  useEffect(() => {
    applyDocumentTheme(activeTheme);

    /*
     * A fixed presentation theme must never replace the
     * user's normal application preference.
     */
    if (canToggleTheme) {
      window.localStorage.setItem("theme", theme);
    }
  }, [activeTheme, canToggleTheme, theme]);

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
     MOBILE MENU
  ======================================================= */

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;

    if (isMenuOpen) document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isMenuOpen]);

  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setIsMenuOpen(false);
    }

    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, []);

  useEffect(() => {
    function handleResize() {
      if (window.innerWidth >= 1024) setIsMenuOpen(false);
    }

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  /* =======================================================
     ACTIONS
  ======================================================= */

  function closeMenu() {
    setIsMenuOpen(false);
  }

  function toggleTheme() {
    if (!canToggleTheme) return;

    setTheme(currentTheme =>
      currentTheme === "dark" ? "light" : "dark",
    );
  }

  function handleLogin() {
    closeMenu();
    navigate("/login");
  }

  function handleCreateProject() {
    closeMenu();
    navigate(user ? "/projects/new" : "/register");
  }

  function handleProjects() {
    closeMenu();
    navigate("/projects");
  }

  function handleProfile() {
    closeMenu();
    navigate("/profile");
  }

  function handleSettings() {
    closeMenu();
    navigate("/settings");
  }

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

  /* =======================================================
     HEADER SURFACE
  ======================================================= */

  const scrolledSurface = isLandingPage
    ? [
        "border-white/[0.065]",
        "bg-[#08171C]/92",
        "shadow-[0_12px_42px_rgba(0,0,0,0.26)]",
      ].join(" ")
    : [
        "border-border/60",
        "bg-background/95",
        "shadow-[0_8px_32px_rgba(0,0,0,0.035)]",
        "dark:shadow-[0_10px_34px_rgba(0,0,0,0.20)]",
      ].join(" ");

  const initialSurface = isLandingPage
    ? "border-transparent bg-transparent"
    : "border-border/40 bg-background/85 backdrop-blur-xl";

  return (
    <>
      <header
        className={[
          "fixed inset-x-0 top-0 z-50 border-b",
          "transition-[background-color,border-color,box-shadow,backdrop-filter] duration-300",
          isScrolled
            ? [scrolledSurface, "backdrop-blur-2xl"].join(" ")
            : [initialSurface, "shadow-none"].join(" "),
        ].join(" ")}
      >
        <div
          className={[
            "mx-auto flex w-full max-w-7xl items-center justify-between",
            "h-14 px-4 sm:h-[60px] sm:px-6 md:px-8 xl:px-10",
          ].join(" ")}
        >
          {/* ===============================================
              LOGO
          =============================================== */}

          <Link
            to="/"
            onClick={closeMenu}
            className={[
              "group flex shrink-0 items-center outline-none",
              "focus-visible:ring-2 focus-visible:ring-[#DEDA00]/35",
              "focus-visible:ring-offset-4 focus-visible:ring-offset-transparent",
            ].join(" ")}
            aria-label="Allocatr home"
          >
            <img
              src={allocatrIcon}
              alt=""
              className="h-7 w-7 object-contain transition-opacity duration-200 group-hover:opacity-75 sm:hidden"
            />

            <img
              src={headerLogo}
              alt="Allocatr"
              className={[
                "hidden h-[25px] w-auto object-contain sm:block lg:h-[26px]",
                "transition-opacity duration-200 group-hover:opacity-75",
              ].join(" ")}
            />
          </Link>

          {/* ===============================================
              DESKTOP NAV
          =============================================== */}

          <nav className="hidden h-full items-center lg:flex" aria-label="Main navigation">
            {navigation.map(item => (
              <NavLink
                key={item.label}
                to={item.href}
                className={({ isActive }) =>
                  [
                    "group relative flex h-full items-center px-3 xl:px-4",
                    "text-[0.78rem] font-medium xl:text-[0.8rem]",
                    "transition-colors duration-200",
                    isLandingPage
                      ? isActive
                        ? "text-white"
                        : "text-white/48 hover:text-white"
                      : isActive
                        ? "text-foreground"
                        : "text-muted-foreground hover:text-foreground",
                  ].join(" ")
                }
              >
                {({ isActive }) => (
                  <>
                    {item.label}

                    <span
                      className={[
                        "absolute bottom-[7px] left-1/2 h-[2px] -translate-x-1/2 rounded-full",
                        "bg-[#DEDA00] transition-all duration-200",
                        isActive
                          ? "w-4 opacity-100"
                          : "w-0 opacity-0 group-hover:w-2.5 group-hover:opacity-45",
                      ].join(" ")}
                    />
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          {/* ===============================================
              DESKTOP ACTIONS
          =============================================== */}

          <div className="hidden items-center gap-1.5 lg:flex">
            {canToggleTheme && (
              <>
                <ThemeButton theme={theme} onToggle={toggleTheme} />
                <div className="mx-1 h-4 w-px bg-border/70" />
              </>
            )}

            {!user && (
              <Button
                type="button"
                variant="ghost"
                onClick={handleLogin}
                className={[
                  "h-9 rounded-lg px-3 text-xs font-semibold shadow-none",
                  isLandingPage
                    ? "text-white/52 hover:bg-white/[0.05] hover:text-white"
                    : "text-muted-foreground hover:bg-black/[0.04] hover:text-foreground dark:hover:bg-white/[0.055]",
                ].join(" ")}
              >
                Log in
              </Button>
            )}

            <Button
              type="button"
              onClick={handleCreateProject}
              className={[
                "group h-9 rounded-lg px-3.5 text-xs font-semibold shadow-none xl:px-4",
                isLandingPage
                  ? [
                      "border border-[#7DA6B1]/15",
                      "bg-[#0D566D] text-white",
                      "hover:bg-[#11657F] hover:text-white",
                    ].join(" ")
                  : [
                      "bg-[#303030] text-white",
                      "hover:bg-[#202020] hover:text-white",
                      "dark:bg-[#DEDA00] dark:text-[#202020]",
                      "dark:hover:bg-[#d3cf00] dark:hover:text-[#202020]",
                    ].join(" "),
              ].join(" ")}
            >
              Create project

              <ArrowUpRightIcon
                size={13}
                className={[
                  "transition-transform duration-200",
                  isLandingPage ? "text-[#DEDA00]" : "",
                  "group-hover:translate-x-0.5 group-hover:-translate-y-0.5",
                ].join(" ")}
              />
            </Button>

            {user && (
              <div className="ml-0.5">
                <AccountMenu
                  user={user}
                  initials={initials}
                  loggingOut={loggingOut}
                  landing={isLandingPage}
                  onProjects={handleProjects}
                  onProfile={handleProfile}
                  onSettings={handleSettings}
                  onLogout={handleLogout}
                />
              </div>
            )}
          </div>

          {/* ===============================================
              MOBILE ACTIONS
          =============================================== */}

          <div className="flex items-center gap-1 lg:hidden">
            {canToggleTheme && (
              <ThemeButton theme={theme} onToggle={toggleTheme} />
            )}

            <Button
              type="button"
              variant="ghost"
              size="icon"
              className={[
                "h-9 w-9 rounded-lg shadow-none",
                isLandingPage
                  ? "text-white hover:bg-white/[0.055] hover:text-white"
                  : "text-foreground hover:bg-black/[0.045] dark:hover:bg-white/[0.055]",
              ].join(" ")}
              onClick={() => setIsMenuOpen(current => !current)}
              aria-label={isMenuOpen ? "Close navigation" : "Open navigation"}
              aria-expanded={isMenuOpen}
              aria-controls="mobile-navigation"
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
          "transition-[opacity,visibility] duration-250",
          isMenuOpen
            ? "pointer-events-auto visible opacity-100"
            : "pointer-events-none invisible opacity-0",
        ].join(" ")}
        aria-hidden={!isMenuOpen}
      >
        <button
          type="button"
          className={[
            "absolute inset-0 top-14 bg-black/45 backdrop-blur-[3px]",
            "sm:top-[60px]",
          ].join(" ")}
          onClick={closeMenu}
          aria-label="Close navigation"
        />

        <aside
          id="mobile-navigation"
          className={[
            "absolute inset-x-0 top-14 border-b",
            "shadow-[0_24px_70px_rgba(0,0,0,0.18)]",
            "backdrop-blur-2xl",
            "transition-[transform,opacity] duration-300",
            "sm:top-[60px]",
            isLandingPage
              ? "border-white/[0.065] bg-[#08171C]/98"
              : "border-border/70 bg-background/98",
            isMenuOpen
              ? "translate-y-0 opacity-100"
              : "-translate-y-2 opacity-0",
          ].join(" ")}
        >
          <div
            className={[
              "mx-auto w-full max-w-7xl",
              "max-h-[calc(100vh-56px)] overflow-y-auto",
              "px-4 pb-6 sm:max-h-[calc(100vh-60px)] sm:px-6 md:px-8",
            ].join(" ")}
          >
            {/* ===========================================
                USER ACCOUNT
            =========================================== */}

            {user && (
              <MobileAccountSummary
                user={user}
                initials={initials}
                landing={isLandingPage}
                onProfile={handleProfile}
              />
            )}

            {/* ===========================================
                MOBILE NAV LINKS
            =========================================== */}

            <nav className={user ? "" : "pt-2"} aria-label="Mobile navigation">
              {!isLandingPage && (
                <MobileNavigationLink
                  label="Home"
                  href="/"
                  landing={isLandingPage}
                  onClick={closeMenu}
                />
              )}

              {navigation.map(item => (
                <MobileNavigationLink
                  key={item.label}
                  label={item.label}
                  href={item.href}
                  landing={isLandingPage}
                  onClick={closeMenu}
                />
              ))}
            </nav>

            {/* ===========================================
                ACCOUNT SHORTCUTS
            =========================================== */}

            {user && (
              <div className="mt-5 grid grid-cols-2 gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleProjects}
                  className={[
                    "h-10 rounded-lg bg-transparent text-xs shadow-none",
                    isLandingPage
                      ? "border-white/[0.09] text-white/65 hover:bg-white/[0.045] hover:text-white"
                      : "border-border/80",
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
                    "h-10 rounded-lg bg-transparent text-xs shadow-none",
                    isLandingPage
                      ? "border-white/[0.09] text-white/65 hover:bg-white/[0.045] hover:text-white"
                      : "border-border/80",
                  ].join(" ")}
                >
                  <SettingsIcon size={13} />
                  Settings
                </Button>
              </div>
            )}

            {/* ===========================================
                MOBILE PRIMARY ACTION
            =========================================== */}

            <div className={["mt-5 grid gap-2.5", !user ? "sm:grid-cols-2" : ""].join(" ")}>
              {!user && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleLogin}
                  className={[
                    "h-11 rounded-lg bg-transparent text-xs font-semibold shadow-none",
                    isLandingPage
                      ? "border-white/[0.10] text-white/65 hover:bg-white/[0.045] hover:text-white"
                      : "border-black/[0.12] dark:border-white/[0.10]",
                  ].join(" ")}
                >
                  <LogInIcon size={14} />
                  Log in
                </Button>
              )}

              <Button
                type="button"
                onClick={handleCreateProject}
                className={[
                  "h-11 rounded-lg text-xs font-semibold shadow-none",
                  isLandingPage
                    ? "bg-[#0D566D] text-white hover:bg-[#11657F] hover:text-white"
                    : [
                        "bg-[#303030] text-white hover:bg-[#202020] hover:text-white",
                        "dark:bg-[#DEDA00] dark:text-[#202020]",
                        "dark:hover:bg-[#d3cf00] dark:hover:text-[#202020]",
                      ].join(" "),
                ].join(" ")}
              >
                Create project

                <ArrowUpRightIcon
                  size={14}
                  className={isLandingPage ? "text-[#DEDA00]" : ""}
                />
              </Button>
            </div>

            {user && (
              <button
                type="button"
                disabled={loggingOut}
                onClick={() => void handleLogout()}
                className={[
                  "mt-5 flex w-full items-center justify-center gap-2 border-t pt-5",
                  "text-xs font-medium transition-colors",
                  "disabled:pointer-events-none disabled:opacity-50",
                  isLandingPage
                    ? "border-white/[0.07] text-white/38 hover:text-white"
                    : "border-border/60 text-muted-foreground hover:text-foreground",
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
   THEME BUTTON
========================================================= */

function ThemeButton({ theme, onToggle }: { theme: Theme; onToggle: () => void }) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      onClick={onToggle}
      className={[
        "h-9 w-9 rounded-lg text-muted-foreground shadow-none",
        "transition-colors hover:bg-black/[0.045] hover:text-foreground",
        "dark:hover:bg-white/[0.055]",
      ].join(" ")}
      aria-label={
        theme === "dark"
          ? "Switch to light theme"
          : "Switch to dark theme"
      }
    >
      {theme === "dark" ? <SunIcon size={15} /> : <MoonIcon size={15} />}
    </Button>
  );
}

/* =========================================================
   MOBILE NAV LINK
========================================================= */

function MobileNavigationLink({
  label,
  href,
  landing,
  onClick,
}: {
  label: string;
  href: string;
  landing: boolean;
  onClick: () => void;
}) {
  return (
    <NavLink
      to={href}
      onClick={onClick}
      className={({ isActive }) =>
        [
          "group flex min-h-[54px] items-center justify-between border-b",
          "text-sm font-semibold transition-colors duration-200",
          landing
            ? [
                "border-white/[0.07]",
                isActive
                  ? "text-white"
                  : "text-white/62 hover:text-white",
              ].join(" ")
            : [
                "border-border/60",
                isActive
                  ? "text-foreground"
                  : "text-foreground/80 hover:text-foreground",
              ].join(" "),
        ].join(" ")
      }
    >
      {({ isActive }) => (
        <>
          <span className="flex items-center gap-3">
            <span
              className={[
                "h-1.5 w-1.5 rounded-full transition-all duration-200",
                isActive
                  ? "bg-[#DEDA00]"
                  : landing
                    ? "bg-white/15 group-hover:bg-[#DEDA00]/70"
                    : "bg-foreground/15 group-hover:bg-[#DEDA00]/70",
              ].join(" ")}
            />

            {label}
          </span>

          <ArrowRightIcon
            size={14}
            className={[
              "transition-transform duration-200 group-hover:translate-x-0.5",
              landing ? "text-[#7DA6B1]" : "text-muted-foreground",
            ].join(" ")}
          />
        </>
      )}
    </NavLink>
  );
}

/* =========================================================
   MOBILE ACCOUNT SUMMARY
========================================================= */

function MobileAccountSummary({
  user,
  initials,
  landing,
  onProfile,
}: {
  user: AccountUser;
  initials: string;
  landing: boolean;
  onProfile: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onProfile}
      className={[
        "group flex w-full items-center gap-3 border-b py-5 text-left",
        landing ? "border-white/[0.07]" : "border-border/60",
      ].join(" ")}
    >
      <Avatar
        className={[
          "h-10 w-10 shrink-0 border",
          landing ? "border-white/[0.10]" : "border-border/80",
        ].join(" ")}
      >
        <AvatarImage
          src={user.avatarUrl}
          alt={user.fullName ? `${user.fullName}'s profile` : "User profile"}
          className="object-cover"
        />

        <AvatarFallback
          className={
            landing
              ? "bg-[#DEDA00]/[0.08] text-xs font-bold text-[#DEDA00]"
              : "bg-primary/[0.08] text-xs font-bold text-primary"
          }
        >
          {user.fullName ? initials : <UserCircleIcon size={17} />}
        </AvatarFallback>
      </Avatar>

      <div className="min-w-0 flex-1">
        <p
          className={[
            "truncate text-sm font-semibold",
            landing ? "text-white" : "text-foreground",
          ].join(" ")}
        >
          {user.fullName || "Allocatr user"}
        </p>

        <p
          className={[
            "mt-0.5 truncate text-[0.68rem]",
            landing ? "text-white/32" : "text-muted-foreground",
          ].join(" ")}
        >
          {user.email || "View your profile"}
        </p>
      </div>

      <ArrowRightIcon
        size={14}
        className={[
          "shrink-0 transition-transform duration-200 group-hover:translate-x-0.5",
          landing ? "text-[#7DA6B1]" : "text-muted-foreground",
        ].join(" ")}
      />
    </button>
  );
}

/* =========================================================
   DESKTOP ACCOUNT MENU
========================================================= */

type AccountMenuProps = {
  user: AccountUser;
  initials: string;
  loggingOut: boolean;
  landing: boolean;
  onProjects: () => void;
  onProfile: () => void;
  onSettings: () => void;
  onLogout: () => void;
};

function AccountMenu({
  user,
  initials,
  loggingOut,
  landing,
  onProjects,
  onProfile,
  onSettings,
  onLogout,
}: AccountMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className={[
            "flex h-9 items-center gap-2 rounded-lg px-1.5 transition-colors",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#DEDA00]/30",
            landing
              ? "text-white hover:bg-white/[0.055]"
              : "hover:bg-black/[0.04] dark:hover:bg-white/[0.055]",
          ].join(" ")}
          aria-label="Open account menu"
        >
          <Avatar
            className={[
              "h-7 w-7 border",
              landing ? "border-white/[0.10]" : "border-border/80",
            ].join(" ")}
          >
            <AvatarImage
              src={user.avatarUrl}
              alt={user.fullName ? `${user.fullName}'s profile` : "User profile"}
              className="object-cover"
            />

            <AvatarFallback
              className={
                landing
                  ? "bg-[#DEDA00]/[0.08] text-[0.62rem] font-bold text-[#DEDA00]"
                  : "bg-primary/[0.08] text-[0.62rem] font-bold text-primary"
              }
            >
              {user.fullName ? initials : <UserCircleIcon size={15} />}
            </AvatarFallback>
          </Avatar>

          <span className="hidden max-w-28 truncate text-xs font-semibold xl:block">
            {user.fullName || "Account"}
          </span>
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        sideOffset={10}
        className={[
          "w-64 rounded-xl border-border/80 bg-popover p-1.5",
          "text-popover-foreground shadow-xl shadow-black/[0.06]",
          "dark:shadow-black/25",
        ].join(" ")}
      >
        <DropdownMenuLabel className="p-3 font-normal">
          <div className="flex min-w-0 items-center gap-3">
            <Avatar className="h-10 w-10 shrink-0 border border-border">
              <AvatarImage
                src={user.avatarUrl}
                alt={user.fullName ? `${user.fullName}'s profile` : "User profile"}
                className="object-cover"
              />

              <AvatarFallback className="bg-primary/[0.08] text-xs font-bold text-primary">
                {user.fullName ? initials : <UserCircleIcon size={17} />}
              </AvatarFallback>
            </Avatar>

            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-foreground">
                {user.fullName || "Allocatr user"}
              </p>

              <p className="mt-1 truncate text-[0.68rem] text-muted-foreground">
                {user.email || "No email available"}
              </p>
            </div>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onSelect={onProjects}
          className="rounded-lg px-2.5 py-2 text-sm"
        >
          <FolderOpenIcon size={15} />
          Projects
        </DropdownMenuItem>

        <DropdownMenuGroup>
          <DropdownMenuItem
            onSelect={onProfile}
            className="rounded-lg px-2.5 py-2 text-sm"
          >
            <User2Icon size={15} />
            Profile
          </DropdownMenuItem>

          <DropdownMenuItem
            onSelect={onSettings}
            className="rounded-lg px-2.5 py-2 text-sm"
          >
            <SettingsIcon size={15} />
            Settings
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          disabled={loggingOut}
          onSelect={event => {
            event.preventDefault();
            void onLogout();
          }}
          className={[
            "rounded-lg px-2.5 py-2 font-medium",
            "text-muted-foreground focus:bg-muted/50 focus:text-foreground",
          ].join(" ")}
        >
          <LogOutIcon size={15} />
          {loggingOut ? "Logging out..." : "Log out"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default SiteHeader;