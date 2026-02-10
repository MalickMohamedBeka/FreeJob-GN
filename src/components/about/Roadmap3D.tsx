import { motion } from "framer-motion";
import { CheckCircle2, Circle, Rocket, Target, Zap, Globe, TrendingUp } from "lucide-react";
import { useState } from "react";

const roadmapData = [
  {
    phase: "Phase 1",
    title: "Lancement & Fondation",
    period: "Q1 2024",
    status: "completed",
    items: [
      "Plateforme web lancée",
      "2,500+ freelancers inscrits",
      "500+ projets complétés",
      "Système de paiement sécurisé"
    ],
    icon: Rocket,
    color: "from-success to-primary"
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
      "Partenariats avec universités"
    ],
    icon: Globe,
    color: "from-primary to-warning"
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
      "Blockchain pour certifications"
    ],
    icon: Zap,
    color: "from-secondary to-primary"
  },
  {
    phase: "Phase 4",
    title: "Domination Mondiale",
    period: "2025",
    status: "future",
    items: [
      "Expansion globale 100+ pays",
      "10,000+ freelancers actifs",
      "Marketplace de services premium",
      "FreeJobGN Academy"
    ],
    icon: Target,
    color: "from-warning to-secondary"
  }
];

const Roadmap3D = () => {
  const [activePhase, setActivePhase] = useState(1);

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-primary" />
      
      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="inline-block mb-4"
          >
            <TrendingUp className="text-primary" size={40} />
          </motion.div>
          <h2 className="text-5xl md:text-6xl font-black mb-4">
            Notre <span className="text-primary">Roadmap</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Le voyage vers l'excellence continue
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="relative max-w-6xl mx-auto">
          {/* Vertical Line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-primary via-secondary to-success hidden lg:block" />

          {/* Phases */}
          <div className="space-y-24">
            {roadmapData.map((phase, index) => {
              const isLeft = index % 2 === 0;
              const isActive = activePhase === index;
              const Icon = phase.icon;

              return (
                <motion.div
                  key={phase.phase}
                  initial={{ opacity: 0, x: isLeft ? -100 : 100, rotateY: isLeft ? -20 : 20 }}
                  whileInView={{ opacity: 1, x: 0, rotateY: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7, delay: index * 0.2 }}
                  onViewportEnter={() => setActivePhase(index)}
                  className={`relative lg:grid lg:grid-cols-2 gap-8 items-center ${
                    isLeft ? "" : "lg:grid-flow-dense"
                  }`}
                >
                  {/* Content Card */}
                  <motion.div
                    whileHover={{ 
                      scale: 1.05, 
                      y: -10,
                      rotateY: isLeft ? 5 : -5,
                      transition: { duration: 0.3 }
                    }}
                    className={`glass rounded-3xl p-8 shadow-elevation-4 border-2 border-white/40 card-3d group relative ${
                      isLeft ? "lg:col-start-1" : "lg:col-start-2"
                    }`}
                  >
                    {/* Status Badge */}
                    <motion.div
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      transition={{ delay: 0.5, type: "spring" }}
                      className={`absolute -top-4 -right-4 px-4 py-2 rounded-full shadow-elevation-3 ${
                        phase.status === "completed" ? "bg-success" :
                        phase.status === "current" ? "bg-primary" :
                        phase.status === "upcoming" ? "bg-secondary" :
                        "bg-muted"
                      } text-white font-bold text-sm`}
                    >
                      {phase.status === "completed" ? "✓ Complété" :
                       phase.status === "current" ? "🔥 En cours" :
                       phase.status === "upcoming" ? "⏳ Bientôt" :
                       "🚀 Futur"}
                    </motion.div>

                    {/* Animated Background */}
                    <motion.div
                      className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${phase.color} opacity-0 group-hover:opacity-20`}
                      animate={{
                        scale: [1, 1.2, 1],
                        rotate: [0, 180, 360],
                      }}
                      transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                    />

                    <div className="relative z-10">
                      {/* Phase Header */}
                      <div className="flex items-center gap-4 mb-6">
                        <motion.div
                          className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${phase.color} flex items-center justify-center shadow-elevation-3`}
                          whileHover={{ rotate: 360, scale: 1.2 }}
                          transition={{ duration: 0.6 }}
                        >
                          <Icon className="text-white" size={32} />
                        </motion.div>
                        <div>
                          <p className="text-sm font-bold text-primary">{phase.phase}</p>
                          <h3 className="text-2xl font-black">{phase.title}</h3>
                          <p className="text-sm text-muted-foreground font-semibold">{phase.period}</p>
                        </div>
                      </div>

                      {/* Items */}
                      <div className="space-y-3">
                        {phase.items.map((item, i) => (
                          <motion.div
                            key={item}
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.6 + i * 0.1 }}
                            whileHover={{ x: 10, scale: 1.05 }}
                            className="flex items-center gap-3 glass rounded-xl p-3"
                          >
                            {phase.status === "completed" ? (
                              <CheckCircle2 className="text-success shrink-0" size={20} />
                            ) : (
                              <Circle className="text-muted-foreground shrink-0" size={20} />
                            )}
                            <span className="font-medium">{item}</span>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </motion.div>

                  {/* Center Icon (Desktop) */}
                  <div className="hidden lg:block absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
                    <motion.div
                      initial={{ scale: 0, rotate: -180 }}
                      whileInView={{ scale: 1, rotate: 0 }}
                      transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                      whileHover={{ scale: 1.3, rotate: 360 }}
                      className={`w-20 h-20 rounded-full bg-gradient-to-br ${phase.color} flex items-center justify-center shadow-elevation-5 border-4 border-background`}
                    >
                      <Icon className="text-white" size={36} />
                    </motion.div>
                  </div>

                  {/* Spacer for alternating layout */}
                  <div className={`hidden lg:block ${isLeft ? "lg:col-start-2" : "lg:col-start-1"}`} />
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="text-center mt-20"
        >
          <motion.div
            whileHover={{ scale: 1.05, y: -5 }}
            className="inline-block glass rounded-3xl p-8 shadow-elevation-4 border-2 border-white/40"
          >
            <h3 className="text-2xl font-bold mb-3">
              Rejoignez l'<span className="text-primary">Aventure</span>
            </h3>
            <p className="text-muted-foreground mb-6">
              Faites partie de la révolution du travail en Afrique
            </p>
            <motion.button
              whileHover={{ scale: 1.1, y: -3 }}
              whileTap={{ scale: 0.95 }}
              className="bg-primary text-white px-8 py-4 rounded-2xl font-bold shadow-elevation-3 hover:shadow-elevation-4"
            >
              Commencer Maintenant
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Roadmap3D;
