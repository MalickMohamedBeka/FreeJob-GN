import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Star, Quote } from "lucide-react";
import { mockTestimonials } from "@/lib/mockData";

const Testimonials = () => {
  const [current, setCurrent] = useState(0);

  const next = () => setCurrent((c) => (c + 1) % mockTestimonials.length);
  const prev = () => setCurrent((c) => (c - 1 + mockTestimonials.length) % mockTestimonials.length);

  return (
    <section className="py-20 lg:py-28 bg-muted/50">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ce que disent nos <span className="text-gradient-hero">utilisateurs</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Des milliers de professionnels nous font confiance.
          </p>
        </motion.div>

        <div className="max-w-3xl mx-auto relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
              className="bg-card rounded-2xl p-8 md:p-12 shadow-elevation-2 border border-border/50 text-center"
            >
              <Quote className="mx-auto mb-6 text-primary/20" size={48} />

              <p className="text-lg md:text-xl leading-relaxed text-foreground/80 mb-8">
                "{mockTestimonials[current].content}"
              </p>

              <div className="flex justify-center gap-1 mb-4">
                {[...Array(mockTestimonials[current].rating)].map((_, i) => (
                  <Star key={i} size={18} className="fill-warning text-warning" />
                ))}
              </div>

              <div className="w-12 h-12 rounded-full bg-gradient-hero mx-auto mb-3 flex items-center justify-center text-sm font-bold text-primary-foreground">
                {mockTestimonials[current].name.split(" ").map((n) => n[0]).join("")}
              </div>
              <h4 className="font-semibold">{mockTestimonials[current].name}</h4>
              <p className="text-sm text-muted-foreground">{mockTestimonials[current].role}</p>
            </motion.div>
          </AnimatePresence>

          <div className="flex justify-center gap-4 mt-8">
            <button
              onClick={prev}
              className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:bg-muted transition-colors"
              aria-label="Précédent"
            >
              <ChevronLeft size={20} />
            </button>
            <div className="flex items-center gap-2">
              {mockTestimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                    i === current ? "bg-primary w-6" : "bg-border"
                  }`}
                  aria-label={`Témoignage ${i + 1}`}
                />
              ))}
            </div>
            <button
              onClick={next}
              className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:bg-muted transition-colors"
              aria-label="Suivant"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
