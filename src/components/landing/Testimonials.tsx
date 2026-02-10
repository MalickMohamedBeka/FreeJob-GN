import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Star, Quote } from "lucide-react";
import { mockTestimonials } from "@/lib/mockData";

const Testimonials = () => {
  const [current, setCurrent] = useState(0);

  const next = () => setCurrent((c) => (c + 1) % mockTestimonials.length);
  const prev = () => setCurrent((c) => (c - 1 + mockTestimonials.length) % mockTestimonials.length);

  return (
    <section className="py-20 lg:py-28 bg-muted/50 relative overflow-hidden">
      {/* 3D Background */}
      <div className="absolute inset-0 bg-primary opacity-[0.02]" />
      <motion.div 
        animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-secondary/5 blur-3xl"
      />
      
      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ce que disent nos <span className="text-primary">utilisateurs</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Des milliers de professionnels nous font confiance.
          </p>
        </motion.div>

        <div className="max-w-3xl mx-auto relative lg:perspective-container">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, x: 100, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -100, scale: 0.9 }}
              transition={{ duration: 0.5, type: "spring" }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="glass rounded-3xl p-8 md:p-12 shadow-elevation-4 hover:shadow-elevation-5 border border-white/30 text-center lg:card-3d relative"
            >
              {/* 3D Quote Icon */}
              <motion.div
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-6 right-6 w-16 h-16 rounded-2xl glass-dark flex items-center justify-center shadow-elevation-2"
              >
                <Quote className="text-primary" size={28} />
              </motion.div>

              <p className="text-lg md:text-xl leading-relaxed text-foreground/90 mb-8 font-medium">
                "{mockTestimonials[current].content}"
              </p>

              <motion.div 
                className="flex justify-center gap-1 mb-6"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: "spring" }}
              >
                {[...Array(mockTestimonials[current].rating)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + i * 0.1 }}
                    whileHover={{ scale: 1.3, rotate: 360 }}
                  >
                    <Star size={20} className="fill-warning text-warning drop-shadow-lg" />
                  </motion.div>
                ))}
              </motion.div>

              <motion.div 
                className="w-16 h-16 rounded-full mx-auto mb-4 overflow-hidden shadow-elevation-3 relative border-2 border-white/30"
                whileHover={{ scale: 1.15, rotate: 5 }}
                transition={{ duration: 0.5 }}
              >
                <img 
                  src={`/avatars/client-${(current % 10) + 1}.jpg`}
                  alt={mockTestimonials[current].name}
                  className="relative z-10 w-full h-full object-cover"
                />
              </motion.div>
              
              <h4 className="font-bold text-lg">{mockTestimonials[current].name}</h4>
              <p className="text-sm text-muted-foreground font-medium">{mockTestimonials[current].role}</p>
              
              {/* 3D Glow */}
              <div className="absolute inset-0 rounded-3xl bg-primary opacity-0 hover:opacity-5 blur-2xl transition-opacity duration-500" />
            </motion.div>
          </AnimatePresence>

          <div className="flex justify-center gap-4 mt-10">
            <motion.button
              onClick={prev}
              whileHover={{ scale: 1.1, x: -4 }}
              whileTap={{ scale: 0.95 }}
              className="w-12 h-12 rounded-full glass border border-white/30 flex items-center justify-center shadow-elevation-2 hover:shadow-elevation-3 transition-all"
              aria-label="Précédent"
            >
              <ChevronLeft size={22} />
            </motion.button>
            
            <div className="flex items-center gap-2">
              {mockTestimonials.map((_, i) => (
                <motion.button
                  key={i}
                  onClick={() => setCurrent(i)}
                  whileHover={{ scale: 1.3 }}
                  whileTap={{ scale: 0.9 }}
                  className={`h-3 rounded-full transition-all duration-300 ${
                    i === current 
                      ? "bg-primary w-8 shadow-glow-orange" 
                      : "bg-border w-3 hover:bg-primary/50"
                  }`}
                  aria-label={`Témoignage ${i + 1}`}
                />
              ))}
            </div>
            
            <motion.button
              onClick={next}
              whileHover={{ scale: 1.1, x: 4 }}
              whileTap={{ scale: 0.95 }}
              className="w-12 h-12 rounded-full glass border border-white/30 flex items-center justify-center shadow-elevation-2 hover:shadow-elevation-3 transition-all"
              aria-label="Suivant"
            >
              <ChevronRight size={22} />
            </motion.button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
