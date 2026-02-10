import { motion } from "framer-motion";
import { Users, Briefcase, Star, TrendingUp, Zap } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { useInView } from "framer-motion";

const AnimatedCounter = ({ target, suffix = "" }: { target: number; suffix?: string }) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;
    const duration = 2500;
    const steps = 60;
    const increment = target / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [isInView, target]);

  return (
    <div ref={ref} className="text-6xl font-black text-primary">
      {count.toLocaleString()}{suffix}
    </div>
  );
};

const stats = [
  { icon: Users, value: 2500, suffix: "+", label: "Freelancers Actifs", color: "from-primary to-warning" },
  { icon: Briefcase, value: 5000, suffix: "+", label: "Projets Réalisés", color: "from-secondary to-primary" },
  { icon: Star, value: 98, suffix: "%", label: "Satisfaction Client", color: "from-warning to-secondary" },
  { icon: TrendingUp, value: 150, suffix: "+", label: "Nouveaux Projets/Mois", color: "from-success to-primary" },
];

const Stats3D = () => {
  return (
    <section className="py-20 relative overflow-hidden">
      {/* Animated Background */}
      <motion.div
        className="absolute inset-0 bg-primary"
        animate={{
          backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      />

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 60, scale: 0.8, rotateX: -30 }}
              whileInView={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
              viewport={{ once: true }}
              transition={{ 
                duration: 0.7, 
                delay: index * 0.12,
                type: "spring",
                stiffness: 100
              }}
              whileHover={{ 
                y: -15, 
                scale: 1.1,
                rotateY: 10,
                transition: { duration: 0.3 }
              }}
              className="glass rounded-3xl p-8 shadow-elevation-4 border-2 border-white/40 card-3d group relative overflow-hidden text-center"
            >
              {/* Animated Background */}
              <motion.div
                className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-20`}
                animate={{
                  scale: [1, 1.5, 1],
                  rotate: [0, 180, 360],
                }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              />

              {/* Icon */}
              <motion.div
                className={`w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-elevation-3 relative`}
                whileHover={{ rotate: 360, scale: 1.2 }}
                transition={{ duration: 0.6 }}
              >
                <motion.div
                  className="absolute inset-0 rounded-2xl bg-white/30 blur-lg"
                  animate={{
                    scale: [1, 1.4, 1],
                    opacity: [0.3, 0.6, 0.3],
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <stat.icon className="text-white relative z-10" size={32} />
              </motion.div>

              {/* Counter */}
              <AnimatedCounter target={stat.value} suffix={stat.suffix} />
              
              {/* Label */}
              <p className="text-sm text-muted-foreground font-semibold mt-3 relative">
                {stat.label}
              </p>

              {/* Pulse Effect */}
              <motion.div
                className="absolute inset-0 rounded-3xl border-2 border-primary"
                animate={{
                  scale: [1, 1.05, 1],
                  opacity: [0, 0.5, 0],
                }}
                transition={{ duration: 2, repeat: Infinity, delay: index * 0.3 }}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats3D;
