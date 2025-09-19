import { motion } from "framer-motion";

type Props = {
    heading: string;
    delay?: number;
    duration?: number;
}

function AnimatedHeading({ heading, delay=0.2, duration=0.8  }: Props) {
    return (
        <motion.h2
            className="text-8xl font-black uppercase max-w-6xl"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: delay, duration: duration, ease: "easeInOut"}}
        >
            {heading}
        </motion.h2>
    )
}

export default AnimatedHeading;