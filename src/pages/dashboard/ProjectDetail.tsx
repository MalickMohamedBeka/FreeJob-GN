import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import {
  ArrowLeft,
  Loader2,
  AlertCircle,
  Tag,
  Clock,
  Calendar,
  Briefcase,
  User,
  SendHorizonal,
  CreditCard,
  Paperclip,
  FileText,
  Zap,
  CheckCircle2,
  LayoutGrid,
  TrendingUp,
  ExternalLink,
  AlertTriangle,
  Users,
  Eye,
  MousePointerClick,
  Flame,
} from "lucide-react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useProject, useProjectDocuments, useTrackInteraction } from "@/hooks/useProjects";
import { useCreateProposal } from "@/hooks/useProposals";
import { ApiError } from "@/services/api.service";
import { ROUTES } from "@/constants/routes";

// ── Helpers ───────────────────────────────────────────────────────────────────

function daysLeft(deadline: string | null): { label: string; urgent: boolean; value: number } {
  if (!deadline) return { label: "Non définie", urgent: false, value: 999 };
  const diff = Math.ceil((new Date(deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  if (diff <= 0) return { label: "Expiré", urgent: true, value: diff };
  return { label: `${diff} jour${diff > 1 ? "s" : ""}`, urgent: diff <= 7, value: diff };
}

function timeAgo(dateStr: string): string {
  const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (diff < 60) return "à l'instant";
  if (diff < 3600) return `il y a ${Math.floor(diff / 60)} min`;
  if (diff < 86400) return `il y a ${Math.floor(diff / 3600)} h`;
  if (diff < 2592000) return `il y a ${Math.floor(diff / 86400)} j`;
  return new Date(dateStr).toLocaleDateString("fr-FR");
}

function competitionInfo(count: number) {
  if (count === 0) return { label: "Soyez le premier !", color: "text-teal-600", bar: "bg-teal-500", pct: 0 };
  if (count <= 2)  return { label: "Peu de concurrence", color: "text-emerald-600", bar: "bg-emerald-500", pct: Math.round((count / 20) * 100) };
  if (count <= 7)  return { label: "Modéré", color: "text-amber-600", bar: "bg-amber-500", pct: Math.round((count / 20) * 100) };
  if (count <= 14) return { label: "Compétitif", color: "text-orange-600", bar: "bg-orange-500", pct: Math.round((count / 20) * 100) };
  return { label: "Très compétitif", color: "text-red-600", bar: "bg-red-500", pct: 100 };
}

// ── Animation variants ────────────────────────────────────────────────────────

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.38, ease: "easeOut" } },
};
const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
};

// ── Section header ────────────────────────────────────────────────────────────

function SectionHeader({ icon: Icon, title, right }: { icon: LucideIcon; title: string; right?: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2.5 mb-5">
      <span className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
        <Icon size={14} className="text-primary" />
      </span>
      <h2 className="font-semibold text-[0.95rem] text-foreground">{title}</h2>
      {right && <span className="ml-auto">{right}</span>}
    </div>
  );
}

// ── Documents ─────────────────────────────────────────────────────────────────

function ProjectDocumentsList({ projectId }: { projectId: string }) {
  const { data: docs } = useProjectDocuments(projectId);
  if (!docs || docs.length === 0) return null;
  return (
    <div className="space-y-2">
      {docs.map((doc) => (
        <a
          key={doc.id}
          href={doc.file}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 p-3.5 rounded-xl border border-border hover:border-primary/30 hover:bg-primary/3 transition-all group"
        >
          <span className="w-9 h-9 rounded-xl bg-primary/8 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/15 transition-colors">
            <FileText size={15} className="text-primary" />
          </span>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate group-hover:text-primary transition-colors">{doc.title}</p>
            <p className="text-xs text-muted-foreground">{doc.doc_type_display}</p>
          </div>
          <ExternalLink size={13} className="text-muted-foreground/50 group-hover:text-primary transition-colors flex-shrink-0" />
        </a>
      ))}
    </div>
  );
}

// ── Proposal Dialog ───────────────────────────────────────────────────────────

function SubmitProposalDialog({
  projectId, projectTitle, budgetDisplay, open, onOpenChange,
}: {
  projectId: string; projectTitle: string; budgetDisplay: string;
  open: boolean; onOpenChange: (v: boolean) => void;
}) {
  const [price, setPrice] = useState("");
  const [durationDays, setDurationDays] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [errorCode, setErrorCode] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const create = useCreateProposal();

  const reset = () => { setPrice(""); setDurationDays(""); setMessage(""); setError(""); setErrorCode(null); setSuccess(false); };
  const handleOpenChange = (v: boolean) => { if (!v) reset(); onOpenChange(v); };

  const handleSubmit = async () => {
    if (!price || !durationDays || !message.trim()) { setError("Tous les champs sont obligatoires."); setErrorCode(null); return; }
    setError(""); setErrorCode(null);
    try {
      await create.mutateAsync({ project_id: projectId, price, duration_days: parseInt(durationDays, 10), message: message.trim() });
      setSuccess(true);
      setTimeout(() => handleOpenChange(false), 1500);
    } catch (err) {
      if (err instanceof ApiError) { const code = (err.data as { code?: string })?.code ?? null; setErrorCode(code); setError(err.message); }
      else setError("Une erreur est survenue.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <SendHorizonal size={18} className="text-primary" />
            Soumettre une proposition
          </DialogTitle>
        </DialogHeader>

        {success ? (
          <div className="flex flex-col items-center py-8 gap-3">
            <div className="w-16 h-16 rounded-full bg-secondary/10 flex items-center justify-center">
              <CheckCircle2 size={32} className="text-secondary" />
            </div>
            <p className="font-semibold text-foreground text-lg">Proposition envoyée !</p>
            <p className="text-sm text-muted-foreground text-center max-w-xs">
              Le client recevra votre candidature et vous contactera si intéressé.
            </p>
          </div>
        ) : (
          <>
            <div className="p-3.5 rounded-xl bg-gradient-to-r from-primary/5 to-primary/10 border border-primary/15">
              <p className="font-medium text-sm text-foreground line-clamp-1">{projectTitle}</p>
              <p className="text-xs text-primary font-semibold mt-0.5">{budgetDisplay}</p>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="dp-price">Montant proposé (GNF) *</Label>
                  <Input id="dp-price" type="number" min="1" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="Ex: 5 000 000" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="dp-duration">Durée estimée (jours) *</Label>
                  <Input id="dp-duration" type="number" min="1" value={durationDays} onChange={(e) => setDurationDays(e.target.value)} placeholder="Ex: 30" />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="dp-message">Lettre de motivation *</Label>
                <Textarea id="dp-message" rows={5} value={message} onChange={(e) => setMessage(e.target.value)}
                  placeholder="Présentez votre expérience, pourquoi vous êtes le bon candidat et votre approche pour ce projet…" />
                <p className="text-xs text-muted-foreground text-right">{message.length} car.</p>
              </div>

              {error && (
                <div className={`rounded-xl p-3 text-sm ${
                  errorCode === "active_subscription_required" || errorCode === "proposal_quota_exhausted"
                    ? "bg-primary/5 border border-primary/20" : "bg-destructive/5 border border-destructive/20"
                }`}>
                  <p className={errorCode === "active_subscription_required" || errorCode === "proposal_quota_exhausted" ? "text-primary font-medium" : "text-destructive"}>
                    {errorCode === "proposal_quota_exhausted" ? "Quota de propositions atteint pour ce mois."
                      : errorCode === "monthly_credits_exhausted" ? "Crédits mensuels épuisés."
                      : errorCode === "annual_credits_exhausted" ? "Crédits annuels épuisés."
                      : errorCode === "monthly_credits_not_allowed" ? "Votre abonnement ne permet pas de crédits mensuels."
                      : error}
                  </p>
                  {(errorCode === "active_subscription_required" || errorCode === "proposal_quota_exhausted") && (
                    <Link to={ROUTES.DASHBOARD.SUBSCRIPTION}
                      className="mt-2 inline-flex items-center gap-1.5 text-xs font-medium text-primary underline underline-offset-2"
                      onClick={() => handleOpenChange(false)}>
                      <CreditCard size={12} />
                      {errorCode === "proposal_quota_exhausted" ? "Améliorer mon abonnement" : "Souscrire un abonnement"}
                    </Link>
                  )}
                </div>
              )}
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => handleOpenChange(false)}>Annuler</Button>
              <Button onClick={handleSubmit} disabled={create.isPending} className="gap-2 min-w-[140px]">
                {create.isPending ? <Loader2 size={16} className="animate-spin" /> : <SendHorizonal size={16} />}
                {create.isPending ? "Envoi…" : "Envoyer"}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

const DashboardProjectDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [proposalOpen, setProposalOpen] = useState(false);

  const { data: project, isLoading, isError } = useProject(id ?? "");
  const { data: docs } = useProjectDocuments(id ?? "");
  const trackInteraction = useTrackInteraction();

  const deadline = project ? daysLeft(project.deadline) : null;
  const compInfo = project ? competitionInfo(project.proposals_count) : null;
  const budgetDisplay = project
    ? project.budget_amount
      ? `${Number(project.budget_amount).toLocaleString("fr-GN")} GNF`
      : project.budget_band_display
    : "";

  return (
    <DashboardLayout userType="freelancer">
      <div className="max-w-5xl mx-auto">

        {/* ── Back button ── */}
        <button
          onClick={() => navigate(ROUTES.DASHBOARD.FIND_PROJECTS)}
          className="group inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-7"
        >
          <span className="w-7 h-7 rounded-lg border border-border bg-background shadow-sm flex items-center justify-center group-hover:border-primary/30 group-hover:bg-primary/5 transition-all">
            <ArrowLeft size={13} />
          </span>
          Retour aux projets
        </button>

        {/* ── Loading ── */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-44 gap-4">
            <span className="w-14 h-14 rounded-2xl bg-primary/8 flex items-center justify-center">
              <Loader2 className="animate-spin text-primary" size={28} />
            </span>
            <p className="text-sm text-muted-foreground">Chargement du projet…</p>
          </div>
        )}

        {/* ── Error ── */}
        {(isError || (!isLoading && !project)) && (
          <div className="flex flex-col items-center justify-center py-44 gap-5 text-center">
            <span className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center">
              <AlertCircle size={28} className="text-muted-foreground" />
            </span>
            <div>
              <p className="text-lg font-semibold text-foreground">Projet introuvable</p>
              <p className="text-sm text-muted-foreground mt-1">Ce projet n'existe pas ou n'est plus disponible.</p>
            </div>
            <Button variant="outline" onClick={() => navigate(ROUTES.DASHBOARD.FIND_PROJECTS)} className="gap-2">
              <ArrowLeft size={14} /> Retour aux projets
            </Button>
          </div>
        )}

        {/* ── Content ── */}
        {project && !isLoading && (
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="show"
            className="grid lg:grid-cols-[1fr_288px] gap-6 items-start"
          >

            {/* ════════════════ LEFT COLUMN ════════════════ */}
            <div className="space-y-5 min-w-0">

              {/* ── Hero card ── */}
              <motion.div variants={fadeUp}>
                <Card className="overflow-hidden shadow-sm border-border/70">

                  {/* Gradient header */}
                  <div className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-primary/4 to-secondary/4 p-7 pb-6">
                    {/* decorative blurs */}
                    <div className="pointer-events-none absolute -top-14 -right-14 w-52 h-52 rounded-full bg-primary/10 blur-3xl" />
                    <div className="pointer-events-none absolute -bottom-10 -left-10 w-40 h-40 rounded-full bg-secondary/8 blur-2xl" />

                    {/* Badges */}
                    <div className="relative flex flex-wrap gap-2 mb-5">
                      <Badge className="bg-secondary/15 text-secondary border-0 font-semibold text-xs py-0.5">
                        <Zap size={9} className="mr-1.5" />{project.status_display}
                      </Badge>
                      {project.category && (
                        <Badge variant="outline" className="text-xs font-medium bg-white/50 backdrop-blur-sm">
                          <LayoutGrid size={9} className="mr-1.5" />{project.category.name}
                        </Badge>
                      )}
                      {deadline?.urgent && deadline.value > 0 && (
                        <Badge className="bg-orange-50 text-orange-700 border border-orange-200 text-xs font-semibold">
                          <Flame size={9} className="mr-1.5" />Urgent
                        </Badge>
                      )}
                      {deadline && deadline.value <= 0 && project.deadline && (
                        <Badge className="bg-red-50 text-red-700 border border-red-200 text-xs font-semibold">
                          <AlertTriangle size={9} className="mr-1.5" />Expiré
                        </Badge>
                      )}
                    </div>

                    {/* Title */}
                    <h1 className="relative text-2xl sm:text-[1.75rem] font-bold text-foreground leading-tight mb-5 max-w-xl">
                      {project.title}
                    </h1>

                    {/* Meta */}
                    <div className="relative flex flex-wrap items-center gap-x-5 gap-y-2">
                      <span className="flex items-center gap-2 text-sm font-semibold text-foreground">
                        <span className="w-6 h-6 rounded-full bg-primary/15 flex items-center justify-center flex-shrink-0">
                          <User size={11} className="text-primary" />
                        </span>
                        {project.client.username}
                      </span>
                      <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Calendar size={11} />Publié {timeAgo(project.created_at)}
                      </span>
                      {project.updated_at !== project.created_at && (
                        <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <TrendingUp size={11} />Mis à jour {timeAgo(project.updated_at)}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* ── Stats bar — 4 columns with dividers ── */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-y sm:divide-y-0 divide-border/50">

                    {/* Budget */}
                    <div className="p-4 sm:p-5">
                      <p className="flex items-center gap-1.5 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                        <Tag size={10} className="text-primary" />Budget
                      </p>
                      <p className="font-bold text-foreground text-[0.95rem] leading-tight">{budgetDisplay}</p>
                      {project.budget_band_display && project.budget_amount && (
                        <p className="text-xs text-muted-foreground mt-0.5">{project.budget_band_display}</p>
                      )}
                    </div>

                    {/* Délai */}
                    <div className={`p-4 sm:p-5 ${deadline?.urgent && deadline.value > 0 ? "bg-orange-50/60" : ""}`}>
                      <p className="flex items-center gap-1.5 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                        <Clock size={10} className={deadline?.urgent ? "text-orange-500" : "text-primary"} />Délai
                      </p>
                      <p className={`font-bold text-[0.95rem] leading-tight ${deadline?.urgent ? "text-orange-600" : "text-foreground"}`}>
                        {deadline?.label}
                      </p>
                      {project.deadline && (
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {new Date(project.deadline).toLocaleDateString("fr-FR")}
                        </p>
                      )}
                    </div>

                    {/* Spécialité */}
                    <div className="p-4 sm:p-5">
                      <p className="flex items-center gap-1.5 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                        <Briefcase size={10} className="text-primary" />Spécialité
                      </p>
                      <p className="font-bold text-foreground text-[0.95rem] leading-tight">{project.speciality?.name ?? "—"}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{project.category?.name ?? "—"}</p>
                    </div>

                    {/* Candidats */}
                    <div className="p-4 sm:p-5">
                      <p className="flex items-center gap-1.5 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                        <Users size={10} className="text-secondary" />Candidats
                      </p>
                      <p className={`font-bold text-[0.95rem] leading-tight ${project.proposals_count > 0 ? compInfo?.color : "text-foreground"}`}>
                        {project.proposals_count}
                      </p>
                      <p className={`text-xs mt-0.5 ${compInfo?.color ?? "text-muted-foreground"}`}>{compInfo?.label}</p>
                    </div>
                  </div>
                </Card>
              </motion.div>

              {/* ── Description ── */}
              <motion.div variants={fadeUp}>
                <Card className="p-6 shadow-sm border-border/70">
                  <SectionHeader icon={Briefcase} title="Description du projet" />
                  <div className="text-[0.9rem] text-muted-foreground leading-[1.8] whitespace-pre-line">
                    {project.description}
                  </div>
                </Card>
              </motion.div>

              {/* ── Compétences ── */}
              {(project.skills?.length > 0 || project.speciality) && (
                <motion.div variants={fadeUp}>
                  <Card className="p-6 shadow-sm border-border/70">
                    <SectionHeader icon={CheckCircle2} title="Compétences recherchées" />
                    <div className="flex flex-wrap gap-2">
                      {project.speciality && (
                        <span className="inline-flex items-center px-3.5 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-semibold border border-primary/15">
                          {project.speciality.name}
                        </span>
                      )}
                      {project.skills?.map((sk) => (
                        <span key={sk.id} className="inline-flex items-center px-3.5 py-1.5 rounded-full bg-muted text-foreground text-sm font-medium border border-border hover:border-primary/30 transition-colors">
                          {sk.name}
                        </span>
                      ))}
                    </div>
                  </Card>
                </motion.div>
              )}

              {/* ── Documents ── */}
              {docs && docs.length > 0 && (
                <motion.div variants={fadeUp}>
                  <Card className="p-6 shadow-sm border-border/70">
                    <SectionHeader
                      icon={Paperclip}
                      title="Documents joints"
                      right={
                        <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-muted text-muted-foreground border border-border">
                          {docs.length}
                        </span>
                      }
                    />
                    <ProjectDocumentsList projectId={project.id} />
                  </Card>
                </motion.div>
              )}
            </div>

            {/* ════════════════ SIDEBAR ════════════════ */}
            <div className="space-y-4 lg:sticky lg:top-6">

              {/* ── CTA card ── */}
              <motion.div variants={fadeUp}>
                <Card className="overflow-hidden shadow-sm border-primary/15">
                  <div className="bg-gradient-to-br from-primary/8 via-primary/4 to-transparent p-5 border-b border-primary/10">
                    <p className="text-xs text-muted-foreground mb-0.5">Projet</p>
                    <p className="font-semibold text-sm text-foreground leading-snug line-clamp-2 mb-1">{project.title}</p>
                    <p className="font-bold text-primary">{budgetDisplay}</p>
                  </div>
                  <div className="p-4 space-y-2.5">
                    <Button
                      onClick={() => { if (id) trackInteraction.mutate(id); setProposalOpen(true); }}
                      className="w-full gap-2 h-11 font-semibold text-[0.9rem] shadow-sm"
                    >
                      <SendHorizonal size={16} />
                      Postuler maintenant
                    </Button>
                    <p className="text-center text-xs text-muted-foreground">
                      Réponse généralement sous 48 h
                    </p>
                  </div>
                </Card>
              </motion.div>

              {/* ── Compétition card ── */}
              <motion.div variants={fadeUp}>
                <Card className="p-5 shadow-sm border-border/70">
                  <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-4">
                    Compétition
                  </p>

                  {project.proposals_count === 0 ? (
                    <div className="text-center py-1">
                      <span className="w-11 h-11 rounded-full bg-teal-50 flex items-center justify-center mx-auto mb-3">
                        <CheckCircle2 size={20} className="text-teal-500" />
                      </span>
                      <p className="font-semibold text-sm text-teal-600">Soyez le premier !</p>
                      <p className="text-xs text-muted-foreground mt-1">Aucune candidature pour l'instant.</p>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-end gap-2 mb-3">
                        <span className={`text-4xl font-black leading-none ${compInfo?.color}`}>
                          {project.proposals_count}
                        </span>
                        <span className="text-sm text-muted-foreground pb-0.5">
                          candidat{project.proposals_count > 1 ? "s" : ""}
                        </span>
                      </div>
                      <div className="h-2 rounded-full bg-muted overflow-hidden mb-2.5">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${compInfo?.pct ?? 0}%` }}
                          transition={{ duration: 0.9, ease: "easeOut", delay: 0.35 }}
                          className={`h-full rounded-full ${compInfo?.bar}`}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className={`text-xs font-semibold ${compInfo?.color}`}>{compInfo?.label}</span>
                        <span className="text-xs text-muted-foreground">/ 20 max</span>
                      </div>
                    </>
                  )}
                </Card>
              </motion.div>

              {/* ── Activité card ── */}
              <motion.div variants={fadeUp}>
                <Card className="p-5 shadow-sm border-border/70">
                  <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-4">
                    Activité
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-xl bg-muted/40 border border-border/50 p-4 flex flex-col items-center gap-1.5">
                      <span className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Eye size={16} className="text-primary" />
                      </span>
                      <p className="font-black text-2xl text-foreground leading-none">{project.views_count}</p>
                      <p className="text-xs text-muted-foreground">vue{project.views_count !== 1 ? "s" : ""}</p>
                    </div>
                    <div className="rounded-xl bg-muted/40 border border-border/50 p-4 flex flex-col items-center gap-1.5">
                      <span className="w-9 h-9 rounded-lg bg-secondary/10 flex items-center justify-center">
                        <MousePointerClick size={16} className="text-secondary" />
                      </span>
                      <p className="font-black text-2xl text-foreground leading-none">{project.interactions_count}</p>
                      <p className="text-xs text-muted-foreground">intéressé{project.interactions_count !== 1 ? "s" : ""}</p>
                    </div>
                  </div>
                </Card>
              </motion.div>

              {/* ── Résumé card ── */}
              <motion.div variants={fadeUp}>
                <Card className="p-5 shadow-sm border-border/70">
                  <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-4">
                    Résumé
                  </p>
                  <div>
                    {(
                      [
                        { icon: Tag,        label: "Budget",      value: budgetDisplay,  cls: "text-primary font-semibold" },
                        { icon: Clock,      label: "Délai restant", value: deadline?.label ?? "—", cls: deadline?.urgent ? "text-orange-600 font-semibold" : "" },
                        { icon: Calendar,   label: "Date limite", value: project.deadline ? new Date(project.deadline).toLocaleDateString("fr-FR") : "Non définie", cls: "" },
                        { icon: User,       label: "Client",      value: project.client.username, cls: "" },
                        { icon: LayoutGrid, label: "Catégorie",   value: project.category?.name ?? "—", cls: "" },
                        { icon: Briefcase,  label: "Spécialité",  value: project.speciality?.name ?? "—", cls: "" },
                        { icon: Calendar,   label: "Publié le",   value: new Date(project.created_at).toLocaleDateString("fr-FR"), cls: "" },
                      ] as { icon: LucideIcon; label: string; value: string; cls: string }[]
                    ).map(({ icon: Icon, label, value, cls }) => (
                      <div key={label} className="flex items-center justify-between gap-3 py-2.5 border-b border-border/40 last:border-0">
                        <span className="flex items-center gap-1.5 text-xs text-muted-foreground flex-shrink-0 min-w-0">
                          <Icon size={11} className="flex-shrink-0" />{label}
                        </span>
                        <p className={`text-xs text-right truncate max-w-[120px] ${cls || "text-foreground font-medium"}`}>{value}</p>
                      </div>
                    ))}
                  </div>
                </Card>
              </motion.div>

              {/* ── Compétences mini ── */}
              {project.skills && project.skills.length > 0 && (
                <motion.div variants={fadeUp}>
                  <Card className="p-5 shadow-sm border-border/70">
                    <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-3">
                      Compétences
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {project.skills.map((sk) => (
                        <span key={sk.id} className="text-xs px-2.5 py-1 rounded-full bg-muted text-foreground border border-border font-medium">
                          {sk.name}
                        </span>
                      ))}
                    </div>
                  </Card>
                </motion.div>
              )}
            </div>

          </motion.div>
        )}
      </div>

      {project && (
        <SubmitProposalDialog
          projectId={project.id}
          projectTitle={project.title}
          budgetDisplay={budgetDisplay}
          open={proposalOpen}
          onOpenChange={setProposalOpen}
        />
      )}
    </DashboardLayout>
  );
};

export default DashboardProjectDetail;
