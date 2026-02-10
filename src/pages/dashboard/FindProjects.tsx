import { motion } from "framer-motion";
import { useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, Bookmark, MapPin, Clock, Coins, Briefcase } from "lucide-react";

const categories = ["Tous", "Développement Web", "Mobile", "Design", "Marketing", "Rédaction"];
const budgetRanges = ["Tous", "< 5,000 GNF", "5,000 - 10,000", "10,000 - 20,000", "> 20,000"];

const projects = [
  {
    id: 1,
    title: "Développement d'une Plateforme E-commerce",
    company: "Orange Guinée",
    description: "Nous recherchons un développeur expérimenté pour créer une plateforme e-commerce complète avec paiement mobile money intégré.",
    budget: "25,000 - 35,000 GNF",
    duration: "3 mois",
    location: "Remote",
    postedAt: "Il y a 30 min",
    proposals: 2,
    skills: ["React", "Node.js", "MongoDB", "Payment API"],
    saved: false,
    urgent: true,
  },
  {
    id: 2,
    title: "Refonte UI/UX Application Mobile Bancaire",
    company: "Ecobank Guinée",
    description: "Refonte complète de l'interface utilisateur de notre application mobile bancaire pour améliorer l'expérience client.",
    budget: "15,000 - 20,000 GNF",
    duration: "2 mois",
    location: "Conakry",
    postedAt: "Il y a 2h",
    proposals: 8,
    skills: ["Figma", "UI/UX", "Mobile Design", "Prototyping"],
    saved: true,
    urgent: false,
  },
  {
    id: 3,
    title: "Développement API REST pour Système de Gestion",
    company: "MTN Guinée",
    description: "Création d'une API REST robuste pour notre nouveau système de gestion interne avec authentification JWT.",
    budget: "18,000 - 25,000 GNF",
    duration: "2.5 mois",
    location: "Remote",
    postedAt: "Il y a 4h",
    proposals: 5,
    skills: ["Laravel", "MySQL", "REST API", "JWT"],
    saved: false,
    urgent: false,
  },
  {
    id: 4,
    title: "Application Mobile de Livraison",
    company: "UBA Guinée",
    description: "Développement d'une application mobile de livraison avec tracking en temps réel et système de paiement intégré.",
    budget: "30,000 - 40,000 GNF",
    duration: "4 mois",
    location: "Conakry",
    postedAt: "Il y a 6h",
    proposals: 12,
    skills: ["React Native", "Firebase", "Google Maps", "Payment"],
    saved: false,
    urgent: true,
  },
  {
    id: 5,
    title: "Site Web Corporate avec CMS",
    company: "BICIGUI",
    description: "Création d'un site web corporate moderne avec système de gestion de contenu pour faciliter les mises à jour.",
    budget: "12,000 - 18,000 GNF",
    duration: "1.5 mois",
    location: "Remote",
    postedAt: "Il y a 8h",
    proposals: 15,
    skills: ["WordPress", "PHP", "CSS", "SEO"],
    saved: true,
    urgent: false,
  },
  {
    id: 6,
    title: "Dashboard Analytics en Temps Réel",
    company: "Société Générale Guinée",
    description: "Développement d'un dashboard analytics avec visualisation de données en temps réel et exports personnalisés.",
    budget: "20,000 - 28,000 GNF",
    duration: "3 mois",
    location: "Conakry",
    postedAt: "Hier",
    proposals: 7,
    skills: ["Vue.js", "D3.js", "WebSocket", "Charts"],
    saved: false,
    urgent: false,
  },
];

const FindProjects = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Tous");
  const [savedProjects, setSavedProjects] = useState<number[]>([2, 5]);

  const toggleSave = (projectId: number) => {
    setSavedProjects(prev =>
      prev.includes(projectId)
        ? prev.filter(id => id !== projectId)
        : [...prev, projectId]
    );
  };

  return (
    <DashboardLayout userType="freelancer">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold mb-2">Trouver des Projets</h1>
          <p className="text-muted-foreground">Découvrez les opportunités qui correspondent à vos compétences</p>
        </div>

        {/* Search & Filters */}
        <Card className="p-6">
          <div className="space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
              <Input
                placeholder="Rechercher par titre, compétence, entreprise..."
                className="pl-10 h-12"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Category Filters */}
            <div className="flex items-center gap-2 flex-wrap">
              <Filter size={18} className="text-muted-foreground" />
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </Card>

        {/* Results Count */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">{projects.length}</span> projets disponibles
          </p>
          <Button variant="outline" size="sm">
            <Filter size={16} className="mr-2" />
            Plus de filtres
          </Button>
        </div>

        {/* Projects List */}
        <div className="space-y-4">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-xl font-semibold">{project.title}</h3>
                      {project.urgent && (
                        <Badge className="bg-destructive text-white">Urgent</Badge>
                      )}
                    </div>
                    <p className="text-muted-foreground font-medium">{project.company}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => toggleSave(project.id)}
                  >
                    <Bookmark
                      size={20}
                      fill={savedProjects.includes(project.id) ? "currentColor" : "none"}
                      className={savedProjects.includes(project.id) ? "text-primary" : ""}
                    />
                  </Button>
                </div>

                <p className="text-muted-foreground mb-4">{project.description}</p>

                {/* Skills */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.skills.map((skill) => (
                    <Badge key={skill} variant="secondary">
                      {skill}
                    </Badge>
                  ))}
                </div>

                {/* Project Details */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Coins size={16} />
                    <span className="font-medium text-foreground">{project.budget}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock size={16} />
                    <span>{project.duration}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin size={16} />
                    <span>{project.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Briefcase size={16} />
                    <span>{project.proposals} propositions</span>
                  </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <span className="text-sm text-muted-foreground">{project.postedAt}</span>
                  <Button>Soumettre une proposition</Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default FindProjects;
