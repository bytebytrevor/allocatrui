import AnimatedHeading from "@/components/AnimatedHeading";
import AnimatedText from "@/components/AnimatedText";
import HomeHeader from "@/components/HomeHeader";
import assets from "@/assets/assets";
import { Button } from "@/components/ui/button";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import AnimatedIconScale from "@/components/AnimatedIconScale";

function Home() {

    const { scrollYProgress } = useScroll();
    const scaleX = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    const scale = useTransform(scaleX, [0, 1], [0.8, 1]);

    return (    
        <>    
        <HomeHeader />
            <main className="container mx-auto">
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
                    <AnimatedHeading heading="An allocat is not your typical feline" delay={0.0}/>
                    <AnimatedText
                        delay={0.2}
                        text='This sleek and skilled creature is a seasoned expert, drawing on years of experience to take on each task with finesse. Allocats are the go-to pros on allocatr, springing into action faster than you can say "catnap"!'
                    />
                    <AnimatedText
                        delay={0.4}
                        text="They're agile, reliable, and anything but lazy, unless you count the occasional victory stretch after a job well done."
                    />
                </article>

                <motion.section style={{ scale }} className="flex h-full  w-full h-200 mt-40">
                    <article className="w-[50%] p-12 bg-[#151515] border-b-12 rounded-l-4xl">
                        <span className="flex items-center">
                            <img src={assets.allocatrIcon} alt="allocatr cat icon" className="w-16"/>
                            <h2 className="text-lg font-bold py-12 pl-4 justify-center">Lost time is so last season</h2>
                        </span>
                        
                        <h3 className="text-6xl font-black min-w-xl uppercase tracking-wide">We line up skilled pros so fast you’ll think time’s on your  side</h3>
                        <Button className="rounded-full my-12 bg-[#DEDA00] w-[200px] text-[#033D4F]">Post a job</Button>
                    </article>
                    <div className="w-full p-12 bg-[#033D4F] bg-[#DEDA00] border-b-12 rounded-r-4xl">

                    </div>
                </motion.section>

                <section className="flex items-start justify-between mt-36 my-40">
                    <span className="max-w-80">
                        <AnimatedIconScale delay={0.0} imageSrc={assets.crossShapeIcon} imageAlt="Cross icon" />
                        <h2 className="text-4xl font-bold uppercase">Objective</h2>
                        <p>Sdipisicing elit. Ad, autem, voluptatum nobis!Lorem ipsum dolor.</p>
                    </span>
                    <span className="max-w-80">
                        <AnimatedIconScale delay={0.2} imageSrc={assets.lShapeIcon} imageAlt="Cross icon" />
                        <h2 className="text-4xl font-bold uppercase">Objective</h2>
                        <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ad, autem, voluptatum nobis!</p>                        
                    </span>
                    <span className="max-w-80">
                        <AnimatedIconScale delay={0.4}imageSrc={assets.rhombusIcon} imageAlt="Cross icon" />
                        <h2 className="text-4xl font-bold uppercase">Objective</h2>
                        <p>Lorem ipsum dolor sit, adipisicing elit. Ad, autem, voluptatum nobis!</p>
                    </span>
                </section>

                <section className="flex gap-12 items-center">
                    <article className="max-w-lg">
                        <AnimatedHeading heading="Project Management Tools"/>
                        <AnimatedText
                            delay={0.4}
                            text="Powerful tools to simplify your project management, giving you seamless collaboration and streamlined workflows to keep everything organized."
                        />
                        <Button className="rounded-full my-12 bg-[#DEDA00] w-[200px] text-[#033D4F]">Post a job</Button>
                    </article>
                    <div className="w-full">
                        <img src={assets.computerPhone} alt="laptop"  />
                    </div>
                    
                </section>
                <article className="mt-40">
                    <motion.h3
                        className="text-6xl font-semibold max-w-4xl"
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4, duration: 0.8, ease: "easeInOut"}}
                    >
                        No job is too small or too big
                    </motion.h3>
                    <AnimatedText
                        delay={0.6}
                        text="Whether it’s a quick fix or a major project, every task matters. From simple jobs to complex endeavors, allocatr is the right place to connect with skilled professionals."
                    />
                    <Button variant="outline" className="rounded-full my-12 w-[200px]">Post a job</Button>

                </article>

            </main>
        </>
    );
}

export default Home;