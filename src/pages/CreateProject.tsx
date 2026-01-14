import NewProjectForm from "@/components/NewProjectForm";
import MinimalNavMenu from "@/components/MinimalNavMenu";
import robocat from "@/assets/robocat.svg";

function CreateProject() {

    return (
        <>  
            <header className="bg-background sticky top-0 border-b z-10">
                <div className="container mx-auto px-4">
                    <MinimalNavMenu />
                </div>
            </header>
            <main className="container flex flex-col items-center mx-auto px-2 py-8">
                    <div className="w-2xl">
                        <img
                        className="bg-input w-24 rounded-sm"
                            src={robocat}
                            alt=""
                        />
                            <span>
                                <h2 className="text-2xl text-primary font-bold my-4">Create New Project</h2>
                                <p className="text-sm text-muted-foreground w-sm py-4 leading-[1rem]">Start by defining your project details, setting goals, and assigning tasks to the right experts.</p>
                            </span>
                    
                        <div>
                            <NewProjectForm />
                        </div>
                    </div>               
            </main>
        </>
    );
}

export default CreateProject;