import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Link,
} from "react-router-dom";

import {
  ArrowDownNarrowWideIcon,
  ArrowRightIcon,
  BriefcaseBusinessIcon,
  CheckCircle2Icon,
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

import {
  toast,
} from "sonner";

import api from "@/api/axios";

import {
  useAuth,
} from "@/auth/AuthContext";

import DashboardMainNav from "@/components/DashboardMainNav";

import {
  GridView,
  ListView,
} from "@/components/ProjectCard";

import {
  Badge,
} from "@/components/ui/badge";

import {
  Button,
} from "@/components/ui/button";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import type {
  Project,
} from "@/Types/project";

import type {
  ProjectAllocatStatus,
} from "@/Types/enums";

/* =========================================================
   TYPES
========================================================= */

type ProjectView =
  | "grid"
  | "list";

type ProjectFilter =
  | "active"
  | "pending"
  | "closed";

type WorkspaceSection =
  | "projects"
  | "work";

type WorkFilter =
  | "invitations"
  | "active"
  | "completed";

type SummaryItem = {
  label: string;
  value: number;

  icon: React.ComponentType<{
    size?: number;
    className?: string;
  }>;

  emphasis?:
    | "primary"
    | "warning"
    | "success";
};

export type WorkProject =
  Project & {
    projectAllocatStatus:
      ProjectAllocatStatus;

    invitedAt?: string;

    respondedAt?:
      | string
      | null;
  };

/* =========================================================
   PAGE
========================================================= */

function Projects() {
  const {
    user,
  } = useAuth();

  const [
    workspaceSection,
    setWorkspaceSection,
  ] =
    useState<WorkspaceSection>(
      "projects",
    );

  const [
    view,
    setView,
  ] =
    useState<ProjectView>(
      "grid",
    );

  const [
    filter,
    setFilter,
  ] =
    useState<ProjectFilter>(
      "active",
    );

  const [
    workFilter,
    setWorkFilter,
  ] =
    useState<WorkFilter>(
      "active",
    );

  const [
    projects,
    setProjects,
  ] =
    useState<Project[]>(
      [],
    );

  const [
    workProjects,
    setWorkProjects,
  ] =
    useState<
      WorkProject[]
    >([]);

  const [
    loading,
    setLoading,
  ] =
    useState(true);

  const [
    workLoading,
    setWorkLoading,
  ] =
    useState(false);

  const [
    error,
    setError,
  ] =
    useState<
      Error | null
    >(null);

  /* =======================================================
     LOAD OWN PROJECTS
  ======================================================= */

  async function fetchProjects() {
    setLoading(true);
    setError(null);

    try {
      const response =
        await api.get<
          Project[]
        >(
          "/projects/mine",
          {
            withCredentials:
              true,
          },
        );

      setProjects(
        response.data,
      );
    } catch (
      err: unknown
    ) {
      if (
        err instanceof
        Error
      ) {
        setError(err);
      } else {
        setError(
          new Error(
            "An unknown error occurred.",
          ),
        );
      }
    } finally {
      setLoading(false);
    }
  }

  /* =======================================================
     LOAD ALLOCAT WORK
  ======================================================= */

  async function fetchWorkProjects() {
    if (
      !user?.isAllocat
    ) {
      return;
    }

    setWorkLoading(
      true,
    );

    try {
      const response =
        await api.get<
          WorkProject[]
        >(
          "/allocats/me/projects",
          {
            withCredentials:
              true,
          },
        );

      setWorkProjects(
        response.data,
      );
    } catch (err) {
      console.error(
        "Could not load Allocat work:",
        err,
      );

      toast.error(
        "We could not load your work.",
      );
    } finally {
      setWorkLoading(
        false,
      );
    }
  }

  useEffect(() => {
    void fetchProjects();
  }, []);

  useEffect(() => {
    if (
      workspaceSection ===
        "work" &&
      user?.isAllocat
    ) {
      void fetchWorkProjects();
    }
  }, [
    workspaceSection,
    user?.isAllocat,
  ]);

  useEffect(() => {
    if (
      !user?.isAllocat &&
      workspaceSection ===
        "work"
    ) {
      setWorkspaceSection(
        "projects",
      );
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
     CLIENT PROJECT FILTERING
  ======================================================= */

  const closedProjects =
    useMemo(() => {
      return projects.filter(
        (project) => {
          const status =
            normalizeProjectStatus(
              project.status,
            );

          return [
            "closed",
            "complete",
            "completed",
          ].includes(status);
        },
      );
    }, [projects]);

  const pendingProjects =
    useMemo(() => {
      return projects.filter(
        (project) => {
          const status =
            normalizeProjectStatus(
              project.status,
            );

          const isClosed =
            [
              "closed",
              "complete",
              "completed",
            ].includes(
              status,
            );

          if (isClosed) {
            return false;
          }

          const isPaused =
            status ===
              "paused" ||
            status ===
              "onhold";

          const hasAcceptedAllocat =
            project.hasAcceptedAllocat ===
            true;

          return (
            isPaused ||
            !hasAcceptedAllocat
          );
        },
      );
    }, [projects]);

  const activeProjects =
    useMemo(() => {
      return projects.filter(
        (project) => {
          const status =
            normalizeProjectStatus(
              project.status,
            );

          const isClosed =
            [
              "closed",
              "complete",
              "completed",
            ].includes(
              status,
            );

          const isPaused =
            status ===
              "paused" ||
            status ===
              "onhold";

          const hasAcceptedAllocat =
            project.hasAcceptedAllocat ===
            true;

          return (
            !isClosed &&
            !isPaused &&
            hasAcceptedAllocat
          );
        },
      );
    }, [projects]);

  const visibleProjects =
    useMemo(() => {
      if (
        filter ===
        "pending"
      ) {
        return pendingProjects;
      }

      if (
        filter ===
        "closed"
      ) {
        return closedProjects;
      }

      return activeProjects;
    }, [
      filter,
      activeProjects,
      pendingProjects,
      closedProjects,
    ]);

  /* =======================================================
     ALLOCAT WORK FILTERING
  ======================================================= */

  const invitations =
    useMemo(() => {
      return workProjects.filter(
        (project) =>
          project.projectAllocatStatus ===
          "Invited",
      );
    }, [workProjects]);

  const activeWork =
    useMemo(() => {
      return workProjects.filter(
        (project) => {
          if (
            project.projectAllocatStatus !==
            "Accepted"
          ) {
            return false;
          }

          const status =
            normalizeProjectStatus(
              project.status,
            );

          return ![
            "closed",
            "complete",
            "completed",
          ].includes(
            status,
          );
        },
      );
    }, [workProjects]);

  const completedWork =
    useMemo(() => {
      return workProjects.filter(
        (project) => {
          if (
            project.projectAllocatStatus !==
            "Accepted"
          ) {
            return false;
          }

          const status =
            normalizeProjectStatus(
              project.status,
            );

          return [
            "closed",
            "complete",
            "completed",
          ].includes(
            status,
          );
        },
      );
    }, [workProjects]);

  const visibleWork =
    useMemo(() => {
      if (
        workFilter ===
        "invitations"
      ) {
        return invitations;
      }

      if (
        workFilter ===
        "completed"
      ) {
        return completedWork;
      }

      return activeWork;
    }, [
      workFilter,
      invitations,
      activeWork,
      completedWork,
    ]);

  /* =======================================================
     INVITATION ACTIONS
  ======================================================= */

  async function acceptInvitation(
    projectId: string,
  ) {
    try {
      await api.patch(
        `/projects/${projectId}/allocats/invite/accept`,
        {},
        {
          withCredentials:
            true,
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

  async function declineInvitation(
    projectId: string,
  ) {
    try {
      await api.patch(
        `/projects/${projectId}/allocats/invite/decline`,
        {},
        {
          withCredentials:
            true,
        },
      );

      setWorkProjects(
        (current) =>
          current.map(
            (project) =>
              project.id ===
              projectId
                ? {
                    ...project,
                    projectAllocatStatus:
                      "Declined",
                    respondedAt:
                      new Date().toISOString(),
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
     STATES
  ======================================================= */

  if (loading) {
    return (
      <WorkspaceLoading />
    );
  }

  if (error) {
    return (
      <WorkspaceError
        onRetry={
          fetchProjects
        }
      />
    );
  }

  const showEmptyWorkspace =
    projects.length ===
      0 &&
    !user?.isAllocat;

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">

      {/* ===================================================
          NAV
      =================================================== */}

      <header className="sticky top-0 z-40 border-b border-border/70 bg-background/90 backdrop-blur-xl">
        <div className="container mx-auto px-4 sm:px-5 md:px-8">
          <DashboardMainNav />
        </div>
      </header>

      {/* ===================================================
          CONTENT
      =================================================== */}

      <main className="container mx-auto flex-1 px-5 py-8 sm:py-10 md:px-8 lg:py-12">
        {showEmptyWorkspace ? (
          <EmptyWorkspace
            firstName={
              firstName
            }
          />
        ) : (
          <div className="grid min-w-0 gap-10 xl:grid-cols-[minmax(0,1fr)_280px] xl:gap-14">

            {/* =================================================
                MAIN COLUMN
            ================================================= */}

            <section className="min-w-0">

              {/* =================================================
                  PAGE HEADER
              ================================================= */}

              <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
                <div className="min-w-0 max-w-2xl">
                  <p className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-primary">
                    Workspace
                  </p>

                  <h1 className="mt-3 break-words text-3xl font-black leading-[1.06] tracking-[-0.035em] sm:text-4xl lg:text-5xl">
                    Welcome back,{" "}
                    <span className="text-primary">
                      {firstName}.
                    </span>
                  </h1>

                  <p className="mt-4 max-w-xl text-sm leading-7 text-muted-foreground sm:text-base">
                    {workspaceSection ===
                    "projects"
                      ? "Your projects, people and progress in one place."
                      : "Projects you've joined and invitations waiting for you."}
                  </p>
                </div>

                <Button
                  asChild
                  className="group h-11 w-full shrink-0 rounded-lg px-6 shadow-none sm:w-auto"
                >
                  <Link to="/projects/new">
                    <PlusIcon
                      size={16}
                    />

                    New project

                    <ArrowRightIcon
                      size={15}
                      className="transition-transform duration-200 group-hover:translate-x-0.5"
                    />
                  </Link>
                </Button>
              </div>

              {/* =================================================
                  PRIMARY WORKSPACE TABS
              ================================================= */}

              <div className="mt-9 border-b border-border">
                <div className="flex gap-7 overflow-x-auto">
                  <WorkspaceTab
                    active={
                      workspaceSection ===
                      "projects"
                    }
                    onClick={() =>
                      setWorkspaceSection(
                        "projects",
                      )
                    }
                    icon={
                      BriefcaseBusinessIcon
                    }
                    label="My projects"
                    count={
                      projects.length
                    }
                  />

                  {user?.isAllocat && (
                    <WorkspaceTab
                      active={
                        workspaceSection ===
                        "work"
                      }
                      onClick={() =>
                        setWorkspaceSection(
                          "work",
                        )
                      }
                      icon={
                        SparklesIcon
                      }
                      label="My work"
                      count={
                        invitations.length
                      }
                      attention={
                        invitations.length >
                        0
                      }
                    />
                  )}
                </div>
              </div>

              {/* =================================================
                  MY PROJECTS
              ================================================= */}

              {workspaceSection ===
                "projects" && (
                <>
                  <WorkspaceSummary
                    items={[
                      {
                        label:
                          "Active projects",
                        value:
                          activeProjects.length,
                        icon:
                          CircleDotIcon,
                        emphasis:
                          "primary",
                      },

                      {
                        label:
                          "Pending",
                        value:
                          pendingProjects.length,
                        icon:
                          Clock3Icon,
                        emphasis:
                          "warning",
                      },

                      {
                        label:
                          "Closed",
                        value:
                          closedProjects.length,
                        icon:
                          CheckCircle2Icon,
                        emphasis:
                          "success",
                      },
                    ]}
                  />

                  <div className="mt-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                    <StatusFilters>
                      <StatusFilter
                        active={
                          filter ===
                          "active"
                        }
                        onClick={() =>
                          setFilter(
                            "active",
                          )
                        }
                        label="Active"
                        count={
                          activeProjects.length
                        }
                      />

                      <StatusFilter
                        active={
                          filter ===
                          "pending"
                        }
                        onClick={() =>
                          setFilter(
                            "pending",
                          )
                        }
                        label="Pending"
                        count={
                          pendingProjects.length
                        }
                        attention={
                          pendingProjects.length >
                          0
                        }
                      />

                      <StatusFilter
                        active={
                          filter ===
                          "closed"
                        }
                        onClick={() =>
                          setFilter(
                            "closed",
                          )
                        }
                        label="Closed"
                        count={
                          closedProjects.length
                        }
                      />
                    </StatusFilters>

                    <ViewControls
                      view={view}
                      setView={
                        setView
                      }
                    />
                  </div>

                  <ProjectResults
                    projects={
                      visibleProjects
                    }
                    view={view}
                    emptyLabel={
                      filter
                    }
                  />
                </>
              )}

              {/* =================================================
                  MY WORK
              ================================================= */}

              {workspaceSection ===
                "work" &&
                user?.isAllocat && (
                  <>
                    <WorkspaceSummary
                      items={[
                        {
                          label:
                            "Invitations",
                          value:
                            invitations.length,
                          icon:
                            InboxIcon,
                          emphasis:
                            "warning",
                        },

                        {
                          label:
                            "Active jobs",
                          value:
                            activeWork.length,
                          icon:
                            BriefcaseBusinessIcon,
                          emphasis:
                            "primary",
                        },

                        {
                          label:
                            "Completed",
                          value:
                            completedWork.length,
                          icon:
                            CheckCircle2Icon,
                          emphasis:
                            "success",
                        },
                      ]}
                    />

                    <div className="mt-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                      <StatusFilters>
                        <StatusFilter
                          active={
                            workFilter ===
                            "invitations"
                          }
                          onClick={() =>
                            setWorkFilter(
                              "invitations",
                            )
                          }
                          label="Invitations"
                          count={
                            invitations.length
                          }
                          attention={
                            invitations.length >
                            0
                          }
                        />

                        <StatusFilter
                          active={
                            workFilter ===
                            "active"
                          }
                          onClick={() =>
                            setWorkFilter(
                              "active",
                            )
                          }
                          label="Active"
                          count={
                            activeWork.length
                          }
                        />

                        <StatusFilter
                          active={
                            workFilter ===
                            "completed"
                          }
                          onClick={() =>
                            setWorkFilter(
                              "completed",
                            )
                          }
                          label="Completed"
                          count={
                            completedWork.length
                          }
                        />
                      </StatusFilters>

                      {workFilter !==
                        "invitations" && (
                        <ViewControls
                          view={
                            view
                          }
                          setView={
                            setView
                          }
                        />
                      )}
                    </div>

                    {workLoading ? (
                      <InlineLoading />
                    ) : workFilter ===
                      "invitations" ? (
                      invitations.length >
                      0 ? (
                        <div className="mt-7 divide-y divide-border border-y border-border">
                          {invitations.map(
                            (
                              project,
                            ) => (
                              <InvitationCard
                                key={
                                  project.id
                                }
                                project={
                                  project
                                }
                                onAccept={() =>
                                  acceptInvitation(
                                    project.id,
                                  )
                                }
                                onDecline={() =>
                                  declineInvitation(
                                    project.id,
                                  )
                                }
                              />
                            ),
                          )}
                        </div>
                      ) : (
                        <WorkEmptyState
                          title="No invitations"
                          description="New project invitations will appear here when a client invites you to join their work."
                          icon={
                            InboxIcon
                          }
                        />
                      )
                    ) : visibleWork.length >
                      0 ? (
                      <div
                        className={
                          view ===
                          "grid"
                            ? "mt-7 grid min-w-0 gap-4 sm:grid-cols-2 2xl:grid-cols-3"
                            : "mt-7 flex min-w-0 flex-col gap-3"
                        }
                      >
                        {visibleWork.map(
                          (
                            project,
                          ) =>
                            view ===
                            "grid" ? (
                              <GridView
                                key={
                                  project.id
                                }
                                project={
                                  project
                                }
                              />
                            ) : (
                              <ListView
                                key={
                                  project.id
                                }
                                project={
                                  project
                                }
                              />
                            ),
                        )}
                      </div>
                    ) : (
                      <WorkEmptyState
                        title={
                          workFilter ===
                          "completed"
                            ? "No completed work"
                            : "No active work"
                        }
                        description={
                          workFilter ===
                          "completed"
                            ? "Projects you complete for clients will appear here."
                            : "Projects you accept from clients will appear here."
                        }
                        icon={
                          BriefcaseBusinessIcon
                        }
                      />
                    )}
                  </>
                )}
            </section>

            {/* =================================================
                SIDEBAR
            ================================================= */}

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
  items:
    SummaryItem[];
}) {
  return (
    <section className="mt-7 border-y border-border">
      <div className="grid sm:grid-cols-3">
        {items.map(
          (
            item,
            index,
          ) => {
            const Icon =
              item.icon;

            const iconColor =
              item.emphasis ===
              "warning"
                ? "text-amber-600 dark:text-amber-300"
                : item.emphasis ===
                    "success"
                  ? "text-emerald-600 dark:text-emerald-300"
                  : "text-primary";

            return (
              <article
                key={
                  item.label
                }
                className={[
                  "flex items-center gap-4 py-5",
                  "sm:px-6",

                  index === 0
                    ? "sm:pl-0"
                    : "",

                  index >
                  0
                    ? "border-t border-border sm:border-l sm:border-t-0"
                    : "",
                ].join(" ")}
              >
                <Icon
                  size={
                    18
                  }
                  className={
                    iconColor
                  }
                />

                <div className="min-w-0">
                  <p className="text-2xl font-black tracking-[-0.035em]">
                    {
                      item.value
                    }
                  </p>

                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {
                      item.label
                    }
                  </p>
                </div>
              </article>
            );
          },
        )}
      </div>
    </section>
  );
}

/* =========================================================
   PRIMARY WORKSPACE TAB
========================================================= */

function WorkspaceTab({
  active,
  onClick,
  icon: Icon,
  label,
  count,
  attention = false,
}: {
  active:
    boolean;

  onClick:
    () => void;

  icon:
    React.ComponentType<{
      size?: number;
      className?: string;
    }>;

  label:
    string;

  count?:
    number;

  attention?:
    boolean;
}) {
  return (
    <button
      type="button"
      onClick={
        onClick
      }
      className={[
        "relative flex h-12 shrink-0 items-center gap-2.5",
        "border-b-2 px-0 text-sm font-semibold",
        "transition-colors duration-200",

        active
          ? "border-primary text-foreground"
          : "border-transparent text-muted-foreground hover:text-foreground",
      ].join(" ")}
    >
      <Icon
        size={16}
      />

      {label}

      {typeof count ===
        "number" &&
        count > 0 && (
          <span
            className={[
              "inline-flex min-w-5 items-center justify-center rounded-md px-1.5 py-0.5",
              "text-[0.62rem] font-bold",

              attention
                ? "bg-primary/12 text-primary"
                : "bg-muted text-muted-foreground",
            ].join(" ")}
          >
            {count}
          </span>
        )}

      {attention && (
        <span className="relative ml-0.5 flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-50" />

          <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
        </span>
      )}
    </button>
  );
}

/* =========================================================
   STATUS FILTER GROUP
========================================================= */

function StatusFilters({
  children,
}: {
  children:
    React.ReactNode;
}) {
  return (
    <div className="flex max-w-full gap-6 overflow-x-auto border-b border-border">
      {children}
    </div>
  );
}

/* =========================================================
   STATUS FILTER
========================================================= */

function StatusFilter({
  active,
  label,
  count,
  onClick,
  attention = false,
}: {
  active:
    boolean;

  label:
    string;

  count:
    number;

  onClick:
    () => void;

  attention?:
    boolean;
}) {
  return (
    <button
      type="button"
      onClick={
        onClick
      }
      className={[
        "relative flex h-10 shrink-0 items-center gap-2 border-b-2",
        "text-xs font-semibold transition-colors",

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
        className={[
          "text-[0.65rem]",
          active
            ? "text-primary"
            : "text-muted-foreground/70",
        ].join(" ")}
      >
        {count}
      </span>
    </button>
  );
}

/* =========================================================
   VIEW CONTROLS
========================================================= */

function ViewControls({
  view,
  setView,
}: {
  view:
    ProjectView;

  setView:
    (
      value:
        ProjectView,
    ) => void;
}) {
  return (
    <div className="flex shrink-0 items-center gap-1">

      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="h-9 rounded-lg px-3 text-xs text-muted-foreground shadow-none"
      >
        <ArrowDownNarrowWideIcon
          size={14}
        />

        <span className="hidden sm:inline">
          Title
        </span>
      </Button>

      <div className="mx-1 h-4 w-px bg-border" />

      <Button
        type="button"
        variant={
          view ===
          "grid"
            ? "secondary"
            : "ghost"
        }
        size="icon"
        className="h-9 w-9 rounded-lg shadow-none"
        onClick={() =>
          setView(
            "grid",
          )
        }
        aria-label="Grid view"
      >
        <Grid2X2Icon
          size={15}
        />
      </Button>

      <Button
        type="button"
        variant={
          view ===
          "list"
            ? "secondary"
            : "ghost"
        }
        size="icon"
        className="h-9 w-9 rounded-lg shadow-none"
        onClick={() =>
          setView(
            "list",
          )
        }
        aria-label="List view"
      >
        <LayoutListIcon
          size={16}
        />
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
}: {
  projects:
    Project[];

  view:
    ProjectView;

  emptyLabel:
    string;
}) {
  if (
    projects.length ===
    0
  ) {
    return (
      <div className="mt-7 border-y border-border py-14">
        <div className="max-w-md">
          <FolderOpenIcon
            size={23}
            className="text-muted-foreground"
          />

          <h2 className="mt-5 text-xl font-black tracking-[-0.025em]">
            No {emptyLabel}{" "}
            projects.
          </h2>

          <p className="mt-2 text-sm leading-7 text-muted-foreground">
            Projects matching this
            status will appear here.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={
        view ===
        "grid"
          ? "mt-7 grid min-w-0 gap-4 sm:grid-cols-2 2xl:grid-cols-3"
          : "mt-7 flex min-w-0 flex-col gap-3"
      }
    >
      {projects.map(
        (project) =>
          view ===
          "grid" ? (
            <GridView
              key={
                project.id
              }
              project={
                project
              }
            />
          ) : (
            <ListView
              key={
                project.id
              }
              project={
                project
              }
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
  project:
    WorkProject;

  onAccept:
    () => Promise<void>;

  onDecline:
    () => Promise<void>;
}) {
  const [
    detailsOpen,
    setDetailsOpen,
  ] =
    useState(false);

  const [
    responding,
    setResponding,
  ] =
    useState<
      | "accept"
      | "decline"
      | null
    >(null);

  async function handleAccept() {
    if (
      responding
    ) {
      return;
    }

    setResponding(
      "accept",
    );

    try {
      await onAccept();

      setDetailsOpen(
        false,
      );
    } finally {
      setResponding(
        null,
      );
    }
  }

  async function handleDecline() {
    if (
      responding
    ) {
      return;
    }

    setResponding(
      "decline",
    );

    try {
      await onDecline();

      setDetailsOpen(
        false,
      );
    } finally {
      setResponding(
        null,
      );
    }
  }

  return (
    <>
      <article className="group py-6 sm:py-7">
        <div className="grid gap-5 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-2 text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-amber-700 dark:text-amber-300">
                <SendIcon
                  size={13}
                />

                Project invitation
              </span>

              {project.invitedAt && (
                <span className="text-xs text-muted-foreground">
                  {formatShortDate(
                    project.invitedAt,
                  )}
                </span>
              )}
            </div>

            <h2 className="mt-3 text-xl font-black leading-tight tracking-[-0.025em]">
              {
                project.title
              }
            </h2>

            <p className="mt-2 line-clamp-2 max-w-2xl text-sm leading-7 text-muted-foreground">
              {
                project.description
              }
            </p>

            <button
              type="button"
              onClick={() =>
                setDetailsOpen(
                  true,
                )
              }
              className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-primary transition-colors hover:text-primary/75"
            >
              Review project

              <ArrowRightIcon
                size={13}
              />
            </button>
          </div>

          <div className="flex items-center gap-2 sm:justify-end">
            <Button
              type="button"
              variant="ghost"
              disabled={
                responding !==
                null
              }
              onClick={() =>
                void handleDecline()
              }
              className="h-10 rounded-lg px-4 text-xs text-muted-foreground shadow-none"
            >
              {responding ===
              "decline" ? (
                <LoaderCircleIcon
                  size={15}
                  className="animate-spin"
                />
              ) : (
                <XIcon
                  size={14}
                />
              )}

              Decline
            </Button>

            <Button
              type="button"
              disabled={
                responding !==
                null
              }
              onClick={() =>
                void handleAccept()
              }
              className="h-10 rounded-lg px-5 text-xs shadow-none"
            >
              {responding ===
              "accept" ? (
                <LoaderCircleIcon
                  size={15}
                  className="animate-spin"
                />
              ) : (
                <CheckCircle2Icon
                  size={14}
                />
              )}

              Accept
            </Button>
          </div>
        </div>
      </article>

      <ProjectInvitationDialog
        project={
          project
        }
        open={
          detailsOpen
        }
        onOpenChange={
          setDetailsOpen
        }
        responding={
          responding
        }
        onAccept={
          handleAccept
        }
        onDecline={
          handleDecline
        }
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
  project:
    WorkProject;

  open:
    boolean;

  onOpenChange:
    (
      open: boolean,
    ) => void;

  responding:
    | "accept"
    | "decline"
    | null;

  onAccept:
    () => Promise<void>;

  onDecline:
    () => Promise<void>;
}) {
  return (
    <Dialog
      open={
        open
      }
      onOpenChange={
        onOpenChange
      }
    >
      <DialogContent className="max-h-[90vh] overflow-y-auto rounded-[1.5rem] border-border bg-background p-0 sm:max-w-2xl">
        <DialogHeader className="border-b border-border px-6 pb-6 pt-7 text-left sm:px-8">
          <Badge
            variant="outline"
            className="mb-3 w-fit rounded-md border-amber-500/20 bg-amber-400/10 text-amber-700 dark:text-amber-300"
          >
            Project invitation
          </Badge>

          <DialogTitle className="text-2xl font-black leading-tight tracking-[-0.03em]">
            {
              project.title
            }
          </DialogTitle>

          <DialogDescription className="mt-2 max-w-xl leading-7">
            Review the project before deciding whether you want to join the work.
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
                value={
                  formatShortDate(
                    project.invitedAt,
                  )
                }
              />
            )}

            {project.dueDate && (
              <ProjectDetail
                label="Due"
                value={
                  formatShortDate(
                    project.dueDate,
                  )
                }
              />
            )}
          </div>

          <div className="border-l-2 border-primary pl-4">
            <p className="text-xs leading-6 text-muted-foreground">
              Accepting gives you access to the project workspace and its tasks. Until then, you can only review these project details.
            </p>
          </div>

          <div className="flex flex-col-reverse gap-2.5 border-t border-border pt-6 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="ghost"
              disabled={
                responding !==
                null
              }
              onClick={() =>
                void onDecline()
              }
              className="h-11 rounded-lg px-5 text-muted-foreground shadow-none"
            >
              {responding ===
              "decline" ? (
                <LoaderCircleIcon className="h-4 w-4 animate-spin" />
              ) : (
                <XIcon
                  size={15}
                />
              )}

              Decline
            </Button>

            <Button
              type="button"
              disabled={
                responding !==
                null
              }
              onClick={() =>
                void onAccept()
              }
              className="h-11 rounded-lg px-6 shadow-none"
            >
              {responding ===
              "accept" ? (
                <LoaderCircleIcon className="h-4 w-4 animate-spin" />
              ) : (
                <CheckCircle2Icon
                  size={15}
                />
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
  label:
    string;

  value:
    React.ReactNode;
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
   INLINE LOADING
========================================================= */

function InlineLoading() {
  return (
    <div className="flex min-h-56 items-center justify-center border-b border-border">
      <div className="flex items-center gap-3 text-sm text-muted-foreground">
        <LoaderCircleIcon className="h-5 w-5 animate-spin text-primary" />

        Loading your work...
      </div>
    </div>
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
  title:
    string;

  description:
    string;

  icon:
    React.ComponentType<{
      size?: number;
      className?: string;
    }>;
}) {
  return (
    <section className="mt-7 border-y border-border py-14">
      <div className="max-w-md">
        <Icon
          size={22}
          className="text-primary"
        />

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
   EMPTY WORKSPACE
========================================================= */

function EmptyWorkspace({
  firstName,
}: {
  firstName:
    string;
}) {
  return (
    <section className="flex min-h-[calc(100vh-11rem)] items-center">
      <div className="w-full max-w-3xl py-16">
        <p className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-primary">
          Welcome,{" "}
          {firstName}
        </p>

        <h1 className="mt-4 max-w-2xl text-4xl font-black leading-[1.02] tracking-[-0.04em] sm:text-5xl">
          Nothing here yet.
          <span className="block text-primary">
            Start with the work.
          </span>
        </h1>

        <p className="mt-6 max-w-xl text-sm leading-7 text-muted-foreground sm:text-base sm:leading-8">
          Create your first project, define the outcome and then bring in the Allocats with the skills to move it forward.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button
            asChild
            className="group h-11 rounded-lg px-6 shadow-none"
          >
            <Link to="/projects/new">
              <PlusIcon
                size={16}
              />

              Create project

              <ArrowRightIcon
                size={15}
                className="transition-transform group-hover:translate-x-0.5"
              />
            </Link>
          </Button>

          <Button
            asChild
            variant="ghost"
            className="h-11 rounded-lg px-5 text-muted-foreground shadow-none"
          >
            <Link to="/how-it-works">
              See how Allocatr works
            </Link>
          </Button>
        </div>

        <div className="mt-12 max-w-xl border-t border-border pt-6">
          <p className="text-xs leading-6 text-muted-foreground">
            Once a project is created, you can find Allocats, invite them to the work and follow progress from this workspace.
          </p>
        </div>
      </div>
    </section>
  );
}

/* =========================================================
   LOADING PAGE
========================================================= */

function WorkspaceLoading() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <header className="sticky top-0 z-40 border-b border-border/70 bg-background/90 backdrop-blur-xl">
        <div className="container mx-auto px-4 sm:px-5 md:px-8">
          <DashboardMainNav />
        </div>
      </header>

      <main className="container mx-auto flex flex-1 items-center px-5 py-20 md:px-8">
        <div>
          <LoaderCircleIcon className="h-6 w-6 animate-spin text-primary" />

          <h1 className="mt-6 text-2xl font-black tracking-[-0.03em]">
            Loading your workspace.
          </h1>

          <p className="mt-2 max-w-md text-sm leading-7 text-muted-foreground">
            Gathering your projects and work.
          </p>
        </div>
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
  onRetry:
    () => Promise<void>;
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
          <FolderOpenIcon
            size={24}
            className="text-destructive"
          />

          <h1 className="mt-6 text-3xl font-black leading-tight tracking-[-0.035em]">
            We could not load your workspace.
          </h1>

          <p className="mt-3 text-sm leading-7 text-muted-foreground">
            Something interrupted the connection. Try loading the projects again.
          </p>

          <Button
            type="button"
            className="mt-7 h-11 rounded-lg px-6 shadow-none"
            onClick={() =>
              void onRetry()
            }
          >
            <RefreshCwIcon
              size={15}
            />

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

        {/* Find skills */}

        <section>
          <SearchIcon
            size={20}
            className="text-primary"
          />

          <p className="mt-5 text-[0.62rem] font-semibold uppercase tracking-[0.17em] text-muted-foreground">
            Need another skill?
          </p>

          <h2 className="mt-2 text-xl font-black leading-tight tracking-[-0.025em]">
            Put another Allocat on the trail.
          </h2>

          <p className="mt-3 text-sm leading-7 text-muted-foreground">
            Browse professionals whose experience matches your next piece of work.
          </p>

          <Link
            to="/allocats"
            className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-primary transition-colors hover:text-primary/75"
          >
            Explore Allocats

            <ArrowRightIcon
              size={14}
            />
          </Link>
        </section>

        <div className="my-8 h-px bg-border" />

        {/* Tip */}

        <section>
          <LightbulbIcon
            size={19}
            className="text-amber-600 dark:text-amber-300"
          />

          <p className="mt-5 text-[0.62rem] font-semibold uppercase tracking-[0.17em] text-muted-foreground">
            Workspace tip
          </p>

          <h2 className="mt-2 font-bold">
            Start with the outcome.
          </h2>

          <p className="mt-2 text-sm leading-7 text-muted-foreground">
            A clear result makes it easier for Allocats to understand the work and break it into useful tasks.
          </p>

          <Link
            to="/how-it-works"
            className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-primary/75"
          >
            Learn more

            <ArrowRightIcon
              size={14}
            />
          </Link>
        </section>

        <div className="my-8 h-px bg-border" />

        {/* Personality */}

        <section>
          <p className="text-[0.62rem] font-semibold uppercase tracking-[0.17em] text-muted-foreground">
            Allocatr
          </p>

          <p className="mt-3 text-sm leading-7 text-muted-foreground">
            Keep the work visible. Let the skilled paws handle the execution.
          </p>
        </section>
      </div>
    </aside>
  );
}

/* =========================================================
   HELPERS
========================================================= */

function normalizeProjectStatus(
  status?: string,
) {
  return String(
    status ?? "",
  )
    .toLowerCase()
    .replace(
      /[\s_-]/g,
      "",
    );
}

function formatShortDate(
  value: string,
) {
  const date =
    new Date(
      value,
    );

  if (
    Number.isNaN(
      date.getTime(),
    )
  ) {
    return "";
  }

  return new Intl.DateTimeFormat(
    "en",
    {
      day:
        "numeric",
      month:
        "short",
      year:
        "numeric",
    },
  ).format(
    date,
  );
}

export default Projects;