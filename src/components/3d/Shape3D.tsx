import { motion } from "framer-motion";
import { ReactNode } from "react";

interface Shape3DProps {
  type: "cube" | "sphere" | "pyramid" | "cylinder";
  size?: "sm" | "md" | "lg" | "xl";
  color?: string;
  className?: string;
  children?: ReactNode;
  animate?: boolean;
}

const Shape3D = ({ 
  type, 
  size = "md", 
  color = "bg-gradient-hero", 
  className = "",
  children,
  animate = true 
}: Shape3DProps) => {
  const sizeClasses = {
    sm: "w-16 h-16",
    md: "w-24 h-24",
    lg: "w-32 h-32",
    xl: "w-48 h-48",
  };

  const baseAnimation = animate ? {
    rotateX: [0, 360],
    rotateY: [0, 360],
    scale: [1, 1.1, 1],
  } : {};

  const renderShape = () => {
    switch (type) {
      case "cube":
        return (
          <motion.div
            className={`${sizeClasses[size]} ${color} rounded-2xl shadow-elevation-4 ${className}`}
            animate={baseAnimation}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            style={{ transformStyle: "preserve-3d" }}
            whileHover={{ scale: 1.2, rotateZ: 45 }}
          >
            <div className="w-full h-full flex items-center justify-center text-white font-bold">
              {children}
            </div>
          </motion.div>
        );

      case "sphere":
        return (
          <motion.div
            className={`${sizeClasses[size]} ${color} rounded-full shadow-elevation-4 ${className}`}
            animate={animate ? { 
              y: [0, -20, 0],
              scale: [1, 1.15, 1],
            } : {}}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            whileHover={{ scale: 1.3 }}
          >
            <div className="w-full h-full flex items-center justify-center text-white font-bold">
              {children}
            </div>
          </motion.div>
        );

      case "pyramid":
        return (
          <motion.div
            className={`${sizeClasses[size]} relative ${className}`}
            animate={baseAnimation}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            style={{ transformStyle: "preserve-3d" }}
            whileHover={{ scale: 1.2, rotateZ: 180 }}
          >
            <div 
              className={`w-full h-full ${color} shadow-elevation-4`}
              style={{ clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)" }}
            >
              <div className="w-full h-full flex items-center justify-center text-white font-bold pt-12">
                {children}
              </div>
            </div>
          </motion.div>
        );

      case "cylinder":
        return (
          <motion.div
            className={`${sizeClasses[size]} ${color} rounded-full shadow-elevation-4 ${className}`}
            animate={animate ? { 
              rotateY: [0, 360],
              scaleX: [1, 0.8, 1],
            } : {}}
            transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
            style={{ transformStyle: "preserve-3d" }}
            whileHover={{ scale: 1.2 }}
          >
            <div className="w-full h-full flex items-center justify-center text-white font-bold">
              {children}
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return renderShape();
};

export default Shape3D;
