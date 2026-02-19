import { motion } from "framer-motion";
import { Clock, Coins, Users, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { memo } from "react";

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
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.4, ease: "easeOut", delay: (index % 3) * 0.08 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="bg-white rounded-xl border border-border hover:shadow-md transition-shadow p-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <Badge
          className={`text-white border-0 ${
            project.status === "open" ? "bg-secondary" : "bg-primary"
          }`}
        >
          {project.status === "open" ? "Ouvert" : "En cours"}
        </Badge>
        <span className="text-xs text-muted-foreground">{project.postedAt}</span>
      </div>

      {/* Title */}
      <h3 className="text-lg font-bold mb-2 line-clamp-2 hover:text-primary transition-colors">
        {project.title}
      </h3>

      <p className="text-muted-foreground text-sm mb-4 line-clamp-3 leading-relaxed">
        {project.description}
      </p>

      {/* Skills */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        {project.skills.map((skill) => (
          <span
            key={skill}
            className="px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium"
          >
            {skill}
          </span>
        ))}
      </div>

      {/* Info */}
      <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Coins size={14} className="text-secondary shrink-0" />
          <span className="font-medium text-foreground text-xs">
            {project.budget.min.toLocaleString()} GNF
          </span>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <Clock size={14} className="text-secondary shrink-0" />
          <span className="text-xs">{project.duration}</span>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-border">
        <div>
          <p className="text-sm font-medium">{project.client.name}</p>
          <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
            <Users size={11} />
            {project.proposalsCount} propositions
          </p>
        </div>

        <Button size="sm" className="gap-1.5">
          Postuler
          <ArrowRight size={14} />
        </Button>
      </div>
    </motion.div>
  );
});

ProjectCard3D.displayName = "ProjectCard3D";

export default ProjectCard3D;
