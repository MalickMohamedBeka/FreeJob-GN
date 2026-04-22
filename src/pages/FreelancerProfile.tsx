import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  MapPin,
  Coins,
  ArrowLeft,
  Loader2,
  AlertCircle,
  Star,
  Trophy,
  Calendar,
  CheckCircle2,
  User,
  Building2,
  MessageSquare,
  Hash,
  Briefcase,
  Clock,
  Tag,
  CheckCircle,
  FolderPlus,
  Award,
  Link as LinkIcon,
  FileText,
  Heart,
  MoreVertical,
  Flag,
  ShieldCheck,
  TrendingUp,
  Globe,
  Linkedin,
  BadgeCheck,
  Wallet,
  Users,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useFreelancer, useProviders } from "@/hooks/useFreelancers";
import { useProviderRank, useProviderReviews, usePortfolio, useProviderRankHistory } from "@/hooks/useRankings";
import { usePortfolioItems, useCertifications, useFavorites, useAddFavorite, useRemoveFavorite, useReportUser } from "@/hooks/useProfile";
import { useAuth } from "@/contexts/AuthContext";
import { ROUTES } from "@/constants/routes";
import type { ApiProviderReview, StarsEnum, ApiPortfolioItem } from "@/types";
import DirectProjectModal from "@/components/freelancer/DirectProjectModal";
import { FlagContentModal } from "@/components/common";

// ── Helpers ──────────────────────────────────────────────────────────────────

function getInitials(name: string) {
  return (
    name
      .split(/[\s._-]+/)
      .slice(0, 2)
      .map((w) => w[0]?.toUpperCase() ?? "")
      .join("") || "?"
  );
}

function avgRating(reviews: ApiProviderReview[]): number {
  if (!reviews.length) return 0;
  return reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
}

function ratingDistribution(
  reviews: ApiProviderReview[],
): Record<number, number> {
  const dist: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  reviews.forEach((r) => {
    dist[r.rating] = (dist[r.rating] ?? 0) + 1;
  });
  return dist;
}

const TIER_LABELS: Record<string, string> = {
  FREE: "Gratuit",
  PRO: "Freelance Pro",
  PRO_MAX: "Freelance Pro Max",
  AGENCY: "Agence",
};

const TIER_COLORS: Record<string, string> = {
  FREE: "bg-muted text-muted-foreground",
  PRO: "bg-primary/10 text-primary",
  PRO_MAX: "bg-cta/10 text-cta",
  AGENCY: "bg-secondary/10 text-secondary-foreground",
};

// ── Sub-components ────────────────────────────────────────────────────────────

function StarsDisplay({
  rating,
  size = 16,
}: {
  rating: number;
  size?: number;
}) {
  return (
    <span className="inline-flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={size}
          className={
            i < Math.round(rating)
              ? "fill-cta text-cta"
              : "fill-muted text-muted-foreground/30"
          }
        />
      ))}
    </span>
  );
}

function RankStars({ stars }: { stars: StarsEnum }) {
  if (stars === 0) return null;
  return (
    <span className="inline-flex gap-0.5">
      {Array.from({ length: stars }).map((_, i) => (
        <Star key={i} size={13} className="fill-cta text-cta" />
      ))}
    </span>
  );
}

function RatingBar({
  star,
  count,
  total,
}: {
  star: number;
  count: number;
  total: number;
}) {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0;
  return (
    <div className="flex items-center gap-2 text-xs">
      <span className="w-4 text-right text-muted-foreground">{star}</span>
      <Star size={11} className="fill-cta text-cta flex-shrink-0" />
      <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
        <div
          className="h-full bg-cta rounded-full transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="w-6 text-muted-foreground">{count}</span>
    </div>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────

const FreelancerProfile = () => {
  const { id } = useParams<{ id: string }>();
  const { data: profile, isLoading, isError } = useFreelancer(Number(id));
  // Hooks who need User.id (different from ProviderProfile.id in the URL)
  const userId = profile?.user_id;
  const { data: rank } = useProviderRank(userId);
  const { data: rankHistoryData } = useProviderRankHistory(userId);
  const { data: reviewsData } = useProviderReviews(userId);
  const { data: portfolioData } = usePortfolio(userId);
  // portfolio-items and certifications use ProviderProfile.id and User.id respectively
  const { data: portfolioItemsData } = usePortfolioItems(Number(id));
  const { data: certificationsData } = useCertifications(userId);
  const portfolioItems = portfolioItemsData?.results ?? [];
  const certifications = certificationsData?.results ?? [];

  const specialityId = profile?.speciality?.id;
  const { data: similarData } = useProviders({
    provider_kind: "FREELANCE",
    speciality_id: specialityId ?? undefined,
  });
  const similarProviders = (similarData?.results ?? [])
    .filter((p) => p.id !== Number(id))
    .slice(0, 3);
  const { isAuthenticated, user } = useAuth();
  const [showDirectModal, setShowDirectModal] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);
  const [flagOpen, setFlagOpen] = useState(false);

  const isClient = isAuthenticated && user?.role === "CLIENT";
  // Compare User.id (from auth) to user_id (from profile) — not ProviderProfile.id
  const isOwner = isAuthenticated && !!profile && user?.id === profile.user_id;
  const canReport = isAuthenticated && !isOwner;

  const { data: favoritesData } = useFavorites(isClient);
  const addFavorite = useAddFavorite();
  const removeFavorite = useRemoveFavorite();
  // ApiFavorite.provider_id is User.id — compare against user_id from profile
  const isFavorite = !!userId && (favoritesData?.results ?? []).some(
    (f) => f.provider_id === userId,
  );
  const toggleFavorite = () => {
    if (!userId) return;
    if (isFavorite) {
      removeFavorite.mutate(userId);
    } else {
      addFavorite.mutate(userId);
    }
  };
  const favPending = addFavorite.isPending || removeFavorite.isPending;

  const reviews = reviewsData?.results ?? [];
  const totalReviews = reviewsData?.count ?? 0;
  const avg = avgRating(reviews);
  const dist = ratingDistribution(reviews);

  const displayName = profile
    ? profile.freelance_details?.first_name
      ? `${profile.freelance_details.first_name} ${profile.freelance_details.last_name}`
      : profile.username
    : "";

  const businessName = profile?.freelance_details?.business_name;
  const location = profile
    ? [profile.city_or_region, profile.country].filter(Boolean).join(", ")
    : "";
  const memberSince = profile
    ? new Date(profile.created_at).toLocaleDateString("fr-FR", {
        month: "long",
        year: "numeric",
      })
    : "";

  return (
    <div className="min-h-screen bg-muted/30">
      <Navbar />
      <main className="pt-16">
        <div className="container mx-auto px-4 lg:px-8 py-8 max-w-6xl">
          {/* Back link */}
          <Link
            to={ROUTES.FREELANCERS}
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
          >
            <ArrowLeft size={15} />
            Retour aux prestataires
          </Link>

          {isLoading ? (
            <div className="flex justify-center py-32">
              <Loader2 className="animate-spin text-primary" size={40} />
            </div>
          ) : isError || !profile ? (
            <div className="text-center py-32 text-muted-foreground">
              <AlertCircle className="mx-auto mb-4" size={48} />
              <p className="text-lg font-medium">Profil introuvable</p>
              <p className="text-sm mt-1">
                Ce prestataire n'existe pas ou n'est plus disponible.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* ── Hero card ── */}
              <Card className="p-6 sm:p-8">
                <div className="flex flex-col sm:flex-row gap-6 items-start">
                  {/* Avatar */}
                  <div className="relative flex-shrink-0">
                    {profile.profile_picture ? (
                      <img
                        src={profile.profile_picture}
                        alt={displayName}
                        className="w-28 h-28 rounded-2xl object-cover border-4 border-background shadow-md"
                      />
                    ) : (
                      <div className="w-28 h-28 rounded-2xl bg-primary flex items-center justify-center text-white font-bold text-3xl border-4 border-background shadow-md">
                        {getInitials(displayName)}
                      </div>
                    )}
                    {/* Availability dot */}
                    <span
                      className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-green-500 border-2 border-white"
                      title="Disponible"
                    />
                  </div>

                  {/* Main info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap mb-0.5">
                          <h1 className="text-2xl font-bold">{displayName}</h1>
                          {profile.is_kyc_verified && (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-green-100 text-green-700">
                              <ShieldCheck size={11} />
                              Vérifié
                            </span>
                          )}
                          {rank?.tier && rank.tier !== "FREE" && (
                            <span
                              className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${TIER_COLORS[rank.tier]}`}
                            >
                              {TIER_LABELS[rank.tier]}
                            </span>
                          )}
                        </div>
                        {businessName && (
                          <p className="text-sm text-muted-foreground flex items-center gap-1 mb-1">
                            <Building2 size={13} />
                            {businessName}
                          </p>
                        )}
                        <p className="text-base text-muted-foreground font-medium">
                          {profile.speciality?.name ??
                            "Prestataire indépendant"}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 flex-wrap">
                        {/* Availability badge */}
                        {profile.is_available ? (
                          <span className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full bg-green-100 text-green-700">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                            Disponible
                            {profile.available_from && new Date(profile.available_from) > new Date() && (
                              <span className="text-green-600 ml-0.5">
                                {" "}à partir du {new Date(profile.available_from).toLocaleDateString("fr-FR", { day: "2-digit", month: "short" })}
                              </span>
                            )}
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full bg-muted text-muted-foreground">
                            <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/50" />
                            Indisponible
                          </span>
                        )}
                        {isClient && (
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              className={`gap-1.5 transition-colors ${isFavorite ? "border-red-300 text-red-500 hover:bg-red-50" : "hover:border-red-300 hover:text-red-500"}`}
                              onClick={toggleFavorite}
                              disabled={favPending}
                              title={isFavorite ? "Retirer des favoris" : "Ajouter aux favoris"}
                            >
                              <Heart
                                size={14}
                                className={isFavorite ? "fill-red-500 text-red-500" : ""}
                              />
                              {isFavorite ? "Favori" : "Favori"}
                            </Button>
                            <Button
                              size="sm"
                              className="gap-1.5"
                              onClick={() => setShowDirectModal(true)}
                            >
                              <FolderPlus size={14} />
                              Proposer un projet
                            </Button>
                          </div>
                        )}

                        {canReport && (
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-muted-foreground">
                                <MoreVertical size={15} />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                className="text-destructive focus:text-destructive gap-2 cursor-pointer"
                                onClick={() => setReportOpen(true)}
                              >
                                <Flag size={13} />
                                Signaler ce profil
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-destructive focus:text-destructive gap-2 cursor-pointer"
                                onClick={() => setFlagOpen(true)}
                              >
                                <Flag size={13} />
                                Signaler un contenu
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        )}
                      </div>
                    </div>

                    {/* Rating row */}
                    {totalReviews > 0 && (
                      <div className="flex items-center gap-2 mt-3 mb-3">
                        <StarsDisplay rating={avg} size={15} />
                        <span className="font-bold text-sm">
                          {avg.toFixed(1)}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          ({totalReviews} avis)
                        </span>
                        {rank && rank.stars > 0 && (
                          <>
                            <span className="text-muted-foreground/40 mx-1">
                              ·
                            </span>
                            <RankStars stars={rank.stars} />
                            <span className="text-xs text-muted-foreground">
                              classement
                            </span>
                          </>
                        )}
                      </div>
                    )}

                    {/* Meta row */}
                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mt-2">
                      {location && (
                        <span className="flex items-center gap-1.5">
                          <MapPin size={13} />
                          {location}
                        </span>
                      )}
                      {memberSince && (
                        <span className="flex items-center gap-1.5">
                          <Calendar size={13} />
                          Membre depuis {memberSince}
                        </span>
                      )}
                      {rank && (
                        <span className="flex items-center gap-1.5">
                          <Hash size={13} />
                          Classé #{rank.position}
                        </span>
                      )}
                      {profile.years_of_experience != null && (
                        <span className="flex items-center gap-1.5">
                          <Briefcase size={13} />
                          {profile.years_of_experience} an{profile.years_of_experience > 1 ? "s" : ""} d'expérience
                        </span>
                      )}
                      {profile.linkedin_url && (
                        <a
                          href={profile.linkedin_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 hover:text-primary transition-colors"
                        >
                          <Linkedin size={13} />
                          LinkedIn
                        </a>
                      )}
                      {profile.website_url && (
                        <a
                          href={profile.website_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 hover:text-primary transition-colors"
                        >
                          <Globe size={13} />
                          Site web
                        </a>
                      )}
                    </div>
                  </div>
                </div>

                {/* Stats strip */}
                <div className="mt-6 pt-5 border-t border-border grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {profile.hourly_rate && (
                    <div>
                      <p className="text-xl font-bold text-primary">
                        {Number(profile.hourly_rate).toLocaleString("fr-FR")}
                        <span className="text-sm font-normal text-muted-foreground ml-1">GNF/h</span>
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">Tarif horaire</p>
                    </div>
                  )}
                  <div>
                    <p className="text-xl font-bold text-foreground flex items-center gap-1">
                      <BadgeCheck size={16} className="text-primary" />
                      {profile.projects_completed ?? 0}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">Projets terminés</p>
                  </div>
                  {(profile.success_rate ?? 0) > 0 && (
                    <div>
                      <p className="text-xl font-bold text-green-600">
                        {profile.success_rate}%
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">Taux de succès</p>
                    </div>
                  )}
                  {parseFloat(profile.total_budget_realized ?? "0") > 0 && (
                    <div>
                      <p className="text-xl font-bold text-foreground">
                        {parseFloat(profile.total_budget_realized).toLocaleString("fr-FR")}
                        <span className="text-sm font-normal text-muted-foreground ml-1">GNF</span>
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">CA réalisé</p>
                    </div>
                  )}
                  {totalReviews > 0 && (
                    <div>
                      <p className="text-xl font-bold text-foreground">{totalReviews}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">Avis clients</p>
                    </div>
                  )}
                  {rank && (
                    <>
                      <div>
                        <p className="text-xl font-bold text-cta">{parseFloat(rank.score).toFixed(1)}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">Score FreeJobGN</p>
                      </div>
                      <div>
                        <p className="text-xl font-bold text-foreground">#{rank.position}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">Position classement</p>
                      </div>
                    </>
                  )}
                </div>
              </Card>

              {/* ── Two-column body ── */}
              <div className="grid lg:grid-cols-3 gap-6 items-start">
                {/* ── Left column (main) ── */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Bio */}
                  {profile.bio && (
                    <Card className="p-6">
                      <h2 className="font-semibold text-base mb-4">À propos</h2>
                      <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                        {profile.bio}
                      </p>
                    </Card>
                  )}

                  {/* Speciality + Skills */}
                  {(profile.skills?.length > 0 || profile.speciality?.name) && (
                    <Card className="p-6">
                      <h2 className="font-semibold text-base mb-4">
                        Compétences
                      </h2>

                      {profile.speciality?.name && (
                        <div className="mb-4">
                          <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium mb-2">
                            Spécialité
                          </p>
                          <Badge className="bg-primary/10 text-primary hover:bg-primary/15 text-sm py-1 px-3 font-medium border-0">
                            {profile.speciality.name}
                          </Badge>
                          {profile.speciality.description && (
                            <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                              {profile.speciality.description}
                            </p>
                          )}
                        </div>
                      )}

                      {profile.skills?.length > 0 && (
                        <div>
                          <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium mb-2">
                            Technologies & outils
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {profile.skills.map((skill) => (
                              <Badge
                                key={skill.id}
                                variant="secondary"
                                className="text-xs py-1 px-2.5 cursor-default"
                              >
                                {skill.name}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </Card>
                  )}

                  {/* Portfolio */}
                  {portfolioData && portfolioData.results.length > 0 && (
                    <Card className="p-6">
                      <div className="flex items-center justify-between mb-5">
                        <h2 className="font-semibold text-base flex items-center gap-2">
                          <Briefcase size={16} className="text-primary" />
                          Portfolio
                        </h2>
                        <span className="text-xs text-muted-foreground bg-muted px-2.5 py-1 rounded-full">
                          {portfolioData.summary.total_completed} mission{portfolioData.summary.total_completed > 1 ? "s" : ""} réalisée{portfolioData.summary.total_completed > 1 ? "s" : ""}
                        </span>
                      </div>

                      {/* Summary strip */}
                      {portfolioData.summary.average_rating && (
                        <div className="flex items-center gap-3 mb-5 p-3 bg-muted/50 rounded-xl">
                          <StarsDisplay rating={portfolioData.summary.average_rating} size={14} />
                          <span className="font-semibold text-sm">{portfolioData.summary.average_rating.toFixed(1)}</span>
                          <span className="text-xs text-muted-foreground">note moyenne sur les projets terminés</span>
                        </div>
                      )}

                      {/* Project list */}
                      <div className="space-y-4">
                        {portfolioData.results.map((item: ApiPortfolioItem, idx: number) => (
                          <div
                            key={idx}
                            className="p-4 rounded-xl border border-border hover:border-primary/30 hover:bg-muted/30 transition-colors"
                          >
                            <div className="flex items-start justify-between gap-3 mb-2">
                              <div className="flex-1 min-w-0">
                                <p className="font-medium text-sm leading-snug">{item.project_title}</p>
                                <p className="text-xs text-muted-foreground mt-0.5">{item.project_category}</p>
                              </div>
                              {item.review && (
                                <div className="flex items-center gap-1 flex-shrink-0">
                                  <StarsDisplay rating={item.review.rating} size={12} />
                                  {item.review.verified && (
                                    <CheckCircle size={12} className="text-green-500 ml-0.5" aria-label="Avis vérifié" />
                                  )}
                                </div>
                              )}
                            </div>

                            {/* Skills */}
                            {item.project_skills.length > 0 && (
                              <div className="flex flex-wrap gap-1 mb-3">
                                {item.project_skills.map((skill) => (
                                  <span
                                    key={skill}
                                    className="text-[10px] px-2 py-0.5 bg-primary/8 text-primary rounded-full font-medium"
                                  >
                                    {skill}
                                  </span>
                                ))}
                              </div>
                            )}

                            {/* Meta */}
                            <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Tag size={10} />
                                {item.budget_range}
                              </span>
                              {item.duration_days && (
                                <span className="flex items-center gap-1">
                                  <Clock size={10} />
                                  {item.duration_days} jour{item.duration_days > 1 ? "s" : ""}
                                </span>
                              )}
                              <span className="flex items-center gap-1">
                                <Calendar size={10} />
                                {new Date(item.completed_at).toLocaleDateString("fr-FR", { month: "long", year: "numeric" })}
                              </span>
                            </div>

                            {/* Review comment */}
                            {item.review?.comment && (
                              <blockquote className="mt-3 pt-3 border-t border-border text-xs text-muted-foreground italic leading-relaxed line-clamp-2">
                                "{item.review.comment}"
                              </blockquote>
                            )}
                          </div>
                        ))}
                      </div>
                    </Card>
                  )}

                  {/* Portfolio items personnels */}
                  {portfolioItems.length > 0 && (
                    <Card className="p-6">
                      <div className="flex items-center justify-between mb-5">
                        <h2 className="font-semibold text-base flex items-center gap-2">
                          <FolderPlus size={16} className="text-primary" />
                          Réalisations personnelles
                        </h2>
                        <span className="text-xs text-muted-foreground bg-muted px-2.5 py-1 rounded-full">
                          {portfolioItems.length} item{portfolioItems.length > 1 ? "s" : ""}
                        </span>
                      </div>
                      <div className="space-y-3">
                        {portfolioItems.map((item) => (
                          <div
                            key={item.id}
                            className="rounded-xl border border-border hover:border-primary/30 hover:bg-muted/30 transition-colors overflow-hidden"
                          >
                            {/* Image du travail */}
                            {item.image && (
                              <a href={item.image} target="_blank" rel="noopener noreferrer">
                                <img
                                  src={item.image}
                                  alt={item.title}
                                  className="w-full h-40 object-cover hover:opacity-90 transition-opacity"
                                />
                              </a>
                            )}
                            <div className="p-4">
                              <p className="font-medium text-sm leading-snug">{item.title}</p>
                              {item.description && (
                                <p className="text-xs text-muted-foreground mt-1 line-clamp-3">{item.description}</p>
                              )}
                              {item.tech_stack?.length > 0 && (
                                <div className="flex flex-wrap gap-1 mt-2">
                                  {item.tech_stack.map((t: string) => (
                                    <span key={t} className="text-[10px] px-2 py-0.5 bg-primary/8 text-primary rounded-full font-medium">{t}</span>
                                  ))}
                                </div>
                              )}
                              <div className="flex flex-wrap gap-4 mt-2 text-xs text-muted-foreground">
                                {item.url && (
                                  <a href={item.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-primary transition-colors">
                                    <LinkIcon size={10} /> Voir le projet
                                  </a>
                                )}
                                {item.file && (
                                  <a href={item.file} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-primary transition-colors">
                                    <FileText size={10} /> Fichier joint
                                  </a>
                                )}
                                <span className="flex items-center gap-1">
                                  <Calendar size={10} />
                                  {new Date(item.created_at).toLocaleDateString("fr-FR", { month: "long", year: "numeric" })}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </Card>
                  )}

                  {/* Certifications */}
                  {certifications.length > 0 && (
                    <Card className="p-6">
                      <div className="flex items-center justify-between mb-5">
                        <h2 className="font-semibold text-base flex items-center gap-2">
                          <Award size={16} className="text-primary" />
                          Certifications
                        </h2>
                        <span className="text-xs text-muted-foreground bg-muted px-2.5 py-1 rounded-full">
                          {certifications.length}
                        </span>
                      </div>
                      <div className="space-y-3">
                        {certifications.map((cert) => (
                          <div
                            key={cert.id}
                            className="flex items-start gap-3 p-3 rounded-xl border border-border hover:border-primary/30 hover:bg-muted/20 transition-colors"
                          >
                            <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                              <Award size={16} className="text-primary" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-sm">{cert.name}</p>
                              <p className="text-xs text-muted-foreground">{cert.issuer}</p>
                              <div className="flex flex-wrap gap-3 mt-1 text-[10px] text-muted-foreground">
                                {cert.issued_at && (
                                  <span>Obtenue : {new Date(cert.issued_at).toLocaleDateString("fr-FR", { month: "short", year: "numeric" })}</span>
                                )}
                                {cert.expires_at && (
                                  <span>Expire : {new Date(cert.expires_at).toLocaleDateString("fr-FR", { month: "short", year: "numeric" })}</span>
                                )}
                                {cert.file && (
                                  <a href={cert.file} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-primary transition-colors">
                                    <FileText size={9} /> Voir le certificat
                                  </a>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </Card>
                  )}

                  {/* Reviews */}
                  {totalReviews > 0 && (
                    <Card className="p-6">
                      <div className="flex items-center justify-between mb-6">
                        <h2 className="font-semibold text-base flex items-center gap-2">
                          <MessageSquare size={16} className="text-primary" />
                          Avis clients
                        </h2>
                        <span className="text-sm text-muted-foreground">
                          {totalReviews} avis
                        </span>
                      </div>

                      {/* Rating summary */}
                      <div className="flex flex-col sm:flex-row gap-6 mb-6 pb-6 border-b border-border">
                        {/* Big score */}
                        <div className="text-center flex-shrink-0">
                          <p className="text-5xl font-extrabold text-foreground leading-none">
                            {avg.toFixed(1)}
                          </p>
                          <StarsDisplay rating={avg} size={18} />
                          <p className="text-xs text-muted-foreground mt-1">
                            sur 5
                          </p>
                        </div>
                        {/* Distribution bars */}
                        <div className="flex-1 space-y-1.5">
                          {[5, 4, 3, 2, 1].map((star) => (
                            <RatingBar
                              key={star}
                              star={star}
                              count={dist[star] ?? 0}
                              total={totalReviews}
                            />
                          ))}
                        </div>
                      </div>

                      {/* Review list */}
                      <div className="space-y-5">
                        {reviews.map((review) => (
                          <div
                            key={review.id}
                            className="pb-5 border-b border-border last:border-0 last:pb-0"
                          >
                            <div className="flex items-start gap-3">
                              {/* Client avatar */}
                              <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                                <User size={15} className="text-primary" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between gap-2 flex-wrap">
                                  <span className="font-medium text-sm">
                                    {review.client_username}
                                  </span>
                                  <span className="text-[11px] text-muted-foreground/60">
                                    {new Date(
                                      review.created_at,
                                    ).toLocaleDateString("fr-FR", {
                                      day: "numeric",
                                      month: "long",
                                      year: "numeric",
                                    })}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2 mt-0.5 mb-2">
                                  <StarsDisplay
                                    rating={review.rating}
                                    size={12}
                                  />
                                  {review.project_budget &&
                                    parseFloat(review.project_budget) > 0 && (
                                      <span className="text-[11px] text-muted-foreground">
                                        · Projet{" "}
                                        {parseFloat(
                                          review.project_budget,
                                        ).toLocaleString("fr-FR")}{" "}
                                        GNF
                                      </span>
                                    )}
                                </div>
                                {review.comment && (
                                  <p className="text-sm text-muted-foreground leading-relaxed">
                                    {review.comment}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </Card>
                  )}
                </div>

                {/* ── Prestataires similaires ── */}
                {similarProviders.length > 0 && (
                  <div className="lg:col-span-2">
                    <Card className="p-6">
                      <h2 className="font-semibold text-base flex items-center gap-2 mb-5">
                        <Users size={16} className="text-primary" />
                        Prestataires similaires
                      </h2>
                      <div className="grid sm:grid-cols-3 gap-4">
                        {similarProviders.map((p) => {
                          const name = p.freelance_details
                            ? `${p.freelance_details.first_name} ${p.freelance_details.last_name}`
                            : p.username;
                          return (
                            <Link
                              key={p.id}
                              to={ROUTES.FREELANCER_PROFILE.replace(":id", String(p.id))}
                              className="flex flex-col items-center text-center p-4 rounded-xl border border-border hover:border-primary/30 hover:shadow-sm transition-all group"
                            >
                              {p.profile_picture ? (
                                <img src={p.profile_picture} alt={name} className="w-14 h-14 rounded-full object-cover mb-2" />
                              ) : (
                                <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center text-white font-bold text-lg mb-2">
                                  {name.slice(0, 2).toUpperCase()}
                                </div>
                              )}
                              <p className="font-semibold text-sm group-hover:text-primary transition-colors truncate w-full">{name}</p>
                              <p className="text-xs text-muted-foreground">{p.speciality?.name ?? "Prestataire"}</p>
                              {p.hourly_rate && (
                                <p className="text-xs text-primary font-medium mt-1">
                                  {Number(p.hourly_rate).toLocaleString("fr-FR")} GNF/h
                                </p>
                              )}
                            </Link>
                          );
                        })}
                      </div>
                    </Card>
                  </div>
                )}

                {/* ── Right column (sticky sidebar) ── */}
                <div className="space-y-4 lg:sticky lg:top-24">
                  {/* Contact CTA */}
                  <Card className="p-5">
                    {profile.hourly_rate && (
                      <div className="mb-4">
                        <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium mb-1">
                          Tarif horaire
                        </p>
                        <p className="text-2xl font-extrabold text-primary">
                          {Number(profile.hourly_rate).toLocaleString("fr-FR")}
                          <span className="text-base font-semibold text-muted-foreground ml-1">
                            GNF/h
                          </span>
                        </p>
                      </div>
                    )}
                    <div className="space-y-2">
                      <Button
                        variant="cta"
                        className="w-full rounded-full font-semibold"
                      >
                        Contacter ce prestataire
                      </Button>
                    </div>
                    {totalReviews > 0 && (
                      <div className="mt-4 pt-4 border-t border-border flex items-center gap-2">
                        <StarsDisplay rating={avg} size={13} />
                        <span className="text-sm font-semibold">
                          {avg.toFixed(1)}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          ({totalReviews} avis)
                        </span>
                      </div>
                    )}
                  </Card>

                  {/* Ranking card */}
                  {rank && (
                    <Card className="p-5">
                      <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
                        <Trophy size={15} className="text-cta" />
                        Classement FreeJobGN
                      </h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">
                            Position
                          </span>
                          <span className="font-bold text-primary">
                            #{rank.position}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">
                            Score
                          </span>
                          <span className="font-bold text-cta">
                            {parseFloat(rank.score).toFixed(2)}
                          </span>
                        </div>
                        {rank.stars > 0 && (
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-muted-foreground">
                              Étoiles
                            </span>
                            <RankStars stars={rank.stars} />
                          </div>
                        )}
                        {rank.tier !== "FREE" && (
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-muted-foreground">
                              Niveau
                            </span>
                            <span
                              className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${TIER_COLORS[rank.tier]}`}
                            >
                              {TIER_LABELS[rank.tier]}
                            </span>
                          </div>
                        )}
                        {rankHistoryData && rankHistoryData.results && rankHistoryData.results.length > 0 && (
                          <div className="pt-2 border-t border-border">
                            <p className="text-xs text-muted-foreground mb-2">Évolution récente</p>
                            <div className="space-y-1">
                              {rankHistoryData.results.slice(0, 4).map((snap, i, arr) => {
                                const prev = arr[i + 1];
                                const diff = prev ? prev.position - snap.position : 0;
                                return (
                                  <div key={snap.id} className="flex items-center justify-between text-xs">
                                    <span className="text-muted-foreground">
                                      {new Date(snap.period_start).toLocaleDateString("fr-FR", { month: "short", year: "2-digit" })}
                                    </span>
                                    <div className="flex items-center gap-1.5">
                                      <span className="font-medium">#{snap.position}</span>
                                      {diff > 0 && <span className="text-green-600 font-bold">↑{diff}</span>}
                                      {diff < 0 && <span className="text-red-500 font-bold">↓{Math.abs(diff)}</span>}
                                      {diff === 0 && prev && <span className="text-muted-foreground">—</span>}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    </Card>
                  )}

                  {/* Profile info card */}
                  <Card className="p-5">
                    <h3 className="text-sm font-semibold mb-4">Informations</h3>
                    <div className="space-y-3 text-sm">
                      {location && (
                        <div className="flex items-start gap-2.5 text-muted-foreground">
                          <MapPin size={14} className="mt-0.5 flex-shrink-0 text-primary/60" />
                          <span>{location}</span>
                        </div>
                      )}
                      {memberSince && (
                        <div className="flex items-start gap-2.5 text-muted-foreground">
                          <Calendar size={14} className="mt-0.5 flex-shrink-0 text-primary/60" />
                          <span>Membre depuis {memberSince}</span>
                        </div>
                      )}
                      {profile.years_of_experience != null && (
                        <div className="flex items-start gap-2.5 text-muted-foreground">
                          <Briefcase size={14} className="mt-0.5 flex-shrink-0 text-primary/60" />
                          <span>{profile.years_of_experience} an{profile.years_of_experience > 1 ? "s" : ""} d'expérience</span>
                        </div>
                      )}
                      <div className="flex items-start gap-2.5 text-muted-foreground">
                        {businessName ? (
                          <>
                            <Building2 size={14} className="mt-0.5 flex-shrink-0 text-primary/60" />
                            <span>Agence — {businessName}</span>
                          </>
                        ) : (
                          <>
                            <CheckCircle2 size={14} className="mt-0.5 flex-shrink-0 text-primary/60" />
                            <span>Freelancer indépendant</span>
                          </>
                        )}
                      </div>
                      <div className="flex items-start gap-2.5 text-muted-foreground">
                        <ShieldCheck size={14} className={`mt-0.5 flex-shrink-0 ${profile.is_kyc_verified ? "text-green-600" : "text-primary/60"}`} />
                        <span className={profile.is_kyc_verified ? "text-green-700 font-medium" : ""}>
                          {profile.is_kyc_verified ? "Identité vérifiée" : "Identité non vérifiée"}
                        </span>
                      </div>
                      <div className="flex items-start gap-2.5 text-muted-foreground">
                        <Coins size={14} className="mt-0.5 flex-shrink-0 text-primary/60" />
                        <span>Paiement sécurisé Mobile Money</span>
                      </div>
                      {profile.linkedin_url && (
                        <div className="flex items-start gap-2.5">
                          <Linkedin size={14} className="mt-0.5 flex-shrink-0 text-primary/60" />
                          <a href={profile.linkedin_url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline truncate">
                            LinkedIn
                          </a>
                        </div>
                      )}
                      {profile.website_url && (
                        <div className="flex items-start gap-2.5">
                          <Globe size={14} className="mt-0.5 flex-shrink-0 text-primary/60" />
                          <a href={profile.website_url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline truncate">
                            Site web
                          </a>
                        </div>
                      )}
                    </div>
                  </Card>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />

      {isClient && profile && (
        <DirectProjectModal
          open={showDirectModal}
          onClose={() => setShowDirectModal(false)}
          providerUsername={displayName || profile.username}
        />
      )}

      {canReport && profile && (
        <ReportUserDialog
          open={reportOpen}
          onOpenChange={setReportOpen}
          userId={profile.user_id}
          username={displayName || profile.username}
        />
      )}

      {canReport && profile && (
        <FlagContentModal
          open={flagOpen}
          onOpenChange={setFlagOpen}
          contentType="freelancer_profile"
          objectId={profile.id}
          label={displayName || profile.username}
        />
      )}
    </div>
  );
};

// ── Report Dialog ─────────────────────────────────────────────────────────────

const REPORT_REASONS: { value: string; label: string }[] = [
  { value: "SPAM", label: "Spam" },
  { value: "FRAUD", label: "Fraude" },
  { value: "INAPPROPRIATE", label: "Contenu inapproprié" },
  { value: "OTHER", label: "Autre" },
];

function ReportUserDialog({
  open,
  onOpenChange,
  userId,
  username,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  userId: number;
  username: string;
}) {
  const [reason, setReason] = useState("");
  const [details, setDetails] = useState("");
  const [done, setDone] = useState(false);
  const { mutate, isPending } = useReportUser();

  const handleClose = () => {
    onOpenChange(false);
    setTimeout(() => { setReason(""); setDetails(""); setDone(false); }, 200);
  };

  const handleSubmit = () => {
    if (!reason) return;
    mutate(
      { userId, reason, details },
      {
        onSuccess: () => setDone(true),
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && handleClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base">
            <Flag size={15} className="text-destructive" />
            Signaler @{username}
          </DialogTitle>
        </DialogHeader>

        {done ? (
          <div className="py-6 text-center space-y-2">
            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mx-auto">
              <Flag size={20} className="text-green-600" />
            </div>
            <p className="font-semibold text-sm">Signalement envoyé</p>
            <p className="text-xs text-muted-foreground">
              Notre équipe examinera votre signalement dans les plus brefs délais.
            </p>
            <Button size="sm" variant="outline" className="mt-2" onClick={handleClose}>
              Fermer
            </Button>
          </div>
        ) : (
          <>
            <div className="space-y-4 py-1">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Raison *
                </Label>
                <Select value={reason} onValueChange={setReason}>
                  <SelectTrigger className="h-10">
                    <SelectValue placeholder="Choisir une raison…" />
                  </SelectTrigger>
                  <SelectContent>
                    {REPORT_REASONS.map((r) => (
                      <SelectItem key={r.value} value={r.value}>
                        {r.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Détails (optionnel)
                </Label>
                <Textarea
                  rows={3}
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  placeholder="Décrivez le problème…"
                  className="resize-none"
                />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={handleClose} disabled={isPending}>
                Annuler
              </Button>
              <Button
                variant="destructive"
                onClick={handleSubmit}
                disabled={isPending || !reason}
                className="gap-2"
              >
                {isPending && <Loader2 size={13} className="animate-spin" />}
                <Flag size={13} />
                Envoyer le signalement
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default FreelancerProfile;
