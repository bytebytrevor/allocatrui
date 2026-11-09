// Shared tokens from the corrected Discover reference.
export const discoverIconSurface = [
  "bg-surface-3/70", "text-foreground/55", "ring-1 ring-inset ring-border/40",
  "dark:bg-surface-2/80", "dark:text-secondary/85", "dark:ring-border",
].join(" ");
export const filterIconSurface = [
  "bg-surface-3/65", "text-muted-foreground", "ring-1 ring-inset ring-border/35",
  "dark:bg-surface-2/80", "dark:text-secondary/80", "dark:ring-border",
].join(" ");
export const inputSurface = [
  "border-border/60", "bg-surface-2/35", "text-foreground/85", "placeholder:text-muted-foreground/50", "shadow-none",
  "transition-[background-color,border-color,box-shadow,color] duration-150",
  "hover:border-border/80", "hover:bg-surface-2/55", "focus-visible:border-ring/25", "focus-visible:bg-surface-1",
  "focus-visible:ring-1", "focus-visible:ring-ring/10", "dark:border-border", "dark:bg-surface-2/65",
  "dark:hover:bg-surface-3/60", "dark:focus-visible:border-secondary/20", "dark:focus-visible:bg-surface-2", "dark:focus-visible:ring-secondary/[0.08]",
].join(" ");
export const primaryActionButton = [
  "border border-brand-secondary-highlight/15", "bg-brand-secondary-highlight", "text-primary-foreground",
  "hover:border-brand-secondary-highlight/20", "hover:bg-brand-secondary-highlight/90", "hover:text-primary-foreground",
  "dark:border-secondary/10", "dark:bg-secondary", "dark:text-secondary-foreground",
  "dark:hover:border-secondary/15", "dark:hover:bg-secondary/90", "dark:hover:text-secondary-foreground",
].join(" ");
export const secondaryActionButton = [
  "border-border/65", "bg-surface-2/35", "text-foreground/70",
  "hover:border-border/85", "hover:bg-surface-3/60", "hover:text-foreground/90",
  "dark:border-border", "dark:bg-surface-2/65", "dark:text-foreground/75", "dark:hover:bg-surface-3/70", "dark:hover:text-foreground",
].join(" ");
export const selectedFilterSurface = [
  "border-foreground/[0.09]", "bg-foreground/[0.045]", "text-foreground/85",
  "dark:border-secondary/15", "dark:bg-secondary/[0.055]", "dark:text-secondary",
].join(" ");
export const unselectedFilterSurface = [
  "border-border/60", "bg-surface-2/30", "text-muted-foreground",
  "hover:border-border/80", "hover:bg-surface-3/55", "hover:text-foreground/85",
  "dark:border-border", "dark:bg-surface-2/55", "dark:hover:bg-surface-3/65", "dark:hover:text-foreground",
].join(" ");
export const rateSliderClass = [
  "[&_[data-slot=slider-track]]:!bg-surface-3", "[&_[data-slot=slider-range]]:!bg-brand-secondary-highlight",
  "[&_[data-slot=slider-thumb]]:!border-brand-secondary-highlight", "[&_[data-slot=slider-thumb]]:!bg-surface-1", "[&_[data-slot=slider-thumb]]:!ring-brand-secondary-highlight/10",
  "dark:[&_[data-slot=slider-track]]:!bg-surface-3", "dark:[&_[data-slot=slider-range]]:!bg-secondary",
  "dark:[&_[data-slot=slider-thumb]]:!border-secondary", "dark:[&_[data-slot=slider-thumb]]:!bg-surface-1", "dark:[&_[data-slot=slider-thumb]]:!ring-secondary/10",
  "[&>span:first-child]:!bg-surface-3", "[&>span:first-child>span]:!bg-brand-secondary-highlight",
  "dark:[&>span:first-child]:!bg-surface-3", "dark:[&>span:first-child>span]:!bg-secondary",
  "[&_[role=slider]]:!border-brand-secondary-highlight", "dark:[&_[role=slider]]:!border-secondary",
].join(" ");
export const resultsControlFocus = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/25 focus-visible:ring-offset-2 focus-visible:ring-offset-background";
