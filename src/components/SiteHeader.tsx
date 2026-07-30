// import { useEffect, useState } from "react";
// import { Link, NavLink, useNavigate } from "react-router-dom";
// import {
//   ArrowUpRightIcon,
//   LogInIcon,
//   MenuIcon,
//   XIcon,
// } from "lucide-react";

// import assets from "@/assets/assets";
// import { Button } from "@/components/ui/button";
// import { useAuth } from "@/auth/useAuth";

// const navigation = [
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

// function SiteHeader() {
//   const { user } = useAuth();
//   const navigate = useNavigate();

//   const [isScrolled, setIsScrolled] = useState(false);
//   const [isMenuOpen, setIsMenuOpen] = useState(false);

//   useEffect(() => {
//     function handleScroll() {
//       setIsScrolled(window.scrollY > 24);
//     }

//     handleScroll();

//     window.addEventListener("scroll", handleScroll, {
//       passive: true,
//     });

//     return () => {
//       window.removeEventListener("scroll", handleScroll);
//     };
//   }, []);

//   useEffect(() => {
//     document.body.style.overflow = isMenuOpen ? "hidden" : "";

//     return () => {
//       document.body.style.overflow = "";
//     };
//   }, [isMenuOpen]);

//   useEffect(() => {
//     function handleEscape(event: KeyboardEvent) {
//       if (event.key === "Escape") {
//         setIsMenuOpen(false);
//       }
//     }

//     window.addEventListener("keydown", handleEscape);

//     return () => {
//       window.removeEventListener("keydown", handleEscape);
//     };
//   }, []);

//   function closeMenu() {
//     setIsMenuOpen(false);
//   }

//   function handleLogin() {
//     closeMenu();
//     navigate(user ? "/projects" : "/login");
//   }

//   function handlePostJob() {
//     closeMenu();
//     navigate(user ? "/projects/new" : "/register");
//   }

//   return (
//     <>
//       <header
//         className={[
//           "fixed inset-x-0 top-0 z-50 px-4 transition-all duration-300",
//           "sm:px-5 md:px-8",
//           isScrolled ? "pt-3" : "pt-4 sm:pt-5",
//         ].join(" ")}
//       >
//         <div
//           className={[
//             "container mx-auto flex h-16 items-center justify-between",
//             "rounded-full border px-4 transition-all duration-300",
//             "sm:h-[72px] sm:px-5 lg:px-6",
//             isScrolled
//               ? "border-border/80 bg-background/95 shadow-lg shadow-black/5 backdrop-blur-xl"
//               : "border-border/60 bg-background/75 shadow-sm backdrop-blur-xl",
//           ].join(" ")}
//         >
//           {/* Logo */}
//           <Link
//             to="/"
//             onClick={closeMenu}
//             className="group flex min-w-0 items-center gap-2.5"
//             aria-label="Allocatr home"
//           >
//             <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/15 transition-transform duration-300 group-hover:rotate-6 group-hover:scale-105">
//               <img
//                 src={assets.allocatrIcon}
//                 alt=""
//                 className="h-7 w-7 object-contain"
//               />
//             </span>

//             <span className="truncate text-lg font-black uppercase tracking-[-0.04em] sm:text-xl">
//               Allocatr
//             </span>
//           </Link>

//           {/* Desktop navigation */}
//           <nav
//             className="hidden items-center gap-1 lg:flex"
//             aria-label="Main navigation"
//           >
//             {navigation.map((item) => (
//               <NavLink
//                 key={item.href}
//                 to={item.href}
//                 className={({ isActive }) =>
//                   [
//                     "relative rounded-full px-4 py-2 text-sm font-medium",
//                     "transition-colors duration-200",
//                     isActive
//                       ? "bg-primary/15 text-foreground"
//                       : "text-muted-foreground hover:bg-muted hover:text-foreground",
//                   ].join(" ")
//                 }
//               >
//                 {({ isActive }) => (
//                   <>
//                     {item.label}

//                     {isActive && (
//                       <span className="absolute bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-primary" />
//                     )}
//                   </>
//                 )}
//               </NavLink>
//             ))}
//           </nav>

//           {/* Desktop actions */}
//           <div className="hidden items-center gap-2 lg:flex">
//             <Button
//               type="button"
//               variant="ghost"
//               className="h-11 rounded-full px-5 shadow-none"
//               onClick={handleLogin}
//             >
//               <LogInIcon size={16} />
//               {user ? "Dashboard" : "Log in"}
//             </Button>

//             <Button
//               type="button"
//               className="h-11 rounded-full px-6 shadow-none"
//               onClick={handlePostJob}
//             >
//               Post a job
//               <ArrowUpRightIcon size={16} />
//             </Button>
//           </div>

//           {/* Mobile menu button */}
//           <button
//             type="button"
//             className={[
//               "flex h-11 w-11 shrink-0 items-center justify-center",
//               "rounded-full border bg-background transition-colors",
//               "hover:bg-muted lg:hidden",
//             ].join(" ")}
//             onClick={() => setIsMenuOpen((current) => !current)}
//             aria-label={isMenuOpen ? "Close navigation" : "Open navigation"}
//             aria-expanded={isMenuOpen}
//             aria-controls="mobile-navigation"
//           >
//             {isMenuOpen ? <XIcon size={21} /> : <MenuIcon size={21} />}
//           </button>
//         </div>
//       </header>

//       {/* Mobile navigation */}
//       <div
//         className={[
//           "fixed inset-0 z-40 transition-all duration-300 lg:hidden",
//           isMenuOpen
//             ? "pointer-events-auto visible opacity-100"
//             : "pointer-events-none invisible opacity-0",
//         ].join(" ")}
//         aria-hidden={!isMenuOpen}
//       >
//         <button
//           type="button"
//           className="absolute inset-0 bg-foreground/25 backdrop-blur-sm"
//           onClick={closeMenu}
//           aria-label="Close navigation"
//         />

//         <aside
//           id="mobile-navigation"
//           className={[
//             "absolute inset-x-4 top-24 max-h-[calc(100vh-7rem)]",
//             "overflow-y-auto rounded-[2rem] border bg-background p-5",
//             "shadow-2xl shadow-black/15 transition-all duration-300",
//             "sm:inset-x-5 md:inset-x-8",
//             isMenuOpen
//               ? "translate-y-0 scale-100"
//               : "-translate-y-4 scale-[0.98]",
//           ].join(" ")}
//         >
//           <div className="mb-5 flex items-center gap-3 rounded-2xl bg-muted/50 p-4">
//             <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-amber-300/25">
//               <img
//                 src={assets.allocatrIcon}
//                 alt=""
//                 className="h-7 w-7 object-contain"
//               />
//             </div>

//             <div className="min-w-0">
//               <p className="text-sm font-bold">Find skills. Manage work.</p>

//               <p className="mt-0.5 text-xs text-muted-foreground">
//                 Everything you need to move a project forward.
//               </p>
//             </div>
//           </div>

//           <nav className="space-y-1" aria-label="Mobile navigation">
//             <NavLink
//               to="/"
//               onClick={closeMenu}
//               className={({ isActive }) =>
//                 [
//                   "flex min-h-12 items-center justify-between rounded-2xl",
//                   "px-4 py-3 text-base font-semibold transition-colors",
//                   isActive
//                     ? "bg-primary/15"
//                     : "hover:bg-muted",
//                 ].join(" ")
//               }
//             >
//               Home
//               <ArrowUpRightIcon size={16} />
//             </NavLink>

//             {navigation.map((item) => (
//               <NavLink
//                 key={item.href}
//                 to={item.href}
//                 onClick={closeMenu}
//                 className={({ isActive }) =>
//                   [
//                     "flex min-h-12 items-center justify-between rounded-2xl",
//                     "px-4 py-3 text-base font-semibold transition-colors",
//                     isActive
//                       ? "bg-primary/15"
//                       : "hover:bg-muted",
//                   ].join(" ")
//                 }
//               >
//                 {item.label}
//                 <ArrowUpRightIcon size={16} />
//               </NavLink>
//             ))}
//           </nav>

//           <div className="my-5 h-px bg-border" />

//           <div className="grid gap-3 sm:grid-cols-2">
//             <Button
//               type="button"
//               variant="outline"
//               className="h-12 w-full rounded-full shadow-none"
//               onClick={handleLogin}
//             >
//               <LogInIcon size={16} />
//               {user ? "Go to dashboard" : "Log in"}
//             </Button>

//             <Button
//               type="button"
//               className="h-12 w-full rounded-full shadow-none"
//               onClick={handlePostJob}
//             >
//               Post a job
//               <ArrowUpRightIcon size={16} />
//             </Button>
//           </div>
//         </aside>
//       </div>
//     </>
//   );
// }

// export default SiteHeader;

import { useEffect, useState } from "react";
import {
  Link,
  NavLink,
  useLocation,
  useNavigate,
} from "react-router-dom";
import {
  ArrowUpRightIcon,
  LogInIcon,
  MenuIcon,
  MoonIcon,
  PlusIcon,
  SearchIcon,
  SunIcon,
  XIcon,
} from "lucide-react";

import assets from "@/assets/assets";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/auth/useAuth";

type Theme = "light" | "dark";

type NavigationItem = {
  label: string;
  href: string;
  icon?: typeof SearchIcon;
};

const landingNavigation: NavigationItem[] = [
  {
    label: "Explore",
    href: "/allocats",
    icon: SearchIcon,
  },
  {
    label: "Post a task",
    href: "/projects/new",
    icon: PlusIcon,
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

function getInitialTheme(): Theme {
  const storedTheme = localStorage.getItem("theme");

  if (storedTheme === "light" || storedTheme === "dark") {
    return storedTheme;
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function SiteHeader() {
  const { user } = useAuth();

  const location = useLocation();
  const navigate = useNavigate();

  const [theme, setTheme] = useState<Theme>(getInitialTheme);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isLandingPage = location.pathname === "/";

  const navigation = isLandingPage
    ? landingNavigation
    : publicNavigation;

  useEffect(() => {
    const root = document.documentElement;

    root.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    function handleScroll() {
      setIsScrolled(window.scrollY > 24);
    }

    handleScroll();

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsMenuOpen(false);
      }
    }

    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  function closeMenu() {
    setIsMenuOpen(false);
  }

  function toggleTheme() {
    setTheme((currentTheme) =>
      currentTheme === "dark" ? "light" : "dark",
    );
  }

  function handleLogin() {
    closeMenu();
    navigate(user ? "/projects" : "/login");
  }

  function handlePostTask() {
    closeMenu();
    navigate(user ? "/projects/new" : "/register");
  }

  function getNavigationHref(item: NavigationItem) {
    if (item.href === "/projects/new" && !user) {
      return "/register";
    }

    return item.href;
  }

  return (
    <>
      <header
        className={[
          "fixed inset-x-0 top-0 z-50 px-4 transition-all duration-300",
          "sm:px-5 md:px-8",
          isScrolled ? "pt-3" : "pt-4 sm:pt-5",
        ].join(" ")}
      >
        <div
          className={[
            "container mx-auto flex h-16 items-center justify-between",
            "rounded-full border px-4 transition-all duration-300",
            "sm:h-[72px] sm:px-5 lg:px-6",
            isScrolled
              ? "border-border/80 bg-background/95 shadow-lg shadow-black/5 backdrop-blur-xl"
              : "border-border/60 bg-background/75 shadow-sm backdrop-blur-xl",
          ].join(" ")}
        >
          <Link
            to="/"
            onClick={closeMenu}
            className="group flex min-w-0 items-center gap-2.5"
            aria-label="Allocatr home"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/15 transition-transform duration-300 group-hover:rotate-6 group-hover:scale-105">
              <img
                src={assets.allocatrIcon}
                alt=""
                className="h-7 w-7 object-contain"
              />
            </span>

            <span className="truncate text-lg font-black uppercase tracking-[-0.04em] sm:text-xl">
              Allocatr
            </span>
          </Link>

          <nav
            className="hidden items-center gap-1 lg:flex"
            aria-label="Main navigation"
          >
            {navigation.map((item) => {
              const Icon = item.icon;
              const href = getNavigationHref(item);

              return (
                <NavLink
                  key={item.label}
                  to={href}
                  className={({ isActive }) =>
                    [
                      "relative inline-flex items-center gap-2 rounded-full",
                      "px-4 py-2 text-sm font-medium",
                      "transition-colors duration-200",
                      isActive
                        ? "bg-primary/15 text-foreground"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground",
                    ].join(" ")
                  }
                >
                  {({ isActive }) => (
                    <>
                      {Icon && <Icon size={15} />}

                      {item.label}

                      {isActive && (
                        <span className="absolute bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-primary" />
                      )}
                    </>
                  )}
                </NavLink>
              );
            })}
          </nav>

          <div className="hidden items-center gap-2 lg:flex">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="h-11 w-11 rounded-full shadow-none"
              aria-label={
                theme === "dark"
                  ? "Switch to light theme"
                  : "Switch to dark theme"
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
              className="h-11 rounded-full px-5 shadow-none"
              onClick={handleLogin}
            >
              <LogInIcon size={16} />

              {user ? "Dashboard" : "Log in"}
            </Button>

            <Button
              type="button"
              className="h-11 rounded-full px-6 shadow-none"
              onClick={handlePostTask}
            >
              Post a task
              <ArrowUpRightIcon size={16} />
            </Button>
          </div>

          <div className="flex items-center gap-2 lg:hidden">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="h-11 w-11 rounded-full shadow-none"
              aria-label={
                theme === "dark"
                  ? "Switch to light theme"
                  : "Switch to dark theme"
              }
            >
              {theme === "dark" ? (
                <SunIcon size={18} />
              ) : (
                <MoonIcon size={18} />
              )}
            </Button>

            <button
              type="button"
              className={[
                "flex h-11 w-11 shrink-0 items-center justify-center",
                "rounded-full border bg-background transition-colors",
                "hover:bg-muted",
              ].join(" ")}
              onClick={() =>
                setIsMenuOpen((current) => !current)
              }
              aria-label={
                isMenuOpen
                  ? "Close navigation"
                  : "Open navigation"
              }
              aria-expanded={isMenuOpen}
              aria-controls="mobile-navigation"
            >
              {isMenuOpen ? (
                <XIcon size={21} />
              ) : (
                <MenuIcon size={21} />
              )}
            </button>
          </div>
        </div>
      </header>

      <div
        className={[
          "fixed inset-0 z-40 transition-all duration-300 lg:hidden",
          isMenuOpen
            ? "pointer-events-auto visible opacity-100"
            : "pointer-events-none invisible opacity-0",
        ].join(" ")}
        aria-hidden={!isMenuOpen}
      >
        <button
          type="button"
          className="absolute inset-0 bg-foreground/25 backdrop-blur-sm"
          onClick={closeMenu}
          aria-label="Close navigation"
        />

        <aside
          id="mobile-navigation"
          className={[
            "absolute inset-x-4 top-24 max-h-[calc(100vh-7rem)]",
            "overflow-y-auto rounded-[2rem] border bg-background p-5",
            "shadow-2xl shadow-black/15 transition-all duration-300",
            "sm:inset-x-5 md:inset-x-8",
            isMenuOpen
              ? "translate-y-0 scale-100"
              : "-translate-y-4 scale-[0.98]",
          ].join(" ")}
        >
          <div className="mb-5 flex items-center gap-3 rounded-2xl bg-muted/50 p-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary/15">
              <img
                src={assets.allocatrIcon}
                alt=""
                className="h-7 w-7 object-contain"
              />
            </div>

            <div className="min-w-0">
              <p className="text-sm font-bold">
                {isLandingPage
                  ? "Find skills. Move work forward."
                  : "Everything you need to get work done."}
              </p>

              <p className="mt-0.5 text-xs text-muted-foreground">
                {isLandingPage
                  ? "Explore professionals or post your next task."
                  : "Discover more about Allocatr."}
              </p>
            </div>
          </div>

          <nav
            className="space-y-1"
            aria-label="Mobile navigation"
          >
            {!isLandingPage && (
              <NavLink
                to="/"
                onClick={closeMenu}
                className={({ isActive }) =>
                  [
                    "flex min-h-12 items-center justify-between rounded-2xl",
                    "px-4 py-3 text-base font-semibold transition-colors",
                    isActive
                      ? "bg-primary/15"
                      : "hover:bg-muted",
                  ].join(" ")
                }
              >
                Home
                <ArrowUpRightIcon size={16} />
              </NavLink>
            )}

            {navigation.map((item) => {
              const Icon = item.icon;
              const href = getNavigationHref(item);

              return (
                <NavLink
                  key={item.label}
                  to={href}
                  onClick={closeMenu}
                  className={({ isActive }) =>
                    [
                      "flex min-h-12 items-center justify-between rounded-2xl",
                      "px-4 py-3 text-base font-semibold transition-colors",
                      isActive
                        ? "bg-primary/15"
                        : "hover:bg-muted",
                    ].join(" ")
                  }
                >
                  <span className="flex items-center gap-3">
                    {Icon && (
                      <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-muted text-muted-foreground">
                        <Icon size={16} />
                      </span>
                    )}

                    {item.label}
                  </span>

                  <ArrowUpRightIcon size={16} />
                </NavLink>
              );
            })}
          </nav>

          <div className="my-5 h-px bg-border" />

          <div className="grid gap-3 sm:grid-cols-2">
            <Button
              type="button"
              variant="outline"
              className="h-12 w-full rounded-full shadow-none"
              onClick={handleLogin}
            >
              <LogInIcon size={16} />

              {user ? "Go to dashboard" : "Log in"}
            </Button>

            <Button
              type="button"
              className="h-12 w-full rounded-full shadow-none"
              onClick={handlePostTask}
            >
              Post a task
              <ArrowUpRightIcon size={16} />
            </Button>
          </div>
        </aside>
      </div>
    </>
  );
}

export default SiteHeader;