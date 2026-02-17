import { motion } from "framer-motion";
import { Clock, MoreVertical, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useContracts } from "@/hooks/useContracts";

const ActiveProjects = () => {
  const { data, isLoading } = useContracts();

  const activeContracts = (data?.results ?? []).filter(
    (c) => c.status === "IN_PROGRESS"
  );

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

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="animate-spin text-muted-foreground" size={24} />
          </div>
        ) : activeContracts.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">
            Aucun projet actif pour le moment.
          </p>
        ) : (
          <div className="space-y-4">
            {activeContracts.map((contract, index) => (
              <motion.div
                key={contract.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                className="p-4 rounded-xl border border-border hover:border-primary/50 transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h4 className="font-semibold mb-1">{contract.project.title}</h4>
                    <p className="text-sm text-muted-foreground">
                      Client: {contract.client.username}
                    </p>
                  </div>
                  <button className="p-1 hover:bg-muted rounded-lg">
                    <MoreVertical size={18} />
                  </button>
                </div>

                <div className="flex items-center gap-2 mb-3">
                  <Badge variant="secondary" className="bg-blue-500 text-white">
                    {contract.status_display}
                  </Badge>
                  {contract.end_at && (
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Clock size={14} />
                      <span>{new Date(contract.end_at).toLocaleDateString("fr-FR")}</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-green-600">
                    {parseFloat(contract.total_amount).toLocaleString("fr-FR")} GNF
                  </span>
                  <Button size="sm" variant="outline">
                    Voir détails
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </Card>
    </motion.div>
  );
};

export default ActiveProjects;
