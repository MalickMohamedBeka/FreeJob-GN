import { motion } from "framer-motion";
import { Target, Heart, Globe, Shield, ChevronDown } from "lucide-react";
import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const values = [
  { icon: Target, title: "Excellence", description: "Nous visons la qualité maximale dans chaque interaction sur notre plateforme." },
  { icon: Heart, title: "Communauté", description: "Nous croyons au pouvoir de la communauté et au soutien mutuel entre professionnels." },
  { icon: Globe, title: "Accessibilité", description: "Rendre le freelancing accessible à tous les talents guinéens, partout dans le pays." },
  { icon: Shield, title: "Confiance", description: "Transparence et sécurité sont au cœur de chaque transaction sur FreeJobGN." },
];

const faqs = [
  { q: "Comment fonctionne FreeJobGN ?", a: "FreeJobGN connecte des clients qui ont des projets avec des freelancers talentueux. Publiez un projet, recevez des propositions, choisissez le meilleur profil, et collaborez efficacement." },
  { q: "Est-ce gratuit de s'inscrire ?", a: "Oui ! L'inscription est 100% gratuite pour les freelancers et les clients. Nous prélevons une petite commission uniquement sur les transactions réussies." },
  { q: "Comment sont protégés les paiements ?", a: "Les paiements sont sécurisés via un système d'escrow. L'argent est bloqué jusqu'à ce que le client approuve le travail livré." },
  { q: "Puis-je travailler avec des clients internationaux ?", a: "Absolument ! FreeJobGN est ouvert à tous. Vous pouvez collaborer avec des clients locaux et internationaux." },
  { q: "Comment choisir le bon freelancer ?", a: "Consultez les profils, les évaluations, les portfolios et les avis. Vous pouvez aussi discuter avec les freelancers avant de les engager." },
];

const FAQItem = ({ q, a }: { q: string; a: string }) => {
  const [open, setOpen] = useState(false);
  return (
    <motion.div
      className="border border-border rounded-xl overflow-hidden"
      initial={false}
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-5 text-left hover:bg-muted/50 transition-colors"
      >
        <span className="font-semibold pr-4">{q}</span>
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown size={20} className="text-muted-foreground shrink-0" />
        </motion.div>
      </button>
      <motion.div
        initial={false}
        animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="overflow-hidden"
      >
        <p className="px-5 pb-5 text-muted-foreground leading-relaxed">{a}</p>
      </motion.div>
    </motion.div>
  );
};

const About = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-24 pb-16">
        {/* Hero */}
        <section className="py-16 lg:py-24">
          <div className="container mx-auto px-4 lg:px-8 text-center max-w-3xl">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Construire l'avenir du{" "}
                <span className="text-gradient-hero">travail en Guinée</span>
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed">
                FreeJobGN est né d'une vision simple : donner à chaque talent guinéen la possibilité
                de travailler sur des projets passionnants, localement et à l'international.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Values */}
        <section className="py-16 bg-muted/50">
          <div className="container mx-auto px-4 lg:px-8">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl font-bold text-center mb-12"
            >
              Nos <span className="text-gradient-hero">Valeurs</span>
            </motion.h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((value, index) => (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-card rounded-xl p-6 border border-border/50 text-center"
                >
                  <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <value.icon className="text-primary" size={28} />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{value.title}</h3>
                  <p className="text-sm text-muted-foreground">{value.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-16 lg:py-24">
          <div className="container mx-auto px-4 lg:px-8 max-w-3xl">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl font-bold text-center mb-12"
            >
              Questions <span className="text-gradient-hero">Fréquentes</span>
            </motion.h2>
            <div className="space-y-3">
              {faqs.map((faq) => (
                <FAQItem key={faq.q} q={faq.q} a={faq.a} />
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default About;
