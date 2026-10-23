import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowUpRightIcon,
  ChevronDownIcon,
  FolderOpenIcon,
  LogOutIcon,
  MoonIcon,
  SettingsIcon,
  SunIcon,
  User2Icon,
  UserCircleIcon,
} from "lucide-react";
import { useAuth } from "@/auth/useAuth";
import AllocatrIconLogo from "@/components/AllocatrIconLogo";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
type Theme = "light" | "dark";
const focus =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/35";
const accountItem =
  "flex min-h-11 gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-foreground/80 transition-colors focus:bg-surface-3/60 focus:text-foreground data-[highlighted]:bg-surface-3/60 data-[highlighted]:text-foreground dark:focus:bg-surface-3/70 dark:data-[highlighted]:bg-surface-3/70 motion-reduce:transition-none [&_svg]:shrink-0 [&_svg]:text-muted-foreground";
const quietAction = [
  "h-11 rounded-xl px-3 text-xs font-medium text-muted-foreground shadow-none",
  "transition-colors hover:bg-surface-2/80 hover:text-foreground",
  "dark:hover:bg-surface-3/65 motion-reduce:transition-none",
  focus,
].join(" ");
function getInitialTheme(): Theme {
  if (typeof window === "undefined") return "dark";
  try {
    const saved = window.localStorage.getItem("theme");
    if (saved === "light" || saved === "dark") return saved;
  } catch {
    // Theme switching remains available when browser storage is blocked.
  }
  return document.documentElement.classList.contains("light")
    ? "light"
    : "dark";
}
/** Shared public header for Discover and Allocat public profiles. */
export default function MinimalNavMenu() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [loggingOut, setLoggingOut] = useState(false);
  const logoutBusy = useRef(false);
  const signedIn = Boolean(user?.userId);
  const [theme, setTheme] = useState<Theme>(getInitialTheme);
  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", theme === "dark");
    root.classList.toggle("light", theme === "light");
    root.style.colorScheme = theme;
    try {
      window.localStorage.setItem("theme", theme);
    } catch {
      /* Storage is optional. */
    }
  }, [theme]);
  async function handleLogout() {
    if (!user?.userId || logoutBusy.current) return;
    logoutBusy.current = true;
    setLoggingOut(true);
    try {
      await logout();
      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error("You could not be signed out. Please try again.");
    } finally {
      logoutBusy.current = false;
      setLoggingOut(false);
    }
  }
  const initials = user?.fullName
    ?.trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
  const accountAvatar = (
    <Avatar className="h-8 w-8 shrink-0 border border-border/60 ring-2 ring-background">
      <AvatarImage
        src={user?.avatarUrl || undefined}
        alt={user?.fullName ? `${user.fullName}'s profile` : "Your profile"}
        className="object-cover"
      />
      <AvatarFallback className="bg-surface-3/75 text-xs font-semibold text-brand-secondary-highlight dark:bg-surface-2 dark:text-secondary">
        {initials || <UserCircleIcon size={16} aria-hidden="true" />}
      </AvatarFallback>
    </Avatar>
  );
  return (
    <nav
      aria-label="Public navigation"
      className="flex h-16 min-w-0 items-center justify-between gap-3 bg-background"
    >
      <Link
        to={signedIn ? "/projects" : "/"}
        aria-label={signedIn ? "Go to projects" : "Allocatr home"}
        className={[
          "group flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border",
          "border-border/60 bg-card",
          "transition-[background-color,border-color] duration-200",
          "hover:border-border hover:bg-surface-2/60",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/35",
          "dark:border-border",
          "dark:hover:bg-surface-2/60",
          "motion-reduce:transition-none",
        ].join(" ")}
      >
        <span className="flex h-6 w-6 shrink-0 items-center justify-center overflow-hidden rounded-full [&_img]:h-[22px] [&_img]:w-[22px] [&_img]:max-h-[22px] [&_img]:max-w-[22px] [&_img]:object-contain [&_svg]:h-[22px] [&_svg]:w-[22px] [&_svg]:max-h-[22px] [&_svg]:max-w-[22px]">
          <AllocatrIconLogo theme="" />
        </span>
      </Link>
      <div className="flex shrink-0 items-center gap-1 sm:gap-2">
        {signedIn && (
          <Button asChild variant="ghost" className={quietAction}>
            <Link to="/projects">
              <FolderOpenIcon size={16} aria-hidden="true" />
              <span>Projects</span>
            </Link>
          </Button>
        )}
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() =>
            setTheme((current) => (current === "dark" ? "light" : "dark"))
          }
          className={
            "h-11 w-11 rounded-xl text-muted-foreground shadow-none transition-colors hover:bg-surface-2/80 hover:text-foreground motion-reduce:transition-none " +
            focus
          }
          aria-label={
            theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
          }
          title={
            theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
          }
        >
          {theme === "dark" ? (
            <SunIcon size={16} aria-hidden="true" />
          ) : (
            <MoonIcon size={16} aria-hidden="true" />
          )}
        </Button>
        {signedIn && user && (
          <>
            <span className="mx-1 hidden h-5 w-px bg-border/70 sm:block" />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  aria-label="Open account menu"
                  className={
                    "group ml-0.5 flex h-11 min-w-0 items-center gap-2.5 rounded-xl border border-transparent px-1.5 text-foreground transition-colors hover:border-border/55 hover:bg-surface-2/60 data-[state=open]:border-border/65 data-[state=open]:bg-surface-2/70 dark:hover:bg-surface-3/65 motion-reduce:transition-none lg:pr-3 " +
                    focus
                  }
                >
                  {accountAvatar}
                  <span className="hidden min-w-0 max-w-[132px] text-left lg:block">
                    <span className="block truncate text-xs font-medium text-foreground/85">
                      {user.fullName || "Your account"}
                    </span>
                    <span className="mt-0.5 block text-[10px] text-muted-foreground">
                      {user.isAllocat ? "Allocat account" : "Account"}
                    </span>
                  </span>
                  <ChevronDownIcon
                    size={13}
                    aria-hidden="true"
                    className="hidden shrink-0 text-muted-foreground/70 transition-transform group-data-[state=open]:rotate-180 motion-reduce:transition-none lg:block"
                  />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                sideOffset={8}
                collisionPadding={12}
                className="w-64 max-w-[calc(100vw_-_1.5rem)] rounded-2xl border border-border/70 bg-popover p-1.5 text-popover-foreground shadow-lg shadow-black/5"
              >
                <DropdownMenuLabel className="rounded-xl bg-surface-2/40 p-3 font-normal">
                  <div className="flex min-w-0 items-center gap-3">
                    {accountAvatar}
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold">
                        {user.fullName || "Your account"}
                      </p>
                      {user.email && (
                        <p className="mt-1 truncate text-xs text-muted-foreground">
                          {user.email}
                        </p>
                      )}
                      {user.isAllocat && (
                        <p className="mt-1 text-[11px] font-medium text-brand-secondary-highlight dark:text-secondary">
                          Allocat
                        </p>
                      )}
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-border/60" />
                <DropdownMenuItem
                  onSelect={() =>
                    navigate(user.isAllocat ? "/allocats/profile" : "/profile")
                  }
                  className={accountItem}
                >
                  <User2Icon size={16} aria-hidden="true" />
                  {user.isAllocat ? "Allocat profile" : "Profile"}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onSelect={() => navigate("/settings")}
                  className={accountItem}
                >
                  <SettingsIcon size={16} aria-hidden="true" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-border/60" />
                <DropdownMenuItem
                  disabled={loggingOut}
                  onSelect={(event) => {
                    event.preventDefault();
                    void handleLogout();
                  }}
                  className={
                    accountItem +
                    " focus:bg-destructive/[0.07] focus:text-destructive data-[highlighted]:bg-destructive/[0.07] data-[highlighted]:text-destructive dark:focus:bg-destructive/[0.12] dark:data-[highlighted]:bg-destructive/[0.12] focus:[&_svg]:text-destructive data-[highlighted]:[&_svg]:text-destructive"
                  }
                >
                  <LogOutIcon size={16} aria-hidden="true" />
                  {loggingOut ? "Logging out..." : "Log out"}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        )}
        {!signedIn && (
          <Button
            asChild
            variant="outline"
            className={
              "ml-1 h-11 rounded-xl border-border/65 bg-card px-4 text-xs font-medium text-foreground/85 shadow-none hover:border-border hover:bg-surface-2/60 hover:text-foreground motion-reduce:transition-none " +
              focus
            }
          >
            <Link to="/login">
              Sign in
              <ArrowUpRightIcon size={13} aria-hidden="true" />
            </Link>
          </Button>
        )}
      </div>
    </nav>
  );
}
