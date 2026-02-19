import { motion } from "framer-motion";
import { ArrowRight, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-illustration.jpg";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: "easeOut" as const, delay },
});

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      <div className="container mx-auto px-4 lg:px-8 pt-24 pb-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left — Content */}
          <div className="max-w-xl">
            <motion.div {...fadeUp(0)}>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-6 border border-primary/20">
                <Briefcase size={14} />
                La plateforme freelance #1 en Guinée
              </div>
            </motion.div>

            <motion.h1 {...fadeUp(0.1)} className="text-4xl md:text-5xl lg:text-[60px] font-bold leading-[1.1] tracking-tight mb-6 text-foreground">
              Trouvez les meilleurs{" "}
              <span className="text-secondary">talents freelance</span>{" "}
              pour vos projets
            </motion.h1>

            <motion.p {...fadeUp(0.2)} className="text-lg text-muted-foreground leading-relaxed mb-8">
              Connectez-vous avec des développeurs, designers et experts guinéens
              talentueux. Publiez votre projet et recevez des propositions en quelques minutes.
            </motion.p>

            <motion.div {...fadeUp(0.3)} className="flex flex-wrap gap-4">
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Button variant="cta" size="lg" asChild>
                  <Link to="/signup">
                    Commencer Gratuitement
                    <ArrowRight size={18} />
                  </Link>
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Button variant="outline" size="lg" asChild>
                  <Link to="/projects">Voir les Projets</Link>
                </Button>
              </motion.div>
            </motion.div>

            <motion.div {...fadeUp(0.45)} className="mt-10 flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex -space-x-2">
                {["AD", "FC", "MB", "AS"].map((initials, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.55 + i * 0.08, duration: 0.3 }}
                    className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-white text-xs font-bold border-2 border-white"
                  >
                    {initials}
                  </motion.div>
                ))}
              </div>
              <span>
                <strong className="text-foreground">2 500+</strong> freelancers africains actifs
              </span>
            </motion.div>
          </div>

          {/* Right — Illustration */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" as const }}
            className="hidden lg:block"
          >
            <img
              src={heroImage}
              alt="FreeJobGN - Plateforme freelance"
              className="w-full rounded-2xl border border-border shadow-lg"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
