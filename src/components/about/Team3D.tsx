import { motion } from "framer-motion";
import { Linkedin, Twitter, Mail } from "lucide-react";

const team = [
  {
    name: "Amadou Diallo",
    role: "CEO & Fondateur",
    bio: "Visionnaire passionné par la tech africaine",
  },
  {
    name: "Fatoumata Camara",
    role: "CTO",
    bio: "Experte en développement et architecture",
  },
  {
    name: "Ibrahim Konaté",
    role: "Head of Product",
    bio: "Designer UX/UI primé internationalement",
  },
  {
    name: "Aissatou Sow",
    role: "Head of Community",
    bio: "Spécialiste en engagement communautaire",
  },
];

function getInitials(name: string) {
  return name.split(" ").slice(0, 2).map((w) => w[0]).join("");
}

const Team3D = () => {
  return (
    <section className="py-24 bg-muted/40">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, ease: "easeOut" as const }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-black mb-4">
            Notre <span className="text-secondary">Équipe</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Les visionnaires qui construisent l'avenir du freelancing en Afrique
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {team.map((member, index) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.45, ease: "easeOut" as const, delay: index * 0.1 }}
              whileHover={{ y: -6, transition: { duration: 0.2 } }}
              className="group bg-white rounded-2xl overflow-hidden border border-border hover:shadow-md transition-shadow"
            >
              {/* Avatar section */}
              <div className="relative bg-primary/5 pt-10 pb-14">
                <div className="flex justify-center">
                  <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center text-white font-bold text-xl border-4 border-white shadow-sm group-hover:scale-105 transition-transform duration-300">
                    {getInitials(member.name)}
                  </div>
                </div>

                {/* Social links on hover */}
                <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {[Linkedin, Twitter, Mail].map((Icon, i) => (
                    <button
                      key={i}
                      className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center hover:bg-primary hover:text-white transition-colors"
                    >
                      <Icon size={13} />
                    </button>
                  ))}
                </div>
              </div>

              {/* Info */}
              <div className="p-5 text-center">
                <h3 className="text-lg font-bold mb-1 group-hover:text-primary transition-colors duration-200">
                  {member.name}
                </h3>
                <p className="text-secondary font-semibold text-sm mb-2">{member.role}</p>
                <p className="text-muted-foreground text-sm leading-relaxed">{member.bio}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Team3D;
