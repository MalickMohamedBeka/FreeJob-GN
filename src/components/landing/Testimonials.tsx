import { motion } from "framer-motion";
import { InfiniteMovingCards } from "@/components/ui/infinite-moving-cards";

const testimonials = [
  {
    quote: "FreeJobGN a transformé la façon dont nous trouvons des talents. En quelques jours, nous avons trouvé le développeur parfait pour notre projet.",
    name: "Mamadou Bah",
    title: "CEO, TechStart Guinea",
    rating: 5,
  },
  {
    quote: "Grâce à FreeJobGN, j'ai pu développer ma carrière de freelance et travailler avec des clients incroyables en Guinée et à l'international.",
    name: "Aissatou Diallo",
    title: "Freelance Designer",
    rating: 5,
  },
  {
    quote: "La qualité des freelancers sur cette plateforme est exceptionnelle. Nos projets sont livrés dans les temps et dépassent nos attentes.",
    name: "Ibrahim Keita",
    title: "Directeur Marketing, AfricaConnect",
    rating: 5,
  },
  {
    quote: "Le système de paiement sécurisé m'a donné confiance pour démarrer mes premières collaborations. Je recommande à tous les entrepreneurs guinéens.",
    name: "Fatoumata Sow",
    title: "Fondatrice, Conakry Digital",
    rating: 5,
  },
  {
    quote: "Enfin une plateforme qui comprend le marché africain ! Les tarifs sont adaptés et les freelancers sont vraiment professionnels.",
    name: "Boubacar Camara",
    title: "CTO, AfriPay",
    rating: 5,
  },
  {
    quote: "J'ai décroché 3 contrats en moins d'une semaine après mon inscription. FreeJobGN est incontournable pour les freelancers guinéens.",
    name: "Mariama Kouyaté",
    title: "Développeuse Full-Stack",
    rating: 5,
  },
];

const Testimonials = () => {
  return (
    <section className="py-20 lg:py-28 bg-muted/40 overflow-hidden">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="text-center max-w-2xl mx-auto mb-14"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ce que disent nos <span className="text-secondary">utilisateurs</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Des milliers de professionnels nous font confiance.
          </p>
        </motion.div>
      </div>

      {/* Full-width scrolling row 1 — left */}
      <InfiniteMovingCards
        items={testimonials}
        direction="left"
        speed="slow"
        className="mb-4"
      />

      {/* Full-width scrolling row 2 — right (reversed) */}
      <InfiniteMovingCards
        items={[...testimonials].reverse()}
        direction="right"
        speed="slow"
      />
    </section>
  );
};

export default Testimonials;
