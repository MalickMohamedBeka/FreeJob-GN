import { motion } from "framer-motion";
import { Target, Heart, Globe, Shield, Sparkles } from "lucide-react";

const values = [
  { 
    icon: Target, 
    title: "Excellence", 
    description: "Nous visons la qualité maximale dans chaque interaction sur notre plateforme.",
    color: "from-primary via-warning to-secondary"
  },
  { 
    icon: Heart, 
    title: "Communauté", 
    description: "Nous croyons au pouvoir de la communauté et au soutien mutuel entre professionnels.",
    color: "from-secondary via-primary to-success"
  },
  { 
    icon: Globe, 
    title: "Accessibilité", 
    description: "Rendre le freelancing accessible à tous les talents guinéens, partout dans le pays.",
    color: "from-success via-secondary to-primary"
  },
  { 
    icon: Shield, 
    title: "Confiance", 
    description: "Transparence et sécurité sont au cœur de chaque transaction sur FreeJobGN.",
    color: "from-warning via-primary to-secondary"
  },
];

const Values3D = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-muted/30 to-transparent" />
      
      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="inline-block mb-4"
          >
            <Sparkles className="text-primary" size={32} />
          </motion.div>
          <h2 className="text-5xl font-black mb-4">
            Nos <span className="text-primary">Valeurs</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Les principes qui guident chacune de nos actions
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 ">
          {values.map((value, index) => (
            <motion.div
              key={value.title}
              initial={{ opacity: 0, y: 50, rotateX: -30, scale: 0.8 }}
              whileInView={{ opacity: 1, y: 0, rotateX: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ 
                duration: 0.7, 
                delay: index * 0.15,
                type: "spring",
                stiffness: 100
              }}
              whileHover={{ 
                y: -20, 
                scale: 1.08,
                rotateY: 10,
                rotateX: 5,
                transition: { duration: 0.3 }
              }}
              className="bg-white/90 border border-border rounded-3xl p-8 shadow-sm border-2 border-white/40  group relative overflow-hidden"
            >
              {/* Animated Background */}
              <motion.div
                className={`absolute inset-0 bg-gradient-to-br ${value.color} opacity-0 group-hover:opacity-20`}
                animate={{
                  scale: [1, 1.5, 1],
                  rotate: [0, 180, 360],
                }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
              />

              {/* Icon Container */}
              <motion.div
                className={`w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br ${value.color} flex items-center justify-center shadow-sm relative`}
                whileHover={{ rotate: 360, scale: 1.2 }}
                transition={{ duration: 0.6 }}
              >
                {/* Icon Glow */}
                <motion.div
                  className="absolute inset-0 rounded-2xl bg-white/30 blur-lg"
                  animate={{
                    scale: [1, 1.4, 1],
                    opacity: [0.3, 0.6, 0.3],
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <value.icon className="text-white relative z-10" size={36} />
              </motion.div>

              {/* Content */}
              <h3 className="text-2xl font-bold mb-3 text-center group-hover:text-primary transition-all relative">
                {value.title}
              </h3>
              <p className="text-muted-foreground text-center leading-relaxed relative">
                {value.description}
              </p>

              {/* Corner Sparkle */}
              <motion.div
                className="absolute top-4 right-4"
                animate={{ 
                  rotate: 360,
                  scale: [1, 1.3, 1]
                }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <Sparkles size={16} className="text-primary opacity-50" />
              </motion.div>

              {/* Bottom Glow */}
              <motion.div
                className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${value.color}`}
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 + 0.5, duration: 0.6 }}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Values3D;
