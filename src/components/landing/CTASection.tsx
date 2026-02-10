import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const CTASection = () => {
  return (
    <section className="py-20 lg:py-28 perspective-container">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, rotateX: -10 }}
          whileInView={{ opacity: 1, scale: 1, rotateX: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          whileHover={{ scale: 1.02, rotateX: 2, y: -8 }}
          className="relative rounded-[2rem] bg-primary p-12 md:p-16 text-center overflow-hidden shadow-elevation-5 card-3d"
        >
          <div className="relative z-10">
            <motion.h2 
              className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary-foreground mb-6"
              whileHover={{ scale: 1.05 }}
            >
              Prêt à démarrer votre prochain projet ?
            </motion.h2>
            <p className="text-primary-foreground/90 text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
              Rejoignez des milliers de professionnels qui utilisent FreeJobGN pour
              transformer leurs idées en réalité.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <motion.div whileHover={{ scale: 1.08, y: -4 }} whileTap={{ scale: 0.95 }}>
                <Button variant="hero-outline" size="xl" asChild className="btn-3d glass shadow-elevation-3">
                  <Link to="/signup">
                    Créer un Compte Gratuit
                    <ArrowRight size={20} />
                  </Link>
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.08, y: -4 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="ghost"
                  size="xl"
                  className="text-primary-foreground hover:bg-primary-foreground/20 btn-3d glass-dark"
                  asChild
                >
                  <Link to="/projects">Explorer les Projets</Link>
                </Button>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;
