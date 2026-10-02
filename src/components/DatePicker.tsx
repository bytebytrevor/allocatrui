import { useState } from "react";

import { CalendarIcon, XIcon } from "lucide-react";
import { format } from "date-fns";

import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

/* =========================================================
   TYPES
========================================================= */

type Calendar28Props = {
  id: string;
  label: string;
  value: Date | null;
  onChange: (date: Date | null) => void;
  className?: string;
  disabled?: boolean;
};

/* =========================================================
   CALENDAR
========================================================= */

export function Calendar28({
  id,
  label,
  value,
  onChange,
  className,
  disabled = false,
}: Calendar28Props) {
  const [open, setOpen] = useState(false);

  function handleSelect(date?: Date) {
    onChange(date ?? null);
    setOpen(false);
  }

  function handleClear() {
    onChange(null);
    setOpen(false);
  }

  return (
    <div className="min-w-0">
      <label
        htmlFor={id}
        className="mb-2 block text-sm font-semibold text-foreground/80"
      >
        {label}
      </label>

      <div className="relative">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              id={id}
              type="button"
              variant="outline"
              disabled={disabled}
              className={cn(
                "h-12 w-full justify-start rounded-xl",
                "px-4 text-left font-normal shadow-none",

                "border-border/60 bg-surface-2/40",
                "text-foreground/80",

                "transition-[background-color,border-color,box-shadow,color] duration-150",

                "hover:border-border/80",
                "hover:bg-surface-2/55",
                "hover:text-foreground/90",

                "focus-visible:border-brand-secondary-highlight/25",
                "focus-visible:bg-surface-1",
                "focus-visible:ring-1",
                "focus-visible:ring-brand-secondary-highlight/10",

                "data-[state=open]:border-brand-secondary-highlight/25",
                "data-[state=open]:bg-surface-1",
                "data-[state=open]:ring-1",
                "data-[state=open]:ring-brand-secondary-highlight/10",

                "dark:border-border",
                "dark:bg-surface-2/65",
                "dark:text-foreground/85",

                "dark:hover:bg-surface-3/60",

                "dark:focus-visible:border-secondary/20",
                "dark:focus-visible:bg-surface-2",
                "dark:focus-visible:ring-secondary/[0.08]",

                "dark:data-[state=open]:border-secondary/20",
                "dark:data-[state=open]:bg-surface-2",
                "dark:data-[state=open]:ring-secondary/[0.08]",

                value && !disabled ? "pr-11" : "",

                !value && "text-muted-foreground/65",

                className,
              )}
            >
              <CalendarIcon
                size={15}
                className={[
                  "mr-2 shrink-0",
                  value
                    ? [
                        "text-brand-secondary-highlight/80",
                        "dark:text-secondary/80",
                      ].join(" ")
                    : "text-muted-foreground/70",
                ].join(" ")}
              />

              <span className="min-w-0 flex-1 truncate">
                {value ? format(value, "EEE, dd MMM yyyy") : "Choose a date"}
              </span>
            </Button>
          </PopoverTrigger>

          <PopoverContent
            align="start"
            sideOffset={7}
            className={cn(
              "w-auto max-w-[calc(100vw-2rem)]",

              "overflow-hidden rounded-xl",

              "border border-border/60",
              "bg-popover p-1.5",
              "text-popover-foreground",

              "shadow-none",
            )}
          >
            <Calendar
              mode="single"
              selected={value ?? undefined}
              onSelect={handleSelect}
              initialFocus
              className={cn(
                "p-2",

                /* ==========================================
                   MONTH / HEADER
                ========================================== */

                "[&_.rdp-month_caption]:text-foreground/85",
                "[&_.rdp-month_caption]:font-semibold",

                "[&_.rdp-weekday]:text-muted-foreground/65",
                "[&_.rdp-weekday]:font-medium",

                /* ==========================================
                   NAVIGATION
                ========================================== */

                "[&_.rdp-button_previous]:text-muted-foreground/75",
                "[&_.rdp-button_next]:text-muted-foreground/75",

                "[&_.rdp-button_previous:hover]:bg-surface-3/60",
                "[&_.rdp-button_next:hover]:bg-surface-3/60",

                "[&_.rdp-button_previous:hover]:text-foreground/90",
                "[&_.rdp-button_next:hover]:text-foreground/90",

                "dark:[&_.rdp-button_previous:hover]:bg-surface-3/70",
                "dark:[&_.rdp-button_next:hover]:bg-surface-3/70",

                /* ==========================================
                   GENERAL DAYS
                ========================================== */

                "[&_button]:transition-[background-color,color,box-shadow] duration-150",

                "[&_button:hover]:bg-surface-3/65",
                "[&_button:hover]:text-foreground/90",

                "[&_button:focus-visible]:outline-none",
                "[&_button:focus-visible]:ring-1",
                "[&_button:focus-visible]:ring-brand-secondary-highlight/15",

                "dark:[&_button:hover]:bg-surface-3/70",
                "dark:[&_button:focus-visible]:ring-secondary/15",

                /* ==========================================
                   TODAY

                   Neutral enough not to compete with
                   selected date.
                ========================================== */

                "[&_[data-today=true]]:!bg-surface-3/65",
                "[&_[data-today=true]]:!text-foreground/80",
                "[&_[data-today=true]]:font-semibold",

                "dark:[&_[data-today=true]]:!bg-surface-3/75",
                "dark:[&_[data-today=true]]:!text-foreground/85",

                /* ==========================================
                   SELECTED DATE - LIGHT

                   Soft teal rather than charcoal/lime.
                ========================================== */

                "[&_[data-selected-single=true]]:!bg-brand-secondary-highlight/[0.11]",
                "[&_[data-selected-single=true]]:!text-brand-secondary-highlight",

                "[&_[data-selected-single=true]]:font-semibold",

                "[&_[data-selected-single=true]]:ring-1",
                "[&_[data-selected-single=true]]:ring-inset",
                "[&_[data-selected-single=true]]:ring-brand-secondary-highlight/15",

                /* selected hover stays restrained */

                "[&_[data-selected-single=true]:hover]:!bg-brand-secondary-highlight/[0.14]",
                "[&_[data-selected-single=true]:hover]:!text-brand-secondary-highlight",

                "[&_[data-selected-single=true]]:hover:!bg-brand-secondary-highlight/[0.14]",
                "[&_[data-selected-single=true]]:hover:!text-brand-secondary-highlight",

                /* ==========================================
                   SELECTED DATE - DARK

                   Soft lime, not a solid bright block.
                ========================================== */

                "dark:[&_[data-selected-single=true]]:!bg-secondary/[0.09]",
                "dark:[&_[data-selected-single=true]]:!text-secondary",

                "dark:[&_[data-selected-single=true]]:ring-secondary/15",

                "dark:[&_[data-selected-single=true]:hover]:!bg-secondary/[0.12]",
                "dark:[&_[data-selected-single=true]:hover]:!text-secondary",

                "dark:[&_[data-selected-single=true]]:hover:!bg-secondary/[0.12]",
                "dark:[&_[data-selected-single=true]]:hover:!text-secondary",

                /* ==========================================
                   OUTSIDE / DISABLED
                ========================================== */

                "[&_[data-outside=true]]:text-muted-foreground/40",
                "[&_[data-outside=true]]:opacity-70",

                "[&_[data-disabled=true]]:text-muted-foreground/30",
                "[&_[data-disabled=true]]:opacity-50",
              )}
            />
          </PopoverContent>
        </Popover>

        {/* =================================================
            CLEAR DATE

            Separate from the Popover trigger so we avoid
            nesting an interactive element inside Button.
        ================================================= */}

        {value && !disabled && (
          <button
            type="button"
            aria-label={`Clear ${label}`}
            title={`Clear ${label}`}
            onClick={handleClear}
            className={[
              "absolute right-2 top-1/2 z-10",
              "flex h-7 w-7 -translate-y-1/2 items-center justify-center",
              "rounded-md",

              "text-muted-foreground/65",

              "transition-[background-color,color] duration-150",

              "hover:bg-surface-3/70",
              "hover:text-foreground/85",

              "focus-visible:outline-none",
              "focus-visible:ring-1",
              "focus-visible:ring-brand-secondary-highlight/15",

              "dark:hover:bg-surface-3",
              "dark:hover:text-foreground",

              "dark:focus-visible:ring-secondary/15",
            ].join(" ")}
          >
            <XIcon size={12} />
          </button>
        )}
      </div>
    </div>
  );
}
