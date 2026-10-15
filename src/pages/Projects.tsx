// // import {
// //   type ComponentType,
// //   type ReactNode,
// //   useCallback,
// //   useEffect,
// //   useMemo,
// //   useRef,
// //   useState,
// // } from "react";

// // import { AnimatePresence, motion } from "framer-motion";
// // import { Link } from "react-router-dom";

// // import {
// //   ArrowDownNarrowWideIcon,
// //   ArrowRightIcon,
// //   BriefcaseBusinessIcon,
// //   CheckCircle2Icon,
// //   ChevronDownIcon,
// //   CircleDotIcon,
// //   Clock3Icon,
// //   FolderOpenIcon,
// //   Grid2X2Icon,
// //   InboxIcon,
// //   LayoutListIcon,
// //   LoaderCircleIcon,
// //   PlusIcon,
// //   RefreshCwIcon,
// //   SearchIcon,
// //   SendIcon,
// //   SparklesIcon,
// //   XIcon,
// // } from "lucide-react";

// // import { toast } from "sonner";

// // import api from "@/api/axios";
// // import { useAuth } from "@/auth/AuthContext";

// // import DashboardMainNav from "@/components/DashboardMainNav";
// // import LoadingState from "@/components/LoadingState";
// // import { GridView, ListView } from "@/components/ProjectCard";

// // import { Badge } from "@/components/ui/badge";
// // import { Button } from "@/components/ui/button";

// // import {
// //   Dialog,
// //   DialogContent,
// //   DialogDescription,
// //   DialogHeader,
// //   DialogTitle,
// // } from "@/components/ui/dialog";

// // import {
// //   DropdownMenu,
// //   DropdownMenuContent,
// //   DropdownMenuItem,
// //   DropdownMenuTrigger,
// // } from "@/components/ui/dropdown-menu";

// // import type { Project } from "@/Types/project";
// // import type { ProjectAllocatStatus } from "@/Types/enums";

// // /* =========================================================
// //    TYPES
// // ========================================================= */

// // type ProjectView = "grid" | "list";
// // type ProjectFilter = "active" | "pending" | "closed";
// // type WorkspaceSection = "projects" | "work";
// // type WorkFilter = "invitations" | "active" | "completed";
// // type ProjectSort = "newest" | "oldest" | "title-asc" | "title-desc";

// // type SummaryItem = {
// //   label: string;
// //   value: number;
// //   icon: ComponentType<{ size?: number; className?: string }>;
// //   emphasis?: "primary" | "warning" | "success";
// //   active?: boolean;
// //   attention?: boolean;
// //   onClick?: () => void;
// // };

// // type OwnedProjectGroups = {
// //   active: Project[];
// //   pending: Project[];
// //   closed: Project[];
// // };

// // type SortOption = {
// //   value: ProjectSort;
// //   label: string;
// // };

// // export type WorkProject = Project & {
// //   projectAllocatStatus: ProjectAllocatStatus;
// //   invitedAt?: string;
// //   respondedAt?: string | null;
// // };

// // /* =========================================================
// //    CONSTANTS
// // ========================================================= */

// // const CLOSED_PROJECT_STATUSES = new Set([
// //   "closed",
// //   "complete",
// //   "completed",
// //   "cancelled",
// //   "canceled",
// // ]);

// // const PAUSED_PROJECT_STATUSES = new Set(["paused", "onhold"]);

// // const SORT_OPTIONS: SortOption[] = [
// //   { value: "newest", label: "Newest first" },
// //   { value: "oldest", label: "Oldest first" },
// //   { value: "title-asc", label: "Title A–Z" },
// //   { value: "title-desc", label: "Title Z–A" },
// // ];

// // /* =========================================================
// //    SHARED THEME
// // ========================================================= */

// // const primaryActionButton = [
// //   "border border-brand-secondary-highlight/15",
// //   "bg-brand-secondary-highlight",
// //   "text-primary-foreground",

// //   "hover:border-brand-secondary-highlight/20",
// //   "hover:bg-brand-secondary-highlight/90",
// //   "hover:text-primary-foreground",

// //   "dark:border-secondary",
// //   "dark:bg-secondary",
// //   "dark:text-secondary-foreground",

// //   "dark:hover:border-secondary/90",
// //   "dark:hover:bg-secondary/90",
// //   "dark:hover:text-secondary-foreground",
// // ].join(" ");

// // const secondaryActionButton = [
// //   "border-border/65",
// //   "bg-surface-2/40",
// //   "text-foreground/70",

// //   "hover:border-border/85",
// //   "hover:bg-surface-3/60",
// //   "hover:text-foreground/90",

// //   "dark:border-border",
// //   "dark:bg-surface-2/80",
// //   "dark:text-foreground/80",

// //   "dark:hover:border-border",
// //   "dark:hover:bg-surface-3/80",
// //   "dark:hover:text-foreground",
// // ].join(" ");

// // const elevatedSurface = [
// //   "border-border/60",
// //   "bg-card",

// //   "dark:border-border",
// //   "dark:bg-card",
// // ].join(" ");

// // const softIconSurface = [
// //   "bg-surface-3/75",
// //   "text-brand-secondary-highlight",
// //   "ring-1 ring-inset ring-border/35",

// //   "dark:bg-surface-2",
// //   "dark:text-secondary",
// //   "dark:ring-border",
// // ].join(" ");

// // /* =========================================================
// //    PAGE
// // ========================================================= */

// // function Projects() {
// //   const { user } = useAuth();

// //   const [workspaceSection, setWorkspaceSection] =
// //     useState<WorkspaceSection>("projects");

// //   const [view, setView] = useState<ProjectView>("grid");
// //   const [filter, setFilter] = useState<ProjectFilter>("active");
// //   const [workFilter, setWorkFilter] = useState<WorkFilter>("active");
// //   const [sort, setSort] = useState<ProjectSort>("newest");

// //   const [projects, setProjects] = useState<Project[]>([]);
// //   const [loading, setLoading] = useState(true);
// //   const [error, setError] = useState<Error | null>(null);

// //   const [workProjects, setWorkProjects] = useState<WorkProject[]>([]);
// //   const [workLoading, setWorkLoading] = useState(false);
// //   const [workLoaded, setWorkLoaded] = useState(false);
// //   const [workError, setWorkError] = useState<string | null>(null);

// //   const workPrefetchedForUserRef = useRef<string | null>(null);

// //   /* =======================================================
// //      LOAD OWN PROJECTS
// //   ======================================================= */

// //   const fetchProjects = useCallback(async () => {
// //     setLoading(true);
// //     setError(null);

// //     try {
// //       const response = await api.get<Project[]>("/projects/mine", {
// //         withCredentials: true,
// //       });

// //       setProjects(Array.isArray(response.data) ? response.data : []);
// //     } catch (err: unknown) {
// //       console.error("Could not load owned projects:", err);

// //       setError(
// //         err instanceof Error
// //           ? err
// //           : new Error("Your projects could not be loaded."),
// //       );
// //     } finally {
// //       setLoading(false);
// //     }
// //   }, []);

// //   /* =======================================================
// //      LOAD ALLOCAT WORK
// //   ======================================================= */

// //   const fetchWorkProjects = useCallback(
// //     async ({ notifyOnError = false }: { notifyOnError?: boolean } = {}) => {
// //       if (!user?.isAllocat) return;

// //       const requestUserKey = user.userId ?? user.email ?? null;

// //       if (!requestUserKey) return;

// //       setWorkLoading(true);
// //       setWorkError(null);

// //       try {
// //         const response = await api.get<WorkProject[]>("/allocats/me/projects", {
// //           withCredentials: true,
// //         });

// //         if (workPrefetchedForUserRef.current !== requestUserKey) return;

// //         setWorkProjects(Array.isArray(response.data) ? response.data : []);
// //         setWorkLoaded(true);
// //       } catch (err) {
// //         if (workPrefetchedForUserRef.current !== requestUserKey) return;

// //         console.error("Could not load Allocat work:", err);

// //         setWorkError("Your client work could not be loaded.");

// //         if (notifyOnError) {
// //           toast.error("We could not load your work.");
// //         }
// //       } finally {
// //         if (workPrefetchedForUserRef.current === requestUserKey) {
// //           setWorkLoading(false);
// //         }
// //       }
// //     },
// //     [user?.isAllocat, user?.userId, user?.email],
// //   );

// //   /* =======================================================
// //      UPDATE HANDLERS
// //   ======================================================= */

// //   const handleOwnedProjectUpdated = useCallback((updatedProject: Project) => {
// //     setProjects((current) =>
// //       current.map((project) =>
// //         project.id === updatedProject.id
// //           ? { ...project, ...updatedProject }
// //           : project,
// //       ),
// //     );
// //   }, []);

// //   const handleWorkProjectUpdated = useCallback((updatedProject: Project) => {
// //     setWorkProjects((current) =>
// //       current.map((project) =>
// //         project.id === updatedProject.id
// //           ? { ...project, ...updatedProject }
// //           : project,
// //       ),
// //     );
// //   }, []);

// //   /* =======================================================
// //      INITIAL LOAD
// //   ======================================================= */

// //   useEffect(() => {
// //     if (!user?.userId) return;

// //     void fetchProjects();
// //   }, [user?.userId, fetchProjects]);

// //   useEffect(() => {
// //     if (!user?.isAllocat) {
// //       workPrefetchedForUserRef.current = null;

// //       setWorkProjects([]);
// //       setWorkLoaded(false);
// //       setWorkLoading(false);
// //       setWorkError(null);

// //       return;
// //     }

// //     const userKey = user.userId ?? user.email ?? null;

// //     if (!userKey) return;

// //     if (workPrefetchedForUserRef.current === userKey) return;

// //     setWorkProjects([]);
// //     setWorkLoaded(false);
// //     setWorkLoading(false);
// //     setWorkError(null);

// //     workPrefetchedForUserRef.current = userKey;

// //     void fetchWorkProjects();
// //   }, [user?.isAllocat, user?.userId, user?.email, fetchWorkProjects]);

// //   useEffect(() => {
// //     if (!user?.isAllocat && workspaceSection === "work") {
// //       setWorkspaceSection("projects");
// //     }
// //   }, [user?.isAllocat, workspaceSection]);

// //   const firstName = user?.fullName?.trim().split(/\s+/)[0] || "there";

// //   /* =======================================================
// //      OWN PROJECT CLASSIFICATION
// //   ======================================================= */

// //   const ownedProjectGroups = useMemo<OwnedProjectGroups>(() => {
// //     const groups: OwnedProjectGroups = {
// //       active: [],
// //       pending: [],
// //       closed: [],
// //     };

// //     for (const project of projects) {
// //       const status = normalizeProjectStatus(project.status);

// //       if (CLOSED_PROJECT_STATUSES.has(status)) {
// //         groups.closed.push(project);
// //         continue;
// //       }

// //       if (PAUSED_PROJECT_STATUSES.has(status)) {
// //         groups.pending.push(project);
// //         continue;
// //       }

// //       if (
// //         status === "active" ||
// //         status === "completionrequested" ||
// //         project.hasAcceptedAllocat === true
// //       ) {
// //         groups.active.push(project);
// //         continue;
// //       }

// //       groups.pending.push(project);
// //     }

// //     return groups;
// //   }, [projects]);

// //   const activeProjects = ownedProjectGroups.active;
// //   const pendingProjects = ownedProjectGroups.pending;
// //   const closedProjects = ownedProjectGroups.closed;

// //   const completionRequests = useMemo(
// //     () =>
// //       projects.filter(
// //         (project) =>
// //           normalizeProjectStatus(project.status) === "completionrequested",
// //       ),
// //     [projects],
// //   );

// //   /* =======================================================
// //      OWN PROJECT FILTERING
// //   ======================================================= */

// //   const visibleProjects = useMemo(() => {
// //     let filteredProjects: Project[];

// //     if (filter === "pending") {
// //       filteredProjects = pendingProjects;
// //     } else if (filter === "closed") {
// //       filteredProjects = closedProjects;
// //     } else {
// //       filteredProjects = activeProjects;
// //     }

// //     return sortProjectItems(filteredProjects, sort);
// //   }, [filter, activeProjects, pendingProjects, closedProjects, sort]);

// //   /* =======================================================
// //      ALLOCAT WORK
// //   ======================================================= */

// //   const invitations = useMemo(
// //     () =>
// //       workProjects.filter(
// //         (project) => project.projectAllocatStatus === "Invited",
// //       ),
// //     [workProjects],
// //   );

// //   const activeWork = useMemo(
// //     () =>
// //       workProjects.filter((project) => {
// //         if (project.projectAllocatStatus !== "Accepted") return false;

// //         const status = normalizeProjectStatus(project.status);

// //         return !CLOSED_PROJECT_STATUSES.has(status);
// //       }),
// //     [workProjects],
// //   );

// //   const completedWork = useMemo(
// //     () =>
// //       workProjects.filter((project) => {
// //         if (project.projectAllocatStatus !== "Accepted") return false;

// //         const status = normalizeProjectStatus(project.status);

// //         return CLOSED_PROJECT_STATUSES.has(status);
// //       }),
// //     [workProjects],
// //   );

// //   const visibleWork = useMemo(() => {
// //     let filteredWork: WorkProject[];

// //     if (workFilter === "invitations") {
// //       filteredWork = invitations;
// //     } else if (workFilter === "completed") {
// //       filteredWork = completedWork;
// //     } else {
// //       filteredWork = activeWork;
// //     }

// //     return sortProjectItems(filteredWork, sort);
// //   }, [workFilter, invitations, activeWork, completedWork, sort]);

// //   /* =======================================================
// //      INVITATIONS
// //   ======================================================= */

// //   async function acceptInvitation(projectId: string) {
// //     try {
// //       await api.patch(
// //         `/projects/${projectId}/allocats/invite/accept`,
// //         {},
// //         { withCredentials: true },
// //       );

// //       await fetchWorkProjects();

// //       toast.success("Project invitation accepted.");
// //     } catch (error) {
// //       console.error("Could not accept invitation:", error);

// //       toast.error("The invitation could not be accepted.");

// //       throw error;
// //     }
// //   }

// //   async function declineInvitation(projectId: string) {
// //     try {
// //       await api.patch(
// //         `/projects/${projectId}/allocats/invite/decline`,
// //         {},
// //         { withCredentials: true },
// //       );

// //       setWorkProjects((current) =>
// //         current.map((project) =>
// //           project.id === projectId
// //             ? {
// //                 ...project,
// //                 projectAllocatStatus: "Declined",
// //                 respondedAt: new Date().toISOString(),
// //               }
// //             : project,
// //         ),
// //       );

// //       toast.success("Project invitation declined.");
// //     } catch (error) {
// //       console.error("Could not decline invitation:", error);

// //       toast.error("The invitation could not be declined.");

// //       throw error;
// //     }
// //   }

// //   /* =======================================================
// //      PAGE STATE
// //   ======================================================= */

// //   if (loading) {
// //     return <WorkspaceLoading />;
// //   }

// //   if (error) {
// //     return <WorkspaceError onRetry={fetchProjects} />;
// //   }

// //   const showNewClientState = projects.length === 0 && !user?.isAllocat;

// //   /* =======================================================
// //      SUMMARY
// //   ======================================================= */

// //   const summaryItems: SummaryItem[] =
// //     workspaceSection === "projects"
// //       ? [
// //           {
// //             label: "Active",
// //             value: activeProjects.length,
// //             icon: CircleDotIcon,
// //             emphasis: "primary",
// //             active: filter === "active",
// //             attention: completionRequests.length > 0,
// //             onClick: () => setFilter("active"),
// //           },
// //           {
// //             label: "Pending",
// //             value: pendingProjects.length,
// //             icon: Clock3Icon,
// //             emphasis: "warning",
// //             active: filter === "pending",
// //             attention: pendingProjects.length > 0,
// //             onClick: () => setFilter("pending"),
// //           },
// //           {
// //             label: "Completed",
// //             value: closedProjects.length,
// //             icon: CheckCircle2Icon,
// //             emphasis: "success",
// //             active: filter === "closed",
// //             onClick: () => setFilter("closed"),
// //           },
// //         ]
// //       : [
// //           {
// //             label: "Invitations",
// //             value: invitations.length,
// //             icon: InboxIcon,
// //             emphasis: "warning",
// //             active: workFilter === "invitations",
// //             attention: invitations.length > 0,
// //             onClick: () => setWorkFilter("invitations"),
// //           },
// //           {
// //             label: "Active",
// //             value: activeWork.length,
// //             icon: BriefcaseBusinessIcon,
// //             emphasis: "primary",
// //             active: workFilter === "active",
// //             onClick: () => setWorkFilter("active"),
// //           },
// //           {
// //             label: "Completed",
// //             value: completedWork.length,
// //             icon: CheckCircle2Icon,
// //             emphasis: "success",
// //             active: workFilter === "completed",
// //             onClick: () => setWorkFilter("completed"),
// //           },
// //         ];

// //   const workCount =
// //     invitations.length + activeWork.length + completedWork.length;

// //   const sectionTitle =
// //     workspaceSection === "projects"
// //       ? filter === "pending"
// //         ? "Pending projects"
// //         : filter === "closed"
// //           ? "Completed projects"
// //           : "Active projects"
// //       : workFilter === "invitations"
// //         ? "Invitations"
// //         : workFilter === "completed"
// //           ? "Completed work"
// //           : "Active work";

// //   const sectionDescription =
// //     workspaceSection === "projects"
// //       ? filter === "pending"
// //         ? "Projects waiting for an Allocat or the next step."
// //         : filter === "closed"
// //           ? "Projects that have already crossed the finish line."
// //           : "The projects currently moving through your workspace."
// //       : workFilter === "invitations"
// //         ? "Projects clients have invited you to join."
// //         : workFilter === "completed"
// //           ? "Client projects you have completed."
// //           : "The client work currently on your plate.";

// //   /* =======================================================
// //      RENDER
// //   ======================================================= */

// //   return (
// //     <div className="flex min-h-screen flex-col bg-background text-foreground">
// //       {/* ===================================================
// //           NAV
// //       =================================================== */}

// //       <header className="sticky top-0 z-50 border-b border-border/60 bg-background/95 backdrop-blur-xl dark:border-border">
// //         <div className="container mx-auto px-4 sm:px-5 md:px-8">
// //           <DashboardMainNav />
// //         </div>
// //       </header>

// //       {showNewClientState ? (
// //         <main className="container mx-auto flex flex-1 items-center justify-center px-4 py-10 sm:px-5 sm:py-14 md:px-8">
// //           <NewClientWelcome firstName={firstName} />
// //         </main>
// //       ) : (
// //         <>
// //           {/* =================================================
// //               MASTHEAD
// //           ================================================= */}

// //           <div className="container mx-auto px-4 pt-4 sm:px-5 sm:pt-5 md:px-8 lg:pt-6">
// //             <WorkspaceMasthead
// //               firstName={firstName}
// //               isAllocat={Boolean(user?.isAllocat)}
// //               workspaceSection={workspaceSection}
// //               onSectionChange={setWorkspaceSection}
// //               projectCount={projects.length}
// //               workCount={workCount}
// //               invitationCount={invitations.length}
// //               items={summaryItems}
// //             />
// //           </div>

// //           {/* =================================================
// //               CONTENT
// //           ================================================= */}

// //           <main className="container mx-auto flex-1 px-4 pb-10 pt-7 sm:px-5 sm:pb-12 sm:pt-8 md:px-8 lg:pt-9">
// //             <motion.section
// //               initial={{ opacity: 0, y: 7 }}
// //               animate={{ opacity: 1, y: 0 }}
// //               transition={{ delay: 0.04, duration: 0.3, ease: "easeOut" }}
// //             >
// //               <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
// //                 <div className="min-w-0">
// //                   <SectionEyebrow>
// //                     {workspaceSection === "projects"
// //                       ? "Your workspace"
// //                       : "Client work"}
// //                   </SectionEyebrow>

// //                   <h2 className="mt-3 text-xl font-semibold tracking-[-0.025em] text-foreground/90 sm:text-2xl dark:text-foreground">
// //                     {sectionTitle}
// //                   </h2>

// //                   <p className="mt-1.5 hidden max-w-2xl text-xs leading-6 text-muted-foreground sm:block sm:text-sm">
// //                     {sectionDescription}
// //                   </p>
// //                 </div>

// //                 {!(
// //                   workspaceSection === "work" && workFilter === "invitations"
// //                 ) && (
// //                   <ProjectControls
// //                     sort={sort}
// //                     setSort={setSort}
// //                     view={view}
// //                     setView={setView}
// //                   />
// //                 )}
// //               </div>

// //               {/* =============================================
// //                   OWN PROJECTS
// //               ============================================= */}

// //               {workspaceSection === "projects" && (
// //                 <ProjectResults
// //                   projects={visibleProjects}
// //                   view={view}
// //                   emptyLabel={filter === "closed" ? "completed" : filter}
// //                   onProjectUpdated={handleOwnedProjectUpdated}
// //                 />
// //               )}

// //               {/* =============================================
// //                   CLIENT WORK
// //               ============================================= */}

// //               {workspaceSection === "work" && user?.isAllocat && (
// //                 <>
// //                   {workLoading && !workLoaded ? (
// //                     <WorkSectionLoading />
// //                   ) : workError && !workLoaded ? (
// //                     <WorkLoadError
// //                       onRetry={() =>
// //                         void fetchWorkProjects({
// //                           notifyOnError: true,
// //                         })
// //                       }
// //                     />
// //                   ) : workFilter === "invitations" ? (
// //                     invitations.length > 0 ? (
// //                       <div className="mt-6 grid gap-3">
// //                         {sortProjectItems(invitations, sort).map((project) => (
// //                           <InvitationCard
// //                             key={project.id}
// //                             project={project}
// //                             onAccept={() => acceptInvitation(project.id)}
// //                             onDecline={() => declineInvitation(project.id)}
// //                           />
// //                         ))}
// //                       </div>
// //                     ) : (
// //                       <WorkEmptyState
// //                         title="No invitations"
// //                         description="New project invitations will appear here when a client invites you to join their work."
// //                         icon={InboxIcon}
// //                       />
// //                     )
// //                   ) : visibleWork.length > 0 ? (
// //                     <ProjectGrid
// //                       projects={visibleWork}
// //                       view={view}
// //                       onProjectUpdated={handleWorkProjectUpdated}
// //                     />
// //                   ) : (
// //                     <WorkEmptyState
// //                       title={
// //                         workFilter === "completed"
// //                           ? "No completed work"
// //                           : "No active work"
// //                       }
// //                       description={
// //                         workFilter === "completed"
// //                           ? "Projects you complete for clients will appear here."
// //                           : "Projects you accept from clients will appear here."
// //                       }
// //                       icon={BriefcaseBusinessIcon}
// //                     />
// //                   )}
// //                 </>
// //               )}
// //             </motion.section>
// //           </main>
// //         </>
// //       )}
// //     </div>
// //   );
// // }

// // /* =========================================================
// //    NEW CLIENT WELCOME
// // ========================================================= */

// // function NewClientWelcome({ firstName }: { firstName: string }) {
// //   return (
// //     <motion.section
// //       initial={{ opacity: 0, y: 8 }}
// //       animate={{ opacity: 1, y: 0 }}
// //       transition={{ duration: 0.35, ease: "easeOut" }}
// //       className="w-full max-w-xl text-center"
// //     >
// //       <span
// //         className={[
// //           "mx-auto flex h-10 w-10 items-center justify-center rounded-xl",
// //           softIconSurface,
// //         ].join(" ")}
// //       >
// //         <SparklesIcon size={16} />
// //       </span>

// //       <p className="mt-6 text-[0.56rem] font-semibold uppercase tracking-[0.17em] text-muted-foreground">
// //         Welcome to Allocatr
// //       </p>

// //       <h1 className="mt-2.5 text-2xl font-semibold leading-[1.12] tracking-[-0.03em] text-foreground/90 sm:text-3xl dark:text-foreground">
// //         What would you like to do first, {firstName}?
// //       </h1>

// //       <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-muted-foreground">
// //         Create a project if you already know what needs to be done, or discover
// //         Allocats and find the right person first.
// //       </p>

// //       <div className="mt-8 flex flex-col justify-center gap-2.5 sm:flex-row sm:items-center">
// //         <Button
// //           asChild
// //           className={[
// //             "group h-10 rounded-lg px-5 text-xs font-semibold shadow-none",
// //             primaryActionButton,
// //           ].join(" ")}
// //         >
// //           <Link to="/projects/new">
// //             <PlusIcon size={14} />
// //             Create a project
// //             <ArrowRightIcon
// //               size={12}
// //               className="transition-transform duration-200 group-hover:translate-x-0.5"
// //             />
// //           </Link>
// //         </Button>

// //         <Button
// //           asChild
// //           variant="outline"
// //           className={[
// //             "h-10 rounded-lg px-5 text-xs font-semibold shadow-none",
// //             secondaryActionButton,
// //           ].join(" ")}
// //         >
// //           <Link to="/discover">
// //             <SearchIcon size={14} />
// //             Discover Allocats
// //           </Link>
// //         </Button>
// //       </div>

// //       <p className="mt-5 text-[0.66rem] text-muted-foreground/70">
// //         You can do either at any time.
// //       </p>
// //     </motion.section>
// //   );
// // }

// // /* =========================================================
// //    WORKSPACE MASTHEAD
// // ========================================================= */

// // function WorkspaceMasthead({
// //   firstName,
// //   isAllocat,
// //   workspaceSection,
// //   onSectionChange,
// //   projectCount,
// //   workCount,
// //   invitationCount,
// //   items,
// // }: {
// //   firstName: string;
// //   isAllocat: boolean;
// //   workspaceSection: WorkspaceSection;
// //   onSectionChange: (section: WorkspaceSection) => void;
// //   projectCount: number;
// //   workCount: number;
// //   invitationCount: number;
// //   items: SummaryItem[];
// // }) {
// //   return (
// //     <motion.section
// //       initial={{ opacity: 0, y: 5 }}
// //       animate={{ opacity: 1, y: 0 }}
// //       transition={{ duration: 0.28, ease: "easeOut" }}
// //       className={["overflow-hidden rounded-xl border", elevatedSurface].join(
// //         " ",
// //       )}
// //     >
// //       {/* ===================================================
// //           MAIN ROW
// //       =================================================== */}

// //       <div
// //         className={[
// //           "grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4",
// //           "px-4 py-5 sm:gap-6 sm:px-6 sm:py-6 lg:px-7",
// //           "bg-surface-2/35",
// //           "dark:bg-card",
// //         ].join(" ")}
// //       >
// //         <div className="min-w-0">
// //           <div className="flex items-center gap-2.5">
// //             <span
// //               className={[
// //                 "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
// //                 softIconSurface,
// //               ].join(" ")}
// //             >
// //               <BriefcaseBusinessIcon size={13} />
// //             </span>

// //             <p className="text-[0.55rem] font-semibold uppercase tracking-[0.17em] text-muted-foreground">
// //               Workspace
// //             </p>
// //           </div>

// //           <h1 className="mt-3 truncate text-xl font-semibold leading-tight tracking-[-0.03em] text-foreground/90 sm:text-2xl lg:text-[1.75rem] dark:text-foreground">
// //             Welcome back,{" "}
// //             <span className="text-brand-secondary-highlight dark:text-secondary">
// //               {firstName}
// //             </span>
// //             .
// //           </h1>

// //           <p className="mt-1.5 hidden max-w-xl text-xs leading-6 text-muted-foreground md:block">
// //             {workspaceSection === "projects"
// //               ? "Your active, pending and completed projects."
// //               : "Your client work, active jobs and invitations."}
// //           </p>
// //         </div>

// //         {/* ACTIONS */}

// //         <div className="flex shrink-0 items-center gap-2">
// //           <Button
// //             asChild
// //             size="icon"
// //             className={[
// //               "group h-9 w-9 rounded-lg shadow-none sm:w-auto sm:px-4",
// //               primaryActionButton,
// //             ].join(" ")}
// //           >
// //             <Link to="/projects/new" aria-label="New project">
// //               <PlusIcon size={13} />

// //               <span className="hidden text-xs font-semibold sm:inline">
// //                 New project
// //               </span>

// //               <ArrowRightIcon
// //                 size={12}
// //                 className="hidden transition-transform duration-200 group-hover:translate-x-0.5 sm:block"
// //               />
// //             </Link>
// //           </Button>

// //           <Button
// //             asChild
// //             variant="outline"
// //             size="icon"
// //             className={[
// //               "h-9 w-9 rounded-lg shadow-none sm:w-auto sm:px-4",
// //               secondaryActionButton,
// //             ].join(" ")}
// //           >
// //             <Link to="/discover" aria-label="Discover Allocats">
// //               <SearchIcon size={13} />

// //               <span className="hidden text-xs font-semibold sm:inline">
// //                 Discover Allocats
// //               </span>
// //             </Link>
// //           </Button>
// //         </div>
// //       </div>

// //       {/* ===================================================
// //           WORKSPACE RAIL
// //       =================================================== */}

// //       <div
// //         className={[
// //           "border-t px-3 py-2.5 sm:px-5",
// //           "border-border/55",
// //           "bg-surface-3/30",

// //           "dark:border-border",
// //           "dark:bg-surface-2/70",
// //         ].join(" ")}
// //       >
// //         <div className="flex min-w-0 items-center justify-between gap-3 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
// //           <div className="shrink-0">
// //             {isAllocat ? (
// //               <div
// //                 className={[
// //                   "inline-flex items-center rounded-full border p-1",

// //                   "border-border/60",
// //                   "bg-surface-2/55",

// //                   "dark:border-border",
// //                   "dark:bg-surface-1",
// //                 ].join(" ")}
// //               >
// //                 <WorkspaceTab
// //                   active={workspaceSection === "projects"}
// //                   onClick={() => onSectionChange("projects")}
// //                   icon={BriefcaseBusinessIcon}
// //                   label="My projects"
// //                   count={projectCount}
// //                 />

// //                 <WorkspaceTab
// //                   active={workspaceSection === "work"}
// //                   onClick={() => onSectionChange("work")}
// //                   icon={SparklesIcon}
// //                   label="My work"
// //                   count={workCount}
// //                   attention={invitationCount > 0}
// //                 />
// //               </div>
// //             ) : (
// //               <p className="hidden whitespace-nowrap text-[0.54rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground/70 sm:block">
// //                 Project overview
// //               </p>
// //             )}
// //           </div>

// //           <div className="flex shrink-0 items-center gap-1">
// //             {items.map((item) => (
// //               <WorkspaceMetric key={item.label} item={item} />
// //             ))}
// //           </div>
// //         </div>
// //       </div>
// //     </motion.section>
// //   );
// // }

// // /* =========================================================
// //    WORKSPACE METRIC
// // ========================================================= */

// // function WorkspaceMetric({ item }: { item: SummaryItem }) {
// //   const Icon = item.icon;

// //   const appearance = getMetricAppearance(item.emphasis);

// //   return (
// //     <button
// //       type="button"
// //       onClick={item.onClick}
// //       aria-pressed={item.active}
// //       title={item.label}
// //       className={[
// //         "relative flex h-8 items-center gap-2 rounded-lg px-2.5 text-left",

// //         "transition-[background-color,color] duration-150",

// //         item.active
// //           ? [
// //               "bg-surface-1",
// //               "text-foreground/90",

// //               "dark:bg-surface-3/65",
// //               "dark:text-foreground",
// //             ].join(" ")
// //           : [
// //               "text-muted-foreground",

// //               "hover:bg-surface-2/70",
// //               "hover:text-foreground/85",

// //               "dark:hover:bg-surface-3/55",
// //               "dark:hover:text-foreground",
// //             ].join(" "),
// //       ].join(" ")}
// //     >
// //       {item.active && (
// //         <motion.span
// //           layoutId="workspace-active-metric"
// //           className={[
// //             "absolute inset-x-2.5 bottom-0 h-[2px] rounded-full",
// //             appearance.line,
// //           ].join(" ")}
// //           transition={{ type: "spring", stiffness: 500, damping: 38 }}
// //         />
// //       )}

// //       <span className="relative flex shrink-0 items-center">
// //         {item.attention && (
// //           <span className="absolute -right-1.5 -top-1.5 flex h-1.5 w-1.5">
// //             <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-status-pending opacity-25" />

// //             <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-status-pending" />
// //           </span>
// //         )}

// //         <Icon size={11} className={appearance.icon} />
// //       </span>

// //       <span className="text-[0.68rem] font-semibold tabular-nums sm:text-xs">
// //         {item.value}
// //       </span>

// //       <span className="hidden text-[0.61rem] font-medium sm:inline">
// //         {item.label}
// //       </span>
// //     </button>
// //   );
// // }

// // /* =========================================================
// //    WORKSPACE TAB
// // ========================================================= */

// // function WorkspaceTab({
// //   active,
// //   onClick,
// //   icon: Icon,
// //   label,
// //   count,
// //   attention = false,
// // }: {
// //   active: boolean;
// //   onClick: () => void;
// //   icon: ComponentType<{ size?: number; className?: string }>;
// //   label: string;
// //   count?: number;
// //   attention?: boolean;
// // }) {
// //   return (
// //     <button
// //       type="button"
// //       onClick={onClick}
// //       aria-pressed={active}
// //       className={[
// //         "relative flex h-8 shrink-0 items-center gap-1.5 rounded-full px-3.5",

// //         "text-[0.64rem] font-semibold",

// //         "transition-colors duration-200",

// //         active
// //           ? ["text-brand-secondary-highlight", "dark:text-secondary"].join(" ")
// //           : [
// //               "text-muted-foreground",

// //               "hover:text-foreground/85",

// //               "dark:hover:text-foreground",
// //             ].join(" "),
// //       ].join(" ")}
// //     >
// //       {active && (
// //         <motion.span
// //           layoutId="workspace-active-tab"
// //           className={[
// //             "absolute inset-0 rounded-full",

// //             "border border-brand-secondary-highlight/10",
// //             "bg-brand-secondary-highlight/[0.08]",

// //             "dark:border-secondary/12",
// //             "dark:bg-secondary/[0.08]",
// //           ].join(" ")}
// //           transition={{ type: "spring", stiffness: 500, damping: 38 }}
// //         />
// //       )}

// //       <span className="relative z-10 flex items-center gap-1.5">
// //         <span className="relative">
// //           {attention && !active && (
// //             <span className="absolute -right-1.5 -top-1 flex h-1.5 w-1.5">
// //               <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-status-pending opacity-30" />

// //               <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-status-pending" />
// //             </span>
// //           )}

// //           <Icon size={11} />
// //         </span>

// //         {label}

// //         {typeof count === "number" && count > 0 && (
// //           <span
// //             className={[
// //               "text-[0.54rem] font-semibold tabular-nums",

// //               active
// //                 ? [
// //                     "text-brand-secondary-highlight/65",
// //                     "dark:text-secondary/65",
// //                   ].join(" ")
// //                 : attention
// //                   ? "text-status-pending-foreground"
// //                   : "text-muted-foreground/55",
// //             ].join(" ")}
// //           >
// //             {count}
// //           </span>
// //         )}
// //       </span>
// //     </button>
// //   );
// // }

// // /* =========================================================
// //    SECTION EYEBROW
// // ========================================================= */

// // function SectionEyebrow({ children }: { children: ReactNode }) {
// //   return (
// //     <div className="flex items-center gap-2.5">
// //       <span className="flex items-center gap-1">
// //         <span className="h-1.5 w-5 rounded-full bg-brand-secondary-highlight/80 dark:bg-brand-secondary-highlight" />

// //         <span className="h-1.5 w-2 rounded-full bg-secondary/85" />
// //       </span>

// //       <p className="text-[0.54rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
// //         {children}
// //       </p>
// //     </div>
// //   );
// // }

// // /* =========================================================
// //    PROJECT CONTROLS
// // ========================================================= */

// // function ProjectControls({
// //   sort,
// //   setSort,
// //   view,
// //   setView,
// // }: {
// //   sort: ProjectSort;
// //   setSort: (value: ProjectSort) => void;
// //   view: ProjectView;
// //   setView: (value: ProjectView) => void;
// // }) {
// //   return (
// //     <div className="flex shrink-0 items-center gap-1">
// //       <SortControl value={sort} onChange={setSort} />

// //       <div className="mx-1 h-4 w-px bg-border/70 dark:bg-border" />

// //       <ViewControls view={view} setView={setView} />
// //     </div>
// //   );
// // }

// // /* =========================================================
// //    SORT CONTROL
// // ========================================================= */

// // function SortControl({
// //   value,
// //   onChange,
// // }: {
// //   value: ProjectSort;
// //   onChange: (value: ProjectSort) => void;
// // }) {
// //   const currentOption =
// //     SORT_OPTIONS.find((option) => option.value === value) ?? SORT_OPTIONS[0];

// //   return (
// //     <DropdownMenu>
// //       <DropdownMenuTrigger asChild>
// //         <Button
// //           type="button"
// //           variant="ghost"
// //           size="sm"
// //           className={[
// //             "h-9 rounded-lg px-2.5 text-xs font-medium shadow-none",

// //             "text-muted-foreground",

// //             "transition-colors",

// //             "hover:bg-surface-3/60",
// //             "hover:text-foreground/90",

// //             "data-[state=open]:bg-surface-3/60",
// //             "data-[state=open]:text-foreground/90",

// //             "dark:hover:bg-surface-3/70",
// //             "dark:hover:text-foreground",

// //             "dark:data-[state=open]:bg-surface-3/70",
// //             "dark:data-[state=open]:text-foreground",
// //           ].join(" ")}
// //         >
// //           <ArrowDownNarrowWideIcon size={14} className="shrink-0" />

// //           <span className="hidden sm:inline">Sort by</span>

// //           <span className="relative hidden min-w-[76px] overflow-hidden text-left md:block">
// //             <AnimatePresence mode="wait" initial={false}>
// //               <motion.span
// //                 key={value}
// //                 initial={{ opacity: 0, y: 4 }}
// //                 animate={{ opacity: 1, y: 0 }}
// //                 exit={{ opacity: 0, y: -4 }}
// //                 transition={{ duration: 0.14 }}
// //                 className="block font-semibold text-foreground/80 dark:text-foreground/90"
// //               >
// //                 {currentOption.label}
// //               </motion.span>
// //             </AnimatePresence>
// //           </span>

// //           <span className="sm:hidden">Sort</span>

// //           <ChevronDownIcon size={13} className="shrink-0" />
// //         </Button>
// //       </DropdownMenuTrigger>

// //       <DropdownMenuContent
// //         align="end"
// //         className={[
// //           "w-52 rounded-xl border p-1.5 shadow-none",

// //           "border-border/65",
// //           "bg-popover",
// //           "text-popover-foreground",

// //           "dark:border-border",
// //         ].join(" ")}
// //       >
// //         {SORT_OPTIONS.map((option) => {
// //           const active = option.value === value;

// //           return (
// //             <DropdownMenuItem
// //               key={option.value}
// //               onSelect={() => onChange(option.value)}
// //               className={[
// //                 "rounded-lg px-3 py-2.5 text-xs",

// //                 "transition-colors",

// //                 active
// //                   ? [
// //                       "bg-brand-secondary-highlight/[0.07]",
// //                       "font-semibold",
// //                       "text-foreground",

// //                       "dark:bg-secondary/[0.07]",
// //                       "dark:text-foreground",
// //                     ].join(" ")
// //                   : [
// //                       "data-[highlighted]:bg-surface-3/60",
// //                       "data-[highlighted]:text-foreground",

// //                       "dark:data-[highlighted]:bg-surface-3/70",
// //                     ].join(" "),
// //               ].join(" ")}
// //             >
// //               <ArrowDownNarrowWideIcon
// //                 size={13}
// //                 className="text-muted-foreground"
// //               />

// //               {option.label}

// //               {active && (
// //                 <CheckCircle2Icon
// //                   size={13}
// //                   className="ml-auto text-brand-secondary-highlight dark:text-secondary"
// //                 />
// //               )}
// //             </DropdownMenuItem>
// //           );
// //         })}
// //       </DropdownMenuContent>
// //     </DropdownMenu>
// //   );
// // }

// // /* =========================================================
// //    VIEW CONTROLS
// // ========================================================= */

// // function ViewControls({
// //   view,
// //   setView,
// // }: {
// //   view: ProjectView;
// //   setView: (value: ProjectView) => void;
// // }) {
// //   return (
// //     <div
// //       className={[
// //         "flex shrink-0 items-center rounded-lg border p-0.5",

// //         "border-border/60",
// //         "bg-surface-2/55",

// //         "dark:border-border",
// //         "dark:bg-surface-2/80",
// //       ].join(" ")}
// //     >
// //       <Button
// //         type="button"
// //         variant="ghost"
// //         size="icon"
// //         className={[
// //           "h-8 w-8 rounded-md shadow-none",

// //           "transition-colors duration-200",

// //           view === "grid"
// //             ? [
// //                 "bg-brand-secondary-highlight/[0.10]",
// //                 "text-brand-secondary-highlight",

// //                 "hover:bg-brand-secondary-highlight/[0.14]",
// //                 "hover:text-brand-secondary-highlight",

// //                 "dark:bg-secondary/[0.10]",
// //                 "dark:text-secondary",

// //                 "dark:hover:bg-secondary/[0.14]",
// //                 "dark:hover:text-secondary",
// //               ].join(" ")
// //             : [
// //                 "text-muted-foreground",

// //                 "hover:bg-surface-1/80",
// //                 "hover:text-foreground/85",

// //                 "dark:hover:bg-surface-3/70",
// //                 "dark:hover:text-foreground",
// //               ].join(" "),
// //         ].join(" ")}
// //         onClick={() => setView("grid")}
// //         aria-label="Grid view"
// //         aria-pressed={view === "grid"}
// //       >
// //         <Grid2X2Icon size={14} />
// //       </Button>

// //       <Button
// //         type="button"
// //         variant="ghost"
// //         size="icon"
// //         className={[
// //           "h-8 w-8 rounded-md shadow-none",

// //           "transition-colors duration-200",

// //           view === "list"
// //             ? [
// //                 "bg-brand-secondary-highlight/[0.10]",
// //                 "text-brand-secondary-highlight",

// //                 "hover:bg-brand-secondary-highlight/[0.14]",
// //                 "hover:text-brand-secondary-highlight",

// //                 "dark:bg-secondary/[0.10]",
// //                 "dark:text-secondary",

// //                 "dark:hover:bg-secondary/[0.14]",
// //                 "dark:hover:text-secondary",
// //               ].join(" ")
// //             : [
// //                 "text-muted-foreground",

// //                 "hover:bg-surface-1/80",
// //                 "hover:text-foreground/85",

// //                 "dark:hover:bg-surface-3/70",
// //                 "dark:hover:text-foreground",
// //               ].join(" "),
// //         ].join(" ")}
// //         onClick={() => setView("list")}
// //         aria-label="List view"
// //         aria-pressed={view === "list"}
// //       >
// //         <LayoutListIcon size={15} />
// //       </Button>
// //     </div>
// //   );
// // }

// // /* =========================================================
// //    PROJECT RESULTS
// // ========================================================= */

// // function ProjectResults({
// //   projects,
// //   view,
// //   emptyLabel,
// //   onProjectUpdated,
// // }: {
// //   projects: Project[];
// //   view: ProjectView;
// //   emptyLabel: string;
// //   onProjectUpdated: (project: Project) => void;
// // }) {
// //   if (projects.length === 0) {
// //     return (
// //       <EmptyCollection
// //         title={`No ${emptyLabel} projects`}
// //         description="Projects matching this status will appear here."
// //         icon={FolderOpenIcon}
// //       />
// //     );
// //   }

// //   return (
// //     <ProjectGrid
// //       projects={projects}
// //       view={view}
// //       onProjectUpdated={onProjectUpdated}
// //     />
// //   );
// // }

// // /* =========================================================
// //    PROJECT GRID
// // ========================================================= */

// // function ProjectGrid<T extends Project>({
// //   projects,
// //   view,
// //   onProjectUpdated,
// // }: {
// //   projects: T[];
// //   view: ProjectView;
// //   onProjectUpdated?: (project: Project) => void;
// // }) {
// //   return (
// //     <div
// //       className={
// //         view === "grid"
// //           ? [
// //               "mt-6 grid min-w-0 gap-4",
// //               "sm:grid-cols-2",
// //               "lg:grid-cols-3",
// //               "2xl:grid-cols-4",
// //             ].join(" ")
// //           : "mt-6 flex min-w-0 flex-col gap-3"
// //       }
// //     >
// //       {projects.map((project) =>
// //         view === "grid" ? (
// //           <GridView
// //             key={project.id}
// //             project={project}
// //             onProjectUpdated={onProjectUpdated}
// //           />
// //         ) : (
// //           <ListView
// //             key={project.id}
// //             project={project}
// //             onProjectUpdated={onProjectUpdated}
// //           />
// //         ),
// //       )}
// //     </div>
// //   );
// // }

// // /* =========================================================
// //    INVITATION CARD
// // ========================================================= */

// // function InvitationCard({
// //   project,
// //   onAccept,
// //   onDecline,
// // }: {
// //   project: WorkProject;
// //   onAccept: () => Promise<void>;
// //   onDecline: () => Promise<void>;
// // }) {
// //   const [detailsOpen, setDetailsOpen] = useState(false);

// //   const [responding, setResponding] = useState<"accept" | "decline" | null>(
// //     null,
// //   );

// //   async function handleAccept() {
// //     if (responding) return;

// //     setResponding("accept");

// //     try {
// //       await onAccept();
// //       setDetailsOpen(false);
// //     } finally {
// //       setResponding(null);
// //     }
// //   }

// //   async function handleDecline() {
// //     if (responding) return;

// //     setResponding("decline");

// //     try {
// //       await onDecline();
// //       setDetailsOpen(false);
// //     } finally {
// //       setResponding(null);
// //     }
// //   }

// //   return (
// //     <>
// //       <article
// //         className={[
// //           "group relative overflow-hidden rounded-xl border p-5 sm:p-6",

// //           "border-border/60",
// //           "bg-card",

// //           "transition-[background-color,border-color] duration-200",

// //           "hover:border-brand-amber/20",
// //           "hover:bg-surface-2/65",

// //           "dark:border-border",
// //           "dark:bg-card",

// //           "dark:hover:border-status-pending/20",
// //           "dark:hover:bg-surface-2/75",
// //         ].join(" ")}
// //       >
// //         <span className="absolute inset-y-5 left-0 w-[2px] rounded-full bg-status-pending/80" />

// //         <div className="grid gap-5 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
// //           <div className="min-w-0">
// //             <div className="flex flex-wrap items-center gap-3">
// //               <span className="inline-flex items-center gap-2 text-[0.56rem] font-semibold uppercase tracking-[0.15em] text-brand-amber dark:text-status-pending-foreground">
// //                 <span
// //                   className={[
// //                     "flex h-7 w-7 items-center justify-center rounded-lg",

// //                     "bg-brand-amber/10",

// //                     "dark:bg-status-pending/10",
// //                   ].join(" ")}
// //                 >
// //                   <SendIcon size={11} />
// //                 </span>
// //                 Project invitation
// //               </span>

// //               {project.invitedAt && (
// //                 <span className="text-[0.58rem] text-muted-foreground/80">
// //                   {formatShortDate(project.invitedAt)}
// //                 </span>
// //               )}
// //             </div>

// //             <h2 className="mt-4 text-base font-semibold leading-tight tracking-[-0.02em] text-foreground/90 sm:text-lg dark:text-foreground">
// //               {project.title}
// //             </h2>

// //             <p className="mt-2 line-clamp-2 max-w-2xl text-xs leading-6 text-muted-foreground sm:text-sm">
// //               {project.description}
// //             </p>

// //             <button
// //               type="button"
// //               onClick={() => setDetailsOpen(true)}
// //               className={[
// //                 "mt-4 inline-flex items-center gap-2",

// //                 "text-[0.62rem] font-semibold",

// //                 "text-brand-secondary-highlight",

// //                 "transition-colors",

// //                 "hover:text-foreground/85",

// //                 "dark:text-secondary",
// //                 "dark:hover:text-foreground",
// //               ].join(" ")}
// //             >
// //               Review project
// //               <ArrowRightIcon size={12} />
// //             </button>
// //           </div>

// //           <div className="flex items-center gap-2 sm:justify-end">
// //             <Button
// //               type="button"
// //               variant="ghost"
// //               disabled={responding !== null}
// //               onClick={() => void handleDecline()}
// //               className={[
// //                 "h-9 rounded-lg px-3 text-xs shadow-none",

// //                 "text-muted-foreground",

// //                 "hover:bg-surface-3/60",
// //                 "hover:text-foreground/90",

// //                 "dark:hover:bg-surface-3/70",
// //                 "dark:hover:text-foreground",
// //               ].join(" ")}
// //             >
// //               {responding === "decline" ? (
// //                 <LoaderCircleIcon size={15} className="animate-spin" />
// //               ) : (
// //                 <XIcon size={14} />
// //               )}
// //               Decline
// //             </Button>

// //             <Button
// //               type="button"
// //               disabled={responding !== null}
// //               onClick={() => void handleAccept()}
// //               className={[
// //                 "h-9 rounded-lg px-4 text-xs font-semibold shadow-none",
// //                 primaryActionButton,
// //               ].join(" ")}
// //             >
// //               {responding === "accept" ? (
// //                 <LoaderCircleIcon size={15} className="animate-spin" />
// //               ) : (
// //                 <CheckCircle2Icon size={14} />
// //               )}
// //               Accept
// //             </Button>
// //           </div>
// //         </div>
// //       </article>

// //       <ProjectInvitationDialog
// //         project={project}
// //         open={detailsOpen}
// //         onOpenChange={setDetailsOpen}
// //         responding={responding}
// //         onAccept={handleAccept}
// //         onDecline={handleDecline}
// //       />
// //     </>
// //   );
// // }

// // /* =========================================================
// //    INVITATION DIALOG
// // ========================================================= */

// // function ProjectInvitationDialog({
// //   project,
// //   open,
// //   onOpenChange,
// //   responding,
// //   onAccept,
// //   onDecline,
// // }: {
// //   project: WorkProject;
// //   open: boolean;
// //   onOpenChange: (open: boolean) => void;
// //   responding: "accept" | "decline" | null;
// //   onAccept: () => Promise<void>;
// //   onDecline: () => Promise<void>;
// // }) {
// //   return (
// //     <Dialog open={open} onOpenChange={onOpenChange}>
// //       <DialogContent
// //         className={[
// //           "max-h-[90vh] overflow-y-auto rounded-xl p-0 sm:max-w-2xl",

// //           "border-border/65",
// //           "bg-card",
// //           "text-card-foreground",

// //           "shadow-none",

// //           "dark:border-border",
// //           "dark:bg-card",
// //         ].join(" ")}
// //       >
// //         <DialogHeader className="border-b border-border/60 px-5 pb-5 pt-6 text-left sm:px-8 sm:pb-6 sm:pt-7 dark:border-border">
// //           <Badge
// //             variant="outline"
// //             className={[
// //               "mb-3 w-fit rounded-md",

// //               "border-brand-amber/20",
// //               "bg-brand-amber/[0.07]",
// //               "text-brand-amber",

// //               "dark:border-status-pending/20",
// //               "dark:bg-status-pending/[0.08]",
// //               "dark:text-status-pending-foreground",
// //             ].join(" ")}
// //           >
// //             Project invitation
// //           </Badge>

// //           <DialogTitle className="text-xl font-semibold leading-tight tracking-[-0.025em] text-foreground/90 sm:text-2xl dark:text-foreground">
// //             {project.title}
// //           </DialogTitle>

// //           <DialogDescription className="mt-2 max-w-xl leading-7 text-muted-foreground">
// //             Review the project before deciding whether you want to join the
// //             work.
// //           </DialogDescription>
// //         </DialogHeader>

// //         <div className="space-y-6 px-5 py-6 sm:space-y-7 sm:px-8 sm:py-7">
// //           <section>
// //             <p className="text-[0.58rem] font-semibold uppercase tracking-[0.15em] text-muted-foreground">
// //               Project description
// //             </p>

// //             <p className="mt-3 whitespace-pre-line text-sm leading-7 text-foreground/80 dark:text-foreground/90">
// //               {project.description || "No project description was provided."}
// //             </p>
// //           </section>

// //           <div className="grid gap-5 border-y border-border/60 py-5 sm:grid-cols-3 dark:border-border">
// //             <ProjectDetail label="Status" value="Awaiting response" />

// //             {project.invitedAt && (
// //               <ProjectDetail
// //                 label="Invited"
// //                 value={formatShortDate(project.invitedAt)}
// //               />
// //             )}

// //             {project.dueDate && (
// //               <ProjectDetail
// //                 label="Due"
// //                 value={formatShortDate(project.dueDate)}
// //               />
// //             )}
// //           </div>

// //           <div
// //             className={[
// //               "rounded-r-lg border-l-2 py-2 pl-4 pr-3",

// //               "border-brand-amber/40",
// //               "bg-brand-amber/[0.055]",

// //               "dark:border-status-pending/35",
// //               "dark:bg-status-pending/[0.07]",
// //             ].join(" ")}
// //           >
// //             <p className="text-xs leading-6 text-foreground/70 dark:text-foreground/80">
// //               Accepting gives you access to the project workspace and its tasks.
// //               Until then, you can only review these project details.
// //             </p>
// //           </div>

// //           <div className="flex flex-col-reverse gap-2.5 border-t border-border/60 pt-6 sm:flex-row sm:justify-end dark:border-border">
// //             <Button
// //               type="button"
// //               variant="ghost"
// //               disabled={responding !== null}
// //               onClick={() => void onDecline()}
// //               className={[
// //                 "h-10 rounded-lg px-5 shadow-none sm:h-11",

// //                 "text-muted-foreground",

// //                 "hover:bg-surface-3/60",
// //                 "hover:text-foreground",

// //                 "dark:hover:bg-surface-3/70",
// //                 "dark:hover:text-foreground",
// //               ].join(" ")}
// //             >
// //               {responding === "decline" ? (
// //                 <LoaderCircleIcon className="h-4 w-4 animate-spin" />
// //               ) : (
// //                 <XIcon size={15} />
// //               )}
// //               Decline
// //             </Button>

// //             <Button
// //               type="button"
// //               disabled={responding !== null}
// //               onClick={() => void onAccept()}
// //               className={[
// //                 "h-10 rounded-lg px-6 font-semibold shadow-none sm:h-11",
// //                 primaryActionButton,
// //               ].join(" ")}
// //             >
// //               {responding === "accept" ? (
// //                 <LoaderCircleIcon className="h-4 w-4 animate-spin" />
// //               ) : (
// //                 <CheckCircle2Icon size={15} />
// //               )}
// //               Accept project
// //             </Button>
// //           </div>
// //         </div>
// //       </DialogContent>
// //     </Dialog>
// //   );
// // }

// // /* =========================================================
// //    PROJECT DETAIL
// // ========================================================= */

// // function ProjectDetail({ label, value }: { label: string; value: ReactNode }) {
// //   return (
// //     <div className="min-w-0">
// //       <p className="text-[0.56rem] font-semibold uppercase tracking-[0.15em] text-muted-foreground">
// //         {label}
// //       </p>

// //       <div className="mt-1.5 break-words text-sm font-semibold text-foreground/80 dark:text-foreground/90">
// //         {value}
// //       </div>
// //     </div>
// //   );
// // }

// // /* =========================================================
// //    WORK SECTION LOADING
// // ========================================================= */

// // function WorkSectionLoading() {
// //   return (
// //     <section
// //       className={[
// //         "mt-6 flex min-h-[200px] items-center justify-center rounded-xl border",

// //         "border-border/55",
// //         "bg-surface-2/60",

// //         "dark:border-border",
// //         "dark:bg-surface-1",
// //       ].join(" ")}
// //     >
// //       <div className="flex items-center gap-2.5 text-sm text-muted-foreground">
// //         <LoaderCircleIcon size={16} className="animate-spin" />
// //         Loading client work
// //       </div>
// //     </section>
// //   );
// // }

// // /* =========================================================
// //    WORK LOAD ERROR
// // ========================================================= */

// // function WorkLoadError({ onRetry }: { onRetry: () => void }) {
// //   return (
// //     <section
// //       className={[
// //         "mt-6 overflow-hidden rounded-xl border p-6 sm:p-8",

// //         "border-border/55",
// //         "bg-surface-2/60",

// //         "dark:border-border",
// //         "dark:bg-surface-1",
// //       ].join(" ")}
// //     >
// //       <div className="max-w-md">
// //         <span
// //           className={[
// //             "flex h-10 w-10 items-center justify-center rounded-lg",
// //             softIconSurface,
// //           ].join(" ")}
// //         >
// //           <RefreshCwIcon size={17} />
// //         </span>

// //         <h2 className="mt-5 text-lg font-semibold tracking-[-0.02em] text-foreground/90 dark:text-foreground">
// //           Your work could not be loaded.
// //         </h2>

// //         <p className="mt-2 text-sm leading-7 text-muted-foreground">
// //           We couldn't retrieve your client projects and invitations.
// //         </p>

// //         <Button
// //           type="button"
// //           variant="outline"
// //           onClick={onRetry}
// //           className={[
// //             "mt-5 h-9 rounded-lg px-4 text-xs font-semibold shadow-none",
// //             secondaryActionButton,
// //           ].join(" ")}
// //         >
// //           <RefreshCwIcon size={13} />
// //           Try again
// //         </Button>
// //       </div>
// //     </section>
// //   );
// // }

// // /* =========================================================
// //    EMPTY COLLECTION
// // ========================================================= */

// // function EmptyCollection({
// //   title,
// //   description,
// //   icon: Icon,
// // }: {
// //   title: string;
// //   description: string;
// //   icon: ComponentType<{ size?: number; className?: string }>;
// // }) {
// //   return (
// //     <section
// //       className={[
// //         "mt-6 overflow-hidden rounded-xl border px-6 py-9 sm:px-8 sm:py-10",

// //         "border-border/55",
// //         "bg-surface-2/60",

// //         "dark:border-border",
// //         "dark:bg-surface-1",
// //       ].join(" ")}
// //     >
// //       <div className="max-w-md">
// //         <span
// //           className={[
// //             "flex h-10 w-10 items-center justify-center rounded-lg",
// //             softIconSurface,
// //           ].join(" ")}
// //         >
// //           <Icon size={17} />
// //         </span>

// //         <h2 className="mt-5 text-lg font-semibold tracking-[-0.02em] text-foreground/90 sm:text-xl dark:text-foreground">
// //           {title}.
// //         </h2>

// //         <p className="mt-2 text-sm leading-7 text-muted-foreground">
// //           {description}
// //         </p>
// //       </div>
// //     </section>
// //   );
// // }

// // /* =========================================================
// //    EMPTY WORK STATE
// // ========================================================= */

// // function WorkEmptyState({
// //   title,
// //   description,
// //   icon,
// // }: {
// //   title: string;
// //   description: string;
// //   icon: ComponentType<{ size?: number; className?: string }>;
// // }) {
// //   return (
// //     <EmptyCollection title={title} description={description} icon={icon} />
// //   );
// // }

// // /* =========================================================
// //    LOADING
// // ========================================================= */

// // function WorkspaceLoading() {
// //   return (
// //     <div className="flex min-h-screen flex-col bg-background text-foreground">
// //       <header className="sticky top-0 z-50 border-b border-border/60 bg-background/95 backdrop-blur-xl dark:border-border">
// //         <div className="container mx-auto px-4 sm:px-5 md:px-8">
// //           <DashboardMainNav />
// //         </div>
// //       </header>

// //       <main className="container mx-auto flex flex-1 px-5 md:px-8">
// //         <LoadingState
// //           label="Loading your workspace"
// //           className="min-h-[calc(100vh-5rem)]"
// //         />
// //       </main>
// //     </div>
// //   );
// // }

// // /* =========================================================
// //    ERROR
// // ========================================================= */

// // function WorkspaceError({ onRetry }: { onRetry: () => Promise<void> }) {
// //   return (
// //     <div className="flex min-h-screen flex-col bg-background text-foreground">
// //       <header className="sticky top-0 z-50 border-b border-border/60 bg-background/95 backdrop-blur-xl dark:border-border">
// //         <div className="container mx-auto px-4 sm:px-5 md:px-8">
// //           <DashboardMainNav />
// //         </div>
// //       </header>

// //       <main className="container mx-auto flex flex-1 items-center px-5 py-20 md:px-8">
// //         <div className="max-w-lg">
// //           <span
// //             className={[
// //               "flex h-11 w-11 items-center justify-center rounded-xl",

// //               "bg-destructive/[0.07]",
// //               "text-destructive",

// //               "dark:bg-status-overdue/[0.08]",
// //               "dark:text-status-overdue-foreground",
// //             ].join(" ")}
// //           >
// //             <FolderOpenIcon size={20} />
// //           </span>

// //           <h1 className="mt-6 text-3xl font-semibold leading-tight tracking-[-0.03em] text-foreground/90 dark:text-foreground">
// //             We could not load your workspace.
// //           </h1>

// //           <p className="mt-3 text-sm leading-7 text-muted-foreground">
// //             Something interrupted the connection. Try loading the projects
// //             again.
// //           </p>

// //           <Button
// //             type="button"
// //             className={[
// //               "mt-7 h-11 rounded-lg px-6 font-semibold shadow-none",
// //               primaryActionButton,
// //             ].join(" ")}
// //             onClick={() => void onRetry()}
// //           >
// //             <RefreshCwIcon size={15} />
// //             Try again
// //           </Button>
// //         </div>
// //       </main>
// //     </div>
// //   );
// // }

// // /* =========================================================
// //    METRIC APPEARANCE
// // ========================================================= */

// // function getMetricAppearance(emphasis?: SummaryItem["emphasis"]): {
// //   icon: string;
// //   line: string;
// // } {
// //   if (emphasis === "warning") {
// //     return {
// //       icon: ["text-brand-amber", "dark:text-status-pending-foreground"].join(
// //         " ",
// //       ),

// //       line: ["bg-brand-amber", "dark:bg-status-pending"].join(" "),
// //     };
// //   }

// //   if (emphasis === "success") {
// //     return {
// //       icon: ["text-brand-green", "dark:text-status-complete-foreground"].join(
// //         " ",
// //       ),

// //       line: ["bg-brand-green", "dark:bg-status-complete"].join(" "),
// //     };
// //   }

// //   return {
// //     icon: [
// //       "text-brand-secondary-highlight",
// //       "dark:text-status-active-foreground",
// //     ].join(" "),

// //     line: ["bg-brand-secondary-highlight", "dark:bg-status-active"].join(" "),
// //   };
// // }

// // /* =========================================================
// //    HELPERS
// // ========================================================= */

// // function normalizeProjectStatus(status?: string) {
// //   return String(status ?? "")
// //     .toLowerCase()
// //     .replace(/[\s_-]/g, "");
// // }

// // function getProjectDateValue(project: Project) {
// //   if (!project.createdAt) return 0;

// //   const date = new Date(project.createdAt);

// //   if (Number.isNaN(date.getTime())) {
// //     return 0;
// //   }

// //   return date.getTime();
// // }

// // function sortProjectItems<T extends Project>(
// //   items: T[],
// //   sort: ProjectSort,
// // ): T[] {
// //   const copy = [...items];

// //   copy.sort((first, second) => {
// //     if (sort === "oldest") {
// //       return getProjectDateValue(first) - getProjectDateValue(second);
// //     }

// //     if (sort === "title-asc") {
// //       return first.title.localeCompare(second.title, undefined, {
// //         sensitivity: "base",
// //       });
// //     }

// //     if (sort === "title-desc") {
// //       return second.title.localeCompare(first.title, undefined, {
// //         sensitivity: "base",
// //       });
// //     }

// //     return getProjectDateValue(second) - getProjectDateValue(first);
// //   });

// //   return copy;
// // }

// // function formatShortDate(value: string) {
// //   const date = new Date(value);

// //   if (Number.isNaN(date.getTime())) {
// //     return "";
// //   }

// //   return new Intl.DateTimeFormat("en", {
// //     day: "numeric",
// //     month: "short",
// //     year: "numeric",
// //   }).format(date);
// // }

// // export default Projects;

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

// /* =========================================================
//    SHARED THEME
// ========================================================= */

// const primaryActionButton = [
//   "border border-brand-secondary-highlight/15",
//   "bg-brand-secondary-highlight text-primary-foreground",
//   "hover:border-brand-secondary-highlight/20",
//   "hover:bg-brand-secondary-highlight/90",
//   "hover:text-primary-foreground",
//   "dark:border-secondary dark:bg-secondary",
//   "dark:text-secondary-foreground",
//   "dark:hover:border-secondary/90",
//   "dark:hover:bg-secondary/90",
//   "dark:hover:text-secondary-foreground",
// ].join(" ");

// const secondaryActionButton = [
//   "border-border/65 bg-surface-2/40 text-foreground/70",
//   "hover:border-border/85 hover:bg-surface-3/60",
//   "hover:text-foreground/90",
//   "dark:border-border dark:bg-surface-2/80",
//   "dark:text-foreground/80",
//   "dark:hover:border-border dark:hover:bg-surface-3/80",
//   "dark:hover:text-foreground",
// ].join(" ");

// const elevatedSurface = [
//   "border-border/60 bg-card",
//   "dark:border-border dark:bg-card",
// ].join(" ");

// const softIconSurface = [
//   "bg-surface-3/75 text-brand-secondary-highlight",
//   "ring-1 ring-inset ring-border/35",
//   "dark:bg-surface-2 dark:text-secondary dark:ring-border",
// ].join(" ");

// const focusStyle = [
//   "focus-visible:outline-none",
//   "focus-visible:ring-2 focus-visible:ring-ring/30",
// ].join(" ");

// /* =========================================================
//    PAGE ENTRY

//    Reset local data when the signed-in account changes.
// ========================================================= */

// function Projects() {
//   const { user } = useAuth();

//   if (!user?.userId) {
//     return <WorkspaceLoading />;
//   }

//   return <ProjectsPage key={`${user.userId}:${Boolean(user.isAllocat)}`} />;
// }

// /* =========================================================
//    PAGE
// ========================================================= */

// function ProjectsPage() {
//   const { user } = useAuth();

//   const [workspaceSection, setWorkspaceSection] =
//     useState<WorkspaceSection>("projects");

//   const [view, setView] = useState<ProjectView>("grid");
//   const [filter, setFilter] = useState<ProjectFilter>("active");
//   const [workFilter, setWorkFilter] = useState<WorkFilter>("active");
//   const [sort, setSort] = useState<ProjectSort>("newest");
//   const [search, setSearch] = useState("");

//   const [projects, setProjects] = useState<Project[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(false);

//   const [workProjects, setWorkProjects] = useState<WorkProject[]>([]);
//   const [workLoading, setWorkLoading] = useState(Boolean(user?.isAllocat));
//   const [workLoaded, setWorkLoaded] = useState(false);
//   const [workError, setWorkError] = useState<string | null>(null);

//   const mountedRef = useRef(false);
//   const projectsRequestRef = useRef(0);
//   const workRequestRef = useRef(0);

//   /* =======================================================
//      LIFECYCLE
//   ======================================================= */

//   useEffect(() => {
//     mountedRef.current = true;

//     return () => {
//       mountedRef.current = false;
//       projectsRequestRef.current += 1;
//       workRequestRef.current += 1;
//     };
//   }, []);

//   /* =======================================================
//      LOAD OWN PROJECTS
//   ======================================================= */

//   const fetchProjects = useCallback(async () => {
//     if (!mountedRef.current) return;

//     const request = ++projectsRequestRef.current;

//     setLoading(true);
//     setError(false);

//     try {
//       const response = await api.get<Project[]>("/projects/mine", {
//         withCredentials: true,
//       });

//       if (!mountedRef.current || request !== projectsRequestRef.current) {
//         return;
//       }

//       if (!Array.isArray(response.data)) {
//         throw new Error("Invalid projects response.");
//       }

//       setProjects(response.data);
//     } catch {
//       if (mountedRef.current && request === projectsRequestRef.current) {
//         setError(true);
//       }
//     } finally {
//       if (mountedRef.current && request === projectsRequestRef.current) {
//         setLoading(false);
//       }
//     }
//   }, []);

//   /* =======================================================
//      LOAD ALLOCAT WORK
//   ======================================================= */

//   const fetchWorkProjects = useCallback(
//     async ({
//       notifyOnError = false,
//     }: {
//       notifyOnError?: boolean;
//     } = {}) => {
//       if (!user?.isAllocat || !mountedRef.current) return;

//       const request = ++workRequestRef.current;

//       setWorkLoading(true);
//       setWorkError(null);

//       try {
//         const response = await api.get<WorkProject[]>("/allocats/me/projects", {
//           withCredentials: true,
//         });

//         if (!mountedRef.current || request !== workRequestRef.current) {
//           return;
//         }

//         if (!Array.isArray(response.data)) {
//           throw new Error("Invalid client work response.");
//         }

//         setWorkProjects(response.data);
//         setWorkLoaded(true);
//       } catch {
//         if (!mountedRef.current || request !== workRequestRef.current) {
//           return;
//         }

//         setWorkError("Your client work could not be loaded.");

//         if (notifyOnError) {
//           toast.error("We could not load your work.");
//         }
//       } finally {
//         if (mountedRef.current && request === workRequestRef.current) {
//           setWorkLoading(false);
//         }
//       }
//     },
//     [user?.isAllocat],
//   );

//   /* =======================================================
//      INITIAL LOAD
//   ======================================================= */

//   useEffect(() => {
//     void fetchProjects();
//   }, [fetchProjects]);

//   useEffect(() => {
//     if (user?.isAllocat) {
//       void fetchWorkProjects();
//     }
//   }, [user?.isAllocat, fetchWorkProjects]);

//   /* =======================================================
//      UPDATE HANDLERS
//   ======================================================= */

//   const handleOwnedProjectUpdated = useCallback((updatedProject: Project) => {
//     setProjects((current) =>
//       current.map((project) =>
//         project.id === updatedProject.id
//           ? { ...project, ...updatedProject }
//           : project,
//       ),
//     );
//   }, []);

//   const handleWorkProjectUpdated = useCallback((updatedProject: Project) => {
//     setWorkProjects((current) =>
//       current.map((project) =>
//         project.id === updatedProject.id
//           ? { ...project, ...updatedProject }
//           : project,
//       ),
//     );
//   }, []);

//   function changeSection(section: WorkspaceSection) {
//     setWorkspaceSection(section);
//     setSearch("");
//   }

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
//       } else if (PAUSED_PROJECT_STATUSES.has(status)) {
//         groups.pending.push(project);
//       } else if (
//         status === "active" ||
//         status === "completionrequested" ||
//         project.hasAcceptedAllocat === true
//       ) {
//         groups.active.push(project);
//       } else {
//         groups.pending.push(project);
//       }
//     }

//     return groups;
//   }, [projects]);

//   const activeProjects = ownedProjectGroups.active;
//   const pendingProjects = ownedProjectGroups.pending;
//   const closedProjects = ownedProjectGroups.closed;

//   const completionRequests = useMemo(
//     () =>
//       projects.filter(
//         (project) =>
//           normalizeProjectStatus(project.status) === "completionrequested",
//       ),
//     [projects],
//   );

//   /* =======================================================
//      OWN PROJECT SEARCH AND SORT
//   ======================================================= */

//   const selectedProjects = ownedProjectGroups[filter];

//   const visibleProjects = useMemo(
//     () =>
//       sortProjectItems(
//         selectedProjects.filter((project) =>
//           matchesProjectSearch(project, search),
//         ),
//         sort,
//       ),
//     [selectedProjects, search, sort],
//   );

//   /* =======================================================
//      ALLOCAT WORK
//   ======================================================= */

//   const invitations = useMemo(
//     () =>
//       workProjects.filter(
//         (project) =>
//           normalizeProjectStatus(project.projectAllocatStatus) === "invited",
//       ),
//     [workProjects],
//   );

//   const activeWork = useMemo(
//     () =>
//       workProjects.filter(
//         (project) =>
//           normalizeProjectStatus(project.projectAllocatStatus) === "accepted" &&
//           !CLOSED_PROJECT_STATUSES.has(normalizeProjectStatus(project.status)),
//       ),
//     [workProjects],
//   );

//   const completedWork = useMemo(
//     () =>
//       workProjects.filter(
//         (project) =>
//           normalizeProjectStatus(project.projectAllocatStatus) === "accepted" &&
//           CLOSED_PROJECT_STATUSES.has(normalizeProjectStatus(project.status)),
//       ),
//     [workProjects],
//   );

//   const selectedWork =
//     workFilter === "invitations"
//       ? invitations
//       : workFilter === "completed"
//         ? completedWork
//         : activeWork;

//   const visibleWork = useMemo(
//     () =>
//       sortProjectItems(
//         selectedWork.filter((project) => matchesProjectSearch(project, search)),
//         sort,
//       ),
//     [selectedWork, search, sort],
//   );

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
//     } catch (cause) {
//       if (mountedRef.current) {
//         toast.error("The invitation could not be accepted.");
//       }

//       throw cause;
//     }

//     if (!mountedRef.current) return;

//     // Reflect the saved response immediately, then refresh.
//     setWorkProjects((current) =>
//       current.map((project) =>
//         project.id === projectId
//           ? {
//               ...project,
//               projectAllocatStatus: "Accepted",
//               respondedAt: new Date().toISOString(),
//             }
//           : project,
//       ),
//     );

//     toast.success("Project invitation accepted.");

//     void fetchWorkProjects();
//   }

//   async function declineInvitation(projectId: string) {
//     try {
//       await api.patch(
//         `/projects/${projectId}/allocats/invite/decline`,
//         {},
//         { withCredentials: true },
//       );
//     } catch (cause) {
//       if (mountedRef.current) {
//         toast.error("The invitation could not be declined.");
//       }

//       throw cause;
//     }

//     if (!mountedRef.current) return;

//     setWorkProjects((current) =>
//       current.filter((project) => project.id !== projectId),
//     );

//     toast.success("Project invitation declined.");

//     void fetchWorkProjects();
//   }

//   /* =======================================================
//      PAGE STATE
//   ======================================================= */

//   if (loading) {
//     return <WorkspaceLoading />;
//   }

//   if (error) {
//     return <WorkspaceError onRetry={fetchProjects} />;
//   }

//   const firstName = user?.fullName?.trim().split(/\s+/)[0] || "there";

//   const showNewClientState = projects.length === 0 && !user?.isAllocat;

//   const isWorkSection = workspaceSection === "work";

//   const isInvitationSection = isWorkSection && workFilter === "invitations";

//   const searchActive = Boolean(search.trim());

//   const currentCount = isWorkSection
//     ? selectedWork.length
//     : selectedProjects.length;

//   const visibleCount = isWorkSection
//     ? visibleWork.length
//     : visibleProjects.length;

//   /* =======================================================
//      SUMMARY
//   ======================================================= */

//   const summaryItems: SummaryItem[] = !isWorkSection
//     ? [
//         {
//           label: "Active",
//           value: activeProjects.length,
//           icon: CircleDotIcon,
//           emphasis: "primary",
//           active: filter === "active",
//           attention: completionRequests.length > 0,
//           onClick: () => setFilter("active"),
//         },
//         {
//           label: "Pending",
//           value: pendingProjects.length,
//           icon: Clock3Icon,
//           emphasis: "warning",
//           active: filter === "pending",
//           attention: pendingProjects.length > 0,
//           onClick: () => setFilter("pending"),
//         },
//         {
//           label: "Completed",
//           value: closedProjects.length,
//           icon: CheckCircle2Icon,
//           emphasis: "success",
//           active: filter === "closed",
//           onClick: () => setFilter("closed"),
//         },
//       ]
//     : [
//         {
//           label: "Invitations",
//           value: invitations.length,
//           icon: InboxIcon,
//           emphasis: "warning",
//           active: workFilter === "invitations",
//           attention: invitations.length > 0,
//           onClick: () => setWorkFilter("invitations"),
//         },
//         {
//           label: "Active",
//           value: activeWork.length,
//           icon: BriefcaseBusinessIcon,
//           emphasis: "primary",
//           active: workFilter === "active",
//           onClick: () => setWorkFilter("active"),
//         },
//         {
//           label: "Completed",
//           value: completedWork.length,
//           icon: CheckCircle2Icon,
//           emphasis: "success",
//           active: workFilter === "completed",
//           onClick: () => setWorkFilter("completed"),
//         },
//       ];

//   const workCount =
//     invitations.length + activeWork.length + completedWork.length;

//   const sectionTitle = !isWorkSection
//     ? filter === "pending"
//       ? "Pending projects"
//       : filter === "closed"
//         ? "Completed projects"
//         : "Active projects"
//     : workFilter === "invitations"
//       ? "Invitations"
//       : workFilter === "completed"
//         ? "Completed work"
//         : "Active work";

//   const sectionDescription = !isWorkSection
//     ? filter === "pending"
//       ? "Projects waiting for an Allocat or the next step."
//       : filter === "closed"
//         ? "Your completed and closed projects."
//         : "The projects currently moving through your workspace."
//     : workFilter === "invitations"
//       ? "Projects clients have invited you to join."
//       : workFilter === "completed"
//         ? "Your completed and closed client projects."
//         : "The client work currently on your plate.";

//   /* =======================================================
//      RENDER
//   ======================================================= */

//   return (
//     <div className="flex min-h-screen flex-col bg-background text-foreground">
//       <WorkspaceHeader />

//       {showNewClientState ? (
//         <main className="container mx-auto flex flex-1 items-center justify-center px-4 py-10 sm:px-5 sm:py-14 md:px-8">
//           <NewClientWelcome firstName={firstName} />
//         </main>
//       ) : (
//         <>
//           {/* MASTHEAD */}

//           <div className="container mx-auto px-4 pt-4 sm:px-5 sm:pt-5 md:px-8 lg:pt-6">
//             <WorkspaceMasthead
//               firstName={firstName}
//               isAllocat={Boolean(user?.isAllocat)}
//               workspaceSection={workspaceSection}
//               onSectionChange={changeSection}
//               projectCount={projects.length}
//               workCount={workCount}
//               invitationCount={invitations.length}
//               items={summaryItems}
//             />
//           </div>

//           {/* CONTENT */}

//           <main className="container mx-auto flex-1 px-4 pb-10 pt-7 sm:px-5 sm:pb-12 sm:pt-8 md:px-8 lg:pt-9">
//             <motion.section
//               initial={{ opacity: 0, y: 7 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{
//                 delay: 0.04,
//                 duration: 0.3,
//                 ease: "easeOut",
//               }}
//             >
//               <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
//                 <div className="min-w-0">
//                   <SectionEyebrow>
//                     {isWorkSection ? "Client work" : "Your workspace"}
//                   </SectionEyebrow>

//                   <h2 className="mt-3 text-xl font-semibold tracking-[-0.025em] text-foreground/90 sm:text-2xl dark:text-foreground">
//                     {sectionTitle}
//                   </h2>

//                   <p className="mt-1.5 hidden max-w-2xl text-xs leading-6 text-muted-foreground sm:block sm:text-sm">
//                     {sectionDescription}
//                   </p>
//                 </div>

//                 {!isInvitationSection && (
//                   <ProjectControls
//                     sort={sort}
//                     setSort={setSort}
//                     view={view}
//                     setView={setView}
//                   />
//                 )}
//               </div>

//               {/* SEARCH */}

//               <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
//                 <ProjectSearch
//                   value={search}
//                   onChange={setSearch}
//                   placeholder={
//                     isInvitationSection
//                       ? "Search invitations"
//                       : isWorkSection
//                         ? "Search client work"
//                         : "Search projects"
//                   }
//                 />

//                 {searchActive && (!isWorkSection || workLoaded) && (
//                   <p
//                     role="status"
//                     aria-live="polite"
//                     aria-atomic="true"
//                     className="text-[11px] text-muted-foreground"
//                   >
//                     {visibleCount} of {currentCount}{" "}
//                     {isInvitationSection ? "invitations" : "projects"} shown
//                   </p>
//                 )}
//               </div>

//               {/* OWN PROJECTS */}

//               {!isWorkSection && (
//                 <ProjectResults
//                   projects={visibleProjects}
//                   view={view}
//                   emptyLabel={filter === "closed" ? "completed" : filter}
//                   searchActive={searchActive}
//                   onClearSearch={() => setSearch("")}
//                   onProjectUpdated={handleOwnedProjectUpdated}
//                 />
//               )}

//               {/* CLIENT WORK */}

//               {isWorkSection && user?.isAllocat && (
//                 <>
//                   {workLoading && !workLoaded ? (
//                     <WorkSectionLoading />
//                   ) : workError && !workLoaded ? (
//                     <WorkLoadError
//                       onRetry={() =>
//                         void fetchWorkProjects({
//                           notifyOnError: true,
//                         })
//                       }
//                     />
//                   ) : (
//                     <>
//                       {workError && workLoaded && (
//                         <div
//                           role="alert"
//                           className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border/60 bg-surface-2/40 px-4 py-3 dark:border-border"
//                         >
//                           <p className="text-xs leading-5 text-muted-foreground">
//                             Your work could not be refreshed. Your last loaded
//                             projects are still shown.
//                           </p>

//                           <button
//                             type="button"
//                             disabled={workLoading}
//                             onClick={() =>
//                               void fetchWorkProjects({
//                                 notifyOnError: true,
//                               })
//                             }
//                             className={`rounded text-xs font-medium text-brand-secondary-highlight disabled:opacity-50 dark:text-secondary ${focusStyle}`}
//                           >
//                             Try again
//                           </button>
//                         </div>
//                       )}

//                       {searchActive && visibleWork.length === 0 ? (
//                         <SearchEmptyState
//                           invitations={isInvitationSection}
//                           onClear={() => setSearch("")}
//                         />
//                       ) : isInvitationSection ? (
//                         visibleWork.length > 0 ? (
//                           <div className="mt-6 grid gap-3">
//                             {visibleWork.map((project) => (
//                               <InvitationCard
//                                 key={project.id}
//                                 project={project}
//                                 onAccept={() => acceptInvitation(project.id)}
//                                 onDecline={() => declineInvitation(project.id)}
//                               />
//                             ))}
//                           </div>
//                         ) : (
//                           <EmptyCollection
//                             title="No invitations"
//                             description="New project invitations will appear here when a client invites you to join their work."
//                             icon={InboxIcon}
//                           />
//                         )
//                       ) : visibleWork.length > 0 ? (
//                         <ProjectGrid
//                           projects={visibleWork}
//                           view={view}
//                           onProjectUpdated={handleWorkProjectUpdated}
//                         />
//                       ) : (
//                         <EmptyCollection
//                           title={
//                             workFilter === "completed"
//                               ? "No completed work"
//                               : "No active work"
//                           }
//                           description={
//                             workFilter === "completed"
//                               ? "Completed and closed client projects will appear here."
//                               : "Projects you accept from clients will appear here."
//                           }
//                           icon={BriefcaseBusinessIcon}
//                         />
//                       )}
//                     </>
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
//    HEADER
// ========================================================= */

// function WorkspaceHeader() {
//   return (
//     <header className="sticky top-0 z-50 border-b border-border/60 bg-background dark:border-border">
//       <div className="container mx-auto px-4 sm:px-5 md:px-8">
//         <DashboardMainNav />
//       </div>
//     </header>
//   );
// }

// /* =========================================================
//    PROJECT SEARCH
// ========================================================= */

// function ProjectSearch({
//   value,
//   onChange,
//   placeholder,
// }: {
//   value: string;
//   onChange: (value: string) => void;
//   placeholder: string;
// }) {
//   return (
//     <div
//       className={[
//         "flex min-h-10 w-full items-center gap-2.5",
//         "rounded-lg border px-3",
//         "border-border/65 bg-surface-2/40",
//         "transition-[border-color,box-shadow] duration-150",
//         "focus-within:border-ring/35",
//         "focus-within:ring-2 focus-within:ring-ring/10",
//         "dark:border-border dark:bg-surface-2/65",
//         "motion-reduce:transition-none sm:max-w-sm",
//       ].join(" ")}
//     >
//       <SearchIcon
//         size={14}
//         aria-hidden="true"
//         className="shrink-0 text-muted-foreground"
//       />

//       <input
//         type="search"
//         value={value}
//         onChange={(event) => onChange(event.target.value)}
//         onKeyDown={(event) => {
//           if (event.key === "Escape" && value) {
//             event.preventDefault();
//             onChange("");
//           }
//         }}
//         placeholder={placeholder}
//         aria-label={placeholder}
//         autoComplete="off"
//         className={[
//           "h-10 min-w-0 flex-1 bg-transparent",
//           "text-base text-foreground outline-none sm:text-xs",
//           "placeholder:text-muted-foreground/65",
//           "[&::-webkit-search-cancel-button]:appearance-none",
//         ].join(" ")}
//       />

//       {value && (
//         <button
//           type="button"
//           onClick={() => onChange("")}
//           aria-label="Clear project search"
//           className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-muted-foreground hover:text-foreground ${focusStyle}`}
//         >
//           <XIcon size={13} aria-hidden="true" />
//         </button>
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
//       <span
//         className={`mx-auto flex h-10 w-10 items-center justify-center rounded-xl ${softIconSurface}`}
//       >
//         <SparklesIcon size={16} aria-hidden="true" />
//       </span>

//       <p className="mt-6 text-[0.56rem] font-semibold uppercase tracking-[0.17em] text-muted-foreground">
//         Welcome to Allocatr
//       </p>

//       <h1 className="mt-2.5 text-2xl font-semibold leading-[1.12] tracking-[-0.03em] text-foreground/90 sm:text-3xl dark:text-foreground">
//         What would you like to do first, {firstName}?
//       </h1>

//       <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-muted-foreground">
//         Create a project if you already know what needs to be done, or discover
//         Allocats and find the right person first.
//       </p>

//       <div className="mt-8 flex flex-col justify-center gap-2.5 sm:flex-row sm:items-center">
//         <Button
//           asChild
//           className={`group h-10 rounded-lg px-5 text-xs font-semibold shadow-none ${primaryActionButton}`}
//         >
//           <Link to="/projects/new">
//             <PlusIcon size={14} aria-hidden="true" />
//             Create a project
//             <ArrowRightIcon
//               size={12}
//               aria-hidden="true"
//               className="transition-transform duration-200 group-hover:translate-x-0.5 motion-reduce:transform-none"
//             />
//           </Link>
//         </Button>

//         <Button
//           asChild
//           variant="outline"
//           className={`h-10 rounded-lg px-5 text-xs font-semibold shadow-none ${secondaryActionButton}`}
//         >
//           <Link to="/discover">
//             <SearchIcon size={14} aria-hidden="true" />
//             Discover Allocats
//           </Link>
//         </Button>
//       </div>

//       <p className="mt-5 text-[0.66rem] text-muted-foreground/70">
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
//       className={`overflow-hidden rounded-xl border ${elevatedSurface}`}
//     >
//       {/* MAIN ROW */}

//       <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 bg-surface-2/35 px-4 py-5 sm:gap-6 sm:px-6 sm:py-6 lg:px-7 dark:bg-card">
//         <div className="min-w-0">
//           <div className="flex items-center gap-2.5">
//             <span
//               className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${softIconSurface}`}
//             >
//               <BriefcaseBusinessIcon size={13} aria-hidden="true" />
//             </span>

//             <p className="text-[0.55rem] font-semibold uppercase tracking-[0.17em] text-muted-foreground">
//               Workspace
//             </p>
//           </div>

//           <h1 className="mt-3 truncate text-xl font-semibold leading-tight tracking-[-0.03em] text-foreground/90 sm:text-2xl lg:text-[1.75rem] dark:text-foreground">
//             Welcome back,{" "}
//             <span className="text-brand-secondary-highlight dark:text-secondary">
//               {firstName}
//             </span>
//             .
//           </h1>

//           <p className="mt-1.5 hidden max-w-xl text-xs leading-6 text-muted-foreground md:block">
//             {workspaceSection === "projects"
//               ? "Your active, pending and completed projects."
//               : "Your client work, active jobs and invitations."}
//           </p>
//         </div>

//         <div className="flex shrink-0 items-center gap-2">
//           <Button
//             asChild
//             size="icon"
//             className={`group h-9 w-9 rounded-lg shadow-none sm:w-auto sm:px-4 ${primaryActionButton}`}
//           >
//             <Link to="/projects/new" aria-label="New project">
//               <PlusIcon size={13} aria-hidden="true" />

//               <span className="hidden text-xs font-semibold sm:inline">
//                 New project
//               </span>

//               <ArrowRightIcon
//                 size={12}
//                 aria-hidden="true"
//                 className="hidden transition-transform duration-200 group-hover:translate-x-0.5 motion-reduce:transform-none sm:block"
//               />
//             </Link>
//           </Button>

//           <Button
//             asChild
//             variant="outline"
//             size="icon"
//             className={`h-9 w-9 rounded-lg shadow-none sm:w-auto sm:px-4 ${secondaryActionButton}`}
//           >
//             <Link to="/discover" aria-label="Discover Allocats">
//               <SearchIcon size={13} aria-hidden="true" />

//               <span className="hidden text-xs font-semibold sm:inline">
//                 Discover Allocats
//               </span>
//             </Link>
//           </Button>
//         </div>
//       </div>

//       {/* WORKSPACE RAIL */}

//       <div className="border-t border-border/55 bg-surface-3/30 px-3 py-2.5 sm:px-5 dark:border-border dark:bg-surface-2/70">
//         <div className="flex min-w-0 items-center justify-between gap-3 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
//           <div className="shrink-0">
//             {isAllocat ? (
//               <div
//                 role="group"
//                 aria-label="Workspace section"
//                 className="inline-flex items-center rounded-full border border-border/60 bg-surface-2/55 p-1 dark:border-border dark:bg-surface-1"
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
//               <p className="hidden whitespace-nowrap text-[0.54rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground/70 sm:block">
//                 Project overview
//               </p>
//             )}
//           </div>

//           <div
//             role="group"
//             aria-label="Filter by status"
//             className="flex shrink-0 items-center gap-1"
//           >
//             {items.map((item) => (
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
//   const appearance = getMetricAppearance(item.emphasis);

//   return (
//     <button
//       type="button"
//       onClick={item.onClick}
//       aria-pressed={item.active}
//       aria-label={`${item.label}: ${item.value}`}
//       title={item.label}
//       className={[
//         "relative flex h-8 items-center gap-2 rounded-lg px-2.5 text-left",
//         "transition-[background-color,color] duration-150",
//         "motion-reduce:transition-none",
//         focusStyle,
//         item.active
//           ? "bg-surface-1 text-foreground/90 dark:bg-surface-3/65 dark:text-foreground"
//           : "text-muted-foreground hover:bg-surface-2/70 hover:text-foreground/85 dark:hover:bg-surface-3/55 dark:hover:text-foreground",
//       ].join(" ")}
//     >
//       {item.active && (
//         <motion.span
//           layoutId="workspace-active-metric"
//           aria-hidden="true"
//           className={`absolute inset-x-2.5 bottom-0 h-[2px] rounded-full ${appearance.line}`}
//           transition={{
//             type: "spring",
//             stiffness: 500,
//             damping: 38,
//           }}
//         />
//       )}

//       <span className="relative flex shrink-0 items-center">
//         {item.attention && (
//           <span
//             aria-hidden="true"
//             className="absolute -right-1.5 -top-1.5 flex h-1.5 w-1.5"
//           >
//             <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-status-pending opacity-25 motion-reduce:animate-none" />
//             <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-status-pending" />
//           </span>
//         )}

//         <Icon size={11} className={appearance.icon} />
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
//         "text-[0.64rem] font-semibold",
//         "transition-colors duration-200",
//         "motion-reduce:transition-none",
//         focusStyle,
//         active
//           ? "text-brand-secondary-highlight dark:text-secondary"
//           : "text-muted-foreground hover:text-foreground/85 dark:hover:text-foreground",
//       ].join(" ")}
//     >
//       {active && (
//         <motion.span
//           layoutId="workspace-active-tab"
//           aria-hidden="true"
//           className="absolute inset-0 rounded-full border border-brand-secondary-highlight/10 bg-brand-secondary-highlight/[0.08] dark:border-secondary/12 dark:bg-secondary/[0.08]"
//           transition={{
//             type: "spring",
//             stiffness: 500,
//             damping: 38,
//           }}
//         />
//       )}

//       <span className="relative z-10 flex items-center gap-1.5">
//         <span className="relative">
//           {attention && !active && (
//             <span
//               aria-hidden="true"
//               className="absolute -right-1.5 -top-1 flex h-1.5 w-1.5"
//             >
//               <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-status-pending opacity-30 motion-reduce:animate-none" />
//               <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-status-pending" />
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
//                 ? "text-brand-secondary-highlight/65 dark:text-secondary/65"
//                 : attention
//                   ? "text-status-pending-foreground"
//                   : "text-muted-foreground/55",
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
//    SECTION EYEBROW
// ========================================================= */

// function SectionEyebrow({ children }: { children: ReactNode }) {
//   return (
//     <div className="flex items-center gap-2.5">
//       <span aria-hidden="true" className="flex items-center gap-1">
//         <span className="h-1.5 w-5 rounded-full bg-brand-secondary-highlight/80 dark:bg-brand-secondary-highlight" />
//         <span className="h-1.5 w-2 rounded-full bg-secondary/85" />
//       </span>

//       <p className="text-[0.54rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
//         {children}
//       </p>
//     </div>
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

//       <div
//         aria-hidden="true"
//         className="mx-1 h-4 w-px bg-border/70 dark:bg-border"
//       />

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
//     SORT_OPTIONS.find((option) => option.value === value) ?? SORT_OPTIONS[0];

//   return (
//     <DropdownMenu>
//       <DropdownMenuTrigger asChild>
//         <Button
//           type="button"
//           variant="ghost"
//           size="sm"
//           aria-label={`Sort projects: ${currentOption.label}`}
//           className={[
//             "h-9 rounded-lg px-2.5 text-xs font-medium shadow-none",
//             "text-muted-foreground transition-colors",
//             "hover:bg-surface-3/60 hover:text-foreground/90",
//             "data-[state=open]:bg-surface-3/60",
//             "data-[state=open]:text-foreground/90",
//             "dark:hover:bg-surface-3/70",
//             "dark:hover:text-foreground",
//             "dark:data-[state=open]:bg-surface-3/70",
//             "dark:data-[state=open]:text-foreground",
//           ].join(" ")}
//         >
//           <ArrowDownNarrowWideIcon
//             size={14}
//             aria-hidden="true"
//             className="shrink-0"
//           />

//           <span className="hidden sm:inline">Sort by</span>

//           <span className="relative hidden min-w-[76px] overflow-hidden text-left md:block">
//             <AnimatePresence mode="wait" initial={false}>
//               <motion.span
//                 key={value}
//                 initial={{ opacity: 0, y: 4 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 exit={{ opacity: 0, y: -4 }}
//                 transition={{ duration: 0.14 }}
//                 className="block font-semibold text-foreground/80 dark:text-foreground/90"
//               >
//                 {currentOption.label}
//               </motion.span>
//             </AnimatePresence>
//           </span>

//           <span className="sm:hidden">Sort</span>

//           <ChevronDownIcon size={13} aria-hidden="true" className="shrink-0" />
//         </Button>
//       </DropdownMenuTrigger>

//       <DropdownMenuContent
//         align="end"
//         sideOffset={6}
//         collisionPadding={12}
//         className="w-52 rounded-xl border border-border/65 bg-popover p-1.5 text-popover-foreground shadow-none dark:border-border"
//       >
//         {SORT_OPTIONS.map((option) => {
//           const active = option.value === value;

//           return (
//             <DropdownMenuItem
//               key={option.value}
//               onSelect={() => onChange(option.value)}
//               className={[
//                 "rounded-lg px-3 py-2.5 text-xs",
//                 "transition-colors",
//                 "data-[highlighted]:bg-surface-3/60",
//                 "data-[highlighted]:text-foreground",
//                 "dark:data-[highlighted]:bg-surface-3/70",
//                 active
//                   ? "bg-brand-secondary-highlight/[0.07] font-semibold text-foreground dark:bg-secondary/[0.07]"
//                   : "",
//               ].join(" ")}
//             >
//               <ArrowDownNarrowWideIcon
//                 size={13}
//                 aria-hidden="true"
//                 className="text-muted-foreground"
//               />

//               {option.label}

//               {active && (
//                 <CheckCircle2Icon
//                   size={13}
//                   aria-hidden="true"
//                   className="ml-auto text-brand-secondary-highlight dark:text-secondary"
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
//     <div
//       role="group"
//       aria-label="Project layout"
//       className="flex shrink-0 items-center rounded-lg border border-border/60 bg-surface-2/55 p-0.5 dark:border-border dark:bg-surface-2/80"
//     >
//       {[
//         {
//           value: "grid" as const,
//           label: "Grid view",
//           icon: Grid2X2Icon,
//         },
//         {
//           value: "list" as const,
//           label: "List view",
//           icon: LayoutListIcon,
//         },
//       ].map(({ value, label, icon: Icon }) => (
//         <Button
//           key={value}
//           type="button"
//           variant="ghost"
//           size="icon"
//           onClick={() => setView(value)}
//           aria-label={label}
//           aria-pressed={view === value}
//           className={[
//             "h-8 w-8 rounded-md shadow-none",
//             "transition-colors duration-200",
//             view === value
//               ? [
//                   "bg-brand-secondary-highlight/[0.10]",
//                   "text-brand-secondary-highlight",
//                   "hover:bg-brand-secondary-highlight/[0.14]",
//                   "hover:text-brand-secondary-highlight",
//                   "dark:bg-secondary/[0.10] dark:text-secondary",
//                   "dark:hover:bg-secondary/[0.14]",
//                   "dark:hover:text-secondary",
//                 ].join(" ")
//               : [
//                   "text-muted-foreground",
//                   "hover:bg-surface-1/80",
//                   "hover:text-foreground/85",
//                   "dark:hover:bg-surface-3/70",
//                   "dark:hover:text-foreground",
//                 ].join(" "),
//           ].join(" ")}
//         >
//           <Icon size={value === "list" ? 15 : 14} aria-hidden="true" />
//         </Button>
//       ))}
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
//   searchActive,
//   onClearSearch,
//   onProjectUpdated,
// }: {
//   projects: Project[];
//   view: ProjectView;
//   emptyLabel: string;
//   searchActive: boolean;
//   onClearSearch: () => void;
//   onProjectUpdated: (project: Project) => void;
// }) {
//   if (projects.length === 0) {
//     return searchActive ? (
//       <SearchEmptyState onClear={onClearSearch} />
//     ) : (
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
//           ? "mt-6 grid min-w-0 gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4"
//           : "mt-6 flex min-w-0 flex-col gap-3"
//       }
//     >
//       {projects.map((project) =>
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
//   const [responding, setResponding] = useState<"accept" | "decline" | null>(
//     null,
//   );

//   const busyRef = useRef(false);
//   const mountedRef = useRef(false);

//   useEffect(() => {
//     mountedRef.current = true;

//     return () => {
//       mountedRef.current = false;
//     };
//   }, []);

//   async function respond(action: "accept" | "decline") {
//     if (busyRef.current) return;

//     busyRef.current = true;
//     setResponding(action);

//     try {
//       if (action === "accept") {
//         await onAccept();
//       } else {
//         await onDecline();
//       }

//       if (mountedRef.current) {
//         setDetailsOpen(false);
//       }
//     } catch {
//       // The parent reports the failed request.
//       // Keep the invitation available so the user can retry.
//     } finally {
//       busyRef.current = false;

//       if (mountedRef.current) {
//         setResponding(null);
//       }
//     }
//   }

//   return (
//     <>
//       <article className="group relative overflow-hidden rounded-xl border border-border/60 bg-card p-5 transition-[background-color,border-color] duration-200 hover:border-brand-amber/20 hover:bg-surface-2/65 sm:p-6 dark:border-border dark:bg-card dark:hover:border-status-pending/20 dark:hover:bg-surface-2/75">
//         <span
//           aria-hidden="true"
//           className="absolute inset-y-5 left-0 w-[2px] rounded-full bg-status-pending/80"
//         />

//         <div className="grid gap-5 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
//           <div className="min-w-0">
//             <div className="flex flex-wrap items-center gap-3">
//               <span className="inline-flex items-center gap-2 text-[0.56rem] font-semibold uppercase tracking-[0.15em] text-brand-amber dark:text-status-pending-foreground">
//                 <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-amber/10 dark:bg-status-pending/10">
//                   <SendIcon size={11} aria-hidden="true" />
//                 </span>
//                 Project invitation
//               </span>

//               {project.invitedAt && (
//                 <span className="text-[0.58rem] text-muted-foreground/80">
//                   {formatShortDate(project.invitedAt)}
//                 </span>
//               )}
//             </div>

//             <h2 className="mt-4 break-words text-base font-semibold leading-tight tracking-[-0.02em] text-foreground/90 sm:text-lg dark:text-foreground">
//               {project.title}
//             </h2>

//             <p className="mt-2 line-clamp-2 max-w-2xl text-xs leading-6 text-muted-foreground sm:text-sm">
//               {project.description || "No project description was provided."}
//             </p>

//             <button
//               type="button"
//               onClick={() => setDetailsOpen(true)}
//               className={`mt-4 inline-flex items-center gap-2 rounded text-[0.62rem] font-semibold text-brand-secondary-highlight transition-colors hover:text-foreground/85 dark:text-secondary dark:hover:text-foreground ${focusStyle}`}
//             >
//               Review project
//               <ArrowRightIcon size={12} aria-hidden="true" />
//             </button>
//           </div>

//           <div className="flex items-center gap-2 sm:justify-end">
//             <Button
//               type="button"
//               variant="ghost"
//               disabled={responding !== null}
//               onClick={() => void respond("decline")}
//               className="h-9 rounded-lg px-3 text-xs text-muted-foreground shadow-none hover:bg-surface-3/60 hover:text-foreground/90 dark:hover:bg-surface-3/70 dark:hover:text-foreground"
//             >
//               {responding === "decline" ? (
//                 <LoaderCircleIcon
//                   size={15}
//                   aria-hidden="true"
//                   className="animate-spin"
//                 />
//               ) : (
//                 <XIcon size={14} aria-hidden="true" />
//               )}
//               Decline
//             </Button>

//             <Button
//               type="button"
//               disabled={responding !== null}
//               onClick={() => void respond("accept")}
//               className={`h-9 rounded-lg px-4 text-xs font-semibold shadow-none ${primaryActionButton}`}
//             >
//               {responding === "accept" ? (
//                 <LoaderCircleIcon
//                   size={15}
//                   aria-hidden="true"
//                   className="animate-spin"
//                 />
//               ) : (
//                 <CheckCircle2Icon size={14} aria-hidden="true" />
//               )}
//               Accept
//             </Button>
//           </div>
//         </div>
//       </article>

//       <ProjectInvitationDialog
//         project={project}
//         open={detailsOpen}
//         onOpenChange={(nextOpen) => {
//           if (!busyRef.current) setDetailsOpen(nextOpen);
//         }}
//         responding={responding}
//         onAccept={() => respond("accept")}
//         onDecline={() => respond("decline")}
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
//       <DialogContent className="max-h-[90dvh] overflow-y-auto rounded-xl border-border/65 bg-card p-0 text-card-foreground shadow-none sm:max-w-2xl dark:border-border">
//         <DialogHeader className="border-b border-border/60 px-5 pb-5 pt-6 text-left sm:px-8 sm:pb-6 sm:pt-7 dark:border-border">
//           <Badge
//             variant="outline"
//             className="mb-3 w-fit rounded-md border-brand-amber/20 bg-brand-amber/[0.07] text-brand-amber dark:border-status-pending/20 dark:bg-status-pending/[0.08] dark:text-status-pending-foreground"
//           >
//             Project invitation
//           </Badge>

//           <DialogTitle className="break-words pr-6 text-xl font-semibold leading-tight tracking-[-0.025em] text-foreground/90 sm:text-2xl dark:text-foreground">
//             {project.title}
//           </DialogTitle>

//           <DialogDescription className="mt-2 max-w-xl leading-7 text-muted-foreground">
//             Review the project before deciding whether you want to join the
//             work.
//           </DialogDescription>
//         </DialogHeader>

//         <div className="space-y-6 px-5 py-6 sm:space-y-7 sm:px-8 sm:py-7">
//           <section>
//             <p className="text-[0.58rem] font-semibold uppercase tracking-[0.15em] text-muted-foreground">
//               Project description
//             </p>

//             <p className="mt-3 whitespace-pre-line break-words text-sm leading-7 text-foreground/80 dark:text-foreground/90">
//               {project.description || "No project description was provided."}
//             </p>
//           </section>

//           <div className="grid gap-5 border-y border-border/60 py-5 sm:grid-cols-3 dark:border-border">
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

//           <div className="rounded-r-lg border-l-2 border-brand-amber/40 bg-brand-amber/[0.055] py-2 pl-4 pr-3 dark:border-status-pending/35 dark:bg-status-pending/[0.07]">
//             <p className="text-xs leading-6 text-foreground/70 dark:text-foreground/80">
//               Accepting gives you access to the project workspace and its tasks.
//               Until then, you can only review these project details.
//             </p>
//           </div>

//           <div className="flex flex-col-reverse gap-2.5 border-t border-border/60 pt-6 sm:flex-row sm:justify-end dark:border-border">
//             <Button
//               type="button"
//               variant="ghost"
//               disabled={responding !== null}
//               onClick={() => void onDecline()}
//               className="h-10 rounded-lg px-5 text-muted-foreground shadow-none hover:bg-surface-3/60 hover:text-foreground sm:h-11 dark:hover:bg-surface-3/70"
//             >
//               {responding === "decline" ? (
//                 <LoaderCircleIcon
//                   size={16}
//                   aria-hidden="true"
//                   className="animate-spin"
//                 />
//               ) : (
//                 <XIcon size={15} aria-hidden="true" />
//               )}
//               Decline
//             </Button>

//             <Button
//               type="button"
//               disabled={responding !== null}
//               onClick={() => void onAccept()}
//               className={`h-10 rounded-lg px-6 font-semibold shadow-none sm:h-11 ${primaryActionButton}`}
//             >
//               {responding === "accept" ? (
//                 <LoaderCircleIcon
//                   size={16}
//                   aria-hidden="true"
//                   className="animate-spin"
//                 />
//               ) : (
//                 <CheckCircle2Icon size={15} aria-hidden="true" />
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

// function ProjectDetail({ label, value }: { label: string; value: ReactNode }) {
//   return (
//     <div className="min-w-0">
//       <p className="text-[0.56rem] font-semibold uppercase tracking-[0.15em] text-muted-foreground">
//         {label}
//       </p>

//       <div className="mt-1.5 break-words text-sm font-semibold text-foreground/80 dark:text-foreground/90">
//         {value}
//       </div>
//     </div>
//   );
// }

// /* =========================================================
//    WORK SECTION LOADING
// ========================================================= */

// function WorkSectionLoading() {
//   return (
//     <section
//       role="status"
//       className="mt-6 flex min-h-[200px] items-center justify-center rounded-xl border border-border/55 bg-surface-2/60 dark:border-border dark:bg-surface-1"
//     >
//       <div className="flex items-center gap-2.5 text-sm text-muted-foreground">
//         <LoaderCircleIcon
//           size={16}
//           aria-hidden="true"
//           className="animate-spin"
//         />
//         Loading client work
//       </div>
//     </section>
//   );
// }

// /* =========================================================
//    WORK LOAD ERROR
// ========================================================= */

// function WorkLoadError({ onRetry }: { onRetry: () => void }) {
//   return (
//     <section
//       role="alert"
//       className="mt-6 overflow-hidden rounded-xl border border-border/55 bg-surface-2/60 p-6 sm:p-8 dark:border-border dark:bg-surface-1"
//     >
//       <div className="max-w-md">
//         <span
//           className={`flex h-10 w-10 items-center justify-center rounded-lg ${softIconSurface}`}
//         >
//           <RefreshCwIcon size={17} aria-hidden="true" />
//         </span>

//         <h2 className="mt-5 text-lg font-semibold tracking-[-0.02em] text-foreground/90 dark:text-foreground">
//           Your work could not be loaded.
//         </h2>

//         <p className="mt-2 text-sm leading-7 text-muted-foreground">
//           We couldn't retrieve your client projects and invitations.
//         </p>

//         <Button
//           type="button"
//           variant="outline"
//           onClick={onRetry}
//           className={`mt-5 h-9 rounded-lg px-4 text-xs font-semibold shadow-none ${secondaryActionButton}`}
//         >
//           <RefreshCwIcon size={13} aria-hidden="true" />
//           Try again
//         </Button>
//       </div>
//     </section>
//   );
// }

// /* =========================================================
//    SEARCH EMPTY STATE
// ========================================================= */

// function SearchEmptyState({
//   invitations = false,
//   onClear,
// }: {
//   invitations?: boolean;
//   onClear: () => void;
// }) {
//   return (
//     <EmptyCollection
//       title={invitations ? "No matching invitations" : "No matching projects"}
//       description="Try another name, project code or keyword. Search applies to the selected status."
//       icon={SearchIcon}
//       action={
//         <Button
//           type="button"
//           variant="outline"
//           onClick={onClear}
//           className={`mt-5 h-9 rounded-lg px-4 text-xs font-semibold shadow-none ${secondaryActionButton}`}
//         >
//           <XIcon size={13} aria-hidden="true" />
//           Clear search
//         </Button>
//       }
//     />
//   );
// }

// /* =========================================================
//    EMPTY COLLECTION
// ========================================================= */

// function EmptyCollection({
//   title,
//   description,
//   icon: Icon,
//   action,
// }: {
//   title: string;
//   description: string;
//   icon: ComponentType<{ size?: number; className?: string }>;
//   action?: ReactNode;
// }) {
//   return (
//     <section className="mt-6 overflow-hidden rounded-xl border border-border/55 bg-surface-2/60 px-6 py-9 sm:px-8 sm:py-10 dark:border-border dark:bg-surface-1">
//       <div className="max-w-md">
//         <span
//           className={`flex h-10 w-10 items-center justify-center rounded-lg ${softIconSurface}`}
//         >
//           <Icon size={17} />
//         </span>

//         <h2 className="mt-5 text-lg font-semibold tracking-[-0.02em] text-foreground/90 sm:text-xl dark:text-foreground">
//           {title}.
//         </h2>

//         <p className="mt-2 text-sm leading-7 text-muted-foreground">
//           {description}
//         </p>

//         {action}
//       </div>
//     </section>
//   );
// }

// /* =========================================================
//    LOADING
// ========================================================= */

// function WorkspaceLoading() {
//   return (
//     <div className="flex min-h-screen flex-col bg-background text-foreground">
//       <WorkspaceHeader />

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

// function WorkspaceError({ onRetry }: { onRetry: () => Promise<void> }) {
//   return (
//     <div className="flex min-h-screen flex-col bg-background text-foreground">
//       <WorkspaceHeader />

//       <main className="container mx-auto flex flex-1 items-center px-5 py-20 md:px-8">
//         <div className="max-w-lg">
//           <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-destructive/[0.07] text-destructive dark:bg-status-overdue/[0.08] dark:text-status-overdue-foreground">
//             <FolderOpenIcon size={20} aria-hidden="true" />
//           </span>

//           <h1 className="mt-6 text-3xl font-semibold leading-tight tracking-[-0.03em] text-foreground/90 dark:text-foreground">
//             We could not load your workspace.
//           </h1>

//           <p className="mt-3 text-sm leading-7 text-muted-foreground">
//             Something interrupted the connection. Try loading the projects
//             again.
//           </p>

//           <Button
//             type="button"
//             onClick={() => void onRetry()}
//             className={`mt-7 h-11 rounded-lg px-6 font-semibold shadow-none ${primaryActionButton}`}
//           >
//             <RefreshCwIcon size={15} aria-hidden="true" />
//             Try again
//           </Button>
//         </div>
//       </main>
//     </div>
//   );
// }

// /* =========================================================
//    METRIC APPEARANCE
// ========================================================= */

// function getMetricAppearance(emphasis?: SummaryItem["emphasis"]): {
//   icon: string;
//   line: string;
// } {
//   if (emphasis === "warning") {
//     return {
//       icon: "text-brand-amber dark:text-status-pending-foreground",
//       line: "bg-brand-amber dark:bg-status-pending",
//     };
//   }

//   if (emphasis === "success") {
//     return {
//       icon: "text-brand-green dark:text-status-complete-foreground",
//       line: "bg-brand-green dark:bg-status-complete",
//     };
//   }

//   return {
//     icon: "text-brand-secondary-highlight dark:text-status-active-foreground",
//     line: "bg-brand-secondary-highlight dark:bg-status-active",
//   };
// }

// /* =========================================================
//    HELPERS
// ========================================================= */

// function normalizeProjectStatus(status?: string | null) {
//   return String(status ?? "")
//     .trim()
//     .toLowerCase()
//     .replace(/[\s_-]/g, "");
// }

// function matchesProjectSearch(project: Project, query: string) {
//   const normalizedQuery = query.trim().toLowerCase();

//   if (!normalizedQuery) return true;

//   const searchableText = [
//     project.title,
//     project.description ?? "",
//     project.projectCode ?? "",
//     project.category ?? "",
//   ]
//     .join(" ")
//     .toLowerCase();

//   return normalizedQuery
//     .split(/\s+/)
//     .every((term) => searchableText.includes(term));
// }

// function getProjectDateValue(project: Project) {
//   if (!project.createdAt) return 0;

//   const value = new Date(project.createdAt).getTime();

//   return Number.isFinite(value) ? value : 0;
// }

// function sortProjectItems<T extends Project>(
//   items: T[],
//   sort: ProjectSort,
// ): T[] {
//   return [...items].sort((first, second) => {
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
// }

// function formatShortDate(value: string) {
//   const dateOnly = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);

//   const date = dateOnly
//     ? new Date(
//         Number(dateOnly[1]),
//         Number(dateOnly[2]) - 1,
//         Number(dateOnly[3]),
//       )
//     : new Date(value);

//   if (!Number.isFinite(date.getTime())) return "";

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
import { AnimatePresence, MotionConfig, motion } from "framer-motion";
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
type InvitationAction = "accept" | "decline";
type WorkspaceIcon = ComponentType<{
  size?: number;
  className?: string;
}>;
type SummaryItem = {
  label: string;
  value: number;
  icon: WorkspaceIcon;
  emphasis?: "primary" | "warning" | "success";
  active?: boolean;
  attention?: boolean;
  onClick?: () => void;
};
type OwnedProjectGroups = Record<ProjectFilter, Project[]>;
type SortOption = {
  value: ProjectSort;
  label: string;
};
export type WorkProject = Project & {
  projectAllocatStatus: ProjectAllocatStatus;
  invitedAt?: string;
  respondedAt?: string | null;
};
type ProjectSearchGroup =
  | {
      key: string;
      label: string;
      kind: "projects";
      projects: Project[];
    }
  | {
      key: string;
      label: string;
      kind: "invitations";
      projects: WorkProject[];
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
/* =========================================================
   THEME — dashboard accents and semantic status tokens
========================================================= */
const primaryActionButton = [
  "border border-brand-secondary-highlight/20",
  "bg-brand-secondary-highlight text-primary-foreground",
  "hover:bg-brand-secondary-highlight hover:text-primary-foreground",
  "dark:border-secondary/20 dark:bg-secondary",
  "dark:text-secondary-foreground",
  "dark:hover:bg-secondary dark:hover:text-secondary-foreground",
  "transition-opacity duration-150 hover:opacity-90",
  "focus-visible:ring-2 focus-visible:ring-ring/35",
  "motion-reduce:transition-none",
].join(" ");
const secondaryActionButton = [
  "border-border bg-card text-foreground",
  "hover:bg-card hover:text-foreground",
  "transition-opacity duration-150 hover:opacity-75",
  "focus-visible:ring-2 focus-visible:ring-ring/35",
  "motion-reduce:transition-none",
].join(" ");
const elevatedSurface = "border-border/60 bg-card dark:border-border";
const softIconSurface = [
  "bg-surface-3/65 text-brand-secondary-highlight",
  "ring-1 ring-inset ring-border/35",
  "dark:bg-surface-2/80 dark:text-secondary dark:ring-border",
].join(" ");
const focusStyle = [
  "focus-visible:outline-none",
  "focus-visible:ring-2 focus-visible:ring-ring/30",
].join(" ");
/* =========================================================
   PAGE ENTRY
   Remount local project state when the account changes.
========================================================= */
function Projects() {
  const { user } = useAuth();
  if (!user?.userId) return <WorkspaceLoading />;
  return (
    <MotionConfig reducedMotion="user">
      <ProjectsPage key={user.userId + ":" + Boolean(user.isAllocat)} />
    </MotionConfig>
  );
}
/* =========================================================
   PAGE
========================================================= */
function ProjectsPage() {
  const { user } = useAuth();
  const [workspaceSection, setWorkspaceSection] =
    useState<WorkspaceSection>("projects");
  const [view, setView] = useState<ProjectView>("grid");
  const [filter, setFilter] = useState<ProjectFilter>("active");
  const [workFilter, setWorkFilter] = useState<WorkFilter>("active");
  const [sort, setSort] = useState<ProjectSort>("newest");
  const [search, setSearch] = useState("");
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [workProjects, setWorkProjects] = useState<WorkProject[]>([]);
  const [workLoading, setWorkLoading] = useState(Boolean(user?.isAllocat));
  const [workLoaded, setWorkLoaded] = useState(false);
  const [workError, setWorkError] = useState<string | null>(null);
  const mountedRef = useRef(false);
  const projectsRequestRef = useRef(0);
  const workRequestRef = useRef(0);
  const respondingIdsRef = useRef(new Set<string>());
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      projectsRequestRef.current += 1;
      workRequestRef.current += 1;
    };
  }, []);
  /* LOAD OWN PROJECTS */
  const fetchProjects = useCallback(async () => {
    if (!mountedRef.current) return;
    const request = ++projectsRequestRef.current;
    setLoading(true);
    setError(false);
    try {
      const response = await api.get<Project[]>("/projects/mine", {
        withCredentials: true,
      });
      if (!mountedRef.current || request !== projectsRequestRef.current) return;
      if (!Array.isArray(response.data))
        throw new Error("Invalid projects response.");
      setProjects(response.data);
    } catch {
      if (mountedRef.current && request === projectsRequestRef.current)
        setError(true);
    } finally {
      if (mountedRef.current && request === projectsRequestRef.current)
        setLoading(false);
    }
  }, []);
  /* LOAD ALLOCAT WORK */
  const fetchWorkProjects = useCallback(
    async ({
      notifyOnError = false,
    }: {
      notifyOnError?: boolean;
    } = {}) => {
      if (!user?.isAllocat || !mountedRef.current) return;
      const request = ++workRequestRef.current;
      setWorkLoading(true);
      setWorkError(null);
      try {
        const response = await api.get<WorkProject[]>("/allocats/me/projects", {
          withCredentials: true,
        });
        if (!mountedRef.current || request !== workRequestRef.current) return;
        if (!Array.isArray(response.data))
          throw new Error("Invalid client work response.");
        setWorkProjects(response.data);
        setWorkLoaded(true);
      } catch {
        if (!mountedRef.current || request !== workRequestRef.current) return;
        setWorkError("Your client work could not be loaded.");
        if (notifyOnError) toast.error("We could not load your work.");
      } finally {
        if (mountedRef.current && request === workRequestRef.current)
          setWorkLoading(false);
      }
    },
    [user?.isAllocat],
  );
  useEffect(() => {
    void fetchProjects();
  }, [fetchProjects]);
  useEffect(() => {
    if (user?.isAllocat) void fetchWorkProjects();
  }, [user?.isAllocat, fetchWorkProjects]);
  /* PROJECT UPDATES */
  const handleOwnedProjectUpdated = useCallback((updated: Project) => {
    setProjects((current) =>
      current.map((project) =>
        project.id === updated.id ? { ...project, ...updated } : project,
      ),
    );
  }, []);
  const handleWorkProjectUpdated = useCallback((updated: Project) => {
    setWorkProjects((current) =>
      current.map((project) =>
        project.id === updated.id ? { ...project, ...updated } : project,
      ),
    );
  }, []);
  function changeSection(section: WorkspaceSection) {
    setWorkspaceSection(section);
    setSearch("");
  }
  /* OWN PROJECT CLASSIFICATION */
  const ownedProjectGroups = useMemo<OwnedProjectGroups>(() => {
    const groups: OwnedProjectGroups = { active: [], pending: [], closed: [] };
    for (const project of projects) {
      const status = normalizeProjectStatus(project.status);
      if (CLOSED_PROJECT_STATUSES.has(status)) groups.closed.push(project);
      else if (PAUSED_PROJECT_STATUSES.has(status))
        groups.pending.push(project);
      else if (
        status === "active" ||
        status === "completionrequested" ||
        project.hasAcceptedAllocat === true
      )
        groups.active.push(project);
      else groups.pending.push(project);
    }
    return groups;
  }, [projects]);
  const activeProjects = ownedProjectGroups.active;
  const pendingProjects = ownedProjectGroups.pending;
  const closedProjects = ownedProjectGroups.closed;
  const completionRequests = useMemo(
    () =>
      projects.filter(
        (project) =>
          normalizeProjectStatus(project.status) === "completionrequested",
      ),
    [projects],
  );
  const selectedProjects = ownedProjectGroups[filter];
  const visibleProjects = useMemo(
    () => sortProjectItems(selectedProjects, sort),
    [selectedProjects, sort],
  );
  /* ALLOCAT WORK CLASSIFICATION */
  const invitations = useMemo(
    () =>
      workProjects.filter(
        (project) =>
          normalizeProjectStatus(project.projectAllocatStatus) === "invited",
      ),
    [workProjects],
  );
  const activeWork = useMemo(
    () =>
      workProjects.filter(
        (project) =>
          normalizeProjectStatus(project.projectAllocatStatus) === "accepted" &&
          !CLOSED_PROJECT_STATUSES.has(normalizeProjectStatus(project.status)),
      ),
    [workProjects],
  );
  const completedWork = useMemo(
    () =>
      workProjects.filter(
        (project) =>
          normalizeProjectStatus(project.projectAllocatStatus) === "accepted" &&
          CLOSED_PROJECT_STATUSES.has(normalizeProjectStatus(project.status)),
      ),
    [workProjects],
  );
  const selectedWork =
    workFilter === "invitations"
      ? invitations
      : workFilter === "completed"
        ? completedWork
        : activeWork;
  const visibleWork = useMemo(
    () => sortProjectItems(selectedWork, sort),
    [selectedWork, sort],
  );
  /* SEARCH ALL STATUSES WITHIN THE SELECTED WORKSPACE SECTION */
  const searchGroups = useMemo<ProjectSearchGroup[]>(() => {
    if (!search.trim()) return [];
    function findMatches<T extends Project>(items: T[]): T[] {
      return sortProjectItems(
        items.filter((project) => matchesProjectSearch(project, search)),
        sort,
      );
    }
    const groups: ProjectSearchGroup[] =
      workspaceSection === "projects"
        ? [
            {
              key: "owned-active",
              label: "Active",
              kind: "projects",
              projects: findMatches(ownedProjectGroups.active),
            },
            {
              key: "owned-pending",
              label: "Pending",
              kind: "projects",
              projects: findMatches(ownedProjectGroups.pending),
            },
            {
              key: "owned-completed",
              label: "Completed",
              kind: "projects",
              projects: findMatches(ownedProjectGroups.closed),
            },
          ]
        : [
            {
              key: "work-active",
              label: "Active work",
              kind: "projects",
              projects: findMatches(activeWork),
            },
            {
              key: "work-invitations",
              label: "Invitations",
              kind: "invitations",
              projects: findMatches(invitations),
            },
            {
              key: "work-completed",
              label: "Completed work",
              kind: "projects",
              projects: findMatches(completedWork),
            },
          ];
    return groups.filter((group) => group.projects.length > 0);
  }, [
    workspaceSection,
    search,
    sort,
    ownedProjectGroups,
    activeWork,
    invitations,
    completedWork,
  ]);
  /* INVITATION RESPONSES */
  async function respondToInvitation(
    projectId: string,
    action: InvitationAction,
  ): Promise<boolean> {
    if (respondingIdsRef.current.has(projectId)) return false;
    respondingIdsRef.current.add(projectId);
    try {
      await api.patch(
        "/projects/" + projectId + "/allocats/invite/" + action,
        {},
        { withCredentials: true },
      );
    } catch {
      respondingIdsRef.current.delete(projectId);
      if (mountedRef.current) {
        toast.error(
          action === "accept"
            ? "The invitation could not be accepted."
            : "The invitation could not be declined.",
        );
      }
      return false;
    }
    respondingIdsRef.current.delete(projectId);
    if (!mountedRef.current) return false;
    // Invalidate reads started before this mutation so they cannot restore
    // an invitation that has already been accepted or declined.
    workRequestRef.current += 1;
    if (action === "accept") {
      setWorkProjects((current) =>
        current.map((project) =>
          project.id === projectId
            ? {
                ...project,
                projectAllocatStatus: "Accepted",
                respondedAt: new Date().toISOString(),
              }
            : project,
        ),
      );
      toast.success("Project invitation accepted.");
    } else {
      setWorkProjects((current) =>
        current.filter((project) => project.id !== projectId),
      );
      toast.success("Project invitation declined.");
    }
    void fetchWorkProjects();
    return true;
  }
  /* PAGE STATE */
  if (loading) return <WorkspaceLoading />;
  if (error) return <WorkspaceError onRetry={fetchProjects} />;
  const firstName = user?.fullName?.trim().split(/\s+/)[0] || "there";
  const showNewClientState = projects.length === 0 && !user?.isAllocat;
  const isWorkSection = workspaceSection === "work";
  const isInvitationSection = isWorkSection && workFilter === "invitations";
  const searchActive = Boolean(search.trim());
  const workCount =
    invitations.length + activeWork.length + completedWork.length;
  const currentCount = isWorkSection ? workCount : projects.length;
  const visibleCount = searchGroups.reduce(
    (total, group) => total + group.projects.length,
    0,
  );
  const summaryItems: SummaryItem[] = !isWorkSection
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
  const sectionTitle = !isWorkSection
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
  const sectionDescription = !isWorkSection
    ? filter === "pending"
      ? "Projects waiting for an Allocat or the next step."
      : filter === "closed"
        ? "Your completed and closed projects."
        : "The projects currently moving through your workspace."
    : workFilter === "invitations"
      ? "Projects clients have invited you to join."
      : workFilter === "completed"
        ? "Your completed and closed client projects."
        : "The client work currently on your plate.";
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <WorkspaceHeader />

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
              onSectionChange={changeSection}
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
                    {isWorkSection ? "Client work" : "Your workspace"}
                  </SectionEyebrow>
                  <h2 className="mt-3 text-xl font-semibold tracking-[-0.025em] text-foreground/90 sm:text-2xl dark:text-foreground">
                    {sectionTitle}
                  </h2>
                  <p className="mt-1.5 hidden max-w-2xl text-xs leading-6 text-muted-foreground sm:block sm:text-sm">
                    {sectionDescription}
                  </p>
                </div>

                {(!isInvitationSection || searchActive) && (
                  <ProjectControls
                    sort={sort}
                    setSort={setSort}
                    view={view}
                    setView={setView}
                  />
                )}
              </div>

              <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
                <ProjectSearch
                  value={search}
                  onChange={setSearch}
                  placeholder={
                    isWorkSection
                      ? "Search all client work"
                      : "Search all projects"
                  }
                />
                {searchActive && (!isWorkSection || workLoaded) && (
                  <p
                    role="status"
                    aria-live="polite"
                    aria-atomic="true"
                    className="text-[11px] text-muted-foreground"
                  >
                    {visibleCount} of {currentCount}{" "}
                    {isWorkSection ? "client projects" : "projects"} found
                    across all statuses
                  </p>
                )}
              </div>

              {!isWorkSection &&
                (searchActive ? (
                  <ProjectSearchResults
                    groups={searchGroups}
                    view={view}
                    onClearSearch={() => setSearch("")}
                    onProjectUpdated={handleOwnedProjectUpdated}
                    onRespond={respondToInvitation}
                  />
                ) : (
                  <ProjectResults
                    projects={visibleProjects}
                    view={view}
                    emptyLabel={filter === "closed" ? "completed" : filter}
                    onProjectUpdated={handleOwnedProjectUpdated}
                  />
                ))}

              {isWorkSection && user?.isAllocat && (
                <>
                  {workLoading && !workLoaded ? (
                    <WorkSectionLoading />
                  ) : workError && !workLoaded ? (
                    <WorkLoadError
                      onRetry={() =>
                        void fetchWorkProjects({ notifyOnError: true })
                      }
                    />
                  ) : (
                    <>
                      {workError && workLoaded && (
                        <div
                          role="alert"
                          className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border/60 bg-surface-2/40 px-4 py-3 dark:border-border"
                        >
                          <p className="text-xs leading-5 text-muted-foreground">
                            Your work could not be refreshed. Your last loaded
                            projects are still shown.
                          </p>
                          <button
                            type="button"
                            disabled={workLoading}
                            onClick={() =>
                              void fetchWorkProjects({ notifyOnError: true })
                            }
                            className={
                              "rounded text-xs font-medium text-brand-secondary-highlight disabled:opacity-50 dark:text-secondary " +
                              focusStyle
                            }
                          >
                            Try again
                          </button>
                        </div>
                      )}

                      {searchActive ? (
                        <ProjectSearchResults
                          groups={searchGroups}
                          view={view}
                          onClearSearch={() => setSearch("")}
                          onProjectUpdated={handleWorkProjectUpdated}
                          onRespond={respondToInvitation}
                        />
                      ) : isInvitationSection ? (
                        visibleWork.length > 0 ? (
                          <div className="mt-6 grid gap-3">
                            {visibleWork.map((project) => (
                              <InvitationCard
                                key={project.id}
                                project={project}
                                onRespond={(action) =>
                                  respondToInvitation(project.id, action)
                                }
                              />
                            ))}
                          </div>
                        ) : (
                          <EmptyCollection
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
                        <EmptyCollection
                          title={
                            workFilter === "completed"
                              ? "No completed work"
                              : "No active work"
                          }
                          description={
                            workFilter === "completed"
                              ? "Completed and closed client projects will appear here."
                              : "Projects you accept from clients will appear here."
                          }
                          icon={BriefcaseBusinessIcon}
                        />
                      )}
                    </>
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
   HEADER
========================================================= */
function WorkspaceHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background dark:border-border">
      <div className="container mx-auto px-4 sm:px-5 md:px-8">
        <DashboardMainNav />
      </div>
    </header>
  );
}
/* =========================================================
   PROJECT SEARCH
========================================================= */
function ProjectSearch({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}) {
  return (
    <div className="flex min-h-10 w-full items-center gap-2.5 rounded-lg border border-border/65 bg-surface-2/40 px-3 transition-[border-color,box-shadow] duration-150 focus-within:border-ring/35 focus-within:ring-2 focus-within:ring-ring/10 motion-reduce:transition-none sm:max-w-sm dark:border-border dark:bg-surface-2/65">
      <SearchIcon
        size={14}
        aria-hidden="true"
        className="shrink-0 text-muted-foreground"
      />
      <input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Escape" && value) {
            event.preventDefault();
            onChange("");
          }
        }}
        placeholder={placeholder}
        aria-label={placeholder}
        autoComplete="off"
        className="h-10 min-w-0 flex-1 bg-transparent text-base text-foreground outline-none placeholder:text-muted-foreground/65 sm:text-xs [&::-webkit-search-cancel-button]:appearance-none"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          aria-label="Clear project search"
          className={
            "flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-muted-foreground hover:text-foreground " +
            focusStyle
          }
        >
          <XIcon size={13} aria-hidden="true" />
        </button>
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
        className={
          "mx-auto flex h-10 w-10 items-center justify-center rounded-xl " +
          softIconSurface
        }
      >
        <SparklesIcon size={16} aria-hidden="true" />
      </span>
      <p className="mt-6 text-[0.56rem] font-semibold uppercase tracking-[0.17em] text-muted-foreground">
        Welcome to Allocatr
      </p>
      <h1 className="mt-2.5 text-2xl font-semibold leading-[1.12] tracking-[-0.03em] text-foreground/90 sm:text-3xl dark:text-foreground">
        What would you like to do first, {firstName}?
      </h1>
      <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-muted-foreground">
        Create a project if you already know what needs to be done, or discover
        Allocats and find the right person first.
      </p>
      <div className="mt-8 flex flex-col justify-center gap-2.5 sm:flex-row sm:items-center">
        <Button
          asChild
          className={
            "group h-10 rounded-lg px-5 text-xs font-semibold shadow-none " +
            primaryActionButton
          }
        >
          <Link to="/projects/new">
            <PlusIcon size={14} aria-hidden="true" />
            Create a project
            <ArrowRightIcon
              size={12}
              aria-hidden="true"
              className="transition-transform duration-200 group-hover:translate-x-0.5 motion-reduce:transform-none"
            />
          </Link>
        </Button>
        <Button
          asChild
          variant="outline"
          className={
            "h-10 rounded-lg px-5 text-xs font-semibold shadow-none " +
            secondaryActionButton
          }
        >
          <Link to="/discover">
            <SearchIcon size={14} aria-hidden="true" />
            Discover Allocats
          </Link>
        </Button>
      </div>
      <p className="mt-5 text-[0.66rem] text-muted-foreground/70">
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
      className={"overflow-hidden rounded-xl border " + elevatedSurface}
    >
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 bg-surface-2/35 px-4 py-5 sm:gap-6 sm:px-6 sm:py-6 lg:px-7 dark:bg-card">
        <div className="min-w-0">
          <div className="flex items-center gap-2.5">
            <span
              className={
                "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg " +
                softIconSurface
              }
            >
              <BriefcaseBusinessIcon size={13} aria-hidden="true" />
            </span>
            <p className="text-[0.55rem] font-semibold uppercase tracking-[0.17em] text-muted-foreground">
              Workspace
            </p>
          </div>
          <h1 className="mt-3 truncate text-xl font-semibold leading-tight tracking-[-0.03em] text-foreground/90 sm:text-2xl lg:text-[1.75rem] dark:text-foreground">
            Welcome back,{" "}
            <span className="text-brand-secondary-highlight dark:text-secondary">
              {firstName}
            </span>
            .
          </h1>
          <p className="mt-1.5 hidden max-w-xl text-xs leading-6 text-muted-foreground md:block">
            {workspaceSection === "projects"
              ? "Your active, pending and completed projects."
              : "Your client work, active jobs and invitations."}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <Button
            asChild
            size="icon"
            className={
              "group h-9 w-9 rounded-lg shadow-none sm:w-auto sm:px-4 " +
              primaryActionButton
            }
          >
            <Link to="/projects/new" aria-label="New project">
              <PlusIcon size={13} aria-hidden="true" />
              <span className="hidden text-xs font-semibold sm:inline">
                New project
              </span>
              <ArrowRightIcon
                size={12}
                aria-hidden="true"
                className="hidden transition-transform duration-200 group-hover:translate-x-0.5 motion-reduce:transform-none sm:block"
              />
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            size="icon"
            className={
              "h-9 w-9 rounded-lg shadow-none sm:w-auto sm:px-4 " +
              secondaryActionButton
            }
          >
            <Link to="/discover" aria-label="Discover Allocats">
              <SearchIcon size={13} aria-hidden="true" />
              <span className="hidden text-xs font-semibold sm:inline">
                Discover Allocats
              </span>
            </Link>
          </Button>
        </div>
      </div>

      <div className="border-t border-border/55 bg-surface-3/30 px-3 py-2.5 sm:px-5 dark:border-border dark:bg-surface-2/70">
        <div className="flex min-w-0 items-center justify-between gap-3 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="shrink-0">
            {isAllocat ? (
              <div
                role="group"
                aria-label="Workspace section"
                className="inline-flex items-center rounded-full border border-border/60 bg-surface-2/55 p-1 dark:border-border dark:bg-surface-1"
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
              <p className="hidden whitespace-nowrap text-[0.54rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground/70 sm:block">
                Project overview
              </p>
            )}
          </div>
          <div
            role="group"
            aria-label="Filter by status"
            className="flex shrink-0 items-center gap-1"
          >
            {items.map((item) => (
              <WorkspaceMetric key={item.label} item={item} />
            ))}
          </div>
        </div>
      </div>
    </motion.section>
  );
}
/* =========================================================
   WORKSPACE METRIC AND TAB
========================================================= */
function WorkspaceMetric({ item }: { item: SummaryItem }) {
  const Icon = item.icon;
  const appearance = getMetricAppearance(item.emphasis);
  return (
    <button
      type="button"
      onClick={item.onClick}
      aria-pressed={item.active}
      aria-label={item.label + ": " + item.value}
      title={item.label}
      className={[
        "relative flex h-8 items-center gap-2 rounded-lg px-2.5 text-left",
        "transition-[background-color,color] duration-150 motion-reduce:transition-none",
        focusStyle,
        item.active
          ? "bg-surface-1 text-foreground/90 dark:bg-surface-3/65 dark:text-foreground"
          : "text-muted-foreground hover:bg-surface-2/70 hover:text-foreground/85 dark:hover:bg-surface-3/55 dark:hover:text-foreground",
      ].join(" ")}
    >
      {item.active && (
        <motion.span
          layoutId="workspace-active-metric"
          aria-hidden="true"
          className={
            "absolute inset-x-2.5 bottom-0 h-[2px] rounded-full " +
            appearance.line
          }
          transition={{ type: "spring", stiffness: 500, damping: 38 }}
        />
      )}
      <span className="relative flex shrink-0 items-center">
        {item.attention && <AttentionDot className="-right-1.5 -top-1.5" />}
        <Icon size={11} className={appearance.icon} />
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
  icon: WorkspaceIcon;
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
        "relative flex h-8 shrink-0 items-center gap-1.5 rounded-full px-3.5 text-[0.64rem] font-semibold",
        "transition-colors duration-200 motion-reduce:transition-none",
        focusStyle,
        active
          ? "text-brand-secondary-highlight dark:text-secondary"
          : "text-muted-foreground hover:text-foreground/85 dark:hover:text-foreground",
      ].join(" ")}
    >
      {active && (
        <motion.span
          layoutId="workspace-active-tab"
          aria-hidden="true"
          className="absolute inset-0 rounded-full border border-brand-secondary-highlight/10 bg-brand-secondary-highlight/[0.08] dark:border-secondary/12 dark:bg-secondary/[0.08]"
          transition={{ type: "spring", stiffness: 500, damping: 38 }}
        />
      )}
      <span className="relative z-10 flex items-center gap-1.5">
        <span className="relative">
          {attention && !active && (
            <AttentionDot className="-right-1.5 -top-1" />
          )}
          <Icon size={11} />
        </span>
        {label}
        {typeof count === "number" && count > 0 && (
          <span
            className={
              "text-[0.54rem] font-semibold tabular-nums " +
              (active
                ? "text-brand-secondary-highlight/65 dark:text-secondary/65"
                : attention
                  ? "text-status-pending-foreground"
                  : "text-muted-foreground/55")
            }
          >
            {count}
          </span>
        )}
      </span>
    </button>
  );
}
function AttentionDot({ className }: { className: string }) {
  return (
    <span
      aria-hidden="true"
      className={"absolute flex h-1.5 w-1.5 " + className}
    >
      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-status-pending opacity-25 motion-reduce:animate-none" />
      <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-status-pending" />
    </span>
  );
}
function SectionEyebrow({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-center gap-2.5">
      <span aria-hidden="true" className="flex items-center gap-1">
        <span className="h-1.5 w-5 rounded-full bg-brand-secondary-highlight/80 dark:bg-secondary" />
        <span className="h-1.5 w-2 rounded-full bg-brand-secondary-highlight/30 dark:bg-secondary/35" />
      </span>
      <p className="text-[0.54rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
        {children}
      </p>
    </div>
  );
}
/* =========================================================
   SORT AND VIEW CONTROLS
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
      <div
        aria-hidden="true"
        className="mx-1 h-4 w-px bg-border/70 dark:bg-border"
      />
      <ViewControls view={view} setView={setView} />
    </div>
  );
}
function SortControl({
  value,
  onChange,
}: {
  value: ProjectSort;
  onChange: (value: ProjectSort) => void;
}) {
  const currentOption =
    SORT_OPTIONS.find((option) => option.value === value) ?? SORT_OPTIONS[0];
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          aria-label={"Sort projects: " + currentOption.label}
          className="h-9 rounded-lg px-2.5 text-xs font-medium text-muted-foreground shadow-none transition-colors hover:bg-surface-3/60 hover:text-foreground/90 data-[state=open]:bg-surface-3/60 data-[state=open]:text-foreground/90 dark:hover:bg-surface-3/70 dark:hover:text-foreground dark:data-[state=open]:bg-surface-3/70 dark:data-[state=open]:text-foreground"
        >
          <ArrowDownNarrowWideIcon
            size={14}
            aria-hidden="true"
            className="shrink-0"
          />
          <span className="hidden sm:inline">Sort by</span>
          <span className="relative hidden min-w-[76px] overflow-hidden text-left md:block">
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={value}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.14 }}
                className="block font-semibold text-foreground/80 dark:text-foreground/90"
              >
                {currentOption.label}
              </motion.span>
            </AnimatePresence>
          </span>
          <span className="sm:hidden">Sort</span>
          <ChevronDownIcon size={13} aria-hidden="true" className="shrink-0" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        sideOffset={6}
        collisionPadding={12}
        className="w-52 rounded-xl border border-border bg-popover p-1.5 text-popover-foreground shadow-none"
      >
        {SORT_OPTIONS.map((option) => {
          const active = option.value === value;
          return (
            <DropdownMenuItem
              key={option.value}
              onSelect={() => onChange(option.value)}
              className={[
                "rounded-lg px-3 py-2.5 text-xs transition-colors",
                "data-[highlighted]:bg-surface-3/65 data-[highlighted]:text-foreground",
                active
                  ? "bg-brand-secondary-highlight/[0.07] font-semibold text-foreground dark:bg-secondary/[0.07]"
                  : "",
              ].join(" ")}
            >
              <ArrowDownNarrowWideIcon
                size={13}
                aria-hidden="true"
                className="text-muted-foreground"
              />
              {option.label}
              {active && (
                <CheckCircle2Icon
                  size={13}
                  aria-hidden="true"
                  className="ml-auto text-brand-secondary-highlight dark:text-secondary"
                />
              )}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
function ViewControls({
  view,
  setView,
}: {
  view: ProjectView;
  setView: (value: ProjectView) => void;
}) {
  return (
    <div
      role="group"
      aria-label="Project layout"
      className="flex shrink-0 items-center rounded-lg border border-border/60 bg-surface-2/55 p-0.5 dark:border-border dark:bg-surface-2/80"
    >
      {[
        { value: "grid" as const, label: "Grid view", icon: Grid2X2Icon },
        { value: "list" as const, label: "List view", icon: LayoutListIcon },
      ].map(({ value, label, icon: Icon }) => (
        <Button
          key={value}
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => setView(value)}
          aria-label={label}
          aria-pressed={view === value}
          className={[
            "h-8 w-8 rounded-md shadow-none transition-colors duration-200",
            view === value
              ? "bg-brand-secondary-highlight/[0.10] text-brand-secondary-highlight hover:bg-brand-secondary-highlight/[0.14] hover:text-brand-secondary-highlight dark:bg-secondary/[0.10] dark:text-secondary dark:hover:bg-secondary/[0.14] dark:hover:text-secondary"
              : "text-muted-foreground hover:bg-surface-1/80 hover:text-foreground/85 dark:hover:bg-surface-3/70 dark:hover:text-foreground",
          ].join(" ")}
        >
          <Icon size={value === "list" ? 15 : 14} aria-hidden="true" />
        </Button>
      ))}
    </div>
  );
}
/* =========================================================
   PROJECT RESULTS
========================================================= */
function ProjectSearchResults({
  groups,
  view,
  onClearSearch,
  onProjectUpdated,
  onRespond,
}: {
  groups: ProjectSearchGroup[];
  view: ProjectView;
  onClearSearch: () => void;
  onProjectUpdated: (project: Project) => void;
  onRespond: (projectId: string, action: InvitationAction) => Promise<boolean>;
}) {
  if (groups.length === 0) return <SearchEmptyState onClear={onClearSearch} />;
  return (
    <div className="mt-6 space-y-8">
      {groups.map((group) => (
        <section
          key={group.key}
          aria-label={"Search results in " + group.label}
        >
          <div className="flex items-center gap-3">
            <h3 className="shrink-0 text-xs font-medium text-muted-foreground">
              Found in{" "}
              <span className="font-semibold text-foreground/85">
                {group.label}
              </span>
            </h3>
            <span className="shrink-0 rounded-md border border-border/60 bg-surface-2/45 px-1.5 py-0.5 text-[10px] tabular-nums text-muted-foreground dark:border-border">
              {group.projects.length}
            </span>
            <span
              aria-hidden="true"
              className="h-px min-w-0 flex-1 bg-border/60"
            />
          </div>
          {group.kind === "invitations" ? (
            <div className="mt-4 grid gap-3">
              {group.projects.map((project) => (
                <InvitationCard
                  key={project.id}
                  project={project}
                  onRespond={(action) => onRespond(project.id, action)}
                />
              ))}
            </div>
          ) : (
            <ProjectGrid
              projects={group.projects}
              view={view}
              onProjectUpdated={onProjectUpdated}
              compactSpacing
            />
          )}
        </section>
      ))}
    </div>
  );
}
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
  if (projects.length === 0)
    return (
      <EmptyCollection
        title={"No " + emptyLabel + " projects"}
        description="Projects matching this status will appear here."
        icon={FolderOpenIcon}
      />
    );
  return (
    <ProjectGrid
      projects={projects}
      view={view}
      onProjectUpdated={onProjectUpdated}
    />
  );
}
function ProjectGrid<T extends Project>({
  projects,
  view,
  onProjectUpdated,
  compactSpacing = false,
}: {
  projects: T[];
  view: ProjectView;
  onProjectUpdated?: (project: Project) => void;
  compactSpacing?: boolean;
}) {
  return (
    <div
      className={[
        compactSpacing ? "mt-4" : "mt-6",
        view === "grid"
          ? "grid min-w-0 gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4"
          : "flex min-w-0 flex-col gap-3",
      ].join(" ")}
    >
      {projects.map((project) =>
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
  onRespond,
}: {
  project: WorkProject;
  onRespond: (action: InvitationAction) => Promise<boolean>;
}) {
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [responding, setResponding] = useState<InvitationAction | null>(null);
  const busyRef = useRef(false);
  const mountedRef = useRef(false);
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);
  async function respond(action: InvitationAction) {
    if (busyRef.current) return;
    busyRef.current = true;
    setResponding(action);
    try {
      const saved = await onRespond(action);
      if (saved && mountedRef.current) setDetailsOpen(false);
    } finally {
      busyRef.current = false;
      if (mountedRef.current) setResponding(null);
    }
  }
  return (
    <>
      <article className="group relative overflow-hidden rounded-xl border border-border/60 bg-card p-5 transition-[background-color,border-color] duration-200 hover:border-status-pending/20 hover:bg-surface-2/65 sm:p-6 dark:border-border dark:hover:border-status-pending/20 dark:hover:bg-surface-2/75">
        <span
          aria-hidden="true"
          className="absolute inset-y-5 left-0 w-[2px] rounded-full bg-status-pending/80"
        />
        <div className="grid gap-5 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-2 text-[0.56rem] font-semibold uppercase tracking-[0.15em] text-status-pending-foreground">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-status-pending/10">
                  <SendIcon size={11} aria-hidden="true" />
                </span>
                Project invitation
              </span>
              {project.invitedAt && (
                <span className="text-[0.58rem] text-muted-foreground/80">
                  {formatShortDate(project.invitedAt)}
                </span>
              )}
            </div>
            <h2 className="mt-4 break-words text-base font-semibold leading-tight tracking-[-0.02em] text-foreground/90 sm:text-lg dark:text-foreground">
              {project.title}
            </h2>
            <p className="mt-2 line-clamp-2 max-w-2xl text-xs leading-6 text-muted-foreground sm:text-sm">
              {project.description || "No project description was provided."}
            </p>
            <button
              type="button"
              onClick={() => setDetailsOpen(true)}
              className={
                "mt-4 inline-flex items-center gap-2 rounded text-[0.62rem] font-semibold text-brand-secondary-highlight transition-opacity hover:opacity-75 dark:text-secondary " +
                focusStyle
              }
            >
              Review project
              <ArrowRightIcon size={12} aria-hidden="true" />
            </button>
          </div>
          <InvitationActions
            responding={responding}
            onAccept={() => respond("accept")}
            onDecline={() => respond("decline")}
          />
        </div>
      </article>
      <ProjectInvitationDialog
        project={project}
        open={detailsOpen}
        onOpenChange={(nextOpen) => {
          if (!busyRef.current) setDetailsOpen(nextOpen);
        }}
        responding={responding}
        onAccept={() => respond("accept")}
        onDecline={() => respond("decline")}
      />
    </>
  );
}
function InvitationActions({
  responding,
  onAccept,
  onDecline,
  dialog = false,
}: {
  responding: InvitationAction | null;
  onAccept: () => Promise<void>;
  onDecline: () => Promise<void>;
  dialog?: boolean;
}) {
  return (
    <div
      className={
        dialog
          ? "flex flex-col-reverse gap-2.5 sm:flex-row sm:justify-end"
          : "flex items-center gap-2 sm:justify-end"
      }
    >
      <Button
        type="button"
        variant="ghost"
        disabled={responding !== null}
        onClick={() => void onDecline()}
        className={
          (dialog ? "h-10 px-5 sm:h-11 " : "h-9 px-3 text-xs ") +
          "rounded-lg text-muted-foreground shadow-none hover:bg-surface-3/60 hover:text-foreground dark:hover:bg-surface-3/70"
        }
      >
        {responding === "decline" ? (
          <LoaderCircleIcon
            size={15}
            aria-hidden="true"
            className="animate-spin"
          />
        ) : (
          <XIcon size={14} aria-hidden="true" />
        )}
        Decline
      </Button>
      <Button
        type="button"
        disabled={responding !== null}
        onClick={() => void onAccept()}
        className={
          (dialog ? "h-10 px-6 sm:h-11 " : "h-9 px-4 text-xs ") +
          "rounded-lg font-semibold shadow-none " +
          primaryActionButton
        }
      >
        {responding === "accept" ? (
          <LoaderCircleIcon
            size={15}
            aria-hidden="true"
            className="animate-spin"
          />
        ) : (
          <CheckCircle2Icon size={14} aria-hidden="true" />
        )}
        {dialog ? "Accept project" : "Accept"}
      </Button>
    </div>
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
  responding: InvitationAction | null;
  onAccept: () => Promise<void>;
  onDecline: () => Promise<void>;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90dvh] overflow-y-auto rounded-xl border-border/65 bg-card p-0 text-card-foreground shadow-none sm:max-w-2xl dark:border-border">
        <DialogHeader className="border-b border-border/60 px-5 pb-5 pt-6 text-left sm:px-8 sm:pb-6 sm:pt-7 dark:border-border">
          <Badge
            variant="outline"
            className="mb-3 w-fit rounded-md border-status-pending/20 bg-status-pending/[0.07] text-status-pending-foreground"
          >
            Project invitation
          </Badge>
          <DialogTitle className="break-words pr-6 text-xl font-semibold leading-tight tracking-[-0.025em] text-foreground/90 sm:text-2xl dark:text-foreground">
            {project.title}
          </DialogTitle>
          <DialogDescription className="mt-2 max-w-xl leading-7 text-muted-foreground">
            Review the project before deciding whether you want to join the
            work.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6 px-5 py-6 sm:space-y-7 sm:px-8 sm:py-7">
          <section>
            <p className="text-[0.58rem] font-semibold uppercase tracking-[0.15em] text-muted-foreground">
              Project description
            </p>
            <p className="mt-3 whitespace-pre-line break-words text-sm leading-7 text-foreground/80 dark:text-foreground/90">
              {project.description || "No project description was provided."}
            </p>
          </section>
          <div className="grid gap-5 border-y border-border/60 py-5 sm:grid-cols-3 dark:border-border">
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
          <div className="rounded-r-lg border-l-2 border-status-pending/40 bg-status-pending/[0.055] py-2 pl-4 pr-3">
            <p className="text-xs leading-6 text-foreground/70 dark:text-foreground/80">
              Accepting gives you access to the project workspace and its tasks.
              Until then, you can only review these project details.
            </p>
          </div>
          <div className="border-t border-border/60 pt-6 dark:border-border">
            <InvitationActions
              responding={responding}
              onAccept={onAccept}
              onDecline={onDecline}
              dialog
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
function ProjectDetail({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="min-w-0">
      <p className="text-[0.56rem] font-semibold uppercase tracking-[0.15em] text-muted-foreground">
        {label}
      </p>
      <div className="mt-1.5 break-words text-sm font-semibold text-foreground/80 dark:text-foreground/90">
        {value}
      </div>
    </div>
  );
}
/* =========================================================
   LOADING, ERROR AND EMPTY STATES
========================================================= */
function WorkSectionLoading() {
  return (
    <section
      role="status"
      className="mt-6 flex min-h-[200px] items-center justify-center rounded-xl border border-border/55 bg-surface-2/60 dark:border-border dark:bg-surface-1"
    >
      <div className="flex items-center gap-2.5 text-sm text-muted-foreground">
        <LoaderCircleIcon
          size={16}
          aria-hidden="true"
          className="animate-spin"
        />
        Loading client work
      </div>
    </section>
  );
}
function WorkLoadError({ onRetry }: { onRetry: () => void }) {
  return (
    <section
      role="alert"
      className="mt-6 overflow-hidden rounded-xl border border-border/55 bg-surface-2/60 p-6 sm:p-8 dark:border-border dark:bg-surface-1"
    >
      <div className="max-w-md">
        <span
          className={
            "flex h-10 w-10 items-center justify-center rounded-lg " +
            softIconSurface
          }
        >
          <RefreshCwIcon size={17} aria-hidden="true" />
        </span>
        <h2 className="mt-5 text-lg font-semibold tracking-[-0.02em] text-foreground/90 dark:text-foreground">
          Your work could not be loaded.
        </h2>
        <p className="mt-2 text-sm leading-7 text-muted-foreground">
          We couldn't retrieve your client projects and invitations.
        </p>
        <Button
          type="button"
          variant="outline"
          onClick={onRetry}
          className={
            "mt-5 h-9 rounded-lg px-4 text-xs font-semibold shadow-none " +
            secondaryActionButton
          }
        >
          <RefreshCwIcon size={13} aria-hidden="true" />
          Try again
        </Button>
      </div>
    </section>
  );
}
function SearchEmptyState({ onClear }: { onClear: () => void }) {
  return (
    <EmptyCollection
      title="No matching projects"
      description="No projects matched across any status. Try another name, project code or keyword."
      icon={SearchIcon}
      action={
        <Button
          type="button"
          variant="outline"
          onClick={onClear}
          className={
            "mt-5 h-9 rounded-lg px-4 text-xs font-semibold shadow-none " +
            secondaryActionButton
          }
        >
          <XIcon size={13} aria-hidden="true" />
          Clear search
        </Button>
      }
    />
  );
}
function EmptyCollection({
  title,
  description,
  icon: Icon,
  action,
}: {
  title: string;
  description: string;
  icon: WorkspaceIcon;
  action?: ReactNode;
}) {
  return (
    <section className="mt-6 overflow-hidden rounded-xl border border-border/55 bg-surface-2/60 px-6 py-9 sm:px-8 sm:py-10 dark:border-border dark:bg-surface-1">
      <div className="max-w-md">
        <span
          className={
            "flex h-10 w-10 items-center justify-center rounded-lg " +
            softIconSurface
          }
        >
          <Icon size={17} />
        </span>
        <h2 className="mt-5 text-lg font-semibold tracking-[-0.02em] text-foreground/90 sm:text-xl dark:text-foreground">
          {title}.
        </h2>
        <p className="mt-2 text-sm leading-7 text-muted-foreground">
          {description}
        </p>
        {action}
      </div>
    </section>
  );
}
function WorkspaceLoading() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <WorkspaceHeader />
      <main className="container mx-auto flex flex-1 px-5 md:px-8">
        <LoadingState
          label="Loading your workspace"
          className="min-h-[calc(100vh-5rem)]"
        />
      </main>
    </div>
  );
}
function WorkspaceError({ onRetry }: { onRetry: () => Promise<void> }) {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <WorkspaceHeader />
      <main className="container mx-auto flex flex-1 items-center px-5 py-20 md:px-8">
        <div className="max-w-lg">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-status-overdue/[0.08] text-status-overdue-foreground">
            <FolderOpenIcon size={20} aria-hidden="true" />
          </span>
          <h1 className="mt-6 text-3xl font-semibold leading-tight tracking-[-0.03em] text-foreground/90 dark:text-foreground">
            We could not load your workspace.
          </h1>
          <p className="mt-3 text-sm leading-7 text-muted-foreground">
            Something interrupted the connection. Try loading the projects
            again.
          </p>
          <Button
            type="button"
            onClick={() => void onRetry()}
            className={
              "mt-7 h-11 rounded-lg px-6 font-semibold shadow-none " +
              primaryActionButton
            }
          >
            <RefreshCwIcon size={15} aria-hidden="true" />
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
function getMetricAppearance(emphasis?: SummaryItem["emphasis"]): {
  icon: string;
  line: string;
} {
  if (emphasis === "warning")
    return {
      icon: "text-status-pending-foreground",
      line: "bg-status-pending",
    };
  if (emphasis === "success")
    return {
      icon: "text-status-complete-foreground",
      line: "bg-status-complete",
    };
  return {
    icon: "text-brand-secondary-highlight dark:text-secondary",
    line: "bg-brand-secondary-highlight dark:bg-secondary",
  };
}
function normalizeProjectStatus(status?: string | null) {
  return String(status ?? "")
    .trim()
    .toLowerCase()
    .replace(/[\s_-]/g, "");
}
function matchesProjectSearch(project: Project, query: string) {
  const normalizedQuery = query.trim().toLowerCase();
  if (!normalizedQuery) return true;
  const searchableText = [
    project.title,
    project.description ?? "",
    project.projectCode ?? "",
    project.category ?? "",
  ]
    .join(" ")
    .toLowerCase();
  return normalizedQuery
    .split(/\s+/)
    .every((term) => searchableText.includes(term));
}
function getProjectDateValue(project: Project) {
  if (!project.createdAt) return 0;
  const value = new Date(project.createdAt).getTime();
  return Number.isFinite(value) ? value : 0;
}
function sortProjectItems<T extends Project>(
  items: T[],
  sort: ProjectSort,
): T[] {
  return [...items].sort((first, second) => {
    if (sort === "oldest")
      return getProjectDateValue(first) - getProjectDateValue(second);
    if (sort === "title-asc")
      return first.title.localeCompare(second.title, undefined, {
        sensitivity: "base",
      });
    if (sort === "title-desc")
      return second.title.localeCompare(first.title, undefined, {
        sensitivity: "base",
      });
    return getProjectDateValue(second) - getProjectDateValue(first);
  });
}
function formatShortDate(value: string) {
  const match = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  const date = match
    ? new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]))
    : new Date(value);
  if (!Number.isFinite(date.getTime())) return "";
  return new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}
export default Projects;
