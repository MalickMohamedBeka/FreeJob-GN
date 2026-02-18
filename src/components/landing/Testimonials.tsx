import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Star, Quote } from "lucide-react";
import { mockTestimonials } from "@/lib/mockData";

const Testimonials = () => {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);

  const next = () => {
    setDirection(1);
    setCurrent((c) => (c + 1) % mockTestimonials.length);
  };
  const prev = () => {
    setDirection(-1);
    setCurrent((c) => (c - 1 + mockTestimonials.length) % mockTestimonials.length);
  };

  const t = mockTestimonials[current];

  return (
    <section className="py-20 lg:py-28 bg-muted/40">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ce que disent nos <span className="text-secondary">utilisateurs</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Des milliers de professionnels nous font confiance.
          </p>
        </motion.div>

        <div className="max-w-3xl mx-auto">
          <div className="relative overflow-hidden rounded-2xl border border-border bg-white min-h-[260px]">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={current}
                custom={direction}
                initial={{ opacity: 0, x: direction * 60 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: direction * -60 }}
                transition={{ duration: 0.35, ease: "easeInOut" }}
                className="p-8 md:p-12 relative"
              >
                <Quote className="absolute top-6 right-6 text-primary/20" size={40} />

                <p className="text-lg leading-relaxed text-foreground mb-8">
                  "{t.content}"
                </p>

                <div className="flex justify-center gap-1 mb-6">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} size={18} className="fill-warning text-warning" />
                  ))}
                </div>

                <div className="flex items-center justify-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white font-bold">
                    {t.name.split(" ").slice(0, 2).map((w: string) => w[0]).join("")}
                  </div>
                  <div className="text-left">
                    <p className="font-semibold">{t.name}</p>
                    <p className="text-sm text-muted-foreground">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="flex justify-center items-center gap-4 mt-8">
            <button
              onClick={prev}
              className="w-10 h-10 rounded-full border border-border bg-white flex items-center justify-center hover:bg-muted transition-colors"
              aria-label="Précédent"
            >
              <ChevronLeft size={20} />
            </button>

            <div className="flex items-center gap-2">
              {mockTestimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setDirection(i > current ? 1 : -1);
                    setCurrent(i);
                  }}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    i === current ? "bg-primary w-6" : "bg-border w-2 hover:bg-muted-foreground"
                  }`}
                  aria-label={`Témoignage ${i + 1}`}
                />
              ))}
            </div>

            <button
              onClick={next}
              className="w-10 h-10 rounded-full border border-border bg-white flex items-center justify-center hover:bg-muted transition-colors"
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
