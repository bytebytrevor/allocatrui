import { useEffect, useMemo, useState, type ReactNode } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  BadgeCheckIcon,
  BellIcon,
  CircleHelpIcon,
  FolderPlusIcon,
  LogOutIcon,
  MenuIcon,
  MoonIcon,
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
  if (!name?.trim()) return "U";

  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map(part => part.charAt(0).toUpperCase())
    .join("");
}

function getInitialTheme(): Theme {
  if (typeof window === "undefined") return "dark";

  const savedTheme = window.localStorage.getItem("theme");

  if (savedTheme === "light" || savedTheme === "dark") return savedTheme;

  return "dark";
}

/* =========================================================
   DASHBOARD NAV
========================================================= */

function DashboardMainNav({ children, notificationCount = 0 }: Props) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [theme, setTheme] = useState<Theme>(getInitialTheme);
  const [loggingOut, setLoggingOut] = useState(false);
  const [becomeAllocatOpen, setBecomeAllocatOpen] = useState(false);
  const [becomingAllocat, setBecomingAllocat] = useState(false);

  const initials = useMemo(() => getInitials(user?.fullName), [user?.fullName]);
  const hasNotifications = notificationCount > 0;

  useEffect(() => {
    const root = document.documentElement;

    root.classList.toggle("dark", theme === "dark");
    root.classList.toggle("light", theme === "light");

    localStorage.setItem("theme", theme);
  }, [theme]);

  function toggleTheme() {
    setTheme(currentTheme => (currentTheme === "dark" ? "light" : "dark"));
  }

  async function handleLogout() {
    if (loggingOut) return;

    setLoggingOut(true);

    try {
      await logout();
      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setLoggingOut(false);
    }
  }

  async function handleBecomeAllocat() {
    if (becomingAllocat || user?.isAllocat) return;

    setBecomingAllocat(true);

    try {
      await api.patch(
        "/users/me/become-allocat",
        {},
        { withCredentials: true },
      );

      setBecomeAllocatOpen(false);
      navigate("/allocats/profile/create");
    } catch (error) {
      console.error("Could not update account mode:", error);
    } finally {
      setBecomingAllocat(false);
    }
  }

  return (
    <>
      <nav className="flex h-16 min-w-0 items-center justify-between gap-4 sm:h-[4.25rem]">
        <div className="flex min-w-0 items-center gap-3">
          <Link
            to="/projects"
            aria-label="Go to projects"
            className={[
              "group flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
              "transition-[background-color,box-shadow] duration-200",
              "hover:bg-[#E5EBE8]",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#315E6C]/20",
              "dark:hover:bg-white/[0.05]",
              "dark:focus-visible:ring-[#DEDA00]/20",
            ].join(" ")}
          >
            <AllocatrIconLogo theme={""} />
          </Link>

          {children && (
            <>
              <span className="hidden h-5 w-px bg-[#315E6C]/[0.10] sm:block dark:bg-white/[0.08]" />

              <div className="hidden min-w-0 md:block">
                {children}
              </div>
            </>
          )}
        </div>

        <div className="flex shrink-0 items-center gap-0.5 sm:gap-1">
          <NavIconButton
            label={
              theme === "dark"
                ? "Switch to light mode"
                : "Switch to dark mode"
            }
            onClick={toggleTheme}
          >
            {theme === "dark" ? <SunIcon size={14} /> : <MoonIcon size={14} />}
          </NavIconButton>

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

          <QuickActionsMenu
            onNewProject={() => navigate("/projects/new")}
            onSettings={() => navigate("/settings")}
            onHelp={() => navigate("/help")}
          />

          <span className="mx-1.5 hidden h-5 w-px bg-[#315E6C]/[0.10] sm:block dark:bg-white/[0.08]" />

          <AccountMenu
            user={user}
            initials={initials}
            loggingOut={loggingOut}
            onLogout={handleLogout}
            onProfile={() => navigate("/profile")}
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
      className={[
        "relative h-9 w-9 rounded-lg shadow-none",
        "text-[#68797D] transition-colors duration-200",
        "hover:bg-[#E5EBE8] hover:text-[#29464E]",
        "dark:text-white/38 dark:hover:bg-white/[0.05] dark:hover:text-white/78",
      ].join(" ")}
      aria-label={label}
    >
      {children}

      {notification && (
        <span className="absolute right-[7px] top-[7px] flex h-1.5 w-1.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#315E6C] opacity-20 dark:bg-[#DEDA00]" />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#315E6C] ring-2 ring-[#F7F8F5] dark:bg-[#DEDA00] dark:ring-[#08171C]" />
        </span>
      )}
    </Button>
  );
}

/* =========================================================
   QUICK ACTIONS MENU
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
          className={[
            "h-9 w-9 rounded-lg shadow-none",
            "text-[#68797D] transition-colors duration-200",
            "hover:bg-[#E5EBE8] hover:text-[#29464E]",
            "data-[state=open]:bg-[#E5EBE8] data-[state=open]:text-[#29464E]",
            "dark:text-white/38 dark:hover:bg-white/[0.05] dark:hover:text-white/78",
            "dark:data-[state=open]:bg-white/[0.05] dark:data-[state=open]:text-white",
          ].join(" ")}
          aria-label="Open quick actions"
        >
          <MenuIcon size={15} />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        sideOffset={10}
        className={[
          "w-56 rounded-xl p-1.5",
          "border-[#315E6C]/[0.09] bg-[#F8FAF7] text-[#30383A]",
          "shadow-[0_18px_50px_-24px_rgba(28,48,54,0.28)]",
          "dark:border-white/[0.08] dark:bg-[#10262D] dark:text-white",
          "dark:shadow-[0_18px_50px_-24px_rgba(0,0,0,0.7)]",
        ].join(" ")}
      >
        <DropdownMenuLabel className="px-3 py-2.5 font-normal">
          <p className="text-[0.55rem] font-semibold uppercase tracking-[0.16em] text-[#6D7D80] dark:text-white/30">
            Quick actions
          </p>

          <p className="mt-1 text-[0.68rem] text-[#879294] dark:text-white/25">
            Common workspace actions.
          </p>
        </DropdownMenuLabel>

        <DropdownMenuSeparator className="bg-[#315E6C]/[0.08] dark:bg-white/[0.07]" />

        <DropdownMenuItem
          onSelect={onNewProject}
          className={[
            "rounded-lg px-2.5 py-2.5 text-sm",
            "focus:bg-[#E7ECE9] focus:text-[#29464E]",
            "dark:focus:bg-white/[0.05] dark:focus:text-white",
          ].join(" ")}
        >
          <span className="flex h-7 w-7 items-center justify-center rounded-md bg-[#DDE7E4] text-[#315E6C] dark:bg-[#DEDA00]/[0.08] dark:text-[#DEDA00]">
            <FolderPlusIcon size={13} />
          </span>

          New project
        </DropdownMenuItem>

        <DropdownMenuItem
          onSelect={onSettings}
          className="rounded-lg px-2.5 py-2.5 text-sm focus:bg-[#E7ECE9] focus:text-[#29464E] dark:focus:bg-white/[0.05] dark:focus:text-white"
        >
          <span className="flex h-7 w-7 items-center justify-center rounded-md bg-[#E8ECE9] text-[#65787C] dark:bg-white/[0.04] dark:text-white/45">
            <SettingsIcon size={13} />
          </span>

          Settings
        </DropdownMenuItem>

        <DropdownMenuItem
          onSelect={onHelp}
          className="rounded-lg px-2.5 py-2.5 text-sm focus:bg-[#E7ECE9] focus:text-[#29464E] dark:focus:bg-white/[0.05] dark:focus:text-white"
        >
          <span className="flex h-7 w-7 items-center justify-center rounded-md bg-[#E8ECE9] text-[#65787C] dark:bg-white/[0.04] dark:text-white/45">
            <CircleHelpIcon size={13} />
          </span>

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
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className={[
            "group ml-0.5 flex h-10 min-w-0 items-center gap-2.5 rounded-xl px-1.5",
            "transition-colors duration-200",
            "hover:bg-[#E5EBE8]",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#315E6C]/20",
            "dark:hover:bg-white/[0.05]",
            "dark:focus-visible:ring-[#DEDA00]/20",
          ].join(" ")}
          aria-label="Open account menu"
        >
          <Avatar className="h-8 w-8 shrink-0 border border-[#315E6C]/[0.10] bg-[#DDE7E4] dark:border-white/[0.09] dark:bg-[#10262D]">
            <AvatarImage
              src={user?.avatarUrl}
              alt={user?.fullName ? `${user.fullName}'s profile` : "User profile"}
              className="object-cover"
            />

            <AvatarFallback className="bg-[#DDE7E4] text-[0.62rem] font-semibold text-[#315E6C] dark:bg-[#DEDA00]/[0.08] dark:text-[#DEDA00]">
              {user?.fullName ? initials : <UserCircleIcon size={15} />}
            </AvatarFallback>
          </Avatar>

          <div className="hidden max-w-[140px] min-w-0 text-left lg:block">
            <p className="truncate text-[0.72rem] font-semibold leading-none text-[#344044] dark:text-white/80">
              {user?.fullName || "Allocatr"}
            </p>

            <p className="mt-1.5 truncate text-[0.54rem] font-medium text-[#899294] dark:text-white/25">
              Account
            </p>
          </div>
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        sideOffset={10}
        className={[
          "w-64 rounded-xl p-1.5",
          "border-[#315E6C]/[0.09] bg-[#F8FAF7] text-[#30383A]",
          "shadow-[0_18px_50px_-24px_rgba(28,48,54,0.28)]",
          "dark:border-white/[0.08] dark:bg-[#10262D] dark:text-white",
          "dark:shadow-[0_18px_50px_-24px_rgba(0,0,0,0.7)]",
        ].join(" ")}
      >
        <DropdownMenuLabel className="p-3 font-normal">
          <div className="flex min-w-0 items-center gap-3">
            <Avatar className="h-10 w-10 shrink-0 border border-[#315E6C]/[0.10] dark:border-white/[0.09]">
              <AvatarImage
                src={user?.avatarUrl}
                alt={user?.fullName ? `${user.fullName}'s profile` : "User profile"}
                className="object-cover"
              />

              <AvatarFallback className="bg-[#DDE7E4] text-xs font-semibold text-[#315E6C] dark:bg-[#DEDA00]/[0.08] dark:text-[#DEDA00]">
                {user?.fullName ? initials : <UserCircleIcon size={17} />}
              </AvatarFallback>
            </Avatar>

            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-[#30383A] dark:text-white">
                {user?.fullName || "Allocatr user"}
              </p>

              <p className="mt-1 truncate text-[0.65rem] text-[#7D898B] dark:text-white/30">
                {user?.email || "No email available"}
              </p>
            </div>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator className="bg-[#315E6C]/[0.08] dark:bg-white/[0.07]" />

        <DropdownMenuGroup>
          <DropdownMenuItem
            onSelect={onProfile}
            className="rounded-lg px-2.5 py-2.5 text-sm focus:bg-[#E7ECE9] focus:text-[#29464E] dark:focus:bg-white/[0.05] dark:focus:text-white"
          >
            <User2Icon size={14} className="text-[#65787C] dark:text-white/40" />
            Profile
          </DropdownMenuItem>

          <DropdownMenuItem
            onSelect={onSettings}
            className="rounded-lg px-2.5 py-2.5 text-sm focus:bg-[#E7ECE9] focus:text-[#29464E] dark:focus:bg-white/[0.05] dark:focus:text-white"
          >
            <SettingsIcon size={14} className="text-[#65787C] dark:text-white/40" />
            Settings
          </DropdownMenuItem>
        </DropdownMenuGroup>

        {!user?.isAllocat && (
          <>
            <DropdownMenuSeparator className="bg-[#315E6C]/[0.08] dark:bg-white/[0.07]" />

            <DropdownMenuItem
              onSelect={event => {
                event.preventDefault();
                onBecomeAllocat();
              }}
              className={[
                "rounded-lg px-2.5 py-2.5",
                "focus:bg-[#E4ECE8] focus:text-[#29464E]",
                "dark:focus:bg-[#DEDA00]/[0.06] dark:focus:text-white",
              ].join(" ")}
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#DDE7E4] text-[#315E6C] dark:bg-[#DEDA00]/[0.08] dark:text-[#DEDA00]">
                <BadgeCheckIcon size={14} />
              </span>

              <div className="min-w-0">
                <p className="text-sm font-medium">
                  Become an Allocat
                </p>

                <p className="mt-0.5 text-[0.6rem] text-[#7F8A8C] dark:text-white/28">
                  Offer your skills
                </p>
              </div>
            </DropdownMenuItem>
          </>
        )}

        <DropdownMenuSeparator className="bg-[#315E6C]/[0.08] dark:bg-white/[0.07]" />

        <DropdownMenuItem
          disabled={loggingOut}
          onSelect={event => {
            event.preventDefault();
            void onLogout();
          }}
          className={[
            "rounded-lg px-2.5 py-2.5 font-medium",
            "text-[#7C8789] focus:bg-[#E7ECE9] focus:text-[#3C4B4E]",
            "dark:text-white/35 dark:focus:bg-white/[0.05] dark:focus:text-white/75",
          ].join(" ")}
        >
          <LogOutIcon size={14} />

          {loggingOut ? "Logging out..." : "Log out"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default DashboardMainNav;