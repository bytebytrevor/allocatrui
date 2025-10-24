import ComboBox from "@/components/ComboBox";
import { Button } from "@/components/ui/button";
import { InfoIcon, PaperclipIcon } from "lucide-react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"
import { Calendar28 } from "@/components/DatePicker";
import NewProjectForm from "@/components/NewProjectForm";

function CreateProject() {
    return (
        <>            
            <main className="flex flex-col h-screen items-center justify-center w-full py-4">
                <section className="max-w-8xl">
                    <div className="flex drop-shadow-xl">
                        <div className="new-project-bg bg-secondary w-xs rounded-l-2xl"></div>
                        <div className="max-w-full rounded-r-2xl px-12 pt-6 pb-16 bg-muted" >
                            <div className="flex items-center justify-between mb-8 pb-4 border-b">
                                <h1>Hi <span className="font-bold">Thelly!</span></h1>
                                <img src="/src/assets/allocatr-neg-light.svg" alt="" className="w-20" />
                            </div>
                            <h2 className="text-2xl font-bold">Create New Project</h2>
                            <p className="py-2 text-xs text-muted-foreground leading-[1rem]">Start by defining your project details, setting goals, and assigning tasks to the right experts.</p>
                            <NewProjectForm />
                        </div>
                    </div>
                </section>
            </main>
        </>
    );
}

export default CreateProject;