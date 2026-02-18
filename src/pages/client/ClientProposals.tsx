import { motion } from "framer-motion";
import { useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Loader2,
  FileText,
  Coins,
  Clock,
  Star,
  StarOff,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { useMyProjects } from "@/hooks/useProjects";
import {
  useProposalsByProject,
  useShortlistProposal,
  useUnshortlistProposal,
  useSelectProposal,
  useRefuseProposal,
} from "@/hooks/useProposals";

const statusConfig: Record<string, { label: string; class: string }> = {
  PENDING: { label: "En attente", class: "bg-yellow-500 text-white" },
  SHORTLISTED: { label: "Présélectionné", class: "bg-blue-500 text-white" },
  SELECTED: { label: "Sélectionné", class: "bg-orange-500 text-white" },
  CONFIRMED: { label: "Confirmé", class: "bg-primary text-white" },
  REFUSED: { label: "Refusé", class: "bg-muted text-foreground" },
  WITHDRAWN: { label: "Retiré", class: "bg-muted text-foreground" },
  REFUSED_AUTOCLOSE: { label: "Refusé auto", class: "bg-muted text-foreground" },
  DECLINED_BY_PROVIDER: { label: "Décliné", class: "bg-muted text-foreground" },
};

const ClientProposals = () => {
  const [selectedProjectId, setSelectedProjectId] = useState<string>("");

  const { data: projectsData } = useMyProjects();
  const projects = projectsData?.results ?? [];

  const { data: proposalsData, isLoading } = useProposalsByProject(selectedProjectId);
  const proposals = proposalsData?.results ?? [];

  const shortlist = useShortlistProposal();
  const unshortlist = useUnshortlistProposal();
  const select = useSelectProposal();
  const refuse = useRefuseProposal();

  const anyPending = shortlist.isPending || unshortlist.isPending || select.isPending || refuse.isPending;

  return (
    <DashboardLayout userType="client">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Propositions Reçues</h1>
          <p className="text-muted-foreground">Évaluez et sélectionnez les meilleurs prestataires</p>
        </div>

        {/* Project filter */}
        <Card className="p-4">
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium whitespace-nowrap">Filtrer par projet</label>
            <Select value={selectedProjectId} onValueChange={setSelectedProjectId}>
              <SelectTrigger className="max-w-xs">
                <SelectValue placeholder="Choisir un projet…" />
              </SelectTrigger>
              <SelectContent>
                {projects.map((p) => (
                  <SelectItem key={p.id} value={p.id}>{p.title}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </Card>

        {!selectedProjectId ? (
          <div className="text-center py-12 text-muted-foreground">
            <FileText className="mx-auto mb-4" size={48} />
            <p>Sélectionnez un projet pour voir ses propositions</p>
          </div>
        ) : isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="animate-spin text-primary" size={40} />
          </div>
        ) : proposals.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <FileText className="mx-auto mb-4" size={48} />
            <p className="text-lg font-medium">Aucune proposition pour ce projet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {proposals.map((proposal, index) => {
              const sc = statusConfig[proposal.status] ?? { label: proposal.status_display, class: "bg-muted" };
              const canShortlist = proposal.status === "PENDING";
              const canUnshortlist = proposal.status === "SHORTLISTED";
              const canSelect = proposal.status === "SHORTLISTED" || proposal.status === "PENDING";
              const canRefuse = proposal.status === "PENDING" || proposal.status === "SHORTLISTED";

              return (
                <motion.div
                  key={proposal.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold mb-1">{proposal.provider.username}</h3>
                        <p className="text-sm text-muted-foreground">Projet: {proposal.project.title}</p>
                      </div>
                      <Badge className={sc.class}>{sc.label}</Badge>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4 mb-4 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Coins size={16} />
                        <span className="font-medium text-foreground">
                          {Number(proposal.price).toLocaleString()} GNF
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Clock size={16} />
                        <span>{proposal.duration_days} jours</span>
                      </div>
                    </div>

                    <div className="p-4 bg-muted/50 rounded-lg mb-4">
                      <p className="text-xs text-muted-foreground mb-1">Lettre de motivation</p>
                      <p className="text-sm line-clamp-4">{proposal.message}</p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {canShortlist && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="gap-2 border-blue-500 text-blue-600 hover:bg-blue-50"
                          disabled={anyPending}
                          onClick={() => shortlist.mutate(proposal.id)}
                        >
                          <Star size={14} />
                          Présélectionner
                        </Button>
                      )}

                      {canUnshortlist && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="gap-2"
                          disabled={anyPending}
                          onClick={() => unshortlist.mutate(proposal.id)}
                        >
                          <StarOff size={14} />
                          Retirer présélection
                        </Button>
                      )}

                      {canSelect && (
                        <Button
                          size="sm"
                          className="gap-2"
                          disabled={anyPending}
                          onClick={() => select.mutate(proposal.id)}
                        >
                          {select.isPending ? (
                            <Loader2 size={14} className="animate-spin" />
                          ) : (
                            <CheckCircle2 size={14} />
                          )}
                          Sélectionner
                        </Button>
                      )}

                      {canRefuse && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="gap-2 text-destructive"
                          disabled={anyPending}
                          onClick={() => refuse.mutate(proposal.id)}
                        >
                          <XCircle size={14} />
                          Refuser
                        </Button>
                      )}
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ClientProposals;
