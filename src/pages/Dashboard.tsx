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
   DASHBOARD
========================================================= */

function Dashboard() {
  const { projectId } = useParams();
  const { user } = useAuth();

  const [projects, setProjects] = useState<Project[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [projectsError, setProjectsError] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  /* =======================================================
     PERMISSIONS

     Allocats retain normal account capabilities, including
     creating and owning their own projects.
  ======================================================= */

  const canCreateProject = Boolean(user);

  /* =======================================================
     LOAD ACCESSIBLE PROJECTS

     GET /projects returns every project workspace the current
     user is allowed to enter.

     Normal user:
     - projects they own

     Allocat:
     - projects they own
     - accepted client projects

     Invitations are not accessible workspaces until accepted.
  ======================================================= */

  const fetchProjects = useCallback(async () => {
    try {
      setLoadingProjects(true);
      setProjectsError(null);

      const response = await api.get<Project[]>("/projects", {
        withCredentials: true,
      });

      setProjects(response.data);
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

     The current project is resolved from the secured list
     returned by GET /projects.

     An inaccessible project ID therefore cannot mount the
     project workspace.
  ======================================================= */

  const currentProject = useMemo(() => {
    if (!projectId) {
      return undefined;
    }

    return projects.find(
      (project) => String(project.id) === String(projectId),
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
          GLOBAL HEADER
      =================================================== */}

      <header className="sticky top-0 z-50 border-b border-border/70 bg-background/90 backdrop-blur-xl">
        <div className="container mx-auto px-4 sm:px-5 md:px-8">
          <DashboardMainNav />
        </div>
      </header>

      {/* ===================================================
          MOBILE PROJECT BAR
      =================================================== */}

      <div className="border-b border-border/70 bg-background lg:hidden">
        <div className="container mx-auto flex min-h-16 items-center justify-between gap-4 px-5 py-3 md:px-8">
          <div className="flex min-w-0 items-center gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/[0.075] text-primary">
              <LayoutDashboardIcon size={17} />
            </span>

            <div className="min-w-0">
              <p className="text-[0.58rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                Project workspace
              </p>

              <h1 className="mt-0.5 truncate text-sm font-bold tracking-[-0.015em]">
                {currentProject?.title || "Project workspace"}
              </h1>
            </div>
          </div>

          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-9 w-9 shrink-0 rounded-lg shadow-none"
            onClick={() => setMobileMenuOpen((current) => !current)}
            aria-label={
              mobileMenuOpen
                ? "Close project navigation"
                : "Open project navigation"
            }
          >
            {mobileMenuOpen ? (
              <XIcon size={18} />
            ) : (
              <MenuIcon size={18} />
            )}
          </Button>
        </div>

        {/* =================================================
            MOBILE MENU
        ================================================= */}

        {mobileMenuOpen && (
          <div className="container mx-auto border-t border-border/70 px-5 py-4 md:px-8">
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
                  />
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* ===================================================
          WORKSPACE
      =================================================== */}

      <main className="container mx-auto flex min-h-0 flex-1 px-5 md:px-8">
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
                    className="transition-transform group-hover:-translate-x-0.5"
                  />

                  All projects
                </Link>

                <div className="mt-7 flex items-start gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/[0.075] text-primary">
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
                  </div>
                </div>
              </div>

              {/* =============================================
                  PROJECT NAVIGATION

                  The sidebar stays quiet while the workspace
                  is loading. We do not need a second loader.
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

                  Also stays quiet during the initial workspace
                  load. There is only one visible loader.
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
                  />
                )}
              </div>
            </div>
          </aside>

          {/* =================================================
              PAGE CONTENT

              This is the only loading presentation controlled
              by the dashboard shell.
          ================================================= */}

          <section className="min-w-0 py-6 lg:py-8 lg:pl-8 xl:pl-10">
            <div className="min-h-full min-w-0">
              {loadingProjects ? (
                <LoadingState
                  label="Loading your workspace"
                  className="min-h-[420px]"
                />
              ) : projectsError ? (
                <ProjectWorkspaceError onRetry={fetchProjects} />
              ) : currentProject ? (
                <Outlet />
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
    <nav
      className="space-y-0.5"
      aria-label="Project workspace"
    >
      {managerLinks.map((link) => {
        const href = link.path
          ? `${basePath}/${link.path}`
          : basePath;

        return (
          <div
            key={link.label}
            onClick={onNavigate}
          >
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
};

function ProjectSwitcher({
  projects,
  projectId,
  error,
  currentProject,
  onRetry,
  canCreateProject,
  isAllocat,
}: ProjectSwitcherProps) {
  /* =======================================================
     ERROR
  ======================================================= */

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

  /* =======================================================
     SWITCHER
  ======================================================= */

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className={[
            "group flex w-full items-center justify-between gap-3",
            "rounded-lg px-2 py-2.5 text-left",
            "transition-colors hover:bg-muted/40",
          ].join(" ")}
        >
          <div className="flex min-w-0 items-center gap-3">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground transition-colors group-hover:bg-primary/[0.08] group-hover:text-primary">
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
            className="shrink-0 text-muted-foreground transition-transform group-data-[state=open]:rotate-180"
          />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="start"
        side="top"
        sideOffset={8}
        className={[
          "w-[270px] rounded-xl border-border",
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

        <div className="max-h-64 overflow-y-auto py-1">
          {projects.length > 0 ? (
            projects.map((project) => {
              const isCurrent =
                String(project.id) === String(projectId);

              return (
                <DropdownMenuItem
                  key={project.id}
                  asChild
                  className="rounded-lg"
                >
                  <Link
                    to={`/projects/${project.id}`}
                    className="flex items-center justify-between gap-3 px-2.5 py-2"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold">
                        {project.title}
                      </p>

                      {project.projectCode && (
                        <p className="mt-0.5 truncate text-[0.62rem] text-muted-foreground">
                          {project.projectCode}
                        </p>
                      )}
                    </div>

                    {isCurrent && (
                      <CheckIcon
                        size={14}
                        className="shrink-0 text-primary"
                      />
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

            <DropdownMenuItem
              asChild
              className="rounded-lg"
            >
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
          We couldn't confirm your project access. Try loading your
          workspace again.
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

   Deliberately avoids confirming whether the supplied project
   ID belongs to another account or exists at all.
========================================================= */

function ProjectUnavailable() {
  return (
    <div className="flex min-h-[420px] items-center justify-center">
      <div className="max-w-sm text-center">
        <span className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-muted text-muted-foreground">
          <BlocksIcon size={17} />
        </span>

        <h2 className="mt-4 text-base font-bold tracking-[-0.015em]">
          Project unavailable
        </h2>

        <p className="mt-2 text-xs leading-6 text-muted-foreground">
          This project doesn't exist or isn't available to your
          account.
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

export default Dashboard;