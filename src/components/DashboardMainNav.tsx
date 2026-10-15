import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BadgeCheckIcon, BellIcon, CircleHelpIcon, EllipsisVerticalIcon, FolderPlusIcon, LogOutIcon, MoonIcon, SettingsIcon, SunIcon, User2Icon, UserCircleIcon, } from "lucide-react";
import api from "@/api/axios";
import { useAuth } from "@/auth/useAuth";
import AllocatrIconLogo from "@/components/AllocatrIconLogo";
import BecomeAllocatDialog from "@/components/BecomeAllocatDialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger, } from "@/components/ui/dropdown-menu";
type Theme = "light" | "dark";
type Props = {
    children?: ReactNode;
    notificationCount?: number;
};
type AccountUser = {
    fullName?: string | null;
    email?: string | null;
    avatarUrl?: string | null;
    isAllocat?: boolean;
};
const focus = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/35";
const navIconButton = [
    "relative h-9 w-9 rounded-lg text-muted-foreground shadow-none",
    "transition-colors duration-200 motion-reduce:transition-none",
    "hover:bg-surface-3/55 hover:text-foreground",
    "dark:hover:bg-surface-3/65",
    focus,
].join(" ");
const dropdownSurface = "rounded-xl border border-border/70 bg-popover p-1.5 text-popover-foreground shadow-none";
const dropdownItem = "rounded-lg px-2.5 py-2 text-sm text-foreground/75 transition-colors focus:bg-surface-3/60 focus:text-foreground dark:focus:bg-surface-3/70 motion-reduce:transition-none";
const destructiveDropdownItem = [
    dropdownItem,
    "font-medium focus:bg-destructive/[0.07] focus:text-destructive",
    "data-[highlighted]:bg-destructive/[0.07] data-[highlighted]:text-destructive",
    "[&_svg]:text-muted-foreground focus:[&_svg]:text-destructive data-[highlighted]:[&_svg]:text-destructive",
    "dark:focus:bg-destructive/[0.12] dark:data-[highlighted]:bg-destructive/[0.12]",
].join(" ");
function getInitials(name?: string | null) {
    return name?.trim().split(/\s+/).slice(0, 2).map((part) => part.charAt(0).toUpperCase()).join("") || "U";
}
function getInitialTheme(): Theme {
    if (typeof window === "undefined")
        return "dark";
    try {
        const saved = window.localStorage.getItem("theme");
        if (saved === "light" || saved === "dark")
            return saved;
    }
    catch {
        // Theme switching still works when browser storage is unavailable.
    }
    return document.documentElement.classList.contains("light") ? "light" : "dark";
}
/** Account navigation for authenticated workspace pages. */
export default function DashboardMainNav({ children, notificationCount = 0 }: Props) {
    const navigate = useNavigate();
    const { user, logout, refreshUser } = useAuth();
    const signedIn = Boolean(user?.userId);
    const [theme, setTheme] = useState<Theme>(getInitialTheme);
    const [loggingOut, setLoggingOut] = useState(false);
    const [becomeAllocatOpen, setBecomeAllocatOpen] = useState(false);
    const [becomingAllocat, setBecomingAllocat] = useState(false);
    const logoutBusy = useRef(false);
    const becomeBusy = useRef(false);
    const initials = useMemo(() => getInitials(user?.fullName), [user?.fullName]);
    const count = Number.isFinite(notificationCount) ? Math.max(0, Math.floor(notificationCount)) : 0;
    useEffect(() => {
        const root = document.documentElement;
        root.classList.toggle("dark", theme === "dark");
        root.classList.toggle("light", theme === "light");
        root.style.colorScheme = theme;
        try {
            window.localStorage.setItem("theme", theme);
        }
        catch { /* Storage is optional. */ }
    }, [theme]);
    useEffect(() => {
        if (!signedIn)
            setBecomeAllocatOpen(false);
    }, [signedIn]);
    async function handleLogout() {
        if (!signedIn || logoutBusy.current)
            return;
        logoutBusy.current = true;
        setLoggingOut(true);
        try {
            await logout();
            navigate("/login", { replace: true });
        }
        catch (error) {
            console.error("Logout failed:", error);
        }
        finally {
            logoutBusy.current = false;
            setLoggingOut(false);
        }
    }
    async function handleBecomeAllocat() {
        if (!signedIn || user?.isAllocat || becomeBusy.current)
            return;
        becomeBusy.current = true;
        setBecomingAllocat(true);
        try {
            await api.patch("/users/me/become-allocat", {}, { withCredentials: true });
            await refreshUser();
            setBecomeAllocatOpen(false);
            navigate("/allocats/profile/create");
        }
        catch (error) {
            console.error("Could not update account mode:", error);
            throw error;
        }
        finally {
            becomeBusy.current = false;
            setBecomingAllocat(false);
        }
    }
    if (!user?.userId)
        return null;
    return (<>
      <nav aria-label="Workspace navigation" className="flex h-16 min-w-0 items-center justify-between gap-3 bg-background sm:h-[4.25rem] sm:gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <Link to="/projects" aria-label="Go to projects" className={"group flex min-w-0 shrink-0 items-center gap-2.5 rounded-xl " + focus}>
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-border/65 bg-surface-2/55 ring-1 ring-inset ring-border/20 transition-colors group-hover:border-border group-hover:bg-surface-3/60 dark:bg-surface-2/70 motion-reduce:transition-none">
              <span className="flex h-[22px] w-[22px] items-center justify-center overflow-hidden rounded-full [&_img]:h-[18px] [&_img]:w-[18px] [&_img]:object-contain [&_svg]:h-[18px] [&_svg]:w-[18px]">
                <AllocatrIconLogo theme=""/>
              </span>
            </span>
          </Link>
          {children && <><span className="hidden h-5 w-px bg-border/70 sm:block"/><div className="hidden min-w-0 md:block">{children}</div></>}
        </div>

        <div className="flex shrink-0 items-center gap-0.5 sm:gap-1">
          <NavIconButton label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"} onClick={() => setTheme((current) => current === "dark" ? "light" : "dark")}>
            {theme === "dark" ? <SunIcon size={14}/> : <MoonIcon size={14}/>}
          </NavIconButton>
          <>
              <NavIconButton label={count > 0 ? `${count} unread notifications` : "Notifications"} onClick={() => navigate("/notifications")} notification={count > 0}><BellIcon size={14}/></NavIconButton>
              <QuickActionsMenu onNewProject={() => navigate("/projects/new")} onSettings={() => navigate("/settings")} onHelp={() => navigate("/help")}/>
              <span className="mx-1.5 hidden h-5 w-px bg-border/70 sm:block"/>
              <AccountMenu user={user} initials={initials} loggingOut={loggingOut} onLogout={() => void handleLogout()} onProfile={() => navigate(user.isAllocat ? "/allocats/profile" : "/profile")} onSettings={() => navigate("/settings")} onBecomeAllocat={() => setBecomeAllocatOpen(true)}/>
          </>
        </div>
      </nav>
      {signedIn && !user?.isAllocat && <BecomeAllocatDialog open={becomeAllocatOpen} onOpenChange={setBecomeAllocatOpen} onContinue={handleBecomeAllocat} loading={becomingAllocat}/>}
    </>);
}
function NavIconButton({ children, label, onClick, notification = false }: {
    children: ReactNode;
    label: string;
    onClick: () => void;
    notification?: boolean;
}) {
    return (<Button type="button" variant="ghost" size="icon" onClick={onClick} className={navIconButton} aria-label={label} title={label}>
      {children}
      {notification && <span aria-hidden="true" className="absolute right-[7px] top-[7px] flex h-1.5 w-1.5"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-status-pending opacity-25 motion-reduce:animate-none"/><span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-status-pending ring-2 ring-background"/></span>}
    </Button>);
}
function QuickActionsMenu({ onNewProject, onSettings, onHelp }: {
    onNewProject: () => void;
    onSettings: () => void;
    onHelp: () => void;
}) {
    return (<DropdownMenu>
      <DropdownMenuTrigger asChild><Button type="button" variant="ghost" size="icon" className={navIconButton} aria-label="Open quick actions" title="Quick actions"><EllipsisVerticalIcon size={15}/></Button></DropdownMenuTrigger>
      <DropdownMenuContent align="end" sideOffset={10} className={"w-56 " + dropdownSurface}>
        <DropdownMenuLabel className="px-2.5 py-2 text-[0.65rem] font-semibold uppercase tracking-[0.12em] text-muted-foreground">Quick actions</DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-border/60"/>
        <DropdownMenuItem onSelect={onNewProject} className={dropdownItem}><FolderPlusIcon size={14}/>New project</DropdownMenuItem>
        <DropdownMenuItem onSelect={onSettings} className={dropdownItem}><SettingsIcon size={14}/>Settings</DropdownMenuItem>
        <DropdownMenuItem onSelect={onHelp} className={dropdownItem}><CircleHelpIcon size={14}/>Help &amp; support</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>);
}
function AccountMenu({ user, initials, loggingOut, onLogout, onProfile, onSettings, onBecomeAllocat }: {
    user: AccountUser;
    initials: string;
    loggingOut: boolean;
    onLogout: () => void;
    onProfile: () => void;
    onSettings: () => void;
    onBecomeAllocat: () => void;
}) {
    const avatar = (large = false) => (<Avatar className={(large ? "h-10 w-10" : "h-8 w-8") + " shrink-0 border border-border/70"}>
      <AvatarImage src={user.avatarUrl || undefined} alt={user.fullName ? `${user.fullName}'s profile` : "User profile"} className="object-cover"/>
      <AvatarFallback className="bg-surface-3/75 text-xs font-semibold text-brand-secondary-highlight dark:bg-surface-2 dark:text-secondary">{user.fullName ? initials : <UserCircleIcon size={16}/>}</AvatarFallback>
    </Avatar>);
    return (<DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button type="button" aria-label="Open account menu" className={"group ml-0.5 flex h-10 min-w-0 items-center gap-2.5 rounded-lg px-1.5 text-foreground transition-colors hover:bg-surface-3/55 dark:hover:bg-surface-3/65 motion-reduce:transition-none " + focus}>
          {avatar()}
          <span className="hidden min-w-0 max-w-[140px] text-left lg:block"><span className="block truncate text-[0.72rem] font-semibold text-foreground/85">{user.fullName || "Your account"}</span><span className="mt-0.5 block text-[0.54rem] text-muted-foreground">{user.isAllocat ? "Allocat account" : "Account"}</span></span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" sideOffset={10} className={"w-64 " + dropdownSurface}>
        <DropdownMenuLabel className="p-3 font-normal">
          <span className="flex min-w-0 items-center gap-3">{avatar(true)}<span className="min-w-0"><span className="block truncate text-sm font-semibold">{user.fullName || "Your account"}</span>{user.email && <span className="mt-1 block truncate text-[0.68rem] text-muted-foreground">{user.email}</span>}{user.isAllocat && <span className="mt-1 block text-[0.58rem] font-medium text-brand-secondary-highlight dark:text-secondary">Allocat</span>}</span></span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-border/60"/>
        <DropdownMenuGroup>
          <DropdownMenuItem onSelect={onProfile} className={dropdownItem}><User2Icon size={14}/>{user.isAllocat ? "Allocat profile" : "Profile"}</DropdownMenuItem>
          <DropdownMenuItem onSelect={onSettings} className={dropdownItem}><SettingsIcon size={14}/>Settings</DropdownMenuItem>
          {!user.isAllocat && <DropdownMenuItem onSelect={onBecomeAllocat} className={dropdownItem}><BadgeCheckIcon size={14} className="text-brand-secondary-highlight dark:text-secondary"/>Become an Allocat</DropdownMenuItem>}
        </DropdownMenuGroup>
        <DropdownMenuSeparator className="bg-border/60"/>
        <DropdownMenuItem disabled={loggingOut} onSelect={(event) => { event.preventDefault(); onLogout(); }} className={destructiveDropdownItem}><LogOutIcon size={14}/>{loggingOut ? "Logging out..." : "Log out"}</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>);
}
