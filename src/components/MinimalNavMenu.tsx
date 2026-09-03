import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
  FolderOpenIcon,
  MoonIcon,
  SunIcon,
} from "lucide-react";

import AllocatrIconLogo from "@/components/AllocatrIconLogo";
import { Button } from "@/components/ui/button";

type Theme = "light" | "dark";

function MinimalNavMenu() {
  const [theme, setTheme] = useState<Theme>(() => {
    const savedTheme = localStorage.getItem("theme");

    if (savedTheme === "light" || savedTheme === "dark") {
      return savedTheme;
    }

    return "dark";
  });

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

  return (
    <nav
      className="flex h-16 items-center justify-between gap-5"
      aria-label="Project creation navigation"
    >
      <Link
        to="/"
        aria-label="Go to home"
        className={[
          "flex h-9 w-9 shrink-0 items-center justify-center",
          "rounded-lg transition-colors",
          "hover:bg-muted/40",
          "focus-visible:outline-none focus-visible:ring-2",
          "focus-visible:ring-primary/30",
        ].join(" ")}
      >
        <AllocatrIconLogo
          theme={theme}
          className="w-5"
        />
      </Link>

      <div className="flex items-center gap-1.5">
        <Button
          asChild
          variant="ghost"
          className={[
            "h-9 rounded-lg px-3",
            "text-xs font-semibold text-muted-foreground",
            "shadow-none",
            "hover:bg-muted/40 hover:text-foreground",
          ].join(" ")}
        >
          <Link to="/projects">
            <FolderOpenIcon size={14} />
            Projects
          </Link>
        </Button>

        <span className="mx-1 hidden h-5 w-px bg-border/80 sm:block" />

        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          className="h-9 w-9 rounded-lg text-muted-foreground shadow-none hover:bg-muted/40 hover:text-foreground"
          aria-label={
            theme === "dark"
              ? "Switch to light mode"
              : "Switch to dark mode"
          }
        >
          {theme === "dark" ? (
            <SunIcon size={15} />
          ) : (
            <MoonIcon size={15} />
          )}
        </Button>
      </div>
    </nav>
  );
}

export default MinimalNavMenu;