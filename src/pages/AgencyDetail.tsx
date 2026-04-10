import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  MapPin, ArrowLeft, Loader2, AlertCircle, Building2, Phone, Mail,
  Globe, CalendarDays, Heart, MoreVertical, Flag, CheckCircle2,
} from "lucide-react";
import { motion } from "framer-motion";
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
import { useAgency } from "@/hooks/useAgency";
import { useFavorites, useAddFavorite, useRemoveFavorite, useReportUser } from "@/hooks/useProfile";
import { useAuth } from "@/contexts/AuthContext";

// ── Report reasons ─────────────────────────────────────────────────────────────

const REPORT_REASONS = [
  { value: "SPAM", label: "Spam ou contenu indésirable" },
  { value: "FRAUD", label: "Fraude ou arnaque" },
  { value: "INAPPROPRIATE", label: "Comportement inapproprié" },
  { value: "OTHER", label: "Autre" },
] as const;

type ReportReason = (typeof REPORT_REASONS)[number]["value"];

// ── Report Dialog ──────────────────────────────────────────────────────────────

function ReportDialog({
  open,
  onClose,
  agencyName,
  agencyId,
}: {
  open: boolean;
  onClose: () => void;
  agencyName: string;
  agencyId: number;
}) {
  const [reason, setReason] = useState<ReportReason>("SPAM");
  const [details, setDetails] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const reportUser = useReportUser();

  const reset = () => { setReason("SPAM"); setDetails(""); setConfirmed(false); };

  const handleSubmit = () => {
    reportUser.mutate(
      { userId: agencyId, reason, details: details.trim() || undefined },
      { onSuccess: () => { setConfirmed(true); } },
    );
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) { reset(); onClose(); } }}>
      <DialogContent>
        {confirmed ? (
          <div className="py-8 text-center space-y-3">
            <CheckCircle2 className="mx-auto text-green-500" size={40} />
            <h3 className="text-lg font-semibold">Signalement envoyé</h3>
            <p className="text-sm text-muted-foreground">
              Merci. Notre équipe va examiner votre signalement concernant <strong>{agencyName}</strong>.
            </p>
            <Button onClick={() => { reset(); onClose(); }}>Fermer</Button>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Flag size={16} className="text-destructive" />
                Signaler cette agence
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <p className="text-sm text-muted-foreground">
                Vous signalez : <strong>{agencyName}</strong>
              </p>
              <div className="space-y-2">
                <Label>Raison</Label>
                <Select value={reason} onValueChange={(v) => setReason(v as ReportReason)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {REPORT_REASONS.map((r) => (
                      <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Détails (optionnel)</Label>
                <Textarea
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  placeholder="Décrivez le problème…"
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => { reset(); onClose(); }}>Annuler</Button>
              <Button
                variant="destructive"
                onClick={handleSubmit}
                disabled={reportUser.isPending}
              >
                {reportUser.isPending ? <Loader2 size={14} className="animate-spin mr-1.5" /> : null}
                Signaler
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────────

export default function AgencyDetail() {
  const { id } = useParams<{ id: string }>();
  const agencyId = id ? Number(id) : undefined;

  const { user, isAuthenticated } = useAuth();
  const { data: agency, isLoading, isError } = useAgency(agencyId);
  const { data: favoritesData } = useFavorites(isAuthenticated && user?.role === "CLIENT");
  const addFavorite = useAddFavorite();
  const removeFavorite = useRemoveFavorite();

  const [reportOpen, setReportOpen] = useState(false);

  const favorites = favoritesData?.results ?? [];
  const isFavorite = agencyId ? favorites.some((f) => f.provider_id === agencyId) : false;
  const favEntry = favorites.find((f) => f.provider_id === agencyId);
  const favPending = addFavorite.isPending || removeFavorite.isPending;

  const isOwner = user?.id === agencyId;
  const canReport = isAuthenticated && !isOwner;
  const canFavorite = isAuthenticated && user?.role === "CLIENT";

  const toggleFavorite = () => {
    if (!agencyId) return;
    if (isFavorite && favEntry) {
      removeFavorite.mutate(agencyId);
    } else {
      addFavorite.mutate(agencyId);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-muted/30">
        <Navbar />
        <main className="pt-16 flex items-center justify-center min-h-[60vh]">
          <Loader2 className="animate-spin text-secondary" size={36} />
        </main>
        <Footer />
      </div>
    );
  }

  if (isError || !agency) {
    return (
      <div className="min-h-screen bg-muted/30">
        <Navbar />
        <main className="pt-16 container mx-auto px-4 py-20 text-center">
          <AlertCircle className="mx-auto mb-4 text-muted-foreground" size={48} />
          <h2 className="text-xl font-bold mb-2">Agence introuvable</h2>
          <p className="text-muted-foreground mb-6">Cette agence n'existe pas ou n'est plus disponible.</p>
          <Link to="/agencies">
            <Button variant="outline" className="gap-2"><ArrowLeft size={16} />Retour aux agences</Button>
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  const agencyName = agency.agency_details?.agency_name || agency.username;
  const location = [agency.city_or_region, agency.country].filter(Boolean).join(", ");
  const initial = agencyName.charAt(0).toUpperCase();

  return (
    <div className="min-h-screen bg-muted/30">
      <Navbar />
      <main className="pt-16">
        {/* Back */}
        <div className="container mx-auto px-4 py-4">
          <Link to="/agencies" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft size={16} />
            Retour aux agences
          </Link>
        </div>

        <div className="container mx-auto px-4 pb-16 max-w-5xl">
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Left sidebar */}
            <div className="space-y-4">
              {/* Profile card */}
              <motion.div initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }}>
                <Card className="p-6">
                  <div className="flex flex-col items-center text-center gap-3">
                    {/* Avatar */}
                    {agency.profile_picture ? (
                      <img
                        src={agency.profile_picture}
                        alt={agencyName}
                        className="w-24 h-24 rounded-2xl object-cover border-4 border-background shadow-md"
                      />
                    ) : (
                      <div className="w-24 h-24 rounded-2xl bg-secondary/10 flex items-center justify-center text-3xl font-bold text-secondary">
                        {initial}
                      </div>
                    )}

                    <div>
                      <h1 className="text-xl font-bold">{agencyName}</h1>
                      {location && (
                        <p className="text-sm text-muted-foreground flex items-center justify-center gap-1.5 mt-1">
                          <MapPin size={13} />{location}
                        </p>
                      )}
                    </div>

                    {/* Type badge */}
                    <Badge className="bg-secondary/10 text-secondary border-secondary/20">
                      <Building2 size={12} className="mr-1" />
                      Agence
                    </Badge>

                    {/* Actions */}
                    <div className="flex gap-2 w-full mt-1">
                      {canFavorite && (
                        <Button
                          variant={isFavorite ? "default" : "outline"}
                          size="sm"
                          className={`flex-1 gap-1.5 ${isFavorite ? "bg-red-500 hover:bg-red-600 border-red-500" : ""}`}
                          onClick={toggleFavorite}
                          disabled={favPending}
                        >
                          <Heart size={14} className={isFavorite ? "fill-white" : ""} />
                          {isFavorite ? "Favori" : "Ajouter"}
                        </Button>
                      )}

                      {canReport && (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm" className="gap-1">
                              <MoreVertical size={14} />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              className="text-destructive focus:text-destructive gap-2 cursor-pointer"
                              onClick={() => setReportOpen(true)}
                            >
                              <Flag size={14} />
                              Signaler cette agence
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </div>
                  </div>

                  {/* Info list */}
                  <div className="mt-5 space-y-2.5">
                    {agency.agency_details?.founded_at && (
                      <div className="flex items-center gap-2.5 text-sm text-muted-foreground">
                        <CalendarDays size={14} className="flex-shrink-0" />
                        <span>Fondée le {new Date(agency.agency_details.founded_at).toLocaleDateString("fr-FR")}</span>
                      </div>
                    )}
                    {agency.phone && (
                      <div className="flex items-center gap-2.5 text-sm text-muted-foreground">
                        <Phone size={14} className="flex-shrink-0" />
                        <span>{agency.phone}</span>
                      </div>
                    )}
                    {agency.email && (
                      <div className="flex items-center gap-2.5 text-sm text-muted-foreground">
                        <Mail size={14} className="flex-shrink-0" />
                        <span className="truncate">{agency.email}</span>
                      </div>
                    )}
                    {agency.hourly_rate && (
                      <div className="flex items-center gap-2.5 text-sm text-muted-foreground">
                        <Globe size={14} className="flex-shrink-0" />
                        <span>{parseFloat(agency.hourly_rate).toLocaleString("fr-FR")} GNF/h</span>
                      </div>
                    )}
                  </div>
                </Card>
              </motion.div>

              {/* Skills */}
              {agency.skills && agency.skills.length > 0 && (
                <motion.div initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
                  <Card className="p-5">
                    <h2 className="font-semibold text-sm mb-3">Compétences</h2>
                    <div className="flex flex-wrap gap-2">
                      {agency.skills.map((s) => (
                        <Badge key={s.id} variant="secondary" className="text-xs">{s.name}</Badge>
                      ))}
                    </div>
                  </Card>
                </motion.div>
              )}
            </div>

            {/* Main content */}
            <div className="lg:col-span-2 space-y-5">
              {/* About */}
              {agency.bio && (
                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
                  <Card className="p-6">
                    <h2 className="font-semibold text-base mb-3 flex items-center gap-2">
                      <Building2 size={17} className="text-secondary" />
                      À propos de l'agence
                    </h2>
                    <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                      {agency.bio}
                    </p>
                  </Card>
                </motion.div>
              )}

              {/* Speciality */}
              {agency.speciality && (
                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                  <Card className="p-5">
                    <h2 className="font-semibold text-sm mb-3">Spécialité</h2>
                    <Badge className="bg-secondary/10 text-secondary border-secondary/20">
                      {agency.speciality.name}
                    </Badge>
                    {agency.speciality.description && (
                      <p className="text-sm text-muted-foreground mt-3">{agency.speciality.description}</p>
                    )}
                  </Card>
                </motion.div>
              )}

              {/* CTA for clients */}
              {!isAuthenticated && (
                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                  <Card className="p-6 bg-gradient-to-br from-secondary/5 to-background border-secondary/20">
                    <h3 className="font-semibold mb-2">Travailler avec cette agence ?</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Créez un compte client pour publier votre projet et contacter cette agence.
                    </p>
                    <Link to="/signup">
                      <Button className="bg-secondary hover:bg-secondary/90">Créer un compte</Button>
                    </Link>
                  </Card>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />

      {agencyId && (
        <ReportDialog
          open={reportOpen}
          onClose={() => setReportOpen(false)}
          agencyName={agencyName}
          agencyId={agencyId}
        />
      )}
    </div>
  );
}
