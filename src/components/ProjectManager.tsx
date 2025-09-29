import { Link } from "react-router-dom";
import { ListTodoIcon } from "lucide-react";
import ComboBox from "./ComboBox";
import { Button } from "./ui/button";



function ProjectManager() {
    return (
        <div className="w-full px-12">
            <section className="flex justify-between">
                <div className="flex flex-col space-y-4">
                    <span className="font-light">Select job</span>
                    <ComboBox />
                    <h2 className="text-2xl font-bold"><span className="font-light">P06J</span> Braids Installation</h2>
                </div>
                <div>
                    <Link to="" className="font-medium">+ Add new job</Link>
                </div>
            </section>
            
            <section>
                <section className="flex flex-col mt-8 h-60 max-h-full min-w-86 max-w-96 bg-[#202020] rounded-[6px] p-4">
                    <h3 className="font-semibold">Completed</h3>               

                    <div className="h-full flex flex-1 gap-x-4 items-center justify-center text-[#A4A4A4]">
                        <ListTodoIcon />
                        <small className="flex flex-col">
                            No completed task yet
                            <Link className="text-[#00B1EA]" to="">+ Click here to add</Link>
                        </small>
                    </div>                
                </section>
            </section>
        </div>
    )
}

export default ProjectManager;