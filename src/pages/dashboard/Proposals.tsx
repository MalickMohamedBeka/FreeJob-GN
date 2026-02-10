import { motion } from "framer-motion";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, Clock, Coins, FileText, Trash2 } from "lucide-react";

const proposals = [
  {
    id: 1,
    project: "Application de Livraison Mobile",
    client: "Orange Guinée",
    submittedAt: "Il y a 2h",
    budget: "30,000 GNF",
    duration: "4 mois",
    status: "En attente",
    statusColor: "bg-primary",
    views: 3,
    coverLetter: "Bonjour, je suis développeur React Native avec 5 ans d'expérience...",
  },
  {
    id: 2,
    project: "Site E-learning Interactif",
    client: "MTN Guinée",
    submittedAt: "Il y a 5h",
    budget: "22,000 GNF",
    duration: "3 mois",
    status: "Vue",
    statusColor: "bg-secondary",
    views: 8,
    coverLetter: "J'ai développé plusieurs plateformes e-learning similaires...",
  },
  {
    id: 3,
    project: "Dashboard Analytics Temps Réel",
    client: "Ecobank Guinée",
    submittedAt: "Hier",
    budget: "25,000 GNF",
    duration: "3 mois",
    status: "Acceptée",
    statusColor: "bg-primary",
    views: 12,
    coverLetter: "Expert en visualisation de données avec D3.js et Chart.js...",
  },
  {
    id: 4,
    project: "API REST Backend Système Gestion",
    client: "UBA Guinée",
    submittedAt: "Il y a 2 jours",
    budget: "18,000 GNF",
    duration: "2 mois",
    status: "Rejetée",
    statusColor: "bg-muted",
    views: 5,
    coverLetter: "Spécialisé en développement d'API REST avec Laravel...",
  },
  {
    id: 5,
    project: "Refonte UI/UX Application Bancaire",
    client: "BICIGUI",
    submittedAt: "Il y a 3 jours",
    budget: "15,000 GNF",
    duration: "2 mois",
    status: "En attente",
    statusColor: "bg-primary",
    views: 6,
    coverLetter: "Designer UI/UX avec expertise en applications financières...",
  },
];

const Proposals = () => {
  return (
    <DashboardLayout userType="freelancer">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Mes Propositions</h1>
            <p className="text-muted-foreground">Suivez l'état de toutes vos propositions</p>
          </div>
          <Button>Nouvelle proposition</Button>
        </div>

        {/* Stats */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-4">
            <p className="text-sm text-muted-foreground mb-1">Total Envoyées</p>
            <p className="text-2xl font-bold">{proposals.length}</p>
          </Card>
          <Card className="p-4">
            <p className="text-sm text-muted-foreground mb-1">En Attente</p>
            <p className="text-2xl font-bold text-primary">
              {proposals.filter(p => p.status === "En attente").length}
            </p>
          </Card>
          <Card className="p-4">
            <p className="text-sm text-muted-foreground mb-1">Acceptées</p>
            <p className="text-2xl font-bold text-primary">
              {proposals.filter(p => p.status === "Acceptée").length}
            </p>
          </Card>
          <Card className="p-4">
            <p className="text-sm text-muted-foreground mb-1">Taux de Réussite</p>
            <p className="text-2xl font-bold text-primary">
              {Math.round((proposals.filter(p => p.status === "Acceptée").length / proposals.length) * 100)}%
            </p>
          </Card>
        </div>

        {/* Proposals List */}
        <div className="space-y-4">
          {proposals.map((proposal, index) => (
            <motion.div
              key={proposal.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-1">{proposal.project}</h3>
                    <p className="text-muted-foreground">{proposal.client}</p>
                  </div>
                  <Badge className={`${proposal.statusColor} text-white`}>
                    {proposal.status}
                  </Badge>
                </div>

                <div className="grid md:grid-cols-4 gap-4 mb-4 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Coins size={16} />
                    <span className="font-medium text-foreground">{proposal.budget}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock size={16} />
                    <span>{proposal.duration}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Eye size={16} />
                    <span>{proposal.views} vues</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <FileText size={16} />
                    <span>{proposal.submittedAt}</span>
                  </div>
                </div>

                <div className="p-4 bg-muted/50 rounded-lg mb-4">
                  <p className="text-sm text-muted-foreground mb-1">Lettre de motivation</p>
                  <p className="text-sm">{proposal.coverLetter}</p>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    Voir détails
                  </Button>
                  {proposal.status === "En attente" && (
                    <>
                      <Button variant="outline" size="sm">Modifier</Button>
                      <Button variant="outline" size="sm" className="text-destructive">
                        <Trash2 size={16} />
                      </Button>
                    </>
                  )}
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Proposals;
