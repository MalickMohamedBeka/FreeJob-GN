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
    <section className="py-20 lg:py-28 bg-muted/50">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Pourquoi choisir <span className="text-gradient-hero">FreeJobGN</span> ?
          </h2>
          <p className="text-muted-foreground text-lg">
            Une plateforme pensée pour connecter les meilleurs talents aux meilleures opportunités.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 lg:perspective-container">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ 
                y: -16, 
                scale: 1.05,
                transition: { duration: 0.3 }
              }}
              className="lg:card-3d glass rounded-2xl p-8 shadow-elevation-3 hover:shadow-elevation-5 border border-white/30 group"
            >
              <motion.div 
                className="w-16 h-16 rounded-2xl bg-gradient-hero flex items-center justify-center mb-6 shadow-elevation-2"
                whileHover={{ rotate: 360, scale: 1.1 }}
                transition={{ duration: 0.6 }}
              >
                <feature.icon className="text-white" size={28} />
              </motion.div>
              <h3 className="text-xl font-bold mb-3 group-hover:text-gradient-hero transition-all">
                {feature.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
              
              {/* 3D Accent */}
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-hero opacity-10 blur-2xl rounded-full" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
