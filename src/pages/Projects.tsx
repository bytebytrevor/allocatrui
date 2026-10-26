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
  "border-border/70 bg-card text-foreground/85",
  "hover:bg-card hover:text-foreground",
  "transition-opacity duration-150 hover:opacity-75",
  "focus-visible:ring-2 focus-visible:ring-ring/35",
  "motion-reduce:transition-none",
].join(" ");
const elevatedSurface =
  "border-border/65 bg-card shadow-sm shadow-black/[0.025] dark:border-border dark:shadow-none";
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

          <main className="container mx-auto flex-1 px-4 pb-10 pt-8 sm:px-5 sm:pb-12 sm:pt-10 md:px-8">
            <motion.section
              initial={{ opacity: 0, y: 7 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.04, duration: 0.3, ease: "easeOut" }}
            >
              <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between sm:gap-8">
                <div className="min-w-0">
                  <SectionEyebrow>
                    {isWorkSection ? "Client work" : "Your workspace"}
                  </SectionEyebrow>
                  <h2 className="mt-3 text-lg font-medium leading-snug tracking-[-0.02em] text-foreground/90 sm:text-xl dark:text-foreground">
                    {sectionTitle}
                  </h2>
                  <p className="mt-2.5 hidden max-w-2xl text-xs leading-7 text-muted-foreground sm:block sm:text-sm">
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

              <div className="mt-6 flex flex-col gap-3 sm:mt-7 sm:flex-row sm:items-center sm:justify-between sm:gap-5">
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
  const inputRef = useRef<HTMLInputElement>(null);
  return (
    <div className="flex min-h-10 w-full items-center gap-2.5 rounded-xl border border-border/70 bg-card px-3 transition-[border-color,box-shadow] duration-150 focus-within:border-ring/50 focus-within:ring-2 focus-within:ring-ring/15 motion-reduce:transition-none sm:max-w-sm dark:border-border dark:bg-surface-2/45">
      <SearchIcon
        size={14}
        aria-hidden="true"
        className="shrink-0 text-muted-foreground"
      />
      <input
        ref={inputRef}
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
        className="h-10 min-w-0 flex-1 bg-transparent text-base text-foreground outline-none placeholder:text-muted-foreground/65 sm:text-sm [&::-webkit-search-cancel-button]:appearance-none"
      />
      {value && (
        <button
          type="button"
          onClick={() => {
            onChange("");
            inputRef.current?.focus();
          }}
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
      <p className="mt-6 text-[10px] font-semibold uppercase tracking-[0.17em] text-muted-foreground">
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
              className="transition-transform duration-200 group-hover:translate-x-0.5 motion-reduce:transform-none motion-reduce:transition-none"
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
      className={"overflow-hidden rounded-2xl border " + elevatedSurface}
    >
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 bg-surface-2/20 px-4 py-5 sm:gap-6 sm:px-6 sm:py-6 lg:px-7 dark:bg-card">
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
            <p className="text-[10px] font-semibold uppercase tracking-[0.17em] text-muted-foreground">
              Workspace
            </p>
          </div>
          <h1 className="mt-3 break-words text-2xl font-semibold leading-[1.15] tracking-[-0.035em] text-foreground/95 sm:text-3xl lg:text-[2rem] dark:text-foreground">
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
              "group h-11 w-11 rounded-lg shadow-none sm:w-auto sm:px-4 " +
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
                className="hidden transition-transform duration-200 group-hover:translate-x-0.5 motion-reduce:transform-none motion-reduce:transition-none sm:block"
              />
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            size="icon"
            className={
              "h-11 w-11 rounded-lg shadow-none sm:w-auto sm:px-4 " +
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

      <div className="border-t border-border/50 bg-surface-2/25 px-1.5 py-1.5 sm:px-2 dark:border-border dark:bg-surface-2/40">
        <div className="flex min-w-0 items-center justify-between gap-2 overflow-x-auto p-0.5 [scrollbar-width:thin]">
          <div className="shrink-0">
            {isAllocat ? (
              <div
                role="group"
                aria-label="Workspace section"
                className="inline-flex items-center rounded-lg border border-border/60 bg-surface-3/25 p-0.5 dark:border-border dark:bg-surface-1"
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
              <p className="hidden whitespace-nowrap text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground/70 sm:block">
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
        "relative flex h-8 items-center gap-1.5 rounded-md px-2.5 text-left ring-1 ring-inset",
        "transition-[background-color,color] duration-150 motion-reduce:transition-none",
        focusStyle,
        item.active
          ? "bg-card text-foreground ring-border/60 dark:bg-surface-3/65 dark:text-foreground"
          : "ring-transparent text-muted-foreground hover:bg-surface-2/70 hover:text-foreground/85 dark:hover:bg-surface-3/55 dark:hover:text-foreground",
      ].join(" ")}
    >
      {item.active && (
        <motion.span
          layoutId="workspace-active-metric"
          aria-hidden="true"
          className={
            "absolute inset-x-2 bottom-0 h-0.5 rounded-full " + appearance.line
          }
          transition={{ duration: 0.18, ease: "easeOut" }}
        />
      )}
      <span className="relative flex shrink-0 items-center">
        {item.attention && <AttentionDot className="-right-1.5 -top-1.5" />}
        <Icon size={11} className={appearance.icon} />
      </span>
      <span className="text-[11px] font-semibold tabular-nums sm:text-xs">
        {item.value}
      </span>
      <span className="hidden text-[11px] font-medium sm:inline">
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
        "relative flex h-8 shrink-0 items-center gap-2 rounded-md px-3 text-xs font-medium",
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
          className="absolute inset-0 rounded-md border border-border/45 bg-card shadow-none dark:border-border dark:bg-surface-3/70"
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
              "text-[10px] font-semibold tabular-nums " +
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
      <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
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
          className="h-9 rounded-lg px-2.5 text-xs font-medium text-muted-foreground shadow-none transition-colors hover:bg-surface-3/60 hover:text-foreground/90 data-[state=open]:bg-surface-3/60 data-[state=open]:text-foreground/90 dark:hover:bg-surface-3/70 dark:hover:text-foreground dark:data-[state=open]:bg-surface-3/70 dark:data-[state=open]:text-foreground motion-reduce:transition-none"
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
        className="w-52 rounded-xl border border-border/75 bg-popover p-1.5 text-popover-foreground shadow-lg shadow-black/5"
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
            "h-8 w-8 rounded-md shadow-none transition-colors duration-150 motion-reduce:transition-none",
            view === value
              ? "bg-card text-brand-secondary-highlight shadow-none hover:bg-card hover:text-brand-secondary-highlight dark:bg-surface-3 dark:text-secondary dark:hover:bg-surface-3 dark:hover:text-secondary"
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
        compactSpacing ? "mt-4" : "mt-5",
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
      <article className="relative overflow-hidden rounded-xl border border-border/65 bg-card p-5 sm:p-6 dark:border-border">
        <span
          aria-hidden="true"
          className="absolute inset-y-5 left-0 w-[2px] rounded-full bg-status-pending/80"
        />
        <div className="grid gap-5 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.15em] text-status-pending-foreground">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-status-pending/10">
                  <SendIcon size={11} aria-hidden="true" />
                </span>
                Project invitation
              </span>
              {project.invitedAt && (
                <span className="text-[11px] text-muted-foreground/80">
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
                "mt-3 inline-flex min-h-9 items-center gap-2 rounded-md text-xs font-semibold text-brand-secondary-highlight transition-opacity hover:opacity-75 dark:text-secondary " +
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
            className="animate-spin motion-reduce:animate-none"
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
      <DialogContent className="max-h-[90dvh] overflow-y-auto rounded-2xl border-border/70 bg-card p-0 text-card-foreground shadow-xl shadow-black/10 sm:max-w-2xl dark:border-border">
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
            <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-muted-foreground">
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
          <div className="rounded-xl border border-border/60 bg-surface-2/40 px-4 py-3">
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
      <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-muted-foreground">
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
      className="mt-6 overflow-hidden rounded-xl border border-border/60 bg-card p-6 sm:p-8 dark:border-border dark:bg-surface-1"
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
