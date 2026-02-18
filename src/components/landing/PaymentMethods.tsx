import { motion } from "framer-motion";
import { Shield, CheckCircle } from "lucide-react";

const paymentMethods = [
  {
    name: "Orange Money",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Orange_logo.svg/200px-Orange_logo.svg.png",
    description: "Paiement mobile sécurisé",
  },
  {
    name: "Ria Money Transfer",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8f/Ria_Money_Transfer_logo.svg/200px-Ria_Money_Transfer_logo.svg.png",
    description: "Transfert international",
  },
  {
    name: "Visa",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/200px-Visa_Inc._logo.svg.png",
    description: "Carte bancaire",
  },
  {
    name: "Mastercard",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/200px-Mastercard-logo.svg.png",
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

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {paymentMethods.map((method, index) => (
            <motion.div
              key={method.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.4, ease: "easeOut", delay: index * 0.09 }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="bg-white rounded-xl p-6 border border-border hover:shadow-md transition-shadow cursor-default"
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-full h-16 flex items-center justify-center mb-4 bg-muted/30 rounded-lg p-3">
                  <img
                    src={method.logo}
                    alt={method.name}
                    className="max-w-full max-h-full object-contain"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                      const parent = e.currentTarget.parentElement;
                      if (parent) {
                        parent.innerHTML = `<span class="text-base font-bold text-primary">${method.name}</span>`;
                      }
                    }}
                  />
                </div>
                <h3 className="font-semibold mb-1">{method.name}</h3>
                <p className="text-sm text-muted-foreground">{method.description}</p>
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
