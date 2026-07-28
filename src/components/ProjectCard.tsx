// import { CalendarDaysIcon, EllipsisVerticalIcon } from "lucide-react";
// import { Progress } from "./ui/progress";
// import type { Project } from "../Types/project";
// import { Link } from "react-router-dom";
// import { motion } from "framer-motion";
// import { getProjectIcon } from "@/utils/projectIcons";
// import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
// import { Button } from "@/components/ui/button"
// import {
//   Dialog,
//   DialogClose,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Textarea } from "./ui/textarea";
// import { Badge } from "./ui/badge";
// import { Calendar28 } from "./DatePicker";
// import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
// import { allocats } from "@/data/allocats";

// const MotionLink = motion.create(Link);

// type ViewProps = {
//     project: Project;
// }

// const statusColor: Record<string, string> = {
//     pending: "destructive",
//     active: "accent-2",
//     onhold: "muted-foreground",
//     complete: "accent-3"
// }

// export function ListView({project}: ViewProps) {
//     const dotColor = statusColor[project.status] || statusColor.onhold;

//     return (
//         <div className="flex items-center w-full gap-4 bg-background/40 border rounded-2xl py-4 px-6">
             
//             {getProjectIcon(project?.category ?? "default")}  
//             <div className="flex flex-col w-full">
//                 <div className="flex items-center justify-between">
//                     <MotionLink
//                     to={`${project.id}`}
//                         className="flex justify-between mt-2 rounded-2xl"
//                         whileTap={{ scale: 0.96 }}
//                         transition={{ duration: 0.2, ease: "easeInOut" }}
//                     >
//                         <h3 className="text-sm text-foreground/90 font-semibold transition delay-90 duration-300 hover:text-primary">{project.title}</h3>
//                     </MotionLink>
//                     <ProjectMenu project={project} />
//                 </div> 
//                 <div className="flex justify-between mt-2 rounded-2xl"
//                 >
//                     <div className="flex items-center gap-4 w-xl">                        
//                         <div>                 
//                             <span
//                                 className="flex items-center gap-1 font-light text-muted-foreground text-xs"
//                             >
//                                 <CalendarDaysIcon size={16} />Created { new Date(project.createdAt).toDateString()}
//                             </span>       
//                             {/* <p className="text-[0.9rem] pt-1">{project.description.slice(0, 60)}...</p> */}
//                             {/* <p className="text-sm pt-1">{project.description.slice(0, 60)}...</p> */}
//                         </div>   
//                     </div>
//                     <div className="flex gap-12">
//                         <div className="flex flex-col items-end max-w-60">
//                             <Progress value={project.progress} className="mt-1 w-[120px]"/>
//                             {/* <div className="flex flex-col items-end mt-2">
//                                 <span className="text-xs text-muted-foreground font-light">{project.projectCode}</span>
//                                 <span className="flex items-center gap-2 text-xs">
//                                     {project.status.charAt(0).toUpperCase()+project.status.slice(1)}
//                                     <span className={`w-2 h-2 bg-${dotColor} rounded-full`}></span>
//                                 </span>
//                             </div> */}
//                         </div>                    
//                     </div>
//                 </div>
//             </div>
//         </div>
// )}  

// export function GridView({project}: ViewProps) {    

//     return (
//         <div className="flex flex-col items-start gap-4 bg-background/40 border rounded-lg py-4 px-6">
//             <div className="flex items-center w-full justify-between">
//                 {getProjectIcon(project?.category ?? "default")}
//                 <ProjectMenu project={project}/>
//             </div>
//             <div>
//                 <MotionLink
//                     to={`${project.id}`}
//                     className="flex flex-col justify-between mt-2 rounded-2xl"
//                     whileTap={{ scale: 0.96 }}
//                     transition={{ duration: 0.2, ease: "easeInOut" }}
//                 >
//                     <h3 className="text-sm text-primary/90 font-semibold transition delay-90 duration-300 hover:underline">{project.title}</h3>
//                 </MotionLink>
            
//                 <span
//                     className="flex items-center gap-1 font-light text-muted-foreground text-xs py-1"
//                 >
//                     <CalendarDaysIcon size={16} />Created { new Date(project.createdAt).toDateString() }
//                 </span>       
//             </div>

//             <div className=" items-center justify-between w-full font-semibold mt-6 mb-2">
//                 <span className="text-xs">Progress</span>
//                 <Progress value={project.progress} className="mt-1 w-full"/>
//                 {/* <Link to="" className="text-sm font-normal">View details</Link>
//                 <Button variant="outline" className="text-xs bg-red-500 shadow-none px-12 hover:bg-red-500">Open</Button> */}
//             </div> 
//         </div>
//     );
// }

// function ProjectMenu({project}: ViewProps) {
//     const dotColor = statusColor[project.status] || statusColor.onhold;

//     return (
//         <div className="flex items-center gap-4">
//             <span className="flex items-center gap-2 text-xs">
//                 <span className={`w-2 h-2 bg-${dotColor} rounded-full`}></span>
//                 {project.status.charAt(0).toUpperCase()+project.status.slice(1)}
//             </span>
//         <DropdownMenu>
//             <DropdownMenuTrigger>
//                 <EllipsisVerticalIcon
//                     size={28}
//                     className="text-foreground/50 rounded-full cursor-pointer p-1 transition delay-150 duration-300 ease-in-out hover:text-foreground hover:bg-muted-foreground/20"
//                 />
//             </DropdownMenuTrigger>
//             <DropdownMenuContent className="bg-background">
//                 {project.allocatAssignments.length === 0
//                 ?
//                     <DropdownMenuItem>Assign Allocat</DropdownMenuItem>
//                 :
//                     <DropdownMenuItem><Link to={project.id}>Open</Link></DropdownMenuItem>
//                 }
//                 <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
//                     <ProjectDetailsDialog project={project} trigger="View details"/>
//                 </DropdownMenuItem>
//                 <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
//                     <EditProjectDialog project={project} trigger="Edit project"/>
//                 </DropdownMenuItem>
//                 <DropdownMenuItem>Change status</DropdownMenuItem>
//                 <DropdownMenuItem className="text-destructive">Cancel</DropdownMenuItem>
//             </DropdownMenuContent>
//         </DropdownMenu>
//         </div>
//     );
// }

// type DialogProps = {
//     project: Project;
//     trigger: string;
// }

// function ProjectDetailsDialog({project, trigger}: DialogProps) {
//     const dotColor = statusColor[project.status] || statusColor.onhold;
    
//     const projectAllocats = project.allocatAssignments.map(
//         allocatId => allocats.find(
//             allocat => allocat.id === allocatId
//         )
//     );

//     console.log(projectAllocats.map(a => a?.fullName));

//     return(
//         <Dialog>
//             <DialogTrigger asChild>
//                 <span className="text-[0.92rem] font-normal">{trigger}</span> 
//             </DialogTrigger>
//             <DialogContent>
//                 <DialogHeader className="border-b pb-4">
//                     <DialogTitle className="flex items-center gap-2">{getProjectIcon(project?.category ?? "default")} {project.title}</DialogTitle>
//                     <DialogDescription>{project.description}</DialogDescription>
//                     <div className="my-4">
//                         <span className="flex items-center gap-2 text-sm">
//                             <h3 className="font-semibold">Category</h3>
//                             <span>
//                                 {project.category.charAt(0).toUpperCase()}{project.category.slice(1)}
//                             </span>
//                         </span>
//                         <span className="flex items-center gap-2 text-sm">
//                             <h3 className="font-semibold py-1 color-foreground">Priority</h3>
//                             <span>
//                                 <Badge variant="destructive" className="text-white rounded-full">
//                                     {project.priority?.charAt(0).toUpperCase()}{project.priority?.slice(1)}
//                                 </Badge></span>
//                         </span>
//                     </div>
                    
//                 </DialogHeader>

//                 <div className="flex items-center justify-between gap-2 border-b pb-4">
//                     <span>
//                         <h3 className="text-muted-foreground font-semibold">Created</h3>
//                         <span className="flex items-center gap-1 text-sm">
//                             <CalendarDaysIcon size={16} />{new Date(project.createdAt).toDateString()}
//                         </span>
//                     </span>
//                     <span>
//                         <h3 className="text-muted-foreground font-semibold">Start date</h3>
//                         <span className="flex items-center gap-1 text-sm">
//                             <CalendarDaysIcon size={16} />
//                             {project.startDate ? new Date(project.startDate).toDateString() : ""}
//                         </span>
//                     </span>
//                     <span>
//                         <h3 className="text-muted-foreground font-semibold">Due date</h3>
//                         <span className="flex items-center gap-1 text-sm">
//                             <CalendarDaysIcon size={16} />
//                             {project.dueDate ? new Date(project.dueDate).toDateString() : ""}
//                         </span>
//                     </span>
//                 </div>
//                 <div>
//                     <span className="flex items-center justify-between w-full py-2">
//                         <span className="flex items-center gap-2">
//                             <span className={`w-2 h-2 bg-${dotColor} rounded-full`}></span>
//                             {project.status.charAt(0).toUpperCase()+project.status.slice(1)}                            
//                         </span>
                        
//                         <span className="font-bold">{project.progress}%</span>
//                     </span>
//                     <Progress value={project.progress} />                    
//                 </div>
//                 <div>                       
//                     <span>
//                         <h3 className="text-muted-foreground font-semibold">Project code</h3>
//                         <span className="text-sm">{project.projectCode}</span>
//                     </span>
//                 </div>

//                 <h3 className="text-muted-foreground font-semibold border-t pt-4">Members</h3>
//                 {projectAllocats.map(allocat =>            
//                     <div key={allocat?.id} className="flex items-center justify-between gap-2 m-0 rounded-sm">  
//                         <span className="flex items-center gap-2 m-0 rounded-sm">              
//                             <Avatar className="w-10 h-10 border-4 m-0" >
//                                 <AvatarImage src="https://github.com/shadcn.png" />
//                                 <AvatarFallback className={`text-background bg-muted-foreground`}>
//                                     U
//                                 </AvatarFallback>
//                             </Avatar>
//                             {allocat?.fullName}
//                         </span>
//                         <span>
//                             <Link
//                                 to=""
//                             >
//                                 {/* <Button variant="outline" className="shadow-none">View profile</Button> */}
//                                 <span className="text-sm text-accent-3 font-medium">View profile</span>
//                             </Link>
//                         </span>
//                     </div>
//                 )}                
                
//                 <DialogFooter>
//                     <DialogClose asChild>
//                         <Button className="text-muted-foreground text-sm font bg-transparent hover:bg-transparent shadow-none">Close</Button>
//                     </DialogClose>
//                 </DialogFooter>
//             </DialogContent>
            
//         </Dialog>
//     )

// }

// function EditProjectDialog({project, trigger}: DialogProps) {
//   return (
//     <Dialog>
//       <form>
//         <DialogTrigger asChild>
//             <span className="text-[0.92rem] font-normal">{trigger}</span>  
//         </DialogTrigger>
//         <DialogContent className="min-w-sm ">
//           <DialogHeader>
//             <DialogTitle>Edit project</DialogTitle>
//             <DialogDescription>
//               Make changes to your project here. Click save when you&apos;re
//               done.
//             </DialogDescription>
//           </DialogHeader>
//           <form className="grid gap-4">
//             <div className="grid gap-3">
//               <Label htmlFor="title">Title</Label>
//               <Input id="title" name="title" defaultValue={project.title} />              
//             </div>
//             <div className="grid gap-3">
//               <Label htmlFor="description">Description</Label>
//               <Textarea id="description" name="description" defaultValue={project.description} />
//             </div>
//             <div className="flex gap-4">
//               <span>
//                 <Label htmlFor="start-date">Start date</Label>
//                 <Calendar28
//                     id="start-date"
//                     value={project.dueDate ? new Date(project.dueDate) : new Date()}
//                 />
//               </span>

//               <span>
//                 <Label htmlFor="due-date">Due date</Label>
//                 <Calendar28
//                     id={"due-date"}
//                     value={project.dueDate ? new Date(project.dueDate) : new Date()}
//                 />
//               </span>
//             </div>
//             <div className="grid gap-3">
//               <Label htmlFor="priority-field">Priority</Label>
//               <div id="priority-field" className="flex gap-4">
//                     <span className="flex items-center gap-2">
//                         <input type="radio" name="priority" id="standard" value="standard" />
//                         <Label htmlFor="standard">Standard</Label>
//                     </span>           
//                     <span className="flex items-center gap-2">
//                         <input type="radio" name="priority" id="high" value="high"/>
//                         <Label htmlFor="high">High</Label>
//                     </span>
//                     <span className="flex items-center gap-2">
//                         <input type="radio" name="priority" id="urgent" value="urgent" />
//                         <Label htmlFor="urgent">Urgent</Label>
//                     </span>                            
//                 </div>
//             </div>
//           </form>
//           <DialogFooter>
//             <DialogClose asChild>
//               <Button variant="outline" className="">Cancel</Button>
//             </DialogClose>
//             <Button type="submit" className="">Save changes</Button>
//           </DialogFooter>
//         </DialogContent>
//       </form>
//     </Dialog>
//   );
// }

import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  ArrowRightIcon,
  CalendarDaysIcon,
  CheckCircle2Icon,
  CircleDotIcon,
  Clock3Icon,
  Edit3Icon,
  EllipsisVerticalIcon,
  EyeIcon,
  FolderOpenIcon,
  PauseCircleIcon,
  UserPlusIcon,
  UsersIcon,
  XCircleIcon,
} from "lucide-react";

import type { Project } from "../Types/project";
import { allocats } from "@/data/allocats";
import { getProjectIcon } from "@/utils/projectIcons";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar28 } from "@/components/DatePicker";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";

const MotionLink = motion.create(Link);

type ViewProps = {
  project: Project;
};

type DialogProps = {
  project: Project;
  trigger: React.ReactNode;
};

type ProjectStatusAppearance = {
  label: string;
  dot: string;
  badge: string;
  icon: React.ComponentType<{
    size?: number;
    className?: string;
  }>;
};

const statusAppearance: Record<string, ProjectStatusAppearance> = {
  pending: {
    label: "Pending",
    dot: "bg-amber-500",
    badge:
      "border-amber-500/20 bg-amber-400/10 text-amber-700 dark:text-amber-300",
    icon: Clock3Icon,
  },
  active: {
    label: "Active",
    dot: "bg-emerald-500",
    badge:
      "border-emerald-500/20 bg-emerald-400/10 text-emerald-700 dark:text-emerald-300",
    icon: CircleDotIcon,
  },
  onhold: {
    label: "On hold",
    dot: "bg-muted-foreground",
    badge: "border-border bg-muted text-muted-foreground",
    icon: PauseCircleIcon,
  },
  complete: {
    label: "Complete",
    dot: "bg-sky-500",
    badge:
      "border-sky-500/20 bg-sky-400/10 text-sky-700 dark:text-sky-300",
    icon: CheckCircle2Icon,
  },
  completed: {
    label: "Complete",
    dot: "bg-sky-500",
    badge:
      "border-sky-500/20 bg-sky-400/10 text-sky-700 dark:text-sky-300",
    icon: CheckCircle2Icon,
  },
  closed: {
    label: "Closed",
    dot: "bg-slate-500",
    badge: "border-border bg-muted text-muted-foreground",
    icon: CheckCircle2Icon,
  },
};

const priorityAppearance: Record<string, string> = {
  standard:
    "border-sky-500/20 bg-sky-400/10 text-sky-700 dark:text-sky-300",
  high: "border-amber-500/20 bg-amber-400/10 text-amber-700 dark:text-amber-300",
  urgent:
    "border-destructive/20 bg-destructive/10 text-destructive",
};

function normalizeStatus(status?: string) {
  return status?.toLowerCase().replace(/[\s_-]/g, "") || "onhold";
}

function getStatusAppearance(status?: string) {
  const normalizedStatus = normalizeStatus(status);

  return (
    statusAppearance[normalizedStatus] ?? {
      label: status
        ? status.charAt(0).toUpperCase() + status.slice(1)
        : "On hold",
      dot: "bg-muted-foreground",
      badge: "border-border bg-muted text-muted-foreground",
      icon: PauseCircleIcon,
    }
  );
}

function formatDate(date?: string | Date | null) {
  if (!date) return "Not set";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Not set";
  }

  return new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(parsedDate);
}

function getInitials(name?: string) {
  if (!name) return "A";

  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
}

function clampProgress(progress?: number) {
  if (typeof progress !== "number") return 0;

  return Math.min(100, Math.max(0, progress));
}

export function GridView({ project }: ViewProps) {
  const progress = clampProgress(project.progress);

  return (
    <motion.article
      className={[
        "group relative flex min-h-[310px] min-w-0 flex-col",
        "overflow-hidden rounded-[1.75rem] border border-border",
        "bg-card p-5 text-card-foreground transition-all duration-300",
        "hover:-translate-y-1 hover:border-primary/25",
        "hover:shadow-xl hover:shadow-black/5",
        "dark:hover:shadow-black/20 sm:p-6",
      ].join(" ")}
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="absolute right-0 top-0 h-28 w-28 rounded-bl-[6rem] bg-primary/[0.06] transition-transform duration-500 group-hover:scale-110" />

      <div className="relative flex items-start justify-between gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/12 text-primary">
          {getProjectIcon(project?.category ?? "default")}
        </div>

        <ProjectMenu project={project} />
      </div>

      <div className="relative mt-7 min-w-0">
        <p className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          {project.category || "General project"}
        </p>

        <MotionLink
          to={`${project.id}`}
          className="mt-2 block min-w-0"
          whileTap={{ scale: 0.98 }}
          transition={{ duration: 0.15 }}
        >
          <h3 className="line-clamp-2 break-words text-xl font-black uppercase leading-[1.05] tracking-[-0.025em] transition-colors group-hover:text-primary sm:text-2xl">
            {project.title}
          </h3>
        </MotionLink>

        {project.description && (
          <p className="mt-3 line-clamp-2 text-sm leading-6 text-muted-foreground">
            {project.description}
          </p>
        )}
      </div>

      <div className="relative mt-auto pt-8">
        <div className="mb-3 flex items-center justify-between gap-4">
          <span className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            Progress
          </span>

          <span className="text-sm font-black">{progress}%</span>
        </div>

        <Progress value={progress} className="h-2" />

        <div className="mt-5 flex items-center justify-between gap-3 border-t border-border pt-4">
          <span className="flex min-w-0 items-center gap-2 text-xs text-muted-foreground">
            <CalendarDaysIcon size={14} className="shrink-0" />
            <span className="truncate">
              Created {formatDate(project.createdAt)}
            </span>
          </span>

          <Link
            to={`${project.id}`}
            className="flex shrink-0 items-center gap-1 text-xs font-semibold text-primary transition-colors hover:underline"
          >
            Open
            <ArrowRightIcon size={13} />
          </Link>
        </div>
      </div>
    </motion.article>
  );
}

export function ListView({ project }: ViewProps) {
  const progress = clampProgress(project.progress);

  return (
    <motion.article
      className={[
        "group relative grid min-w-0 gap-5 overflow-hidden",
        "rounded-[1.5rem] border border-border bg-card",
        "p-5 text-card-foreground transition-all duration-300",
        "hover:border-primary/25 hover:shadow-lg hover:shadow-black/5",
        "dark:hover:shadow-black/20",
        "md:grid-cols-[auto_minmax(0,1fr)_180px_auto]",
        "md:items-center md:p-6",
      ].join(" ")}
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/12 text-primary">
        {getProjectIcon(project?.category ?? "default")}
      </div>

      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            {project.category || "General project"}
          </p>

          <StatusBadge status={project.status} />
        </div>

        <MotionLink
          to={`${project.id}`}
          className="mt-2 block min-w-0"
          whileTap={{ scale: 0.98 }}
          transition={{ duration: 0.15 }}
        >
          <h3 className="truncate text-lg font-black uppercase tracking-[-0.02em] transition-colors group-hover:text-primary">
            {project.title}
          </h3>
        </MotionLink>

        <p className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
          <CalendarDaysIcon size={14} />
          Created {formatDate(project.createdAt)}
        </p>
      </div>

      <div className="min-w-0">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-xs font-semibold text-muted-foreground">
            Progress
          </span>

          <span className="text-xs font-black">{progress}%</span>
        </div>

        <Progress value={progress} className="h-2" />
      </div>

      <div className="absolute right-4 top-4 md:static">
        <ProjectMenu project={project} hideStatus />
      </div>
    </motion.article>
  );
}

type ProjectMenuProps = ViewProps & {
  hideStatus?: boolean;
};

function ProjectMenu({ project, hideStatus = false }: ProjectMenuProps) {
  return (
    <div className="flex shrink-0 items-center gap-2">
      {!hideStatus && <StatusBadge status={project.status} />}

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-10 w-10 rounded-full text-muted-foreground shadow-none hover:bg-muted hover:text-foreground"
            aria-label={`Open menu for ${project.title}`}
          >
            <EllipsisVerticalIcon size={18} />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="end"
          className="w-52 rounded-2xl border-border bg-popover p-2 text-popover-foreground shadow-xl"
        >
          {project.allocatAssignments.length === 0 ? (
            <DropdownMenuItem className="rounded-xl">
              <UserPlusIcon size={15} />
              Assign Allocat
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem asChild className="rounded-xl">
              <Link to={`${project.id}`}>
                <FolderOpenIcon size={15} />
                Open project
              </Link>
            </DropdownMenuItem>
          )}

          <DropdownMenuItem
            className="rounded-xl"
            onSelect={(event) => event.preventDefault()}
          >
            <ProjectDetailsDialog
              project={project}
              trigger={
                <>
                  <EyeIcon size={15} />
                  View details
                </>
              }
            />
          </DropdownMenuItem>

          <DropdownMenuItem
            className="rounded-xl"
            onSelect={(event) => event.preventDefault()}
          >
            <EditProjectDialog
              project={project}
              trigger={
                <>
                  <Edit3Icon size={15} />
                  Edit project
                </>
              }
            />
          </DropdownMenuItem>

          <DropdownMenuItem className="rounded-xl">
            <CircleDotIcon size={15} />
            Change status
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem className="rounded-xl text-destructive focus:bg-destructive/10 focus:text-destructive">
            <XCircleIcon size={15} />
            Cancel project
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

function StatusBadge({ status }: { status?: string }) {
  const appearance = getStatusAppearance(status);
  const Icon = appearance.icon;

  return (
    <Badge
      variant="outline"
      className={`h-7 rounded-full px-2.5 text-[0.65rem] font-semibold shadow-none ${appearance.badge}`}
    >
      <Icon size={12} />
      {appearance.label}
    </Badge>
  );
}

function ProjectDetailsDialog({ project, trigger }: DialogProps) {
  const progress = clampProgress(project.progress);
  const status = getStatusAppearance(project.status);

  const projectAllocats = project.allocatAssignments
    .map((assignment) => {
      /*
       * Keep this lookup if allocatAssignments contains IDs.
       * Adjust it if your API returns assignment objects instead.
       */
      return allocats.find((allocat) => allocat.id === assignment);
    })
    .filter(Boolean);

  const priority =
    project.priority?.toLowerCase() || "standard";

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          type="button"
          className="flex w-full items-center gap-2 text-left"
        >
          {trigger}
        </button>
      </DialogTrigger>

      <DialogContent className="max-h-[90vh] overflow-y-auto rounded-[2rem] border-border bg-background p-0 text-foreground sm:max-w-2xl">
        <DialogHeader className="border-b border-border px-6 pb-6 pt-7 text-left sm:px-8 sm:pt-8">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/12 text-primary">
              {getProjectIcon(project?.category ?? "default")}
            </div>

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <StatusBadge status={project.status} />

                {project.priority && (
                  <Badge
                    variant="outline"
                    className={[
                      "h-7 rounded-full px-2.5 text-[0.65rem]",
                      "font-semibold capitalize shadow-none",
                      priorityAppearance[priority] ??
                        priorityAppearance.standard,
                    ].join(" ")}
                  >
                    {project.priority}
                  </Badge>
                )}
              </div>

              <DialogTitle className="mt-4 break-words text-2xl font-black uppercase leading-tight tracking-[-0.03em] sm:text-3xl">
                {project.title}
              </DialogTitle>

              <DialogDescription className="mt-3 max-w-xl text-sm leading-7 text-muted-foreground">
                {project.description || "No project description was provided."}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-7 px-6 py-7 sm:px-8">
          <div className="grid gap-4 sm:grid-cols-3">
            <DateDetail label="Created" value={project.createdAt} />
            <DateDetail label="Start date" value={project.startDate} />
            <DateDetail label="Due date" value={project.dueDate} />
          </div>

          <section className="rounded-[1.5rem] border border-border bg-card p-5 text-card-foreground">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                  Project progress
                </p>

                <div className="mt-2 flex items-center gap-2 text-sm font-semibold">
                  <span className={`h-2 w-2 rounded-full ${status.dot}`} />
                  {status.label}
                </div>
              </div>

              <span className="text-3xl font-black tracking-[-0.04em]">
                {progress}%
              </span>
            </div>

            <Progress value={progress} className="mt-5 h-2" />
          </section>

          <div className="grid gap-4 sm:grid-cols-2">
            <DetailCard
              label="Category"
              value={
                project.category
                  ? project.category.charAt(0).toUpperCase() +
                    project.category.slice(1)
                  : "General"
              }
            />

            <DetailCard
              label="Project code"
              value={project.projectCode || "Not assigned"}
            />
          </div>

          <section>
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                  Project team
                </p>

                <h3 className="mt-1 text-lg font-black uppercase">
                  Members
                </h3>
              </div>

              <Badge
                variant="secondary"
                className="rounded-full shadow-none"
              >
                <UsersIcon size={13} />
                {projectAllocats.length}
              </Badge>
            </div>

            {projectAllocats.length > 0 ? (
              <div className="mt-4 space-y-3">
                {projectAllocats.map((allocat) => (
                  <div
                    key={allocat?.id}
                    className="flex items-center justify-between gap-4 rounded-[1.25rem] border border-border bg-card p-4 text-card-foreground"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <Avatar className="h-11 w-11 border border-border">
                        <AvatarImage
                          src="https://github.com/shadcn.png"
                          alt={allocat?.fullName || "Allocat"}
                        />

                        <AvatarFallback className="bg-primary/15 font-bold text-primary">
                          {getInitials(allocat?.fullName)}
                        </AvatarFallback>
                      </Avatar>

                      <div className="min-w-0">
                        <p className="truncate text-sm font-bold">
                          {allocat?.fullName}
                        </p>

                        <p className="text-xs text-muted-foreground">
                          Project member
                        </p>
                      </div>
                    </div>

                    <Button
                      asChild
                      variant="ghost"
                      size="sm"
                      className="shrink-0 rounded-full text-primary"
                    >
                      <Link to="">
                        Profile
                        <ArrowRightIcon size={14} />
                      </Link>
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="mt-4 rounded-[1.5rem] border border-dashed border-border bg-muted/20 px-5 py-8 text-center">
                <UsersIcon
                  size={24}
                  className="mx-auto text-muted-foreground"
                />

                <p className="mt-3 text-sm font-semibold">
                  No Allocats assigned
                </p>

                <p className="mt-1 text-xs text-muted-foreground">
                  Assigned professionals will appear here.
                </p>
              </div>
            )}
          </section>
        </div>

        <DialogFooter className="border-t border-border px-6 py-5 sm:px-8">
          <DialogClose asChild>
            <Button variant="outline" className="rounded-full px-6">
              Close
            </Button>
          </DialogClose>

          <Button asChild className="rounded-full px-6">
            <Link to={`${project.id}`}>
              Open project
              <ArrowRightIcon size={15} />
            </Link>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function DateDetail({
  label,
  value,
}: {
  label: string;
  value?: string | Date | null;
}) {
  return (
    <div className="rounded-[1.25rem] border border-border bg-card p-4 text-card-foreground">
      <p className="text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
        {label}
      </p>

      <p className="mt-2 flex items-center gap-2 text-sm font-semibold">
        <CalendarDaysIcon size={15} className="text-primary" />
        {formatDate(value)}
      </p>
    </div>
  );
}

function DetailCard({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-[1.25rem] border border-border bg-card p-4 text-card-foreground">
      <p className="text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
        {label}
      </p>

      <p className="mt-2 break-words text-sm font-semibold">{value}</p>
    </div>
  );
}

function EditProjectDialog({ project, trigger }: DialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          type="button"
          className="flex w-full items-center gap-2 text-left"
        >
          {trigger}
        </button>
      </DialogTrigger>

      <DialogContent className="max-h-[90vh] overflow-y-auto rounded-[2rem] border-border bg-background text-foreground sm:max-w-2xl">
        <form>
          <DialogHeader className="text-left">
            <p className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-primary">
              Project settings
            </p>

            <DialogTitle className="mt-2 text-2xl font-black uppercase tracking-[-0.03em]">
              Edit project
            </DialogTitle>

            <DialogDescription className="leading-7">
              Update the project information, dates and priority. Save the
              changes when you are finished.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-7 grid gap-6">
            <div className="grid gap-2">
              <Label htmlFor={`title-${project.id}`}>Project title</Label>

              <Input
                id={`title-${project.id}`}
                name="title"
                defaultValue={project.title}
                className="h-12 rounded-xl bg-card"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor={`description-${project.id}`}>
                Description
              </Label>

              <Textarea
                id={`description-${project.id}`}
                name="description"
                defaultValue={project.description}
                className="min-h-32 rounded-xl bg-card"
              />
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div className="grid min-w-0 gap-2">
                <Label htmlFor={`start-date-${project.id}`}>
                  Start date
                </Label>

                <Calendar28
                  id={`start-date-${project.id}`}
                  value={
                    project.startDate
                      ? new Date(project.startDate)
                      : new Date()
                  }
                />
              </div>

              <div className="grid min-w-0 gap-2">
                <Label htmlFor={`due-date-${project.id}`}>
                  Due date
                </Label>

                <Calendar28
                  id={`due-date-${project.id}`}
                  value={
                    project.dueDate
                      ? new Date(project.dueDate)
                      : new Date()
                  }
                />
              </div>
            </div>

            <fieldset className="grid gap-3">
              <legend className="text-sm font-medium">Priority</legend>

              <div className="grid gap-3 sm:grid-cols-3">
                <PriorityOption
                  projectId={project.id}
                  value="standard"
                  label="Standard"
                  defaultChecked={project.priority === "standard"}
                />

                <PriorityOption
                  projectId={project.id}
                  value="high"
                  label="High"
                  defaultChecked={project.priority === "high"}
                />

                <PriorityOption
                  projectId={project.id}
                  value="urgent"
                  label="Urgent"
                  defaultChecked={project.priority === "urgent"}
                />
              </div>
            </fieldset>
          </div>

          <DialogFooter className="mt-8">
            <DialogClose asChild>
              <Button
                type="button"
                variant="outline"
                className="rounded-full px-6"
              >
                Cancel
              </Button>
            </DialogClose>

            <Button type="submit" className="rounded-full px-6">
              Save changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function PriorityOption({
  projectId,
  value,
  label,
  defaultChecked,
}: {
  projectId: string;
  value: string;
  label: string;
  defaultChecked: boolean;
}) {
  const inputId = `${value}-${projectId}`;

  return (
    <label
      htmlFor={inputId}
      className={[
        "flex cursor-pointer items-center gap-3 rounded-xl",
        "border border-border bg-card p-4 text-sm",
        "transition-colors hover:border-primary/35",
        "has-[:checked]:border-primary/40",
        "has-[:checked]:bg-primary/10",
      ].join(" ")}
    >
      <input
        type="radio"
        name={`priority-${projectId}`}
        id={inputId}
        value={value}
        defaultChecked={defaultChecked}
        className="h-4 w-4 accent-primary"
      />

      <span className="font-semibold">{label}</span>
    </label>
  );
}
