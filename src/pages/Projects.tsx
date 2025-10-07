import DashboardMainNav from "@/components/DashboardMainNav";
import ProjectCard from "@/components/ProjectCard";
import ProjectStatusBadge from "@/components/ProjectStatusBadge";
import { Button } from "@/components/ui/button";
import { ArrowDownNarrowWideIcon, CatIcon, CircleCheckBigIcon, HeartIcon, HeartOffIcon, History, Megaphone, MegaphoneIcon, PlusIcon, RotateCcwIcon, ViewIcon } from "lucide-react";
import { Link } from "react-router-dom";

function Projects() {
    return (
        <>
            <header className="px-4 py-2 border-b">
                <DashboardMainNav />
            </header>
            <main className="container flex-col my-8 mx-auto">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <h1 className="font-bold my-4">Hi Thelly!</h1>
                        <span className="">You have 5 active projects</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <Button className="rounded-full"><PlusIcon />New project</Button>
                    </div>
                </div>
                <section className="flex gap-12 justify-between w-full mt-8">
                    <section className="w-full">                    
                        <form action="">
                            <input
                                type="text"
                                name="searchProject"
                                id="searchProject"
                                placeholder="Search project..."
                                className="search w-full rounded-full"
                            />
                        </form>
                        <div className="flex items-center justify-between mt-12">
                            <div className="flex items-center gap-2">
                                <ProjectStatusBadge label={"5 Active projects"} color={"primary"} bg={"primary"} icon={RotateCcwIcon} />
                                <ProjectStatusBadge label={"5 Completed projects"} color={"accent-2"} bg={"accent-2"} icon={CircleCheckBigIcon} />
                            </div>
                            <div className="flex">
                                <Button variant="link" className="flex items-center gap-1 text-foreground"><History /> History</Button>
                                <Button variant="link" className="flex items-center gap-1 text-foreground"><ArrowDownNarrowWideIcon /> Sort by name</Button>

                            </div>
                        </div>
                        <div className="flex flex-col gap-2 my-6">
                            <ProjectCard />
                            <ProjectCard />
                            <ProjectCard />
                        </div>                        
                    </section>
                    <aside>
                        <div className="flex items-start gap-2 w-sm bg-accent border px-6 py-10 rounded-[6px]">
                            <span className=""><Megaphone size={40} /></span>
                            <div className="flex flex-col space-y-4">
                                <h3 className="font-bold">Advert Heading</h3>
                                <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Vero fugit doloremque eius placeat voluptatum, aliquam porro vitae repellat aperiam.</p>

                                <Button className="rounded-full mt-4"><CatIcon />Add to favorites</Button>
                            </div>
                        </div>
                    </aside>
                </section>
            </main>
        </>
    )
}

export default Projects;