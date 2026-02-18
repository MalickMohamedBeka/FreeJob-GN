import { motion } from "framer-motion";
import { FileText, Users, Handshake, CheckCircle } from "lucide-react";

const steps = [
  {
    icon: FileText,
    step: "01",
    title: "Publiez votre Projet",
    description: "Décrivez votre besoin, définissez votre budget et les compétences recherchées.",
  },
  {
    icon: Users,
    step: "02",
    title: "Recevez des Propositions",
    description: "Des freelancers qualifiés vous envoient leurs propositions détaillées.",
  },
  {
    icon: Handshake,
    step: "03",
    title: "Choisissez & Collaborez",
    description: "Sélectionnez le meilleur profil et travaillez ensemble efficacement.",
  },
  {
    icon: CheckCircle,
    step: "04",
    title: "Validez & Payez",
    description: "Approuvez le travail livré et effectuez le paiement en toute sécurité.",
  },
];

const HowItWorks = () => {
  return (
    <section className="py-20 lg:py-28 bg-white">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Comment ça <span className="text-secondary">marche</span> ?
          </h2>
          <p className="text-muted-foreground text-lg">
            Un processus simple et efficace en 4 étapes.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={step.step}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.45, ease: "easeOut", delay: index * 0.12 }}
              className="group relative text-center"
            >
              {/* Connector line */}
              {index < steps.length - 1 && (
                <motion.div
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.12 + 0.4, ease: "easeOut" }}
                  style={{ transformOrigin: "left" }}
                  className="hidden lg:block absolute top-8 left-[60%] w-[80%] h-px bg-border"
                />
              )}

              <div className="w-16 h-16 rounded-2xl bg-primary mx-auto mb-5 flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-hover:shadow-md">
                <step.icon className="text-white" size={26} />
              </div>

              <span className="inline-block text-xs font-bold text-primary tracking-widest uppercase px-3 py-1 rounded-full bg-primary/10 mb-3">
                Étape {step.step}
              </span>

              <h3 className="text-lg font-bold mt-3 mb-2 group-hover:text-primary transition-colors duration-200">
                {step.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
