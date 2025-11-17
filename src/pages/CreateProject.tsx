import NewProjectForm from "@/components/NewProjectForm";
import MinimalNavMenu from "@/components/MinimalNavMenu";

function CreateProject() {

    return (
        <>  
            <header className="bg-background sticky top-0 border-b z-10">
                <MinimalNavMenu />
            </header>
            <main className="mx-auto w-full px-2 py-8">
                <div className="flex flex-col w-6xl mx-auto pb-4">
                    <span className="border-b">
                        <h2 className="text-2xl font-bold mb-4">Create New Project</h2>
                        <p className="text-sm text-muted-foreground py-4 leading-[1rem]">Start by defining your project details, setting goals, and assigning tasks to the right experts.</p>
                    </span>
                    <div className="mt-8">
                        <NewProjectForm />
                    </div>
                </div>                
            </main>
        </>
    );
}

export default CreateProject;