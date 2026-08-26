// import { useEffect, useMemo, useState } from "react";
// import { Link, Outlet, useParams } from "react-router-dom";
// import {
//   ArrowLeftIcon,
//   ArrowRightLeftIcon,
//   BanknoteIcon,
//   BlocksIcon,
//   CalendarDaysIcon,
//   ChartNoAxesColumnIcon,
//   CheckIcon,
//   ChevronDownIcon,
//   HeartIcon,
//   LayoutDashboardIcon,
//   LoaderCircleIcon,
//   MailIcon,
//   MenuIcon,
//   PlusIcon,
//   RefreshCwIcon,
//   XIcon,
// } from "lucide-react";

// import api from "@/api/axios";
// import DashboardMainNav from "@/components/DashboardMainNav";
// import DashboardNavLink from "@/components/DashboardNavLink";
// import { Button } from "@/components/ui/button";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import type { Project } from "@/Types/project";

// const managerLinks = [
//   {
//     label: "Manager",
//     path: "",
//     icon: BlocksIcon,
//   },
//   {
//     label: "Calendar",
//     path: "calendar",
//     icon: CalendarDaysIcon,
//   },
//   {
//     label: "Messaging",
//     path: "messaging",
//     icon: MailIcon,
//   },
//   {
//     label: "Analytics",
//     path: "analytics",
//     icon: ChartNoAxesColumnIcon,
//   },
//   {
//     label: "Favorites",
//     path: "favorites",
//     icon: HeartIcon,
//   },
//   {
//     label: "Transactions",
//     path: "transactions",
//     icon: BanknoteIcon,
//   },
// ];

// function Dashboard() {
//   const { projectId } = useParams();

//   const [projects, setProjects] = useState<Project[]>([]);
//   const [loadingProjects, setLoadingProjects] = useState(true);
//   const [projectsError, setProjectsError] = useState<string | null>(
//     null,
//   );
//   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

//   async function fetchProjects() {
//     setLoadingProjects(true);
//     setProjectsError(null);

//     try {
//       const response = await api.get<Project[]>("/projects", {
//         withCredentials: true,
//       });

//       setProjects(response.data);
//     } catch (error) {
//       console.error(error);
//       setProjectsError("Projects could not be loaded.");
//     } finally {
//       setLoadingProjects(false);
//     }
//   }

//   useEffect(() => {
//     void fetchProjects();
//   }, []);

//   const currentProject = useMemo(() => {
//     return projects.find(
//       (project) => String(project.id) === String(projectId),
//     );
//   }, [projects, projectId]);

//   const projectBasePath = `/projects/${projectId}`;

//   return (
//     <div className="flex min-h-screen flex-col bg-background text-foreground transition-colors">
//       <header className="sticky top-0 z-50 border-b border-border bg-background/85 backdrop-blur-xl">
//         <div className="container mx-auto px-4 sm:px-5 md:px-8">
//           <DashboardMainNav />
//         </div>
//       </header>

//       {/* Mobile project heading */}
//       <div className="border-b border-border bg-card lg:hidden">
//         <div className="container mx-auto flex items-center justify-between gap-4 px-5 py-4 md:px-8">
//           <div className="min-w-0">
//             <p className="text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
//               Project manager
//             </p>

//             <h1 className="mt-1 truncate text-sm font-black uppercase tracking-[-0.01em]">
//               {currentProject?.title || "Project workspace"}
//             </h1>
//           </div>

//           <Button
//             type="button"
//             variant="outline"
//             size="icon"
//             className="h-10 w-10 shrink-0 rounded-full"
//             onClick={() => setMobileMenuOpen((current) => !current)}
//             aria-label={
//               mobileMenuOpen
//                 ? "Close project navigation"
//                 : "Open project navigation"
//             }
//           >
//             {mobileMenuOpen ? (
//               <XIcon size={18} />
//             ) : (
//               <MenuIcon size={18} />
//             )}
//           </Button>
//         </div>

//         {mobileMenuOpen && (
//           <div className="container mx-auto px-5 pb-5 md:px-8">
//             <div className="rounded-[1.5rem] border border-border bg-background p-3">
//               <ProjectNavigation
//                 basePath={projectBasePath}
//                 onNavigate={() => setMobileMenuOpen(false)}
//               />

//               <div className="mt-3 border-t border-border pt-3">
//                 <ProjectSwitcher
//                   projects={projects}
//                   projectId={projectId}
//                   loading={loadingProjects}
//                   error={projectsError}
//                   currentProject={currentProject}
//                   onRetry={fetchProjects}
//                 />
//               </div>
//             </div>
//           </div>
//         )}
//       </div>

//       <main className="container mx-auto flex min-h-0 flex-1 px-5 py-6 md:px-8 lg:py-8">
//         <div className="grid min-h-0 w-full gap-7 lg:grid-cols-[260px_minmax(0,1fr)] xl:grid-cols-[280px_minmax(0,1fr)]">
//           {/* Desktop sidebar */}
//           <aside className="hidden min-h-0 lg:block">
//             <div className="sticky top-[6.5rem] flex max-h-[calc(100vh-8rem)] flex-col overflow-hidden rounded-[2rem] border border-border bg-card text-card-foreground">
//               {/* Current project */}
//               <div className="relative overflow-hidden border-b border-border p-6">
//                 <div className="absolute -right-14 -top-16 h-44 w-44 rounded-full bg-primary/10 blur-3xl" />

//                 <div className="relative">
//                   <Link
//                     to="/projects"
//                     className="inline-flex items-center gap-2 text-xs font-semibold text-muted-foreground transition-colors hover:text-foreground"
//                   >
//                     <ArrowLeftIcon size={14} />
//                     All projects
//                   </Link>

//                   <div className="mt-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/12 text-primary">
//                     <LayoutDashboardIcon size={22} />
//                   </div>

//                   <p className="mt-5 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
//                     Project workspace
//                   </p>

//                   <h1 className="mt-2 line-clamp-2 break-words text-xl font-black uppercase leading-[1.05] tracking-[-0.025em]">
//                     {currentProject?.title || "Project manager"}
//                   </h1>

//                   {currentProject?.projectCode && (
//                     <p className="mt-3 text-xs text-muted-foreground">
//                       {currentProject.projectCode}
//                     </p>
//                   )}
//                 </div>
//               </div>

//               {/* Navigation */}
//               <div className="flex-1 overflow-y-auto p-3">
//                 <p className="px-3 pb-3 pt-2 text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
//                   Workspace
//                 </p>

//                 <ProjectNavigation basePath={projectBasePath} />
//               </div>

//               {/* Project switcher */}
//               <div className="border-t border-border p-4">
//                 <ProjectSwitcher
//                   projects={projects}
//                   projectId={projectId}
//                   loading={loadingProjects}
//                   error={projectsError}
//                   currentProject={currentProject}
//                   onRetry={fetchProjects}
//                 />
//               </div>
//             </div>
//           </aside>

//           {/* Page content */}
//           <section className="min-w-0">
//             {/* <div className="min-h-full min-w-0 rounded-[2rem] border border-border bg-card text-card-foreground"> */}
//             <div className="min-h-full min-w-0 rounded-[2rem] text-card-foreground">
//               {/* <div className="min-w-0 p-5 sm:p-6 md:p-8 lg:p-9"> */}
//               <div className="min-w-0 pt-5 sm:pt-6 md:pt-8 lg:pt-9">
//                 <Outlet />
//               </div>
//             </div>
//           </section>
//         </div>
//       </main>
//     </div>
//   );
// }

// type ProjectNavigationProps = {
//   basePath: string;
//   onNavigate?: () => void;
// };

// function ProjectNavigation({
//   basePath,
//   onNavigate,
// }: ProjectNavigationProps) {
//   return (
//     <nav className="space-y-1" aria-label="Project workspace">
//       {managerLinks.map((link) => {
//         const href = link.path
//           ? `${basePath}/${link.path}`
//           : basePath;

//         return (
//           <div key={link.label} onClick={onNavigate}>
//             <DashboardNavLink
//               href={href}
//               icon={link.icon}
//               label={link.label}
//             />
//           </div>
//         );
//       })}
//     </nav>
//   );
// }

// type ProjectSwitcherProps = {
//   projects: Project[];
//   projectId?: string;
//   loading: boolean;
//   error: string | null;
//   currentProject?: Project;
//   onRetry: () => void;
// };

// function ProjectSwitcher({
//   projects,
//   projectId,
//   loading,
//   error,
//   currentProject,
//   onRetry,
// }: ProjectSwitcherProps) {
//   if (loading) {
//     return (
//       <div className="flex items-center gap-3 rounded-[1.25rem] bg-muted/40 px-4 py-3">
//         <LoaderCircleIcon
//           size={17}
//           className="animate-spin text-primary"
//         />

//         <div>
//           <p className="text-xs font-semibold">Loading projects</p>
//           <p className="mt-0.5 text-[0.65rem] text-muted-foreground">
//             Preparing your workspace
//           </p>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <button
//         type="button"
//         onClick={onRetry}
//         className="flex w-full items-center gap-3 rounded-[1.25rem] border border-destructive/20 bg-destructive/5 px-4 py-3 text-left text-destructive"
//       >
//         <RefreshCwIcon size={17} />

//         <div>
//           <p className="text-xs font-semibold">Try loading again</p>
//           <p className="mt-0.5 text-[0.65rem] opacity-70">
//             Project list unavailable
//           </p>
//         </div>
//       </button>
//     );
//   }

//   return (
//     <DropdownMenu>
//       <DropdownMenuTrigger asChild>
//         <button
//           type="button"
//           className={[
//             "flex w-full items-center justify-between gap-3",
//             "rounded-[1.25rem] border border-border bg-background",
//             "px-4 py-3 text-left transition-colors",
//             "hover:border-primary/25 hover:bg-primary/[0.04]",
//           ].join(" ")}
//         >
//           <div className="flex min-w-0 items-center gap-3">
//             <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/12 text-primary">
//               <ArrowRightLeftIcon size={17} />
//             </span>

//             <div className="min-w-0">
//               <p className="text-[0.62rem] font-semibold uppercase tracking-[0.15em] text-muted-foreground">
//                 Switch project
//               </p>

//               <p className="mt-1 truncate text-xs font-bold">
//                 {currentProject?.title || "Choose project"}
//               </p>
//             </div>
//           </div>

//           <ChevronDownIcon
//             size={16}
//             className="shrink-0 text-muted-foreground"
//           />
//         </button>
//       </DropdownMenuTrigger>

//       <DropdownMenuContent
//         align="start"
//         side="top"
//         className="w-[260px] rounded-2xl border-border bg-popover p-2 text-popover-foreground shadow-xl"
//       >
//         <DropdownMenuLabel className="px-3 py-2">
//           <p className="text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
//             Your projects
//           </p>
//         </DropdownMenuLabel>

//         <DropdownMenuSeparator />

//         <div className="max-h-64 overflow-y-auto">
//           {projects.length > 0 ? (
//             projects.map((project) => {
//               const isCurrent =
//                 String(project.id) === String(projectId);

//               return (
//                 <DropdownMenuItem
//                   key={project.id}
//                   asChild
//                   className="rounded-xl"
//                 >
//                   <Link
//                     to={`/projects/${project.id}`}
//                     className="flex items-center justify-between gap-3"
//                   >
//                     <div className="min-w-0">
//                       <p className="truncate text-sm font-semibold">
//                         {project.title}
//                       </p>

//                       {project.projectCode && (
//                         <p className="mt-0.5 text-[0.65rem] text-muted-foreground">
//                           {project.projectCode}
//                         </p>
//                       )}
//                     </div>

//                     {isCurrent && (
//                       <CheckIcon
//                         size={15}
//                         className="shrink-0 text-primary"
//                       />
//                     )}
//                   </Link>
//                 </DropdownMenuItem>
//               );
//             })
//           ) : (
//             <div className="px-3 py-6 text-center">
//               <p className="text-sm font-semibold">
//                 No projects available
//               </p>

//               <p className="mt-1 text-xs text-muted-foreground">
//                 Create a project to begin.
//               </p>
//             </div>
//           )}
//         </div>

//         <DropdownMenuSeparator />

//         <DropdownMenuItem asChild className="rounded-xl">
//           <Link to="/projects/new">
//             <PlusIcon size={15} />
//             Create new project
//           </Link>
//         </DropdownMenuItem>
//       </DropdownMenuContent>
//     </DropdownMenu>
//   );
// }

// export default Dashboard;

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Link,
  Outlet,
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
  LayoutDashboardIcon,
  LoaderCircleIcon,
  MailIcon,
  MenuIcon,
  PlusIcon,
  RefreshCwIcon,
  XIcon,
} from "lucide-react";

import api from "@/api/axios";

import DashboardMainNav from "@/components/DashboardMainNav";
import DashboardNavLink from "@/components/DashboardNavLink";

import {
  Button,
} from "@/components/ui/button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import type {
  Project,
} from "@/Types/project";

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
  const {
    projectId,
  } =
    useParams();

  const [
    projects,
    setProjects,
  ] =
    useState<
      Project[]
    >([]);

  const [
    loadingProjects,
    setLoadingProjects,
  ] =
    useState(true);

  const [
    projectsError,
    setProjectsError,
  ] =
    useState<
      string | null
    >(null);

  const [
    mobileMenuOpen,
    setMobileMenuOpen,
  ] =
    useState(false);

  /* =======================================================
     LOAD PROJECTS
  ======================================================= */

  async function fetchProjects() {
    setLoadingProjects(
      true,
    );

    setProjectsError(
      null,
    );

    try {
      const response =
        await api.get<
          Project[]
        >(
          "/projects",
          {
            withCredentials:
              true,
          },
        );

      setProjects(
        response.data,
      );
    } catch (error) {
      console.error(
        error,
      );

      setProjectsError(
        "Projects could not be loaded.",
      );
    } finally {
      setLoadingProjects(
        false,
      );
    }
  }

  useEffect(() => {
    void fetchProjects();
  }, []);

  /* =======================================================
     CURRENT PROJECT
  ======================================================= */

  const currentProject =
    useMemo(() => {
      return projects.find(
        (
          project,
        ) =>
          String(
            project.id,
          ) ===
          String(
            projectId,
          ),
      );
    }, [
      projects,
      projectId,
    ]);

  const projectBasePath =
    `/projects/${projectId}`;

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
              <LayoutDashboardIcon
                size={17}
              />
            </span>

            <div className="min-w-0">
              <p className="text-[0.58rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                Project workspace
              </p>

              <h1 className="mt-0.5 truncate text-sm font-bold tracking-[-0.015em]">
                {currentProject?.title ||
                  "Project"}
              </h1>
            </div>
          </div>

          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-9 w-9 shrink-0 rounded-lg shadow-none"
            onClick={() =>
              setMobileMenuOpen(
                (
                  current,
                ) =>
                  !current,
              )
            }
            aria-label={
              mobileMenuOpen
                ? "Close project navigation"
                : "Open project navigation"
            }
          >
            {mobileMenuOpen ? (
              <XIcon
                size={18}
              />
            ) : (
              <MenuIcon
                size={18}
              />
            )}
          </Button>
        </div>

        {/* Mobile menu */}

        {mobileMenuOpen && (
          <div className="container mx-auto border-t border-border/70 px-5 py-4 md:px-8">
            <div className="space-y-5">
              <ProjectNavigation
                basePath={
                  projectBasePath
                }
                onNavigate={() =>
                  setMobileMenuOpen(
                    false,
                  )
                }
              />

              <div className="border-t border-border pt-4">
                <ProjectSwitcher
                  projects={
                    projects
                  }
                  projectId={
                    projectId
                  }
                  loading={
                    loadingProjects
                  }
                  error={
                    projectsError
                  }
                  currentProject={
                    currentProject
                  }
                  onRetry={
                    fetchProjects
                  }
                />
              </div>
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

              {/* Current project */}

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
                    <LayoutDashboardIcon
                      size={18}
                    />
                  </span>

                  <div className="min-w-0 pt-0.5">
                    <p className="text-[0.58rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                      Current project
                    </p>

                    <h1 className="mt-1 line-clamp-2 break-words text-base font-black leading-[1.15] tracking-[-0.02em]">
                      {currentProject?.title ||
                        "Project manager"}
                    </h1>

                    {currentProject?.projectCode && (
                      <p className="mt-1.5 truncate text-[0.65rem] text-muted-foreground/70">
                        {
                          currentProject.projectCode
                        }
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Navigation */}

              <div className="flex-1 overflow-y-auto border-t border-border py-5">
                <p className="mb-2 px-2 text-[0.58rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                  Workspace
                </p>

                <ProjectNavigation
                  basePath={
                    projectBasePath
                  }
                />
              </div>

              {/* Switcher */}

              <div className="border-t border-border pt-4">
                <ProjectSwitcher
                  projects={
                    projects
                  }
                  projectId={
                    projectId
                  }
                  loading={
                    loadingProjects
                  }
                  error={
                    projectsError
                  }
                  currentProject={
                    currentProject
                  }
                  onRetry={
                    fetchProjects
                  }
                />
              </div>
            </div>
          </aside>

          {/* =================================================
              PAGE CONTENT
          ================================================= */}

          <section className="min-w-0 py-6 lg:py-8 lg:pl-8 xl:pl-10">
            <div className="min-h-full min-w-0">
              <Outlet />
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
  basePath:
    string;

  onNavigate?:
    () => void;
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
      {managerLinks.map(
        (
          link,
        ) => {
          const href =
            link.path
              ? `${basePath}/${link.path}`
              : basePath;

          return (
            <div
              key={
                link.label
              }
              onClick={
                onNavigate
              }
            >
              <DashboardNavLink
                href={
                  href
                }
                icon={
                  link.icon
                }
                label={
                  link.label
                }
              />
            </div>
          );
        },
      )}
    </nav>
  );
}

/* =========================================================
   PROJECT SWITCHER
========================================================= */

type ProjectSwitcherProps = {
  projects:
    Project[];

  projectId?:
    string;

  loading:
    boolean;

  error:
    string | null;

  currentProject?:
    Project;

  onRetry:
    () => void;
};

function ProjectSwitcher({
  projects,
  projectId,
  loading,
  error,
  currentProject,
  onRetry,
}: ProjectSwitcherProps) {

  /* =======================================================
     LOADING
  ======================================================= */

  if (loading) {
    return (
      <div className="flex items-center gap-3 px-2 py-2">
        <LoaderCircleIcon
          size={16}
          className="animate-spin text-primary"
        />

        <div>
          <p className="text-xs font-semibold">
            Loading projects
          </p>

          <p className="mt-0.5 text-[0.62rem] text-muted-foreground">
            Preparing workspace
          </p>
        </div>
      </div>
    );
  }

  /* =======================================================
     ERROR
  ======================================================= */

  if (error) {
    return (
      <button
        type="button"
        onClick={
          onRetry
        }
        className={[
          "flex w-full items-center gap-3 rounded-lg",
          "px-2 py-2 text-left text-destructive",
          "transition-colors hover:bg-destructive/[0.05]",
        ].join(" ")}
      >
        <RefreshCwIcon
          size={15}
        />

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
              <ArrowRightLeftIcon
                size={14}
              />
            </span>

            <div className="min-w-0">
              <p className="text-[0.56rem] font-semibold uppercase tracking-[0.15em] text-muted-foreground">
                Switch project
              </p>

              <p className="mt-0.5 truncate text-xs font-semibold">
                {currentProject?.title ||
                  "Choose project"}
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
          {projects.length >
          0 ? (
            projects.map(
              (
                project,
              ) => {
                const isCurrent =
                  String(
                    project.id,
                  ) ===
                  String(
                    projectId,
                  );

                return (
                  <DropdownMenuItem
                    key={
                      project.id
                    }
                    asChild
                    className="rounded-lg"
                  >
                    <Link
                      to={`/projects/${project.id}`}
                      className="flex items-center justify-between gap-3 px-2.5 py-2"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold">
                          {
                            project.title
                          }
                        </p>

                        {project.projectCode && (
                          <p className="mt-0.5 truncate text-[0.62rem] text-muted-foreground">
                            {
                              project.projectCode
                            }
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
              },
            )
          ) : (
            <div className="px-3 py-6">
              <p className="text-sm font-semibold">
                No projects available
              </p>

              <p className="mt-1 text-xs leading-5 text-muted-foreground">
                Create a project to begin.
              </p>
            </div>
          )}
        </div>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          asChild
          className="rounded-lg"
        >
          <Link
            to="/projects/new"
            className="py-2"
          >
            <PlusIcon
              size={14}
            />

            Create new project
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default Dashboard;