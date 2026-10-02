import { useEffect, useState } from "react";

import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";

import {
  ArrowRightIcon,
  ArrowUpRightIcon,
  FolderOpenIcon,
  LogInIcon,
  LogOutIcon,
  MenuIcon,
  SettingsIcon,
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
  {
    label: "Explore",
    href: "/discover",
  },
  {
    label: "How it works",
    href: "/how-it-works",
  },
  {
    label: "Become an Allocat",
    href: "/become-an-allocat",
  },
];

const publicNavigation: NavigationItem[] = [
  {
    label: "About",
    href: "/about",
  },
  {
    label: "How it works",
    href: "/how-it-works",
  },
  {
    label: "Become an Allocat",
    href: "/become-an-allocat",
  },
  {
    label: "Contact",
    href: "/contact",
  },
];

/* =========================================================
   HELPERS
========================================================= */

function getInitials(name?: string) {
  if (!name) {
    return "U";
  }

  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
}

/* =========================================================
   THEME STYLES

   SiteHeader no longer controls theme.
   It simply responds to the active document theme.
========================================================= */

const primaryActionButton = [
  "border border-brand-secondary-highlight/15",

  "bg-brand-secondary-highlight",
  "text-primary-foreground",

  "hover:border-brand-secondary-highlight/20",
  "hover:bg-brand-secondary-highlight/90",
  "hover:text-primary-foreground",

  "shadow-none",

  "focus-visible:ring-2",
  "focus-visible:ring-brand-secondary-highlight/15",

  "dark:border-secondary/10",

  "dark:bg-secondary",
  "dark:text-secondary-foreground",

  "dark:hover:border-secondary/15",
  "dark:hover:bg-secondary/90",
  "dark:hover:text-secondary-foreground",

  "dark:focus-visible:ring-secondary/15",
].join(" ");

const secondaryActionButton = [
  "border-border/65",

  "bg-surface-2/30",
  "text-foreground/70",

  "hover:border-border/85",
  "hover:bg-surface-3/55",
  "hover:text-foreground",

  "shadow-none",

  "dark:border-border",

  "dark:bg-surface-2/60",
  "dark:text-foreground/75",

  "dark:hover:bg-surface-3/70",
  "dark:hover:text-foreground",
].join(" ");

const ghostActionButton = [
  "text-muted-foreground",

  "hover:bg-surface-3/55",
  "hover:text-foreground",

  "dark:hover:bg-surface-3/65",
  "dark:hover:text-foreground",
].join(" ");

const headerIconButton = [
  "text-muted-foreground",

  "hover:bg-surface-3/55",
  "hover:text-foreground",

  "dark:hover:bg-surface-3/65",
  "dark:hover:text-foreground",
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

  const isLandingPage = location.pathname === "/";

  const baseNavigation = isLandingPage ? landingNavigation : publicNavigation;

  const navigation = user?.isAllocat
    ? baseNavigation.filter((item) => item.href !== "/become-an-allocat")
    : baseNavigation;

  const initials = getInitials(user?.fullName);

  /* =======================================================
     SCROLL
  ======================================================= */

  useEffect(() => {
    function handleScroll() {
      setIsScrolled(window.scrollY > 12);
    }

    handleScroll();

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  /* =======================================================
     MOBILE MENU
  ======================================================= */

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;

    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isMenuOpen]);

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

  /* =======================================================
     HEADER SURFACE
  ======================================================= */

  const scrolledSurface = [
    "border-border/60",
    "bg-background/94",
    "backdrop-blur-2xl",

    "shadow-[0_8px_28px_rgb(0_0_0/0.035)]",

    "dark:shadow-[0_10px_32px_rgb(0_0_0/0.18)]",
  ].join(" ");

  const initialSurface = isLandingPage
    ? ["border-transparent", "bg-background/0", "shadow-none"].join(" ")
    : [
        "border-border/40",
        "bg-background/88",
        "backdrop-blur-xl",
        "shadow-none",
      ].join(" ");

  return (
    <>
      <header
        className={[
          "fixed inset-x-0 top-0 z-50 border-b",

          "text-foreground",

          "transition-[background-color,border-color,box-shadow,backdrop-filter]",
          "duration-300",

          isScrolled ? scrolledSurface : initialSurface,
        ].join(" ")}
      >
        <div
          className={[
            "mx-auto flex w-full max-w-7xl items-center justify-between",

            "h-14 px-4",

            "sm:h-[60px]",
            "sm:px-6",

            "md:px-8",

            "xl:px-10",
          ].join(" ")}
        >
          {/* ===============================================
              LOGO
          =============================================== */}

          <Link
            to="/"
            onClick={closeMenu}
            className={[
              "group flex shrink-0 items-center rounded-md outline-none",

              "focus-visible:ring-2",
              "focus-visible:ring-brand-secondary-highlight/20",

              "dark:focus-visible:ring-secondary/20",
            ].join(" ")}
            aria-label="Allocatr home"
          >
            {/* Mobile mark */}

            <img
              src={allocatrIcon}
              alt=""
              className={[
                "h-7 w-7 object-contain",

                "transition-opacity duration-200",

                "group-hover:opacity-75",

                "sm:hidden",
              ].join(" ")}
            />

            {/* Desktop light-surface logo */}

            <img
              src={allocatrLogoDark}
              alt="Allocatr"
              className={[
                "hidden h-[25px] w-auto object-contain",

                "transition-opacity duration-200",

                "group-hover:opacity-75",

                "sm:block",
                "dark:sm:hidden",

                "lg:h-[26px]",
              ].join(" ")}
            />

            {/* Desktop dark-surface logo */}

            <img
              src={allocatrLogoLight}
              alt="Allocatr"
              className={[
                "hidden h-[25px] w-auto object-contain",

                "transition-opacity duration-200",

                "group-hover:opacity-75",

                "dark:sm:block",

                "lg:h-[26px]",
              ].join(" ")}
            />
          </Link>

          {/* ===============================================
              DESKTOP NAV
          =============================================== */}

          <nav
            className="hidden h-full items-center lg:flex"
            aria-label="Main navigation"
          >
            {navigation.map((item) => (
              <NavLink
                key={item.label}
                to={item.href}
                className={({ isActive }) =>
                  [
                    "group relative flex h-full items-center px-3",

                    "text-[0.78rem] font-medium",

                    "transition-colors duration-200",

                    "xl:px-4",
                    "xl:text-[0.8rem]",

                    isActive
                      ? "text-foreground"
                      : ["text-muted-foreground", "hover:text-foreground"].join(
                          " ",
                        ),
                  ].join(" ")
                }
              >
                {({ isActive }) => (
                  <>
                    {item.label}

                    <span
                      className={[
                        "absolute bottom-[7px] left-1/2",

                        "h-[2px] -translate-x-1/2 rounded-full",

                        "bg-brand-secondary-highlight",

                        "transition-all duration-200",

                        "dark:bg-secondary",

                        isActive
                          ? "w-4 opacity-100"
                          : [
                              "w-0 opacity-0",

                              "group-hover:w-2.5",
                              "group-hover:opacity-45",
                            ].join(" "),
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
            {!user && (
              <Button
                type="button"
                variant="ghost"
                onClick={handleLogin}
                className={[
                  "h-9 rounded-lg px-3 text-xs font-semibold shadow-none",

                  ghostActionButton,
                ].join(" ")}
              >
                Log in
              </Button>
            )}

            <Button
              type="button"
              variant="ghost"
              onClick={handleCreateProject}
              className={[
                "group h-9 rounded-lg px-3.5 text-xs font-semibold",

                "xl:px-4",

                primaryActionButton,
              ].join(" ")}
            >
              Create project
              <ArrowUpRightIcon
                size={13}
                className={[
                  "transition-transform duration-200",

                  "group-hover:translate-x-0.5",
                  "group-hover:-translate-y-0.5",
                ].join(" ")}
              />
            </Button>

            {user && (
              <div className="ml-0.5">
                <AccountMenu
                  user={user}
                  initials={initials}
                  loggingOut={loggingOut}
                  onProjects={handleProjects}
                  onProfile={handleProfile}
                  onSettings={handleSettings}
                  onLogout={handleLogout}
                />
              </div>
            )}
          </div>

          {/* ===============================================
              MOBILE ACTION
          =============================================== */}

          <div className="flex items-center lg:hidden">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className={[
                "h-9 w-9 rounded-lg shadow-none",

                headerIconButton,
              ].join(" ")}
              onClick={() => {
                setIsMenuOpen((current) => !current);
              }}
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
            ? ["pointer-events-auto", "visible", "opacity-100"].join(" ")
            : ["pointer-events-none", "invisible", "opacity-0"].join(" "),
        ].join(" ")}
        aria-hidden={!isMenuOpen}
      >
        {/* BACKDROP */}

        <button
          type="button"
          className={[
            "absolute inset-0 top-14",

            "bg-foreground/15",
            "backdrop-blur-[3px]",

            "dark:bg-background/55",

            "sm:top-[60px]",
          ].join(" ")}
          onClick={closeMenu}
          aria-label="Close navigation"
        />

        {/* PANEL */}

        <aside
          id="mobile-navigation"
          className={[
            "absolute inset-x-0 top-14 border-b",

            "border-border/70",

            "bg-background/98",
            "text-foreground",

            "backdrop-blur-2xl",

            "shadow-[0_20px_54px_rgb(0_0_0/0.08)]",

            "dark:shadow-[0_24px_60px_rgb(0_0_0/0.30)]",

            "transition-[transform,opacity] duration-300",

            "sm:top-[60px]",

            isMenuOpen
              ? ["translate-y-0", "opacity-100"].join(" ")
              : ["-translate-y-2", "opacity-0"].join(" "),
          ].join(" ")}
        >
          <div
            className={[
              "mx-auto w-full max-w-7xl",

              "max-h-[calc(100vh-56px)]",
              "overflow-y-auto",

              "px-4 pb-6",

              "sm:max-h-[calc(100vh-60px)]",
              "sm:px-6",

              "md:px-8",
            ].join(" ")}
          >
            {/* ===========================================
                USER ACCOUNT
            =========================================== */}

            {user && (
              <MobileAccountSummary
                user={user}
                initials={initials}
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
                  onClick={closeMenu}
                />
              )}

              {navigation.map((item) => (
                <MobileNavigationLink
                  key={item.label}
                  label={item.label}
                  href={item.href}
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
            )}

            {/* ===========================================
                MOBILE PRIMARY ACTION
            =========================================== */}

            <div
              className={[
                "mt-5 grid gap-2.5",

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
                onClick={handleCreateProject}
                className={[
                  "h-11 rounded-lg text-xs font-semibold",

                  primaryActionButton,
                ].join(" ")}
              >
                Create project
                <ArrowUpRightIcon size={14} />
              </Button>
            </div>

            {/* ===========================================
                LOGOUT
            =========================================== */}

            {user && (
              <button
                type="button"
                disabled={loggingOut}
                onClick={() => {
                  void handleLogout();
                }}
                className={[
                  "mt-5 flex w-full items-center justify-center gap-2",

                  "border-t border-border/60 pt-5",

                  "text-xs font-medium text-muted-foreground",

                  "transition-colors",

                  "hover:text-foreground",

                  "disabled:pointer-events-none",
                  "disabled:opacity-50",
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
   MOBILE NAV LINK
========================================================= */

function MobileNavigationLink({
  label,
  href,
  onClick,
}: {
  label: string;
  href: string;
  onClick: () => void;
}) {
  return (
    <NavLink
      to={href}
      onClick={onClick}
      className={({ isActive }) =>
        [
          "group flex min-h-[54px] items-center justify-between",

          "border-b border-border/60",

          "text-sm font-semibold",

          "transition-colors duration-200",

          isActive
            ? "text-foreground"
            : ["text-foreground/70", "hover:text-foreground"].join(" "),
        ].join(" ")
      }
    >
      {({ isActive }) => (
        <>
          <span className="flex items-center gap-3">
            <span
              className={[
                "h-1.5 w-1.5 rounded-full",

                "transition-[background-color,transform] duration-200",

                isActive
                  ? ["bg-brand-secondary-highlight", "dark:bg-secondary"].join(
                      " ",
                    )
                  : [
                      "bg-foreground/15",

                      "group-hover:bg-brand-secondary-highlight/65",

                      "dark:group-hover:bg-secondary/65",
                    ].join(" "),
              ].join(" ")}
            />

            {label}
          </span>

          <ArrowRightIcon
            size={14}
            className={[
              "text-muted-foreground",

              "transition-transform duration-200",

              "group-hover:translate-x-0.5",
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
        "group flex w-full items-center gap-3",

        "border-b border-border/60",

        "py-5 text-left",
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
            "bg-surface-3/70",

            "text-xs font-bold",

            "text-brand-secondary-highlight",

            "dark:bg-surface-2",
            "dark:text-secondary",
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
          {user.email || "View your profile"}
        </p>
      </div>

      <ArrowRightIcon
        size={14}
        className={[
          "shrink-0 text-muted-foreground",

          "transition-transform duration-200",

          "group-hover:translate-x-0.5",
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

  onProjects: () => void;
  onProfile: () => void;
  onSettings: () => void;
  onLogout: () => void;
};

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
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className={[
            "flex h-9 items-center gap-2 rounded-lg px-1.5",

            "text-foreground",

            "transition-colors",

            "hover:bg-surface-3/55",

            "dark:hover:bg-surface-3/65",

            "focus-visible:outline-none",

            "focus-visible:ring-2",
            "focus-visible:ring-brand-secondary-highlight/15",

            "dark:focus-visible:ring-secondary/15",
          ].join(" ")}
          aria-label="Open account menu"
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
                "bg-surface-3/70",

                "text-[0.62rem] font-bold",

                "text-brand-secondary-highlight",

                "dark:bg-surface-2",
                "dark:text-secondary",
              ].join(" ")}
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
          "w-64 rounded-xl border p-1.5",

          "border-border/70",

          "bg-popover",
          "text-popover-foreground",

          "shadow-none",

          "dark:border-border",
        ].join(" ")}
      >
        {/* ACCOUNT */}

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
                  "bg-surface-3/70",

                  "text-xs font-bold",

                  "text-brand-secondary-highlight",

                  "dark:bg-surface-2",
                  "dark:text-secondary",
                ].join(" ")}
              >
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

        <DropdownMenuSeparator className="bg-border/60" />

        {/* PROJECTS */}

        <DropdownMenuItem
          onSelect={onProjects}
          className={[
            "rounded-lg px-2.5 py-2 text-sm",

            "text-foreground/75",

            "focus:bg-surface-3/60",
            "focus:text-foreground",

            "dark:focus:bg-surface-3/70",
          ].join(" ")}
        >
          <FolderOpenIcon size={15} />
          Projects
        </DropdownMenuItem>

        {/* ACCOUNT LINKS */}

        <DropdownMenuGroup>
          <DropdownMenuItem
            onSelect={onProfile}
            className={[
              "rounded-lg px-2.5 py-2 text-sm",

              "text-foreground/75",

              "focus:bg-surface-3/60",
              "focus:text-foreground",

              "dark:focus:bg-surface-3/70",
            ].join(" ")}
          >
            <User2Icon size={15} />
            Profile
          </DropdownMenuItem>

          <DropdownMenuItem
            onSelect={onSettings}
            className={[
              "rounded-lg px-2.5 py-2 text-sm",

              "text-foreground/75",

              "focus:bg-surface-3/60",
              "focus:text-foreground",

              "dark:focus:bg-surface-3/70",
            ].join(" ")}
          >
            <SettingsIcon size={15} />
            Settings
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator className="bg-border/60" />

        {/* LOGOUT */}

        <DropdownMenuItem
          disabled={loggingOut}
          onSelect={(event) => {
            event.preventDefault();
            void onLogout();
          }}
          className={[
            "rounded-lg px-2.5 py-2",

            "font-medium",

            "text-muted-foreground",

            "focus:bg-surface-3/60",
            "focus:text-foreground",

            "dark:focus:bg-surface-3/70",
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
