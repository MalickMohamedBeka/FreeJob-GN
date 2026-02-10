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
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary font-semibold text-sm mb-4">
            <Shield size={16} />
            Paiements Sécurisés
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Moyens de <span className="text-gradient-hero">Paiement</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Payez et recevez vos paiements en toute sécurité avec nos partenaires de confiance
          </p>
        </motion.div>

        {/* Payment Methods Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {paymentMethods.map((method, index) => (
            <motion.div
              key={method.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="bg-white rounded-2xl p-6 shadow-elevation-1 hover:shadow-elevation-3 transition-all border border-border/50"
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-full h-20 flex items-center justify-center mb-4 bg-muted/30 rounded-xl p-4">
                  <img
                    src={method.logo}
                    alt={method.name}
                    className="max-w-full max-h-full object-contain"
                    onError={(e) => {
                      // Fallback si l'image ne charge pas
                      e.currentTarget.style.display = 'none';
                      e.currentTarget.parentElement!.innerHTML = `<span class="text-2xl font-bold text-primary">${method.name}</span>`;
                    }}
                  />
                </div>
                <h3 className="font-semibold text-lg mb-1">{method.name}</h3>
                <p className="text-sm text-muted-foreground">{method.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-gradient-to-br from-primary to-secondary rounded-3xl p-8 md:p-12"
        >
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                className="flex items-center gap-3 text-white"
              >
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                  <CheckCircle size={18} />
                </div>
                <span className="font-medium">{feature}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Trust Badge */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="text-center mt-8"
        >
          <p className="text-sm text-muted-foreground">
            🔒 Toutes les transactions sont cryptées et sécurisées selon les normes internationales
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default PaymentMethods;
