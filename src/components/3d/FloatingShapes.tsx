import { motion } from "framer-motion";

interface FloatingShapesProps {
  density?: "low" | "medium" | "high";
}

const FloatingShapes = ({ density = "medium" }: FloatingShapesProps) => {
  const shapeCount = density === "low" ? 3 : density === "medium" ? 5 : 8;

  const shapes = [
    { type: "circle", size: "w-32 h-32", color: "bg-primary/10" },
    { type: "square", size: "w-24 h-24", color: "bg-secondary/10" },
    { type: "triangle", size: "w-28 h-28", color: "bg-warning/10" },
    { type: "hexagon", size: "w-36 h-36", color: "bg-success/10" },
    { type: "circle", size: "w-20 h-20", color: "bg-primary/15" },
    { type: "square", size: "w-40 h-40", color: "bg-secondary/8" },
    { type: "circle", size: "w-16 h-16", color: "bg-warning/12" },
    { type: "square", size: "w-28 h-28", color: "bg-success/10" },
  ];

  const positions = [
    { top: "10%", left: "5%", delay: 0 },
    { top: "20%", right: "10%", delay: 1 },
    { bottom: "15%", left: "8%", delay: 2 },
    { top: "60%", right: "5%", delay: 1.5 },
    { top: "40%", left: "15%", delay: 0.5 },
    { bottom: "30%", right: "15%", delay: 2.5 },
    { top: "75%", left: "20%", delay: 1.8 },
    { top: "30%", right: "25%", delay: 0.8 },
  ];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {shapes.slice(0, shapeCount).map((shape, index) => (
        <motion.div
          key={index}
          className={`absolute ${shape.size} ${shape.color} blur-2xl`}
          style={{
            ...positions[index],
            borderRadius: shape.type === "circle" ? "50%" : shape.type === "square" ? "20%" : "0",
            clipPath: shape.type === "triangle" ? "polygon(50% 0%, 0% 100%, 100% 100%)" : undefined,
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, 15, 0],
            rotate: [0, 180, 360],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 15 + index * 2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: positions[index].delay,
          }}
        />
      ))}
    </div>
  );
};

export default FloatingShapes;
