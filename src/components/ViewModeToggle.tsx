import { Grid2X2Icon, ListIcon } from "lucide-react";
import { resultsControlFocus } from "@/components/allocat-results-theme";

export type ResultsViewMode = "grid" | "list";

type Props = {
  value: ResultsViewMode;
  onChange: (value: ResultsViewMode) => void;
  disabled?: boolean;
  label?: string;
};

/** The grid/list control used by Discover. Keep its styling shared across pages. */
export default function ViewModeToggle({
  value,
  onChange,
  disabled = false,
  label = "Results view",
}: Props) {
  return (
    <div
      role="group"
      aria-label={label}
      className="flex h-10 shrink-0 items-center rounded-lg border border-border/60 bg-surface-3/55 p-1 dark:border-border dark:bg-surface-2/70"
    >
      {(
        [
          { mode: "grid", label: "Grid view", icon: Grid2X2Icon },
          { mode: "list", label: "List view", icon: ListIcon },
        ] as const
      ).map(({ mode, label: buttonLabel, icon: Icon }) => (
        <button
          key={mode}
          type="button"
          aria-label={buttonLabel}
          title={buttonLabel}
          aria-pressed={value === mode}
          disabled={disabled}
          onClick={() => onChange(mode)}
          className={`flex h-8 w-8 items-center justify-center rounded-md transition-colors duration-150 disabled:pointer-events-none disabled:opacity-50 motion-reduce:transition-none ${resultsControlFocus} ${value === mode ? "bg-brand-secondary-highlight text-primary-foreground dark:bg-secondary dark:text-secondary-foreground" : "text-muted-foreground hover:bg-surface-1/75 hover:text-foreground/85 dark:hover:bg-surface-3"}`}
        >
          <Icon size={mode === "list" ? 15 : 14} aria-hidden="true" />
        </button>
      ))}
    </div>
  );
}
