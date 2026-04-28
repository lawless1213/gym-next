import { motion } from "framer-motion";

export default function SkeletonBone({ width = "100%", height = 14, circle = false, br = 6 }) {
  return (
    <motion.div
      style={{
        width,
        height,
        borderRadius: circle ? "50%" : br,
        background: "var(--color-secondary)",
        overflow: "hidden",
        position: "relative",
      }}
    >
      <motion.div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(90deg, transparent, var(--sk-shimmer), transparent)",
       
        }}
        animate={{ x: ["-100%", "200%"] }}
        transition={{
          duration: 1.4,
          repeat: Infinity,
          ease: "linear",
        }}
      />
    </motion.div>
  );
}