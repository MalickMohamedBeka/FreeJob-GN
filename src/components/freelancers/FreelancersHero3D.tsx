import { motion } from "framer-motion";
import { Users, Globe, Star, TrendingUp, CheckCircle } from "lucide-react";
import { Spotlight } from "@/components/ui/spotlight";

const mockProfiles = [
  {
    initials: "AD",
    name: "Amadou Diallo",
    title: "Développeur Full-Stack",
    tags: ["React", "Node.js"],
    rate: "45 000 GNF/h",
    rating: 5,
    bg: "bg-primary",
  },
  {
    initials: "FC",
    name: "Fatoumata Camara",
    title: "Designer UI/UX",
    tags: ["Figma", "Branding"],
    rate: "35 000 GNF/h",
    rating: 5,
    bg: "bg-secondary",
  },
  {
    initials: "IK",
    name: "Ibrahim Konaté",
    title: "Développeur Mobile",
    tags: ["Flutter", "iOS"],
    rate: "40 000 GNF/h",
    rating: 4,
    bg: "bg-cta",
  },
];

const FreelancersHero3D = () => {
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
                <Users size={14} />
                2 500+ Talents Vérifiés
              </div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.05 }}
              className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight"
            >
              Talents Africains
              <br />
              <span className="text-secondary">d'Exception</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="text-white/75 text-lg max-w-lg mx-auto lg:mx-0 mb-8"
            >
              Connectez-vous avec les meilleurs freelancers guinéens et africains.
              Profils vérifiés, notes réelles, disponibilité garantie.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.25 }}
              className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4 gap-3 max-w-lg mx-auto lg:mx-0"
            >
              {[
                { icon: Users, value: "2 500+", label: "Freelancers" },
                { icon: Globe, value: "50+", label: "Pays" },
                { icon: Star, value: "4.9/5", label: "Note Moyenne" },
                { icon: TrendingUp, value: "98%", label: "Succès" },
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

          {/* Right — floating profile cards */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
            className="hidden lg:flex flex-col gap-3"
          >
            {mockProfiles.map((p, i) => (
              <motion.div
                key={p.name}
                initial={{ opacity: 0, x: 32 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.45, delay: 0.25 + i * 0.12, ease: "easeOut" }}
                style={{ marginLeft: i === 1 ? "2rem" : i === 2 ? "1rem" : "0" }}
                className="bg-white rounded-2xl p-4 shadow-lg flex items-center gap-4 max-w-sm"
              >
                {/* Avatar */}
                <div className={`w-12 h-12 rounded-xl ${p.bg} flex items-center justify-center text-white font-bold text-sm flex-shrink-0`}>
                  {p.initials}
                </div>

                {/* Info */}
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

                {/* Rate + stars */}
                <div className="text-right flex-shrink-0">
                  <p className="text-xs font-bold text-primary mb-1">{p.rate}</p>
                  <div className="flex gap-0.5 justify-end">
                    {[...Array(5)].map((_, j) => (
                      <Star
                        key={j}
                        size={9}
                        className={j < p.rating ? "fill-warning text-warning" : "fill-muted text-muted"}
                      />
                    ))}
                  </div>
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
              247 freelancers en ligne maintenant
            </motion.div>
          </motion.div>

        </div>
      </div>
    </div>
  );
};

export default FreelancersHero3D;
