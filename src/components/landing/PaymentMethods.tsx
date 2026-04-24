import { motion } from "framer-motion";
import { Shield, CheckCircle } from "lucide-react";

const paymentMethods = [
  {
    name: "Orange Money",
    logo: "/payment/orange_money.png",
    description: "Paiement mobile",
    bg: "bg-white",
  },
  {
    name: "MTN MoMo",
    logo: "/payment/mtn_momo.png",
    description: "Mobile Money",
    bg: "bg-white",
  },
  {
    name: "Kulu",
    logo: "/payment/kulu.jpeg",
    description: "Paiement mobile",
    bg: "bg-white",
  },
  {
    name: "Soutra Money",
    logo: "/payment/soutra_money.png",
    description: "Paiement mobile",
    bg: "bg-white",
  },
  {
    name: "Paycard",
    logo: "/payment/paycard.png",
    description: "Carte prépayée",
    bg: "bg-white",
  },
  {
    name: "Visa",
    logo: "/payment/visa.png",
    description: "Carte bancaire",
  },
];

const features = [
  "Paiements 100% sécurisés",
  "Transactions instantanées",
  "Support 24/7",
  "Frais transparents",
];

const PaymentMethods = () => {
  return (
    <section className="py-20 bg-muted/40">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary font-semibold text-sm mb-4 border border-primary/20">
            <Shield size={14} />
            Paiements Sécurisés
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Moyens de <span className="text-secondary">Paiement</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Payez et recevez vos paiements en toute sécurité avec nos partenaires de confiance
          </p>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-10">
          {paymentMethods.map((method, index) => (
            <motion.div
              key={method.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.4, ease: "easeOut", delay: index * 0.08 }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="bg-white rounded-xl p-5 border border-border hover:shadow-md transition-shadow cursor-default"
            >
              <div className="flex flex-col items-center text-center gap-3">
                <div className={`w-full h-14 flex items-center justify-center ${method.bg} rounded-lg p-2 border border-border/40`}>
                  <img
                    src={method.logo}
                    alt={method.name}
                    className="max-w-full max-h-full object-contain"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                      const parent = e.currentTarget.parentElement;
                      if (parent) {
                        parent.innerHTML = `<span class="text-sm font-bold text-primary">${method.name}</span>`;
                      }
                    }}
                  />
                </div>
                <div>
                  <h3 className="font-semibold text-sm">{method.name}</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">{method.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.45, ease: "easeOut", delay: 0.2 }}
          className="bg-primary rounded-xl p-8 md:p-10"
        >
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature) => (
              <div key={feature} className="flex items-center gap-3 text-white">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                  <CheckCircle size={16} />
                </div>
                <span className="font-medium text-sm">{feature}</span>
              </div>
            ))}
          </div>
        </motion.div>

        <p className="text-center text-sm text-muted-foreground mt-6">
          Toutes les transactions sont cryptées selon les normes internationales
        </p>
      </div>
    </section>
  );
};

export default PaymentMethods;
