import { motion } from "framer-motion";
import { Search, Shield, Zap, Globe } from "lucide-react";

const features = [
  {
    icon: Search,
    title: "Trouvez le Talent Idéal",
    description: "Parcourez des milliers de freelancers qualifiés et trouvez l'expert parfait pour votre projet.",
  },
  {
    icon: Shield,
    title: "Paiements Sécurisés",
    description: "Vos transactions sont protégées. Le freelancer est payé uniquement lorsque vous êtes satisfait.",
  },
  {
    icon: Zap,
    title: "Rapidité d'Exécution",
    description: "Recevez des propositions en quelques minutes et démarrez votre projet immédiatement.",
  },
  {
    icon: Globe,
    title: "Talents Locaux & Internationaux",
    description: "Accédez aux meilleurs talents de Guinée et d'Afrique pour des projets de qualité mondiale.",
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

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.45, ease: "easeOut", delay: index * 0.1 }}
              whileHover={{ y: -6, transition: { duration: 0.2 } }}
              className="group bg-white rounded-xl p-6 border border-border hover:shadow-md transition-shadow cursor-default"
            >
              <div className="w-12 h-12 rounded-lg bg-primary flex items-center justify-center mb-5 transition-transform duration-200 group-hover:scale-110">
                <feature.icon className="text-white" size={22} />
              </div>
              <h3 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors duration-200">
                {feature.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
