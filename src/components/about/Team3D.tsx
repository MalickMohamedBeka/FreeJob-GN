import { motion } from "framer-motion";
import { Linkedin, Twitter, Mail } from "lucide-react";

const team = [
  {
    name: "Amadou Diallo",
    role: "CEO & Fondateur",
    bio: "Visionnaire passionné par la tech africaine",
    avatar: "Amadou Diallo"
  },
  {
    name: "Fatoumata Camara",
    role: "CTO",
    bio: "Experte en développement et architecture",
    avatar: "Fatoumata Camara"
  },
  {
    name: "Ibrahim Konaté",
    role: "Head of Product",
    bio: "Designer UX/UI primé internationalement",
    avatar: "Ibrahim Konaté"
  },
  {
    name: "Aissatou Sow",
    role: "Head of Community",
    bio: "Spécialiste en engagement communautaire",
    avatar: "Aissatou Sow"
  },
];

const Team3D = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-primary" />

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h2 className="text-5xl font-black mb-4">
            Notre <span className="text-primary">Équipe</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Les visionnaires qui construisent l'avenir du freelancing en Afrique
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 perspective-container">
          {team.map((member, index) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 60, rotateX: -30, scale: 0.8 }}
              whileInView={{ opacity: 1, y: 0, rotateX: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ 
                duration: 0.7, 
                delay: index * 0.15,
                type: "spring",
                stiffness: 100
              }}
              whileHover={{ 
                y: -20, 
                scale: 1.05,
                rotateY: 10,
                transition: { duration: 0.3 }
              }}
              className="glass rounded-3xl overflow-hidden shadow-elevation-4 border-2 border-white/40 card-3d group relative"
            >
              {/* Avatar Section */}
              <div className="relative h-64 overflow-hidden">
                {/* Background Gradient */}
                <motion.div
                  className="absolute inset-0 bg-primary opacity-30"
                  animate={{
                    scale: [1, 1.2, 1],
                    rotate: [0, 45, 0],
                  }}
                  transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                />

                {/* Avatar */}
                <motion.div
                  className="absolute inset-0 flex items-center justify-center"
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="relative w-40 h-40 rounded-full overflow-hidden border-4 border-white shadow-elevation-4">
                    {/* Glow Ring */}
                    <motion.div
                      className="absolute inset-0 rounded-full bg-primary opacity-50 blur-xl"
                      animate={{
                        scale: [1, 1.3, 1],
                        opacity: [0.5, 0.8, 0.5],
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                    
                    {/* Avatar Image */}
                    <img
                      src={`/avatars/freelancer-${(index % 15) + 1}.jpg`}
                      alt={member.name}
                      className="relative z-10 w-full h-full object-cover"
                    />
                  </div>
                </motion.div>

                {/* Social Links */}
                <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {[Linkedin, Twitter, Mail].map((Icon, i) => (
                    <motion.button
                      key={i}
                      whileHover={{ scale: 1.2, rotate: 360 }}
                      whileTap={{ scale: 0.9 }}
                      className="w-10 h-10 rounded-full glass-dark backdrop-blur-xl flex items-center justify-center shadow-elevation-2"
                    >
                      <Icon size={16} className="text-white" />
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Info Section */}
              <div className="p-6 text-center relative">
                <h3 className="text-xl font-bold mb-1 group-hover:text-primary transition-all">
                  {member.name}
                </h3>
                <p className="text-primary font-semibold text-sm mb-3">
                  {member.role}
                </p>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {member.bio}
                </p>

                {/* Bottom Glow */}
                <motion.div
                  className="absolute bottom-0 left-0 right-0 h-1 bg-primary"
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.15 + 0.5, duration: 0.6 }}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Team3D;
