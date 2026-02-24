import { useParams, Link } from "react-router-dom";
import { MapPin, Coins, Briefcase, ArrowLeft, Loader2, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useFreelancer } from "@/hooks/useFreelancers";
import { ROUTES } from "@/constants/routes";

function getInitials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
}

const FreelancerProfile = () => {
  const { id } = useParams<{ id: string }>();
  const { data: profile, isLoading, isError } = useFreelancer(Number(id));

  const displayName = profile
    ? profile.freelance_details?.first_name
      ? `${profile.freelance_details.first_name} ${profile.freelance_details.last_name}`
      : profile.username
    : "";

  const location = profile
    ? [profile.city_or_region, profile.country].filter(Boolean).join(", ")
    : "";

  return (
    <div className="min-h-screen bg-muted/30">
      <Navbar />
      <main className="pt-16">
        <div className="container mx-auto px-4 lg:px-8 py-10 max-w-3xl">
          <Link
            to={ROUTES.FREELANCERS}
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
          >
            <ArrowLeft size={16} />
            Retour aux talents
          </Link>

          {isLoading ? (
            <div className="flex justify-center py-24">
              <Loader2 className="animate-spin text-primary" size={40} />
            </div>
          ) : isError || !profile ? (
            <div className="text-center py-24 text-muted-foreground">
              <AlertCircle className="mx-auto mb-4" size={48} />
              <p className="text-lg font-medium">Profil introuvable</p>
              <p className="text-sm mt-1">Ce prestataire n'existe pas ou n'est plus disponible.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Header card */}
              <Card className="p-6">
                <div className="flex flex-col sm:flex-row gap-5 items-start">
                  {/* Avatar */}
                  {profile.profile_picture ? (
                    <img
                      src={profile.profile_picture}
                      alt={displayName}
                      className="w-24 h-24 rounded-full object-cover border-4 border-background shadow shrink-0"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-primary flex items-center justify-center text-white font-bold text-2xl border-4 border-background shadow shrink-0">
                      {getInitials(displayName)}
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <h1 className="text-2xl font-bold mb-0.5">{displayName}</h1>
                    <p className="text-muted-foreground mb-3">
                      {profile.speciality?.name ?? "Freelancer"}
                    </p>

                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                      {location && (
                        <div className="flex items-center gap-1.5">
                          <MapPin size={14} />
                          <span>{location}</span>
                        </div>
                      )}
                      {profile.hourly_rate && (
                        <div className="flex items-center gap-1.5">
                          <Coins size={14} />
                          <span>
                            {Number(profile.hourly_rate).toLocaleString("fr-FR")} GNF/h
                          </span>
                        </div>
                      )}
                      <div className="flex items-center gap-1.5">
                        <Briefcase size={14} />
                        <span>Freelancer</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Bio */}
              {profile.bio && (
                <Card className="p-6">
                  <h2 className="font-semibold text-base mb-3">À propos</h2>
                  <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                    {profile.bio}
                  </p>
                </Card>
              )}

              {/* Skills */}
              {profile.skills.length > 0 && (
                <Card className="p-6">
                  <h2 className="font-semibold text-base mb-3">Compétences</h2>
                  <div className="flex flex-wrap gap-2">
                    {profile.skills.map((skill) => (
                      <Badge key={skill.id} variant="secondary" className="text-xs py-1 px-2.5">
                        {skill.name}
                      </Badge>
                    ))}
                  </div>
                </Card>
              )}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default FreelancerProfile;
