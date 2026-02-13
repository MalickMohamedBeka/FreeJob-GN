import { motion } from "framer-motion";
import { Plus, Briefcase, Users, Clock, CheckCircle, Eye } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const stats = [
  {
    icon: Briefcase,
    label: "Projets Publiés",
    value: "12",
    change: "+3 ce mois",
    color: "from-secondary to-secondary/80",
  },
  {
    icon: Users,
    label: "Propositions Reçues",
    value: "48",
    change: "+12 cette semaine",
    color: "from-primary to-primary/80",
  },
  {
    icon: CheckCircle,
    label: "Projets Terminés",
    value: "8",
    change: "100% satisfaction",
    color: "from-primary to-secondary",
  },
  {
    icon: Clock,
    label: "Projets En Cours",
    value: "4",
    change: "Dans les délais",
    color: "from-secondary to-primary",
  },
];

const myProjects = [
  {
    id: 1,
    title: "Développement Application Mobile E-commerce",
    budget: "25,000 GNF",
    proposals: 12,
    status: "En cours",
    freelancer: "Amadou Diallo",
    progress: 75,
    deadline: "15 Mars 2026",
  },
  {
    id: 2,
    title: "Refonte Site Web Corporate",
    budget: "15,000 GNF",
    proposals: 8,
    status: "En attente",
    freelancer: null,
    progress: 0,
    deadline: "28 Mars 2026",
  },
  {
    id: 3,
    title: "Dashboard Analytics Temps Réel",
    budget: "30,000 GNF",
    proposals: 15,
    status: "Terminé",
    freelancer: "Ibrahim Konaté",
    progress: 100,
    deadline: "5 Février 2026",
  },
];

const recentProposals = [
  { id: 1, freelancer: "Fatoumata Camara", project: "Site Web Corporate", budget: "14,500 GNF", rating: 4.9, date: "Il y a 2h", avatar: "/avatars/freelancer-8.jpg" },
  { id: 2, freelancer: "Mamadou Bah", project: "Application Mobile", budget: "24,000 GNF", rating: 4.8, date: "Il y a 5h", avatar: "/avatars/freelancer-12.jpg" },
  { id: 3, freelancer: "Mariama Diaby", project: "Dashboard Analytics", budget: "28,500 GNF", rating: 5.0, date: "Hier", avatar: "/avatars/freelancer-14.jpg" },
];

const ClientDashboard = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <div className="bg-secondary text-white p-6 lg:p-8">
        <div className="container mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Dashboard Client</h1>
              <p className="text-white/80">Bienvenue, {user?.username || "Client"}</p>
            </div>
            <div className="flex gap-3">
              <Link to="/">
                <Button variant="secondary">
                  Retour à l'accueil
                </Button>
              </Link>
              <Button className="bg-primary hover:bg-primary/90">
                <Plus size={18} className="mr-2" />
                Publier un Projet
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto p-6 lg:p-8">
        {/* Stats Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-3 rounded-xl bg-primary`}>
                      <Icon className="text-white" size={24} />
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                    <p className="text-2xl font-bold mb-2">{stat.value}</p>
                    <p className="text-xs text-primary font-medium">{stat.change}</p>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* My Projects */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-2"
          >
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Briefcase size={20} className="text-secondary" />
                  Mes Projets
                </h3>
                <Button variant="ghost" size="sm">Voir tout</Button>
              </div>

              <div className="space-y-4">
                {myProjects.map((project) => (
                  <div key={project.id} className="p-4 rounded-lg border border-border hover:border-secondary/50 transition-colors">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h4 className="font-semibold mb-1">{project.title}</h4>
                        <p className="text-sm text-muted-foreground">
                          {project.freelancer ? `Freelancer: ${project.freelancer}` : `${project.proposals} propositions reçues`}
                        </p>
                      </div>
                      <Badge 
                        className={
                          project.status === "En cours" ? "bg-secondary text-white" :
                          project.status === "Terminé" ? "bg-primary text-white" :
                          "bg-muted text-foreground"
                        }
                      >
                        {project.status}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-3 gap-4 mb-3 text-sm">
                      <div>
                        <p className="text-muted-foreground">Budget</p>
                        <p className="font-semibold text-primary">{project.budget}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Échéance</p>
                        <p className="font-medium">{project.deadline}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Progression</p>
                        <p className="font-medium">{project.progress}%</p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="flex-1">
                        <Eye size={14} className="mr-1" />
                        Voir détails
                      </Button>
                      {project.status === "En attente" && (
                        <Button size="sm" className="flex-1">
                          Voir propositions ({project.proposals})
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>

          {/* Recent Proposals */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Users size={20} className="text-primary" />
                  Propositions Récentes
                </h3>
              </div>

              <div className="space-y-4">
                {recentProposals.map((proposal) => (
                  <div key={proposal.id} className="p-4 rounded-lg border border-border hover:border-primary/50 transition-colors">
                    <div className="flex items-center gap-3 mb-3">
                      <img 
                        src={proposal.avatar}
                        alt={proposal.freelancer}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <p className="font-semibold text-sm">{proposal.freelancer}</p>
                        <div className="flex items-center gap-1">
                          <span className="text-primary">★</span>
                          <span className="text-xs font-medium">{proposal.rating}</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{proposal.project}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-primary">{proposal.budget}</span>
                      <span className="text-xs text-muted-foreground">{proposal.date}</span>
                    </div>
                    <Button size="sm" className="w-full mt-3">Voir la proposition</Button>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-8"
        >
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Actions Rapides</h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Button className="h-auto py-4 flex-col gap-2 bg-secondary hover:bg-secondary/90">
                <Plus size={24} />
                <span>Publier un Projet</span>
              </Button>
              <Button variant="outline" className="h-auto py-4 flex-col gap-2">
                <Users size={24} />
                <span>Trouver des Freelancers</span>
              </Button>
              <Button variant="outline" className="h-auto py-4 flex-col gap-2">
                <Briefcase size={24} />
                <span>Gérer mes Projets</span>
              </Button>
              <Button variant="outline" className="h-auto py-4 flex-col gap-2">
                <CheckCircle size={24} />
                <span>Historique</span>
              </Button>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default ClientDashboard;
