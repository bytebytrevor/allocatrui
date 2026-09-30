// import {
//   type ComponentType,
//   type ReactNode,
//   useCallback,
//   useEffect,
//   useMemo,
//   useRef,
//   useState,
// } from "react";

// import { AnimatePresence, motion } from "framer-motion";
// import { Link } from "react-router-dom";

// import {
//   ArrowDownNarrowWideIcon,
//   ArrowRightIcon,
//   BriefcaseBusinessIcon,
//   CheckCircle2Icon,
//   ChevronDownIcon,
//   CircleDotIcon,
//   Clock3Icon,
//   FolderOpenIcon,
//   Grid2X2Icon,
//   InboxIcon,
//   LayoutListIcon,
//   LoaderCircleIcon,
//   PlusIcon,
//   RefreshCwIcon,
//   SearchIcon,
//   SendIcon,
//   SparklesIcon,
//   XIcon,
// } from "lucide-react";

// import { toast } from "sonner";

// import api from "@/api/axios";
// import { useAuth } from "@/auth/AuthContext";

// import DashboardMainNav from "@/components/DashboardMainNav";
// import LoadingState from "@/components/LoadingState";
// import { GridView, ListView } from "@/components/ProjectCard";

// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";

// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";

// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";

// import type { Project } from "@/Types/project";
// import type { ProjectAllocatStatus } from "@/Types/enums";

// /* =========================================================
//    TYPES
// ========================================================= */

// type ProjectView = "grid" | "list";
// type ProjectFilter = "active" | "pending" | "closed";
// type WorkspaceSection = "projects" | "work";
// type WorkFilter = "invitations" | "active" | "completed";
// type ProjectSort = "newest" | "oldest" | "title-asc" | "title-desc";

// type SummaryItem = {
//   label: string;
//   value: number;
//   icon: ComponentType<{ size?: number; className?: string }>;
//   emphasis?: "primary" | "warning" | "success";
//   active?: boolean;
//   attention?: boolean;
//   onClick?: () => void;
// };

// type OwnedProjectGroups = {
//   active: Project[];
//   pending: Project[];
//   closed: Project[];
// };

// type SortOption = {
//   value: ProjectSort;
//   label: string;
// };

// export type WorkProject = Project & {
//   projectAllocatStatus: ProjectAllocatStatus;
//   invitedAt?: string;
//   respondedAt?: string | null;
// };

// /* =========================================================
//    CONSTANTS
// ========================================================= */

// const CLOSED_PROJECT_STATUSES = new Set([
//   "closed",
//   "complete",
//   "completed",
//   "cancelled",
//   "canceled",
// ]);

// const PAUSED_PROJECT_STATUSES = new Set(["paused", "onhold"]);

// const SORT_OPTIONS: SortOption[] = [
//   { value: "newest", label: "Newest first" },
//   { value: "oldest", label: "Oldest first" },
//   { value: "title-asc", label: "Title A–Z" },
//   { value: "title-desc", label: "Title Z–A" },
// ];

// const primaryActionButton = [
//   "bg-[#0D566D] text-white",
//   "hover:bg-[#0A4A5D] hover:text-white",
//   "dark:bg-[#DEDA00] dark:text-[#252525]",
//   "dark:hover:bg-[#d4d000] dark:hover:text-[#252525]",
// ].join(" ");

// const secondaryActionButton = [
//   "border-[#0D566D]/[0.11] bg-[#F4F8F6] text-[#31545D]",
//   "hover:border-[#0D566D]/20 hover:bg-[#EAF1EF] hover:text-[#153F49]",
//   "dark:border-white/[0.09] dark:bg-white/[0.025] dark:text-white/75",
//   "dark:hover:border-white/[0.15] dark:hover:bg-white/[0.055] dark:hover:text-white",
// ].join(" ");

// /* =========================================================
//    PAGE
// ========================================================= */

// function Projects() {
//   const { user } = useAuth();

//   const [workspaceSection, setWorkspaceSection] = useState<WorkspaceSection>("projects");
//   const [view, setView] = useState<ProjectView>("grid");
//   const [filter, setFilter] = useState<ProjectFilter>("active");
//   const [workFilter, setWorkFilter] = useState<WorkFilter>("active");
//   const [sort, setSort] = useState<ProjectSort>("newest");

//   const [projects, setProjects] = useState<Project[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<Error | null>(null);

//   const [workProjects, setWorkProjects] = useState<WorkProject[]>([]);
//   const [workLoading, setWorkLoading] = useState(false);
//   const [workLoaded, setWorkLoaded] = useState(false);
//   const [workError, setWorkError] = useState<string | null>(null);

//   const workPrefetchedForUserRef = useRef<string | null>(null);

//   /* =======================================================
//      LOAD OWN PROJECTS
//   ======================================================= */

//   const fetchProjects = useCallback(async () => {
//     setLoading(true);
//     setError(null);

//     try {
//       const response = await api.get<Project[]>("/projects/mine", {
//         withCredentials: true,
//       });

//       setProjects(Array.isArray(response.data) ? response.data : []);
//     } catch (err: unknown) {
//       console.error("Could not load owned projects:", err);

//       setError(
//         err instanceof Error
//           ? err
//           : new Error("Your projects could not be loaded."),
//       );
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   /* =======================================================
//      LOAD ALLOCAT WORK
//   ======================================================= */

//   const fetchWorkProjects = useCallback(
//     async ({ notifyOnError = false }: { notifyOnError?: boolean } = {}) => {
//       if (!user?.isAllocat) return;

//       const requestUserKey = user.userId ?? user.email ?? null;
//       if (!requestUserKey) return;

//       setWorkLoading(true);
//       setWorkError(null);

//       try {
//         const response = await api.get<WorkProject[]>("/allocats/me/projects", {
//           withCredentials: true,
//         });

//         if (workPrefetchedForUserRef.current !== requestUserKey) return;

//         setWorkProjects(Array.isArray(response.data) ? response.data : []);
//         setWorkLoaded(true);
//       } catch (err) {
//         if (workPrefetchedForUserRef.current !== requestUserKey) return;

//         console.error("Could not load Allocat work:", err);
//         setWorkError("Your client work could not be loaded.");

//         if (notifyOnError) toast.error("We could not load your work.");
//       } finally {
//         if (workPrefetchedForUserRef.current === requestUserKey) {
//           setWorkLoading(false);
//         }
//       }
//     },
//     [user?.isAllocat, user?.userId, user?.email],
//   );

//   /* =======================================================
//      UPDATE HANDLERS
//   ======================================================= */

//   const handleOwnedProjectUpdated = useCallback((updatedProject: Project) => {
//     setProjects(current =>
//       current.map(project =>
//         project.id === updatedProject.id
//           ? { ...project, ...updatedProject }
//           : project,
//       ),
//     );
//   }, []);

//   const handleWorkProjectUpdated = useCallback((updatedProject: Project) => {
//     setWorkProjects(current =>
//       current.map(project =>
//         project.id === updatedProject.id
//           ? { ...project, ...updatedProject }
//           : project,
//       ),
//     );
//   }, []);

//   /* =======================================================
//      INITIAL LOAD
//   ======================================================= */

//   useEffect(() => {
//     if (!user?.userId) return;
//     void fetchProjects();
//   }, [user?.userId, fetchProjects]);

//   useEffect(() => {
//     if (!user?.isAllocat) {
//       workPrefetchedForUserRef.current = null;
//       setWorkProjects([]);
//       setWorkLoaded(false);
//       setWorkLoading(false);
//       setWorkError(null);
//       return;
//     }

//     const userKey = user.userId ?? user.email ?? null;
//     if (!userKey) return;

//     if (workPrefetchedForUserRef.current === userKey) return;

//     setWorkProjects([]);
//     setWorkLoaded(false);
//     setWorkError(null);

//     workPrefetchedForUserRef.current = userKey;
//     void fetchWorkProjects();
//   }, [user?.isAllocat, user?.userId, user?.email, fetchWorkProjects]);

//   useEffect(() => {
//     if (!user?.isAllocat && workspaceSection === "work") {
//       setWorkspaceSection("projects");
//     }
//   }, [user?.isAllocat, workspaceSection]);

//   const firstName = user?.fullName?.trim().split(/\s+/)[0] || "there";

//   /* =======================================================
//      OWN PROJECT CLASSIFICATION
//   ======================================================= */

//   const ownedProjectGroups = useMemo<OwnedProjectGroups>(() => {
//     const groups: OwnedProjectGroups = {
//       active: [],
//       pending: [],
//       closed: [],
//     };

//     for (const project of projects) {
//       const status = normalizeProjectStatus(project.status);

//       if (CLOSED_PROJECT_STATUSES.has(status)) {
//         groups.closed.push(project);
//         continue;
//       }

//       if (PAUSED_PROJECT_STATUSES.has(status)) {
//         groups.pending.push(project);
//         continue;
//       }

//       if (
//         status === "active" ||
//         status === "completionrequested" ||
//         project.hasAcceptedAllocat === true
//       ) {
//         groups.active.push(project);
//         continue;
//       }

//       groups.pending.push(project);
//     }

//     return groups;
//   }, [projects]);

//   const activeProjects = ownedProjectGroups.active;
//   const pendingProjects = ownedProjectGroups.pending;
//   const closedProjects = ownedProjectGroups.closed;

//   const completionRequests = useMemo(
//     () =>
//       projects.filter(
//         project =>
//           normalizeProjectStatus(project.status) === "completionrequested",
//       ),
//     [projects],
//   );

//   /* =======================================================
//      OWN PROJECT FILTERING
//   ======================================================= */

//   const visibleProjects = useMemo(() => {
//     let filteredProjects: Project[];

//     if (filter === "pending") {
//       filteredProjects = pendingProjects;
//     } else if (filter === "closed") {
//       filteredProjects = closedProjects;
//     } else {
//       filteredProjects = activeProjects;
//     }

//     return sortProjectItems(filteredProjects, sort);
//   }, [filter, activeProjects, pendingProjects, closedProjects, sort]);

//   /* =======================================================
//      ALLOCAT WORK
//   ======================================================= */

//   const invitations = useMemo(
//     () =>
//       workProjects.filter(
//         project => project.projectAllocatStatus === "Invited",
//       ),
//     [workProjects],
//   );

//   const activeWork = useMemo(
//     () =>
//       workProjects.filter(project => {
//         if (project.projectAllocatStatus !== "Accepted") return false;

//         const status = normalizeProjectStatus(project.status);
//         return !CLOSED_PROJECT_STATUSES.has(status);
//       }),
//     [workProjects],
//   );

//   const completedWork = useMemo(
//     () =>
//       workProjects.filter(project => {
//         if (project.projectAllocatStatus !== "Accepted") return false;

//         const status = normalizeProjectStatus(project.status);
//         return CLOSED_PROJECT_STATUSES.has(status);
//       }),
//     [workProjects],
//   );

//   const visibleWork = useMemo(() => {
//     let filteredWork: WorkProject[];

//     if (workFilter === "invitations") {
//       filteredWork = invitations;
//     } else if (workFilter === "completed") {
//       filteredWork = completedWork;
//     } else {
//       filteredWork = activeWork;
//     }

//     return sortProjectItems(filteredWork, sort);
//   }, [workFilter, invitations, activeWork, completedWork, sort]);

//   /* =======================================================
//      INVITATIONS
//   ======================================================= */

//   async function acceptInvitation(projectId: string) {
//     try {
//       await api.patch(
//         `/projects/${projectId}/allocats/invite/accept`,
//         {},
//         { withCredentials: true },
//       );

//       await fetchWorkProjects();
//       toast.success("Project invitation accepted.");
//     } catch (error) {
//       console.error("Could not accept invitation:", error);
//       toast.error("The invitation could not be accepted.");
//       throw error;
//     }
//   }

//   async function declineInvitation(projectId: string) {
//     try {
//       await api.patch(
//         `/projects/${projectId}/allocats/invite/decline`,
//         {},
//         { withCredentials: true },
//       );

//       setWorkProjects(current =>
//         current.map(project =>
//           project.id === projectId
//             ? {
//                 ...project,
//                 projectAllocatStatus: "Declined",
//                 respondedAt: new Date().toISOString(),
//               }
//             : project,
//         ),
//       );

//       toast.success("Project invitation declined.");
//     } catch (error) {
//       console.error("Could not decline invitation:", error);
//       toast.error("The invitation could not be declined.");
//       throw error;
//     }
//   }

//   /* =======================================================
//      PAGE STATE
//   ======================================================= */

//   const workspaceLoading =
//     loading || Boolean(user?.isAllocat && workLoading && !workLoaded);

//   if (workspaceLoading) return <WorkspaceLoading />;
//   if (error) return <WorkspaceError onRetry={fetchProjects} />;

//   const showNewClientState = projects.length === 0 && !user?.isAllocat;

//   /* =======================================================
//      SUMMARY
//   ======================================================= */

//   const summaryItems: SummaryItem[] =
//     workspaceSection === "projects"
//       ? [
//           {
//             label: "Active",
//             value: activeProjects.length,
//             icon: CircleDotIcon,
//             emphasis: "primary",
//             active: filter === "active",
//             attention: completionRequests.length > 0,
//             onClick: () => setFilter("active"),
//           },
//           {
//             label: "Pending",
//             value: pendingProjects.length,
//             icon: Clock3Icon,
//             emphasis: "warning",
//             active: filter === "pending",
//             attention: pendingProjects.length > 0,
//             onClick: () => setFilter("pending"),
//           },
//           {
//             label: "Completed",
//             value: closedProjects.length,
//             icon: CheckCircle2Icon,
//             emphasis: "success",
//             active: filter === "closed",
//             onClick: () => setFilter("closed"),
//           },
//         ]
//       : [
//           {
//             label: "Invitations",
//             value: invitations.length,
//             icon: InboxIcon,
//             emphasis: "warning",
//             active: workFilter === "invitations",
//             attention: invitations.length > 0,
//             onClick: () => setWorkFilter("invitations"),
//           },
//           {
//             label: "Active",
//             value: activeWork.length,
//             icon: BriefcaseBusinessIcon,
//             emphasis: "primary",
//             active: workFilter === "active",
//             onClick: () => setWorkFilter("active"),
//           },
//           {
//             label: "Completed",
//             value: completedWork.length,
//             icon: CheckCircle2Icon,
//             emphasis: "success",
//             active: workFilter === "completed",
//             onClick: () => setWorkFilter("completed"),
//           },
//         ];

//   const workCount = invitations.length + activeWork.length + completedWork.length;

//   const sectionTitle =
//     workspaceSection === "projects"
//       ? filter === "pending"
//         ? "Pending projects"
//         : filter === "closed"
//           ? "Completed projects"
//           : "Active projects"
//       : workFilter === "invitations"
//         ? "Invitations"
//         : workFilter === "completed"
//           ? "Completed work"
//           : "Active work";

//   const sectionDescription =
//     workspaceSection === "projects"
//       ? filter === "pending"
//         ? "Projects waiting for an Allocat or the next step."
//         : filter === "closed"
//           ? "Projects that have already crossed the finish line."
//           : "The projects currently moving through your workspace."
//       : workFilter === "invitations"
//         ? "Projects clients have invited you to join."
//         : workFilter === "completed"
//           ? "Client projects you have completed."
//           : "The client work currently on your plate.";

//   /* =======================================================
//      RENDER
//   ======================================================= */

//   return (
//     <div className="flex min-h-screen flex-col bg-[#F2F5F3] text-[#28383C] dark:bg-[#08171C] dark:text-white">
//       <header
//         className={[
//           "sticky top-0 z-50 border-b backdrop-blur-xl",
//           "border-[#0D566D]/[0.055] bg-[#F8FAF8]/95",
//           "dark:border-white/[0.055] dark:bg-[#08171C]/95",
//         ].join(" ")}
//       >
//         <div className="container mx-auto px-4 sm:px-5 md:px-8">
//           <DashboardMainNav />
//         </div>
//       </header>

//       {showNewClientState ? (
//         <main className="container mx-auto flex flex-1 items-center justify-center px-4 py-10 sm:px-5 sm:py-14 md:px-8">
//           <NewClientWelcome firstName={firstName} />
//         </main>
//       ) : (
//         <>
//           <div className="container mx-auto px-4 pt-4 sm:px-5 sm:pt-5 md:px-8 lg:pt-6">
//             <WorkspaceMasthead
//               firstName={firstName}
//               isAllocat={Boolean(user?.isAllocat)}
//               workspaceSection={workspaceSection}
//               onSectionChange={setWorkspaceSection}
//               projectCount={projects.length}
//               workCount={workCount}
//               invitationCount={invitations.length}
//               items={summaryItems}
//             />
//           </div>

//           <main className="container mx-auto flex-1 px-4 pb-10 pt-7 sm:px-5 sm:pb-12 sm:pt-8 md:px-8 lg:pt-9">
//             <motion.section
//               initial={{ opacity: 0, y: 7 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ delay: 0.04, duration: 0.3, ease: "easeOut" }}
//             >
//               <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
//                 <div className="min-w-0">
//                   <div className="flex items-center gap-2.5">
//                     <span className="h-1.5 w-5 rounded-full bg-[#52747C] dark:bg-[#7DA6B1]" />
//                     <span className="h-1.5 w-2 rounded-full bg-[#B4863F] dark:bg-[#DEDA00]" />

//                     <p className="text-[0.54rem] font-semibold uppercase tracking-[0.16em] text-[#687C80] dark:text-white/30">
//                       {workspaceSection === "projects" ? "Your workspace" : "Client work"}
//                     </p>
//                   </div>

//                   <h2 className="mt-3 text-xl font-semibold tracking-[-0.025em] text-[#22393F] sm:text-2xl dark:text-white">
//                     {sectionTitle}
//                   </h2>

//                   <p className="mt-1.5 hidden max-w-2xl text-xs leading-6 text-[#687A7E] sm:block sm:text-sm dark:text-white/34">
//                     {sectionDescription}
//                   </p>
//                 </div>

//                 {!(
//                   workspaceSection === "work" &&
//                   workFilter === "invitations"
//                 ) && (
//                   <ProjectControls
//                     sort={sort}
//                     setSort={setSort}
//                     view={view}
//                     setView={setView}
//                   />
//                 )}
//               </div>

//               {workspaceSection === "projects" && (
//                 <ProjectResults
//                   projects={visibleProjects}
//                   view={view}
//                   emptyLabel={filter === "closed" ? "completed" : filter}
//                   onProjectUpdated={handleOwnedProjectUpdated}
//                 />
//               )}

//               {workspaceSection === "work" && user?.isAllocat && (
//                 <>
//                   {workError && !workLoaded ? (
//                     <WorkLoadError
//                       onRetry={() =>
//                         void fetchWorkProjects({
//                           notifyOnError: true,
//                         })
//                       }
//                     />
//                   ) : workFilter === "invitations" ? (
//                     invitations.length > 0 ? (
//                       <div className="mt-6 grid gap-3">
//                         {sortProjectItems(invitations, sort).map(project => (
//                           <InvitationCard
//                             key={project.id}
//                             project={project}
//                             onAccept={() => acceptInvitation(project.id)}
//                             onDecline={() => declineInvitation(project.id)}
//                           />
//                         ))}
//                       </div>
//                     ) : (
//                       <WorkEmptyState
//                         title="No invitations"
//                         description="New project invitations will appear here when a client invites you to join their work."
//                         icon={InboxIcon}
//                       />
//                     )
//                   ) : visibleWork.length > 0 ? (
//                     <ProjectGrid
//                       projects={visibleWork}
//                       view={view}
//                       onProjectUpdated={handleWorkProjectUpdated}
//                     />
//                   ) : (
//                     <WorkEmptyState
//                       title={
//                         workFilter === "completed"
//                           ? "No completed work"
//                           : "No active work"
//                       }
//                       description={
//                         workFilter === "completed"
//                           ? "Projects you complete for clients will appear here."
//                           : "Projects you accept from clients will appear here."
//                       }
//                       icon={BriefcaseBusinessIcon}
//                     />
//                   )}
//                 </>
//               )}
//             </motion.section>
//           </main>
//         </>
//       )}
//     </div>
//   );
// }

// /* =========================================================
//    NEW CLIENT WELCOME
// ========================================================= */

// function NewClientWelcome({ firstName }: { firstName: string }) {
//   return (
//     <motion.section
//       initial={{ opacity: 0, y: 8 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.35, ease: "easeOut" }}
//       className="w-full max-w-xl text-center"
//     >
//       <span className="mx-auto flex h-10 w-10 items-center justify-center rounded-lg bg-[#DCE9E6] text-[#0D566D] dark:bg-[#DEDA00]/[0.08] dark:text-[#DEDA00]">
//         <SparklesIcon size={16} />
//       </span>

//       <p className="mt-6 text-[0.56rem] font-semibold uppercase tracking-[0.17em] text-[#687B7F] dark:text-white/30">
//         Welcome to Allocatr
//       </p>

//       <h1 className="mt-2.5 text-2xl font-semibold leading-[1.12] tracking-[-0.03em] text-[#22393F] sm:text-3xl dark:text-white">
//         What would you like to do first, {firstName}?
//       </h1>

//       <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-[#687A7E] dark:text-white/38">
//         Create a project if you already know what needs to be done, or discover
//         Allocats and find the right person first.
//       </p>

//       <div className="mt-8 flex flex-col justify-center gap-2.5 sm:flex-row sm:items-center">
//         <Button
//           asChild
//           className={[
//             "group h-10 rounded-lg px-5 text-xs font-semibold shadow-none",
//             primaryActionButton,
//           ].join(" ")}
//         >
//           <Link to="/projects/new">
//             <PlusIcon size={14} />
//             Create a project

//             <ArrowRightIcon
//               size={12}
//               className="transition-transform duration-200 group-hover:translate-x-0.5"
//             />
//           </Link>
//         </Button>

//         <Button
//           asChild
//           variant="outline"
//           className={[
//             "h-10 rounded-lg px-5 text-xs font-semibold shadow-none",
//             secondaryActionButton,
//           ].join(" ")}
//         >
//           <Link to="/discover">
//             <SearchIcon size={14} />
//             Discover Allocats
//           </Link>
//         </Button>
//       </div>

//       <p className="mt-5 text-[0.66rem] text-[#829195] dark:text-white/23">
//         You can do either at any time.
//       </p>
//     </motion.section>
//   );
// }

// /* =========================================================
//    WORKSPACE MASTHEAD
// ========================================================= */

// function WorkspaceMasthead({
//   firstName,
//   isAllocat,
//   workspaceSection,
//   onSectionChange,
//   projectCount,
//   workCount,
//   invitationCount,
//   items,
// }: {
//   firstName: string;
//   isAllocat: boolean;
//   workspaceSection: WorkspaceSection;
//   onSectionChange: (section: WorkspaceSection) => void;
//   projectCount: number;
//   workCount: number;
//   invitationCount: number;
//   items: SummaryItem[];
// }) {
//   return (
//     <motion.section
//       initial={{ opacity: 0, y: 5 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.28, ease: "easeOut" }}
//       className={[
//         "relative overflow-hidden rounded-[1.35rem] border",
//         "border-[#0D566D]/[0.095] bg-[#E8EFED]",
//         "shadow-[0_18px_50px_-40px_rgba(13,86,109,0.38)]",
//         "dark:border-white/[0.065] dark:bg-[#0C1D22]",
//         "dark:shadow-[0_18px_48px_-34px_rgba(0,0,0,0.55)]",
//       ].join(" ")}
//     >
//       <span className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#0D566D]/30 to-transparent dark:via-[#DEDA00]/55" />

//       <span className="pointer-events-none absolute -right-20 -top-28 h-64 w-64 rounded-full bg-[#8BAEB5]/[0.10] blur-3xl dark:bg-[#0D566D]/20" />

//       <div className="relative grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-4 py-5 sm:gap-6 sm:px-6 sm:py-6 lg:px-7 lg:py-7">
//         <div className="min-w-0">
//           <div className="flex items-center gap-2.5">
//             <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#D5E4E0] text-[#0D566D] dark:bg-[#10262D] dark:text-[#DEDA00]">
//               <BriefcaseBusinessIcon size={13} />
//             </span>

//             <p className="text-[0.55rem] font-semibold uppercase tracking-[0.17em] text-[#627A80] dark:text-white/30">
//               Workspace
//             </p>
//           </div>

//           <h1 className="mt-3 truncate text-xl font-semibold leading-tight tracking-[-0.03em] text-[#22393F] sm:text-2xl lg:text-[1.75rem] dark:text-white">
//             Welcome back,{" "}
//             <span className="text-[#0D566D] dark:text-[#DEDA00]">
//               {firstName}
//             </span>
//             .
//           </h1>

//           <p className="mt-1.5 hidden max-w-xl text-xs leading-6 text-[#64787C] md:block dark:text-white/35">
//             {workspaceSection === "projects"
//               ? "Keep the work moving. Everything you own, everything waiting and everything finished lives here."
//               : "Your client work, active jobs and invitations — without the noise."}
//           </p>
//         </div>

//         <div className="flex shrink-0 items-center gap-2">
//           <Button
//             asChild
//             size="icon"
//             className={[
//               "group h-9 w-9 rounded-lg shadow-none sm:w-auto sm:px-4",
//               primaryActionButton,
//             ].join(" ")}
//           >
//             <Link to="/projects/new" aria-label="New project">
//               <PlusIcon size={13} />

//               <span className="hidden text-xs font-semibold sm:inline">
//                 New project
//               </span>

//               <ArrowRightIcon
//                 size={12}
//                 className="hidden transition-transform duration-200 group-hover:translate-x-0.5 sm:block"
//               />
//             </Link>
//           </Button>

//           <Button
//             asChild
//             variant="outline"
//             size="icon"
//             className={[
//               "h-9 w-9 rounded-lg shadow-none sm:w-auto sm:px-4",
//               secondaryActionButton,
//             ].join(" ")}
//           >
//             <Link to="/discover" aria-label="Discover Allocats">
//               <SearchIcon size={13} />

//               <span className="hidden text-xs font-semibold sm:inline">
//                 Discover Allocats
//               </span>
//             </Link>
//           </Button>
//         </div>
//       </div>

//       <div className="relative border-t border-[#0D566D]/[0.075] bg-[#DFE8E5]/65 px-3 py-2.5 dark:border-white/[0.055] dark:bg-black/[0.10] sm:px-5">
//         <div className="flex min-w-0 items-center justify-between gap-3 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
//           <div className="shrink-0">
//             {isAllocat ? (
//               <div
//                 className={[
//                   "inline-flex items-center rounded-full border p-1",
//                   "border-[#0D566D]/[0.08] bg-[#D3DFDC]",
//                   "shadow-[inset_0_1px_1px_rgba(13,86,109,0.04)]",
//                   "dark:border-white/[0.07] dark:bg-[#08171C]/75",
//                   "dark:shadow-none",
//                 ].join(" ")}
//               >
//                 <WorkspaceTab
//                   active={workspaceSection === "projects"}
//                   onClick={() => onSectionChange("projects")}
//                   icon={BriefcaseBusinessIcon}
//                   label="My projects"
//                   count={projectCount}
//                 />

//                 <WorkspaceTab
//                   active={workspaceSection === "work"}
//                   onClick={() => onSectionChange("work")}
//                   icon={SparklesIcon}
//                   label="My work"
//                   count={workCount}
//                   attention={invitationCount > 0}
//                 />
//               </div>
//             ) : (
//               <p className="hidden whitespace-nowrap text-[0.54rem] font-semibold uppercase tracking-[0.16em] text-[#647B80] sm:block dark:text-white/27">
//                 Project overview
//               </p>
//             )}
//           </div>

//           <div className="flex shrink-0 items-center gap-1">
//             {items.map(item => (
//               <WorkspaceMetric key={item.label} item={item} />
//             ))}
//           </div>
//         </div>
//       </div>
//     </motion.section>
//   );
// }

// /* =========================================================
//    WORKSPACE METRIC
// ========================================================= */

// function WorkspaceMetric({ item }: { item: SummaryItem }) {
//   const Icon = item.icon;

//   const iconClass =
//     item.emphasis === "success"
//       ? "text-[#4D8158] dark:text-[#38D200]"
//       : item.emphasis === "warning"
//         ? "text-[#A66D29] dark:text-[#F0A23A]"
//         : "text-[#0D566D] dark:text-[#DEDA00]";

//   return (
//     <button
//       type="button"
//       onClick={item.onClick}
//       aria-pressed={item.active}
//       title={item.label}
//       className={[
//         "relative flex h-8 items-center gap-2 rounded-lg px-2.5 text-left",
//         "transition-[background-color,color] duration-200",
//         item.active
//           ? [
//               "bg-[#D2E2DE] text-[#264C55]",
//               "shadow-[0_1px_2px_rgba(13,86,109,0.05)]",
//               "dark:bg-white/[0.07] dark:text-white",
//             ].join(" ")
//           : [
//               "text-[#62767A] hover:bg-[#D8E4E1]/75 hover:text-[#294A51]",
//               "dark:text-white/35 dark:hover:bg-white/[0.035] dark:hover:text-white/65",
//             ].join(" "),
//       ].join(" ")}
//     >
//       {item.active && (
//         <motion.span
//           layoutId="workspace-active-metric"
//           className="absolute inset-x-2.5 bottom-0 h-[2px] rounded-full bg-[#0D566D] dark:bg-[#DEDA00]"
//           transition={{ type: "spring", stiffness: 500, damping: 38 }}
//         />
//       )}

//       <span className="relative flex shrink-0 items-center">
//         {item.attention && (
//           <span className="absolute -right-1.5 -top-1.5 flex h-1.5 w-1.5">
//             <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#B47B35] opacity-25" />
//             <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#B47B35] dark:bg-[#F0A23A]" />
//           </span>
//         )}

//         <Icon size={11} className={iconClass} />
//       </span>

//       <span className="text-[0.68rem] font-semibold tabular-nums sm:text-xs">
//         {item.value}
//       </span>

//       <span className="hidden text-[0.61rem] font-medium sm:inline">
//         {item.label}
//       </span>
//     </button>
//   );
// }

// /* =========================================================
//    WORKSPACE TAB
// ========================================================= */

// function WorkspaceTab({
//   active,
//   onClick,
//   icon: Icon,
//   label,
//   count,
//   attention = false,
// }: {
//   active: boolean;
//   onClick: () => void;
//   icon: ComponentType<{ size?: number; className?: string }>;
//   label: string;
//   count?: number;
//   attention?: boolean;
// }) {
//   return (
//     <button
//       type="button"
//       onClick={onClick}
//       aria-pressed={active}
//       className={[
//         "relative flex h-8 shrink-0 items-center gap-1.5 rounded-full px-3.5",
//         "text-[0.64rem] font-semibold transition-colors duration-200",
//         active
//           ? "text-white dark:text-[#282828]"
//           : "text-[#5F7378] hover:text-[#244A52] dark:text-white/38 dark:hover:text-white",
//       ].join(" ")}
//     >
//       {active && (
//         <motion.span
//           layoutId="workspace-active-tab"
//           className={[
//             "absolute inset-0 rounded-full",
//             "bg-[#0D566D]",
//             "shadow-[0_2px_7px_rgba(13,86,109,0.16)]",
//             "dark:bg-[#DEDA00]",
//             "dark:shadow-none",
//           ].join(" ")}
//           transition={{ type: "spring", stiffness: 500, damping: 38 }}
//         />
//       )}

//       <span className="relative z-10 flex items-center gap-1.5">
//         <span className="relative">
//           {attention && !active && (
//             <span className="absolute -right-1.5 -top-1 flex h-1.5 w-1.5">
//               <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#B47B35] opacity-30" />
//               <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#B47B35] dark:bg-[#F0A23A]" />
//             </span>
//           )}

//           <Icon size={11} />
//         </span>

//         {label}

//         {typeof count === "number" && count > 0 && (
//           <span
//             className={[
//               "text-[0.54rem] font-semibold tabular-nums",
//               active
//                 ? "text-white/60 dark:text-[#303030]/55"
//                 : attention
//                   ? "text-[#9B6629] dark:text-[#F0A23A]"
//                   : "text-[#829397] dark:text-white/24",
//             ].join(" ")}
//           >
//             {count}
//           </span>
//         )}
//       </span>
//     </button>
//   );
// }

// /* =========================================================
//    PROJECT CONTROLS
// ========================================================= */

// function ProjectControls({
//   sort,
//   setSort,
//   view,
//   setView,
// }: {
//   sort: ProjectSort;
//   setSort: (value: ProjectSort) => void;
//   view: ProjectView;
//   setView: (value: ProjectView) => void;
// }) {
//   return (
//     <div className="flex shrink-0 items-center gap-1">
//       <SortControl value={sort} onChange={setSort} />

//       <div className="mx-1 h-4 w-px bg-[#0D566D]/[0.10] dark:bg-white/[0.07]" />

//       <ViewControls view={view} setView={setView} />
//     </div>
//   );
// }

// /* =========================================================
//    SORT CONTROL
// ========================================================= */

// function SortControl({
//   value,
//   onChange,
// }: {
//   value: ProjectSort;
//   onChange: (value: ProjectSort) => void;
// }) {
//   const currentOption =
//     SORT_OPTIONS.find(option => option.value === value) ??
//     SORT_OPTIONS[0];

//   return (
//     <DropdownMenu>
//       <DropdownMenuTrigger asChild>
//         <Button
//           type="button"
//           variant="ghost"
//           size="sm"
//           className={[
//             "h-9 rounded-lg px-2.5 text-xs font-medium shadow-none",
//             "text-[#66797D] transition-colors",
//             "hover:bg-[#E3EBE8] hover:text-[#254950]",
//             "data-[state=open]:bg-[#E3EBE8] data-[state=open]:text-[#254950]",
//             "dark:text-white/35 dark:hover:bg-white/[0.04] dark:hover:text-white",
//             "dark:data-[state=open]:bg-white/[0.04] dark:data-[state=open]:text-white",
//           ].join(" ")}
//         >
//           <ArrowDownNarrowWideIcon size={14} className="shrink-0" />

//           <span className="hidden sm:inline">
//             Sort by
//           </span>

//           <span className="relative hidden min-w-[76px] overflow-hidden text-left md:block">
//             <AnimatePresence mode="wait" initial={false}>
//               <motion.span
//                 key={value}
//                 initial={{ opacity: 0, y: 4 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 exit={{ opacity: 0, y: -4 }}
//                 transition={{ duration: 0.14 }}
//                 className="block font-semibold text-[#2A4146] dark:text-white"
//               >
//                 {currentOption.label}
//               </motion.span>
//             </AnimatePresence>
//           </span>

//           <span className="sm:hidden">
//             Sort
//           </span>

//           <ChevronDownIcon size={13} className="shrink-0" />
//         </Button>
//       </DropdownMenuTrigger>

//       <DropdownMenuContent
//         align="end"
//         className="w-52 rounded-xl border-border/80 p-1.5 shadow-lg"
//       >
//         {SORT_OPTIONS.map(option => {
//           const active = option.value === value;

//           return (
//             <DropdownMenuItem
//               key={option.value}
//               onSelect={() => onChange(option.value)}
//               className={[
//                 "rounded-lg px-3 py-2.5 text-xs transition-colors",
//                 active
//                   ? "bg-[#E2ECE9] font-semibold dark:bg-[#DEDA00]/[0.07]"
//                   : "",
//               ].join(" ")}
//             >
//               <ArrowDownNarrowWideIcon
//                 size={13}
//                 className="text-muted-foreground"
//               />

//               {option.label}

//               {active && (
//                 <CheckCircle2Icon
//                   size={13}
//                   className="ml-auto text-[#0D566D] dark:text-[#DEDA00]"
//                 />
//               )}
//             </DropdownMenuItem>
//           );
//         })}
//       </DropdownMenuContent>
//     </DropdownMenu>
//   );
// }

// /* =========================================================
//    VIEW CONTROLS
// ========================================================= */

// function ViewControls({
//   view,
//   setView,
// }: {
//   view: ProjectView;
//   setView: (value: ProjectView) => void;
// }) {
//   return (
//     <div className="flex shrink-0 items-center rounded-lg border border-[#0D566D]/[0.08] bg-[#E3EBE8] p-0.5 dark:border-white/[0.06] dark:bg-white/[0.02]">
//       <Button
//         type="button"
//         variant="ghost"
//         size="icon"
//         className={[
//           "h-8 w-8 rounded-md shadow-none transition-colors duration-200",
//           view === "grid"
//             ? [
//                 "bg-[#0D566D] text-white",
//                 "shadow-[0_2px_6px_rgba(13,86,109,0.14)]",
//                 "hover:bg-[#0D566D] hover:text-white",
//                 "dark:bg-[#DEDA00] dark:text-[#303030]",
//                 "dark:hover:bg-[#d4d000] dark:hover:text-[#303030]",
//               ].join(" ")
//             : [
//                 "text-[#6C8084] hover:bg-[#F3F7F5] hover:text-[#31545B]",
//                 "dark:text-white/28 dark:hover:bg-white/[0.04] dark:hover:text-white",
//               ].join(" "),
//         ].join(" ")}
//         onClick={() => setView("grid")}
//         aria-label="Grid view"
//         aria-pressed={view === "grid"}
//       >
//         <Grid2X2Icon size={14} />
//       </Button>

//       <Button
//         type="button"
//         variant="ghost"
//         size="icon"
//         className={[
//           "h-8 w-8 rounded-md shadow-none transition-colors duration-200",
//           view === "list"
//             ? [
//                 "bg-[#0D566D] text-white",
//                 "shadow-[0_2px_6px_rgba(13,86,109,0.14)]",
//                 "hover:bg-[#0D566D] hover:text-white",
//                 "dark:bg-[#DEDA00] dark:text-[#303030]",
//                 "dark:hover:bg-[#d4d000] dark:hover:text-[#303030]",
//               ].join(" ")
//             : [
//                 "text-[#6C8084] hover:bg-[#F3F7F5] hover:text-[#31545B]",
//                 "dark:text-white/28 dark:hover:bg-white/[0.04] dark:hover:text-white",
//               ].join(" "),
//         ].join(" ")}
//         onClick={() => setView("list")}
//         aria-label="List view"
//         aria-pressed={view === "list"}
//       >
//         <LayoutListIcon size={15} />
//       </Button>
//     </div>
//   );
// }

// /* =========================================================
//    PROJECT RESULTS
// ========================================================= */

// function ProjectResults({
//   projects,
//   view,
//   emptyLabel,
//   onProjectUpdated,
// }: {
//   projects: Project[];
//   view: ProjectView;
//   emptyLabel: string;
//   onProjectUpdated: (project: Project) => void;
// }) {
//   if (projects.length === 0) {
//     return (
//       <EmptyCollection
//         title={`No ${emptyLabel} projects`}
//         description="Projects matching this status will appear here."
//         icon={FolderOpenIcon}
//       />
//     );
//   }

//   return (
//     <ProjectGrid
//       projects={projects}
//       view={view}
//       onProjectUpdated={onProjectUpdated}
//     />
//   );
// }

// /* =========================================================
//    PROJECT GRID
// ========================================================= */

// function ProjectGrid<T extends Project>({
//   projects,
//   view,
//   onProjectUpdated,
// }: {
//   projects: T[];
//   view: ProjectView;
//   onProjectUpdated?: (project: Project) => void;
// }) {
//   return (
//     <div
//       className={
//         view === "grid"
//           ? [
//               "mt-6 grid min-w-0 gap-4",
//               "sm:grid-cols-2",
//               "lg:grid-cols-3",
//               "min-[1900px]:grid-cols-4",
//             ].join(" ")
//           : "mt-6 flex min-w-0 flex-col gap-3"
//       }
//     >
//       {projects.map(project =>
//         view === "grid" ? (
//           <GridView
//             key={project.id}
//             project={project}
//             onProjectUpdated={onProjectUpdated}
//           />
//         ) : (
//           <ListView
//             key={project.id}
//             project={project}
//             onProjectUpdated={onProjectUpdated}
//           />
//         ),
//       )}
//     </div>
//   );
// }

// /* =========================================================
//    INVITATION CARD
// ========================================================= */

// function InvitationCard({
//   project,
//   onAccept,
//   onDecline,
// }: {
//   project: WorkProject;
//   onAccept: () => Promise<void>;
//   onDecline: () => Promise<void>;
// }) {
//   const [detailsOpen, setDetailsOpen] = useState(false);
//   const [responding, setResponding] = useState<"accept" | "decline" | null>(null);

//   async function handleAccept() {
//     if (responding) return;

//     setResponding("accept");

//     try {
//       await onAccept();
//       setDetailsOpen(false);
//     } finally {
//       setResponding(null);
//     }
//   }

//   async function handleDecline() {
//     if (responding) return;

//     setResponding("decline");

//     try {
//       await onDecline();
//       setDetailsOpen(false);
//     } finally {
//       setResponding(null);
//     }
//   }

//   return (
//     <>
//       <motion.article
//         whileHover={{ y: -2 }}
//         transition={{ type: "spring", stiffness: 320, damping: 26 }}
//         className={[
//           "group relative overflow-hidden rounded-xl border p-5 sm:p-6",
//           "border-[#0D566D]/[0.09] bg-[#F3F7F5]",
//           "transition-[background-color,border-color,box-shadow] duration-200",
//           "hover:border-[#B38142]/25 hover:bg-[#F0F6F3]",
//           "hover:shadow-[0_18px_44px_-34px_rgba(13,86,109,0.24)]",
//           "dark:border-white/[0.07] dark:bg-[#10262D]",
//           "dark:hover:border-[#F0A23A]/20 dark:hover:bg-[#123039]",
//           "dark:hover:shadow-[0_18px_44px_-34px_rgba(0,0,0,0.65)]",
//         ].join(" ")}
//       >
//         <span className="absolute inset-y-5 left-0 w-[2px] rounded-full bg-[#B38142] dark:bg-[#F0A23A]" />

//         <div className="grid gap-5 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
//           <div className="min-w-0">
//             <div className="flex flex-wrap items-center gap-3">
//               <span className="inline-flex items-center gap-2 text-[0.56rem] font-semibold uppercase tracking-[0.15em] text-[#93662F] dark:text-[#F0A23A]">
//                 <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#EDE2D4] dark:bg-[#F0A23A]/[0.10]">
//                   <SendIcon size={11} />
//                 </span>

//                 Project invitation
//               </span>

//               {project.invitedAt && (
//                 <span className="text-[0.58rem] text-[#75868A] dark:text-white/23">
//                   {formatShortDate(project.invitedAt)}
//                 </span>
//               )}
//             </div>

//             <h2 className="mt-4 text-base font-semibold leading-tight tracking-[-0.02em] text-[#22393F] sm:text-lg dark:text-white">
//               {project.title}
//             </h2>

//             <p className="mt-2 line-clamp-2 max-w-2xl text-xs leading-6 text-[#667A7E] sm:text-sm dark:text-white/32">
//               {project.description}
//             </p>

//             <button
//               type="button"
//               onClick={() => setDetailsOpen(true)}
//               className="mt-4 inline-flex items-center gap-2 text-[0.62rem] font-semibold text-[#0D566D] transition-colors hover:text-[#073D4D] dark:text-[#DEDA00] dark:hover:text-white"
//             >
//               Review project
//               <ArrowRightIcon size={12} />
//             </button>
//           </div>

//           <div className="flex items-center gap-2 sm:justify-end">
//             <Button
//               type="button"
//               variant="ghost"
//               disabled={responding !== null}
//               onClick={() => void handleDecline()}
//               className="h-9 rounded-lg px-3 text-xs text-[#687A7E] shadow-none hover:bg-[#E1EAE7] hover:text-[#2F4D54] dark:text-white/35 dark:hover:bg-white/[0.04] dark:hover:text-white"
//             >
//               {responding === "decline" ? (
//                 <LoaderCircleIcon size={15} className="animate-spin" />
//               ) : (
//                 <XIcon size={14} />
//               )}

//               Decline
//             </Button>

//             <Button
//               type="button"
//               disabled={responding !== null}
//               onClick={() => void handleAccept()}
//               className={[
//                 "h-9 rounded-lg px-4 text-xs font-semibold shadow-none",
//                 primaryActionButton,
//               ].join(" ")}
//             >
//               {responding === "accept" ? (
//                 <LoaderCircleIcon size={15} className="animate-spin" />
//               ) : (
//                 <CheckCircle2Icon size={14} />
//               )}

//               Accept
//             </Button>
//           </div>
//         </div>
//       </motion.article>

//       <ProjectInvitationDialog
//         project={project}
//         open={detailsOpen}
//         onOpenChange={setDetailsOpen}
//         responding={responding}
//         onAccept={handleAccept}
//         onDecline={handleDecline}
//       />
//     </>
//   );
// }

// /* =========================================================
//    INVITATION DIALOG
// ========================================================= */

// function ProjectInvitationDialog({
//   project,
//   open,
//   onOpenChange,
//   responding,
//   onAccept,
//   onDecline,
// }: {
//   project: WorkProject;
//   open: boolean;
//   onOpenChange: (open: boolean) => void;
//   responding: "accept" | "decline" | null;
//   onAccept: () => Promise<void>;
//   onDecline: () => Promise<void>;
// }) {
//   return (
//     <Dialog open={open} onOpenChange={onOpenChange}>
//       <DialogContent className="max-h-[90vh] overflow-y-auto rounded-[1.5rem] border-border bg-background p-0 sm:max-w-2xl">
//         <DialogHeader className="border-b border-border px-5 pb-5 pt-6 text-left sm:px-8 sm:pb-6 sm:pt-7">
//           <Badge
//             variant="outline"
//             className="mb-3 w-fit rounded-md border-[#B38142]/20 bg-[#B38142]/[0.07] text-[#93662F] dark:border-[#F0A23A]/25 dark:bg-[#F0A23A]/[0.08] dark:text-[#F0A23A]"
//           >
//             Project invitation
//           </Badge>

//           <DialogTitle className="text-xl font-semibold leading-tight tracking-[-0.025em] sm:text-2xl">
//             {project.title}
//           </DialogTitle>

//           <DialogDescription className="mt-2 max-w-xl leading-7">
//             Review the project before deciding whether you want to join the work.
//           </DialogDescription>
//         </DialogHeader>

//         <div className="space-y-6 px-5 py-6 sm:space-y-7 sm:px-8 sm:py-7">
//           <section>
//             <p className="text-[0.58rem] font-semibold uppercase tracking-[0.15em] text-muted-foreground">
//               Project description
//             </p>

//             <p className="mt-3 whitespace-pre-line text-sm leading-7">
//               {project.description || "No project description was provided."}
//             </p>
//           </section>

//           <div className="grid gap-5 border-y border-border py-5 sm:grid-cols-3">
//             <ProjectDetail label="Status" value="Awaiting response" />

//             {project.invitedAt && (
//               <ProjectDetail
//                 label="Invited"
//                 value={formatShortDate(project.invitedAt)}
//               />
//             )}

//             {project.dueDate && (
//               <ProjectDetail
//                 label="Due"
//                 value={formatShortDate(project.dueDate)}
//               />
//             )}
//           </div>

//           <div className="rounded-r-lg border-l-2 border-[#B38142]/50 bg-[#B38142]/[0.055] py-2 pl-4 pr-3 dark:border-[#F0A23A]/50 dark:bg-[#F0A23A]/[0.06]">
//             <p className="text-xs leading-6 text-foreground/75">
//               Accepting gives you access to the project workspace and its tasks.
//               Until then, you can only review these project details.
//             </p>
//           </div>

//           <div className="flex flex-col-reverse gap-2.5 border-t border-border pt-6 sm:flex-row sm:justify-end">
//             <Button
//               type="button"
//               variant="ghost"
//               disabled={responding !== null}
//               onClick={() => void onDecline()}
//               className="h-10 rounded-lg px-5 text-muted-foreground shadow-none hover:bg-muted/40 hover:text-foreground sm:h-11"
//             >
//               {responding === "decline" ? (
//                 <LoaderCircleIcon className="h-4 w-4 animate-spin" />
//               ) : (
//                 <XIcon size={15} />
//               )}

//               Decline
//             </Button>

//             <Button
//               type="button"
//               disabled={responding !== null}
//               onClick={() => void onAccept()}
//               className={[
//                 "h-10 rounded-lg px-6 font-semibold shadow-none sm:h-11",
//                 primaryActionButton,
//               ].join(" ")}
//             >
//               {responding === "accept" ? (
//                 <LoaderCircleIcon className="h-4 w-4 animate-spin" />
//               ) : (
//                 <CheckCircle2Icon size={15} />
//               )}

//               Accept project
//             </Button>
//           </div>
//         </div>
//       </DialogContent>
//     </Dialog>
//   );
// }

// /* =========================================================
//    PROJECT DETAIL
// ========================================================= */

// function ProjectDetail({
//   label,
//   value,
// }: {
//   label: string;
//   value: ReactNode;
// }) {
//   return (
//     <div>
//       <p className="text-[0.56rem] font-semibold uppercase tracking-[0.15em] text-muted-foreground">
//         {label}
//       </p>

//       <div className="mt-1.5 text-sm font-semibold">
//         {value}
//       </div>
//     </div>
//   );
// }

// /* =========================================================
//    WORK LOAD ERROR
// ========================================================= */

// function WorkLoadError({ onRetry }: { onRetry: () => void }) {
//   return (
//     <section className="mt-6 overflow-hidden rounded-xl border border-[#0D566D]/[0.08] bg-[#EDF3F1] p-6 dark:border-white/[0.07] dark:bg-[#10262D] sm:p-8">
//       <div className="max-w-md">
//         <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#D8E7E3] text-[#0D566D] dark:bg-[#DEDA00]/[0.08] dark:text-[#DEDA00]">
//           <RefreshCwIcon size={17} />
//         </span>

//         <h2 className="mt-5 text-lg font-semibold tracking-[-0.02em] text-[#22393F] dark:text-white">
//           Your work could not be loaded.
//         </h2>

//         <p className="mt-2 text-sm leading-7 text-[#687A7E] dark:text-white/36">
//           We couldn't retrieve your client projects and invitations.
//         </p>

//         <Button
//           type="button"
//           variant="outline"
//           onClick={onRetry}
//           className={[
//             "mt-5 h-9 rounded-lg px-4 text-xs font-semibold shadow-none",
//             secondaryActionButton,
//           ].join(" ")}
//         >
//           <RefreshCwIcon size={13} />
//           Try again
//         </Button>
//       </div>
//     </section>
//   );
// }

// /* =========================================================
//    EMPTY COLLECTION
// ========================================================= */

// function EmptyCollection({
//   title,
//   description,
//   icon: Icon,
// }: {
//   title: string;
//   description: string;
//   icon: ComponentType<{ size?: number; className?: string }>;
// }) {
//   return (
//     <section className="mt-6 overflow-hidden rounded-xl border border-[#0D566D]/[0.075] bg-[#EAF1EF] px-6 py-10 dark:border-white/[0.07] dark:bg-[#10262D] sm:px-8 sm:py-12">
//       <div className="max-w-md">
//         <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#D7E5E1] text-[#0D566D] dark:bg-[#DEDA00]/[0.08] dark:text-[#DEDA00]">
//           <Icon size={17} />
//         </span>

//         <h2 className="mt-5 text-lg font-semibold tracking-[-0.02em] text-[#22393F] sm:text-xl dark:text-white">
//           {title}.
//         </h2>

//         <p className="mt-2 text-sm leading-7 text-[#687A7E] dark:text-white/36">
//           {description}
//         </p>
//       </div>
//     </section>
//   );
// }

// /* =========================================================
//    EMPTY WORK STATE
// ========================================================= */

// function WorkEmptyState({
//   title,
//   description,
//   icon,
// }: {
//   title: string;
//   description: string;
//   icon: ComponentType<{ size?: number; className?: string }>;
// }) {
//   return (
//     <EmptyCollection
//       title={title}
//       description={description}
//       icon={icon}
//     />
//   );
// }

// /* =========================================================
//    LOADING
// ========================================================= */

// function WorkspaceLoading() {
//   return (
//     <div className="flex min-h-screen flex-col bg-[#F2F5F3] text-[#28383C] dark:bg-[#08171C] dark:text-white">
//       <header className="sticky top-0 z-50 border-b border-[#0D566D]/[0.055] bg-[#F8FAF8]/95 backdrop-blur-xl dark:border-white/[0.055] dark:bg-[#08171C]/95">
//         <div className="container mx-auto px-4 sm:px-5 md:px-8">
//           <DashboardMainNav />
//         </div>
//       </header>

//       <main className="container mx-auto flex flex-1 px-5 md:px-8">
//         <LoadingState
//           label="Loading your workspace"
//           className="min-h-[calc(100vh-5rem)]"
//         />
//       </main>
//     </div>
//   );
// }

// /* =========================================================
//    ERROR
// ========================================================= */

// function WorkspaceError({
//   onRetry,
// }: {
//   onRetry: () => Promise<void>;
// }) {
//   return (
//     <div className="flex min-h-screen flex-col bg-[#F2F5F3] text-[#28383C] dark:bg-[#08171C] dark:text-white">
//       <header className="sticky top-0 z-50 border-b border-[#0D566D]/[0.055] bg-[#F8FAF8]/95 backdrop-blur-xl dark:border-white/[0.055] dark:bg-[#08171C]/95">
//         <div className="container mx-auto px-4 sm:px-5 md:px-8">
//           <DashboardMainNav />
//         </div>
//       </header>

//       <main className="container mx-auto flex flex-1 items-center px-5 py-20 md:px-8">
//         <div className="max-w-lg">
//           <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-destructive/10 text-destructive">
//             <FolderOpenIcon size={20} />
//           </span>

//           <h1 className="mt-6 text-3xl font-semibold leading-tight tracking-[-0.03em] text-[#22393F] dark:text-white">
//             We could not load your workspace.
//           </h1>

//           <p className="mt-3 text-sm leading-7 text-[#687A7E] dark:text-white/36">
//             Something interrupted the connection. Try loading the projects
//             again.
//           </p>

//           <Button
//             type="button"
//             className={[
//               "mt-7 h-11 rounded-lg px-6 font-semibold shadow-none",
//               primaryActionButton,
//             ].join(" ")}
//             onClick={() => void onRetry()}
//           >
//             <RefreshCwIcon size={15} />
//             Try again
//           </Button>
//         </div>
//       </main>
//     </div>
//   );
// }

// /* =========================================================
//    HELPERS
// ========================================================= */

// function normalizeProjectStatus(status?: string) {
//   return String(status ?? "")
//     .toLowerCase()
//     .replace(/[\s_-]/g, "");
// }

// function getProjectDateValue(project: Project) {
//   if (!project.createdAt) return 0;

//   const date = new Date(project.createdAt);

//   if (Number.isNaN(date.getTime())) return 0;

//   return date.getTime();
// }

// function sortProjectItems<T extends Project>(
//   items: T[],
//   sort: ProjectSort,
// ): T[] {
//   const copy = [...items];

//   copy.sort((first, second) => {
//     if (sort === "oldest") {
//       return getProjectDateValue(first) - getProjectDateValue(second);
//     }

//     if (sort === "title-asc") {
//       return first.title.localeCompare(second.title, undefined, {
//         sensitivity: "base",
//       });
//     }

//     if (sort === "title-desc") {
//       return second.title.localeCompare(first.title, undefined, {
//         sensitivity: "base",
//       });
//     }

//     return getProjectDateValue(second) - getProjectDateValue(first);
//   });

//   return copy;
// }

// function formatShortDate(value: string) {
//   const date = new Date(value);

//   if (Number.isNaN(date.getTime())) return "";

//   return new Intl.DateTimeFormat("en", {
//     day: "numeric",
//     month: "short",
//     year: "numeric",
//   }).format(date);
// }

// export default Projects;

import {
  type ComponentType,
  type ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { AnimatePresence, motion } from "framer-motion";
import { Link } from "react-router-dom";

import {
  ArrowDownNarrowWideIcon,
  ArrowRightIcon,
  BriefcaseBusinessIcon,
  CheckCircle2Icon,
  ChevronDownIcon,
  CircleDotIcon,
  Clock3Icon,
  FolderOpenIcon,
  Grid2X2Icon,
  InboxIcon,
  LayoutListIcon,
  LoaderCircleIcon,
  PlusIcon,
  RefreshCwIcon,
  SearchIcon,
  SendIcon,
  SparklesIcon,
  XIcon,
} from "lucide-react";

import { toast } from "sonner";

import api from "@/api/axios";
import { useAuth } from "@/auth/AuthContext";

import DashboardMainNav from "@/components/DashboardMainNav";
import LoadingState from "@/components/LoadingState";
import { GridView, ListView } from "@/components/ProjectCard";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import type { Project } from "@/Types/project";
import type { ProjectAllocatStatus } from "@/Types/enums";

/* =========================================================
   TYPES
========================================================= */

type ProjectView = "grid" | "list";
type ProjectFilter = "active" | "pending" | "closed";
type WorkspaceSection = "projects" | "work";
type WorkFilter = "invitations" | "active" | "completed";
type ProjectSort = "newest" | "oldest" | "title-asc" | "title-desc";

type SummaryItem = {
  label: string;
  value: number;
  icon: ComponentType<{ size?: number; className?: string }>;
  emphasis?: "primary" | "warning" | "success";
  active?: boolean;
  attention?: boolean;
  onClick?: () => void;
};

type OwnedProjectGroups = {
  active: Project[];
  pending: Project[];
  closed: Project[];
};

type SortOption = {
  value: ProjectSort;
  label: string;
};

export type WorkProject = Project & {
  projectAllocatStatus: ProjectAllocatStatus;
  invitedAt?: string;
  respondedAt?: string | null;
};

/* =========================================================
   CONSTANTS
========================================================= */

const CLOSED_PROJECT_STATUSES = new Set([
  "closed",
  "complete",
  "completed",
  "cancelled",
  "canceled",
]);

const PAUSED_PROJECT_STATUSES = new Set(["paused", "onhold"]);

const SORT_OPTIONS: SortOption[] = [
  { value: "newest", label: "Newest first" },
  { value: "oldest", label: "Oldest first" },
  { value: "title-asc", label: "Title A–Z" },
  { value: "title-desc", label: "Title Z–A" },
];

const primaryActionButton = [
  "bg-[#033D4F] text-white",
  "hover:bg-[#052F3B] hover:text-white",
  "dark:bg-[#DEDA00] dark:text-[#303030]",
  "dark:hover:bg-[#d4d000] dark:hover:text-[#303030]",
].join(" ");

const secondaryActionButton = [
  "border-[#173E49]/[0.10] bg-[#F7F9F7] text-[#395159]",
  "hover:border-[#173E49]/[0.16] hover:bg-[#EEF3F1] hover:text-[#173E49]",
  "dark:border-white/[0.09] dark:bg-white/[0.025] dark:text-white/72",
  "dark:hover:border-white/[0.15] dark:hover:bg-white/[0.055] dark:hover:text-white",
].join(" ");

const mastheadPrimaryButton = [
  "border-0 bg-[#DEDA00] text-[#253034]",
  "hover:bg-[#d4d000] hover:text-[#253034]",
].join(" ");

const mastheadSecondaryButton = [
  "border-white/[0.13] bg-white/[0.055] text-white/82",
  "hover:border-white/[0.22] hover:bg-white/[0.10] hover:text-white",
].join(" ");

/* =========================================================
   PAGE
========================================================= */

function Projects() {
  const { user } = useAuth();

  const [workspaceSection, setWorkspaceSection] = useState<WorkspaceSection>("projects");
  const [view, setView] = useState<ProjectView>("grid");
  const [filter, setFilter] = useState<ProjectFilter>("active");
  const [workFilter, setWorkFilter] = useState<WorkFilter>("active");
  const [sort, setSort] = useState<ProjectSort>("newest");

  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const [workProjects, setWorkProjects] = useState<WorkProject[]>([]);
  const [workLoading, setWorkLoading] = useState(false);
  const [workLoaded, setWorkLoaded] = useState(false);
  const [workError, setWorkError] = useState<string | null>(null);

  const workPrefetchedForUserRef = useRef<string | null>(null);

  /* =======================================================
     LOAD OWN PROJECTS
  ======================================================= */

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.get<Project[]>("/projects/mine", {
        withCredentials: true,
      });

      setProjects(Array.isArray(response.data) ? response.data : []);
    } catch (err: unknown) {
      console.error("Could not load owned projects:", err);

      setError(
        err instanceof Error
          ? err
          : new Error("Your projects could not be loaded."),
      );
    } finally {
      setLoading(false);
    }
  }, []);

  /* =======================================================
     LOAD ALLOCAT WORK
  ======================================================= */

  const fetchWorkProjects = useCallback(
    async ({ notifyOnError = false }: { notifyOnError?: boolean } = {}) => {
      if (!user?.isAllocat) return;

      const requestUserKey = user.userId ?? user.email ?? null;
      if (!requestUserKey) return;

      setWorkLoading(true);
      setWorkError(null);

      try {
        const response = await api.get<WorkProject[]>("/allocats/me/projects", {
          withCredentials: true,
        });

        if (workPrefetchedForUserRef.current !== requestUserKey) return;

        setWorkProjects(Array.isArray(response.data) ? response.data : []);
        setWorkLoaded(true);
      } catch (err) {
        if (workPrefetchedForUserRef.current !== requestUserKey) return;

        console.error("Could not load Allocat work:", err);
        setWorkError("Your client work could not be loaded.");

        if (notifyOnError) toast.error("We could not load your work.");
      } finally {
        if (workPrefetchedForUserRef.current === requestUserKey) {
          setWorkLoading(false);
        }
      }
    },
    [user?.isAllocat, user?.userId, user?.email],
  );

  /* =======================================================
     UPDATE HANDLERS
  ======================================================= */

  const handleOwnedProjectUpdated = useCallback((updatedProject: Project) => {
    setProjects(current =>
      current.map(project =>
        project.id === updatedProject.id
          ? { ...project, ...updatedProject }
          : project,
      ),
    );
  }, []);

  const handleWorkProjectUpdated = useCallback((updatedProject: Project) => {
    setWorkProjects(current =>
      current.map(project =>
        project.id === updatedProject.id
          ? { ...project, ...updatedProject }
          : project,
      ),
    );
  }, []);

  /* =======================================================
     INITIAL LOAD
  ======================================================= */

  useEffect(() => {
    if (!user?.userId) return;
    void fetchProjects();
  }, [user?.userId, fetchProjects]);

  useEffect(() => {
    if (!user?.isAllocat) {
      workPrefetchedForUserRef.current = null;
      setWorkProjects([]);
      setWorkLoaded(false);
      setWorkLoading(false);
      setWorkError(null);
      return;
    }

    const userKey = user.userId ?? user.email ?? null;
    if (!userKey) return;

    if (workPrefetchedForUserRef.current === userKey) return;

    setWorkProjects([]);
    setWorkLoaded(false);
    setWorkError(null);

    workPrefetchedForUserRef.current = userKey;
    void fetchWorkProjects();
  }, [user?.isAllocat, user?.userId, user?.email, fetchWorkProjects]);

  useEffect(() => {
    if (!user?.isAllocat && workspaceSection === "work") {
      setWorkspaceSection("projects");
    }
  }, [user?.isAllocat, workspaceSection]);

  const firstName = user?.fullName?.trim().split(/\s+/)[0] || "there";

  /* =======================================================
     OWN PROJECT CLASSIFICATION
  ======================================================= */

  const ownedProjectGroups = useMemo<OwnedProjectGroups>(() => {
    const groups: OwnedProjectGroups = {
      active: [],
      pending: [],
      closed: [],
    };

    for (const project of projects) {
      const status = normalizeProjectStatus(project.status);

      if (CLOSED_PROJECT_STATUSES.has(status)) {
        groups.closed.push(project);
        continue;
      }

      if (PAUSED_PROJECT_STATUSES.has(status)) {
        groups.pending.push(project);
        continue;
      }

      if (
        status === "active" ||
        status === "completionrequested" ||
        project.hasAcceptedAllocat === true
      ) {
        groups.active.push(project);
        continue;
      }

      groups.pending.push(project);
    }

    return groups;
  }, [projects]);

  const activeProjects = ownedProjectGroups.active;
  const pendingProjects = ownedProjectGroups.pending;
  const closedProjects = ownedProjectGroups.closed;

  const completionRequests = useMemo(
    () =>
      projects.filter(
        project =>
          normalizeProjectStatus(project.status) === "completionrequested",
      ),
    [projects],
  );

  /* =======================================================
     OWN PROJECT FILTERING
  ======================================================= */

  const visibleProjects = useMemo(() => {
    let filteredProjects: Project[];

    if (filter === "pending") {
      filteredProjects = pendingProjects;
    } else if (filter === "closed") {
      filteredProjects = closedProjects;
    } else {
      filteredProjects = activeProjects;
    }

    return sortProjectItems(filteredProjects, sort);
  }, [filter, activeProjects, pendingProjects, closedProjects, sort]);

  /* =======================================================
     ALLOCAT WORK
  ======================================================= */

  const invitations = useMemo(
    () =>
      workProjects.filter(
        project => project.projectAllocatStatus === "Invited",
      ),
    [workProjects],
  );

  const activeWork = useMemo(
    () =>
      workProjects.filter(project => {
        if (project.projectAllocatStatus !== "Accepted") return false;

        const status = normalizeProjectStatus(project.status);
        return !CLOSED_PROJECT_STATUSES.has(status);
      }),
    [workProjects],
  );

  const completedWork = useMemo(
    () =>
      workProjects.filter(project => {
        if (project.projectAllocatStatus !== "Accepted") return false;

        const status = normalizeProjectStatus(project.status);
        return CLOSED_PROJECT_STATUSES.has(status);
      }),
    [workProjects],
  );

  const visibleWork = useMemo(() => {
    let filteredWork: WorkProject[];

    if (workFilter === "invitations") {
      filteredWork = invitations;
    } else if (workFilter === "completed") {
      filteredWork = completedWork;
    } else {
      filteredWork = activeWork;
    }

    return sortProjectItems(filteredWork, sort);
  }, [workFilter, invitations, activeWork, completedWork, sort]);

  /* =======================================================
     INVITATIONS
  ======================================================= */

  async function acceptInvitation(projectId: string) {
    try {
      await api.patch(
        `/projects/${projectId}/allocats/invite/accept`,
        {},
        { withCredentials: true },
      );

      await fetchWorkProjects();
      toast.success("Project invitation accepted.");
    } catch (error) {
      console.error("Could not accept invitation:", error);
      toast.error("The invitation could not be accepted.");
      throw error;
    }
  }

  async function declineInvitation(projectId: string) {
    try {
      await api.patch(
        `/projects/${projectId}/allocats/invite/decline`,
        {},
        { withCredentials: true },
      );

      setWorkProjects(current =>
        current.map(project =>
          project.id === projectId
            ? {
                ...project,
                projectAllocatStatus: "Declined",
                respondedAt: new Date().toISOString(),
              }
            : project,
        ),
      );

      toast.success("Project invitation declined.");
    } catch (error) {
      console.error("Could not decline invitation:", error);
      toast.error("The invitation could not be declined.");
      throw error;
    }
  }

  /* =======================================================
     PAGE STATE
  ======================================================= */

  const workspaceLoading =
    loading || Boolean(user?.isAllocat && workLoading && !workLoaded);

  if (workspaceLoading) return <WorkspaceLoading />;
  if (error) return <WorkspaceError onRetry={fetchProjects} />;

  const showNewClientState = projects.length === 0 && !user?.isAllocat;

  /* =======================================================
     SUMMARY
  ======================================================= */

  const summaryItems: SummaryItem[] =
    workspaceSection === "projects"
      ? [
          {
            label: "Active",
            value: activeProjects.length,
            icon: CircleDotIcon,
            emphasis: "primary",
            active: filter === "active",
            attention: completionRequests.length > 0,
            onClick: () => setFilter("active"),
          },
          {
            label: "Pending",
            value: pendingProjects.length,
            icon: Clock3Icon,
            emphasis: "warning",
            active: filter === "pending",
            attention: pendingProjects.length > 0,
            onClick: () => setFilter("pending"),
          },
          {
            label: "Completed",
            value: closedProjects.length,
            icon: CheckCircle2Icon,
            emphasis: "success",
            active: filter === "closed",
            onClick: () => setFilter("closed"),
          },
        ]
      : [
          {
            label: "Invitations",
            value: invitations.length,
            icon: InboxIcon,
            emphasis: "warning",
            active: workFilter === "invitations",
            attention: invitations.length > 0,
            onClick: () => setWorkFilter("invitations"),
          },
          {
            label: "Active",
            value: activeWork.length,
            icon: BriefcaseBusinessIcon,
            emphasis: "primary",
            active: workFilter === "active",
            onClick: () => setWorkFilter("active"),
          },
          {
            label: "Completed",
            value: completedWork.length,
            icon: CheckCircle2Icon,
            emphasis: "success",
            active: workFilter === "completed",
            onClick: () => setWorkFilter("completed"),
          },
        ];

  const workCount = invitations.length + activeWork.length + completedWork.length;

  const sectionTitle =
    workspaceSection === "projects"
      ? filter === "pending"
        ? "Pending projects"
        : filter === "closed"
          ? "Completed projects"
          : "Active projects"
      : workFilter === "invitations"
        ? "Invitations"
        : workFilter === "completed"
          ? "Completed work"
          : "Active work";

  const sectionDescription =
    workspaceSection === "projects"
      ? filter === "pending"
        ? "Projects waiting for an Allocat or the next step."
        : filter === "closed"
          ? "Projects that have already crossed the finish line."
          : "The projects currently moving through your workspace."
      : workFilter === "invitations"
        ? "Projects clients have invited you to join."
        : workFilter === "completed"
          ? "Client projects you have completed."
          : "The client work currently on your plate.";

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <div className="flex min-h-screen flex-col bg-[#F2F4F1] text-[#29373B] dark:bg-[#08171C] dark:text-white">
      <header
        className={[
          "sticky top-0 z-50 border-b backdrop-blur-xl",
          "border-[#173E49]/[0.055] bg-[#F8F9F6]/95",
          "dark:border-white/[0.055] dark:bg-[#08171C]/95",
        ].join(" ")}
      >
        <div className="container mx-auto px-4 sm:px-5 md:px-8">
          <DashboardMainNav />
        </div>
      </header>

      {showNewClientState ? (
        <main className="container mx-auto flex flex-1 items-center justify-center px-4 py-10 sm:px-5 sm:py-14 md:px-8">
          <NewClientWelcome firstName={firstName} />
        </main>
      ) : (
        <>
          <div className="container mx-auto px-4 pt-4 sm:px-5 sm:pt-5 md:px-8 lg:pt-6">
            <WorkspaceMasthead
              firstName={firstName}
              isAllocat={Boolean(user?.isAllocat)}
              workspaceSection={workspaceSection}
              onSectionChange={setWorkspaceSection}
              projectCount={projects.length}
              workCount={workCount}
              invitationCount={invitations.length}
              items={summaryItems}
            />
          </div>

          <main className="container mx-auto flex-1 px-4 pb-10 pt-7 sm:px-5 sm:pb-12 sm:pt-8 md:px-8 lg:pt-9">
            <motion.section
              initial={{ opacity: 0, y: 7 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.04, duration: 0.3, ease: "easeOut" }}
            >
              <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                <div className="min-w-0">
                  <SectionEyebrow>
                    {workspaceSection === "projects" ? "Your workspace" : "Client work"}
                  </SectionEyebrow>

                  <h2 className="mt-3 text-xl font-semibold tracking-[-0.025em] text-[#27373B] sm:text-2xl dark:text-white">
                    {sectionTitle}
                  </h2>

                  <p className="mt-1.5 hidden max-w-2xl text-xs leading-6 text-[#68777B] sm:block sm:text-sm dark:text-white/36">
                    {sectionDescription}
                  </p>
                </div>

                {!(
                  workspaceSection === "work" &&
                  workFilter === "invitations"
                ) && (
                  <ProjectControls
                    sort={sort}
                    setSort={setSort}
                    view={view}
                    setView={setView}
                  />
                )}
              </div>

              {workspaceSection === "projects" && (
                <ProjectResults
                  projects={visibleProjects}
                  view={view}
                  emptyLabel={filter === "closed" ? "completed" : filter}
                  onProjectUpdated={handleOwnedProjectUpdated}
                />
              )}

              {workspaceSection === "work" && user?.isAllocat && (
                <>
                  {workError && !workLoaded ? (
                    <WorkLoadError
                      onRetry={() =>
                        void fetchWorkProjects({
                          notifyOnError: true,
                        })
                      }
                    />
                  ) : workFilter === "invitations" ? (
                    invitations.length > 0 ? (
                      <div className="mt-6 grid gap-3">
                        {sortProjectItems(invitations, sort).map(project => (
                          <InvitationCard
                            key={project.id}
                            project={project}
                            onAccept={() => acceptInvitation(project.id)}
                            onDecline={() => declineInvitation(project.id)}
                          />
                        ))}
                      </div>
                    ) : (
                      <WorkEmptyState
                        title="No invitations"
                        description="New project invitations will appear here when a client invites you to join their work."
                        icon={InboxIcon}
                      />
                    )
                  ) : visibleWork.length > 0 ? (
                    <ProjectGrid
                      projects={visibleWork}
                      view={view}
                      onProjectUpdated={handleWorkProjectUpdated}
                    />
                  ) : (
                    <WorkEmptyState
                      title={
                        workFilter === "completed"
                          ? "No completed work"
                          : "No active work"
                      }
                      description={
                        workFilter === "completed"
                          ? "Projects you complete for clients will appear here."
                          : "Projects you accept from clients will appear here."
                      }
                      icon={BriefcaseBusinessIcon}
                    />
                  )}
                </>
              )}
            </motion.section>
          </main>
        </>
      )}
    </div>
  );
}

/* =========================================================
   NEW CLIENT WELCOME
========================================================= */

function NewClientWelcome({ firstName }: { firstName: string }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="w-full max-w-xl text-center"
    >
      <span
        className={[
          "mx-auto flex h-10 w-10 items-center justify-center rounded-xl",
          "bg-[#E5ECEA] text-[#315D68]",
          "dark:bg-[#DEDA00]/[0.08] dark:text-[#DEDA00]",
        ].join(" ")}
      >
        <SparklesIcon size={16} />
      </span>

      <p className="mt-6 text-[0.56rem] font-semibold uppercase tracking-[0.17em] text-[#748083] dark:text-white/30">
        Welcome to Allocatr
      </p>

      <h1 className="mt-2.5 text-2xl font-semibold leading-[1.12] tracking-[-0.03em] text-[#28373B] sm:text-3xl dark:text-white">
        What would you like to do first, {firstName}?
      </h1>

      <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-[#6C797C] dark:text-white/38">
        Create a project if you already know what needs to be done, or discover
        Allocats and find the right person first.
      </p>

      <div className="mt-8 flex flex-col justify-center gap-2.5 sm:flex-row sm:items-center">
        <Button
          asChild
          className={[
            "group h-10 rounded-lg px-5 text-xs font-semibold shadow-none",
            primaryActionButton,
          ].join(" ")}
        >
          <Link to="/projects/new">
            <PlusIcon size={14} />
            Create a project

            <ArrowRightIcon
              size={12}
              className="transition-transform duration-200 group-hover:translate-x-0.5"
            />
          </Link>
        </Button>

        <Button
          asChild
          variant="outline"
          className={[
            "h-10 rounded-lg px-5 text-xs font-semibold shadow-none",
            secondaryActionButton,
          ].join(" ")}
        >
          <Link to="/discover">
            <SearchIcon size={14} />
            Discover Allocats
          </Link>
        </Button>
      </div>

      <p className="mt-5 text-[0.66rem] text-[#879194] dark:text-white/23">
        You can do either at any time.
      </p>
    </motion.section>
  );
}

/* =========================================================
   WORKSPACE MASTHEAD
========================================================= */

function WorkspaceMasthead({
  firstName,
  isAllocat,
  workspaceSection,
  onSectionChange,
  projectCount,
  workCount,
  invitationCount,
  items,
}: {
  firstName: string;
  isAllocat: boolean;
  workspaceSection: WorkspaceSection;
  onSectionChange: (section: WorkspaceSection) => void;
  projectCount: number;
  workCount: number;
  invitationCount: number;
  items: SummaryItem[];
}) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, ease: "easeOut" }}
      className={[
        "relative overflow-hidden rounded-[1.35rem] border",
        "border-[#033D4F] bg-[#033D4F] text-white",
        "shadow-[0_20px_55px_-38px_rgba(3,61,79,0.58)]",
        "dark:border-white/[0.065] dark:bg-[#0C1D22]",
        "dark:shadow-[0_18px_48px_-34px_rgba(0,0,0,0.55)]",
      ].join(" ")}
    >
      <span className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#DEDA00]/60 to-transparent" />

      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[#7DA6B1]/[0.10] blur-3xl"
      />

      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-28 left-[16%] h-56 w-56 rounded-full bg-[#DEDA00]/[0.035] blur-3xl"
      />

      <div className="relative grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-4 py-5 sm:gap-6 sm:px-6 sm:py-6 lg:px-7 lg:py-7">
        <div className="min-w-0">
          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/[0.08] text-[#DEDA00] ring-1 ring-inset ring-white/[0.06]">
              <BriefcaseBusinessIcon size={13} />
            </span>

            <p className="text-[0.55rem] font-semibold uppercase tracking-[0.17em] text-white/42">
              Workspace
            </p>
          </div>

          <h1 className="mt-3 truncate text-xl font-semibold leading-tight tracking-[-0.03em] text-white sm:text-2xl lg:text-[1.75rem]">
            Welcome back,{" "}
            <span className="text-[#DEDA00]">
              {firstName}
            </span>
            .
          </h1>

          <p className="mt-1.5 hidden max-w-xl text-xs leading-6 text-white/48 md:block">
            {workspaceSection === "projects"
              ? "Keep the work moving. Everything you own, everything waiting and everything finished lives here."
              : "Your client work, active jobs and invitations — without the noise."}
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <Button
            asChild
            size="icon"
            className={[
              "group h-9 w-9 rounded-lg shadow-none sm:w-auto sm:px-4",
              mastheadPrimaryButton,
            ].join(" ")}
          >
            <Link to="/projects/new" aria-label="New project">
              <PlusIcon size={13} />

              <span className="hidden text-xs font-semibold sm:inline">
                New project
              </span>

              <ArrowRightIcon
                size={12}
                className="hidden transition-transform duration-200 group-hover:translate-x-0.5 sm:block"
              />
            </Link>
          </Button>

          <Button
            asChild
            variant="outline"
            size="icon"
            className={[
              "h-9 w-9 rounded-lg shadow-none sm:w-auto sm:px-4",
              mastheadSecondaryButton,
            ].join(" ")}
          >
            <Link to="/discover" aria-label="Discover Allocats">
              <SearchIcon size={13} />

              <span className="hidden text-xs font-semibold sm:inline">
                Discover Allocats
              </span>
            </Link>
          </Button>
        </div>
      </div>

      <div className="relative border-t border-white/[0.075] bg-black/[0.10] px-3 py-2.5 sm:px-5">
        <div className="flex min-w-0 items-center justify-between gap-3 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="shrink-0">
            {isAllocat ? (
              <div
                className={[
                  "inline-flex items-center rounded-full border p-1",
                  "border-white/[0.08] bg-black/[0.16]",
                  "shadow-[inset_0_1px_0_rgba(255,255,255,0.035)]",
                ].join(" ")}
              >
                <WorkspaceTab
                  active={workspaceSection === "projects"}
                  onClick={() => onSectionChange("projects")}
                  icon={BriefcaseBusinessIcon}
                  label="My projects"
                  count={projectCount}
                />

                <WorkspaceTab
                  active={workspaceSection === "work"}
                  onClick={() => onSectionChange("work")}
                  icon={SparklesIcon}
                  label="My work"
                  count={workCount}
                  attention={invitationCount > 0}
                />
              </div>
            ) : (
              <p className="hidden whitespace-nowrap text-[0.54rem] font-semibold uppercase tracking-[0.16em] text-white/30 sm:block">
                Project overview
              </p>
            )}
          </div>

          <div className="flex shrink-0 items-center gap-1">
            {items.map(item => (
              <WorkspaceMetric key={item.label} item={item} />
            ))}
          </div>
        </div>
      </div>
    </motion.section>
  );
}

/* =========================================================
   WORKSPACE METRIC
========================================================= */

function WorkspaceMetric({ item }: { item: SummaryItem }) {
  const Icon = item.icon;

  const iconClass =
    item.emphasis === "success"
      ? "text-[#5ED63B]"
      : item.emphasis === "warning"
        ? "text-[#F0A23A]"
        : "text-[#DEDA00]";

  return (
    <button
      type="button"
      onClick={item.onClick}
      aria-pressed={item.active}
      title={item.label}
      className={[
        "relative flex h-8 items-center gap-2 rounded-lg px-2.5 text-left",
        "transition-[background-color,color] duration-200",
        item.active
          ? "bg-white/[0.09] text-white"
          : "text-white/42 hover:bg-white/[0.05] hover:text-white/75",
      ].join(" ")}
    >
      {item.active && (
        <motion.span
          layoutId="workspace-active-metric"
          className="absolute inset-x-2.5 bottom-0 h-[2px] rounded-full bg-[#DEDA00]"
          transition={{ type: "spring", stiffness: 500, damping: 38 }}
        />
      )}

      <span className="relative flex shrink-0 items-center">
        {item.attention && (
          <span className="absolute -right-1.5 -top-1.5 flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#F0A23A] opacity-25" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#F0A23A]" />
          </span>
        )}

        <Icon size={11} className={iconClass} />
      </span>

      <span className="text-[0.68rem] font-semibold tabular-nums sm:text-xs">
        {item.value}
      </span>

      <span className="hidden text-[0.61rem] font-medium sm:inline">
        {item.label}
      </span>
    </button>
  );
}

/* =========================================================
   WORKSPACE TAB
========================================================= */

function WorkspaceTab({
  active,
  onClick,
  icon: Icon,
  label,
  count,
  attention = false,
}: {
  active: boolean;
  onClick: () => void;
  icon: ComponentType<{ size?: number; className?: string }>;
  label: string;
  count?: number;
  attention?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={[
        "relative flex h-8 shrink-0 items-center gap-1.5 rounded-full px-3.5",
        "text-[0.64rem] font-semibold transition-colors duration-200",
        active
          ? "text-[#253034]"
          : "text-white/42 hover:text-white/80",
      ].join(" ")}
    >
      {active && (
        <motion.span
          layoutId="workspace-active-tab"
          className={[
            "absolute inset-0 rounded-full",
            "bg-[#DEDA00]",
            "shadow-[0_3px_10px_rgba(0,0,0,0.15)]",
          ].join(" ")}
          transition={{ type: "spring", stiffness: 500, damping: 38 }}
        />
      )}

      <span className="relative z-10 flex items-center gap-1.5">
        <span className="relative">
          {attention && !active && (
            <span className="absolute -right-1.5 -top-1 flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#F0A23A] opacity-30" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#F0A23A]" />
            </span>
          )}

          <Icon size={11} />
        </span>

        {label}

        {typeof count === "number" && count > 0 && (
          <span
            className={[
              "text-[0.54rem] font-semibold tabular-nums",
              active
                ? "text-[#303030]/55"
                : attention
                  ? "text-[#F0A23A]"
                  : "text-white/26",
            ].join(" ")}
          >
            {count}
          </span>
        )}
      </span>
    </button>
  );
}

/* =========================================================
   SECTION EYEBROW
========================================================= */

function SectionEyebrow({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-center gap-2.5">
      <span className="flex items-center gap-1">
        <span className="h-1.5 w-5 rounded-full bg-[#54737B] dark:bg-[#7DA6B1]" />
        <span className="h-1.5 w-2 rounded-full bg-[#B6B31B] dark:bg-[#DEDA00]" />
      </span>

      <p className="text-[0.54rem] font-semibold uppercase tracking-[0.16em] text-[#6A787B] dark:text-white/30">
        {children}
      </p>
    </div>
  );
}

/* =========================================================
   PROJECT CONTROLS
========================================================= */

function ProjectControls({
  sort,
  setSort,
  view,
  setView,
}: {
  sort: ProjectSort;
  setSort: (value: ProjectSort) => void;
  view: ProjectView;
  setView: (value: ProjectView) => void;
}) {
  return (
    <div className="flex shrink-0 items-center gap-1">
      <SortControl value={sort} onChange={setSort} />

      <div className="mx-1 h-4 w-px bg-[#173E49]/[0.09] dark:bg-white/[0.07]" />

      <ViewControls view={view} setView={setView} />
    </div>
  );
}

/* =========================================================
   SORT CONTROL
========================================================= */

function SortControl({
  value,
  onChange,
}: {
  value: ProjectSort;
  onChange: (value: ProjectSort) => void;
}) {
  const currentOption =
    SORT_OPTIONS.find(option => option.value === value) ??
    SORT_OPTIONS[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className={[
            "h-9 rounded-lg px-2.5 text-xs font-medium shadow-none",
            "text-[#68777A] transition-colors",
            "hover:bg-[#E6EBE8] hover:text-[#31474E]",
            "data-[state=open]:bg-[#E6EBE8] data-[state=open]:text-[#31474E]",
            "dark:text-white/35 dark:hover:bg-white/[0.04] dark:hover:text-white",
            "dark:data-[state=open]:bg-white/[0.04] dark:data-[state=open]:text-white",
          ].join(" ")}
        >
          <ArrowDownNarrowWideIcon size={14} className="shrink-0" />

          <span className="hidden sm:inline">
            Sort by
          </span>

          <span className="relative hidden min-w-[76px] overflow-hidden text-left md:block">
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={value}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.14 }}
                className="block font-semibold text-[#34474C] dark:text-white"
              >
                {currentOption.label}
              </motion.span>
            </AnimatePresence>
          </span>

          <span className="sm:hidden">
            Sort
          </span>

          <ChevronDownIcon size={13} className="shrink-0" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-52 rounded-xl border-border/80 p-1.5 shadow-lg"
      >
        {SORT_OPTIONS.map(option => {
          const active = option.value === value;

          return (
            <DropdownMenuItem
              key={option.value}
              onSelect={() => onChange(option.value)}
              className={[
                "rounded-lg px-3 py-2.5 text-xs transition-colors",
                active
                  ? "bg-[#E7EFEC] font-semibold dark:bg-[#DEDA00]/[0.07]"
                  : "",
              ].join(" ")}
            >
              <ArrowDownNarrowWideIcon
                size={13}
                className="text-muted-foreground"
              />

              {option.label}

              {active && (
                <CheckCircle2Icon
                  size={13}
                  className="ml-auto text-[#315D68] dark:text-[#DEDA00]"
                />
              )}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

/* =========================================================
   VIEW CONTROLS
========================================================= */

function ViewControls({
  view,
  setView,
}: {
  view: ProjectView;
  setView: (value: ProjectView) => void;
}) {
  return (
    <div
      className={[
        "flex shrink-0 items-center rounded-lg border p-0.5",
        "border-[#173E49]/[0.07] bg-[#E7ECE9]",
        "dark:border-white/[0.06] dark:bg-white/[0.02]",
      ].join(" ")}
    >
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className={[
          "h-8 w-8 rounded-md shadow-none transition-colors duration-200",
          view === "grid"
            ? [
                "bg-[#033D4F] text-white",
                "shadow-[0_2px_6px_rgba(3,61,79,0.16)]",
                "hover:bg-[#033D4F] hover:text-white",
                "dark:bg-[#DEDA00] dark:text-[#303030]",
                "dark:hover:bg-[#d4d000] dark:hover:text-[#303030]",
              ].join(" ")
            : [
                "text-[#758387] hover:bg-white/60 hover:text-[#35525A]",
                "dark:text-white/28 dark:hover:bg-white/[0.04] dark:hover:text-white",
              ].join(" "),
        ].join(" ")}
        onClick={() => setView("grid")}
        aria-label="Grid view"
        aria-pressed={view === "grid"}
      >
        <Grid2X2Icon size={14} />
      </Button>

      <Button
        type="button"
        variant="ghost"
        size="icon"
        className={[
          "h-8 w-8 rounded-md shadow-none transition-colors duration-200",
          view === "list"
            ? [
                "bg-[#033D4F] text-white",
                "shadow-[0_2px_6px_rgba(3,61,79,0.16)]",
                "hover:bg-[#033D4F] hover:text-white",
                "dark:bg-[#DEDA00] dark:text-[#303030]",
                "dark:hover:bg-[#d4d000] dark:hover:text-[#303030]",
              ].join(" ")
            : [
                "text-[#758387] hover:bg-white/60 hover:text-[#35525A]",
                "dark:text-white/28 dark:hover:bg-white/[0.04] dark:hover:text-white",
              ].join(" "),
        ].join(" ")}
        onClick={() => setView("list")}
        aria-label="List view"
        aria-pressed={view === "list"}
      >
        <LayoutListIcon size={15} />
      </Button>
    </div>
  );
}

/* =========================================================
   PROJECT RESULTS
========================================================= */

function ProjectResults({
  projects,
  view,
  emptyLabel,
  onProjectUpdated,
}: {
  projects: Project[];
  view: ProjectView;
  emptyLabel: string;
  onProjectUpdated: (project: Project) => void;
}) {
  if (projects.length === 0) {
    return (
      <EmptyCollection
        title={`No ${emptyLabel} projects`}
        description="Projects matching this status will appear here."
        icon={FolderOpenIcon}
      />
    );
  }

  return (
    <ProjectGrid
      projects={projects}
      view={view}
      onProjectUpdated={onProjectUpdated}
    />
  );
}

/* =========================================================
   PROJECT GRID
========================================================= */

function ProjectGrid<T extends Project>({
  projects,
  view,
  onProjectUpdated,
}: {
  projects: T[];
  view: ProjectView;
  onProjectUpdated?: (project: Project) => void;
}) {
  return (
    <div
      className={
        view === "grid"
          ? [
              "mt-6 grid min-w-0 gap-4",
              "sm:grid-cols-2",
              "lg:grid-cols-3",
              "2xl:grid-cols-4",
            ].join(" ")
          : "mt-6 flex min-w-0 flex-col gap-3"
      }
    >
      {projects.map(project =>
        view === "grid" ? (
          <GridView
            key={project.id}
            project={project}
            onProjectUpdated={onProjectUpdated}
          />
        ) : (
          <ListView
            key={project.id}
            project={project}
            onProjectUpdated={onProjectUpdated}
          />
        ),
      )}
    </div>
  );
}

/* =========================================================
   INVITATION CARD
========================================================= */

function InvitationCard({
  project,
  onAccept,
  onDecline,
}: {
  project: WorkProject;
  onAccept: () => Promise<void>;
  onDecline: () => Promise<void>;
}) {
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [responding, setResponding] = useState<"accept" | "decline" | null>(null);

  async function handleAccept() {
    if (responding) return;

    setResponding("accept");

    try {
      await onAccept();
      setDetailsOpen(false);
    } finally {
      setResponding(null);
    }
  }

  async function handleDecline() {
    if (responding) return;

    setResponding("decline");

    try {
      await onDecline();
      setDetailsOpen(false);
    } finally {
      setResponding(null);
    }
  }

  return (
    <>
      <motion.article
        whileHover={{ y: -2 }}
        transition={{ type: "spring", stiffness: 320, damping: 26 }}
        className={[
          "group relative overflow-hidden rounded-xl border p-5 sm:p-6",
          "border-[#173E49]/[0.075] bg-[#F4F8F6]",
          "transition-[background-color,border-color,box-shadow] duration-200",
          "hover:border-[#A67839]/25 hover:bg-[#F7FAF8]",
          "hover:shadow-[0_18px_44px_-34px_rgba(32,60,68,0.24)]",
          "dark:border-white/[0.07] dark:bg-[#10262D]",
          "dark:hover:border-[#F0A23A]/20 dark:hover:bg-[#123039]",
          "dark:hover:shadow-[0_18px_44px_-34px_rgba(0,0,0,0.65)]",
        ].join(" ")}
      >
        <span className="absolute inset-y-5 left-0 w-[2px] rounded-full bg-[#B07E39] dark:bg-[#F0A23A]" />

        <div className="grid gap-5 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-2 text-[0.56rem] font-semibold uppercase tracking-[0.15em] text-[#8C642C] dark:text-[#F0A23A]">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#EAE1D3] dark:bg-[#F0A23A]/[0.10]">
                  <SendIcon size={11} />
                </span>

                Project invitation
              </span>

              {project.invitedAt && (
                <span className="text-[0.58rem] text-[#7B878A] dark:text-white/23">
                  {formatShortDate(project.invitedAt)}
                </span>
              )}
            </div>

            <h2 className="mt-4 text-base font-semibold leading-tight tracking-[-0.02em] text-[#27373B] sm:text-lg dark:text-white">
              {project.title}
            </h2>

            <p className="mt-2 line-clamp-2 max-w-2xl text-xs leading-6 text-[#68777B] sm:text-sm dark:text-white/32">
              {project.description}
            </p>

            <button
              type="button"
              onClick={() => setDetailsOpen(true)}
              className="mt-4 inline-flex items-center gap-2 text-[0.62rem] font-semibold text-[#315D68] transition-colors hover:text-[#033D4F] dark:text-[#DEDA00] dark:hover:text-white"
            >
              Review project
              <ArrowRightIcon size={12} />
            </button>
          </div>

          <div className="flex items-center gap-2 sm:justify-end">
            <Button
              type="button"
              variant="ghost"
              disabled={responding !== null}
              onClick={() => void handleDecline()}
              className="h-9 rounded-lg px-3 text-xs text-[#6D7B7E] shadow-none hover:bg-[#E5EBE8] hover:text-[#31474C] dark:text-white/35 dark:hover:bg-white/[0.04] dark:hover:text-white"
            >
              {responding === "decline" ? (
                <LoaderCircleIcon size={15} className="animate-spin" />
              ) : (
                <XIcon size={14} />
              )}

              Decline
            </Button>

            <Button
              type="button"
              disabled={responding !== null}
              onClick={() => void handleAccept()}
              className={[
                "h-9 rounded-lg px-4 text-xs font-semibold shadow-none",
                primaryActionButton,
              ].join(" ")}
            >
              {responding === "accept" ? (
                <LoaderCircleIcon size={15} className="animate-spin" />
              ) : (
                <CheckCircle2Icon size={14} />
              )}

              Accept
            </Button>
          </div>
        </div>
      </motion.article>

      <ProjectInvitationDialog
        project={project}
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
        responding={responding}
        onAccept={handleAccept}
        onDecline={handleDecline}
      />
    </>
  );
}

/* =========================================================
   INVITATION DIALOG
========================================================= */

function ProjectInvitationDialog({
  project,
  open,
  onOpenChange,
  responding,
  onAccept,
  onDecline,
}: {
  project: WorkProject;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  responding: "accept" | "decline" | null;
  onAccept: () => Promise<void>;
  onDecline: () => Promise<void>;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto rounded-[1.5rem] border-border bg-background p-0 sm:max-w-2xl">
        <DialogHeader className="border-b border-border px-5 pb-5 pt-6 text-left sm:px-8 sm:pb-6 sm:pt-7">
          <Badge
            variant="outline"
            className="mb-3 w-fit rounded-md border-[#B07E39]/20 bg-[#B07E39]/[0.07] text-[#8C642C] dark:border-[#F0A23A]/25 dark:bg-[#F0A23A]/[0.08] dark:text-[#F0A23A]"
          >
            Project invitation
          </Badge>

          <DialogTitle className="text-xl font-semibold leading-tight tracking-[-0.025em] sm:text-2xl">
            {project.title}
          </DialogTitle>

          <DialogDescription className="mt-2 max-w-xl leading-7">
            Review the project before deciding whether you want to join the work.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 px-5 py-6 sm:space-y-7 sm:px-8 sm:py-7">
          <section>
            <p className="text-[0.58rem] font-semibold uppercase tracking-[0.15em] text-muted-foreground">
              Project description
            </p>

            <p className="mt-3 whitespace-pre-line text-sm leading-7">
              {project.description || "No project description was provided."}
            </p>
          </section>

          <div className="grid gap-5 border-y border-border py-5 sm:grid-cols-3">
            <ProjectDetail label="Status" value="Awaiting response" />

            {project.invitedAt && (
              <ProjectDetail
                label="Invited"
                value={formatShortDate(project.invitedAt)}
              />
            )}

            {project.dueDate && (
              <ProjectDetail
                label="Due"
                value={formatShortDate(project.dueDate)}
              />
            )}
          </div>

          <div className="rounded-r-lg border-l-2 border-[#B07E39]/50 bg-[#B07E39]/[0.055] py-2 pl-4 pr-3 dark:border-[#F0A23A]/50 dark:bg-[#F0A23A]/[0.06]">
            <p className="text-xs leading-6 text-foreground/75">
              Accepting gives you access to the project workspace and its tasks.
              Until then, you can only review these project details.
            </p>
          </div>

          <div className="flex flex-col-reverse gap-2.5 border-t border-border pt-6 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="ghost"
              disabled={responding !== null}
              onClick={() => void onDecline()}
              className="h-10 rounded-lg px-5 text-muted-foreground shadow-none hover:bg-muted/40 hover:text-foreground sm:h-11"
            >
              {responding === "decline" ? (
                <LoaderCircleIcon className="h-4 w-4 animate-spin" />
              ) : (
                <XIcon size={15} />
              )}

              Decline
            </Button>

            <Button
              type="button"
              disabled={responding !== null}
              onClick={() => void onAccept()}
              className={[
                "h-10 rounded-lg px-6 font-semibold shadow-none sm:h-11",
                primaryActionButton,
              ].join(" ")}
            >
              {responding === "accept" ? (
                <LoaderCircleIcon className="h-4 w-4 animate-spin" />
              ) : (
                <CheckCircle2Icon size={15} />
              )}

              Accept project
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

/* =========================================================
   PROJECT DETAIL
========================================================= */

function ProjectDetail({
  label,
  value,
}: {
  label: string;
  value: ReactNode;
}) {
  return (
    <div>
      <p className="text-[0.56rem] font-semibold uppercase tracking-[0.15em] text-muted-foreground">
        {label}
      </p>

      <div className="mt-1.5 text-sm font-semibold">
        {value}
      </div>
    </div>
  );
}

/* =========================================================
   WORK LOAD ERROR
========================================================= */

function WorkLoadError({ onRetry }: { onRetry: () => void }) {
  return (
    <section
      className={[
        "mt-6 overflow-hidden rounded-xl border p-6 sm:p-8",
        "border-[#173E49]/[0.07] bg-[#EEF4F1]",
        "dark:border-white/[0.07] dark:bg-[#10262D]",
      ].join(" ")}
    >
      <div className="max-w-md">
        <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#DDE9E5] text-[#315D68] dark:bg-[#DEDA00]/[0.08] dark:text-[#DEDA00]">
          <RefreshCwIcon size={17} />
        </span>

        <h2 className="mt-5 text-lg font-semibold tracking-[-0.02em] text-[#27373B] dark:text-white">
          Your work could not be loaded.
        </h2>

        <p className="mt-2 text-sm leading-7 text-[#68777B] dark:text-white/36">
          We couldn't retrieve your client projects and invitations.
        </p>

        <Button
          type="button"
          variant="outline"
          onClick={onRetry}
          className={[
            "mt-5 h-9 rounded-lg px-4 text-xs font-semibold shadow-none",
            secondaryActionButton,
          ].join(" ")}
        >
          <RefreshCwIcon size={13} />
          Try again
        </Button>
      </div>
    </section>
  );
}

/* =========================================================
   EMPTY COLLECTION
========================================================= */

function EmptyCollection({
  title,
  description,
  icon: Icon,
}: {
  title: string;
  description: string;
  icon: ComponentType<{ size?: number; className?: string }>;
}) {
  return (
    <section
      className={[
        "mt-6 overflow-hidden rounded-xl border px-6 py-10 sm:px-8 sm:py-12",
        "border-[#173E49]/[0.065] bg-[#EAF0ED]",
        "dark:border-white/[0.07] dark:bg-[#10262D]",
      ].join(" ")}
    >
      <div className="max-w-md">
        <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#DCE6E2] text-[#315D68] dark:bg-[#DEDA00]/[0.08] dark:text-[#DEDA00]">
          <Icon size={17} />
        </span>

        <h2 className="mt-5 text-lg font-semibold tracking-[-0.02em] text-[#2B3A3E] sm:text-xl dark:text-white">
          {title}.
        </h2>

        <p className="mt-2 text-sm leading-7 text-[#6B797C] dark:text-white/36">
          {description}
        </p>
      </div>
    </section>
  );
}

/* =========================================================
   EMPTY WORK STATE
========================================================= */

function WorkEmptyState({
  title,
  description,
  icon,
}: {
  title: string;
  description: string;
  icon: ComponentType<{ size?: number; className?: string }>;
}) {
  return (
    <EmptyCollection
      title={title}
      description={description}
      icon={icon}
    />
  );
}

/* =========================================================
   LOADING
========================================================= */

function WorkspaceLoading() {
  return (
    <div className="flex min-h-screen flex-col bg-[#F2F4F1] text-[#29373B] dark:bg-[#08171C] dark:text-white">
      <header
        className={[
          "sticky top-0 z-50 border-b backdrop-blur-xl",
          "border-[#173E49]/[0.055] bg-[#F8F9F6]/95",
          "dark:border-white/[0.055] dark:bg-[#08171C]/95",
        ].join(" ")}
      >
        <div className="container mx-auto px-4 sm:px-5 md:px-8">
          <DashboardMainNav />
        </div>
      </header>

      <main className="container mx-auto flex flex-1 px-5 md:px-8">
        <LoadingState
          label="Loading your workspace"
          className="min-h-[calc(100vh-5rem)]"
        />
      </main>
    </div>
  );
}

/* =========================================================
   ERROR
========================================================= */

function WorkspaceError({
  onRetry,
}: {
  onRetry: () => Promise<void>;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-[#F2F4F1] text-[#29373B] dark:bg-[#08171C] dark:text-white">
      <header
        className={[
          "sticky top-0 z-50 border-b backdrop-blur-xl",
          "border-[#173E49]/[0.055] bg-[#F8F9F6]/95",
          "dark:border-white/[0.055] dark:bg-[#08171C]/95",
        ].join(" ")}
      >
        <div className="container mx-auto px-4 sm:px-5 md:px-8">
          <DashboardMainNav />
        </div>
      </header>

      <main className="container mx-auto flex flex-1 items-center px-5 py-20 md:px-8">
        <div className="max-w-lg">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-destructive/10 text-destructive">
            <FolderOpenIcon size={20} />
          </span>

          <h1 className="mt-6 text-3xl font-semibold leading-tight tracking-[-0.03em]">
            We could not load your workspace.
          </h1>

          <p className="mt-3 text-sm leading-7 text-muted-foreground">
            Something interrupted the connection. Try loading the projects
            again.
          </p>

          <Button
            type="button"
            className={[
              "mt-7 h-11 rounded-lg px-6 font-semibold shadow-none",
              primaryActionButton,
            ].join(" ")}
            onClick={() => void onRetry()}
          >
            <RefreshCwIcon size={15} />
            Try again
          </Button>
        </div>
      </main>
    </div>
  );
}

/* =========================================================
   HELPERS
========================================================= */

function normalizeProjectStatus(status?: string) {
  return String(status ?? "")
    .toLowerCase()
    .replace(/[\s_-]/g, "");
}

function getProjectDateValue(project: Project) {
  if (!project.createdAt) return 0;

  const date = new Date(project.createdAt);

  if (Number.isNaN(date.getTime())) return 0;

  return date.getTime();
}

function sortProjectItems<T extends Project>(
  items: T[],
  sort: ProjectSort,
): T[] {
  const copy = [...items];

  copy.sort((first, second) => {
    if (sort === "oldest") {
      return getProjectDateValue(first) - getProjectDateValue(second);
    }

    if (sort === "title-asc") {
      return first.title.localeCompare(second.title, undefined, {
        sensitivity: "base",
      });
    }

    if (sort === "title-desc") {
      return second.title.localeCompare(first.title, undefined, {
        sensitivity: "base",
      });
    }

    return getProjectDateValue(second) - getProjectDateValue(first);
  });

  return copy;
}

function formatShortDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "";

  return new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

export default Projects;