import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Briefcase, CheckCircle2, Shield, Star, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Spotlight } from "@/components/ui/spotlight";
import { usePublicStats } from "@/hooks/useAuth";
import { usePublicProviders } from "@/hooks/useFreelancers";
import heroImg from "@/assets/hero_final.png";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.55, ease: "easeOut" as const, delay },
});

const floatingHeroCards = [
  {
    id: "proposals",
    title: "12 propositions reçues",
    subtitle: "Profils qualifiés en revue",
    icon: Briefcase,
    iconClassName: "bg-[hsla(231,68%,32%,0.18)] text-[hsl(231,68%,28%)] ring-1 ring-[hsla(231,68%,32%,0.08)]",
    surfaceClassName: "border-[hsla(231,68%,32%,0.18)]",
    desktopPositionClassName: "-left-12 top-32 xl:-left-16 xl:top-36",
    mobilePositionClassName: "left-3 top-5 sm:left-4 sm:top-5",
    enterX: -20,
    enterDelay: 0.82,
    floatKeyframes: [0, -7, 0, 4, 0],
    floatDuration: 7.4,
    floatDelay: 1.15,
  },
  {
    id: "payment",
    title: "Paiement sécurisé",
    subtitle: "Fonds en séquestre",
    icon: Shield,
    iconClassName: "bg-emerald-500/16 text-emerald-700 ring-1 ring-emerald-500/10",
    surfaceClassName: "border-emerald-500/16",
    desktopPositionClassName: "-left-8 bottom-28 xl:-left-12 xl:bottom-32",
    mobilePositionClassName: "left-3 -bottom-4 sm:left-4",
    enterX: -16,
    enterDelay: 1.02,
    floatKeyframes: [0, -5, 0, 3, 0],
    floatDuration: 8.2,
    floatDelay: 1.55,
  },
  {
    id: "contract",
    title: "Contrat accepté",
    subtitle: "Projet confirmé",
    icon: CheckCircle2,
    iconClassName: "bg-sky-500/16 text-sky-700 ring-1 ring-sky-500/10",
    surfaceClassName: "border-sky-500/16",
    desktopPositionClassName: "-right-10 top-[54%] xl:-right-14 xl:top-[55%]",
    mobilePositionClassName: "right-3 -bottom-4 sm:right-4",
    enterX: 20,
    enterDelay: 0.92,
    floatKeyframes: [0, -6, 0, 5, 0],
    floatDuration: 7.8,
    floatDelay: 1.35,
  },
] as const;

type FloatingHeroCardProps = {
  className: string;
  compact?: boolean;
  enterDelay: number;
  enterX: number;
  floatDelay: number;
  floatDuration: number;
  floatKeyframes: readonly number[];
  icon: typeof Briefcase;
  iconClassName: string;
  subtitle: string;
  surfaceClassName: string;
  title: string;
};

const FloatingHeroCard = ({
  className,
  compact = false,
  enterDelay,
  enterX,
  floatDelay,
  floatDuration,
  floatKeyframes,
  icon: Icon,
  iconClassName,
  subtitle,
  surfaceClassName,
  title,
}: FloatingHeroCardProps) => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={{ opacity: 0, x: enterX, y: 18 }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{ duration: 0.5, delay: enterDelay, ease: "easeOut" as const }}
      className={`pointer-events-none absolute z-20 ${className}`}
    >
      <motion.div
        animate={shouldReduceMotion ? { y: 0 } : { y: floatKeyframes }}
        transition={
          shouldReduceMotion
            ? undefined
            : {
                duration: floatDuration,
                delay: floatDelay,
                repeat: Infinity,
                ease: "easeInOut" as const,
              }
        }
        className={`transform-gpu rounded-[22px] border bg-gradient-to-br from-white/78 via-white/70 to-white/62 shadow-[0_18px_38px_rgba(15,23,42,0.14)] backdrop-blur-[14px] ${surfaceClassName} ${
          compact ? "min-w-[152px] px-3 py-2.5" : "min-w-[188px] px-4 py-3.5"
        }`}
        style={{ willChange: "transform" }}
      >
        <div className={`flex items-center gap-3 ${compact ? "gap-2.5" : ""}`}>
          <div
            className={`flex shrink-0 items-center justify-center rounded-2xl ${
              compact ? "h-8 w-8 rounded-xl" : "h-10 w-10"
            } ${iconClassName}`}
          >
            <Icon size={compact ? 15 : 17} strokeWidth={2.25} />
          </div>

          <div className="min-w-0">
            <p className={`font-bold leading-none tracking-[-0.01em] text-slate-950 ${compact ? "text-[11.5px]" : "text-[13px]"}`}>
              {title}
            </p>
            <p className={`mt-1 font-medium text-slate-700 ${compact ? "text-[10.5px]" : "text-[11.5px]"}`}>
              {subtitle}
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

const Hero = () => {
  const { data: stats } = usePublicStats();
  const { data: providersData } = usePublicProviders(4);
  const freelancersCount = stats?.freelances_count ?? null;
  const providers = providersData?.results?.slice(0, 4) ?? [];

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-white">
      <Spotlight className="-top-40 left-0 md:-top-20 md:left-60 opacity-25" fill="hsl(231,68%,32%)" />

      {/* Soft background blob — anchored right */}
      <div
        className="absolute right-0 top-0 w-[55%] h-full pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 90% at 80% 50%, hsl(231,68%,96%) 0%, transparent 70%)",
        }}
      />

      <div className="container mx-auto px-4 lg:px-8 pt-24 pb-16 relative z-10">
        <div className="grid lg:grid-cols-[1fr_1.15fr] gap-8 lg:gap-0 items-center min-h-[calc(100vh-6rem)]">

          {/* ── Left — Content ── */}
          <div className="max-w-[540px] lg:py-16">
            <motion.div {...fadeUp(0)}>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-7 border border-primary/20">
                <Briefcase size={14} />
                La plateforme freelance #1 en Guinée
              </div>
            </motion.div>

            <motion.h1
              {...fadeUp(0.1)}
              className="text-4xl md:text-5xl lg:text-[58px] font-bold leading-[1.08] tracking-tight mb-6 text-foreground"
            >
              Trouvez les meilleurs{" "}
              <span className="text-secondary">talents freelance</span>{" "}
              pour vos projets
            </motion.h1>

            <motion.p
              {...fadeUp(0.2)}
              className="text-lg text-muted-foreground leading-relaxed mb-9"
            >
              Connectez-vous avec des développeurs, designers et experts guinéens
              talentueux. Publiez votre projet et recevez des propositions en quelques minutes.
            </motion.p>

            <motion.div {...fadeUp(0.3)} className="flex flex-wrap gap-4">
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Button variant="cta" size="lg" asChild>
                  <Link to="/signup">
                    Commencer Gratuitement
                    <ArrowRight size={18} />
                  </Link>
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Button variant="outline" size="lg" asChild>
                  <Link to="/projects">Voir les Projets</Link>
                </Button>
              </motion.div>
            </motion.div>

            {/* Social proof */}
            <motion.div
              {...fadeUp(0.45)}
              className="mt-10 flex items-center gap-4 text-sm text-muted-foreground"
            >
              <div className="flex -space-x-2">
                {providers.length > 0
                  ? providers.map((p, i) => {
                      const initials = p.freelance_details
                        ? `${p.freelance_details.first_name[0] ?? ""}${p.freelance_details.last_name[0] ?? ""}`.toUpperCase()
                        : p.username.slice(0, 2).toUpperCase();
                      return (
                        <motion.div
                          key={p.id}
                          initial={{ opacity: 0, x: -12 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.55 + i * 0.08, duration: 0.3 }}
                        >
                          <Link
                            to={p.provider_kind === 'AGENCY' ? `/agencies/${p.id}` : `/freelancers/${p.id}`}
                            title={initials}
                            className="block w-9 h-9 rounded-full border-2 border-white overflow-hidden hover:z-10 hover:scale-110 transition-transform"
                          >
                            {p.profile_picture ? (
                              <img
                                src={p.profile_picture}
                                alt={initials}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <span className="w-full h-full bg-primary flex items-center justify-center text-white text-xs font-bold">
                                {initials}
                              </span>
                            )}
                          </Link>
                        </motion.div>
                      );
                    })
                  : [0, 1, 2, 3].map((i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -12 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.55 + i * 0.08, duration: 0.3 }}
                        className="w-9 h-9 rounded-full bg-muted border-2 border-white animate-pulse"
                      />
                    ))}
              </div>
              <span>
                {freelancersCount !== null ? (
                  <strong className="text-foreground">{freelancersCount}+</strong>
                ) : (
                  <span className="inline-block w-8 h-4 bg-muted rounded animate-pulse align-middle" />
                )}{" "}
                freelancers africains actifs
              </span>
            </motion.div>

            {/* Trust pills */}
            <motion.div
              {...fadeUp(0.55)}
              className="mt-8 flex flex-wrap gap-3"
            >
              {[
                { icon: <Shield size={13} />, text: "Paiement sécurisé" },
                { icon: <Zap size={13} />, text: "Propositions en minutes" },
                { icon: <Star size={13} />, text: "Talents vérifiés" },
              ].map((pill) => (
                <div
                  key={pill.text}
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground bg-gray-50 border border-gray-200 rounded-full px-3 py-1.5"
                >
                  <span className="text-primary">{pill.icon}</span>
                  {pill.text}
                </div>
              ))}
            </motion.div>
          </div>

          {/* ── Right — Hero image ── */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.75, delay: 0.2, ease: "easeOut" as const }}
            className="hidden lg:flex items-center justify-center relative h-full min-h-[560px] xl:min-h-[620px]"
          >
            <div className="relative flex w-full max-w-[580px] items-center justify-center">
              <div
                aria-hidden="true"
                className="absolute inset-x-14 top-10 bottom-8 opacity-90 blur-2xl"
                style={{
                  borderRadius: "46% 54% 58% 42% / 42% 40% 60% 58%",
                  background:
                    "radial-gradient(circle at 50% 24%, hsla(231, 68%, 96%, 0.95) 0%, hsla(231, 68%, 94%, 0.78) 34%, hsla(180, 54%, 92%, 0.38) 58%, transparent 80%)",
                }}
              />

              <div
                aria-hidden="true"
                className="absolute left-14 top-28 h-52 w-52 rounded-full bg-primary/12 blur-3xl"
              />
              <div
                aria-hidden="true"
                className="absolute right-10 top-20 h-44 w-44 rounded-full bg-secondary/10 blur-3xl"
              />
              <div
                aria-hidden="true"
                className="absolute bottom-16 left-20 h-28 w-48 rounded-full blur-3xl"
                style={{ background: "hsla(28, 78%, 80%, 0.34)" }}
              />

              {/* Image container — portrait ratio, natural width */}
              <div className="relative z-10 w-full max-w-[460px] translate-x-4 -translate-y-16 xl:max-w-[500px] xl:translate-x-6 xl:-translate-y-[4.5rem]">
                {floatingHeroCards.map((card) => (
                  <FloatingHeroCard
                    key={card.id}
                    className={card.desktopPositionClassName}
                    enterDelay={card.enterDelay}
                    enterX={card.enterX}
                    floatDelay={card.floatDelay}
                    floatDuration={card.floatDuration}
                    floatKeyframes={card.floatKeyframes}
                    icon={card.icon}
                    iconClassName={card.iconClassName}
                    subtitle={card.subtitle}
                    surfaceClassName={card.surfaceClassName}
                    title={card.title}
                  />
                ))}

                {/* Image — fond supprimé via multiply, proportions naturelles */}
                <img
                  src={heroImg}
                  alt="Talent freelance FreeJobGN"
                  className="block h-auto w-full drop-shadow-[0_36px_64px_rgba(15,23,42,0.08)]"
                  style={{ mixBlendMode: "multiply" }}
                />
              </div>
            </div>
          </motion.div>

          {/* Mobile image */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35 }}
            className="relative mt-4 pb-12 lg:hidden"
          >
            {floatingHeroCards.map((card) => (
              <FloatingHeroCard
                key={card.id}
                className={card.mobilePositionClassName}
                compact
                enterDelay={card.enterDelay}
                enterX={card.enterX}
                floatDelay={card.floatDelay}
                floatDuration={card.floatDuration}
                floatKeyframes={card.floatKeyframes.map((value) => Number((value * 0.72).toFixed(2)))}
                icon={card.icon}
                iconClassName={card.iconClassName}
                subtitle={card.subtitle}
                surfaceClassName={card.surfaceClassName}
                title={card.title}
              />
            ))}
            <img
              src={heroImg}
              alt="Talent freelance FreeJobGN"
              className="w-full rounded-2xl object-cover object-center"
              style={{ height: "260px" }}
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
