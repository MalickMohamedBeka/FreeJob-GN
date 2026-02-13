import { motion } from "framer-motion";
import { Clock, Coins, Users, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import AfricanAvatar from "@/components/ui/AfricanAvatar";
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
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      className="relative group cursor-pointer"
    >
      <div className="relative glass rounded-3xl border-2 border-white/30 p-8 shadow-elevation-4 overflow-hidden transition-all duration-300 hover:shadow-[0_30px_60px_rgba(0,0,0,0.3),0_15px_30px_rgba(255,122,61,0.2)] hover:-translate-y-1">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <Badge
            variant="secondary"
            className="bg-primary text-primary-foreground border-0 shadow-elevation-2 px-4 py-1.5"
          >
            {project.status === "open" ? "Ouvert" : "En cours"}
          </Badge>
          <span className="text-xs text-muted-foreground font-medium">{project.postedAt}</span>
        </div>

        {/* Title */}
        <h3 className="text-2xl font-bold mb-3 line-clamp-2 group-hover:text-primary transition-colors">
          {project.title}
        </h3>

        <p className="text-muted-foreground mb-6 line-clamp-3 leading-relaxed">
          {project.description}
        </p>

        {/* Skills */}
        <div className="flex flex-wrap gap-2 mb-6">
          {project.skills.map((skill) => (
            <span
              key={skill}
              className="px-4 py-2 rounded-full glass-dark text-white text-sm font-medium shadow-elevation-2"
            >
              {skill}
            </span>
          ))}
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="flex items-center gap-2 glass rounded-xl p-3">
            <div className="w-10 h-10 rounded-lg bg-primary items-center justify-center shadow-elevation-2">
              <Coins size={18} className="text-white" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Budget</p>
              <p className="text-sm font-bold">
                {project.budget.min.toLocaleString()}-{project.budget.max.toLocaleString()} GNF
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 glass rounded-xl p-3">
            <div className="w-10 h-10 rounded-lg bg-primary items-center justify-center shadow-elevation-2">
              <Clock size={18} className="text-white" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Dur&eacute;e</p>
              <p className="text-sm font-bold">{project.duration}</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-6 border-t border-white/20">
          <div className="flex items-center gap-3">
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
          </div>

          <Button
            size="sm"
            className="bg-primary text-white shadow-elevation-3 hover:shadow-elevation-4 border-0 gap-2"
          >
            Postuler
            <ArrowRight size={16} />
          </Button>
        </div>
      </div>
    </motion.div>
  );
});

ProjectCard3D.displayName = 'ProjectCard3D';

export default ProjectCard3D;
