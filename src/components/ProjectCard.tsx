import { CalendarDaysIcon, EllipsisVerticalIcon } from "lucide-react";
import { Progress } from "./ui/progress";
import type { Project } from "@/Types";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { getProjectIcon } from "@/utils/projectIcons";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";

const MotionLink = motion.create(Link);

type ViewProps = {
    project: Project;
}

const statusColor: Record<string, string> = {
    pending: "destructive",
    active: "accent-2",
    onhold: "muted-foreground",
    complete: "accent-3"
}

export function ListView({project}: ViewProps) {
    const dotColor = statusColor[project.status] || statusColor.onhold;

    return (
        <div className="flex items-center w-full gap-4 bg-muted rounded-2xl py-4 px-6">
            {getProjectIcon(project?.type ?? "default")}  
            <div className="flex flex-col w-full">
                <div className="flex items-center justify-between">
                    <MotionLink
                    to={`${project.id}`}
                        className="flex justify-between mt-2 rounded-2xl"
                        whileTap={{ scale: 0.96 }}
                        transition={{ duration: 0.2, ease: "easeInOut" }}
                    >
                        <h3 className="font-bold text-sm transition delay-90 duration-300 hover:text-primary">{project.title}</h3>
                    </MotionLink>
                    <ProjectMenu project={project} />
                </div> 
                <div className="flex justify-between mt-2 rounded-2xl"
                >
                    <div className="flex items-center gap-4 w-xl">                        
                        <div>                 
                            <span
                                className="flex items-center gap-1 font-light text-muted-foreground text-xs"
                            >
                                <CalendarDaysIcon size={16} />Created { new Date(project.createdAt).toDateString()}
                            </span>       
                            <p className="text-[0.9rem] pt-1">{project.description.slice(0, 60)}...</p>
                        </div>   
                    </div>
                    <div className="flex gap-12">
                        <div className="flex flex-col items-end max-w-60">
                            <Progress value={project.progress} className="mt-1 w-[120px]"/>
                            <div className="flex flex-col items-end mt-2">
                                <span className="text-xs text-muted-foreground font-light">{project.projectCode}</span>
                                <span className="flex items-center gap-2 text-xs">
                                    {project.status.charAt(0).toUpperCase()+project.status.slice(1)}
                                    <span className={`w-2 h-2 bg-${dotColor} rounded-full`}></span>
                                </span>
                            </div>
                        </div>                    
                    </div>
                </div>
            </div>
        </div>
)}  

export function GridView({project}: ViewProps) {    
    const dotColor = statusColor[project.status] || statusColor.onhold;

    return (
        <div className="flex flex-col items-start gap-4 bg-muted rounded-xl py-4 px-6">
            <div className="flex items-center w-full justify-between">
                {getProjectIcon(project?.type ?? "default")}
                <ProjectMenu project={project}/>
            </div>
            <div>
                <MotionLink
                    to={`${project.id}`}
                    className="flex flex-col justify-between mt-2 rounded-2xl"
                    whileTap={{ scale: 0.96 }}
                    transition={{ duration: 0.2, ease: "easeInOut" }}
                > 
                    <h3 className="font-bold text-sm transition delay-90 duration-300 hover:text-primary">{project.title}</h3>
                </MotionLink>
            
                <Progress value={project.progress} className="mt-4"/>               
                <span
                    className="flex items-center gap-1 font-light text-muted-foreground text-xs mt-6"
                >
                    <CalendarDaysIcon size={16} />Created { new Date(project.createdAt).toDateString() }
                </span>       
                <p className="text-[0.9rem] py-2">{project.description.slice(0, 60)}...</p>                              
            </div>
            <div className="flex flex-grow items-center w-full justify-between font-semibold mt-2">
                <span className="text-xs text-muted-foreground font-light">{project.projectCode}</span> 
                <span className="flex items-center gap-2 text-xs">
                    <span className={`w-2 h-2 bg-${dotColor} rounded-full`}></span>
                    {project.status.charAt(0).toUpperCase()+project.status.slice(1)}
                </span>
            </div> 
        </div>
    );
}

function ProjectMenu({project}: ViewProps) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger>
                <EllipsisVerticalIcon
                    size={28}
                    className="text-foreground/50 rounded-full cursor-pointer p-1 transition delay-150 duration-300 ease-in-out hover:text-foreground hover:bg-muted-foreground/20"
                />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-background">
                {project.allocatIds.length === 0
                ?
                    <DropdownMenuItem>Assign Allocat</DropdownMenuItem>
                :
                    <DropdownMenuItem>Open</DropdownMenuItem>
                }
                {/* <DropdownMenuItem>Open</DropdownMenuItem> */}
                <DropdownMenuItem>View Details</DropdownMenuItem>
                <DropdownMenuItem>Edit project</DropdownMenuItem>
                <DropdownMenuItem>Change status</DropdownMenuItem>
                <DropdownMenuItem className="text-destructive">Cancel</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}