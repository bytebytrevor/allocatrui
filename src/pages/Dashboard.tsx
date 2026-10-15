import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
} from "react";

import {
  Link,
  NavLink,
  Outlet,
  useLocation,
  useParams,
} from "react-router-dom";

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
  MailIcon,
  MenuIcon,
  PlusIcon,
  RefreshCwIcon,
  SearchIcon,
} from "lucide-react";

import api from "@/api/axios";
import { useAuth } from "@/auth/useAuth";

import DashboardMainNav from "@/components/DashboardMainNav";
import LoadingState from "@/components/LoadingState";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  menuItem,
  menuSurface,
  primaryAction,
  ProjectStatus,
  quietAction,
  secondaryAction,
} from "@/components/workspace-ui";

import {
  CLOSED_PROJECT_STATUSES,
  normalizeStatus,
  projectCode,
} from "@/components/workspace-utils";

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
   DASHBOARD
========================================================= */

export default function Dashboard() {
  const { projectId } = useParams();
  const { pathname } = useLocation();
  const { user } = useAuth();

  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [headerHeight, setHeaderHeight] = useState(64);

  const headerRef = useRef<HTMLElement>(null);
  const requestRef = useRef(0);

  /* =======================================================
     LOAD PROJECTS
  ======================================================= */

  const fetchProjects = useCallback(async () => {
    const request = ++requestRef.current;

    setLoading(true);
    setError(null);

    try {
      const response = await api.get<Project[]>("/projects", {
        withCredentials: true,
      });

      if (request === requestRef.current) {
        setProjects(Array.isArray(response.data) ? response.data : []);
      }
    } catch {
      if (request === requestRef.current) {
        setProjects([]);
        setError("Your projects could not be loaded. Please try again.");
      }
    } finally {
      if (request === requestRef.current) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    void fetchProjects();

    return () => {
      requestRef.current += 1;
    };
  }, [fetchProjects]);

  /* =======================================================
     ROUTE CHANGES
  ======================================================= */

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  /* =======================================================
     HEADER HEIGHT
  ======================================================= */

  useEffect(() => {
    const header = headerRef.current;

    if (!header) return;

    const measure = () => {
      setHeaderHeight(Math.ceil(header.getBoundingClientRect().height));
    };

    const observer = new ResizeObserver(measure);

    observer.observe(header);
    measure();

    return () => observer.disconnect();
  }, []);

  /* =======================================================
     PROJECT CONTEXT
  ======================================================= */

  const currentProject = useMemo(
    () => projects.find((item) => String(item.id) === String(projectId)),
    [projects, projectId],
  );

  const openProjects = useMemo(
    () =>
      projects.filter(
        (item) => !CLOSED_PROJECT_STATUSES.has(normalizeStatus(item.status)),
      ),
    [projects],
  );

  const basePath = projectId ? `/projects/${projectId}` : "/projects";
  const canAccess = Boolean(currentProject && projectId);

  const switcher = (
    <ProjectSwitcher
      projects={openProjects}
      currentProject={currentProject}
      projectId={projectId}
      isAllocat={Boolean(user?.isAllocat)}
      canCreate={Boolean(user)}
      error={error}
      onRetry={fetchProjects}
    />
  );

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <div
      className="min-h-screen bg-background text-foreground"
      style={
        {
          "--workspace-header-height": `${headerHeight}px`,
        } as CSSProperties
      }
    >
      {/* MAIN NAVIGATION */}

      <header
        ref={headerRef}
        className="sticky top-0 z-50 border-b border-border/70 bg-background"
      >
        <div className="mx-auto w-full max-w-[1800px] px-4 sm:px-6 lg:px-8">
          <DashboardMainNav />
        </div>
      </header>

      {/* MOBILE WORKSPACE NAVIGATION */}

      <div className="sticky top-[var(--workspace-header-height)] z-40 border-b border-border/70 lg:hidden">
        <div className="flex min-h-14 items-center gap-3 px-4 sm:px-6">
          <div className="min-w-0 flex-1">
            {loading ? (
              <p className="text-xs text-muted-foreground">
                Loading workspace…
              </p>
            ) : (
              switcher
            )}
          </div>

          {canAccess && (
            <DropdownMenu
              modal={false}
              open={mobileOpen}
              onOpenChange={setMobileOpen}
            >
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  aria-label="Open workspace navigation"
                  className={`${quietAction} h-10 w-10 px-0`}
                >
                  <MenuIcon size={18} aria-hidden="true" />
                </button>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                align="end"
                sideOffset={8}
                collisionPadding={12}
                className={`${menuSurface} w-56`}
              >
                <DropdownMenuLabel className="px-3 py-2 text-[10px] font-medium uppercase tracking-[0.1em] text-muted-foreground">
                  Workspace
                </DropdownMenuLabel>

                <ProjectNavigation
                  basePath={basePath}
                  menu
                  onNavigate={() => setMobileOpen(false)}
                />
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>

      {/* WORKSPACE */}

      <div className="mx-auto grid w-full max-w-[1800px] lg:grid-cols-[236px_minmax(0,1fr)] xl:grid-cols-[248px_minmax(0,1fr)]">
        {/* DESKTOP SIDEBAR */}

        <aside
          aria-label="Project navigation"
          className="hidden border-r border-border/70 lg:block"
        >
          <div className="sticky top-[var(--workspace-header-height)] flex h-[calc(100dvh-var(--workspace-header-height))] min-h-0 flex-col px-4 py-5">
            <Link
              to="/projects"
              className={`${quietAction} justify-start px-3`}
            >
              <ArrowLeftIcon size={13} aria-hidden="true" />
              All projects
            </Link>

            <div className="mb-5 mt-4 rounded-xl border border-border/70 p-1">
              {loading ? (
                <p className="px-3 py-4 text-xs text-muted-foreground">
                  Loading projects…
                </p>
              ) : (
                switcher
              )}
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto">
              <p className="mb-3 px-3 text-[10px] font-medium uppercase tracking-[0.12em] text-muted-foreground">
                Workspace
              </p>

              {!loading && canAccess ? (
                <ProjectNavigation basePath={basePath} />
              ) : (
                !loading && (
                  <p className="px-3 text-xs leading-6 text-muted-foreground">
                    Select an available project to continue.
                  </p>
                )
              )}
            </div>

            <div className="mt-5 border-t border-border/70 px-3 pt-4">
              <p className="text-[10px] font-medium uppercase tracking-[0.1em] text-muted-foreground">
                Your access
              </p>

              <p className="mt-1.5 text-xs text-foreground">
                {user?.isAllocat ? "Allocat workspace" : "Project workspace"}
              </p>

              <p className="mt-1 text-[11px] leading-5 text-muted-foreground">
                Tools and actions follow your project permissions.
              </p>
            </div>
          </div>
        </aside>

        {/* PAGE CONTENT */}

        <main className="min-w-0 px-4 py-5 sm:px-6 sm:py-6 lg:px-8 lg:py-7">
          {loading ? (
            <LoadingState
              label="Loading your workspace"
              className="min-h-[420px]"
            />
          ) : error ? (
            <WorkspaceError message={error} onRetry={fetchProjects} />
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
            <WorkspaceError message="This project does not exist or is not available to your account." />
          )}
        </main>
      </div>
    </div>
  );
}

/* =========================================================
   PROJECT NAVIGATION
========================================================= */

function ProjectNavigation({
  basePath,
  menu = false,
  onNavigate,
}: {
  basePath: string;
  menu?: boolean;
  onNavigate?: () => void;
}) {
  const links = managerLinks.map(({ label, path, icon: Icon }) => {
    const link = (
      <NavLink
        to={path ? `${basePath}/${path}` : basePath}
        end={!path}
        onClick={onNavigate}
        className={({ isActive }) =>
          menu
            ? [
                "flex min-h-10 items-center gap-3",
                "px-3 py-2.5 text-xs",
                isActive
                  ? "text-brand-secondary-highlight dark:text-secondary"
                  : "text-foreground",
              ].join(" ")
            : [
                "relative flex min-h-11 items-center gap-3",
                "rounded-lg px-3 py-2.5",
                "text-xs font-medium",
                "transition-colors",
                "focus-visible:outline-none",
                "focus-visible:ring-2",
                "focus-visible:ring-ring/35",
                "motion-reduce:transition-none",
                isActive
                  ? "bg-card text-brand-secondary-highlight dark:text-secondary"
                  : "text-muted-foreground hover:bg-card/70 hover:text-foreground",
              ].join(" ")
        }
      >
        {({ isActive }) => (
          <>
            {isActive && !menu && (
              <span
                aria-hidden="true"
                className="absolute bottom-3 left-0 top-3 w-0.5 rounded-full bg-brand-secondary-highlight dark:bg-secondary"
              />
            )}

            <Icon
              size={16}
              aria-hidden="true"
              className="shrink-0 text-inherit"
            />

            <span>{label}</span>
          </>
        )}
      </NavLink>
    );

    return menu ? (
      <DropdownMenuItem asChild key={label} className={`${menuItem} p-0`}>
        {link}
      </DropdownMenuItem>
    ) : (
      <div key={label}>{link}</div>
    );
  });

  return menu ? (
    <>{links}</>
  ) : (
    <nav aria-label="Project workspace" className="space-y-1">
      {links}
    </nav>
  );
}

/* =========================================================
   PROJECT SWITCHER
========================================================= */

function ProjectSwitcher({
  projects,
  currentProject,
  projectId,
  isAllocat,
  canCreate,
  error,
  onRetry,
}: {
  projects: Project[];
  currentProject?: Project;
  projectId?: string;
  isAllocat: boolean;
  canCreate: boolean;
  error: string | null;
  onRetry: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const inputRef = useRef<HTMLInputElement>(null);

  const matches = projects.filter((item) =>
    `${item.title} ${item.projectCode ?? ""}`
      .toLowerCase()
      .includes(query.trim().toLowerCase()),
  );

  useEffect(() => {
    if (!open) {
      setQuery("");
      return;
    }

    const frame = requestAnimationFrame(() => inputRef.current?.focus());

    return () => cancelAnimationFrame(frame);
  }, [open]);

  if (error) {
    return (
      <button
        type="button"
        onClick={onRetry}
        className={`${quietAction} w-full justify-start`}
      >
        <RefreshCwIcon size={14} aria-hidden="true" />
        Reload projects
      </button>
    );
  }

  return (
    <DropdownMenu modal={false} open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label="Switch project"
          className={[
            "flex min-h-12 w-full min-w-0 items-center gap-3",
            "rounded-lg px-3 py-3 text-left",
            "transition-opacity hover:opacity-80",
            "focus-visible:outline-none",
            "focus-visible:ring-2",
            "focus-visible:ring-ring/35",
          ].join(" ")}
        >
          <ArrowRightLeftIcon
            size={16}
            aria-hidden="true"
            className="shrink-0 text-brand-secondary-highlight dark:text-secondary"
          />

          <span className="min-w-0 flex-1">
            <span className="block truncate text-xs font-medium text-foreground">
              {currentProject?.title || "Choose a project"}
            </span>

            {currentProject ? (
              <span className="mt-1 block">
                <ProjectStatus status={currentProject.status} />
              </span>
            ) : (
              <span className="mt-1 block text-[11px] text-muted-foreground">
                Switch workspace
              </span>
            )}
          </span>

          <ChevronDownIcon
            size={13}
            aria-hidden="true"
            className="shrink-0 text-muted-foreground"
          />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="start"
        sideOffset={8}
        collisionPadding={12}
        className={`${menuSurface} w-[320px] max-w-[calc(100vw-24px)]`}
      >
        <DropdownMenuLabel className="px-3 py-2 text-[10px] font-medium uppercase tracking-[0.1em] text-muted-foreground">
          Open projects
        </DropdownMenuLabel>

        <div className="relative mx-1 mb-2">
          <SearchIcon
            size={13}
            aria-hidden="true"
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          />

          <input
            ref={inputRef}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            aria-label="Search projects"
            placeholder="Search projects"
            className="h-10 w-full rounded-lg border border-input bg-surface-2 pl-9 pr-3 text-base outline-none focus-visible:border-ring/50 sm:text-xs"
            onKeyDown={(event) => {
              if (event.key === "Escape") return;

              if (event.key === "ArrowDown") {
                event.preventDefault();

                event.currentTarget
                  .closest('[role="menu"]')
                  ?.querySelector<HTMLElement>('[role="menuitem"]')
                  ?.focus();
              }

              event.stopPropagation();
            }}
          />
        </div>

        <div className="max-h-72 overflow-y-auto">
          {matches.length ? (
            matches.map((project) => (
              <DropdownMenuItem
                asChild
                key={project.id}
                className={`${menuItem} p-0`}
              >
                <Link
                  to={`/projects/${project.id}`}
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-between gap-3 px-3 py-3"
                >
                  <span className="min-w-0">
                    <span className="block truncate text-xs font-medium">
                      {project.title}
                    </span>

                    <span className="mt-1.5 flex flex-wrap items-center gap-2">
                      <span className="text-[10px] text-muted-foreground">
                        {projectCode(project.projectCode)}
                      </span>

                      <ProjectStatus status={project.status} />
                    </span>
                  </span>

                  {String(project.id) === String(projectId) && (
                    <CheckIcon
                      size={14}
                      aria-label="Current project"
                      className="shrink-0 text-brand-secondary-highlight dark:text-secondary"
                    />
                  )}
                </Link>
              </DropdownMenuItem>
            ))
          ) : (
            <div className="px-3 py-4">
              <p className="text-xs font-medium">
                {query ? "No matching projects" : "No open projects"}
              </p>

              <p className="mt-1 text-[11px] leading-5 text-muted-foreground">
                {query
                  ? "Try a different name or project code."
                  : isAllocat
                    ? "Create a project or accept client work to continue."
                    : "Create a project when you’re ready to start."}
              </p>
            </div>
          )}
        </div>

        {canCreate && (
          <>
            <DropdownMenuSeparator className="bg-border/70" />

            <DropdownMenuItem asChild className={`${menuItem} p-0`}>
              <Link
                to="/projects/new"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2 px-3 py-3 text-brand-secondary-highlight dark:text-secondary"
              >
                <PlusIcon
                  size={14}
                  aria-hidden="true"
                  className="text-inherit"
                />
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
   WORKSPACE ERROR
========================================================= */

function WorkspaceError({
  message,
  onRetry,
}: {
  message: string;
  onRetry?: () => void;
}) {
  return (
    <div className="flex min-h-[420px] items-center justify-center">
      <div className="max-w-sm text-center">
        <BlocksIcon
          size={28}
          aria-hidden="true"
          className="mx-auto text-muted-foreground"
        />

        <h1 className="mt-5 text-lg font-medium">Workspace unavailable</h1>

        <p className="mt-2 text-sm leading-7 text-muted-foreground">
          {message}
        </p>

        <div className="mt-5 flex flex-wrap justify-center gap-2">
          {onRetry && (
            <button type="button" onClick={onRetry} className={secondaryAction}>
              <RefreshCwIcon size={14} aria-hidden="true" />
              Try again
            </button>
          )}

          <Link
            to="/projects"
            className={onRetry ? quietAction : primaryAction}
          >
            All projects
          </Link>
        </div>
      </div>
    </div>
  );
}
