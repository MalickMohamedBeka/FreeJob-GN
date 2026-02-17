import { motion } from "framer-motion";
import { CheckCircle2, Circle, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { useFreelanceProfile } from "@/hooks/useProfile";
import { Link } from "react-router-dom";

const ProfileCompletion = () => {
  const { data: profile, isLoading } = useFreelanceProfile();

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="p-6 flex items-center justify-center min-h-[200px]">
          <Loader2 className="animate-spin text-muted-foreground" size={24} />
        </Card>
      </motion.div>
    );
  }

  if (!profile) return null;

  const steps = [
    {
      label: "Photo de profil ajoutée",
      completed: !!profile.profile_picture,
    },
    {
      label: "Bio rédigée",
      completed: !!profile.bio && profile.bio.trim().length > 0,
    },
    {
      label: "Compétences définies",
      completed: profile.skills.length > 0,
    },
    {
      label: "Spécialité définie",
      completed: !!profile.speciality,
    },
    {
      label: "Téléphone renseigné",
      completed: !!profile.phone && profile.phone.trim().length > 0,
    },
    {
      label: "Localisation renseignée",
      completed: !!profile.city_or_region && profile.city_or_region.trim().length > 0,
    },
    {
      label: "Taux horaire défini",
      completed: !!profile.hourly_rate && parseFloat(profile.hourly_rate) > 0,
    },
  ];

  const completedSteps = steps.filter((s) => s.completed).length;
  const progress = Math.round((completedSteps / steps.length) * 100);

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
          <span className="text-2xl font-bold text-primary">{progress}%</span>
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

        {progress < 100 && (
          <Link to="/dashboard/profile">
            <Button className="w-full">Compléter mon profil</Button>
          </Link>
        )}
      </Card>
    </motion.div>
  );
};

export default ProfileCompletion;
