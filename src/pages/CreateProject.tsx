import allocatrLogoLight from "../assets/allocatr-neg-light.svg";
import allocatrLogoDark from "../assets/allocatr-dark-02.svg";
import NewProjectForm from "@/components/NewProjectForm";

function CreateProject() {
    const isDark = document.querySelector("html")?.classList.contains("dark");

    const logo = isDark ? allocatrLogoLight : allocatrLogoDark;

    return (
        <>            
            <main className="flex h-screen w-full">
                        <div className="new-project-bg bg-secondary h-full w-full"></div>
                        <div className="scrollbar-thin w-6xl px-12 pt-6 pb-16 overflow-y-auto">
                            <div className="flex items-center justify-between mb-8 pb-4">
                                <img src={logo} alt="" className="w-20" />
                            </div>
                            <h2 className="text-2xl font-bold">Create New Project</h2>
                            <p className="py-2 text-xs text-muted-foreground leading-[1rem]">Start by defining your project details, setting goals, and assigning tasks to the right experts.</p>
                            <div className="mt-2">
                                <NewProjectForm />
                            </div>
                        </div>
                
            </main>
        </>
    );
}

export default CreateProject;