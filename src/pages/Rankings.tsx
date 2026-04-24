import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Trophy, Star, TrendingUp, TrendingDown, Minus, ChevronLeft, ChevronRight, Award, Info } from "lucide-react";
import { useRankings, type RankingFilters } from "@/hooks/useRankings";
import type { ApiProviderRank } from "@/types";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { ROUTES } from "@/constants";

// ── Helpers ────────────────────────────────────────────────────────────────────

function getInitials(username: string) {
  return username.slice(0, 2).toUpperCase();
}

const TIER_COLORS: Record<string, string> = {
  FREE: "bg-slate-100 text-slate-600",
  PRO: "bg-blue-100 text-blue-700",
  PRO_MAX: "bg-purple-100 text-purple-700",
  AGENCY: "bg-amber-100 text-amber-700",
};

const TIER_LABELS: Record<string, string> = {
  FREE: "Gratuit",
  PRO: "Pro",
  PRO_MAX: "Pro Max",
  AGENCY: "Agence",
};

function StarsBadge({ count }: { count: number }) {
  if (count === 0) return null;
  return (
    <span className="inline-flex items-center gap-0.5">
      {Array.from({ length: count }).map((_, i) => (
        <Star key={i} size={11} className="fill-amber-400 text-amber-400" />
      ))}
    </span>
  );
}

function TrendIcon({ prev, current }: { prev?: number; current: number }) {
  if (prev === undefined || prev === current) return <Minus size={14} className="text-muted-foreground" />;
  if (prev > current) return <TrendingUp size={14} className="text-green-500" />;
  return <TrendingDown size={14} className="text-red-400" />;
}

// ── Podium (top 3) ─────────────────────────────────────────────────────────────

function PodiumCard({
  rank,
  position,
  large,
}: {
  rank: ApiProviderRank;
  position: 1 | 2 | 3;
  large?: boolean;
}) {
  const colors = [
    "from-amber-400 to-yellow-300",
    "from-slate-300 to-slate-200",
    "from-amber-700 to-amber-500",
  ];
  const medalIcons = ["🥇", "🥈", "🥉"];
  const ordinals = ["1er", "2ème", "3ème"];
  const heightClass = large ? "pt-10" : "pt-4";

  const profileUrl = rank.provider_profile_id
    ? rank.provider_kind === "AGENCY"
      ? ROUTES.AGENCY_PROFILE.replace(":id", String(rank.provider_profile_id))
      : ROUTES.FREELANCER_PROFILE.replace(":id", String(rank.provider_profile_id))
    : "#";

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: (position - 1) * 0.1 }}
      className={`flex flex-col items-center ${heightClass}`}
    >
      <Link
        to={profileUrl}
        className="flex flex-col items-center gap-2 group"
      >
        <div
          className={`relative w-16 h-16 rounded-2xl bg-gradient-to-br ${colors[position - 1]} flex items-center justify-center text-white font-bold text-lg shadow-md group-hover:scale-105 transition-transform overflow-hidden`}
        >
          {rank.profile_picture ? (
            <img src={rank.profile_picture} alt={rank.provider_username} className="w-full h-full object-cover" />
          ) : (
            getInitials(rank.provider_username)
          )}
          <span className="absolute -top-3 -right-2 text-xl leading-none">
            {medalIcons[position - 1]}
          </span>
        </div>
        <span className="text-sm font-semibold text-white group-hover:underline text-center max-w-[90px] truncate">
          {rank.provider_username}
        </span>
      </Link>
      <div className="mt-1 flex flex-col items-center gap-1">
        <StarsBadge count={rank.stars} />
        <span className="text-white/70 text-xs font-medium">
          {Math.round(parseFloat(rank.score)).toLocaleString("fr-FR")} pts
        </span>
      </div>
      {/* Podium step */}
      <div
        className={`mt-3 w-24 rounded-t-lg flex items-center justify-center font-bold text-white text-sm ${
          position === 1
            ? "h-16 bg-white/25"
            : position === 2
            ? "h-12 bg-white/15"
            : "h-8 bg-white/10"
        }`}
      >
        {ordinals[position - 1]}
      </div>
    </motion.div>
  );
}

// ── Ranking Row ────────────────────────────────────────────────────────────────

function RankingRow({ rank, index }: { rank: ApiProviderRank; index: number }) {
  const tierClass = TIER_COLORS[rank.tier] ?? TIER_COLORS.FREE;
  const tierLabel = TIER_LABELS[rank.tier] ?? rank.tier;
  const profileUrl = rank.provider_profile_id
    ? rank.provider_kind === "AGENCY"
      ? ROUTES.AGENCY_PROFILE.replace(":id", String(rank.provider_profile_id))
      : ROUTES.FREELANCER_PROFILE.replace(":id", String(rank.provider_profile_id))
    : "#";

  return (
    <motion.tr
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.25, delay: Math.min(index * 0.02, 0.3) }}
      className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors"
    >
      {/* Position */}
      <td className="py-4 pl-4 pr-3 w-14 text-center">
        <span className="text-base font-bold text-foreground/60">{rank.position}</span>
      </td>

      {/* Avatar + name */}
      <td className="py-4 pr-4">
        <Link
          to={profileUrl}
          className="flex items-center gap-3 group"
        >
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center font-bold text-primary text-sm flex-shrink-0 group-hover:bg-primary group-hover:text-white transition-colors overflow-hidden">
            {rank.profile_picture ? (
              <img src={rank.profile_picture} alt={rank.provider_username} className="w-full h-full object-cover" />
            ) : (
              getInitials(rank.provider_username)
            )}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold group-hover:text-primary transition-colors truncate">
              {rank.provider_username}
            </p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full ${tierClass}`}>
                {tierLabel}
              </span>
              <StarsBadge count={rank.stars} />
            </div>
          </div>
        </Link>
      </td>

      {/* Score */}
      <td className="py-4 pr-4 text-right">
        <span className="text-sm font-bold text-foreground">
          {Math.round(parseFloat(rank.score)).toLocaleString("fr-FR")}
        </span>
        <span className="text-xs text-muted-foreground ml-1">pts</span>
      </td>

      {/* Trend placeholder — API doesn't return prev position, so always neutral */}
      <td className="py-4 pr-4 text-center hidden sm:table-cell">
        <TrendIcon current={rank.position} />
      </td>
    </motion.tr>
  );
}

// ── Info Panel ─────────────────────────────────────────────────────────────────

function RankInfoPanel() {
  const criteria = [
    "Vos évaluations clients",
    "Votre niveau d'abonnement",
    "Votre chiffre d'affaires sur la plateforme",
    "Les missions réalisées récemment",
    "La complétion de votre profil",
  ];

  return (
    <div className="bg-white border border-border rounded-2xl p-5 shadow-sm sticky top-24">
      <div className="flex items-center gap-2 mb-3">
        <Award size={18} className="text-amber-500" />
        <h3 className="font-semibold text-sm">Boostez votre classement</h3>
      </div>
      <p className="text-xs text-muted-foreground mb-4 leading-relaxed">
        Votre classement détermine votre visibilité sur FreeJobGN. Un bon
        classement vous aide à attirer plus de projets !
      </p>
      <div className="flex items-center gap-1.5 mb-3">
        <Info size={13} className="text-primary" />
        <span className="text-xs font-semibold text-primary">Critères clés</span>
      </div>
      <ul className="space-y-2">
        {criteria.map((c) => (
          <li key={c} className="flex items-start gap-2 text-xs text-foreground/70">
            <Star size={11} className="fill-amber-400 text-amber-400 flex-shrink-0 mt-0.5" />
            {c}
          </li>
        ))}
      </ul>
      <Link
        to={ROUTES.DASHBOARD.SUBSCRIPTION}
        className="mt-5 block text-center w-full py-2.5 rounded-full bg-primary text-white text-xs font-semibold hover:bg-primary/90 transition-colors"
      >
        En savoir plus
      </Link>
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────────

const Rankings = () => {
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<RankingFilters>({ ordering: "-score" });

  const { data, isLoading } = useRankings({ ...filters, page });

  const results = data?.results ?? [];
  const totalCount = data?.count ?? 0;
  const pageSize = 10;
  const totalPages = Math.ceil(totalCount / pageSize);

  const top3 = results.filter((r) => r.position <= 3).sort((a, b) => a.position - b.position);
  const listItems = page === 1 ? results.filter((r) => r.position > 3) : results;

  const podiumOrder: (1 | 2 | 3)[] = [2, 1, 3];
  const podiumRanks = podiumOrder.map((pos) => top3.find((r) => r.position === pos)).filter(Boolean) as ApiProviderRank[];

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-muted/30 pt-16">
        {/* Hero / podium section */}
        <section className="bg-gradient-to-br from-primary to-primary/80 py-12 px-4">
          <div className="container mx-auto max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: -16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="text-center mb-8"
            >
              <div className="inline-flex items-center gap-2 bg-white/15 rounded-full px-4 py-1.5 text-white text-xs font-semibold mb-4">
                <Trophy size={14} />
                Classement des prestataires
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-white">
                Classement FreeJobGN
              </h1>
              {data?.count != null && (
                <p className="text-white/60 text-sm mt-2">
                  Mis à jour régulièrement · {data.count} prestataires classés
                </p>
              )}
            </motion.div>

            {/* Podium */}
            {isLoading ? (
              <div className="flex justify-center gap-6 items-end h-40">
                {[2, 1, 3].map((i) => (
                  <div key={i} className="flex flex-col items-center gap-2 animate-pulse">
                    <div className="w-16 h-16 rounded-2xl bg-white/20" />
                    <div className="h-3 w-20 bg-white/10 rounded" />
                  </div>
                ))}
              </div>
            ) : podiumRanks.length >= 1 ? (
              <div className="flex justify-center gap-4 md:gap-8 items-end">
                {podiumRanks.map((rank) => (
                  <PodiumCard
                    key={rank.provider_id}
                    rank={rank}
                    position={rank.position as 1 | 2 | 3}
                    large={rank.position === 1}
                  />
                ))}
              </div>
            ) : null}
          </div>
        </section>

        {/* List + info panel */}
        <section className="container mx-auto max-w-4xl px-4 py-10">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Rankings table */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-base font-semibold">
                    Classement des prestataires
                  </h2>
                  {data && (
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Mis à jour le{" "}
                      {results[0]?.computed_at
                        ? new Date(results[0].computed_at).toLocaleDateString("fr-FR", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "—"}
                    </p>
                  )}
                </div>

                {/* Role filter */}
                <select
                  value={filters.role ?? ""}
                  onChange={(e) => {
                    setPage(1);
                    setFilters((f) => ({
                      ...f,
                      role: (e.target.value as RankingFilters["role"]) || undefined,
                    }));
                  }}
                  className="text-sm border border-border rounded-lg px-3 py-1.5 bg-white text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="">Général</option>
                  <option value="FREELANCE">Freelances</option>
                  <option value="AGENCY">Agences</option>
                </select>
              </div>

              <div className="bg-white rounded-2xl border border-border overflow-hidden shadow-sm">
                {isLoading ? (
                  <div className="space-y-0">
                    {Array.from({ length: 8 }).map((_, i) => (
                      <div key={i} className="flex items-center gap-3 px-4 py-4 border-b border-border last:border-0 animate-pulse">
                        <div className="w-8 h-4 bg-muted rounded" />
                        <div className="w-10 h-10 bg-muted rounded-xl flex-shrink-0" />
                        <div className="flex-1 space-y-1.5">
                          <div className="h-3.5 bg-muted rounded w-32" />
                          <div className="h-2.5 bg-muted rounded w-20" />
                        </div>
                        <div className="h-4 w-16 bg-muted rounded" />
                      </div>
                    ))}
                  </div>
                ) : listItems.length === 0 && page === 1 ? (
                  <p className="text-center text-muted-foreground py-16 text-sm">
                    Aucun classement disponible pour le moment.
                  </p>
                ) : (
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border bg-muted/30">
                        <th className="py-3 pl-4 pr-3 text-left text-xs font-semibold text-muted-foreground w-14">#</th>
                        <th className="py-3 pr-4 text-left text-xs font-semibold text-muted-foreground">Prestataire</th>
                        <th className="py-3 pr-4 text-right text-xs font-semibold text-muted-foreground">Score</th>
                        <th className="py-3 pr-4 text-center text-xs font-semibold text-muted-foreground hidden sm:table-cell">Évol.</th>
                      </tr>
                    </thead>
                    <tbody>
                      {listItems.map((rank, i) => (
                        <RankingRow key={rank.provider_id} rank={rank} index={i} />
                      ))}
                    </tbody>
                  </table>
                )}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-6">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="p-2 rounded-lg border border-border bg-white hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                    const pg = page <= 3 ? i + 1 : page - 2 + i;
                    if (pg < 1 || pg > totalPages) return null;
                    return (
                      <button
                        key={pg}
                        onClick={() => setPage(pg)}
                        className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${
                          pg === page
                            ? "bg-primary text-white"
                            : "border border-border bg-white hover:bg-muted text-foreground"
                        }`}
                      >
                        {pg}
                      </button>
                    );
                  })}
                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="p-2 rounded-lg border border-border bg-white hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              )}
            </div>

            {/* Info panel */}
            <div className="lg:w-64 flex-shrink-0">
              <RankInfoPanel />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default Rankings;
