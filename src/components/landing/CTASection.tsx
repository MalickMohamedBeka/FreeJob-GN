import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const CTASection = () => {
  return (
    <section className="py-20 lg:py-28">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative rounded-3xl bg-gradient-hero p-12 md:p-16 text-center overflow-hidden"
        >
          {/* Decorative circles */}
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-white/5 -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-white/5 translate-y-1/2 -translate-x-1/2" />

          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary-foreground mb-6">
              Prêt à démarrer votre prochain projet ?
            </h2>
            <p className="text-primary-foreground/80 text-lg max-w-2xl mx-auto mb-10">
              Rejoignez des milliers de professionnels qui utilisent FreeJobGN pour
              transformer leurs idées en réalité.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button variant="hero-outline" size="xl" asChild>
                <Link to="/signup">
                  Créer un Compte Gratuit
                  <ArrowRight size={20} />
                </Link>
              </Button>
              <Button
                variant="ghost"
                size="xl"
                className="text-primary-foreground hover:bg-primary-foreground/10"
                asChild
              >
                <Link to="/projects">Explorer les Projets</Link>
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;
