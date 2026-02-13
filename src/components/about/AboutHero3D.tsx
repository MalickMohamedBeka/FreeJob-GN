import { motion } from "framer-motion";
import { Heart, Rocket, Zap } from "lucide-react";

const AboutHero3D = () => {
  return (
    <section className="relative py-32 overflow-hidden">
      {/* Content */}
      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="max-w-5xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="inline-block mb-8"
          >
            <div className="glass rounded-full px-8 py-4 shadow-elevation-4 border-2 border-white/40 backdrop-blur-xl">
              <div className="flex items-center gap-4">
                <span className="font-bold text-xl">
                  <span className="text-primary">Notre Mission</span>
                </span>
                <Heart className="text-warning" size={28} />
              </div>
            </div>
          </motion.div>

          {/* Main Title */}
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-6xl md:text-7xl lg:text-8xl font-black mb-8 leading-tight"
          >
            <span>Construire</span>
            <br />
            <span className="text-primary">l'Avenir</span>
            <br />
            <span className="text-muted-foreground text-5xl md:text-6xl">
              du Travail en Afrique
            </span>
          </motion.h1>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed font-medium mb-12"
          >
            FreeJobGN est n&eacute; d'une vision simple : donner &agrave; chaque talent africain la possibilit&eacute;
            de travailler sur des projets passionnants, localement et &agrave; l'international.
            <br />
            <span className="text-primary font-bold mt-4 block">
              Innovation &bull; Excellence &bull; Impact
            </span>
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="flex flex-wrap justify-center gap-6"
          >
            <motion.button
              whileHover={{
                scale: 1.08,
                y: -5,
                boxShadow: "0 25px 50px rgba(0, 0, 0, 0.25), 0 0 60px rgba(255, 122, 61, 0.4)"
              }}
              whileTap={{ scale: 0.95 }}
              className="bg-primary text-white px-10 py-5 rounded-2xl font-bold text-lg shadow-elevation-4 flex items-center gap-3"
            >
              <Rocket size={24} />
              Rejoindre l'Aventure
            </motion.button>

            <motion.button
              whileHover={{
                scale: 1.08,
                y: -5,
                boxShadow: "0 25px 50px rgba(0, 0, 0, 0.25)"
              }}
              whileTap={{ scale: 0.95 }}
              className="glass border-2 border-white/40 px-10 py-5 rounded-2xl font-bold text-lg shadow-elevation-3 flex items-center gap-3"
            >
              <Zap size={24} />
              D&eacute;couvrir Plus
            </motion.button>
          </motion.div>

          {/* Floating Stats */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.9 }}
            className="mt-20 flex flex-wrap justify-center gap-8"
          >
            {[
              { value: "2023", label: "Ann\u00e9e de Cr\u00e9ation" },
              { value: "50+", label: "Pays Repr\u00e9sent\u00e9s" },
              { value: "10K+", label: "Projets R\u00e9alis\u00e9s" },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.1 + i * 0.1, type: "spring" }}
                whileHover={{ scale: 1.1, y: -5 }}
                className="glass rounded-2xl px-8 py-4 shadow-elevation-3 border border-white/30"
              >
                <p className="text-4xl font-black text-primary mb-1">
                  {stat.value}
                </p>
                <p className="text-sm text-muted-foreground font-semibold">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutHero3D;
