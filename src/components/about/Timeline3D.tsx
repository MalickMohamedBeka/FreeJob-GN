import { motion } from "framer-motion";
import { Rocket, Users, Globe, Award, Zap, TrendingUp } from "lucide-react";

const timeline = [
  {
    year: "2023",
    title: "Lancement",
    description: "FreeJobGN voit le jour avec une vision claire : connecter les talents guinéens.",
    icon: Rocket,
    color: "from-primary to-warning"
  },
  {
    year: "2024",
    title: "Croissance",
    description: "1,000+ freelancers rejoignent la plateforme. Expansion dans toute la Guinée.",
    icon: TrendingUp,
    color: "from-secondary to-primary"
  },
  {
    year: "2025",
    title: "International",
    description: "Ouverture aux clients internationaux. 2,500+ talents actifs.",
    icon: Globe,
    color: "from-success to-secondary"
  },
  {
    year: "2026",
    title: "Excellence",
    description: "Reconnaissance comme plateforme #1 en Afrique de l'Ouest.",
    icon: Award,
    color: "from-warning to-primary"
  },
];

const Timeline3D = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-primary" />

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h2 className="text-5xl font-black mb-4">
            Notre <span className="text-primary">Parcours</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            De l'idée à la réalité, découvrez notre évolution
          </p>
        </motion.div>

        <div className="max-w-6xl mx-auto">
          {timeline.map((item, index) => (
            <motion.div
              key={item.year}
              initial={{ opacity: 0, x: index % 2 === 0 ? -100 : 100, rotateY: index % 2 === 0 ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0, rotateY: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              className={`flex items-center gap-8 mb-16 ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}
            >
              {/* Content */}
              <motion.div
                whileHover={{ scale: 1.05, x: index % 2 === 0 ? 10 : -10 }}
                className="flex-1 glass rounded-3xl p-8 shadow-elevation-4 border-2 border-white/40 card-3d group relative overflow-hidden"
              >
                {/* Animated Background */}
                <motion.div
                  className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-0 group-hover:opacity-20`}
                  animate={{
                    scale: [1, 1.3, 1],
                    rotate: [0, 90, 180],
                  }}
                  transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                />

                <div className="relative z-10">
                  <motion.span 
                    className="inline-block text-6xl font-black text-primary mb-4"
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    {item.year}
                  </motion.span>
                  <h3 className="text-3xl font-bold mb-3">{item.title}</h3>
                  <p className="text-muted-foreground text-lg leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </motion.div>

              {/* Icon */}
              <motion.div
                whileHover={{ rotate: 360, scale: 1.3 }}
                transition={{ duration: 0.6 }}
                className="relative"
              >
                <motion.div
                  className={`w-24 h-24 rounded-full bg-gradient-to-br ${item.color} flex items-center justify-center shadow-elevation-4 relative`}
                  animate={{
                    boxShadow: [
                      "0 0 0 0 rgba(255, 122, 61, 0.4)",
                      "0 0 0 20px rgba(255, 122, 61, 0)",
                      "0 0 0 0 rgba(255, 122, 61, 0.4)",
                    ]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <motion.div
                    className="absolute inset-0 rounded-full bg-white/30 blur-xl"
                    animate={{
                      scale: [1, 1.5, 1],
                      opacity: [0.3, 0.6, 0.3],
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                  <item.icon className="text-white relative z-10" size={40} />
                </motion.div>
              </motion.div>

              {/* Spacer for alignment */}
              <div className="flex-1" />
            </motion.div>
          ))}
        </div>

        {/* Connecting Line */}
        <motion.div
          className="absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-primary via-secondary to-success opacity-20"
          initial={{ scaleY: 0 }}
          whileInView={{ scaleY: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 2, delay: 0.5 }}
        />
      </div>
    </section>
  );
};

export default Timeline3D;
