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

/* =========================================================
   SHARED THEME
========================================================= */

const primaryActionButton = [
  "border border-brand-secondary-highlight/15",
  "bg-brand-secondary-highlight",
  "text-primary-foreground",

  "hover:border-brand-secondary-highlight/20",
  "hover:bg-brand-secondary-highlight/90",
  "hover:text-primary-foreground",

  "dark:border-secondary",
  "dark:bg-secondary",
  "dark:text-secondary-foreground",

  "dark:hover:border-secondary/90",
  "dark:hover:bg-secondary/90",
  "dark:hover:text-secondary-foreground",
].join(" ");

const secondaryActionButton = [
  "border-border/65",
  "bg-surface-2/40",
  "text-foreground/70",

  "hover:border-border/85",
  "hover:bg-surface-3/60",
  "hover:text-foreground/90",

  "dark:border-border",
  "dark:bg-surface-2/80",
  "dark:text-foreground/80",

  "dark:hover:border-border",
  "dark:hover:bg-surface-3/80",
  "dark:hover:text-foreground",
].join(" ");

const elevatedSurface = [
  "border-border/60",
  "bg-card",

  "dark:border-border",
  "dark:bg-card",
].join(" ");

const softIconSurface = [
  "bg-surface-3/75",
  "text-brand-secondary-highlight",
  "ring-1 ring-inset ring-border/35",

  "dark:bg-surface-2",
  "dark:text-secondary",
  "dark:ring-border",
].join(" ");

/* =========================================================
   PAGE
========================================================= */

function Projects() {
  const { user } = useAuth();

  const [workspaceSection, setWorkspaceSection] =
    useState<WorkspaceSection>("projects");

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

        if (notifyOnError) {
          toast.error("We could not load your work.");
        }
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
    setProjects((current) =>
      current.map((project) =>
        project.id === updatedProject.id
          ? { ...project, ...updatedProject }
          : project,
      ),
    );
  }, []);

  const handleWorkProjectUpdated = useCallback((updatedProject: Project) => {
    setWorkProjects((current) =>
      current.map((project) =>
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
    setWorkLoading(false);
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
        (project) =>
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
        (project) => project.projectAllocatStatus === "Invited",
      ),
    [workProjects],
  );

  const activeWork = useMemo(
    () =>
      workProjects.filter((project) => {
        if (project.projectAllocatStatus !== "Accepted") return false;

        const status = normalizeProjectStatus(project.status);

        return !CLOSED_PROJECT_STATUSES.has(status);
      }),
    [workProjects],
  );

  const completedWork = useMemo(
    () =>
      workProjects.filter((project) => {
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

      setWorkProjects((current) =>
        current.map((project) =>
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

  if (loading) {
    return <WorkspaceLoading />;
  }

  if (error) {
    return <WorkspaceError onRetry={fetchProjects} />;
  }

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

  const workCount =
    invitations.length + activeWork.length + completedWork.length;

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
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      {/* ===================================================
          NAV
      =================================================== */}

      <header className="sticky top-0 z-50 border-b border-border/60 bg-background/95 backdrop-blur-xl dark:border-border">
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
          {/* =================================================
              MASTHEAD
          ================================================= */}

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

          {/* =================================================
              CONTENT
          ================================================= */}

          <main className="container mx-auto flex-1 px-4 pb-10 pt-7 sm:px-5 sm:pb-12 sm:pt-8 md:px-8 lg:pt-9">
            <motion.section
              initial={{ opacity: 0, y: 7 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.04, duration: 0.3, ease: "easeOut" }}
            >
              <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                <div className="min-w-0">
                  <SectionEyebrow>
                    {workspaceSection === "projects"
                      ? "Your workspace"
                      : "Client work"}
                  </SectionEyebrow>

                  <h2 className="mt-3 text-xl font-semibold tracking-[-0.025em] text-foreground/90 sm:text-2xl dark:text-foreground">
                    {sectionTitle}
                  </h2>

                  <p className="mt-1.5 hidden max-w-2xl text-xs leading-6 text-muted-foreground sm:block sm:text-sm">
                    {sectionDescription}
                  </p>
                </div>

                {!(
                  workspaceSection === "work" && workFilter === "invitations"
                ) && (
                  <ProjectControls
                    sort={sort}
                    setSort={setSort}
                    view={view}
                    setView={setView}
                  />
                )}
              </div>

              {/* =============================================
                  OWN PROJECTS
              ============================================= */}

              {workspaceSection === "projects" && (
                <ProjectResults
                  projects={visibleProjects}
                  view={view}
                  emptyLabel={filter === "closed" ? "completed" : filter}
                  onProjectUpdated={handleOwnedProjectUpdated}
                />
              )}

              {/* =============================================
                  CLIENT WORK
              ============================================= */}

              {workspaceSection === "work" && user?.isAllocat && (
                <>
                  {workLoading && !workLoaded ? (
                    <WorkSectionLoading />
                  ) : workError && !workLoaded ? (
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
                        {sortProjectItems(invitations, sort).map((project) => (
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
          softIconSurface,
        ].join(" ")}
      >
        <SparklesIcon size={16} />
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
      className={["overflow-hidden rounded-xl border", elevatedSurface].join(
        " ",
      )}
    >
      {/* ===================================================
          MAIN ROW
      =================================================== */}

      <div
        className={[
          "grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4",
          "px-4 py-5 sm:gap-6 sm:px-6 sm:py-6 lg:px-7",
          "bg-surface-2/35",
          "dark:bg-card",
        ].join(" ")}
      >
        <div className="min-w-0">
          <div className="flex items-center gap-2.5">
            <span
              className={[
                "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
                softIconSurface,
              ].join(" ")}
            >
              <BriefcaseBusinessIcon size={13} />
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
              ? "Keep the work moving. Everything you own, everything waiting and everything finished lives here."
              : "Your client work, active jobs and invitations — without the noise."}
          </p>
        </div>

        {/* ACTIONS */}

        <div className="flex shrink-0 items-center gap-2">
          <Button
            asChild
            size="icon"
            className={[
              "group h-9 w-9 rounded-lg shadow-none sm:w-auto sm:px-4",
              primaryActionButton,
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
              secondaryActionButton,
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

      {/* ===================================================
          WORKSPACE RAIL
      =================================================== */}

      <div
        className={[
          "border-t px-3 py-2.5 sm:px-5",
          "border-border/55",
          "bg-surface-3/30",

          "dark:border-border",
          "dark:bg-surface-2/70",
        ].join(" ")}
      >
        <div className="flex min-w-0 items-center justify-between gap-3 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="shrink-0">
            {isAllocat ? (
              <div
                className={[
                  "inline-flex items-center rounded-full border p-1",

                  "border-border/60",
                  "bg-surface-2/55",

                  "dark:border-border",
                  "dark:bg-surface-1",
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
              <p className="hidden whitespace-nowrap text-[0.54rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground/70 sm:block">
                Project overview
              </p>
            )}
          </div>

          <div className="flex shrink-0 items-center gap-1">
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
   WORKSPACE METRIC
========================================================= */

function WorkspaceMetric({ item }: { item: SummaryItem }) {
  const Icon = item.icon;

  const appearance = getMetricAppearance(item.emphasis);

  return (
    <button
      type="button"
      onClick={item.onClick}
      aria-pressed={item.active}
      title={item.label}
      className={[
        "relative flex h-8 items-center gap-2 rounded-lg px-2.5 text-left",

        "transition-[background-color,color] duration-150",

        item.active
          ? [
              "bg-surface-1",
              "text-foreground/90",

              "dark:bg-surface-3/65",
              "dark:text-foreground",
            ].join(" ")
          : [
              "text-muted-foreground",

              "hover:bg-surface-2/70",
              "hover:text-foreground/85",

              "dark:hover:bg-surface-3/55",
              "dark:hover:text-foreground",
            ].join(" "),
      ].join(" ")}
    >
      {item.active && (
        <motion.span
          layoutId="workspace-active-metric"
          className={[
            "absolute inset-x-2.5 bottom-0 h-[2px] rounded-full",
            appearance.line,
          ].join(" ")}
          transition={{ type: "spring", stiffness: 500, damping: 38 }}
        />
      )}

      <span className="relative flex shrink-0 items-center">
        {item.attention && (
          <span className="absolute -right-1.5 -top-1.5 flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-status-pending opacity-25" />

            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-status-pending" />
          </span>
        )}

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

        "text-[0.64rem] font-semibold",

        "transition-colors duration-200",

        active
          ? ["text-brand-secondary-highlight", "dark:text-secondary"].join(" ")
          : [
              "text-muted-foreground",

              "hover:text-foreground/85",

              "dark:hover:text-foreground",
            ].join(" "),
      ].join(" ")}
    >
      {active && (
        <motion.span
          layoutId="workspace-active-tab"
          className={[
            "absolute inset-0 rounded-full",

            "border border-brand-secondary-highlight/10",
            "bg-brand-secondary-highlight/[0.08]",

            "dark:border-secondary/12",
            "dark:bg-secondary/[0.08]",
          ].join(" ")}
          transition={{ type: "spring", stiffness: 500, damping: 38 }}
        />
      )}

      <span className="relative z-10 flex items-center gap-1.5">
        <span className="relative">
          {attention && !active && (
            <span className="absolute -right-1.5 -top-1 flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-status-pending opacity-30" />

              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-status-pending" />
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
                ? [
                    "text-brand-secondary-highlight/65",
                    "dark:text-secondary/65",
                  ].join(" ")
                : attention
                  ? "text-status-pending-foreground"
                  : "text-muted-foreground/55",
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
        <span className="h-1.5 w-5 rounded-full bg-brand-secondary-highlight/80 dark:bg-brand-secondary-highlight" />

        <span className="h-1.5 w-2 rounded-full bg-secondary/85" />
      </span>

      <p className="text-[0.54rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
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

      <div className="mx-1 h-4 w-px bg-border/70 dark:bg-border" />

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
    SORT_OPTIONS.find((option) => option.value === value) ?? SORT_OPTIONS[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className={[
            "h-9 rounded-lg px-2.5 text-xs font-medium shadow-none",

            "text-muted-foreground",

            "transition-colors",

            "hover:bg-surface-3/60",
            "hover:text-foreground/90",

            "data-[state=open]:bg-surface-3/60",
            "data-[state=open]:text-foreground/90",

            "dark:hover:bg-surface-3/70",
            "dark:hover:text-foreground",

            "dark:data-[state=open]:bg-surface-3/70",
            "dark:data-[state=open]:text-foreground",
          ].join(" ")}
        >
          <ArrowDownNarrowWideIcon size={14} className="shrink-0" />

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

          <ChevronDownIcon size={13} className="shrink-0" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className={[
          "w-52 rounded-xl border p-1.5 shadow-none",

          "border-border/65",
          "bg-popover",
          "text-popover-foreground",

          "dark:border-border",
        ].join(" ")}
      >
        {SORT_OPTIONS.map((option) => {
          const active = option.value === value;

          return (
            <DropdownMenuItem
              key={option.value}
              onSelect={() => onChange(option.value)}
              className={[
                "rounded-lg px-3 py-2.5 text-xs",

                "transition-colors",

                active
                  ? [
                      "bg-brand-secondary-highlight/[0.07]",
                      "font-semibold",
                      "text-foreground",

                      "dark:bg-secondary/[0.07]",
                      "dark:text-foreground",
                    ].join(" ")
                  : [
                      "data-[highlighted]:bg-surface-3/60",
                      "data-[highlighted]:text-foreground",

                      "dark:data-[highlighted]:bg-surface-3/70",
                    ].join(" "),
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

        "border-border/60",
        "bg-surface-2/55",

        "dark:border-border",
        "dark:bg-surface-2/80",
      ].join(" ")}
    >
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className={[
          "h-8 w-8 rounded-md shadow-none",

          "transition-colors duration-200",

          view === "grid"
            ? [
                "bg-brand-secondary-highlight/[0.10]",
                "text-brand-secondary-highlight",

                "hover:bg-brand-secondary-highlight/[0.14]",
                "hover:text-brand-secondary-highlight",

                "dark:bg-secondary/[0.10]",
                "dark:text-secondary",

                "dark:hover:bg-secondary/[0.14]",
                "dark:hover:text-secondary",
              ].join(" ")
            : [
                "text-muted-foreground",

                "hover:bg-surface-1/80",
                "hover:text-foreground/85",

                "dark:hover:bg-surface-3/70",
                "dark:hover:text-foreground",
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
          "h-8 w-8 rounded-md shadow-none",

          "transition-colors duration-200",

          view === "list"
            ? [
                "bg-brand-secondary-highlight/[0.10]",
                "text-brand-secondary-highlight",

                "hover:bg-brand-secondary-highlight/[0.14]",
                "hover:text-brand-secondary-highlight",

                "dark:bg-secondary/[0.10]",
                "dark:text-secondary",

                "dark:hover:bg-secondary/[0.14]",
                "dark:hover:text-secondary",
              ].join(" ")
            : [
                "text-muted-foreground",

                "hover:bg-surface-1/80",
                "hover:text-foreground/85",

                "dark:hover:bg-surface-3/70",
                "dark:hover:text-foreground",
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
  onAccept,
  onDecline,
}: {
  project: WorkProject;
  onAccept: () => Promise<void>;
  onDecline: () => Promise<void>;
}) {
  const [detailsOpen, setDetailsOpen] = useState(false);

  const [responding, setResponding] = useState<"accept" | "decline" | null>(
    null,
  );

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
      <article
        className={[
          "group relative overflow-hidden rounded-xl border p-5 sm:p-6",

          "border-border/60",
          "bg-card",

          "transition-[background-color,border-color] duration-200",

          "hover:border-brand-amber/20",
          "hover:bg-surface-2/65",

          "dark:border-border",
          "dark:bg-card",

          "dark:hover:border-status-pending/20",
          "dark:hover:bg-surface-2/75",
        ].join(" ")}
      >
        <span className="absolute inset-y-5 left-0 w-[2px] rounded-full bg-status-pending/80" />

        <div className="grid gap-5 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-2 text-[0.56rem] font-semibold uppercase tracking-[0.15em] text-brand-amber dark:text-status-pending-foreground">
                <span
                  className={[
                    "flex h-7 w-7 items-center justify-center rounded-lg",

                    "bg-brand-amber/10",

                    "dark:bg-status-pending/10",
                  ].join(" ")}
                >
                  <SendIcon size={11} />
                </span>
                Project invitation
              </span>

              {project.invitedAt && (
                <span className="text-[0.58rem] text-muted-foreground/80">
                  {formatShortDate(project.invitedAt)}
                </span>
              )}
            </div>

            <h2 className="mt-4 text-base font-semibold leading-tight tracking-[-0.02em] text-foreground/90 sm:text-lg dark:text-foreground">
              {project.title}
            </h2>

            <p className="mt-2 line-clamp-2 max-w-2xl text-xs leading-6 text-muted-foreground sm:text-sm">
              {project.description}
            </p>

            <button
              type="button"
              onClick={() => setDetailsOpen(true)}
              className={[
                "mt-4 inline-flex items-center gap-2",

                "text-[0.62rem] font-semibold",

                "text-brand-secondary-highlight",

                "transition-colors",

                "hover:text-foreground/85",

                "dark:text-secondary",
                "dark:hover:text-foreground",
              ].join(" ")}
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
              className={[
                "h-9 rounded-lg px-3 text-xs shadow-none",

                "text-muted-foreground",

                "hover:bg-surface-3/60",
                "hover:text-foreground/90",

                "dark:hover:bg-surface-3/70",
                "dark:hover:text-foreground",
              ].join(" ")}
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
      </article>

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
      <DialogContent
        className={[
          "max-h-[90vh] overflow-y-auto rounded-xl p-0 sm:max-w-2xl",

          "border-border/65",
          "bg-card",
          "text-card-foreground",

          "shadow-none",

          "dark:border-border",
          "dark:bg-card",
        ].join(" ")}
      >
        <DialogHeader className="border-b border-border/60 px-5 pb-5 pt-6 text-left sm:px-8 sm:pb-6 sm:pt-7 dark:border-border">
          <Badge
            variant="outline"
            className={[
              "mb-3 w-fit rounded-md",

              "border-brand-amber/20",
              "bg-brand-amber/[0.07]",
              "text-brand-amber",

              "dark:border-status-pending/20",
              "dark:bg-status-pending/[0.08]",
              "dark:text-status-pending-foreground",
            ].join(" ")}
          >
            Project invitation
          </Badge>

          <DialogTitle className="text-xl font-semibold leading-tight tracking-[-0.025em] text-foreground/90 sm:text-2xl dark:text-foreground">
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

            <p className="mt-3 whitespace-pre-line text-sm leading-7 text-foreground/80 dark:text-foreground/90">
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

          <div
            className={[
              "rounded-r-lg border-l-2 py-2 pl-4 pr-3",

              "border-brand-amber/40",
              "bg-brand-amber/[0.055]",

              "dark:border-status-pending/35",
              "dark:bg-status-pending/[0.07]",
            ].join(" ")}
          >
            <p className="text-xs leading-6 text-foreground/70 dark:text-foreground/80">
              Accepting gives you access to the project workspace and its tasks.
              Until then, you can only review these project details.
            </p>
          </div>

          <div className="flex flex-col-reverse gap-2.5 border-t border-border/60 pt-6 sm:flex-row sm:justify-end dark:border-border">
            <Button
              type="button"
              variant="ghost"
              disabled={responding !== null}
              onClick={() => void onDecline()}
              className={[
                "h-10 rounded-lg px-5 shadow-none sm:h-11",

                "text-muted-foreground",

                "hover:bg-surface-3/60",
                "hover:text-foreground",

                "dark:hover:bg-surface-3/70",
                "dark:hover:text-foreground",
              ].join(" ")}
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
   WORK SECTION LOADING
========================================================= */

function WorkSectionLoading() {
  return (
    <section
      className={[
        "mt-6 flex min-h-[200px] items-center justify-center rounded-xl border",

        "border-border/55",
        "bg-surface-2/60",

        "dark:border-border",
        "dark:bg-surface-1",
      ].join(" ")}
    >
      <div className="flex items-center gap-2.5 text-sm text-muted-foreground">
        <LoaderCircleIcon size={16} className="animate-spin" />
        Loading client work
      </div>
    </section>
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

        "border-border/55",
        "bg-surface-2/60",

        "dark:border-border",
        "dark:bg-surface-1",
      ].join(" ")}
    >
      <div className="max-w-md">
        <span
          className={[
            "flex h-10 w-10 items-center justify-center rounded-lg",
            softIconSurface,
          ].join(" ")}
        >
          <RefreshCwIcon size={17} />
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
        "mt-6 overflow-hidden rounded-xl border px-6 py-9 sm:px-8 sm:py-10",

        "border-border/55",
        "bg-surface-2/60",

        "dark:border-border",
        "dark:bg-surface-1",
      ].join(" ")}
    >
      <div className="max-w-md">
        <span
          className={[
            "flex h-10 w-10 items-center justify-center rounded-lg",
            softIconSurface,
          ].join(" ")}
        >
          <Icon size={17} />
        </span>

        <h2 className="mt-5 text-lg font-semibold tracking-[-0.02em] text-foreground/90 sm:text-xl dark:text-foreground">
          {title}.
        </h2>

        <p className="mt-2 text-sm leading-7 text-muted-foreground">
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
    <EmptyCollection title={title} description={description} icon={icon} />
  );
}

/* =========================================================
   LOADING
========================================================= */

function WorkspaceLoading() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <header className="sticky top-0 z-50 border-b border-border/60 bg-background/95 backdrop-blur-xl dark:border-border">
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

function WorkspaceError({ onRetry }: { onRetry: () => Promise<void> }) {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <header className="sticky top-0 z-50 border-b border-border/60 bg-background/95 backdrop-blur-xl dark:border-border">
        <div className="container mx-auto px-4 sm:px-5 md:px-8">
          <DashboardMainNav />
        </div>
      </header>

      <main className="container mx-auto flex flex-1 items-center px-5 py-20 md:px-8">
        <div className="max-w-lg">
          <span
            className={[
              "flex h-11 w-11 items-center justify-center rounded-xl",

              "bg-destructive/[0.07]",
              "text-destructive",

              "dark:bg-status-overdue/[0.08]",
              "dark:text-status-overdue-foreground",
            ].join(" ")}
          >
            <FolderOpenIcon size={20} />
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
   METRIC APPEARANCE
========================================================= */

function getMetricAppearance(emphasis?: SummaryItem["emphasis"]): {
  icon: string;
  line: string;
} {
  if (emphasis === "warning") {
    return {
      icon: ["text-brand-amber", "dark:text-status-pending-foreground"].join(
        " ",
      ),

      line: ["bg-brand-amber", "dark:bg-status-pending"].join(" "),
    };
  }

  if (emphasis === "success") {
    return {
      icon: ["text-brand-green", "dark:text-status-complete-foreground"].join(
        " ",
      ),

      line: ["bg-brand-green", "dark:bg-status-complete"].join(" "),
    };
  }

  return {
    icon: [
      "text-brand-secondary-highlight",
      "dark:text-status-active-foreground",
    ].join(" "),

    line: ["bg-brand-secondary-highlight", "dark:bg-status-active"].join(" "),
  };
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

  if (Number.isNaN(date.getTime())) {
    return 0;
  }

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

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

export default Projects;
