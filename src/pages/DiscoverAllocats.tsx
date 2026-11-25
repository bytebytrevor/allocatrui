import {
  type ReactNode,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  BadgeCheckIcon,
  CheckIcon,
  ChevronDownIcon,
  CircleDollarSignIcon,
  Clock3Icon,
  Layers3Icon,
  MapPinIcon,
  SearchIcon,
  SlidersHorizontalIcon,
  TagsIcon,
  UsersIcon,
  XIcon,
} from "lucide-react";
import { createAllocatSearch } from "@/search/allocatSearch";
import {
  useAllocatDirectory,
  useAllocatDirectoryFilters,
} from "@/search/useAllocatDirectory";
import { AllocatCardGrid } from "@/components/AllocatCard";
import MinimalNavMenu from "@/components/MinimalNavMenu";
import AllocatLoadingState from "@/components/AllocatLoadingState";
import ViewModeToggle, {
  type ResultsViewMode,
} from "@/components/ViewModeToggle";
import SortDropdown, {
  type SortDropdownOption,
} from "@/components/SortDropdown";
import {
  inputSurface,
  primaryActionButton,
  secondaryActionButton,
  unselectedFilterSurface,
  rateSliderClass,
} from "@/components/allocat-results-theme";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const FOCUS =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/35 focus-visible:ring-offset-2 focus-visible:ring-offset-background";
const discoverIconSurface =
  "bg-brand-secondary-highlight/[0.07] text-brand-secondary-highlight dark:bg-secondary/[0.08] dark:text-secondary";
const filterIconSurface =
  "bg-surface-2 text-muted-foreground dark:bg-surface-2 dark:text-secondary";
const selectedFilterSurface =
  "border-brand-secondary-highlight/25 bg-brand-secondary-highlight/[0.07] text-brand-secondary-highlight dark:border-secondary/25 dark:bg-secondary/[0.08] dark:text-secondary";

type SortOption = "relevance" | "rating" | "experience" | "rate-low" | "recent";
type OpenFilter =
  | "category"
  | "skills"
  | "location"
  | "rate"
  | "experience"
  | null;
type SkillSummary = {
  id: string;
  name: string;
  categoryId?: string;
  category?: string;
};
type SkillSearchResult = { skill: SkillSummary; score: number };
const DEFAULT_SEARCH = "";
const DEFAULT_CATEGORY = "";
const DEFAULT_LOCATION = "";
const DEFAULT_MIN_EXPERIENCE = 0;
const experienceOptions = [
  { label: "Any", shortLabel: "Any", suffix: "", value: 0 },
  { label: "1+ year", shortLabel: "1+", suffix: "yr", value: 1 },
  { label: "3+ years", shortLabel: "3+", suffix: "yrs", value: 3 },
  { label: "5+ years", shortLabel: "5+", suffix: "yrs", value: 5 },
  { label: "10+ years", shortLabel: "10+", suffix: "yrs", value: 10 },
];
const sortOptions: SortDropdownOption<SortOption>[] = [
  {
    value: "relevance",
    label: "Most relevant",
    description: "Strongest profession and skill matches first",
  },
  {
    value: "rating",
    label: "Highest rated",
    description: "Top rated professionals",
  },
  {
    value: "experience",
    label: "Most experienced",
    description: "Most years first",
  },
  {
    value: "rate-low",
    label: "Lowest rate",
    description: "Lowest hourly rate first",
  },
  {
    value: "recent",
    label: "Recently active",
    description: "Newest activity first",
  },
];

export default function Discover() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const search = searchParams.get("search") ?? DEFAULT_SEARCH;
  const [category, setCategory] = useState(DEFAULT_CATEGORY);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [skillSearch, setSkillSearch] = useState("");
  const [location, setLocation] = useState(DEFAULT_LOCATION);
  const [maxHourlyRate, setMaxHourlyRate] = useState<number | null>(null);
  const [minExperience, setMinExperience] = useState(DEFAULT_MIN_EXPERIENCE);
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [openFilter, setOpenFilter] = useState<OpenFilter>(null);
  const [sortBy, setSortBy] = useState<SortOption>(() =>
    search.trim() ? "relevance" : "rating",
  );
  const hadSearch = useRef(Boolean(search.trim()));
  const filterPanelId = useId();
  const mobileFiltersRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!openFilter) return;
    const dismiss = (event: KeyboardEvent) => {
      if (
        event.key !== "Escape" ||
        event.defaultPrevented ||
        document.querySelector('[role="menu"][data-state="open"]')
      )
        return;
      setOpenFilter(null);
      mobileFiltersRef.current
        ?.querySelector<HTMLButtonElement>(`[aria-controls="${filterPanelId}"]`)
        ?.focus();
    };
    document.addEventListener("keydown", dismiss);
    return () => document.removeEventListener("keydown", dismiss);
  }, [openFilter, filterPanelId]);
  const [viewMode, setViewMode] = useState<ResultsViewMode>("grid");
  const directory = useAllocatDirectory({
    search,
    category,
    skillIds: selectedSkills,
    location,
    maxHourlyRate,
    minExperience,
    verifiedOnly,
    sortBy,
  });
  const filterOptions = useAllocatDirectoryFilters();
  const filteredAllocats = directory.items;
  const loading = directory.loading;
  const error = directory.error;
  const skills = filterOptions.skills;
  const categories = useMemo(() => {
    const names = new Map<string, string>();
    for (const skill of skills) {
      const name = skill.category?.trim();
      if (name) names.set(name.toLowerCase(), name);
    }
    return [...names.values()].sort((a, b) => a.localeCompare(b));
  }, [skills]);
  const visibleSkills = useMemo(() => {
    if (!category) return [];
    const normalizedCategory = category.trim().toLowerCase();
    return skills.filter(
      (skill) =>
        String(skill.category ?? "")
          .trim()
          .toLowerCase() === normalizedCategory,
    );
  }, [skills, category]);
  const rateCeiling = filterOptions.rateCeiling;
  useEffect(() => {
    const hasSearch = Boolean(search.trim());
    if (hasSearch && !hadSearch.current) setSortBy("relevance");
    else if (!hasSearch && hadSearch.current) {
      setSortBy((current) => (current === "relevance" ? "rating" : current));
    }
    hadSearch.current = hasSearch;
  }, [search]);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (category !== DEFAULT_CATEGORY) count += 1;
    if (selectedSkills.length > 0) count += 1;
    if (location !== DEFAULT_LOCATION) count += 1;
    if (maxHourlyRate !== null) count += 1;
    if (minExperience !== DEFAULT_MIN_EXPERIENCE) count += 1;
    if (verifiedOnly) count += 1;
    return count;
  }, [
    category,
    selectedSkills,
    location,
    maxHourlyRate,
    minExperience,
    verifiedOnly,
  ]);

  function toggleFilter(filter: OpenFilter) {
    setOpenFilter((current) => (current === filter ? null : filter));
  }
  function selectCategory(nextCategory: string) {
    setCategory(nextCategory);
    setSelectedSkills([]);
    setSkillSearch("");
  }
  function toggleSkill(skillId: string) {
    setSelectedSkills((current) =>
      current.includes(skillId)
        ? current.filter((id) => id !== skillId)
        : [...current, skillId],
    );
  }
  function handleRateChange(value: number) {
    setMaxHourlyRate(value >= rateCeiling ? null : value);
  }
  function resetFilters() {
    setSearch(DEFAULT_SEARCH);
    setCategory(DEFAULT_CATEGORY);
    setSelectedSkills([]);
    setSkillSearch("");
    setLocation(DEFAULT_LOCATION);
    setMaxHourlyRate(null);
    setMinExperience(DEFAULT_MIN_EXPERIENCE);
    setVerifiedOnly(false);
    setSortBy("rating");
    setOpenFilter(null);
  }
  function handleStartProject(allocatId: string) {
    navigate(`/projects/new?allocat=${encodeURIComponent(allocatId)}`);
  }
  function setSearch(nextSearch: string) {
    setSearchParams(
      (currentParams) => {
        const nextParams = new URLSearchParams(currentParams);
        if (nextSearch) nextParams.set("search", nextSearch);
        else nextParams.delete("search");
        return nextParams;
      },
      { replace: true },
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <MinimalNavMenu />
        </div>
      </header>
      <main className="container mx-auto px-5 py-5 md:px-8 lg:py-6">
        <section aria-label="Discover Allocats" className="pb-4 sm:pb-5">
          <div className="grid gap-3 lg:grid-cols-[240px_minmax(0,1fr)] lg:items-center lg:gap-7 xl:grid-cols-[252px_minmax(0,1fr)] xl:gap-9">
            <h1 className="shrink-0 text-2xl font-medium leading-tight tracking-[-0.03em] text-foreground">
              Discover Allocats
            </h1>
            <div className="relative min-w-0 w-full">
              <SearchIcon
                size={15}
                aria-hidden="true"
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/80"
              />
              <Input
                aria-label="Search Allocats"
                maxLength={150}
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search by name, skill or profession"
                className={`h-12 w-full rounded-xl pl-11 pr-11 text-base sm:text-sm ${inputSurface}`}
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  aria-label="Clear search"
                  className={
                    "absolute right-3 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-surface-3/70 hover:text-foreground/90" +
                    " " +
                    FOCUS
                  }
                >
                  <XIcon size={13} aria-hidden="true" />
                </button>
              )}
            </div>
          </div>
        </section>
        {filterOptions.error && (
          <div
            role="alert"
            className="mb-4 flex flex-wrap items-center gap-3 text-xs text-muted-foreground"
          >
            Filter options could not be loaded.
            <button
              type="button"
              onClick={filterOptions.retry}
              className={
                "font-medium underline underline-offset-4" + " " + FOCUS
              }
            >
              Try again
            </button>
          </div>
        )}
        {error && !directory.hasLoaded ? (
          <ErrorState message={error} onRetry={directory.retry} />
        ) : loading && !directory.hasLoaded ? (
          <AllocatLoadingState message="Paws at work — exploring the community..." />
        ) : (
          <div className="lg:grid lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-7 xl:grid-cols-[252px_minmax(0,1fr)] xl:gap-9">
            <aside
              aria-label="Refine Allocats"
              className="hidden lg:sticky lg:top-24 lg:block lg:self-start [&_*]:[scrollbar-width:none] [&_*::-webkit-scrollbar]:hidden"
            >
              <div className="max-h-[calc(100dvh-7rem)] overflow-y-auto pb-4 pr-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <span
                      className={`flex h-8 w-8 items-center justify-center rounded-lg ${filterIconSurface}`}
                    >
                      <SlidersHorizontalIcon size={14} aria-hidden="true" />
                    </span>
                    <h2 className="text-sm font-medium text-foreground/85">
                      Refine
                    </h2>
                    {activeFilterCount > 0 && (
                      <span className="text-[11px] font-medium tabular-nums text-brand-secondary-highlight dark:text-secondary">
                        {activeFilterCount}
                      </span>
                    )}
                  </div>
                  {activeFilterCount > 0 && (
                    <button
                      type="button"
                      onClick={resetFilters}
                      className={
                        "text-[11px] font-medium text-muted-foreground transition-colors hover:text-foreground" +
                        " " +
                        FOCUS
                      }
                    >
                      Reset
                    </button>
                  )}
                </div>
                <div className="mt-2">
                  <DesktopFilterSection title="Category">
                    <CategoryDropdown
                      categories={categories}
                      value={category}
                      onChange={selectCategory}
                    />
                  </DesktopFilterSection>
                  <DesktopFilterSection title="Skills">
                    {category ? (
                      visibleSkills.length > 0 ? (
                        <div className="flex max-h-56 flex-wrap gap-1.5 overflow-y-auto pr-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                          {visibleSkills.map((skill) => (
                            <SkillFilterChip
                              key={skill.id}
                              skill={skill}
                              selected={selectedSkills.includes(skill.id)}
                              onClick={() => toggleSkill(skill.id)}
                            />
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs leading-5 text-muted-foreground">
                          No skills are available for this category yet.
                        </p>
                      )
                    ) : (
                      <SkillSearchFilter
                        skills={skills}
                        selectedSkills={selectedSkills}
                        query={skillSearch}
                        onQueryChange={setSkillSearch}
                        onToggleSkill={toggleSkill}
                      />
                    )}
                  </DesktopFilterSection>
                  <DesktopFilterSection title="Location">
                    <div className="relative">
                      <MapPinIcon
                        size={14}
                        aria-hidden="true"
                        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/80"
                      />
                      <Input
                        aria-label="City or area"
                        maxLength={150}
                        value={location}
                        onChange={(event) => setLocation(event.target.value)}
                        placeholder="City or area"
                        className={`h-11 w-full rounded-lg pl-9 text-base sm:text-xs ${inputSurface}`}
                      />
                    </div>
                  </DesktopFilterSection>
                  <DesktopFilterSection title="Hourly rate">
                    <div className="mb-4 flex items-center justify-between">
                      <span className="text-[11px] text-muted-foreground">
                        Maximum
                      </span>
                      <span className="text-xs font-medium text-foreground">
                        {maxHourlyRate === null
                          ? "Any"
                          : `US$${maxHourlyRate}/hr`}
                      </span>
                    </div>
                    <Slider
                      aria-label="Maximum hourly rate in US dollars"
                      value={[maxHourlyRate ?? rateCeiling]}
                      min={0}
                      max={rateCeiling}
                      step={1}
                      onValueChange={([value]) => handleRateChange(value)}
                      className={rateSliderClass}
                    />
                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-[11px] text-muted-foreground">
                        US$0
                      </span>
                      {maxHourlyRate !== null ? (
                        <button
                          type="button"
                          onClick={() => setMaxHourlyRate(null)}
                          className={
                            "text-[11px] font-medium text-foreground/70 transition-colors hover:text-foreground" +
                            " " +
                            FOCUS
                          }
                        >
                          Any rate
                        </button>
                      ) : (
                        <span className="text-[11px] text-muted-foreground">
                          US${rateCeiling}+
                        </span>
                      )}
                    </div>
                  </DesktopFilterSection>
                  <DesktopFilterSection title="Experience">
                    <div className="mb-3 flex items-center justify-between">
                      <span className="text-[11px] text-muted-foreground">
                        Minimum experience
                      </span>
                      <span className="text-[11px] font-medium text-foreground/80">
                        {minExperience === 0
                          ? "Any"
                          : `${minExperience}+ years`}
                      </span>
                    </div>
                    <ExperienceOptions
                      value={minExperience}
                      onChange={setMinExperience}
                    />
                  </DesktopFilterSection>
                  <DesktopFilterSection title="Verification">
                    <VerifiedControl
                      value={verifiedOnly}
                      onChange={setVerifiedOnly}
                    />
                  </DesktopFilterSection>
                </div>
              </div>
            </aside>
            <div className="min-w-0">
              <section className="py-4 lg:hidden">
                <div
                  ref={mobileFiltersRef}
                  className="flex flex-wrap items-center gap-2"
                >
                  <div className="mr-auto flex shrink-0 items-center gap-2">
                    <span
                      className={`flex h-8 w-8 items-center justify-center rounded-lg ${filterIconSurface}`}
                    >
                      <SlidersHorizontalIcon size={14} aria-hidden="true" />
                    </span>
                    <span className="hidden text-xs font-medium text-foreground sm:inline">
                      Refine
                    </span>
                    {activeFilterCount > 0 && (
                      <span className="text-[11px] font-medium tabular-nums text-brand-secondary-highlight dark:text-secondary">
                        {activeFilterCount}
                      </span>
                    )}
                  </div>
                  <ResponsiveFilterChip
                    panelId={filterPanelId}
                    icon={<Layers3Icon size={13} />}
                    label={category || "Category"}
                    title="Category"
                    active={Boolean(category)}
                    open={openFilter === "category"}
                    onClick={() => toggleFilter("category")}
                  />
                  <ResponsiveFilterChip
                    panelId={filterPanelId}
                    icon={<TagsIcon size={13} />}
                    label={
                      selectedSkills.length > 0
                        ? `${selectedSkills.length} skills`
                        : "Skills"
                    }
                    title="Skills"
                    active={selectedSkills.length > 0}
                    open={openFilter === "skills"}
                    onClick={() => toggleFilter("skills")}
                  />
                  <ResponsiveFilterChip
                    panelId={filterPanelId}
                    icon={<MapPinIcon size={13} />}
                    label={location || "Location"}
                    title="Location"
                    active={Boolean(location)}
                    open={openFilter === "location"}
                    onClick={() => toggleFilter("location")}
                  />
                  <ResponsiveFilterChip
                    panelId={filterPanelId}
                    icon={<CircleDollarSignIcon size={13} />}
                    label={
                      maxHourlyRate === null ? "Rate" : `US$${maxHourlyRate}`
                    }
                    title="Hourly rate"
                    active={maxHourlyRate !== null}
                    open={openFilter === "rate"}
                    onClick={() => toggleFilter("rate")}
                  />
                  <ResponsiveFilterChip
                    panelId={filterPanelId}
                    icon={<Clock3Icon size={13} />}
                    label={
                      minExperience === 0
                        ? "Experience"
                        : `${minExperience}+ yrs`
                    }
                    title="Experience"
                    active={minExperience > 0}
                    open={openFilter === "experience"}
                    onClick={() => toggleFilter("experience")}
                  />
                  <button
                    type="button"
                    title="Verified only"
                    aria-label="Verified only"
                    aria-pressed={verifiedOnly}
                    onClick={() => setVerifiedOnly((current) => !current)}
                    className={
                      `flex min-h-11 shrink-0 items-center justify-center rounded-lg border px-3 text-xs font-medium transition-[background-color,border-color,color] duration-150 gap-2 ${verifiedOnly ? selectedFilterSurface : unselectedFilterSurface}` +
                      " " +
                      FOCUS
                    }
                  >
                    <BadgeCheckIcon size={13} aria-hidden="true" />
                    <span>Verified</span>
                  </button>
                  {activeFilterCount > 0 && (
                    <button
                      type="button"
                      title="Clear filters"
                      aria-label="Clear filters"
                      onClick={resetFilters}
                      className={
                        "flex min-h-11 shrink-0 items-center justify-center rounded-lg px-2.5 text-muted-foreground transition-colors hover:bg-surface-3/55 hover:text-foreground/85 sm:gap-1.5 sm:text-xs" +
                        " " +
                        FOCUS
                      }
                    >
                      <XIcon size={13} aria-hidden="true" />
                      <span>Clear</span>
                    </button>
                  )}
                </div>
                {openFilter === "category" && (
                  <MobileFilterPanel id={filterPanelId}>
                    <CategoryDropdown
                      categories={categories}
                      value={category}
                      onChange={selectCategory}
                    />
                  </MobileFilterPanel>
                )}
                {openFilter === "skills" && (
                  <MobileFilterPanel id={filterPanelId}>
                    {category ? (
                      visibleSkills.length > 0 ? (
                        <div className="flex max-h-64 flex-wrap gap-1.5 overflow-y-auto pr-1">
                          {visibleSkills.map((skill) => (
                            <FilterChip
                              key={skill.id}
                              selected={selectedSkills.includes(skill.id)}
                              label={skill.name}
                              onClick={() => toggleSkill(skill.id)}
                            />
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs leading-5 text-muted-foreground">
                          No skills are available for this category yet.
                        </p>
                      )
                    ) : (
                      <SkillSearchFilter
                        skills={skills}
                        selectedSkills={selectedSkills}
                        query={skillSearch}
                        onQueryChange={setSkillSearch}
                        onToggleSkill={toggleSkill}
                      />
                    )}
                  </MobileFilterPanel>
                )}
                {openFilter === "location" && (
                  <MobileFilterPanel id={filterPanelId}>
                    <div className="relative">
                      <MapPinIcon
                        size={14}
                        aria-hidden="true"
                        className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/80"
                      />
                      <Input
                        aria-label="City or area"
                        maxLength={150}
                        value={location}
                        onChange={(event) => setLocation(event.target.value)}
                        placeholder="City or area"
                        className={`h-11 w-full rounded-lg pl-9 text-base sm:text-xs ${inputSurface}`}
                      />
                    </div>
                  </MobileFilterPanel>
                )}
                {openFilter === "rate" && (
                  <MobileFilterPanel id={filterPanelId}>
                    <div className="mb-4 flex items-center justify-between gap-4">
                      <div>
                        <p className="text-xs font-medium text-foreground">
                          Maximum hourly rate
                        </p>
                        <p className="mt-1 text-[11px] text-muted-foreground">
                          {maxHourlyRate === null
                            ? "No rate limit"
                            : `Up to US$${maxHourlyRate} per hour`}
                        </p>
                      </div>
                      {maxHourlyRate !== null && (
                        <button
                          type="button"
                          onClick={() => setMaxHourlyRate(null)}
                          className={
                            "text-[11px] font-medium text-foreground/70 transition-colors hover:text-foreground" +
                            " " +
                            FOCUS
                          }
                        >
                          Any rate
                        </button>
                      )}
                    </div>
                    <Slider
                      aria-label="Maximum hourly rate in US dollars"
                      value={[maxHourlyRate ?? rateCeiling]}
                      min={0}
                      max={rateCeiling}
                      step={1}
                      onValueChange={([value]) => handleRateChange(value)}
                      className={rateSliderClass}
                    />
                    <div className="mt-3 flex justify-between text-[11px] text-muted-foreground">
                      <span>US$0</span>
                      <span>US${rateCeiling}+</span>
                    </div>
                  </MobileFilterPanel>
                )}
                {openFilter === "experience" && (
                  <MobileFilterPanel id={filterPanelId}>
                    <ExperienceOptions
                      value={minExperience}
                      onChange={setMinExperience}
                      mobile
                    />
                  </MobileFilterPanel>
                )}
              </section>
              <section className="relative flex flex-wrap items-center justify-between gap-3 pb-4 pt-1">
                <div className="min-w-0">
                  <div className="flex min-w-0 items-center gap-2">
                    <h2 className="truncate text-sm font-medium tracking-[-0.02em] text-foreground/85 sm:text-lg">
                      Explore Allocats
                    </h2>
                    <span className="shrink-0 text-xs tabular-nums text-muted-foreground">
                      {directory.totalCount}
                    </span>
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <SortDropdown
                    value={sortBy}
                    onChange={setSortBy}
                    options={sortOptions}
                    label="Sort Allocats"
                  />
                  <ViewModeToggle value={viewMode} onChange={setViewMode} />
                </div>
              </section>
              <section
                aria-label="Allocat results"
                aria-busy={loading}
                className="pb-10"
              >
                {loading && !directory.loadingMore ? (
                  <AllocatLoadingState message="Searching the community..." />
                ) : filteredAllocats.length > 0 ? (
                  <div
                    className={
                      viewMode === "grid"
                        ? "grid gap-4 sm:grid-cols-2 xl:grid-cols-3"
                        : "grid grid-cols-1 gap-3"
                    }
                  >
                    {filteredAllocats.map((allocat) => (
                      <div key={allocat.allocatrUserId} className="min-w-0">
                        <AllocatCardGrid
                          allocat={allocat}
                          viewMode={viewMode}
                          mode="discovery"
                          onStartProject={() =>
                            handleStartProject(allocat.allocatrUserId)
                          }
                        />
                      </div>
                    ))}
                  </div>
                ) : !error ? (
                  <EmptyState onReset={resetFilters} />
                ) : null}
                {error && (
                  <ErrorState message={error} onRetry={directory.retry} />
                )}
                {filteredAllocats.length > 0 && (
                  <div className="mt-7 flex flex-col items-center gap-3 border-t border-border/55 pt-5">
                    <p
                      role="status"
                      aria-live="polite"
                      className="text-xs text-muted-foreground"
                    >
                      Showing {filteredAllocats.length} of{" "}
                      {directory.totalCount} Allocats
                    </p>
                    {directory.hasNext && !error && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={directory.loadMore}
                        disabled={loading}
                        className={`h-10 rounded-lg px-5 text-xs font-medium ${secondaryActionButton}`}
                      >
                        {directory.loadingMore
                          ? "Loading more..."
                          : "Show more Allocats"}
                      </Button>
                    )}
                  </div>
                )}
              </section>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

function DesktopFilterSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="py-3">
      <p className="mb-3 text-xs font-medium text-foreground">{title}</p>
      {children}
    </section>
  );
}
function ExperienceOptions({
  value,
  onChange,
  mobile = false,
}: {
  value: number;
  onChange: (value: number) => void;
  mobile?: boolean;
}) {
  return (
    <div className="grid grid-cols-5 gap-1.5">
      {experienceOptions.map((option) => {
        const selected = value === option.value;
        return (
          <button
            key={option.value}
            type="button"
            title={option.label}
            aria-pressed={selected}
            onClick={() => onChange(option.value)}
            className={
              `flex ${mobile ? "min-h-10 px-1.5" : "h-12 min-w-0"} flex-col items-center justify-center rounded-lg border transition-[background-color,border-color,color] duration-150 ${selected ? selectedFilterSurface : unselectedFilterSurface}` +
              " " +
              FOCUS
            }
          >
            <span
              className={`${mobile ? "text-[11px]" : "text-[11px] leading-none"} font-medium`}
            >
              {option.shortLabel}
            </span>
            {option.suffix && (
              <span
                className={`${mobile ? "text-[10px]" : "mt-1 text-[10px] tracking-[0.08em]"} font-medium uppercase ${selected ? "text-foreground/55 dark:text-secondary/60" : "text-muted-foreground/70"}`}
              >
                {option.suffix}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
function CategoryDropdown({
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
  const filteredCategories = useMemo(
    () =>
      categories.filter((item) =>
        item.toLowerCase().includes(query.trim().toLowerCase()),
      ),
    [categories, query],
  );
  useEffect(() => {
    if (!open) return;
    const frame = requestAnimationFrame(() => input.current?.focus());
    return () => cancelAnimationFrame(frame);
  }, [open]);
  function select(nextValue: string) {
    onChange(nextValue);
  }
  return (
    <DropdownMenu
      modal={false}
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) setQuery("");
      }}
    >
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label={`Category: ${value || "All categories"}`}
          className={`flex min-h-11 w-full items-center justify-between gap-3 rounded-lg border bg-card px-3 text-left text-xs font-medium ${value ? selectedFilterSurface : "border-border/70 text-foreground"} ${FOCUS}`}
        >
          <span className="flex min-w-0 items-center gap-2.5">
            <Layers3Icon
              size={14}
              aria-hidden="true"
              className="shrink-0 text-muted-foreground"
            />
            <span className="truncate">{value || "All categories"}</span>
          </span>
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
        className="z-[150] max-h-[var(--radix-dropdown-menu-content-available-height)] w-[var(--radix-dropdown-menu-trigger-width)] min-w-56 max-w-[calc(100vw-32px)] overflow-hidden rounded-xl border border-border/80 bg-popover p-1.5 text-popover-foreground shadow-[0_16px_45px_-18px_color-mix(in_srgb,var(--brand-charcoal)_30%,transparent)] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        <div className="relative m-1 mb-2">
          <SearchIcon
            size={13}
            aria-hidden="true"
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            ref={input}
            aria-label="Search categories"
            placeholder="Search categories"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Escape") return;
              if (event.key === "ArrowDown") {
                event.preventDefault();
                event.currentTarget
                  .closest('[role="menu"]')
                  ?.querySelector<HTMLElement>('[role="menuitemradio"]')
                  ?.focus();
              }
              // Keep menu typeahead from stealing keystrokes from the search input.
              event.stopPropagation();
            }}
            className={`h-11 w-full rounded-lg pl-8 pr-9 text-base sm:text-xs ${inputSurface}`}
          />
          {query && (
            <button
              type="button"
              aria-label="Clear category search"
              onClick={() => {
                setQuery("");
                input.current?.focus();
              }}
              className={`absolute right-1 top-1 flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground hover:text-foreground ${FOCUS}`}
            >
              <XIcon size={12} aria-hidden="true" />
            </button>
          )}
        </div>
        <div className="max-h-[min(15rem,calc(var(--radix-dropdown-menu-content-available-height)-5rem))] w-full min-w-0 overflow-x-hidden overflow-y-auto overscroll-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <DropdownMenuItem
            role="menuitemradio"
            aria-checked={!value}
            onSelect={() => select("")}
            className="min-h-11 gap-3 rounded-lg px-3 py-2.5 text-xs font-medium outline-none focus:bg-surface-3/60"
          >
            <span className="flex-1">All categories</span>
            {!value && (
              <CheckIcon
                size={13}
                aria-hidden="true"
                className="text-brand-secondary-highlight dark:text-secondary"
              />
            )}
          </DropdownMenuItem>
          <DropdownMenuSeparator className="bg-border/65" />
          {filteredCategories.map((item) => (
            <DropdownMenuItem
              key={item}
              role="menuitemradio"
              aria-checked={value === item}
              onSelect={() => select(item)}
              className={`min-h-11 gap-3 rounded-lg px-3 py-2.5 text-xs font-medium outline-none focus:bg-surface-3/60 ${value === item ? "text-brand-secondary-highlight dark:text-secondary" : "text-foreground"}`}
            >
              <span className="min-w-0 flex-1 whitespace-normal break-words [overflow-wrap:anywhere]">
                {item}
              </span>
              {value === item && <CheckIcon size={13} aria-hidden="true" />}
            </DropdownMenuItem>
          ))}
          {!filteredCategories.length && (
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
function SkillSearchFilter({
  skills,
  selectedSkills,
  query,
  onQueryChange,
  onToggleSkill,
}: {
  skills: SkillSummary[];
  selectedSkills: string[];
  query: string;
  onQueryChange: (value: string) => void;
  onToggleSkill: (id: string) => void;
}) {
  const normalizedQuery = query.trim().toLowerCase();
  const selectedSkillItems = useMemo(
    () =>
      selectedSkills
        .map((id) => skills.find((skill) => skill.id === id))
        .filter((skill): skill is SkillSummary => Boolean(skill)),
    [skills, selectedSkills],
  );
  const searchResults = useMemo(() => {
    if (normalizedQuery.length < 1) return [];
    const searchPlan = createAllocatSearch(normalizedQuery);
    return skills
      .filter((skill) => !selectedSkills.includes(skill.id))
      .map((skill): SkillSearchResult => {
        const normalizedName = skill.name.trim().toLowerCase();
        const normalizedCategory = String(skill.category ?? "")
          .trim()
          .toLowerCase();
        const aliasRank = searchPlan.rank({ skills: [skill] });
        let score = 0;
        if (normalizedName === normalizedQuery) score = 5;
        else if (normalizedName.startsWith(normalizedQuery)) score = 4;
        else if (normalizedName.includes(normalizedQuery)) score = 3;
        else if (aliasRank >= 750) score = 2.5;
        else if (normalizedCategory === normalizedQuery) score = 2;
        else if (normalizedCategory.includes(normalizedQuery)) score = 1;
        else if (aliasRank > 0) score = 0.5;
        return { skill, score };
      })
      .filter((result) => result.score > 0)
      .sort((a, b) =>
        b.score !== a.score
          ? b.score - a.score
          : a.skill.name.localeCompare(b.skill.name),
      )
      .map((result) => result.skill);
  }, [skills, selectedSkills, normalizedQuery]);
  return (
    <div>
      {selectedSkillItems.length > 0 && (
        <div className="mb-3">
          <div className="mb-2 flex items-center justify-between gap-3">
            <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-muted-foreground">
              Selected
            </p>
            <span className="text-[11px] font-medium tabular-nums text-muted-foreground/70">
              {selectedSkillItems.length}
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {selectedSkillItems.map((skill) => (
              <span
                key={skill.id}
                className={`inline-flex max-w-full items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-[11px] font-medium ${selectedFilterSurface}`}
              >
                <span className="truncate">{skill.name}</span>
                <button
                  type="button"
                  onClick={() => onToggleSkill(skill.id)}
                  aria-label={`Remove ${skill.name}`}
                  className={
                    "flex h-4 w-4 shrink-0 items-center justify-center rounded-sm text-muted-foreground transition-colors hover:bg-surface-3 hover:text-foreground dark:hover:bg-secondary/[0.08] dark:hover:text-secondary" +
                    " " +
                    FOCUS
                  }
                >
                  <XIcon size={9} aria-hidden="true" />
                </button>
              </span>
            ))}
          </div>
        </div>
      )}
      <div className="relative">
        <SearchIcon
          size={13}
          aria-hidden="true"
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/75"
        />
        <Input
          aria-label="Search skills or categories"
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder="Search skills or categories"
          className={`h-11 w-full rounded-lg pl-9 pr-9 text-base sm:text-xs ${inputSurface}`}
        />
        {query && (
          <button
            type="button"
            onClick={() => onQueryChange("")}
            aria-label="Clear skill search"
            className={
              "absolute right-2.5 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-surface-3/70 hover:text-foreground/85" +
              " " +
              FOCUS
            }
          >
            <XIcon size={11} aria-hidden="true" />
          </button>
        )}
      </div>
      {normalizedQuery.length === 0 ? (
        <p className="mt-2 text-[11px] leading-5 text-muted-foreground">
          Search by skill or category.
        </p>
      ) : searchResults.length > 0 ? (
        <div className="mt-2 max-h-52 overflow-y-auto overscroll-contain rounded-lg border border-border/55 bg-surface-2/30 p-1 dark:border-border dark:bg-surface-2/55">
          {searchResults.map((skill) => (
            <button
              key={skill.id}
              type="button"
              onClick={() => onToggleSkill(skill.id)}
              className={
                "flex w-full items-center justify-between gap-3 rounded-md px-2.5 py-2 text-left transition-colors hover:bg-surface-3/60 dark:hover:bg-surface-3/65" +
                " " +
                FOCUS
              }
            >
              <span className="min-w-0">
                <span className="block truncate text-xs font-medium text-foreground">
                  {skill.name}
                </span>
                {skill.category && (
                  <span className="mt-0.5 block truncate text-[11px] text-muted-foreground">
                    {skill.category}
                  </span>
                )}
              </span>
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-brand-secondary-highlight/[0.07] text-brand-secondary-highlight dark:bg-secondary/[0.07] dark:text-secondary">
                <PlusSkillIcon />
              </span>
            </button>
          ))}
        </div>
      ) : (
        <p className="mt-2 text-[11px] leading-5 text-muted-foreground">
          No matching skills or categories found.
        </p>
      )}
    </div>
  );
}
function PlusSkillIcon() {
  return (
    <span className="relative block h-2.5 w-2.5">
      <span className="absolute left-0 top-1/2 h-px w-2.5 -translate-y-1/2 bg-current" />
      <span className="absolute left-1/2 top-0 h-2.5 w-px -translate-x-1/2 bg-current" />
    </span>
  );
}
function SkillFilterChip({
  skill,
  selected,
  onClick,
}: {
  skill: SkillSummary;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={skill.name}
      aria-pressed={selected}
      className={
        `max-w-full truncate rounded-md border px-2.5 py-1.5 text-[11px] font-medium transition-[background-color,border-color,color] duration-150 ${selected ? selectedFilterSurface : unselectedFilterSurface}` +
        " " +
        FOCUS
      }
    >
      {skill.name}
    </button>
  );
}
function MobileFilterPanel({
  children,
  id,
}: {
  children: ReactNode;
  id: string;
}) {
  return (
    <div
      id={id}
      role="region"
      aria-label="Filter options"
      className="mt-3 rounded-xl border border-border/70 bg-card p-4"
    >
      {children}
    </div>
  );
}
function FilterChip({
  selected,
  label,
  onClick,
}: {
  selected: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={
        `max-w-full truncate rounded-lg border px-3 py-2 text-xs font-medium transition-[background-color,border-color,color] duration-150 ${selected ? selectedFilterSurface : unselectedFilterSurface}` +
        " " +
        FOCUS
      }
    >
      {label}
    </button>
  );
}
function ResponsiveFilterChip({
  panelId,
  icon,
  label,
  title,
  active,
  open,
  onClick,
}: {
  panelId: string;
  icon: ReactNode;
  label: string;
  title: string;
  active: boolean;
  open: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      title={title}
      aria-label={title}
      aria-expanded={open}
      aria-controls={open ? panelId : undefined}
      onClick={onClick}
      className={
        `flex min-h-11 shrink-0 items-center justify-center rounded-lg border px-3 text-xs font-medium transition-[background-color,border-color,color] duration-150 gap-2 ${active || open ? selectedFilterSurface : unselectedFilterSurface}` +
        " " +
        FOCUS
      }
    >
      {icon}
      <span className="max-w-32 truncate">{label}</span>
      <ChevronDownIcon
        size={10}
        aria-hidden="true"
        className={`transition-transform ${open ? "rotate-180" : ""}`}
      />
    </button>
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
      aria-label="Verified profiles only"
      aria-checked={value}
      onClick={() => onChange(!value)}
      className={
        `flex w-full items-center gap-3 rounded-lg border px-3 py-3 text-left transition-[background-color,border-color] duration-150 ${value ? "border-brand-secondary-highlight/25 bg-brand-secondary-highlight/[0.05] dark:border-secondary/25 dark:bg-secondary/[0.06]" : "border-border/60 bg-surface-2/30 hover:border-border/80 hover:bg-surface-3/50 dark:border-border dark:bg-surface-2/55 dark:hover:bg-surface-3/60"}` +
        " " +
        FOCUS
      }
    >
      <span
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ring-1 ring-inset ${value ? "bg-brand-secondary-highlight/[0.08] text-brand-secondary-highlight ring-brand-secondary-highlight/10 dark:bg-secondary/[0.07] dark:text-secondary dark:ring-secondary/10" : "bg-surface-3/70 text-muted-foreground ring-border/40 dark:bg-surface-3/60 dark:ring-border"}`}
      >
        <BadgeCheckIcon size={15} aria-hidden="true" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-xs font-medium text-foreground">
          Verified only
        </span>
        <span className="mt-0.5 block text-[11px] text-muted-foreground">
          Show verified profiles.
        </span>
      </span>
      <span
        aria-hidden="true"
        className={`relative h-5 w-9 shrink-0 rounded-full transition-colors duration-150 ${value ? "bg-brand-secondary-highlight dark:bg-secondary" : "bg-surface-3 dark:bg-surface-3"}`}
      >
        <span
          className={`absolute top-0.5 h-4 w-4 rounded-full bg-surface-1 ring-1 ring-border/50 transition-transform duration-150 ${value ? "translate-x-[18px]" : "translate-x-0.5"}`}
        />
      </span>
    </button>
  );
}
function ErrorState({
  message,
  onRetry,
}: {
  message: string;
  onRetry?: () => void;
}) {
  return (
    <div className="mt-8 border-y border-border/55 py-16 text-center">
      <span className="mx-auto flex h-11 w-11 items-center justify-center rounded-lg bg-destructive/[0.07] text-destructive">
        <UsersIcon size={19} aria-hidden="true" />
      </span>
      <h2 className="mt-5 text-xl font-medium tracking-[-0.02em] text-foreground">
        We could not load Allocats
      </h2>
      <p className="mx-auto mt-2 max-w-md text-sm leading-7 text-muted-foreground">
        {message}
      </p>
      <Button
        type="button"
        onClick={onRetry ?? (() => window.location.reload())}
        className={`mt-6 h-10 rounded-lg px-5 text-xs font-medium shadow-none ${primaryActionButton}`}
      >
        Try again
      </Button>
    </div>
  );
}
function EmptyState({ onReset }: { onReset: () => void }) {
  return (
    <div className="flex min-h-[320px] flex-col items-center justify-center border-y border-border/55 px-6 text-center">
      <span
        className={`flex h-11 w-11 items-center justify-center rounded-lg ${discoverIconSurface}`}
      >
        <SearchIcon size={18} aria-hidden="true" />
      </span>
      <h2 className="mt-5 text-xl font-medium tracking-[-0.02em] text-foreground">
        No Allocats found
      </h2>
      <p className="mt-2 max-w-md text-sm leading-7 text-muted-foreground">
        Try changing your search, category, skills or other filters.
      </p>
      <Button
        type="button"
        onClick={onReset}
        className={`mt-6 h-10 rounded-lg px-5 text-xs font-medium shadow-none ${primaryActionButton}`}
      >
        Reset filters
      </Button>
    </div>
  );
}
