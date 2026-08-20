import {
  useEffect,
  useMemo,
  useState,
} from "react";
import { Link } from "react-router-dom";

import {
  ArrowDownNarrowWideIcon,
  ArrowRightIcon,
  BellRingIcon,
  BriefcaseBusinessIcon,
  CheckCircle2Icon,
  CircleDotIcon,
  Clock3Icon,
  FolderOpenIcon,
  Grid2X2Icon,
  HistoryIcon,
  InboxIcon,
  LayoutListIcon,
  LightbulbIcon,
  LoaderCircleIcon,
  MegaphoneIcon,
  MessageSquareTextIcon,
  PlusIcon,
  RefreshCwIcon,
  SendIcon,
  SparklesIcon,
  XIcon,
} from "lucide-react";

import { toast } from "sonner";

import api from "@/api/axios";
import Electricians from "@/assets/electrician-wide.svg";

import { useAuth } from "@/auth/AuthContext";

import DashboardMainNav from "@/components/DashboardMainNav";

import {
  GridView,
  ListView,
} from "@/components/ProjectCard";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import type { Project } from "@/Types/project";
import type { ProjectAllocatStatus } from "@/Types/enums";

type ProjectView = "grid" | "list";

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

type SummaryTone =
  | "primary"
  | "amber"
  | "emerald";

type SummaryItem = {
  label: string;
  value: number;

  icon: React.ComponentType<{
    size?: number;
    className?: string;
  }>;

  tone?: SummaryTone;
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

function Projects() {
  const { user } = useAuth();

  const [
    workspaceSection,
    setWorkspaceSection,
  ] = useState<WorkspaceSection>(
    "projects",
  );

  const [view, setView] =
    useState<ProjectView>("grid");

  const [filter, setFilter] =
    useState<ProjectFilter>("active");

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
    useState<Project[]>([]);

  const [
    workProjects,
    setWorkProjects,
  ] =
    useState<WorkProject[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [
    workLoading,
    setWorkLoading,
  ] =
    useState(false);

  const [error, setError] =
    useState<Error | null>(null);

  /*
   * ==============================================
   * LOAD PROJECTS OWNED BY USER
   * ==============================================
   */

  async function fetchProjects() {
    setLoading(true);
    setError(null);

    try {
      const response =
        await api.get<Project[]>(
          "/projects/mine",
          {
            withCredentials: true,
          },
        );

      setProjects(
        response.data,
      );
    } catch (err: unknown) {
      if (
        err instanceof Error
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

  /*
   * ==============================================
   * LOAD ALLOCAT WORK
   * ==============================================
   */

  async function fetchWorkProjects() {
    if (!user?.isAllocat) {
      return;
    }

    setWorkLoading(true);

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

  /*
   * ==============================================
   * CLIENT PROJECT FILTERING
   * ==============================================
   */

  const closedProjects =
    useMemo(() => {
      return projects.filter(
        (project) => {
          const status =
            normalizeProjectStatus(
              project.status,
            );

          return (
            status === "closed" ||
            status === "complete" ||
            status === "completed"
          );
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
            status === "closed" ||
            status === "complete" ||
            status === "completed";

          if (isClosed) {
            return false;
          }

          const isPaused =
            status === "paused" ||
            status === "onhold";

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
            status === "closed" ||
            status === "complete" ||
            status === "completed";

          const isPaused =
            status === "paused" ||
            status === "onhold";

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
        filter === "pending"
      ) {
        return pendingProjects;
      }

      if (
        filter === "closed"
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

  /*
   * ==============================================
   * ALLOCAT WORK FILTERING
   * ==============================================
   */

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
          ].includes(status);
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
          ].includes(status);
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

  /*
   * ==============================================
   * INVITATION ACTIONS
   * ==============================================
   */

  async function acceptInvitation(
    projectId: string,
  ) {
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
    projects.length === 0 &&
    !user?.isAllocat;

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground transition-colors">
      <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur-xl">
        <div className="container mx-auto px-4 sm:px-5 md:px-8">
          <DashboardMainNav />
        </div>
      </header>

      <main className="container mx-auto flex-1 px-5 py-8 sm:py-10 md:px-8 lg:py-12">
        {showEmptyWorkspace ? (
          <EmptyWorkspace
            firstName={
              firstName
            }
          />
        ) : (
          <div className="grid min-w-0 gap-8 xl:grid-cols-[minmax(0,1fr)_340px] xl:gap-10">
            <section className="min-w-0">
              {/* PAGE HEADER */}

              <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
                <div className="min-w-0">
                  <p className="mb-3 text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-primary sm:text-xs">
                    Your workspace
                  </p>

                  <h1 className="break-words text-3xl font-black uppercase leading-[0.96] tracking-[-0.035em] sm:text-4xl lg:text-5xl">
                    Welcome back,{" "}
                    <span className="text-primary">
                      {firstName}.
                    </span>
                  </h1>

                  <p className="mt-4 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
                    {workspaceSection ===
                    "projects"
                      ? "Manage the projects you've created and the people helping you complete them."
                      : "Manage invitations and projects you're working on for other clients."}
                  </p>
                </div>

                <Button
                  asChild
                  className="h-12 w-full shrink-0 rounded-full px-7 shadow-none sm:w-auto"
                >
                  <Link to="/projects/new">
                    <PlusIcon
                      size={17}
                    />

                    New project
                  </Link>
                </Button>
              </div>

              {/* MAIN WORKSPACE TABS */}

              <div className="mt-8 flex gap-2 overflow-x-auto border-b border-border">
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

              {/* ==========================================
                  MY PROJECTS
                  ========================================== */}

              {workspaceSection ===
                "projects" && (
                <>
                  <div className="mt-6">
                    <WorkspaceSummary
                      items={[
                        {
                          label:
                            "Active projects",
                          value:
                            activeProjects.length,
                          icon:
                            CircleDotIcon,
                          tone:
                            "primary",
                        },
                        {
                          label:
                            "Pending",
                          value:
                            pendingProjects.length,
                          icon:
                            Clock3Icon,
                          tone:
                            "amber",
                        },
                        {
                          label:
                            "Closed",
                          value:
                            closedProjects.length,
                          icon:
                            CheckCircle2Icon,
                          tone:
                            "emerald",
                        },
                      ]}
                    />
                  </div>

                  <div className="mt-6 flex flex-col gap-4 border-b border-border py-5 lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex max-w-full gap-2 overflow-x-auto pb-1">
                      <FilterButton
                        active={
                          filter ===
                          "active"
                        }
                        onClick={() =>
                          setFilter(
                            "active",
                          )
                        }
                        icon={
                          CircleDotIcon
                        }
                        label="Active"
                        count={
                          activeProjects.length
                        }
                      />

                      <FilterButton
                        active={
                          filter ===
                          "pending"
                        }
                        onClick={() =>
                          setFilter(
                            "pending",
                          )
                        }
                        icon={
                          Clock3Icon
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

                      <FilterButton
                        active={
                          filter ===
                          "closed"
                        }
                        onClick={() =>
                          setFilter(
                            "closed",
                          )
                        }
                        icon={
                          CheckCircle2Icon
                        }
                        label="Closed"
                        count={
                          closedProjects.length
                        }
                      />
                    </div>

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

              {/* ==========================================
                  MY WORK
                  ========================================== */}

              {workspaceSection ===
                "work" &&
                user?.isAllocat && (
                  <>
                    <div className="mt-6">
                      <WorkspaceSummary
                        items={[
                          {
                            label:
                              "Invitations",
                            value:
                              invitations.length,
                            icon:
                              InboxIcon,
                            tone:
                              "amber",
                          },
                          {
                            label:
                              "Active jobs",
                            value:
                              activeWork.length,
                            icon:
                              BriefcaseBusinessIcon,
                            tone:
                              "primary",
                          },
                          {
                            label:
                              "Completed",
                            value:
                              completedWork.length,
                            icon:
                              CheckCircle2Icon,
                            tone:
                              "emerald",
                          },
                        ]}
                      />
                    </div>

                    <div className="mt-6 flex flex-col gap-4 border-b border-border py-5 lg:flex-row lg:items-center lg:justify-between">
                      <div className="flex max-w-full gap-2 overflow-x-auto pb-1">
                        <FilterButton
                          active={
                            workFilter ===
                            "invitations"
                          }
                          onClick={() =>
                            setWorkFilter(
                              "invitations",
                            )
                          }
                          icon={
                            InboxIcon
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

                        <FilterButton
                          active={
                            workFilter ===
                            "active"
                          }
                          onClick={() =>
                            setWorkFilter(
                              "active",
                            )
                          }
                          icon={
                            CircleDotIcon
                          }
                          label="Active"
                          count={
                            activeWork.length
                          }
                        />

                        <FilterButton
                          active={
                            workFilter ===
                            "completed"
                          }
                          onClick={() =>
                            setWorkFilter(
                              "completed",
                            )
                          }
                          icon={
                            CheckCircle2Icon
                          }
                          label="Completed"
                          count={
                            completedWork.length
                          }
                        />
                      </div>

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
                      <div className="flex min-h-64 flex-col items-center justify-center">
                        <LoaderCircleIcon className="h-7 w-7 animate-spin text-primary" />

                        <p className="mt-4 text-sm text-muted-foreground">
                          Loading your
                          work...
                        </p>
                      </div>
                    ) : workFilter ===
                      "invitations" ? (
                      invitations.length >
                      0 ? (
                        <div className="mt-6 grid gap-5 sm:grid-cols-2 2xl:grid-cols-3">
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
                          description="New project invitations from clients will appear here."
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
                            ? "mt-6 grid min-w-0 gap-5 sm:grid-cols-2 2xl:grid-cols-3"
                            : "mt-6 flex min-w-0 flex-col gap-4"
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

            <DashboardSidebar />
          </div>
        )}
      </main>
    </div>
  );
}

/*
 * ==============================================
 * SUMMARY
 * ==============================================
 */

function WorkspaceSummary({
  items,
}: {
  items: SummaryItem[];
}) {
  return (
    <section className="overflow-hidden rounded-[1.5rem] border border-border bg-card text-card-foreground">
      <div className="grid sm:grid-cols-3">
        {items.map(
          (item, index) => {
            const Icon =
              item.icon;

            const iconStyle =
              item.tone ===
              "amber"
                ? "bg-amber-300/15 text-amber-700 dark:bg-amber-400/10 dark:text-amber-300"
                : item.tone ===
                    "emerald"
                  ? "bg-emerald-400/10 text-emerald-700 dark:text-emerald-300"
                  : "bg-primary/10 text-primary";

            return (
              <article
                key={
                  item.label
                }
                className={[
                  "flex items-center gap-4 px-5 py-5 sm:px-6",
                  index > 0
                    ? "border-t border-border sm:border-l sm:border-t-0"
                    : "",
                ].join(" ")}
              >
                <span
                  className={[
                    "flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl",
                    iconStyle,
                  ].join(" ")}
                >
                  <Icon
                    size={19}
                  />
                </span>

                <div className="min-w-0">
                  <p className="text-2xl font-black tracking-[-0.03em]">
                    {
                      item.value
                    }
                  </p>

                  <p className="mt-0.5 truncate text-xs font-medium text-muted-foreground">
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

/*
 * ==============================================
 * WORKSPACE TAB
 * ==============================================
 */

function WorkspaceTab({
  active,
  onClick,
  icon: Icon,
  label,
  count,
  attention = false,
}: {
  active: boolean;

  onClick:
    () => void;

  icon: React.ComponentType<{
    size?: number;
    className?: string;
  }>;

  label: string;

  count?: number;

  attention?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "relative flex h-12 shrink-0 items-center gap-2 px-4",
        "text-sm font-semibold transition-colors",
        active
          ? "text-foreground"
          : "text-muted-foreground hover:text-foreground",
      ].join(" ")}
    >
      {attention && (
        <span className="relative flex h-2.5 w-2.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-60" />
          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-primary" />
        </span>
      )}

      <Icon size={16} />

      {label}

      {typeof count ===
        "number" &&
        count > 0 && (
          <span
            className={[
              "rounded-full px-2 py-0.5 text-[0.65rem] font-bold",
              attention
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground",
            ].join(" ")}
          >
            {count}
          </span>
        )}

      {active && (
        <span className="absolute inset-x-3 bottom-0 h-0.5 rounded-full bg-primary" />
      )}
    </button>
  );
}

/*
 * ==============================================
 * FILTER BUTTON
 * ==============================================
 */

function FilterButton({
  active,
  label,
  count,
  onClick,
  icon: Icon,
  attention = false,
}: {
  active: boolean;

  label: string;

  count: number;

  onClick:
    () => void;

  icon: React.ComponentType<{
    size?: number;
    className?: string;
  }>;

  attention?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "relative inline-flex h-10 shrink-0 items-center gap-2 rounded-full border px-4",
        "text-xs font-semibold transition-colors",
        active
          ? "border-primary/30 bg-primary/15 text-foreground"
          : "border-border bg-card text-muted-foreground hover:text-foreground",
      ].join(" ")}
    >
      {attention && (
        <span className="relative flex h-2.5 w-2.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-60" />

          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-primary" />
        </span>
      )}

      {attention ? (
        <BellRingIcon
          size={15}
          className="text-amber-600 dark:text-primary"
        />
      ) : (
        <Icon size={15} />
      )}

      {label}

      <span
        className={[
          "rounded-full px-2 py-0.5 text-[0.65rem]",
          attention
            ? "bg-primary text-background"
            : active
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-muted-foreground",
        ].join(" ")}
      >
        {count}
      </span>
    </button>
  );
}

/*
 * ==============================================
 * VIEW CONTROLS
 * ==============================================
 */

function ViewControls({
  view,
  setView,
}: {
  view: ProjectView;

  setView: (
    value: ProjectView,
  ) => void;
}) {
  return (
    <div className="flex items-center gap-1 self-end rounded-full border border-border bg-card p-1 text-card-foreground lg:self-auto">
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="h-9 rounded-full px-3 text-xs"
      >
        <HistoryIcon
          size={15}
        />

        <span className="hidden sm:inline">
          History
        </span>
      </Button>

      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="h-9 rounded-full px-3 text-xs"
      >
        <ArrowDownNarrowWideIcon
          size={15}
        />

        <span className="hidden sm:inline">
          Title
        </span>
      </Button>

      <div className="mx-1 h-5 w-px bg-border" />

      <Button
        type="button"
        variant={
          view === "grid"
            ? "secondary"
            : "ghost"
        }
        size="icon"
        className="h-9 w-9 rounded-full"
        onClick={() =>
          setView("grid")
        }
      >
        <Grid2X2Icon
          size={16}
        />
      </Button>

      <Button
        type="button"
        variant={
          view === "list"
            ? "secondary"
            : "ghost"
        }
        size="icon"
        className="h-9 w-9 rounded-full"
        onClick={() =>
          setView("list")
        }
      >
        <LayoutListIcon
          size={17}
        />
      </Button>
    </div>
  );
}

/*
 * ==============================================
 * PROJECT RESULTS
 * ==============================================
 */

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
    projects.length === 0
  ) {
    return (
      <div className="mt-6 rounded-[2rem] border border-dashed border-border bg-card/50 px-6 py-16 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-muted">
          <FolderOpenIcon
            size={24}
            className="text-muted-foreground"
          />
        </div>

        <h2 className="mt-5 text-xl font-black uppercase tracking-[-0.025em]">
          No {emptyLabel} projects
        </h2>

        <p className="mx-auto mt-2 max-w-md text-sm leading-7 text-muted-foreground">
          Projects that match
          this status will appear
          here.
        </p>
      </div>
    );
  }

  return (
    <div
      className={
        view === "grid"
          ? "mt-6 grid min-w-0 gap-5 sm:grid-cols-2 2xl:grid-cols-3"
          : "mt-6 flex min-w-0 flex-col gap-4"
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

/*
 * ==============================================
 * INVITATION CARD
 * ==============================================
 */

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
    if (responding) {
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
    if (responding) {
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
      <article className="flex h-full flex-col rounded-[1.75rem] border border-border bg-card p-5 text-card-foreground transition-all hover:border-primary/20 hover:shadow-md">
        <div className="flex items-start justify-between gap-4">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-300/20 text-amber-700 dark:bg-amber-400/10 dark:text-amber-300">
            <SendIcon
              size={18}
            />
          </span>

          <Badge
            variant="outline"
            className="rounded-full border-amber-400/30 bg-amber-300/10 text-amber-700 dark:text-amber-300"
          >
            Invitation
          </Badge>
        </div>

        <h2 className="mt-5 text-lg font-black tracking-[-0.025em]">
          {project.title}
        </h2>

        <p className="mt-3 line-clamp-3 text-sm leading-6 text-muted-foreground">
          {
            project.description
          }
        </p>

        {project.invitedAt && (
          <p className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
            <Clock3Icon
              size={14}
            />

            Invited{" "}
            {formatShortDate(
              project.invitedAt,
            )}
          </p>
        )}

        <button
          type="button"
          onClick={() =>
            setDetailsOpen(
              true,
            )
          }
          className="mt-4 inline-flex w-fit items-center gap-1 text-xs font-semibold text-primary hover:underline"
        >
          View project details

          <ArrowRightIcon
            size={13}
          />
        </button>

        <div className="mt-auto grid grid-cols-2 gap-3 pt-6">
          <Button
            type="button"
            variant="outline"
            disabled={
              responding !== null
            }
            onClick={() =>
              void handleDecline()
            }
            className="h-10 rounded-full text-xs shadow-none"
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
              responding !== null
            }
            onClick={() =>
              void handleAccept()
            }
            className="h-10 rounded-full text-xs shadow-none"
          >
            {responding ===
            "accept" ? (
              <LoaderCircleIcon className="h-4 w-4 animate-spin" />
            ) : (
              <CheckCircle2Icon
                size={15}
              />
            )}

            Accept
          </Button>
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

/*
 * ==============================================
 * INVITATION DETAILS DIALOG
 * ==============================================
 */

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
      open={open}
      onOpenChange={
        onOpenChange
      }
    >
      <DialogContent className="max-h-[90vh] overflow-y-auto rounded-[2rem] sm:max-w-2xl">
        <DialogHeader>
          <div className="mb-3 flex">
            <Badge
              variant="outline"
              className="rounded-full border-amber-400/30 bg-amber-300/10 text-amber-700 dark:text-amber-300"
            >
              Project invitation
            </Badge>
          </div>

          <DialogTitle className="text-2xl font-black tracking-[-0.03em]">
            {
              project.title
            }
          </DialogTitle>

          <DialogDescription className="leading-6">
            Review the project
            before deciding
            whether you'd like
            to accept the work.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-5 space-y-6">
          <div>
            <p className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Project description
            </p>

            <p className="mt-2 whitespace-pre-line text-sm leading-7">
              {project.description ||
                "No project description was provided."}
            </p>
          </div>

          <div className="grid gap-4 border-y border-border py-5 sm:grid-cols-2">
            <ProjectDetail
              label="Status"
              value="Awaiting your response"
            />

            {project.invitedAt && (
              <ProjectDetail
                label="Invited"
                value={formatShortDate(
                  project.invitedAt,
                )}
              />
            )}

            {project.dueDate && (
              <ProjectDetail
                label="Due date"
                value={formatShortDate(
                  project.dueDate,
                )}
              />
            )}
          </div>

          <div className="rounded-2xl bg-muted/40 p-4">
            <p className="text-xs leading-6 text-muted-foreground">
              Accepting this invitation
              will add the project to
              your active work and give
              you access to its
              workspace and tasks.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <Button
              type="button"
              variant="outline"
              disabled={
                responding !== null
              }
              onClick={() =>
                void onDecline()
              }
              className="h-11 rounded-full"
            >
              {responding ===
              "decline" ? (
                <LoaderCircleIcon className="h-4 w-4 animate-spin" />
              ) : (
                <XIcon
                  size={16}
                />
              )}

              Decline
            </Button>

            <Button
              type="button"
              disabled={
                responding !== null
              }
              onClick={() =>
                void onAccept()
              }
              className="h-11 rounded-full"
            >
              {responding ===
              "accept" ? (
                <LoaderCircleIcon className="h-4 w-4 animate-spin" />
              ) : (
                <CheckCircle2Icon
                  size={16}
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
      <p className="text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
        {label}
      </p>

      <div className="mt-1 text-sm font-semibold">
        {value}
      </div>
    </div>
  );
}

/*
 * ==============================================
 * EMPTY WORK STATE
 * ==============================================
 */

function WorkEmptyState({
  title,
  description,
  icon: Icon,
}: {
  title:
    string;

  description:
    string;

  icon: React.ComponentType<{
    size?: number;
  }>;
}) {
  return (
    <div className="mt-6 rounded-[2rem] border border-dashed border-border bg-card/50 px-6 py-16 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
        <Icon
          size={24}
        />
      </div>

      <h2 className="mt-5 text-xl font-black uppercase tracking-[-0.025em]">
        {title}
      </h2>

      <p className="mx-auto mt-2 max-w-md text-sm leading-7 text-muted-foreground">
        {description}
      </p>
    </div>
  );
}

/*
 * ==============================================
 * EMPTY WORKSPACE
 * ==============================================
 */

function EmptyWorkspace({
  firstName,
}: {
  firstName:
    string;
}) {
  return (
    <section className="flex min-h-[calc(100vh-12rem)] items-center justify-center py-10">
      <div className="relative w-full max-w-3xl overflow-hidden rounded-[2rem] border border-border bg-card px-6 py-14 text-center text-card-foreground sm:rounded-[2.5rem] sm:px-10 sm:py-20">
        <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-primary/10 blur-3xl" />

        <div className="absolute -bottom-24 -left-20 h-64 w-64 rounded-full bg-amber-300/10 blur-3xl" />

        <div className="relative">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-[1.75rem] bg-primary/15 text-primary sm:h-24 sm:w-24">
            <BriefcaseBusinessIcon className="h-9 w-9 sm:h-11 sm:w-11" />
          </div>

          <p className="mt-8 text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-primary sm:text-xs">
            Welcome,{" "}
            {firstName}
          </p>

          <h1 className="mx-auto mt-4 max-w-2xl break-words text-3xl font-black uppercase leading-[0.96] tracking-[-0.035em] sm:text-4xl md:text-5xl">
            Your workspace is
            ready for its{" "}
            <span className="text-primary">
              first project.
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-xl text-sm leading-7 text-muted-foreground sm:text-base">
            Describe the work,
            set your expectations
            and start connecting
            with skilled
            professionals who can
            help move it forward.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button
              asChild
              className="h-12 w-full rounded-full px-8 shadow-none sm:w-auto"
            >
              <Link to="/projects/new">
                <PlusIcon
                  size={17}
                />

                Create your first
                project
              </Link>
            </Button>

            <Button
              asChild
              variant="outline"
              className="h-12 w-full rounded-full px-8 shadow-none sm:w-auto"
            >
              <Link to="/how-it-works">
                See how it works

                <ArrowRightIcon
                  size={16}
                />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

/*
 * ==============================================
 * LOADING
 * ==============================================
 */

function WorkspaceLoading() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur-xl">
        <div className="container mx-auto px-4 sm:px-5 md:px-8">
          <DashboardMainNav />
        </div>
      </header>

      <main className="container mx-auto flex flex-1 items-center justify-center px-5 py-20 md:px-8">
        <div className="flex flex-col items-center text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-primary/15">
            <LoaderCircleIcon className="h-7 w-7 animate-spin text-primary" />
          </div>

          <h1 className="mt-6 text-2xl font-black uppercase tracking-[-0.03em]">
            Loading your
            workspace
          </h1>

          <p className="mt-2 max-w-md text-sm leading-7 text-muted-foreground">
            We are gathering
            your projects and
            recent workspace
            activity.
          </p>
        </div>
      </main>
    </div>
  );
}

/*
 * ==============================================
 * ERROR
 * ==============================================
 */

function WorkspaceError({
  onRetry,
}: {
  onRetry:
    () => Promise<void>;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur-xl">
        <div className="container mx-auto px-4 sm:px-5 md:px-8">
          <DashboardMainNav />
        </div>
      </header>

      <main className="container mx-auto flex flex-1 items-center justify-center px-5 py-20 md:px-8">
        <div className="w-full max-w-xl rounded-[2rem] border border-border bg-card p-7 text-center text-card-foreground sm:p-10">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-destructive/10 text-destructive">
            <FolderOpenIcon
              size={28}
            />
          </div>

          <h1 className="mt-6 text-2xl font-black uppercase tracking-[-0.03em] sm:text-3xl">
            We could not load
            your projects
          </h1>

          <p className="mt-3 text-sm leading-7 text-muted-foreground">
            Something interrupted
            the connection to your
            workspace. Try loading
            the projects again.
          </p>

          <Button
            type="button"
            className="mt-7 h-12 rounded-full px-7 shadow-none"
            onClick={() =>
              void onRetry()
            }
          >
            <RefreshCwIcon
              size={16}
            />

            Try again
          </Button>
        </div>
      </main>
    </div>
  );
}

/*
 * ==============================================
 * SIDEBAR
 * ==============================================
 */

function DashboardSidebar() {
  return (
    <aside className="hidden min-w-0 space-y-5 xl:block">
      <article className="overflow-hidden rounded-[2rem] border border-border bg-card text-card-foreground">
        <div className="relative aspect-[16/9] overflow-hidden bg-muted">
          <img
            src={
              Electricians
            }
            alt="Featured skilled professional"
            className="h-full w-full object-cover"
          />

          <Badge className="absolute left-4 top-4 rounded-full bg-background/90 text-foreground shadow-none backdrop-blur">
            <SparklesIcon
              size={13}
            />

            Featured
          </Badge>
        </div>

        <div className="p-6">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/15 text-primary">
            <MegaphoneIcon
              size={21}
            />
          </div>

          <h2 className="mt-6 text-xl font-black uppercase tracking-[-0.025em]">
            Find the right
            skills faster
          </h2>

          <p className="mt-3 text-sm leading-7 text-muted-foreground">
            Explore
            professionals whose
            experience may match
            your upcoming project
            requirements.
          </p>

          <Button
            asChild
            variant="outline"
            className="mt-6 h-11 rounded-full px-6 shadow-none"
          >
            <Link to="/allocats">
              View professionals

              <ArrowRightIcon
                size={15}
              />
            </Link>
          </Button>
        </div>
      </article>

      <article className="rounded-[1.75rem] border border-border bg-card p-6 text-card-foreground">
        <div className="flex items-start gap-4">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-amber-300/20 text-amber-700 dark:bg-amber-400/10 dark:text-amber-300">
            <LightbulbIcon
              size={21}
            />
          </span>

          <div className="min-w-0">
            <p className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Workspace tip
            </p>

            <h2 className="mt-2 font-bold">
              Start with a clear
              outcome
            </h2>

            <p className="mt-2 text-sm leading-7 text-muted-foreground">
              Explain what a
              completed project
              should look like
              before listing
              individual tasks.
            </p>

            <Link
              className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
              to="/how-it-works"
            >
              Learn more

              <ArrowRightIcon
                size={14}
              />
            </Link>
          </div>
        </div>
      </article>

      <article className="rounded-[1.75rem] border border-border bg-card p-6 text-card-foreground">
        <div className="flex items-start gap-4">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-sky-300/20 text-sky-700 dark:bg-sky-400/10 dark:text-sky-300">
            <MessageSquareTextIcon
              size={21}
            />
          </span>

          <div className="min-w-0">
            <p className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Recent activity
            </p>

            <h2 className="mt-2 font-bold">
              Jean sent you a
              message
            </h2>

            <p className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
              <Clock3Icon
                size={13}
              />

              3 hours ago
            </p>

            <p className="mt-3 line-clamp-3 text-sm leading-7 text-muted-foreground">
              I have reviewed the
              project details and
              added a few questions
              before we begin.
            </p>

            <Link
              className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
              to="/messages"
            >
              View conversation

              <ArrowRightIcon
                size={14}
              />
            </Link>
          </div>
        </div>
      </article>
    </aside>
  );
}

/*
 * ==============================================
 * HELPERS
 * ==============================================
 */

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
    new Date(value);

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
      day: "numeric",
      month: "short",
      year: "numeric",
    },
  ).format(date);
}

export default Projects;