import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Loader2,
  MapPin,
  Calendar,
  Hash,
  Star,
  Trophy,
  Coins,
  MessageSquare,
  User,
  Building2,
  CheckCircle2,
  Briefcase,
  Clock,
  Tag,
  CheckCircle,
} from "lucide-react";
import { useFreelancer } from "@/hooks/useFreelancers";
import { useProviderRank, useProviderReviews, usePortfolio } from "@/hooks/useRankings";
import type { ApiProviderReview, StarsEnum, ApiPortfolioItem } from "@/types";

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

function ratingDist(reviews: ApiProviderReview[]): Record<number, number> {
  const d: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  reviews.forEach((r) => { d[r.rating] = (d[r.rating] ?? 0) + 1; });
  return d;
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

function StarsDisplay({ rating, size = 14 }: { rating: number; size?: number }) {
  return (
    <span className="inline-flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={size}
          className={i < Math.round(rating) ? "fill-cta text-cta" : "fill-muted text-muted-foreground/30"}
        />
      ))}
    </span>
  );
}

function RatingBar({ star, count, total }: { star: number; count: number; total: number }) {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0;
  return (
    <div className="flex items-center gap-2 text-xs">
      <span className="w-4 text-right text-muted-foreground">{star}</span>
      <Star size={10} className="fill-cta text-cta flex-shrink-0" />
      <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
        <div className="h-full bg-cta rounded-full" style={{ width: `${pct}%` }} />
      </div>
      <span className="w-5 text-muted-foreground">{count}</span>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

interface PublicProfileSheetProps {
  userId: number;
  open: boolean;
  onOpenChange: (v: boolean) => void;
}

export function PublicProfileSheet({ userId, open, onOpenChange }: PublicProfileSheetProps) {
  const { data: profile, isLoading } = useFreelancer(userId);
  const { data: rank } = useProviderRank(userId);
  const { data: reviewsData } = useProviderReviews(userId);
  const { data: portfolioData } = usePortfolio(userId);

  const reviews = reviewsData?.results ?? [];
  const totalReviews = reviewsData?.count ?? 0;
  const avg = avgRating(reviews);
  const dist = ratingDist(reviews);

  const displayName = profile
    ? profile.freelance_details?.first_name
      ? `${profile.freelance_details.first_name} ${profile.freelance_details.last_name}`
      : profile.username
    : "";

  const location = profile
    ? [profile.city_or_region, profile.country].filter(Boolean).join(", ")
    : "";

  const memberSince = profile
    ? new Date(profile.created_at).toLocaleDateString("fr-FR", { month: "long", year: "numeric" })
    : "";

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-2xl overflow-y-auto p-0">
        <SheetHeader className="px-6 py-4 border-b border-border sticky top-0 bg-white z-10">
          <SheetTitle className="text-base">Aperçu de mon profil public</SheetTitle>
        </SheetHeader>

        <div className="px-6 py-6 space-y-5">
          {isLoading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="animate-spin text-primary" size={36} />
            </div>
          ) : !profile ? (
            <p className="text-center text-muted-foreground py-20">Profil introuvable.</p>
          ) : (
            <>
              {/* Hero card */}
              <Card className="p-5">
                <div className="flex gap-4 items-start">
                  {/* Avatar */}
                  <div className="relative flex-shrink-0">
                    {profile.profile_picture ? (
                      <img
                        src={profile.profile_picture}
                        alt={displayName}
                        className="w-20 h-20 rounded-xl object-cover border-4 border-background shadow-sm"
                      />
                    ) : (
                      <div className="w-20 h-20 rounded-xl bg-primary flex items-center justify-center text-white font-bold text-2xl border-4 border-background shadow-sm">
                        {getInitials(displayName)}
                      </div>
                    )}
                    <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-green-500 border-2 border-white" />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-0.5">
                      <h2 className="text-lg font-bold">{displayName}</h2>
                      {rank?.tier && rank.tier !== "FREE" && (
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${TIER_COLORS[rank.tier]}`}>
                          {TIER_LABELS[rank.tier]}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground font-medium mb-2">
                      {profile.speciality?.name ?? "Prestataire indépendant"}
                    </p>

                    {totalReviews > 0 && (
                      <div className="flex items-center gap-1.5 mb-2">
                        <StarsDisplay rating={avg} size={13} />
                        <span className="font-bold text-xs">{avg.toFixed(1)}</span>
                        <span className="text-xs text-muted-foreground">({totalReviews} avis)</span>
                      </div>
                    )}

                    <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                      {location && <span className="flex items-center gap-1"><MapPin size={11} />{location}</span>}
                      {memberSince && <span className="flex items-center gap-1"><Calendar size={11} />Depuis {memberSince}</span>}
                      {rank && <span className="flex items-center gap-1"><Hash size={11} />#{rank.position}</span>}
                    </div>
                  </div>
                </div>

                {/* Stats strip */}
                {(profile.hourly_rate || totalReviews > 0 || rank) && (
                  <div className="mt-4 pt-4 border-t border-border grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {profile.hourly_rate && (
                      <div>
                        <p className="text-base font-bold text-primary">
                          {Number(profile.hourly_rate).toLocaleString("fr-FR")}
                          <span className="text-xs font-normal text-muted-foreground ml-1">GNF/h</span>
                        </p>
                        <p className="text-[10px] text-muted-foreground">Tarif horaire</p>
                      </div>
                    )}
                    {totalReviews > 0 && (
                      <div>
                        <p className="text-base font-bold">{totalReviews}</p>
                        <p className="text-[10px] text-muted-foreground">Avis clients</p>
                      </div>
                    )}
                    {rank && (
                      <>
                        <div>
                          <p className="text-base font-bold text-cta">{parseFloat(rank.score).toFixed(1)}</p>
                          <p className="text-[10px] text-muted-foreground">Score FreeJobGN</p>
                        </div>
                        <div>
                          <p className="text-base font-bold">#{rank.position}</p>
                          <p className="text-[10px] text-muted-foreground">Position</p>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </Card>

              {/* Bio */}
              {profile.bio && (
                <Card className="p-5">
                  <h3 className="font-semibold text-sm mb-3">À propos</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                    {profile.bio}
                  </p>
                </Card>
              )}

              {/* Skills */}
              {(profile.skills?.length > 0 || profile.speciality?.name) && (
                <Card className="p-5">
                  <h3 className="font-semibold text-sm mb-3">Compétences</h3>
                  {profile.speciality?.name && (
                    <div className="mb-3">
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium mb-1.5">Spécialité</p>
                      <Badge className="bg-primary/10 text-primary hover:bg-primary/15 text-xs py-0.5 px-2.5 border-0">
                        {profile.speciality.name}
                      </Badge>
                    </div>
                  )}
                  {profile.skills?.length > 0 && (
                    <div>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium mb-1.5">Technologies & outils</p>
                      <div className="flex flex-wrap gap-1.5">
                        {profile.skills.map((skill) => (
                          <Badge key={skill.id} variant="secondary" className="text-xs py-0.5 px-2 cursor-default">
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
                <Card className="p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-sm flex items-center gap-2">
                      <Briefcase size={14} className="text-primary" />
                      Portfolio
                    </h3>
                    <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                      {portfolioData.summary.total_completed} mission{portfolioData.summary.total_completed > 1 ? "s" : ""}
                    </span>
                  </div>

                  {portfolioData.summary.average_rating && (
                    <div className="flex items-center gap-2 mb-4 p-2.5 bg-muted/50 rounded-lg">
                      <StarsDisplay rating={portfolioData.summary.average_rating} size={12} />
                      <span className="font-semibold text-xs">{portfolioData.summary.average_rating.toFixed(1)}</span>
                      <span className="text-xs text-muted-foreground">note moyenne</span>
                    </div>
                  )}

                  <div className="space-y-3">
                    {portfolioData.results.map((item: ApiPortfolioItem, idx: number) => (
                      <div key={idx} className="p-3 rounded-lg border border-border hover:bg-muted/30 transition-colors">
                        <div className="flex items-start justify-between gap-2 mb-1.5">
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-xs leading-snug">{item.project_title}</p>
                            <p className="text-[10px] text-muted-foreground mt-0.5">{item.project_category}</p>
                          </div>
                          {item.review && (
                            <div className="flex items-center gap-0.5 flex-shrink-0">
                              <StarsDisplay rating={item.review.rating} size={10} />
                              {item.review.verified && <CheckCircle size={10} className="text-green-500 ml-0.5" />}
                            </div>
                          )}
                        </div>
                        {item.project_skills.length > 0 && (
                          <div className="flex flex-wrap gap-1 mb-2">
                            {item.project_skills.map((s) => (
                              <span key={s} className="text-[9px] px-1.5 py-0.5 bg-primary/8 text-primary rounded-full font-medium">{s}</span>
                            ))}
                          </div>
                        )}
                        <div className="flex flex-wrap gap-3 text-[10px] text-muted-foreground">
                          <span className="flex items-center gap-1"><Tag size={9} />{item.budget_range}</span>
                          {item.duration_days && <span className="flex items-center gap-1"><Clock size={9} />{item.duration_days}j</span>}
                          <span className="flex items-center gap-1">
                            <Calendar size={9} />
                            {new Date(item.completed_at).toLocaleDateString("fr-FR", { month: "short", year: "numeric" })}
                          </span>
                        </div>
                        {item.review?.comment && (
                          <blockquote className="mt-2 pt-2 border-t border-border text-[10px] text-muted-foreground italic line-clamp-2">
                            "{item.review.comment}"
                          </blockquote>
                        )}
                      </div>
                    ))}
                  </div>
                </Card>
              )}

              {/* Reviews */}
              {totalReviews > 0 && (
                <Card className="p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-sm flex items-center gap-2">
                      <MessageSquare size={14} className="text-primary" />
                      Avis clients
                    </h3>
                    <span className="text-xs text-muted-foreground">{totalReviews} avis</span>
                  </div>

                  <div className="flex gap-5 mb-5 pb-4 border-b border-border">
                    <div className="text-center flex-shrink-0">
                      <p className="text-4xl font-extrabold leading-none">{avg.toFixed(1)}</p>
                      <StarsDisplay rating={avg} size={16} />
                      <p className="text-[10px] text-muted-foreground mt-1">sur 5</p>
                    </div>
                    <div className="flex-1 space-y-1">
                      {[5, 4, 3, 2, 1].map((s) => (
                        <RatingBar key={s} star={s} count={dist[s] ?? 0} total={totalReviews} />
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    {reviews.map((review) => (
                      <div key={review.id} className="pb-4 border-b border-border last:border-0 last:pb-0">
                        <div className="flex items-start gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <User size={13} className="text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2 flex-wrap">
                              <span className="font-medium text-xs">{review.client_username}</span>
                              <span className="text-[10px] text-muted-foreground/60">
                                {new Date(review.created_at).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
                              </span>
                            </div>
                            <div className="flex items-center gap-1.5 mt-0.5 mb-1.5">
                              <StarsDisplay rating={review.rating} size={11} />
                            </div>
                            {review.comment && (
                              <p className="text-xs text-muted-foreground leading-relaxed">{review.comment}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              )}

              {/* Sidebar info (ranking + contact) */}
              {rank && (
                <Card className="p-5">
                  <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                    <Trophy size={14} className="text-cta" />
                    Classement FreeJobGN
                  </h3>
                  <div className="space-y-2.5 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">Position</span>
                      <span className="font-bold text-primary">#{rank.position}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">Score</span>
                      <span className="font-bold text-cta">{parseFloat(rank.score).toFixed(2)}</span>
                    </div>
                    {rank.stars > 0 && (
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">Étoiles</span>
                        <span className="inline-flex gap-0.5">
                          {Array.from({ length: rank.stars as number }).map((_, i) => (
                            <Star key={i} size={12} className="fill-cta text-cta" />
                          ))}
                        </span>
                      </div>
                    )}
                    {rank.tier !== "FREE" && (
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">Niveau</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${TIER_COLORS[rank.tier]}`}>
                          {TIER_LABELS[rank.tier]}
                        </span>
                      </div>
                    )}
                  </div>
                </Card>
              )}

              {/* Info card */}
              <Card className="p-5">
                <h3 className="text-sm font-semibold mb-3">Informations</h3>
                <div className="space-y-2.5 text-xs text-muted-foreground">
                  {location && (
                    <div className="flex items-start gap-2">
                      <MapPin size={13} className="mt-0.5 flex-shrink-0 text-primary/60" />
                      <span>{location}</span>
                    </div>
                  )}
                  {memberSince && (
                    <div className="flex items-start gap-2">
                      <Calendar size={13} className="mt-0.5 flex-shrink-0 text-primary/60" />
                      <span>Membre depuis {memberSince}</span>
                    </div>
                  )}
                  <div className="flex items-start gap-2">
                    {profile.freelance_details?.business_name ? (
                      <><Building2 size={13} className="mt-0.5 flex-shrink-0 text-primary/60" /><span>Agence — {profile.freelance_details.business_name}</span></>
                    ) : (
                      <><CheckCircle2 size={13} className="mt-0.5 flex-shrink-0 text-primary/60" /><span>Freelancer indépendant</span></>
                    )}
                  </div>
                  <div className="flex items-start gap-2">
                    <Coins size={13} className="mt-0.5 flex-shrink-0 text-primary/60" />
                    <span>Paiement sécurisé Mobile Money</span>
                  </div>
                </div>
              </Card>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
