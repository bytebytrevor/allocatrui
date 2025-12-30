import { CalendarPlus2Icon, CircleCheckBigIcon, MapPinIcon, ShieldCheckIcon, StarIcon } from "lucide-react";
import { Button } from "./ui/button"; 
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { avatarFallback } from "@/utils/avatarFallback";
import type { Project } from "../Types/project";
import type { Allocat } from "../Types/allocat";
import drill from "@/assets/drill-square.svg"
import { useNavigate } from "react-router-dom";
import axios from "axios";

type Props = {
    allocat: Allocat;
    project?: Project;
}

export function AllocatCardGrid({ allocat, project }: Props) {
    const navigate = useNavigate();

    async function handleInvite() {
        if (!project)
            return;
        console.log(project);

        try {
            await axios.put<Allocat>(
                `http://localhost:5206/projects/${project.id}/allocats/${allocat.id}`,
            );

            console.log(project);

            return navigate("/projects");
        } catch (err) {
            console.log(err);
        }        
    }

    return (
        <div className="bg-muted p-8 rounded-xl">
            <div className="flex items-start gap-2">
                <div className="flex flex-col gap-2">
                    <Avatar className="w-12 h-12 border-4" >
                        {/* <AvatarImage src="https://github.com/shadcn.png" /> */}
                        <AvatarImage src={drill} />
                        <AvatarFallback className={`text-background bg-muted-foreground`}>
                            {avatarFallback(allocat)}
                        </AvatarFallback>
                    </Avatar>
                    <span className="flex items-center gap-1 bg-accent-2 text-xs text-white py-1 px-2 font-semibold rounded-xl">
                        <StarIcon size={12} strokeWidth={4} />
                        {allocat.rating}
                    </span>
                </div>
                
                <div className="w-full">
                    <div>
                        <span className="flex items-center justify-between">
                            <h2 className="text-sm font-bold">{allocat.fullName}</h2>
                            <ShieldCheckIcon size={18} className="text-accent-2" />
                        </span>
                        <span className="text-sm text-muted-foreground">{allocat.title}</span>
                    </div>
                    <div className="mt-2 text-foreground/80">
                        <small className="flex items-center gap-1 my-3">
                            <MapPinIcon size={16} />
                            {allocat.location}
                        </small>
                        <span className="flex flex-col font-medium">
                            <small className="flex items-center gap-1"> <CircleCheckBigIcon size={12} />{allocat.completedProjects} projects</small>
                            <small className="flex items-center gap-1">
                                <CalendarPlus2Icon size={12} />
                                Joined {`${new Date().getFullYear() - new Date(allocat.joinedAt).getFullYear()} years ago`}
                            </small>
                        </span>
                    </div>
                </div>
            </div>

            <div className="mt-4">
                <span className="text-sm font-bold">${allocat.hourlyRate}/h</span>
            </div>
            <div className="flex items-center gap-2 mt-4">
                <Button
                    variant="link"
                    className="w-[50%] text-xs text-foreground font-semibold "
                >
                    View profile
                </Button>
                <Button
                    variant="outline"
                    className="w-[50%] text-xs py-4 px-6  shadow-none dark:hover:bg-primary dark:hover:text-background"
                    onClick={handleInvite}
                >
                    Invite
                </Button> 
            </div>            
        </div>
    );
}