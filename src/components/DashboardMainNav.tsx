import { useEffect, useMemo, useState, type ReactNode } from "react";

import { Link, useNavigate } from "react-router-dom";

import {
  BadgeCheckIcon,
  BellIcon,
  CircleHelpIcon,
  FolderPlusIcon,
  LogOutIcon,
  MoonIcon,
  PlusIcon,
  SettingsIcon,
  SunIcon,
  User2Icon,
  UserCircleIcon,
} from "lucide-react";

import api from "@/api/axios";
import { useAuth } from "@/auth/useAuth";

import AllocatrIconLogo from "@/components/AllocatrIconLogo";
import BecomeAllocatDialog from "@/components/BecomeAllocatDialog";

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

type Props = {
  children?: ReactNode;
  notificationCount?: number;
};

type AccountUser = {
  fullName?: string;
  email?: string;
  avatarUrl?: string;
  isAllocat?: boolean;
};

type QuickActionsMenuProps = {
  onNewProject: () => void;
  onSettings: () => void;
  onHelp: () => void;
};

type AccountMenuProps = {
  user?: AccountUser | null;
  initials: string;
  loggingOut: boolean;
  onLogout: () => void;
  onProfile: () => void;
  onSettings: () => void;
  onBecomeAllocat: () => void;
};

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

function getInitialTheme(): Theme {
  if (typeof window === "undefined") {
    return "dark";
  }

  const savedTheme = window.localStorage.getItem("theme");

  if (savedTheme === "light" || savedTheme === "dark") {
    return savedTheme;
  }

  return "dark";
}

/* =========================================================
   SHARED STYLES
========================================================= */

const navIconButton = [
  "relative h-9 w-9 rounded-lg text-muted-foreground shadow-none",
  "transition-[background-color,color,border-color] duration-200",
  "hover:bg-surface-3/55 hover:text-foreground",
  "focus-visible:ring-2 focus-visible:ring-brand-secondary-highlight/15",
  "dark:hover:bg-surface-3/65 dark:hover:text-foreground",
  "dark:focus-visible:ring-secondary/15",
].join(" ");

const dropdownSurface = [
  "rounded-xl border p-1.5",
  "border-border/70 bg-popover text-popover-foreground",
  "shadow-none",
  "dark:border-border",
].join(" ");

const dropdownItem = [
  "rounded-lg px-2.5 py-2",
  "text-sm text-foreground/75",
  "transition-colors duration-150",
  "focus:bg-surface-3/60 focus:text-foreground",
  "dark:focus:bg-surface-3/70",
].join(" ");

const destructiveDropdownItem = [
  "rounded-lg px-2.5 py-2",
  "font-medium",
  "text-foreground/75",

  "transition-colors duration-150",

  // Light theme — same restrained red treatment as overdue states
  "focus:bg-destructive/[0.07]",
  "focus:text-destructive",

  "data-[highlighted]:bg-destructive/[0.07]",
  "data-[highlighted]:text-destructive",

  // Icon stays neutral until hover/focus
  "[&_svg]:text-muted-foreground",

  "focus:[&_svg]:text-destructive",
  "data-[highlighted]:[&_svg]:text-destructive",

  // Dark theme — slightly stronger tinted surface
  "dark:text-foreground/75",

  "dark:focus:bg-destructive/[0.12]",
  "dark:focus:text-destructive",

  "dark:data-[highlighted]:bg-destructive/[0.12]",
  "dark:data-[highlighted]:text-destructive",

  "dark:[&_svg]:text-muted-foreground",
  "dark:focus:[&_svg]:text-destructive",
  "dark:data-[highlighted]:[&_svg]:text-destructive",
].join(" ");

/* =========================================================
   NAV
========================================================= */

function DashboardMainNav({ children, notificationCount = 0 }: Props) {
  const navigate = useNavigate();

  const { user, logout, refreshUser } = useAuth();

  const [theme, setTheme] = useState<Theme>(getInitialTheme);
  const [loggingOut, setLoggingOut] = useState(false);

  const [becomeAllocatOpen, setBecomeAllocatOpen] = useState(false);
  const [becomingAllocat, setBecomingAllocat] = useState(false);

  const initials = useMemo(() => getInitials(user?.fullName), [user?.fullName]);

  const hasNotifications = notificationCount > 0;

  /* =======================================================
     THEME
  ======================================================= */

  useEffect(() => {
    const root = document.documentElement;

    root.classList.toggle("dark", theme === "dark");
    root.classList.toggle("light", theme === "light");

    root.style.colorScheme = theme;

    window.localStorage.setItem("theme", theme);
  }, [theme]);

  function toggleTheme() {
    setTheme((current) => (current === "dark" ? "light" : "dark"));
  }

  /* =======================================================
     PROFILE
  ======================================================= */

  function handleProfile() {
    navigate(user?.isAllocat ? "/allocats/profile" : "/profile");
  }

  /* =======================================================
     LOGOUT
  ======================================================= */

  async function handleLogout() {
    if (loggingOut) {
      return;
    }

    setLoggingOut(true);

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
     BECOME ALLOCAT
  ======================================================= */

  async function handleBecomeAllocat() {
    if (becomingAllocat || user?.isAllocat) {
      return;
    }

    setBecomingAllocat(true);

    try {
      await api.patch(
        "/users/me/become-allocat",
        {},
        {
          withCredentials: true,
        },
      );

      /*
       * Update AuthContext before entering the guarded
       * Allocat setup route.
       */
      await refreshUser();

      setBecomeAllocatOpen(false);

      navigate("/allocats/profile/create");
    } catch (error) {
      console.error("Could not update account mode:", error);

      throw error;
    } finally {
      setBecomingAllocat(false);
    }
  }

  return (
    <>
      <nav
        className={[
          "flex h-16 min-w-0 items-center justify-between gap-4",
          "sm:h-[4.25rem]",
        ].join(" ")}
      >
        {/* =================================================
            BRAND
        ================================================= */}

        <div className="flex min-w-0 items-center gap-3">
          <Link
            to="/projects"
            aria-label="Go to projects"
            className={[
              "group flex h-10 w-10 shrink-0 items-center justify-center",
              "rounded-xl border",

              "border-border/65",
              "bg-surface-2/55",

              "ring-1 ring-inset ring-border/20",

              "transition-[background-color,border-color] duration-200",

              "hover:border-border/85",
              "hover:bg-surface-3/60",

              "focus-visible:outline-none",
              "focus-visible:ring-2",
              "focus-visible:ring-brand-secondary-highlight/20",

              "dark:border-border",
              "dark:bg-surface-2/70",
              "dark:ring-border/40",

              "dark:hover:bg-surface-3/70",
              "dark:focus-visible:ring-secondary/20",
            ].join(" ")}
          >
            <span
              className={[
                "flex h-[22px] w-[22px] shrink-0 items-center justify-center",
                "overflow-hidden rounded-full",

                "[&_img]:h-[18px] [&_img]:w-[18px]",
                "[&_img]:max-h-[18px] [&_img]:max-w-[18px]",
                "[&_img]:object-contain",

                "[&_svg]:h-[18px] [&_svg]:w-[18px]",
                "[&_svg]:max-h-[18px] [&_svg]:max-w-[18px]",
              ].join(" ")}
            >
              <AllocatrIconLogo theme="" />
            </span>
          </Link>

          {children && (
            <>
              <span className="hidden h-5 w-px bg-border/70 sm:block" />

              <div className="hidden min-w-0 md:block">{children}</div>
            </>
          )}
        </div>

        {/* =================================================
            ACTIONS
        ================================================= */}

        <div className="flex shrink-0 items-center gap-0.5 sm:gap-1">
          {/* THEME */}

          <NavIconButton
            label={
              theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
            }
            onClick={toggleTheme}
          >
            {theme === "dark" ? <SunIcon size={14} /> : <MoonIcon size={14} />}
          </NavIconButton>

          {/* NOTIFICATIONS */}

          <NavIconButton
            label={
              hasNotifications
                ? `${notificationCount} unread notifications`
                : "Notifications"
            }
            onClick={() => navigate("/notifications")}
            notification={hasNotifications}
          >
            <BellIcon size={14} />
          </NavIconButton>

          {/* QUICK ACTIONS */}

          <QuickActionsMenu
            onNewProject={() => navigate("/projects/new")}
            onSettings={() => navigate("/settings")}
            onHelp={() => navigate("/help")}
          />

          <span className="mx-1.5 hidden h-5 w-px bg-border/70 sm:block" />

          {/* ACCOUNT */}

          <AccountMenu
            user={user}
            initials={initials}
            loggingOut={loggingOut}
            onLogout={handleLogout}
            onProfile={handleProfile}
            onSettings={() => navigate("/settings")}
            onBecomeAllocat={() => setBecomeAllocatOpen(true)}
          />
        </div>
      </nav>

      {!user?.isAllocat && (
        <BecomeAllocatDialog
          open={becomeAllocatOpen}
          onOpenChange={setBecomeAllocatOpen}
          onContinue={handleBecomeAllocat}
          loading={becomingAllocat}
        />
      )}
    </>
  );
}

/* =========================================================
   NAV ICON BUTTON
========================================================= */

function NavIconButton({
  children,
  label,
  onClick,
  notification = false,
}: {
  children: ReactNode;
  label: string;
  onClick: () => void;
  notification?: boolean;
}) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      onClick={onClick}
      className={navIconButton}
      aria-label={label}
      title={label}
    >
      {children}

      {notification && (
        <span
          aria-hidden
          className="absolute right-[7px] top-[7px] flex h-1.5 w-1.5"
        >
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-status-pending opacity-25" />

          <span
            className={[
              "relative inline-flex h-1.5 w-1.5 rounded-full",
              "bg-status-pending",
              "ring-2 ring-background",
            ].join(" ")}
          />
        </span>
      )}
    </Button>
  );
}

/* =========================================================
   QUICK ACTIONS
========================================================= */

function QuickActionsMenu({
  onNewProject,
  onSettings,
  onHelp,
}: QuickActionsMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className={navIconButton}
          aria-label="Open quick actions"
          title="Quick actions"
        >
          <PlusIcon size={15} />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        sideOffset={10}
        className={["w-56", dropdownSurface].join(" ")}
      >
        <DropdownMenuLabel className="px-2.5 py-2 text-[0.65rem] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
          Quick actions
        </DropdownMenuLabel>

        <DropdownMenuSeparator className="bg-border/60" />

        <DropdownMenuItem onSelect={onNewProject} className={dropdownItem}>
          <FolderPlusIcon size={14} />
          New project
        </DropdownMenuItem>

        <DropdownMenuItem onSelect={onSettings} className={dropdownItem}>
          <SettingsIcon size={14} />
          Settings
        </DropdownMenuItem>

        <DropdownMenuItem onSelect={onHelp} className={dropdownItem}>
          <CircleHelpIcon size={14} />
          Help & support
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

/* =========================================================
   ACCOUNT MENU
========================================================= */

function AccountMenu({
  user,
  initials,
  loggingOut,
  onLogout,
  onProfile,
  onSettings,
  onBecomeAllocat,
}: AccountMenuProps) {
  const profileLabel = user?.isAllocat ? "Allocat profile" : "Profile";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className={[
            "group ml-0.5 flex h-10 min-w-0 items-center gap-2.5",
            "rounded-lg px-1.5",

            "text-foreground",

            "transition-colors duration-200",

            "hover:bg-surface-3/55",

            "focus-visible:outline-none",
            "focus-visible:ring-2",
            "focus-visible:ring-brand-secondary-highlight/15",

            "dark:hover:bg-surface-3/65",
            "dark:focus-visible:ring-secondary/15",
          ].join(" ")}
          aria-label="Open account menu"
        >
          <Avatar className="h-8 w-8 border border-border/70">
            <AvatarImage
              src={user?.avatarUrl}
              alt={
                user?.fullName ? `${user.fullName}'s profile` : "User profile"
              }
              className="object-cover"
            />

            <AvatarFallback
              className={[
                "bg-surface-3/75",

                "text-[0.62rem] font-semibold",
                "text-brand-secondary-highlight",

                "dark:bg-surface-2",
                "dark:text-secondary",
              ].join(" ")}
            >
              {user?.fullName ? initials : <UserCircleIcon size={15} />}
            </AvatarFallback>
          </Avatar>

          <div className="hidden max-w-[140px] min-w-0 text-left lg:block">
            <p className="truncate text-[0.72rem] font-semibold text-foreground/85">
              {user?.fullName || "Allocatr"}
            </p>

            <p className="mt-0.5 text-[0.54rem] text-muted-foreground">
              {user?.isAllocat ? "Allocat account" : "Account"}
            </p>
          </div>
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        sideOffset={10}
        className={["w-64", dropdownSurface].join(" ")}
      >
        {/* ACCOUNT SUMMARY */}

        <DropdownMenuLabel className="p-3 font-normal">
          <div className="flex min-w-0 items-center gap-3">
            <Avatar className="h-10 w-10 shrink-0 border border-border/70">
              <AvatarImage
                src={user?.avatarUrl}
                alt={
                  user?.fullName ? `${user.fullName}'s profile` : "User profile"
                }
                className="object-cover"
              />

              <AvatarFallback
                className={[
                  "bg-surface-3/75",

                  "text-xs font-semibold",
                  "text-brand-secondary-highlight",

                  "dark:bg-surface-2",
                  "dark:text-secondary",
                ].join(" ")}
              >
                {user?.fullName ? initials : <UserCircleIcon size={16} />}
              </AvatarFallback>
            </Avatar>

            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-foreground">
                {user?.fullName || "Allocatr user"}
              </p>

              {user?.email && (
                <p className="mt-1 truncate text-[0.68rem] text-muted-foreground">
                  {user.email}
                </p>
              )}

              {user?.isAllocat && (
                <p className="mt-1 text-[0.58rem] font-medium text-brand-secondary-highlight dark:text-secondary">
                  Allocat
                </p>
              )}
            </div>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator className="bg-border/60" />

        {/* ACCOUNT LINKS */}

        <DropdownMenuGroup>
          <DropdownMenuItem onSelect={onProfile} className={dropdownItem}>
            <User2Icon size={14} />
            {profileLabel}
          </DropdownMenuItem>

          <DropdownMenuItem onSelect={onSettings} className={dropdownItem}>
            <SettingsIcon size={14} />
            Settings
          </DropdownMenuItem>

          {!user?.isAllocat && (
            <DropdownMenuItem
              onSelect={onBecomeAllocat}
              className={dropdownItem}
            >
              <BadgeCheckIcon
                size={14}
                className="text-brand-secondary-highlight dark:text-secondary"
              />
              Become an Allocat
            </DropdownMenuItem>
          )}
        </DropdownMenuGroup>

        <DropdownMenuSeparator className="bg-border/60" />

        {/* LOGOUT */}

        <DropdownMenuItem
          disabled={loggingOut}
          onSelect={(event) => {
            event.preventDefault();
            void onLogout();
          }}
          className={destructiveDropdownItem}
        >
          <LogOutIcon size={14} />

          {loggingOut ? "Logging out..." : "Log out"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default DashboardMainNav;
