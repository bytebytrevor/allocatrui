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
                            {/* <form action="" className="flex flex-col space-y-2" >
                                <label className="mt-4 font-semibold" htmlFor="title">Title</label>
                                <input
                                    type="text"
                                    name="title"
                                    id="title"
                                    placeholder="Project title"
                                    className=" w-full bg-input px-4 py-2 rounded-full"
                                />
                                <span className="flex flex-col gap-2 w-full">
                                    <label className="mt-2 font-semibold" htmlFor="type">Type</label>
                                    <ComboBox />
                                    <label className="mt-2 font-semibold" htmlFor="type">Type</label>
                                    <ComboBox />
                                </span> 
                                <span className="flex items-center mt-4 gap-4">
                                    <Calendar28 label="Start Date"/>
                                    <Calendar28 label="Due Date"/>
                                </span>
                                                        
                                <label className="flex items-center gap-2 mt-4 font-semibold" htmlFor="description">
                                    Description
                                    <HoverCard>
                                        <HoverCardTrigger><span><InfoIcon size={16} className="text-accent-3"/></span></HoverCardTrigger>
                                        <HoverCardContent className="rounded-2xl text-sm">
                                            Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptates mollitia quasi amet doloremque! Qui obcaecati blanditiis delectus fuga quia saepe aperiam odit.
                                            
                                        </HoverCardContent>
                                    </HoverCard>
                                </label>  
                                                    
                                <textarea
                                    rows={4}
                                    name="description"
                                    id="description"
                                    placeholder="Tell us more about your project"
                                    className=" w-full bg-input px-4 py-2 rounded-2xl"
                                />

                                <label htmlFor="file" className="flex items-center gap-2 pt-2"><PaperclipIcon size={16}/> Upload files</label>
                                <input type="file" multiple name="file" id="file" className="text-xs w-xs file:mr-4 file:px-4 file:py-2 file:bg-primary file:text-xs file:text-accent file:rounded-full"/>                                

                                <span className="flex items-center justify-end gap-4 mt-4 ">
                                    <Button className="rounded-full bg-input text-white">Find allocats</Button>
                                    <Button className="rounded-full">Post project</Button>
                                </span>                        
                            </form> */}
                        </div>
                    </div>
                </section>
            </main>
        </>
    );
}

export default CreateProject;