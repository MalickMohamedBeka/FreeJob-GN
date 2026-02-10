import { motion } from "framer-motion";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bell, Lock, CreditCard, Globe, Shield, Trash2 } from "lucide-react";

const Settings = () => {
  return (
    <DashboardLayout userType="freelancer">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Paramètres</h1>
          <p className="text-muted-foreground">Gérez vos préférences et paramètres de compte</p>
        </div>

        <Tabs defaultValue="account" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="account">Compte</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="security">Sécurité</TabsTrigger>
            <TabsTrigger value="payment">Paiement</TabsTrigger>
            <TabsTrigger value="preferences">Préférences</TabsTrigger>
          </TabsList>

          {/* Account Settings */}
          <TabsContent value="account">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-6">Informations du compte</h3>
              <div className="space-y-4 max-w-xl">
                <div>
                  <Label>Nom complet</Label>
                  <Input defaultValue="Amadou Diallo" className="mt-1.5" />
                </div>
                <div>
                  <Label>Email</Label>
                  <Input defaultValue="amadou.diallo@email.com" className="mt-1.5" />
                </div>
                <div>
                  <Label>Nom d'utilisateur</Label>
                  <Input defaultValue="amadou_diallo" className="mt-1.5" />
                </div>
                <div>
                  <Label>Téléphone</Label>
                  <Input defaultValue="+224 620 00 00 00" className="mt-1.5" />
                </div>
                <Button>Enregistrer les modifications</Button>
              </div>
            </Card>

            <Card className="p-6 mt-6">
              <h3 className="text-lg font-semibold mb-4 text-red-600">Zone de danger</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-red-200 rounded-lg">
                  <div>
                    <h4 className="font-semibold mb-1">Désactiver le compte</h4>
                    <p className="text-sm text-muted-foreground">Votre compte sera temporairement désactivé</p>
                  </div>
                  <Button variant="outline" className="text-red-600 border-red-600">
                    Désactiver
                  </Button>
                </div>
                <div className="flex items-center justify-between p-4 border border-red-200 rounded-lg">
                  <div>
                    <h4 className="font-semibold mb-1">Supprimer le compte</h4>
                    <p className="text-sm text-muted-foreground">Cette action est irréversible</p>
                  </div>
                  <Button variant="destructive">
                    <Trash2 size={16} className="mr-2" />
                    Supprimer
                  </Button>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Notifications */}
          <TabsContent value="notifications">
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-lg bg-secondary/10">
                  <Bell className="text-secondary" size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Notifications</h3>
                  <p className="text-sm text-muted-foreground">Gérez vos préférences de notification</p>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold mb-4">Notifications par email</h4>
                  <div className="space-y-4">
                    {[
                      { label: "Nouveaux messages", desc: "Recevoir un email pour chaque nouveau message" },
                      { label: "Nouvelles propositions", desc: "Notifications pour les nouvelles opportunités" },
                      { label: "Mises à jour de projet", desc: "Alertes sur l'avancement des projets" },
                      { label: "Paiements", desc: "Notifications de paiements reçus" },
                    ].map((item) => (
                      <div key={item.label} className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{item.label}</p>
                          <p className="text-sm text-muted-foreground">{item.desc}</p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-4">Notifications push</h4>
                  <div className="space-y-4">
                    {[
                      { label: "Messages instantanés", desc: "Notifications en temps réel" },
                      { label: "Rappels de deadline", desc: "Alertes avant les échéances" },
                    ].map((item) => (
                      <div key={item.label} className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{item.label}</p>
                          <p className="text-sm text-muted-foreground">{item.desc}</p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Security */}
          <TabsContent value="security">
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-lg bg-primary/10">
                  <Shield className="text-primary" size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Sécurité</h3>
                  <p className="text-sm text-muted-foreground">Protégez votre compte</p>
                </div>
              </div>

              <div className="space-y-6 max-w-xl">
                <div>
                  <h4 className="font-semibold mb-4">Changer le mot de passe</h4>
                  <div className="space-y-3">
                    <div>
                      <Label>Mot de passe actuel</Label>
                      <Input type="password" className="mt-1.5" />
                    </div>
                    <div>
                      <Label>Nouveau mot de passe</Label>
                      <Input type="password" className="mt-1.5" />
                    </div>
                    <div>
                      <Label>Confirmer le mot de passe</Label>
                      <Input type="password" className="mt-1.5" />
                    </div>
                    <Button>Mettre à jour le mot de passe</Button>
                  </div>
                </div>

                <div className="pt-6 border-t border-border">
                  <h4 className="font-semibold mb-4">Authentification à deux facteurs</h4>
                  <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                    <div>
                      <p className="font-medium mb-1">Activer 2FA</p>
                      <p className="text-sm text-muted-foreground">Ajoutez une couche de sécurité supplémentaire</p>
                    </div>
                    <Switch />
                  </div>
                </div>

                <div className="pt-6 border-t border-border">
                  <h4 className="font-semibold mb-4">Sessions actives</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                      <div>
                        <p className="font-medium">Windows • Chrome</p>
                        <p className="text-sm text-muted-foreground">Conakry, Guinée • Actif maintenant</p>
                      </div>
                      <Badge className="bg-primary text-white">Actuel</Badge>
                    </div>
                    <Button variant="outline" className="w-full">Déconnecter toutes les sessions</Button>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Payment */}
          <TabsContent value="payment">
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-lg bg-secondary/10">
                  <CreditCard className="text-secondary" size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Paiement</h3>
                  <p className="text-sm text-muted-foreground">Gérez vos méthodes de paiement</p>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold mb-4">Méthodes de retrait</h4>
                  <div className="space-y-3">
                    <div className="p-4 border border-border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-medium">Orange Money</p>
                        <Badge>Principal</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">+224 620 00 00 00</p>
                    </div>
                    <div className="p-4 border border-border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-medium">MTN Money</p>
                      </div>
                      <p className="text-sm text-muted-foreground">+224 621 00 00 00</p>
                    </div>
                  </div>
                  <Button variant="outline" className="mt-4">Ajouter une méthode</Button>
                </div>

                <div className="pt-6 border-t border-border">
                  <h4 className="font-semibold mb-4">Paramètres de retrait</h4>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Retrait automatique</p>
                        <p className="text-sm text-muted-foreground">Retirer automatiquement les fonds chaque semaine</p>
                      </div>
                      <Switch />
                    </div>
                    <div>
                      <Label>Montant minimum de retrait</Label>
                      <Input defaultValue="5,000 GNF" className="mt-1.5" />
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Preferences */}
          <TabsContent value="preferences">
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-lg bg-orange-100">
                  <Globe className="text-orange-600" size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Préférences</h3>
                  <p className="text-sm text-muted-foreground">Personnalisez votre expérience</p>
                </div>
              </div>

              <div className="space-y-6 max-w-xl">
                <div>
                  <Label>Langue</Label>
                  <select className="w-full mt-1.5 h-10 px-3 rounded-md border border-border">
                    <option>Français</option>
                    <option>English</option>
                    <option>العربية</option>
                  </select>
                </div>

                <div>
                  <Label>Fuseau horaire</Label>
                  <select className="w-full mt-1.5 h-10 px-3 rounded-md border border-border">
                    <option>GMT (Conakry)</option>
                    <option>GMT+1 (Paris)</option>
                    <option>GMT-5 (New York)</option>
                  </select>
                </div>

                <div>
                  <Label>Devise</Label>
                  <select className="w-full mt-1.5 h-10 px-3 rounded-md border border-border">
                    <option>GNF (Franc Guinéen)</option>
                    <option>USD (Dollar)</option>
                    <option>EUR (Euro)</option>
                  </select>
                </div>

                <div className="pt-6 border-t border-border">
                  <h4 className="font-semibold mb-4">Apparence</h4>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Mode sombre</p>
                      <p className="text-sm text-muted-foreground">Activer le thème sombre</p>
                    </div>
                    <Switch />
                  </div>
                </div>

                <Button>Enregistrer les préférences</Button>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Settings;
