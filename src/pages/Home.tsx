import AnimatedHeading from "@/components/AnimatedHeading";
import AnimatedText from "@/components/AnimatedText";
import HomeHeader from "@/components/HomeHeader";

function Home() {
    return (    
        <>    
        <HomeHeader />
            <main className="container mx-auto px-4">
                {/* Add 3 key allocatr objectives here */}
                <section className="flex items-start justify-between mt-36 my-40">
                    <span className="max-w-80">
                        <h2 className="text-4xl font-bold uppercase">Objective</h2>
                        <p>Sdipisicing elit. Ad, autem, voluptatum nobis!Lorem ipsum dolor.</p>
                    </span>
                    <span className="max-w-80">
                        <h2 className="text-4xl font-bold uppercase">Objective</h2>
                        <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ad, autem, voluptatum nobis!</p>
                    </span>
                    <span className="max-w-80">
                        <h2 className="text-4xl font-bold uppercase">Objective</h2>
                        <p>Lorem ipsum dolor sit, adipisicing elit. Ad, autem, voluptatum nobis!</p>
                    </span>

                </section>

                
                <article>
                    <AnimatedHeading heading="An allocat is not your typical feline"/>
                    <AnimatedText
                        delay={0.4}
                        text='This sleek and skilled creature is a seasoned expert, drawing on years of experience to take on each task with finesse. Allocats are the go-to pros on allocatr, springing into action faster than you can say "catnap"!'
                    />
                    <AnimatedText
                        text="They're agile, reliable, and anything but lazy, unless you count the occasional victory stretch after a job well done."
                    />
                </article>

            </main>
        </>
    );
}

export default Home;