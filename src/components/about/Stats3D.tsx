import { motion, useInView } from "framer-motion";
import { Users, Briefcase, Star, TrendingUp } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { usePublicStats } from "@/hooks/useAuth";

const AnimatedCounter = ({ target, suffix = "" }: { target: number; suffix?: string }) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView || target === 0) return;
    const duration = 1800;
    const steps = 50;
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
    <div ref={ref} className="text-4xl md:text-5xl font-black text-white">
      {count.toLocaleString()}{suffix}
    </div>
  );
};

const StatSkeleton = () => (
  <div className="text-center animate-pulse">
    <div className="w-12 h-12 rounded-xl bg-white/10 mx-auto mb-4" />
    <div className="h-12 w-20 bg-white/20 rounded-lg mx-auto mb-2" />
    <div className="h-3 w-28 bg-white/10 rounded mx-auto" />
  </div>
);

const Stats3D = () => {
  const { data, isLoading } = usePublicStats();

  const stats = data
    ? [
        { icon: Users,      value: data.freelances_count,   suffix: "+", label: "Freelancers Actifs" },
        { icon: Briefcase,  value: data.projects_count,     suffix: "+", label: "Projets Publiés" },
        { icon: Star,       value: 95,                      suffix: "%", label: "Satisfaction Client" },
        { icon: TrendingUp, value: data.projects_this_month,suffix: "+", label: "Nouveaux Projets/Mois" },
      ]
    : null;

  return (
    <section className="py-20 bg-primary">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {isLoading || !stats
            ? Array.from({ length: 4 }).map((_, i) => <StatSkeleton key={i} />)
            : stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.45, ease: "easeOut", delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center mx-auto mb-4">
                    <stat.icon className="text-white/80" size={22} />
                  </div>
                  <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                  <p className="text-white/60 mt-2 text-sm font-medium">{stat.label}</p>
                </motion.div>
              ))}
        </div>
      </div>
    </section>
  );
};

export default Stats3D;
