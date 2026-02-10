import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Clock, Coins, Users, ArrowRight, Briefcase } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import AfricanAvatar from "@/components/ui/AfricanAvatar";
import { useState, memo } from "react";

interface ProjectCard3DProps {
  project: {
    id: string;
    title: string;
    description: string;
    skills: string[];
    budget: { min: number; max: number };
    duration: string;
    status: string;
    postedAt: string;
    client: { name: string };
    proposalsCount: number;
  };
  index: number;
}

const ProjectCard3D = memo(({ project, index }: ProjectCard3DProps) => {
  const [isHovered, setIsHovered] = useState(false);
  
  // Mouse position tracking for 3D effect
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["15deg", "-15deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-15deg", "15deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    setIsHovered(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, rotateX: -20, scale: 0.9 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0, scale: 1 }}
      viewport={{ once: true }}
      transition={{ 
        duration: 0.6, 
        delay: index * 0.1,
        type: "spring",
        stiffness: 100
      }}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      className="relative group cursor-pointer"
    >
      {/* 3D Card Container */}
      <motion.div
        className="relative glass rounded-3xl border-2 border-white/30 p-8 shadow-elevation-4 overflow-hidden"
        animate={{
          boxShadow: isHovered 
            ? "0 30px 60px rgba(0, 0, 0, 0.3), 0 15px 30px rgba(255, 122, 61, 0.2)"
            : "0 12px 32px rgba(0, 0, 0, 0.15), 0 6px 16px rgba(0, 0, 0, 0.1)"
        }}
        transition={{ duration: 0.3 }}
      >
        {/* Animated Background Gradient */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-primary/20 via-secondary/10 to-transparent opacity-0 group-hover:opacity-100 blur-2xl"
          animate={{
            scale: isHovered ? 1.5 : 1,
            rotate: isHovered ? 180 : 0,
          }}
          transition={{ duration: 0.8 }}
        />

        {/* Floating Particles - Reduced from 6 to 3 for performance */}
        {isHovered && (
          <>
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 rounded-full bg-gradient-hero"
                initial={{ 
                  x: Math.random() * 100 - 50, 
                  y: Math.random() * 100 - 50,
                  opacity: 0 
                }}
                animate={{ 
                  x: Math.random() * 200 - 100,
                  y: Math.random() * 200 - 100,
                  opacity: [0, 1, 0],
                  scale: [0, 1.5, 0]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.3
                }}
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
              />
            ))}
          </>
        )}

        {/* Content with 3D Layers */}
        <div className="relative" style={{ transform: "translateZ(50px)" }}>
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <motion.div
              animate={{ scale: isHovered ? 1.1 : 1 }}
              transition={{ duration: 0.3 }}
            >
              <Badge 
                variant="secondary" 
                className="bg-gradient-hero text-primary-foreground border-0 shadow-elevation-2 px-4 py-1.5"
              >
                {project.status === "open" ? "🔥 Ouvert" : "⚡ En cours"}
              </Badge>
            </motion.div>
            <span className="text-xs text-muted-foreground font-medium">{project.postedAt}</span>
          </div>

          {/* Title with 3D Effect */}
          <motion.h3 
            className="text-2xl font-bold mb-3 line-clamp-2 group-hover:text-gradient-hero transition-all"
            style={{ transform: "translateZ(30px)" }}
            animate={{ 
              y: isHovered ? -5 : 0,
            }}
          >
            {project.title}
          </motion.h3>

          <motion.p 
            className="text-muted-foreground mb-6 line-clamp-3 leading-relaxed"
            style={{ transform: "translateZ(20px)" }}
          >
            {project.description}
          </motion.p>

          {/* Skills with 3D Pills */}
          <div className="flex flex-wrap gap-2 mb-6" style={{ transform: "translateZ(25px)" }}>
            {project.skills.map((skill, i) => (
              <motion.span
                key={skill}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 + i * 0.05 }}
                whileHover={{ 
                  scale: 1.15, 
                  y: -5,
                  rotateZ: 5,
                  transition: { duration: 0.2 }
                }}
                className="px-4 py-2 rounded-full glass-dark text-white text-sm font-medium shadow-elevation-2 cursor-pointer"
              >
                {skill}
              </motion.span>
            ))}
          </div>

          {/* Info Grid with Icons */}
          <div className="grid grid-cols-2 gap-4 mb-6" style={{ transform: "translateZ(15px)" }}>
            <motion.div 
              className="flex items-center gap-2 glass rounded-xl p-3"
              whileHover={{ scale: 1.05, x: 5 }}
            >
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-success to-primary flex items-center justify-center shadow-elevation-2">
                <Coins size={18} className="text-white" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Budget</p>
                <p className="text-sm font-bold">
                  {project.budget.min.toLocaleString()}-{project.budget.max.toLocaleString()} GNF
                </p>
              </div>
            </motion.div>

            <motion.div 
              className="flex items-center gap-2 glass rounded-xl p-3"
              whileHover={{ scale: 1.05, x: 5 }}
            >
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-warning to-secondary flex items-center justify-center shadow-elevation-2">
                <Clock size={18} className="text-white" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Durée</p>
                <p className="text-sm font-bold">{project.duration}</p>
              </div>
            </motion.div>
          </div>

          {/* Footer with Client & CTA */}
          <div 
            className="flex items-center justify-between pt-6 border-t border-white/20"
            style={{ transform: "translateZ(40px)" }}
          >
            <motion.div 
              className="flex items-center gap-3"
              whileHover={{ x: 5 }}
            >
              <AfricanAvatar 
                name={project.client.name}
                size="md"
                showBadge
                animate
              />
              <div>
                <p className="font-semibold text-sm">{project.client.name}</p>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <Users size={12} />
                  {project.proposalsCount} propositions
                </p>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.1, x: 5 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                size="sm" 
                className="bg-gradient-hero text-white shadow-elevation-3 hover:shadow-elevation-4 border-0 gap-2"
              >
                Postuler
                <ArrowRight size={16} />
              </Button>
            </motion.div>
          </div>
        </div>

        {/* 3D Corner Accent */}
        <motion.div
          className="absolute top-0 right-0 w-32 h-32 bg-gradient-hero opacity-20 blur-3xl rounded-full"
          animate={{
            scale: isHovered ? 1.5 : 1,
            opacity: isHovered ? 0.3 : 0.2,
          }}
          transition={{ duration: 0.5 }}
        />

        {/* Bottom Glow */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-hero"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        />
      </motion.div>

      {/* 3D Shadow Layer */}
      <motion.div
        className="absolute inset-0 bg-gradient-hero opacity-10 blur-2xl rounded-3xl -z-10"
        animate={{
          scale: isHovered ? 1.1 : 0.95,
          y: isHovered ? 10 : 5,
        }}
        transition={{ duration: 0.3 }}
      />
    </motion.div>
  );
});

ProjectCard3D.displayName = 'ProjectCard3D';

export default ProjectCard3D;
