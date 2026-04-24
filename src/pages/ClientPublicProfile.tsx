import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  Loader2,
  AlertCircle,
  MapPin,
  Building2,
  User,
  Phone,
  Calendar,
  Briefcase,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useClientPublicProfile } from "@/hooks/useProfile";
import { useClientReviews } from "@/hooks/useRankings";
import { useAuth } from "@/contexts/AuthContext";

function getInitials(name: string) {
  return name
    .split(/[\s._-]+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("") || "?";
}

const ClientPublicProfile = () => {
  const { id } = useParams<{ id: string }>();
  const clientId = Number(id);
  const { isAuthenticated } = useAuth();

  const { data, isLoading, isError } = useClientPublicProfile(clientId);
  const { data: reviewsData } = useClientReviews(clientId);

  const profile = data?.client_profile ?? null;
  const user = data?.user ?? null;

  const displayName =
    profile?.details?.company_name ||
    [profile?.details?.first_name, profile?.details?.last_name].filter(Boolean).join(" ") ||
    user?.username ||
    "";

  const reviews = reviewsData?.results ?? [];
  const avgRating = reviews.length
    ? reviews.reduce((s, r) => s + (r as { rating: number }).rating, 0) / reviews.length
    : null;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <main className="flex-1 container mx-auto px-4 py-8 max-w-3xl">
        {/* Back */}
        <Link
          to={-1 as unknown as string}
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft size={14} /> Retour
        </Link>

        {isLoading && (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin text-primary" size={36} />
          </div>
        )}

        {isError && (
          <div className="flex flex-col items-center justify-center py-20 text-muted-foreground gap-3">
            <AlertCircle size={36} className="text-destructive/60" />
            <p className="text-sm font-medium">Profil introuvable ou non disponible.</p>
          </div>
        )}

        {!isLoading && !isError && data && (
          <div className="space-y-5">
            {/* Header card */}
            <Card className="p-6">
              <div className="flex items-start gap-5">
                {/* Avatar */}
                <div className="flex-shrink-0">
                  {profile?.profile_picture ? (
                    <img
                      src={profile.profile_picture}
                      alt={displayName}
                      className="w-20 h-20 rounded-2xl object-cover border border-border"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center">
                      <span className="text-2xl font-bold text-primary">
                        {getInitials(displayName || user?.username || "?")}
                      </span>
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3 flex-wrap">
                    <div>
                      <h1 className="text-2xl font-bold leading-tight">
                        {displayName || user?.username}
                      </h1>
                      {user?.username && displayName !== user.username && (
                        <p className="text-sm text-muted-foreground mt-0.5">@{user.username}</p>
                      )}
                    </div>
                    <Badge variant="secondary" className="text-xs flex-shrink-0">
                      {profile?.client_type === "COMPANY" ? (
                        <span className="flex items-center gap-1"><Building2 size={11} /> Entreprise</span>
                      ) : (
                        <span className="flex items-center gap-1"><User size={11} /> Particulier</span>
                      )}
                    </Badge>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 mt-3 text-sm text-muted-foreground">
                    {(profile?.city_or_region || profile?.country) && (
                      <span className="flex items-center gap-1">
                        <MapPin size={13} />
                        {[profile.city_or_region, profile.country].filter(Boolean).join(", ")}
                      </span>
                    )}
                    {profile?.created_at && (
                      <span className="flex items-center gap-1">
                        <Calendar size={13} />
                        Membre depuis{" "}
                        {new Date(profile.created_at).toLocaleDateString("fr-FR", {
                          month: "long",
                          year: "numeric",
                        })}
                      </span>
                    )}
                  </div>

                  {avgRating !== null && (
                    <div className="flex items-center gap-1.5 mt-3">
                      {[1, 2, 3, 4, 5].map((n) => (
                        <svg
                          key={n}
                          viewBox="0 0 20 20"
                          className={`w-4 h-4 ${n <= Math.round(avgRating) ? "fill-yellow-400" : "fill-muted stroke-muted-foreground"}`}
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                      <span className="text-sm font-medium">{avgRating.toFixed(1)}</span>
                      <span className="text-xs text-muted-foreground">({reviews.length} avis)</span>
                    </div>
                  )}
                </div>
              </div>
            </Card>

            {/* Contact (authenticated only) */}
            {isAuthenticated && profile?.phone && (
              <Card className="p-5">
                <h2 className="text-sm font-semibold mb-3 flex items-center gap-2">
                  <Phone size={14} className="text-primary" /> Contact
                </h2>
                <p className="text-sm text-muted-foreground flex items-center gap-2">
                  <Phone size={13} /> {profile.phone}
                </p>
              </Card>
            )}

            {/* Reviews from providers */}
            {reviews.length > 0 && (
              <Card className="p-5">
                <h2 className="text-sm font-semibold mb-4 flex items-center gap-2">
                  <Briefcase size={14} className="text-primary" /> Avis des prestataires
                </h2>
                <div className="space-y-3">
                  {reviews.slice(0, 5).map((r) => {
                    const rev = r as { id: string; provider_username?: string; rating: number; comment?: string; created_at: string };
                    return (
                      <div key={rev.id} className="p-3 rounded-xl bg-muted/40 border border-border/60">
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-xs font-semibold">{rev.provider_username ?? "Prestataire"}</p>
                          <div className="flex items-center gap-0.5">
                            {[1, 2, 3, 4, 5].map((n) => (
                              <svg key={n} viewBox="0 0 20 20" className={`w-3 h-3 ${n <= rev.rating ? "fill-yellow-400" : "fill-muted"}`}>
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                          </div>
                        </div>
                        {rev.comment && <p className="text-xs text-muted-foreground italic">"{rev.comment}"</p>}
                        <p className="text-[10px] text-muted-foreground mt-1">
                          {new Date(rev.created_at).toLocaleDateString("fr-FR")}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </Card>
            )}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default ClientPublicProfile;
