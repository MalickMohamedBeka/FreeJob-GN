import { motion } from "framer-motion";
import { Star, MapPin, CheckCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const mockFreelancers = [
  {
    initials: "AD",
    name: "Amadou Diallo",
    speciality: "Développeur Full-Stack",
    skills: ["React", "Node.js", "Python"],
    rate: "45 000 GNF/h",
    rating: 5,
    reviews: 38,
    location: "Conakry",
    bg: "bg-primary",
  },
  {
    initials: "FC",
    name: "Fatoumata Camara",
    speciality: "Designer UI/UX",
    skills: ["Figma", "Branding", "Webflow"],
    rate: "35 000 GNF/h",
    rating: 5,
    reviews: 24,
    location: "Conakry",
    bg: "bg-secondary",
  },
  {
    initials: "MB",
    name: "Mamadou Barry",
    speciality: "Expert Marketing Digital",
    skills: ["SEO", "Ads", "Réseaux sociaux"],
    rate: "30 000 GNF/h",
    rating: 4,
    reviews: 17,
    location: "Labé",
    bg: "bg-cta",
  },
];

const FreelancerCard = ({ f }: { f: typeof mockFreelancers[0] }) => (
  <div className="bg-white rounded-xl p-4 border border-border flex flex-col gap-3">
    <div className="flex items-start gap-3">
      <div className={`w-12 h-12 rounded-xl ${f.bg} flex items-center justify-center text-white font-bold text-sm flex-shrink-0`}>
        {f.initials}
      </div>
      <div className="min-w-0">
        <div className="flex items-center gap-1.5">
          <span className="font-semibold text-sm truncate">{f.name}</span>
          <CheckCircle size={13} className="text-secondary flex-shrink-0" />
        </div>
        <p className="text-xs text-muted-foreground truncate">{f.speciality}</p>
        <div className="flex items-center gap-1 mt-0.5">
          <MapPin size={10} className="text-muted-foreground" />
          <span className="text-xs text-muted-foreground">{f.location}</span>
        </div>
      </div>
    </div>

    <div className="flex gap-1 flex-wrap">
      {f.skills.map((s) => (
        <span key={s} className="text-xs px-2 py-0.5 bg-muted rounded-full text-muted-foreground">
          {s}
        </span>
      ))}
    </div>

    <div className="flex items-center justify-between pt-1 border-t border-border">
      <div>
        <div className="flex items-center gap-0.5">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              size={11}
              className={i < f.rating ? "fill-warning text-warning" : "fill-muted text-muted"}
            />
          ))}
          <span className="text-xs text-muted-foreground ml-1">({f.reviews})</span>
        </div>
        <p className="text-xs font-semibold text-primary mt-0.5">{f.rate}</p>
      </div>
      <span className="text-xs px-2.5 py-1 bg-primary text-white rounded-full font-medium">
        Contacter
      </span>
    </div>
  </div>
);

const PlatformPreview = () => (
  <section className="py-20 lg:py-28 bg-white overflow-hidden">
    <div className="container mx-auto px-4 lg:px-8">
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        {/* Left — text */}
        <motion.div
          initial={{ opacity: 0, x: -32 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.55, ease: "easeOut" }}
          className="max-w-lg"
        >
          <span className="inline-block text-xs font-bold text-primary tracking-widest uppercase px-3 py-1 rounded-full bg-primary/10 mb-5">
            Plateforme
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mb-5 leading-tight">
            Des profils vérifiés,{" "}
            <span className="text-secondary">prêts à travailler</span>
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed mb-8">
            Parcourez des centaines de freelancers guinéens et africains, comparez
            leurs profils, leurs avis et leurs tarifs — et lancez votre projet en
            quelques minutes.
          </p>
          <ul className="space-y-3 mb-8">
            {[
              "Profils notés et évalués par des clients réels",
              "Filtres par compétence, tarif et localisation",
              "Messagerie sécurisée avant tout engagement",
            ].map((item) => (
              <li key={item} className="flex items-start gap-3 text-sm text-muted-foreground">
                <CheckCircle size={16} className="text-secondary mt-0.5 flex-shrink-0" />
                {item}
              </li>
            ))}
          </ul>
          <Button variant="default" size="lg" asChild>
            <Link to="/freelancers">
              Explorer les freelancers
              <ArrowRight size={17} />
            </Link>
          </Button>
        </motion.div>

        {/* Right — browser mockup */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
        >
          {/* Browser chrome */}
          <div className="rounded-2xl border border-border shadow-xl overflow-hidden bg-muted/30">
            {/* Title bar */}
            <div className="bg-muted/60 px-4 py-3 flex items-center gap-3 border-b border-border">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-yellow-400" />
                <div className="w-3 h-3 rounded-full bg-green-400" />
              </div>
              <div className="flex-1 bg-white rounded-full px-3 py-1 text-xs text-muted-foreground border border-border max-w-xs mx-auto">
                freejobgn.site/freelancers
              </div>
            </div>

            {/* Browser content */}
            <div className="bg-muted/20 p-4">
              {/* Fake search bar */}
              <div className="flex gap-2 mb-4">
                <div className="flex-1 bg-white rounded-lg px-3 py-2 text-xs text-muted-foreground border border-border">
                  Développeur React, Designer Figma…
                </div>
                <div className="bg-primary text-white text-xs px-3 py-2 rounded-lg font-medium">
                  Rechercher
                </div>
              </div>

              {/* Fake filters */}
              <div className="flex gap-2 mb-4 flex-wrap">
                {["Tous", "Développement", "Design", "Marketing"].map((f, i) => (
                  <span
                    key={f}
                    className={`text-xs px-3 py-1 rounded-full font-medium ${
                      i === 0
                        ? "bg-primary text-white"
                        : "bg-white text-muted-foreground border border-border"
                    }`}
                  >
                    {f}
                  </span>
                ))}
              </div>

              {/* Freelancer cards */}
              <div className="flex flex-col gap-3">
                {mockFreelancers.map((f, i) => (
                  <motion.div
                    key={f.name}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, ease: "easeOut", delay: 0.2 + i * 0.1 }}
                  >
                    <FreelancerCard f={f} />
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  </section>
);

export default PlatformPreview;
