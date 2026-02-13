import { motion } from "framer-motion";

const partners = [
  { name: "Partenaire 1", logo: "/partners/partner-1.png" },
  { name: "Partenaire 2", logo: "/partners/partner-2.jpg" },
  { name: "Partenaire 3", logo: "/partners/partner-3.jpg" },
  { name: "Partenaire 4", logo: "/partners/partner-4.jpg" },
  { name: "Partenaire 5", logo: "/partners/partner-5.jpg" },
  { name: "Partenaire 6", logo: "/partners/partner-6.jpg" },
  { name: "Partenaire 7", logo: "/partners/partner-7.png" },
];

const PartnersCarousel = () => {
  // Duplicate partners array for infinite scroll effect
  const duplicatedPartners = [...partners, ...partners];

  return (
    <section className="py-16 lg:py-20 relative overflow-hidden bg-gradient-to-br from-muted/30 to-muted/60">
      {/* Background Shapes */}
      <div className="absolute top-10 right-10 w-64 h-64 rounded-full bg-primary opacity-10 blur-3xl" />
      <div className="absolute bottom-10 left-10 w-80 h-80 rounded-full bg-secondary/10 blur-3xl" />

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-2xl mx-auto mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Nos <span className="text-primary">Partenaires</span> de Confiance
          </h2>
          <p className="text-muted-foreground text-lg">
            Ils nous font confiance pour connecter les talents africains
          </p>
        </motion.div>

        {/* Infinite Scrolling Carousel */}
        <div className="relative overflow-hidden">
          <motion.div
            className="flex gap-8 items-center"
            animate={{
              x: [0, -100 * partners.length],
            }}
            transition={{
              x: {
                repeat: Infinity,
                repeatType: "loop",
                duration: 30,
                ease: "linear",
              },
            }}
          >
            {duplicatedPartners.map((partner, index) => (
              <motion.div
                key={`${partner.name}-${index}`}
                whileHover={{ 
                  scale: 1.1,
                  y: -8,
                  transition: { duration: 0.3 }
                }}
                className="flex-shrink-0 w-32 h-24 glass rounded-2xl p-4 shadow-elevation-2 hover:shadow-elevation-4 border border-white/30 flex items-center justify-center group relative"
              >
                {/* Logo - Using text as placeholder until real logos are added */}
                <div className="relative z-10 w-full h-full flex items-center justify-center">
                  <img
                    src={partner.logo}
                    alt={partner.name}
                    className="max-w-full max-h-full object-contain filter grayscale hover:grayscale-0 transition-all duration-300"
                    onError={(e) => {
                      // Fallback to text if image not found
                      e.currentTarget.style.display = 'none';
                      const parent = e.currentTarget.parentElement;
                      if (parent && !parent.querySelector('.fallback-text')) {
                        const fallback = document.createElement('div');
                        fallback.className = 'fallback-text text-xs font-bold text-center text-muted-foreground group-hover:text-primary transition-colors';
                        fallback.textContent = partner.name;
                        parent.appendChild(fallback);
                      }
                    }}
                  />
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Gradient Overlays for fade effect */}
          <div className="absolute left-0 top-0 bottom-0 w-20 bg-primary pointer-events-none z-10" />
          <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-muted/60 to-transparent pointer-events-none z-10" />
        </div>
      </div>
    </section>
  );
};

export default PartnersCarousel;
