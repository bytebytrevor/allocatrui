import AnimatedHeading from "@/components/AnimatedHeading";
import AnimatedText from "@/components/AnimatedText";
import HomeHeader from "@/components/HeroMain";
import assets from "@/assets/assets";
import { Button } from "@/components/ui/button";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import AnimatedIconScale from "@/components/AnimatedIconScale";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

function LandingPage() {

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
            <main className="mx-auto">
                <div className="container mx-auto">
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
                     <section className="flex items-center justify-between mx-h-screen w-full mt-40">                        
                        <article>
                                <span className="flex items-center">
                                    <img src={assets.allocatrIcon} alt="allocatr cat icon" className="w-16"/>
                                    <h2 className="text-lg font-bold py-12 pl-4">Lost time is so last season</h2>
                                </span>
                                
                                <h3 className="text-6xl font-black max-w-4xl uppercase">We line up skilled pros so fast you’ll think time’s on your  side</h3>
                                <Button className="h-12 text-xs my-12 px-16">Post a job</Button>
                        </article>
                        <Accordion type="single" collapsible className="">
                            <AccordionItem value="item-1">
                                <AccordionTrigger className="text-lg">Certified and experienced</AccordionTrigger>
                                <AccordionContent>
                                    Allocats bring qualifications and years of experience, and unmatched expertise.
                                    {/* <Button variant="link" className="my-4 text-[#DEDA00]">How to become an allocat </Button> */}
                                    <Button className="my-4">How to become an allocat </Button>
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="item-2">
                                <AccordionTrigger className="text-lg">Specialized experts</AccordionTrigger>
                                <AccordionContent>
                                    Yes. It adheres to the WAI-ARIA design pattern.
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="item-3">
                                <AccordionTrigger className="text-lg">Reliable and trustworthy</AccordionTrigger>
                                <AccordionContent>
                                    Yes. It adheres to the WAI-ARIA design pattern.
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="item-4">
                                <AccordionTrigger className="text-lg">Efficient and cost effective</AccordionTrigger>
                                <AccordionContent>
                                    Yes. It adheres to the WAI-ARIA design pattern.
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>                        
                    </section>
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
                </div>
               

                <div className="container mx-auto">
                    <section className="flex gap-12 items-center">
                        <article className="max-w-lg">
                            <AnimatedHeading heading="Project Management Tools"/>
                            <AnimatedText
                                delay={0.4}
                                text="Powerful tools to simplify your project management, giving you seamless collaboration and streamlined workflows to keep everything organized."
                            />
                            <Button className="h-12 text-xs my-12 px-16">Learn more</Button>
                        </article>
                        <div className="w-full">
                            <img src={assets.computerPhone} alt="laptop"  />
                        </div>
                    </section>
                </div>
                        
                <section className="container mx-auto">
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
                            text="Whether it's a quick fix or a major project, every task matters. From simple jobs to complex endeavors, allocatr is the right place to connect with skilled professionals."
                        />
                        {/* <Button className="bg-foreground text-xs  my-12 px-16">Post a job</Button> */}
                    </article>
                </section>

                <div className="bg-white text-[#151515] mt-24 rounded-t-[120px] ">
                    <section className="py-40">
                        <article className="container mx-auto">
                            <AnimatedHeading heading="Project Management Tools"/>
                            <AnimatedText
                                delay={0.4}
                                text="Powerful tools to simplify your project management, giving you seamless collaboration and streamlined workflows to keep everything organized."
                            />
                        </article>

                        <section className=" flex my-24">
                            <div className="flex px-4">
                                <div className="h-120 w-60 text-white bg-red-500 p-8 rounded-l-4xl">
                                    <h3 className="text-4xl font-bold">24+</h3>
                                    Lorem ipsum dolor, sit amet consectetur adipisicing
                                </div>
                                <div className={`h-120 w-60 bg-[url(src/assets/delivery-square.svg)] bg-no-repeat bg-cover bg-center p-8 rounded-r-4xl`}>
                                  
                                </div>
                            </div>
                            <div className="flex px-4">
                                <div className="h-120 w-60 text-white bg-[#38D200] p-8 rounded-l-4xl">
                                    <h3 className="text-4xl font-bold">100+</h3>
                                    Lorem ipsum dolor, sit amet consectetur adipisicing
                                </div>
                                <div className={`h-120 w-60 bg-[url(src/assets/painting-square.svg)] bg-no-repeat bg-cover bg-center p-8 rounded-r-4xl`}>
                                  
                                </div>
                            </div>
                        </section>
                    </section>
                </div>
            </main>
        </>
    );
}

export default LandingPage;