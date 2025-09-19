import HomeHeader from "@/components/HomeHeader";

function Home() {
    return (    
        <>    
        <HomeHeader />
            <main className="container mx-auto">
                {/* Add 3 key allocatr objectives here */}
                <section className="flex items-center justify-between my-24">
                    <span>Objective</span>
                    <span>Objective</span>
                    <span>Objective</span>

                </section>

                
                <article className="">
                    <h2 className="text-8xl font-bold uppercase max-w-6xl">An allocat is not your typical feline</h2>
                    <p className="max-w-2xl text-2xl py-8">
                        This sleek and skilled creature is a seasoned expert, drawing on years of experience to take on each task with finesse. Allocats are the go-to pros on allocatr, springing into action faster than you can say "catnap"! They're agile, reliable, and anything but lazy—unless you count the occasional victory stretch after a job well done.
                    </p>
                </article>

            </main>
        </>
    );
}

export default Home;