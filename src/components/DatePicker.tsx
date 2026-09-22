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

type Calendar28Props = {
  id: string;
  label: string;
  value: Date | null;
  onChange: (date: Date | null) => void;
  className?: string;
  disabled?: boolean;
};

export function Calendar28({
  id,
  label,
  value,
  onChange,
  className,
  disabled = false,
}: Calendar28Props) {
  return (
    <div className="min-w-0">
      <label
        htmlFor={id}
        className="mb-2 block text-sm font-semibold"
      >
        {label}
      </label>

      <Popover>
        <PopoverTrigger asChild>
          <Button
            id={id}
            type="button"
            variant="outline"
            disabled={disabled}
            className={cn(
              "h-12 w-full justify-start rounded-xl",
              "border-border/90 bg-muted/[0.18]",
              "px-4 text-left font-normal shadow-none",
              "transition-colors",
              "hover:bg-muted/[0.28]",
              "hover:text-foreground",
              "focus-visible:border-ring",
              "focus-visible:ring-1",
              "focus-visible:ring-ring/40",
              !value && "text-muted-foreground",
              className,
            )}
          >
            <CalendarIcon
              size={15}
              className="mr-2 shrink-0 text-muted-foreground"
            />

            <span className="min-w-0 flex-1 truncate">
              {value
                ? format(value, "EEE, dd MMM yyyy")
                : "Choose a date"}
            </span>

            {value && !disabled && (
              <span
                role="button"
                tabIndex={0}
                aria-label={`Clear ${label}`}
                onClick={event => {
                  event.preventDefault();
                  event.stopPropagation();

                  onChange(null);
                }}
                onKeyDown={event => {
                  if (
                    event.key === "Enter" ||
                    event.key === " "
                  ) {
                    event.preventDefault();
                    event.stopPropagation();

                    onChange(null);
                  }
                }}
                className={cn(
                  "ml-2 flex h-6 w-6 shrink-0 items-center justify-center",
                  "rounded-md text-muted-foreground",
                  "transition-colors",
                  "hover:bg-muted hover:text-foreground",
                  "focus-visible:outline-none",
                  "focus-visible:ring-1 focus-visible:ring-ring/40",
                )}
              >
                <XIcon size={12} />
              </span>
            )}
          </Button>
        </PopoverTrigger>

        <PopoverContent
          align="start"
          sideOffset={6}
          className={cn(
            "w-auto max-w-[calc(100vw-2rem)]",
            "overflow-hidden rounded-xl",
            "border border-border",
            "bg-popover p-0 text-popover-foreground",
            "shadow-xl",
          )}
        >
          <Calendar
            mode="single"
            selected={value ?? undefined}
            onSelect={date =>
              onChange(date ?? null)
            }
            initialFocus
            className={cn(
              "p-3",

              /*
               * General day hover:
               * neutral surface.
               */
              "[&_button:hover]:bg-muted",
              "[&_button:hover]:text-foreground",

              /*
               * Today:
               * subtle neutral indication only.
               */
              "[&_[data-today=true]]:bg-muted",
              "[&_[data-today=true]]:font-semibold",
              "[&_[data-today=true]]:text-foreground",

              /*
               * Selected date:
               * primary surface + secondary foreground.
               *
               * Light:
               * charcoal + lime.
               *
               * Dark:
               * lime + charcoal.
               */
              "[&_[data-selected-single=true]]:bg-primary",
              "[&_[data-selected-single=true]]:text-secondary",
              "[&_[data-selected-single=true]]:font-bold",

              /*
               * Selected date hover must retain
               * the selected theme treatment.
               */
              "[&_[data-selected-single=true]:hover]:bg-primary",
              "[&_[data-selected-single=true]:hover]:text-secondary",
              "[&_[data-selected-single=true]]:hover:bg-primary",
              "[&_[data-selected-single=true]]:hover:text-secondary",

              /*
               * Dates outside the current month
               * and disabled dates remain subdued.
               */
              "[&_[data-disabled=true]]:text-muted-foreground/40",
              "[&_[data-outside=true]]:text-muted-foreground/50",
            )}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}