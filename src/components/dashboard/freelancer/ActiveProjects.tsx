import { motion } from "framer-motion";
import { Clock, MoreVertical } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";

const projects = [
  {
    id: 1,
    title: "Développement Application Mobile E-commerce",
    client: "Orange Guinée",
    progress: 75,
    deadline: "15 Mars 2026",
    budget: "8,500 GNF",
    status: "En cours",
    statusColor: "bg-blue-500",
  },
  {
    id: 2,
    title: "Refonte Site Web Corporate",
    client: "Ecobank Guinée",
    progress: 45,
    deadline: "28 Mars 2026",
    budget: "6,200 GNF",
    status: "En cours",
    statusColor: "bg-blue-500",
  },
  {
    id: 3,
    title: "Système de Gestion Inventaire",
    client: "UBA Guinée",
    progress: 90,
    deadline: "10 Mars 2026",
    budget: "12,000 GNF",
    status: "Presque terminé",
    statusColor: "bg-green-500",
  },
];

const ActiveProjects = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">Projets Actifs</h3>
          <Button variant="ghost" size="sm">
            Voir tout
          </Button>
        </div>

        <div className="space-y-4">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + index * 0.1 }}
              className="p-4 rounded-xl border border-border hover:border-primary/50 transition-colors"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h4 className="font-semibold mb-1">{project.title}</h4>
                  <p className="text-sm text-muted-foreground">{project.client}</p>
                </div>
                <button className="p-1 hover:bg-muted rounded-lg">
                  <MoreVertical size={18} />
                </button>
              </div>

              <div className="flex items-center gap-2 mb-3">
                <Badge variant="secondary" className={`${project.statusColor} text-white`}>
                  {project.status}
                </Badge>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Clock size={14} />
                  <span>{project.deadline}</span>
                </div>
              </div>

              <div className="mb-3">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Progression</span>
                  <span className="font-semibold">{project.progress}%</span>
                </div>
                <Progress value={project.progress} />
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-green-600">{project.budget}</span>
                <Button size="sm" variant="outline">
                  Voir détails
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </Card>
    </motion.div>
  );
};

export default ActiveProjects;
