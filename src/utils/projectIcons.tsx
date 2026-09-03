import {
  Armchair,
  BriefcaseBusinessIcon,
  Dock,
  Fence,
  FileBox,
  Hammer,
  Palette,
  Wrench,
  type LucideIcon,
} from "lucide-react";

import type { JSX } from "react";

/* =========================================================
   TYPES
========================================================= */

type ProjectCategoryAppearance = {
  label: string;
  icon: LucideIcon;
  iconClassName: string;
  surfaceClassName: string;
};

/* =========================================================
   CATEGORY APPEARANCE
========================================================= */

const projectTypeIcons: Record<string, ProjectCategoryAppearance> = {
  digital: {
    label: "Digital",
    icon: Dock,
    iconClassName: "text-sky-600 dark:text-sky-400",
    surfaceClassName: "bg-sky-500/10",
  },

  "home service": {
    label: "Home service",
    icon: Wrench,
    iconClassName: "text-teal-700 dark:text-teal-300",
    surfaceClassName: "bg-teal-500/10",
  },

  construction: {
    label: "Construction",
    icon: Hammer,
    iconClassName: "text-orange-700 dark:text-orange-300",
    surfaceClassName: "bg-orange-500/10",
  },

  creative: {
    label: "Creative",
    icon: Palette,
    iconClassName: "text-violet-700 dark:text-violet-300",
    surfaceClassName: "bg-violet-500/10",
  },

  "beauty & grooming": {
    label: "Beauty & Grooming",
    icon: Armchair,
    iconClassName: "text-rose-700 dark:text-rose-300",
    surfaceClassName: "bg-rose-500/10",
  },

  "carpentry & joinery": {
    label: "Carpentry & Joinery",
    icon: Fence,
    iconClassName: "text-emerald-700 dark:text-emerald-300",
    surfaceClassName: "bg-emerald-500/10",
  },

  "client work": {
    label: "Client project",
    icon: BriefcaseBusinessIcon,
    iconClassName: "text-indigo-700 dark:text-indigo-300",
    surfaceClassName: "bg-indigo-500/10",
  },

  default: {
    label: "General project",
    icon: FileBox,
    iconClassName: "text-slate-600 dark:text-slate-300",
    surfaceClassName: "bg-slate-500/10",
  },
};

/* =========================================================
   ALIASES
========================================================= */

const categoryAliases: Record<string, string> = {
  "home services": "home service",
  "beauty and grooming": "beauty & grooming",
  "carpentry and joinery": "carpentry & joinery",
  "client project": "client work",
};

/* =========================================================
   HELPERS
========================================================= */

function normalizeProjectCategory(category?: string) {
  return String(category ?? "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
}

function resolveProjectCategory(category?: string) {
  const normalized = normalizeProjectCategory(category);

  if (!normalized || normalized === "default") {
    return "default";
  }

  return categoryAliases[normalized] ?? normalized;
}

/* =========================================================
   GET ICON
========================================================= */

export function getProjectIcon(
  category?: string,
  size = 18,
): JSX.Element {
  const resolvedCategory = resolveProjectCategory(category);
  const appearance =
    projectTypeIcons[resolvedCategory] ?? projectTypeIcons.default;

  const Icon = appearance.icon;

  return (
    <Icon
      size={size}
      strokeWidth={1.9}
      className={appearance.iconClassName}
    />
  );
}

/* =========================================================
   GET ICON SURFACE
========================================================= */

export function getProjectIconSurfaceClass(category?: string) {
  const resolvedCategory = resolveProjectCategory(category);

  return (
    projectTypeIcons[resolvedCategory]?.surfaceClassName ??
    projectTypeIcons.default.surfaceClassName
  );
}

/* =========================================================
   GET CATEGORY LABEL
========================================================= */

export function getProjectCategoryLabel(
  category?: string,
  fallback = "General project",
) {
  const normalized = normalizeProjectCategory(category);

  if (!normalized || normalized === "default") {
    return fallback;
  }

  const resolvedCategory = resolveProjectCategory(category);
  const appearance = projectTypeIcons[resolvedCategory];

  if (appearance) {
    return appearance.label;
  }

  return category?.trim() || fallback;
}

export default projectTypeIcons;