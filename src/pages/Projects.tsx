import DashboardMainNav from "@/components/DashboardMainNav";
function Projects() {
    return (
        <>
            <header className="px-4 py-2 border">
                <DashboardMainNav />
            </header>
            <main className="container flex-col my-8 mx-auto">
                <section>
                    <div>
                        <h1 className="font-bold my-4">Hi Thelly!</h1>
                        <form action="">
                            <input
                                type="text"
                                name="searchProject"
                                id="searchProject"
                                placeholder="Search project..."
                                className="search w-full rounded-full"
                            />
                        </form>
                    </div>

                </section>
            </main>
        </>
    )
}

export default Projects;