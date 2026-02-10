import { motion } from "framer-motion";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Camera, MapPin, Mail, Phone, Globe, Star, Briefcase } from "lucide-react";

const skills = ["React", "TypeScript", "Node.js", "MongoDB", "Tailwind CSS", "Figma", "Git", "REST API"];
const languages = [
  { name: "Français", level: "Natif" },
  { name: "Anglais", level: "Courant" },
  { name: "Arabe", level: "Intermédiaire" },
];

const portfolio = [
  { id: 1, title: "E-commerce Platform", image: "https://images.unsplash.com/photo-1557821552-17105176677c?w=400" },
  { id: 2, title: "Banking App", image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=400" },
  { id: 3, title: "Dashboard Analytics", image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400" },
  { id: 4, title: "Mobile App", image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400" },
];

const Profile = () => {
  return (
    <DashboardLayout userType="freelancer">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Mon Profil</h1>
          <p className="text-muted-foreground">Gérez vos informations professionnelles</p>
        </div>

        {/* Profile Header */}
        <Card className="p-6">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="relative">
              <img 
                src="/avatars/profile-main.jpg" 
                alt="Malick Mohamed"
                className="w-32 h-32 rounded-full object-cover"
              />
              <button className="absolute bottom-0 right-0 p-2 bg-primary text-white rounded-full hover:bg-primary/90">
                <Camera size={18} />
              </button>
            </div>
            <div className="flex-1">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold mb-1">Amadou Diallo</h2>
                  <p className="text-muted-foreground mb-2">Développeur Full Stack</p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <MapPin size={16} />
                      <span>Conakry, Guinée</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Briefcase size={16} />
                      <span>5 ans d'expérience</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 mb-1">
                    <Star className="text-primary fill-primary" size={20} />
                    <span className="text-2xl font-bold">4.9</span>
                  </div>
                  <p className="text-sm text-muted-foreground">32 avis</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button>Modifier le profil</Button>
                <Button variant="outline">Aperçu public</Button>
              </div>
            </div>
          </div>
        </Card>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* About */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">À propos</h3>
              <Textarea
                placeholder="Décrivez votre expérience, vos compétences et ce qui vous rend unique..."
                rows={6}
                defaultValue="Développeur Full Stack passionné avec 5 ans d'expérience dans la création d'applications web et mobiles modernes. Spécialisé en React, Node.js et TypeScript. J'ai travaillé avec des entreprises de premier plan en Guinée pour développer des solutions innovantes."
              />
              <Button className="mt-4">Enregistrer</Button>
            </Card>

            {/* Skills */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Compétences</h3>
              <div className="flex flex-wrap gap-2 mb-4">
                {skills.map((skill) => (
                  <Badge key={skill} variant="secondary" className="text-sm py-1.5 px-3">
                    {skill}
                  </Badge>
                ))}
              </div>
              <Button variant="outline" size="sm">Ajouter une compétence</Button>
            </Card>

            {/* Portfolio */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Portfolio</h3>
                <Button variant="outline" size="sm">Ajouter un projet</Button>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                {portfolio.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="group relative aspect-video rounded-lg overflow-hidden cursor-pointer"
                  >
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-4">
                      <h4 className="text-white font-semibold">{item.title}</h4>
                    </div>
                  </motion.div>
                ))}
              </div>
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Contact Info */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Informations de contact</h3>
              <div className="space-y-3">
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">Email</label>
                  <div className="flex items-center gap-2">
                    <Mail size={16} className="text-muted-foreground" />
                    <Input defaultValue="amadou.diallo@email.com" />
                  </div>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">Téléphone</label>
                  <div className="flex items-center gap-2">
                    <Phone size={16} className="text-muted-foreground" />
                    <Input defaultValue="+224 620 00 00 00" />
                  </div>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">Site web</label>
                  <div className="flex items-center gap-2">
                    <Globe size={16} className="text-muted-foreground" />
                    <Input defaultValue="amadoudiallo.dev" />
                  </div>
                </div>
              </div>
              <Button className="w-full mt-4">Enregistrer</Button>
            </Card>

            {/* Languages */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Langues</h3>
              <div className="space-y-3">
                {languages.map((lang) => (
                  <div key={lang.name} className="flex items-center justify-between">
                    <span className="font-medium">{lang.name}</span>
                    <Badge variant="secondary">{lang.level}</Badge>
                  </div>
                ))}
              </div>
              <Button variant="outline" size="sm" className="w-full mt-4">
                Ajouter une langue
              </Button>
            </Card>

            {/* Stats */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Statistiques</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Projets terminés</span>
                  <span className="font-bold">24</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Taux de réussite</span>
                  <span className="font-bold text-primary">98%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Clients satisfaits</span>
                  <span className="font-bold">22</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Temps de réponse</span>
                  <span className="font-bold">2h</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Profile;
