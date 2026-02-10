import { motion } from "framer-motion";

interface AfricanAvatarProps {
  name: string;
  role?: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  showBadge?: boolean;
  animate?: boolean;
}

const AfricanAvatar = ({ 
  name, 
  role, 
  size = "md", 
  className = "",
  showBadge = false,
  animate = true
}: AfricanAvatarProps) => {
  const sizeClasses = {
    sm: "w-12 h-12",
    md: "w-16 h-16",
    lg: "w-24 h-24",
    xl: "w-32 h-32",
  };

  // Sélectionner une photo basée sur le nom pour la cohérence
  // Now using 15 freelancer images for more variety
  const photoIndex = (name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % 15) + 1;
  const photoSrc = `/avatars/freelancer-${photoIndex}.jpg`;

  return (
    <motion.div
      className={`relative inline-block ${className}`}
      initial={animate ? { opacity: 0, scale: 0.5 } : {}}
      animate={animate ? { opacity: 1, scale: 1 } : {}}
      whileHover={animate ? { scale: 1.1, rotate: 5 } : {}}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        className={`${sizeClasses[size]} rounded-full flex items-center justify-center shadow-elevation-3 border-4 border-white/30 relative overflow-hidden`}
        whileHover={animate ? { rotate: 5 } : {}}
        transition={{ duration: 0.6 }}
      >
        {/* Real Photo */}
        <img 
          src={photoSrc}
          alt={name}
          className="relative z-10 w-full h-full object-cover"
        />
      </motion.div>

      {/* Badge */}
      {showBadge && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring" }}
          className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-success border-2 border-white shadow-elevation-2 flex items-center justify-center"
        >
          <span className="text-white text-xs">✓</span>
        </motion.div>
      )}

      {/* Name & Role Tooltip */}
      {(name || role) && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileHover={{ opacity: 1, y: 0 }}
          className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-3 py-2 rounded-lg glass shadow-elevation-2 whitespace-nowrap pointer-events-none z-20"
        >
          <p className="text-sm font-semibold">{name}</p>
          {role && <p className="text-xs text-muted-foreground">{role}</p>}
        </motion.div>
      )}
    </motion.div>
  );
};

export default AfricanAvatar;
