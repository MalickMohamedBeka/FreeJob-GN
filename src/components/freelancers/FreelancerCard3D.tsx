import { motion } from "framer-motion";
import { Star, MapPin, Briefcase, MessageCircle, TrendingUp, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, memo } from "react";

interface FreelancerCard3DProps {
  freelancer: {
    id: string;
    name: string;
    title: string;
    skills: string[];
    rating: number;
    reviewsCount: number;
    hourlyRate: number;
    location: string;
    available: boolean;
    completedProjects?: number;
  };
  index: number;
}

function getInitials(name: string) {
  return name.split(" ").slice(0, 2).map((w) => w[0]?.toUpperCase() ?? "").join("");
}

const FreelancerCard3D = memo(({ freelancer, index }: FreelancerCard3DProps) => {
  const [isLiked, setIsLiked] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.4, ease: "easeOut", delay: (index % 3) * 0.08 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="bg-white rounded-xl border border-border hover:shadow-md transition-shadow overflow-hidden"
    >
      {/* Header */}
      <div className="relative bg-primary/5 pt-8 pb-12">
        <button
          onClick={() => setIsLiked(!isLiked)}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white border border-border flex items-center justify-center hover:bg-muted transition-colors"
        >
          <Heart
            size={14}
            className={isLiked ? "fill-red-500 text-red-500" : "text-muted-foreground"}
          />
        </button>

        {freelancer.available && (
          <div className="absolute top-3 left-3">
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-success/10 text-success text-xs font-medium border border-success/20">
              <span className="w-1.5 h-1.5 rounded-full bg-success" />
              Disponible
            </span>
          </div>
        )}
      </div>

      {/* Avatar */}
      <div className="flex justify-center -mt-8 mb-3">
        <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-white font-bold text-lg border-4 border-white shadow-sm">
          {getInitials(freelancer.name)}
        </div>
      </div>

      {/* Info */}
      <div className="px-5 pb-5 text-center">
        <h3 className="font-bold text-lg mb-0.5">{freelancer.name}</h3>
        <p className="text-muted-foreground text-sm mb-3">{freelancer.title}</p>

        {/* Rating & Location */}
        <div className="flex items-center justify-center gap-4 mb-4 text-sm">
          <div className="flex items-center gap-1">
            <Star size={13} className="fill-warning text-warning" />
            <span className="font-semibold">{freelancer.rating}</span>
            <span className="text-muted-foreground">({freelancer.reviewsCount})</span>
          </div>
          {freelancer.location && (
            <div className="flex items-center gap-1 text-muted-foreground">
              <MapPin size={13} />
              <span>{freelancer.location}</span>
            </div>
          )}
        </div>

        {/* Skills */}
        <div className="flex flex-wrap justify-center gap-1.5 mb-4">
          {freelancer.skills.slice(0, 4).map((skill) => (
            <span
              key={skill}
              className="px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium"
            >
              {skill}
            </span>
          ))}
          {freelancer.skills.length > 4 && (
            <span className="px-2.5 py-1 rounded-full bg-muted text-muted-foreground text-xs">
              +{freelancer.skills.length - 4}
            </span>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-2 mb-4 text-sm">
          <div className="flex items-center gap-1.5 text-muted-foreground bg-muted/50 rounded-lg p-2">
            <Briefcase size={13} className="text-primary shrink-0" />
            <span className="text-xs">{freelancer.completedProjects || 0} projets</span>
          </div>
          <div className="flex items-center gap-1.5 text-muted-foreground bg-muted/50 rounded-lg p-2">
            <TrendingUp size={13} className="text-secondary shrink-0" />
            <span className="text-xs">{freelancer.hourlyRate.toLocaleString()} GNF/h</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button className="flex-1 gap-1.5" size="sm">
            <MessageCircle size={14} />
            Contacter
          </Button>
          <Button variant="outline" size="sm" className="px-4">
            Profil
          </Button>
        </div>
      </div>
    </motion.div>
  );
});

FreelancerCard3D.displayName = "FreelancerCard3D";

export default FreelancerCard3D;
