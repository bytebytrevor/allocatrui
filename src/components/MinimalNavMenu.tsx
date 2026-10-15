import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowUpRightIcon,
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
  "rounded-lg px-2.5 py-2 text-sm text-foreground/75 transition-colors focus:bg-surface-3/60 focus:text-foreground dark:focus:bg-surface-3/70 motion-reduce:transition-none";
const quietAction = [
  "h-9 rounded-lg px-3 text-xs font-semibold text-muted-foreground shadow-none",
  "transition-colors hover:bg-surface-3/55 hover:text-foreground",
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
    <Avatar className="h-8 w-8 shrink-0 border border-border/70">
      <AvatarImage
        src={user?.avatarUrl || undefined}
        alt={user?.fullName ? `${user.fullName}'s profile` : "Your profile"}
        className="object-cover"
      />
      <AvatarFallback className="bg-surface-3/75 text-[0.62rem] font-semibold text-brand-secondary-highlight dark:bg-surface-2 dark:text-secondary">
        {initials || <UserCircleIcon size={15} />}
      </AvatarFallback>
    </Avatar>
  );
  return (
    <nav
      aria-label="Public navigation"
      className="flex h-16 min-w-0 items-center justify-between gap-3 bg-background sm:h-[4.25rem]"
    >
      <Link
        to={signedIn ? "/projects" : "/"}
        aria-label={signedIn ? "Go to projects" : "Allocatr home"}
        className={[
          "group flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border",
          "border-border/65 bg-surface-2/55 ring-1 ring-inset ring-border/20",
          "transition-[background-color,border-color] duration-200",
          "hover:border-border/85 hover:bg-surface-3/60",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-secondary-highlight/20",
          "dark:border-border dark:bg-surface-2/70 dark:ring-border/40",
          "dark:hover:bg-surface-3/70 dark:focus-visible:ring-secondary/20",
          "motion-reduce:transition-none",
        ].join(" ")}
      >
        <span className="flex h-[22px] w-[22px] shrink-0 items-center justify-center overflow-hidden rounded-full [&_img]:h-[18px] [&_img]:w-[18px] [&_img]:max-h-[18px] [&_img]:max-w-[18px] [&_img]:object-contain [&_svg]:h-[18px] [&_svg]:w-[18px] [&_svg]:max-h-[18px] [&_svg]:max-w-[18px]">
          <AllocatrIconLogo theme="" />
        </span>
      </Link>
      <div className="flex shrink-0 items-center gap-1 sm:gap-2">
        {signedIn && (
          <Button asChild variant="ghost" className={quietAction}>
            <Link to="/projects">
              <FolderOpenIcon size={14} aria-hidden="true" />
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
            "h-9 w-9 rounded-lg text-muted-foreground shadow-none transition-colors hover:bg-surface-3/55 hover:text-foreground motion-reduce:transition-none " +
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
            <SunIcon size={15} aria-hidden="true" />
          ) : (
            <MoonIcon size={15} aria-hidden="true" />
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
                    "ml-0.5 flex h-10 items-center gap-2.5 rounded-lg px-1.5 transition-colors hover:bg-surface-3/55 dark:hover:bg-surface-3/65 motion-reduce:transition-none " +
                    focus
                  }
                >
                  {accountAvatar}
                  <span className="hidden min-w-0 max-w-[140px] text-left lg:block">
                    <span className="block truncate text-[0.72rem] font-semibold text-foreground/85">
                      {user.fullName || "Your account"}
                    </span>
                    <span className="mt-0.5 block text-[0.54rem] text-muted-foreground">
                      {user.isAllocat ? "Allocat account" : "Account"}
                    </span>
                  </span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                sideOffset={10}
                className="w-64 rounded-xl border border-border/70 bg-popover p-1.5 text-popover-foreground shadow-none"
              >
                <DropdownMenuLabel className="p-3 font-normal">
                  <div className="flex min-w-0 items-center gap-3">
                    {accountAvatar}
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold">
                        {user.fullName || "Your account"}
                      </p>
                      {user.email && (
                        <p className="mt-1 truncate text-[0.68rem] text-muted-foreground">
                          {user.email}
                        </p>
                      )}
                      {user.isAllocat && (
                        <p className="mt-1 text-[0.58rem] font-medium text-brand-secondary-highlight dark:text-secondary">
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
                  <User2Icon size={14} />
                  {user.isAllocat ? "Allocat profile" : "Profile"}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onSelect={() => navigate("/settings")}
                  className={accountItem}
                >
                  <SettingsIcon size={14} />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-border/60" />
                <DropdownMenuItem
                  disabled={loggingOut}
                  onSelect={(event) => {
                    event.preventDefault();
                    void handleLogout();
                  }}
                  className="rounded-lg px-2.5 py-2 text-sm text-foreground/75 focus:bg-destructive/[0.07] focus:text-destructive dark:focus:bg-destructive/[0.12]"
                >
                  <LogOutIcon size={14} />
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
              "ml-1 h-9 rounded-lg border-border/65 bg-surface-2/40 px-3.5 text-xs font-semibold text-foreground/80 shadow-none hover:border-border hover:bg-surface-3/60 hover:text-foreground " +
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
