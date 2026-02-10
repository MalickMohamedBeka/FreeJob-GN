import { motion } from "framer-motion";
import { useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clock, Coins, MessageSquare, FileText, CheckCircle2, AlertCircle } from "lucide-react";

const projects = {
  active: [
    {
      id: 1,
      title: "Développement Application Mobile E-commerce",
      client: "Orange Guinée",
      progress: 75,
      deadline: "15 Mars 2026",
      budget: "8,500 GNF",
      paid: "6,375 GNF",
      status: "En cours",
      statusColor: "bg-secondary",
      unreadMessages: 3,
      pendingTasks: 5,
    },
    {
      id: 2,
      title: "Refonte Site Web Corporate",
      client: "Ecobank Guinée",
      progress: 45,
      deadline: "28 Mars 2026",
      budget: "6,200 GNF",
      paid: "2,790 GNF",
      status: "En cours",
      statusColor: "bg-secondary",
      unreadMessages: 1,
      pendingTasks: 8,
    },
    {
      id: 3,
      title: "Système de Gestion Inventaire",
      client: "UBA Guinée",
      progress: 90,
      deadline: "10 Mars 2026",
      budget: "12,000 GNF",
      paid: "10,800 GNF",
      status: "Presque terminé",
      statusColor: "bg-primary",
      unreadMessages: 0,
      pendingTasks: 2,
    },
  ],
  completed: [
    {
      id: 4,
      title: "Dashboard Analytics",
      client: "MTN Guinée",
      completedDate: "5 Février 2026",
      budget: "15,000 GNF",
      rating: 5,
      review: "Excellent travail, très professionnel !",
    },
    {
      id: 5,
      title: "Application de Livraison",
      client: "BICIGUI",
      completedDate: "20 Janvier 2026",
      budget: "10,500 GNF",
      rating: 5,
      review: "Livraison dans les délais, qualité impeccable.",
    },
  ],
  pending: [
    {
      id: 6,
      title: "Site E-learning",
      client: "Société Générale Guinée",
      submittedDate: "8 Février 2026",
      budget: "18,000 GNF",
      status: "En attente de validation",
    },
  ],
};

const MyProjects = () => {
  const [activeTab, setActiveTab] = useState("active");

  return (
    <DashboardLayout userType="freelancer">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold mb-2">Mes Projets</h1>
          <p className="text-muted-foreground">Gérez tous vos projets en un seul endroit</p>
        </div>

        {/* Stats Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Projets Actifs</p>
                <p className="text-2xl font-bold">{projects.active.length}</p>
              </div>
              <div className="p-3 rounded-lg bg-secondary/10">
                <Clock className="text-secondary" size={24} />
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Terminés</p>
                <p className="text-2xl font-bold">{projects.completed.length}</p>
              </div>
              <div className="p-3 rounded-lg bg-primary/10">
                <CheckCircle2 className="text-primary" size={24} />
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">En attente</p>
                <p className="text-2xl font-bold">{projects.pending.length}</p>
              </div>
              <div className="p-3 rounded-lg bg-secondary/10">
                <AlertCircle className="text-secondary" size={24} />
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Revenus Total</p>
                <p className="text-2xl font-bold">46,700 GNF</p>
              </div>
              <div className="p-3 rounded-lg bg-primary/10">
                <Coins className="text-primary" size={24} />
              </div>
            </div>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="active">Actifs ({projects.active.length})</TabsTrigger>
            <TabsTrigger value="completed">Terminés ({projects.completed.length})</TabsTrigger>
            <TabsTrigger value="pending">En attente ({projects.pending.length})</TabsTrigger>
          </TabsList>

          {/* Active Projects */}
          <TabsContent value="active" className="space-y-4 mt-6">
            {projects.active.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold mb-1">{project.title}</h3>
                      <p className="text-muted-foreground">{project.client}</p>
                    </div>
                    <Badge className={`${project.statusColor} text-white`}>
                      {project.status}
                    </Badge>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <div className="flex items-center justify-between text-sm mb-2">
                        <span className="text-muted-foreground">Progression</span>
                        <span className="font-semibold">{project.progress}%</span>
                      </div>
                      <Progress value={project.progress} />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock size={16} />
                        <span>Échéance: {project.deadline}</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-3 gap-4 mb-4 p-4 bg-muted/50 rounded-lg">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Budget Total</p>
                      <p className="font-semibold">{project.budget}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Déjà Payé</p>
                      <p className="font-semibold text-primary">{project.paid}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Restant</p>
                      <p className="font-semibold text-orange-600">
                        {(parseFloat(project.budget.replace(/,/g, '')) - parseFloat(project.paid.replace(/,/g, ''))).toLocaleString()} GNF
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-border">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2 text-sm">
                        <MessageSquare size={16} />
                        <span>{project.unreadMessages} messages</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <FileText size={16} />
                        <span>{project.pendingTasks} tâches</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">Messages</Button>
                      <Button size="sm">Voir détails</Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </TabsContent>

          {/* Completed Projects */}
          <TabsContent value="completed" className="space-y-4 mt-6">
            {projects.completed.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold mb-1">{project.title}</h3>
                      <p className="text-muted-foreground">{project.client}</p>
                    </div>
                    <Badge className="bg-primary text-white">Terminé</Badge>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Date de fin</p>
                      <p className="font-medium">{project.completedDate}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Budget</p>
                      <p className="font-semibold text-primary">{project.budget}</p>
                    </div>
                  </div>

                  <div className="p-4 bg-muted/50 rounded-lg mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex">
                        {[...Array(project.rating)].map((_, i) => (
                          <span key={i} className="text-primary">★</span>
                        ))}
                      </div>
                      <span className="font-semibold">{project.rating}/5</span>
                    </div>
                    <p className="text-sm text-muted-foreground italic">"{project.review}"</p>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1">Télécharger facture</Button>
                    <Button size="sm" className="flex-1">Voir détails</Button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </TabsContent>

          {/* Pending Projects */}
          <TabsContent value="pending" className="space-y-4 mt-6">
            {projects.pending.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold mb-1">{project.title}</h3>
                      <p className="text-muted-foreground">{project.client}</p>
                    </div>
                    <Badge className="bg-secondary text-white">{project.status}</Badge>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Date de soumission</p>
                      <p className="font-medium">{project.submittedDate}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Budget proposé</p>
                      <p className="font-semibold">{project.budget}</p>
                    </div>
                  </div>

                  <Button variant="outline" size="sm" className="w-full">Voir la proposition</Button>
                </Card>
              </motion.div>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default MyProjects;
