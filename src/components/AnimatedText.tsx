import { motion } from "framer-motion";

type Props = {
    text: string;
    delay?: number;
    duration?: number;
}

function AnimatedText({ text, delay=0.6, duration=0.8 }: Props) {
    return (
        <motion.p
            className="max-w-xl text-xl py-4"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: delay, duration: duration, ease: "easeInOut"}}
        >
            {text}
        </motion.p>
    )
}

export default AnimatedText;