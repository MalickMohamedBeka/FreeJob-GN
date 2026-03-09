import { motion } from "framer-motion";
import { Linkedin, Twitter, Mail, MapPin } from "lucide-react";
import { team } from "@/data/team";

/** Fallback when no image is provided */
const AvatarSilhouette = () => (
  <svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <circle cx="40" cy="28" r="17" fill="rgba(255,255,255,0.82)" />
    <path d="M2 82 Q4 54 40 50 Q76 54 78 82 Z" fill="rgba(255,255,255,0.82)" />
  </svg>
);

const Team3D = () => {
  return (
    <section className="py-24 bg-white">
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

        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
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
              {/* Gradient avatar section */}
              <div className={`relative bg-gradient-to-br ${member.color} pt-10 pb-14`}>
                {/* Decorative circle */}
                <div className="absolute top-0 right-0 w-24 h-24 rounded-full bg-white/10 -translate-y-6 translate-x-6" />

                <div className="flex justify-center relative">
                  <div className="w-24 h-24 rounded-2xl overflow-hidden border-2 border-white/30 shadow-sm group-hover:scale-105 transition-transform duration-300 bg-white/10">
                    {member.image ? (
                      <img
                        src={member.image}
                        alt={member.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <AvatarSilhouette />
                    )}
                  </div>
                </div>

                {/* Location — hidden on hover, social icons take its place */}
                <div className="absolute bottom-3 left-0 right-0 flex justify-center group-hover:opacity-0 transition-opacity duration-200">
                  <span className="inline-flex items-center gap-1 bg-white/20 text-white text-xs px-2.5 py-1 rounded-full">
                    <MapPin size={9} />
                    {member.location}
                  </span>
                </div>

                {/* Social links on hover */}
                <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {[Linkedin, Twitter, Mail].map((Icon, i) => (
                    <button
                      key={i}
                      className="w-8 h-8 rounded-full bg-white/20 border border-white/30 flex items-center justify-center text-white hover:bg-white hover:text-primary transition-colors"
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
