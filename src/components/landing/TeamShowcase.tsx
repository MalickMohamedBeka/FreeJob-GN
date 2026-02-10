import { motion } from "framer-motion";
import AfricanAvatar from "@/components/ui/AfricanAvatar";

const teamMembers = [
  { name: "Amadou Diallo", role: "Développeur Full-Stack", country: "🇬🇳" },
  { name: "Fatoumata Camara", role: "Designer UI/UX", country: "🇬🇳" },
  { name: "Mamadou Bah", role: "Expert Marketing", country: "🇬🇳" },
  { name: "Aissatou Sow", role: "Chef de Projet", country: "🇬🇳" },
  { name: "Ibrahim Konaté", role: "Développeur Mobile", country: "🇬🇳" },
  { name: "Mariama Diaby", role: "Data Scientist", country: "🇬🇳" },
];

const TeamShowcase = () => {
  return (
    <section className="py-20 lg:py-28 relative overflow-hidden">
      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Talents <span className="text-gradient-hero">Africains</span> d'Exception
          </h2>
          <p className="text-muted-foreground text-lg">
            Découvrez quelques-uns des professionnels qui font la différence
          </p>
        </motion.div>

        {/* 3D Grid of Avatars */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 perspective-container max-w-5xl mx-auto">
          {teamMembers.map((member, index) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 50, rotateX: -30 }}
              whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ 
                y: -20, 
                scale: 1.15,
                rotateY: 10,
                transition: { duration: 0.3 }
              }}
              className="flex flex-col items-center card-3d"
            >
              <motion.div
                className="glass rounded-3xl p-6 shadow-elevation-3 hover:shadow-elevation-5 border border-white/30 relative"
                whileHover={{ rotateZ: 5 }}
              >
                <AfricanAvatar 
                  name={member.name} 
                  role={member.role}
                  size="lg"
                  showBadge
                  animate
                />
              </motion.div>

              <motion.div 
                className="mt-4 text-center"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: index * 0.1 + 0.3 }}
              >
                <h3 className="font-bold text-sm">{member.name}</h3>
                <p className="text-xs text-muted-foreground">{member.role}</p>
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="text-center mt-16"
        >
          <motion.div
            whileHover={{ scale: 1.05, y: -5 }}
            className="inline-block glass rounded-2xl px-8 py-4 shadow-elevation-3 hover:shadow-elevation-4 border border-white/30"
          >
            <p className="text-lg font-semibold mb-2">
              Rejoignez <span className="text-gradient-hero">2,500+</span> talents africains
            </p>
            <p className="text-sm text-muted-foreground">
              Développeurs • Designers • Marketeurs • Consultants
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default TeamShowcase;
