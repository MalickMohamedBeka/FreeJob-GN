import { useEffect, useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { usePublicStats } from "@/hooks/useAuth";

const AnimatedCounter = ({ target, suffix }: { target: number; suffix: string }) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;
    const duration = 1500;
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
    <div ref={ref} className="text-4xl md:text-5xl font-bold text-white">
      {count.toLocaleString()}{suffix}
    </div>
  );
};

const StatSkeleton = () => (
  <div className="text-center animate-pulse">
    <div className="h-12 w-24 bg-white/20 rounded-lg mx-auto mb-2" />
    <div className="h-4 w-32 bg-white/10 rounded mx-auto" />
  </div>
);

const Stats = () => {
  const { data, isLoading } = usePublicStats();

  const statsItems = data
    ? [
        { label: "Freelancers Actifs", value: data.freelances_count, suffix: "+" },
        { label: "Prestataires", value: data.providers_count, suffix: "+" },
        { label: "Clients Inscrits", value: data.clients_count, suffix: "+" },
        { label: "Agences", value: data.agencies_count, suffix: "+" },
      ]
    : null;

  return (
    <section className="py-20 lg:py-28 bg-primary">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {isLoading || !statsItems
            ? Array.from({ length: 4 }).map((_, i) => <StatSkeleton key={i} />)
            : statsItems.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.45, ease: "easeOut", delay: index * 0.1 }}
                  className="text-center"
                >
                  <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                  <p className="text-white/70 mt-2 text-sm font-medium">{stat.label}</p>
                </motion.div>
              ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;
