import { motion } from "framer-motion";
import { Rocket, TrendingUp, Zap } from "lucide-react";

const ProjectsHero3D = () => {
  return (
    <div className="relative py-20 overflow-hidden">
      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="inline-block mb-6"
          >
            <div className="glass rounded-full px-6 py-3 shadow-elevation-3 border-2 border-white/30">
              <div className="flex items-center gap-3">
                <Zap className="text-primary" size={20} />
                <span className="font-bold text-primary">
                  +150 Nouveaux Projets ce Mois
                </span>
                <TrendingUp className="text-success" size={20} />
              </div>
            </div>
          </motion.div>

          {/* Main Title */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight"
          >
            <span>Projets</span>{" "}
            <span className="text-primary">Extraordinaires</span>
            <br />
            <span className="text-muted-foreground text-4xl md:text-5xl">
              Talents Africains
            </span>
          </motion.h1>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed"
          >
            D&eacute;couvrez des opportunit&eacute;s uniques et connectez-vous avec des clients
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
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.8 + i * 0.1 }}
                whileHover={{
                  scale: 1.1,
                  y: -10,
                  transition: { duration: 0.3 }
                }}
                className="glass rounded-2xl p-6 shadow-elevation-3 border-2 border-white/30 card-3d group"
              >
                <motion.div
                  className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-primary flex items-center justify-center shadow-elevation-3"
                  whileHover={{ rotate: 360, scale: 1.2 }}
                  transition={{ duration: 0.6 }}
                >
                  <stat.icon className="text-white" size={28} />
                </motion.div>
                <p className="text-3xl font-bold text-primary mb-1">
                  {stat.value}
                </p>
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
