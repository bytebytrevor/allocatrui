import {
  type CSSProperties,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  ArrowDownWideNarrowIcon,
  BadgeCheckIcon,
  CatIcon,
  CheckIcon,
  ChevronDownIcon,
  CircleDollarSignIcon,
  Clock3Icon,
  Grid2X2Icon,
  Layers3Icon,
  ListIcon,
  MapPinIcon,
  PlusIcon,
  RefreshCwIcon,
  SearchIcon,
  SlidersHorizontalIcon,
  TagsIcon,
  UsersIcon,
  XIcon,
} from "lucide-react";
import api from "@/api/axios";
import type { AllocatProfile } from "@/Types/allocatProfile";
import { AllocatCardGrid } from "@/components/AllocatCard";
import MinimalNavMenu from "@/components/MinimalNavMenu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
type SortOption = "rating" | "experience" | "rate-low" | "recent";
type ViewMode = "grid" | "list";
type FilterName = "category" | "skills" | "location" | "rate" | "experience";
type SkillSummary = {
  id: string;
  name: string;
  categoryId?: string;
  category?: string;
};
type FilterableAllocat = Omit<AllocatProfile, "skills"> & {
  skills?: SkillSummary[];
  location?: string;
  city?: string;
  country?: string;
  isVerified?: boolean;
  verified?: boolean;
  rating?: number;
  averageRating?: number;
  joinedAt?: string;
  createdAt?: string;
  updatedAt?: string;
};
type RawAllocat = Omit<FilterableAllocat, "skills"> & {
  skills?: (SkillSummary | string)[];
};
type AllocatsResponse = {
  items: RawAllocat[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
};
const CONTAINER =
  "mx-auto w-full max-w-[1440px] px-5 sm:px-8 lg:px-12 xl:px-16";
const FOCUS =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/35 focus-visible:ring-offset-2 focus-visible:ring-offset-background";
const ACCENT = "text-brand-secondary-highlight dark:text-secondary";
const ACTION = `inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border px-3 text-xs font-medium transition-opacity duration-150 hover:opacity-80 disabled:pointer-events-none disabled:opacity-50 motion-reduce:transition-none ${FOCUS}`;
const QUIET = `${ACTION} border-border/70 bg-card text-foreground`;
const PRIMARY = `${ACTION} border-brand-secondary-highlight/15 bg-brand-secondary-highlight text-primary-foreground dark:border-secondary/15 dark:bg-secondary dark:text-secondary-foreground`;
const FIELD = `h-11 w-full min-w-0 rounded-lg border border-input bg-surface-2/40 px-3 text-base text-foreground placeholder:text-muted-foreground/75 outline-none transition-[border-color,box-shadow] duration-150 focus-visible:border-ring/50 focus-visible:ring-2 focus-visible:ring-ring/10 motion-reduce:transition-none lg:text-xs`;
const SELECTED =
  "border-brand-secondary-highlight/25 bg-brand-secondary-highlight/[0.07] text-brand-secondary-highlight dark:border-secondary/25 dark:bg-secondary/[0.08] dark:text-secondary";
const UNSELECTED =
  "border-border/70 bg-card text-muted-foreground hover:bg-surface-2/75 hover:text-foreground";
const MENU =
  "z-[150] rounded-xl border border-border/80 bg-popover p-1.5 text-popover-foreground shadow-[0_16px_45px_-18px_color-mix(in_srgb,var(--brand-charcoal)_30%,transparent)]";
const MENU_ITEM =
  "min-h-11 gap-3 rounded-lg px-3 py-2.5 text-xs text-foreground outline-none focus:bg-surface-3/60";
const INITIAL_VISIBLE = 24;
const EXPERIENCE = [0, 1, 3, 5, 10];
const FILTERS = [
  { value: "category", label: "Category", icon: Layers3Icon },
  { value: "skills", label: "Skills", icon: TagsIcon },
  { value: "location", label: "Location", icon: MapPinIcon },
  { value: "rate", label: "Hourly rate", icon: CircleDollarSignIcon },
  { value: "experience", label: "Experience", icon: Clock3Icon },
] as const;
const SORT_OPTIONS: {
  value: SortOption;
  label: string;
  description: string;
}[] = [
  {
    value: "rating",
    label: "Highest rated",
    description: "Highest profile ratings first",
  },
  {
    value: "experience",
    label: "Most experienced",
    description: "Most years of experience first",
  },
  {
    value: "rate-low",
    label: "Lowest rate",
    description: "Lowest listed hourly rates first",
  },
  {
    value: "recent",
    label: "Recently updated",
    description: "Latest profile updates or join dates",
  },
];
export default function Discover() {
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const search = params.get("search") ?? "";
  const [allocats, setAllocats] = useState<FilterableAllocat[]>([]);
  const [category, setCategory] = useState("");
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [skillSearch, setSkillSearch] = useState("");
  const [location, setLocation] = useState("");
  const [maxHourlyRate, setMaxHourlyRate] = useState<number | null>(null);
  const [minExperience, setMinExperience] = useState(0);
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [openFilter, setOpenFilter] = useState<FilterName | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>("rating");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [retry, setRetry] = useState(0);
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE);
  const header = useRef<HTMLElement>(null);
  const searchInput = useRef<HTMLInputElement>(null);
  const mobileFilters = useRef<HTMLDivElement>(null);
  const [navHeight, setNavHeight] = useState(68);
  const panelId = useId();
  useEffect(() => {
    const element = header.current;
    if (!element) return;
    const measure = () =>
      setNavHeight(Math.ceil(element.getBoundingClientRect().height) || 68);
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    measure();
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError("");
    async function load() {
      try {
        const requestPage = async (page: number, pageSize = 100) => {
          const response = await api.get<AllocatsResponse>(
            "/allocats/profiles",
            {
              params: { page, pageSize },
              signal: controller.signal,
            },
          );
          if (!Array.isArray(response.data?.items))
            throw new Error("Invalid profile response.");
          return response.data;
        };
        const first = await requestPage(1);
        const items = [...first.items];
        const totalPages = Number.isFinite(first.totalPages)
          ? Math.max(1, Math.floor(first.totalPages))
          : 1;
        const pageSize =
          Number.isFinite(first.pageSize) && first.pageSize > 0
            ? first.pageSize
            : 100;
        // Client filters need the complete public directory. Limit concurrency
        // rather than starting every remaining page request at once.
        for (let page = 2; page <= totalPages; page += 4) {
          if (controller.signal.aborted) return;
          const pages = await Promise.all(
            Array.from(
              { length: Math.min(4, totalPages - page + 1) },
              (_, offset) => requestPage(page + offset, pageSize),
            ),
          );
          for (const batch of pages) items.push(...batch.items);
        }
        if (controller.signal.aborted) return;
        const unique = new Map<string, FilterableAllocat>();
        for (const item of items) {
          if (!item.allocatrUserId) continue;
          unique.set(item.allocatrUserId, {
            ...item,
            skills: normalizeSkills(item.skills),
          });
        }
        setAllocats([...unique.values()]);
      } catch {
        if (!controller.signal.aborted) {
          controller.abort();
          setError("The community could not be loaded. Please try again.");
          setLoading(false);
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }
    void load();
    return () => controller.abort();
  }, [retry]);
  const skills = useMemo(() => {
    const unique = new Map<string, SkillSummary>();
    for (const person of allocats)
      for (const skill of person.skills ?? []) {
        if (!unique.has(skill.id)) unique.set(skill.id, skill);
      }
    return [...unique.values()].sort((a, b) => a.name.localeCompare(b.name));
  }, [allocats]);
  const categories = useMemo(() => {
    const unique = new Map<string, string>();
    for (const person of allocats)
      for (const skill of person.skills ?? []) {
        const value = skill.category?.trim();
        if (value && !unique.has(normalize(value)))
          unique.set(normalize(value), value);
      }
    return [...unique.values()].sort((a, b) => a.localeCompare(b));
  }, [allocats]);
  const eligibleSkills = useMemo(
    () =>
      category
        ? skills.filter(
            (skill) => normalize(skill.category) === normalize(category),
          )
        : skills,
    [skills, category],
  );
  const rateCeiling = useMemo(
    () =>
      Math.ceil(
        allocats.reduce(
          (highest, item) => Math.max(highest, finite(item.hourlyRate)),
          100,
        ) / 10,
      ) * 10,
    [allocats],
  );
  const filtered = useMemo(() => {
    const term = normalize(search),
      area = normalize(location),
      selectedCategory = normalize(category);
    return allocats
      .filter((person) => {
        const personSkills = person.skills ?? [];
        const text = normalize(
          [
            person.fullName,
            person.title,
            person.headline,
            person.bio,
            person.location,
            person.city,
            person.country,
            ...personSkills.flatMap((skill) => [skill.name, skill.category]),
          ]
            .filter(Boolean)
            .join(" "),
        );
        const personLocation = normalize(
          [person.location, person.city, person.country]
            .filter(Boolean)
            .join(", "),
        );
        return (
          (!term || text.includes(term)) &&
          (!selectedCategory ||
            personSkills.some(
              (skill) => normalize(skill.category) === selectedCategory,
            )) &&
          selectedSkills.every((id) =>
            personSkills.some((skill) => skill.id === id),
          ) &&
          (!area ||
            (!!personLocation &&
              (personLocation.includes(area) ||
                area.includes(personLocation)))) &&
          (maxHourlyRate === null ||
            person.hourlyRate == null ||
            person.hourlyRate <= maxHourlyRate) &&
          finite(person.yearsExperience) >= minExperience &&
          (!verifiedOnly || isVerified(person))
        );
      })
      .sort((a, b) => {
        let difference = 0;
        if (sortBy === "experience")
          difference = finite(b.yearsExperience) - finite(a.yearsExperience);
        else if (sortBy === "rate-low")
          difference =
            (a.hourlyRate ?? Number.MAX_SAFE_INTEGER) -
            (b.hourlyRate ?? Number.MAX_SAFE_INTEGER);
        else if (sortBy === "recent")
          difference =
            dateValue(b.updatedAt ?? b.createdAt ?? b.joinedAt) -
            dateValue(a.updatedAt ?? a.createdAt ?? a.joinedAt);
        else
          difference =
            finite(b.averageRating ?? b.rating) -
            finite(a.averageRating ?? a.rating);
        return (
          difference ||
          (a.fullName ?? "").localeCompare(b.fullName ?? "") ||
          a.allocatrUserId.localeCompare(b.allocatrUserId)
        );
      });
  }, [
    allocats,
    search,
    category,
    selectedSkills,
    location,
    maxHourlyRate,
    minExperience,
    verifiedOnly,
    sortBy,
  ]);
  useEffect(() => {
    setVisibleCount(INITIAL_VISIBLE);
  }, [
    search,
    category,
    selectedSkills,
    location,
    maxHourlyRate,
    minExperience,
    verifiedOnly,
    sortBy,
  ]);
  const activeCount =
    Number(!!category) +
    Number(selectedSkills.length > 0) +
    Number(!!location.trim()) +
    Number(maxHourlyRate !== null) +
    Number(minExperience > 0) +
    Number(verifiedOnly);
  const hasCriteria = activeCount > 0 || !!search.trim();
  const shown = filtered.slice(0, visibleCount);
  const closeMobileFilter = useCallback(() => {
    setOpenFilter(null);
    mobileFilters.current
      ?.querySelector<HTMLButtonElement>(`[data-filter="${openFilter}"]`)
      ?.focus();
  }, [openFilter]);
  useEffect(() => {
    if (!openFilter) return;
    const dismiss = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeMobileFilter();
    };
    document.addEventListener("keydown", dismiss);
    return () => document.removeEventListener("keydown", dismiss);
  }, [openFilter, closeMobileFilter]);
  function setSearch(value: string) {
    setParams(
      (current) => {
        const next = new URLSearchParams(current);
        if (value) next.set("search", value);
        else next.delete("search");
        return next;
      },
      { replace: true },
    );
  }
  function clearSearch() {
    setSearch("");
    searchInput.current?.focus();
  }
  function selectCategory(value: string) {
    setCategory(value);
    setSelectedSkills([]);
    setSkillSearch("");
  }
  function toggleSkill(id: string) {
    setSelectedSkills((current) =>
      current.includes(id)
        ? current.filter((value) => value !== id)
        : [...current, id],
    );
  }
  function resetFilters() {
    setCategory("");
    setSelectedSkills([]);
    setSkillSearch("");
    setLocation("");
    setMaxHourlyRate(null);
    setMinExperience(0);
    setVerifiedOnly(false);
    setOpenFilter(null);
  }
  function resetAll() {
    resetFilters();
    setSearch("");
  }
  function filterValue(name: FilterName) {
    if (name === "category") return category;
    if (name === "skills")
      return selectedSkills.length ? `${selectedSkills.length} selected` : "";
    if (name === "location") return location.trim();
    if (name === "rate")
      return maxHourlyRate === null ? "" : `US$${maxHourlyRate}/hr`;
    return minExperience ? `${minExperience}+ years` : "";
  }
  function controls(name: FilterName) {
    switch (name) {
      case "category":
        return (
          <CategoryPicker
            categories={categories}
            value={category}
            onChange={selectCategory}
          />
        );
      case "skills":
        return (
          <SkillPicker
            skills={eligibleSkills}
            selected={selectedSkills}
            query={skillSearch}
            onQuery={setSkillSearch}
            onToggle={toggleSkill}
            category={category}
          />
        );
      case "location":
        return (
          <div className="relative">
            <MapPinIcon
              size={14}
              aria-hidden="true"
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <input
              aria-label="City or area"
              value={location}
              onChange={(event) => setLocation(event.target.value)}
              placeholder="City or area"
              className={`${FIELD} pl-9`}
            />
          </div>
        );
      case "rate":
        return (
          <RateFilter
            value={maxHourlyRate}
            ceiling={rateCeiling}
            onChange={setMaxHourlyRate}
          />
        );
      case "experience":
        return (
          <ExperienceFilter value={minExperience} onChange={setMinExperience} />
        );
    }
  }
  return (
    <div
      className="min-h-screen bg-background text-foreground"
      style={{ "--discover-nav-height": `${navHeight}px` } as CSSProperties}
    >
      <header
        ref={header}
        className="sticky top-0 z-40 border-b border-border/70 bg-background"
      >
        <div className={CONTAINER}>
          <MinimalNavMenu />
        </div>
      </header>
      <main className={`${CONTAINER} py-8 sm:py-10 lg:py-12`}>
        <section aria-labelledby="discover-title" className="mb-8 sm:mb-10">
          <p
            className={`mb-4 inline-flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.14em] ${ACCENT}`}
          >
            <UsersIcon size={14} strokeWidth={1.7} aria-hidden="true" />
            The Allocat community
          </p>
          <h1
            id="discover-title"
            className="max-w-3xl text-balance text-[clamp(2rem,3.5vw,2.8rem)] font-medium leading-[1.12] tracking-[-0.04em]"
          >
            Find the right people for what comes next.
          </h1>
          <p className="mt-4 max-w-2xl text-pretty text-sm leading-7 text-muted-foreground">
            Explore skilled Allocats across trades, professions and specialist
            skills. Find the people your next project needs.
          </p>
          <div
            role="search"
            aria-label="Search the Allocat community"
            className="relative mt-6 max-w-[720px]"
          >
            <SearchIcon
              size={17}
              strokeWidth={1.7}
              aria-hidden="true"
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <input
              ref={searchInput}
              type="search"
              aria-label="Search Allocats"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by name, skill or profession"
              className={`${FIELD} h-12 rounded-xl bg-card pl-11 pr-12 text-base lg:text-sm [&::-webkit-search-cancel-button]:appearance-none`}
            />
            {search && (
              <button
                type="button"
                aria-label="Clear search"
                onClick={clearSearch}
                className={`absolute right-1 top-1 flex h-10 w-10 items-center justify-center rounded-lg text-muted-foreground hover:text-foreground ${FOCUS}`}
              >
                <XIcon size={15} aria-hidden="true" />
              </button>
            )}
          </div>
        </section>

        {error ? (
          <StatePanel
            kind="error"
            message={error}
            onAction={() => setRetry((value) => value + 1)}
          />
        ) : loading ? (
          <LoadingState />
        ) : (
          <div className="border-t border-border/70 lg:grid lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-7 xl:grid-cols-[252px_minmax(0,1fr)] xl:gap-9">
            <aside
              aria-label="Refine Allocats"
              className="hidden border-r border-border/65 pr-6 lg:block"
            >
              <div className="sticky top-[calc(var(--discover-nav-height)+16px)] max-h-[calc(100dvh-var(--discover-nav-height)-32px)] overflow-y-auto py-6 pr-1 [scrollbar-width:thin]">
                <div className="flex items-center justify-between gap-3">
                  <h2 className="inline-flex items-center gap-2 text-sm font-medium">
                    <SlidersHorizontalIcon size={15} aria-hidden="true" />
                    Refine
                    {activeCount > 0 && (
                      <span className={`text-[11px] tabular-nums ${ACCENT}`}>
                        {activeCount}
                      </span>
                    )}
                  </h2>
                  {activeCount > 0 && (
                    <button
                      type="button"
                      onClick={resetFilters}
                      className={`min-h-9 rounded px-1 text-[11px] text-muted-foreground hover:text-foreground ${FOCUS}`}
                    >
                      Reset filters
                    </button>
                  )}
                </div>
                <p className="mt-2 text-[11px] leading-5 text-muted-foreground">
                  Focus on the expertise your work needs.
                </p>
                <div className="mt-3 divide-y divide-border/65">
                  {FILTERS.map(({ value, label }) => (
                    <section key={value} aria-label={label} className="py-5">
                      <h3 className="mb-3 text-xs font-medium">{label}</h3>
                      {controls(value)}
                    </section>
                  ))}
                  <section aria-label="Verification" className="py-5">
                    <VerifiedControl
                      value={verifiedOnly}
                      onChange={setVerifiedOnly}
                    />
                  </section>
                </div>
              </div>
            </aside>

            <div className="min-w-0">
              <section
                aria-label="Refine results"
                className="border-b border-border/65 py-4 lg:hidden"
              >
                <div className="mb-3 flex items-center justify-between gap-3">
                  <p className="inline-flex items-center gap-2 text-xs font-medium">
                    <SlidersHorizontalIcon size={14} aria-hidden="true" />
                    Refine
                    {activeCount > 0 && (
                      <span className={ACCENT}>{activeCount}</span>
                    )}
                  </p>
                  {activeCount > 0 && (
                    <button
                      type="button"
                      onClick={resetFilters}
                      className={`min-h-9 rounded px-1 text-[11px] text-muted-foreground ${FOCUS}`}
                    >
                      Reset filters
                    </button>
                  )}
                </div>
                <div ref={mobileFilters} className="flex flex-wrap gap-2">
                  {FILTERS.map(({ value, label, icon: Icon }) => {
                    const active = !!filterValue(value),
                      expanded = openFilter === value;
                    return (
                      <button
                        key={value}
                        data-filter={value}
                        type="button"
                        aria-expanded={expanded}
                        aria-controls={expanded ? panelId : undefined}
                        onClick={() =>
                          setOpenFilter((current) =>
                            current === value ? null : value,
                          )
                        }
                        title={filterValue(value) || label}
                        className={`${ACTION} max-w-full gap-1.5 px-2.5 ${active || expanded ? SELECTED : UNSELECTED}`}
                      >
                        <Icon size={13} aria-hidden="true" />
                        <span className="max-w-32 truncate">{label}</span>
                        {active && (
                          <span
                            aria-hidden="true"
                            className="h-1 w-1 rounded-full bg-current"
                          />
                        )}
                        <ChevronDownIcon
                          size={11}
                          aria-hidden="true"
                          className={expanded ? "rotate-180" : ""}
                        />
                      </button>
                    );
                  })}
                  <button
                    type="button"
                    aria-pressed={verifiedOnly}
                    onClick={() => setVerifiedOnly((value) => !value)}
                    className={`${ACTION} gap-1.5 px-2.5 ${verifiedOnly ? SELECTED : UNSELECTED}`}
                  >
                    <BadgeCheckIcon size={13} aria-hidden="true" />
                    Verified
                  </button>
                </div>
                {openFilter && (
                  <div
                    id={panelId}
                    role="region"
                    aria-label={`${FILTERS.find((item) => item.value === openFilter)?.label} filter`}
                    className="mt-3 rounded-xl border border-border/75 bg-card p-4"
                  >
                    <div className="mb-4 flex items-center justify-between gap-3">
                      <h3 className="text-xs font-medium">
                        {
                          FILTERS.find((item) => item.value === openFilter)
                            ?.label
                        }
                      </h3>
                      <button
                        type="button"
                        onClick={closeMobileFilter}
                        className={`inline-flex min-h-9 items-center gap-1.5 rounded-md px-2 text-[11px] text-muted-foreground ${FOCUS}`}
                      >
                        Done
                        <CheckIcon size={12} aria-hidden="true" />
                      </button>
                    </div>
                    {controls(openFilter)}
                  </div>
                )}
              </section>

              <section
                aria-label="Results controls"
                className="flex flex-wrap items-center justify-between gap-x-4 gap-y-3 py-5 lg:py-6"
              >
                <div className="min-w-0 flex-1">
                  <h2 className="text-base font-medium tracking-[-0.025em] sm:text-lg">
                    {filtered.length.toLocaleString()}{" "}
                    {filtered.length === 1 ? "Allocat" : "Allocats"}
                  </h2>
                  <p
                    role="status"
                    aria-live="polite"
                    aria-atomic="true"
                    className="mt-1 text-[11px] leading-5 text-muted-foreground"
                  >
                    <span className="sr-only">
                      {filtered.length}{" "}
                      {filtered.length === 1 ? "profile" : "profiles"}.{" "}
                    </span>
                    {hasCriteria
                      ? "Matching your search and filters"
                      : "Explore the community"}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <SortPicker value={sortBy} onChange={setSortBy} />
                  <ViewToggle value={viewMode} onChange={setViewMode} />
                </div>
              </section>

              {hasCriteria && (
                <div
                  role="group"
                  aria-label="Active filters"
                  className="mb-5 flex flex-wrap items-center gap-2"
                >
                  {!!search.trim() && (
                    <ActiveChip
                      label={`Search: ${search.trim()}`}
                      onRemove={clearSearch}
                    />
                  )}
                  {!!category && (
                    <ActiveChip
                      label={category}
                      onRemove={() => selectCategory("")}
                    />
                  )}
                  {selectedSkills.map((id) => (
                    <ActiveChip
                      key={id}
                      label={
                        skills.find((skill) => skill.id === id)?.name ??
                        "Selected skill"
                      }
                      onRemove={() => toggleSkill(id)}
                    />
                  ))}
                  {!!location.trim() && (
                    <ActiveChip
                      label={location.trim()}
                      onRemove={() => setLocation("")}
                    />
                  )}
                  {maxHourlyRate !== null && (
                    <ActiveChip
                      label={`Up to US$${maxHourlyRate}/hr`}
                      onRemove={() => setMaxHourlyRate(null)}
                    />
                  )}
                  {minExperience > 0 && (
                    <ActiveChip
                      label={`${minExperience}+ ${minExperience === 1 ? "year" : "years"}`}
                      onRemove={() => setMinExperience(0)}
                    />
                  )}
                  {verifiedOnly && (
                    <ActiveChip
                      label="Verified"
                      onRemove={() => setVerifiedOnly(false)}
                    />
                  )}
                  <button
                    type="button"
                    onClick={resetAll}
                    className={`min-h-9 rounded-md px-2 text-[11px] text-muted-foreground hover:text-foreground ${FOCUS}`}
                  >
                    Clear all
                  </button>
                </div>
              )}

              <section aria-label="Allocat results" className="pb-10">
                {filtered.length ? (
                  <>
                    <div
                      className={
                        viewMode === "grid"
                          ? "grid items-stretch gap-4 sm:grid-cols-2 xl:grid-cols-3"
                          : "grid grid-cols-1 gap-3"
                      }
                    >
                      {shown.map((person) => (
                        <div
                          key={person.allocatrUserId}
                          className={`min-w-0 ${viewMode === "grid" ? "h-full [&>article]:h-full" : ""}`}
                        >
                          <AllocatCardGrid
                            allocat={person}
                            viewMode={viewMode}
                            mode="discovery"
                            onStartProject={() =>
                              navigate(
                                `/projects/new?allocat=${encodeURIComponent(person.allocatrUserId)}`,
                              )
                            }
                          />
                        </div>
                      ))}
                    </div>
                    {filtered.length > INITIAL_VISIBLE && (
                      <div className="mt-8 flex flex-col items-center gap-3 border-t border-border/65 pt-6">
                        <p className="text-[11px] text-muted-foreground">
                          Showing {shown.length.toLocaleString()} of{" "}
                          {filtered.length.toLocaleString()} Allocats
                        </p>
                        {shown.length < filtered.length && (
                          <button
                            type="button"
                            onClick={() =>
                              setVisibleCount(
                                (count) => count + INITIAL_VISIBLE,
                              )
                            }
                            className={`${QUIET} px-5`}
                          >
                            Show more Allocats
                            <ChevronDownIcon size={13} aria-hidden="true" />
                          </button>
                        )}
                      </div>
                    )}
                  </>
                ) : (
                  <StatePanel
                    kind={allocats.length ? "empty" : "community"}
                    onAction={resetAll}
                  />
                )}
              </section>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
function CategoryPicker({
  categories,
  value,
  onChange,
}: {
  categories: string[];
  value: string;
  onChange: (value: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const input = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (!open) {
      setQuery("");
      return;
    }
    const frame = requestAnimationFrame(() => input.current?.focus());
    return () => cancelAnimationFrame(frame);
  }, [open]);
  const matches = categories.filter((item) =>
    normalize(item).includes(normalize(query)),
  );
  return (
    <DropdownMenu modal={false} open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label={`Category: ${value || "All categories"}`}
          className={`${QUIET} w-full justify-between px-3`}
        >
          <span className="min-w-0 truncate">{value || "All categories"}</span>
          <ChevronDownIcon
            size={12}
            aria-hidden="true"
            className="shrink-0 text-muted-foreground"
          />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        sideOffset={6}
        collisionPadding={16}
        className={`${MENU} w-[var(--radix-dropdown-menu-trigger-width)] min-w-56 max-w-[calc(100vw-32px)]`}
      >
        <div className="relative m-1 mb-2">
          <SearchIcon
            size={13}
            aria-hidden="true"
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <input
            ref={input}
            aria-label="Search categories"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search categories"
            className={`${FIELD} pl-8`}
            onKeyDown={(event) =>
              searchMenuKeys(event, '[role="menuitemradio"]')
            }
          />
        </div>
        <div className="max-h-60 overflow-y-auto overscroll-contain">
          <DropdownMenuItem
            role="menuitemradio"
            aria-checked={!value}
            className={MENU_ITEM}
            onSelect={() => onChange("")}
          >
            <span className="flex-1">All categories</span>
            {!value && (
              <CheckIcon size={13} aria-hidden="true" className={ACCENT} />
            )}
          </DropdownMenuItem>
          <DropdownMenuSeparator className="bg-border/65" />
          {matches.map((item) => (
            <DropdownMenuItem
              key={item}
              role="menuitemradio"
              aria-checked={value === item}
              className={`${MENU_ITEM} ${value === item ? "bg-surface-2" : ""}`}
              onSelect={() => onChange(item)}
            >
              <span className="min-w-0 flex-1 break-words">{item}</span>
              {value === item && (
                <CheckIcon size={13} aria-hidden="true" className={ACCENT} />
              )}
            </DropdownMenuItem>
          ))}
          {!matches.length && (
            <p className="px-3 py-5 text-center text-xs leading-6 text-muted-foreground">
              {query
                ? "No matching categories."
                : "No categories are listed yet."}
            </p>
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
function SkillPicker({
  skills,
  selected,
  query,
  onQuery,
  onToggle,
  category,
}: {
  skills: SkillSummary[];
  selected: string[];
  query: string;
  onQuery: (value: string) => void;
  onToggle: (id: string) => void;
  category: string;
}) {
  const input = useRef<HTMLInputElement>(null);
  const results = useMemo(() => {
    const term = normalize(query);
    if (!term && !category) return [];
    return skills
      .filter((skill) => !selected.includes(skill.id))
      .map((skill) => {
        const name = normalize(skill.name),
          group = normalize(skill.category);
        const score = !term
          ? 1
          : name === term
            ? 5
            : name.startsWith(term)
              ? 4
              : name.includes(term)
                ? 3
                : group === term
                  ? 2
                  : group.includes(term)
                    ? 1
                    : 0;
        return { skill, score };
      })
      .filter((item) => item.score > 0)
      .sort(
        (a, b) => b.score - a.score || a.skill.name.localeCompare(b.skill.name),
      );
  }, [skills, selected, query, category]);
  return (
    <div>
      <div className="relative">
        <SearchIcon
          size={13}
          aria-hidden="true"
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
        />
        <input
          ref={input}
          aria-label="Search skills"
          value={query}
          onChange={(event) => onQuery(event.target.value)}
          placeholder="Search skills"
          className={`${FIELD} pl-9 pr-10`}
        />
        {query && (
          <button
            type="button"
            aria-label="Clear skill search"
            onClick={() => {
              onQuery("");
              input.current?.focus();
            }}
            className={`absolute right-1 top-1 flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground ${FOCUS}`}
          >
            <XIcon size={12} aria-hidden="true" />
          </button>
        )}
      </div>
      {!!selected.length && (
        <div className="mt-3">
          <p className={`text-[11px] leading-5 ${ACCENT}`}>
            {selected.length} selected · all selected skills must match
          </p>
          <div className="mt-2 flex max-h-32 flex-wrap gap-1.5 overflow-y-auto">
            {selected.map((id) => (
              <ActiveChip
                key={id}
                label={
                  skills.find((skill) => skill.id === id)?.name ??
                  "Selected skill"
                }
                onRemove={() => onToggle(id)}
              />
            ))}
          </div>
        </div>
      )}
      {query.trim() || category ? (
        <div className="mt-2 max-h-56 overflow-y-auto overscroll-contain rounded-lg border border-border/65 bg-card p-1">
          {results.map(({ skill }) => (
            <button
              type="button"
              key={skill.id}
              onClick={() => onToggle(skill.id)}
              className={`flex min-h-11 w-full items-center gap-2 rounded-md px-2.5 py-2 text-left hover:bg-surface-2 ${FOCUS}`}
            >
              <span className="min-w-0 flex-1">
                <span className="block break-words text-xs font-medium">
                  {skill.name}
                </span>
                {!category && skill.category && (
                  <span className="mt-0.5 block text-[10px] leading-4 text-muted-foreground">
                    {skill.category}
                  </span>
                )}
              </span>
              <PlusIcon
                size={13}
                aria-hidden="true"
                className={`shrink-0 ${ACCENT}`}
              />
            </button>
          ))}
          {!results.length && (
            <p className="px-2 py-4 text-[11px] leading-5 text-muted-foreground">
              {query.trim()
                ? "No matching skills to add."
                : "No more skills to add in this category."}
            </p>
          )}
        </div>
      ) : (
        <p className="mt-2 text-[11px] leading-5 text-muted-foreground">
          Search to add a skill, or choose a category.
        </p>
      )}
    </div>
  );
}
function RateFilter({
  value,
  ceiling,
  onChange,
}: {
  value: number | null;
  ceiling: number;
  onChange: (value: number | null) => void;
}) {
  const accent = "var(--discover-range)";
  const position = ((value ?? ceiling) / ceiling) * 100;
  return (
    <div>
      <div className="mb-4 flex items-center justify-between gap-2">
        <span className="text-[11px] text-muted-foreground">Maximum</span>
        <span className="text-xs font-medium tabular-nums">
          {value === null ? "Any rate" : `US$${value}/hr`}
        </span>
      </div>
      <input
        type="range"
        aria-label="Maximum hourly rate in US dollars"
        aria-valuetext={
          value === null ? "Any rate" : `${value} US dollars per hour`
        }
        min={0}
        max={ceiling}
        step={1}
        value={value ?? ceiling}
        onChange={(event) => {
          const next = Number(event.target.value);
          onChange(next >= ceiling ? null : next);
        }}
        style={{
          background: `linear-gradient(to right, ${accent} 0%, ${accent} ${position}%, var(--surface-3) ${position}%, var(--surface-3) 100%)`,
        }}
        className={`[--discover-range:var(--brand-secondary-highlight)] dark:[--discover-range:var(--secondary)] dark:[&::-webkit-slider-thumb]:border-secondary dark:[&::-moz-range-thumb]:border-secondary my-3 h-1.5 w-full cursor-pointer appearance-none rounded-full [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-brand-secondary-highlight [&::-webkit-slider-thumb]:bg-card [&::-moz-range-thumb]:h-3 [&::-moz-range-thumb]:w-3 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-brand-secondary-highlight [&::-moz-range-thumb]:bg-card ${FOCUS}`}
      />
      <div className="mt-2 flex items-center justify-between gap-3 text-[10px] text-muted-foreground">
        <span>US$0</span>
        {value !== null ? (
          <button
            type="button"
            onClick={() => onChange(null)}
            className={`min-h-8 rounded px-1 text-[11px] ${FOCUS}`}
          >
            Any rate
          </button>
        ) : (
          <span>US${ceiling}+</span>
        )}
      </div>
      <p className="mt-1 text-[10px] leading-5 text-muted-foreground">
        Profiles with rates on request are included.
      </p>
    </div>
  );
}
function ExperienceFilter({
  value,
  onChange,
}: {
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <div className="grid grid-cols-5 gap-1.5">
      {EXPERIENCE.map((years) => (
        <button
          key={years}
          type="button"
          aria-label={
            years
              ? `${years}+ ${years === 1 ? "year" : "years"} experience`
              : "Any experience"
          }
          aria-pressed={years === value}
          onClick={() => onChange(years)}
          className={`flex min-h-12 min-w-0 flex-col items-center justify-center rounded-lg border px-1 text-xs font-medium transition-colors duration-150 motion-reduce:transition-none ${FOCUS} ${years === value ? SELECTED : UNSELECTED}`}
        >
          <span>{years ? `${years}+` : "Any"}</span>
          {years > 0 && (
            <span className="mt-0.5 text-[9px] font-normal">
              {years === 1 ? "year" : "years"}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}
function VerifiedControl({
  value,
  onChange,
}: {
  value: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={value}
      aria-label="Verified profiles only"
      onClick={() => onChange(!value)}
      className={`flex min-h-14 w-full items-center gap-2.5 rounded-lg border px-3 py-3 text-left transition-colors duration-150 motion-reduce:transition-none ${value ? SELECTED : UNSELECTED} ${FOCUS}`}
    >
      <BadgeCheckIcon size={17} aria-hidden="true" className="shrink-0" />
      <span className="min-w-0 flex-1 text-xs font-medium">Verified only</span>
      <span
        aria-hidden="true"
        className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full ${value ? "bg-brand-secondary-highlight dark:bg-secondary" : "bg-border"}`}
      >
        <span
          className={`h-4 w-4 rounded-full bg-card transition-transform duration-150 motion-reduce:transition-none ${value ? "translate-x-[18px]" : "translate-x-0.5"}`}
        />
      </span>
    </button>
  );
}
function ActiveChip({
  label,
  onRemove,
}: {
  label: string;
  onRemove: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={`Remove filter: ${label}`}
      title={label}
      onClick={onRemove}
      className={`inline-flex min-h-9 max-w-full items-center gap-2 rounded-lg border border-border/70 bg-surface-2/55 px-2.5 py-1.5 text-[11px] text-foreground hover:opacity-75 ${FOCUS}`}
    >
      <span className="max-w-52 truncate">{label}</span>
      <XIcon
        size={11}
        aria-hidden="true"
        className="shrink-0 text-muted-foreground"
      />
    </button>
  );
}
function SortPicker({
  value,
  onChange,
}: {
  value: SortOption;
  onChange: (value: SortOption) => void;
}) {
  const selected =
    SORT_OPTIONS.find((option) => option.value === value) ?? SORT_OPTIONS[0];
  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label={`Sort results: ${selected.label}`}
          className={`${QUIET} min-h-10 max-w-[180px] gap-1.5 px-2.5 sm:max-w-none sm:px-3`}
        >
          <ArrowDownWideNarrowIcon
            size={14}
            aria-hidden="true"
            className="shrink-0 text-muted-foreground"
          />
          <span className="truncate text-[11px]">{selected.label}</span>
          <ChevronDownIcon
            size={11}
            aria-hidden="true"
            className="shrink-0 text-muted-foreground"
          />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        sideOffset={6}
        collisionPadding={16}
        className={`${MENU} w-64 max-w-[calc(100vw-32px)]`}
      >
        <DropdownMenuLabel className="px-3 py-2 text-[10px] font-medium uppercase tracking-[0.1em] text-muted-foreground">
          Sort Allocats
        </DropdownMenuLabel>
        {SORT_OPTIONS.map((option) => (
          <DropdownMenuItem
            key={option.value}
            role="menuitemradio"
            aria-checked={value === option.value}
            className={`${MENU_ITEM} ${value === option.value ? "bg-surface-2" : ""}`}
            onSelect={() => onChange(option.value)}
          >
            <span className="min-w-0 flex-1">
              <span className="block font-medium">{option.label}</span>
              <span className="mt-1 block text-[10px] leading-4 text-muted-foreground">
                {option.description}
              </span>
            </span>
            {value === option.value && (
              <CheckIcon size={13} aria-hidden="true" className={ACCENT} />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
function ViewToggle({
  value,
  onChange,
}: {
  value: ViewMode;
  onChange: (value: ViewMode) => void;
}) {
  return (
    <div
      role="group"
      aria-label="Results view"
      className="flex shrink-0 items-center gap-0.5 rounded-lg border border-border/65 bg-surface-2/65 p-0.5"
    >
      {(
        [
          { mode: "grid", label: "Grid view", icon: Grid2X2Icon },
          { mode: "list", label: "List view", icon: ListIcon },
        ] as const
      ).map(({ mode, label, icon: Icon }) => (
        <button
          key={mode}
          type="button"
          aria-label={label}
          title={label}
          aria-pressed={value === mode}
          onClick={() => onChange(mode)}
          className={`flex h-9 w-9 items-center justify-center rounded-md transition-colors duration-150 motion-reduce:transition-none ${FOCUS} ${value === mode ? `bg-card ${ACCENT} shadow-sm` : "text-muted-foreground hover:text-foreground"}`}
        >
          <Icon size={14} aria-hidden="true" />
        </button>
      ))}
    </div>
  );
}
function LoadingState() {
  return (
    <div
      role="status"
      aria-live="polite"
      className="border-t border-border/70 lg:grid lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-7 xl:grid-cols-[252px_minmax(0,1fr)] xl:gap-9"
    >
      <div
        aria-hidden="true"
        className="hidden border-r border-border/65 py-6 pr-6 lg:block"
      >
        <span className="block h-3 w-20 rounded bg-surface-3/70" />
        {Array.from({ length: 5 }, (_, index) => (
          <div key={index} className="mt-8">
            <span className="mb-3 block h-2 w-16 rounded bg-surface-3/60" />
            <span className="block h-11 rounded-lg border border-border/50 bg-surface-2" />
          </div>
        ))}
      </div>
      <div className="min-w-0 py-6">
        <p className="mb-6 inline-flex min-h-11 items-center gap-2 text-xs text-muted-foreground">
          <CatIcon size={16} aria-hidden="true" />
          Exploring the Allocat community…
        </p>
        <div
          aria-hidden="true"
          className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3"
        >
          {Array.from({ length: 6 }, (_, index) => (
            <div
              key={index}
              className="rounded-xl border border-border/65 bg-card p-5"
            >
              <div className="flex items-center gap-3">
                <span className="h-12 w-12 shrink-0 rounded-full bg-surface-3/70" />
                <span className="flex-1 space-y-2">
                  <span className="block h-3 w-3/4 rounded bg-surface-3/70" />
                  <span className="block h-2 w-1/2 rounded bg-surface-3/50" />
                </span>
              </div>
              <div className="mt-6 space-y-3">
                <span className="block h-2 w-3/4 rounded bg-surface-3/60" />
                <span className="block h-2 w-1/2 rounded bg-surface-3/50" />
              </div>
              <div className="mb-4 mt-6 h-16 rounded-lg bg-surface-2" />
              <div className="h-9 rounded-lg bg-surface-3/60" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
function StatePanel({
  kind,
  message,
  onAction,
}: {
  kind: "error" | "empty" | "community";
  message?: string;
  onAction: () => void;
}) {
  const Icon =
    kind === "error"
      ? RefreshCwIcon
      : kind === "community"
        ? UsersIcon
        : SearchIcon;
  return (
    <div
      role={kind === "error" ? "alert" : undefined}
      className="flex min-h-[320px] flex-col items-center justify-center rounded-xl border border-border/70 bg-card px-6 py-12 text-center"
    >
      <span
        className={`flex h-12 w-12 items-center justify-center rounded-xl bg-surface-2 ${ACCENT}`}
      >
        <Icon size={21} strokeWidth={1.7} aria-hidden="true" />
      </span>
      <h2 className="mt-5 text-lg font-medium tracking-[-0.025em]">
        {kind === "error"
          ? "The community is unavailable"
          : kind === "community"
            ? "The community is taking shape"
            : "No Allocats match yet"}
      </h2>
      <p className="mt-2 max-w-sm text-xs leading-6 text-muted-foreground">
        {message ||
          (kind === "community"
            ? "Profiles will appear here as Allocats join the community."
            : "Try a different search or remove a filter to explore more profiles.")}
      </p>
      {kind !== "community" && (
        <button
          type="button"
          onClick={onAction}
          className={`${kind === "error" ? PRIMARY : QUIET} mt-5 px-5`}
        >
          {kind === "error" && <RefreshCwIcon size={13} aria-hidden="true" />}
          {kind === "error" ? "Try again" : "Clear search and filters"}
        </button>
      )}
    </div>
  );
}
function normalize(value?: string | null) {
  return (value ?? "").trim().replace(/\s+/g, " ").toLowerCase();
}
function finite(value?: number | null) {
  return typeof value === "number" && Number.isFinite(value)
    ? Math.max(0, value)
    : 0;
}
function isVerified(person: FilterableAllocat) {
  return Boolean(person.isVerified ?? person.verified ?? false);
}
function dateValue(value?: string) {
  const result = value ? Date.parse(value) : 0;
  return Number.isFinite(result) ? result : 0;
}
function normalizeSkills(input?: (SkillSummary | string)[]): SkillSummary[] {
  const skills = new Map<string, SkillSummary>();
  for (const item of Array.isArray(input) ? input : []) {
    const name = (typeof item === "string" ? item : item?.name)?.trim();
    if (!name) continue;
    // String-only skills have no catalogue ID. This key is local to discovery;
    // it is never sent to the API as a canonical skill ID.
    const skill =
      typeof item === "string"
        ? { id: `name:${normalize(name)}`, name }
        : { ...item, id: item.id || `name:${normalize(name)}`, name };
    if (!skills.has(skill.id)) skills.set(skill.id, skill);
  }
  return [...skills.values()];
}
function searchMenuKeys(
  event: import("react").KeyboardEvent<HTMLInputElement>,
  selector: string,
) {
  if (event.key === "Escape") return;
  if (event.key === "ArrowDown") {
    event.preventDefault();
    event.currentTarget
      .closest('[role="menu"]')
      ?.querySelector<HTMLElement>(selector)
      ?.focus();
  }
  event.stopPropagation();
}
