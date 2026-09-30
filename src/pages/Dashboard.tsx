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
  text: string;
};

const projectStatusAppearance: Record<string, ProjectStatusAppearance> = {
  pending: {
    label: "Pending",
    dot: "bg-[#B98645] dark:bg-[#F0A23A]",
    text: "text-[#8A632F] dark:text-[#F0A23A]",
  },

  active: {
    label: "Active",
    dot: "bg-[#315E6C] dark:bg-[#DEDA00]",
    text: "text-[#315E6C] dark:text-[#DEDA00]",
  },

  completionrequested: {
    label: "Awaiting confirmation",
    dot: "bg-[#B98645] dark:bg-[#F0A23A]",
    text: "text-[#8A632F] dark:text-[#F0A23A]",
  },

  paused: {
    label: "Paused",
    dot: "bg-[#7B9095]",
    text: "text-[#687C81] dark:text-[#9ABAC2]",
  },

  onhold: {
    label: "On hold",
    dot: "bg-[#7B9095]",
    text: "text-[#687C81] dark:text-[#9ABAC2]",
  },

  complete: {
    label: "Completed",
    dot: "bg-[#568B5E] dark:bg-[#38D200]",
    text: "text-[#477A4F] dark:text-[#38D200]",
  },

  completed: {
    label: "Completed",
    dot: "bg-[#568B5E] dark:bg-[#38D200]",
    text: "text-[#477A4F] dark:text-[#38D200]",
  },

  closed: {
    label: "Completed",
    dot: "bg-[#568B5E] dark:bg-[#38D200]",
    text: "text-[#477A4F] dark:text-[#38D200]",
  },

  cancelled: {
    label: "Cancelled",
    dot: "bg-[#AD3A12]",
    text: "text-[#9F3C1A] dark:text-[#D27857]",
  },

  canceled: {
    label: "Cancelled",
    dot: "bg-[#AD3A12]",
    text: "text-[#9F3C1A] dark:text-[#D27857]",
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

    return projects.find(project => String(project.id) === String(projectId));
  }, [projects, projectId]);

  const projectBasePath = projectId ? `/projects/${projectId}` : "/projects";
  const hasProjectAccess = Boolean(currentProject && projectId);

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <div className="flex min-h-screen flex-col bg-[#F3F5F2] text-[#30383A] dark:bg-[#08171C] dark:text-white">
      {/* ===================================================
          GLOBAL HEADER
      =================================================== */}

      <header className="sticky top-0 z-50 border-b border-[#315E6C]/[0.06] bg-[#F7F9F7]/95 backdrop-blur-xl dark:border-white/[0.055] dark:bg-[#08171C]/95">
        <div className="container mx-auto px-4 sm:px-5 md:px-8">
          <DashboardMainNav />
        </div>
      </header>

      {/* ===================================================
          MOBILE PROJECT BAR
      =================================================== */}

      <div className="sticky top-16 z-40 border-b border-[#315E6C]/[0.07] bg-[#F3F5F2]/95 backdrop-blur-xl dark:border-white/[0.055] dark:bg-[#0C1D22]/95 sm:top-[4.25rem] lg:hidden">
        <div className="container mx-auto flex min-h-[3.75rem] items-center justify-between gap-4 px-4 py-2.5 sm:px-5 md:px-8">
          <div className="flex min-w-0 items-center gap-3">
            <span
              className={[
                "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
                "bg-[#E0E9E6] text-[#315E6C]",
                "dark:bg-[#DEDA00]/[0.08] dark:text-[#DEDA00]",
              ].join(" ")}
            >
              <LayoutDashboardIcon size={14} />
            </span>

            <div className="min-w-0">
              <p className="text-[0.52rem] font-semibold uppercase tracking-[0.16em] text-[#778588] dark:text-white/27">
                Project workspace
              </p>

              <div className="mt-0.5 flex min-w-0 items-center gap-2">
                <h1 className="truncate text-sm font-semibold tracking-[-0.015em]">
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
              "h-8 w-8 shrink-0 rounded-lg shadow-none transition-colors",
              mobileMenuOpen
                ? [
                    "bg-[#315E6C] text-white hover:bg-[#294F5B] hover:text-white",
                    "dark:bg-[#DEDA00] dark:text-[#303030]",
                    "dark:hover:bg-[#D4D000] dark:hover:text-[#303030]",
                  ].join(" ")
                : [
                    "text-[#6C7D81] hover:bg-[#E3E9E6] hover:text-[#315E6C]",
                    "dark:text-white/34 dark:hover:bg-white/[0.05] dark:hover:text-white",
                  ].join(" "),
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
            {mobileMenuOpen ? <XIcon size={16} /> : <MenuIcon size={16} />}
          </Button>
        </div>

        {mobileMenuOpen && (
          <div
            id="mobile-project-navigation"
            className="border-t border-[#315E6C]/[0.06] dark:border-white/[0.055]"
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
                        ? "border-t border-[#315E6C]/[0.07] pt-4 dark:border-white/[0.06]"
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

          <aside className="hidden min-h-0 border-r border-[#315E6C]/[0.075] lg:block dark:border-white/[0.06]">
            <div className="sticky top-[5.75rem] flex max-h-[calc(100vh-6rem)] flex-col py-7 pr-6 xl:pr-7">
              {/* =============================================
                  CURRENT PROJECT
              ============================================= */}

              <div className="pb-7">
                <Link
                  to="/projects"
                  className={[
                    "group inline-flex items-center gap-2",
                    "text-[0.68rem] font-medium text-[#728185]",
                    "transition-colors hover:text-[#315E6C]",
                    "dark:text-white/31 dark:hover:text-white",
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
                      "bg-[#DCE7E3] text-[#315E6C]",
                      "dark:bg-[#DEDA00]/[0.08] dark:text-[#DEDA00]",
                    ].join(" ")}
                  >
                    <LayoutDashboardIcon size={17} />
                  </span>

                  <div className="min-w-0 pt-0.5">
                    <p className="text-[0.52rem] font-semibold uppercase tracking-[0.16em] text-[#7B898C] dark:text-white/25">
                      Current project
                    </p>

                    <h1 className="mt-1.5 line-clamp-2 break-words text-[0.94rem] font-semibold leading-[1.2] tracking-[-0.018em]">
                      {currentProject?.title || "Project workspace"}
                    </h1>

                    {/* {currentProject?.projectCode && (
                      <p className="mt-1.5 truncate text-[0.58rem] text-[#849194] dark:text-white/21">
                        {currentProject.projectCode}
                      </p>
                    )} */}

                    {currentProject?.projectCode && (
                      <p className="mt-1.5 truncate text-[0.58rem] text-[#849194] dark:text-[#94A3B8]">
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

              {/* =============================================
                  PROJECT NAVIGATION
              ============================================= */}

              <div className="min-h-0 flex-1 overflow-y-auto border-t border-[#315E6C]/[0.07] py-5 dark:border-white/[0.055]">
                {!loadingProjects && hasProjectAccess ? (
                  <>
                    <p className="mb-2 px-2 text-[0.5rem] font-semibold uppercase tracking-[0.17em] text-[#7A888B] dark:text-white/23">
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

              <div className="border-t border-[#315E6C]/[0.07] pt-4 dark:border-white/[0.055]">
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
      dot: "bg-[#7B9095]",
      text: "text-[#687C81] dark:text-[#9ABAC2]",
    };

  const needsAttention = normalized === "completionrequested";

  return (
    <span
      className={[
        "inline-flex w-fit items-center gap-1.5 text-[0.58rem] font-semibold",
        appearance.text,
        className,
      ].join(" ")}
    >
      <span className="relative flex h-1.5 w-1.5 shrink-0">
        {needsAttention && (
          <span
            className={[
              "absolute inline-flex h-full w-full animate-ping rounded-full opacity-25",
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
      {managerLinks.map(link => {
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
          "text-[#9F3C1A] transition-colors hover:bg-[#AD3A12]/[0.05]",
          "dark:text-[#D27857]",
        ].join(" ")}
      >
        <RefreshCwIcon size={14} />

        <div>
          <p className="text-xs font-semibold">Try loading again</p>

          <p className="mt-0.5 text-[0.58rem] opacity-70">
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
            "group flex w-full items-center justify-between gap-3 rounded-lg px-2 py-2.5 text-left",
            "transition-colors duration-200",
            "hover:bg-[#E4EAE7] data-[state=open]:bg-[#E4EAE7]",
            "dark:hover:bg-white/[0.04] dark:data-[state=open]:bg-white/[0.04]",
          ].join(" ")}
        >
          <div className="flex min-w-0 items-center gap-3">
            <span
              className={[
                "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
                "bg-[#E2E9E6] text-[#687C81]",
                "transition-colors duration-200",
                "group-hover:bg-[#315E6C] group-hover:text-white",
                "group-data-[state=open]:bg-[#315E6C] group-data-[state=open]:text-white",
                "dark:bg-white/[0.035] dark:text-white/30",
                "dark:group-hover:bg-[#DEDA00] dark:group-hover:text-[#303030]",
                "dark:group-data-[state=open]:bg-[#DEDA00] dark:group-data-[state=open]:text-[#303030]",
              ].join(" ")}
            >
              <ArrowRightLeftIcon size={13} />
            </span>

            <div className="min-w-0">
              <p className="text-[0.5rem] font-semibold uppercase tracking-[0.15em] text-[#788689] dark:text-white/23">
                Switch project
              </p>

              <p className="mt-0.5 truncate text-xs font-semibold">
                {currentProject?.title || "Choose project"}
              </p>
            </div>
          </div>

          <ChevronDownIcon
            size={13}
            className="shrink-0 text-[#7C8A8D] transition-transform duration-200 group-data-[state=open]:rotate-180 dark:text-white/25"
          />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="start"
        side={side}
        sideOffset={8}
        className={[
          "w-[min(300px,calc(100vw-2rem))] rounded-xl p-1.5",
          "border-[#315E6C]/[0.09] bg-[#F8FAF8] text-[#30383A]",
          "shadow-[0_18px_50px_-24px_rgba(28,48,54,0.24)]",
          "dark:border-white/[0.08] dark:bg-[#10262D] dark:text-white",
          "dark:shadow-[0_18px_50px_-24px_rgba(0,0,0,0.65)]",
        ].join(" ")}
      >
        <DropdownMenuLabel className="px-2.5 py-2">
          <p className="text-[0.54rem] font-semibold uppercase tracking-[0.16em] text-[#778588] dark:text-white/27">
            Your projects
          </p>
        </DropdownMenuLabel>

        <DropdownMenuSeparator className="bg-[#315E6C]/[0.07] dark:bg-white/[0.07]" />

        <div className="max-h-72 overflow-y-auto py-1">
          {projects.length > 0 ? (
            projects.map(project => {
              const isCurrent = String(project.id) === String(projectId);

              return (
                <DropdownMenuItem
                  key={project.id}
                  asChild
                  className={[
                    "rounded-lg",
                    "focus:bg-[#E5ECE9] dark:focus:bg-white/[0.05]",
                    isCurrent
                      ? "bg-[#E5ECE9] dark:bg-white/[0.045]"
                      : "",
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
                        {/* {project.projectCode && (
                          <>
                            <span className="truncate text-[0.58rem] text-[#7D8A8D] dark:text-white/26">
                              {project.projectCode}
                            </span>

                            <span className="h-0.5 w-0.5 shrink-0 rounded-full bg-[#7D8A8D]/50 dark:bg-white/20" />
                          </>
                        )} */}
                        {project.projectCode && (
                          <>
                            <span className="truncate text-[0.58rem] text-[#7D8A8D] dark:text-[#94A3B8]">
                              {getProjectDisplayCode(project.projectCode)}
                            </span>

                            <span className="h-0.5 w-0.5 shrink-0 rounded-full bg-[#7D8A8D]/50 dark:bg-white/20" />
                          </>
                        )}

                        <ProjectStatus status={project.status} />
                      </div>
                    </div>

                    {isCurrent && (
                      <span
                        className={[
                          "flex h-6 w-6 shrink-0 items-center justify-center rounded-md",
                          "bg-[#315E6C] text-white",
                          "dark:bg-[#DEDA00] dark:text-[#303030]",
                        ].join(" ")}
                      >
                        <CheckIcon size={11} strokeWidth={3} />
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
            <DropdownMenuSeparator className="bg-[#315E6C]/[0.07] dark:bg-white/[0.07]" />

            <DropdownMenuItem
              asChild
              className={[
                "rounded-lg p-0",
                "focus:bg-transparent",
              ].join(" ")}
            >
              <Link
                to="/projects/new"
                className={[
                  "flex w-full items-center gap-2 rounded-lg px-3 py-2.5",
                  "bg-[#315E6C] text-white",
                  "transition-colors hover:bg-[#294F5B]",
                  "dark:bg-[#DEDA00] dark:text-[#303030]",
                  "dark:hover:bg-[#D4D000] dark:hover:text-[#303030]",
                ].join(" ")}
              >
                <PlusIcon size={14} />
                <span className="text-xs font-semibold">
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
    <div className="px-3 py-6">
      <p className="text-sm font-semibold">No projects available</p>

      <p className="mt-1 text-xs leading-5 text-[#788689] dark:text-white/29">
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

function ProjectWorkspaceError({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="flex min-h-[420px] items-center justify-center">
      <div className="max-w-sm text-center">
        <span className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-[#E1E8E5] text-[#687B80] dark:bg-white/[0.04] dark:text-white/30">
          <RefreshCwIcon size={16} />
        </span>

        <h2 className="mt-4 text-base font-semibold tracking-[-0.015em]">
          Could not load this workspace
        </h2>

        <p className="mt-2 text-xs leading-6 text-[#748185] dark:text-white/31">
          We couldn't confirm your project access. Try loading your workspace
          again.
        </p>

        <Button
          type="button"
          variant="outline"
          onClick={onRetry}
          className={[
            "mt-5 h-9 rounded-lg px-4 text-xs font-semibold shadow-none",
            "border-[#315E6C]/[0.11] bg-transparent text-[#315E6C]",
            "hover:bg-[#E8EEEB]",
            "dark:border-white/[0.09] dark:text-white/65",
            "dark:hover:bg-white/[0.04] dark:hover:text-white",
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
        <span className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-[#DCE7E3] text-[#315E6C] dark:bg-[#DEDA00]/[0.08] dark:text-[#DEDA00]">
          <BlocksIcon size={16} />
        </span>

        <h2 className="mt-4 text-base font-semibold tracking-[-0.015em]">
          Project unavailable
        </h2>

        <p className="mt-2 text-xs leading-6 text-[#748185] dark:text-white/31">
          This project doesn't exist or isn't available to your account.
        </p>

        <Button
          asChild
          variant="outline"
          className={[
            "mt-5 h-9 rounded-lg px-4 text-xs font-semibold shadow-none",
            "border-[#315E6C]/[0.11] bg-transparent text-[#315E6C]",
            "hover:bg-[#E8EEEB]",
            "dark:border-white/[0.09] dark:text-white/65",
            "dark:hover:bg-white/[0.04] dark:hover:text-white",
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
      <p className="text-xs font-semibold">Workspace unavailable</p>

      <p className="mt-1 text-[0.62rem] leading-5 text-[#788689] dark:text-white/27">
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
    .replace(/\b\w/g, letter => letter.toUpperCase());
}

function getProjectDisplayCode(value?: string) {
  const code = value?.trim();

  if (!code) return "";

  const cleanCode = code.startsWith("#")
    ? code.slice(1)
    : code;

  if (cleanCode.length <= 10) {
    return `#${cleanCode}`;
  }

  if (cleanCode.toUpperCase().startsWith("PRJ-")) {
    return `#${cleanCode.slice(0, 9)}`;
  }

  return `#${cleanCode.slice(0, 8)}`;
}

export default Dashboard;