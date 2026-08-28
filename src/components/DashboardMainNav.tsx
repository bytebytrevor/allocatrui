// import {
//   useEffect,
//   useMemo,
//   useState,
//   type ReactNode,
// } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import {
//   BadgeCheckIcon,
//   BellIcon,
//   ChevronDownIcon,
//   CircleHelpIcon,
//   FolderPlusIcon,
//   LogOutIcon,
//   MenuIcon,
//   MoonIcon,
//   SettingsIcon,
//   SunIcon,
//   User2Icon,
//   UserCircleIcon,
// } from "lucide-react";

// import api from "@/api/axios";
// import { useAuth } from "@/auth/useAuth";
// import AllocatrIconLogo from "@/components/AllocatrIconLogo";
// import BecomeAllocatDialog from "@/components/BecomeAllocatDialog";
// import {
//   Avatar,
//   AvatarFallback,
//   AvatarImage,
// } from "@/components/ui/avatar";
// import { Button } from "@/components/ui/button";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuGroup,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";

// type Props = {
//   children?: ReactNode;
// };

// type Theme = "light" | "dark";

// function getInitials(name?: string) {
//   if (!name) {
//     return "U";
//   }

//   return name
//     .trim()
//     .split(/\s+/)
//     .slice(0, 2)
//     .map((part) => part.charAt(0).toUpperCase())
//     .join("");
// }

// function DashboardMainNav({ children }: Props) {
//   const navigate = useNavigate();
//   const { user, logout } = useAuth();

//   const [theme, setTheme] = useState<Theme>(() => {
//     const savedTheme = localStorage.getItem("theme");

//     if (savedTheme === "light" || savedTheme === "dark") {
//       return savedTheme;
//     }

//     return "dark";
//   });

//   const [becomeAllocatOpen, setBecomeAllocatOpen] =
//     useState(false);

//   const [becomingAllocat, setBecomingAllocat] =
//     useState(false);

//   const [loggingOut, setLoggingOut] =
//     useState(false);

//   useEffect(() => {
//     const root = document.documentElement;

//     root.classList.toggle("dark", theme === "dark");
//     root.classList.toggle("light", theme === "light");

//     localStorage.setItem("theme", theme);
//   }, [theme]);

//   const firstName = useMemo(() => {
//     return (
//       user?.fullName?.trim().split(/\s+/)[0] ||
//       "Account"
//     );
//   }, [user?.fullName]);

//   const initials = useMemo(() => {
//     return getInitials(user?.fullName);
//   }, [user?.fullName]);

//   function toggleTheme() {
//     setTheme((currentTheme) =>
//       currentTheme === "dark" ? "light" : "dark",
//     );
//   }

//   async function handleLogout() {
//     if (loggingOut) {
//       return;
//     }

//     setLoggingOut(true);

//     try {
//       await logout();
//       navigate("/login", { replace: true });
//     } catch (error) {
//       console.error("Logout failed:", error);
//     } finally {
//       setLoggingOut(false);
//     }
//   }

//   async function handleBecomeAllocat() {
//     if (becomingAllocat) {
//       return;
//     }

//     setBecomingAllocat(true);

//     try {
//       await api.patch(
//         "/users/me/become-allocat",
//         {},
//         {
//           withCredentials: true,
//         },
//       );

//       setBecomeAllocatOpen(false);
//       navigate("/allocats/profile/create");
//     } catch (error) {
//       console.error(
//         "Could not update account mode:",
//         error,
//       );
//     } finally {
//       setBecomingAllocat(false);
//     }
//   }

//   return (
//     <>
//       <nav
//         className="flex h-14 items-center justify-between gap-3"
//         aria-label="Dashboard navigation"
//       >
//         {/* Brand and page context */}
//         <div className="flex min-w-0 items-center gap-3">
//           <Link
//             to="/projects"
//             className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl transition-colors hover:bg-muted"
//             aria-label="Go to projects"
//           >
//             <AllocatrIconLogo
//               theme={theme}
//               className="w-5"
//             />
//           </Link>

//           {children && (
//             <div className="hidden min-w-0 border-l border-border pl-3 md:block">
//               {children}
//             </div>
//           )}
//         </div>

//         {/* Navigation controls */}
//         <div className="flex shrink-0 items-center gap-1">
//           <Button
//             type="button"
//             variant="ghost"
//             size="icon"
//             className="h-8 w-8 rounded-full text-muted-foreground hover:bg-muted hover:text-foreground"
//             onClick={toggleTheme}
//             aria-label={
//               theme === "dark"
//                 ? "Switch to light mode"
//                 : "Switch to dark mode"
//             }
//           >
//             {theme === "dark" ? (
//               <SunIcon size={16} />
//             ) : (
//               <MoonIcon size={16} />
//             )}
//           </Button>

//           <Button
//             type="button"
//             variant="ghost"
//             size="icon"
//             className="relative h-8 w-8 rounded-full text-muted-foreground hover:bg-muted hover:text-foreground"
//             aria-label="Open notifications"
//           >
//             <BellIcon size={16} />

//             <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-primary" />
//           </Button>

//           {/* Quick actions - visible at every breakpoint */}
//           <DropdownMenu>
//             <DropdownMenuTrigger asChild>
//               <Button
//                 type="button"
//                 variant="ghost"
//                 size="icon"
//                 className="h-8 w-8 rounded-full text-muted-foreground hover:bg-muted hover:text-foreground"
//                 aria-label="Open quick actions"
//               >
//                 <MenuIcon size={16} />
//               </Button>
//             </DropdownMenuTrigger>

//             <DropdownMenuContent
//               align="end"
//               sideOffset={8}
//               className="w-56 rounded-2xl border-border bg-popover p-2 text-popover-foreground shadow-xl"
//             >
//               <DropdownMenuLabel className="px-3 py-2">
//                 <p className="text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
//                   Quick actions
//                 </p>
//               </DropdownMenuLabel>

//               <DropdownMenuSeparator />

//               <DropdownMenuItem
//                 className="rounded-xl"
//                 onClick={() =>
//                   navigate("/projects/new")
//                 }
//               >
//                 <FolderPlusIcon size={16} />
//                 New project
//               </DropdownMenuItem>

//               <DropdownMenuItem
//                 className="rounded-xl"
//                 onClick={() =>
//                   navigate("/settings")
//                 }
//               >
//                 <SettingsIcon size={16} />
//                 Settings
//               </DropdownMenuItem>

//               <DropdownMenuItem
//                 className="rounded-xl"
//                 onClick={() => navigate("/help")}
//               >
//                 <CircleHelpIcon size={16} />
//                 Help and support
//               </DropdownMenuItem>
//             </DropdownMenuContent>
//           </DropdownMenu>

//           {/* Compact account menu */}
//           <DropdownMenu>
//             <DropdownMenuTrigger asChild>
//               <button
//                 type="button"
//                 className={[
//                   "ml-1 flex min-w-0 items-center gap-2 rounded-full",
//                   "border border-border bg-background p-1 pr-1",
//                   "text-foreground transition-colors",
//                   "hover:bg-muted/60",
//                   "focus-visible:outline-none focus-visible:ring-2",
//                   "focus-visible:ring-ring focus-visible:ring-offset-2",
//                 ].join(" ")}
//                 aria-label="Open account menu"
//               >
//                 <Avatar className="h-7 w-7 shrink-0">
//                   <AvatarImage
//                     src={user?.avatarUrl}
//                     alt={
//                       user?.fullName
//                         ? `${user.fullName}'s profile`
//                         : "User profile"
//                     }
//                     className="object-cover"
//                   />

//                   <AvatarFallback className="bg-primary/10 text-[0.65rem] font-bold text-primary">
//                     {user?.fullName ? (
//                       initials
//                     ) : (
//                       <UserCircleIcon size={15} />
//                     )}
//                   </AvatarFallback>
//                 </Avatar>

//                 <div className="hidden min-w-0 text-left xl:block">
//                   <p className="max-w-24 truncate text-xs font-semibold">
//                     {firstName}
//                   </p>
//                 </div>

//                 <ChevronDownIcon
//                   size={13}
//                   className="mr-1 hidden shrink-0 text-muted-foreground sm:block"
//                 />
//               </button>
//             </DropdownMenuTrigger>

//             <DropdownMenuContent
//               align="end"
//               sideOffset={8}
//               className="w-64 rounded-[1.25rem] border-border bg-popover p-2 text-popover-foreground shadow-xl"
//             >
//               <DropdownMenuLabel className="p-2">
//                 <div className="flex min-w-0 items-center gap-3">
//                   <Avatar className="h-10 w-10 shrink-0">
//                     <AvatarImage
//                       src={user?.avatarUrl}
//                       alt={
//                         user?.fullName
//                           ? `${user.fullName}'s profile`
//                           : "User profile"
//                       }
//                       className="object-cover"
//                     />

//                     <AvatarFallback className="bg-primary/10 text-sm font-bold text-primary">
//                       {user?.fullName ? (
//                         initials
//                       ) : (
//                         <UserCircleIcon size={18} />
//                       )}
//                     </AvatarFallback>
//                   </Avatar>

//                   <div className="min-w-0">
//                     <p className="truncate text-sm font-semibold text-foreground">
//                       {user?.fullName ||
//                         "Allocatr user"}
//                     </p>

//                     <p className="mt-0.5 truncate text-xs font-normal text-muted-foreground">
//                       {user?.email ||
//                         "No email available"}
//                     </p>
//                   </div>
//                 </div>
//               </DropdownMenuLabel>

//               <DropdownMenuSeparator />

//               <DropdownMenuGroup>
//                 <DropdownMenuItem
//                   className="rounded-xl"
//                   onSelect={(event) => {
//                     event.preventDefault();
//                     setBecomeAllocatOpen(true);
//                   }}
//                 >
//                   <BadgeCheckIcon size={16} />
//                   Become an Allocat
//                 </DropdownMenuItem>

//                 <DropdownMenuItem
//                   className="rounded-xl"
//                   onClick={() =>
//                     navigate("/profile")
//                   }
//                 >
//                   <User2Icon size={16} />
//                   Profile
//                 </DropdownMenuItem>

//                 <DropdownMenuItem
//                   className="rounded-xl"
//                   onClick={() =>
//                     navigate("/settings")
//                   }
//                 >
//                   <SettingsIcon size={16} />
//                   Settings
//                 </DropdownMenuItem>
//               </DropdownMenuGroup>

//               <DropdownMenuSeparator />

//               <DropdownMenuItem
//                 onSelect={(event) => {
//                   event.preventDefault();
//                   void handleLogout();
//                 }}
//                 disabled={loggingOut}
//                 className="rounded-xl font-medium text-destructive focus:bg-destructive/10 focus:text-destructive"
//               >
//                 <LogOutIcon size={16} />

//                 {loggingOut
//                   ? "Logging out..."
//                   : "Log out"}
//               </DropdownMenuItem>
//             </DropdownMenuContent>
//           </DropdownMenu>
//         </div>
//       </nav>

//       <BecomeAllocatDialog
//         open={becomeAllocatOpen}
//         onOpenChange={setBecomeAllocatOpen}
//         onContinue={() =>
//           void handleBecomeAllocat()
//         }
//       />
//     </>
//   );
// }

// export default DashboardMainNav;



import {
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

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

import {
  useAuth,
} from "@/auth/useAuth";

import AllocatrIconLogo from "@/components/AllocatrIconLogo";
import BecomeAllocatDialog from "@/components/BecomeAllocatDialog";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";

import {
  Button,
} from "@/components/ui/button";

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

type Theme =
  | "light"
  | "dark";

type Props = {
  children?: ReactNode;

  /*
   * For now you can pass this from the parent.
   * Later this can come from your notifications API.
   */
  notificationCount?: number;
};

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
   DASHBOARD NAV
========================================================= */

function DashboardMainNav({
  children,
  notificationCount = 0,
}: Props) {
  const navigate =
    useNavigate();

  const {
    user,
    logout,
  } =
    useAuth();

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

  const [
    loggingOut,
    setLoggingOut,
  ] =
    useState(false);

  const [
    becomeAllocatOpen,
    setBecomeAllocatOpen,
  ] =
    useState(false);

  const [
    becomingAllocat,
    setBecomingAllocat,
  ] =
    useState(false);

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

  const hasNotifications =
    notificationCount >
    0;

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

  /* =======================================================
     BECOME ALLOCAT
  ======================================================= */

  async function handleBecomeAllocat() {
    if (
      becomingAllocat
    ) {
      return;
    }

    setBecomingAllocat(
      true,
    );

    try {
      await api.patch(
        "/users/me/become-allocat",
        {},
        {
          withCredentials:
            true,
        },
      );

      setBecomeAllocatOpen(
        false,
      );

      navigate(
        "/allocats/profile/create",
      );
    } catch (
      error
    ) {
      console.error(
        "Could not update account mode:",
        error,
      );
    } finally {
      setBecomingAllocat(
        false,
      );
    }
  }

  return (
    <>
      <nav
        className="flex h-16 items-center justify-between gap-5"
        aria-label="Dashboard navigation"
      >
        {/* =================================================
            BRAND
        ================================================= */}

        <div className="flex min-w-0 items-center gap-3">
          <Link
            to="/projects"
            aria-label="Go to projects"
            className={[
              "group flex h-9 w-9 shrink-0 items-center justify-center",
              "rounded-lg",
              "transition-colors",
              "hover:bg-muted/40",
              "focus-visible:outline-none",
              "focus-visible:ring-2",
              "focus-visible:ring-primary/30",
            ].join(
              " ",
            )}
          >
            <AllocatrIconLogo
              theme={
                theme
              }
              className="w-5"
            />
          </Link>

          {children && (
            <div
              className={[
                "hidden min-w-0 md:block",
                "border-l border-border/80",
                "pl-3.5",
              ].join(
                " ",
              )}
            >
              {children}
            </div>
          )}
        </div>

        {/* =================================================
            ACTIONS
        ================================================= */}

        <div className="flex shrink-0 items-center gap-1.5">

          {/* ===============================================
              THEME
          =============================================== */}

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
                size={15}
              />
            ) : (
              <MoonIcon
                size={15}
              />
            )}
          </Button>

          {/* ===============================================
              NOTIFICATIONS
          =============================================== */}

          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() =>
              navigate(
                "/notifications",
              )
            }
            className={[
              "relative h-9 w-9 rounded-lg",
              "text-muted-foreground",
              "shadow-none",
              "hover:bg-muted/40",
              "hover:text-foreground",
            ].join(
              " ",
            )}
            aria-label={
              hasNotifications
                ? `${notificationCount} unread notifications`
                : "Notifications"
            }
          >
            <BellIcon
              size={15}
            />

            {hasNotifications && (
              <span
                className={[
                  "absolute right-[7px] top-[7px]",
                  "h-1.5 w-1.5 rounded-full",
                  "bg-primary",
                  "ring-2 ring-background",
                ].join(
                  " ",
                )}
              />
            )}
          </Button>

          {/* ===============================================
              QUICK ACTIONS
          =============================================== */}

          <QuickActionsMenu
            onNewProject={() =>
              navigate(
                "/projects/new",
              )
            }
            onSettings={() =>
              navigate(
                "/settings",
              )
            }
            onHelp={() =>
              navigate(
                "/help",
              )
            }
          />

          {/* Divider */}

          <span className="mx-1 hidden h-5 w-px bg-border/80 sm:block" />

          {/* ===============================================
              ACCOUNT
          =============================================== */}

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
            onBecomeAllocat={() =>
              setBecomeAllocatOpen(
                true,
              )
            }
          />
        </div>
      </nav>

      <BecomeAllocatDialog
        open={
          becomeAllocatOpen
        }
        onOpenChange={
          setBecomeAllocatOpen
        }
        onContinue={() =>
          void handleBecomeAllocat()
        }
      />
    </>
  );
}

/* =========================================================
   QUICK ACTIONS
========================================================= */

function QuickActionsMenu({
  onNewProject,
  onSettings,
  onHelp,
}: {
  onNewProject:
    () => void;

  onSettings:
    () => void;

  onHelp:
    () => void;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        asChild
      >
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className={[
            "h-9 w-9 rounded-lg",
            "text-muted-foreground",
            "shadow-none",
            "hover:bg-muted/40",
            "hover:text-foreground",
          ].join(
            " ",
          )}
          aria-label="Open quick actions"
        >
          <MenuIcon
            size={16}
          />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        sideOffset={10}
        className={[
          "w-56 rounded-xl",
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
        <DropdownMenuLabel className="px-3 py-2.5 font-normal">
          <p className="text-[0.6rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            Quick actions
          </p>

          <p className="mt-1 text-xs text-muted-foreground">
            Get somewhere quickly.
          </p>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onSelect={
            onNewProject
          }
          className="rounded-lg px-2.5 py-2 text-sm"
        >
          <FolderPlusIcon
            size={15}
          />

          New project
        </DropdownMenuItem>

        <DropdownMenuItem
          onSelect={
            onSettings
          }
          className="rounded-lg px-2.5 py-2 text-sm"
        >
          <SettingsIcon
            size={15}
          />

          Settings
        </DropdownMenuItem>

        <DropdownMenuItem
          onSelect={
            onHelp
          }
          className="rounded-lg px-2.5 py-2 text-sm"
        >
          <CircleHelpIcon
            size={15}
          />

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
}: {
  user?: {
    fullName?: string;
    email?: string;
    avatarUrl?: string;
  } | null;

  initials:
    string;

  loggingOut:
    boolean;

  onLogout:
    () => void;

  onProfile:
    () => void;

  onSettings:
    () => void;

  onBecomeAllocat:
    () => void;
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
                  size={15}
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
        sideOffset={10}
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
        {/* ===============================================
            USER
        =============================================== */}

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
                    size={17}
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

        {/* ===============================================
            ACCOUNT
        =============================================== */}

        <DropdownMenuGroup>
          <DropdownMenuItem
            onSelect={
              onProfile
            }
            className="rounded-lg px-2.5 py-2 text-sm"
          >
            <User2Icon
              size={15}
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
              size={15}
            />

            Settings
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        {/* ===============================================
            ALLOCAT MODE
        =============================================== */}

        <DropdownMenuItem
          onSelect={(
            event,
          ) => {
            event.preventDefault();

            onBecomeAllocat();
          }}
          className="rounded-lg px-2.5 py-2.5"
        >
          <BadgeCheckIcon
            size={15}
            className="text-primary"
          />

          <div className="min-w-0">
            <p className="text-sm font-medium">
              Become an Allocat
            </p>

            <p className="mt-0.5 text-[0.62rem] text-muted-foreground">
              Offer your skills
            </p>
          </div>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        {/* ===============================================
            LOGOUT
        =============================================== */}

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
            "font-medium",
            "text-muted-foreground",
            "focus:bg-muted/50",
            "focus:text-foreground",
          ].join(
            " ",
          )}
        >
          <LogOutIcon
            size={15}
          />

          {loggingOut
            ? "Logging out..."
            : "Log out"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default DashboardMainNav;