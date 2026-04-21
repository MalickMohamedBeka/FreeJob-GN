import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Star, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePublicStats } from "@/hooks/useAuth";
import { useProviders } from "@/hooks/useFreelancers";

const avatarColors = ["bg-primary", "bg-secondary", "bg-cta", "bg-primary", "bg-secondary", "bg-cta"];

function getInitials(username: string) {
  return username.slice(0, 2).toUpperCase();
}

const CardSkeleton = () => (
  <div className="bg-white rounded-2xl p-4 border border-border flex flex-col items-center gap-2 animate-pulse">
    <div className="w-14 h-14 rounded-2xl bg-muted mt-1" />
    <div className="h-3 bg-muted rounded w-20" />
    <div className="h-2.5 bg-muted rounded w-16" />
    <div className="flex gap-0.5">
      {[...Array(3)].map((_, i) => <div key={i} className="w-2.5 h-2.5 bg-muted rounded-full" />)}
    </div>
    <div className="flex gap-1">
      <div className="h-4 w-10 bg-muted rounded-full" />
      <div className="h-4 w-12 bg-muted rounded-full" />
    </div>
  </div>
);

const TeamShowcase = () => {
  const { data: stats } = usePublicStats();
  const providersCount = stats?.providers_count ?? null;
  const { data: providersData, isLoading } = useProviders();

  const topProviders = [...(providersData?.results ?? [])]
    .sort((a, b) => (b.stars ?? 0) - (a.stars ?? 0))
    .slice(0, 6);

  return (
    <section className="py-20 lg:py-28 bg-muted/40">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="text-center max-w-2xl mx-auto mb-14"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Talents <span className="text-secondary">Africains</span> d'Exception
          </h2>
          <p className="text-muted-foreground text-lg">
            Découvrez quelques-uns des professionnels qui font la différence
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 max-w-5xl mx-auto">
          {isLoading || topProviders.length === 0
            ? Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} />)
            : topProviders.map((member, index) => {
                const skillTags = (member.skills ?? []).slice(0, 2).map((s) => s.name);
                const stars = member.stars ?? 0;
                return (
                  <motion.div
                    key={member.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-40px" }}
                    transition={{ duration: 0.4, ease: "easeOut", delay: index * 0.08 }}
                    className="group bg-white rounded-2xl p-4 border border-border hover:shadow-md transition-shadow cursor-default flex flex-col items-center text-center gap-2"
                  >
                    {/* Avatar */}
                    <div className={`w-14 h-14 rounded-2xl ${avatarColors[index]} flex items-center justify-center text-white font-bold text-base mt-1 relative flex-shrink-0 overflow-hidden`}>
                      {member.profile_picture ? (
                        <img
                          src={member.profile_picture}
                          alt={member.username}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        getInitials(member.username)
                      )}
                      <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-white flex items-center justify-center">
                        <CheckCircle size={12} className="text-secondary" />
                      </span>
                    </div>

                    {/* Name + role */}
                    <div>
                      <h3 className="font-semibold text-xs leading-tight group-hover:text-primary transition-colors duration-200">
                        {member.username}
                      </h3>
                      <p className="text-xs text-muted-foreground mt-0.5 leading-tight">
                        {member.speciality?.name ?? (member.provider_kind === "AGENCY" ? "Agence" : "Prestataire")}
                      </p>
                    </div>

                    {/* Stars (ranking 0-3) */}
                    <div className="flex items-center gap-0.5">
                      {[1, 2, 3].map((i) => (
                        <Star
                          key={i}
                          size={10}
                          className={i <= stars ? "fill-warning text-warning" : "fill-muted text-muted"}
                        />
                      ))}
                    </div>

                    {/* Skill tags */}
                    <div className="flex flex-wrap gap-1 justify-center">
                      {skillTags.length > 0
                        ? skillTags.map((s) => (
                            <span key={s} className="text-[10px] px-1.5 py-0.5 bg-muted rounded-full text-muted-foreground">
                              {s}
                            </span>
                          ))
                        : (
                            <span className="text-[10px] px-1.5 py-0.5 bg-muted rounded-full text-muted-foreground">
                              {member.provider_kind === "AGENCY" ? "Agence" : "Freelance"}
                            </span>
                          )}
                    </div>
                  </motion.div>
                );
              })
          }
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.45, ease: "easeOut", delay: 0.3 }}
          className="text-center mt-12"
        >
          <p className="text-muted-foreground mb-4">
            Rejoignez{" "}
            {providersCount !== null ? (
              <strong className="text-foreground">{providersCount}+</strong>
            ) : (
              <span className="inline-block w-8 h-4 bg-muted rounded animate-pulse align-middle" />
            )}{" "}
            talents africains
          </p>
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <Button variant="default" asChild>
              <Link to="/signup">Créer un profil freelance</Link>
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default TeamShowcase;
