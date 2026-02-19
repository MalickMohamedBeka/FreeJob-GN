import { motion } from "framer-motion";
import { CheckCircle2, Circle, Rocket, Target, Zap, Globe, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";

const roadmapData = [
  {
    phase: "Phase 1",
    title: "Lancement & Fondation",
    period: "Q1 2024",
    status: "completed",
    items: [
      "Plateforme web lancée",
      "2 500+ freelancers inscrits",
      "500+ projets complétés",
      "Système de paiement sécurisé",
    ],
    icon: Rocket,
  },
  {
    phase: "Phase 2",
    title: "Expansion Régionale",
    period: "Q2-Q3 2024",
    status: "current",
    items: [
      "Application mobile iOS & Android",
      "Expansion dans 10 pays africains",
      "Programme de formation freelance",
      "Partenariats avec universités",
    ],
    icon: Globe,
  },
  {
    phase: "Phase 3",
    title: "Innovation & IA",
    period: "Q4 2024",
    status: "upcoming",
    items: [
      "Matching IA freelancer-projet",
      "Traduction automatique 20+ langues",
      "Système de recommandation avancé",
      "Blockchain pour certifications",
    ],
    icon: Zap,
  },
  {
    phase: "Phase 4",
    title: "Domination Mondiale",
    period: "2025",
    status: "future",
    items: [
      "Expansion globale 100+ pays",
      "10 000+ freelancers actifs",
      "Marketplace de services premium",
      "FreeJobGN Academy",
    ],
    icon: Target,
  },
];

const statusConfig = {
  completed: { label: "✓ Complété", className: "bg-success text-white" },
  current: { label: "En cours", className: "bg-primary text-white" },
  upcoming: { label: "Bientôt", className: "bg-secondary text-white" },
  future: { label: "Futur", className: "bg-muted text-muted-foreground" },
};

const Roadmap3D = () => {
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, ease: "easeOut" as const }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-2 text-primary mb-4">
            <TrendingUp size={28} />
          </div>
          <h2 className="text-4xl md:text-5xl font-black mb-4">
            Notre <span className="text-secondary">Roadmap</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Le voyage vers l'excellence continue
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto space-y-6">
          {roadmapData.map((phase, index) => {
            const Icon = phase.icon;
            const config = statusConfig[phase.status as keyof typeof statusConfig];
            return (
              <motion.div
                key={phase.phase}
                initial={{ opacity: 0, x: index % 2 === 0 ? -32 : 32 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.45, ease: "easeOut" as const, delay: index * 0.1 }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="bg-white rounded-2xl border border-border p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center shrink-0">
                    <Icon className="text-white" size={22} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                        {phase.phase} · {phase.period}
                      </span>
                      <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${config.className}`}>
                        {config.label}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold mb-3">{phase.title}</h3>
                    <div className="grid sm:grid-cols-2 gap-2">
                      {phase.items.map((item) => (
                        <div key={item} className="flex items-center gap-2 text-sm text-muted-foreground">
                          {phase.status === "completed" ? (
                            <CheckCircle2 className="text-success shrink-0" size={15} />
                          ) : (
                            <Circle className="text-border shrink-0" size={15} />
                          )}
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.45, ease: "easeOut" as const, delay: 0.3 }}
          className="text-center mt-14"
        >
          <Link
            to="/signup"
            className="inline-flex items-center gap-2 bg-primary text-white px-8 py-3 rounded-xl font-semibold hover:bg-primary/90 transition-colors"
          >
            Rejoindre l'Aventure
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default Roadmap3D;
