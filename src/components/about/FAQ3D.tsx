import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, HelpCircle, MessageCircle, FileText, Coins, Shield, Globe, Star, UserCheck, Briefcase, CreditCard, Award, Users, FileCheck } from "lucide-react";
import { useState } from "react";

const faqsClients = [
  {
    q: "Comment recevoir des devis gratuitement ?",
    a: "Publiez votre projet en quelques clics avec une description d\u00e9taill\u00e9e. Les freelancers qualifi\u00e9s vous enverront leurs propositions gratuitement sous 24-48h. Vous recevrez des devis personnalis\u00e9s avec le budget, le d\u00e9lai et le portfolio de chaque freelancer.",
    icon: FileText
  },
  {
    q: "Pourquoi choisir la plateforme FreeJobGN ?",
    a: "FreeJobGN est la premi\u00e8re plateforme guin\u00e9enne d\u00e9di\u00e9e au freelancing avec des talents locaux v\u00e9rifi\u00e9s. Nous offrons un syst\u00e8me de paiement s\u00e9curis\u00e9, un support client r\u00e9actif en fran\u00e7ais, et des tarifs adapt\u00e9s au march\u00e9 local. Plus de 2,500 freelancers qualifi\u00e9s sont pr\u00eats \u00e0 r\u00e9aliser vos projets.",
    icon: Award
  },
  {
    q: "Faut-il signer un contrat avec un freelance ?",
    a: "Oui, nous recommandons fortement de signer un contrat. FreeJobGN g\u00e9n\u00e8re automatiquement un contrat personnalis\u00e9 pour chaque projet incluant les livrables, d\u00e9lais, budget et conditions. Ce document prot\u00e8ge les deux parties et peut \u00eatre sign\u00e9 \u00e9lectroniquement sur la plateforme.",
    icon: FileCheck
  },
  {
    q: "Comment choisir le meilleur freelance ?",
    a: "Consultez le profil complet : portfolio, \u00e9valuations clients (note sur 5), nombre de projets r\u00e9alis\u00e9s, taux de r\u00e9ussite, et d\u00e9lai moyen de livraison. Lisez les avis d\u00e9taill\u00e9s, v\u00e9rifiez les badges de certification, et n'h\u00e9sitez pas \u00e0 \u00e9changer via notre messagerie avant de valider.",
    icon: UserCheck
  },
  {
    q: "Comment payer le freelance s\u00e9lectionn\u00e9 ?",
    a: "Utilisez notre syst\u00e8me d'escrow s\u00e9curis\u00e9 : d\u00e9posez les fonds sur la plateforme, le freelancer commence le travail, vous validez les livrables, puis les fonds sont lib\u00e9r\u00e9s. Nous acceptons Mobile Money (Orange Money, MTN), cartes bancaires, et virements. Commission de 5% sur chaque transaction.",
    icon: CreditCard
  },
  {
    q: "De quel statut disposent les freelances ?",
    a: "Les freelancers sur FreeJobGN ont diff\u00e9rents statuts : Auto-entrepreneur, Micro-entreprise, ou Travailleur ind\u00e9pendant d\u00e9clar\u00e9. Chaque profil affiche le statut l\u00e9gal du freelancer. Nous v\u00e9rifions les documents officiels pour garantir la conformit\u00e9 fiscale et l\u00e9gale.",
    icon: Shield
  },
];

const faqsFreelancers = [
  {
    q: "Pourquoi devenir freelance sur FreeJobGN ?",
    a: "Acc\u00e9dez \u00e0 des milliers de projets locaux et internationaux, fixez vos propres tarifs, travaillez de n'importe o\u00f9, et d\u00e9veloppez votre portfolio. FreeJobGN vous offre une visibilit\u00e9 maximale aupr\u00e8s de 1,200+ clients actifs, un syst\u00e8me de paiement s\u00e9curis\u00e9, et des outils de gestion de projet professionnels.",
    icon: Briefcase
  },
  {
    q: "Quels types de missions retrouve-t-on ?",
    a: "D\u00e9veloppement web & mobile, design graphique & UI/UX, r\u00e9daction & traduction, marketing digital & SEO, vid\u00e9o & animation, consulting IT, data science, et bien plus. Des missions ponctuelles (quelques heures) aux contrats long terme (plusieurs mois). Budget moyen : 500 \u00e0 5,000 USD.",
    icon: Briefcase
  },
  {
    q: "Quels sont les avantages du statut de freelance ?",
    a: "Libert\u00e9 totale : choisissez vos clients, projets et horaires. Revenus illimit\u00e9s bas\u00e9s sur vos comp\u00e9tences. Pas de trajet domicile-travail. Diversit\u00e9 des projets pour d\u00e9velopper vos comp\u00e9tences. \u00c9quilibre vie pro/perso optimal. Possibilit\u00e9 de travailler avec des clients internationaux et d'\u00eatre pay\u00e9 en devises.",
    icon: Award
  },
  {
    q: "Pourquoi choisir FreeJobGN plut\u00f4t que d'autres plateformes ?",
    a: "Z\u00e9ro commission sur les 3 premiers projets ! Ensuite seulement 10% (vs 20% ailleurs). Support client en fran\u00e7ais et pulaar. Paiements en GNF via Mobile Money. Communaut\u00e9 locale active avec \u00e9v\u00e9nements networking. Formation gratuite pour am\u00e9liorer votre profil. Priorit\u00e9 aux talents guin\u00e9ens.",
    icon: Star
  },
  {
    q: "Comment facturer mes missions ?",
    a: "FreeJobGN g\u00e9n\u00e8re automatiquement vos factures professionnelles conformes \u00e0 la l\u00e9gislation guin\u00e9enne. Choisissez entre facturation horaire ou forfaitaire. La plateforme calcule les taxes, g\u00e9n\u00e8re le PDF, et l'envoie au client. Historique complet accessible pour votre comptabilit\u00e9.",
    icon: Coins
  },
  {
    q: "Comment s'inscrire en tant que freelance ?",
    a: "Inscription gratuite en 5 minutes : cr\u00e9ez votre compte, compl\u00e9tez votre profil (bio, comp\u00e9tences, tarif horaire), ajoutez votre portfolio (3 projets minimum), passez un test de comp\u00e9tences (optionnel mais recommand\u00e9), et soumettez vos documents d'identit\u00e9 pour la v\u00e9rification. Validation sous 24h.",
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
          <div className="inline-block mb-4">
            <HelpCircle className="text-primary" size={32} />
          </div>
          <h2 className="text-5xl font-black mb-4">
            Questions <span className="text-primary">Fr&eacute;quentes</span>
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
          <div className="inline-block mb-4">
            <MessageCircle className="text-primary" size={40} />
          </div>
          <h3 className="text-3xl font-bold mb-4 relative">
            Vous avez d'autres questions ?
          </h3>
          <p className="text-muted-foreground mb-6 relative">
            Notre \u00e9quipe est l\u00e0 pour vous aider \u00e0 r\u00e9ussir sur FreeJobGN
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
