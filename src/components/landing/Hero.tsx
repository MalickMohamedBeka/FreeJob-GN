import { motion } from "framer-motion";
import { ArrowRight, Briefcase, Star, Shield, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Spotlight } from "@/components/ui/spotlight";
import { usePublicStats } from "@/hooks/useAuth";
import heroImg from "@/assets/hero_final.png";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.55, ease: "easeOut" as const, delay },
});

const Hero = () => {
  const { data: stats } = usePublicStats();
  const freelancersCount = stats?.freelances_count ?? null;

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
                {["AD", "FC", "MB", "AS"].map((initials, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.55 + i * 0.08, duration: 0.3 }}
                    className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-white text-xs font-bold border-2 border-white"
                  >
                    {initials}
                  </motion.div>
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
                {/* Badge ⭐ — haut droite, hors zone visage */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.9, duration: 0.45 }}
                  className="absolute -right-6 top-24 z-20 rounded-2xl border border-gray-100 bg-white/95 px-3.5 py-2.5 shadow-xl backdrop-blur-sm xl:-right-8 xl:top-28"
                >
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl bg-yellow-400">
                      <Star size={13} className="fill-white text-white" />
                    </div>
                    <div>
                      <p className="text-xs font-bold leading-none text-gray-800">4.9 / 5</p>
                      <p className="mt-0.5 text-[10px] text-gray-400">Note moyenne</p>
                    </div>
                  </div>
                </motion.div>

                {/* Badge 🛡 — bas gauche, hors zone téléphone */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.1, duration: 0.45 }}
                  className="absolute -left-4 bottom-28 z-20 rounded-2xl bg-green-500 px-3.5 py-2.5 text-white shadow-xl xl:-left-8 xl:bottom-32"
                >
                  <div className="flex items-center gap-2">
                    <Shield size={13} className="flex-shrink-0" />
                    <div>
                      <p className="text-xs font-bold leading-none">Paiement sécurisé</p>
                      <p className="mt-0.5 text-[10px] opacity-80">Fonds en séquestre</p>
                    </div>
                  </div>
                </motion.div>

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
            className="lg:hidden mt-4 relative"
          >
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
