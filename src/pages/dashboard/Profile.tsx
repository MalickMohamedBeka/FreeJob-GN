import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Mail, Phone, Briefcase, Loader2, Coins } from "lucide-react";
import { useFreelanceProfile } from "@/hooks/useProfile";

const Profile = () => {
  const { data: profile, isLoading } = useFreelanceProfile();

  if (isLoading) {
    return (
      <DashboardLayout userType="freelancer">
        <div className="flex justify-center py-20">
          <Loader2 className="animate-spin text-primary" size={40} />
        </div>
      </DashboardLayout>
    );
  }

  if (!profile) {
    return (
      <DashboardLayout userType="freelancer">
        <div className="text-center py-20">
          <p className="text-muted-foreground">Impossible de charger le profil.</p>
        </div>
      </DashboardLayout>
    );
  }

  const profileName =
    `${profile.freelance_details?.first_name || ""} ${profile.freelance_details?.last_name || ""}`.trim() ||
    profile.username;
  const profileTitle = profile.speciality?.name || "Freelancer";
  const profileLocation = [profile.city_or_region, profile.country]
    .filter(Boolean)
    .join(", ");

  return (
    <DashboardLayout userType="freelancer">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Mon Profil</h1>
          <p className="text-muted-foreground">Vos informations professionnelles</p>
        </div>

        {/* Profile Header */}
        <Card className="p-6">
          <div className="flex flex-col md:flex-row gap-6">
            {profile.profile_picture && (
              <img
                src={profile.profile_picture}
                alt={profileName}
                className="w-32 h-32 rounded-full object-cover"
              />
            )}
            {!profile.profile_picture && (
              <div className="w-32 h-32 rounded-full bg-muted flex items-center justify-center text-3xl font-bold text-muted-foreground">
                {profileName.charAt(0).toUpperCase()}
              </div>
            )}
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-1">{profileName}</h2>
              <p className="text-muted-foreground mb-2">{profileTitle}</p>
              <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
                {profileLocation && (
                  <div className="flex items-center gap-1">
                    <MapPin size={16} />
                    <span>{profileLocation}</span>
                  </div>
                )}
                <div className="flex items-center gap-1">
                  <Briefcase size={16} />
                  <span>Freelancer</span>
                </div>
                {profile.hourly_rate && (
                  <div className="flex items-center gap-1">
                    <Coins size={16} />
                    <span>{parseFloat(profile.hourly_rate).toLocaleString("fr-FR")} GNF/h</span>
                  </div>
                )}
              </div>
              {profile.freelance_details?.business_name && (
                <p className="text-sm text-muted-foreground mt-2">
                  Entreprise : {profile.freelance_details.business_name}
                </p>
              )}
            </div>
          </div>
        </Card>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* About */}
            {profile.bio && (
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">À propos</h3>
                <p className="text-muted-foreground whitespace-pre-line">{profile.bio}</p>
              </Card>
            )}

            {/* Skills */}
            {profile.skills.length > 0 && (
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Compétences</h3>
                <div className="flex flex-wrap gap-2">
                  {profile.skills.map((skill) => (
                    <Badge key={skill.id} variant="secondary" className="text-sm py-1.5 px-3">
                      {skill.name}
                    </Badge>
                  ))}
                </div>
              </Card>
            )}
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Contact Info */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Informations de contact</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Mail size={16} className="text-muted-foreground flex-shrink-0" />
                  <span className="text-sm">{profile.email}</span>
                </div>
                {profile.phone && (
                  <div className="flex items-center gap-3">
                    <Phone size={16} className="text-muted-foreground flex-shrink-0" />
                    <span className="text-sm">{profile.phone}</span>
                  </div>
                )}
                {profile.postal_code && (
                  <div className="flex items-center gap-3">
                    <MapPin size={16} className="text-muted-foreground flex-shrink-0" />
                    <span className="text-sm">Code postal : {profile.postal_code}</span>
                  </div>
                )}
              </div>
            </Card>

            {/* Account Info */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Compte</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Nom d'utilisateur</span>
                  <span className="font-medium">{profile.username}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Membre depuis</span>
                  <span className="font-medium">
                    {new Date(profile.created_at).toLocaleDateString("fr-FR", {
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Dernière mise à jour</span>
                  <span className="font-medium">
                    {new Date(profile.updated_at).toLocaleDateString("fr-FR")}
                  </span>
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
