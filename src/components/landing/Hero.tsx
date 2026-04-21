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
            className="hidden lg:flex items-start justify-center relative h-full pt-6"
          >
            {/* Image container — portrait ratio, natural width */}
            <div className="relative" style={{ width: "min(420px, 100%)" }}> 

              {/* Badge ⭐ — haut droite, hors zone visage */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.9, duration: 0.45 }}
                className="absolute -right-10 top-16 z-20 bg-white rounded-2xl shadow-xl border border-gray-100 px-3.5 py-2.5 flex items-center gap-2"
              >
                <div className="w-8 h-8 rounded-xl bg-yellow-400 flex items-center justify-center flex-shrink-0">
                  <Star size={13} className="fill-white text-white" />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-800 leading-none">4.9 / 5</p>
                  <p className="text-[10px] text-gray-400 mt-0.5">Note moyenne</p>
                </div>
              </motion.div>

              {/* Badge 🛡 — bas gauche, hors zone téléphone */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.1, duration: 0.45 }}
                className="absolute -left-10 bottom-20 z-20 bg-green-500 text-white rounded-2xl shadow-xl px-3.5 py-2.5 flex items-center gap-2"
              >
                <Shield size={13} className="flex-shrink-0" />
                <div>
                  <p className="text-xs font-bold leading-none">Paiement sécurisé</p>
                  <p className="text-[10px] opacity-80 mt-0.5">Fonds en séquestre</p>
                </div>
              </motion.div>

              {/* Image — fond supprimé via multiply, proportions naturelles */}
              <img
                src={heroImg}
                alt="Talent freelance FreeJobGN"
                className="w-full h-auto block"
                style={{ mixBlendMode: "multiply" }}
              />
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
