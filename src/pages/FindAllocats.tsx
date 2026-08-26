// import { useEffect, useMemo, useState } from "react";
// import { useParams } from "react-router-dom";
// import {
//   BadgeCheckIcon,
//   CheckIcon,
//   ChevronDownIcon,
//   MapPinIcon,
//   SearchIcon,
//   SlidersHorizontalIcon,
//   StarIcon,
//   UsersIcon,
// } from "lucide-react";

// import api from "@/api/axios";
// import type { Project } from "@/Types/project";
// import type { AllocatProfile } from "@/Types/allocatProfile";
// import type { ProjectAllocat } from "@/Types/projectAllocat";
// import type { ProjectAllocatStatus } from "@/Types/enums";

// import { AllocatCardGrid } from "@/components/AllocatCard";
// import MinimalNavMenu from "@/components/MinimalNavMenu";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Slider } from "@/components/ui/slider";
// import { Button } from "@/components/ui/button";
// import { Skeleton } from "@/components/ui/skeleton";

// type SortOption =
//   | "match"
//   | "rating"
//   | "rate-low"
//   | "experience"
//   | "recent";

// type FilterableAllocat = AllocatProfile & {
//   location?: string;
//   city?: string;
//   country?: string;

//   isVerified?: boolean;
//   verified?: boolean;

//   rating?: number;
//   averageRating?: number;
//   matchScore?: number;

//   createdAt?: string;
//   updatedAt?: string;
// };

// const DEFAULT_LOCATION = "Zimbabwe, Harare";
// const DEFAULT_MAX_RATE = 100;
// const DEFAULT_MIN_EXPERIENCE = 1;

// function FindAllocats() {
//   const { projectId } = useParams();

//   const [project, setProject] = useState<Project>();
//   const [allocats, setAllocats] = useState<
//     FilterableAllocat[]
//   >([]);

//   const [projectAllocats, setProjectAllocats] =
//     useState<ProjectAllocat[]>([]);

//   const [location, setLocation] =
//     useState(DEFAULT_LOCATION);

//   const [maxHourlyRate, setMaxHourlyRate] =
//     useState(DEFAULT_MAX_RATE);

//   const [minExperience, setMinExperience] =
//     useState(DEFAULT_MIN_EXPERIENCE);

//   const [verifiedOnly, setVerifiedOnly] =
//     useState(false);

//   const [sortBy, setSortBy] =
//     useState<SortOption>("match");

//   const [loading, setLoading] =
//     useState(true);

//   const [error, setError] =
//     useState<string | null>(null);

//   useEffect(() => {
//     if (!projectId) {
//       setError("No project was selected.");
//       setLoading(false);
//       return;
//     }

//     let cancelled = false;

//     async function loadPage() {
//       setLoading(true);
//       setError(null);

//       try {
//         const [
//           projectResponse,
//           allocatsResponse,
//           projectAllocatsResponse,
//         ] = await Promise.all([
//           api.get<Project>(
//             `/projects/${projectId}`,
//             {
//               withCredentials: true,
//             },
//           ),

//           api.get<FilterableAllocat[]>(
//             "/allocats/profiles",
//             {
//               withCredentials: true,
//             },
//           ),

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

//         setProject(projectResponse.data);
//         setAllocats(allocatsResponse.data);
//         setProjectAllocats(
//           projectAllocatsResponse.data,
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

//   const filteredAllocats = useMemo(() => {
//     const normalizedLocation = location
//       .trim()
//       .toLowerCase();

//     const results = allocats.filter(
//       (allocat) => {
//         const hourlyRate =
//           allocat.hourlyRate ?? 0;

//         const yearsExperience =
//           allocat.yearsExperience ?? 0;

//         const allocatLocation =
//           getAllocatLocation(allocat);

//         const matchesLocation =
//           !normalizedLocation ||
//           !allocatLocation ||
//           allocatLocation.includes(
//             normalizedLocation,
//           ) ||
//           normalizedLocation.includes(
//             allocatLocation,
//           );

//         const matchesRate =
//           hourlyRate <= maxHourlyRate;

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
//       },
//     );

//     return [...results].sort(
//       (a, b) => {
//         switch (sortBy) {
//           case "rating":
//             return (
//               getRating(b) -
//               getRating(a)
//             );

//           case "rate-low":
//             return (
//               (a.hourlyRate ??
//                 Number.MAX_SAFE_INTEGER) -
//               (b.hourlyRate ??
//                 Number.MAX_SAFE_INTEGER)
//             );

//           case "experience":
//             return (
//               (b.yearsExperience ?? 0) -
//               (a.yearsExperience ?? 0)
//             );

//           case "recent":
//             return (
//               getDateValue(
//                 b.updatedAt ??
//                   b.createdAt,
//               ) -
//               getDateValue(
//                 a.updatedAt ??
//                   a.createdAt,
//               )
//             );

//           case "match":
//           default:
//             return (
//               getMatchScore(b) -
//               getMatchScore(a)
//             );
//         }
//       },
//     );
//   }, [
//     allocats,
//     location,
//     maxHourlyRate,
//     minExperience,
//     verifiedOnly,
//     sortBy,
//   ]);

//   const relationshipStatusByAllocat =
//     useMemo(() => {
//       return new Map<
//         string,
//         ProjectAllocatStatus
//       >(
//         projectAllocats.map(
//           (relationship) => [
//             relationship.allocatProfileId,
//             relationship.status,
//           ],
//         ),
//       );
//     }, [projectAllocats]);

//   const activeFilterCount =
//     useMemo(() => {
//       let count = 0;

//       if (location !== DEFAULT_LOCATION) {
//         count += 1;
//       }

//       if (
//         maxHourlyRate !==
//         DEFAULT_MAX_RATE
//       ) {
//         count += 1;
//       }

//       if (
//         minExperience !==
//         DEFAULT_MIN_EXPERIENCE
//       ) {
//         count += 1;
//       }

//       if (verifiedOnly) {
//         count += 1;
//       }

//       return count;
//     }, [
//       location,
//       maxHourlyRate,
//       minExperience,
//       verifiedOnly,
//     ]);

//   function resetFilters() {
//     setLocation(DEFAULT_LOCATION);
//     setMaxHourlyRate(DEFAULT_MAX_RATE);
//     setMinExperience(
//       DEFAULT_MIN_EXPERIENCE,
//     );
//     setVerifiedOnly(false);
//     setSortBy("match");
//   }

//   function handleStatusChange(
//     allocatProfileId: string,
//     status: ProjectAllocatStatus,
//   ) {
//     if (!project) {
//       return;
//     }

//     setProjectAllocats((current) => {
//       const existing =
//         current.find(
//           (relationship) =>
//             relationship.allocatProfileId ===
//             allocatProfileId,
//         );

//       if (existing) {
//         return current.map(
//           (relationship) =>
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

//   return (
//     <div className="min-h-screen bg-muted/20">
//       <header className="sticky top-0 z-40 border-b border-border/70 bg-background/90 backdrop-blur-xl">
//         <div className="container mx-auto px-4 sm:px-6 lg:px-8">
//           <MinimalNavMenu />
//         </div>
//       </header>

//       <main className="container mx-auto px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
//         <section className="border-b border-border pb-8">
//           <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
//             <div className="min-w-0">
//               <div className="mb-4 flex items-center gap-2 text-primary">
//                 <UsersIcon size={17} />

//                 <p className="text-xs font-semibold uppercase tracking-[0.18em]">
//                   Recommended professionals
//                 </p>
//               </div>

//               {loading ? (
//                 <div className="space-y-3">
//                   <Skeleton className="h-10 w-72 max-w-full" />
//                   <Skeleton className="h-5 w-full max-w-2xl" />
//                 </div>
//               ) : (
//                 <>
//                   <h1 className="max-w-4xl break-words text-3xl font-black tracking-[-0.035em] sm:text-4xl lg:text-5xl">
//                     Find Allocats for{" "}
//                     <span className="text-primary">
//                       {project?.title ||
//                         "your project"}
//                     </span>
//                   </h1>

//                   <p className="mt-4 max-w-3xl text-sm leading-7 text-muted-foreground sm:text-base">
//                     These professionals have
//                     been selected using your
//                     project requirements. Adjust
//                     the filters to refine the
//                     recommendations.
//                   </p>
//                 </>
//               )}
//             </div>

//             {!loading &&
//               !error && (
//                 <div className="flex shrink-0 items-center gap-2 rounded-full border border-border bg-background px-4 py-2 text-sm">
//                   <UsersIcon
//                     size={16}
//                     className="text-muted-foreground"
//                   />

//                   <span className="font-semibold">
//                     {
//                       filteredAllocats.length
//                     }
//                   </span>

//                   <span className="text-muted-foreground">
//                     {filteredAllocats.length ===
//                     1
//                       ? "Allocat found"
//                       : "Allocats found"}
//                   </span>
//                 </div>
//               )}
//           </div>
//         </section>

//         {error ? (
//           <ErrorState message={error} />
//         ) : (
//           <div className="mt-8 grid items-start gap-8 lg:grid-cols-[280px_minmax(0,1fr)] xl:grid-cols-[310px_minmax(0,1fr)]">
//             <aside className="rounded-[1.75rem] border border-border bg-background p-5 shadow-sm lg:sticky lg:top-24">
//               <div className="flex items-start justify-between gap-4">
//                 <div>
//                   <div className="flex items-center gap-2">
//                     <SlidersHorizontalIcon
//                       size={17}
//                       className="text-primary"
//                     />

//                     <h2 className="font-bold">
//                       Refine matches
//                     </h2>

//                     {activeFilterCount >
//                       0 && (
//                       <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-[10px] font-bold text-primary-foreground">
//                         {
//                           activeFilterCount
//                         }
//                       </span>
//                     )}
//                   </div>

//                   <p className="mt-1 text-xs leading-5 text-muted-foreground">
//                     Adjust the recommended
//                     results.
//                   </p>
//                 </div>

//                 <Button
//                   type="button"
//                   variant="ghost"
//                   size="sm"
//                   onClick={resetFilters}
//                   disabled={
//                     activeFilterCount === 0
//                   }
//                   className="h-8 rounded-full px-3 text-xs"
//                 >
//                   Reset
//                 </Button>
//               </div>

//               <div className="mt-7 space-y-7">
//                 <div className="space-y-2">
//                   <Label
//                     htmlFor="location"
//                     className="text-sm font-semibold"
//                   >
//                     Location
//                   </Label>

//                   <div className="relative">
//                     <MapPinIcon
//                       size={16}
//                       className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
//                     />

//                     <Input
//                       type="text"
//                       name="location"
//                       id="location"
//                       value={location}
//                       onChange={(event) =>
//                         setLocation(
//                           event.target
//                             .value,
//                         )
//                       }
//                       placeholder="City or area"
//                       className="h-12 rounded-2xl bg-muted/30 pl-11 shadow-none"
//                     />
//                   </div>
//                 </div>

//                 <div className="space-y-4">
//                   <div className="flex items-center justify-between gap-4">
//                     <Label className="text-sm font-semibold">
//                       Maximum hourly rate
//                     </Label>

//                     <span className="shrink-0 rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
//                       US$
//                       {maxHourlyRate}
//                       /hr
//                     </span>
//                   </div>

//                   <Slider
//                     value={[
//                       maxHourlyRate,
//                     ]}
//                     onValueChange={([
//                       value,
//                     ]) =>
//                       setMaxHourlyRate(
//                         value,
//                       )
//                     }
//                     min={0}
//                     max={100}
//                     step={1}
//                   />

//                   <div className="flex justify-between text-xs text-muted-foreground">
//                     <span>US$0</span>
//                     <span>
//                       US$100+
//                     </span>
//                   </div>
//                 </div>

//                 <div className="space-y-3">
//                   <div>
//                     <Label className="text-sm font-semibold">
//                       Minimum experience
//                     </Label>

//                     <p className="mt-1 text-xs text-muted-foreground">
//                       Choose the least
//                       experience required.
//                     </p>
//                   </div>

//                   <div className="grid grid-cols-2 gap-2">
//                     {[
//                       {
//                         label: "Any",
//                         value: 0,
//                       },
//                       {
//                         label:
//                           "1+ year",
//                         value: 1,
//                       },
//                       {
//                         label:
//                           "3+ years",
//                         value: 3,
//                       },
//                       {
//                         label:
//                           "5+ years",
//                         value: 5,
//                       },
//                       {
//                         label:
//                           "10+ years",
//                         value: 10,
//                       },
//                     ].map(
//                       (option) => {
//                         const selected =
//                           minExperience ===
//                           option.value;

//                         return (
//                           <button
//                             key={
//                               option.value
//                             }
//                             type="button"
//                             onClick={() =>
//                               setMinExperience(
//                                 option.value,
//                               )
//                             }
//                             aria-pressed={
//                               selected
//                             }
//                             className={`rounded-xl border px-3 py-2.5 text-sm font-semibold transition-all ${
//                               selected
//                                 ? "border-primary bg-primary text-primary-foreground shadow-sm"
//                                 : "border-border bg-muted/20 text-muted-foreground hover:border-primary/40 hover:bg-muted/50 hover:text-foreground"
//                             }`}
//                           >
//                             {
//                               option.label
//                             }
//                           </button>
//                         );
//                       },
//                     )}
//                   </div>
//                 </div>

//                 <div className="border-t border-border pt-6">
//                   <FilterToggle
//                     checked={
//                       verifiedOnly
//                     }
//                     onChange={
//                       setVerifiedOnly
//                     }
//                     icon={
//                       <BadgeCheckIcon
//                         size={17}
//                       />
//                     }
//                     label="Verified only"
//                     description="Show identity-verified professionals."
//                   />
//                 </div>
//               </div>
//             </aside>

//             <section className="min-w-0">
//               {!loading && (
//                 <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
//                   <div>
//                     <p className="text-sm font-semibold">
//                       Recommended matches
//                     </p>

//                     <p className="mt-0.5 text-xs text-muted-foreground">
//                       Sorted using your
//                       project requirements.
//                     </p>
//                   </div>

//                   <div className="relative w-full sm:w-52">
//                     <StarIcon
//                       size={15}
//                       className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
//                     />

//                     <select
//                       value={sortBy}
//                       onChange={(
//                         event,
//                       ) =>
//                         setSortBy(
//                           event.target
//                             .value as SortOption,
//                         )
//                       }
//                       aria-label="Sort Allocats"
//                       className="h-10 w-full appearance-none rounded-full border border-input bg-background pl-10 pr-9 text-sm font-medium outline-none transition-colors focus:border-ring focus:ring-2 focus:ring-ring/20"
//                     >
//                       <option value="match">
//                         Best match
//                       </option>

//                       <option value="rating">
//                         Highest rated
//                       </option>

//                       <option value="rate-low">
//                         Lowest rate
//                       </option>

//                       <option value="experience">
//                         Most experienced
//                       </option>

//                       <option value="recent">
//                         Recently active
//                       </option>
//                     </select>

//                     <ChevronDownIcon
//                       size={14}
//                       className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
//                     />
//                   </div>
//                 </div>
//               )}

//               {loading ? (
//                 <AllocatGridSkeleton />
//               ) : filteredAllocats.length >
//                 0 ? (
//                 <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
//                   {filteredAllocats.map(
//                     (allocat) => {
//                       const relationshipStatus =
//                         relationshipStatusByAllocat.get(
//                           allocat.allocatrUserId,
//                         ) ?? null;

//                       return (
//                         <div
//                           key={
//                             allocat.allocatrUserId
//                           }
//                           className="min-w-0"
//                         >
//                           <AllocatCardGrid
//                             allocat={
//                               allocat
//                             }
//                             project={
//                               project
//                             }
//                             relationshipStatus={
//                               relationshipStatus
//                             }
//                             onStatusChange={(
//                               status,
//                             ) =>
//                               handleStatusChange(
//                                 allocat.allocatrUserId,
//                                 status,
//                               )
//                             }
//                           />
//                         </div>
//                       );
//                     },
//                   )}
//                 </div>
//               ) : (
//                 <EmptyState
//                   onReset={resetFilters}
//                 />
//               )}
//             </section>
//           </div>
//         )}
//       </main>
//     </div>
//   );
// }

// type FilterToggleProps = {
//   checked: boolean;
//   onChange: (checked: boolean) => void;
//   icon: React.ReactNode;
//   label: string;
//   description: string;
// };

// function FilterToggle({
//   checked,
//   onChange,
//   icon,
//   label,
//   description,
// }: FilterToggleProps) {
//   return (
//     <button
//       type="button"
//       role="switch"
//       aria-checked={checked}
//       onClick={() =>
//         onChange(!checked)
//       }
//       className="flex w-full items-center gap-3 rounded-2xl border border-border bg-muted/20 p-3 text-left transition-colors hover:bg-muted/50"
//     >
//       <span
//         className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-colors ${
//           checked
//             ? "bg-primary text-primary-foreground"
//             : "bg-muted text-muted-foreground"
//         }`}
//       >
//         {icon}
//       </span>

//       <span className="min-w-0 flex-1">
//         <span className="block text-sm font-semibold">
//           {label}
//         </span>

//         <span className="mt-0.5 block text-[11px] leading-4 text-muted-foreground">
//           {description}
//         </span>
//       </span>

//       <span
//         className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
//           checked
//             ? "bg-primary"
//             : "bg-muted-foreground/25"
//         }`}
//       >
//         <span
//           className={`absolute top-1 h-4 w-4 rounded-full bg-background shadow-sm transition-transform ${
//             checked
//               ? "translate-x-6"
//               : "translate-x-1"
//           }`}
//         />

//         {checked && (
//           <CheckIcon
//             size={9}
//             className="absolute left-1.5 top-1.5 text-primary-foreground"
//           />
//         )}
//       </span>
//     </button>
//   );
// }

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
//       allocat.verified ??
//       false,
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

// function getMatchScore(
//   allocat: FilterableAllocat,
// ): number {
//   return allocat.matchScore ?? 0;
// }

// function getDateValue(
//   date?: string,
// ): number {
//   if (!date) {
//     return 0;
//   }

//   const parsedDate =
//     new Date(date).getTime();

//   return Number.isNaN(parsedDate)
//     ? 0
//     : parsedDate;
// }

// function AllocatGridSkeleton() {
//   return (
//     <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
//       {Array.from({
//         length: 8,
//       }).map((_, index) => (
//         <div
//           key={index}
//           className="overflow-hidden rounded-[1.75rem] border border-border bg-background p-5"
//         >
//           <div className="flex items-center gap-3">
//             <Skeleton className="h-12 w-12 rounded-full" />

//             <div className="flex-1 space-y-2">
//               <Skeleton className="h-4 w-2/3" />
//               <Skeleton className="h-3 w-1/2" />
//             </div>
//           </div>

//           <Skeleton className="mt-6 h-4 w-full" />
//           <Skeleton className="mt-2 h-4 w-4/5" />

//           <div className="mt-6 flex gap-2">
//             <Skeleton className="h-7 w-20 rounded-full" />
//             <Skeleton className="h-7 w-24 rounded-full" />
//           </div>

//           <Skeleton className="mt-7 h-11 w-full rounded-full" />
//         </div>
//       ))}
//     </div>
//   );
// }

// function ErrorState({
//   message,
// }: {
//   message: string;
// }) {
//   return (
//     <div className="mt-8 flex min-h-[360px] flex-col items-center justify-center rounded-[2rem] border border-destructive/20 bg-destructive/5 px-6 text-center">
//       <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
//         <UsersIcon size={24} />
//       </div>

//       <h2 className="mt-5 text-xl font-bold">
//         We could not load the results
//       </h2>

//       <p className="mt-2 max-w-md text-sm leading-7 text-muted-foreground">
//         {message}
//       </p>

//       <Button
//         type="button"
//         onClick={() =>
//           window.location.reload()
//         }
//         className="mt-6 rounded-full px-6"
//       >
//         Try again
//       </Button>
//     </div>
//   );
// }

// function EmptyState({
//   onReset,
// }: {
//   onReset: () => void;
// }) {
//   return (
//     <div className="flex min-h-[420px] flex-col items-center justify-center rounded-[2rem] border border-dashed border-border bg-background px-6 text-center">
//       <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
//         <SearchIcon size={26} />
//       </div>

//       <h2 className="mt-6 text-2xl font-bold">
//         No matching Allocats
//       </h2>

//       <p className="mt-3 max-w-md text-sm leading-7 text-muted-foreground">
//         Try increasing the maximum
//         hourly rate, reducing the
//         experience requirement, or
//         changing the location.
//       </p>

//       <Button
//         type="button"
//         variant="outline"
//         onClick={onReset}
//         className="mt-6 rounded-full px-6 shadow-none"
//       >
//         Reset filters
//       </Button>
//     </div>
//   );
// }

// export default FindAllocats;


import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  useParams,
} from "react-router-dom";

import {
  BadgeCheckIcon,
  CheckIcon,
  ChevronDownIcon,
  MapPinIcon,
  SearchIcon,
  SlidersHorizontalIcon,
  StarIcon,
  UsersIcon,
} from "lucide-react";

import api from "@/api/axios";

import type {
  Project,
} from "@/Types/project";

import type {
  AllocatProfile,
} from "@/Types/allocatProfile";

import type {
  ProjectAllocat,
} from "@/Types/projectAllocat";

import type {
  ProjectAllocatStatus,
} from "@/Types/enums";

import {
  AllocatCardGrid,
} from "@/components/AllocatCard";

import MinimalNavMenu from "@/components/MinimalNavMenu";

import {
  Input,
} from "@/components/ui/input";

import {
  Label,
} from "@/components/ui/label";

import {
  Slider,
} from "@/components/ui/slider";

import {
  Button,
} from "@/components/ui/button";

import {
  Skeleton,
} from "@/components/ui/skeleton";

/* =========================================================
   TYPES
========================================================= */

type SortOption =
  | "match"
  | "rating"
  | "rate-low"
  | "experience"
  | "recent";

type FilterableAllocat =
  AllocatProfile & {
    location?: string;
    city?: string;
    country?: string;

    isVerified?: boolean;
    verified?: boolean;

    rating?: number;
    averageRating?: number;
    matchScore?: number;

    createdAt?: string;
    updatedAt?: string;
  };

/* =========================================================
   DEFAULTS
========================================================= */

const DEFAULT_LOCATION =
  "Zimbabwe, Harare";

const DEFAULT_MAX_RATE =
  100;

const DEFAULT_MIN_EXPERIENCE =
  1;

/* =========================================================
   PAGE
========================================================= */

function FindAllocats() {
  const {
    projectId,
  } = useParams();

  const [
    project,
    setProject,
  ] =
    useState<Project>();

  const [
    allocats,
    setAllocats,
  ] =
    useState<
      FilterableAllocat[]
    >([]);

  const [
    projectAllocats,
    setProjectAllocats,
  ] =
    useState<
      ProjectAllocat[]
    >([]);

  const [
    location,
    setLocation,
  ] =
    useState(
      DEFAULT_LOCATION,
    );

  const [
    maxHourlyRate,
    setMaxHourlyRate,
  ] =
    useState(
      DEFAULT_MAX_RATE,
    );

  const [
    minExperience,
    setMinExperience,
  ] =
    useState(
      DEFAULT_MIN_EXPERIENCE,
    );

  const [
    verifiedOnly,
    setVerifiedOnly,
  ] =
    useState(false);

  const [
    sortBy,
    setSortBy,
  ] =
    useState<SortOption>(
      "match",
    );

  const [
    loading,
    setLoading,
  ] =
    useState(true);

  const [
    error,
    setError,
  ] =
    useState<
      string | null
    >(null);

  /* =======================================================
     LOAD
  ======================================================= */

  useEffect(() => {
    if (!projectId) {
      setError(
        "No project was selected.",
      );

      setLoading(
        false,
      );

      return;
    }

    let cancelled =
      false;

    async function loadPage() {
      setLoading(
        true,
      );

      setError(
        null,
      );

      try {
        const [
          projectResponse,
          allocatsResponse,
          projectAllocatsResponse,
        ] =
          await Promise.all([
            api.get<Project>(
              `/projects/${projectId}`,
              {
                withCredentials:
                  true,
              },
            ),

            api.get<
              FilterableAllocat[]
            >(
              "/allocats/profiles",
              {
                withCredentials:
                  true,
              },
            ),

            api.get<
              ProjectAllocat[]
            >(
              `/projects/${projectId}/allocats`,
              {
                withCredentials:
                  true,
              },
            ),
          ]);

        if (cancelled) {
          return;
        }

        setProject(
          projectResponse.data,
        );

        setAllocats(
          allocatsResponse.data,
        );

        setProjectAllocats(
          projectAllocatsResponse.data,
        );
      } catch (
        requestError
      ) {
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
          setLoading(
            false,
          );
        }
      }
    }

    void loadPage();

    return () => {
      cancelled = true;
    };
  }, [projectId]);

  /* =======================================================
     FILTERING
  ======================================================= */

  const filteredAllocats =
    useMemo(() => {
      const normalizedLocation =
        location
          .trim()
          .toLowerCase();

      const results =
        allocats.filter(
          (
            allocat,
          ) => {
            const hourlyRate =
              allocat.hourlyRate ??
              0;

            const yearsExperience =
              allocat.yearsExperience ??
              0;

            const allocatLocation =
              getAllocatLocation(
                allocat,
              );

            const matchesLocation =
              !normalizedLocation ||
              !allocatLocation ||
              allocatLocation.includes(
                normalizedLocation,
              ) ||
              normalizedLocation.includes(
                allocatLocation,
              );

            const matchesRate =
              hourlyRate <=
              maxHourlyRate;

            const matchesExperience =
              yearsExperience >=
              minExperience;

            const matchesVerified =
              !verifiedOnly ||
              getIsVerified(
                allocat,
              );

            return (
              matchesLocation &&
              matchesRate &&
              matchesExperience &&
              matchesVerified
            );
          },
        );

      return [
        ...results,
      ].sort(
        (
          a,
          b,
        ) => {
          switch (
            sortBy
          ) {
            case "rating":
              return (
                getRating(
                  b,
                ) -
                getRating(
                  a,
                )
              );

            case "rate-low":
              return (
                (a.hourlyRate ??
                  Number.MAX_SAFE_INTEGER) -
                (b.hourlyRate ??
                  Number.MAX_SAFE_INTEGER)
              );

            case "experience":
              return (
                (b.yearsExperience ??
                  0) -
                (a.yearsExperience ??
                  0)
              );

            case "recent":
              return (
                getDateValue(
                  b.updatedAt ??
                    b.createdAt,
                ) -
                getDateValue(
                  a.updatedAt ??
                    a.createdAt,
                )
              );

            case "match":
            default:
              return (
                getMatchScore(
                  b,
                ) -
                getMatchScore(
                  a,
                )
              );
          }
        },
      );
    }, [
      allocats,
      location,
      maxHourlyRate,
      minExperience,
      verifiedOnly,
      sortBy,
    ]);

  /* =======================================================
     RELATIONSHIPS
  ======================================================= */

  const relationshipStatusByAllocat =
    useMemo(() => {
      return new Map<
        string,
        ProjectAllocatStatus
      >(
        projectAllocats.map(
          (
            relationship,
          ) => [
            relationship.allocatProfileId,
            relationship.status,
          ],
        ),
      );
    }, [
      projectAllocats,
    ]);

  /* =======================================================
     FILTER COUNT
  ======================================================= */

  const activeFilterCount =
    useMemo(() => {
      let count =
        0;

      if (
        location !==
        DEFAULT_LOCATION
      ) {
        count +=
          1;
      }

      if (
        maxHourlyRate !==
        DEFAULT_MAX_RATE
      ) {
        count +=
          1;
      }

      if (
        minExperience !==
        DEFAULT_MIN_EXPERIENCE
      ) {
        count +=
          1;
      }

      if (
        verifiedOnly
      ) {
        count +=
          1;
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

  function resetFilters() {
    setLocation(
      DEFAULT_LOCATION,
    );

    setMaxHourlyRate(
      DEFAULT_MAX_RATE,
    );

    setMinExperience(
      DEFAULT_MIN_EXPERIENCE,
    );

    setVerifiedOnly(
      false,
    );

    setSortBy(
      "match",
    );
  }

  function handleStatusChange(
    allocatProfileId:
      string,
    status:
      ProjectAllocatStatus,
  ) {
    if (!project) {
      return;
    }

    setProjectAllocats(
      (
        current,
      ) => {
        const existing =
          current.find(
            (
              relationship,
            ) =>
              relationship.allocatProfileId ===
              allocatProfileId,
          );

        if (
          existing
        ) {
          return current.map(
            (
              relationship,
            ) =>
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
            projectId:
              project.id,

            allocatProfileId,

            status,

            invitedAt:
              new Date().toISOString(),

            respondedAt:
              null,

            removedAt:
              null,
          },
        ];
      },
    );
  }

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <div className="min-h-screen bg-background text-foreground">

      {/* ===================================================
          HEADER
      =================================================== */}

      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/90 backdrop-blur-xl">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <MinimalNavMenu />
        </div>
      </header>

      <main className="container mx-auto px-5 py-8 md:px-8 lg:py-12">

        {/* =================================================
            INTRO
        ================================================= */}

        <section className="pb-8 lg:pb-10">
          <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
            <div className="min-w-0 max-w-4xl">
              <div className="flex items-center gap-2.5">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <UsersIcon
                    size={15}
                  />
                </span>

                <p className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-primary">
                  Find the right skill
                </p>
              </div>

              {loading ? (
                <div className="mt-6 space-y-3">
                  <Skeleton className="h-10 w-80 max-w-full" />

                  <Skeleton className="h-5 w-full max-w-2xl" />
                </div>
              ) : (
                <>
                  <h1 className="mt-5 max-w-4xl text-3xl font-black leading-[1.02] tracking-[-0.035em] sm:text-4xl lg:text-5xl">
                    Find Allocats for{" "}

                    <span className="text-primary">
                      {project?.title ||
                        "your project"}
                    </span>
                  </h1>

                  <p className="mt-4 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
                    Explore professionals who may
                    fit the work, then refine the
                    results using experience,
                    location and rate.
                  </p>
                </>
              )}
            </div>

            {!loading &&
              !error && (
                <div className="flex items-center gap-3 border-l border-border pl-5">
                  <span className="text-3xl font-black tracking-[-0.04em]">
                    {
                      filteredAllocats.length
                    }
                  </span>

                  <div>
                    <p className="text-xs font-semibold">
                      {
                        filteredAllocats.length ===
                        1
                          ? "Allocat"
                          : "Allocats"
                      }
                    </p>

                    <p className="text-[0.68rem] text-muted-foreground">
                      matching filters
                    </p>
                  </div>
                </div>
              )}
          </div>
        </section>

        {error ? (
          <ErrorState
            message={error}
          />
        ) : (
          <div className="grid items-start gap-8 border-t border-border pt-8 lg:grid-cols-[260px_minmax(0,1fr)] xl:grid-cols-[280px_minmax(0,1fr)] lg:gap-10">

            {/* =================================================
                FILTERS
            ================================================= */}

            <aside className="lg:sticky lg:top-24">
              <div className="border-b border-border pb-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <SlidersHorizontalIcon
                        size={16}
                        className="text-primary"
                      />

                      <h2 className="text-sm font-bold">
                        Refine
                      </h2>

                      {activeFilterCount >
                        0 && (
                        <span className="flex h-5 min-w-5 items-center justify-center rounded-md bg-primary/10 px-1.5 text-[0.62rem] font-bold text-primary">
                          {
                            activeFilterCount
                          }
                        </span>
                      )}
                    </div>

                    <p className="mt-1.5 text-xs leading-5 text-muted-foreground">
                      Narrow the results to the
                      kind of professional you
                      need.
                    </p>
                  </div>

                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={
                      resetFilters
                    }
                    disabled={
                      activeFilterCount ===
                      0
                    }
                    className="h-8 rounded-lg px-2.5 text-xs shadow-none"
                  >
                    Reset
                  </Button>
                </div>
              </div>

              <div className="divide-y divide-border">

                {/* Location */}

                <FilterSection
                  title="Location"
                >
                  <div className="relative">
                    <MapPinIcon
                      size={15}
                      className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
                    />

                    <Input
                      id="location"
                      name="location"
                      value={
                        location
                      }
                      onChange={(
                        event,
                      ) =>
                        setLocation(
                          event.target
                            .value,
                        )
                      }
                      placeholder="City or area"
                      className="h-11 rounded-lg border-border bg-background pl-10 shadow-none focus-visible:ring-1 focus-visible:ring-primary/50"
                    />
                  </div>
                </FilterSection>

                {/* Rate */}

                <FilterSection
                  title="Hourly rate"
                >
                  <div className="mb-5 flex items-center justify-between gap-4">
                    <span className="text-xs text-muted-foreground">
                      Maximum
                    </span>

                    <span className="text-xs font-bold text-foreground">
                      US$
                      {
                        maxHourlyRate
                      }
                      /hr
                    </span>
                  </div>

                  <Slider
                    value={[
                      maxHourlyRate,
                    ]}
                    onValueChange={([
                      value,
                    ]) =>
                      setMaxHourlyRate(
                        value,
                      )
                    }
                    min={0}
                    max={100}
                    step={1}
                  />

                  <div className="mt-3 flex justify-between text-[0.65rem] text-muted-foreground">
                    <span>
                      US$0
                    </span>

                    <span>
                      US$100+
                    </span>
                  </div>
                </FilterSection>

                {/* Experience */}

                <FilterSection
                  title="Experience"
                  description="Minimum years required"
                >
                  <div className="overflow-hidden rounded-lg border border-border">
                    {[
                      {
                        label:
                          "Any level",
                        value: 0,
                      },
                      {
                        label:
                          "1+ year",
                        value: 1,
                      },
                      {
                        label:
                          "3+ years",
                        value: 3,
                      },
                      {
                        label:
                          "5+ years",
                        value: 5,
                      },
                      {
                        label:
                          "10+ years",
                        value: 10,
                      },
                    ].map(
                      (
                        option,
                        index,
                      ) => {
                        const selected =
                          minExperience ===
                          option.value;

                        return (
                          <button
                            key={
                              option.value
                            }
                            type="button"
                            onClick={() =>
                              setMinExperience(
                                option.value,
                              )
                            }
                            aria-pressed={
                              selected
                            }
                            className={[
                              "flex w-full items-center justify-between gap-3 px-3.5 py-3 text-left",
                              "text-xs transition-colors",

                              index >
                              0
                                ? "border-t border-border"
                                : "",

                              selected
                                ? "bg-primary/[0.06] text-foreground"
                                : "bg-background text-muted-foreground hover:bg-muted/30 hover:text-foreground",
                            ].join(
                              " ",
                            )}
                          >
                            <span className="font-semibold">
                              {
                                option.label
                              }
                            </span>

                            <span
                              className={[
                                "flex h-4 w-4 items-center justify-center rounded-full border",

                                selected
                                  ? "border-primary bg-primary text-primary-foreground"
                                  : "border-border",
                              ].join(
                                " ",
                              )}
                            >
                              {selected && (
                                <CheckIcon
                                  size={
                                    9
                                  }
                                  strokeWidth={
                                    3
                                  }
                                />
                              )}
                            </span>
                          </button>
                        );
                      },
                    )}
                  </div>
                </FilterSection>

                {/* Verified */}

                <FilterSection
                  title="Verification"
                >
                  <FilterToggle
                    checked={
                      verifiedOnly
                    }
                    onChange={
                      setVerifiedOnly
                    }
                    icon={
                      <BadgeCheckIcon
                        size={16}
                      />
                    }
                    label="Verified only"
                    description="Only show professionals with verified profiles."
                  />
                </FilterSection>
              </div>
            </aside>

            {/* =================================================
                RESULTS
            ================================================= */}

            <section className="min-w-0">

              {!loading && (
                <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <p className="text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                      Recommendations
                    </p>

                    <h2 className="mt-1 text-lg font-bold tracking-[-0.02em]">
                      Best matches
                    </h2>
                  </div>

                  <SortControl
                    value={
                      sortBy
                    }
                    onChange={
                      setSortBy
                    }
                  />
                </div>
              )}

              {loading ? (
                <AllocatGridSkeleton />
              ) : filteredAllocats.length >
                0 ? (
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {filteredAllocats.map(
                    (
                      allocat,
                    ) => {
                      const relationshipStatus =
                        relationshipStatusByAllocat.get(
                          allocat.allocatrUserId,
                        ) ??
                        null;

                      return (
                        <div
                          key={
                            allocat.allocatrUserId
                          }
                          className="min-w-0"
                        >
                          <AllocatCardGrid
                            allocat={
                              allocat
                            }
                            project={
                              project
                            }
                            relationshipStatus={
                              relationshipStatus
                            }
                            onStatusChange={(
                              status,
                            ) =>
                              handleStatusChange(
                                allocat.allocatrUserId,
                                status,
                              )
                            }
                          />
                        </div>
                      );
                    },
                  )}
                </div>
              ) : (
                <EmptyState
                  onReset={
                    resetFilters
                  }
                />
              )}
            </section>
          </div>
        )}
      </main>
    </div>
  );
}

/* =========================================================
   FILTER SECTION
========================================================= */

function FilterSection({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="py-6">
      <div className="mb-4">
        <Label className="text-xs font-bold">
          {title}
        </Label>

        {description && (
          <p className="mt-1 text-[0.68rem] leading-5 text-muted-foreground">
            {description}
          </p>
        )}
      </div>

      {children}
    </section>
  );
}

/* =========================================================
   SORT
========================================================= */

function SortControl({
  value,
  onChange,
}: {
  value: SortOption;
  onChange: (
    value: SortOption,
  ) => void;
}) {
  return (
    <div className="relative w-full sm:w-52">
      <StarIcon
        size={14}
        className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
      />

      <select
        value={value}
        onChange={(
          event,
        ) =>
          onChange(
            event.target
              .value as SortOption,
          )
        }
        aria-label="Sort Allocats"
        className={[
          "h-10 w-full appearance-none rounded-lg border border-input bg-background",
          "pl-9 pr-9 text-xs font-semibold outline-none",
          "transition-colors focus:border-primary/50 focus:ring-1 focus:ring-primary/30",
        ].join(" ")}
      >
        <option value="match">
          Best match
        </option>

        <option value="rating">
          Highest rated
        </option>

        <option value="rate-low">
          Lowest rate
        </option>

        <option value="experience">
          Most experienced
        </option>

        <option value="recent">
          Recently active
        </option>
      </select>

      <ChevronDownIcon
        size={14}
        className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
      />
    </div>
  );
}

/* =========================================================
   VERIFIED TOGGLE
========================================================= */

type FilterToggleProps = {
  checked: boolean;

  onChange: (
    checked: boolean,
  ) => void;

  icon:
    React.ReactNode;

  label: string;

  description: string;
};

function FilterToggle({
  checked,
  onChange,
  icon,
  label,
  description,
}: FilterToggleProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={
        checked
      }
      onClick={() =>
        onChange(
          !checked,
        )
      }
      className={[
        "flex w-full items-center gap-3 rounded-lg border border-border px-3 py-3",
        "text-left transition-colors",

        checked
          ? "bg-primary/[0.055]"
          : "bg-background hover:bg-muted/30",
      ].join(" ")}
    >
      <span
        className={[
          "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",

          checked
            ? "bg-primary/10 text-primary"
            : "bg-muted text-muted-foreground",
        ].join(" ")}
      >
        {icon}
      </span>

      <span className="min-w-0 flex-1">
        <span className="block text-xs font-bold">
          {label}
        </span>

        <span className="mt-0.5 block text-[0.65rem] leading-4 text-muted-foreground">
          {
            description
          }
        </span>
      </span>

      <span
        className={[
          "relative h-5 w-9 shrink-0 rounded-full transition-colors",

          checked
            ? "bg-primary"
            : "bg-muted-foreground/25",
        ].join(" ")}
      >
        <span
          className={[
            "absolute top-0.5 h-4 w-4 rounded-full bg-background shadow-sm",
            "transition-transform duration-200",

            checked
              ? "translate-x-[18px]"
              : "translate-x-0.5",
          ].join(" ")}
        />
      </span>
    </button>
  );
}

/* =========================================================
   HELPERS
========================================================= */

function getAllocatLocation(
  allocat:
    FilterableAllocat,
): string {
  return [
    allocat.location,
    allocat.city,
    allocat.country,
  ]
    .filter(
      Boolean,
    )
    .join(", ")
    .toLowerCase();
}

function getIsVerified(
  allocat:
    FilterableAllocat,
): boolean {
  return Boolean(
    allocat.isVerified ??
      allocat.verified ??
      false,
  );
}

function getRating(
  allocat:
    FilterableAllocat,
): number {
  return (
    allocat.averageRating ??
    allocat.rating ??
    0
  );
}

function getMatchScore(
  allocat:
    FilterableAllocat,
): number {
  return (
    allocat.matchScore ??
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
    new Date(
      date,
    ).getTime();

  return Number.isNaN(
    parsedDate,
  )
    ? 0
    : parsedDate;
}

/* =========================================================
   SKELETON
========================================================= */

function AllocatGridSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {Array.from({
        length: 6,
      }).map(
        (
          _,
          index,
        ) => (
          <div
            key={
              index
            }
            className="border-b border-border py-5 sm:rounded-xl sm:border sm:p-5"
          >
            <div className="flex items-center gap-3">
              <Skeleton className="h-11 w-11 rounded-full" />

              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-2/3" />

                <Skeleton className="h-3 w-1/2" />
              </div>
            </div>

            <Skeleton className="mt-6 h-3.5 w-full" />

            <Skeleton className="mt-2 h-3.5 w-4/5" />

            <div className="mt-6 flex gap-2">
              <Skeleton className="h-6 w-20 rounded-md" />

              <Skeleton className="h-6 w-24 rounded-md" />
            </div>

            <Skeleton className="mt-7 h-10 w-full rounded-lg" />
          </div>
        ),
      )}
    </div>
  );
}

/* =========================================================
   ERROR
========================================================= */

function ErrorState({
  message,
}: {
  message: string;
}) {
  return (
    <div className="mt-8 border-y border-destructive/20 py-16 text-center">
      <span className="mx-auto flex h-11 w-11 items-center justify-center rounded-lg bg-destructive/10 text-destructive">
        <UsersIcon
          size={20}
        />
      </span>

      <h2 className="mt-5 text-xl font-bold">
        We could not load
        the results
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

/* =========================================================
   EMPTY
========================================================= */

function EmptyState({
  onReset,
}: {
  onReset:
    () => void;
}) {
  return (
    <div className="flex min-h-[360px] flex-col items-center justify-center border-y border-border px-6 text-center">
      <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
        <SearchIcon
          size={21}
        />
      </span>

      <h2 className="mt-5 text-xl font-bold">
        No matching
        Allocats
      </h2>

      <p className="mt-2 max-w-md text-sm leading-7 text-muted-foreground">
        Try widening the
        location, increasing
        the hourly rate or
        reducing the experience
        requirement.
      </p>

      <Button
        type="button"
        variant="outline"
        onClick={
          onReset
        }
        className="mt-6 h-10 rounded-lg px-5 shadow-none"
      >
        Reset filters
      </Button>
    </div>
  );
}

export default FindAllocats;