import {
  Baby,
  BriefcaseBusiness,
  CarFront,
  CircleEllipsis,
  FileBox,
  GraduationCap,
  Handshake,
  HardHat,
  HeartPulse,
  House,
  Laptop,
  Palette,
  PartyPopper,
  PawPrint,
  Scissors,
  ShieldCheck,
  Sprout,
  Truck,
  UserRound,
  UtensilsCrossed,
  WashingMachine,
  Wrench,
  type LucideIcon,
} from "lucide-react";

import type { JSX } from "react";

type ProjectCategoryAppearance = {
  label: string;
  icon: LucideIcon;
  iconClassName: string;
  surfaceClassName: string;
};

const projectTypeIcons: Record<
  string,
  ProjectCategoryAppearance
> = {
  "agriculture & gardening": {
    label: "Agriculture & Gardening",
    icon: Sprout,
    iconClassName:
      "text-emerald-700 dark:text-emerald-300",
    surfaceClassName: "bg-emerald-500/10",
  },

  "events & entertainment": {
    label: "Events & Entertainment",
    icon: PartyPopper,
    iconClassName:
      "text-fuchsia-700 dark:text-fuchsia-300",
    surfaceClassName: "bg-fuchsia-500/10",
  },

  "creative & media": {
    label: "Creative & Media",
    icon: Palette,
    iconClassName:
      "text-violet-700 dark:text-violet-300",
    surfaceClassName: "bg-violet-500/10",
  },

  automotive: {
    label: "Automotive",
    icon: CarFront,
    iconClassName:
      "text-blue-700 dark:text-blue-300",
    surfaceClassName: "bg-blue-500/10",
  },

  "beauty & grooming": {
    label: "Beauty & Grooming",
    icon: Scissors,
    iconClassName:
      "text-rose-700 dark:text-rose-300",
    surfaceClassName: "bg-rose-500/10",
  },

  "hospitality & food": {
    label: "Hospitality & Food",
    icon: UtensilsCrossed,
    iconClassName:
      "text-orange-700 dark:text-orange-300",
    surfaceClassName: "bg-orange-500/10",
  },

  "home services": {
    label: "Home Services",
    icon: House,
    iconClassName:
      "text-teal-700 dark:text-teal-300",
    surfaceClassName: "bg-teal-500/10",
  },

  "pet & animal care": {
    label: "Pet & Animal Care",
    icon: PawPrint,
    iconClassName:
      "text-amber-700 dark:text-amber-300",
    surfaceClassName: "bg-amber-500/10",
  },

  "professional services": {
    label: "Professional Services",
    icon: BriefcaseBusiness,
    iconClassName:
      "text-indigo-700 dark:text-indigo-300",
    surfaceClassName: "bg-indigo-500/10",
  },

  "other services": {
    label: "Other Services",
    icon: CircleEllipsis,
    iconClassName:
      "text-slate-600 dark:text-slate-300",
    surfaceClassName: "bg-slate-500/10",
  },

  "repairs & maintenance": {
    label: "Repairs & Maintenance",
    icon: Wrench,
    iconClassName:
      "text-orange-700 dark:text-orange-300",
    surfaceClassName: "bg-orange-500/10",
  },

  "cleaning & laundry": {
    label: "Cleaning & Laundry",
    icon: WashingMachine,
    iconClassName:
      "text-cyan-700 dark:text-cyan-300",
    surfaceClassName: "bg-cyan-500/10",
  },

  "health & wellness": {
    label: "Health & Wellness",
    icon: HeartPulse,
    iconClassName:
      "text-red-700 dark:text-red-300",
    surfaceClassName: "bg-red-500/10",
  },

  technology: {
    label: "Technology",
    icon: Laptop,
    iconClassName:
      "text-sky-700 dark:text-sky-300",
    surfaceClassName: "bg-sky-500/10",
  },

  "personal services": {
    label: "Personal Services",
    icon: UserRound,
    iconClassName:
      "text-purple-700 dark:text-purple-300",
    surfaceClassName: "bg-purple-500/10",
  },

  "childcare & school runs": {
    label: "Childcare & School Runs",
    icon: Baby,
    iconClassName:
      "text-pink-700 dark:text-pink-300",
    surfaceClassName: "bg-pink-500/10",
  },

  "education & training": {
    label: "Education & Training",
    icon: GraduationCap,
    iconClassName:
      "text-blue-700 dark:text-blue-300",
    surfaceClassName: "bg-blue-500/10",
  },

  "security services": {
    label: "Security Services",
    icon: ShieldCheck,
    iconClassName:
      "text-emerald-700 dark:text-emerald-300",
    surfaceClassName: "bg-emerald-500/10",
  },

  "business support": {
    label: "Business Support",
    icon: Handshake,
    iconClassName:
      "text-indigo-700 dark:text-indigo-300",
    surfaceClassName: "bg-indigo-500/10",
  },

  "transport & logistics": {
    label: "Transport & Logistics",
    icon: Truck,
    iconClassName:
      "text-cyan-700 dark:text-cyan-300",
    surfaceClassName: "bg-cyan-500/10",
  },

  construction: {
    label: "Construction",
    icon: HardHat,
    iconClassName:
      "text-amber-700 dark:text-amber-300",
    surfaceClassName: "bg-amber-500/10",
  },

  default: {
    label: "General project",
    icon: FileBox,
    iconClassName:
      "text-slate-600 dark:text-slate-300",
    surfaceClassName: "bg-slate-500/10",
  },
};

const categoryAliases: Record<string, string> = {
  digital: "technology",
  creative: "creative & media",
  "creative services": "creative & media",

  "home service": "home services",

  "pet care": "pet & animal care",

  "professional service": "professional services",
  "client work": "professional services",
  "client project": "professional services",

  repairs: "repairs & maintenance",
  maintenance: "repairs & maintenance",

  cleaning: "cleaning & laundry",

  hospitality: "hospitality & food",

  education: "education & training",

  transport: "transport & logistics",
  logistics: "transport & logistics",

  "business services": "business support",

  "carpentry & joinery": "construction",

  other: "other services",
};

function normalizeProjectCategory(category?: string) {
  return String(category ?? "")
    .trim()
    .toLowerCase()
    .replace(/\band\b/g, "&")
    .replace(/\s*&\s*/g, " & ")
    .replace(/\s+/g, " ");
}

function resolveProjectCategory(category?: string) {
  const normalized = normalizeProjectCategory(category);

  if (!normalized || normalized === "default") {
    return "default";
  }

  return categoryAliases[normalized] ?? normalized;
}

export function getProjectIcon(
  category?: string,
  size = 18,
): JSX.Element {
  const resolvedCategory =
    resolveProjectCategory(category);

  const appearance =
    projectTypeIcons[resolvedCategory] ??
    projectTypeIcons.default;

  const Icon = appearance.icon;

  return (
    <Icon
      size={size}
      strokeWidth={1.9}
      className={appearance.iconClassName}
    />
  );
}

export function getProjectIconSurfaceClass(
  category?: string,
) {
  const resolvedCategory =
    resolveProjectCategory(category);

  return (
    projectTypeIcons[resolvedCategory]
      ?.surfaceClassName ??
    projectTypeIcons.default.surfaceClassName
  );
}

export function getProjectCategoryLabel(
  category?: string,
  fallback = "General project",
) {
  const normalized =
    normalizeProjectCategory(category);

  if (!normalized || normalized === "default") {
    return fallback;
  }

  const resolvedCategory =
    resolveProjectCategory(category);

  const appearance =
    projectTypeIcons[resolvedCategory];

  if (appearance) {
    return appearance.label;
  }

  return category?.trim() || fallback;
}

export default projectTypeIcons;