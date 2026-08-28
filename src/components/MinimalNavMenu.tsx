import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import {
  ArrowLeftIcon,
  CheckIcon,
  LogOutIcon,
  MoonIcon,
  SettingsIcon,
  SunIcon,
  User2Icon,
  UserCircleIcon,
} from "lucide-react";

import {
  useAuth,
} from "@/auth/useAuth";

import AllocatrLogo from "./AllocatrLogo";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "./ui/avatar";

import {
  Button,
} from "./ui/button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

type Theme =
  | "light"
  | "dark";

/* =========================================================
   HELPERS
========================================================= */

function getInitials(
  name?: string,
) {
  if (!name) {
    return "U";
  }

  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map(
      (part) =>
        part
          .charAt(0)
          .toUpperCase(),
    )
    .join("");
}

/* =========================================================
   NAV
========================================================= */

function MinimalNavMenu() {
  const navigate =
    useNavigate();

  const {
    user,
    logout,
  } =
    useAuth();

  const [
    loggingOut,
    setLoggingOut,
  ] =
    useState(false);

  const [
    theme,
    setTheme,
  ] =
    useState<Theme>(() => {
      const savedTheme =
        localStorage.getItem(
          "theme",
        );

      if (
        savedTheme ===
          "light" ||
        savedTheme ===
          "dark"
      ) {
        return savedTheme;
      }

      return "dark";
    });

  const initials =
    useMemo(
      () =>
        getInitials(
          user?.fullName,
        ),
      [
        user?.fullName,
      ],
    );

  /* =======================================================
     THEME
  ======================================================= */

  useEffect(() => {
    const root =
      document.documentElement;

    root.classList.toggle(
      "dark",
      theme === "dark",
    );

    root.classList.toggle(
      "light",
      theme === "light",
    );

    localStorage.setItem(
      "theme",
      theme,
    );
  }, [
    theme,
  ]);

  function toggleTheme() {
    setTheme(
      (
        currentTheme,
      ) =>
        currentTheme ===
        "dark"
          ? "light"
          : "dark",
    );
  }

  /* =======================================================
     LOGOUT
  ======================================================= */

  async function handleLogout() {
    if (
      loggingOut
    ) {
      return;
    }

    setLoggingOut(
      true,
    );

    try {
      await logout();

      navigate(
        "/login",
        {
          replace:
            true,
        },
      );
    } catch (
      error
    ) {
      console.error(
        "Logout failed:",
        error,
      );
    } finally {
      setLoggingOut(
        false,
      );
    }
  }

  return (
    <nav
      className="flex h-16 items-center justify-between gap-5"
      aria-label="Project navigation"
    >
      {/* =====================================================
          BRAND
      ===================================================== */}

      <Link
        to="/projects"
        aria-label="Go to projects"
        className={[
          "group inline-flex shrink-0 items-center",
          "rounded-lg",
          "focus-visible:outline-none",
          "focus-visible:ring-2",
          "focus-visible:ring-primary/30",
        ].join(
          " ",
        )}
      >
        <AllocatrLogo
          theme={
            theme
          }
          className="w-[6.5rem] sm:w-[7rem]"
        />
      </Link>

      {/* =====================================================
          ACTIONS
      ===================================================== */}

      <div className="flex shrink-0 items-center gap-1.5">
        {/* Back to projects */}

        <Button
          asChild
          variant="ghost"
          className={[
            "group h-9 rounded-lg",
            "px-2.5 sm:px-3.5",
            "text-xs font-semibold",
            "text-muted-foreground",
            "shadow-none",
            "hover:bg-muted/40",
            "hover:text-foreground",
          ].join(
            " ",
          )}
        >
          <Link to="/projects">
            <ArrowLeftIcon
              size={
                14
              }
              className="transition-transform duration-200 group-hover:-translate-x-0.5"
            />

            <span className="hidden sm:inline">
              Projects
            </span>
          </Link>
        </Button>

        {/* Divider */}

        <span className="mx-1 hidden h-5 w-px bg-border/80 sm:block" />

        {/* Theme */}

        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={
            toggleTheme
          }
          className={[
            "h-9 w-9 rounded-lg",
            "text-muted-foreground",
            "shadow-none",
            "hover:bg-muted/40",
            "hover:text-foreground",
          ].join(
            " ",
          )}
          aria-label={
            theme ===
            "dark"
              ? "Switch to light mode"
              : "Switch to dark mode"
          }
        >
          {theme ===
          "dark" ? (
            <SunIcon
              size={
                15
              }
            />
          ) : (
            <MoonIcon
              size={
                15
              }
            />
          )}
        </Button>

        {/* Account */}

        <AccountMenu
          user={
            user
          }
          initials={
            initials
          }
          loggingOut={
            loggingOut
          }
          onLogout={
            handleLogout
          }
          onProfile={() =>
            navigate(
              "/profile",
            )
          }
          onSettings={() =>
            navigate(
              "/settings",
            )
          }
        />
      </div>
    </nav>
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
}: {
  user?: {
    fullName?: string;
    email?: string;
    avatarUrl?: string;
  } | null;

  initials: string;

  loggingOut: boolean;

  onLogout: () => void;
  onProfile: () => void;
  onSettings: () => void;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        asChild
      >
        <button
          type="button"
          className={[
            "group ml-0.5 flex h-9 items-center gap-2",
            "rounded-lg px-1.5",
            "transition-colors",
            "hover:bg-muted/40",
            "focus-visible:outline-none",
            "focus-visible:ring-2",
            "focus-visible:ring-primary/30",
          ].join(
            " ",
          )}
          aria-label="Open account menu"
        >
          <Avatar className="h-7 w-7 border border-border/80">
            <AvatarImage
              src={
                user?.avatarUrl
              }
              alt={
                user?.fullName
                  ? `${user.fullName}'s profile`
                  : "User profile"
              }
              className="object-cover"
            />

            <AvatarFallback className="bg-primary/[0.08] text-[0.62rem] font-bold text-primary">
              {user?.fullName ? (
                initials
              ) : (
                <UserCircleIcon
                  size={
                    15
                  }
                />
              )}
            </AvatarFallback>
          </Avatar>

          <div className="hidden max-w-[120px] text-left lg:block">
            <p className="truncate text-xs font-semibold leading-none">
              {user?.fullName ||
                "Allocatr"}
            </p>

            <p className="mt-1 truncate text-[0.58rem] text-muted-foreground">
              Account
            </p>
          </div>
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        sideOffset={
          10
        }
        className={[
          "w-64 rounded-xl",
          "border-border/90",
          "bg-popover",
          "p-1.5",
          "text-popover-foreground",
          "shadow-xl shadow-black/[0.06]",
          "dark:shadow-black/25",
        ].join(
          " ",
        )}
      >
        {/* User */}

        <DropdownMenuLabel className="p-3 font-normal">
          <div className="flex min-w-0 items-center gap-3">
            <Avatar className="h-10 w-10 shrink-0 border border-border">
              <AvatarImage
                src={
                  user?.avatarUrl
                }
                alt={
                  user?.fullName
                    ? `${user.fullName}'s profile`
                    : "User profile"
                }
                className="object-cover"
              />

              <AvatarFallback className="bg-primary/[0.08] text-xs font-bold text-primary">
                {user?.fullName ? (
                  initials
                ) : (
                  <UserCircleIcon
                    size={
                      17
                    }
                  />
                )}
              </AvatarFallback>
            </Avatar>

            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-foreground">
                {user?.fullName ||
                  "Allocatr user"}
              </p>

              <p className="mt-1 truncate text-[0.68rem] text-muted-foreground">
                {user?.email ||
                  "No email available"}
              </p>
            </div>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        {/* Account section */}

        <DropdownMenuGroup>
          <DropdownMenuItem
            onSelect={
              onProfile
            }
            className="rounded-lg px-2.5 py-2 text-sm"
          >
            <User2Icon
              size={
                15
              }
            />

            Profile
          </DropdownMenuItem>

          <DropdownMenuItem
            onSelect={
              onSettings
            }
            className="rounded-lg px-2.5 py-2 text-sm"
          >
            <SettingsIcon
              size={
                15
              }
            />

            Settings
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        {/* Theme status */}

        <div className="flex items-center justify-between px-2.5 py-2">
          <div>
            <p className="text-xs font-medium">
              Appearance
            </p>

            <p className="mt-0.5 text-[0.62rem] text-muted-foreground">
              Uses your selected theme
            </p>
          </div>

          <span className="flex h-6 items-center gap-1.5 rounded-md bg-muted px-2 text-[0.6rem] font-semibold capitalize text-muted-foreground">
            <CheckIcon
              size={
                10
              }
              className="text-primary"
            />

            Current
          </span>
        </div>

        <DropdownMenuSeparator />

        {/* Logout */}

        <DropdownMenuItem
          disabled={
            loggingOut
          }
          onSelect={(
            event,
          ) => {
            event.preventDefault();

            void onLogout();
          }}
          className={[
            "rounded-lg px-2.5 py-2",
            "font-medium text-destructive",
            "focus:bg-destructive/[0.07]",
            "focus:text-destructive",
          ].join(
            " ",
          )}
        >
          <LogOutIcon
            size={
              15
            }
          />

          {loggingOut
            ? "Logging out..."
            : "Log out"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default MinimalNavMenu;