import { CalendarDaysIcon, EllipsisVerticalIcon } from "lucide-react";
import { Progress } from "./ui/progress";
import type { Project } from "@/Types";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { getProjectIcon } from "@/utils/projectIcons";

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
                    <h3 className="font-bold text-sm">{project.title}</h3>
                    <EllipsisVerticalIcon size={20} className="text-foreground/50 hover:text-foreground hover:bg-background/40 rounded-full"/>
                </div> 
                <MotionLink
                    to={`${project.id}`}
                    className="flex justify-between mt-2 rounded-2xl"
                    whileHover={{ opacity: 0.7 }}
                    whileTap={{ scale: 0.96 }}
                    transition={{ duration: 0.2, ease: "easeInOut" }}
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
                </MotionLink>
            </div>
        </div>
)}  

export function GridView({project}: ViewProps) {    
    const dotColor = statusColor[project.status] || statusColor.onhold;

    return (
        <div className="flex flex-col items-start gap-4 bg-muted rounded-xl py-4 px-6">
            <div className="flex items-center w-full justify-between">
                {getProjectIcon(project?.type ?? "default")}
                <EllipsisVerticalIcon size={20} className="text-foreground/50 hover:text-foreground hover:bg-background/40 rounded-full"/>
            </div>
            <MotionLink
                to={`${project.id}`}
                className="flex flex-col justify-between mt-2 rounded-2xl"
                whileHover={{ opacity: 0.7 }}
                whileTap={{ scale: 0.96 }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
            > 
                <h3 className="font-bold text-sm">{project.title}</h3>
                <Progress value={project.progress} className="mt-4"/>               
                <span
                    className="flex items-center gap-1 font-light text-muted-foreground text-xs mt-6"
                >
                    <CalendarDaysIcon size={16} />Created { new Date(project.createdAt).toDateString() }
                </span>       
                <p className="text-[0.9rem] py-2">{project.description.slice(0, 60)}...</p>                              
            </MotionLink>
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