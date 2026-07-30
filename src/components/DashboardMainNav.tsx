import {
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  BadgeCheckIcon,
  BellIcon,
  ChevronDownIcon,
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

type Props = {
  children?: ReactNode;
};

type Theme = "light" | "dark";

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

function DashboardMainNav({ children }: Props) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [theme, setTheme] = useState<Theme>(() => {
    const savedTheme = localStorage.getItem("theme");

    if (savedTheme === "light" || savedTheme === "dark") {
      return savedTheme;
    }

    return "dark";
  });

  const [becomeAllocatOpen, setBecomeAllocatOpen] =
    useState(false);

  const [becomingAllocat, setBecomingAllocat] =
    useState(false);

  const [loggingOut, setLoggingOut] =
    useState(false);

  useEffect(() => {
    const root = document.documentElement;

    root.classList.toggle("dark", theme === "dark");
    root.classList.toggle("light", theme === "light");

    localStorage.setItem("theme", theme);
  }, [theme]);

  const firstName = useMemo(() => {
    return (
      user?.fullName?.trim().split(/\s+/)[0] ||
      "Account"
    );
  }, [user?.fullName]);

  const initials = useMemo(() => {
    return getInitials(user?.fullName);
  }, [user?.fullName]);

  function toggleTheme() {
    setTheme((currentTheme) =>
      currentTheme === "dark" ? "light" : "dark",
    );
  }

  async function handleLogout() {
    if (loggingOut) {
      return;
    }

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
    if (becomingAllocat) {
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

      setBecomeAllocatOpen(false);
      navigate("/allocats/profile/create");
    } catch (error) {
      console.error(
        "Could not update account mode:",
        error,
      );
    } finally {
      setBecomingAllocat(false);
    }
  }

  return (
    <>
      <nav
        className="flex h-14 items-center justify-between gap-3"
        aria-label="Dashboard navigation"
      >
        {/* Brand and page context */}
        <div className="flex min-w-0 items-center gap-3">
          <Link
            to="/projects"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl transition-colors hover:bg-muted"
            aria-label="Go to projects"
          >
            <AllocatrIconLogo
              theme={theme}
              className="w-5"
            />
          </Link>

          {children && (
            <div className="hidden min-w-0 border-l border-border pl-3 md:block">
              {children}
            </div>
          )}
        </div>

        {/* Navigation controls */}
        <div className="flex shrink-0 items-center gap-1">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full text-muted-foreground hover:bg-muted hover:text-foreground"
            onClick={toggleTheme}
            aria-label={
              theme === "dark"
                ? "Switch to light mode"
                : "Switch to dark mode"
            }
          >
            {theme === "dark" ? (
              <SunIcon size={16} />
            ) : (
              <MoonIcon size={16} />
            )}
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="relative h-8 w-8 rounded-full text-muted-foreground hover:bg-muted hover:text-foreground"
            aria-label="Open notifications"
          >
            <BellIcon size={16} />

            <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-primary" />
          </Button>

          {/* Quick actions - visible at every breakpoint */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full text-muted-foreground hover:bg-muted hover:text-foreground"
                aria-label="Open quick actions"
              >
                <MenuIcon size={16} />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="end"
              sideOffset={8}
              className="w-56 rounded-2xl border-border bg-popover p-2 text-popover-foreground shadow-xl"
            >
              <DropdownMenuLabel className="px-3 py-2">
                <p className="text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                  Quick actions
                </p>
              </DropdownMenuLabel>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                className="rounded-xl"
                onClick={() =>
                  navigate("/projects/new")
                }
              >
                <FolderPlusIcon size={16} />
                New project
              </DropdownMenuItem>

              <DropdownMenuItem
                className="rounded-xl"
                onClick={() =>
                  navigate("/settings")
                }
              >
                <SettingsIcon size={16} />
                Settings
              </DropdownMenuItem>

              <DropdownMenuItem
                className="rounded-xl"
                onClick={() => navigate("/help")}
              >
                <CircleHelpIcon size={16} />
                Help and support
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Compact account menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className={[
                  "ml-1 flex min-w-0 items-center gap-2 rounded-full",
                  "border border-border bg-background p-1 pr-1",
                  "text-foreground transition-colors",
                  "hover:bg-muted/60",
                  "focus-visible:outline-none focus-visible:ring-2",
                  "focus-visible:ring-ring focus-visible:ring-offset-2",
                ].join(" ")}
                aria-label="Open account menu"
              >
                <Avatar className="h-7 w-7 shrink-0">
                  <AvatarImage
                    src={user?.avatarUrl}
                    alt={
                      user?.fullName
                        ? `${user.fullName}'s profile`
                        : "User profile"
                    }
                    className="object-cover"
                  />

                  <AvatarFallback className="bg-primary/10 text-[0.65rem] font-bold text-primary">
                    {user?.fullName ? (
                      initials
                    ) : (
                      <UserCircleIcon size={15} />
                    )}
                  </AvatarFallback>
                </Avatar>

                <div className="hidden min-w-0 text-left xl:block">
                  <p className="max-w-24 truncate text-xs font-semibold">
                    {firstName}
                  </p>
                </div>

                <ChevronDownIcon
                  size={13}
                  className="mr-1 hidden shrink-0 text-muted-foreground sm:block"
                />
              </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="end"
              sideOffset={8}
              className="w-64 rounded-[1.25rem] border-border bg-popover p-2 text-popover-foreground shadow-xl"
            >
              <DropdownMenuLabel className="p-2">
                <div className="flex min-w-0 items-center gap-3">
                  <Avatar className="h-10 w-10 shrink-0">
                    <AvatarImage
                      src={user?.avatarUrl}
                      alt={
                        user?.fullName
                          ? `${user.fullName}'s profile`
                          : "User profile"
                      }
                      className="object-cover"
                    />

                    <AvatarFallback className="bg-primary/10 text-sm font-bold text-primary">
                      {user?.fullName ? (
                        initials
                      ) : (
                        <UserCircleIcon size={18} />
                      )}
                    </AvatarFallback>
                  </Avatar>

                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-foreground">
                      {user?.fullName ||
                        "Allocatr user"}
                    </p>

                    <p className="mt-0.5 truncate text-xs font-normal text-muted-foreground">
                      {user?.email ||
                        "No email available"}
                    </p>
                  </div>
                </div>
              </DropdownMenuLabel>

              <DropdownMenuSeparator />

              <DropdownMenuGroup>
                <DropdownMenuItem
                  className="rounded-xl"
                  onSelect={(event) => {
                    event.preventDefault();
                    setBecomeAllocatOpen(true);
                  }}
                >
                  <BadgeCheckIcon size={16} />
                  Become an Allocat
                </DropdownMenuItem>

                <DropdownMenuItem
                  className="rounded-xl"
                  onClick={() =>
                    navigate("/profile")
                  }
                >
                  <User2Icon size={16} />
                  Profile
                </DropdownMenuItem>

                <DropdownMenuItem
                  className="rounded-xl"
                  onClick={() =>
                    navigate("/settings")
                  }
                >
                  <SettingsIcon size={16} />
                  Settings
                </DropdownMenuItem>
              </DropdownMenuGroup>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                onSelect={(event) => {
                  event.preventDefault();
                  void handleLogout();
                }}
                disabled={loggingOut}
                className="rounded-xl font-medium text-destructive focus:bg-destructive/10 focus:text-destructive"
              >
                <LogOutIcon size={16} />

                {loggingOut
                  ? "Logging out..."
                  : "Log out"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </nav>

      <BecomeAllocatDialog
        open={becomeAllocatOpen}
        onOpenChange={setBecomeAllocatOpen}
        onContinue={() =>
          void handleBecomeAllocat()
        }
      />
    </>
  );
}

export default DashboardMainNav;