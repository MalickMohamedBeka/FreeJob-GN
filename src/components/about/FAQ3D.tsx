import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, HelpCircle, MessageCircle, FileText, Coins, Shield, Globe, Star, UserCheck, Briefcase, CreditCard, Award, Users, MessageSquare, FileCheck } from "lucide-react";
import { useState } from "react";

const faqsClients = [
  { 
    q: "Comment recevoir des devis gratuitement ?", 
    a: "Publiez votre projet en quelques clics avec une description détaillée. Les freelancers qualifiés vous enverront leurs propositions gratuitement sous 24-48h. Vous recevrez des devis personnalisés avec le budget, le délai et le portfolio de chaque freelancer.", 
    icon: FileText 
  },
  { 
    q: "Pourquoi choisir la plateforme FreeJobGN ?", 
    a: "FreeJobGN est la première plateforme guinéenne dédiée au freelancing avec des talents locaux vérifiés. Nous offrons un système de paiement sécurisé, un support client réactif en français, et des tarifs adaptés au marché local. Plus de 2,500 freelancers qualifiés sont prêts à réaliser vos projets.", 
    icon: Award 
  },
  { 
    q: "Faut-il signer un contrat avec un freelance ?", 
    a: "Oui, nous recommandons fortement de signer un contrat. FreeJobGN génère automatiquement un contrat personnalisé pour chaque projet incluant les livrables, délais, budget et conditions. Ce document protège les deux parties et peut être signé électroniquement sur la plateforme.", 
    icon: FileCheck 
  },
  { 
    q: "Comment choisir le meilleur freelance ?", 
    a: "Consultez le profil complet : portfolio, évaluations clients (note sur 5), nombre de projets réalisés, taux de réussite, et délai moyen de livraison. Lisez les avis détaillés, vérifiez les badges de certification, et n'hésitez pas à échanger via notre messagerie avant de valider.", 
    icon: UserCheck 
  },
  { 
    q: "Comment payer le freelance sélectionné ?", 
    a: "Utilisez notre système d'escrow sécurisé : déposez les fonds sur la plateforme, le freelancer commence le travail, vous validez les livrables, puis les fonds sont libérés. Nous acceptons Mobile Money (Orange Money, MTN), cartes bancaires, et virements. Commission de 5% sur chaque transaction.", 
    icon: CreditCard 
  },
  { 
    q: "De quel statut disposent les freelances ?", 
    a: "Les freelancers sur FreeJobGN ont différents statuts : Auto-entrepreneur, Micro-entreprise, ou Travailleur indépendant déclaré. Chaque profil affiche le statut légal du freelancer. Nous vérifions les documents officiels pour garantir la conformité fiscale et légale.", 
    icon: Shield 
  },
];

const faqsFreelancers = [
  { 
    q: "Pourquoi devenir freelance sur FreeJobGN ?", 
    a: "Accédez à des milliers de projets locaux et internationaux, fixez vos propres tarifs, travaillez de n'importe où, et développez votre portfolio. FreeJobGN vous offre une visibilité maximale auprès de 1,200+ clients actifs, un système de paiement sécurisé, et des outils de gestion de projet professionnels.", 
    icon: Briefcase 
  },
  { 
    q: "Quels types de missions retrouve-t-on ?", 
    a: "Développement web & mobile, design graphique & UI/UX, rédaction & traduction, marketing digital & SEO, vidéo & animation, consulting IT, data science, et bien plus. Des missions ponctuelles (quelques heures) aux contrats long terme (plusieurs mois). Budget moyen : 500 à 5,000 USD.", 
    icon: Briefcase 
  },
  { 
    q: "Quels sont les avantages du statut de freelance ?", 
    a: "Liberté totale : choisissez vos clients, projets et horaires. Revenus illimités basés sur vos compétences. Pas de trajet domicile-travail. Diversité des projets pour développer vos compétences. Équilibre vie pro/perso optimal. Possibilité de travailler avec des clients internationaux et d'être payé en devises.", 
    icon: Award 
  },
  { 
    q: "Pourquoi choisir FreeJobGN plutôt que d'autres plateformes ?", 
    a: "Zéro commission sur les 3 premiers projets ! Ensuite seulement 10% (vs 20% ailleurs). Support client en français et pulaar. Paiements en GNF via Mobile Money. Communauté locale active avec événements networking. Formation gratuite pour améliorer votre profil. Priorité aux talents guinéens.", 
    icon: Star 
  },
  { 
    q: "Comment facturer mes missions ?", 
    a: "FreeJobGN génère automatiquement vos factures professionnelles conformes à la législation guinéenne. Choisissez entre facturation horaire ou forfaitaire. La plateforme calcule les taxes, génère le PDF, et l'envoie au client. Historique complet accessible pour votre comptabilité.", 
    icon: Coins 
  },
  { 
    q: "Comment s'inscrire en tant que freelance ?", 
    a: "Inscription gratuite en 5 minutes : créez votre compte, complétez votre profil (bio, compétences, tarif horaire), ajoutez votre portfolio (3 projets minimum), passez un test de compétences (optionnel mais recommandé), et soumettez vos documents d'identité pour la vérification. Validation sous 24h.", 
    icon: UserCheck 
  },
];

const FAQItem = ({ q, a, icon: Icon, index }: { q: string; a: string; icon: any; index: number }) => {
  const [open, setOpen] = useState(false);
  
  return (
    <motion.div
      initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      whileHover={{ scale: 1.02, y: -5 }}
      className="glass rounded-2xl overflow-hidden shadow-elevation-3 border-2 border-white/40 group"
    >
      <motion.button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-6 text-left"
      >
        <motion.div 
          className="mr-4 p-3 rounded-xl bg-primary items-center justify-center"
          animate={{ rotate: open ? 360 : 0 }}
          transition={{ duration: 0.5 }}
        >
          <Icon className="text-white" size={24} />
        </motion.div>
        <span className="font-bold text-lg pr-4 flex-1 group-hover:text-primary transition-colors">{q}</span>
        <motion.div 
          animate={{ rotate: open ? 180 : 0 }} 
          className="shrink-0 p-2 rounded-lg bg-muted/50"
        >
          <ChevronDown size={20} />
        </motion.div>
      </motion.button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6 pl-20">
              <p className="text-muted-foreground leading-relaxed">{a}</p>
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
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5" />
      
      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="inline-block mb-4"
          >
            <HelpCircle className="text-primary" size={32} />
          </motion.div>
          <h2 className="text-5xl font-black mb-4">
            Questions <span className="text-primary">Fréquentes</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Tout ce que vous devez savoir sur FreeJobGN
          </p>

          {/* Tabs */}
          <div className="flex justify-center gap-4 mb-12">
            <motion.button
              onClick={() => setActiveTab("clients")}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-8 py-4 rounded-2xl font-bold text-lg transition-all shadow-elevation-3 ${
                activeTab === "clients"
                  ? "bg-primary text-white"
                  : "glass border-2 border-white/40"
              }`}
            >
              <Users className="inline-block mr-2" size={20} />
              Pour les clients
            </motion.button>
            <motion.button
              onClick={() => setActiveTab("freelancers")}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-8 py-4 rounded-2xl font-bold text-lg transition-all shadow-elevation-3 ${
                activeTab === "freelancers"
                  ? "bg-primary text-white"
                  : "glass border-2 border-white/40"
              }`}
            >
              <Briefcase className="inline-block mr-2" size={20} />
              Pour les freelances
            </motion.button>
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: activeTab === "clients" ? -50 : 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: activeTab === "clients" ? 50 : -50 }}
            transition={{ duration: 0.4 }}
            className="max-w-4xl mx-auto space-y-4 mb-16"
          >
            {(activeTab === "clients" ? faqsClients : faqsFreelancers).map((faq, index) => (
              <FAQItem key={index} {...faq} index={index} />
            ))}
          </motion.div>
        </AnimatePresence>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="text-center glass rounded-3xl p-12 shadow-elevation-4 border-2 border-white/40 max-w-3xl mx-auto relative overflow-hidden"
        >
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20"
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 180, 360],
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          />
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            className="inline-block mb-4"
          >
            <MessageCircle className="text-primary" size={40} />
          </motion.div>
          <h3 className="text-3xl font-bold mb-4 relative">
            Vous avez d'autres questions ?
          </h3>
          <p className="text-muted-foreground mb-6 relative">
            Notre équipe est là pour vous aider à réussir sur FreeJobGN
          </p>
          <motion.button
            whileHover={{ scale: 1.05, y: -5 }}
            whileTap={{ scale: 0.95 }}
            className="btn-3d bg-primary text-white px-8 py-4 rounded-xl font-bold shadow-elevation-3 relative"
          >
            Contactez-nous
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default FAQ3D;
