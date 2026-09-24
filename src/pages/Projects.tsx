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
  }, [
    user?.isAllocat,
    user?.userId,
    user?.email,
    fetchWorkProjects,
  ]);

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
  }, [
    filter,
    activeProjects,
    pendingProjects,
    closedProjects,
    sort,
  ]);

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

  const activeWork = useMemo(() => {
    return workProjects.filter(project => {
      if (project.projectAllocatStatus !== "Accepted") return false;

      const status = normalizeProjectStatus(project.status);
      return !CLOSED_PROJECT_STATUSES.has(status);
    });
  }, [workProjects]);

  const completedWork = useMemo(() => {
    return workProjects.filter(project => {
      if (project.projectAllocatStatus !== "Accepted") return false;

      const status = normalizeProjectStatus(project.status);
      return CLOSED_PROJECT_STATUSES.has(status);
    });
  }, [workProjects]);

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
  }, [
    workFilter,
    invitations,
    activeWork,
    completedWork,
    sort,
  ]);

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
    loading ||
    Boolean(user?.isAllocat && workLoading && !workLoaded);

  if (workspaceLoading) {
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
    invitations.length +
    activeWork.length +
    completedWork.length;

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
      {/* =====================================================
          APP SHELL
      ===================================================== */}

      {showNewClientState ? (
        <header className="sticky top-0 z-50 border-b border-border/60 bg-background/95 backdrop-blur-xl">
          <div className="container mx-auto px-4 sm:px-5 md:px-8">
            <DashboardMainNav />
          </div>
        </header>
      ) : (
        <div className="sticky top-0 z-50">
          <header className="border-b border-border/60 bg-background/95 backdrop-blur-xl">
            <div className="container mx-auto px-4 sm:px-5 md:px-8">
              <DashboardMainNav />
            </div>
          </header>

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
      )}

      {/* =====================================================
          NEW CLIENT
      ===================================================== */}

      {showNewClientState ? (
        <main className="container mx-auto flex flex-1 items-center justify-center px-4 py-10 sm:px-5 sm:py-14 md:px-8">
          <NewClientWelcome firstName={firstName} />
        </main>
      ) : (
        /* ===================================================
           WORKSPACE
        =================================================== */

        <main className="container mx-auto flex-1 px-4 py-5 sm:px-5 sm:py-7 md:px-8 lg:py-8">
          <motion.section
            initial={{ opacity: 0, y: 7 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: 0.04,
              duration: 0.3,
              ease: "easeOut",
            }}
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-[0.58rem] font-semibold uppercase tracking-[0.15em] text-muted-foreground">
                  {workspaceSection === "projects"
                    ? "Your workspace"
                    : "Client work"}
                </p>

                <h2 className="mt-1.5 text-xl font-black tracking-[-0.025em] sm:text-2xl">
                  {sectionTitle}
                </h2>

                <p className="mt-1 hidden text-xs leading-6 text-muted-foreground sm:block sm:text-sm">
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
                    <div className="mt-5 grid gap-3 sm:mt-6">
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
          "mx-auto flex h-9 w-9 items-center justify-center rounded-lg",
          "bg-[#242424] text-[#DEDA00]",
          "dark:bg-[#DEDA00] dark:text-[#303030]",
        ].join(" ")}
      >
        <SparklesIcon size={15} />
      </span>

      <p className="mt-5 text-[0.6rem] font-semibold uppercase tracking-[0.17em] text-muted-foreground">
        Welcome to Allocatr
      </p>

      <h1 className="mt-2 text-2xl font-black leading-[1.12] tracking-[-0.035em] sm:text-3xl">
        What would you like to do first, {firstName}?
      </h1>

      <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-muted-foreground">
        Create a project if you already know what needs to be done, or discover
        Allocats and find the right person first.
      </p>

      <div className="mt-7 flex flex-col justify-center gap-2.5 sm:flex-row sm:items-center">
        <Button
          asChild
          className={[
            "group h-10 rounded-lg px-5 text-xs font-bold shadow-none",
            "bg-[#242424] text-white",
            "hover:bg-[#303030] hover:text-white",
            "dark:bg-[#DEDA00] dark:text-[#303030]",
            "dark:hover:bg-[#d4d000] dark:hover:text-[#303030]",
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
            "border-border bg-background text-foreground",
            "hover:border-foreground/20 hover:bg-muted/30 hover:text-foreground",
          ].join(" ")}
        >
          <Link to="/discover">
            <SearchIcon size={14} />
            Discover Allocats
          </Link>
        </Button>
      </div>

      <p className="mt-5 text-[0.68rem] text-muted-foreground/70">
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
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.28, ease: "easeOut" }}
      className={[
        "border-b border-border/70",
        "bg-[#f6f6f2]",
        "text-foreground",
        "dark:border-white/[0.055]",
        "dark:bg-[#191919]",
        "dark:text-white",
      ].join(" ")}
    >
      <div className="container mx-auto px-4 sm:px-5 md:px-8">
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 py-3 sm:gap-5 sm:py-4 lg:py-5">
          <div className="min-w-0">
            <div className="hidden items-center gap-2.5 sm:flex">
              <span
                className={[
                  "flex h-7 w-7 items-center justify-center rounded-lg",
                  "bg-[#242424] text-[#DEDA00]",
                  "dark:bg-[#DEDA00] dark:text-[#303030]",
                ].join(" ")}
              >
                <BriefcaseBusinessIcon size={13} />
              </span>

              <p className="text-[0.58rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground dark:text-white/40">
                Workspace
              </p>
            </div>

            <div className="flex items-center gap-2 sm:hidden">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-[#242424] text-[#DEDA00] dark:bg-[#DEDA00] dark:text-[#303030]">
                <BriefcaseBusinessIcon size={11} />
              </span>

              <p className="truncate text-[0.58rem] font-semibold uppercase tracking-[0.14em] text-muted-foreground dark:text-white/40">
                Workspace
              </p>
            </div>

            <h1 className="mt-1.5 truncate text-lg font-black leading-tight tracking-[-0.03em] text-foreground sm:mt-2.5 sm:text-2xl lg:text-[1.85rem] dark:text-white">
              Welcome back,{" "}
              <span className="text-foreground dark:text-[#DEDA00]">
                {firstName}
              </span>
              .
            </h1>

            <p className="mt-1.5 hidden max-w-xl text-xs leading-6 text-muted-foreground md:block dark:text-white/48">
              {workspaceSection === "projects"
                ? "Keep the work moving. Everything you own, everything waiting, and everything finished lives here."
                : "Your client work, active jobs and invitations — without the noise."}
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
            <Button
              asChild
              size="icon"
              className={[
                "group h-8 w-8 rounded-lg shadow-none sm:h-9 sm:w-auto sm:px-4",
                "bg-[#242424] text-white",
                "hover:bg-[#303030] hover:text-white",
                "dark:bg-[#DEDA00] dark:text-[#303030]",
                "dark:hover:bg-[#d4d000] dark:hover:text-[#303030]",
              ].join(" ")}
            >
              <Link to="/projects/new" aria-label="New project">
                <PlusIcon size={13} />

                <span className="hidden text-xs font-bold sm:inline">
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
                "h-8 w-8 rounded-lg shadow-none sm:h-9 sm:w-auto sm:px-4",
                "border-black/[0.10] bg-white/55 text-foreground",
                "hover:border-black/[0.16] hover:bg-white hover:text-foreground",
                "dark:border-white/[0.13] dark:bg-white/[0.045] dark:text-white",
                "dark:hover:border-white/20 dark:hover:bg-white/[0.075] dark:hover:text-white",
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
      </div>

      <div
        className={[
          "border-t border-border/70",
          "bg-black/[0.018]",
          "dark:border-white/[0.055]",
          "dark:bg-black/[0.14]",
        ].join(" ")}
      >
        <div className="container mx-auto px-4 sm:px-5 md:px-8">
          <div className="flex min-w-0 items-center justify-between gap-3 overflow-x-auto py-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:py-2.5">
            <div className="shrink-0">
              {isAllocat ? (
                <div
                  className={[
                    "inline-flex items-center rounded-lg border p-0.5 sm:p-1",
                    "border-border/80 bg-white/60",
                    "dark:border-white/[0.07] dark:bg-black/20",
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
                <p className="hidden whitespace-nowrap text-[0.58rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground sm:block dark:text-white/35">
                  Project overview
                </p>
              )}
            </div>

            <div className="flex shrink-0 items-center gap-0.5 sm:gap-1">
              {items.map(item => (
                <WorkspaceMetric
                  key={item.label}
                  item={item}
                />
              ))}
            </div>
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

  const iconStyle =
    item.emphasis === "success"
      ? "text-chart-2"
      : item.emphasis === "warning"
        ? "text-chart-3"
        : "text-foreground/75 dark:text-[#DEDA00]";

  const valueStyle =
    item.emphasis === "success"
      ? "text-chart-2"
      : item.emphasis === "warning"
        ? "text-chart-3"
        : "text-foreground dark:text-[#DEDA00]";

  return (
    <button
      type="button"
      onClick={item.onClick}
      aria-pressed={item.active}
      title={item.label}
      className={[
        "relative flex h-7 items-center gap-1.5 rounded-md px-2 text-left",
        "transition-colors duration-200 ease-out sm:h-8 sm:gap-2 sm:px-2.5",
        item.active
          ? "bg-black/[0.045] dark:bg-white/[0.08]"
          : "hover:bg-black/[0.03] dark:hover:bg-white/[0.045]",
      ].join(" ")}
    >
      {item.active && (
        <motion.span
          layoutId="workspace-active-metric"
          className="absolute bottom-0 left-2 right-2 h-[2px] rounded-full bg-[#303030] sm:left-2.5 sm:right-2.5 dark:bg-[#DEDA00]"
          transition={{
            type: "spring",
            stiffness: 500,
            damping: 38,
          }}
        />
      )}

      <span className="relative flex shrink-0 items-center">
        {item.attention && (
          <span className="absolute -right-1 -top-1 flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-chart-3 opacity-25" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-chart-3" />
          </span>
        )}

        <Icon
          size={11}
          className={iconStyle}
        />
      </span>

      <span
        className={[
          "text-[0.68rem] font-black tabular-nums sm:text-xs",
          valueStyle,
        ].join(" ")}
      >
        {item.value}
      </span>

      <span className="hidden text-[0.62rem] font-medium text-muted-foreground sm:inline dark:text-white/42">
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
        "relative flex h-7 shrink-0 items-center gap-1.5 rounded-md px-2.5",
        "text-[0.64rem] font-semibold transition-colors duration-200 sm:px-3 sm:text-[0.67rem]",
        active
          ? "text-white dark:text-[#303030]"
          : "text-muted-foreground hover:text-foreground dark:text-white/45 dark:hover:text-white",
      ].join(" ")}
    >
      {active && (
        <motion.span
          layoutId="workspace-active-tab"
          className="absolute inset-0 rounded-md bg-[#242424] dark:bg-[#DEDA00]"
          transition={{
            type: "spring",
            stiffness: 500,
            damping: 38,
          }}
        />
      )}

      <span className="relative z-10 flex items-center gap-1.5">
        <span className="relative">
          {attention && !active && (
            <span className="absolute -right-1.5 -top-1 flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-chart-3 opacity-30" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-chart-3" />
            </span>
          )}

          <Icon size={11} />
        </span>

        {label}

        {typeof count === "number" && count > 0 && (
          <span
            className={[
              "text-[0.54rem] font-black tabular-nums sm:text-[0.56rem]",
              active
                ? "text-white/55 dark:text-[#303030]/55"
                : attention
                  ? "text-chart-3"
                  : "text-muted-foreground/70 dark:text-white/35",
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
      <SortControl
        value={sort}
        onChange={setSort}
      />

      <div className="mx-1 h-4 w-px bg-border/70" />

      <ViewControls
        view={view}
        setView={setView}
      />
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
            "h-8 rounded-lg px-2.5 text-xs font-medium text-muted-foreground shadow-none sm:h-9",
            "transition-colors",
            "hover:bg-muted/40 hover:text-foreground",
            "data-[state=open]:bg-muted/40 data-[state=open]:text-foreground",
          ].join(" ")}
        >
          <ArrowDownNarrowWideIcon
            size={14}
            className="shrink-0"
          />

          <span className="hidden sm:inline">
            Sort by
          </span>

          <span className="relative hidden min-w-[76px] overflow-hidden text-left md:block">
            <AnimatePresence
              mode="wait"
              initial={false}
            >
              <motion.span
                key={value}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.14 }}
                className="block font-semibold text-foreground"
              >
                {currentOption.label}
              </motion.span>
            </AnimatePresence>
          </span>

          <span className="sm:hidden">
            Sort
          </span>

          <ChevronDownIcon
            size={13}
            className="shrink-0"
          />
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
                active ? "bg-muted/60 font-semibold" : "",
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
                  className="ml-auto"
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
    <div className="flex shrink-0 items-center gap-1">
      <Button
        type="button"
        variant={view === "grid" ? "default" : "ghost"}
        size="icon"
        className={[
          "h-8 w-8 rounded-lg shadow-none sm:h-9 sm:w-9",
          view !== "grid"
            ? "text-muted-foreground hover:bg-muted/40 hover:text-foreground"
            : "",
        ].join(" ")}
        onClick={() => setView("grid")}
        aria-label="Grid view"
      >
        <Grid2X2Icon size={15} />
      </Button>

      <Button
        type="button"
        variant={view === "list" ? "default" : "ghost"}
        size="icon"
        className={[
          "h-8 w-8 rounded-lg shadow-none sm:h-9 sm:w-9",
          view !== "list"
            ? "text-muted-foreground hover:bg-muted/40 hover:text-foreground"
            : "",
        ].join(" ")}
        onClick={() => setView("list")}
        aria-label="List view"
      >
        <LayoutListIcon size={16} />
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
              "mt-5 grid min-w-0 gap-4 sm:mt-6",
              "sm:grid-cols-2",
              "lg:grid-cols-3",
              "2xl:grid-cols-4",
            ].join(" ")
          : "mt-4 flex min-w-0 flex-col gap-0 sm:mt-6"
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
  const [responding, setResponding] = useState<
    "accept" |
    "decline" |
    null
  >(null);

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
          "group relative overflow-hidden rounded-2xl border border-border/70 bg-background p-4 sm:p-6",
          "transition-[border-color,box-shadow] duration-300 ease-out",
          "hover:border-chart-3/25",
          "hover:shadow-[0_8px_22px_-18px_rgba(0,0,0,0.18)]",
          "dark:hover:shadow-[0_10px_24px_-18px_rgba(0,0,0,0.55)]",
        ].join(" ")}
      >
        <span className="absolute bottom-4 left-0 top-4 w-[2px] rounded-full bg-chart-3/65 sm:bottom-5 sm:top-5" />

        <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center sm:gap-5">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-2 text-[0.61rem] font-semibold uppercase tracking-[0.16em] text-chart-3">
                <span className="flex h-6 w-6 items-center justify-center rounded-md bg-chart-3/[0.10]">
                  <SendIcon size={11} />
                </span>

                Project invitation
              </span>

              {project.invitedAt && (
                <span className="text-[0.68rem] text-muted-foreground">
                  {formatShortDate(project.invitedAt)}
                </span>
              )}
            </div>

            <h2 className="mt-3 text-base font-black leading-tight tracking-[-0.025em] sm:text-xl">
              {project.title}
            </h2>

            <p className="mt-2 line-clamp-2 max-w-2xl text-xs leading-6 text-muted-foreground sm:text-sm sm:leading-7">
              {project.description}
            </p>

            <button
              type="button"
              onClick={() => setDetailsOpen(true)}
              className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-foreground transition-colors hover:text-muted-foreground sm:mt-4"
            >
              Review project
              <ArrowRightIcon size={13} />
            </button>
          </div>

          <div className="flex items-center gap-2 sm:justify-end">
            <Button
              type="button"
              variant="ghost"
              disabled={responding !== null}
              onClick={() => void handleDecline()}
              className="h-9 rounded-lg px-3 text-xs text-muted-foreground shadow-none hover:bg-muted/40 hover:text-foreground sm:h-10 sm:px-4"
            >
              {responding === "decline" ? (
                <LoaderCircleIcon
                  size={15}
                  className="animate-spin"
                />
              ) : (
                <XIcon size={14} />
              )}

              Decline
            </Button>

            <Button
              type="button"
              disabled={responding !== null}
              onClick={() => void handleAccept()}
              className="h-9 rounded-lg px-4 text-xs shadow-none sm:h-10 sm:px-5"
            >
              {responding === "accept" ? (
                <LoaderCircleIcon
                  size={15}
                  className="animate-spin"
                />
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
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="max-h-[90vh] overflow-y-auto rounded-[1.5rem] border-border bg-background p-0 sm:max-w-2xl">
        <DialogHeader className="border-b border-border px-5 pb-5 pt-6 text-left sm:px-8 sm:pb-6 sm:pt-7">
          <Badge
            variant="outline"
            className="mb-3 w-fit rounded-md border-chart-3/25 bg-chart-3/[0.08] text-chart-3"
          >
            Project invitation
          </Badge>

          <DialogTitle className="text-xl font-black leading-tight tracking-[-0.03em] sm:text-2xl">
            {project.title}
          </DialogTitle>

          <DialogDescription className="mt-2 max-w-xl leading-7">
            Review the project before deciding whether you want to join the work.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 px-5 py-6 sm:space-y-7 sm:px-8 sm:py-7">
          <section>
            <p className="text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              Project description
            </p>

            <p className="mt-3 whitespace-pre-line text-sm leading-7">
              {project.description ||
                "No project description was provided."}
            </p>
          </section>

          <div className="grid gap-5 border-y border-border py-5 sm:grid-cols-3">
            <ProjectDetail
              label="Status"
              value="Awaiting response"
            />

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

          <div className="rounded-r-lg border-l-2 border-chart-3/50 bg-chart-3/[0.06] py-2 pl-4 pr-3">
            <p className="text-xs leading-6 text-foreground/75">
              Accepting gives you access to the project workspace and its
              tasks. Until then, you can only review these project details.
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
              className="h-10 rounded-lg px-6 shadow-none sm:h-11"
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
      <p className="text-[0.6rem] font-semibold uppercase tracking-[0.15em] text-muted-foreground">
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

function WorkLoadError({
  onRetry,
}: {
  onRetry: () => void;
}) {
  return (
    <section className="mt-5 rounded-2xl border border-border/70 bg-muted/[0.10] px-5 py-10 sm:mt-6 sm:px-6 sm:py-12">
      <div className="max-w-md">
        <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted text-muted-foreground">
          <RefreshCwIcon size={18} />
        </span>

        <h2 className="mt-4 text-lg font-black tracking-[-0.02em]">
          Your work could not be loaded.
        </h2>

        <p className="mt-2 text-sm leading-7 text-muted-foreground">
          We couldn't retrieve your client projects and invitations.
        </p>

        <Button
          type="button"
          variant="outline"
          onClick={onRetry}
          className="mt-5 h-9 rounded-lg bg-transparent px-4 text-xs font-semibold shadow-none"
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
    <section className="mt-5 rounded-2xl border border-border/70 bg-muted/[0.08] px-5 py-10 sm:mt-6 sm:px-8 sm:py-14">
      <div className="max-w-md">
        <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted text-muted-foreground">
          <Icon size={18} />
        </span>

        <h2 className="mt-4 text-lg font-black tracking-[-0.025em] sm:mt-5 sm:text-xl">
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
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <header className="sticky top-0 z-50 border-b border-border/60 bg-background/95 backdrop-blur-xl">
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
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <header className="sticky top-0 z-50 border-b border-border/60 bg-background/95 backdrop-blur-xl">
        <div className="container mx-auto px-4 sm:px-5 md:px-8">
          <DashboardMainNav />
        </div>
      </header>

      <main className="container mx-auto flex flex-1 items-center px-5 py-20 md:px-8">
        <div className="max-w-lg">
          <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-destructive/10 text-destructive">
            <FolderOpenIcon size={21} />
          </span>

          <h1 className="mt-6 text-3xl font-black leading-tight tracking-[-0.035em]">
            We could not load your workspace.
          </h1>

          <p className="mt-3 text-sm leading-7 text-muted-foreground">
            Something interrupted the connection. Try loading the projects
            again.
          </p>

          <Button
            type="button"
            className="mt-7 h-11 rounded-lg px-6 shadow-none"
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
  if (!project.createdAt) {
    return 0;
  }

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