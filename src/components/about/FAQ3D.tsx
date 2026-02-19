import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, HelpCircle, MessageCircle, FileText, Coins, Shield, Star, UserCheck, Briefcase, CreditCard, Award, Users, FileCheck } from "lucide-react";
import { useState } from "react";

const faqsClients = [
  {
    q: "Comment recevoir des devis gratuitement ?",
    a: "Publiez votre projet en quelques clics avec une description détaillée. Les freelancers qualifiés vous enverront leurs propositions gratuitement sous 24-48h. Vous recevrez des devis personnalisés avec le budget, le délai et le portfolio de chaque freelancer.",
    icon: FileText,
  },
  {
    q: "Pourquoi choisir la plateforme FreeJobGN ?",
    a: "FreeJobGN est la première plateforme guinéenne dédiée au freelancing avec des talents locaux vérifiés. Nous offrons un système de paiement sécurisé, un support client réactif en français, et des tarifs adaptés au marché local.",
    icon: Award,
  },
  {
    q: "Faut-il signer un contrat avec un freelance ?",
    a: "Oui, nous recommandons fortement de signer un contrat. FreeJobGN génère automatiquement un contrat personnalisé pour chaque projet incluant les livrables, délais, budget et conditions.",
    icon: FileCheck,
  },
  {
    q: "Comment choisir le meilleur freelance ?",
    a: "Consultez le profil complet : portfolio, évaluations clients (note sur 5), nombre de projets réalisés, taux de réussite, et délai moyen de livraison. Lisez les avis détaillés et n'hésitez pas à échanger via notre messagerie.",
    icon: UserCheck,
  },
  {
    q: "Comment payer le freelance sélectionné ?",
    a: "Utilisez notre système d'escrow sécurisé : déposez les fonds sur la plateforme, le freelancer commence le travail, vous validez les livrables, puis les fonds sont libérés. Nous acceptons Mobile Money, cartes bancaires, et virements.",
    icon: CreditCard,
  },
  {
    q: "De quel statut disposent les freelances ?",
    a: "Les freelancers sur FreeJobGN ont différents statuts : Auto-entrepreneur, Micro-entreprise, ou Travailleur indépendant déclaré. Nous vérifions les documents officiels pour garantir la conformité fiscale et légale.",
    icon: Shield,
  },
];

const faqsFreelancers = [
  {
    q: "Pourquoi devenir freelance sur FreeJobGN ?",
    a: "Accédez à des milliers de projets locaux et internationaux, fixez vos propres tarifs, travaillez de n'importe où, et développez votre portfolio. FreeJobGN vous offre une visibilité maximale auprès de 1 200+ clients actifs.",
    icon: Briefcase,
  },
  {
    q: "Quels types de missions retrouve-t-on ?",
    a: "Développement web & mobile, design graphique & UI/UX, rédaction & traduction, marketing digital & SEO, vidéo & animation, consulting IT, data science, et bien plus. Des missions ponctuelles aux contrats long terme.",
    icon: Briefcase,
  },
  {
    q: "Quels sont les avantages du statut de freelance ?",
    a: "Liberté totale : choisissez vos clients, projets et horaires. Revenus illimités basés sur vos compétences. Diversité des projets pour développer vos compétences. Équilibre vie pro/perso optimal.",
    icon: Award,
  },
  {
    q: "Pourquoi choisir FreeJobGN plutôt que d'autres plateformes ?",
    a: "Zéro commission sur les 3 premiers projets ! Ensuite seulement 10% (vs 20% ailleurs). Support client en français et pulaar. Paiements en GNF via Mobile Money. Communauté locale active.",
    icon: Star,
  },
  {
    q: "Comment facturer mes missions ?",
    a: "FreeJobGN génère automatiquement vos factures professionnelles conformes à la législation guinéenne. Choisissez entre facturation horaire ou forfaitaire. Historique complet accessible pour votre comptabilité.",
    icon: Coins,
  },
  {
    q: "Comment s'inscrire en tant que freelance ?",
    a: "Inscription gratuite en 5 minutes : créez votre compte, complétez votre profil, ajoutez votre portfolio (3 projets minimum), et soumettez vos documents d'identité pour la vérification. Validation sous 24h.",
    icon: UserCheck,
  },
];

const FAQItem = ({
  q,
  a,
  icon: Icon,
  index,
}: {
  q: string;
  a: string;
  icon: React.ElementType;
  index: number;
}) => {
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-20px" }}
      transition={{ duration: 0.4, ease: "easeOut" as const, delay: index * 0.06 }}
      className="bg-white border border-border rounded-xl overflow-hidden"
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-5 text-left hover:bg-muted/30 transition-colors"
      >
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
            <Icon className="text-primary" size={16} />
          </div>
          <span className="font-semibold text-sm pr-4">{q}</span>
        </div>
        <motion.div
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.25 }}
          className="shrink-0"
        >
          <ChevronDown size={18} className="text-muted-foreground" />
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" as const }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 pl-14 text-sm text-muted-foreground leading-relaxed border-t border-border pt-4">
              {a}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const FAQ3D = () => {
  const [activeTab, setActiveTab] = useState<"clients" | "freelancers">("clients");

  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, ease: "easeOut" as const }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 text-primary mb-4">
            <HelpCircle size={28} />
          </div>
          <h2 className="text-4xl md:text-5xl font-black mb-4">
            Questions <span className="text-secondary">Fréquentes</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Tout ce que vous devez savoir sur FreeJobGN
          </p>

          {/* Tabs */}
          <div className="flex justify-center gap-3">
            <button
              onClick={() => setActiveTab("clients")}
              className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all ${
                activeTab === "clients"
                  ? "bg-primary text-white shadow-sm"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              <Users size={16} />
              Pour les clients
            </button>
            <button
              onClick={() => setActiveTab("freelancers")}
              className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all ${
                activeTab === "freelancers"
                  ? "bg-primary text-white shadow-sm"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              <Briefcase size={16} />
              Pour les freelances
            </button>
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
            className="max-w-3xl mx-auto space-y-3 mb-16"
          >
            {(activeTab === "clients" ? faqsClients : faqsFreelancers).map((faq, index) => (
              <FAQItem key={faq.q} {...faq} index={index} />
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Contact CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.45, ease: "easeOut" as const }}
          className="text-center bg-muted/40 border border-border rounded-2xl p-10 max-w-2xl mx-auto"
        >
          <MessageCircle className="text-primary mx-auto mb-4" size={32} />
          <h3 className="text-2xl font-bold mb-3">Vous avez d'autres questions ?</h3>
          <p className="text-muted-foreground mb-6">
            Notre équipe est là pour vous aider à réussir sur FreeJobGN
          </p>
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            className="bg-primary text-white px-8 py-3 rounded-xl font-semibold"
          >
            Contactez-nous
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default FAQ3D;
