import DashboardMainNav from "@/components/DashboardMainNav";

function CreateProject() {
    return (
        <>
        <header className="border-b">
            <DashboardMainNav />
        </header>
        <main className=" flex items-center justify-center ">
            <section className="flex mt-16 max-w-5xl">
                <div className="bg-secondary w-[50%] rounded-l-4xl">
                    <h2 className="text-8xl font-black p-12">
                        Let's create a project
                    </h2>


                </div>
                <div className="bg-accent w-[50%] rounded-r-4xl">
                    <form action="" className="flex flex-col space-y-2 my-12 px-12" >
                        <label htmlFor="projectTitle">Title</label>
                        <input
                            type="text"
                            name="projectTitle"
                            id="projectTitle"
                            placeholder="Project title"
                            className=" w-full border px-4 py-2 rounded-full"
                        />
                        <label htmlFor="projectTitle">Other</label>
                        <input
                            type="text"
                            name="projectTitle"
                            id="projectTitle"
                            placeholder="Project title"
                            className=" w-full border px-4 py-2 rounded-full"
                        />
                    </form>
                </div>
                

            </section>
        </main>
        </>
    );

}
export default CreateProject;