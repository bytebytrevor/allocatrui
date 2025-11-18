import NewProjectForm from "@/components/NewProjectForm";
import MinimalNavMenu from "@/components/MinimalNavMenu";
import robocat from "@/assets/robocat.svg";

function CreateProject() {

    return (
        <>  
            <header className="bg-background sticky top-0 border-b z-10">
                <div className="container mx-auto">
                    <MinimalNavMenu />
                </div>
            </header>
            <main className="w-full px-2 py-8">
                <div className="container flex gap-8 w-6xl mx-auto pb-4 rounded-4xl">
                    <div className="flex flex-col items-center w- text-center justify-start pr-8 border-r">
                        <img src={robocat} alt="" />
                        <h2 className="text-2xl text-primary font-bold my-4">Create New Project</h2>
                        <p className="text-sm text-muted-foreground w-sm py-4 leading-[1rem]">Start by defining your project details, setting goals, and assigning tasks to the right experts.</p>
                    </div>
                    <div className="w-full">
                        <NewProjectForm />
                    </div>
                </div>                
            </main>
        </>
    );
}

export default CreateProject;