import { motion } from "framer-motion";
import { Rocket, TrendingUp, Zap, Clock, Tag, ArrowRight } from "lucide-react";
import { Spotlight } from "@/components/ui/spotlight";

const mockProjects = [
  {
    title: "Développement d'une app mobile e-commerce",
    client: "TechShop GN",
    budget: "2 500 000 GNF",
    deadline: "30 jours",
    tags: ["React Native", "Node.js"],
    proposals: 8,
    color: "border-l-primary",
  },
  {
    title: "Refonte identité visuelle — startup fintech",
    client: "MoneyGo",
    budget: "800 000 GNF",
    deadline: "14 jours",
    tags: ["Figma", "Branding"],
    proposals: 5,
    color: "border-l-secondary",
  },
  {
    title: "Stratégie marketing digital & campagnes Meta",
    client: "Marché Conakry",
    budget: "600 000 GNF",
    deadline: "21 jours",
    tags: ["SEO", "Meta Ads"],
    proposals: 12,
    color: "border-l-cta",
  },
];

const ProjectsHero3D = () => {
  return (
    <div className="relative bg-primary py-16 lg:py-20 overflow-hidden">
      <Spotlight className="-top-40 -right-40 md:-top-20 md:-right-20" fill="white" />
      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-10 items-center">

          {/* Left — text + stats */}
          <div className="text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-white text-sm font-semibold mb-6">
                <Zap size={14} />
                +150 Nouveaux Projets ce Mois
                <TrendingUp size={14} />
              </div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.05 }}
              className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight"
            >
              Projets &
              <br />
              <span className="text-secondary">Opportunités</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="text-white/75 text-lg max-w-lg mx-auto lg:mx-0 mb-8"
            >
              Découvrez des missions uniques publiées par des clients guinéens et africains.
              Filtrez, postulez et développez votre activité.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.25 }}
              className="grid grid-cols-3 gap-3 max-w-sm mx-auto lg:mx-0"
            >
              {[
                { icon: Rocket, value: "500+", label: "Projets Actifs" },
                { icon: Zap, value: "2 500+", label: "Freelancers" },
                { icon: TrendingUp, value: "98%", label: "Satisfaction" },
              ].map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.35, delay: 0.35 + i * 0.07 }}
                  className="bg-white/10 rounded-xl p-3 text-center"
                >
                  <stat.icon size={16} className="text-white/60 mx-auto mb-1" />
                  <p className="text-lg font-bold text-white leading-tight">{stat.value}</p>
                  <p className="text-xs text-white/60 mt-0.5">{stat.label}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Right — stacked project cards */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
            className="hidden lg:flex flex-col gap-3"
          >
            {mockProjects.map((p, i) => (
              <motion.div
                key={p.title}
                initial={{ opacity: 0, x: 28 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.45, delay: 0.25 + i * 0.12, ease: "easeOut" }}
                style={{ marginLeft: i === 1 ? "1.5rem" : "0" }}
                className={`bg-white rounded-2xl p-4 shadow-lg border-l-4 ${p.color} max-w-sm`}
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <p className="font-semibold text-sm text-foreground leading-snug line-clamp-1">{p.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">Client : {p.client}</p>
                  </div>
                  <ArrowRight size={14} className="text-muted-foreground flex-shrink-0 mt-0.5" />
                </div>

                <div className="flex gap-1 mb-3">
                  {p.tags.map((t) => (
                    <span key={t} className="text-[10px] px-1.5 py-0.5 bg-muted rounded-full text-muted-foreground">
                      {t}
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1 font-semibold text-foreground">
                    <Tag size={10} />
                    {p.budget}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock size={10} />
                    {p.deadline}
                  </span>
                  <span className="flex items-center gap-1 text-primary font-medium">
                    <Rocket size={10} />
                    {p.proposals} propositions
                  </span>
                </div>
              </motion.div>
            ))}

            {/* New project badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.65 }}
              className="self-start bg-white/20 border border-white/30 text-white rounded-full px-4 py-2 text-xs font-semibold flex items-center gap-2"
            >
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              Nouveau projet publié il y a 3 minutes
            </motion.div>
          </motion.div>

        </div>
      </div>
    </div>
  );
};

export default ProjectsHero3D;
