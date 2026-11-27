import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
    BadgeCheckIcon,
    ChevronDownIcon,
    CircleHelpIcon,
    EllipsisVerticalIcon,
    FolderPlusIcon,
    LogOutIcon,
    MoonIcon,
    SettingsIcon,
    SunIcon,
    User2Icon,
    UserCircleIcon,
    UsersIcon,
} from "lucide-react";
import api from "@/api/axios";
import NotificationBell from "@/components/NotificationBell";
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

const focus =
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/35";

const navIconButton = [
    "relative h-11 w-11 shrink-0 rounded-xl text-muted-foreground shadow-none lg:h-8 lg:w-8 lg:rounded-md",
    "transition-colors duration-200 motion-reduce:transition-none",
    "hover:bg-surface-2/80 hover:text-foreground data-[state=open]:bg-surface-2 data-[state=open]:text-foreground",
    "dark:hover:bg-surface-3/65",
    focus,
].join(" ");

const dropdownSurface =
    "rounded-2xl border border-border/70 bg-popover p-1.5 text-popover-foreground shadow-lg shadow-black/5";

const dropdownItem = [
    "flex min-h-11 gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-foreground/80",
    "transition-colors motion-reduce:transition-none",
    "focus:bg-surface-3/60 focus:text-foreground data-[highlighted]:bg-surface-3/60 data-[highlighted]:text-foreground",
    "dark:focus:bg-surface-3/70 dark:data-[highlighted]:bg-surface-3/70",
    "[&_svg]:shrink-0 [&_svg]:text-muted-foreground",
].join(" ");

const destructiveDropdownItem = [
    dropdownItem,
    "focus:bg-destructive/[0.07] focus:text-destructive",
    "data-[highlighted]:bg-destructive/[0.07] data-[highlighted]:text-destructive",
    "focus:[&_svg]:text-destructive data-[highlighted]:[&_svg]:text-destructive",
    "dark:focus:bg-destructive/[0.12] dark:data-[highlighted]:bg-destructive/[0.12]",
].join(" ");

function getInitials(name?: string | null) {
    return (
        name
            ?.trim()
            .split(/\s+/)
            .slice(0, 2)
            .map((part) => part.charAt(0).toUpperCase())
            .join("") || "U"
    );
}

function getInitialTheme(): Theme {
    if (typeof window === "undefined") return "dark";
    try {
        const saved = window.localStorage.getItem("theme");
        if (saved === "light" || saved === "dark") return saved;
    } catch {
        // Theme switching still works when browser storage is unavailable.
    }
    return document.documentElement.classList.contains("light")
        ? "light"
        : "dark";
}

function getPageLabel(pathname: string): string {
    const path = pathname.replace(/\/+$/, "") || "/";
    const pages: Record<string, string> = {
        "/": "Home",
        "/projects": "Projects",
        "/projects/new": "New project",
        "/discover": "Discover Allocats",
        "/profile": "Profile",
        "/allocats/profile": "Allocat profile",
        "/allocats/profile/create": "Create Allocat profile",
        "/notifications": "Notifications",
        "/settings": "Settings",
        "/help": "Help & support",
    };
    if (pages[path]) return pages[path];
    if (/^\/projects\/[^/]+\/allocats\/find$/.test(path))
        return "Find Allocats";
    if (/^\/projects\/[^/]+(?:\/|$)/.test(path)) {
        const sections: Record<string, string> = {
            calendar: "Calendar",
            files: "Files",
            messaging: "Messaging",
            analytics: "Analytics",
            transactions: "Transactions",
        };
        return sections[path.split("/")[3]] ?? "Project workspace";
    }
    if (/^\/allocats\/[^/]+$/.test(path)) return "Allocat profile";
    return "Workspace";
}

/** Account navigation for authenticated workspace pages. */
export default function DashboardMainNav({ children }: Props) {
    const navigate = useNavigate();
    const { pathname } = useLocation();
    const pageLabel = getPageLabel(pathname);
    const { user, logout, refreshUser } = useAuth();
    const signedIn = Boolean(user?.userId);
    const [theme, setTheme] = useState<Theme>(getInitialTheme);
    const [loggingOut, setLoggingOut] = useState(false);
    const [becomeAllocatOpen, setBecomeAllocatOpen] = useState(false);
    const [becomingAllocat, setBecomingAllocat] = useState(false);
    const logoutBusy = useRef(false);
    const becomeBusy = useRef(false);
    const initials = useMemo(
        () => getInitials(user?.fullName),
        [user?.fullName],
    );

    useEffect(() => {
        const root = document.documentElement;
        root.classList.toggle("dark", theme === "dark");
        root.classList.toggle("light", theme === "light");
        root.style.colorScheme = theme;
        try {
            window.localStorage.setItem("theme", theme);
        } catch {
            // Storage is optional.
        }
    }, [theme]);

    useEffect(() => {
        if (!signedIn) setBecomeAllocatOpen(false);
    }, [signedIn]);

    async function handleLogout() {
        if (!signedIn || logoutBusy.current) return;
        logoutBusy.current = true;
        setLoggingOut(true);
        try {
            await logout();
            navigate("/login", { replace: true });
        } catch (error) {
            console.error("Logout failed:", error);
        } finally {
            logoutBusy.current = false;
            setLoggingOut(false);
        }
    }

    async function handleBecomeAllocat() {
        if (!signedIn || user?.isAllocat || becomeBusy.current) return;
        becomeBusy.current = true;
        setBecomingAllocat(true);
        try {
            await api.patch(
                "/users/me/become-allocat",
                {},
                { withCredentials: true },
            );
            await refreshUser();
            setBecomeAllocatOpen(false);
            navigate("/allocats/profile/create");
        } catch (error) {
            console.error("Could not update account mode:", error);
            throw error;
        } finally {
            becomeBusy.current = false;
            setBecomingAllocat(false);
        }
    }

    if (!user?.userId) return null;

    return (
        <>
            <nav
                aria-label="Workspace navigation"
                className="flex h-16 min-w-0 items-center justify-between gap-3 bg-background sm:gap-4"
            >
                <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-3">
                    <Link
                        to="/projects"
                        aria-label="Allocatr — go to projects"
                        className={
                            "group flex h-11 shrink-0 items-center rounded-lg " +
                            focus
                        }
                    >
                        <span className="flex h-11 w-11 items-center justify-center lg:h-8 lg:w-8">
                            <span className="flex h-6 w-6 items-center justify-center [&_img]:h-6 [&_img]:w-6 [&_img]:object-contain [&_svg]:h-6 [&_svg]:w-6">
                                <AllocatrIconLogo
                                    theme={theme}
                                    className="h-6 w-6 object-contain"
                                />
                            </span>
                        </span>
                    </Link>
                    <span
                        aria-hidden="true"
                        className="shrink-0 select-none text-sm font-light leading-none text-muted-foreground/35"
                    >
                        /
                    </span>
                    <div className="min-w-0 truncate text-xs font-medium text-foreground/75">
                        {children ?? (
                            <span aria-current="page">{pageLabel}</span>
                        )}
                    </div>
                </div>

                <div className="flex shrink-0 items-center gap-0.5 sm:gap-1">
                    <NavIconButton
                        label={
                            theme === "dark"
                                ? "Switch to light mode"
                                : "Switch to dark mode"
                        }
                        onClick={() =>
                            setTheme((current) =>
                                current === "dark" ? "light" : "dark",
                            )
                        }
                    >
                        {theme === "dark" ? (
                            <SunIcon size={16} aria-hidden="true" />
                        ) : (
                            <MoonIcon size={16} aria-hidden="true" />
                        )}
                    </NavIconButton>
                    <NotificationBell />
                    <QuickActionsMenu
                        onNewProject={() => navigate("/projects/new")}
                        onDiscover={() => navigate("/discover")}
                        onHelp={() => navigate("/help")}
                    />
                    <span className="mx-1.5 hidden h-5 w-px bg-border/60 md:block" />
                    <AccountMenu
                        user={user}
                        initials={initials}
                        loggingOut={loggingOut}
                        onLogout={() => void handleLogout()}
                        onProfile={() =>
                            navigate(
                                user.isAllocat
                                    ? "/allocats/profile"
                                    : "/profile",
                            )
                        }
                        onSettings={() => navigate("/settings")}
                        onBecomeAllocat={() => setBecomeAllocatOpen(true)}
                    />
                </div>
            </nav>
            {!user.isAllocat && (
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

function NavIconButton({
    children,
    label,
    onClick,
}: {
    children: ReactNode;
    label: string;
    onClick: () => void;
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
        </Button>
    );
}

function QuickActionsMenu({
    onNewProject,
    onDiscover,
    onHelp,
}: {
    onNewProject: () => void;
    onDiscover: () => void;
    onHelp: () => void;
}) {
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
                    <EllipsisVerticalIcon size={17} aria-hidden="true" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                align="end"
                sideOffset={8}
                collisionPadding={12}
                className={
                    "w-56 max-w-[calc(100vw_-_1.5rem)] " + dropdownSurface
                }
            >
                <DropdownMenuLabel className="px-3 py-2.5 text-[10px] font-medium uppercase tracking-[0.12em] text-muted-foreground">
                    Quick actions
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-border/60" />
                <DropdownMenuItem
                    onSelect={onNewProject}
                    className={dropdownItem}
                >
                    <FolderPlusIcon size={16} aria-hidden="true" />
                    New project
                </DropdownMenuItem>
                <DropdownMenuItem
                    onSelect={onDiscover}
                    className={dropdownItem}
                >
                    <UsersIcon size={16} aria-hidden="true" />
                    Discover Allocats
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={onHelp} className={dropdownItem}>
                    <CircleHelpIcon size={16} aria-hidden="true" />
                    Help &amp; support
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

function AccountMenu({
    user,
    initials,
    loggingOut,
    onLogout,
    onProfile,
    onSettings,
    onBecomeAllocat,
}: {
    user: AccountUser;
    initials: string;
    loggingOut: boolean;
    onLogout: () => void;
    onProfile: () => void;
    onSettings: () => void;
    onBecomeAllocat: () => void;
}) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button
                    type="button"
                    aria-label="Open account menu"
                    className={
                        "group ml-0.5 flex h-11 min-w-0 items-center gap-2.5 rounded-xl border border-transparent px-1.5 text-foreground transition-colors hover:border-border/55 hover:bg-surface-2/60 data-[state=open]:border-border/65 data-[state=open]:bg-surface-2/70 dark:hover:bg-surface-3/65 motion-reduce:transition-none lg:h-8 lg:gap-2 lg:rounded-md lg:px-2 " +
                        focus
                    }
                >
                    <AccountAvatar user={user} initials={initials} />
                    <span className="hidden min-w-0 max-w-[132px] text-left lg:block">
                        <span className="block truncate text-xs font-medium text-foreground/85">
                            {user.fullName || "Your account"}
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
                className={
                    "w-64 max-w-[calc(100vw_-_1.5rem)] " + dropdownSurface
                }
            >
                <DropdownMenuLabel className="rounded-xl bg-surface-2/40 p-3 font-normal">
                    <span className="flex min-w-0 items-center gap-3">
                        <AccountAvatar user={user} initials={initials} large />
                        <span className="min-w-0">
                            <span className="block truncate text-sm font-semibold">
                                {user.fullName || "Your account"}
                            </span>
                            {user.email && (
                                <span className="mt-1 block truncate text-xs text-muted-foreground">
                                    {user.email}
                                </span>
                            )}
                            {user.isAllocat && (
                                <span className="mt-1 block text-[11px] font-medium text-brand-secondary-highlight dark:text-secondary">
                                    Allocat
                                </span>
                            )}
                        </span>
                    </span>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-border/60" />
                <DropdownMenuGroup>
                    <DropdownMenuItem
                        onSelect={onProfile}
                        className={dropdownItem}
                    >
                        <User2Icon size={16} aria-hidden="true" />
                        {user.isAllocat ? "Allocat profile" : "Profile"}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onSelect={onSettings}
                        className={dropdownItem}
                    >
                        <SettingsIcon size={16} aria-hidden="true" />
                        Settings
                    </DropdownMenuItem>
                    {!user.isAllocat && (
                        <DropdownMenuItem
                            onSelect={onBecomeAllocat}
                            className={dropdownItem}
                        >
                            <BadgeCheckIcon
                                size={16}
                                aria-hidden="true"
                                className="text-brand-secondary-highlight dark:text-secondary"
                            />
                            Become an Allocat
                        </DropdownMenuItem>
                    )}
                </DropdownMenuGroup>
                <DropdownMenuSeparator className="bg-border/60" />
                <DropdownMenuItem
                    disabled={loggingOut}
                    onSelect={(event) => {
                        event.preventDefault();
                        onLogout();
                    }}
                    className={destructiveDropdownItem}
                >
                    <LogOutIcon size={16} aria-hidden="true" />
                    {loggingOut ? "Signing out..." : "Sign out"}
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

function AccountAvatar({
    user,
    initials,
    large = false,
}: {
    user: AccountUser;
    initials: string;
    large?: boolean;
}) {
    return (
        <Avatar
            className={
                (large ? "h-10 w-10" : "h-8 w-8 lg:h-6 lg:w-6") +
                " shrink-0 border border-border/60 ring-2 ring-background"
            }
        >
            <AvatarImage
                src={user.avatarUrl || undefined}
                alt={
                    user.fullName
                        ? `${user.fullName}'s profile`
                        : "User profile"
                }
                className="object-cover"
            />
            <AvatarFallback className="bg-surface-3/75 text-xs font-semibold text-brand-secondary-highlight dark:bg-surface-2 dark:text-secondary">
                {user.fullName ? (
                    initials
                ) : (
                    <UserCircleIcon size={16} aria-hidden="true" />
                )}
            </AvatarFallback>
        </Avatar>
    );
}
