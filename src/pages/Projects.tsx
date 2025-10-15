import DashboardMainNav from "@/components/DashboardMainNav";
import ProjectCard from "@/components/ProjectCard";
import ProjectStatusBadge from "@/components/ProjectStatusBadge";
import { Button } from "@/components/ui/button";
import {
    ArrowDownNarrowWideIcon,
    CircleCheckBigIcon,
    ClockIcon,
    HeartIcon,
    History,
    LightbulbIcon,
    Megaphone,
    MessagesSquareIcon,
    PlusIcon,
    RotateCcwIcon
} from "lucide-react";
import { Link } from "react-router-dom";
import { projects } from "@/data/projects";

function Projects() {
    return (
        <>
            <header className="border-b sticky top-0">
                <DashboardMainNav> 
                    <form action="" className="focus:outline-none focus:border-none focus:ring-0">
                        <input
                            type="text"
                            name="searchProject"
                            id="searchProject"
                            placeholder="Search project..."
                            className="search text-[.8rem] w-xl rounded-full focus:outline"
                        />
                    </form>                 
                        
                </DashboardMainNav>
            </header>
            <main className="container mt-8 mx-auto">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <h1 className="font-bold my-4">Hi Thelly!</h1>
                        <span className="">You have 5 active projects</span>
                    </div>
                    <div className="flex items-center">
                        <Button className="rounded-full"><PlusIcon />New project</Button>
                    </div>
                </div>
                <section className="flex gap-12 justify-between w-full mt-8">
                    <section className="w-full">                    
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <ProjectStatusBadge label={"5 Active"} color={"primary"} bg={"primary"} icon={RotateCcwIcon} />
                                <ProjectStatusBadge label={"5 Completed"} color={"accent-2"} bg={"accent-2"} icon={CircleCheckBigIcon} />
                            </div>
                            <div className="flex">
                                <Button variant="link" className="flex items-center gap-1 text-foreground"><History />History</Button>
                                <Button variant="link" className="flex items-center gap-1 text-foreground"><ArrowDownNarrowWideIcon />Title</Button>
                            </div>
                        </div>
                        <div className="flex flex-col gap-2 my-6">
                            {projects.map(project =>
                                <ProjectCard key={project.id} props={project} />
                            )}                            
                        </div>                        
                    </section>
                    <aside className="flex flex-col space-y-4 w-lg">
                        <article className="flex items-start gap-2 bg-accent border px-6 py-10 rounded-[6px]">
                            <span className=""><Megaphone size={40} /></span>
                            <div className="flex flex-col space-y-4">
                                <h3 className="font-bold">Advert Heading</h3>
                                <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Vero fugit doloremque eius placeat voluptatum, aliquam porro vitae repellat aperiam.</p>

                                <Button className="rounded-full mt-4"><HeartIcon />Add to favorites</Button>
                            </div>                            
                        </article>
                        <article className="bg-accent border p-6">
                            <div className="flex gap-2">
                            <span><LightbulbIcon /></span>
                            <div className="flex flex-col space-y-2">
                                <h3 className="font-bold">
                                    Tip of the day
                                </h3>
                                <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusamus, nulla natus corporis.</p>
                                <Link className="text-accent-3" to="">Learn more</Link>
                            </div>
                            </div>
                        </article>
                        <article className="">
                            <div className="flex gap-2">
                            <span><MessagesSquareIcon /></span>
                            <div className="flex flex-col space-y-2">
                                <h3 className="font-bold">Jean sent you a message</h3>
                                <small className="flex items-center gap-1 text-muted-foreground"><ClockIcon size={14} />3 hrs ago</small>
                                <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusamus, nulla natus corporis.</p>
                                <Link className="text-accent-3" to="">View chat</Link>
                            </div>
                            </div>
                        </article>
                    </aside>
                </section>
            </main>
        </>
    )
}

export default Projects;