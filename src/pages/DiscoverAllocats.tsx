import { type ReactNode, useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  BadgeCheckIcon, CheckIcon, ChevronDownIcon, CircleDollarSignIcon, Clock3Icon,
  Layers3Icon, MapPinIcon, SearchIcon, SlidersHorizontalIcon, TagsIcon, UsersIcon, XIcon,
} from "lucide-react";
import api from "@/api/axios";
import type { AllocatProfile } from "@/Types/allocatProfile";
import { AllocatCardGrid } from "@/components/AllocatCard";
import MinimalNavMenu from "@/components/MinimalNavMenu";
import AllocatLoadingState from "@/components/AllocatLoadingState";
import ViewModeToggle, { type ResultsViewMode } from "@/components/ViewModeToggle";
import SortDropdown, { type SortDropdownOption } from "@/components/SortDropdown";
import {
  discoverIconSurface, filterIconSurface, inputSurface, primaryActionButton,
  secondaryActionButton, selectedFilterSurface, unselectedFilterSurface, rateSliderClass,
} from "@/components/allocat-results-theme";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";

type SortOption = "rating" | "experience" | "rate-low" | "recent";
type OpenFilter = "category" | "skills" | "location" | "rate" | "experience" | null;
type SkillSummary = { id: string; name: string; categoryId?: string; category?: string };
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
type AllocatsResponse = { items: FilterableAllocat[]; page: number; pageSize: number; totalCount: number; totalPages: number };
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
  { value: "rating", label: "Highest rated", description: "Top rated professionals" },
  { value: "experience", label: "Most experienced", description: "Most years first" },
  { value: "rate-low", label: "Lowest rate", description: "Lowest hourly rate first" },
  { value: "recent", label: "Recently active", description: "Newest activity first" },
];

export default function Discover() {
  const navigate = useNavigate();
  const [allocats, setAllocats] = useState<FilterableAllocat[]>([]);
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
  const [sortBy, setSortBy] = useState<SortOption>("rating");
  const [viewMode, setViewMode] = useState<ResultsViewMode>("grid");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function loadAllAllocats() {
      const firstResponse = await api.get<AllocatsResponse>("/allocats/profiles", { params: { page: 1, pageSize: 100 } });
      const firstPage = firstResponse.data;
      if (firstPage.totalPages <= 1) return Array.isArray(firstPage.items) ? firstPage.items : [];
      const remainingPages = await Promise.all(Array.from(
        { length: firstPage.totalPages - 1 },
        (_, index) => api.get<AllocatsResponse>("/allocats/profiles", { params: { page: index + 2, pageSize: firstPage.pageSize } }),
      ));
      return [...(firstPage.items ?? []), ...remainingPages.flatMap((response) => response.data.items ?? [])];
    }
    async function loadPage() {
      setLoading(true);
      setError(null);
      try {
        const allAllocats = await loadAllAllocats();
        if (cancelled) return;
        setAllocats(allAllocats);
      } catch (requestError) {
        if (cancelled) return;
        console.error("Could not load discoverable Allocats:", requestError);
        setError("We could not load professionals right now. Please try again.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    void loadPage();
    return () => { cancelled = true; };
  }, []);

  const categories = useMemo(() => {
    const categoryMap = new Map<string, string>();
    allocats.forEach((allocat) => allocat.skills?.forEach((skill) => {
      const value = skill.category?.trim();
      if (!value) return;
      categoryMap.set(value.toLowerCase(), value);
    }));
    return [...categoryMap.values()].sort((a, b) => a.localeCompare(b));
  }, [allocats]);
  const skills = useMemo(() => {
    const skillMap = new Map<string, SkillSummary>();
    allocats.forEach((allocat) => allocat.skills?.forEach((skill) => {
      if (!skill.id || !skill.name?.trim()) return;
      if (!skillMap.has(skill.id)) skillMap.set(skill.id, skill);
    }));
    return [...skillMap.values()].sort((a, b) => a.name.localeCompare(b.name));
  }, [allocats]);
  const visibleSkills = useMemo(() => {
    if (!category) return [];
    const normalizedCategory = category.trim().toLowerCase();
    return skills.filter((skill) => String(skill.category ?? "").trim().toLowerCase() === normalizedCategory);
  }, [skills, category]);
  const rateCeiling = useMemo(() => {
    const highestRate = Math.max(...allocats.map((allocat) => allocat.hourlyRate ?? 0), 100);
    return Math.ceil(highestRate / 10) * 10;
  }, [allocats]);

  const filteredAllocats = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();
    const normalizedLocation = location.trim().toLowerCase();
    const normalizedCategory = category.trim().toLowerCase();
    const results = allocats.filter((allocat) => {
      const allocatSkills = allocat.skills ?? [];
      const yearsExperience = allocat.yearsExperience ?? 0;
      const allocatLocation = getAllocatLocation(allocat);
      const searchableText = [
        allocat.fullName, allocat.title, allocat.headline, allocat.bio, allocat.location, allocat.city, allocat.country,
        ...allocatSkills.map((skill) => skill.name), ...allocatSkills.map((skill) => skill.category),
      ].filter(Boolean).join(" ").toLowerCase();
      const matchesSearch = !normalizedSearch || searchableText.includes(normalizedSearch);
      const matchesCategory = !normalizedCategory || allocatSkills.some((skill) => String(skill.category ?? "").trim().toLowerCase() === normalizedCategory);
      const matchesSkills = selectedSkills.length === 0 || selectedSkills.every((skillId) => allocatSkills.some((skill) => skill.id === skillId));
      const matchesLocation = !normalizedLocation || (Boolean(allocatLocation) && (allocatLocation.includes(normalizedLocation) || normalizedLocation.includes(allocatLocation)));
      const matchesRate = maxHourlyRate === null || allocat.hourlyRate === null || allocat.hourlyRate === undefined || allocat.hourlyRate <= maxHourlyRate;
      const matchesExperience = yearsExperience >= minExperience;
      const matchesVerified = !verifiedOnly || getIsVerified(allocat);
      return matchesSearch && matchesCategory && matchesSkills && matchesLocation && matchesRate && matchesExperience && matchesVerified;
    });
    return [...results].sort((a, b) => {
      switch (sortBy) {
        case "experience": return (b.yearsExperience ?? 0) - (a.yearsExperience ?? 0);
        case "rate-low": return (a.hourlyRate ?? Number.MAX_SAFE_INTEGER) - (b.hourlyRate ?? Number.MAX_SAFE_INTEGER);
        case "recent": return getDateValue(b.updatedAt ?? b.createdAt ?? b.joinedAt) - getDateValue(a.updatedAt ?? a.createdAt ?? a.joinedAt);
        case "rating": default: return getRating(b) - getRating(a);
      }
    });
  }, [allocats, search, category, selectedSkills, location, maxHourlyRate, minExperience, verifiedOnly, sortBy]);
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (category !== DEFAULT_CATEGORY) count += 1;
    if (selectedSkills.length > 0) count += 1;
    if (location !== DEFAULT_LOCATION) count += 1;
    if (maxHourlyRate !== null) count += 1;
    if (minExperience !== DEFAULT_MIN_EXPERIENCE) count += 1;
    if (verifiedOnly) count += 1;
    return count;
  }, [category, selectedSkills, location, maxHourlyRate, minExperience, verifiedOnly]);

  function toggleFilter(filter: OpenFilter) { setOpenFilter((current) => current === filter ? null : filter); }
  function selectCategory(nextCategory: string) { setCategory(nextCategory); setSelectedSkills([]); setSkillSearch(""); }
  function toggleSkill(skillId: string) { setSelectedSkills((current) => current.includes(skillId) ? current.filter((id) => id !== skillId) : [...current, skillId]); }
  function handleRateChange(value: number) { setMaxHourlyRate(value >= rateCeiling ? null : value); }
  function resetFilters() {
    setSearch(DEFAULT_SEARCH); setCategory(DEFAULT_CATEGORY); setSelectedSkills([]); setSkillSearch("");
    setLocation(DEFAULT_LOCATION); setMaxHourlyRate(null); setMinExperience(DEFAULT_MIN_EXPERIENCE);
    setVerifiedOnly(false); setSortBy("rating"); setOpenFilter(null);
  }
  function handleStartProject(allocatId: string) { navigate(`/projects/new?allocat=${encodeURIComponent(allocatId)}`); }
  function setSearch(nextSearch: string) {
    setSearchParams((currentParams) => {
      const nextParams = new URLSearchParams(currentParams);
      if (nextSearch) nextParams.set("search", nextSearch); else nextParams.delete("search");
      return nextParams;
    }, { replace: true });
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/95 backdrop-blur-xl">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8"><MinimalNavMenu /></div>
      </header>
      <main className="container mx-auto px-4 py-7 sm:px-5 md:px-8 lg:py-10">
        <section className="pb-7">
          <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
            <div className="min-w-0 max-w-4xl">
              <div className="flex items-center gap-2.5">
                <span className={`flex h-9 w-9 items-center justify-center rounded-lg ${discoverIconSurface}`}><UsersIcon size={15} aria-hidden="true" /></span>
                <p className="text-[0.58rem] font-semibold uppercase tracking-[0.17em] text-muted-foreground">Discover</p>
              </div>
              <h1 className="mt-4 max-w-4xl text-3xl font-semibold leading-[1.05] tracking-[-0.035em] text-foreground/90 sm:text-4xl lg:text-[2.7rem]">Find the right people for what comes next.</h1>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-[0.93rem]">Explore skilled Allocats across categories, experience levels and locations, then start a project when you find the right fit.</p>
              <div className="relative mt-6 max-w-2xl">
                <SearchIcon size={15} aria-hidden="true" className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/80" />
                <Input aria-label="Search Allocats" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search by name, skill or profession" className={`h-12 rounded-xl pl-11 pr-11 ${inputSurface}`} />
                {search && <button type="button" onClick={() => setSearch("")} aria-label="Clear search" className="absolute right-3 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-surface-3/70 hover:text-foreground/90"><XIcon size={13} aria-hidden="true" /></button>}
              </div>
            </div>
            {!loading && !error && <div className="hidden items-center gap-3 border-l border-border/55 pl-5 sm:flex">
              <span className="text-3xl font-semibold tracking-[-0.04em] text-foreground/80">{filteredAllocats.length}</span>
              <div><p className="text-xs font-semibold text-foreground/75">{filteredAllocats.length === 1 ? "Allocat" : "Allocats"}</p><p className="text-[0.66rem] text-muted-foreground">available</p></div>
            </div>}
          </div>
        </section>
        {error ? <ErrorState message={error} /> : loading ? <AllocatLoadingState message="Paws at work — exploring the community..." /> : (
          <div className="border-t border-border/55 lg:grid lg:grid-cols-[245px_minmax(0,1fr)] lg:gap-8 xl:grid-cols-[265px_minmax(0,1fr)] xl:gap-10">
            <aside className="hidden lg:sticky lg:top-24 lg:block lg:self-start">
              <div className="py-7">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <span className={`flex h-8 w-8 items-center justify-center rounded-lg ${filterIconSurface}`}><SlidersHorizontalIcon size={14} aria-hidden="true" /></span>
                    <h2 className="text-sm font-semibold text-foreground/85">Refine</h2>
                    {activeFilterCount > 0 && <span className="text-[0.62rem] font-semibold tabular-nums text-brand-secondary-highlight dark:text-secondary">{activeFilterCount}</span>}
                  </div>
                  {activeFilterCount > 0 && <button type="button" onClick={resetFilters} className="text-[0.65rem] font-semibold text-muted-foreground transition-colors hover:text-foreground">Reset</button>}
                </div>
                <p className="mt-2 text-xs leading-5 text-muted-foreground">Narrow the community to the professionals you're looking for.</p>
                <div className="mt-6 divide-y divide-border/55">
                  <DesktopFilterSection title="Category"><CategoryDropdown categories={categories} value={category} onChange={selectCategory} /></DesktopFilterSection>
                  <DesktopFilterSection title="Skills">
                    {category ? visibleSkills.length > 0 ? <div className="flex max-h-56 flex-wrap gap-1.5 overflow-y-auto pr-1">{visibleSkills.map((skill) => <SkillFilterChip key={skill.id} skill={skill} selected={selectedSkills.includes(skill.id)} onClick={() => toggleSkill(skill.id)} />)}</div> : <p className="text-xs leading-5 text-muted-foreground">No skills are available for this category yet.</p> : <SkillSearchFilter skills={skills} selectedSkills={selectedSkills} query={skillSearch} onQueryChange={setSkillSearch} onToggleSkill={toggleSkill} />}
                  </DesktopFilterSection>
                  <DesktopFilterSection title="Location"><div className="relative"><MapPinIcon size={14} aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/80" /><Input aria-label="City or area" value={location} onChange={(event) => setLocation(event.target.value)} placeholder="City or area" className={`h-10 rounded-lg pl-9 text-xs ${inputSurface}`} /></div></DesktopFilterSection>
                  <DesktopFilterSection title="Hourly rate">
                    <div className="mb-4 flex items-center justify-between"><span className="text-[0.67rem] text-muted-foreground">Maximum</span><span className="text-xs font-semibold text-foreground/80">{maxHourlyRate === null ? "Any" : `US$${maxHourlyRate}/hr`}</span></div>
                    <Slider aria-label="Maximum hourly rate in US dollars" value={[maxHourlyRate ?? rateCeiling]} min={0} max={rateCeiling} step={1} onValueChange={([value]) => handleRateChange(value)} className={rateSliderClass} />
                    <div className="mt-3 flex items-center justify-between"><span className="text-[0.62rem] text-muted-foreground">US$0</span>{maxHourlyRate !== null ? <button type="button" onClick={() => setMaxHourlyRate(null)} className="text-[0.62rem] font-semibold text-foreground/70 transition-colors hover:text-foreground">Any rate</button> : <span className="text-[0.62rem] text-muted-foreground">US${rateCeiling}+</span>}</div>
                  </DesktopFilterSection>
                  <DesktopFilterSection title="Experience">
                    <div className="mb-3 flex items-center justify-between"><span className="text-[0.65rem] text-muted-foreground">Minimum experience</span><span className="text-[0.65rem] font-semibold text-foreground/80">{minExperience === 0 ? "Any" : `${minExperience}+ years`}</span></div>
                    <ExperienceOptions value={minExperience} onChange={setMinExperience} />
                  </DesktopFilterSection>
                  <DesktopFilterSection title="Verification"><VerifiedControl value={verifiedOnly} onChange={setVerifiedOnly} /></DesktopFilterSection>
                </div>
              </div>
            </aside>
            <div className="min-w-0">
              <section className="py-4 lg:hidden">
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:gap-2">
                  <div className="mr-auto flex shrink-0 items-center gap-2">
                    <span className={`flex h-8 w-8 items-center justify-center rounded-lg ${filterIconSurface}`}><SlidersHorizontalIcon size={14} aria-hidden="true" /></span>
                    <span className="hidden text-xs font-semibold text-foreground/80 sm:inline">Refine</span>
                    {activeFilterCount > 0 && <span className="text-[0.6rem] font-semibold tabular-nums text-brand-secondary-highlight dark:text-secondary">{activeFilterCount}</span>}
                  </div>
                  <ResponsiveFilterChip icon={<Layers3Icon size={13} />} label={category || "Category"} title="Category" active={Boolean(category)} open={openFilter === "category"} onClick={() => toggleFilter("category")} />
                  <ResponsiveFilterChip icon={<TagsIcon size={13} />} label={selectedSkills.length > 0 ? `${selectedSkills.length} skills` : "Skills"} title="Skills" active={selectedSkills.length > 0} open={openFilter === "skills"} onClick={() => toggleFilter("skills")} />
                  <ResponsiveFilterChip icon={<MapPinIcon size={13} />} label={location || "Location"} title="Location" active={Boolean(location)} open={openFilter === "location"} onClick={() => toggleFilter("location")} />
                  <ResponsiveFilterChip icon={<CircleDollarSignIcon size={13} />} label={maxHourlyRate === null ? "Rate" : `US$${maxHourlyRate}`} title="Hourly rate" active={maxHourlyRate !== null} open={openFilter === "rate"} onClick={() => toggleFilter("rate")} />
                  <ResponsiveFilterChip icon={<Clock3Icon size={13} />} label={minExperience === 0 ? "Experience" : `${minExperience}+ yrs`} title="Experience" active={minExperience > 0} open={openFilter === "experience"} onClick={() => toggleFilter("experience")} />
                  <button type="button" title="Verified only" aria-label="Verified only" aria-pressed={verifiedOnly} onClick={() => setVerifiedOnly((current) => !current)} className={`flex h-9 shrink-0 items-center justify-center rounded-lg border px-2.5 text-xs font-semibold transition-[background-color,border-color,color] duration-150 sm:gap-2 sm:px-3 ${verifiedOnly ? selectedFilterSurface : unselectedFilterSurface}`}><BadgeCheckIcon size={13} aria-hidden="true" /><span className="hidden sm:inline">Verified</span></button>
                  {activeFilterCount > 0 && <button type="button" title="Clear filters" aria-label="Clear filters" onClick={resetFilters} className="flex h-9 shrink-0 items-center justify-center rounded-lg px-2.5 text-muted-foreground transition-colors hover:bg-surface-3/55 hover:text-foreground/85 sm:gap-1.5 sm:text-xs"><XIcon size={13} aria-hidden="true" /><span className="hidden sm:inline">Clear</span></button>}
                </div>
                {openFilter === "category" && <MobileFilterPanel><div className="flex max-h-64 flex-wrap gap-1.5 overflow-y-auto pr-1"><FilterChip selected={!category} label="All categories" onClick={() => selectCategory("")} />{categories.map((item) => <FilterChip key={item} selected={category === item} label={item} onClick={() => selectCategory(item)} />)}</div></MobileFilterPanel>}
                {openFilter === "skills" && <MobileFilterPanel>{category ? visibleSkills.length > 0 ? <div className="flex max-h-64 flex-wrap gap-1.5 overflow-y-auto pr-1">{visibleSkills.map((skill) => <FilterChip key={skill.id} selected={selectedSkills.includes(skill.id)} label={skill.name} onClick={() => toggleSkill(skill.id)} />)}</div> : <p className="text-xs leading-5 text-muted-foreground">No skills are available for this category yet.</p> : <SkillSearchFilter skills={skills} selectedSkills={selectedSkills} query={skillSearch} onQueryChange={setSkillSearch} onToggleSkill={toggleSkill} />}</MobileFilterPanel>}
                {openFilter === "location" && <MobileFilterPanel><div className="relative"><MapPinIcon size={14} aria-hidden="true" className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/80" /><Input aria-label="City or area" value={location} onChange={(event) => setLocation(event.target.value)} placeholder="City or area" className={`h-10 rounded-lg pl-9 ${inputSurface}`} /></div></MobileFilterPanel>}
                {openFilter === "rate" && <MobileFilterPanel>
                  <div className="mb-4 flex items-center justify-between gap-4"><div><p className="text-xs font-semibold text-foreground/80">Maximum hourly rate</p><p className="mt-1 text-[0.65rem] text-muted-foreground">{maxHourlyRate === null ? "No rate limit" : `Up to US$${maxHourlyRate} per hour`}</p></div>{maxHourlyRate !== null && <button type="button" onClick={() => setMaxHourlyRate(null)} className="text-[0.65rem] font-semibold text-foreground/70 transition-colors hover:text-foreground">Any rate</button>}</div>
                  <Slider aria-label="Maximum hourly rate in US dollars" value={[maxHourlyRate ?? rateCeiling]} min={0} max={rateCeiling} step={1} onValueChange={([value]) => handleRateChange(value)} className={rateSliderClass} />
                  <div className="mt-3 flex justify-between text-[0.62rem] text-muted-foreground"><span>US$0</span><span>US${rateCeiling}+</span></div>
                </MobileFilterPanel>}
                {openFilter === "experience" && <MobileFilterPanel><ExperienceOptions value={minExperience} onChange={setMinExperience} mobile /></MobileFilterPanel>}
              </section>
              <section className="relative flex flex-wrap items-center justify-between gap-3 border-t border-border/55 py-5 lg:border-t-0 lg:py-7">
                <div className="min-w-0"><p className="hidden text-[0.58rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground sm:block">Professionals</p><div className="flex min-w-0 items-center gap-2 sm:mt-1.5"><h2 className="truncate text-sm font-semibold tracking-[-0.02em] text-foreground/85 sm:text-lg">Explore Allocats</h2><span className="shrink-0 text-[0.6rem] font-semibold tabular-nums text-muted-foreground sm:hidden">{filteredAllocats.length}</span></div></div>
                <div className="flex shrink-0 items-center gap-2"><SortDropdown value={sortBy} onChange={setSortBy} options={sortOptions} label="Sort Allocats" /><ViewModeToggle value={viewMode} onChange={setViewMode} /></div>
              </section>
              <section aria-label="Allocat results" className="pb-10">
                {filteredAllocats.length > 0 ? <div className={viewMode === "grid" ? "grid gap-4 sm:grid-cols-2 xl:grid-cols-3" : "grid grid-cols-1 gap-3"}>{filteredAllocats.map((allocat) => <div key={allocat.allocatrUserId} className="min-w-0"><AllocatCardGrid allocat={allocat} viewMode={viewMode} mode="discovery" onStartProject={() => handleStartProject(allocat.allocatrUserId)} /></div>)}</div> : <EmptyState onReset={resetFilters} />}
              </section>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

function DesktopFilterSection({ title, children }: { title: string; children: ReactNode }) {
  return <section className="py-5"><p className="mb-3 text-xs font-semibold text-foreground/80">{title}</p>{children}</section>;
}
function ExperienceOptions({ value, onChange, mobile = false }: { value: number; onChange: (value: number) => void; mobile?: boolean }) {
  return <div className="grid grid-cols-5 gap-1.5">{experienceOptions.map((option) => {
    const selected = value === option.value;
    return <button key={option.value} type="button" title={option.label} aria-pressed={selected} onClick={() => onChange(option.value)} className={`flex ${mobile ? "min-h-10 px-1.5" : "h-12 min-w-0"} flex-col items-center justify-center rounded-lg border transition-[background-color,border-color,color] duration-150 ${selected ? selectedFilterSurface : unselectedFilterSurface}`}>
      <span className={`${mobile ? "text-[0.65rem]" : "text-[0.68rem] leading-none"} font-semibold`}>{option.shortLabel}</span>
      {option.suffix && <span className={`${mobile ? "text-[0.48rem]" : "mt-1 text-[0.5rem] tracking-[0.08em]"} font-semibold uppercase ${selected ? "text-foreground/55 dark:text-secondary/60" : "text-muted-foreground/70"}`}>{option.suffix}</span>}
    </button>;
  })}</div>;
}
function CategoryDropdown({ categories, value, onChange }: { categories: string[]; value: string; onChange: (value: string) => void }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const selectedLabel = value || "All categories";
  const filteredCategories = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return !normalizedQuery ? categories : categories.filter((item) => item.toLowerCase().includes(normalizedQuery));
  }, [categories, query]);
  function selectCategory(nextValue: string) { onChange(nextValue); setOpen(false); setQuery(""); }
  function closeDropdown() { setOpen(false); setQuery(""); }
  return <div className="relative" onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) closeDropdown(); }}>
    <button type="button" aria-haspopup="listbox" aria-expanded={open} onClick={() => setOpen((current) => { if (current) setQuery(""); return !current; })} className={`flex h-10 w-full items-center justify-between gap-3 rounded-lg border px-3 text-left text-xs font-semibold transition-[background-color,border-color,color] duration-150 ${open || value ? "border-foreground/[0.09] bg-foreground/[0.035] text-foreground/85 dark:border-secondary/15 dark:bg-secondary/[0.04] dark:text-foreground/85" : secondaryActionButton}`}>
      <span className="flex min-w-0 items-center gap-2.5"><Layers3Icon size={13} aria-hidden="true" className={`shrink-0 ${value ? "text-brand-secondary-highlight dark:text-secondary" : "text-muted-foreground"}`} /><span className="truncate">{selectedLabel}</span></span><ChevronDownIcon size={12} aria-hidden="true" className={`shrink-0 text-muted-foreground transition-transform duration-150 ${open ? "rotate-180" : ""}`} />
    </button>
    {open && <div role="listbox" className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-xl border border-border/60 bg-popover text-popover-foreground shadow-none dark:border-border">
      <div className="border-b border-border/55 p-2"><div className="relative"><SearchIcon size={13} aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/75" /><Input autoFocus aria-label="Search categories" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search categories" className={`h-9 rounded-lg pl-8 pr-8 text-xs ${inputSurface}`} />{query && <button type="button" onClick={() => setQuery("")} aria-label="Clear category search" className="absolute right-2 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-surface-3/70 hover:text-foreground/85"><XIcon size={10} aria-hidden="true" /></button>}</div></div>
      <div className="max-h-64 overflow-y-auto overscroll-contain p-1.5 [scrollbar-width:thin]">
        <CategoryDropdownOption selected={!value} label="All categories" onClick={() => selectCategory("")} />
        {filteredCategories.length > 0 && <div className="my-1 h-px bg-border/55" />}
        {filteredCategories.map((item) => <CategoryDropdownOption key={item} selected={value === item} label={item} onClick={() => selectCategory(item)} />)}
        {filteredCategories.length === 0 && <div className="px-3 py-5 text-center"><SearchIcon size={15} aria-hidden="true" className="mx-auto text-muted-foreground/60" /><p className="mt-2 text-xs font-medium text-foreground/70">No categories found</p><p className="mt-1 text-[0.6rem] text-muted-foreground">Try a different search.</p></div>}
      </div>
      {categories.length > 0 && <div className="border-t border-border/55 px-3 py-2"><p className="text-[0.58rem] text-muted-foreground">{query ? `${filteredCategories.length} ${filteredCategories.length === 1 ? "category" : "categories"} found` : `${categories.length} ${categories.length === 1 ? "category" : "categories"} available`}</p></div>}
    </div>}
  </div>;
}
function CategoryDropdownOption({ selected, label, onClick }: { selected: boolean; label: string; onClick: () => void }) {
  return <button type="button" role="option" aria-selected={selected} title={label} onClick={onClick} className={`flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-left text-xs font-semibold transition-colors duration-150 ${selected ? "bg-foreground/[0.045] text-foreground/85 dark:bg-secondary/[0.055] dark:text-secondary" : "text-muted-foreground hover:bg-surface-3/55 hover:text-foreground/85 dark:hover:bg-surface-3/60 dark:hover:text-foreground"}`}><span className="truncate">{label}</span>{selected && <CheckIcon size={12} strokeWidth={3} aria-hidden="true" className="shrink-0 text-brand-secondary-highlight dark:text-secondary" />}</button>;
}
function SkillSearchFilter({ skills, selectedSkills, query, onQueryChange, onToggleSkill }: {
  skills: SkillSummary[]; selectedSkills: string[]; query: string; onQueryChange: (value: string) => void; onToggleSkill: (id: string) => void;
}) {
  const normalizedQuery = query.trim().toLowerCase();
  const selectedSkillItems = useMemo(() => selectedSkills.map((id) => skills.find((skill) => skill.id === id)).filter((skill): skill is SkillSummary => Boolean(skill)), [skills, selectedSkills]);
  const searchResults = useMemo(() => {
    if (normalizedQuery.length < 1) return [];
    return skills.filter((skill) => !selectedSkills.includes(skill.id)).map((skill): SkillSearchResult => {
      const normalizedName = skill.name.trim().toLowerCase();
      const normalizedCategory = String(skill.category ?? "").trim().toLowerCase();
      let score = 0;
      if (normalizedName === normalizedQuery) score = 5;
      else if (normalizedName.startsWith(normalizedQuery)) score = 4;
      else if (normalizedName.includes(normalizedQuery)) score = 3;
      else if (normalizedCategory === normalizedQuery) score = 2;
      else if (normalizedCategory.includes(normalizedQuery)) score = 1;
      return { skill, score };
    }).filter((result) => result.score > 0).sort((a, b) => b.score !== a.score ? b.score - a.score : a.skill.name.localeCompare(b.skill.name)).map((result) => result.skill);
  }, [skills, selectedSkills, normalizedQuery]);
  return <div>
    {selectedSkillItems.length > 0 && <div className="mb-3"><div className="mb-2 flex items-center justify-between gap-3"><p className="text-[0.58rem] font-semibold uppercase tracking-[0.12em] text-muted-foreground">Selected</p><span className="text-[0.58rem] font-medium tabular-nums text-muted-foreground/70">{selectedSkillItems.length}</span></div><div className="flex flex-wrap gap-1.5">{selectedSkillItems.map((skill) => <span key={skill.id} className={`inline-flex max-w-full items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-[0.64rem] font-semibold ${selectedFilterSurface}`}><span className="truncate">{skill.name}</span><button type="button" onClick={() => onToggleSkill(skill.id)} aria-label={`Remove ${skill.name}`} className="flex h-4 w-4 shrink-0 items-center justify-center rounded-sm text-muted-foreground transition-colors hover:bg-surface-3 hover:text-foreground dark:hover:bg-secondary/[0.08] dark:hover:text-secondary"><XIcon size={9} aria-hidden="true" /></button></span>)}</div></div>}
    <div className="relative"><SearchIcon size={13} aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/75" /><Input aria-label="Search skills or categories" value={query} onChange={(event) => onQueryChange(event.target.value)} placeholder="Search skills or categories" className={`h-10 rounded-lg pl-9 pr-9 text-xs ${inputSurface}`} />{query && <button type="button" onClick={() => onQueryChange("")} aria-label="Clear skill search" className="absolute right-2.5 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-surface-3/70 hover:text-foreground/85"><XIcon size={11} aria-hidden="true" /></button>}</div>
    {normalizedQuery.length === 0 ? <p className="mt-2 text-[0.62rem] leading-5 text-muted-foreground">Search by skill or category.</p> : searchResults.length > 0 ? <div className="mt-2 max-h-52 overflow-y-auto overscroll-contain rounded-lg border border-border/55 bg-surface-2/30 p-1 dark:border-border dark:bg-surface-2/55">{searchResults.map((skill) => <button key={skill.id} type="button" onClick={() => onToggleSkill(skill.id)} className="flex w-full items-center justify-between gap-3 rounded-md px-2.5 py-2 text-left transition-colors hover:bg-surface-3/60 dark:hover:bg-surface-3/65"><span className="min-w-0"><span className="block truncate text-xs font-semibold text-foreground/80">{skill.name}</span>{skill.category && <span className="mt-0.5 block truncate text-[0.58rem] text-muted-foreground">{skill.category}</span>}</span><span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-brand-secondary-highlight/[0.07] text-brand-secondary-highlight dark:bg-secondary/[0.07] dark:text-secondary"><PlusSkillIcon /></span></button>)}</div> : <p className="mt-2 text-[0.62rem] leading-5 text-muted-foreground">No matching skills or categories found.</p>}
  </div>;
}
function PlusSkillIcon() {
  return <span className="relative block h-2.5 w-2.5"><span className="absolute left-0 top-1/2 h-px w-2.5 -translate-y-1/2 bg-current" /><span className="absolute left-1/2 top-0 h-2.5 w-px -translate-x-1/2 bg-current" /></span>;
}
function SkillFilterChip({ skill, selected, onClick }: { skill: SkillSummary; selected: boolean; onClick: () => void }) {
  return <button type="button" onClick={onClick} title={skill.name} aria-pressed={selected} className={`max-w-full truncate rounded-md border px-2.5 py-1.5 text-[0.65rem] font-semibold transition-[background-color,border-color,color] duration-150 ${selected ? selectedFilterSurface : unselectedFilterSurface}`}>{skill.name}</button>;
}
function MobileFilterPanel({ children }: { children: ReactNode }) {
  return <div className="mt-3 rounded-xl border border-border/60 bg-surface-2/40 p-3 dark:border-border dark:bg-surface-2/60">{children}</div>;
}
function FilterChip({ selected, label, onClick }: { selected: boolean; label: string; onClick: () => void }) {
  return <button type="button" onClick={onClick} aria-pressed={selected} className={`max-w-full truncate rounded-lg border px-3 py-2 text-xs font-semibold transition-[background-color,border-color,color] duration-150 ${selected ? selectedFilterSurface : unselectedFilterSurface}`}>{label}</button>;
}
function ResponsiveFilterChip({ icon, label, title, active, open, onClick }: { icon: ReactNode; label: string; title: string; active: boolean; open: boolean; onClick: () => void }) {
  return <button type="button" title={title} aria-label={title} aria-expanded={open} onClick={onClick} className={`flex h-9 shrink-0 items-center justify-center rounded-lg border px-2.5 text-xs font-semibold transition-[background-color,border-color,color] duration-150 sm:gap-2 sm:px-3 ${active || open ? selectedFilterSurface : unselectedFilterSurface}`}>{icon}<span className="hidden max-w-32 truncate sm:inline">{label}</span><ChevronDownIcon size={10} aria-hidden="true" className={`hidden transition-transform sm:block ${open ? "rotate-180" : ""}`} /></button>;
}
function VerifiedControl({ value, onChange }: { value: boolean; onChange: (value: boolean) => void }) {
  return <button type="button" role="switch" aria-label="Verified profiles only" aria-checked={value} onClick={() => onChange(!value)} className={`flex w-full items-center gap-3 rounded-lg border px-3 py-3 text-left transition-[background-color,border-color] duration-150 ${value ? "border-foreground/[0.09] bg-foreground/[0.035] dark:border-secondary/15 dark:bg-secondary/[0.04]" : "border-border/60 bg-surface-2/30 hover:border-border/80 hover:bg-surface-3/50 dark:border-border dark:bg-surface-2/55 dark:hover:bg-surface-3/60"}`}>
    <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ring-1 ring-inset ${value ? "bg-brand-secondary-highlight/[0.08] text-brand-secondary-highlight ring-brand-secondary-highlight/10 dark:bg-secondary/[0.07] dark:text-secondary dark:ring-secondary/10" : "bg-surface-3/70 text-muted-foreground ring-border/40 dark:bg-surface-3/60 dark:ring-border"}`}><BadgeCheckIcon size={15} aria-hidden="true" /></span>
    <span className="min-w-0 flex-1"><span className="block text-xs font-semibold text-foreground/80">Verified only</span><span className="mt-0.5 block text-[0.62rem] text-muted-foreground">Show verified profiles.</span></span>
    <span aria-hidden="true" className={`relative h-5 w-9 shrink-0 rounded-full transition-colors duration-150 ${value ? "bg-brand-secondary-highlight/70 dark:bg-secondary/80" : "bg-surface-3 dark:bg-surface-3"}`}><span className={`absolute top-0.5 h-4 w-4 rounded-full bg-surface-1 ring-1 ring-border/50 transition-transform duration-150 ${value ? "translate-x-[18px]" : "translate-x-0.5"}`} /></span>
  </button>;
}
function getAllocatLocation(allocat: FilterableAllocat) { return [allocat.location, allocat.city, allocat.country].filter(Boolean).join(", ").toLowerCase(); }
function getIsVerified(allocat: FilterableAllocat) { return Boolean(allocat.isVerified ?? allocat.verified ?? false); }
function getRating(allocat: FilterableAllocat) { return allocat.averageRating ?? allocat.rating ?? 0; }
function getDateValue(date?: string) { if (!date) return 0; const parsedDate = new Date(date).getTime(); return Number.isNaN(parsedDate) ? 0 : parsedDate; }
function ErrorState({ message }: { message: string }) {
  return <div className="mt-8 border-y border-border/55 py-16 text-center"><span className="mx-auto flex h-11 w-11 items-center justify-center rounded-lg bg-destructive/[0.07] text-destructive"><UsersIcon size={19} aria-hidden="true" /></span><h2 className="mt-5 text-xl font-semibold tracking-[-0.02em] text-foreground/85">We could not load Allocats</h2><p className="mx-auto mt-2 max-w-md text-sm leading-7 text-muted-foreground">{message}</p><Button type="button" onClick={() => window.location.reload()} className={`mt-6 h-10 rounded-lg px-5 text-xs font-semibold shadow-none ${primaryActionButton}`}>Try again</Button></div>;
}
function EmptyState({ onReset }: { onReset: () => void }) {
  return <div className="flex min-h-[320px] flex-col items-center justify-center border-y border-border/55 px-6 text-center"><span className={`flex h-11 w-11 items-center justify-center rounded-lg ${discoverIconSurface}`}><SearchIcon size={18} aria-hidden="true" /></span><h2 className="mt-5 text-xl font-semibold tracking-[-0.02em] text-foreground/85">No Allocats found</h2><p className="mt-2 max-w-md text-sm leading-7 text-muted-foreground">Try changing your search, category, skills or other filters.</p><Button type="button" onClick={onReset} className={`mt-6 h-10 rounded-lg px-5 text-xs font-semibold shadow-none ${primaryActionButton}`}>Reset filters</Button></div>;
}
