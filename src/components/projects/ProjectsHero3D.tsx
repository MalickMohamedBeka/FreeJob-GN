import { motion } from "framer-motion";
import { Rocket, TrendingUp, Zap, Clock, Tag, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Spotlight } from "@/components/ui/spotlight";
import { usePublicStats } from "@/hooks/useAuth";
import { usePublicProjects } from "@/hooks/useProjects";

const BORDER_COLORS = ["border-l-primary", "border-l-secondary", "border-l-cta"];

function daysLeft(deadline: string | null): string {
  if (!deadline) return "—";
  const diff = Math.ceil(
    (new Date(deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  );
  if (diff <= 0) return "Expiré";
  return `${diff} jour${diff > 1 ? "s" : ""}`;
}

const ProjectsHero3D = () => {
  const { data: stats } = usePublicStats();
  const { data: projectsData, isLoading } = usePublicProjects("-budget_amount");

  const stat = (val: number | undefined, suffix = "+") =>
    val != null ? `${val}${suffix}` : "…";

  const projects = (projectsData?.results ?? []).slice(0, 3);

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
                +{stats?.projects_this_month ?? "…"} Nouveaux Projets ce Mois
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
                { icon: Rocket,      value: stat(stats?.projects_count),  label: "Projets Publiés" },
                { icon: Zap,         value: stat(stats?.freelances_count), label: "Freelancers" },
                { icon: TrendingUp,  value: stat(stats?.clients_count),    label: "Clients" },
              ].map((s, i) => (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.35, delay: 0.35 + i * 0.07 }}
                  className="bg-white/10 rounded-xl p-3 text-center"
                >
                  <s.icon size={16} className="text-white/60 mx-auto mb-1" />
                  <p className="text-lg font-bold text-white leading-tight">{s.value}</p>
                  <p className="text-xs text-white/60 mt-0.5">{s.label}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Right — project cards */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
            className="hidden lg:flex flex-col gap-3"
          >
            {isLoading
              ? [0, 1, 2].map((i) => (
                  <div
                    key={i}
                    style={{ marginLeft: i === 1 ? "1.5rem" : "0" }}
                    className="bg-white/20 rounded-2xl p-4 max-w-sm h-[96px] animate-pulse"
                  />
                ))
              : projects.map((p, i) => {
                  const skills = p.skills?.slice(0, 2) ?? [];
                  const budget = p.budget_amount
                    ? `${Number(p.budget_amount).toLocaleString("fr-GN")} GNF`
                    : p.budget_band_display ?? "—";

                  return (
                    <motion.div
                      key={p.id}
                      initial={{ opacity: 0, x: 28 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.45, delay: 0.25 + i * 0.12, ease: "easeOut" }}
                      style={{ marginLeft: i === 1 ? "1.5rem" : "0" }}
                    >
                      <Link
                        to={`/projects/${p.id}`}
                        className={`bg-white rounded-2xl p-4 shadow-lg border-l-4 ${BORDER_COLORS[i % BORDER_COLORS.length]} max-w-sm hover:shadow-xl hover:scale-[1.02] transition-all duration-200 block`}
                      >
                        <div className="flex items-start justify-between gap-3 mb-2">
                          <div>
                            <p className="font-semibold text-sm text-foreground leading-snug line-clamp-1">
                              {p.title}
                            </p>
                            <p className="text-xs text-muted-foreground mt-0.5">
                              Client : {p.client?.username ?? "—"}
                            </p>
                          </div>
                          <ArrowRight size={14} className="text-muted-foreground flex-shrink-0 mt-0.5" />
                        </div>

                        <div className="flex gap-1 mb-3 flex-wrap">
                          {skills.length > 0
                            ? skills.map((sk) => (
                                <span key={sk.id} className="text-[10px] px-1.5 py-0.5 bg-muted rounded-full text-muted-foreground">
                                  {sk.name}
                                </span>
                              ))
                            : p.speciality && (
                                <span className="text-[10px] px-1.5 py-0.5 bg-muted rounded-full text-muted-foreground">
                                  {p.speciality.name}
                                </span>
                              )
                          }
                        </div>

                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1 font-semibold text-foreground">
                            <Tag size={10} />
                            {budget}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock size={10} />
                            {daysLeft(p.deadline)}
                          </span>
                        </div>
                      </Link>
                    </motion.div>
                  );
                })}

            {/* New project badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.65 }}
              className="self-start bg-white/20 border border-white/30 text-white rounded-full px-4 py-2 text-xs font-semibold flex items-center gap-2"
            >
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              {stats?.projects_this_month ?? "…"} nouveau{(stats?.projects_this_month ?? 0) > 1 ? "x" : ""} projet{(stats?.projects_this_month ?? 0) > 1 ? "s" : ""} ce mois
            </motion.div>
          </motion.div>

        </div>
      </div>
    </div>
  );
};

export default ProjectsHero3D;
