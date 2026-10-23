import { useEffect, useId, useMemo, useState } from "react";
import {
  AlertCircleIcon,
  LoaderCircleIcon,
  PlusIcon,
  SearchIcon,
  XIcon,
} from "lucide-react";
import api from "@/api/axios";
import type { SkillOption } from "@/Types/skillOption";
import type { AllocatSkill } from "@/Types/allocatProfile";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type SkillPickerProps = {
  options: AllocatSkill[];
  selected: AllocatSkill[];
  onChange: (skills: AllocatSkill[]) => void;
  loading?: boolean;
  disabled?: boolean;
  error?: string | null;
  onRetry?: () => void;
  max?: number;
};
const accent =
  "bg-brand-secondary-highlight/[0.08] text-brand-secondary-highlight ring-1 ring-inset ring-brand-secondary-highlight/10 dark:bg-secondary/[0.08] dark:text-secondary dark:ring-secondary/10";
const focus =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-secondary-highlight/25 dark:focus-visible:ring-secondary/25";

// Category is a browsing filter only. The parent continues to own all selected skills.
export default function SkillPicker({
  options,
  selected,
  onChange,
  loading: loadingOptions = false,
  disabled = false,
  error: optionsError = null,
  onRetry,
  max = 20,
}: SkillPickerProps) {
  const id = useId();
  const [categoryId, setCategoryId] = useState("");
  const [query, setQuery] = useState("");
  const [categories, setCategories] = useState<
    Array<{ id: string; name: string }>
  >([]);
  const [skillCatalogue, setSkillCatalogue] = useState<SkillOption[]>([]);
  const [loadingCatalogue, setLoadingCatalogue] = useState(true);
  const [catalogueError, setCatalogueError] = useState<string | null>(null);
  const [retry, setRetry] = useState(0);
  useEffect(() => {
    let active = true;
    async function loadCatalogue() {
      setLoadingCatalogue(true);
      setCatalogueError(null);
      try {
        const [categoryResponse, skillResponse] = await Promise.all([
          api.get<Array<{ id: string; name: string }>>("/skill-categories", {
            withCredentials: true,
          }),
          api.get<SkillOption[]>("/skills", { withCredentials: true }),
        ]);
        if (
          !Array.isArray(categoryResponse.data) ||
          !Array.isArray(skillResponse.data)
        ) {
          throw new Error("Invalid skill catalogue response.");
        }
        if (!active) return;
        setCategories(
          Array.from(
            new Map(
              categoryResponse.data
                .filter(
                  (category) => category.id?.trim() && category.name?.trim(),
                )
                .map((category) => [category.id, category]),
            ).values(),
          ).sort((a, b) => a.name.localeCompare(b.name)),
        );
        setSkillCatalogue(skillResponse.data);
      } catch {
        if (active)
          setCatalogueError(
            "The skill categories and skills could not be loaded. Please try again.",
          );
      } finally {
        if (active) setLoadingCatalogue(false);
      }
    }
    void loadCatalogue();
    return () => {
      active = false;
    };
  }, [retry]);
  const loading = loadingOptions || loadingCatalogue;
  const error = optionsError || catalogueError;
  const metadataById = useMemo(
    () => new Map(skillCatalogue.map((skill) => [skill.id, skill])),
    [skillCatalogue],
  );
  // Profile skills only need id/name; category metadata belongs to SkillOption.
  // Keep the original profile skill fields when passing selections back to the parent.
  const catalog = useMemo(
    () =>
      Array.from(
        new Map(
          options.map((skill) => [
            skill.id,
            {
              ...skill,
              categoryId: metadataById.get(skill.id)?.categoryId,
              category: metadataById.get(skill.id)?.category,
            },
          ]),
        ).values(),
      ),
    [options, metadataById],
  );
  const activeCategory = categories.find(
    (category) => category.id === categoryId,
  );
  const selectedIds = useMemo(
    () => new Set(selected.map((skill) => skill.id)),
    [selected],
  );
  const available = useMemo(
    () =>
      activeCategory
        ? catalog
            .filter(
              (skill) =>
                skill.categoryId === activeCategory.id &&
                !selectedIds.has(skill.id),
            )
            .sort((a, b) => a.name.localeCompare(b.name))
        : [],
    [catalog, activeCategory, selectedIds],
  );
  const filtered = useMemo(() => {
    const search = query.trim().toLowerCase();
    return available.filter(
      (skill) => !search || skill.name.toLowerCase().includes(search),
    );
  }, [available, query]);
  const atLimit = selected.length >= max;
  function addSkill(skill: AllocatSkill & { categoryId?: string }) {
    if (
      disabled ||
      loading ||
      error ||
      atLimit ||
      !activeCategory ||
      skill.categoryId !== activeCategory.id ||
      selectedIds.has(skill.id)
    )
      return;
    onChange([...selected, skill]);
    setQuery("");
  }
  return (
    <div className="space-y-4">
      {selected.length > 0 && (
        <div>
          <p className="mb-2 text-[0.6875rem] font-medium text-muted-foreground">
            Selected skills{" "}
            <span className="tabular-nums">
              ({selected.length}/{max})
            </span>
          </p>
          <div className="flex flex-wrap gap-2">
            {selected.map((skill) => (
              <span
                key={skill.id}
                className={[
                  "inline-flex max-w-full items-center gap-2 rounded-lg px-3 py-2",
                  accent,
                ].join(" ")}
              >
                <span className="min-w-0">
                  <span className="block break-words text-xs font-semibold">
                    {skill.name}
                  </span>
                  {metadataById.get(skill.id)?.category?.trim() && (
                    <span className="mt-0.5 block text-[0.625rem] font-normal opacity-80">
                      {metadataById.get(skill.id)?.category}
                    </span>
                  )}
                </span>
                <button
                  type="button"
                  disabled={disabled}
                  aria-label={`Remove ${skill.name}`}
                  onClick={() => {
                    if (!disabled)
                      onChange(selected.filter((item) => item.id !== skill.id));
                  }}
                  className={[
                    "flex h-6 w-6 shrink-0 items-center justify-center rounded-md hover:bg-brand-secondary-highlight/10 disabled:pointer-events-none disabled:opacity-50 dark:hover:bg-secondary/10",
                    focus,
                  ].join(" ")}
                >
                  <XIcon size={12} aria-hidden="true" />
                </button>
              </span>
            ))}
          </div>
        </div>
      )}
      <div>
        <Label
          htmlFor={`${id}-category`}
          className="text-xs font-semibold text-foreground"
        >
          Skill category
        </Label>
        <Select
          value={activeCategory?.id ?? ""}
          disabled={
            disabled || loading || Boolean(error) || categories.length === 0
          }
          onValueChange={(value) => {
            setCategoryId(value);
            setQuery("");
          }}
        >
          <SelectTrigger
            id={`${id}-category`}
            aria-label="Skill category"
            aria-describedby={`${id}-help`}
            className="mt-2 h-11 w-full rounded-lg border-border/70 bg-surface-1/70 px-3.5 text-sm shadow-none focus:ring-2 focus:ring-brand-secondary-highlight/15 focus:ring-offset-0 disabled:opacity-60 dark:bg-surface-2/35 dark:focus:ring-secondary/15"
          >
            <SelectValue
              placeholder={
                loading ? "Loading categories…" : "Select a category"
              }
            />
          </SelectTrigger>
          <SelectContent className="rounded-xl border border-border/70 !bg-card p-1.5 !text-foreground shadow-md shadow-black/5 dark:border-border">
            {categories.map((category) => (
              <SelectItem
                key={category.id}
                value={category.id}
                className="rounded-lg py-2 text-sm !text-foreground hover:!bg-surface-3 hover:!text-foreground focus:!bg-surface-3 focus:!text-foreground data-[highlighted]:!bg-surface-3 data-[highlighted]:!text-foreground data-[state=checked]:!bg-surface-2 data-[state=checked]:!text-foreground [&_span]:!text-inherit"
              >
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p
          id={`${id}-help`}
          className="mt-2 text-[0.6875rem] leading-5 text-muted-foreground"
        >
          Choose a category to browse its skills. Switch categories to add more;
          your selected skills stay selected.
        </p>
      </div>
      {loading ? (
        <div
          role="status"
          className="flex items-center gap-2 rounded-xl border border-border/55 px-4 py-4 text-xs text-muted-foreground"
        >
          <LoaderCircleIcon
            size={14}
            className="animate-spin motion-reduce:animate-none"
            aria-hidden="true"
          />
          Loading skills
        </div>
      ) : error ? (
        <div
          role="alert"
          className="flex items-start gap-2.5 rounded-xl border border-destructive/20 bg-destructive/[0.05] px-4 py-3 text-xs text-destructive"
        >
          <AlertCircleIcon
            size={14}
            className="mt-0.5 shrink-0"
            aria-hidden="true"
          />
          <div className="min-w-0 flex-1">
            <p className="leading-5">{error}</p>
            {(catalogueError || onRetry) && (
              <Button
                type="button"
                variant="ghost"
                disabled={disabled}
                onClick={() => {
                  setRetry((current) => current + 1);
                  onRetry?.();
                }}
                className="mt-2 h-8 px-3 text-xs"
              >
                Retry skills
              </Button>
            )}
          </div>
        </div>
      ) : categories.length === 0 ? (
        <p
          role="status"
          className="rounded-xl border border-dashed border-border/65 px-4 py-4 text-xs leading-5 text-muted-foreground"
        >
          No skill categories are available yet.
        </p>
      ) : !activeCategory ? (
        <p className="rounded-xl border border-dashed border-border/65 px-4 py-4 text-xs leading-5 text-muted-foreground">
          Select a category above to see available skills.
        </p>
      ) : (
        <div className="overflow-hidden rounded-xl border border-border/70 bg-surface-1/70 dark:bg-surface-2/35">
          <div className="relative border-b border-border/55">
            <SearchIcon
              size={15}
              aria-hidden="true"
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <input
              aria-label="Search skills"
              value={query}
              disabled={disabled || atLimit}
              placeholder={
                atLimit
                  ? `Maximum ${max} skills selected`
                  : `Search ${activeCategory.name} skills`
              }
              onChange={(event) => setQuery(event.target.value)}
              className={[
                "h-11 w-full bg-transparent pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground/75 disabled:cursor-not-allowed disabled:opacity-60 focus-visible:ring-inset",
                focus,
              ].join(" ")}
            />
          </div>
          <div
            className="max-h-60 overflow-y-auto overscroll-contain p-1.5"
            aria-label={`${activeCategory.name} skills`}
          >
            {filtered.length > 0 ? (
              filtered.map((skill) => (
                <button
                  type="button"
                  key={skill.id}
                  aria-label={`Add ${skill.name}`}
                  disabled={disabled || atLimit}
                  onClick={() => addSkill(skill)}
                  className={[
                    "flex w-full items-center justify-between gap-4 rounded-lg px-3 py-2.5 text-left text-sm text-foreground/80 transition-colors hover:bg-surface-3/60 hover:text-foreground focus-visible:ring-inset disabled:pointer-events-none disabled:opacity-45 motion-reduce:transition-none dark:hover:bg-surface-3/70",
                    focus,
                  ].join(" ")}
                >
                  <span className="min-w-0 break-words">{skill.name}</span>
                  <span
                    className={[
                      "flex h-6 w-6 shrink-0 items-center justify-center rounded-lg",
                      accent,
                    ].join(" ")}
                  >
                    <PlusIcon size={12} aria-hidden="true" />
                  </span>
                </button>
              ))
            ) : (
              <p
                role="status"
                className="px-3 py-3 text-xs leading-5 text-muted-foreground"
              >
                {available.length === 0
                  ? catalog.some(
                      (skill) => skill.categoryId === activeCategory.id,
                    )
                    ? "You’ve selected all available skills in this category. Choose another category to add more."
                    : "No skills are available in this category yet."
                  : "No matching skills in this category."}
              </p>
            )}
          </div>
        </div>
      )}
      {atLimit && (
        <p
          role="status"
          className="text-[0.6875rem] leading-5 text-muted-foreground"
        >
          You’ve selected {max} skills. Remove one to add another.
        </p>
      )}
    </div>
  );
}
