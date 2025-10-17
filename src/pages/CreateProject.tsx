import ComboBox from "@/components/ComboBox";
import { Button } from "@/components/ui/button";
import { ChevronRightIcon, InfoIcon, PaperclipIcon } from "lucide-react";
import { Link } from "react-router-dom";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"

function CreateProject() {
    return (
        <>
        {/* <header className="border-b">
            <DashboardMainNav />
        </header> */}
        <main className="h-screen flex flex-col items-center justify-center w-full bg-linear-to-r/srgb from-backgroud/20 to-background">
            <section className="max-w-8xl">
                <div className="flex items-center justify-between mb-4 px-8">
                    <h1>Hi <span className="font-bold">Thelly!</span></h1>
                    <img src="/src/assets/allocatr-neg-light.svg" alt="" className="w-24" />
                </div>
                <div className="flex drop-shadow-xl">
                    <div className="new-project-bg bg-secondary w-xs rounded-l-2xl"></div>
                    <div className="bg-accent max-w-full rounded-r-2xl px-12 py-16" >
                        <h2 className="text-2xl font-bold">Create New Project</h2>
                        <p className="py-2 text-xs text-muted-foreground leading-[1rem]">Start by defining your project details, setting goals, and assigning tasks to the right experts.</p>
                        <form action="" className="flex flex-col space-y-2" >
                            <label className="mt-4" htmlFor="title">Title</label>
                            <input
                                type="text"
                                name="title"
                                id="title"
                                placeholder="Project title"
                                className=" w-full bg-input px-4 py-2 rounded-full"
                            />
                            <label className="mt-4" htmlFor="startDate">Start date</label>
                            <input
                                type="date"
                                name="startDate"
                                id="startDate"
                                className=" w-full bg-input px-4 py-2 rounded-full"
                            /> 
                            <label className="mt-4" htmlFor="dueDate">Due date</label>
                            <input
                                type="date"
                                name="dueDate"
                                id="dueDate"
                                className=" w-full bg-input px-4 py-2 rounded-full"
                            />
                            <span className="flex gap-2 mt-4 w-full">
                                <ComboBox />
                                <ComboBox />
                            </span>                         
                            <label className="flex items-center gap-2 mt-4" htmlFor="description">
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
                                className=" w-full bg-input px-4 py-2 rounded-[6px]"
                                // className=" w-full border px-4 py-2 rounded-[6px]"
                            />

                            <label htmlFor="file" className="flex items-center gap-2 pt-2"><PaperclipIcon size={16}/> Upload files</label>
                            <input type="file" multiple name="file" id="file" className="file:mr-4 file:px-4 file:py-2 file:bg-primary file:text-sm file:text-accent file:rounded-full"/>
                            

                            <span className="flex items-center justify-between mt-4">
                                <Link to="" className="flex items-center text-accent-3 font-medium">
                                    Find allocats <ChevronRightIcon size={20} className="font-bold" />
                                </Link>
                                <Button className="rounded-full">Post project</Button>
                            </span>                        
                        </form>
                    </div>
                </div>
            </section>
        </main>
        </>
    );

}
export default CreateProject;