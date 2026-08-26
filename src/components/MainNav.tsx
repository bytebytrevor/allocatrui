import {
  MenuIcon,
  MoonIcon,
  PlusIcon,
  SearchIcon,
  SunIcon,
  XIcon,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import AllocatrLogo from "./AllocatrLogo";
import { Button } from "./ui/button";

type Theme = "light" | "dark";

const navigationItems = [
  {
    label: "Explore",
    href: "/allocats",
    icon: SearchIcon,
  },
  {
    label: "Post a task",
    href: "/register",
    icon: PlusIcon,
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

function MainNav() {
  const [theme, setTheme] = useState<Theme>(getInitialTheme);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

  function closeMobileMenu() {
    setMobileMenuOpen(false);
  }

  return (
    <nav className="relative z-50 py-4 sm:py-5">
      <div className="flex items-center justify-between rounded-2xl border border-border bg-background/80 px-4 py-3 backdrop-blur-md sm:px-5">
        <Link
          to="/"
          onClick={closeMobileMenu}
          className="inline-flex shrink-0 items-center"
          aria-label="Go to Allocatr home"
        >
          <AllocatrLogo
            theme={theme}
            className="w-24 sm:w-28"
          />
        </Link>

        {/* Desktop navigation */}
        <div className="hidden items-center gap-1 md:flex">
          {navigationItems.map((item) => {
            const Icon = item.icon;

            return (
              <Link
                key={item.label}
                to={item.href}
                className="inline-flex h-10 items-center gap-2 rounded-xl px-4 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <Icon size={16} />
                {item.label}
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="rounded-xl"
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
            asChild
            className="hidden h-10 rounded-xl px-5 text-sm font-semibold sm:inline-flex"
          >
            <Link to="/login">
              Log in
            </Link>
          </Button>

          <Button
            type="button"
            variant="outline"
            size="icon"
            className="rounded-xl md:hidden"
            onClick={() =>
              setMobileMenuOpen((current) => !current)
            }
            aria-label={
              mobileMenuOpen
                ? "Close navigation menu"
                : "Open navigation menu"
            }
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? (
              <XIcon size={19} />
            ) : (
              <MenuIcon size={19} />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile navigation */}
      {mobileMenuOpen && (
        <div className="absolute left-0 right-0 top-full mt-3 rounded-2xl border border-border bg-background p-3 shadow-xl md:hidden">
          <div className="space-y-1">
            {navigationItems.map((item) => {
              const Icon = item.icon;

              return (
                <Link
                  key={item.label}
                  to={item.href}
                  onClick={closeMobileMenu}
                  className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors hover:bg-muted"
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-muted text-muted-foreground">
                    <Icon size={17} />
                  </span>

                  {item.label}
                </Link>
              );
            })}
          </div>

          <div className="mt-3 border-t border-border pt-3">
            <Button
              asChild
              className="h-11 w-full rounded-xl font-semibold"
            >
              <Link
                to="/login"
                onClick={closeMobileMenu}
              >
                Log in
              </Link>
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
}

export default MainNav;