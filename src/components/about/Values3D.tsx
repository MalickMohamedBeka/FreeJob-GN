import { motion } from "framer-motion";
import { Target, Heart, Globe, Shield } from "lucide-react";

const values = [
  {
    icon: Target,
    title: "Excellence",
    description: "Nous visons la qualité maximale dans chaque interaction sur notre plateforme.",
  },
  {
    icon: Heart,
    title: "Communauté",
    description: "Nous croyons au pouvoir de la communauté et au soutien mutuel entre professionnels.",
  },
  {
    icon: Globe,
    title: "Accessibilité",
    description: "Rendre le freelancing accessible à tous les talents guinéens, partout dans le pays.",
  },
  {
    icon: Shield,
    title: "Confiance",
    description: "Transparence et sécurité sont au cœur de chaque transaction sur FreeJobGN.",
  },
];

const Values3D = () => {
  return (
    <section className="py-24 bg-muted/40">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-black mb-4">
            Nos <span className="text-secondary">Valeurs</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Les principes qui guident chacune de nos actions
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((value, index) => (
            <motion.div
              key={value.title}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.45, ease: "easeOut", delay: index * 0.1 }}
              whileHover={{ y: -6, transition: { duration: 0.2 } }}
              className="group bg-white rounded-2xl p-8 border border-border hover:shadow-md transition-shadow text-center"
            >
              <motion.div
                whileHover={{ rotate: 10, scale: 1.1 }}
                transition={{ duration: 0.25 }}
                className="w-16 h-16 mx-auto mb-5 rounded-xl bg-primary flex items-center justify-center"
              >
                <value.icon className="text-white" size={28} />
              </motion.div>
              <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors duration-200">
                {value.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {value.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Values3D;
