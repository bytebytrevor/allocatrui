import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, Outlet, useParams } from "react-router-dom";

import {
  ArrowLeftIcon,
  ArrowRightLeftIcon,
  BanknoteIcon,
  BlocksIcon,
  CalendarDaysIcon,
  ChartNoAxesColumnIcon,
  CheckIcon,
  ChevronDownIcon,
  HeartIcon,
  LayoutDashboardIcon,
  MailIcon,
  MenuIcon,
  PlusIcon,
  RefreshCwIcon,
  XIcon,
} from "lucide-react";

import api from "@/api/axios";
import { useAuth } from "@/auth/useAuth";

import DashboardMainNav from "@/components/DashboardMainNav";
import DashboardNavLink from "@/components/DashboardNavLink";
import LoadingState from "@/components/LoadingState";

import { Button } from "@/components/ui/button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import type { Project } from "@/Types/project";
import type { ProjectWorkspaceContext } from "@/Types/projectWorkspaceContext";

/* =========================================================
   NAVIGATION
========================================================= */

const managerLinks = [
  {
    label: "Manager",
    path: "",
    icon: BlocksIcon,
  },
  {
    label: "Calendar",
    path: "calendar",
    icon: CalendarDaysIcon,
  },
  {
    label: "Messaging",
    path: "messaging",
    icon: MailIcon,
  },
  {
    label: "Analytics",
    path: "analytics",
    icon: ChartNoAxesColumnIcon,
  },
  {
    label: "Favorites",
    path: "favorites",
    icon: HeartIcon,
  },
  {
    label: "Transactions",
    path: "transactions",
    icon: BanknoteIcon,
  },
];

/* =========================================================
   PROJECT STATUS
========================================================= */

type ProjectStatusAppearance = {
  label: string;
  dot: string;
  text: string;
};

const projectStatusAppearance: Record<string, ProjectStatusAppearance> = {
  pending: {
    label: "Pending",
    dot: "bg-chart-3",
    text: "text-chart-3",
  },
  active: {
    label: "Active",
    dot: "bg-primary",
    text: "text-foreground",
  },
  completionrequested: {
    label: "Awaiting confirmation",
    dot: "bg-chart-3",
    text: "text-chart-3",
  },
  paused: {
    label: "Paused",
    dot: "bg-muted-foreground",
    text: "text-muted-foreground",
  },
  onhold: {
    label: "On hold",
    dot: "bg-muted-foreground",
    text: "text-muted-foreground",
  },
  complete: {
    label: "Completed",
    dot: "bg-chart-2",
    text: "text-chart-2",
  },
  completed: {
    label: "Completed",
    dot: "bg-chart-2",
    text: "text-chart-2",
  },
  closed: {
    label: "Completed",
    dot: "bg-chart-2",
    text: "text-chart-2",
  },
  cancelled: {
    label: "Cancelled",
    dot: "bg-destructive",
    text: "text-destructive",
  },
  canceled: {
    label: "Cancelled",
    dot: "bg-destructive",
    text: "text-destructive",
  },
};

/* =========================================================
   DASHBOARD
========================================================= */

function Dashboard() {
  const { projectId } = useParams();
  const { user } = useAuth();

  const [projects, setProjects] = useState<Project[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [projectsError, setProjectsError] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const canCreateProject = Boolean(user);

  /* =======================================================
     LOAD ACCESSIBLE PROJECTS
  ======================================================= */

  const fetchProjects = useCallback(async () => {
    try {
      setLoadingProjects(true);
      setProjectsError(null);

      const response = await api.get<Project[]>("/projects", {
        withCredentials: true,
      });

      setProjects(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Could not load accessible projects:", error);

      setProjects([]);
      setProjectsError(
        "Your projects could not be loaded. Please try again.",
      );
    } finally {
      setLoadingProjects(false);
    }
  }, []);

  useEffect(() => {
    void fetchProjects();
  }, [fetchProjects]);

  /* =======================================================
     CLOSE MOBILE MENU WHEN PROJECT CHANGES
  ======================================================= */

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [projectId]);

  /* =======================================================
     CURRENT PROJECT
  ======================================================= */

  const currentProject = useMemo(() => {
    if (!projectId) return undefined;

    return projects.find(
      project => String(project.id) === String(projectId),
    );
  }, [projects, projectId]);

  const projectBasePath = projectId
    ? `/projects/${projectId}`
    : "/projects";

  const hasProjectAccess = Boolean(currentProject && projectId);

  /* =======================================================
     UI
  ======================================================= */

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground transition-colors">
      {/* ===================================================
          STICKY APPLICATION SHELL
      =================================================== */}

      <div className="sticky top-0 z-50">
        {/* GLOBAL HEADER */}

        <header className="border-b border-border/70 bg-background/95 backdrop-blur-xl">
          <div className="container mx-auto px-4 sm:px-5 md:px-8">
            <DashboardMainNav />
          </div>
        </header>

        {/* =================================================
            MOBILE PROJECT BAR
        ================================================= */}

        <div className="border-b border-border/70 bg-background/95 backdrop-blur-xl lg:hidden">
          <div className="container mx-auto flex min-h-[3.75rem] items-center justify-between gap-4 px-4 py-2.5 sm:px-5 md:px-8">
            <div className="flex min-w-0 items-center gap-3">
              <span
                className={[
                  "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
                  "bg-primary text-secondary",
                  "transition-colors",
                ].join(" ")}
              >
                <LayoutDashboardIcon size={15} />
              </span>

              <div className="min-w-0">
                <p className="text-[0.55rem] font-semibold uppercase tracking-[0.15em] text-muted-foreground">
                  Project workspace
                </p>

                <div className="mt-0.5 flex min-w-0 items-center gap-2">
                  <h1 className="truncate text-sm font-bold tracking-[-0.015em]">
                    {currentProject?.title || "Project workspace"}
                  </h1>

                  {currentProject && (
                    <ProjectStatus
                      status={currentProject.status}
                      className="hidden shrink-0 sm:inline-flex"
                    />
                  )}
                </div>

                {currentProject && (
                  <ProjectStatus
                    status={currentProject.status}
                    className="mt-0.5 sm:hidden"
                  />
                )}
              </div>
            </div>

            <Button
              type="button"
              variant="ghost"
              size="icon"
              className={[
                "h-8 w-8 shrink-0 rounded-lg shadow-none",
                "transition-colors",
                mobileMenuOpen
                  ? "bg-primary text-secondary hover:bg-primary/90 hover:text-secondary"
                  : "text-muted-foreground hover:bg-muted/50 hover:text-foreground",
              ].join(" ")}
              onClick={() => setMobileMenuOpen(current => !current)}
              aria-label={
                mobileMenuOpen
                  ? "Close project navigation"
                  : "Open project navigation"
              }
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-project-navigation"
            >
              {mobileMenuOpen ? (
                <XIcon size={17} />
              ) : (
                <MenuIcon size={17} />
              )}
            </Button>
          </div>

          {/* =================================================
              MOBILE MENU
          ================================================= */}

          {mobileMenuOpen && (
            <div
              id="mobile-project-navigation"
              className="border-t border-border/70"
            >
              <div className="container mx-auto max-h-[calc(100vh-8rem)] overflow-y-auto px-4 py-4 sm:px-5 md:px-8">
                <div className="space-y-5">
                  {!loadingProjects && hasProjectAccess && (
                    <ProjectNavigation
                      basePath={projectBasePath}
                      onNavigate={() => setMobileMenuOpen(false)}
                    />
                  )}

                  {!loadingProjects && (
                    <div
                      className={
                        hasProjectAccess
                          ? "border-t border-border pt-4"
                          : ""
                      }
                    >
                      <ProjectSwitcher
                        projects={projects}
                        projectId={projectId}
                        error={projectsError}
                        currentProject={currentProject}
                        onRetry={fetchProjects}
                        canCreateProject={canCreateProject}
                        isAllocat={Boolean(user?.isAllocat)}
                        side="bottom"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ===================================================
          WORKSPACE
      =================================================== */}

      <main className="container mx-auto flex min-h-0 flex-1 px-4 sm:px-5 md:px-8">
        <div
          className={[
            "grid min-h-0 w-full",
            "lg:grid-cols-[230px_minmax(0,1fr)]",
            "xl:grid-cols-[250px_minmax(0,1fr)]",
          ].join(" ")}
        >
          {/* =================================================
              DESKTOP SIDEBAR
          ================================================= */}

          <aside className="hidden min-h-0 border-r border-border/70 lg:block">
            <div className="sticky top-[5.75rem] flex max-h-[calc(100vh-6rem)] flex-col py-7 pr-6 xl:pr-7">
              {/* =============================================
                  CURRENT PROJECT
              ============================================= */}

              <div className="pb-7">
                <Link
                  to="/projects"
                  className={[
                    "group inline-flex items-center gap-2",
                    "text-xs font-medium text-muted-foreground",
                    "transition-colors hover:text-foreground",
                  ].join(" ")}
                >
                  <ArrowLeftIcon
                    size={13}
                    className="transition-transform duration-200 group-hover:-translate-x-0.5"
                  />

                  All projects
                </Link>

                <div className="mt-7 flex items-start gap-3">
                  <span
                    className={[
                      "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
                      "bg-primary text-secondary",
                    ].join(" ")}
                  >
                    <LayoutDashboardIcon size={18} />
                  </span>

                  <div className="min-w-0 pt-0.5">
                    <p className="text-[0.58rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                      Current project
                    </p>

                    <h1 className="mt-1 line-clamp-2 break-words text-base font-black leading-[1.15] tracking-[-0.02em]">
                      {currentProject?.title || "Project workspace"}
                    </h1>

                    {currentProject?.projectCode && (
                      <p className="mt-1.5 truncate text-[0.65rem] text-muted-foreground/70">
                        {currentProject.projectCode}
                      </p>
                    )}

                    {currentProject && (
                      <ProjectStatus
                        status={currentProject.status}
                        className="mt-2"
                      />
                    )}
                  </div>
                </div>
              </div>

              {/* =============================================
                  PROJECT NAVIGATION
              ============================================= */}

              <div className="flex-1 overflow-y-auto border-t border-border py-5">
                {!loadingProjects && hasProjectAccess ? (
                  <>
                    <p className="mb-2 px-2 text-[0.58rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                      Workspace
                    </p>

                    <ProjectNavigation basePath={projectBasePath} />
                  </>
                ) : !loadingProjects && !projectsError ? (
                  <SidebarUnavailable />
                ) : null}
              </div>

              {/* =============================================
                  PROJECT SWITCHER
              ============================================= */}

              <div className="border-t border-border pt-4">
                {!loadingProjects && (
                  <ProjectSwitcher
                    projects={projects}
                    projectId={projectId}
                    error={projectsError}
                    currentProject={currentProject}
                    onRetry={fetchProjects}
                    canCreateProject={canCreateProject}
                    isAllocat={Boolean(user?.isAllocat)}
                    side="top"
                  />
                )}
              </div>
            </div>
          </aside>

          {/* =================================================
              PAGE CONTENT
          ================================================= */}

          <section className="min-w-0 py-5 sm:py-6 lg:py-8 lg:pl-8 xl:pl-10">
            <div className="min-h-full min-w-0">
              {loadingProjects ? (
                <LoadingState
                  label="Loading your workspace"
                  className="min-h-[420px]"
                />
              ) : projectsError ? (
                <ProjectWorkspaceError onRetry={fetchProjects} />
              ) : currentProject && projectId ? (
                <Outlet
                  context={{
                    projects,
                    currentProject,
                    projectId,
                    isAllocat: Boolean(user?.isAllocat),
                  } satisfies ProjectWorkspaceContext}
                />
              ) : (
                <ProjectUnavailable />
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

/* =========================================================
   PROJECT STATUS
========================================================= */

function ProjectStatus({
  status,
  className = "",
}: {
  status?: string;
  className?: string;
}) {
  const normalized = normalizeProjectStatus(status);

  const appearance =
    projectStatusAppearance[normalized] ?? {
      label: formatProjectStatus(status),
      dot: "bg-muted-foreground",
      text: "text-muted-foreground",
    };

  const needsAttention = normalized === "completionrequested";

  return (
    <span
      className={[
        "inline-flex w-fit items-center gap-1.5",
        "text-[0.62rem] font-semibold",
        appearance.text,
        className,
      ].join(" ")}
    >
      <span className="relative flex h-1.5 w-1.5 shrink-0">
        {needsAttention && (
          <span
            className={[
              "absolute inline-flex h-full w-full animate-ping rounded-full opacity-30",
              appearance.dot,
            ].join(" ")}
          />
        )}

        <span
          className={[
            "relative inline-flex h-1.5 w-1.5 rounded-full",
            appearance.dot,
          ].join(" ")}
        />
      </span>

      {appearance.label}
    </span>
  );
}

/* =========================================================
   PROJECT NAVIGATION
========================================================= */

type ProjectNavigationProps = {
  basePath: string;
  onNavigate?: () => void;
};

function ProjectNavigation({
  basePath,
  onNavigate,
}: ProjectNavigationProps) {
  return (
    <nav className="space-y-0.5" aria-label="Project workspace">
      {managerLinks.map(link => {
        const href = link.path
          ? `${basePath}/${link.path}`
          : basePath;

        return (
          <div key={link.label} onClick={onNavigate}>
            <DashboardNavLink
              href={href}
              icon={link.icon}
              label={link.label}
            />
          </div>
        );
      })}
    </nav>
  );
}

/* =========================================================
   PROJECT SWITCHER
========================================================= */

type ProjectSwitcherProps = {
  projects: Project[];
  projectId?: string;
  error: string | null;
  currentProject?: Project;
  onRetry: () => void;
  canCreateProject: boolean;
  isAllocat: boolean;
  side?: "top" | "bottom";
};

function ProjectSwitcher({
  projects,
  projectId,
  error,
  currentProject,
  onRetry,
  canCreateProject,
  isAllocat,
  side = "top",
}: ProjectSwitcherProps) {
  if (error) {
    return (
      <button
        type="button"
        onClick={onRetry}
        className={[
          "flex w-full items-center gap-3 rounded-lg",
          "px-2 py-2 text-left text-destructive",
          "transition-colors hover:bg-destructive/[0.05]",
        ].join(" ")}
      >
        <RefreshCwIcon size={15} />

        <div>
          <p className="text-xs font-semibold">
            Try loading again
          </p>

          <p className="mt-0.5 text-[0.62rem] opacity-70">
            Projects unavailable
          </p>
        </div>
      </button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label="Switch project"
          className={[
            "group flex w-full items-center justify-between gap-3",
            "rounded-lg px-2 py-2.5 text-left",
            "transition-colors duration-200",
            "hover:bg-muted/40",
            "data-[state=open]:bg-muted/40",
          ].join(" ")}
        >
          <div className="flex min-w-0 items-center gap-3">
            <span
              className={[
                "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
                "bg-muted text-muted-foreground transition-colors duration-200",
                "group-hover:bg-primary group-hover:text-secondary",
                "group-data-[state=open]:bg-primary",
                "group-data-[state=open]:text-secondary",
              ].join(" ")}
            >
              <ArrowRightLeftIcon size={14} />
            </span>

            <div className="min-w-0">
              <p className="text-[0.56rem] font-semibold uppercase tracking-[0.15em] text-muted-foreground">
                Switch project
              </p>

              <p className="mt-0.5 truncate text-xs font-semibold">
                {currentProject?.title || "Choose project"}
              </p>
            </div>
          </div>

          <ChevronDownIcon
            size={14}
            className="shrink-0 text-muted-foreground transition-transform duration-200 group-data-[state=open]:rotate-180"
          />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="start"
        side={side}
        sideOffset={8}
        className={[
          "w-[min(290px,calc(100vw-2rem))] rounded-xl border-border",
          "bg-popover p-1.5 text-popover-foreground",
          "shadow-lg",
        ].join(" ")}
      >
        <DropdownMenuLabel className="px-2.5 py-2">
          <p className="text-[0.58rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            Your projects
          </p>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <div className="max-h-72 overflow-y-auto py-1">
          {projects.length > 0 ? (
            projects.map(project => {
              const isCurrent =
                String(project.id) === String(projectId);

              return (
                <DropdownMenuItem
                  key={project.id}
                  asChild
                  className={[
                    "rounded-lg",
                    isCurrent ? "bg-muted/50" : "",
                  ].join(" ")}
                >
                  <Link
                    to={`/projects/${project.id}`}
                    className="flex items-center justify-between gap-3 px-2.5 py-2.5"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold">
                        {project.title}
                      </p>

                      <div className="mt-1 flex min-w-0 items-center gap-2">
                        {project.projectCode && (
                          <>
                            <span className="truncate text-[0.62rem] text-muted-foreground">
                              {project.projectCode}
                            </span>

                            <span className="h-0.5 w-0.5 shrink-0 rounded-full bg-muted-foreground/50" />
                          </>
                        )}

                        <ProjectStatus status={project.status} />
                      </div>
                    </div>

                    {isCurrent && (
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-primary text-secondary">
                        <CheckIcon
                          size={11}
                          strokeWidth={3}
                        />
                      </span>
                    )}
                  </Link>
                </DropdownMenuItem>
              );
            })
          ) : (
            <ProjectSwitcherEmpty
              isAllocat={isAllocat}
              canCreateProject={canCreateProject}
            />
          )}
        </div>

        {canCreateProject && (
          <>
            <DropdownMenuSeparator />

            <DropdownMenuItem asChild className="rounded-lg">
              <Link
                to="/projects/new"
                className="py-2"
              >
                <PlusIcon size={14} />
                Create new project
              </Link>
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

/* =========================================================
   PROJECT SWITCHER EMPTY
========================================================= */

function ProjectSwitcherEmpty({
  isAllocat,
  canCreateProject,
}: {
  isAllocat: boolean;
  canCreateProject: boolean;
}) {
  return (
    <div className="px-3 py-6">
      <p className="text-sm font-semibold">
        No projects available
      </p>

      <p className="mt-1 text-xs leading-5 text-muted-foreground">
        {isAllocat && canCreateProject
          ? "Create your own project or accept client work to begin."
          : canCreateProject
            ? "Create a project to begin."
            : "Projects available to you will appear here."}
      </p>
    </div>
  );
}

/* =========================================================
   WORKSPACE ERROR
========================================================= */

function ProjectWorkspaceError({
  onRetry,
}: {
  onRetry: () => void;
}) {
  return (
    <div className="flex min-h-[420px] items-center justify-center">
      <div className="max-w-sm text-center">
        <span className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-muted text-muted-foreground">
          <RefreshCwIcon size={17} />
        </span>

        <h2 className="mt-4 text-base font-bold tracking-[-0.015em]">
          Could not load this workspace
        </h2>

        <p className="mt-2 text-xs leading-6 text-muted-foreground">
          We couldn't confirm your project access. Try loading your workspace
          again.
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
    </div>
  );
}

/* =========================================================
   PROJECT UNAVAILABLE
========================================================= */

function ProjectUnavailable() {
  return (
    <div className="flex min-h-[420px] items-center justify-center">
      <div className="max-w-sm text-center">
        <span className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-secondary">
          <BlocksIcon size={17} />
        </span>

        <h2 className="mt-4 text-base font-bold tracking-[-0.015em]">
          Project unavailable
        </h2>

        <p className="mt-2 text-xs leading-6 text-muted-foreground">
          This project doesn't exist or isn't available to your account.
        </p>

        <Button
          asChild
          variant="outline"
          className="mt-5 h-9 rounded-lg bg-transparent px-4 text-xs font-semibold shadow-none"
        >
          <Link to="/projects">
            <ArrowLeftIcon size={13} />
            Back to projects
          </Link>
        </Button>
      </div>
    </div>
  );
}

/* =========================================================
   SIDEBAR UNAVAILABLE
========================================================= */

function SidebarUnavailable() {
  return (
    <div className="px-2 py-2">
      <p className="text-xs font-semibold">
        Workspace unavailable
      </p>

      <p className="mt-1 text-[0.62rem] leading-5 text-muted-foreground">
        Select one of your available projects below.
      </p>
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

function formatProjectStatus(status?: string) {
  if (!status?.trim()) {
    return "Unknown";
  }

  return status
    .trim()
    .replace(/[_-]+/g, " ")
    .replace(/\b\w/g, letter => letter.toUpperCase());
}

export default Dashboard;