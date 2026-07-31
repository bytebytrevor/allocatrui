import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeftIcon,
  LogOutIcon,
  MoonIcon,
  SettingsIcon,
  SunIcon,
  User2Icon,
  UserCircleIcon,
} from "lucide-react";

import { useAuth } from "@/auth/useAuth";
import AllocatrLogo from "./AllocatrLogo";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "./ui/avatar";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

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

function MinimalNavMenu() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [loggingOut, setLoggingOut] = useState(false);

  const [theme, setTheme] = useState<Theme>(() => {
    const savedTheme = localStorage.getItem("theme");

    if (savedTheme === "light" || savedTheme === "dark") {
      return savedTheme;
    }

    return "dark";
  });

  const initials = useMemo(() => {
    return getInitials(user?.fullName);
  }, [user?.fullName]);

  useEffect(() => {
    const root = document.documentElement;

    root.classList.toggle("dark", theme === "dark");
    root.classList.toggle("light", theme === "light");

    localStorage.setItem("theme", theme);
  }, [theme]);

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

  return (
    <nav
      className="flex h-14 items-center justify-between gap-4"
      aria-label="Project creation navigation"
    >
      {/* Logo */}
      <Link
        to="/projects"
        className="shrink-0 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        aria-label="Go to dashboard"
      >
        <AllocatrLogo
          theme={theme}
          className="w-24 sm:w-28"
        />
      </Link>

      {/* Actions */}
      <div className="flex shrink-0 items-center gap-1 sm:gap-2">
        <Button
          asChild
          variant="ghost"
          className="h-9 rounded-full px-3 text-sm font-semibold text-muted-foreground hover:text-foreground sm:px-4"
        >
          <Link to="/projects">
            <ArrowLeftIcon size={15} />

            <span className="hidden sm:inline">
              Dashboard
            </span>
          </Link>
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          className="h-9 w-9 rounded-full text-muted-foreground hover:bg-muted hover:text-foreground"
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

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="ml-1 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              aria-label="Open account menu"
            >
              <Avatar className="h-8 w-8 border border-border transition-colors hover:border-primary/40">
                <AvatarImage
                  src={user?.avatarUrl}
                  alt={
                    user?.fullName
                      ? `${user.fullName}'s profile`
                      : "User profile"
                  }
                  className="object-cover"
                />

                <AvatarFallback className="bg-primary/10 text-xs font-bold text-primary">
                  {user?.fullName ? (
                    initials
                  ) : (
                    <UserCircleIcon size={17} />
                  )}
                </AvatarFallback>
              </Avatar>
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="end"
            sideOffset={8}
            className="w-64 rounded-[1.25rem] border-border bg-popover p-2 text-popover-foreground shadow-xl"
          >
            <DropdownMenuLabel className="p-2">
              <div className="flex min-w-0 items-center gap-3">
                <Avatar className="h-10 w-10 shrink-0 border border-border">
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
                    {user?.fullName || "Allocatr user"}
                  </p>

                  <p className="mt-0.5 truncate text-xs font-normal text-muted-foreground">
                    {user?.email || "No email available"}
                  </p>
                </div>
              </div>
            </DropdownMenuLabel>

            <DropdownMenuSeparator />

            <DropdownMenuGroup>
              <DropdownMenuItem
                className="rounded-xl"
                onClick={() => navigate("/profile")}
              >
                <User2Icon size={16} />
                Profile
              </DropdownMenuItem>

              <DropdownMenuItem
                className="rounded-xl"
                onClick={() => navigate("/settings")}
              >
                <SettingsIcon size={16} />
                Settings
              </DropdownMenuItem>
            </DropdownMenuGroup>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              disabled={loggingOut}
              onSelect={(event) => {
                event.preventDefault();
                void handleLogout();
              }}
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
  );
}

export default MinimalNavMenu;