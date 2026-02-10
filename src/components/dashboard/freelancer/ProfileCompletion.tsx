import { motion } from "framer-motion";
import { CheckCircle2, Circle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";

const steps = [
  { label: "Photo de profil ajoutée", completed: true },
  { label: "Compétences définies", completed: true },
  { label: "Portfolio ajouté", completed: true },
  { label: "Vérification d'identité", completed: false },
  { label: "Certification professionnelle", completed: false },
];

const ProfileCompletion = () => {
  const completedSteps = steps.filter((s) => s.completed).length;
  const progress = (completedSteps / steps.length) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
    >
      <Card className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold mb-1">Complétez votre profil</h3>
            <p className="text-sm text-muted-foreground">
              {completedSteps}/{steps.length} étapes complétées
            </p>
          </div>
          <span className="text-2xl font-bold text-primary">{Math.round(progress)}%</span>
        </div>

        <Progress value={progress} className="mb-4" />

        <div className="space-y-3 mb-4">
          {steps.map((step, index) => (
            <div key={index} className="flex items-center gap-3">
              {step.completed ? (
                <CheckCircle2 className="text-green-500 flex-shrink-0" size={20} />
              ) : (
                <Circle className="text-muted-foreground flex-shrink-0" size={20} />
              )}
              <span
                className={`text-sm ${
                  step.completed ? "text-foreground" : "text-muted-foreground"
                }`}
              >
                {step.label}
              </span>
            </div>
          ))}
        </div>

        <Button className="w-full">Compléter mon profil</Button>
      </Card>
    </motion.div>
  );
};

export default ProfileCompletion;
