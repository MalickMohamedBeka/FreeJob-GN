import { motion } from "framer-motion";
import { Rocket, Globe, Award, TrendingUp } from "lucide-react";

const timeline = [
  {
    year: "2023",
    title: "Lancement",
    description: "FreeJobGN voit le jour avec une vision claire : connecter les talents guinéens.",
    icon: Rocket,
  },
  {
    year: "2024",
    title: "Croissance",
    description: "1 000+ freelancers rejoignent la plateforme. Expansion dans toute la Guinée.",
    icon: TrendingUp,
  },
  {
    year: "2025",
    title: "International",
    description: "Ouverture aux clients internationaux. 2 500+ talents actifs.",
    icon: Globe,
  },
  {
    year: "2026",
    title: "Excellence",
    description: "Reconnaissance comme plateforme #1 en Afrique de l'Ouest.",
    icon: Award,
  },
];

const Timeline3D = () => {
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl md:text-5xl font-black mb-4">
            Notre <span className="text-secondary">Parcours</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            De l'idée à la réalité, découvrez notre évolution
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto space-y-8">
          {timeline.map((item, index) => {
            const isEven = index % 2 === 0;
            return (
              <motion.div
                key={item.year}
                initial={{ opacity: 0, x: isEven ? -40 : 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, ease: "easeOut", delay: index * 0.1 }}
                className={`flex items-center gap-6 ${isEven ? "flex-row" : "flex-row-reverse"}`}
              >
                {/* Content card */}
                <motion.div
                  whileHover={{ y: -4, transition: { duration: 0.2 } }}
                  className="flex-1 bg-white rounded-2xl border border-border p-6 shadow-sm hover:shadow-md transition-shadow"
                >
                  <span className="text-5xl font-black text-primary/20 block mb-2">
                    {item.year}
                  </span>
                  <h3 className="text-2xl font-bold mb-2">{item.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{item.description}</p>
                </motion.div>

                {/* Icon node */}
                <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center shrink-0 shadow-sm">
                  <item.icon className="text-white" size={22} />
                </div>

                {/* Spacer for alignment on alternating sides */}
                <div className="flex-1 hidden md:block" />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Timeline3D;
