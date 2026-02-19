import { motion } from "framer-motion";
import { Heart, Rocket, Zap } from "lucide-react";
import { Link } from "react-router-dom";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: "easeOut" as const, delay },
});

const AboutHero3D = () => {
  return (
    <section className="relative py-28 bg-primary overflow-hidden">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div {...fadeUp(0)}>
            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/10 text-white text-sm font-semibold mb-8 border border-white/20">
              <Heart size={14} className="text-cta" />
              Notre Mission
            </div>
          </motion.div>

          <motion.h1
            {...fadeUp(0.1)}
            className="text-5xl md:text-6xl lg:text-7xl font-black mb-6 leading-tight text-white"
          >
            Construire l'Avenir
            <br />
            <span className="text-secondary">du Travail en Afrique</span>
          </motion.h1>

          <motion.p
            {...fadeUp(0.25)}
            className="text-lg md:text-xl text-white/70 max-w-3xl mx-auto leading-relaxed mb-10"
          >
            FreeJobGN est né d'une vision simple : donner à chaque talent africain la possibilité
            de travailler sur des projets passionnants, localement et à l'international.
            <span className="block mt-3 text-white/90 font-semibold">
              Innovation · Excellence · Impact
            </span>
          </motion.p>

          <motion.div
            {...fadeUp(0.4)}
            className="flex flex-wrap justify-center gap-4"
          >
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
              <Link
                to="/signup"
                className="inline-flex items-center gap-2 bg-cta text-white px-8 py-4 rounded-xl font-bold text-base shadow-sm"
              >
                <Rocket size={18} />
                Rejoindre l'Aventure
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
              <Link
                to="/freelancers"
                className="inline-flex items-center gap-2 bg-white/10 text-white border border-white/30 px-8 py-4 rounded-xl font-bold text-base hover:bg-white/20 transition-colors"
              >
                <Zap size={18} />
                Découvrir Plus
              </Link>
            </motion.div>
          </motion.div>

          <motion.div
            {...fadeUp(0.55)}
            className="mt-16 flex flex-wrap justify-center gap-6"
          >
            {[
              { value: "2023", label: "Année de Création" },
              { value: "50+", label: "Pays Représentés" },
              { value: "10K+", label: "Projets Réalisés" },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.65 + i * 0.1, duration: 0.4 }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="bg-white/10 border border-white/20 rounded-2xl px-8 py-4 cursor-default"
              >
                <p className="text-3xl font-black text-white mb-1">{stat.value}</p>
                <p className="text-sm text-white/60 font-medium">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutHero3D;
