import { motion } from "framer-motion";
import { Users, Briefcase, Coins, TrendingUp, UserCheck, FileText, AlertCircle, CheckCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const stats = [
  {
    icon: Users,
    label: "Utilisateurs Total",
    value: "2,847",
    change: "+12% ce mois",
    color: "from-primary to-primary/80",
  },
  {
    icon: Briefcase,
    label: "Projets Actifs",
    value: "156",
    change: "+8 cette semaine",
    color: "from-secondary to-secondary/80",
  },
  {
    icon: Coins,
    label: "Revenus Total",
    value: "1,245,000 GNF",
    change: "+18% vs mois dernier",
    color: "from-primary to-secondary",
  },
  {
    icon: TrendingUp,
    label: "Taux de Croissance",
    value: "24%",
    change: "+3% ce trimestre",
    color: "from-secondary to-primary",
  },
];

const recentUsers = [
  { 
    id: 1, 
    name: "Amadou Diallo", 
    email: "amadou@email.com", 
    role: "Freelancer", 
    status: "Actif", 
    date: "Il y a 2h",
    avatar: "/avatars/freelancer-10.jpg"
  },
  { 
    id: 2, 
    name: "Fatoumata Camara", 
    email: "fatoumata@email.com", 
    role: "Client", 
    status: "Actif", 
    date: "Il y a 5h",
    avatar: "/avatars/client-9.jpg"
  },
  { 
    id: 3, 
    name: "Ibrahim Konaté", 
    email: "ibrahim@email.com", 
    role: "Freelancer", 
    status: "En attente", 
    date: "Hier",
    avatar: "/avatars/freelancer-15.jpg"
  },
  { 
    id: 4, 
    name: "Aissatou Sow", 
    email: "aissatou@email.com", 
    role: "Client", 
    status: "Actif", 
    date: "Il y a 2 jours",
    avatar: "/avatars/client-10.jpg"
  },
];

const recentProjects = [
  { id: 1, title: "Application Mobile E-commerce", client: "Orange Guinée", budget: "25,000 GNF", status: "En cours" },
  { id: 2, title: "Site Web Corporate", client: "MTN Guinée", budget: "15,000 GNF", status: "En cours" },
  { id: 3, title: "Dashboard Analytics", client: "Ecobank", budget: "30,000 GNF", status: "Terminé" },
  { id: 4, title: "API REST Backend", client: "UBA Guinée", budget: "20,000 GNF", status: "En attente" },
];

const AdminDashboard = () => {
  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <div className="bg-primary text-white p-6 lg:p-8">
        <div className="container mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Dashboard Administrateur</h1>
              <p className="text-white/80">Bienvenue, Admin</p>
            </div>
            <Link to="/">
              <Button variant="secondary">
                Retour à l'accueil
              </Button>
            </Link>
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

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Recent Users */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <UserCheck size={20} className="text-primary" />
                  Utilisateurs Récents
                </h3>
                <Button variant="ghost" size="sm">Voir tout</Button>
              </div>

              <div className="space-y-4">
                {recentUsers.map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-4 rounded-lg border border-border hover:border-primary/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <img 
                        src={user.avatar} 
                        alt={user.name}
                        className="w-10 h-10 rounded-full"
                      />
                      <div>
                        <p className="font-semibold">{user.name}</p>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant={user.status === "Actif" ? "default" : "secondary"}>
                        {user.status}
                      </Badge>
                      <p className="text-xs text-muted-foreground mt-1">{user.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>

          {/* Recent Projects */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <FileText size={20} className="text-secondary" />
                  Projets Récents
                </h3>
                <Button variant="ghost" size="sm">Voir tout</Button>
              </div>

              <div className="space-y-4">
                {recentProjects.map((project) => (
                  <div key={project.id} className="p-4 rounded-lg border border-border hover:border-secondary/50 transition-colors">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold">{project.title}</h4>
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
                    <p className="text-sm text-muted-foreground mb-2">{project.client}</p>
                    <p className="text-sm font-semibold text-primary">{project.budget}</p>
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
              <Button className="h-auto py-4 flex-col gap-2">
                <Users size={24} />
                <span>Gérer Utilisateurs</span>
              </Button>
              <Button variant="secondary" className="h-auto py-4 flex-col gap-2">
                <Briefcase size={24} />
                <span>Gérer Projets</span>
              </Button>
              <Button variant="outline" className="h-auto py-4 flex-col gap-2">
                <Coins size={24} />
                <span>Transactions</span>
              </Button>
              <Button variant="outline" className="h-auto py-4 flex-col gap-2">
                <AlertCircle size={24} />
                <span>Signalements</span>
              </Button>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminDashboard;
