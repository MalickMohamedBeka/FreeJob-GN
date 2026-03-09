import { motion } from "framer-motion";
import { Clock, MoreVertical, Loader2, FileText, MessageSquare } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useContracts } from "@/hooks/useContracts";
import { Link, useNavigate } from "react-router-dom";
import { ROUTES } from "@/constants/routes";

const ActiveProjects = () => {
  const { data, isLoading } = useContracts();
  const navigate = useNavigate();

  const activeContracts = (data?.results ?? []).filter(
    (c) => c.status === "IN_PROGRESS",
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
          <Link to={ROUTES.DASHBOARD.MY_PROJECTS}>
            <Button variant="ghost" size="sm">
              Voir tout
            </Button>
          </Link>
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
                  <div className="flex-1 min-w-0 pr-2">
                    <h4 className="font-semibold mb-1 truncate">
                      {contract.project.title}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Client : {contract.client.username}
                    </p>
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="p-1 hover:bg-muted rounded-lg transition-colors flex-shrink-0">
                        <MoreVertical size={18} className="text-muted-foreground" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-44">
                      <DropdownMenuItem
                        className="gap-2 cursor-pointer"
                        onClick={() => navigate(ROUTES.DASHBOARD.MY_PROJECTS)}
                      >
                        <FileText size={14} />
                        Voir les détails
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="gap-2 cursor-pointer"
                        onClick={() => navigate(ROUTES.DASHBOARD.MESSAGES)}
                      >
                        <MessageSquare size={14} />
                        Contacter le client
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="flex items-center gap-2 mb-3">
                  <Badge variant="secondary" className="bg-blue-500 text-white">
                    {contract.status_display}
                  </Badge>
                  {contract.end_at && (
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Clock size={14} />
                      <span>
                        {new Date(contract.end_at).toLocaleDateString("fr-FR")}
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-green-600">
                    {parseFloat(contract.total_amount).toLocaleString("fr-FR")}{" "}
                    GNF
                  </span>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => navigate(ROUTES.DASHBOARD.MY_PROJECTS)}
                  >
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
