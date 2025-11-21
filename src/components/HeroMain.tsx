import MainNav from "./MainNav";
import { Button } from "./ui/button";
import { motion } from "framer-motion";

function HeroMain() {
    return (
        <header className="min-h-screen bg-accent rounded-b-[120px] pb-20 border-b-12">
            <div className="container mx-auto">
                <MainNav />
            </div>
            <div className="container flex items-center justify-between px-4 mx-auto">
                <div>
                    <motion.h1
                        className="text-9xl text-secondary-foreground; font-black uppercase leading-28 mt-24 max-w-200"
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2, duration: 0.8, ease: "easeInOut"}}
                    >
                        Allocatr for your every task
                    </motion.h1>
                    <motion.p
                        className="text-2xl py-12 max-w-150"
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.6, duration: 0.8, ease: "easeInOut"}}
                    >
                        Allocatr connects you with skilled experts and professionals for tasks of any size.
                    </motion.p>
                    <div>
                        <Button className="text-xs rounded-full mr-4 w-36">Find allocats</Button>
                    </div>
                </div>
                <div className="rounded-lg">

                </div>
            </div>
        </header>
    );
}

export default HeroMain;