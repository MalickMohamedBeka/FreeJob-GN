import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { UnderConstruction } from "@/components/common";

const EarningsChart = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
    >
      <UnderConstruction
        title="Revenus Mensuels"
        description="Le suivi des revenus sera disponible prochainement."
      />
    </motion.div>
  );
};

export default EarningsChart;
