import { useEffect, useState } from "react";
import {
  Link,
  NavLink,
  useLocation,
  useNavigate,
} from "react-router-dom";

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

import assets from "@/assets/assets";
import { useAuth } from "@/auth/useAuth";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";

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

const landingNavigation: NavigationItem[] = [
  {
    label: "Explore",
    href: "/allocats",
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

function getInitialTheme(): Theme {
  const storedTheme = localStorage.getItem("theme");

  if (storedTheme === "light" || storedTheme === "dark") {
    return storedTheme;
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

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
   SITE HEADER
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

  const baseNavigation = isLandingPage
    ? landingNavigation
    : publicNavigation;

  const navigation = user?.isAllocat
    ? baseNavigation.filter(
        (item) => item.href !== "/become-an-allocat",
      )
    : baseNavigation;

  const initials = getInitials(user?.fullName);

  useEffect(() => {
    const root = document.documentElement;

    root.classList.toggle("dark", theme === "dark");
    root.classList.toggle("light", theme === "light");

    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    function handleScroll() {
      setIsScrolled(window.scrollY > 14);
    }

    handleScroll();

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen
      ? "hidden"
      : "";

    return () => {
      document.body.style.overflow = "";
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
    setIsMenuOpen(false);
  }, [location.pathname]);

  function closeMenu() {
    setIsMenuOpen(false);
  }

  function toggleTheme() {
    setTheme((currentTheme) =>
      currentTheme === "dark" ? "light" : "dark",
    );
  }

  function handleLogin() {
    closeMenu();
    navigate("/login");
  }

  function handlePostTask() {
    closeMenu();

    navigate(
      user
        ? "/projects/new"
        : "/register",
    );
  }

  async function handleLogout() {
    if (loggingOut) {
      return;
    }

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

  return (
    <>
      <header
        className={[
          "fixed inset-x-0 top-0 z-50",
          "transition-[background-color,border-color,box-shadow,backdrop-filter]",
          "duration-300",

          isScrolled
            ? [
                "border-b border-border/60",
                "bg-background/88",
                "backdrop-blur-xl",
                "shadow-[0_8px_30px_rgba(0,0,0,0.035)]",
                "dark:shadow-[0_10px_34px_rgba(0,0,0,0.2)]",
              ].join(" ")
            : [
                "border-b border-transparent",
                "bg-transparent",
                "shadow-none",
              ].join(" "),
        ].join(" ")}
      >
        <div
          className={[
            "mx-auto flex w-full max-w-7xl items-center justify-between",
            "h-14 px-5",
            "sm:h-[60px] sm:px-8",
            "lg:px-10",
          ].join(" ")}
        >
          <Link
            to="/"
            onClick={closeMenu}
            className="group flex shrink-0 items-center gap-2.5 outline-none"
            aria-label="Allocatr home"
          >
            <img
              src={assets.allocatrIcon}
              alt=""
              className={[
                "h-7 w-7 object-contain",
                "transition-transform duration-300",
                "group-hover:-rotate-6",
                "group-hover:scale-105",
              ].join(" ")}
            />

            <span className="text-base font-black tracking-[-0.035em] sm:text-lg">
              Allocatr
            </span>
          </Link>

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
                    "group relative flex h-full items-center px-4",
                    "text-[0.82rem] font-medium",
                    "transition-colors duration-200",

                    isActive
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
                        "absolute bottom-[9px] left-1/2",
                        "h-1 w-1 -translate-x-1/2 rounded-full",
                        "bg-primary transition-all duration-200",

                        isActive
                          ? "scale-100 opacity-100"
                          : [
                              "scale-0 opacity-0",
                              "group-hover:scale-100",
                              "group-hover:opacity-40",
                            ].join(" "),
                      ].join(" ")}
                    />
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          <div className="hidden items-center gap-1 lg:flex">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="h-9 w-9 rounded-lg text-muted-foreground shadow-none hover:text-foreground"
              aria-label={
                theme === "dark"
                  ? "Switch to light theme"
                  : "Switch to dark theme"
              }
            >
              {theme === "dark" ? (
                <SunIcon size={16} />
              ) : (
                <MoonIcon size={16} />
              )}
            </Button>

            <div className="mx-2 h-4 w-px bg-border/80" />

            {user ? (
              <AccountMenu
                user={user}
                initials={initials}
                loggingOut={loggingOut}
                onProjects={() => navigate("/projects")}
                onProfile={() => navigate("/profile")}
                onSettings={() => navigate("/settings")}
                onLogout={handleLogout}
              />
            ) : (
              <Button
                type="button"
                variant="ghost"
                onClick={handleLogin}
                className={[
                  "h-9 rounded-lg px-3.5",
                  "text-xs font-semibold",
                  "text-muted-foreground",
                  "shadow-none",
                  "hover:text-foreground",
                ].join(" ")}
              >
                <LogInIcon size={14} />
                Log in
              </Button>
            )}

            <Button
              type="button"
              onClick={handlePostTask}
              className="ml-1 h-9 rounded-lg px-4 text-xs font-semibold shadow-none"
            >
              Post a task
              <ArrowUpRightIcon size={14} />
            </Button>
          </div>

          <div className="flex items-center gap-1 lg:hidden">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="h-9 w-9 rounded-lg text-muted-foreground shadow-none"
              aria-label={
                theme === "dark"
                  ? "Switch to light theme"
                  : "Switch to dark theme"
              }
            >
              {theme === "dark" ? (
                <SunIcon size={16} />
              ) : (
                <MoonIcon size={16} />
              )}
            </Button>

            {user && (
              <AccountMenu
                user={user}
                initials={initials}
                loggingOut={loggingOut}
                compact
                onProjects={() => navigate("/projects")}
                onProfile={() => navigate("/profile")}
                onSettings={() => navigate("/settings")}
                onLogout={handleLogout}
              />
            )}

            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-9 w-9 rounded-lg shadow-none"
              onClick={() =>
                setIsMenuOpen((current) => !current)
              }
              aria-label={
                isMenuOpen
                  ? "Close navigation"
                  : "Open navigation"
              }
              aria-expanded={isMenuOpen}
              aria-controls="mobile-navigation"
            >
              {isMenuOpen ? (
                <XIcon size={19} />
              ) : (
                <MenuIcon size={19} />
              )}
            </Button>
          </div>
        </div>
      </header>

      <div
        className={[
          "fixed inset-0 z-40 lg:hidden",
          "transition-all duration-300",

          isMenuOpen
            ? "pointer-events-auto visible opacity-100"
            : "pointer-events-none invisible opacity-0",
        ].join(" ")}
        aria-hidden={!isMenuOpen}
      >
        <button
          type="button"
          className={[
            "absolute inset-0 top-14",
            "bg-foreground/15 backdrop-blur-sm",
            "sm:top-[60px]",
          ].join(" ")}
          onClick={closeMenu}
          aria-label="Close navigation"
        />

        <aside
          id="mobile-navigation"
          className={[
            "absolute inset-x-0 top-14",
            "border-b border-border/70",
            "bg-background/98",
            "backdrop-blur-xl",
            "shadow-xl shadow-black/10",
            "transition-all duration-300",
            "sm:top-[60px]",

            isMenuOpen
              ? "translate-y-0 opacity-100"
              : "-translate-y-3 opacity-0",
          ].join(" ")}
        >
          <div
            className={[
              "mx-auto max-w-7xl",
              "max-h-[calc(100vh-56px)] overflow-y-auto",
              "px-5 pb-6 pt-3",
              "sm:max-h-[calc(100vh-60px)] sm:px-8",
            ].join(" ")}
          >
            <div className="flex items-center justify-between border-b border-border/60 py-4">
              <div className="flex items-center gap-2.5">
                <img
                  src={assets.allocatrIcon}
                  alt=""
                  className="h-5 w-5 object-contain"
                />

                <span className="text-xs font-semibold text-muted-foreground">
                  Follow the right trail.
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                <span className="h-1 w-1 rounded-full bg-primary/50" />
                <span className="h-1 w-1 rounded-full bg-primary/20" />
              </div>
            </div>

            <nav
              className="mt-1"
              aria-label="Mobile navigation"
            >
              {!isLandingPage && (
                <NavLink
                  to="/"
                  onClick={closeMenu}
                  className={({ isActive }) =>
                    [
                      "group flex min-h-14 items-center justify-between",
                      "border-b border-border/60",
                      "text-sm font-semibold transition-colors",

                      isActive
                        ? "text-primary"
                        : "text-foreground hover:text-primary",
                    ].join(" ")
                  }
                >
                  Home

                  <ArrowRightIcon
                    size={15}
                    className="text-muted-foreground transition-transform duration-200 group-hover:translate-x-1"
                  />
                </NavLink>
              )}

              {navigation.map((item) => (
                <NavLink
                  key={item.label}
                  to={item.href}
                  onClick={closeMenu}
                  className={({ isActive }) =>
                    [
                      "group flex min-h-14 items-center justify-between",
                      "border-b border-border/60",
                      "text-sm font-semibold transition-colors",

                      isActive
                        ? "text-primary"
                        : "text-foreground hover:text-primary",
                    ].join(" ")
                  }
                >
                  <span className="flex items-center gap-3">
                    <span
                      className={[
                        "h-1.5 w-1.5 rounded-full",
                        "bg-primary/25",
                        "transition-all duration-200",
                        "group-hover:bg-primary",
                      ].join(" ")}
                    />

                    {item.label}
                  </span>

                  <ArrowRightIcon
                    size={15}
                    className="text-muted-foreground transition-transform duration-200 group-hover:translate-x-1"
                  />
                </NavLink>
              ))}
            </nav>

            <div className="mt-6 grid gap-2.5 sm:grid-cols-2">
              {!user && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleLogin}
                  className="h-11 rounded-lg text-xs shadow-none"
                >
                  <LogInIcon size={14} />
                  Log in
                </Button>
              )}

              <Button
                type="button"
                onClick={handlePostTask}
                className={[
                  "h-11 rounded-lg text-xs shadow-none",
                  user ? "sm:col-span-2" : "",
                ].join(" ")}
              >
                Post a task
                <ArrowUpRightIcon size={14} />
              </Button>
            </div>
          </div>
        </aside>
      </div>
    </>
  );
}

/* =========================================================
   ACCOUNT MENU
========================================================= */

type AccountMenuProps = {
  user: AccountUser;
  initials: string;
  loggingOut: boolean;
  compact?: boolean;
  onProjects: () => void;
  onProfile: () => void;
  onSettings: () => void;
  onLogout: () => void;
};

function AccountMenu({
  user,
  initials,
  loggingOut,
  compact = false,
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
            "flex h-9 items-center rounded-lg",
            "transition-colors",
            "hover:bg-muted/40",
            "focus-visible:outline-none",
            "focus-visible:ring-2",
            "focus-visible:ring-primary/30",
            compact ? "w-9 justify-center" : "gap-2 px-1.5",
          ].join(" ")}
          aria-label="Open account menu"
        >
          <Avatar className="h-7 w-7 border border-border/80">
            <AvatarImage
              src={user.avatarUrl}
              alt={
                user.fullName
                  ? `${user.fullName}'s profile`
                  : "User profile"
              }
              className="object-cover"
            />

            <AvatarFallback className="bg-primary/[0.08] text-[0.62rem] font-bold text-primary">
              {user.fullName ? (
                initials
              ) : (
                <UserCircleIcon size={15} />
              )}
            </AvatarFallback>
          </Avatar>

          {!compact && (
            <span className="hidden max-w-28 truncate text-xs font-semibold xl:block">
              {user.fullName || "Account"}
            </span>
          )}
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        sideOffset={10}
        className={[
          "w-64 rounded-xl border-border/90",
          "bg-popover p-1.5 text-popover-foreground",
          "shadow-xl shadow-black/[0.06]",
          "dark:shadow-black/25",
        ].join(" ")}
      >
        <DropdownMenuLabel className="p-3 font-normal">
          <div className="flex min-w-0 items-center gap-3">
            <Avatar className="h-10 w-10 shrink-0 border border-border">
              <AvatarImage
                src={user.avatarUrl}
                alt={
                  user.fullName
                    ? `${user.fullName}'s profile`
                    : "User profile"
                }
                className="object-cover"
              />

              <AvatarFallback className="bg-primary/[0.08] text-xs font-bold text-primary">
                {user.fullName ? (
                  initials
                ) : (
                  <UserCircleIcon size={17} />
                )}
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
          onSelect={(event) => {
            event.preventDefault();
            void onLogout();
          }}
          className={[
            "rounded-lg px-2.5 py-2 font-medium",
            "text-muted-foreground",
            "focus:bg-muted/50 focus:text-foreground",
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