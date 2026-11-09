import { ArrowDownWideNarrowIcon, CheckIcon, ChevronDownIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export type SortDropdownOption<T extends string> = {
  value: T;
  label: string;
  description?: string;
};

type Props<T extends string> = {
  value: T;
  onChange: (value: T) => void;
  options: readonly SortDropdownOption<T>[];
  label?: string;
  disabled?: boolean;
};

const FOCUS =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/35 focus-visible:ring-offset-2 focus-visible:ring-offset-background";
const ACCENT = "text-brand-secondary-highlight dark:text-secondary";
const TRIGGER =
  `inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-border/70 bg-card px-3 text-xs font-medium text-foreground transition-opacity duration-150 hover:opacity-80 disabled:pointer-events-none disabled:opacity-50 motion-reduce:transition-none ${FOCUS}`;
const MENU =
  "z-[150] rounded-xl border border-border/80 bg-popover p-1.5 text-popover-foreground shadow-[0_16px_45px_-18px_color-mix(in_srgb,var(--brand-charcoal)_30%,transparent)]";
const MENU_ITEM =
  "min-h-11 gap-3 rounded-lg px-3 py-2.5 text-xs text-foreground outline-none focus:bg-surface-3/60";

/** The earlier Find Allocats sort presentation, shared without page-specific sorting. */
export default function SortDropdown<T extends string>({
  value,
  onChange,
  options,
  label = "Sort results",
  disabled = false,
}: Props<T>) {
  const selected = options.find((option) => option.value === value) ?? options[0];
  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label={`Sort results: ${selected?.label ?? "No options"}`}
          disabled={disabled || options.length === 0}
          className={`${TRIGGER} min-h-10 max-w-[180px] gap-1.5 px-2.5 sm:max-w-none sm:px-3`}
        >
          <ArrowDownWideNarrowIcon size={14} aria-hidden="true" className="shrink-0 text-muted-foreground" />
          <span className="truncate text-[11px] font-medium">{selected?.label ?? "Sort"}</span>
          <ChevronDownIcon size={11} aria-hidden="true" className="shrink-0 text-muted-foreground" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" sideOffset={6} collisionPadding={16} className={`${MENU} w-64 max-w-[calc(100vw-32px)]`}>
        <DropdownMenuLabel className="px-3 py-2 text-[10px] font-medium uppercase tracking-[0.1em] text-muted-foreground">{label}</DropdownMenuLabel>
        {options.map((option) => (
          <DropdownMenuItem
            key={option.value}
            role="menuitemradio"
            aria-checked={value === option.value}
            className={`${MENU_ITEM} ${value === option.value ? "bg-surface-2" : ""}`}
            onSelect={() => onChange(option.value)}
          >
            <span className="min-w-0 flex-1">
              <span className="block font-medium">{option.label}</span>
              {option.description && <span className="mt-1 block text-[10px] font-normal leading-4 text-muted-foreground">{option.description}</span>}
            </span>
            {value === option.value && <CheckIcon size={13} aria-hidden="true" className={ACCENT} />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
