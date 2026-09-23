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
  LightbulbIcon,
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

type ProjectSort =
  | "newest"
  | "oldest"
  | "title-asc"
  | "title-desc";

type SummaryItem = {
  label: string;
  value: number;
  icon: ComponentType<{
    size?: number;
    className?: string;
  }>;
  emphasis?: "primary" | "warning" | "success";
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
   STATUS CONSTANTS
========================================================= */

const CLOSED_PROJECT_STATUSES = new Set([
  "closed",
  "complete",
  "completed",
  "cancelled",
  "canceled",
]);

const PAUSED_PROJECT_STATUSES = new Set([
  "paused",
  "onhold",
]);

/* =========================================================
   SORT OPTIONS
========================================================= */

const SORT_OPTIONS: SortOption[] = [
  {
    value: "newest",
    label: "Newest first",
  },
  {
    value: "oldest",
    label: "Oldest first",
  },
  {
    value: "title-asc",
    label: "Title A–Z",
  },
  {
    value: "title-desc",
    label: "Title Z–A",
  },
];

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

  /* =======================================================
     OWN PROJECTS
  ======================================================= */

  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  /* =======================================================
     ALLOCAT WORK
  ======================================================= */

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

      setProjects(
        Array.isArray(response.data)
          ? response.data
          : [],
      );
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
    async ({
      notifyOnError = false,
    }: {
      notifyOnError?: boolean;
    } = {}) => {
      if (!user?.isAllocat) return;

      const requestUserKey =
        user.userId ??
        user.email ??
        null;

      if (!requestUserKey) return;

      setWorkLoading(true);
      setWorkError(null);

      try {
        const response = await api.get<WorkProject[]>(
          "/allocats/me/projects",
          {
            withCredentials: true,
          },
        );

        if (
          workPrefetchedForUserRef.current !==
          requestUserKey
        ) {
          return;
        }

        setWorkProjects(
          Array.isArray(response.data)
            ? response.data
            : [],
        );

        setWorkLoaded(true);
      } catch (err) {
        if (
          workPrefetchedForUserRef.current !==
          requestUserKey
        ) {
          return;
        }

        console.error("Could not load Allocat work:", err);

        setWorkError(
          "Your client work could not be loaded.",
        );

        if (notifyOnError) {
          toast.error("We could not load your work.");
        }
      } finally {
        if (
          workPrefetchedForUserRef.current ===
          requestUserKey
        ) {
          setWorkLoading(false);
        }
      }
    },
    [
      user?.isAllocat,
      user?.userId,
      user?.email,
    ],
  );

  /* =======================================================
     PROJECT UPDATE HANDLERS
  ======================================================= */

  const handleOwnedProjectUpdated = useCallback(
    (updatedProject: Project) => {
      setProjects(current =>
        current.map(project =>
          project.id === updatedProject.id
            ? {
                ...project,
                ...updatedProject,
              }
            : project,
        ),
      );
    },
    [],
  );

  const handleWorkProjectUpdated = useCallback(
    (updatedProject: Project) => {
      setWorkProjects(current =>
        current.map(project =>
          project.id === updatedProject.id
            ? {
                ...project,
                ...updatedProject,
              }
            : project,
        ),
      );
    },
    [],
  );

  /* =======================================================
     INITIAL OWN PROJECT LOAD
  ======================================================= */

  useEffect(() => {
    if (!user?.userId) return;

    void fetchProjects();
  }, [
    user?.userId,
    fetchProjects,
  ]);

  /* =======================================================
     PREFETCH ALLOCAT WORK
  ======================================================= */

  useEffect(() => {
    if (!user?.isAllocat) {
      workPrefetchedForUserRef.current = null;

      setWorkProjects([]);
      setWorkLoaded(false);
      setWorkLoading(false);
      setWorkError(null);

      return;
    }

    const userKey =
      user.userId ??
      user.email ??
      null;

    if (!userKey) return;

    if (
      workPrefetchedForUserRef.current ===
      userKey
    ) {
      return;
    }

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

  /* =======================================================
     ROLE SAFETY
  ======================================================= */

  useEffect(() => {
    if (
      !user?.isAllocat &&
      workspaceSection === "work"
    ) {
      setWorkspaceSection("projects");
    }
  }, [
    user?.isAllocat,
    workspaceSection,
  ]);

  const firstName =
    user?.fullName
      ?.trim()
      .split(/\s+/)[0] ||
    "there";

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

      const hasAcceptedAllocat =
        project.hasAcceptedAllocat === true;

      if (
        status === "active" ||
        status === "completionrequested" ||
        hasAcceptedAllocat
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
          normalizeProjectStatus(project.status) ===
          "completionrequested",
      ),
    [projects],
  );

  /* =======================================================
     OWN PROJECT FILTERING + SORTING
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

    return sortProjectItems(
      filteredProjects,
      sort,
    );
  }, [
    filter,
    activeProjects,
    pendingProjects,
    closedProjects,
    sort,
  ]);

  /* =======================================================
     ALLOCAT WORK FILTERING
  ======================================================= */

  const invitations = useMemo(() => {
    return workProjects.filter(
      project =>
        project.projectAllocatStatus ===
        "Invited",
    );
  }, [workProjects]);

  const activeWork = useMemo(() => {
    return workProjects.filter(project => {
      if (
        project.projectAllocatStatus !==
        "Accepted"
      ) {
        return false;
      }

      const status =
        normalizeProjectStatus(project.status);

      return !CLOSED_PROJECT_STATUSES.has(status);
    });
  }, [workProjects]);

  const completedWork = useMemo(() => {
    return workProjects.filter(project => {
      if (
        project.projectAllocatStatus !==
        "Accepted"
      ) {
        return false;
      }

      const status =
        normalizeProjectStatus(project.status);

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

    return sortProjectItems(
      filteredWork,
      sort,
    );
  }, [
    workFilter,
    invitations,
    activeWork,
    completedWork,
    sort,
  ]);

  /* =======================================================
     INVITATION ACTIONS
  ======================================================= */

  async function acceptInvitation(projectId: string) {
    try {
      await api.patch(
        `/projects/${projectId}/allocats/invite/accept`,
        {},
        {
          withCredentials: true,
        },
      );

      await fetchWorkProjects();

      toast.success(
        "Project invitation accepted.",
      );
    } catch (error) {
      console.error(
        "Could not accept invitation:",
        error,
      );

      toast.error(
        "The invitation could not be accepted.",
      );

      throw error;
    }
  }

  async function declineInvitation(projectId: string) {
    try {
      await api.patch(
        `/projects/${projectId}/allocats/invite/decline`,
        {},
        {
          withCredentials: true,
        },
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

      toast.success(
        "Project invitation declined.",
      );
    } catch (error) {
      console.error(
        "Could not decline invitation:",
        error,
      );

      toast.error(
        "The invitation could not be declined.",
      );

      throw error;
    }
  }

  /* =======================================================
     PAGE STATE
  ======================================================= */

  const workspaceLoading =
    loading ||
    Boolean(
      user?.isAllocat &&
        workLoading &&
        !workLoaded,
    );

  if (workspaceLoading) {
    return <WorkspaceLoading />;
  }

  if (error) {
    return (
      <WorkspaceError
        onRetry={fetchProjects}
      />
    );
  }

  const showEmptyWorkspace =
    projects.length === 0 &&
    !user?.isAllocat;

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <header className="sticky top-0 z-40 border-b border-border/70 bg-background/90 backdrop-blur-xl">
        <div className="container mx-auto px-4 sm:px-5 md:px-8">
          <DashboardMainNav />
        </div>
      </header>

      <main
        className={[
          "container mx-auto flex-1 px-5 md:px-8",
          showEmptyWorkspace
            ? "flex"
            : "py-8 sm:py-10 lg:py-12",
        ].join(" ")}
      >
        {showEmptyWorkspace ? (
          <EmptyWorkspace firstName={firstName} />
        ) : (
          <div
            className={[
              "grid min-w-0 flex-1 gap-10",
              "xl:grid-cols-[minmax(0,1fr)_260px]",
              "xl:gap-12",
            ].join(" ")}
          >
            <section className="min-w-0">
              <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
                <div className="min-w-0 max-w-2xl">
                  <div className="flex items-center gap-2.5">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-secondary shadow-sm shadow-primary/10">
                      <BriefcaseBusinessIcon size={15} />
                    </span>

                    <p className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                      Workspace
                    </p>
                  </div>

                  <h1
                    className={[
                      "mt-5 break-words",
                      "text-3xl font-black leading-[1.06]",
                      "tracking-[-0.035em]",
                      "sm:text-4xl lg:text-5xl",
                    ].join(" ")}
                  >
                    Welcome back, {firstName}.
                  </h1>

                  <p className="mt-4 max-w-xl text-sm leading-7 text-muted-foreground sm:text-base">
                    {workspaceSection === "projects"
                      ? "Your projects, people and progress in one place."
                      : "Projects you've joined and invitations waiting for you."}
                  </p>
                </div>

                <Button
                  asChild
                  className="group h-11 w-full shrink-0 rounded-lg px-6 shadow-none sm:w-auto"
                >
                  <Link to="/projects/new">
                    <PlusIcon size={16} />

                    New project

                    <ArrowRightIcon
                      size={15}
                      className="transition-transform duration-200 group-hover:translate-x-0.5"
                    />
                  </Link>
                </Button>
              </div>

              {user?.isAllocat && (
                <div className="mt-9">
                  <div
                    className={[
                      "inline-flex max-w-full items-center",
                      "rounded-full border border-border/70",
                      "bg-muted/30 p-1",
                    ].join(" ")}
                  >
                    <WorkspaceTab
                      active={workspaceSection === "projects"}
                      onClick={() => setWorkspaceSection("projects")}
                      icon={BriefcaseBusinessIcon}
                      label="My projects"
                      count={projects.length}
                    />

                    <WorkspaceTab
                      active={workspaceSection === "work"}
                      onClick={() => setWorkspaceSection("work")}
                      icon={SparklesIcon}
                      label="My work"
                      count={invitations.length + activeWork.length}
                      attention={invitations.length > 0}
                    />
                  </div>
                </div>
              )}

              {workspaceSection === "projects" && (
                <>
                  <WorkspaceSummary
                    items={[
                      {
                        label: "Active projects",
                        value: activeProjects.length,
                        icon: CircleDotIcon,
                        emphasis: "primary",
                      },
                      {
                        label: "Pending",
                        value: pendingProjects.length,
                        icon: Clock3Icon,
                        emphasis: "warning",
                      },
                      {
                        label: "Completed",
                        value: closedProjects.length,
                        icon: CheckCircle2Icon,
                        emphasis: "success",
                      },
                    ]}
                  />

                  <div className="mt-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                    <StatusFilters>
                      <StatusFilter
                        active={filter === "active"}
                        onClick={() => setFilter("active")}
                        label="Active"
                        count={activeProjects.length}
                        attention={completionRequests.length > 0}
                      />

                      <StatusFilter
                        active={filter === "pending"}
                        onClick={() => setFilter("pending")}
                        label="Pending"
                        count={pendingProjects.length}
                        attention={pendingProjects.length > 0}
                      />

                      <StatusFilter
                        active={filter === "closed"}
                        onClick={() => setFilter("closed")}
                        label="Completed"
                        count={closedProjects.length}
                      />
                    </StatusFilters>

                    <ProjectControls
                      sort={sort}
                      setSort={setSort}
                      view={view}
                      setView={setView}
                    />
                  </div>

                  <ProjectResults
                    projects={visibleProjects}
                    view={view}
                    emptyLabel={
                      filter === "closed"
                        ? "completed"
                        : filter
                    }
                    onProjectUpdated={handleOwnedProjectUpdated}
                  />
                </>
              )}

              {workspaceSection === "work" && user?.isAllocat && (
                <>
                  <WorkspaceSummary
                    items={[
                      {
                        label: "Invitations",
                        value: invitations.length,
                        icon: InboxIcon,
                        emphasis: "warning",
                      },
                      {
                        label: "Active jobs",
                        value: activeWork.length,
                        icon: BriefcaseBusinessIcon,
                        emphasis: "primary",
                      },
                      {
                        label: "Completed",
                        value: completedWork.length,
                        icon: CheckCircle2Icon,
                        emphasis: "success",
                      },
                    ]}
                  />

                  <div className="mt-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                    <StatusFilters>
                      <StatusFilter
                        active={workFilter === "invitations"}
                        onClick={() => setWorkFilter("invitations")}
                        label="Invitations"
                        count={invitations.length}
                        attention={invitations.length > 0}
                      />

                      <StatusFilter
                        active={workFilter === "active"}
                        onClick={() => setWorkFilter("active")}
                        label="Active"
                        count={activeWork.length}
                      />

                      <StatusFilter
                        active={workFilter === "completed"}
                        onClick={() => setWorkFilter("completed")}
                        label="Completed"
                        count={completedWork.length}
                      />
                    </StatusFilters>

                    {workFilter !== "invitations" && (
                      <ProjectControls
                        sort={sort}
                        setSort={setSort}
                        view={view}
                        setView={setView}
                      />
                    )}
                  </div>

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
                      <div className="mt-7 divide-y divide-border border-y border-border">
                        {sortProjectItems(
                          invitations,
                          sort,
                        ).map(project => (
                          <InvitationCard
                            key={project.id}
                            project={project}
                            onAccept={() =>
                              acceptInvitation(project.id)
                            }
                            onDecline={() =>
                              declineInvitation(project.id)
                            }
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
            </section>

            <DashboardSidebar />
          </div>
        )}
      </main>
    </div>
  );
}

/* =========================================================
   SUMMARY
========================================================= */

function WorkspaceSummary({
  items,
}: {
  items: SummaryItem[];
}) {
  return (
    <section className="mt-7">
      <div className="grid gap-3 sm:grid-cols-3">
        {items.map(item => {
          const Icon = item.icon;

          const iconStyle =
            item.emphasis === "success"
              ? "bg-emerald-500/[0.06] text-emerald-700 dark:text-emerald-300"
              : item.emphasis === "warning"
                ? "bg-amber-500/[0.06] text-amber-700 dark:text-amber-300"
                : "bg-primary/[0.05] text-primary";

          const accentStyle =
            item.emphasis === "success"
              ? "bg-emerald-500/20"
              : item.emphasis === "warning"
                ? "bg-amber-500/20"
                : "bg-primary/15";

          return (
            <article
              key={item.label}
              className={[
                "relative overflow-hidden rounded-xl",
                "border border-border/50",
                "bg-muted/[0.06]",
                "px-4 py-4 sm:px-5",
              ].join(" ")}
            >
              <span
                className={[
                  "absolute bottom-4 left-0 top-4",
                  "w-px rounded-full",
                  accentStyle,
                ].join(" ")}
              />

              <div className="flex items-center justify-between gap-5">
                <div className="min-w-0">
                  <p className="text-[0.59rem] font-semibold uppercase tracking-[0.13em] text-muted-foreground">
                    {item.label}
                  </p>

                  <p className="mt-2 text-[1.75rem] font-black leading-none tracking-[-0.045em] tabular-nums">
                    {item.value}
                  </p>
                </div>

                <span
                  className={[
                    "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
                    iconStyle,
                  ].join(" ")}
                >
                  <Icon size={15} />
                </span>
              </div>
            </article>
          );
        })}
      </div>
    </section>
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
  loadingCount = false,
}: {
  active: boolean;
  onClick: () => void;
  icon: ComponentType<{
    size?: number;
    className?: string;
  }>;
  label: string;
  count?: number;
  attention?: boolean;
  loadingCount?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={[
        "relative flex h-9 shrink-0 items-center gap-2 rounded-full px-4",
        "text-xs font-semibold transition-colors duration-200",
        active
          ? "text-foreground"
          : "text-muted-foreground hover:text-foreground",
      ].join(" ")}
    >
      {active && (
        <motion.span
          layoutId="workspace-active-tab"
          className={[
            "absolute inset-0 rounded-full",
            "bg-background",
            "shadow-sm shadow-black/[0.035]",
            "ring-1 ring-inset ring-border/60",
            "dark:shadow-black/20",
          ].join(" ")}
          transition={{
            type: "spring",
            stiffness: 500,
            damping: 38,
          }}
        />
      )}

      <span className="relative z-10 flex items-center gap-2">
        <span className="relative flex items-center">
          {attention && !loadingCount && (
            <span className="absolute -right-1.5 -top-1 flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-25" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-primary" />
            </span>
          )}

          <Icon
            size={14}
            className={
              active || attention
                ? "text-primary"
                : ""
            }
          />
        </span>

        <span>{label}</span>

        {loadingCount ? (
          <LoaderCircleIcon
            size={12}
            className="animate-spin text-primary"
          />
        ) : typeof count === "number" && count > 0 ? (
          <span
            className={[
              "text-[0.62rem] font-bold tabular-nums",
              active
                ? "text-foreground/60"
                : attention
                  ? "text-primary"
                  : "text-muted-foreground/70",
            ].join(" ")}
          >
            {count}
          </span>
        ) : null}
      </span>
    </button>
  );
}

/* =========================================================
   STATUS FILTERS
========================================================= */

function StatusFilters({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="flex max-w-full gap-6 overflow-x-auto border-b border-border/70">
      {children}
    </div>
  );
}

function StatusFilter({
  active,
  label,
  count,
  onClick,
  attention = false,
}: {
  active: boolean;
  label: string;
  count: number;
  onClick: () => void;
  attention?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "relative flex h-10 shrink-0 items-center gap-2",
        "border-b-2 text-xs font-semibold",
        "transition-colors duration-200",
        active
          ? "border-primary text-foreground"
          : "border-transparent text-muted-foreground hover:text-foreground",
      ].join(" ")}
    >
      {attention && (
        <span className="h-1.5 w-1.5 rounded-full bg-primary" />
      )}

      {label}

      <span
        className={
          active
            ? [
                "rounded-md bg-primary/[0.08]",
                "px-1.5 py-0.5",
                "text-[0.6rem] font-bold text-foreground",
              ].join(" ")
            : "text-[0.65rem] text-muted-foreground/65"
        }
      >
        {count}
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
            "h-9 rounded-lg px-2.5",
            "text-xs font-medium text-muted-foreground",
            "shadow-none transition-colors duration-200",
            "hover:bg-muted/40 hover:text-foreground",
            "data-[state=open]:bg-muted/40",
            "data-[state=open]:text-foreground",
          ].join(" ")}
        >
          <ArrowDownNarrowWideIcon
            size={14}
            className="shrink-0"
          />

          <span className="hidden sm:inline">
            Sort by
          </span>

          <span className="relative hidden min-w-[76px] overflow-hidden text-left sm:block">
            <AnimatePresence
              mode="wait"
              initial={false}
            >
              <motion.span
                key={value}
                initial={{
                  opacity: 0,
                  y: 4,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                exit={{
                  opacity: 0,
                  y: -4,
                }}
                transition={{
                  duration: 0.14,
                }}
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
          const active =
            option.value === value;

          return (
            <DropdownMenuItem
              key={option.value}
              onSelect={() => onChange(option.value)}
              className={[
                "rounded-lg px-3 py-2.5",
                "text-xs transition-colors",
                active
                  ? "bg-muted/60 font-semibold"
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
          "h-9 w-9 rounded-lg shadow-none",
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
          "h-9 w-9 rounded-lg shadow-none",
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
      <div className="mt-7 border-y border-border py-14">
        <div className="max-w-md">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted text-muted-foreground">
            <FolderOpenIcon size={19} />
          </span>

          <h2 className="mt-5 text-xl font-black tracking-[-0.025em]">
            No {emptyLabel} projects.
          </h2>

          <p className="mt-2 text-sm leading-7 text-muted-foreground">
            Projects matching this status will appear here.
          </p>
        </div>
      </div>
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
              "mt-7 grid min-w-0 gap-4",
              "sm:grid-cols-2",
              "lg:grid-cols-3",
              "2xl:grid-cols-4",
            ].join(" ")
          : "mt-7 flex min-w-0 flex-col gap-3"
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
    "accept" | "decline" | null
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
      <article className="group py-6 sm:py-7">
        <div className="grid gap-5 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-2 text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-foreground">
                <span className="flex h-6 w-6 items-center justify-center rounded-md bg-primary/[0.08] text-primary">
                  <SendIcon size={11} />
                </span>

                Project invitation
              </span>

              {project.invitedAt && (
                <span className="text-xs text-muted-foreground">
                  {formatShortDate(project.invitedAt)}
                </span>
              )}
            </div>

            <h2 className="mt-3 text-xl font-black leading-tight tracking-[-0.025em]">
              {project.title}
            </h2>

            <p className="mt-2 line-clamp-2 max-w-2xl text-sm leading-7 text-muted-foreground">
              {project.description}
            </p>

            <button
              type="button"
              onClick={() => setDetailsOpen(true)}
              className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-foreground transition-colors hover:text-muted-foreground"
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
              className="h-10 rounded-lg px-4 text-xs text-muted-foreground shadow-none hover:bg-muted/40 hover:text-foreground"
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
              className="h-10 rounded-lg px-5 text-xs shadow-none"
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
        <DialogHeader className="border-b border-border px-6 pb-6 pt-7 text-left sm:px-8">
          <Badge
            variant="outline"
            className="mb-3 w-fit rounded-md border-primary/15 bg-primary/[0.06] text-primary"
          >
            Project invitation
          </Badge>

          <DialogTitle className="text-2xl font-black leading-tight tracking-[-0.03em]">
            {project.title}
          </DialogTitle>

          <DialogDescription className="mt-2 max-w-xl leading-7">
            Review the project before deciding whether you want to join
            the work.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-7 px-6 py-7 sm:px-8">
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

          <div className="rounded-r-lg border-l-2 border-primary/50 bg-primary/[0.035] py-2 pl-4 pr-3">
            <p className="text-xs leading-6 text-muted-foreground">
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
              className="h-11 rounded-lg px-5 text-muted-foreground shadow-none hover:bg-muted/40 hover:text-foreground"
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
              className="h-11 rounded-lg px-6 shadow-none"
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
    <section className="mt-7 border-y border-border py-12">
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
   EMPTY WORK STATE
========================================================= */

function WorkEmptyState({
  title,
  description,
  icon: Icon,
}: {
  title: string;
  description: string;
  icon: ComponentType<{
    size?: number;
    className?: string;
  }>;
}) {
  return (
    <section className="mt-7 border-y border-border py-14">
      <div className="max-w-md">
        <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted text-muted-foreground">
          <Icon size={18} />
        </span>

        <h2 className="mt-5 text-xl font-black tracking-[-0.025em]">
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
   EMPTY CLIENT WORKSPACE
========================================================= */

function EmptyWorkspace({
  firstName,
}: {
  firstName: string;
}) {
  return (
    <section className="flex min-h-[calc(100vh-5rem)] w-full items-center justify-center py-12">
      <div className="w-full max-w-xl text-center">
        <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-secondary shadow-sm shadow-primary/10">
          <FolderOpenIcon size={20} />
        </span>

        <p className="mt-6 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          Welcome, {firstName}
        </p>

        <h1 className="mt-3 text-3xl font-black leading-[1.06] tracking-[-0.035em] sm:text-4xl">
          Create your first project.
        </h1>

        <p className="mx-auto mt-4 max-w-lg text-sm leading-7 text-muted-foreground sm:text-base">
          Define what you need done, bring in the right Allocats and keep
          the work organised from one workspace.
        </p>

        <div className="mt-8 flex flex-col items-center justify-center gap-2 sm:flex-row">
          <Button
            asChild
            className="group h-11 w-full rounded-lg px-6 shadow-none sm:w-auto"
          >
            <Link to="/projects/new">
              <PlusIcon size={16} />

              Create project

              <ArrowRightIcon
                size={15}
                className="transition-transform duration-200 group-hover:translate-x-0.5"
              />
            </Link>
          </Button>

          <Button
            asChild
            variant="ghost"
            className="h-11 w-full rounded-lg px-5 text-muted-foreground shadow-none hover:bg-muted/40 hover:text-foreground sm:w-auto"
          >
            <Link to="/how-it-works">
              See how it works
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

/* =========================================================
   WORKSPACE LOADING
========================================================= */

function WorkspaceLoading() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <header className="sticky top-0 z-40 border-b border-border/70 bg-background/90 backdrop-blur-xl">
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
   ERROR PAGE
========================================================= */

function WorkspaceError({
  onRetry,
}: {
  onRetry: () => Promise<void>;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <header className="sticky top-0 z-40 border-b border-border/70 bg-background/90 backdrop-blur-xl">
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
   SIDEBAR
========================================================= */

function DashboardSidebar() {
  return (
    <aside className="hidden min-w-0 xl:block">
      <div className="sticky top-28">
        <section>
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/[0.07] text-primary">
            <SearchIcon size={17} />
          </span>

          <p className="mt-5 text-[0.62rem] font-semibold uppercase tracking-[0.17em] text-muted-foreground">
            Need another skill?
          </p>

          <h2 className="mt-2 text-xl font-black leading-tight tracking-[-0.025em]">
            Put another Allocat on the trail.
          </h2>

          <p className="mt-3 text-sm leading-7 text-muted-foreground">
            Browse professionals whose experience matches your next piece
            of work.
          </p>

          <Link
            to="/allocats"
            className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-foreground transition-colors hover:text-muted-foreground"
          >
            Explore Allocats
            <ArrowRightIcon size={14} />
          </Link>
        </section>

        <div className="my-8 h-px bg-border/70" />

        <section>
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/[0.07] text-primary">
            <LightbulbIcon size={17} />
          </span>

          <p className="mt-5 text-[0.62rem] font-semibold uppercase tracking-[0.17em] text-muted-foreground">
            Workspace tip
          </p>

          <h2 className="mt-2 font-bold">
            Start with the outcome.
          </h2>

          <p className="mt-2 text-sm leading-7 text-muted-foreground">
            A clear result makes it easier for Allocats to understand the
            work and break it into useful tasks.
          </p>

          <Link
            to="/how-it-works"
            className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-foreground transition-colors hover:text-muted-foreground"
          >
            Learn more
            <ArrowRightIcon size={14} />
          </Link>
        </section>

        <div className="my-8 h-px bg-border/70" />

        <section>
          <p className="text-[0.62rem] font-semibold uppercase tracking-[0.17em] text-muted-foreground">
            Allocatr
          </p>

          <p className="mt-3 text-sm leading-7 text-muted-foreground">
            Keep the work visible. Let the skilled paws handle the
            execution.
          </p>
        </section>
      </div>
    </aside>
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

  return Number.isNaN(date.getTime())
    ? 0
    : date.getTime();
}

function sortProjectItems<T extends Project>(
  items: T[],
  sort: ProjectSort,
): T[] {
  const copy = [...items];

  copy.sort((first, second) => {
    if (sort === "oldest") {
      return (
        getProjectDateValue(first) -
        getProjectDateValue(second)
      );
    }

    if (sort === "title-asc") {
      return first.title.localeCompare(
        second.title,
        undefined,
        {
          sensitivity: "base",
        },
      );
    }

    if (sort === "title-desc") {
      return second.title.localeCompare(
        first.title,
        undefined,
        {
          sensitivity: "base",
        },
      );
    }

    return (
      getProjectDateValue(second) -
      getProjectDateValue(first)
    );
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