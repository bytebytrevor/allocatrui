import DashboardMainNav from "@/components/DashboardMainNav";
import ProjectCard from "@/components/ProjectCard";
import ProjectStatusBadge from "@/components/ProjectStatusBadge";
import { CircleCheckBigIcon, RotateCcwIcon } from "lucide-react";

function Projects() {
    return (
        <>
            <header className="px-4 py-2 border-b">
                <DashboardMainNav />
            </header>
            <main className="container flex-col my-8 mx-auto">
                <section>
                    <div>
                        <div className="flex items-center space-x-2">
                            <h1 className="font-bold my-4">Hi Thelly!</h1>
                            <span className="">You have 5 active projects</span>
                        </div>
                        <form action="">
                            <input
                                type="text"
                                name="searchProject"
                                id="searchProject"
                                placeholder="Search project..."
                                className="search w-full rounded-full"
                            />
                        </form>
                        <div className="flex gap-2 mt-12">
                            <ProjectStatusBadge label={"5 Active projects"} color={"primary"} bg={"primary"} icon={RotateCcwIcon} />
                            <ProjectStatusBadge label={"5 Completed projects"} color={"accent-2"} bg={"accent-2"} icon={CircleCheckBigIcon} />
                        </div>
                        <div className="flex flex-col gap-2 my-6">
                            <ProjectCard />
                            <ProjectCard />
                            <ProjectCard />
                        </div>                        
                    </div>
                </section>
            </main>
        </>
    )
}

export default Projects;