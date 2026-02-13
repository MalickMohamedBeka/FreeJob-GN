import { motion } from "framer-motion";
import { Star, MapPin, Briefcase, Award, Heart, MessageCircle, Eye, TrendingUp } from "lucide-react";
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

const FreelancerCard3D = memo(({ freelancer, index }: FreelancerCard3DProps) => {
  const [isLiked, setIsLiked] = useState(false);

  const avatarIndex = (parseInt(freelancer.id) % 15) + 1;
  const avatarUrl = `/avatars/freelancer-${avatarIndex}.jpg`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      className="relative group cursor-pointer"
    >
      <div className="relative glass rounded-[2rem] border-2 border-white/40 overflow-hidden shadow-elevation-4 transition-all duration-300 hover:shadow-[0_40px_80px_rgba(0,0,0,0.35),0_20px_40px_rgba(255,122,61,0.25)] hover:-translate-y-1">
        {/* Content Container */}
        <div className="relative">
          {/* Header with Avatar */}
          <div className="relative h-64 overflow-hidden rounded-t-[1.75rem]">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-primary opacity-20" />

            {/* Avatar Image */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative w-40 h-40 rounded-full overflow-hidden border-4 border-white shadow-elevation-5 transition-transform duration-300 group-hover:scale-105">
                <img
                  src={avatarUrl}
                  alt={freelancer.name}
                  loading="lazy"
                  className="relative z-10 w-full h-full object-cover"
                />

                {/* Online Status with Tailwind ping */}
                {freelancer.available && (
                  <div className="absolute bottom-2 right-2 w-6 h-6 z-20">
                    <span className="absolute inset-0 rounded-full bg-success animate-ping opacity-75" />
                    <span className="relative block w-6 h-6 rounded-full bg-success border-3 border-white shadow-elevation-2" />
                  </div>
                )}
              </div>
            </div>

            {/* Top Right Actions */}
            <div className="absolute top-4 right-4 flex gap-2 z-30">
              <button
                onClick={() => setIsLiked(!isLiked)}
                className={`w-10 h-10 rounded-full glass-dark backdrop-blur-xl flex items-center justify-center shadow-elevation-3 transition-colors ${
                  isLiked ? 'bg-red-500' : ''
                }`}
              >
                <Heart
                  size={18}
                  className={`${isLiked ? 'fill-white text-white' : 'text-white'}`}
                />
              </button>

              <button
                className="w-10 h-10 rounded-full glass-dark backdrop-blur-xl flex items-center justify-center shadow-elevation-3"
              >
                <Eye size={18} className="text-white" />
              </button>
            </div>

            {/* Top Left Badge */}
            {freelancer.completedProjects && freelancer.completedProjects > 50 && (
              <div className="absolute top-4 left-4 z-30">
                <div className="glass-dark backdrop-blur-xl rounded-full px-3 py-1.5 flex items-center gap-2 shadow-elevation-3">
                  <Award size={16} className="text-warning" />
                  <span className="text-white text-xs font-bold">Top Rated</span>
                </div>
              </div>
            )}
          </div>

          {/* Info Section */}
          <div className="p-6 space-y-4">
            {/* Name & Title */}
            <div>
              <h3 className="text-2xl font-bold mb-1 group-hover:text-primary transition-colors">
                {freelancer.name}
              </h3>
              <p className="text-muted-foreground font-medium">{freelancer.title}</p>
            </div>

            {/* Rating & Location */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 glass rounded-full px-4 py-2 shadow-elevation-2">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={14}
                      className={`${
                        i < Math.floor(freelancer.rating)
                          ? 'fill-warning text-warning'
                          : 'text-muted-foreground'
                      }`}
                    />
                  ))}
                </div>
                <span className="font-bold text-sm">{freelancer.rating}</span>
                <span className="text-xs text-muted-foreground">({freelancer.reviewsCount})</span>
              </div>

              <div className="flex items-center gap-1 text-muted-foreground text-sm">
                <MapPin size={14} className="text-primary" />
                <span className="font-medium">{freelancer.location}</span>
              </div>
            </div>

            {/* Skills */}
            <div className="flex flex-wrap gap-2">
              {freelancer.skills.slice(0, 4).map((skill) => (
                <span
                  key={skill}
                  className="px-3 py-1.5 rounded-full glass-dark text-white text-xs font-semibold shadow-elevation-2"
                >
                  {skill}
                </span>
              ))}
              {freelancer.skills.length > 4 && (
                <span className="px-3 py-1.5 rounded-full glass text-muted-foreground text-xs font-semibold">
                  +{freelancer.skills.length - 4}
                </span>
              )}
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="glass rounded-xl p-3 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary items-center justify-center shadow-elevation-2">
                  <Briefcase size={18} className="text-white" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Projets</p>
                  <p className="text-lg font-bold">{freelancer.completedProjects || 0}</p>
                </div>
              </div>

              <div className="glass rounded-xl p-3 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary items-center justify-center shadow-elevation-2">
                  <TrendingUp size={18} className="text-white" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Taux</p>
                  <p className="text-lg font-bold">${freelancer.hourlyRate}/h</p>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex gap-3 pt-2">
              <Button
                className="flex-1 bg-primary text-white shadow-elevation-3 hover:shadow-elevation-4 border-0 gap-2 h-12 text-base font-bold"
              >
                <MessageCircle size={18} />
                Contacter
              </Button>

              <Button
                variant="outline"
                className="glass border-2 border-white/40 h-12 px-6 font-bold"
              >
                Profil
              </Button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
});

FreelancerCard3D.displayName = 'FreelancerCard3D';

export default FreelancerCard3D;
