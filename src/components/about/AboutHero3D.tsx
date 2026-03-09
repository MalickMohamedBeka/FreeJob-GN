import { motion } from "framer-motion";
import { Heart, Rocket, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import { Spotlight } from "@/components/ui/spotlight";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: "easeOut" as const, delay },
});

const AboutHero3D = () => {
  return (
    <section className="relative py-14 lg:py-20 bg-primary overflow-hidden">
      <Spotlight className="-top-40 left-0 md:-top-20 md:left-60" fill="white" />
      {/* Decorative circle — top-right only */}
      <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-white/5 pointer-events-none" />

      <div className="container mx-auto px-4 lg:px-8 relative">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div {...fadeUp(0)}>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 text-white text-sm font-semibold mb-5 border border-white/20">
              <Heart size={13} className="text-cta" />
              Notre Mission
            </div>
          </motion.div>

          <motion.h1
            {...fadeUp(0.1)}
            className="text-4xl md:text-5xl lg:text-6xl font-black mb-4 leading-tight text-white"
          >
            Construire l'Avenir
            <br />
            <span className="text-secondary">du Travail en Afrique</span>
          </motion.h1>

          <motion.p
            {...fadeUp(0.2)}
            className="text-base md:text-lg text-white/70 max-w-2xl mx-auto leading-relaxed mb-2"
          >
            FreeJobGN connecte les talents guinéens aux meilleures opportunités, localement et à l'international.
          </motion.p>
          <motion.p {...fadeUp(0.25)} className="text-white/60 text-sm font-semibold mb-8 tracking-wide">
            Innovation · Excellence · Impact
          </motion.p>

          <motion.div
            {...fadeUp(0.35)}
            className="flex flex-wrap justify-center gap-4 mb-10"
          >
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
              <Link
                to="/signup"
                className="inline-flex items-center gap-2 bg-cta text-white px-7 py-3.5 rounded-xl font-bold text-base shadow-sm"
              >
                <Rocket size={17} />
                Rejoindre l'Aventure
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
              <Link
                to="/freelancers"
                className="inline-flex items-center gap-2 bg-white/10 text-white border border-white/30 px-7 py-3.5 rounded-xl font-bold text-base hover:bg-white/20 transition-colors"
              >
                <Zap size={17} />
                Découvrir Plus
              </Link>
            </motion.div>
          </motion.div>

          <motion.div
            {...fadeUp(0.45)}
            className="flex flex-wrap justify-center gap-4"
          >
            {[
              { value: "2023", label: "Fondée en" },
              { value: "50+", label: "Pays représentés" },
              { value: "10K+", label: "Projets réalisés" },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.55 + i * 0.09, duration: 0.35 }}
                className="bg-white/10 border border-white/20 rounded-2xl px-6 py-3 cursor-default"
              >
                <p className="text-2xl font-black text-white mb-0.5">{stat.value}</p>
                <p className="text-xs text-white/60 font-medium">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutHero3D;
