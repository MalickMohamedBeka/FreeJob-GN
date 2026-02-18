import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const CTASection = () => {
  return (
    <section className="py-20 lg:py-28 bg-white">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.55, ease: "easeOut" }}
          className="rounded-2xl bg-primary p-12 md:p-16 text-center"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
            Prêt à démarrer votre prochain projet ?
          </h2>
          <p className="text-white/80 text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
            Rejoignez des milliers de professionnels qui utilisent FreeJobGN pour
            transformer leurs idées en réalité.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
              <Button variant="cta" size="xl" asChild>
                <Link to="/signup">
                  Créer un Compte Gratuit
                  <ArrowRight size={20} />
                </Link>
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
              <Button
                variant="ghost"
                size="xl"
                className="text-white hover:bg-white/10"
                asChild
              >
                <Link to="/projects">Explorer les Projets</Link>
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;
