// import { useEffect, useMemo, useState } from "react";
// import { useParams } from "react-router-dom";

// import {
//   BadgeCheckIcon,
//   CatIcon,
//   CheckIcon,
//   ChevronDownIcon,
//   CircleDollarSignIcon,
//   Clock3Icon,
//   Grid2X2Icon,
//   ListIcon,
//   MapPinIcon,
//   PawPrintIcon,
//   SearchIcon,
//   SlidersHorizontalIcon,
//   SparklesIcon,
//   StarIcon,
//   UsersIcon,
//   XIcon,
// } from "lucide-react";

// import api from "@/api/axios";

// import type { Project } from "@/Types/project";
// import type { AllocatProfile } from "@/Types/allocatProfile";
// import type { ProjectAllocat } from "@/Types/projectAllocat";
// import type { ProjectAllocatStatus } from "@/Types/enums";

// import { AllocatCardGrid } from "@/components/AllocatCard";
// import MinimalNavMenu from "@/components/MinimalNavMenu";

// import { Input } from "@/components/ui/input";
// import { Slider } from "@/components/ui/slider";
// import { Button } from "@/components/ui/button";

// /* =========================================================
//    TYPES
// ========================================================= */

// type SortOption =
//   | "match"
//   | "rating"
//   | "rate-low"
//   | "experience"
//   | "recent";

// type ViewMode =
//   | "grid"
//   | "list";

// type OpenFilter =
//   | "location"
//   | "rate"
//   | "experience"
//   | null;

// type SkillSummary = {
//   id: string;
//   name: string;
//   categoryId?: string;
//   category?: string;
// };

// type FilterableAllocat = Omit<AllocatProfile, "skills"> & {
//   skills?: SkillSummary[];

//   location?: string;
//   city?: string;
//   country?: string;

//   isVerified?: boolean;
//   verified?: boolean;

//   rating?: number;
//   averageRating?: number;

//   joinedAt?: string;
//   createdAt?: string;
//   updatedAt?: string;
// };

// type MatchedAllocat = FilterableAllocat & {
//   matchScore: number;
//   matchedSkillCount: number;
//   requiredSkillCount: number;
// };

// type AllocatsResponse = {
//   items: FilterableAllocat[];
//   page: number;
//   pageSize: number;
//   totalCount: number;
//   totalPages: number;
// };

// /* =========================================================
//    DEFAULTS
// ========================================================= */

// const DEFAULT_LOCATION = "";
// const DEFAULT_MIN_EXPERIENCE = 0;

// const experienceOptions = [
//   {
//     label: "Any",
//     shortLabel: "Any",
//     suffix: "",
//     value: 0,
//   },
//   {
//     label: "1+ year",
//     shortLabel: "1+",
//     suffix: "yr",
//     value: 1,
//   },
//   {
//     label: "3+ years",
//     shortLabel: "3+",
//     suffix: "yrs",
//     value: 3,
//   },
//   {
//     label: "5+ years",
//     shortLabel: "5+",
//     suffix: "yrs",
//     value: 5,
//   },
//   {
//     label: "10+ years",
//     shortLabel: "10+",
//     suffix: "yrs",
//     value: 10,
//   },
// ];

// /* =========================================================
//    PAGE
// ========================================================= */

// function FindAllocats() {
//   const { projectId } = useParams();

//   const [project, setProject] =
//     useState<Project>();

//   const [allocats, setAllocats] =
//     useState<FilterableAllocat[]>([]);

//   const [projectAllocats, setProjectAllocats] =
//     useState<ProjectAllocat[]>([]);

//   const [location, setLocation] =
//     useState(DEFAULT_LOCATION);

//   const [maxHourlyRate, setMaxHourlyRate] =
//     useState<number | null>(null);

//   const [minExperience, setMinExperience] =
//     useState(DEFAULT_MIN_EXPERIENCE);

//   const [verifiedOnly, setVerifiedOnly] =
//     useState(false);

//   const [openFilter, setOpenFilter] =
//     useState<OpenFilter>(null);

//   const [sortBy, setSortBy] =
//     useState<SortOption>("match");

//   const [viewMode, setViewMode] =
//     useState<ViewMode>("grid");

//   const [loading, setLoading] =
//     useState(true);

//   const [error, setError] =
//     useState<string | null>(null);

//   /* =======================================================
//      LOAD
//   ======================================================= */

//   useEffect(() => {
//     if (!projectId) {
//       setError("No project was selected.");
//       setLoading(false);
//       return;
//     }

//     let cancelled = false;

//     async function loadAllAllocats() {
//       const firstResponse = await api.get<AllocatsResponse>(
//         "/allocats/profiles",
//         {
//           params: {
//             page: 1,
//             pageSize: 100,
//           },
//           withCredentials: true,
//         },
//       );

//       const firstPage =
//         firstResponse.data;

//       if (firstPage.totalPages <= 1) {
//         return Array.isArray(firstPage.items)
//           ? firstPage.items
//           : [];
//       }

//       const remainingPages = await Promise.all(
//         Array.from(
//           {
//             length:
//               firstPage.totalPages - 1,
//           },
//           (_, index) =>
//             api.get<AllocatsResponse>(
//               "/allocats/profiles",
//               {
//                 params: {
//                   page:
//                     index + 2,
//                   pageSize:
//                     firstPage.pageSize,
//                 },
//                 withCredentials:
//                   true,
//               },
//             ),
//         ),
//       );

//       return [
//         ...(firstPage.items ?? []),

//         ...remainingPages.flatMap(
//           response =>
//             response.data.items ?? [],
//         ),
//       ];
//     }

//     async function loadPage() {
//       setLoading(true);
//       setError(null);

//       try {
//         const [
//           projectResponse,
//           allAllocats,
//           projectAllocatsResponse,
//         ] = await Promise.all([
//           api.get<Project>(
//             `/projects/${projectId}`,
//             {
//               withCredentials: true,
//             },
//           ),

//           loadAllAllocats(),

//           api.get<ProjectAllocat[]>(
//             `/projects/${projectId}/allocats`,
//             {
//               withCredentials: true,
//             },
//           ),
//         ]);

//         if (cancelled) {
//           return;
//         }

//         setProject(
//           projectResponse.data,
//         );

//         setAllocats(
//           allAllocats,
//         );

//         setProjectAllocats(
//           Array.isArray(
//             projectAllocatsResponse.data,
//           )
//             ? projectAllocatsResponse.data
//             : [],
//         );
//       } catch (requestError) {
//         if (cancelled) {
//           return;
//         }

//         console.error(
//           "Could not load matching Allocats:",
//           requestError,
//         );

//         setError(
//           "We could not load the professionals for this project. Please try again.",
//         );
//       } finally {
//         if (!cancelled) {
//           setLoading(false);
//         }
//       }
//     }

//     void loadPage();

//     return () => {
//       cancelled = true;
//     };
//   }, [projectId]);

//   /* =======================================================
//      SKILL MATCHING
//   ======================================================= */

//   const projectSkillIds = useMemo(() => {
//     return new Set(
//       (project?.skills ?? []).map(
//         skill => skill.id,
//       ),
//     );
//   }, [project]);

//   const skillMatchedAllocats =
//     useMemo<MatchedAllocat[]>(() => {
//       if (projectSkillIds.size === 0) {
//         return [];
//       }

//       return allocats
//         .filter(
//           allocat =>
//             (allocat.skills?.length ?? 0) > 0,
//         )
//         .map(allocat => {
//           const matchedSkillCount = (
//             allocat.skills ?? []
//           ).filter(
//             skill =>
//               projectSkillIds.has(skill.id),
//           ).length;

//           const matchScore = Math.round(
//             (
//               matchedSkillCount /
//               projectSkillIds.size
//             ) * 100,
//           );

//           return {
//             ...allocat,
//             matchScore,
//             matchedSkillCount,
//             requiredSkillCount:
//               projectSkillIds.size,
//           };
//         })
//         .filter(
//           allocat =>
//             allocat.matchedSkillCount > 0,
//         );
//     }, [
//       allocats,
//       projectSkillIds,
//     ]);

//   /* =======================================================
//      RATE RANGE
//   ======================================================= */

//   const rateCeiling = useMemo(() => {
//     const highestRate = Math.max(
//       ...skillMatchedAllocats.map(
//         allocat =>
//           allocat.hourlyRate ?? 0,
//       ),
//       100,
//     );

//     return (
//       Math.ceil(
//         highestRate / 10,
//       ) * 10
//     );
//   }, [skillMatchedAllocats]);

//   /* =======================================================
//      FILTERING
//   ======================================================= */

//   const filteredAllocats = useMemo(() => {
//     const normalizedLocation =
//       location
//         .trim()
//         .toLowerCase();

//     const results =
//       skillMatchedAllocats.filter(allocat => {
//         const yearsExperience =
//           allocat.yearsExperience ?? 0;

//         const allocatLocation =
//           getAllocatLocation(allocat);

//         const matchesLocation =
//           !normalizedLocation ||
//           (
//             Boolean(allocatLocation) &&
//             (
//               allocatLocation.includes(
//                 normalizedLocation,
//               ) ||
//               normalizedLocation.includes(
//                 allocatLocation,
//               )
//             )
//           );

//         const matchesRate =
//           maxHourlyRate === null ||
//           allocat.hourlyRate === null ||
//           allocat.hourlyRate === undefined ||
//           allocat.hourlyRate <= maxHourlyRate;

//         const matchesExperience =
//           yearsExperience >= minExperience;

//         const matchesVerified =
//           !verifiedOnly ||
//           getIsVerified(allocat);

//         return (
//           matchesLocation &&
//           matchesRate &&
//           matchesExperience &&
//           matchesVerified
//         );
//       });

//     return [...results].sort((a, b) => {
//       switch (sortBy) {
//         case "rating":
//           return (
//             getRating(b) -
//             getRating(a)
//           );

//         case "rate-low":
//           return (
//             (
//               a.hourlyRate ??
//               Number.MAX_SAFE_INTEGER
//             ) -
//             (
//               b.hourlyRate ??
//               Number.MAX_SAFE_INTEGER
//             )
//           );

//         case "experience":
//           return (
//             (b.yearsExperience ?? 0) -
//             (a.yearsExperience ?? 0)
//           );

//         case "recent":
//           return (
//             getDateValue(
//               b.updatedAt ??
//               b.createdAt ??
//               b.joinedAt,
//             ) -
//             getDateValue(
//               a.updatedAt ??
//               a.createdAt ??
//               a.joinedAt,
//             )
//           );

//         case "match":
//         default:
//           if (
//             b.matchScore !==
//             a.matchScore
//           ) {
//             return (
//               b.matchScore -
//               a.matchScore
//             );
//           }

//           if (
//             b.matchedSkillCount !==
//             a.matchedSkillCount
//           ) {
//             return (
//               b.matchedSkillCount -
//               a.matchedSkillCount
//             );
//           }

//           return (
//             getRating(b) -
//             getRating(a)
//           );
//       }
//     });
//   }, [
//     skillMatchedAllocats,
//     location,
//     maxHourlyRate,
//     minExperience,
//     verifiedOnly,
//     sortBy,
//   ]);

//   /* =======================================================
//      RELATIONSHIPS
//   ======================================================= */

//   const relationshipStatusByAllocat =
//     useMemo(() => {
//       return new Map<
//         string,
//         ProjectAllocatStatus
//       >(
//         projectAllocats.map(
//           relationship => [
//             relationship.allocatProfileId,
//             relationship.status,
//           ],
//         ),
//       );
//     }, [projectAllocats]);

//   /* =======================================================
//      FILTER COUNT
//   ======================================================= */

//   const activeFilterCount = useMemo(() => {
//     let count = 0;

//     if (
//       location !==
//       DEFAULT_LOCATION
//     ) {
//       count += 1;
//     }

//     if (
//       maxHourlyRate !== null
//     ) {
//       count += 1;
//     }

//     if (
//       minExperience !==
//       DEFAULT_MIN_EXPERIENCE
//     ) {
//       count += 1;
//     }

//     if (verifiedOnly) {
//       count += 1;
//     }

//     return count;
//   }, [
//     location,
//     maxHourlyRate,
//     minExperience,
//     verifiedOnly,
//   ]);

//   /* =======================================================
//      ACTIONS
//   ======================================================= */

//   function toggleFilter(
//     filter: OpenFilter,
//   ) {
//     setOpenFilter(current =>
//       current === filter
//         ? null
//         : filter,
//     );
//   }

//   function resetFilters() {
//     setLocation(DEFAULT_LOCATION);
//     setMaxHourlyRate(null);

//     setMinExperience(
//       DEFAULT_MIN_EXPERIENCE,
//     );

//     setVerifiedOnly(false);
//     setSortBy("match");
//     setOpenFilter(null);
//   }

//   function handleStatusChange(
//     allocatProfileId: string,
//     status: ProjectAllocatStatus,
//   ) {
//     if (!project) {
//       return;
//     }

//     setProjectAllocats(current => {
//       const existing =
//         current.find(
//           relationship =>
//             relationship.allocatProfileId ===
//             allocatProfileId,
//         );

//       if (existing) {
//         return current.map(
//           relationship =>
//             relationship.allocatProfileId ===
//             allocatProfileId
//               ? {
//                   ...relationship,
//                   status,
//                 }
//               : relationship,
//         );
//       }

//       return [
//         ...current,
//         {
//           projectId: project.id,
//           allocatProfileId,
//           status,
//           invitedAt:
//             new Date().toISOString(),
//           respondedAt: null,
//           removedAt: null,
//         },
//       ];
//     });
//   }

//   /* =======================================================
//      RENDER
//   ======================================================= */

//   return (
//     <div className="min-h-screen bg-background text-foreground">

//       {/* HEADER */}

//       <header className="sticky top-0 z-40 border-b border-border/60 bg-background/90 backdrop-blur-xl">
//         <div className="container mx-auto px-4 sm:px-6 lg:px-8">
//           <MinimalNavMenu />
//         </div>
//       </header>

//       <main className="container mx-auto px-4 py-7 sm:px-5 md:px-8 lg:py-12">

//         {/* =================================================
//             INTRO
//         ================================================= */}

//         <section className="pb-7">
//           <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
//             <div className="min-w-0 max-w-4xl">

//               <div className="flex items-center gap-2.5">
//                 <span
//                   className={[
//                     "flex h-8 w-8 items-center justify-center rounded-lg",
//                     "bg-primary text-brand-primary",
//                     "shadow-sm shadow-primary/10",
//                     "dark:text-primary-foreground",
//                   ].join(" ")}
//                 >
//                   <UsersIcon
//                     size={15}
//                   />
//                 </span>

//                 <p className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
//                   Find Allocats
//                 </p>
//               </div>

//               {loading ? (
//                 <>
//                   <h1 className="mt-5 text-3xl font-black leading-[1.02] tracking-[-0.035em] sm:text-4xl lg:text-5xl">
//                     Finding your best Allocats
//                   </h1>

//                   <p className="mt-4 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
//                     Our matching cat is pawing through professional profiles.
//                   </p>
//                 </>
//               ) : (
//                 <>
//                   <h1 className="mt-5 max-w-4xl text-3xl font-black leading-[1.02] tracking-[-0.035em] sm:text-4xl lg:text-5xl">
//                     Find Allocats for{" "}
//                     <span>
//                       {project?.title || "your project"}
//                     </span>
//                   </h1>

//                   <p className="mt-4 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
//                     Discover suitable professionals and refine the results
//                     by rate, experience, location and verification.
//                   </p>
//                 </>
//               )}
//             </div>

//             {!loading && !error && (
//               <div className="hidden items-center gap-3 border-l border-border pl-5 sm:flex">
//                 <span className="text-3xl font-black tracking-[-0.04em]">
//                   {filteredAllocats.length}
//                 </span>

//                 <div>
//                   <p className="text-xs font-semibold">
//                     {filteredAllocats.length === 1
//                       ? "Allocat"
//                       : "Allocats"}
//                   </p>

//                   <p className="text-[0.68rem] text-muted-foreground">
//                     available
//                   </p>
//                 </div>
//               </div>
//             )}
//           </div>
//         </section>

//         {error ? (
//           <ErrorState
//             message={error}
//           />
//         ) : loading ? (
//           <AllocatLoadingState />
//         ) : (
//           <div
//             className={[
//               "border-t border-border/70",
//               "lg:grid lg:grid-cols-[245px_minmax(0,1fr)]",
//               "lg:gap-8 xl:grid-cols-[265px_minmax(0,1fr)] xl:gap-10",
//             ].join(" ")}
//           >

//             {/* =================================================
//                 DESKTOP SIDEBAR
//             ================================================= */}

//             <aside className="hidden lg:block">
//               <div className="sticky top-24 py-7">

//                 {/* FILTER HEADER */}

//                 <div className="flex items-center justify-between gap-3">
//                   <div className="flex items-center gap-2">
//                     <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/[0.08] text-primary">
//                       <SlidersHorizontalIcon
//                         size={14}
//                       />
//                     </span>

//                     <h2 className="text-sm font-bold">
//                       Refine
//                     </h2>

//                     {activeFilterCount > 0 && (
//                       <span
//                         className={[
//                           "flex h-5 min-w-5 items-center justify-center rounded-md",
//                           "bg-primary px-1.5",
//                           "text-[0.6rem] font-black text-brand-primary",
//                           "dark:text-primary-foreground",
//                         ].join(" ")}
//                       >
//                         {activeFilterCount}
//                       </span>
//                     )}
//                   </div>

//                   {activeFilterCount > 0 && (
//                     <button
//                       type="button"
//                       onClick={resetFilters}
//                       className="text-[0.65rem] font-semibold text-muted-foreground transition-colors hover:text-foreground"
//                     >
//                       Reset
//                     </button>
//                   )}
//                 </div>

//                 <p className="mt-2 text-xs leading-5 text-muted-foreground">
//                   Narrow down the professionals shown for this project.
//                 </p>

//                 <div className="mt-6 divide-y divide-border">

//                   {/* LOCATION */}

//                   <DesktopFilterSection title="Location">
//                     <div className="relative">
//                       <MapPinIcon
//                         size={14}
//                         className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
//                       />

//                       <Input
//                         value={location}
//                         onChange={event =>
//                           setLocation(
//                             event.target.value,
//                           )
//                         }
//                         placeholder="City or area"
//                         className={[
//                           "h-10 rounded-lg bg-background pl-9 text-xs shadow-none",
//                           "focus-visible:bg-background",
//                           "focus-visible:ring-1 focus-visible:ring-primary/40",
//                         ].join(" ")}
//                       />
//                     </div>
//                   </DesktopFilterSection>

//                   {/* RATE */}

//                   <DesktopFilterSection title="Hourly rate">
//                     <div className="mb-4 flex items-center justify-between">
//                       <span className="text-[0.68rem] text-muted-foreground">
//                         Maximum
//                       </span>

//                       <span className="text-xs font-bold">
//                         {maxHourlyRate === null
//                           ? "Any"
//                           : `US$${maxHourlyRate}/hr`}
//                       </span>
//                     </div>

//                     <Slider
//                       value={[
//                         maxHourlyRate ??
//                         rateCeiling,
//                       ]}
//                       min={0}
//                       max={rateCeiling}
//                       step={1}
//                       onValueChange={([value]) =>
//                         setMaxHourlyRate(value)
//                       }
//                     />

//                     <div className="mt-3 flex items-center justify-between">
//                       <span className="text-[0.62rem] text-muted-foreground">
//                         US$0
//                       </span>

//                       {maxHourlyRate !== null ? (
//                         <button
//                           type="button"
//                           onClick={() =>
//                             setMaxHourlyRate(null)
//                           }
//                           className="text-[0.62rem] font-semibold text-foreground underline decoration-primary/50 underline-offset-4"
//                         >
//                           Any rate
//                         </button>
//                       ) : (
//                         <span className="text-[0.62rem] text-muted-foreground">
//                           US${rateCeiling}+
//                         </span>
//                       )}
//                     </div>
//                   </DesktopFilterSection>

//                   {/* EXPERIENCE */}

//                   <DesktopFilterSection title="Experience">
//                     <div className="mb-3 flex items-center justify-between">
//                       <span className="text-[0.65rem] text-muted-foreground">
//                         Minimum experience
//                       </span>

//                       <span className="text-[0.65rem] font-bold">
//                         {minExperience === 0
//                           ? "Any"
//                           : `${minExperience}+ years`}
//                       </span>
//                     </div>

//                     <div className="grid grid-cols-5 gap-1.5">
//                       {experienceOptions.map(option => {
//                         const selected =
//                           minExperience === option.value;

//                         return (
//                           <button
//                             key={option.value}
//                             type="button"
//                             title={option.label}
//                             onClick={() =>
//                               setMinExperience(
//                                 option.value,
//                               )
//                             }
//                             className={[
//                               "flex h-12 min-w-0 flex-col items-center justify-center rounded-lg border",
//                               "transition-all duration-200",

//                               selected
//                                 ? [
//                                     "border-primary",
//                                     "bg-primary",
//                                     "text-brand-primary",
//                                     "shadow-sm shadow-primary/10",
//                                     "dark:text-primary-foreground",
//                                   ].join(" ")
//                                 : [
//                                     "border-border",
//                                     "bg-background",
//                                     "text-muted-foreground",
//                                     "hover:border-foreground/15",
//                                     "hover:bg-muted/40",
//                                     "hover:text-foreground",
//                                   ].join(" "),
//                             ].join(" ")}
//                           >
//                             <span className="text-[0.68rem] font-black leading-none">
//                               {option.shortLabel}
//                             </span>

//                             {option.suffix && (
//                               <span
//                                 className={[
//                                   "mt-1 text-[0.5rem] font-semibold uppercase tracking-[0.08em]",

//                                   selected
//                                     ? "text-brand-primary/75 dark:text-primary-foreground/70"
//                                     : "text-muted-foreground/70",
//                                 ].join(" ")}
//                               >
//                                 {option.suffix}
//                               </span>
//                             )}
//                           </button>
//                         );
//                       })}
//                     </div>
//                   </DesktopFilterSection>

//                   {/* VERIFIED */}

//                   <DesktopFilterSection title="Verification">
//                     <button
//                       type="button"
//                       role="switch"
//                       aria-checked={verifiedOnly}
//                       onClick={() =>
//                         setVerifiedOnly(
//                           current => !current,
//                         )
//                       }
//                       className={[
//                         "flex w-full items-center gap-3 rounded-lg border px-3 py-3",
//                         "text-left transition-colors",

//                         verifiedOnly
//                           ? [
//                               "border-primary/30",
//                               "bg-primary/[0.055]",
//                               "shadow-sm shadow-primary/[0.04]",
//                             ].join(" ")
//                           : "border-border hover:bg-muted/30",
//                       ].join(" ")}
//                     >
//                       <span
//                         className={[
//                           "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",

//                           verifiedOnly
//                             ? [
//                                 "bg-primary",
//                                 "text-brand-primary",
//                                 "dark:text-primary-foreground",
//                               ].join(" ")
//                             : "bg-muted text-muted-foreground",
//                         ].join(" ")}
//                       >
//                         <BadgeCheckIcon
//                           size={15}
//                         />
//                       </span>

//                       <span className="min-w-0 flex-1">
//                         <span className="block text-xs font-bold">
//                           Verified only
//                         </span>

//                         <span className="mt-0.5 block text-[0.62rem] text-muted-foreground">
//                           Show verified profiles.
//                         </span>
//                       </span>

//                       <span
//                         className={[
//                           "relative h-5 w-9 shrink-0 rounded-full transition-colors",

//                           verifiedOnly
//                             ? "bg-primary"
//                             : "bg-muted-foreground/25",
//                         ].join(" ")}
//                       >
//                         <span
//                           className={[
//                             "absolute top-0.5 h-4 w-4 rounded-full shadow-sm",
//                             "transition-transform",

//                             verifiedOnly
//                               ? [
//                                   "translate-x-[18px]",
//                                   "bg-brand-primary",
//                                   "dark:bg-primary-foreground",
//                                 ].join(" ")
//                               : "translate-x-0.5 bg-background",
//                           ].join(" ")}
//                         />
//                       </span>
//                     </button>
//                   </DesktopFilterSection>
//                 </div>
//               </div>
//             </aside>

//             {/* =================================================
//                 CONTENT
//             ================================================= */}

//             <div className="min-w-0">

//               {/* =================================================
//                   MOBILE / TABLET FILTERS
//               ================================================= */}

//               <section className="py-4 lg:hidden">
//                 <div className="flex items-center gap-1.5 sm:gap-2">

//                   {/* REFINE */}

//                   <div className="mr-auto flex min-w-0 items-center gap-2">
//                     <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/[0.08] text-primary">
//                       <SlidersHorizontalIcon
//                         size={14}
//                       />
//                     </span>

//                     <span className="hidden text-xs font-semibold sm:inline">
//                       Refine
//                     </span>

//                     {activeFilterCount > 0 && (
//                       <span
//                         className={[
//                           "flex h-5 min-w-5 items-center justify-center rounded-md",
//                           "bg-primary px-1",
//                           "text-[0.58rem] font-black text-brand-primary",
//                           "dark:text-primary-foreground",
//                         ].join(" ")}
//                       >
//                         {activeFilterCount}
//                       </span>
//                     )}
//                   </div>

//                   {/* LOCATION */}

//                   <ResponsiveFilterChip
//                     icon={
//                       <MapPinIcon
//                         size={13}
//                       />
//                     }
//                     label={
//                       location ||
//                       "Location"
//                     }
//                     title="Location"
//                     active={Boolean(location)}
//                     open={
//                       openFilter ===
//                       "location"
//                     }
//                     onClick={() =>
//                       toggleFilter(
//                         "location",
//                       )
//                     }
//                   />

//                   {/* RATE */}

//                   <ResponsiveFilterChip
//                     icon={
//                       <CircleDollarSignIcon
//                         size={13}
//                       />
//                     }
//                     label={
//                       maxHourlyRate === null
//                         ? "Rate"
//                         : `US$${maxHourlyRate}`
//                     }
//                     title="Hourly rate"
//                     active={
//                       maxHourlyRate !==
//                       null
//                     }
//                     open={
//                       openFilter ===
//                       "rate"
//                     }
//                     onClick={() =>
//                       toggleFilter(
//                         "rate",
//                       )
//                     }
//                   />

//                   {/* EXPERIENCE */}

//                   <ResponsiveFilterChip
//                     icon={
//                       <Clock3Icon
//                         size={13}
//                       />
//                     }
//                     label={
//                       minExperience === 0
//                         ? "Experience"
//                         : `${minExperience}+ yrs`
//                     }
//                     title="Experience"
//                     active={
//                       minExperience > 0
//                     }
//                     open={
//                       openFilter ===
//                       "experience"
//                     }
//                     onClick={() =>
//                       toggleFilter(
//                         "experience",
//                       )
//                     }
//                   />

//                   {/* VERIFIED */}

//                   <button
//                     type="button"
//                     title="Verified only"
//                     aria-label="Verified only"
//                     onClick={() =>
//                       setVerifiedOnly(
//                         current => !current,
//                       )
//                     }
//                     className={[
//                       "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border",
//                       "text-xs font-semibold transition-colors",
//                       "sm:w-auto sm:gap-2 sm:px-3",

//                       verifiedOnly
//                         ? [
//                             "border-primary",
//                             "bg-primary",
//                             "text-brand-primary",
//                             "dark:text-primary-foreground",
//                           ].join(" ")
//                         : [
//                             "border-border",
//                             "bg-background",
//                             "text-muted-foreground",
//                             "hover:bg-muted/40",
//                             "hover:text-foreground",
//                           ].join(" "),
//                     ].join(" ")}
//                   >
//                     <BadgeCheckIcon
//                       size={13}
//                     />

//                     <span className="hidden sm:inline">
//                       Verified
//                     </span>

//                     {verifiedOnly && (
//                       <CheckIcon
//                         size={10}
//                         strokeWidth={3}
//                         className="hidden sm:block"
//                       />
//                     )}
//                   </button>

//                   {/* CLEAR */}

//                   {activeFilterCount > 0 && (
//                     <button
//                       type="button"
//                       title="Clear filters"
//                       aria-label="Clear filters"
//                       onClick={resetFilters}
//                       className={[
//                         "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
//                         "text-muted-foreground transition-colors",
//                         "hover:bg-muted hover:text-foreground",
//                         "sm:w-auto sm:gap-1.5 sm:px-2.5 sm:text-xs",
//                       ].join(" ")}
//                     >
//                       <XIcon
//                         size={13}
//                       />

//                       <span className="hidden sm:inline">
//                         Clear
//                       </span>
//                     </button>
//                   )}
//                 </div>

//                 {/* LOCATION PANEL */}

//                 {openFilter === "location" && (
//                   <div className="mt-3 max-w-sm rounded-xl border border-border bg-muted/[0.12] p-3">
//                     <div className="relative">
//                       <MapPinIcon
//                         size={14}
//                         className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
//                       />

//                       <Input
//                         value={location}
//                         onChange={event =>
//                           setLocation(
//                             event.target.value,
//                           )
//                         }
//                         placeholder="City or area"
//                         className={[
//                           "h-10 rounded-lg bg-background pl-9 shadow-none",
//                           "focus-visible:bg-background",
//                           "focus-visible:ring-1 focus-visible:ring-primary/40",
//                         ].join(" ")}
//                       />
//                     </div>
//                   </div>
//                 )}

//                 {/* RATE PANEL */}

//                 {openFilter === "rate" && (
//                   <div className="mt-3 max-w-md rounded-xl border border-border bg-muted/[0.12] p-4">
//                     <div className="mb-4 flex items-center justify-between gap-4">
//                       <div>
//                         <p className="text-xs font-bold">
//                           Maximum hourly rate
//                         </p>

//                         <p className="mt-1 text-[0.65rem] text-muted-foreground">
//                           {maxHourlyRate === null
//                             ? "No rate limit"
//                             : `Up to US$${maxHourlyRate} per hour`}
//                         </p>
//                       </div>

//                       {maxHourlyRate !== null && (
//                         <button
//                           type="button"
//                           onClick={() =>
//                             setMaxHourlyRate(null)
//                           }
//                           className="text-[0.65rem] font-semibold text-foreground underline decoration-primary/50 underline-offset-4"
//                         >
//                           Any rate
//                         </button>
//                       )}
//                     </div>

//                     <Slider
//                       value={[
//                         maxHourlyRate ??
//                         rateCeiling,
//                       ]}
//                       min={0}
//                       max={rateCeiling}
//                       step={1}
//                       onValueChange={([value]) =>
//                         setMaxHourlyRate(value)
//                       }
//                     />

//                     <div className="mt-3 flex justify-between text-[0.62rem] text-muted-foreground">
//                       <span>
//                         US$0
//                       </span>

//                       <span>
//                         US${rateCeiling}+
//                       </span>
//                     </div>
//                   </div>
//                 )}

//                 {/* EXPERIENCE PANEL */}

//                 {openFilter === "experience" && (
//                   <div className="mt-3 max-w-xl rounded-xl border border-border bg-muted/[0.12] p-3">
//                     <div className="grid grid-cols-5 gap-1.5">
//                       {experienceOptions.map(option => {
//                         const selected =
//                           minExperience === option.value;

//                         return (
//                           <button
//                             key={option.value}
//                             type="button"
//                             onClick={() =>
//                               setMinExperience(
//                                 option.value,
//                               )
//                             }
//                             className={[
//                               "flex min-h-10 flex-col items-center justify-center rounded-lg border px-1.5",
//                               "transition-colors",

//                               selected
//                                 ? [
//                                     "border-primary",
//                                     "bg-primary",
//                                     "text-brand-primary",
//                                     "dark:text-primary-foreground",
//                                   ].join(" ")
//                                 : [
//                                     "border-border",
//                                     "bg-background",
//                                     "text-muted-foreground",
//                                     "hover:bg-muted/50",
//                                     "hover:text-foreground",
//                                   ].join(" "),
//                             ].join(" ")}
//                           >
//                             <span className="text-[0.65rem] font-black">
//                               {option.shortLabel}
//                             </span>

//                             {option.suffix && (
//                               <span
//                                 className={[
//                                   "text-[0.48rem] font-semibold uppercase",

//                                   selected
//                                     ? "text-brand-primary/75 dark:text-primary-foreground/70"
//                                     : "text-muted-foreground/70",
//                                 ].join(" ")}
//                               >
//                                 {option.suffix}
//                               </span>
//                             )}
//                           </button>
//                         );
//                       })}
//                     </div>
//                   </div>
//                 )}
//               </section>

//               {/* =================================================
//                   RESULTS HEADER
//               ================================================= */}

//               <section className="relative flex items-center justify-between gap-3 border-t border-border/70 py-5 lg:border-t-0 lg:py-7">
//                 <div className="min-w-0">
//                   <p className="hidden text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground sm:block">
//                     Recommendations
//                   </p>

//                   <div className="flex min-w-0 items-center gap-2 sm:mt-1">
//                     <h2 className="truncate text-sm font-bold tracking-[-0.02em] sm:text-lg">
//                       Best matches
//                     </h2>

//                     <span
//                       className={[
//                         "shrink-0 rounded-full bg-primary px-2 py-0.5",
//                         "text-[0.58rem] font-black text-brand-primary",
//                         "dark:text-primary-foreground",
//                         "sm:hidden",
//                       ].join(" ")}
//                     >
//                       {filteredAllocats.length}
//                     </span>
//                   </div>
//                 </div>

//                 <div className="flex shrink-0 items-center gap-2">
//                   <SortDropdown
//                     value={sortBy}
//                     onChange={setSortBy}
//                   />

//                   <ViewToggle
//                     value={viewMode}
//                     onChange={setViewMode}
//                   />
//                 </div>
//               </section>

//               {/* =================================================
//                   RESULTS
//               ================================================= */}

//               <section>
//                 {projectSkillIds.size === 0 ? (
//                   <NoMatchesState />
//                 ) : skillMatchedAllocats.length === 0 ? (
//                   <NoMatchesState />
//                 ) : filteredAllocats.length > 0 ? (
//                   <div
//                     className={
//                       viewMode === "grid"
//                         ? "grid gap-5 sm:grid-cols-2 xl:grid-cols-3"
//                         : "grid grid-cols-1 gap-3 sm:gap-4"
//                     }
//                   >
//                     {filteredAllocats.map(allocat => {
//                       const relationshipStatus =
//                         relationshipStatusByAllocat.get(
//                           allocat.allocatrUserId,
//                         ) ?? null;

//                       return (
//                         <div
//                           key={allocat.allocatrUserId}
//                           className="min-w-0"
//                         >
//                           <AllocatCardGrid
//                             allocat={allocat}
//                             project={project}
//                             viewMode={viewMode}
//                             relationshipStatus={
//                               relationshipStatus
//                             }
//                             onStatusChange={status =>
//                               handleStatusChange(
//                                 allocat.allocatrUserId,
//                                 status,
//                               )
//                             }
//                           />
//                         </div>
//                       );
//                     })}
//                   </div>
//                 ) : (
//                   <EmptyState
//                     onReset={resetFilters}
//                   />
//                 )}
//               </section>
//             </div>
//           </div>
//         )}
//       </main>
//     </div>
//   );
// }

// /* =========================================================
//    LOADING
// ========================================================= */

// function AllocatLoadingState() {
//   return (
//     <div
//       role="status"
//       aria-live="polite"
//       className={[
//         "relative flex min-h-[380px] overflow-hidden",
//         "flex-col items-center justify-center",
//         "rounded-2xl border border-border",
//         "bg-muted/[0.10] px-6 text-center",
//       ].join(" ")}
//     >
//       <div className="pointer-events-none absolute inset-0 overflow-hidden">
//         <div className="absolute left-1/2 top-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/[0.04] blur-3xl" />
//       </div>

//       <div className="relative">

//         {/* CAT */}

//         <div
//           className={[
//             "relative mx-auto flex h-16 w-16 items-center justify-center rounded-2xl",
//             "bg-primary text-brand-primary",
//             "shadow-lg shadow-primary/10",
//             "dark:text-primary-foreground",
//           ].join(" ")}
//         >
//           <CatIcon
//             size={28}
//             strokeWidth={1.8}
//           />

//           <span className="absolute -right-2 -top-2 flex h-7 w-7 animate-bounce items-center justify-center rounded-full border-2 border-background bg-background text-foreground shadow-sm">
//             <SparklesIcon
//               size={12}
//             />
//           </span>
//         </div>

//         {/* PAWS */}

//         <div className="mt-5 flex justify-center gap-2 text-muted-foreground">
//           <PawPrintIcon
//             size={14}
//             className="animate-pulse"
//           />

//           <PawPrintIcon
//             size={14}
//             className="animate-pulse [animation-delay:150ms]"
//           />

//           <PawPrintIcon
//             size={14}
//             className="animate-pulse [animation-delay:300ms]"
//           />
//         </div>

//         <h2 className="mt-5 text-lg font-black tracking-[-0.025em] sm:text-xl">
//           Sniffing out the best matches
//         </h2>

//         <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-muted-foreground">
//           Give the cat a moment. It's checking skills, experience and
//           professional profiles without knocking anything off the desk.
//         </p>

//         <div className="mx-auto mt-6 flex w-fit items-center gap-2 rounded-full border border-border bg-background px-3 py-1.5">
//           <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />

//           <span className="text-[0.65rem] font-semibold text-foreground">
//             Searching Allocats
//           </span>
//         </div>
//       </div>
//     </div>
//   );
// }

// /* =========================================================
//    DESKTOP FILTER SECTION
// ========================================================= */

// function DesktopFilterSection({
//   title,
//   children,
// }: {
//   title: string;
//   children: React.ReactNode;
// }) {
//   return (
//     <section className="py-5">
//       <p className="mb-3 text-xs font-bold">
//         {title}
//       </p>

//       {children}
//     </section>
//   );
// }

// /* =========================================================
//    RESPONSIVE FILTER CHIP
// ========================================================= */

// function ResponsiveFilterChip({
//   icon,
//   label,
//   title,
//   active,
//   open,
//   onClick,
// }: {
//   icon: React.ReactNode;
//   label: string;
//   title: string;
//   active: boolean;
//   open: boolean;
//   onClick: () => void;
// }) {
//   return (
//     <button
//       type="button"
//       title={title}
//       aria-label={title}
//       onClick={onClick}
//       className={[
//         "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border",
//         "text-xs font-semibold transition-all",
//         "sm:w-auto sm:gap-2 sm:px-3",

//         active || open
//           ? [
//               "border-primary",
//               "bg-primary",
//               "text-brand-primary",
//               "dark:text-primary-foreground",
//             ].join(" ")
//           : [
//               "border-border",
//               "bg-background",
//               "text-muted-foreground",
//               "hover:bg-muted/40",
//               "hover:text-foreground",
//             ].join(" "),
//       ].join(" ")}
//     >
//       {icon}

//       <span className="hidden max-w-32 truncate sm:inline">
//         {label}
//       </span>

//       <ChevronDownIcon
//         size={10}
//         className={[
//           "hidden transition-transform sm:block",

//           open
//             ? "rotate-180"
//             : "",
//         ].join(" ")}
//       />
//     </button>
//   );
// }

// /* =========================================================
//    SORT OPTIONS
// ========================================================= */

// const sortOptions: {
//   value: SortOption;
//   label: string;
//   description: string;
// }[] = [
//   {
//     value: "match",
//     label: "Best match",
//     description: "Most relevant first",
//   },
//   {
//     value: "rating",
//     label: "Highest rated",
//     description: "Top rated professionals",
//   },
//   {
//     value: "rate-low",
//     label: "Lowest rate",
//     description: "Lowest hourly rate first",
//   },
//   {
//     value: "experience",
//     label: "Most experienced",
//     description: "Most years first",
//   },
//   {
//     value: "recent",
//     label: "Recently active",
//     description: "Newest activity first",
//   },
// ];

// /* =========================================================
//    SORT DROPDOWN
// ========================================================= */

// function SortDropdown({
//   value,
//   onChange,
// }: {
//   value: SortOption;
//   onChange: (
//     value: SortOption,
//   ) => void;
// }) {
//   const [open, setOpen] =
//     useState(false);

//   const selected =
//     sortOptions.find(
//       option =>
//         option.value === value,
//     ) ??
//     sortOptions[0];

//   function selectOption(
//     option: SortOption,
//   ) {
//     onChange(option);
//     setOpen(false);
//   }

//   return (
//     <div className="static sm:relative">
//       <button
//         type="button"
//         title={`Sort: ${selected.label}`}
//         aria-label={`Sort results: ${selected.label}`}
//         aria-expanded={open}
//         onClick={() =>
//           setOpen(
//             current => !current,
//           )
//         }
//         className={[
//           "flex h-10 w-10 items-center justify-center rounded-lg border",
//           "border-border bg-background transition-all",
//           "sm:w-auto sm:min-w-[170px] sm:justify-between sm:gap-3 sm:px-3",
//           "hover:bg-muted/40",

//           open
//             ? "border-primary/30 bg-primary/[0.04] ring-1 ring-primary/20"
//             : "",
//         ].join(" ")}
//       >
//         <span className="flex min-w-0 items-center gap-2.5">
//           <span
//             className={[
//               "flex h-7 w-7 shrink-0 items-center justify-center rounded-md",
//               "bg-primary text-brand-primary",
//               "dark:text-primary-foreground",
//             ].join(" ")}
//           >
//             <StarIcon
//               size={12}
//             />
//           </span>

//           <span className="hidden truncate text-xs font-semibold sm:block">
//             {selected.label}
//           </span>
//         </span>

//         <ChevronDownIcon
//           size={12}
//           className={[
//             "hidden shrink-0 text-muted-foreground transition-transform sm:block",

//             open
//               ? "rotate-180"
//               : "",
//           ].join(" ")}
//         />
//       </button>

//       {open && (
//         <div
//           className={[
//             "absolute right-0 top-full z-50 mt-2",
//             "w-[min(16rem,calc(100vw-2rem))]",
//             "overflow-hidden rounded-xl",
//             "border border-border bg-popover p-1.5",
//             "text-popover-foreground shadow-xl",
//           ].join(" ")}
//         >
//           {sortOptions.map(option => {
//             const isSelected =
//               option.value === value;

//             return (
//               <button
//                 key={option.value}
//                 type="button"
//                 onClick={() =>
//                   selectOption(
//                     option.value,
//                   )
//                 }
//                 className={[
//                   "flex w-full items-center gap-3 rounded-lg px-3 py-2.5",
//                   "text-left text-popover-foreground transition-colors",

//                   isSelected
//                     ? "bg-primary/[0.07]"
//                     : "hover:bg-muted/60",
//                 ].join(" ")}
//               >
//                 <span
//                   className={[
//                     "flex h-7 w-7 shrink-0 items-center justify-center rounded-md",

//                     isSelected
//                       ? [
//                           "bg-primary",
//                           "text-brand-primary",
//                           "dark:text-primary-foreground",
//                         ].join(" ")
//                       : "bg-muted text-muted-foreground",
//                   ].join(" ")}
//                 >
//                   {isSelected ? (
//                     <CheckIcon
//                       size={12}
//                       strokeWidth={3}
//                     />
//                   ) : (
//                     <StarIcon
//                       size={12}
//                     />
//                   )}
//                 </span>

//                 <span className="min-w-0 flex-1">
//                   <span className="block text-xs font-semibold text-foreground">
//                     {option.label}
//                   </span>

//                   <span className="mt-0.5 block text-[0.62rem] text-muted-foreground">
//                     {option.description}
//                   </span>
//                 </span>
//               </button>
//             );
//           })}
//         </div>
//       )}
//     </div>
//   );
// }

// /* =========================================================
//    VIEW TOGGLE
// ========================================================= */

// function ViewToggle({
//   value,
//   onChange,
// }: {
//   value: ViewMode;
//   onChange: (
//     value: ViewMode,
//   ) => void;
// }) {
//   return (
//     <div className="flex h-10 shrink-0 items-center rounded-lg border border-border bg-muted/30 p-1">
//       <button
//         type="button"
//         title="Grid view"
//         aria-label="Grid view"
//         onClick={() =>
//           onChange("grid")
//         }
//         className={[
//           "flex h-8 w-8 items-center justify-center rounded-md transition-all",

//           value === "grid"
//             ? [
//                 "bg-primary",
//                 "text-brand-primary",
//                 "shadow-sm",
//                 "dark:text-primary-foreground",
//               ].join(" ")
//             : [
//                 "text-muted-foreground",
//                 "hover:bg-background",
//                 "hover:text-foreground",
//               ].join(" "),
//         ].join(" ")}
//       >
//         <Grid2X2Icon
//           size={14}
//         />
//       </button>

//       <button
//         type="button"
//         title="List view"
//         aria-label="List view"
//         onClick={() =>
//           onChange("list")
//         }
//         className={[
//           "flex h-8 w-8 items-center justify-center rounded-md transition-all",

//           value === "list"
//             ? [
//                 "bg-primary",
//                 "text-brand-primary",
//                 "shadow-sm",
//                 "dark:text-primary-foreground",
//               ].join(" ")
//             : [
//                 "text-muted-foreground",
//                 "hover:bg-background",
//                 "hover:text-foreground",
//               ].join(" "),
//         ].join(" ")}
//       >
//         <ListIcon
//           size={15}
//         />
//       </button>
//     </div>
//   );
// }

// /* =========================================================
//    HELPERS
// ========================================================= */

// function getAllocatLocation(
//   allocat: FilterableAllocat,
// ): string {
//   return [
//     allocat.location,
//     allocat.city,
//     allocat.country,
//   ]
//     .filter(Boolean)
//     .join(", ")
//     .toLowerCase();
// }

// function getIsVerified(
//   allocat: FilterableAllocat,
// ): boolean {
//   return Boolean(
//     allocat.isVerified ??
//     allocat.verified ??
//     false,
//   );
// }

// function getRating(
//   allocat: FilterableAllocat,
// ): number {
//   return (
//     allocat.averageRating ??
//     allocat.rating ??
//     0
//   );
// }

// function getDateValue(
//   date?: string,
// ): number {
//   if (!date) {
//     return 0;
//   }

//   const parsedDate =
//     new Date(date).getTime();

//   return Number.isNaN(
//     parsedDate,
//   )
//     ? 0
//     : parsedDate;
// }

// /* =========================================================
//    STATES
// ========================================================= */

// function ErrorState({
//   message,
// }: {
//   message: string;
// }) {
//   return (
//     <div className="mt-8 border-y border-destructive/20 py-16 text-center">
//       <span className="mx-auto flex h-11 w-11 items-center justify-center rounded-lg bg-destructive/10 text-destructive">
//         <UsersIcon
//           size={20}
//         />
//       </span>

//       <h2 className="mt-5 text-xl font-bold">
//         We could not load the results
//       </h2>

//       <p className="mx-auto mt-2 max-w-md text-sm leading-7 text-muted-foreground">
//         {message}
//       </p>

//       <Button
//         type="button"
//         onClick={() =>
//           window.location.reload()
//         }
//         className={[
//           "mt-6 h-10 rounded-lg px-5 shadow-none",
//           "!text-brand-primary",
//           "dark:!text-primary-foreground",
//         ].join(" ")}
//       >
//         Try again
//       </Button>
//     </div>
//   );
// }

// function NoMatchesState() {
//   return (
//     <div className="flex min-h-[320px] flex-col items-center justify-center border-y border-border px-6 text-center">
//       <span
//         className={[
//           "flex h-12 w-12 items-center justify-center rounded-lg",
//           "bg-primary text-brand-primary",
//           "dark:text-primary-foreground",
//         ].join(" ")}
//       >
//         <UsersIcon
//           size={21}
//         />
//       </span>

//       <h2 className="mt-5 text-xl font-bold">
//         No suitable Allocats found yet
//       </h2>

//       <p className="mt-2 max-w-md text-sm leading-7 text-muted-foreground">
//         We don't currently have enough profile information to recommend
//         suitable professionals for this project.
//       </p>
//     </div>
//   );
// }

// function EmptyState({
//   onReset,
// }: {
//   onReset: () => void;
// }) {
//   return (
//     <div className="flex min-h-[320px] flex-col items-center justify-center border-y border-border px-6 text-center">
//       <span
//         className={[
//           "flex h-12 w-12 items-center justify-center rounded-lg",
//           "bg-primary text-brand-primary",
//           "dark:text-primary-foreground",
//         ].join(" ")}
//       >
//         <SearchIcon
//           size={21}
//         />
//       </span>

//       <h2 className="mt-5 text-xl font-bold">
//         No results with these filters
//       </h2>

//       <p className="mt-2 max-w-md text-sm leading-7 text-muted-foreground">
//         Try widening your location, rate or experience requirements.
//       </p>

//       <Button
//         type="button"
//         onClick={onReset}
//         className={[
//           "mt-6 h-10 rounded-lg px-5 shadow-none",
//           "!text-brand-primary",
//           "dark:!text-primary-foreground",
//         ].join(" ")}
//       >
//         Reset filters
//       </Button>
//     </div>
//   );
// }

// export default FindAllocats;


import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";

import {
  BadgeCheckIcon,
  CatIcon,
  CheckIcon,
  ChevronDownIcon,
  CircleDollarSignIcon,
  Clock3Icon,
  Grid2X2Icon,
  ListIcon,
  MapPinIcon,
  PawPrintIcon,
  SearchIcon,
  SlidersHorizontalIcon,
  SparklesIcon,
  StarIcon,
  UsersIcon,
  XIcon,
} from "lucide-react";

import api from "@/api/axios";

import type { Project } from "@/Types/project";
import type { AllocatProfile } from "@/Types/allocatProfile";
import type { ProjectAllocat } from "@/Types/projectAllocat";
import type { ProjectAllocatStatus } from "@/Types/enums";

import { AllocatCardGrid } from "@/components/AllocatCard";
import MinimalNavMenu from "@/components/MinimalNavMenu";

import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";

/* =========================================================
   TYPES
========================================================= */

type SortOption =
  | "match"
  | "rating"
  | "rate-low"
  | "experience"
  | "recent";

type ViewMode = "grid" | "list";

type OpenFilter =
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

type MatchedAllocat = FilterableAllocat & {
  matchScore: number;
  matchedSkillCount: number;
  requiredSkillCount: number;
};

type AllocatsResponse = {
  items: FilterableAllocat[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
};

/* =========================================================
   DEFAULTS
========================================================= */

const DEFAULT_LOCATION = "";
const DEFAULT_MIN_EXPERIENCE = 0;

const experienceOptions = [
  {
    label: "Any",
    shortLabel: "Any",
    suffix: "",
    value: 0,
  },
  {
    label: "1+ year",
    shortLabel: "1+",
    suffix: "yr",
    value: 1,
  },
  {
    label: "3+ years",
    shortLabel: "3+",
    suffix: "yrs",
    value: 3,
  },
  {
    label: "5+ years",
    shortLabel: "5+",
    suffix: "yrs",
    value: 5,
  },
  {
    label: "10+ years",
    shortLabel: "10+",
    suffix: "yrs",
    value: 10,
  },
];

/* =========================================================
   PAGE
========================================================= */

function FindAllocats() {
  const { projectId } = useParams();

  const [project, setProject] = useState<Project>();
  const [allocats, setAllocats] = useState<FilterableAllocat[]>([]);
  const [projectAllocats, setProjectAllocats] = useState<ProjectAllocat[]>([]);

  const [location, setLocation] = useState(DEFAULT_LOCATION);
  const [maxHourlyRate, setMaxHourlyRate] = useState<number | null>(null);
  const [minExperience, setMinExperience] = useState(DEFAULT_MIN_EXPERIENCE);
  const [verifiedOnly, setVerifiedOnly] = useState(false);

  const [openFilter, setOpenFilter] = useState<OpenFilter>(null);

  const [sortBy, setSortBy] = useState<SortOption>("match");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /* =======================================================
     LOAD
  ======================================================= */

  useEffect(() => {
    if (!projectId) {
      setError("No project was selected.");
      setLoading(false);
      return;
    }

    let cancelled = false;

    async function loadAllAllocats() {
      const firstResponse = await api.get<AllocatsResponse>(
        "/allocats/profiles",
        {
          params: {
            page: 1,
            pageSize: 100,
          },
          withCredentials: true,
        },
      );

      const firstPage = firstResponse.data;

      if (firstPage.totalPages <= 1) {
        return Array.isArray(firstPage.items)
          ? firstPage.items
          : [];
      }

      const remainingPages = await Promise.all(
        Array.from(
          { length: firstPage.totalPages - 1 },
          (_, index) =>
            api.get<AllocatsResponse>(
              "/allocats/profiles",
              {
                params: {
                  page: index + 2,
                  pageSize: firstPage.pageSize,
                },
                withCredentials: true,
              },
            ),
        ),
      );

      return [
        ...(firstPage.items ?? []),
        ...remainingPages.flatMap(
          response => response.data.items ?? [],
        ),
      ];
    }

    async function loadPage() {
      setLoading(true);
      setError(null);

      try {
        const [
          projectResponse,
          allAllocats,
          projectAllocatsResponse,
        ] = await Promise.all([
          api.get<Project>(
            `/projects/${projectId}`,
            {
              withCredentials: true,
            },
          ),

          loadAllAllocats(),

          api.get<ProjectAllocat[]>(
            `/projects/${projectId}/allocats`,
            {
              withCredentials: true,
            },
          ),
        ]);

        if (cancelled) {
          return;
        }

        setProject(projectResponse.data);
        setAllocats(allAllocats);

        setProjectAllocats(
          Array.isArray(projectAllocatsResponse.data)
            ? projectAllocatsResponse.data
            : [],
        );
      } catch (requestError) {
        if (cancelled) {
          return;
        }

        console.error(
          "Could not load matching Allocats:",
          requestError,
        );

        setError(
          "We could not load the professionals for this project. Please try again.",
        );
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadPage();

    return () => {
      cancelled = true;
    };
  }, [projectId]);

  /* =======================================================
     SKILL MATCHING
  ======================================================= */

  const projectSkillIds = useMemo(() => {
    return new Set(
      (project?.skills ?? []).map(
        skill => skill.id,
      ),
    );
  }, [project]);

  const skillMatchedAllocats = useMemo<MatchedAllocat[]>(() => {
    if (projectSkillIds.size === 0) {
      return [];
    }

    return allocats
      .filter(
        allocat =>
          (allocat.skills?.length ?? 0) > 0,
      )
      .map(allocat => {
        const matchedSkillCount = (
          allocat.skills ?? []
        ).filter(
          skill =>
            projectSkillIds.has(skill.id),
        ).length;

        const matchScore = Math.round(
          (
            matchedSkillCount /
            projectSkillIds.size
          ) * 100,
        );

        return {
          ...allocat,
          matchScore,
          matchedSkillCount,
          requiredSkillCount: projectSkillIds.size,
        };
      })
      .filter(
        allocat =>
          allocat.matchedSkillCount > 0,
      );
  }, [
    allocats,
    projectSkillIds,
  ]);

  /* =======================================================
     RATE RANGE
  ======================================================= */

  const rateCeiling = useMemo(() => {
    const highestRate = Math.max(
      ...skillMatchedAllocats.map(
        allocat =>
          allocat.hourlyRate ?? 0,
      ),
      100,
    );

    return Math.ceil(highestRate / 10) * 10;
  }, [skillMatchedAllocats]);

  /* =======================================================
     FILTERING
  ======================================================= */

  const filteredAllocats = useMemo(() => {
    const normalizedLocation =
      location.trim().toLowerCase();

    const results = skillMatchedAllocats.filter(allocat => {
      const yearsExperience =
        allocat.yearsExperience ?? 0;

      const allocatLocation =
        getAllocatLocation(allocat);

      const matchesLocation =
        !normalizedLocation ||
        (
          Boolean(allocatLocation) &&
          (
            allocatLocation.includes(
              normalizedLocation,
            ) ||
            normalizedLocation.includes(
              allocatLocation,
            )
          )
        );

      const matchesRate =
        maxHourlyRate === null ||
        allocat.hourlyRate === null ||
        allocat.hourlyRate === undefined ||
        allocat.hourlyRate <= maxHourlyRate;

      const matchesExperience =
        yearsExperience >= minExperience;

      const matchesVerified =
        !verifiedOnly ||
        getIsVerified(allocat);

      return (
        matchesLocation &&
        matchesRate &&
        matchesExperience &&
        matchesVerified
      );
    });

    return [...results].sort((a, b) => {
      switch (sortBy) {
        case "rating":
          return (
            getRating(b) -
            getRating(a)
          );

        case "rate-low":
          return (
            (
              a.hourlyRate ??
              Number.MAX_SAFE_INTEGER
            ) -
            (
              b.hourlyRate ??
              Number.MAX_SAFE_INTEGER
            )
          );

        case "experience":
          return (
            (b.yearsExperience ?? 0) -
            (a.yearsExperience ?? 0)
          );

        case "recent":
          return (
            getDateValue(
              b.updatedAt ??
              b.createdAt ??
              b.joinedAt,
            ) -
            getDateValue(
              a.updatedAt ??
              a.createdAt ??
              a.joinedAt,
            )
          );

        case "match":
        default:
          if (
            b.matchScore !==
            a.matchScore
          ) {
            return (
              b.matchScore -
              a.matchScore
            );
          }

          if (
            b.matchedSkillCount !==
            a.matchedSkillCount
          ) {
            return (
              b.matchedSkillCount -
              a.matchedSkillCount
            );
          }

          return (
            getRating(b) -
            getRating(a)
          );
      }
    });
  }, [
    skillMatchedAllocats,
    location,
    maxHourlyRate,
    minExperience,
    verifiedOnly,
    sortBy,
  ]);

  /* =======================================================
     RELATIONSHIPS
  ======================================================= */

  const relationshipStatusByAllocat = useMemo(() => {
    return new Map<
      string,
      ProjectAllocatStatus
    >(
      projectAllocats.map(
        relationship => [
          relationship.allocatProfileId,
          relationship.status,
        ],
      ),
    );
  }, [projectAllocats]);

  /* =======================================================
     FILTER COUNT
  ======================================================= */

  const activeFilterCount = useMemo(() => {
    let count = 0;

    if (
      location !==
      DEFAULT_LOCATION
    ) {
      count += 1;
    }

    if (
      maxHourlyRate !== null
    ) {
      count += 1;
    }

    if (
      minExperience !==
      DEFAULT_MIN_EXPERIENCE
    ) {
      count += 1;
    }

    if (verifiedOnly) {
      count += 1;
    }

    return count;
  }, [
    location,
    maxHourlyRate,
    minExperience,
    verifiedOnly,
  ]);

  /* =======================================================
     ACTIONS
  ======================================================= */

  function toggleFilter(
    filter: OpenFilter,
  ) {
    setOpenFilter(current =>
      current === filter
        ? null
        : filter,
    );
  }

  function resetFilters() {
    setLocation(DEFAULT_LOCATION);
    setMaxHourlyRate(null);
    setMinExperience(DEFAULT_MIN_EXPERIENCE);
    setVerifiedOnly(false);
    setSortBy("match");
    setOpenFilter(null);
  }

  function handleStatusChange(
    allocatProfileId: string,
    status: ProjectAllocatStatus,
  ) {
    if (!project) {
      return;
    }

    setProjectAllocats(current => {
      const existing =
        current.find(
          relationship =>
            relationship.allocatProfileId ===
            allocatProfileId,
        );

      if (existing) {
        return current.map(
          relationship =>
            relationship.allocatProfileId ===
            allocatProfileId
              ? {
                  ...relationship,
                  status,
                }
              : relationship,
        );
      }

      return [
        ...current,
        {
          projectId: project.id,
          allocatProfileId,
          status,
          invitedAt:
            new Date().toISOString(),
          respondedAt: null,
          removedAt: null,
        },
      ];
    });
  }

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <div className="min-h-screen bg-background text-foreground">

      {/* HEADER */}

      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/90 backdrop-blur-xl">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <MinimalNavMenu />
        </div>
      </header>

      <main className="container mx-auto px-4 py-7 sm:px-5 md:px-8 lg:py-12">

        {/* =================================================
            INTRO
        ================================================= */}

        <section className="pb-7">
          <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
            <div className="min-w-0 max-w-4xl">

              <div className="flex items-center gap-2.5">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-secondary shadow-sm shadow-primary/10">
                  <UsersIcon size={15} />
                </span>

                <p className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  Find Allocats
                </p>
              </div>

              {loading ? (
                <>
                  <h1 className="mt-5 text-3xl font-black leading-[1.02] tracking-[-0.035em] sm:text-4xl lg:text-5xl">
                    Finding your best Allocats
                  </h1>

                  <p className="mt-4 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
                    Matching the right professionals to your project.
                  </p>
                </>
              ) : (
                <>
                  <h1 className="mt-5 max-w-4xl text-3xl font-black leading-[1.02] tracking-[-0.035em] sm:text-4xl lg:text-5xl">
                    Find Allocats for{" "}
                    <span>
                      {project?.title || "your project"}
                    </span>
                  </h1>

                  <p className="mt-4 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
                    Discover suitable professionals and refine the results
                    by rate, experience, location and verification.
                  </p>
                </>
              )}
            </div>

            {!loading && !error && (
              <div className="hidden items-center gap-3 border-l border-border pl-5 sm:flex">
                <span className="text-3xl font-black tracking-[-0.04em]">
                  {filteredAllocats.length}
                </span>

                <div>
                  <p className="text-xs font-semibold">
                    {filteredAllocats.length === 1
                      ? "Allocat"
                      : "Allocats"}
                  </p>

                  <p className="text-[0.68rem] text-muted-foreground">
                    available
                  </p>
                </div>
              </div>
            )}
          </div>
        </section>

        {error ? (
          <ErrorState message={error} />
        ) : loading ? (
          <AllocatLoadingState />
        ) : (
          <div
            className={[
              "border-t border-border/70",
              "lg:grid lg:grid-cols-[245px_minmax(0,1fr)]",
              "lg:gap-8 xl:grid-cols-[265px_minmax(0,1fr)] xl:gap-10",
            ].join(" ")}
          >

            {/* =================================================
                DESKTOP SIDEBAR
            ================================================= */}

            <aside className="hidden lg:block">
              <div className="sticky top-24 py-7">

                {/* FILTER HEADER */}

                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/[0.08] text-primary">
                      <SlidersHorizontalIcon size={14} />
                    </span>

                    <h2 className="text-sm font-bold">
                      Refine
                    </h2>

                    {activeFilterCount > 0 && (
                      <span className="flex h-5 min-w-5 items-center justify-center rounded-md bg-primary px-1.5 text-[0.6rem] font-black text-secondary">
                        {activeFilterCount}
                      </span>
                    )}
                  </div>

                  {activeFilterCount > 0 && (
                    <button
                      type="button"
                      onClick={resetFilters}
                      className="text-[0.65rem] font-semibold text-muted-foreground transition-colors hover:text-foreground"
                    >
                      Reset
                    </button>
                  )}
                </div>

                <p className="mt-2 text-xs leading-5 text-muted-foreground">
                  Narrow down the professionals shown for this project.
                </p>

                <div className="mt-6 divide-y divide-border">

                  {/* LOCATION */}

                  <DesktopFilterSection title="Location">
                    <div className="relative">
                      <MapPinIcon
                        size={14}
                        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                      />

                      <Input
                        value={location}
                        onChange={event =>
                          setLocation(
                            event.target.value,
                          )
                        }
                        placeholder="City or area"
                        className="h-10 rounded-lg bg-background pl-9 text-xs shadow-none focus-visible:bg-background"
                      />
                    </div>
                  </DesktopFilterSection>

                  {/* RATE */}

                  <DesktopFilterSection title="Hourly rate">
                    <div className="mb-4 flex items-center justify-between">
                      <span className="text-[0.68rem] text-muted-foreground">
                        Maximum
                      </span>

                      <span className="text-xs font-bold">
                        {maxHourlyRate === null
                          ? "Any"
                          : `US$${maxHourlyRate}/hr`}
                      </span>
                    </div>

                    <Slider
                      value={[
                        maxHourlyRate ??
                        rateCeiling,
                      ]}
                      min={0}
                      max={rateCeiling}
                      step={1}
                      onValueChange={([value]) =>
                        setMaxHourlyRate(value)
                      }
                    />

                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-[0.62rem] text-muted-foreground">
                        US$0
                      </span>

                      {maxHourlyRate !== null ? (
                        <button
                          type="button"
                          onClick={() =>
                            setMaxHourlyRate(null)
                          }
                          className="text-[0.62rem] font-semibold text-foreground underline decoration-primary/50 underline-offset-4"
                        >
                          Any rate
                        </button>
                      ) : (
                        <span className="text-[0.62rem] text-muted-foreground">
                          US${rateCeiling}+
                        </span>
                      )}
                    </div>
                  </DesktopFilterSection>

                  {/* EXPERIENCE */}

                  <DesktopFilterSection title="Experience">
                    <div className="mb-3 flex items-center justify-between">
                      <span className="text-[0.65rem] text-muted-foreground">
                        Minimum experience
                      </span>

                      <span className="text-[0.65rem] font-bold">
                        {minExperience === 0
                          ? "Any"
                          : `${minExperience}+ years`}
                      </span>
                    </div>

                    <div className="grid grid-cols-5 gap-1.5">
                      {experienceOptions.map(option => {
                        const selected =
                          minExperience === option.value;

                        return (
                          <button
                            key={option.value}
                            type="button"
                            title={option.label}
                            onClick={() =>
                              setMinExperience(
                                option.value,
                              )
                            }
                            className={[
                              "flex h-12 min-w-0 flex-col items-center justify-center rounded-lg border",
                              "transition-all duration-200",

                              selected
                                ? [
                                    "border-primary",
                                    "bg-primary",
                                    "text-secondary",
                                    "shadow-sm shadow-primary/10",
                                  ].join(" ")
                                : [
                                    "border-border",
                                    "bg-background",
                                    "text-muted-foreground",
                                    "hover:border-foreground/15",
                                    "hover:bg-muted/40",
                                    "hover:text-foreground",
                                  ].join(" "),
                            ].join(" ")}
                          >
                            <span className="text-[0.68rem] font-black leading-none">
                              {option.shortLabel}
                            </span>

                            {option.suffix && (
                              <span
                                className={[
                                  "mt-1 text-[0.5rem] font-semibold uppercase tracking-[0.08em]",

                                  selected
                                    ? "text-secondary/75"
                                    : "text-muted-foreground/70",
                                ].join(" ")}
                              >
                                {option.suffix}
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </DesktopFilterSection>

                  {/* VERIFIED */}

                  <DesktopFilterSection title="Verification">
                    <button
                      type="button"
                      role="switch"
                      aria-checked={verifiedOnly}
                      onClick={() =>
                        setVerifiedOnly(
                          current => !current,
                        )
                      }
                      className={[
                        "flex w-full items-center gap-3 rounded-lg border px-3 py-3",
                        "text-left transition-colors",

                        verifiedOnly
                          ? [
                              "border-primary/30",
                              "bg-primary/[0.055]",
                              "shadow-sm shadow-primary/[0.04]",
                            ].join(" ")
                          : "border-border hover:bg-muted/30",
                      ].join(" ")}
                    >
                      <span
                        className={[
                          "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",

                          verifiedOnly
                            ? "bg-primary text-secondary"
                            : "bg-muted text-muted-foreground",
                        ].join(" ")}
                      >
                        <BadgeCheckIcon size={15} />
                      </span>

                      <span className="min-w-0 flex-1">
                        <span className="block text-xs font-bold">
                          Verified only
                        </span>

                        <span className="mt-0.5 block text-[0.62rem] text-muted-foreground">
                          Show verified profiles.
                        </span>
                      </span>

                      <span
                        className={[
                          "relative h-5 w-9 shrink-0 rounded-full transition-colors",

                          verifiedOnly
                            ? "bg-primary"
                            : "bg-muted-foreground/25",
                        ].join(" ")}
                      >
                        <span
                          className={[
                            "absolute top-0.5 h-4 w-4 rounded-full shadow-sm",
                            "transition-transform",

                            verifiedOnly
                              ? "translate-x-[18px] bg-secondary"
                              : "translate-x-0.5 bg-background",
                          ].join(" ")}
                        />
                      </span>
                    </button>
                  </DesktopFilterSection>
                </div>
              </div>
            </aside>

            {/* =================================================
                CONTENT
            ================================================= */}

            <div className="min-w-0">

              {/* =================================================
                  MOBILE / TABLET FILTERS
              ================================================= */}

              <section className="py-4 lg:hidden">
                <div className="flex items-center gap-1.5 sm:gap-2">

                  {/* REFINE */}

                  <div className="mr-auto flex min-w-0 items-center gap-2">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/[0.08] text-primary">
                      <SlidersHorizontalIcon size={14} />
                    </span>

                    <span className="hidden text-xs font-semibold sm:inline">
                      Refine
                    </span>

                    {activeFilterCount > 0 && (
                      <span className="flex h-5 min-w-5 items-center justify-center rounded-md bg-primary px-1 text-[0.58rem] font-black text-secondary">
                        {activeFilterCount}
                      </span>
                    )}
                  </div>

                  {/* LOCATION */}

                  <ResponsiveFilterChip
                    icon={
                      <MapPinIcon size={13} />
                    }
                    label={
                      location ||
                      "Location"
                    }
                    title="Location"
                    active={Boolean(location)}
                    open={
                      openFilter ===
                      "location"
                    }
                    onClick={() =>
                      toggleFilter(
                        "location",
                      )
                    }
                  />

                  {/* RATE */}

                  <ResponsiveFilterChip
                    icon={
                      <CircleDollarSignIcon size={13} />
                    }
                    label={
                      maxHourlyRate === null
                        ? "Rate"
                        : `US$${maxHourlyRate}`
                    }
                    title="Hourly rate"
                    active={
                      maxHourlyRate !==
                      null
                    }
                    open={
                      openFilter ===
                      "rate"
                    }
                    onClick={() =>
                      toggleFilter(
                        "rate",
                      )
                    }
                  />

                  {/* EXPERIENCE */}

                  <ResponsiveFilterChip
                    icon={
                      <Clock3Icon size={13} />
                    }
                    label={
                      minExperience === 0
                        ? "Experience"
                        : `${minExperience}+ yrs`
                    }
                    title="Experience"
                    active={
                      minExperience > 0
                    }
                    open={
                      openFilter ===
                      "experience"
                    }
                    onClick={() =>
                      toggleFilter(
                        "experience",
                      )
                    }
                  />

                  {/* VERIFIED */}

                  <button
                    type="button"
                    title="Verified only"
                    aria-label="Verified only"
                    onClick={() =>
                      setVerifiedOnly(
                        current => !current,
                      )
                    }
                    className={[
                      "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border",
                      "text-xs font-semibold transition-colors",
                      "sm:w-auto sm:gap-2 sm:px-3",

                      verifiedOnly
                        ? [
                            "border-primary",
                            "bg-primary",
                            "text-secondary",
                          ].join(" ")
                        : [
                            "border-border",
                            "bg-background",
                            "text-muted-foreground",
                            "hover:bg-muted/40",
                            "hover:text-foreground",
                          ].join(" "),
                    ].join(" ")}
                  >
                    <BadgeCheckIcon size={13} />

                    <span className="hidden sm:inline">
                      Verified
                    </span>

                    {verifiedOnly && (
                      <CheckIcon
                        size={10}
                        strokeWidth={3}
                        className="hidden sm:block"
                      />
                    )}
                  </button>

                  {/* CLEAR */}

                  {activeFilterCount > 0 && (
                    <button
                      type="button"
                      title="Clear filters"
                      aria-label="Clear filters"
                      onClick={resetFilters}
                      className={[
                        "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
                        "text-muted-foreground transition-colors",
                        "hover:bg-muted hover:text-foreground",
                        "sm:w-auto sm:gap-1.5 sm:px-2.5 sm:text-xs",
                      ].join(" ")}
                    >
                      <XIcon size={13} />

                      <span className="hidden sm:inline">
                        Clear
                      </span>
                    </button>
                  )}
                </div>

                {/* LOCATION PANEL */}

                {openFilter === "location" && (
                  <div className="mt-3 max-w-sm rounded-xl border border-border bg-muted/[0.12] p-3">
                    <div className="relative">
                      <MapPinIcon
                        size={14}
                        className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
                      />

                      <Input
                        value={location}
                        onChange={event =>
                          setLocation(
                            event.target.value,
                          )
                        }
                        placeholder="City or area"
                        className="h-10 rounded-lg bg-background pl-9 shadow-none focus-visible:bg-background"
                      />
                    </div>
                  </div>
                )}

                {/* RATE PANEL */}

                {openFilter === "rate" && (
                  <div className="mt-3 max-w-md rounded-xl border border-border bg-muted/[0.12] p-4">
                    <div className="mb-4 flex items-center justify-between gap-4">
                      <div>
                        <p className="text-xs font-bold">
                          Maximum hourly rate
                        </p>

                        <p className="mt-1 text-[0.65rem] text-muted-foreground">
                          {maxHourlyRate === null
                            ? "No rate limit"
                            : `Up to US$${maxHourlyRate} per hour`}
                        </p>
                      </div>

                      {maxHourlyRate !== null && (
                        <button
                          type="button"
                          onClick={() =>
                            setMaxHourlyRate(null)
                          }
                          className="text-[0.65rem] font-semibold text-foreground underline decoration-primary/50 underline-offset-4"
                        >
                          Any rate
                        </button>
                      )}
                    </div>

                    <Slider
                      value={[
                        maxHourlyRate ??
                        rateCeiling,
                      ]}
                      min={0}
                      max={rateCeiling}
                      step={1}
                      onValueChange={([value]) =>
                        setMaxHourlyRate(value)
                      }
                    />

                    <div className="mt-3 flex justify-between text-[0.62rem] text-muted-foreground">
                      <span>
                        US$0
                      </span>

                      <span>
                        US${rateCeiling}+
                      </span>
                    </div>
                  </div>
                )}

                {/* EXPERIENCE PANEL */}

                {openFilter === "experience" && (
                  <div className="mt-3 max-w-xl rounded-xl border border-border bg-muted/[0.12] p-3">
                    <div className="grid grid-cols-5 gap-1.5">
                      {experienceOptions.map(option => {
                        const selected =
                          minExperience === option.value;

                        return (
                          <button
                            key={option.value}
                            type="button"
                            onClick={() =>
                              setMinExperience(
                                option.value,
                              )
                            }
                            className={[
                              "flex min-h-10 flex-col items-center justify-center rounded-lg border px-1.5",
                              "transition-colors",

                              selected
                                ? [
                                    "border-primary",
                                    "bg-primary",
                                    "text-secondary",
                                  ].join(" ")
                                : [
                                    "border-border",
                                    "bg-background",
                                    "text-muted-foreground",
                                    "hover:bg-muted/50",
                                    "hover:text-foreground",
                                  ].join(" "),
                            ].join(" ")}
                          >
                            <span className="text-[0.65rem] font-black">
                              {option.shortLabel}
                            </span>

                            {option.suffix && (
                              <span
                                className={[
                                  "text-[0.48rem] font-semibold uppercase",

                                  selected
                                    ? "text-secondary/75"
                                    : "text-muted-foreground/70",
                                ].join(" ")}
                              >
                                {option.suffix}
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </section>

              {/* =================================================
                  RESULTS HEADER
              ================================================= */}

              <section className="relative flex items-center justify-between gap-3 border-t border-border/70 py-5 lg:border-t-0 lg:py-7">
                <div className="min-w-0">
                  <p className="hidden text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground sm:block">
                    Recommendations
                  </p>

                  <div className="flex min-w-0 items-center gap-2 sm:mt-1">
                    <h2 className="truncate text-sm font-bold tracking-[-0.02em] sm:text-lg">
                      Best matches
                    </h2>

                    <span className="shrink-0 rounded-full bg-primary px-2 py-0.5 text-[0.58rem] font-black text-secondary sm:hidden">
                      {filteredAllocats.length}
                    </span>
                  </div>
                </div>

                <div className="flex shrink-0 items-center gap-2">
                  <SortDropdown
                    value={sortBy}
                    onChange={setSortBy}
                  />

                  <ViewToggle
                    value={viewMode}
                    onChange={setViewMode}
                  />
                </div>
              </section>

              {/* =================================================
                  RESULTS
              ================================================= */}

              <section>
                {projectSkillIds.size === 0 ? (
                  <NoMatchesState />
                ) : skillMatchedAllocats.length === 0 ? (
                  <NoMatchesState />
                ) : filteredAllocats.length > 0 ? (
                  <div
                    className={
                      viewMode === "grid"
                        ? "grid gap-5 sm:grid-cols-2 xl:grid-cols-3"
                        : "grid grid-cols-1 gap-3 sm:gap-4"
                    }
                  >
                    {filteredAllocats.map(allocat => {
                      const relationshipStatus =
                        relationshipStatusByAllocat.get(
                          allocat.allocatrUserId,
                        ) ?? null;

                      return (
                        <div
                          key={allocat.allocatrUserId}
                          className="min-w-0"
                        >
                          <AllocatCardGrid
                            allocat={allocat}
                            project={project}
                            viewMode={viewMode}
                            relationshipStatus={
                              relationshipStatus
                            }
                            onStatusChange={status =>
                              handleStatusChange(
                                allocat.allocatrUserId,
                                status,
                              )
                            }
                          />
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <EmptyState
                    onReset={resetFilters}
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

/* =========================================================
   LOADING
========================================================= */

function AllocatLoadingState() {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex min-h-[250px] items-center justify-center px-6 py-10 text-center"
    >
      <div>
        <div className="relative mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-secondary shadow-lg shadow-primary/10">
          <CatIcon
            size={28}
            strokeWidth={1.8}
          />

          <span className="absolute -right-2 -top-2 flex h-7 w-7 animate-bounce items-center justify-center rounded-full border-2 border-background bg-background text-foreground shadow-sm">
            <SparklesIcon size={12} />
          </span>
        </div>

        <div className="mt-4 flex justify-center gap-2 text-muted-foreground">
          <PawPrintIcon
            size={13}
            className="animate-pulse"
          />

          <PawPrintIcon
            size={13}
            className="animate-pulse [animation-delay:150ms]"
          />

          <PawPrintIcon
            size={13}
            className="animate-pulse [animation-delay:300ms]"
          />
        </div>

        <p className="mt-4 text-sm font-semibold text-foreground">
          Paws at work — finding your Allocats...
        </p>
      </div>
    </div>
  );
}

/* =========================================================
   DESKTOP FILTER SECTION
========================================================= */

function DesktopFilterSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="py-5">
      <p className="mb-3 text-xs font-bold">
        {title}
      </p>

      {children}
    </section>
  );
}

/* =========================================================
   RESPONSIVE FILTER CHIP
========================================================= */

function ResponsiveFilterChip({
  icon,
  label,
  title,
  active,
  open,
  onClick,
}: {
  icon: React.ReactNode;
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
      onClick={onClick}
      className={[
        "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border",
        "text-xs font-semibold transition-all",
        "sm:w-auto sm:gap-2 sm:px-3",

        active || open
          ? [
              "border-primary",
              "bg-primary",
              "text-secondary",
            ].join(" ")
          : [
              "border-border",
              "bg-background",
              "text-muted-foreground",
              "hover:bg-muted/40",
              "hover:text-foreground",
            ].join(" "),
      ].join(" ")}
    >
      {icon}

      <span className="hidden max-w-32 truncate sm:inline">
        {label}
      </span>

      <ChevronDownIcon
        size={10}
        className={[
          "hidden transition-transform sm:block",
          open
            ? "rotate-180"
            : "",
        ].join(" ")}
      />
    </button>
  );
}

/* =========================================================
   SORT OPTIONS
========================================================= */

const sortOptions: {
  value: SortOption;
  label: string;
  description: string;
}[] = [
  {
    value: "match",
    label: "Best match",
    description: "Most relevant first",
  },
  {
    value: "rating",
    label: "Highest rated",
    description: "Top rated professionals",
  },
  {
    value: "rate-low",
    label: "Lowest rate",
    description: "Lowest hourly rate first",
  },
  {
    value: "experience",
    label: "Most experienced",
    description: "Most years first",
  },
  {
    value: "recent",
    label: "Recently active",
    description: "Newest activity first",
  },
];

/* =========================================================
   SORT DROPDOWN
========================================================= */

function SortDropdown({
  value,
  onChange,
}: {
  value: SortOption;
  onChange: (value: SortOption) => void;
}) {
  const [open, setOpen] =
    useState(false);

  const selected =
    sortOptions.find(
      option =>
        option.value === value,
    ) ??
    sortOptions[0];

  function selectOption(
    option: SortOption,
  ) {
    onChange(option);
    setOpen(false);
  }

  return (
    <div className="static sm:relative">
      <button
        type="button"
        title={`Sort: ${selected.label}`}
        aria-label={`Sort results: ${selected.label}`}
        aria-expanded={open}
        onClick={() =>
          setOpen(
            current => !current,
          )
        }
        className={[
          "flex h-10 w-10 items-center justify-center rounded-lg border",
          "border-border bg-background transition-all",
          "sm:w-auto sm:min-w-[170px] sm:justify-between sm:gap-3 sm:px-3",
          "hover:bg-muted/40",

          open
            ? "border-primary/30 bg-primary/[0.04] ring-1 ring-primary/20"
            : "",
        ].join(" ")}
      >
        <span className="flex min-w-0 items-center gap-2.5">
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-primary text-secondary">
            <StarIcon size={12} />
          </span>

          <span className="hidden truncate text-xs font-semibold sm:block">
            {selected.label}
          </span>
        </span>

        <ChevronDownIcon
          size={12}
          className={[
            "hidden shrink-0 text-muted-foreground transition-transform sm:block",
            open
              ? "rotate-180"
              : "",
          ].join(" ")}
        />
      </button>

      {open && (
        <div
          className={[
            "absolute right-0 top-full z-50 mt-2",
            "w-[min(16rem,calc(100vw-2rem))]",
            "overflow-hidden rounded-xl",
            "border border-border bg-popover p-1.5",
            "text-popover-foreground shadow-xl",
          ].join(" ")}
        >
          {sortOptions.map(option => {
            const isSelected =
              option.value === value;

            return (
              <button
                key={option.value}
                type="button"
                onClick={() =>
                  selectOption(
                    option.value,
                  )
                }
                className={[
                  "flex w-full items-center gap-3 rounded-lg px-3 py-2.5",
                  "text-left text-popover-foreground transition-colors",

                  isSelected
                    ? "bg-primary/[0.07]"
                    : "hover:bg-muted/60",
                ].join(" ")}
              >
                <span
                  className={[
                    "flex h-7 w-7 shrink-0 items-center justify-center rounded-md",

                    isSelected
                      ? "bg-primary text-secondary"
                      : "bg-muted text-muted-foreground",
                  ].join(" ")}
                >
                  {isSelected ? (
                    <CheckIcon
                      size={12}
                      strokeWidth={3}
                    />
                  ) : (
                    <StarIcon size={12} />
                  )}
                </span>

                <span className="min-w-0 flex-1">
                  <span className="block text-xs font-semibold text-foreground">
                    {option.label}
                  </span>

                  <span className="mt-0.5 block text-[0.62rem] text-muted-foreground">
                    {option.description}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* =========================================================
   VIEW TOGGLE
========================================================= */

function ViewToggle({
  value,
  onChange,
}: {
  value: ViewMode;
  onChange: (value: ViewMode) => void;
}) {
  return (
    <div className="flex h-10 shrink-0 items-center rounded-lg border border-border bg-muted/30 p-1">
      <button
        type="button"
        title="Grid view"
        aria-label="Grid view"
        onClick={() =>
          onChange("grid")
        }
        className={[
          "flex h-8 w-8 items-center justify-center rounded-md transition-all",

          value === "grid"
            ? [
                "bg-primary",
                "text-secondary",
                "shadow-sm",
              ].join(" ")
            : [
                "text-muted-foreground",
                "hover:bg-background",
                "hover:text-foreground",
              ].join(" "),
        ].join(" ")}
      >
        <Grid2X2Icon size={14} />
      </button>

      <button
        type="button"
        title="List view"
        aria-label="List view"
        onClick={() =>
          onChange("list")
        }
        className={[
          "flex h-8 w-8 items-center justify-center rounded-md transition-all",

          value === "list"
            ? [
                "bg-primary",
                "text-secondary",
                "shadow-sm",
              ].join(" ")
            : [
                "text-muted-foreground",
                "hover:bg-background",
                "hover:text-foreground",
              ].join(" "),
        ].join(" ")}
      >
        <ListIcon size={15} />
      </button>
    </div>
  );
}

/* =========================================================
   HELPERS
========================================================= */

function getAllocatLocation(
  allocat: FilterableAllocat,
): string {
  return [
    allocat.location,
    allocat.city,
    allocat.country,
  ]
    .filter(Boolean)
    .join(", ")
    .toLowerCase();
}

function getIsVerified(
  allocat: FilterableAllocat,
): boolean {
  return Boolean(
    allocat.isVerified ??
    allocat.verified ??
    false,
  );
}

function getRating(
  allocat: FilterableAllocat,
): number {
  return (
    allocat.averageRating ??
    allocat.rating ??
    0
  );
}

function getDateValue(
  date?: string,
): number {
  if (!date) {
    return 0;
  }

  const parsedDate =
    new Date(date).getTime();

  return Number.isNaN(
    parsedDate,
  )
    ? 0
    : parsedDate;
}

/* =========================================================
   STATES
========================================================= */

function ErrorState({
  message,
}: {
  message: string;
}) {
  return (
    <div className="mt-8 border-y border-destructive/20 py-16 text-center">
      <span className="mx-auto flex h-11 w-11 items-center justify-center rounded-lg bg-destructive/10 text-destructive">
        <UsersIcon size={20} />
      </span>

      <h2 className="mt-5 text-xl font-bold">
        We could not load the results
      </h2>

      <p className="mx-auto mt-2 max-w-md text-sm leading-7 text-muted-foreground">
        {message}
      </p>

      <Button
        type="button"
        onClick={() =>
          window.location.reload()
        }
        className="mt-6 h-10 rounded-lg px-5 shadow-none"
      >
        Try again
      </Button>
    </div>
  );
}

function NoMatchesState() {
  return (
    <div className="flex min-h-[320px] flex-col items-center justify-center border-y border-border px-6 text-center">
      <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-secondary">
        <UsersIcon size={21} />
      </span>

      <h2 className="mt-5 text-xl font-bold">
        No suitable Allocats found yet
      </h2>

      <p className="mt-2 max-w-md text-sm leading-7 text-muted-foreground">
        We don't currently have enough profile information to recommend
        suitable professionals for this project.
      </p>
    </div>
  );
}

function EmptyState({
  onReset,
}: {
  onReset: () => void;
}) {
  return (
    <div className="flex min-h-[320px] flex-col items-center justify-center border-y border-border px-6 text-center">
      <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-secondary">
        <SearchIcon size={21} />
      </span>

      <h2 className="mt-5 text-xl font-bold">
        No results with these filters
      </h2>

      <p className="mt-2 max-w-md text-sm leading-7 text-muted-foreground">
        Try widening your location, rate or experience requirements.
      </p>

      <Button
        type="button"
        onClick={onReset}
        className="mt-6 h-10 rounded-lg px-5 shadow-none"
      >
        Reset filters
      </Button>
    </div>
  );
}

export default FindAllocats;