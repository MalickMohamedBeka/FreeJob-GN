import { motion } from "framer-motion";
import { Building2, Globe, Star, TrendingUp, CheckCircle, Users, LayoutGrid } from "lucide-react";
import { Spotlight } from "@/components/ui/spotlight";
import { usePublicStats } from "@/hooks/useAuth";

const mockAgencies = [
  {
    initials: "TG",
    name: "TechGroup GN",
    title: "Développement Web & Mobile",
    tags: ["React", "Django"],
    rate: "120 000 GNF/h",
    bg: "bg-primary",
  },
  {
    initials: "DC",
    name: "DesignCraft",
    title: "Branding & Design",
    tags: ["Figma", "Branding"],
    rate: "90 000 GNF/h",
    bg: "bg-secondary",
  },
  {
    initials: "MG",
    name: "MarketGo",
    title: "Marketing Digital",
    tags: ["SEO", "Meta Ads"],
    rate: "80 000 GNF/h",
    bg: "bg-cta",
  },
];

const AgenciesHero3D = () => {
  const { data: stats } = usePublicStats();
  const s = (val: number | undefined) => val != null ? `${val}+` : "…";

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
                <Building2 size={14} />
                {s(stats?.agencies_count)} Agences Certifiées
              </div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.05 }}
              className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight"
            >
              Agences Africaines
              <br />
              <span className="text-secondary">d'Excellence</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="text-white/75 text-lg max-w-lg mx-auto lg:mx-0 mb-8"
            >
              Confiez vos projets à des agences guinéennes et africaines certifiées.
              Équipes expertes, résultats garantis.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.25 }}
              className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4 gap-3 max-w-lg mx-auto lg:mx-0"
            >
              {[
                { icon: Building2,  value: s(stats?.agencies_count),   label: "Agences" },
                { icon: Globe,      value: s(stats?.clients_count),     label: "Clients" },
                { icon: Star,       value: "4.9/5",                     label: "Note Moyenne" },
                { icon: LayoutGrid, value: s(stats?.providers_count),   label: "Prestataires" },
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

          {/* Right — floating agency cards */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
            className="hidden lg:flex flex-col gap-3"
          >
            {mockAgencies.map((p, i) => (
              <motion.div
                key={p.name}
                initial={{ opacity: 0, x: 32 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.45, delay: 0.25 + i * 0.12, ease: "easeOut" }}
                style={{ marginLeft: i === 1 ? "2rem" : i === 2 ? "1rem" : "0" }}
                className="bg-white rounded-2xl p-4 shadow-lg flex items-center gap-4 max-w-sm"
              >
                <div className={`w-12 h-12 rounded-xl ${p.bg} flex items-center justify-center text-white font-bold text-sm flex-shrink-0`}>
                  {p.initials}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <span className="font-semibold text-sm text-foreground truncate">{p.name}</span>
                    <CheckCircle size={12} className="text-secondary flex-shrink-0" />
                  </div>
                  <p className="text-xs text-muted-foreground truncate mb-1.5">{p.title}</p>
                  <div className="flex gap-1">
                    {p.tags.map((t) => (
                      <span key={t} className="text-[10px] px-1.5 py-0.5 bg-muted rounded-full text-muted-foreground">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-xs font-bold text-primary">{p.rate}</p>
                </div>
              </motion.div>
            ))}

            {/* Floating badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.65 }}
              className="self-start ml-4 bg-white/20 border border-white/30 text-white rounded-full px-4 py-2 text-xs font-semibold flex items-center gap-2"
            >
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              {stats?.agencies_count ?? "…"} agences inscrites
            </motion.div>
          </motion.div>

        </div>
      </div>
    </div>
  );
};

export default AgenciesHero3D;
