// import { useEffect, useState } from "react";
// import {
//   Link,
//   NavLink,
//   useLocation,
//   useNavigate,
// } from "react-router-dom";
// import {
//   ArrowRightIcon,
//   ArrowUpRightIcon,
//   LogInIcon,
//   MenuIcon,
//   MoonIcon,
//   PlusIcon,
//   SearchIcon,
//   SunIcon,
//   XIcon,
// } from "lucide-react";

// import assets from "@/assets/assets";
// import { Button } from "@/components/ui/button";
// import { useAuth } from "@/auth/useAuth";

// type Theme = "light" | "dark";

// type NavigationItem = {
//   label: string;
//   href: string;
//   icon?: typeof SearchIcon;
// };

// const landingNavigation: NavigationItem[] = [
//   {
//     label: "Explore",
//     href: "/allocats",
//     icon: SearchIcon,
//   },
//   {
//     label: "Post a task",
//     href: "/projects/new",
//     icon: PlusIcon,
//   },
//   {
//     label: "How it works",
//     href: "/how-it-works",
//   },
//   {
//     label: "Become an Allocat",
//     href: "/become-an-allocat",
//   },
// ];

// const publicNavigation: NavigationItem[] = [
//   {
//     label: "About",
//     href: "/about",
//   },
//   {
//     label: "How it works",
//     href: "/how-it-works",
//   },
//   {
//     label: "Become an Allocat",
//     href: "/become-an-allocat",
//   },
//   {
//     label: "Contact",
//     href: "/contact",
//   },
// ];

// function getInitialTheme(): Theme {
//   const storedTheme =
//     localStorage.getItem("theme");

//   if (
//     storedTheme === "light" ||
//     storedTheme === "dark"
//   ) {
//     return storedTheme;
//   }

//   return window.matchMedia(
//     "(prefers-color-scheme: dark)",
//   ).matches
//     ? "dark"
//     : "light";
// }

// function SiteHeader() {
//   const { user } = useAuth();

//   const location = useLocation();
//   const navigate = useNavigate();

//   const [theme, setTheme] =
//     useState<Theme>(
//       getInitialTheme,
//     );

//   const [
//     isScrolled,
//     setIsScrolled,
//   ] = useState(false);

//   const [
//     isMenuOpen,
//     setIsMenuOpen,
//   ] = useState(false);

//   const isLandingPage =
//     location.pathname === "/";

//   const navigation =
//     isLandingPage
//       ? landingNavigation
//       : publicNavigation;

//   useEffect(() => {
//     const root =
//       document.documentElement;

//     root.classList.toggle(
//       "dark",
//       theme === "dark",
//     );

//     localStorage.setItem(
//       "theme",
//       theme,
//     );
//   }, [theme]);

//   useEffect(() => {
//     function handleScroll() {
//       setIsScrolled(
//         window.scrollY > 12,
//       );
//     }

//     handleScroll();

//     window.addEventListener(
//       "scroll",
//       handleScroll,
//       {
//         passive: true,
//       },
//     );

//     return () => {
//       window.removeEventListener(
//         "scroll",
//         handleScroll,
//       );
//     };
//   }, []);

//   useEffect(() => {
//     document.body.style.overflow =
//       isMenuOpen
//         ? "hidden"
//         : "";

//     return () => {
//       document.body.style.overflow =
//         "";
//     };
//   }, [isMenuOpen]);

//   useEffect(() => {
//     function handleEscape(
//       event: KeyboardEvent,
//     ) {
//       if (
//         event.key === "Escape"
//       ) {
//         setIsMenuOpen(false);
//       }
//     }

//     window.addEventListener(
//       "keydown",
//       handleEscape,
//     );

//     return () => {
//       window.removeEventListener(
//         "keydown",
//         handleEscape,
//       );
//     };
//   }, []);

//   useEffect(() => {
//     setIsMenuOpen(false);
//   }, [location.pathname]);

//   function closeMenu() {
//     setIsMenuOpen(false);
//   }

//   function toggleTheme() {
//     setTheme((current) =>
//       current === "dark"
//         ? "light"
//         : "dark",
//     );
//   }

//   function handleLogin() {
//     closeMenu();

//     navigate(
//       user
//         ? "/projects"
//         : "/login",
//     );
//   }

//   function handlePostTask() {
//     closeMenu();

//     navigate(
//       user
//         ? "/projects/new"
//         : "/register",
//     );
//   }

//   function getNavigationHref(
//     item: NavigationItem,
//   ) {
//     if (
//       item.href ===
//         "/projects/new" &&
//       !user
//     ) {
//       return "/register";
//     }

//     return item.href;
//   }

//   return (
//     <>
//       <header
//         className={[
//           "fixed inset-x-0 top-0 z-50",
//           "transition-all duration-300",

//           isScrolled
//             ? "border-b border-border/70 bg-background/90 shadow-sm backdrop-blur-xl"
//             : "border-b border-transparent bg-transparent shadow-none",
//         ].join(" ")}
//       >
//         <div className="mx-auto flex h-14 w-full max-w-7xl items-center justify-between px-5 sm:h-[60px] sm:px-8 lg:px-10">
//           {/* Logo */}

//           <Link
//             to="/"
//             onClick={closeMenu}
//             className="group flex min-w-0 shrink-0 items-center gap-2.5"
//             aria-label="Allocatr home"
//           >
//             <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/12 transition-transform duration-300 group-hover:rotate-3 group-hover:scale-105">
//               <img
//                 src={
//                   assets.allocatrIcon
//                 }
//                 alt=""
//                 className="h-5.5 w-5.5 object-contain"
//               />
//             </span>

//             <span className="text-base font-black uppercase tracking-[-0.045em] sm:text-lg">
//               Allocatr
//             </span>
//           </Link>

//           {/* Desktop navigation */}

//           <nav
//             className="hidden h-full items-center lg:flex"
//             aria-label="Main navigation"
//           >
//             {navigation.map(
//               (item) => {
//                 const Icon =
//                   item.icon;

//                 const href =
//                   getNavigationHref(
//                     item,
//                   );

//                 return (
//                   <NavLink
//                     key={
//                       item.label
//                     }
//                     to={href}
//                     className={({
//                       isActive,
//                     }) =>
//                       [
//                         "group relative flex h-full items-center gap-1.5 px-3.5",
//                         "text-[0.82rem] font-medium transition-colors",

//                         isActive
//                           ? "text-foreground"
//                           : "text-muted-foreground hover:text-foreground",
//                       ].join(
//                         " ",
//                       )
//                     }
//                   >
//                     {({
//                       isActive,
//                     }) => (
//                       <>
//                         {Icon && (
//                           <Icon
//                             size={
//                               14
//                             }
//                           />
//                         )}

//                         {
//                           item.label
//                         }

//                         <span
//                           className={[
//                             "absolute bottom-0 left-3 right-3 h-0.5",
//                             "origin-center bg-primary transition-transform duration-200",

//                             isActive
//                               ? "scale-x-100"
//                               : "scale-x-0 group-hover:scale-x-50",
//                           ].join(
//                             " ",
//                           )}
//                         />
//                       </>
//                     )}
//                   </NavLink>
//                 );
//               },
//             )}
//           </nav>

//           {/* Desktop actions */}

//           <div className="hidden items-center gap-1 lg:flex">
//             <Button
//               type="button"
//               variant="ghost"
//               size="icon"
//               onClick={
//                 toggleTheme
//               }
//               className="h-9 w-9 rounded-lg shadow-none"
//               aria-label={
//                 theme ===
//                 "dark"
//                   ? "Switch to light theme"
//                   : "Switch to dark theme"
//               }
//             >
//               {theme ===
//               "dark" ? (
//                 <SunIcon
//                   size={16}
//                 />
//               ) : (
//                 <MoonIcon
//                   size={16}
//                 />
//               )}
//             </Button>

//             <div className="mx-1.5 h-4 w-px bg-border" />

//             <Button
//               type="button"
//               variant="ghost"
//               className="h-9 rounded-lg px-3.5 text-xs font-semibold shadow-none"
//               onClick={
//                 handleLogin
//               }
//             >
//               <LogInIcon
//                 size={14}
//               />

//               {user
//                 ? "Dashboard"
//                 : "Log in"}
//             </Button>

//             <Button
//               type="button"
//               className="ml-1 h-9 rounded-lg px-4 text-xs font-semibold shadow-none"
//               onClick={
//                 handlePostTask
//               }
//             >
//               Post a task

//               <ArrowUpRightIcon
//                 size={14}
//               />
//             </Button>
//           </div>

//           {/* Mobile actions */}

//           <div className="flex items-center gap-1 lg:hidden">
//             <Button
//               type="button"
//               variant="ghost"
//               size="icon"
//               onClick={
//                 toggleTheme
//               }
//               className="h-9 w-9 rounded-lg shadow-none"
//               aria-label={
//                 theme ===
//                 "dark"
//                   ? "Switch to light theme"
//                   : "Switch to dark theme"
//               }
//             >
//               {theme ===
//               "dark" ? (
//                 <SunIcon
//                   size={16}
//                 />
//               ) : (
//                 <MoonIcon
//                   size={16}
//                 />
//               )}
//             </Button>

//             <Button
//               type="button"
//               variant="ghost"
//               size="icon"
//               className="h-9 w-9 rounded-lg shadow-none"
//               onClick={() =>
//                 setIsMenuOpen(
//                   (current) =>
//                     !current,
//                 )
//               }
//               aria-label={
//                 isMenuOpen
//                   ? "Close navigation"
//                   : "Open navigation"
//               }
//               aria-expanded={
//                 isMenuOpen
//               }
//               aria-controls="mobile-navigation"
//             >
//               {isMenuOpen ? (
//                 <XIcon
//                   size={19}
//                 />
//               ) : (
//                 <MenuIcon
//                   size={19}
//                 />
//               )}
//             </Button>
//           </div>
//         </div>
//       </header>

//       {/* Mobile navigation */}

//       <div
//         className={[
//           "fixed inset-0 z-40 lg:hidden",
//           "transition-all duration-300",

//           isMenuOpen
//             ? "pointer-events-auto visible opacity-100"
//             : "pointer-events-none invisible opacity-0",
//         ].join(" ")}
//         aria-hidden={
//           !isMenuOpen
//         }
//       >
//         <button
//           type="button"
//           className="absolute inset-0 top-14 bg-foreground/15 backdrop-blur-sm sm:top-[60px]"
//           onClick={
//             closeMenu
//           }
//           aria-label="Close navigation"
//         />

//         <aside
//           id="mobile-navigation"
//           className={[
//             "absolute inset-x-0 top-14",
//             "border-b border-border bg-background",
//             "shadow-xl shadow-black/10",
//             "transition-transform duration-300",
//             "sm:top-[60px]",

//             isMenuOpen
//               ? "translate-y-0"
//               : "-translate-y-4",
//           ].join(" ")}
//         >
//           <div className="mx-auto max-h-[calc(100vh-56px)] max-w-7xl overflow-y-auto px-5 py-5 sm:max-h-[calc(100vh-60px)] sm:px-8">
//             <nav
//               className="space-y-0"
//               aria-label="Mobile navigation"
//             >
//               {!isLandingPage && (
//                 <NavLink
//                   to="/"
//                   onClick={
//                     closeMenu
//                   }
//                   className={({
//                     isActive,
//                   }) =>
//                     [
//                       "group flex min-h-12 items-center justify-between",
//                       "border-b border-border/60",
//                       "text-sm font-semibold transition-colors",

//                       isActive
//                         ? "text-primary"
//                         : "text-foreground hover:text-primary",
//                     ].join(
//                       " ",
//                     )
//                   }
//                 >
//                   Home

//                   <ArrowRightIcon
//                     size={15}
//                     className="text-muted-foreground transition-transform group-hover:translate-x-1"
//                   />
//                 </NavLink>
//               )}

//               {navigation.map(
//                 (item) => {
//                   const Icon =
//                     item.icon;

//                   const href =
//                     getNavigationHref(
//                       item,
//                     );

//                   return (
//                     <NavLink
//                       key={
//                         item.label
//                       }
//                       to={href}
//                       onClick={
//                         closeMenu
//                       }
//                       className={({
//                         isActive,
//                       }) =>
//                         [
//                           "group flex min-h-12 items-center justify-between",
//                           "border-b border-border/60",
//                           "text-sm font-semibold transition-colors",

//                           isActive
//                             ? "text-primary"
//                             : "text-foreground hover:text-primary",
//                         ].join(
//                           " ",
//                         )
//                       }
//                     >
//                       <span className="flex items-center gap-2.5">
//                         {Icon && (
//                           <Icon
//                             size={
//                               15
//                             }
//                             className="text-muted-foreground"
//                           />
//                         )}

//                         {
//                           item.label
//                         }
//                       </span>

//                       <ArrowRightIcon
//                         size={15}
//                         className="text-muted-foreground transition-transform group-hover:translate-x-1"
//                       />
//                     </NavLink>
//                   );
//                 },
//               )}
//             </nav>

//             <div className="mt-5 grid gap-2.5 sm:grid-cols-2">
//               <Button
//                 type="button"
//                 variant="outline"
//                 className="h-10 rounded-lg text-xs shadow-none"
//                 onClick={
//                   handleLogin
//                 }
//               >
//                 <LogInIcon
//                   size={14}
//                 />

//                 {user
//                   ? "Go to dashboard"
//                   : "Log in"}
//               </Button>

//               <Button
//                 type="button"
//                 className="h-10 rounded-lg text-xs shadow-none"
//                 onClick={
//                   handlePostTask
//                 }
//               >
//                 Post a task

//                 <ArrowUpRightIcon
//                   size={14}
//                 />
//               </Button>
//             </div>
//           </div>
//         </aside>
//       </div>
//     </>
//   );
// }

// export default SiteHeader;


import {
  useEffect,
  useState,
} from "react";

import {
  Link,
  NavLink,
  useLocation,
  useNavigate,
} from "react-router-dom";

import {
  ArrowRightIcon,
  ArrowUpRightIcon,
  LogInIcon,
  MenuIcon,
  MoonIcon,
  SunIcon,
  XIcon,
} from "lucide-react";

import assets from "@/assets/assets";

import {
  Button,
} from "@/components/ui/button";

import {
  useAuth,
} from "@/auth/useAuth";

type Theme =
  | "light"
  | "dark";

type NavigationItem = {
  label: string;
  href: string;
};

/*
 * =========================================================
 * NAVIGATION
 * =========================================================
 */

const landingNavigation: NavigationItem[] = [
  {
    label: "Explore",
    href: "/allocats",
  },
  {
    label: "How it works",
    href: "/how-it-works",
  },
  {
    label: "Become an Allocat",
    href: "/become-an-allocat",
  },
];

const publicNavigation: NavigationItem[] = [
  {
    label: "About",
    href: "/about",
  },
  {
    label: "How it works",
    href: "/how-it-works",
  },
  {
    label: "Become an Allocat",
    href: "/become-an-allocat",
  },
  {
    label: "Contact",
    href: "/contact",
  },
];

/*
 * =========================================================
 * THEME
 * =========================================================
 */

function getInitialTheme(): Theme {
  const storedTheme =
    localStorage.getItem("theme");

  if (
    storedTheme === "light" ||
    storedTheme === "dark"
  ) {
    return storedTheme;
  }

  return window.matchMedia(
    "(prefers-color-scheme: dark)",
  ).matches
    ? "dark"
    : "light";
}

/*
 * =========================================================
 * HEADER
 * =========================================================
 */

function SiteHeader() {
  const { user } =
    useAuth();

  const location =
    useLocation();

  const navigate =
    useNavigate();

  const [
    theme,
    setTheme,
  ] =
    useState<Theme>(
      getInitialTheme,
    );

  const [
    isScrolled,
    setIsScrolled,
  ] =
    useState(false);

  const [
    isMenuOpen,
    setIsMenuOpen,
  ] =
    useState(false);

  const isLandingPage =
    location.pathname === "/";

  const navigation =
    isLandingPage
      ? landingNavigation
      : publicNavigation;

  /*
   * ---------------------------------------------------------
   * THEME
   * ---------------------------------------------------------
   */

  useEffect(() => {
    const root =
      document.documentElement;

    root.classList.toggle(
      "dark",
      theme === "dark",
    );

    localStorage.setItem(
      "theme",
      theme,
    );
  }, [theme]);

  /*
   * ---------------------------------------------------------
   * SCROLL STATE
   * ---------------------------------------------------------
   */

  useEffect(() => {
    function handleScroll() {
      setIsScrolled(
        window.scrollY > 14,
      );
    }

    handleScroll();

    window.addEventListener(
      "scroll",
      handleScroll,
      {
        passive: true,
      },
    );

    return () => {
      window.removeEventListener(
        "scroll",
        handleScroll,
      );
    };
  }, []);

  /*
   * ---------------------------------------------------------
   * MOBILE BODY LOCK
   * ---------------------------------------------------------
   */

  useEffect(() => {
    document.body.style.overflow =
      isMenuOpen
        ? "hidden"
        : "";

    return () => {
      document.body.style.overflow =
        "";
    };
  }, [
    isMenuOpen,
  ]);

  /*
   * ---------------------------------------------------------
   * ESCAPE CLOSE
   * ---------------------------------------------------------
   */

  useEffect(() => {
    function handleEscape(
      event: KeyboardEvent,
    ) {
      if (
        event.key === "Escape"
      ) {
        setIsMenuOpen(false);
      }
    }

    window.addEventListener(
      "keydown",
      handleEscape,
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleEscape,
      );
    };
  }, []);

  /*
   * ---------------------------------------------------------
   * CLOSE MENU AFTER ROUTE CHANGE
   * ---------------------------------------------------------
   */

  useEffect(() => {
    setIsMenuOpen(false);
  }, [
    location.pathname,
  ]);

  /*
   * ---------------------------------------------------------
   * ACTIONS
   * ---------------------------------------------------------
   */

  function closeMenu() {
    setIsMenuOpen(false);
  }

  function toggleTheme() {
    setTheme(
      (
        current,
      ) =>
        current === "dark"
          ? "light"
          : "dark",
    );
  }

  function handleLogin() {
    closeMenu();

    navigate(
      user
        ? "/projects"
        : "/login",
    );
  }

  function handlePostTask() {
    closeMenu();

    navigate(
      user
        ? "/projects/new"
        : "/register",
    );
  }

  /*
   * =========================================================
   * RENDER
   * =========================================================
   */

  return (
    <>
      <header
        className={[
          "fixed inset-x-0 top-0 z-50",
          "transition-[background-color,border-color,box-shadow,backdrop-filter]",
          "duration-300",

          isScrolled
            ? [
                "border-b border-border/60",
                "bg-background/88",
                "backdrop-blur-xl",
                "shadow-[0_8px_30px_rgba(0,0,0,0.035)]",
                "dark:shadow-[0_10px_34px_rgba(0,0,0,0.2)]",
              ].join(" ")
            : [
                "border-b border-transparent",
                "bg-transparent",
                "shadow-none",
              ].join(" "),
        ].join(" ")}
      >
        <div
          className={[
            "mx-auto flex w-full max-w-7xl items-center justify-between",
            "h-14 px-5",
            "sm:h-[60px] sm:px-8",
            "lg:px-10",
          ].join(" ")}
        >
          {/* =====================================================
              LOGO
          ===================================================== */}

          <Link
            to="/"
            onClick={
              closeMenu
            }
            className={[
              "group flex shrink-0 items-center gap-2.5",
              "outline-none",
            ].join(" ")}
            aria-label="Allocatr home"
          >
            <img
              src={
                assets.allocatrIcon
              }
              alt=""
              className={[
                "h-7 w-7 object-contain",
                "transition-transform duration-300",
                "group-hover:-rotate-6",
                "group-hover:scale-105",
              ].join(" ")}
            />

            <span
              className={[
                "text-base font-black",
                "tracking-[-0.035em]",
                "sm:text-lg",
              ].join(" ")}
            >
              Allocatr
            </span>
          </Link>

          {/* =====================================================
              DESKTOP NAVIGATION
          ===================================================== */}

          <nav
            className="hidden h-full items-center lg:flex"
            aria-label="Main navigation"
          >
            {navigation.map(
              (
                item,
              ) => (
                <NavLink
                  key={
                    item.label
                  }
                  to={
                    item.href
                  }
                  className={({
                    isActive,
                  }) =>
                    [
                      "group relative flex h-full items-center px-4",
                      "text-[0.82rem] font-medium",
                      "transition-colors duration-200",

                      isActive
                        ? "text-foreground"
                        : "text-muted-foreground hover:text-foreground",
                    ].join(
                      " ",
                    )
                  }
                >
                  {({
                    isActive,
                  }) => (
                    <>
                      {
                        item.label
                      }

                      <span
                        className={[
                          "absolute bottom-[9px] left-1/2",
                          "h-1 w-1 -translate-x-1/2 rounded-full",
                          "bg-primary",
                          "transition-all duration-200",

                          isActive
                            ? "scale-100 opacity-100"
                            : [
                                "scale-0 opacity-0",
                                "group-hover:scale-100",
                                "group-hover:opacity-40",
                              ].join(
                                " ",
                              ),
                        ].join(
                          " ",
                        )}
                      />
                    </>
                  )}
                </NavLink>
              ),
            )}
          </nav>

          {/* =====================================================
              DESKTOP ACTIONS
          ===================================================== */}

          <div className="hidden items-center gap-1 lg:flex">
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
                "text-muted-foreground shadow-none",
                "hover:text-foreground",
              ].join(" ")}
              aria-label={
                theme ===
                "dark"
                  ? "Switch to light theme"
                  : "Switch to dark theme"
              }
            >
              {theme ===
              "dark" ? (
                <SunIcon
                  size={16}
                />
              ) : (
                <MoonIcon
                  size={16}
                />
              )}
            </Button>

            {/* Tiny separation */}

            <div className="mx-2 h-4 w-px bg-border/80" />

            {/* Login */}

            <Button
              type="button"
              variant="ghost"
              className={[
                "h-9 rounded-lg px-3.5",
                "text-xs font-semibold",
                "text-muted-foreground",
                "shadow-none",
                "hover:text-foreground",
              ].join(" ")}
              onClick={
                handleLogin
              }
            >
              <LogInIcon
                size={14}
              />

              {user
                ? "Dashboard"
                : "Log in"}
            </Button>

            {/* Main CTA */}

            <Button
              type="button"
              className={[
                "ml-1 h-9 rounded-lg px-4",
                "text-xs font-semibold",
                "shadow-none",
              ].join(" ")}
              onClick={
                handlePostTask
              }
            >
              Post a task

              <ArrowUpRightIcon
                size={14}
              />
            </Button>
          </div>

          {/* =====================================================
              MOBILE ACTIONS
          ===================================================== */}

          <div className="flex items-center gap-1 lg:hidden">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={
                toggleTheme
              }
              className={[
                "h-9 w-9 rounded-lg",
                "text-muted-foreground shadow-none",
              ].join(" ")}
              aria-label={
                theme ===
                "dark"
                  ? "Switch to light theme"
                  : "Switch to dark theme"
              }
            >
              {theme ===
              "dark" ? (
                <SunIcon
                  size={16}
                />
              ) : (
                <MoonIcon
                  size={16}
                />
              )}
            </Button>

            <Button
              type="button"
              variant="ghost"
              size="icon"
              className={[
                "h-9 w-9 rounded-lg",
                "shadow-none",
              ].join(" ")}
              onClick={() =>
                setIsMenuOpen(
                  (
                    current,
                  ) =>
                    !current,
                )
              }
              aria-label={
                isMenuOpen
                  ? "Close navigation"
                  : "Open navigation"
              }
              aria-expanded={
                isMenuOpen
              }
              aria-controls="mobile-navigation"
            >
              {isMenuOpen ? (
                <XIcon
                  size={19}
                />
              ) : (
                <MenuIcon
                  size={19}
                />
              )}
            </Button>
          </div>
        </div>
      </header>

      {/* =========================================================
          MOBILE NAVIGATION
      ========================================================= */}

      <div
        className={[
          "fixed inset-0 z-40 lg:hidden",
          "transition-all duration-300",

          isMenuOpen
            ? "pointer-events-auto visible opacity-100"
            : "pointer-events-none invisible opacity-0",
        ].join(" ")}
        aria-hidden={
          !isMenuOpen
        }
      >
        {/* Backdrop */}

        <button
          type="button"
          className={[
            "absolute inset-0 top-14",
            "bg-foreground/15 backdrop-blur-sm",
            "sm:top-[60px]",
          ].join(" ")}
          onClick={
            closeMenu
          }
          aria-label="Close navigation"
        />

        {/* Panel */}

        <aside
          id="mobile-navigation"
          className={[
            "absolute inset-x-0 top-14",
            "border-b border-border/70",
            "bg-background/98",
            "backdrop-blur-xl",
            "shadow-xl shadow-black/10",
            "transition-all duration-300",
            "sm:top-[60px]",

            isMenuOpen
              ? "translate-y-0 opacity-100"
              : "-translate-y-3 opacity-0",
          ].join(" ")}
        >
          <div
            className={[
              "mx-auto max-w-7xl",
              "max-h-[calc(100vh-56px)] overflow-y-auto",
              "px-5 pb-6 pt-3",
              "sm:max-h-[calc(100vh-60px)] sm:px-8",
            ].join(" ")}
          >
            {/* Small personality line */}

            <div className="flex items-center justify-between border-b border-border/60 py-4">
              <div className="flex items-center gap-2.5">
                <img
                  src={
                    assets.allocatrIcon
                  }
                  alt=""
                  className="h-5 w-5 object-contain"
                />

                <span className="text-xs font-semibold text-muted-foreground">
                  Follow the right trail.
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" />

                <span className="h-1 w-1 rounded-full bg-primary/50" />

                <span className="h-1 w-1 rounded-full bg-primary/20" />
              </div>
            </div>

            {/* Navigation */}

            <nav
              className="mt-1"
              aria-label="Mobile navigation"
            >
              {!isLandingPage && (
                <NavLink
                  to="/"
                  onClick={
                    closeMenu
                  }
                  className={({
                    isActive,
                  }) =>
                    [
                      "group flex min-h-14 items-center justify-between",
                      "border-b border-border/60",
                      "text-sm font-semibold",
                      "transition-colors",

                      isActive
                        ? "text-primary"
                        : "text-foreground hover:text-primary",
                    ].join(
                      " ",
                    )
                  }
                >
                  Home

                  <ArrowRightIcon
                    size={15}
                    className="text-muted-foreground transition-transform duration-200 group-hover:translate-x-1"
                  />
                </NavLink>
              )}

              {navigation.map(
                (
                  item,
                ) => (
                  <NavLink
                    key={
                      item.label
                    }
                    to={
                      item.href
                    }
                    onClick={
                      closeMenu
                    }
                    className={({
                      isActive,
                    }) =>
                      [
                        "group flex min-h-14 items-center justify-between",
                        "border-b border-border/60",
                        "text-sm font-semibold",
                        "transition-colors",

                        isActive
                          ? "text-primary"
                          : "text-foreground hover:text-primary",
                      ].join(
                        " ",
                      )
                    }
                  >
                    <span className="flex items-center gap-3">
                      <span
                        className={[
                          "h-1.5 w-1.5 rounded-full",
                          "bg-primary/25",
                          "transition-all duration-200",
                          "group-hover:bg-primary",
                        ].join(" ")}
                      />

                      {
                        item.label
                      }
                    </span>

                    <ArrowRightIcon
                      size={15}
                      className="text-muted-foreground transition-transform duration-200 group-hover:translate-x-1"
                    />
                  </NavLink>
                ),
              )}
            </nav>

            {/* Actions */}

            <div className="mt-6 grid gap-2.5 sm:grid-cols-2">
              <Button
                type="button"
                variant="outline"
                className="h-11 rounded-lg text-xs shadow-none"
                onClick={
                  handleLogin
                }
              >
                <LogInIcon
                  size={14}
                />

                {user
                  ? "Go to dashboard"
                  : "Log in"}
              </Button>

              <Button
                type="button"
                className="h-11 rounded-lg text-xs shadow-none"
                onClick={
                  handlePostTask
                }
              >
                Post a task

                <ArrowUpRightIcon
                  size={14}
                />
              </Button>
            </div>
          </div>
        </aside>
      </div>
    </>
  );
}

export default SiteHeader;