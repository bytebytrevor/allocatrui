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
  { label: "Manager", path: "", icon: BlocksIcon },
  { label: "Calendar", path: "calendar", icon: CalendarDaysIcon },
  { label: "Messaging", path: "messaging", icon: MailIcon },
  { label: "Analytics", path: "analytics", icon: ChartNoAxesColumnIcon },
  { label: "Favorites", path: "favorites", icon: HeartIcon },
  { label: "Transactions", path: "transactions", icon: BanknoteIcon },
];

/* =========================================================
   PROJECT STATUS
========================================================= */

type ProjectStatusAppearance = {
  label: string;
  dot: string;
};

const projectStatusAppearance: Record<string, ProjectStatusAppearance> = {
  pending: {
    label: "Pending",
    dot: "bg-brand-amber/65 dark:bg-status-pending",
  },

  active: {
    label: "Active",
    dot: "bg-brand-secondary-highlight/70 dark:bg-status-active",
  },

  completionrequested: {
    label: "Awaiting confirmation",
    dot: "bg-brand-amber/65 dark:bg-status-pending",
  },

  paused: {
    label: "Paused",
    dot: "bg-muted-foreground/45 dark:bg-muted-foreground/70",
  },

  onhold: {
    label: "On hold",
    dot: "bg-muted-foreground/45 dark:bg-muted-foreground/70",
  },

  complete: {
    label: "Completed",
    dot: "bg-brand-green/60 dark:bg-status-complete",
  },

  completed: {
    label: "Completed",
    dot: "bg-brand-green/60 dark:bg-status-complete",
  },

  closed: {
    label: "Completed",
    dot: "bg-brand-green/60 dark:bg-status-complete",
  },

  cancelled: {
    label: "Cancelled",
    dot: "bg-destructive/60 dark:bg-status-overdue",
  },

  canceled: {
    label: "Cancelled",
    dot: "bg-destructive/60 dark:bg-status-overdue",
  },
};

/* =========================================================
   SWITCHER VISIBILITY
========================================================= */

const HIDDEN_SWITCHER_STATUSES = new Set([
  "complete",
  "completed",
  "closed",
  "cancelled",
  "canceled",
]);

/* =========================================================
   SHARED THEME
========================================================= */

const workspaceIconSurface = [
  "bg-surface-3/60 text-brand-secondary-highlight",
  "ring-1 ring-inset ring-border/30",

  "dark:bg-surface-2",
  "dark:text-brand-secondary-highlight",
  "dark:ring-border",
].join(" ");

const secondaryActionButton = [
  "border-border/60 bg-surface-2/30 text-foreground/70",

  "hover:border-border/80",
  "hover:bg-surface-3/55",
  "hover:text-foreground/90",

  "dark:border-border",
  "dark:bg-surface-2",
  "dark:text-foreground/80",

  "dark:hover:border-border",
  "dark:hover:bg-surface-3",
  "dark:hover:text-foreground",
].join(" ");

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
      setProjectsError("Your projects could not be loaded. Please try again.");
    } finally {
      setLoadingProjects(false);
    }
  }, []);

  useEffect(() => {
    void fetchProjects();
  }, [fetchProjects]);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [projectId]);

  /* =======================================================
     CURRENT PROJECT
  ======================================================= */

  const currentProject = useMemo(() => {
    if (!projectId) return undefined;

    return projects.find((project) => String(project.id) === String(projectId));
  }, [projects, projectId]);

  /* =======================================================
     SWITCHER PROJECTS
  ======================================================= */

  const switcherProjects = useMemo(
    () =>
      projects.filter(
        (project) =>
          !HIDDEN_SWITCHER_STATUSES.has(normalizeProjectStatus(project.status)),
      ),
    [projects],
  );

  const projectBasePath = projectId ? `/projects/${projectId}` : "/projects";

  const hasProjectAccess = Boolean(currentProject && projectId);

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      {/* ===================================================
          GLOBAL HEADER
      =================================================== */}

      <header className="sticky top-0 z-50 border-b border-border/55 bg-background/95 backdrop-blur-xl dark:border-border">
        <div className="container mx-auto px-4 sm:px-5 md:px-8">
          <DashboardMainNav />
        </div>
      </header>

      {/* ===================================================
          MOBILE PROJECT BAR
      =================================================== */}

      <div
        className={[
          "sticky top-16 z-40 border-b border-border/55",
          "bg-background/95 backdrop-blur-xl",
          "dark:border-border",
          "sm:top-[4.25rem] lg:hidden",
        ].join(" ")}
      >
        <div className="container mx-auto flex min-h-[3.75rem] items-center justify-between gap-4 px-4 py-2.5 sm:px-5 md:px-8">
          <div className="flex min-w-0 items-center gap-3">
            <span
              className={[
                "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
                workspaceIconSurface,
              ].join(" ")}
            >
              <LayoutDashboardIcon size={14} />
            </span>

            <div className="min-w-0">
              <p className="text-[0.52rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground/80">
                Project workspace
              </p>

              <div className="mt-0.5 flex min-w-0 items-center gap-2">
                <h1 className="truncate text-sm font-semibold tracking-[-0.015em] text-foreground/85 dark:text-foreground">
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
              "transition-[background-color,color] duration-150",

              mobileMenuOpen
                ? [
                    "bg-brand-secondary-highlight/[0.09]",
                    "text-brand-secondary-highlight",

                    "hover:bg-brand-secondary-highlight/[0.13]",
                    "hover:text-brand-secondary-highlight",

                    "dark:bg-secondary/[0.08]",
                    "dark:text-secondary",

                    "dark:hover:bg-secondary/[0.12]",
                    "dark:hover:text-secondary",
                  ].join(" ")
                : [
                    "text-muted-foreground",

                    "hover:bg-surface-3/55",
                    "hover:text-foreground/85",

                    "dark:hover:bg-surface-2",
                    "dark:hover:text-foreground",
                  ].join(" "),
            ].join(" ")}
            onClick={() => setMobileMenuOpen((current) => !current)}
            aria-label={
              mobileMenuOpen
                ? "Close project navigation"
                : "Open project navigation"
            }
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-project-navigation"
          >
            {mobileMenuOpen ? <XIcon size={16} /> : <MenuIcon size={16} />}
          </Button>
        </div>

        {mobileMenuOpen && (
          <div
            id="mobile-project-navigation"
            className="border-t border-border/55 dark:border-border"
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
                        ? "border-t border-border/55 pt-4 dark:border-border"
                        : ""
                    }
                  >
                    <ProjectSwitcher
                      projects={switcherProjects}
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

          <aside className="hidden min-h-0 border-r border-border/55 lg:block dark:border-border">
            <div className="sticky top-[5.75rem] flex max-h-[calc(100vh-6rem)] flex-col py-7 pr-6 xl:pr-7">
              <div className="pb-7">
                <Link
                  to="/projects"
                  className={[
                    "group inline-flex items-center gap-2",

                    "text-[0.68rem] font-medium",
                    "text-muted-foreground/90",

                    "transition-colors duration-150",

                    "hover:text-foreground/80",
                    "dark:hover:text-foreground",
                  ].join(" ")}
                >
                  <ArrowLeftIcon
                    size={12}
                    className="transition-transform duration-200 group-hover:-translate-x-0.5"
                  />
                  All projects
                </Link>

                <div className="mt-7 flex items-start gap-3">
                  <span
                    className={[
                      "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
                      workspaceIconSurface,
                    ].join(" ")}
                  >
                    <LayoutDashboardIcon size={17} />
                  </span>

                  <div className="min-w-0 pt-0.5">
                    <p className="text-[0.52rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground/80">
                      Current project
                    </p>

                    <h1 className="mt-1.5 line-clamp-2 break-words text-[0.94rem] font-semibold leading-[1.2] tracking-[-0.018em] text-foreground/85 dark:text-foreground">
                      {currentProject?.title || "Project workspace"}
                    </h1>

                    {currentProject?.projectCode && (
                      <p className="mt-1.5 truncate text-[0.58rem] text-muted-foreground/65 dark:text-muted-foreground">
                        {getProjectDisplayCode(currentProject.projectCode)}
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

              <div className="min-h-0 flex-1 overflow-y-auto border-t border-border/55 py-5 dark:border-border">
                {!loadingProjects && hasProjectAccess ? (
                  <>
                    <p className="mb-2 px-2 text-[0.5rem] font-semibold uppercase tracking-[0.17em] text-muted-foreground/70">
                      Workspace
                    </p>

                    <ProjectNavigation basePath={projectBasePath} />
                  </>
                ) : !loadingProjects && !projectsError ? (
                  <SidebarUnavailable />
                ) : null}
              </div>

              <div className="border-t border-border/55 pt-4 dark:border-border">
                {!loadingProjects && (
                  <ProjectSwitcher
                    projects={switcherProjects}
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
                  context={
                    {
                      projects,
                      currentProject,
                      projectId,
                      isAllocat: Boolean(user?.isAllocat),
                    } satisfies ProjectWorkspaceContext
                  }
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

  const appearance = projectStatusAppearance[normalized] ?? {
    label: formatProjectStatus(status),
    dot: "bg-muted-foreground/45 dark:bg-muted-foreground/70",
  };

  const needsAttention = normalized === "completionrequested";

  return (
    <span
      className={[
        "inline-flex w-fit items-center gap-1.5",
        "text-[0.55rem] font-medium",
        "text-muted-foreground/70",
        "dark:text-muted-foreground",
        className,
      ].join(" ")}
    >
      <span className="relative flex h-1.5 w-1.5 shrink-0">
        {needsAttention && (
          <span
            className={[
              "absolute inline-flex h-full w-full animate-ping rounded-full opacity-20",
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

function ProjectNavigation({
  basePath,
  onNavigate,
}: {
  basePath: string;
  onNavigate?: () => void;
}) {
  return (
    <nav className="space-y-1" aria-label="Project workspace">
      {managerLinks.map((link) => {
        const href = link.path ? `${basePath}/${link.path}` : basePath;

        return (
          <div key={link.label} onClick={onNavigate}>
            <DashboardNavLink
              href={href}
              icon={link.icon}
              label={link.label}
              end={!link.path}
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

function ProjectSwitcher({
  projects,
  projectId,
  error,
  currentProject,
  onRetry,
  canCreateProject,
  isAllocat,
  side = "top",
}: {
  projects: Project[];
  projectId?: string;
  error: string | null;
  currentProject?: Project;
  onRetry: () => void;
  canCreateProject: boolean;
  isAllocat: boolean;
  side?: "top" | "bottom";
}) {
  if (error) {
    return (
      <button
        type="button"
        onClick={onRetry}
        className={[
          "flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left",

          "text-destructive/75",

          "transition-colors duration-150",

          "hover:bg-destructive/[0.035]",
          "hover:text-destructive",

          "dark:text-status-overdue-foreground",
          "dark:hover:bg-status-overdue/10",
        ].join(" ")}
      >
        <RefreshCwIcon size={14} />

        <div>
          <p className="text-xs font-semibold">Try loading again</p>

          <p className="mt-0.5 text-[0.58rem] opacity-75">
            Projects unavailable
          </p>
        </div>
      </button>
    );
  }

  return (
    <DropdownMenu>
      {/* ===================================================
          TRIGGER
      =================================================== */}

      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label="Switch project"
          className={[
            "group flex w-full items-center justify-between gap-3",

            "rounded-xl px-2 py-2.5 text-left",

            "outline-none",

            "transition-[background-color,color] duration-150",

            "hover:bg-surface-3/55",
            "data-[state=open]:bg-surface-3/65",

            "dark:hover:bg-surface-2",
            "dark:data-[state=open]:bg-surface-2",
          ].join(" ")}
        >
          <div className="flex min-w-0 items-center gap-3">
            <span
              className={[
                "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",

                "bg-surface-3/55",
                "text-muted-foreground/80",

                "ring-1 ring-inset ring-border/30",

                "transition-[background-color,color,box-shadow] duration-150",

                "group-hover:bg-brand-secondary-highlight/[0.08]",
                "group-hover:text-brand-secondary-highlight",
                "group-hover:ring-brand-secondary-highlight/10",

                "group-data-[state=open]:bg-brand-secondary-highlight/[0.10]",
                "group-data-[state=open]:text-brand-secondary-highlight",
                "group-data-[state=open]:ring-brand-secondary-highlight/10",

                "dark:bg-surface-2",
                "dark:text-muted-foreground",
                "dark:ring-border",

                "dark:group-hover:bg-secondary/[0.07]",
                "dark:group-hover:text-secondary",
                "dark:group-hover:ring-secondary/10",

                "dark:group-data-[state=open]:bg-secondary/[0.09]",
                "dark:group-data-[state=open]:text-secondary",
                "dark:group-data-[state=open]:ring-secondary/10",
              ].join(" ")}
            >
              <ArrowRightLeftIcon size={13} />
            </span>

            <div className="min-w-0">
              <p className="text-[0.5rem] font-semibold uppercase tracking-[0.15em] text-muted-foreground/70">
                Switch project
              </p>

              <p className="mt-0.5 truncate text-xs font-semibold text-foreground/80 dark:text-foreground/90">
                {currentProject?.title || "Choose project"}
              </p>
            </div>
          </div>

          <ChevronDownIcon
            size={13}
            className={[
              "shrink-0",

              "text-muted-foreground/55",

              "transition-[transform,color] duration-200",

              "group-hover:text-foreground/65",

              "group-data-[state=open]:rotate-180",
              "group-data-[state=open]:text-brand-secondary-highlight/80",

              "dark:group-hover:text-secondary/80",
              "dark:group-data-[state=open]:text-secondary/80",
            ].join(" ")}
          />
        </button>
      </DropdownMenuTrigger>

      {/* ===================================================
          POPOVER
      =================================================== */}

      <DropdownMenuContent
        align="start"
        side={side}
        sideOffset={8}
        collisionPadding={12}
        className={[
          "w-[min(300px,calc(100vw-2rem))]",

          "rounded-xl p-1.5",

          "border-border/55",
          "bg-popover",
          "text-popover-foreground",

          "shadow-none",

          "dark:border-border",
        ].join(" ")}
      >
        <DropdownMenuLabel className="px-2.5 py-2">
          <p className="text-[0.52rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground/70">
            Open projects
          </p>
        </DropdownMenuLabel>

        <DropdownMenuSeparator className="bg-border/50 dark:bg-border" />

        {/* =================================================
            PROJECTS
        ================================================= */}

        <div className="max-h-72 overflow-y-auto py-1">
          {projects.length > 0 ? (
            projects.map((project) => {
              const isCurrent = String(project.id) === String(projectId);

              return (
                <DropdownMenuItem
                  key={project.id}
                  asChild
                  className={[
                    "rounded-lg p-0 outline-none",

                    "focus:text-foreground",
                    "data-[highlighted]:text-foreground",

                    isCurrent
                      ? [
                          /* LIGHT CURRENT */
                          "bg-brand-secondary-highlight/[0.045]",

                          "focus:bg-brand-secondary-highlight/[0.075]",
                          "data-[highlighted]:bg-brand-secondary-highlight/[0.075]",

                          /* DARK CURRENT */
                          "dark:bg-secondary/[0.045]",

                          "dark:focus:bg-secondary/[0.065]",
                          "dark:data-[highlighted]:bg-secondary/[0.065]",

                          "dark:focus:text-foreground",
                          "dark:data-[highlighted]:text-foreground",
                        ].join(" ")
                      : [
                          /* LIGHT */
                          "bg-transparent",

                          "focus:bg-surface-3/50",
                          "data-[highlighted]:bg-surface-3/50",

                          /* DARK */
                          "dark:bg-transparent",

                          "dark:focus:bg-surface-3/70",
                          "dark:data-[highlighted]:bg-surface-3/70",

                          "dark:focus:text-foreground",
                          "dark:data-[highlighted]:text-foreground",
                        ].join(" "),
                  ].join(" ")}
                >
                  <Link
                    to={`/projects/${project.id}`}
                    className={[
                      "flex w-full items-center justify-between gap-3",

                      "rounded-lg px-2.5 py-2.5",

                      "text-inherit outline-none",
                    ].join(" ")}
                  >
                    <div className="min-w-0">
                      <p
                        className={[
                          "truncate text-[0.76rem] font-semibold",

                          isCurrent
                            ? "text-foreground/85 dark:text-foreground"
                            : "text-foreground/75 dark:text-foreground/90",
                        ].join(" ")}
                      >
                        {project.title}
                      </p>

                      <div className="mt-1 flex min-w-0 items-center gap-2">
                        {project.projectCode && (
                          <>
                            <span className="truncate text-[0.55rem] text-muted-foreground/55 dark:text-muted-foreground">
                              {getProjectDisplayCode(project.projectCode)}
                            </span>

                            <span className="h-0.5 w-0.5 shrink-0 rounded-full bg-muted-foreground/20 dark:bg-muted-foreground/45" />
                          </>
                        )}

                        <ProjectStatus status={project.status} />
                      </div>
                    </div>

                    {/* =======================================
                        CURRENT PROJECT
                    ======================================= */}

                    {isCurrent && (
                      <span
                        className={[
                          "flex h-6 w-6 shrink-0 items-center justify-center rounded-md",

                          "bg-brand-secondary-highlight/[0.10]",
                          "text-brand-secondary-highlight",

                          "ring-1 ring-inset",
                          "ring-brand-secondary-highlight/10",

                          "dark:bg-secondary/[0.08]",
                          "dark:text-secondary",
                          "dark:ring-secondary/12",
                        ].join(" ")}
                        aria-label="Current project"
                        title="Current project"
                      >
                        <CheckIcon size={11} strokeWidth={2.7} />
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

        {/* =================================================
            CREATE PROJECT
        ================================================= */}

        {canCreateProject && (
          <>
            <DropdownMenuSeparator className="bg-border/50 dark:bg-border" />

            <DropdownMenuItem
              asChild
              className={[
                "rounded-lg p-0 outline-none",

                "border border-brand-secondary-highlight/10",
                "bg-brand-secondary-highlight/[0.07]",
                "text-brand-secondary-highlight",

                "focus:bg-brand-secondary-highlight/[0.10]",
                "focus:text-brand-secondary-highlight",

                "data-[highlighted]:bg-brand-secondary-highlight/[0.10]",
                "data-[highlighted]:text-brand-secondary-highlight",

                "dark:border-secondary/12",
                "dark:bg-secondary/[0.065]",
                "dark:text-secondary",

                "dark:focus:bg-secondary/[0.095]",
                "dark:focus:text-secondary",

                "dark:data-[highlighted]:bg-secondary/[0.095]",
                "dark:data-[highlighted]:text-secondary",
              ].join(" ")}
            >
              <Link
                to="/projects/new"
                className={[
                  "group/create flex w-full items-center gap-2.5",

                  "rounded-lg px-3 py-2.5",

                  "text-inherit outline-none",
                ].join(" ")}
              >
                <span
                  className={[
                    "flex h-6 w-6 shrink-0 items-center justify-center rounded-md",

                    "bg-brand-secondary-highlight/[0.08]",
                    "text-brand-secondary-highlight",

                    "transition-colors duration-150",

                    "group-hover/create:bg-brand-secondary-highlight/[0.12]",

                    "dark:bg-secondary/[0.08]",
                    "dark:text-secondary",

                    "dark:group-hover/create:bg-secondary/[0.12]",
                  ].join(" ")}
                >
                  <PlusIcon size={13} strokeWidth={2.2} />
                </span>

                <span className="text-[0.7rem] font-semibold">
                  Create new project
                </span>
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
    <div className="px-3 py-5">
      <p className="text-xs font-semibold text-foreground/80 dark:text-foreground">
        No open projects
      </p>

      <p className="mt-1 text-[0.66rem] leading-5 text-muted-foreground/85">
        {isAllocat && canCreateProject
          ? "Create a project or accept client work to continue."
          : canCreateProject
            ? "Create a project when you're ready to start something new."
            : "Your active projects will appear here."}
      </p>
    </div>
  );
}

/* =========================================================
   WORKSPACE ERROR
========================================================= */

function ProjectWorkspaceError({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="flex min-h-[420px] items-center justify-center">
      <div className="max-w-sm text-center">
        <span
          className={[
            "mx-auto flex h-10 w-10 items-center justify-center rounded-xl",

            "bg-surface-3/55",
            "text-muted-foreground",

            "ring-1 ring-inset ring-border/30",

            "dark:bg-surface-2",
            "dark:ring-border",
          ].join(" ")}
        >
          <RefreshCwIcon size={16} />
        </span>

        <h2 className="mt-4 text-base font-semibold tracking-[-0.015em] text-foreground/85 dark:text-foreground">
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
          className={[
            "mt-5 h-9 rounded-lg px-4 text-xs font-semibold shadow-none",
            secondaryActionButton,
          ].join(" ")}
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
        <span
          className={[
            "mx-auto flex h-10 w-10 items-center justify-center rounded-xl",
            workspaceIconSurface,
          ].join(" ")}
        >
          <BlocksIcon size={16} />
        </span>

        <h2 className="mt-4 text-base font-semibold tracking-[-0.015em] text-foreground/85 dark:text-foreground">
          Project unavailable
        </h2>

        <p className="mt-2 text-xs leading-6 text-muted-foreground">
          This project doesn't exist or isn't available to your account.
        </p>

        <Button
          asChild
          variant="outline"
          className={[
            "mt-5 h-9 rounded-lg px-4 text-xs font-semibold shadow-none",
            secondaryActionButton,
          ].join(" ")}
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
      <p className="text-xs font-semibold text-foreground/80 dark:text-foreground">
        Workspace unavailable
      </p>

      <p className="mt-1 text-[0.62rem] leading-5 text-muted-foreground/85">
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
  if (!status?.trim()) return "Unknown";

  return status
    .trim()
    .replace(/[_-]+/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function getProjectDisplayCode(value?: string) {
  const code = value?.trim();

  if (!code) return "";

  const cleanCode = code.startsWith("#") ? code.slice(1) : code;

  if (cleanCode.length <= 10) {
    return `#${cleanCode}`;
  }

  if (cleanCode.toUpperCase().startsWith("PRJ-")) {
    return `#${cleanCode.slice(0, 9)}`;
  }

  return `#${cleanCode.slice(0, 8)}`;
}

export default Dashboard;
