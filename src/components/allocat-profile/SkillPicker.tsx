import {
  useMemo,
  useState,
} from "react";

import {
  CheckIcon,
  LoaderCircleIcon,
  SearchIcon,
  XIcon,
} from "lucide-react";

import type { AllocatSkill } from "@/Types/allocatProfile";

type SkillPickerProps = {
  options: AllocatSkill[];
  selected: AllocatSkill[];
  onChange: (skills: AllocatSkill[]) => void;
  loading?: boolean;
  disabled?: boolean;
  error?: string | null;
};

function SkillPicker({
  options,
  selected,
  onChange,
  loading = false,
  disabled = false,
  error,
}: SkillPickerProps) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);

  const selectedIds = useMemo(
    () => new Set(selected.map((skill) => skill.id)),
    [selected],
  );

  const filteredOptions = useMemo(() => {
    const search = query.trim().toLowerCase();

    return options
      .filter((skill) => !selectedIds.has(skill.id))
      .filter(
        (skill) =>
          !search ||
          skill.name.toLowerCase().includes(search),
      )
      .slice(0, 8);
  }, [options, query, selectedIds]);

  function addSkill(skill: AllocatSkill) {
    if (selectedIds.has(skill.id)) {
      return;
    }

    onChange([...selected, skill]);
    setQuery("");
    setOpen(false);
  }

  function removeSkill(skillId: string) {
    onChange(
      selected.filter((skill) => skill.id !== skillId),
    );
  }

  return (
    <div>
      {selected.length > 0 && (
        <div className="mb-3 flex flex-wrap gap-2">
          {selected.map((skill) => (
            <span
              key={skill.id}
              className={[
                "inline-flex h-8 items-center gap-1.5 rounded-lg",
                "bg-primary/[0.07] px-2.5",
                "text-[0.68rem] font-semibold text-primary",
              ].join(" ")}
            >
              {skill.name}

              <button
                type="button"
                onClick={() => removeSkill(skill.id)}
                disabled={disabled}
                className="text-primary/55 transition-colors hover:text-primary"
                aria-label={`Remove ${skill.name}`}
              >
                <XIcon size={11} />
              </button>
            </span>
          ))}
        </div>
      )}

      <div className="relative">
        <SearchIcon
          size={15}
          className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
        />

        <input
          value={query}
          disabled={disabled || loading}
          placeholder={
            loading
              ? "Loading skills..."
              : "Search skills"
          }
          onFocus={() => setOpen(true)}
          onChange={(event) => {
            setQuery(event.target.value);
            setOpen(true);
          }}
          onKeyDown={(event) => {
            if (event.key === "Escape") {
              setOpen(false);
              return;
            }

            if (
              event.key === "Enter" &&
              filteredOptions.length > 0
            ) {
              event.preventDefault();
              addSkill(filteredOptions[0]);
            }
          }}
          className={[
            "h-11 w-full rounded-lg border border-border",
            "bg-transparent pl-10 pr-10 text-sm outline-none",
            "transition-colors",
            "placeholder:text-muted-foreground",
            "focus:border-primary/40",
            "disabled:cursor-not-allowed disabled:opacity-60",
          ].join(" ")}
        />

        {loading && (
          <LoaderCircleIcon
            size={15}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 animate-spin text-muted-foreground"
          />
        )}

        {open && !loading && (
          <div
            className={[
              "absolute inset-x-0 top-[calc(100%+6px)] z-30",
              "max-h-64 overflow-y-auto rounded-xl",
              "border border-border bg-popover p-1.5",
              "shadow-xl shadow-black/[0.06]",
              "dark:shadow-black/30",
            ].join(" ")}
            onMouseDown={(event) => event.preventDefault()}
          >
            {filteredOptions.length > 0 ? (
              filteredOptions.map((skill) => (
                <button
                  key={skill.id}
                  type="button"
                  onClick={() => addSkill(skill)}
                  className={[
                    "flex w-full items-center justify-between",
                    "rounded-lg px-3 py-2.5 text-left",
                    "text-sm transition-colors hover:bg-muted/60",
                  ].join(" ")}
                >
                  <span>{skill.name}</span>

                  <CheckIcon
                    size={13}
                    className="text-muted-foreground/40"
                  />
                </button>
              ))
            ) : (
              <p className="px-3 py-3 text-xs text-muted-foreground">
                No matching skills found.
              </p>
            )}
          </div>
        )}
      </div>

      {error && (
        <p className="mt-2 text-xs text-destructive">
          {error}
        </p>
      )}

      <p className="mt-2 text-[0.62rem] leading-5 text-muted-foreground">
        Select skills from the Allocatr skill catalogue.
      </p>
    </div>
  );
}

export default SkillPicker;