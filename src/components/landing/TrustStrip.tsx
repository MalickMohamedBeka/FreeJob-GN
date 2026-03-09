import { motion } from "framer-motion";
import { Shield, BadgeCheck, MessageSquare, CreditCard, Trophy, Star } from "lucide-react";

const items = [
  { icon: Shield,       label: "Paiement sécurisé",   sub: "Escrow garanti" },
  { icon: BadgeCheck,   label: "Profils vérifiés",     sub: "Identité contrôlée" },
  { icon: CreditCard,   label: "Mobile Money",          sub: "Orange Money · MTN" },
  { icon: Trophy,       label: "Classement objectif",  sub: "Basé sur les avis réels" },
  { icon: MessageSquare,label: "Support réactif",       sub: "Réponse sous 24h" },
  { icon: Star,         label: "Sans commission",       sub: "0% sur vos revenus" },
];

const TrustStrip = () => (
  <section className="py-10 border-y border-border bg-white">
    <div className="container mx-auto px-4 lg:px-8">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {items.map((item, i) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{ duration: 0.35, delay: i * 0.06 }}
              className="flex flex-col items-center text-center gap-2 py-2"
            >
              <div className="w-10 h-10 rounded-xl bg-primary/8 flex items-center justify-center">
                <Icon size={18} className="text-primary" />
              </div>
              <div>
                <p className="text-xs font-semibold text-foreground leading-tight">{item.label}</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">{item.sub}</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  </section>
);

export default TrustStrip;
