import {
  type ReactNode,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import { useParams } from "react-router-dom";
import {
  BadgeCheckIcon,
  ChevronDownIcon,
  CircleDollarSignIcon,
  Clock3Icon,
  MapPinIcon,
  SearchIcon,
  SlidersHorizontalIcon,
  UsersIcon,
  XIcon,
} from "lucide-react";
import api from "@/api/axios";
import type { AllocatProfile } from "@/Types/allocatProfile";
import type { Project } from "@/Types/project";
import type { ProjectAllocat } from "@/Types/projectAllocat";
import type { ProjectAllocatStatus } from "@/Types/enums";
import AllocatLoadingState from "@/components/AllocatLoadingState";
import { AllocatCardGrid } from "@/components/AllocatCard";
import MinimalNavMenu from "@/components/MinimalNavMenu";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import {
  discoverIconSurface,
  filterIconSurface,
  inputSurface,
  primaryActionButton,
  selectedFilterSurface,
  unselectedFilterSurface,
  rateSliderClass,
  resultsControlFocus,
} from "@/components/allocat-results-theme";
import ViewModeToggle, {
  type ResultsViewMode,
} from "@/components/ViewModeToggle";
import SortDropdown, {
  type SortDropdownOption,
} from "@/components/SortDropdown";
type SortOption = "match" | "rating" | "experience" | "rate-low" | "recent";
type FilterName = "location" | "rate" | "experience";
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
type ProjectWithSkills = Project;
type MatchedAllocat = FilterableAllocat & {
  matchScore: number;
  matchedSkillCount: number;
  requiredSkillCount: number;
  matchCategoryKey: string;
};
type ProjectSkillCategory = {
  key: string;
  name: string;
  skills: SkillSummary[];
  skillIds: Set<string>;
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
const EXPERIENCE = [
  { label: "Any", shortLabel: "Any", suffix: "", value: 0 },
  { label: "1+ year", shortLabel: "1+", suffix: "yr", value: 1 },
  { label: "3+ years", shortLabel: "3+", suffix: "yrs", value: 3 },
  { label: "5+ years", shortLabel: "5+", suffix: "yrs", value: 5 },
  { label: "10+ years", shortLabel: "10+", suffix: "yrs", value: 10 },
];
const FILTERS = [
  { value: "location", label: "Location", icon: MapPinIcon },
  { value: "rate", label: "Hourly rate", icon: CircleDollarSignIcon },
  { value: "experience", label: "Experience", icon: Clock3Icon },
] as const;
const SORT_OPTIONS: SortDropdownOption<SortOption>[] = [
  {
    value: "match",
    label: "Best match",
    description: "Best required-skill coverage within each category",
  },
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
export default function FindAllocats() {
  const { projectId } = useParams<{ projectId: string }>();
  const [project, setProject] = useState<ProjectWithSkills>();
  const [requiredSkills, setRequiredSkills] = useState<SkillSummary[]>([]);
  const [projectAllocats, setProjectAllocats] = useState<ProjectAllocat[]>([]);
  const [loadedId, setLoadedId] = useState<string | null>(null);
  const [allocats, setAllocats] = useState<FilterableAllocat[]>([]);
  const [location, setLocation] = useState("");
  const [maxHourlyRate, setMaxHourlyRate] = useState<number | null>(null);
  const [minExperience, setMinExperience] = useState(0);
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [openFilter, setOpenFilter] = useState<FilterName | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>("match");
  const [viewMode, setViewMode] = useState<ResultsViewMode>("grid");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retry, setRetry] = useState(0);
  const mobileFilters = useRef<HTMLDivElement>(null);
  const panelId = useId();
  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setLoadedId(null);
    setError(null);
    setProject(undefined);
    setRequiredSkills([]);
    setAllocats([]);
    setProjectAllocats([]);

    async function loadAllAllocats() {
      const requestPage = async (page: number, pageSize = 100) => {
        const response = await api.get<AllocatsResponse>("/allocats/profiles", {
          params: { page, pageSize },
          withCredentials: true,
          signal: controller.signal,
        });
        if (!Array.isArray(response.data?.items))
          throw new Error("Invalid profiles response.");
        return response.data;
      };
      const first = await requestPage(1);
      const items = [...first.items];
      const pages = Number.isFinite(first.totalPages)
        ? Math.max(1, Math.floor(first.totalPages))
        : 1;
      const size =
        Number.isFinite(first.pageSize) && first.pageSize > 0
          ? first.pageSize
          : 100;
      // Keep complete client-side filtering, without issuing every page at once.
      for (let page = 2; page <= pages; page += 4) {
        if (controller.signal.aborted) return [];
        const batch = await Promise.all(
          Array.from({ length: Math.min(4, pages - page + 1) }, (_, offset) =>
            requestPage(page + offset, size),
          ),
        );
        items.push(...batch.flatMap((result) => result.items));
      }
      const unique = new Map<string, FilterableAllocat>();
      for (const item of items) {
        if (item.allocatrUserId)
          unique.set(item.allocatrUserId, {
            ...item,
            skills: normalizeSkills(item.skills),
          });
      }
      return [...unique.values()];
    }

    async function loadPage() {
      try {
        if (!projectId) throw new Error("No project was selected.");
        const id = encodeURIComponent(projectId);
        const [
          projectResponse,
          allAllocats,
          relationshipsResponse,
          catalogueResponse,
        ] = await Promise.all([
          api.get<ProjectWithSkills>(`/projects/${id}`, {
            withCredentials: true,
            signal: controller.signal,
          }),
          loadAllAllocats(),
          api.get<ProjectAllocat[]>(`/projects/${id}/allocats`, {
            withCredentials: true,
            signal: controller.signal,
          }),
          // Project summaries can contain only skill IDs/names. Resolve their
          // category from the seeded catalogue, not the project's primary category.
          api
            .get<
              SkillSummary[]
            >("/skills", { withCredentials: true, signal: controller.signal })
            .catch(() => null),
        ]);
        if (controller.signal.aborted) return;
        if (!projectResponse.data?.id)
          throw new Error("Invalid project response.");
        const resolvedSkills = resolveProjectSkills(
          projectResponse.data.skills,
          catalogueResponse?.data,
        );
        setProject(projectResponse.data);
        setRequiredSkills(resolvedSkills);
        setAllocats(allAllocats);
        setProjectAllocats(
          Array.isArray(relationshipsResponse.data)
            ? relationshipsResponse.data
            : [],
        );
      } catch {
        if (!controller.signal.aborted) {
          setError(
            projectId
              ? "We could not load the professionals for this project. Please try again."
              : "No project was selected. Open Find Allocats from your project workspace.",
          );
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoadedId(projectId ?? "");
          setLoading(false);
        }
      }
    }
    void loadPage();
    return () => controller.abort();
  }, [projectId, retry]);

  const pending = loading || loadedId !== (projectId ?? "");
  const projectCategories = useMemo(
    () => groupProjectSkills(requiredSkills, project?.category),
    [requiredSkills, project?.category],
  );
  const isMultiCategory = projectCategories.length > 1;
  const projectSkillIds = useMemo(
    () =>
      new Set(
        requiredSkills.map((skill) => skillKey(skill.id)).filter(Boolean),
      ),
    [requiredSkills],
  );
  const skillMatchedAllocats = useMemo<MatchedAllocat[]>(() => {
    return projectCategories.flatMap((category) =>
      allocats
        .map((allocat) => {
          const matchedSkillCount = new Set(
            (allocat.skills ?? [])
              .map((skill) => skillKey(skill.id))
              .filter((id) => category.skillIds.has(id)),
          ).size;
          return {
            ...allocat,
            // Surface the relevant skills first while retaining the full profile.
            skills: [...(allocat.skills ?? [])].sort(
              (a, b) =>
                Number(category.skillIds.has(skillKey(b.id))) -
                Number(category.skillIds.has(skillKey(a.id))),
            ),
            matchCategoryKey: category.key,
            matchedSkillCount,
            requiredSkillCount: category.skillIds.size,
            matchScore: Math.round(
              (matchedSkillCount / category.skillIds.size) * 100,
            ),
          };
        })
        .filter((allocat) => allocat.matchedSkillCount > 0),
    );
  }, [allocats, projectCategories]);

  const rateCeiling = useMemo(
    () =>
      Math.ceil(
        Math.max(
          100,
          ...skillMatchedAllocats.map((allocat) => finite(allocat.hourlyRate)),
        ) / 10,
      ) * 10,
    [skillMatchedAllocats],
  );

  const filtered = useMemo(() => {
    const area = normalize(location);
    return skillMatchedAllocats
      .filter((person) => {
        const personLocation = normalize(
          [person.location, person.city, person.country]
            .filter(Boolean)
            .join(", "),
        );
        return (
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
        if (sortBy === "match")
          difference =
            b.matchScore - a.matchScore ||
            b.matchedSkillCount - a.matchedSkillCount ||
            finite(b.averageRating ?? b.rating) -
              finite(a.averageRating ?? a.rating);
        else if (sortBy === "experience")
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
    skillMatchedAllocats,
    location,
    maxHourlyRate,
    minExperience,
    verifiedOnly,
    sortBy,
  ]);
  const resultCount = new Set(filtered.map((person) => person.allocatrUserId))
    .size;
  const categoryResults = projectCategories
    .map((category) => ({
      ...category,
      people: filtered.filter(
        (person) => person.matchCategoryKey === category.key,
      ),
      hasMatches: skillMatchedAllocats.some(
        (person) => person.matchCategoryKey === category.key,
      ),
    }))
    .sort((a, b) => Number(b.people.length > 0) - Number(a.people.length > 0));
  const activeCount =
    Number(!!location.trim()) +
    Number(maxHourlyRate !== null) +
    Number(minExperience > 0) +
    Number(verifiedOnly);
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
  function resetFilters() {
    setLocation("");
    setMaxHourlyRate(null);
    setMinExperience(0);
    setVerifiedOnly(false);
    setOpenFilter(null);
    setSortBy("match");
  }
  function filterValue(name: FilterName) {
    if (name === "location") return location.trim();
    if (name === "rate")
      return maxHourlyRate === null ? "" : `${maxHourlyRate}/hr`;
    return minExperience ? `${minExperience}+ years` : "";
  }
  const relationshipStatusByAllocat = useMemo(
    () =>
      new Map(
        projectAllocats.map((relationship) => [
          relationship.allocatProfileId,
          relationship.status,
        ]),
      ),
    [projectAllocats],
  );
  function handleStatusChange(
    allocatProfileId: string,
    status: ProjectAllocatStatus,
  ) {
    if (!project) return;
    setProjectAllocats((current) =>
      current.some((item) => item.allocatProfileId === allocatProfileId)
        ? current.map((item) =>
            item.allocatProfileId === allocatProfileId
              ? { ...item, status }
              : item,
          )
        : [
            ...current,
            {
              projectId: project.id,
              allocatProfileId,
              status,
              invitedAt: new Date().toISOString(),
              respondedAt: null,
              removedAt: null,
            },
          ],
    );
  }

  function controls(name: FilterName, mobile = false) {
    switch (name) {
      case "location":
        return (
          <div className="relative">
            <MapPinIcon
              size={14}
              aria-hidden="true"
              className={`pointer-events-none absolute ${mobile ? "left-3.5" : "left-3"} top-1/2 -translate-y-1/2 text-muted-foreground/80`}
            />
            <Input
              aria-label="City or area"
              value={location}
              onChange={(event) => setLocation(event.target.value)}
              placeholder="City or area"
              className={`h-10 rounded-lg pl-9 ${mobile ? "" : "text-xs"} ${inputSurface}`}
            />
          </div>
        );
      case "rate":
        return (
          <RateFilter
            value={maxHourlyRate}
            ceiling={rateCeiling}
            onChange={setMaxHourlyRate}
            mobile={mobile}
          />
        );
      case "experience":
        return (
          <ExperienceFilter
            value={minExperience}
            onChange={setMinExperience}
            mobile={mobile}
          />
        );
    }
  }
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/95 backdrop-blur-xl">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <MinimalNavMenu />
        </div>
      </header>
      <main className="container mx-auto px-4 py-7 sm:px-5 md:px-8 lg:py-10">
        <section aria-labelledby="find-allocats-title" className="pb-7">
          <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
            <div className="min-w-0 max-w-4xl">
              <div className="flex items-center gap-2.5">
                <span
                  aria-hidden="true"
                  className={`flex h-9 w-9 items-center justify-center rounded-lg ${discoverIconSurface}`}
                >
                  <UsersIcon size={15} />
                </span>
                <p className="text-[0.58rem] font-semibold uppercase tracking-[0.17em] text-muted-foreground">
                  Find Allocats
                </p>
              </div>
              <h1
                id="find-allocats-title"
                className="mt-4 max-w-4xl break-words text-3xl font-semibold leading-[1.05] tracking-[-0.035em] text-foreground/90 sm:text-4xl lg:text-[2.7rem] [overflow-wrap:anywhere]"
              >
                Find Allocats for{" "}
                {pending ? "your project" : project?.title || "your project"}
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-[0.93rem]">
                Explore professionals with the skills this project needs, then
                review their profiles and invite the right people to your team.
              </p>
            </div>
            {!pending && !error && (
              <div className="hidden items-center gap-3 border-l border-border/55 pl-5 sm:flex">
                <span className="text-3xl font-semibold tracking-[-0.04em] text-foreground/80">
                  {resultCount}
                </span>
                <div>
                  <p className="text-xs font-semibold text-foreground/75">
                    {resultCount === 1 ? "Allocat" : "Allocats"}
                  </p>
                  <p className="text-[0.66rem] text-muted-foreground">
                    matching project skills
                  </p>
                </div>
              </div>
            )}
          </div>
        </section>
        {pending ? (
          <AllocatLoadingState />
        ) : error ? (
          <StatePanel
            kind="error"
            message={error}
            onAction={
              projectId ? () => setRetry((value) => value + 1) : undefined
            }
          />
        ) : (
          <div className="border-t border-border/55 lg:grid lg:grid-cols-[245px_minmax(0,1fr)] lg:gap-8 xl:grid-cols-[265px_minmax(0,1fr)] xl:gap-10">
            <aside
              aria-label="Refine project matches"
              className="hidden lg:block lg:self-stretch"
            >
              <div className="py-7 lg:sticky lg:top-24">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <span
                      aria-hidden="true"
                      className={`flex h-8 w-8 items-center justify-center rounded-lg ${filterIconSurface}`}
                    >
                      <SlidersHorizontalIcon size={14} />
                    </span>
                    <h2 className="text-sm font-semibold text-foreground/85">
                      Refine
                    </h2>
                    {activeCount > 0 && (
                      <span className="text-[0.62rem] font-semibold tabular-nums text-brand-secondary-highlight dark:text-secondary">
                        {activeCount}
                      </span>
                    )}
                  </div>
                  {activeCount > 0 && (
                    <button
                      type="button"
                      onClick={resetFilters}
                      className={`text-[0.65rem] font-semibold text-muted-foreground transition-colors hover:text-foreground ${resultsControlFocus}`}
                    >
                      Reset
                    </button>
                  )}
                </div>
                <p className="mt-2 text-xs leading-5 text-muted-foreground">
                  Narrow down the professionals shown for this project.
                </p>
                <div className="mt-6 divide-y divide-border/55">
                  {FILTERS.map(({ value, label }) => (
                    <DesktopFilterSection key={value} title={label}>
                      {controls(value)}
                    </DesktopFilterSection>
                  ))}
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
              <section aria-label="Refine results" className="py-4 lg:hidden">
                <div
                  ref={mobileFilters}
                  className="flex items-center gap-1.5 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:gap-2"
                >
                  <div className="mr-auto flex shrink-0 items-center gap-2">
                    <span
                      aria-hidden="true"
                      className={`flex h-8 w-8 items-center justify-center rounded-lg ${filterIconSurface}`}
                    >
                      <SlidersHorizontalIcon size={14} />
                    </span>
                    <span className="hidden text-xs font-semibold text-foreground/80 sm:inline">
                      Refine
                    </span>
                    {activeCount > 0 && (
                      <span className="text-[0.6rem] font-semibold tabular-nums text-brand-secondary-highlight dark:text-secondary">
                        {activeCount}
                      </span>
                    )}
                  </div>
                  {FILTERS.map(({ value, label, icon: Icon }) => (
                    <ResponsiveFilterChip
                      key={value}
                      filter={value}
                      panelId={panelId}
                      icon={<Icon size={13} aria-hidden="true" />}
                      label={
                        filterValue(value) ||
                        (value === "rate" ? "Rate" : label)
                      }
                      title={label}
                      active={Boolean(filterValue(value))}
                      open={openFilter === value}
                      onClick={() =>
                        setOpenFilter((current) =>
                          current === value ? null : value,
                        )
                      }
                    />
                  ))}
                  <button
                    type="button"
                    title="Verified only"
                    aria-label="Verified only"
                    aria-pressed={verifiedOnly}
                    onClick={() => setVerifiedOnly((current) => !current)}
                    className={`flex h-9 shrink-0 items-center justify-center rounded-lg border px-2.5 text-xs font-semibold transition-[background-color,border-color,color] duration-150 sm:gap-2 sm:px-3 ${verifiedOnly ? selectedFilterSurface : unselectedFilterSurface} ${resultsControlFocus}`}
                  >
                    <BadgeCheckIcon size={13} aria-hidden="true" />
                    <span className="hidden sm:inline">Verified</span>
                  </button>
                  {activeCount > 0 && (
                    <button
                      type="button"
                      title="Clear filters"
                      aria-label="Clear filters"
                      onClick={resetFilters}
                      className={`flex h-9 shrink-0 items-center justify-center rounded-lg px-2.5 text-muted-foreground transition-colors hover:bg-surface-3/55 hover:text-foreground/85 sm:gap-1.5 sm:text-xs ${resultsControlFocus}`}
                    >
                      <XIcon size={13} aria-hidden="true" />
                      <span className="hidden sm:inline">Clear</span>
                    </button>
                  )}
                </div>
                {openFilter && (
                  <div
                    id={panelId}
                    role="region"
                    aria-label={`${FILTERS.find((item) => item.value === openFilter)?.label} filter`}
                    className="mt-3 rounded-xl border border-border/60 bg-surface-2/40 p-3 dark:border-border dark:bg-surface-2/60"
                  >
                    {controls(openFilter, true)}
                  </div>
                )}
              </section>
              <section
                aria-label="Results controls"
                className="relative flex flex-wrap items-center justify-between gap-x-3 gap-y-3 border-t border-border/55 py-5 lg:border-t-0 lg:py-7"
              >
                {!isMultiCategory && (
                  <div className="min-w-0">
                    <p className="hidden text-[0.58rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground sm:block">
                      Recommendations
                    </p>
                    <div className="flex min-w-0 items-center gap-2 sm:mt-1.5">
                      <h2 className="truncate text-sm font-semibold tracking-[-0.02em] text-foreground/85 sm:text-lg">
                        Best matches
                      </h2>
                      <span className="shrink-0 text-[0.6rem] font-semibold tabular-nums text-muted-foreground sm:hidden">
                        {resultCount}
                      </span>
                    </div>
                  </div>
                )}
                <p
                  role="status"
                  aria-live="polite"
                  aria-atomic="true"
                  className="sr-only"
                >
                  {resultCount} professionals match the project skills and
                  current filters.
                </p>
                <div className="ml-auto flex shrink-0 items-center gap-2">
                  <SortDropdown
                    value={sortBy}
                    onChange={setSortBy}
                    options={SORT_OPTIONS}
                    label="Sort project matches"
                  />
                  <ViewModeToggle value={viewMode} onChange={setViewMode} />
                </div>
              </section>
              <section aria-label="Allocat results" className="pb-10">
                {isMultiCategory ? (
                  <div className="space-y-9">
                    {categoryResults.map((category) => (
                      <section
                        key={category.key}
                        aria-label={`${category.name} matches`}
                        className="min-w-0"
                      >
                        <div className="mb-4 border-b border-border/55 pb-4">
                          <div className="flex flex-wrap items-center justify-between gap-3">
                            <h3 className="text-base font-semibold tracking-[-0.02em] text-foreground/90 sm:text-lg">
                              {category.name}
                            </h3>
                            <span className="text-xs tabular-nums text-muted-foreground">
                              {category.people.length}{" "}
                              {category.people.length === 1
                                ? "Allocat"
                                : "Allocats"}
                            </span>
                          </div>
                          <p className="mt-1.5 text-[11px] leading-5 text-muted-foreground">
                            {category.skills.length} required{" "}
                            {category.skills.length === 1 ? "skill" : "skills"}{" "}
                            · Matches scored for {category.name}
                          </p>
                          <ul
                            aria-label={`Required ${category.name} skills`}
                            className="mt-3 flex flex-wrap gap-1.5"
                          >
                            {category.skills.map((skill) => (
                              <li
                                key={skill.id}
                                className="rounded-md border border-border/60 bg-surface-2/50 px-2 py-1 text-[10px] leading-4 text-muted-foreground"
                              >
                                {skill.name}
                              </li>
                            ))}
                          </ul>
                        </div>
                        {category.people.length ? (
                          <div
                            className={
                              viewMode === "grid"
                                ? "grid gap-4 sm:grid-cols-2 xl:grid-cols-3"
                                : "grid grid-cols-1 gap-3"
                            }
                          >
                            {category.people.map((person) => (
                              <div
                                key={`${project?.id}-${category.key}-${person.allocatrUserId}`}
                                className="min-w-0"
                              >
                                <AllocatCardGrid
                                  allocat={person}
                                  project={project}
                                  viewMode={viewMode}
                                  relationshipStatus={
                                    relationshipStatusByAllocat.get(
                                      person.allocatrUserId,
                                    ) ?? null
                                  }
                                  onStatusChange={(status) =>
                                    handleStatusChange(
                                      person.allocatrUserId,
                                      status,
                                    )
                                  }
                                />
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="rounded-lg border border-dashed border-border/60 px-4 py-5 text-xs leading-6 text-muted-foreground">
                            {category.hasMatches
                              ? `No ${category.name} matches with these filters. Try widening your requirements.`
                              : `No matching Allocats for ${category.name} yet.`}
                            {category.hasMatches && (
                              <button
                                type="button"
                                onClick={resetFilters}
                                className={`ml-2 rounded font-medium text-brand-secondary-highlight underline underline-offset-4 dark:text-secondary ${resultsControlFocus}`}
                              >
                                Reset filters
                              </button>
                            )}
                          </div>
                        )}
                      </section>
                    ))}
                  </div>
                ) : filtered.length ? (
                  <div
                    className={
                      viewMode === "grid"
                        ? "grid gap-4 sm:grid-cols-2 xl:grid-cols-3"
                        : "grid grid-cols-1 gap-3"
                    }
                  >
                    {filtered.map((person) => (
                      <div
                        key={`${project?.id}-${person.allocatrUserId}`}
                        className="min-w-0"
                      >
                        <AllocatCardGrid
                          allocat={person}
                          project={project}
                          viewMode={viewMode}
                          relationshipStatus={
                            relationshipStatusByAllocat.get(
                              person.allocatrUserId,
                            ) ?? null
                          }
                          onStatusChange={(status) =>
                            handleStatusChange(person.allocatrUserId, status)
                          }
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <StatePanel
                    kind={
                      !projectSkillIds.size
                        ? "skills"
                        : !skillMatchedAllocats.length
                          ? "matches"
                          : "empty"
                    }
                    onAction={resetFilters}
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

function DesktopFilterSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="py-5">
      <h3 className="mb-3 text-xs font-semibold text-foreground/80">{title}</h3>
      {children}
    </section>
  );
}
function RateFilter({
  value,
  ceiling,
  onChange,
  mobile = false,
}: {
  value: number | null;
  ceiling: number;
  onChange: (value: number | null) => void;
  mobile?: boolean;
}) {
  return (
    <div>
      {mobile ? (
        <div className="mb-4 flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold text-foreground/80">
              Maximum hourly rate
            </p>
            <p className="mt-1 text-[0.65rem] text-muted-foreground">
              {value === null ? "No rate limit" : `Up to ${value} per hour`}
            </p>
          </div>
          {value !== null && (
            <button
              type="button"
              onClick={() => onChange(null)}
              className={`text-[0.65rem] font-semibold text-foreground/70 transition-colors hover:text-foreground ${resultsControlFocus}`}
            >
              Any rate
            </button>
          )}
        </div>
      ) : (
        <div className="mb-4 flex items-center justify-between">
          <span className="text-[0.67rem] text-muted-foreground">Maximum</span>
          <span className="text-xs font-semibold text-foreground/80">
            {value === null ? "Any" : `${value}/hr`}
          </span>
        </div>
      )}
      <Slider
        aria-label="Maximum listed hourly rate"
        value={[value ?? ceiling]}
        min={0}
        max={ceiling}
        step={1}
        onValueChange={([next]) => onChange(next >= ceiling ? null : next)}
        className={rateSliderClass}
      />
      <div
        className={`mt-3 flex items-center justify-between ${mobile ? "text-[0.62rem] text-muted-foreground" : ""}`}
      >
        <span className="text-[0.62rem] text-muted-foreground">0</span>
        {value !== null && !mobile ? (
          <button
            type="button"
            onClick={() => onChange(null)}
            className={`text-[0.62rem] font-semibold text-foreground/70 transition-colors hover:text-foreground ${resultsControlFocus}`}
          >
            Any rate
          </button>
        ) : (
          <span className="text-[0.62rem] text-muted-foreground">
            {ceiling}+
          </span>
        )}
      </div>
      <p className="mt-2 text-[0.62rem] leading-5 text-muted-foreground">
        Rates use each profile’s listed currency. Rates on request are included.
      </p>
    </div>
  );
}
function ExperienceFilter({
  value,
  onChange,
  mobile = false,
}: {
  value: number;
  onChange: (value: number) => void;
  mobile?: boolean;
}) {
  return (
    <div>
      {!mobile && (
        <div className="mb-3 flex items-center justify-between">
          <span className="text-[0.65rem] text-muted-foreground">
            Minimum experience
          </span>
          <span className="text-[0.65rem] font-semibold text-foreground/80">
            {value === 0 ? "Any" : `${value}+ years`}
          </span>
        </div>
      )}
      <div className="grid grid-cols-5 gap-1.5">
        {EXPERIENCE.map((option) => {
          const selected = value === option.value;
          return (
            <button
              key={option.value}
              type="button"
              title={option.label}
              aria-label={
                option.value
                  ? `${option.value}+ ${option.value === 1 ? "year" : "years"} experience`
                  : "Any experience"
              }
              aria-pressed={selected}
              onClick={() => onChange(option.value)}
              className={`flex ${mobile ? "min-h-10 px-1.5" : "h-12 min-w-0"} flex-col items-center justify-center rounded-lg border transition-[background-color,border-color,color] duration-150 ${selected ? selectedFilterSurface : unselectedFilterSurface} ${resultsControlFocus}`}
            >
              <span
                className={`${mobile ? "text-[0.65rem]" : "text-[0.68rem] leading-none"} font-semibold`}
              >
                {option.shortLabel}
              </span>
              {option.suffix && (
                <span
                  className={`${mobile ? "text-[0.48rem] uppercase" : "mt-1 text-[0.5rem] uppercase tracking-[0.08em]"} font-semibold ${selected ? "text-foreground/55 dark:text-secondary/60" : "text-muted-foreground/70"}`}
                >
                  {option.suffix}
                </span>
              )}
            </button>
          );
        })}
      </div>
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
      aria-label="Verified profiles only"
      aria-checked={value}
      onClick={() => onChange(!value)}
      className={`flex w-full items-center gap-3 rounded-lg border px-3 py-3 text-left transition-[background-color,border-color] duration-150 ${value ? "border-foreground/[0.09] bg-foreground/[0.035] dark:border-secondary/15 dark:bg-secondary/[0.04]" : "border-border/60 bg-surface-2/30 hover:border-border/80 hover:bg-surface-3/50 dark:border-border dark:bg-surface-2/55 dark:hover:bg-surface-3/60"} ${resultsControlFocus}`}
    >
      <span
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ring-1 ring-inset ${value ? "bg-brand-secondary-highlight/[0.08] text-brand-secondary-highlight ring-brand-secondary-highlight/10 dark:bg-secondary/[0.07] dark:text-secondary dark:ring-secondary/10" : "bg-surface-3/70 text-muted-foreground ring-border/40 dark:bg-surface-3/60 dark:ring-border"}`}
      >
        <BadgeCheckIcon size={15} aria-hidden="true" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-xs font-semibold text-foreground/80">
          Verified only
        </span>
        <span className="mt-0.5 block text-[0.62rem] text-muted-foreground">
          Show verified profiles.
        </span>
      </span>
      <span
        aria-hidden="true"
        className={`relative h-5 w-9 shrink-0 rounded-full transition-colors duration-150 ${value ? "bg-brand-secondary-highlight/70 dark:bg-secondary/80" : "bg-surface-3 dark:bg-surface-3"}`}
      >
        <span
          className={`absolute top-0.5 h-4 w-4 rounded-full bg-surface-1 ring-1 ring-border/50 transition-transform duration-150 ${value ? "translate-x-[18px]" : "translate-x-0.5"}`}
        />
      </span>
    </button>
  );
}
function ResponsiveFilterChip({
  filter,
  panelId,
  icon,
  label,
  title,
  active,
  open,
  onClick,
}: {
  filter: FilterName;
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
      data-filter={filter}
      aria-expanded={open}
      aria-controls={open ? panelId : undefined}
      onClick={onClick}
      className={`flex h-9 shrink-0 items-center justify-center rounded-lg border px-2.5 text-xs font-semibold transition-[background-color,border-color,color] duration-150 sm:gap-2 sm:px-3 ${active || open ? selectedFilterSurface : unselectedFilterSurface} ${resultsControlFocus}`}
    >
      {icon}
      <span className="hidden max-w-32 truncate sm:inline">{label}</span>
      <ChevronDownIcon
        size={10}
        aria-hidden="true"
        className={`hidden transition-transform sm:block ${open ? "rotate-180" : ""}`}
      />
    </button>
  );
}
function StatePanel({
  kind,
  message,
  onAction,
}: {
  kind: "error" | "empty" | "skills" | "matches";
  message?: string;
  onAction?: () => void;
}) {
  const Icon =
    kind === "error" || kind === "skills" || kind === "matches"
      ? UsersIcon
      : SearchIcon;
  return (
    <div
      role={kind === "error" ? "alert" : undefined}
      className={`flex min-h-[320px] flex-col items-center justify-center border-y border-border/55 px-6 py-12 text-center ${kind === "error" ? "mt-8" : ""}`}
    >
      <span
        className={`flex h-11 w-11 items-center justify-center rounded-lg ${kind === "error" ? "bg-destructive/[0.07] text-destructive" : discoverIconSurface}`}
      >
        <Icon size={kind === "error" ? 19 : 18} aria-hidden="true" />
      </span>
      <h2 className="mt-5 text-xl font-semibold tracking-[-0.02em] text-foreground/85">
        {kind === "error"
          ? "Project matches are unavailable"
          : kind === "skills"
            ? "Add project skills to find matches"
            : kind === "matches"
              ? "No matching Allocats yet"
              : "No Allocats match these filters"}
      </h2>
      <p className="mt-2 max-w-md text-sm leading-7 text-muted-foreground">
        {message ||
          (kind === "skills"
            ? "Add required skills in your project workspace to find suitable professionals."
            : kind === "matches"
              ? "No listed professionals currently share the skills required by this project."
              : "Try widening your location, rate or experience requirements.")}
      </p>
      {(kind === "error" || kind === "empty") && onAction && (
        <Button
          type="button"
          onClick={onAction}
          className={`mt-6 h-10 rounded-lg px-5 text-xs font-semibold shadow-none ${primaryActionButton}`}
        >
          {kind === "error" ? "Try again" : "Reset filters"}
        </Button>
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
    // String-only skills have no catalogue ID. This key is for display only;
    // it is never sent to the API as a canonical skill ID.
    const skill =
      typeof item === "string"
        ? { id: `name:${normalize(name)}`, name }
        : { ...item, id: item.id || `name:${normalize(name)}`, name };
    if (!skills.has(skill.id)) skills.set(skill.id, skill);
  }
  return [...skills.values()];
}

// Catalogue IDs are the matching identity. Names alone are never matched.
function skillKey(id?: string) {
  return (id ?? "").trim().toLowerCase();
}
function resolveProjectSkills(
  input: SkillSummary[] | undefined,
  catalogue: SkillSummary[] | undefined,
): SkillSummary[] {
  const byId = new Map(
    (Array.isArray(catalogue) ? catalogue : []).map((skill) => [
      skillKey(skill.id),
      skill,
    ]),
  );
  const unique = new Map<string, SkillSummary>();
  for (const skill of Array.isArray(input) ? input : []) {
    const id = skillKey(skill?.id);
    if (!id || id.startsWith("name:")) continue;
    const canonical = byId.get(id);
    const category = canonical?.category?.trim() || skill.category?.trim();
    // Never silently group unresolved skills under the primary category: that
    // would reintroduce the cross-category denominator bug.
    if (!category)
      throw new Error("Project skill categories could not be resolved.");
    unique.set(id, {
      ...skill,
      id,
      name: canonical?.name || skill.name,
      categoryId: canonical?.categoryId || skill.categoryId,
      category,
    });
  }
  return [...unique.values()];
}
function groupProjectSkills(
  skills: SkillSummary[],
  primaryCategory?: string,
): ProjectSkillCategory[] {
  // Reconcile name-only metadata with IDs when some summaries omit categoryId.
  const categoryIdByName = new Map(
    skills
      .filter((skill) => skill.categoryId && skill.category)
      .map((skill) => [normalize(skill.category), skillKey(skill.categoryId)]),
  );
  const groups = new Map<string, ProjectSkillCategory>();
  for (const skill of skills) {
    const name = skill.category?.trim();
    if (!name) continue;
    const id =
      skillKey(skill.categoryId) || categoryIdByName.get(normalize(name));
    const key = id ? `id:${id}` : `name:${normalize(name)}`;
    let group = groups.get(key);
    if (!group) {
      group = { key, name, skills: [], skillIds: new Set() };
      groups.set(key, group);
    }
    const skillId = skillKey(skill.id);
    if (skillId && !group.skillIds.has(skillId)) {
      group.skillIds.add(skillId);
      group.skills.push(skill);
    }
  }
  return [...groups.values()]
    .filter((group) => group.skillIds.size)
    .sort(
      (a, b) =>
        Number(normalize(b.name) === normalize(primaryCategory)) -
          Number(normalize(a.name) === normalize(primaryCategory)) ||
        a.name.localeCompare(b.name),
    );
}
