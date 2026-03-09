import { motion } from "framer-motion";
import { Quote, MapPin, CheckCircle, TrendingUp, Users } from "lucide-react";
import { team } from "@/data/team";

const AvatarSilhouette = () => (
  <svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <circle cx="40" cy="28" r="17" fill="rgba(255,255,255,0.75)" />
    <path d="M2 82 Q4 54 40 50 Q76 54 78 82 Z" fill="rgba(255,255,255,0.75)" />
  </svg>
);

const founder = team[0];

const Mission3D = () => (
  <section className="py-24 bg-white overflow-hidden">
    <div className="container mx-auto px-4 lg:px-8">
      <div className="grid lg:grid-cols-2 gap-16 items-center">

        {/* Left — text */}
        <motion.div
          initial={{ opacity: 0, x: -32 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.55, ease: "easeOut" }}
        >
          <span className="inline-block text-xs font-bold text-primary tracking-widest uppercase px-3 py-1 rounded-full bg-primary/10 mb-5">
            Notre histoire
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mb-6 leading-tight">
            Connecter les talents guinéens aux{" "}
            <span className="text-secondary">opportunités mondiales</span>
          </h2>

          <p className="text-muted-foreground leading-relaxed mb-5">
            FreeJobGN est né en 2023 d'un constat simple : la Guinée regorge de talents
            exceptionnels en technologie, design et marketing, mais peu d'entre eux ont accès
            à des opportunités de travail à la hauteur de leurs compétences.
          </p>
          <p className="text-muted-foreground leading-relaxed mb-8">
            Nous avons construit une plateforme qui respecte le marché local — paiements en GNF
            via Mobile Money, support en français, et un système de classement transparent
            qui valorise la qualité du travail, pas les connexions.
          </p>

          <ul className="space-y-3">
            {[
              "Première plateforme freelance 100% guinéenne",
              "Paiements sécurisés via Orange Money & MTN",
              "Classement objectif basé sur avis réels",
              "Zéro commission sur vos revenus",
            ].map((item) => (
              <li key={item} className="flex items-center gap-3 text-sm">
                <CheckCircle size={16} className="text-secondary flex-shrink-0" />
                <span className="text-foreground/80">{item}</span>
              </li>
            ))}
          </ul>

          {/* Founder quote — uses team[0] data */}
          <div className="mt-8 flex items-start gap-4 p-5 bg-muted/40 rounded-2xl border border-border">
            <Quote size={20} className="text-primary/40 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-muted-foreground italic leading-relaxed">
                "Notre ambition : que chaque talent guinéen puisse vivre de ses compétences,
                ici, en Guinée, sans avoir à partir à l'étranger."
              </p>
              <div className="flex items-center gap-2 mt-3">
                {/* Founder avatar with image or silhouette fallback */}
                <div className={`w-9 h-9 rounded-xl overflow-hidden bg-gradient-to-br ${founder.color} flex-shrink-0`}>
                  {founder.image ? (
                    <img src={founder.image} alt={founder.name} className="w-full h-full object-cover" />
                  ) : (
                    <AvatarSilhouette />
                  )}
                </div>
                <div>
                  <p className="text-xs font-semibold">{founder.name}</p>
                  <p className="text-xs text-muted-foreground">{founder.role}, FreeJobGN</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right — team visual collage */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
          className="relative"
        >
          <div className="relative bg-primary rounded-3xl p-10 overflow-hidden">
            {/* Decorative rings */}
            <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-white/5" />
            <div className="absolute -bottom-8 -left-8 w-48 h-48 rounded-full bg-white/5" />

            <div className="relative text-center">
              <div className="inline-flex items-center gap-2 bg-white/15 rounded-full px-4 py-2 text-white text-sm font-semibold mb-8">
                <MapPin size={14} />
                Conakry, Guinée
              </div>

              {/* Team avatars — driven by shared team list */}
              <div className="flex justify-center gap-5 mb-8">
                {team.map((m, i) => (
                  <motion.div
                    key={m.name}
                    initial={{ opacity: 0, scale: 0.7 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.35, delay: 0.3 + i * 0.1 }}
                    className="flex flex-col items-center gap-2"
                  >
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${m.color} overflow-hidden border-2 border-white/25`}>
                      {m.image ? (
                        <img src={m.image} alt={m.name} className="w-full h-full object-cover" />
                      ) : (
                        <AvatarSilhouette />
                      )}
                    </div>
                    <span className="text-white/70 text-xs font-medium">{m.role.split(" ")[0]}</span>
                  </motion.div>
                ))}
              </div>

              <p className="text-white/80 text-sm">L'équipe qui construit FreeJobGN</p>
            </div>
          </div>

          {/* Floating stat badges */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.5 }}
            className="absolute -top-5 -left-5 bg-white border border-border rounded-2xl px-4 py-3 shadow-lg flex items-center gap-3"
          >
            <div className="w-10 h-10 bg-secondary/10 rounded-xl flex items-center justify-center">
              <Users size={18} className="text-secondary" />
            </div>
            <div>
              <p className="text-lg font-bold leading-none">2 500+</p>
              <p className="text-xs text-muted-foreground mt-0.5">Talents actifs</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.65 }}
            className="absolute -bottom-5 -right-5 bg-white border border-border rounded-2xl px-4 py-3 shadow-lg flex items-center gap-3"
          >
            <div className="w-10 h-10 bg-cta/10 rounded-xl flex items-center justify-center">
              <TrendingUp size={18} className="text-cta" />
            </div>
            <div>
              <p className="text-lg font-bold leading-none">98%</p>
              <p className="text-xs text-muted-foreground mt-0.5">Satisfaction</p>
            </div>
          </motion.div>
        </motion.div>

      </div>
    </div>
  </section>
);

export default Mission3D;
