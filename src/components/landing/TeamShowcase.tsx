import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const teamMembers = [
  { name: "Amadou Diallo", role: "Développeur Full-Stack" },
  { name: "Fatoumata Camara", role: "Designer UI/UX" },
  { name: "Mamadou Bah", role: "Expert Marketing" },
  { name: "Aissatou Sow", role: "Chef de Projet" },
  { name: "Ibrahim Konaté", role: "Développeur Mobile" },
  { name: "Mariama Diaby", role: "Data Scientist" },
];

function getInitials(name: string) {
  return name.split(" ").slice(0, 2).map((w) => w[0]).join("");
}

const TeamShowcase = () => {
  return (
    <section className="py-20 lg:py-28 bg-white">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Talents <span className="text-secondary">Africains</span> d'Exception
          </h2>
          <p className="text-muted-foreground text-lg">
            Découvrez quelques-uns des professionnels qui font la différence
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 max-w-5xl mx-auto">
          {teamMembers.map((member, index) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.4, ease: "easeOut", delay: index * 0.08 }}
              className="flex flex-col items-center text-center group"
            >
              <motion.div
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.2 }}
                className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-white font-bold text-lg mb-3 border-2 border-primary/20 cursor-default"
              >
                {getInitials(member.name)}
              </motion.div>
              <h3 className="font-semibold text-sm group-hover:text-primary transition-colors duration-200">
                {member.name}
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">{member.role}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.45, ease: "easeOut", delay: 0.3 }}
          className="text-center mt-14"
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
