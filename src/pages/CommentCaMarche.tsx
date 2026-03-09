import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import {
  FileText,
  Users,
  Handshake,
  CheckCircle2,
  Shield,
  CreditCard,
  Star,
  ArrowRight,
  Search,
  MessageSquare,
  BadgeCheck,
  Coins,
  ChevronDown,
  Briefcase,
  SendHorizonal,
  Trophy,
  Lock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { TracingBeam } from "@/components/ui/tracing-beam";
import { Spotlight } from "@/components/ui/spotlight";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

// ── Data ──────────────────────────────────────────────────────────────────────

const clientSteps = [
  {
    icon: FileText,
    number: "01",
    title: "Publiez votre projet gratuitement",
    description:
      "Décrivez votre besoin en quelques minutes — titre, description, budget et compétences recherchées. La publication est entièrement gratuite et sans engagement.",
    detail: "Votre annonce est visible par tous les prestataires inscrits dès sa validation.",
  },
  {
    icon: Users,
    number: "02",
    title: "Recevez des propositions qualifiées",
    description:
      "Les freelancers et agences vous envoient leurs devis détaillés avec leur tarif, délai et message de motivation. Comparez tranquillement.",
    detail: "Chaque prestataire dépense un crédit pour vous répondre — seuls les profils sérieux et motivés postulent.",
  },
  {
    icon: Search,
    number: "03",
    title: "Choisissez le meilleur profil",
    description:
      "Consultez les profils, avis clients, classement FreeJobGN et scores de fiabilité. Échangez en messagerie privée avant de vous décider.",
    detail: "Vous pouvez mettre des candidats en liste restreinte et sélectionner celui qui correspond le mieux à vos attentes.",
  },
  {
    icon: Lock,
    number: "04",
    title: "Collaborez en toute sécurité",
    description:
      "Le paiement est sécurisé via notre système d'escrow. Les fonds sont bloqués et libérés uniquement quand vous validez la livraison.",
    detail: "Paiement par Mobile Money (Orange Money, MTN) directement depuis la plateforme.",
  },
  {
    icon: Star,
    number: "05",
    title: "Validez et laissez un avis",
    description:
      "Approuvez la livraison finale, libérez le paiement et notez le prestataire pour aider la communauté.",
    detail: "Votre avis contribue au classement FreeJobGN et aide les futurs clients à choisir.",
  },
];

const freelancerSteps = [
  {
    icon: BadgeCheck,
    number: "01",
    title: "Créez votre profil professionnel",
    description:
      "Présentez vos compétences, spécialité, tarif horaire, expériences et téléchargez vos documents (CV, certifications, portfolio).",
    detail: "Un profil complet est mis en avant dans les résultats de recherche et améliore votre score de classement.",
  },
  {
    icon: Briefcase,
    number: "02",
    title: "Parcourez les projets disponibles",
    description:
      "Consultez les annonces publiées par les clients — filtrez par catégorie, budget ou compétence. De nouveaux projets arrivent chaque jour.",
    detail: "Activez les alertes email premium pour être notifié en premier des projets qui vous correspondent.",
  },
  {
    icon: SendHorizonal,
    number: "03",
    title: "Envoyez une proposition",
    description:
      "Rédigez votre devis avec votre tarif, délai et lettre de motivation personnalisée. Chaque proposition consomme un crédit de votre abonnement.",
    detail: "Les propositions bien rédigées et personnalisées ont 3x plus de chances d'être sélectionnées.",
  },
  {
    icon: Handshake,
    number: "04",
    title: "Décrochez la mission",
    description:
      "Le client choisit votre proposition, confirme le contrat et le paiement est sécurisé en escrow. Vous pouvez démarrer sereinement.",
    detail: "Vous êtes notifié immédiatement par email et notification lorsque votre proposition est sélectionnée.",
  },
  {
    icon: Coins,
    number: "05",
    title: "Livrez et soyez payé",
    description:
      "Livrez votre travail, le client valide et les fonds sont automatiquement transférés dans votre portefeuille FreeJobGN.",
    detail: "Retirez vos gains par Mobile Money à tout moment depuis votre espace portefeuille.",
  },
];

const guarantees = [
  {
    icon: Shield,
    title: "Paiement sécurisé",
    description: "Fonds bloqués en escrow, libérés uniquement à votre validation.",
  },
  {
    icon: BadgeCheck,
    title: "Profils vérifiés",
    description: "Documents, identité et compétences contrôlés par notre équipe.",
  },
  {
    icon: MessageSquare,
    title: "Support réactif",
    description: "Notre équipe répond dans les 24h pour tout litige ou question.",
  },
  {
    icon: Trophy,
    title: "Classement objectif",
    description: "Le score FreeJobGN est calculé sur vos avis, délais et fiabilité réels.",
  },
  {
    icon: CreditCard,
    title: "Mobile Money",
    description: "Paiez et retirez via Orange Money, MTN ou virement bancaire.",
  },
  {
    icon: Star,
    title: "Satisfaction garantie",
    description: "Litige ouvert si la livraison ne correspond pas au devis accepté.",
  },
];

const faqClient = [
  {
    q: "Est-ce gratuit de publier un projet ?",
    a: "Oui, la publication d'un projet est entièrement gratuite et sans engagement. Vous ne payez que lorsque vous choisissez un prestataire et que le contrat démarre.",
  },
  {
    q: "Comment fonctionne le paiement sécurisé ?",
    a: "Quand vous acceptez une proposition, vous effectuez le paiement qui est bloqué en escrow sur la plateforme. Le prestataire ne reçoit les fonds que lorsque vous validez la livraison finale.",
  },
  {
    q: "Que se passe-t-il si je ne suis pas satisfait du travail livré ?",
    a: "Vous pouvez ouvrir un litige depuis votre espace contrats. Notre équipe de support intervient dans les 24h pour trouver une solution entre vous et le prestataire.",
  },
  {
    q: "Combien de temps pour recevoir des propositions ?",
    a: "En général, les premières propositions arrivent dans les 30 minutes suivant la publication. Les projets urgents et bien décrits reçoivent souvent plus de 10 propositions le premier jour.",
  },
  {
    q: "Puis-je contacter un prestataire avant de choisir ?",
    a: "Oui, une messagerie privée est disponible dès qu'un prestataire vous a soumis une proposition. Échangez librement pour clarifier vos attentes avant de vous engager.",
  },
];

const faqFreelancer = [
  {
    q: "Comment fonctionnent les crédits pour postuler ?",
    a: "Chaque proposition soumise consomme 1 crédit. Les crédits sont inclus dans votre abonnement mensuel ou annuel. Sans abonnement actif, vous ne pouvez pas postuler.",
  },
  {
    q: "Quand et comment suis-je payé ?",
    a: "Dès que le client valide votre livraison, les fonds sont transférés dans votre portefeuille FreeJobGN. Vous pouvez ensuite demander un retrait par Mobile Money (Orange Money, MTN).",
  },
  {
    q: "Comment améliorer mon classement FreeJobGN ?",
    a: "Votre score est calculé à partir de vos avis clients, du respect des délais, de la complétion de vos contrats et de l'ancienneté de votre profil. Plus vous livrez des missions de qualité, plus votre score monte.",
  },
  {
    q: "Puis-je postuler sur des projets sans être inscrit ?",
    a: "Non, l'inscription est obligatoire. Mais elle est gratuite et prend moins de 2 minutes. Un abonnement payant est ensuite nécessaire pour débloquer les crédits de proposition.",
  },
  {
    q: "Quelle est la commission prélevée par FreeJobGN ?",
    a: "FreeJobGN ne prélève pas de commission sur vos gains. Le modèle économique repose sur les abonnements des prestataires, pas sur vos revenus.",
  },
];

// ── Step component ──────────────────────────────────────────────────────────

function Step({
  step,
  index,
  isLast,
}: {
  step: (typeof clientSteps)[number];
  index: number;
  isLast: boolean;
}) {
  const Icon = step.icon;
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.45, ease: "easeOut", delay: index * 0.1 }}
      className="flex gap-5"
    >
      {/* Left: number + vertical line */}
      <div className="flex flex-col items-center flex-shrink-0">
        <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center shadow-sm flex-shrink-0">
          <Icon size={22} className="text-white" />
        </div>
        {!isLast && <div className="w-px flex-1 bg-border mt-3 mb-1" />}
      </div>

      {/* Right: content */}
      <div className={`pb-10 ${isLast ? "" : ""}`}>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-bold text-primary/60 uppercase tracking-widest">
            Étape {step.number}
          </span>
        </div>
        <h3 className="text-lg font-bold mb-2">{step.title}</h3>
        <p className="text-muted-foreground text-sm leading-relaxed mb-2">
          {step.description}
        </p>
        <p className="text-xs text-primary/70 bg-primary/5 border border-primary/10 rounded-lg px-3 py-2 leading-relaxed">
          {step.detail}
        </p>
      </div>
    </motion.div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

const CommentCaMarche = () => {
  const [role, setRole] = useState<"client" | "freelancer">("client");

  const steps = role === "client" ? clientSteps : freelancerSteps;
  const faq = role === "client" ? faqClient : faqFreelancer;

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="pt-16">

        {/* ── Hero ── */}
        <section className="relative bg-primary py-20 lg:py-28 overflow-hidden">
          <Spotlight className="-top-40 left-0 md:-top-20 md:left-60" fill="white" />
          <div className="container mx-auto px-4 lg:px-8 text-center relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className="inline-block text-xs font-bold text-white/60 uppercase tracking-widest mb-4">
                Guide de la plateforme
              </span>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-5 leading-tight">
                Comment ça marche ?
              </h1>
              <p className="text-white/75 text-lg max-w-xl mx-auto leading-relaxed">
                FreeJobGN connecte clients et prestataires guinéens en toute simplicité.
                Découvrez le processus selon votre profil.
              </p>
            </motion.div>

            {/* Role toggle */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="mt-10 inline-flex bg-white/10 rounded-full p-1 gap-1"
            >
              {(["client", "freelancer"] as const).map((r) => (
                <button
                  key={r}
                  onClick={() => setRole(r)}
                  className={`px-8 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 ${
                    role === r
                      ? "bg-white text-primary shadow-sm"
                      : "text-white/80 hover:text-white"
                  }`}
                >
                  {r === "client" ? "Je suis client" : "Je suis freelancer"}
                </button>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ── Steps ── */}
        <section className="py-20 lg:py-28 bg-muted/30">
          <div className="container mx-auto px-4 lg:px-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={role}
                initial={{ opacity: 0, x: role === "client" ? -24 : 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: role === "client" ? 24 : -24 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                <div className="text-center mb-12">
                  <h2 className="text-2xl md:text-3xl font-bold mb-3">
                    {role === "client"
                      ? "Comment trouver le bon prestataire"
                      : "Comment décrocher vos premières missions"}
                  </h2>
                  <p className="text-muted-foreground">
                    {role === "client"
                      ? "5 étapes simples pour mener votre projet à bien."
                      : "5 étapes pour développer votre activité sur FreeJobGN."}
                  </p>
                </div>

                <div className="grid lg:grid-cols-2 gap-12 items-start max-w-5xl mx-auto">
                  {/* Steps timeline — wrapped in TracingBeam */}
                  <TracingBeam>
                    <div>
                      {steps.map((step, i) => (
                        <Step
                          key={step.number}
                          step={step}
                          index={i}
                          isLast={i === steps.length - 1}
                        />
                      ))}

                      <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4 }}
                        className="mt-4"
                      >
                        <Button variant="cta" size="lg" className="rounded-full px-10" asChild>
                          <Link to="/signup">
                            {role === "client" ? "Publier un projet" : "Créer mon profil"}
                            <ArrowRight size={18} />
                          </Link>
                        </Button>
                      </motion.div>
                    </div>
                  </TracingBeam>

                  {/* Right sticky mockup */}
                  <div className="hidden lg:block sticky top-24">
                    <motion.div
                      initial={{ opacity: 0, y: 24 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-60px" }}
                      transition={{ duration: 0.5 }}
                    >
                      {/* Browser chrome */}
                      <div className="rounded-2xl border border-border shadow-xl overflow-hidden bg-white">
                        {/* Title bar */}
                        <div className="bg-muted/60 px-4 py-3 flex items-center gap-3 border-b border-border">
                          <div className="flex gap-1.5">
                            <div className="w-3 h-3 rounded-full bg-red-400" />
                            <div className="w-3 h-3 rounded-full bg-yellow-400" />
                            <div className="w-3 h-3 rounded-full bg-green-400" />
                          </div>
                          <div className="flex-1 bg-white rounded-full px-3 py-1 text-xs text-muted-foreground border border-border">
                            {role === "client"
                              ? "freejobgn.site/client/projects/new"
                              : "freejobgn.site/freelancers"}
                          </div>
                        </div>

                        {/* Content */}
                        <div className="p-5">
                          {role === "client" ? (
                            /* Client mockup: project form */
                            <div className="space-y-4">
                              <div>
                                <p className="text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wider">Titre du projet</p>
                                <div className="bg-muted/40 rounded-lg px-3 py-2.5 text-sm text-foreground border border-border">
                                  Application mobile de livraison...
                                </div>
                              </div>
                              <div>
                                <p className="text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wider">Description</p>
                                <div className="bg-muted/40 rounded-lg px-3 py-2.5 text-sm text-muted-foreground border border-border h-16 leading-relaxed">
                                  Nous cherchons un développeur React Native pour...
                                </div>
                              </div>
                              <div className="grid grid-cols-2 gap-3">
                                <div>
                                  <p className="text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wider">Budget</p>
                                  <div className="bg-muted/40 rounded-lg px-3 py-2.5 text-sm border border-border">2 500 000 GNF</div>
                                </div>
                                <div>
                                  <p className="text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wider">Délai</p>
                                  <div className="bg-muted/40 rounded-lg px-3 py-2.5 text-sm border border-border">30 jours</div>
                                </div>
                              </div>
                              <div>
                                <p className="text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wider">Compétences</p>
                                <div className="flex gap-2 flex-wrap">
                                  {["React Native", "Node.js", "Firebase"].map((s) => (
                                    <span key={s} className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full font-medium">{s}</span>
                                  ))}
                                </div>
                              </div>
                              <div className="pt-2">
                                <div className="w-full bg-cta text-white text-sm font-semibold py-2.5 rounded-xl text-center">
                                  Publier le projet gratuitement
                                </div>
                              </div>
                              <div className="flex items-center gap-2 text-xs text-muted-foreground pt-1">
                                <Shield size={12} className="text-secondary" />
                                Votre projet sera visible par 2 500+ freelancers
                              </div>
                            </div>
                          ) : (
                            /* Freelancer mockup: project list + proposal form */
                            <div className="space-y-3">
                              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Projets disponibles</p>
                              {[
                                { title: "App mobile e-commerce", budget: "2 500 000 GNF", tags: ["React Native"], hot: true },
                                { title: "Refonte identité visuelle", budget: "800 000 GNF", tags: ["Figma"], hot: false },
                                { title: "Stratégie SEO & contenu", budget: "500 000 GNF", tags: ["SEO"], hot: false },
                              ].map((proj, i) => (
                                <div key={i} className={`rounded-xl p-3 border ${i === 0 ? "border-primary/40 bg-primary/5" : "border-border bg-muted/20"}`}>
                                  <div className="flex items-start justify-between gap-2 mb-1.5">
                                    <p className="text-xs font-semibold leading-tight">{proj.title}</p>
                                    {proj.hot && <span className="text-[10px] bg-cta text-white px-1.5 py-0.5 rounded-full font-bold flex-shrink-0">Urgent</span>}
                                  </div>
                                  <div className="flex items-center gap-2">
                                    {proj.tags.map((t) => <span key={t} className="text-[10px] bg-muted px-1.5 py-0.5 rounded-full text-muted-foreground">{t}</span>)}
                                    <span className="text-[10px] text-primary font-semibold ml-auto">{proj.budget}</span>
                                  </div>
                                </div>
                              ))}
                              <div className="pt-2 border-t border-border">
                                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Votre proposition</p>
                                <div className="bg-muted/40 rounded-lg px-3 py-2 text-xs text-muted-foreground border border-border mb-2 h-12">
                                  Je suis expert React Native avec 3 ans d'expérience...
                                </div>
                                <div className="w-full bg-primary text-white text-xs font-semibold py-2 rounded-lg text-center">
                                  Envoyer la proposition (1 crédit)
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      <p className="text-xs text-center text-muted-foreground mt-4">
                        Interface réelle — aperçu de la plateforme FreeJobGN
                      </p>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </section>

        {/* ── Guarantees grid ── */}
        <section className="py-20 lg:py-24 bg-white">
          <div className="container mx-auto px-4 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5 }}
              className="text-center max-w-xl mx-auto mb-14"
            >
              <h2 className="text-2xl md:text-3xl font-bold mb-3">
                Nos garanties
              </h2>
              <p className="text-muted-foreground">
                FreeJobGN est conçu pour que chaque transaction soit sûre, transparente et équitable.
              </p>
            </motion.div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-4xl mx-auto">
              {guarantees.map((g, i) => {
                const Icon = g.icon;
                return (
                  <motion.div
                    key={g.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-40px" }}
                    transition={{ duration: 0.4, delay: i * 0.07 }}
                    className="flex gap-4 p-5 rounded-xl border border-border bg-muted/20"
                  >
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Icon size={18} className="text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm mb-1">{g.title}</p>
                      <p className="text-xs text-muted-foreground leading-relaxed">{g.description}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── FAQ ── */}
        <section className="py-20 lg:py-24 bg-muted/30">
          <div className="container mx-auto px-4 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5 }}
              className="text-center max-w-xl mx-auto mb-12"
            >
              <h2 className="text-2xl md:text-3xl font-bold mb-3">
                Questions fréquentes
              </h2>
              <p className="text-muted-foreground">
                Les réponses aux questions les plus posées par les{" "}
                {role === "client" ? "clients" : "prestataires"}.
              </p>
            </motion.div>

            {/* FAQ role toggle */}
            <div className="flex justify-center mb-8">
              <div className="inline-flex bg-muted rounded-full p-1 gap-1">
                {(["client", "freelancer"] as const).map((r) => (
                  <button
                    key={r}
                    onClick={() => setRole(r)}
                    className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                      role === r
                        ? "bg-white shadow-sm text-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {r === "client" ? "Clients" : "Freelancers"}
                  </button>
                ))}
              </div>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={role + "-faq"}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="max-w-2xl mx-auto"
              >
                <Accordion type="single" collapsible className="space-y-2">
                  {faq.map((item, i) => (
                    <AccordionItem
                      key={i}
                      value={`item-${i}`}
                      className="bg-white rounded-xl border border-border px-5 data-[state=open]:border-primary/30"
                    >
                      <AccordionTrigger className="text-sm font-medium text-left py-4 hover:no-underline hover:text-primary [&[data-state=open]]:text-primary">
                        {item.q}
                      </AccordionTrigger>
                      <AccordionContent className="text-sm text-muted-foreground leading-relaxed pb-4">
                        {item.a}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </motion.div>
            </AnimatePresence>
          </div>
        </section>

        {/* ── Final dual CTA ── */}
        <section className="py-20 lg:py-24 bg-white">
          <div className="container mx-auto px-4 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5 }}
              className="text-center mb-12"
            >
              <h2 className="text-2xl md:text-3xl font-bold mb-3">Prêt à commencer ?</h2>
              <p className="text-muted-foreground">
                Rejoignez la communauté FreeJobGN dès aujourd'hui.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-5 max-w-3xl mx-auto">
              {/* Client card */}
              <motion.div
                initial={{ opacity: 0, x: -24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45 }}
                className="rounded-2xl bg-primary p-8 text-white"
              >
                <div className="w-12 h-12 rounded-xl bg-white/15 flex items-center justify-center mb-5">
                  <Briefcase size={22} className="text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2">Je suis client</h3>
                <p className="text-white/75 text-sm mb-6 leading-relaxed">
                  Publiez votre projet gratuitement et recevez des propositions de prestataires qualifiés.
                </p>
                <ul className="space-y-2 mb-8 text-sm">
                  {["Publication gratuite", "Propositions en minutes", "Paiement sécurisé", "Support 24h"].map((item) => (
                    <li key={item} className="flex items-center gap-2 text-white/85">
                      <CheckCircle2 size={14} className="text-white/60 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
                <Button variant="cta" className="w-full rounded-full font-semibold" asChild>
                  <Link to="/signup">Publier un projet <ArrowRight size={16} /></Link>
                </Button>
              </motion.div>

              {/* Freelancer card */}
              <motion.div
                initial={{ opacity: 0, x: 24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45 }}
                className="rounded-2xl border-2 border-primary p-8"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-5">
                  <BadgeCheck size={22} className="text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">Je suis freelancer</h3>
                <p className="text-muted-foreground text-sm mb-6 leading-relaxed">
                  Créez votre profil, postulez sur les projets et développez votre activité.
                </p>
                <ul className="space-y-2 mb-8 text-sm">
                  {["Inscription gratuite", "Missions qualifiées", "Paiement garanti", "Classement objectif"].map((item) => (
                    <li key={item} className="flex items-center gap-2 text-muted-foreground">
                      <CheckCircle2 size={14} className="text-primary flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
                <Button variant="default" className="w-full rounded-full font-semibold" asChild>
                  <Link to="/signup">Créer mon profil <ArrowRight size={16} /></Link>
                </Button>
              </motion.div>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
};

export default CommentCaMarche;
