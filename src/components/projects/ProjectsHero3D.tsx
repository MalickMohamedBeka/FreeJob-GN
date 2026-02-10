import { motion } from "framer-motion";
import { Rocket, Sparkles, TrendingUp, Zap } from "lucide-react";

const ProjectsHero3D = () => {
  return (
    <div className="relative py-20 overflow-hidden">
      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Floating Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="inline-block mb-6"
          >
            <motion.div
              animate={{ 
                y: [0, -10, 0],
                rotateZ: [0, 5, -5, 0]
              }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="glass rounded-full px-6 py-3 shadow-elevation-3 border-2 border-white/30"
            >
              <div className="flex items-center gap-3">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                >
                  <Zap className="text-primary" size={20} />
                </motion.div>
                <span className="font-bold text-primary">
                  +150 Nouveaux Projets ce Mois
                </span>
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <TrendingUp className="text-success" size={20} />
                </motion.div>
              </div>
            </motion.div>
          </motion.div>

          {/* Main Title with 3D Effect */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight"
          >
            <motion.span
              animate={{ 
                textShadow: [
                  "0 0 20px rgba(255, 122, 61, 0.3)",
                  "0 0 40px rgba(255, 122, 61, 0.5)",
                  "0 0 20px rgba(255, 122, 61, 0.3)"
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              Projets
            </motion.span>{" "}
            <span className="text-primary">Extraordinaires</span>
            <br />
            <motion.span
              className="text-muted-foreground text-4xl md:text-5xl"
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              Talents Africains
            </motion.span>
          </motion.h1>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed"
          >
            Découvrez des opportunités uniques et connectez-vous avec des clients 
            qui transforment l'Afrique digitale
          </motion.p>

          {/* Stats Cards */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="grid grid-cols-3 gap-6 max-w-3xl mx-auto"
          >
            {[
              { icon: Rocket, value: "500+", label: "Projets Actifs", color: "from-primary to-warning" },
              { icon: Zap, value: "2.5K+", label: "Freelancers", color: "from-secondary to-primary" },
              { icon: TrendingUp, value: "98%", label: "Satisfaction", color: "from-success to-secondary" },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8, rotateY: -20 }}
                animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                transition={{ duration: 0.5, delay: 0.8 + i * 0.1 }}
                whileHover={{ 
                  scale: 1.1, 
                  y: -10,
                  rotateY: 10,
                  transition: { duration: 0.3 }
                }}
                className="glass rounded-2xl p-6 shadow-elevation-3 border-2 border-white/30 card-3d group"
              >
                <motion.div
                  className={`w-14 h-14 mx-auto mb-4 rounded-2xl bg-primary flex items-center justify-center shadow-elevation-3`}
                  whileHover={{ rotate: 360, scale: 1.2 }}
                  transition={{ duration: 0.6 }}
                >
                  <stat.icon className="text-white" size={28} />
                </motion.div>
                <motion.p 
                  className="text-3xl font-bold text-primary mb-1"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
                >
                  {stat.value}
                </motion.p>
                <p className="text-sm text-muted-foreground font-medium">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Bottom Wave Effect */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-32 bg-background/50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      />
    </div>
  );
};

export default ProjectsHero3D;
