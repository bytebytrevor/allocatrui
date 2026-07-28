// import { Link, useNavigate } from "react-router-dom";
// import { BadgeCheckIcon, BellIcon, EllipsisVerticalIcon, LogOutIcon, Moon, SettingsIcon, Sun, User2Icon, UserCircleIcon } from "lucide-react";
// import { useState, type ReactNode } from "react";
// import { useEffect, } from "react";
// import { useAuth } from "@/auth/useAuth";
// import { Avatar } from "@radix-ui/react-avatar";
// import { AvatarFallback, AvatarImage } from "./ui/avatar";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import AllocatrIconLogo from "./AllocatrIconLogo";
// import BecomeAllocatDialog from "./BecomeAllocatDialog";
// import api from "@/api/axios";

// type Props = {
//     children?: ReactNode;
// }



// function DashboardMainNav({children}: Props) {      
//     const [theme, setTheme] = useState(
//         localStorage.getItem("theme") || "dark"
//     );

//     const { user, logout } = useAuth();
//     console.log(user);

//     const navigate = useNavigate(); 

//     const [becomeAllocatOpen, setBecomeAllocatOpen] = useState(false);

//     useEffect(() => {
//         const root = document.documentElement;
//         if (theme === "light") {
//             root.classList.add("light");
//             root.classList.remove("dark");
//         } else {
//             root.classList.add("dark");
//             root.classList.remove("light");
//         }
//         localStorage.setItem("theme", theme);
//     }, [theme]);

    

//     return (
//         <>
//             <nav className="flex items-center justify-between bg-background/40 py-2">
//                 <Link to="/projects" className="flex items-center">
//                     <AllocatrIconLogo theme={theme} className="w-6"/>
//                 </Link>
//                 <span>{children}</span>
//                 <span className="flex items-center space-x-2">
//                     <button
//                         onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
//                         className="pr-2 hover:text-foreground text-muted-foreground border-r cursor-pointer transition-colors delay-150 duration-300"
//                         >
//                         {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
//                     </button>
//                     <BellIcon size={26} className="pr-2 hover:text-foreground text-muted-foreground border-r cursor-pointer transition-colors delay-150 duration-300"/>
//                     <DropdownMenu>
//                         <DropdownMenuTrigger>
//                             <EllipsisVerticalIcon
//                                 size={26}
//                                 className="pr-2 hover:text-foreground text-muted-foreground border-r cursor-pointer transition-colors delay-150 duration-300"
//                             />
//                         </DropdownMenuTrigger>
//                         <DropdownMenuContent>
//                             <DropdownMenuLabel>My Account</DropdownMenuLabel>
//                             <DropdownMenuSeparator />
//                             <DropdownMenuItem>Switch Mode</DropdownMenuItem>
//                             <DropdownMenuItem>New project</DropdownMenuItem>
//                             <DropdownMenuItem>Settings</DropdownMenuItem>
//                             <DropdownMenuItem>Help and support</DropdownMenuItem>
//                         </DropdownMenuContent>
//                     </DropdownMenu>

//                     <DropdownMenu>
//                         <DropdownMenuTrigger className="w-6 h-6 border-muted-foreground/20">
//                             <Avatar className="rounded-full transition-all duration-300">
//                                 <AvatarImage
//                                     src={user?.avatarUrl}
//                                     className="h-full w-full rounded-full object-cover transition-opacity data-[state=loading]:opacity-0"
//                                 />
                
//                                 <AvatarFallback
//                                     className="text-foreground font-medium border"
//                                 >
//                                     {user?.fullName?.charAt(0) ?? <UserCircleIcon />}
//                                 </AvatarFallback>
//                             </Avatar>
//                         </DropdownMenuTrigger>
//                         <DropdownMenuContent>
//                             <DropdownMenuLabel className="flex items-center gap-2 text-muted-foreground rounded-t-sm p-2">
//                                 <Avatar className="w-12 h-12 rounded-full border border-muted-foreground/20 transition-all duration-300 ">                        
//                                         <AvatarImage
//                                             src={user?.avatarUrl}
//                                             className="h-full w-full rounded-full object-cover transition-opacity data-[state=loading]:opacity-0"
//                                         />
//                                         <AvatarFallback
//                                             className="text-foreground font-medium border"
//                                         >
//                                             {user?.fullName?.charAt(0).toUpperCase() ?? <UserCircleIcon />}
//                                         </AvatarFallback>
                                
//                                 </Avatar>
//                                 <div className="flex flex-col">
//                                     <span className="font-bold text-sm">{user?.fullName?.split(" ")[0]}</span>
//                                     <span className="text-xs font-normal">{user?.email}</span>
//                                 </div>
//                             </DropdownMenuLabel>
//                             <DropdownMenuSeparator />
//                             <DropdownMenuItem
//                                 onSelect={(e) => {
//                                     e.preventDefault();
//                                     setBecomeAllocatOpen(true);
//                                 }}
//                                 >
//                                 <BadgeCheckIcon />
//                                 Become an allocat
//                             </DropdownMenuItem>
//                             <DropdownMenuItem onClick={() => navigate("/profile")}><User2Icon/>Profile</DropdownMenuItem>
//                             <DropdownMenuItem><SettingsIcon/>Settings</DropdownMenuItem>
//                             <DropdownMenuItem
//                                 onClick={async () => {
//                                     await logout();      // clear backend cookie & front-end state
//                                     navigate("/login");  // redirects to login page
//                                 }}
//                                 className="text-destructive font-medium focus:bg-destructive/90 focus:text-white transition-all duration-300"
//                             >
//                                 <LogOutIcon className="focus:text-white"/>
//                                 Logout
//                             </DropdownMenuItem>
//                         </DropdownMenuContent>
//                     </DropdownMenu>                
//                 </span>
//             </nav>
//             <BecomeAllocatDialog
//                 open={becomeAllocatOpen}
//                 onOpenChange={setBecomeAllocatOpen}
//                 onContinue={async () => {
//                     await api.patch(
//                     "/users/me/become-allocat",
//                     {},
//                     { withCredentials: true }
//                     );

//                     setBecomeAllocatOpen(false);
//                     navigate("/allocats/profile/create");
//                 }}
//             />
//         </>
//     );
// }

// export default DashboardMainNav;

import { useEffect, useMemo, useState, type ReactNode } from "react";
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
  if (!name) return "U";

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

  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    const root = document.documentElement;

    root.classList.toggle("dark", theme === "dark");
    root.classList.toggle("light", theme === "light");

    localStorage.setItem("theme", theme);
  }, [theme]);

  const firstName = useMemo(() => {
    return user?.fullName?.trim().split(/\s+/)[0] || "Account";
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
    if (becomingAllocat) return;

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
      console.error("Could not update account mode:", error);
    } finally {
      setBecomingAllocat(false);
    }
  }

  return (
    <>
      <nav
        className="flex min-h-16 items-center justify-between gap-4 py-3"
        aria-label="Dashboard navigation"
      >
        {/* Brand */}
        <div className="flex min-w-0 items-center gap-5">
          <Link
            to="/projects"
            className={[
              "flex h-10 w-10 shrink-0 items-center justify-center",
              "rounded-2xl bg-primary/10 transition-colors",
              "hover:bg-primary/15",
            ].join(" ")}
            aria-label="Go to projects"
          >
            <AllocatrIconLogo
              theme={theme}
              className="w-6"
            />
          </Link>

          {children && (
            <div className="hidden min-w-0 border-l border-border pl-5 md:block">
              {children}
            </div>
          )}
        </div>

        {/* Desktop actions */}
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-10 w-10 rounded-full text-muted-foreground hover:bg-muted hover:text-foreground"
            onClick={toggleTheme}
            aria-label={
              theme === "dark"
                ? "Switch to light mode"
                : "Switch to dark mode"
            }
          >
            {theme === "dark" ? (
              <SunIcon size={18} />
            ) : (
              <MoonIcon size={18} />
            )}
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="relative h-10 w-10 rounded-full text-muted-foreground hover:bg-muted hover:text-foreground"
            aria-label="Open notifications"
          >
            <BellIcon size={18} />

            <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full border-2 border-background bg-primary" />
          </Button>

          {/* Quick actions */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="hidden h-10 w-10 rounded-full text-muted-foreground hover:bg-muted hover:text-foreground sm:inline-flex"
                aria-label="Open quick actions"
              >
                <MenuIcon size={18} />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="end"
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
                onClick={() => navigate("/projects/new")}
              >
                <FolderPlusIcon size={16} />
                New project
              </DropdownMenuItem>

              <DropdownMenuItem
                className="rounded-xl"
                onClick={() => navigate("/settings")}
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

          {/* Account menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className={[
                  "flex min-w-0 items-center gap-3 rounded-full",
                  "border border-border bg-card py-1.5 pl-1.5 pr-2",
                  "text-card-foreground transition-colors",
                  "hover:border-primary/25 hover:bg-muted/50",
                  "focus-visible:outline-none focus-visible:ring-2",
                  "focus-visible:ring-ring focus-visible:ring-offset-2",
                ].join(" ")}
                aria-label="Open account menu"
              >
                <Avatar className="h-9 w-9 shrink-0 border border-border">
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
                      <UserCircleIcon size={18} />
                    )}
                  </AvatarFallback>
                </Avatar>

                <div className="hidden min-w-0 text-left lg:block">
                  <p className="max-w-28 truncate text-xs font-bold">
                    {firstName}
                  </p>

                  <p className="max-w-28 truncate text-[0.65rem] text-muted-foreground">
                    My account
                  </p>
                </div>

                <ChevronDownIcon
                  size={15}
                  className="hidden shrink-0 text-muted-foreground sm:block"
                />
              </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="end"
              sideOffset={10}
              className="w-72 rounded-[1.5rem] border-border bg-popover p-2 text-popover-foreground shadow-xl"
            >
              {/* Account header */}
              <DropdownMenuLabel className="p-3">
                <div className="flex min-w-0 items-center gap-3">
                  <Avatar className="h-12 w-12 shrink-0 border border-border">
                    <AvatarImage
                      src={user?.avatarUrl}
                      alt={
                        user?.fullName
                          ? `${user.fullName}'s profile`
                          : "User profile"
                      }
                      className="object-cover"
                    />

                    <AvatarFallback className="bg-primary/10 font-bold text-primary">
                      {user?.fullName ? (
                        initials
                      ) : (
                        <UserCircleIcon size={20} />
                      )}
                    </AvatarFallback>
                  </Avatar>

                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold text-foreground">
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
                onSelect={(event) => {
                  event.preventDefault();
                  void handleLogout();
                }}
                disabled={loggingOut}
                className={[
                  "rounded-xl font-medium text-destructive",
                  "focus:bg-destructive/10 focus:text-destructive",
                ].join(" ")}
              >
                <LogOutIcon size={16} />
                {loggingOut ? "Logging out..." : "Log out"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </nav>

      <BecomeAllocatDialog
        open={becomeAllocatOpen}
        onOpenChange={setBecomeAllocatOpen}
        onContinue={() => void handleBecomeAllocat()}
      />
    </>
  );
}

export default DashboardMainNav;