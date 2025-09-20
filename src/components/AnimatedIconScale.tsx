import { motion } from "framer-motion";

type Props = {
    imageSrc: string;
    imageAlt: string;
    delay?: number;
    duration?: number;
}

function AnimatedIconScale({ imageSrc, imageAlt, delay=0.2, duration=0.8  }: Props) {
    return (
        <motion.img
            src={imageSrc}
            alt={imageAlt}
            className="mb-8 py-8 w-54"
            initial={{ opacity: 0, scale: .5, x: -50 }}
            whileInView={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ delay: delay, duration: duration, ease: "easeInOut"}}
        />
    )
}

export default AnimatedIconScale;