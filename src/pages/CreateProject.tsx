import ComboBox from "@/components/ComboBox";
import { Button } from "@/components/ui/button";
import { ChevronRightIcon } from "lucide-react";
import { Link } from "react-router-dom";

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
                <div className="new-project-bg bg-secondary w-xs rounded-l-2xl">
                    
                    {/* <img src="/src/assets/smiley-cat.svg" alt="" />
                    <h2 className="text-4xl font-black p-12">
                        Let's create a project
                    </h2> */}


                </div>
                <div className="bg-accent max-w-full rounded-r-2xl px-12 py-16" >
                    <h2 className="text-2xl font-bold uppercase">Create new project</h2>
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
                         <label className="mt-4" htmlFor="dueDate">Due date</label>
                        <input
                            type="date"
                            name="dueDate"
                            id="dueDate"
                            placeholder="Project title"
                            className=" w-full bg-input px-4 py-2 rounded-full"
                        />
                        <span className="flex gap-2 mt-4 w-full">
                            <ComboBox />
                            <ComboBox />
                        </span>                         
                        <label className="mt-4" htmlFor="description">Description</label>                        
                        <textarea
                            rows={4}
                            name="description"
                            id="description"
                            placeholder="Tell us more about your project"
                            // className=" w-full bg-input px-4 py-2 rounded-[6px]"
                            className=" w-full border px-4 py-2 rounded-[6px]"
                        />
                        

                        <span className="flex items-center justify-between mt-4">
                            <Link to="" className="flex items-center text-accent-3 font-medium">
                                Find allocats <ChevronRightIcon size={20} className="font-bold" />
                            </Link>
                            {/* <Button className="rounded-full border-1 border-muted-foreground bg-transparent text-white">Post project</Button> */}
                            {/* <Button className="rounded-full bg-white text-background">Post project</Button> */}
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