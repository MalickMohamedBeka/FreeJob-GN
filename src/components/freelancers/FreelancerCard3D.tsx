import { motion } from "framer-motion";
import { Star, MapPin, Briefcase, Award, Heart, MessageCircle, Eye, TrendingUp, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
  const [isHovered, setIsHovered] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  // Use real avatar photos - convert string id to number for avatar selection
  // Now using 15 freelancer images for more variety
  const avatarIndex = (parseInt(freelancer.id) % 15) + 1;
  const avatarUrl = `/avatars/freelancer-${avatarIndex}.jpg`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ 
        duration: 0.4, 
        delay: index * 0.08
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative group cursor-pointer"
    >
      {/* Main Card Container */}
      <motion.div
        className="relative glass rounded-[2rem] border-2 border-white/40 overflow-hidden shadow-elevation-4"
        animate={{
          boxShadow: isHovered 
            ? "0 40px 80px rgba(0, 0, 0, 0.35), 0 20px 40px rgba(255, 122, 61, 0.25), 0 0 60px rgba(0, 82, 204, 0.15)"
            : "0 15px 35px rgba(0, 0, 0, 0.2), 0 8px 18px rgba(0, 0, 0, 0.12)"
        }}
        transition={{ duration: 0.4 }}
      >
        {/* Animated Gradient Background */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-primary/30 via-secondary/20 to-success/30 opacity-0 group-hover:opacity-100"
          animate={{
            scale: isHovered ? 1.2 : 1,
            rotate: isHovered ? 45 : 0,
          }}
          transition={{ duration: 1 }}
        />

        {/* Floating Light Orbs - Reduced from 8 to 4 for performance */}
        {isHovered && (
          <>
            {[...Array(4)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-3 h-3 rounded-full"
                style={{
                  background: `radial-gradient(circle, ${
                    i % 3 === 0 ? 'rgba(255, 122, 61, 0.8)' : 
                    i % 3 === 1 ? 'rgba(0, 82, 204, 0.8)' : 
                    'rgba(52, 211, 153, 0.8)'
                  }, transparent)`,
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{ 
                  x: [0, Math.random() * 100 - 50],
                  y: [0, Math.random() * 100 - 50],
                  opacity: [0, 1, 0],
                  scale: [0, 2, 0]
                }}
                transition={{ 
                  duration: 2 + Math.random(),
                  repeat: Infinity,
                  delay: i * 0.2
                }}
              />
            ))}
          </>
        )}

        {/* Content Container */}
        <div className="relative">
          {/* Header with Avatar */}
          <div className="relative h-64 overflow-hidden rounded-t-[1.75rem]">
            {/* Background Pattern */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-br from-primary via-secondary to-success opacity-20"
              animate={{
                scale: isHovered ? 1.1 : 1,
                rotate: isHovered ? 5 : 0,
              }}
              transition={{ duration: 0.6 }}
            />

            {/* Avatar Image with Rotation Effect */}
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                className="relative w-40 h-40 rounded-full overflow-hidden border-4 border-white shadow-elevation-5"
                animate={{
                  scale: isHovered ? 1.08 : 1,
                  rotate: isHovered ? 5 : 0,
                }}
                transition={{ duration: 0.4 }}
              >
                {/* Glow Ring */}
                <motion.div
                  className="absolute inset-0 rounded-full bg-gradient-hero opacity-50 blur-xl"
                  animate={{
                    scale: [1, 1.3, 1],
                    opacity: [0.5, 0.8, 0.5],
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                
                {/* Avatar Image with lazy loading */}
                <img
                  src={avatarUrl}
                  alt={freelancer.name}
                  loading="lazy"
                  className="relative z-10 w-full h-full object-cover"
                />

                {/* Online Status */}
                {freelancer.available && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute bottom-2 right-2 w-6 h-6 rounded-full bg-success border-3 border-white shadow-elevation-2 z-20"
                  >
                    <motion.div
                      className="absolute inset-0 rounded-full bg-success"
                      animate={{ scale: [1, 1.5, 1], opacity: [1, 0, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  </motion.div>
                )}
              </motion.div>
            </div>

            {/* Top Right Actions */}
            <div className="absolute top-4 right-4 flex gap-2 z-30">
              <motion.button
                whileHover={{ scale: 1.15, rotate: 10 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsLiked(!isLiked)}
                className={`w-10 h-10 rounded-full glass-dark backdrop-blur-xl flex items-center justify-center shadow-elevation-3 ${
                  isLiked ? 'bg-red-500' : ''
                }`}
              >
                <Heart 
                  size={18} 
                  className={`${isLiked ? 'fill-white text-white' : 'text-white'}`}
                />
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.15, rotate: -10 }}
                whileTap={{ scale: 0.9 }}
                className="w-10 h-10 rounded-full glass-dark backdrop-blur-xl flex items-center justify-center shadow-elevation-3"
              >
                <Eye size={18} className="text-white" />
              </motion.button>
            </div>

            {/* Top Left Badge */}
            {freelancer.completedProjects && freelancer.completedProjects > 50 && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2 }}
                className="absolute top-4 left-4 z-30"
              >
                <div className="glass-dark backdrop-blur-xl rounded-full px-3 py-1.5 flex items-center gap-2 shadow-elevation-3">
                  <Award size={16} className="text-warning" />
                  <span className="text-white text-xs font-bold">Top Rated</span>
                </div>
              </motion.div>
            )}
          </div>

          {/* Info Section */}
          <div className="p-6 space-y-4">
            {/* Name & Title */}
            <div>
              <h3 className="text-2xl font-bold mb-1 group-hover:text-gradient-hero transition-all">
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
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-success to-primary flex items-center justify-center shadow-elevation-2">
                  <Briefcase size={18} className="text-white" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Projets</p>
                  <p className="text-lg font-bold">{freelancer.completedProjects || 0}</p>
                </div>
              </div>

              <div className="glass rounded-xl p-3 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-warning to-secondary flex items-center justify-center shadow-elevation-2">
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
                className="flex-1 bg-gradient-hero text-white shadow-elevation-3 hover:shadow-elevation-4 border-0 gap-2 h-12 text-base font-bold"
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

        {/* Bottom Glow Line */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-hero"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: isHovered ? 1 : 0 }}
          transition={{ duration: 0.4 }}
        />

      </motion.div>
    </motion.div>
  );
});

FreelancerCard3D.displayName = 'FreelancerCard3D';

export default FreelancerCard3D;
