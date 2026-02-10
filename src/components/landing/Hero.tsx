import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-illustration.jpg";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-hero opacity-[0.03]" />
      <div className="absolute top-20 right-0 w-[600px] h-[600px] rounded-full bg-primary/5 blur-3xl" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-secondary/5 blur-3xl" />

      <div className="container mx-auto px-4 lg:px-8 pt-24 pb-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left - Content */}
          <div className="max-w-xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-6"
            >
              <Sparkles size={16} />
              La plateforme freelance #1 en Guinée
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl md:text-5xl lg:text-[64px] font-bold leading-[1.1] tracking-tight mb-6"
            >
              Trouvez les meilleurs{" "}
              <span className="text-gradient-hero">talents freelance</span>{" "}
              pour vos projets
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-lg text-muted-foreground leading-relaxed mb-8"
            >
              Connectez-vous avec des développeurs, designers et experts guinéens 
              talentueux. Publiez votre projet et recevez des propositions en quelques minutes.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-wrap gap-4"
            >
              <Button variant="hero" size="xl" asChild>
                <Link to="/signup">
                  Commencer Gratuitement
                  <ArrowRight size={20} />
                </Link>
              </Button>
              <Button variant="outline" size="xl" asChild>
                <Link to="/projects">Voir les Projets</Link>
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="mt-10 flex items-center gap-6 text-sm text-muted-foreground"
            >
              <div className="flex -space-x-2">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full bg-gradient-hero border-2 border-background flex items-center justify-center text-[10px] font-bold text-primary-foreground"
                  >
                    {["AD", "KB", "MC", "FS"][i]}
                  </div>
                ))}
              </div>
              <span>
                <strong className="text-foreground">2,500+</strong> freelancers actifs
              </span>
            </motion.div>
          </div>

          {/* Right - Illustration */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="hidden lg:block"
          >
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="relative"
            >
              <img
                src={heroImage}
                alt="FreeJobGN - Plateforme freelance"
                className="w-full rounded-2xl shadow-elevation-4"
              />
              <div className="absolute inset-0 rounded-2xl bg-gradient-hero opacity-10" />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
