import { motion } from "framer-motion";
import { Clock, Coins, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useProjects } from "@/hooks/useProjects";
import { Link } from "react-router-dom";

const AvailableJobs = () => {
  const { data, isLoading } = useProjects();

  const jobs = (data?.results ?? [])
    .filter((p) => p.status === "PUBLISHED")
    .slice(0, 3);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
    >
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">Projets Disponibles</h3>
          <Link to="/projects">
            <Button variant="ghost" size="sm">
              Voir tout
            </Button>
          </Link>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="animate-spin text-muted-foreground" size={24} />
          </div>
        ) : jobs.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">
            Aucun projet disponible pour le moment.
          </p>
        ) : (
          <div className="space-y-4">
            {jobs.map((job, index) => (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 + index * 0.1 }}
                className="p-4 rounded-xl border border-border hover:border-primary/50 transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h4 className="font-semibold mb-1">{job.title}</h4>
                    <p className="text-sm text-muted-foreground">
                      {job.client.username}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-3">
                  {job.skills.map((skill) => (
                    <Badge key={skill.id} variant="secondary">
                      {skill.name}
                    </Badge>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-2 mb-3 text-sm text-muted-foreground">
                  {job.deadline && (
                    <div className="flex items-center gap-1">
                      <Clock size={14} />
                      <span>{new Date(job.deadline).toLocaleDateString("fr-FR")}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1">
                    <Coins size={14} />
                    <span>{job.budget_band_display}</span>
                  </div>
                </div>

                <Link to={`/projects/${job.id}`}>
                  <Button className="w-full" size="sm">
                    Voir le projet
                  </Button>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </Card>
    </motion.div>
  );
};

export default AvailableJobs;
