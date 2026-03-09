import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Star, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const teamMembers = [
  { name: "Amadou Diallo", role: "Développeur Full-Stack", skill: "React · Node.js", rating: 5, reviews: 38, color: "bg-primary" },
  { name: "Fatoumata Camara", role: "Designer UI/UX", skill: "Figma · Branding", rating: 5, reviews: 24, color: "bg-secondary" },
  { name: "Mamadou Bah", role: "Expert Marketing", skill: "SEO · Google Ads", rating: 4, reviews: 19, color: "bg-cta" },
  { name: "Aissatou Sow", role: "Chef de Projet", skill: "Agile · Notion", rating: 5, reviews: 31, color: "bg-primary" },
  { name: "Ibrahim Konaté", role: "Développeur Mobile", skill: "Flutter · Kotlin", rating: 4, reviews: 15, color: "bg-secondary" },
  { name: "Mariama Diaby", role: "Data Scientist", skill: "Python · ML", rating: 5, reviews: 22, color: "bg-cta" },
];

function getInitials(name: string) {
  return name.split(" ").slice(0, 2).map((w) => w[0]).join("");
}

const TeamShowcase = () => {
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
          {teamMembers.map((member, index) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.4, ease: "easeOut", delay: index * 0.08 }}
              className="group bg-white rounded-2xl p-4 border border-border hover:shadow-md transition-shadow cursor-default flex flex-col items-center text-center gap-2"
            >
              {/* Avatar */}
              <div className={`w-14 h-14 rounded-2xl ${member.color} flex items-center justify-center text-white font-bold text-base mt-1 relative`}>
                {getInitials(member.name)}
                <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-white flex items-center justify-center">
                  <CheckCircle size={12} className="text-secondary" />
                </span>
              </div>

              {/* Name + role */}
              <div>
                <h3 className="font-semibold text-xs leading-tight group-hover:text-primary transition-colors duration-200">
                  {member.name}
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5 leading-tight">{member.role}</p>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={10}
                    className={i < member.rating ? "fill-warning text-warning" : "fill-muted text-muted"}
                  />
                ))}
                <span className="text-xs text-muted-foreground ml-0.5">({member.reviews})</span>
              </div>

              {/* Skill tags */}
              <div className="flex flex-wrap gap-1 justify-center">
                {member.skill.split(" · ").map((s) => (
                  <span key={s} className="text-[10px] px-1.5 py-0.5 bg-muted rounded-full text-muted-foreground">
                    {s}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.45, ease: "easeOut", delay: 0.3 }}
          className="text-center mt-12"
        >
          <p className="text-muted-foreground mb-4">
            Rejoignez <strong className="text-foreground">2 500+</strong> talents africains
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
