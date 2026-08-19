// // import DashboardMainNav from "@/components/DashboardMainNav";
// // import {GridView, ListView} from "@/components/ProjectCard";
// // import { Button } from "@/components/ui/button";
// // import { Link } from "react-router-dom";
// // import { Badge } from "@/components/ui/badge";
// // import Electricians from "@/assets/electrician-wide.svg";
// // import { useState, useEffect } from "react";
// // import type { Project } from "@/Types/project";
// // import { useAuth } from "@/auth/AuthContext";
// // import {
// //     ArrowDownNarrowWideIcon,
// //     CircleCheckBigIcon,
// //     CircleDotIcon,
// //     ClockIcon,
// //     FolderOpenDot,
// //     History,
// //     LayoutGrid,
// //     LightbulbIcon,
// //     ListIcon,
// //     LoaderCircleIcon,
// //     Megaphone,
// //     MessagesSquareIcon,
// //     PlusIcon,
// // } from "lucide-react";
// // import api from "@/api/axios";

// // function Projects() {
// //     const [view, setView] = useState("grid");    

// //     function switchView() {
// //         view === "grid" ? setView("list") : setView("grid");
// //     }

// //     const { user } = useAuth();

// //     const [projects, setProjects] = useState<Project[]>([]);
// //     const [loading, setLoading] = useState(true);
// //     const [error, setError] = useState<Error | null>(null);

// //     useEffect(() => {
// //         async function fetchProjects() {
// //             try {
// //                 const response = await api.get(
// //                     "/projects/mine",
// //                     { withCredentials: true, }
// //                 );
// //                 setProjects(response.data);
// //             } catch (err: unknown) {
// //                 if (err instanceof Error) {
// //                     setError(err);
// //                 } else {
// //                     setError(new Error("Unknown"));
// //                 }
// //             } finally {
// //                 setLoading(false);
// //             }
// //         }

// //         fetchProjects();
// //     }, []);


// //     if (loading) return <p>Loading...</p>    
// //     if (error) return <p>Could not load projects</p>

// //     console.log(projects);

// //     return (
// //         <div className="min-h-screen flex flex-col bg-muted">
// //             <header className="sticky top-0 z-10 border-b bg-background/40">
// //                 <div className="container mx-auto px-4">
// //                     <DashboardMainNav />
// //                 </div>
// //             </header>

// //             <main className={projects.length === 0 ? (
// //                 "flex-1 h-screen flex flex-col container px-4 mx-auto") : (
// //                 "container mt-6 px-4 mx-auto"

// //             )}>                  
// //                 {projects.length === 0 ? (
// //                     <div className="h-full w-lg flex-1 flex flex-col items-center justify-center mx-auto">                        
// //                             <FolderOpenDot className="w-24 h-24" />
// //                             {/* <img src={AllocatrIcon} alt="Allocatr icon" className="w-20 rounded-full"/> */}
// //                             <div>Hi <span className="font-semibold">{user?.fullName?.split(" " )[0]}!</span></div>
// //                             <h3 className="flex items-center gap-1 text-2xl font-bold">
// //                                 <CircleCheckBigIcon size={15} strokeWidth={3} />
// //                                 Your workspace is ready
// //                             </h3>
// //                             <span
// //                                 className="flex items-center gap-1 text-xs text-muted-foreground font-medium"
// //                             >
// //                                 {/* Your workspace is ready <CircleCheckBigIcon size={12} strokeWidth={3} /> */}
// //                             </span>
// //                             <p className="text-sm text-center text-muted-foreground py-4">
// //                                 Your dashboard is empty because you haven't created a project. Start one now and begin working with skilled experts
// //                             </p>
// //                             <Link to="/projects/new">
// //                                 <Button className="h-12 text-xs font-medium px-12 mt-4">Create new project</Button>
// //                             </Link>   
                                         
// //                     </div>) : (
// //                         <section className="flex-1 flex gap-12 justify-between w-full">              
// //                         <section className="w-full">
// //                             <div className="flex items-center justify-between rounded-sm">
// //                             {/* <div className="flex items-center justify-between p-4 border bg-muted rounded-sm"> */}
// //                                 <div className="flex items-center gap-2">
// //                                     {/* <NotepadText size={60} className="text-primary" /> */}
// //                                     <div>
// //                                         <h1 className="text-xl font-bold">Hi {user?.fullName?.split(" ")[0]} 👋</h1>
// //                                         <p className="text-sm text-muted-foreground">You have 5 active projects in progress.</p> 
// //                                     </div>              
// //                                 </div>
// //                                 <div className="flex items-center">
// //                                     <Link to="/projects/new">
// //                                         <Button className="text-xs shadow-none">
// //                                             <PlusIcon />New project
// //                                         </Button>
// //                                     </Link>
// //                                 </div>
// //                             </div>                       
                            
// //                             <div className="flex items-center justify-between mt-8">
// //                                 <div className="flex items-center gap-2">
// //                                     <Badge className=" bg-muted-foreground text-background"><CircleDotIcon /> Active</Badge>
// //                                     <Badge className=" bg-muted text-foreground"><LoaderCircleIcon />Pending</Badge>
// //                                     <Badge className=" bg-muted text-foreground"><CircleCheckBigIcon /> Closed</Badge>
// //                                 </div>
// //                                 <div className="flex">
// //                                     <Button variant="link" className="flex items-center gap-1 text-foreground"><History />History</Button>
// //                                     <Button variant="link" className="flex items-center gap-1 text-foreground"><ArrowDownNarrowWideIcon />Title</Button>
// //                                     <Button
// //                                         variant="link"
// //                                         className="flex items-center gap-1 text-foreground"
// //                                         onClick={() => switchView()}
// //                                     >
// //                                         {view === "grid" ? <ListIcon /> : <LayoutGrid />}
// //                                     </Button>
// //                                 </div>
// //                             </div>
// //                             <div className={`flex gap-2 w-full mt-2 mb-6 ${view ==="grid"
// //                                 ?
// //                                     "grid gap-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-3"
// //                                 :
// //                                     "flex-col"}`}
// //                                 >
// //                                     {projects.map(project => view === "grid"
// //                                         ?
// //                                             <GridView key={project.id} project={project} />
// //                                         :
// //                                             <ListView key={project.id} project={project} />
// //                                     )}                            
// //                             </div>                        
// //                         </section>
// //                         <aside className="hidden flex flex-col space-y-4 w-lg xl:block">
// //                             <div className="border rounded-lg">
// //                                 <img src={Electricians} alt="" className="rounded-t-lg"/>
// //                                 <article className="flex items-start gap-2 bg-background/40 px-6 py-10 rounded-b-lg">
// //                                     <span className=""><Megaphone size={40} /></span>
// //                                     <div className="flex flex-col space-y-4">
// //                                         <h3 className="font-bold">Advert Heading</h3>
// //                                         <p className="text-[0.9rem]">Lorem, ipsum dolor sit amet consectetur adipisicing elit. Vero fugit doloremque eius placeat voluptatum, aliquam porro vitae repellat aperiam.</p>
// //                                         <span><Button variant="outline" className="text-xs font-semibold mt-4 px-6 shadow-none">View profile</Button></span>
// //                                     </div>                        
// //                                 </article>
// //                             </div>
// //                             <article className="bg-background/40 border p-6 rounded-lg">
// //                                 <div className="flex gap-2">
// //                                 <span><LightbulbIcon /></span>
// //                                 <div className="flex flex-col space-y-2">
// //                                     <h3 className="font-bold">
// //                                         Tip of the day
// //                                     </h3>
// //                                     <p className="text-[0.9rem]">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusamus, nulla natus corporis.</p>
// //                                     <Link className="text-accent-3" to="">Learn more</Link>
// //                                 </div>
// //                                 </div>
// //                             </article>
// //                             <article className="">
// //                                 <div className="flex gap-2">
// //                                     <span><MessagesSquareIcon /></span>
// //                                     <div className="flex flex-col space-y-2">
// //                                         <h3 className="font-bold">Jean sent you a message</h3>
// //                                         <small className="flex items-center gap-1 text-muted-foreground"><ClockIcon size={14} />3 hrs ago</small>
// //                                         <p className="text-[0.9rem]">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusamus, nulla natus corporis.</p>
// //                                         <Link className="text-accent-3" to="">View chat</Link>
// //                                     </div>
// //                                 </div>
// //                             </article>
// //                         </aside>
// //                     </section>
// //                 )}
// //             </main>
// //         </div>
// //     )
// // }

// // export default Projects;

// import { useEffect, useMemo, useState } from "react";
// import { Link } from "react-router-dom";
// import {
//   ArrowDownNarrowWideIcon,
//   ArrowRightIcon,
//   BriefcaseBusinessIcon,
//   CheckCircle2Icon,
//   CircleDotIcon,
//   Clock3Icon,
//   FolderOpenIcon,
//   Grid2X2Icon,
//   HistoryIcon,
//   LayoutListIcon,
//   LightbulbIcon,
//   LoaderCircleIcon,
//   MegaphoneIcon,
//   MessageSquareTextIcon,
//   PlusIcon,
//   RefreshCwIcon,
//   SparklesIcon,
// } from "lucide-react";

// import api from "@/api/axios";
// import Electricians from "@/assets/electrician-wide.svg";
// import { useAuth } from "@/auth/AuthContext";
// import DashboardMainNav from "@/components/DashboardMainNav";
// import { GridView, ListView } from "@/components/ProjectCard";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import type { Project } from "@/Types/project";
// import LoadingState from "@/components/LoadingState";

// type ProjectView = "grid" | "list";
// type ProjectFilter = "active" | "pending" | "closed";

// function Projects() {
//   const { user } = useAuth();

//   const [view, setView] = useState<ProjectView>("grid");
//   const [filter, setFilter] = useState<ProjectFilter>("active");
//   const [projects, setProjects] = useState<Project[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<Error | null>(null);

//   async function fetchProjects() {
//     setLoading(true);
//     setError(null);

//     try {
//       const response = await api.get<Project[]>("/projects/mine", {
//         withCredentials: true,
//       });

//       setProjects(response.data);
//     } catch (err: unknown) {
//       if (err instanceof Error) {
//         setError(err);
//       } else {
//         setError(new Error("An unknown error occurred."));
//       }
//     } finally {
//       setLoading(false);
//     }
//   }

//   useEffect(() => {
//     void fetchProjects();
//   }, []);

//   const firstName = user?.fullName?.trim().split(/\s+/)[0] || "there";

//   const activeProjects = useMemo(() => {
//     return projects.filter((project) => {
//       const status = String(project.status ?? "").toLowerCase();

//       return status === "active" || status === "in progress";
//     });
//   }, [projects]);

//   const pendingProjects = useMemo(() => {
//     return projects.filter(
//       (project) => String(project.status ?? "").toLowerCase() === "pending",
//     );
//   }, [projects]);

//   const closedProjects = useMemo(() => {
//     return projects.filter((project) => {
//       const status = String(project.status ?? "").toLowerCase();

//       return (
//         status === "closed" ||
//         status === "complete" ||
//         status === "completed"
//       );
//     });
//   }, [projects]);

//   const visibleProjects = useMemo(() => {
//     if (filter === "pending") return pendingProjects;
//     if (filter === "closed") return closedProjects;

//     /*
//      * Some older projects may not have a status value.
//      * Show all projects in Active when no recognised status data exists.
//      */
//     const recognisedProjectCount =
//       activeProjects.length + pendingProjects.length + closedProjects.length;

//     if (recognisedProjectCount === 0) {
//       return projects;
//     }

//     return activeProjects;
//   }, [
//     filter,
//     projects,
//     activeProjects,
//     pendingProjects,
//     closedProjects,
//   ]);

//   if (loading) {
//     return (
//       <div className="flex min-h-screen flex-col bg-background text-foreground">
//         <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur-xl">
//           <div className="container mx-auto px-4 sm:px-5 md:px-8">
//             <DashboardMainNav />
//           </div>
//         </header>

//         <main className="container mx-auto flex flex-1 items-center justify-center px-5 py-20 md:px-8">
//           <div className="flex flex-col items-center text-center">
//             <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-primary/15">
//               <LoaderCircleIcon className="h-7 w-7 animate-spin text-primary" />
//             </div>

//             <h1 className="mt-6 text-2xl font-black uppercase tracking-[-0.03em]">
//               Loading your workspace
//             </h1>

//             <p className="mt-2 max-w-md text-sm leading-7 text-muted-foreground">
//               We are gathering your projects and recent workspace activity.
//             </p>
//           </div>
//         </main>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="flex min-h-screen flex-col bg-background text-foreground">
//         <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur-xl">
//           <div className="container mx-auto px-4 sm:px-5 md:px-8">
//             <DashboardMainNav />
//           </div>
//         </header>

//         <main className="container mx-auto flex flex-1 items-center justify-center px-5 py-20 md:px-8">
//           <div className="w-full max-w-xl rounded-[2rem] border border-border bg-card p-7 text-center text-card-foreground sm:p-10">
//             <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-destructive/10 text-destructive">
//               <FolderOpenIcon size={28} />
//             </div>

//             <h1 className="mt-6 text-2xl font-black uppercase tracking-[-0.03em] sm:text-3xl">
//               We could not load your projects
//             </h1>

//             <p className="mt-3 text-sm leading-7 text-muted-foreground">
//               Something interrupted the connection to your workspace. Try
//               loading the projects again.
//             </p>

//             <Button
//               type="button"
//               className="mt-7 h-12 rounded-full px-7 shadow-none"
//               onClick={() => void fetchProjects()}
//             >
//               <RefreshCwIcon size={16} />
//               Try again
//             </Button>
//           </div>
//         </main>
//       </div>
//     );
//   }

//   return (
//     <div className="flex min-h-screen flex-col bg-background text-foreground transition-colors">
//       <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur-xl">
//         <div className="container mx-auto px-4 sm:px-5 md:px-8">
//           <DashboardMainNav />
//         </div>
//       </header>

//       <main className="container mx-auto flex-1 px-5 py-8 sm:py-10 md:px-8 lg:py-12">
//         {projects.length === 0 ? (
//           <EmptyWorkspace firstName={firstName} />
//         ) : (
//           <div className="grid min-w-0 gap-8 xl:grid-cols-[minmax(0,1fr)_340px] xl:gap-10">
//             <section className="min-w-0">
//               {/* Dashboard heading */}
//               <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
//                 <div className="min-w-0">
//                   <p className="mb-3 text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-primary sm:text-xs">
//                     Your workspace
//                   </p>

//                   <h1 className="break-words text-3xl font-black uppercase leading-[0.96] tracking-[-0.035em] sm:text-4xl lg:text-5xl">
//                     Welcome back,{" "}
//                     <span className="text-primary">{firstName}.</span>
//                   </h1>

//                   <p className="mt-4 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
//                     You have{" "}
//                     <span className="font-semibold text-foreground">
//                       {activeProjects.length || projects.length}
//                     </span>{" "}
//                     {activeProjects.length === 1 || projects.length === 1
//                       ? "project"
//                       : "projects"}{" "}
//                     currently in your active workspace.
//                   </p>
//                 </div>

//                 <Button
//                   asChild
//                   className="h-12 w-full shrink-0 rounded-full px-7 shadow-none sm:w-auto"
//                 >
//                   <Link to="/projects/new">
//                     <PlusIcon size={17} />
//                     New project
//                   </Link>
//                 </Button>
//               </div>

//               {/* Summary cards */}
//               {/* <div className="mt-9 grid gap-4 sm:grid-cols-3">
//                 <SummaryCard
//                   label="Active projects"
//                   value={activeProjects.length || projects.length}
//                   icon={CircleDotIcon}
//                   accent="bg-emerald-400/15 text-emerald-700 dark:text-emerald-300"
//                 />

//                 <SummaryCard
//                   label="Pending"
//                   value={pendingProjects.length}
//                   icon={Clock3Icon}
//                   accent="bg-amber-400/15 text-amber-700 dark:text-amber-300"
//                 />

//                 <SummaryCard
//                   label="Completed"
//                   value={closedProjects.length}
//                   icon={CheckCircle2Icon}
//                   accent="bg-sky-400/15 text-sky-700 dark:text-sky-300"
//                 />
//               </div> */}

//               {/* Toolbar */}
//               <div className="mt-8 flex flex-col gap-4 border-b border-border py-5 lg:flex-row lg:items-center lg:justify-between">
//                 <div className="flex max-w-full gap-2 overflow-x-auto pb-1">
//                   <FilterButton
//                     active={filter === "active"}
//                     onClick={() => setFilter("active")}
//                     icon={CircleDotIcon}
//                     label="Active"
//                     count={activeProjects.length || projects.length}
//                   />

//                   <FilterButton
//                     active={filter === "pending"}
//                     onClick={() => setFilter("pending")}
//                     icon={LoaderCircleIcon}
//                     label="Pending"
//                     count={pendingProjects.length}
//                   />

//                   <FilterButton
//                     active={filter === "closed"}
//                     onClick={() => setFilter("closed")}
//                     icon={CheckCircle2Icon}
//                     label="Closed"
//                     count={closedProjects.length}
//                   />
//                 </div>

//                 <div className="flex items-center gap-1 self-end rounded-full border border-border bg-card p-1 text-card-foreground lg:self-auto">
//                   <Button
//                     type="button"
//                     variant="ghost"
//                     size="sm"
//                     className="h-9 rounded-full px-3 text-xs"
//                   >
//                     <HistoryIcon size={15} />
//                     <span className="hidden sm:inline">History</span>
//                   </Button>

//                   <Button
//                     type="button"
//                     variant="ghost"
//                     size="sm"
//                     className="h-9 rounded-full px-3 text-xs"
//                   >
//                     <ArrowDownNarrowWideIcon size={15} />
//                     <span className="hidden sm:inline">Title</span>
//                   </Button>

//                   <div className="mx-1 h-5 w-px bg-border" />

//                   <Button
//                     type="button"
//                     variant={view === "grid" ? "secondary" : "ghost"}
//                     size="icon"
//                     className="h-9 w-9 rounded-full"
//                     onClick={() => setView("grid")}
//                     aria-label="Show projects as a grid"
//                   >
//                     <Grid2X2Icon size={16} />
//                   </Button>

//                   <Button
//                     type="button"
//                     variant={view === "list" ? "secondary" : "ghost"}
//                     size="icon"
//                     className="h-9 w-9 rounded-full"
//                     onClick={() => setView("list")}
//                     aria-label="Show projects as a list"
//                   >
//                     <LayoutListIcon size={17} />
//                   </Button>
//                 </div>
//               </div>

//               {/* Project collection */}
//               {visibleProjects.length > 0 ? (
//                 <div
//                   className={
//                     view === "grid"
//                       ? "mt-6 grid min-w-0 gap-5 sm:grid-cols-2 2xl:grid-cols-3"
//                       : "mt-6 flex min-w-0 flex-col gap-4"
//                   }
//                 >
//                   {visibleProjects.map((project) =>
//                     view === "grid" ? (
//                       <GridView key={project.id} project={project} />
//                     ) : (
//                       <ListView key={project.id} project={project} />
//                     ),
//                   )}
//                 </div>
//               ) : (
//                 <div className="mt-6 rounded-[2rem] border border-dashed border-border bg-card/50 px-6 py-16 text-center">
//                   <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-muted">
//                     <FolderOpenIcon
//                       size={24}
//                       className="text-muted-foreground"
//                     />
//                   </div>

//                   <h2 className="mt-5 text-xl font-black uppercase tracking-[-0.025em]">
//                     No {filter} projects
//                   </h2>

//                   <p className="mx-auto mt-2 max-w-md text-sm leading-7 text-muted-foreground">
//                     Projects that match this status will appear here.
//                   </p>
//                 </div>
//               )}
//             </section>

//             <DashboardSidebar />
//           </div>
//         )}
//       </main>
//     </div>
//   );
// }

// type EmptyWorkspaceProps = {
//   firstName: string;
// };

// function EmptyWorkspace({ firstName }: EmptyWorkspaceProps) {
//   return (
//     <section className="flex min-h-[calc(100vh-12rem)] items-center justify-center py-10">
//       <div className="relative w-full max-w-3xl overflow-hidden rounded-[2rem] border border-border bg-card px-6 py-14 text-center text-card-foreground sm:rounded-[2.5rem] sm:px-10 sm:py-20">
//         <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-primary/10 blur-3xl" />
//         <div className="absolute -bottom-24 -left-20 h-64 w-64 rounded-full bg-amber-300/10 blur-3xl" />

//         <div className="relative">
//           <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-[1.75rem] bg-primary/15 text-primary sm:h-24 sm:w-24">
//             <BriefcaseBusinessIcon className="h-9 w-9 sm:h-11 sm:w-11" />
//           </div>

//           <p className="mt-8 text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-primary sm:text-xs">
//             Welcome, {firstName}
//           </p>

//           <h1 className="mx-auto mt-4 max-w-2xl break-words text-3xl font-black uppercase leading-[0.96] tracking-[-0.035em] sm:text-4xl md:text-5xl">
//             Your workspace is ready for its{" "}
//             <span className="text-primary">first project.</span>
//           </h1>

//           <p className="mx-auto mt-6 max-w-xl text-sm leading-7 text-muted-foreground sm:text-base">
//             Describe the work, set your expectations and start connecting with
//             skilled professionals who can help move it forward.
//           </p>

//           <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
//             <Button
//               asChild
//               className="h-12 w-full rounded-full px-8 shadow-none sm:w-auto"
//             >
//               <Link to="/projects/new">
//                 <PlusIcon size={17} />
//                 Create your first project
//               </Link>
//             </Button>

//             <Button
//               asChild
//               variant="outline"
//               className="h-12 w-full rounded-full px-8 shadow-none sm:w-auto"
//             >
//               <Link to="/how-it-works">
//                 See how it works
//                 <ArrowRightIcon size={16} />
//               </Link>
//             </Button>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }

// type SummaryCardProps = {
//   label: string;
//   value: number;
//   icon: React.ComponentType<{ size?: number; className?: string }>;
//   accent: string;
// };

// function SummaryCard({
//   label,
//   value,
//   icon: Icon,
//   accent,
// }: SummaryCardProps) {
//   return (
//     <article className="rounded-[1.5rem] border border-border bg-card p-5 text-card-foreground sm:p-6">
//       <div className="flex items-start justify-between gap-4">
//         <div>
//           <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
//             {label}
//           </p>

//           <p className="mt-3 text-3xl font-black tracking-[-0.04em]">
//             {value}
//           </p>
//         </div>

//         <span
//           className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${accent}`}
//         >
//           <Icon size={21} />
//         </span>
//       </div>
//     </article>
//   );
// }

// type FilterButtonProps = {
//   active: boolean;
//   label: string;
//   count: number;
//   onClick: () => void;
//   icon: React.ComponentType<{ size?: number; className?: string }>;
// };

// function FilterButton({
//   active,
//   label,
//   count,
//   onClick,
//   icon: Icon,
// }: FilterButtonProps) {
//   return (
//     <button
//       type="button"
//       onClick={onClick}
//       className={[
//         "inline-flex h-10 shrink-0 items-center gap-2 rounded-full border px-4",
//         "text-xs font-semibold transition-colors",
//         active
//           ? "border-primary/30 bg-primary/15 text-foreground"
//           : "border-border bg-card text-muted-foreground hover:text-foreground",
//       ].join(" ")}
//     >
//       <Icon size={15} />
//       {label}

//       <span
//         className={[
//           "rounded-full px-2 py-0.5 text-[0.65rem]",
//           active
//             ? "bg-primary text-primary-foreground"
//             : "bg-muted text-muted-foreground",
//         ].join(" ")}
//       >
//         {count}
//       </span>
//     </button>
//   );
// }

// function DashboardSidebar() {
//   return (
//     <aside className="hidden min-w-0 space-y-5 xl:block">
//       {/* Featured professional */}
//       <article className="overflow-hidden rounded-[2rem] border border-border bg-card text-card-foreground">
//         <div className="relative aspect-[16/9] overflow-hidden bg-muted">
//           <img
//             src={Electricians}
//             alt="Featured skilled professional"
//             className="h-full w-full object-cover"
//           />

//           <Badge className="absolute left-4 top-4 rounded-full bg-background/90 text-foreground shadow-none backdrop-blur">
//             <SparklesIcon size={13} />
//             Featured
//           </Badge>
//         </div>

//         <div className="p-6">
//           <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/15 text-primary">
//             <MegaphoneIcon size={21} />
//           </div>

//           <h2 className="mt-6 text-xl font-black uppercase tracking-[-0.025em]">
//             Find the right skills faster
//           </h2>

//           <p className="mt-3 text-sm leading-7 text-muted-foreground">
//             Explore professionals whose experience may match your upcoming
//             project requirements.
//           </p>

//           <Button
//             variant="outline"
//             className="mt-6 h-11 rounded-full px-6 shadow-none"
//           >
//             View professionals
//             <ArrowRightIcon size={15} />
//           </Button>
//         </div>
//       </article>

//       {/* Tip */}
//       <article className="rounded-[1.75rem] border border-border bg-card p-6 text-card-foreground">
//         <div className="flex items-start gap-4">
//           <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-amber-300/20 text-amber-700 dark:bg-amber-400/10 dark:text-amber-300">
//             <LightbulbIcon size={21} />
//           </span>

//           <div className="min-w-0">
//             <p className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
//               Workspace tip
//             </p>

//             <h2 className="mt-2 font-bold">Start with a clear outcome</h2>

//             <p className="mt-2 text-sm leading-7 text-muted-foreground">
//               Explain what a completed project should look like before listing
//               individual tasks.
//             </p>

//             <Link
//               className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
//               to="/how-it-works"
//             >
//               Learn more
//               <ArrowRightIcon size={14} />
//             </Link>
//           </div>
//         </div>
//       </article>

//       {/* Message */}
//       <article className="rounded-[1.75rem] border border-border bg-card p-6 text-card-foreground">
//         <div className="flex items-start gap-4">
//           <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-sky-300/20 text-sky-700 dark:bg-sky-400/10 dark:text-sky-300">
//             <MessageSquareTextIcon size={21} />
//           </span>

//           <div className="min-w-0">
//             <p className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
//               Recent activity
//             </p>

//             <h2 className="mt-2 font-bold">Jean sent you a message</h2>

//             <p className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
//               <Clock3Icon size={13} />
//               3 hours ago
//             </p>

//             <p className="mt-3 line-clamp-3 text-sm leading-7 text-muted-foreground">
//               I have reviewed the project details and added a few questions
//               before we begin.
//             </p>

//             <Link
//               className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
//               to="/messages"
//             >
//               View conversation
//               <ArrowRightIcon size={14} />
//             </Link>
//           </div>
//         </div>
//       </article>
//     </aside>
//   );
// }

// export default Projects;


import { useEffect, useMemo, useState } from "react";
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
  LayoutListIcon,
  LightbulbIcon,
  LoaderCircleIcon,
  MegaphoneIcon,
  MessageSquareTextIcon,
  PlusIcon,
  RefreshCwIcon,
  SparklesIcon,
} from "lucide-react";

import api from "@/api/axios";
import Electricians from "@/assets/electrician-wide.svg";
import { useAuth } from "@/auth/AuthContext";
import DashboardMainNav from "@/components/DashboardMainNav";
import { GridView, ListView } from "@/components/ProjectCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Project } from "@/Types/project";

type ProjectView = "grid" | "list";
type ProjectFilter = "active" | "pending" | "closed";

function Projects() {
  const { user } = useAuth();

  const [view, setView] = useState<ProjectView>("grid");
  const [filter, setFilter] = useState<ProjectFilter>("active");

  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  async function fetchProjects() {
    setLoading(true);
    setError(null);

    try {
      const response = await api.get<Project[]>(
        "/projects/mine",
        {
          withCredentials: true,
        },
      );

      setProjects(response.data);
    } catch (err: unknown) {
      if (err instanceof Error) {
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

  useEffect(() => {
    void fetchProjects();
  }, []);

  const firstName =
    user?.fullName
      ?.trim()
      .split(/\s+/)[0] || "there";

  const closedProjects = useMemo(() => {
    return projects.filter((project) => {
      const status = normalizeProjectStatus(
        project.status,
      );

      return (
        status === "closed" ||
        status === "complete" ||
        status === "completed"
      );
    });
  }, [projects]);

  const pendingProjects = useMemo(() => {
    return projects.filter((project) => {
      const status = normalizeProjectStatus(
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
        project.hasAcceptedAllocat === true;

      return (
        isPaused ||
        !hasAcceptedAllocat
      );
    });
  }, [projects]);

  const activeProjects = useMemo(() => {
    return projects.filter((project) => {
      const status = normalizeProjectStatus(
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
        project.hasAcceptedAllocat === true;

      return (
        !isClosed &&
        !isPaused &&
        hasAcceptedAllocat
      );
    });
  }, [projects]);

  const visibleProjects = useMemo(() => {
    if (filter === "pending") {
      return pendingProjects;
    }

    if (filter === "closed") {
      return closedProjects;
    }

    return activeProjects;
  }, [
    filter,
    activeProjects,
    pendingProjects,
    closedProjects,
  ]);

  if (loading) {
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
              Loading your workspace
            </h1>

            <p className="mt-2 max-w-md text-sm leading-7 text-muted-foreground">
              We are gathering your projects and
              recent workspace activity.
            </p>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
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
              <FolderOpenIcon size={28} />
            </div>

            <h1 className="mt-6 text-2xl font-black uppercase tracking-[-0.03em] sm:text-3xl">
              We could not load your projects
            </h1>

            <p className="mt-3 text-sm leading-7 text-muted-foreground">
              Something interrupted the connection
              to your workspace. Try loading the
              projects again.
            </p>

            <Button
              type="button"
              className="mt-7 h-12 rounded-full px-7 shadow-none"
              onClick={() =>
                void fetchProjects()
              }
            >
              <RefreshCwIcon size={16} />
              Try again
            </Button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground transition-colors">
      <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur-xl">
        <div className="container mx-auto px-4 sm:px-5 md:px-8">
          <DashboardMainNav />
        </div>
      </header>

      <main className="container mx-auto flex-1 px-5 py-8 sm:py-10 md:px-8 lg:py-12">
        {projects.length === 0 ? (
          <EmptyWorkspace
            firstName={firstName}
          />
        ) : (
          <div className="grid min-w-0 gap-8 xl:grid-cols-[minmax(0,1fr)_340px] xl:gap-10">
            <section className="min-w-0">
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
                    You have{" "}
                    <span className="font-semibold text-foreground">
                      {activeProjects.length}
                    </span>{" "}
                    {activeProjects.length === 1
                      ? "active project"
                      : "active projects"}{" "}
                    in your workspace.
                  </p>
                </div>

                <Button
                  asChild
                  className="h-12 w-full shrink-0 rounded-full px-7 shadow-none sm:w-auto"
                >
                  <Link to="/projects/new">
                    <PlusIcon size={17} />
                    New project
                  </Link>
                </Button>
              </div>

              <div className="mt-8 flex flex-col gap-4 border-b border-border py-5 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex max-w-full gap-2 overflow-x-auto pb-1">
                  <FilterButton
                    active={filter === "active"}
                    onClick={() =>
                      setFilter("active")
                    }
                    icon={CircleDotIcon}
                    label="Active"
                    count={
                      activeProjects.length
                    }
                  />

                  <FilterButton
                    active={filter === "pending"}
                    onClick={() =>
                      setFilter("pending")
                    }
                    icon={Clock3Icon}
                    label="Pending"
                    count={
                      pendingProjects.length
                    }
                    attention={
                      pendingProjects.length > 0
                    }
                  />

                  <FilterButton
                    active={filter === "closed"}
                    onClick={() =>
                      setFilter("closed")
                    }
                    icon={CheckCircle2Icon}
                    label="Closed"
                    count={
                      closedProjects.length
                    }
                  />
                </div>

                <div className="flex items-center gap-1 self-end rounded-full border border-border bg-card p-1 text-card-foreground lg:self-auto">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-9 rounded-full px-3 text-xs"
                  >
                    <HistoryIcon size={15} />
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
                    aria-label="Show projects as a grid"
                  >
                    <Grid2X2Icon size={16} />
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
                    aria-label="Show projects as a list"
                  >
                    <LayoutListIcon size={17} />
                  </Button>
                </div>
              </div>

              {visibleProjects.length > 0 ? (
                <div
                  className={
                    view === "grid"
                      ? "mt-6 grid min-w-0 gap-5 sm:grid-cols-2 2xl:grid-cols-3"
                      : "mt-6 flex min-w-0 flex-col gap-4"
                  }
                >
                  {visibleProjects.map(
                    (project) =>
                      view === "grid" ? (
                        <GridView
                          key={project.id}
                          project={project}
                        />
                      ) : (
                        <ListView
                          key={project.id}
                          project={project}
                        />
                      ),
                  )}
                </div>
              ) : (
                <div className="mt-6 rounded-[2rem] border border-dashed border-border bg-card/50 px-6 py-16 text-center">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-muted">
                    <FolderOpenIcon
                      size={24}
                      className="text-muted-foreground"
                    />
                  </div>

                  <h2 className="mt-5 text-xl font-black uppercase tracking-[-0.025em]">
                    No {filter} projects
                  </h2>

                  <p className="mx-auto mt-2 max-w-md text-sm leading-7 text-muted-foreground">
                    Projects that match this
                    status will appear here.
                  </p>
                </div>
              )}
            </section>

            <DashboardSidebar />
          </div>
        )}
      </main>
    </div>
  );
}

function normalizeProjectStatus(
  status?: string,
) {
  return String(status ?? "")
    .toLowerCase()
    .replace(/[\s_-]/g, "");
}

type EmptyWorkspaceProps = {
  firstName: string;
};

function EmptyWorkspace({
  firstName,
}: EmptyWorkspaceProps) {
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
            Welcome, {firstName}
          </p>

          <h1 className="mx-auto mt-4 max-w-2xl break-words text-3xl font-black uppercase leading-[0.96] tracking-[-0.035em] sm:text-4xl md:text-5xl">
            Your workspace is ready for its{" "}
            <span className="text-primary">
              first project.
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-xl text-sm leading-7 text-muted-foreground sm:text-base">
            Describe the work, set your
            expectations and start connecting
            with skilled professionals who can
            help move it forward.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button
              asChild
              className="h-12 w-full rounded-full px-8 shadow-none sm:w-auto"
            >
              <Link to="/projects/new">
                <PlusIcon size={17} />
                Create your first project
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

type FilterButtonProps = {
  active: boolean;
  label: string;
  count: number;
  onClick: () => void;
  icon: React.ComponentType<{
    size?: number;
    className?: string;
  }>;
  attention?: boolean;
};

function FilterButton({
  active,
  label,
  count,
  onClick,
  icon: Icon,
  attention = false,
}: FilterButtonProps) {
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
        <span className="relative flex h-3 w-3">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-500 opacity-70" />
          <span className="relative inline-flex h-3 w-3 rounded-full bg-amber-500" />
        </span>
      )}

      {attention ? (
        <BellRingIcon
          size={15}
          className="text-amber-600 dark:text-amber-300"
        />
      ) : (
        <Icon size={15} />
      )}

      {label}

      <span
        className={[
          "rounded-full px-2 py-0.5 text-[0.65rem]",
          attention
            ? "bg-amber-500 text-white"
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

function DashboardSidebar() {
  return (
    <aside className="hidden min-w-0 space-y-5 xl:block">
      <article className="overflow-hidden rounded-[2rem] border border-border bg-card text-card-foreground">
        <div className="relative aspect-[16/9] overflow-hidden bg-muted">
          <img
            src={Electricians}
            alt="Featured skilled professional"
            className="h-full w-full object-cover"
          />

          <Badge className="absolute left-4 top-4 rounded-full bg-background/90 text-foreground shadow-none backdrop-blur">
            <SparklesIcon size={13} />
            Featured
          </Badge>
        </div>

        <div className="p-6">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/15 text-primary">
            <MegaphoneIcon size={21} />
          </div>

          <h2 className="mt-6 text-xl font-black uppercase tracking-[-0.025em]">
            Find the right skills faster
          </h2>

          <p className="mt-3 text-sm leading-7 text-muted-foreground">
            Explore professionals whose
            experience may match your upcoming
            project requirements.
          </p>

          <Button
            variant="outline"
            className="mt-6 h-11 rounded-full px-6 shadow-none"
          >
            View professionals
            <ArrowRightIcon size={15} />
          </Button>
        </div>
      </article>

      <article className="rounded-[1.75rem] border border-border bg-card p-6 text-card-foreground">
        <div className="flex items-start gap-4">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-amber-300/20 text-amber-700 dark:bg-amber-400/10 dark:text-amber-300">
            <LightbulbIcon size={21} />
          </span>

          <div className="min-w-0">
            <p className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Workspace tip
            </p>

            <h2 className="mt-2 font-bold">
              Start with a clear outcome
            </h2>

            <p className="mt-2 text-sm leading-7 text-muted-foreground">
              Explain what a completed project
              should look like before listing
              individual tasks.
            </p>

            <Link
              className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
              to="/how-it-works"
            >
              Learn more
              <ArrowRightIcon size={14} />
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
              Jean sent you a message
            </h2>

            <p className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
              <Clock3Icon size={13} />
              3 hours ago
            </p>

            <p className="mt-3 line-clamp-3 text-sm leading-7 text-muted-foreground">
              I have reviewed the project details
              and added a few questions before we
              begin.
            </p>

            <Link
              className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
              to="/messages"
            >
              View conversation
              <ArrowRightIcon size={14} />
            </Link>
          </div>
        </div>
      </article>
    </aside>
  );
}

export default Projects;