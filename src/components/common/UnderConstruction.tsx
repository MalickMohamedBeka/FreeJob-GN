import { Construction } from "lucide-react";
import { Card } from "@/components/ui/card";

interface UnderConstructionProps {
  title?: string;
  description?: string;
}

export function UnderConstruction({
  title = "Fonctionnalité en cours de développement",
  description = "Cette section sera bientôt disponible. Nous travaillons activement pour vous offrir cette fonctionnalité.",
}: UnderConstructionProps) {
  return (
    <Card className="p-8 flex flex-col items-center justify-center text-center min-h-[300px]">
      <div className="p-4 rounded-full bg-muted mb-4">
        <Construction className="text-muted-foreground" size={40} />
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground max-w-md">{description}</p>
    </Card>
  );
}
