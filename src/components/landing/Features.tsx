import { motion } from "framer-motion";
import { Search, Shield, Zap, Globe } from "lucide-react";
import { BentoGrid, BentoGridItem } from "@/components/ui/bento-grid";

const FeatureHeader = ({ gradient }: { gradient: string }) => (
  <div className={`h-full w-full rounded-xl bg-gradient-to-br ${gradient} opacity-80`} />
);

// 4 items: row 1 = span-2 + span-1, row 2 = span-1 + span-2 → perfectly fills a 3-col grid
const features = [
  {
    icon: <Search className="text-primary" size={22} />,
    title: "Trouvez le Talent Idéal",
    description: "Parcourez des milliers de freelancers qualifiés avec filtres par compétence, tarif et localisation. Comparez les profils, avis et tarifs en un coup d'œil.",
    header: <FeatureHeader gradient="from-primary/10 to-secondary/10" />,
    className: "md:col-span-2",
  },
  {
    icon: <Shield className="text-secondary" size={22} />,
    title: "Paiements Sécurisés",
    description: "Fonds bloqués en escrow, libérés uniquement à votre validation.",
    header: <FeatureHeader gradient="from-secondary/10 to-primary/5" />,
    className: "md:col-span-1",
  },
  {
    icon: <Zap className="text-cta" size={22} />,
    title: "Rapidité d'Exécution",
    description: "Recevez des propositions en quelques minutes et démarrez immédiatement.",
    header: <FeatureHeader gradient="from-cta/10 to-cta/5" />,
    className: "md:col-span-1",
  },
  {
    icon: <Globe className="text-primary" size={22} />,
    title: "Talents Locaux & Africains",
    description: "Accédez aux meilleurs profils de Guinée et d'Afrique pour des résultats de qualité mondiale. 0% de commission sur vos revenus, paiement via Mobile Money.",
    header: <FeatureHeader gradient="from-primary/10 to-secondary/10" />,
    className: "md:col-span-2",
  },
];

const Features = () => {
  return (
    <section className="py-20 lg:py-28 bg-muted/40">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Pourquoi choisir <span className="text-secondary">FreeJobGN</span> ?
          </h2>
          <p className="text-muted-foreground text-lg">
            Une plateforme pensée pour connecter les meilleurs talents aux meilleures opportunités.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
        >
          <BentoGrid className="max-w-5xl mx-auto">
            {features.map((feature) => (
              <BentoGridItem
                key={feature.title}
                title={feature.title}
                description={feature.description}
                header={feature.header}
                icon={feature.icon}
                className={feature.className}
              />
            ))}
          </BentoGrid>
        </motion.div>
      </div>
    </section>
  );
};

export default Features;
