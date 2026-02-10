import { motion } from "framer-motion";
import { ArrowRight, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-illustration.jpg";
import AfricanAvatar from "@/components/ui/AfricanAvatar";

const Hero = () => {
  const freelancers = [
    { name: "Amadou Diallo", role: "Dev" },
    { name: "Fatoumata Camara", role: "Designer" },
    { name: "Mamadou Bah", role: "Marketing" },
    { name: "Aissatou Sow", role: "PM" },
  ];

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      <div className="container mx-auto px-4 lg:px-8 pt-24 pb-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left - Content */}
          <div className="max-w-xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              whileHover={{ scale: 1.05, y: -2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass shadow-elevation-2 text-primary text-sm font-semibold mb-6"
            >
              <Briefcase size={16} />
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
              <motion.div whileHover={{ scale: 1.05, y: -4 }} whileTap={{ scale: 0.98 }}>
                <Button variant="hero" size="xl" asChild className="btn-3d shadow-glow-orange">
                  <Link to="/signup">
                    Commencer Gratuitement
                    <ArrowRight size={20} />
                  </Link>
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05, y: -4 }} whileTap={{ scale: 0.98 }}>
                <Button variant="outline" size="xl" asChild className="btn-3d glass">
                  <Link to="/projects">Voir les Projets</Link>
                </Button>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="mt-10 flex items-center gap-6 text-sm text-muted-foreground"
            >
              <div className="flex -space-x-3">
                {freelancers.map((freelancer, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + i * 0.1 }}
                  >
                    <AfricanAvatar 
                      name={freelancer.name}
                      role={freelancer.role}
                      size="sm"
                      showBadge
                    />
                  </motion.div>
                ))}
              </div>
              <span>
                <strong className="text-foreground">2,500+</strong> freelancers africains actifs
              </span>
            </motion.div>
          </div>

          {/* Right - Illustration */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="hidden lg:block"
          >
            <div className="relative">
              <img
                src={heroImage}
                alt="FreeJobGN - Plateforme freelance"
                className="relative w-full rounded-3xl shadow-elevation-5 border-4 border-white/20"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
