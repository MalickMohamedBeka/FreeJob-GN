import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
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

// ── Helpers ──────────────────────────────────────────────────────────────────

function daysLeft(deadline: string | null): { label: string; urgent: boolean; value: number } {
  if (!deadline) return { label: "Non définie", urgent: false, value: 999 };
  const diff = Math.ceil(
    (new Date(deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  );
  if (diff <= 0) return { label: "Expiré", urgent: true, value: diff };
  return {
    label: `${diff} jour${diff > 1 ? "s" : ""}`,
    urgent: diff <= 7,
    value: diff,
  };
}

function timeAgo(dateStr: string): string {
  const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (diff < 60) return "à l'instant";
  if (diff < 3600) return `il y a ${Math.floor(diff / 60)} min`;
  if (diff < 86400) return `il y a ${Math.floor(diff / 3600)} h`;
  if (diff < 2592000) return `il y a ${Math.floor(diff / 86400)} j`;
  return new Date(dateStr).toLocaleDateString("fr-FR");
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
          className="flex items-center gap-2.5 p-3 rounded-lg border border-border hover:border-primary/40 hover:bg-primary/5 transition-all group"
        >
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
            <FileText size={14} className="text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate group-hover:text-primary transition-colors">
              {doc.title}
            </p>
            <p className="text-xs text-muted-foreground">{doc.doc_type_display}</p>
          </div>
          <ExternalLink size={13} className="text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
        </a>
      ))}
    </div>
  );
}

// ── Proposal Dialog ───────────────────────────────────────────────────────────

function SubmitProposalDialog({
  projectId,
  projectTitle,
  budgetDisplay,
  open,
  onOpenChange,
}: {
  projectId: string;
  projectTitle: string;
  budgetDisplay: string;
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const [price, setPrice] = useState("");
  const [durationDays, setDurationDays] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [errorCode, setErrorCode] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const create = useCreateProposal();

  const reset = () => {
    setPrice(""); setDurationDays(""); setMessage("");
    setError(""); setErrorCode(null); setSuccess(false);
  };

  const handleOpenChange = (v: boolean) => {
    if (!v) reset();
    onOpenChange(v);
  };

  const handleSubmit = async () => {
    if (!price || !durationDays || !message.trim()) {
      setError("Tous les champs sont obligatoires."); setErrorCode(null); return;
    }
    setError(""); setErrorCode(null);
    try {
      await create.mutateAsync({
        project_id: projectId,
        price,
        duration_days: parseInt(durationDays, 10),
        message: message.trim(),
      });
      setSuccess(true);
      setTimeout(() => handleOpenChange(false), 1500);
    } catch (err) {
      if (err instanceof ApiError) {
        const code = (err.data as { code?: string })?.code ?? null;
        setErrorCode(code); setError(err.message);
      } else {
        setError("Une erreur est survenue.");
      }
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
          <div className="flex flex-col items-center py-6 gap-3">
            <div className="w-14 h-14 rounded-full bg-secondary/10 flex items-center justify-center">
              <CheckCircle2 size={28} className="text-secondary" />
            </div>
            <p className="font-semibold text-foreground">Proposition envoyée !</p>
            <p className="text-sm text-muted-foreground text-center">
              Le client recevra votre candidature et vous contactera si intéressé.
            </p>
          </div>
        ) : (
          <>
            <div className="p-3 rounded-xl bg-gradient-to-r from-primary/5 to-primary/10 border border-primary/15 mb-1">
              <p className="font-medium text-sm text-foreground line-clamp-2">{projectTitle}</p>
              <p className="text-xs text-primary font-medium mt-0.5">{budgetDisplay}</p>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="dp-price">Montant proposé (GNF) *</Label>
                  <Input id="dp-price" type="number" min="1" value={price}
                    onChange={(e) => setPrice(e.target.value)} placeholder="Ex: 5 000 000" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="dp-duration">Durée estimée (jours) *</Label>
                  <Input id="dp-duration" type="number" min="1" value={durationDays}
                    onChange={(e) => setDurationDays(e.target.value)} placeholder="Ex: 30" />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="dp-message">Lettre de motivation *</Label>
                <Textarea id="dp-message" rows={5} value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Présentez votre expérience, pourquoi vous êtes le bon candidat et votre approche pour ce projet…" />
                <p className="text-xs text-muted-foreground text-right">{message.length} caractères</p>
              </div>

              {error && (
                <div className={`rounded-xl p-3 text-sm ${
                  errorCode === "active_subscription_required" || errorCode === "proposal_quota_exhausted"
                    ? "bg-primary/5 border border-primary/20"
                    : "bg-destructive/5 border border-destructive/20"
                }`}>
                  <p className={errorCode === "active_subscription_required" || errorCode === "proposal_quota_exhausted"
                    ? "text-primary font-medium" : "text-destructive"}>
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
  const budgetDisplay = project
    ? project.budget_amount
      ? `${Number(project.budget_amount).toLocaleString("fr-GN")} GNF`
      : project.budget_band_display
    : "";

  return (
    <DashboardLayout userType="freelancer">
      <div className="max-w-5xl mx-auto">
        {/* Back */}
        <button
          onClick={() => navigate(ROUTES.DASHBOARD.FIND_PROJECTS)}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft size={15} />
          Retour aux projets
        </button>

        {/* Loading */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-32 gap-3">
            <Loader2 className="animate-spin text-primary" size={36} />
            <p className="text-sm text-muted-foreground">Chargement du projet…</p>
          </div>
        )}

        {/* Error */}
        {(isError || (!isLoading && !project)) && (
          <div className="text-center py-32">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
              <AlertCircle size={28} className="text-muted-foreground" />
            </div>
            <p className="text-lg font-semibold">Projet introuvable</p>
            <p className="text-sm text-muted-foreground mt-1 mb-6">
              Ce projet n'existe pas ou n'est plus disponible.
            </p>
            <Button variant="outline" onClick={() => navigate(ROUTES.DASHBOARD.FIND_PROJECTS)}>
              <ArrowLeft size={14} />
              Retour aux projets
            </Button>
          </div>
        )}

        {project && !isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="grid lg:grid-cols-[1fr_320px] gap-6 items-start"
          >
            {/* ── Colonne principale ── */}
            <div className="space-y-5 min-w-0">

              {/* Hero card */}
              <Card className="overflow-hidden">
                <div className="bg-gradient-to-br from-primary/8 via-primary/4 to-transparent p-6 pb-5">
                  <div className="flex flex-wrap gap-2 mb-3">
                    <Badge className="bg-secondary/15 text-secondary border-0 font-medium">
                      <Zap size={10} className="mr-1" />
                      {project.status_display}
                    </Badge>
                    {project.category && (
                      <Badge variant="outline" className="text-xs font-medium">
                        <LayoutGrid size={10} className="mr-1" />
                        {project.category.name}
                      </Badge>
                    )}
                    {deadline?.urgent && (
                      <Badge className="bg-orange-500/10 text-orange-600 border border-orange-200 text-xs">
                        <AlertTriangle size={10} className="mr-1" />
                        Urgent
                      </Badge>
                    )}
                  </div>

                  <h1 className="text-2xl font-bold text-foreground leading-snug mb-3">
                    {project.title}
                  </h1>

                  <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      <User size={13} />
                      <span className="font-medium text-foreground">{project.client.username}</span>
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Calendar size={13} />
                      Publié {timeAgo(project.created_at)}
                    </span>
                    {project.updated_at !== project.created_at && (
                      <span className="flex items-center gap-1.5">
                        <TrendingUp size={13} />
                        Mis à jour {timeAgo(project.updated_at)}
                      </span>
                    )}
                  </div>
                </div>

                {/* Metrics bar */}
                <div className="px-6 pb-6">
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4">
                    <div className="bg-muted/40 rounded-xl p-3.5 border border-border/50">
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1.5">
                        <Tag size={11} className="text-primary" /> Budget
                      </div>
                      <p className="font-bold text-foreground">{budgetDisplay}</p>
                      {project.budget_band_display && project.budget_amount && (
                        <p className="text-xs text-muted-foreground mt-0.5">{project.budget_band_display}</p>
                      )}
                    </div>

                    <div className={`rounded-xl p-3.5 border ${
                      deadline?.urgent
                        ? "bg-orange-50 border-orange-200"
                        : "bg-muted/40 border-border/50"
                    }`}>
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1.5">
                        <Clock size={11} className={deadline?.urgent ? "text-orange-500" : "text-primary"} />
                        Délai
                      </div>
                      <p className={`font-bold ${deadline?.urgent ? "text-orange-600" : "text-foreground"}`}>
                        {deadline?.label}
                      </p>
                      {project.deadline && (
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {new Date(project.deadline).toLocaleDateString("fr-FR")}
                        </p>
                      )}
                    </div>

                    <div className="bg-muted/40 rounded-xl p-3.5 border border-border/50 sm:col-span-1 col-span-2">
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1.5">
                        <Briefcase size={11} className="text-primary" /> Spécialité
                      </div>
                      <p className="font-bold text-foreground">
                        {project.speciality?.name ?? "—"}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {project.category?.name ?? "—"}
                      </p>
                    </div>

                    {project.proposals_count > 0 && (
                      <div className="bg-secondary/8 rounded-xl p-3.5 border border-secondary/20 col-span-2 sm:col-span-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <Users size={11} className="text-secondary" /> Propositions reçues
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-secondary text-lg">
                              {project.proposals_count}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              candidat{project.proposals_count > 1 ? "s" : ""}
                            </span>
                          </div>
                        </div>
                        <div className="mt-2 h-1.5 rounded-full bg-muted overflow-hidden">
                          <div
                            className="h-full rounded-full bg-secondary transition-all"
                            style={{ width: `${Math.min((project.proposals_count / 20) * 100, 100)}%` }}
                          />
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          {project.proposals_count >= 15
                            ? "Très compétitif"
                            : project.proposals_count >= 8
                            ? "Compétitif"
                            : project.proposals_count >= 3
                            ? "Modéré"
                            : "Peu de concurrence"}
                        </p>
                      </div>
                    )}

                    {/* Vues & Interactions */}
                    <div className="bg-muted/40 rounded-xl p-3.5 border border-border/50">
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1.5">
                        <Eye size={11} className="text-primary" /> Vues
                      </div>
                      <p className="font-bold text-foreground">{project.views_count}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">consultation{project.views_count > 1 ? "s" : ""}</p>
                    </div>

                    <div className="bg-muted/40 rounded-xl p-3.5 border border-border/50">
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1.5">
                        <MousePointerClick size={11} className="text-primary" /> Interactions
                      </div>
                      <p className="font-bold text-foreground">{project.interactions_count}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">clic{project.interactions_count > 1 ? "s" : ""} Postuler</p>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Description */}
              <Card className="p-6">
                <h2 className="font-semibold text-base mb-4 flex items-center gap-2">
                  <div className="w-6 h-6 rounded-md bg-primary/10 flex items-center justify-center">
                    <Briefcase size={13} className="text-primary" />
                  </div>
                  Description du projet
                </h2>
                <div className="prose prose-sm max-w-none text-muted-foreground leading-relaxed whitespace-pre-line">
                  {project.description}
                </div>
              </Card>

              {/* Compétences */}
              {(project.skills?.length > 0 || project.speciality) && (
                <Card className="p-6">
                  <h2 className="font-semibold text-base mb-4 flex items-center gap-2">
                    <div className="w-6 h-6 rounded-md bg-primary/10 flex items-center justify-center">
                      <CheckCircle2 size={13} className="text-primary" />
                    </div>
                    Compétences recherchées
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {project.speciality && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium">
                        {project.speciality.name}
                      </span>
                    )}
                    {project.skills?.map((sk) => (
                      <span key={sk.id} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-muted text-foreground text-sm font-medium border border-border">
                        {sk.name}
                      </span>
                    ))}
                  </div>
                </Card>
              )}

              {/* Documents */}
              {docs && docs.length > 0 && (
                <Card className="p-6">
                  <h2 className="font-semibold text-base mb-4 flex items-center gap-2">
                    <div className="w-6 h-6 rounded-md bg-primary/10 flex items-center justify-center">
                      <Paperclip size={13} className="text-primary" />
                    </div>
                    Documents joints
                    <Badge variant="secondary" className="ml-auto text-xs">{docs.length}</Badge>
                  </h2>
                  <ProjectDocumentsList projectId={project.id} />
                </Card>
              )}
            </div>

            {/* ── Sidebar sticky ── */}
            <div className="space-y-4 lg:sticky lg:top-6">

              {/* CTA card */}
              <Card className="p-5 border-primary/20 bg-gradient-to-b from-primary/3 to-transparent">
                <p className="text-sm font-semibold text-foreground mb-1">Intéressé par ce projet ?</p>
                <p className="text-xs text-muted-foreground mb-4">
                  Soumettez votre proposition avec votre prix et délai.
                </p>
                <Button
                  onClick={() => {
                    if (id) trackInteraction.mutate(id);
                    setProposalOpen(true);
                  }}
                  className="w-full gap-2"
                  size="lg"
                >
                  <SendHorizonal size={16} />
                  Postuler maintenant
                </Button>
              </Card>

              {/* Info résumé */}
              <Card className="p-5">
                <h3 className="text-sm font-semibold mb-3 text-muted-foreground uppercase tracking-wide">
                  Résumé
                </h3>
                <div className="space-y-3">
                  {[
                    { icon: Tag, label: "Budget", value: budgetDisplay },
                    {
                      icon: Clock,
                      label: "Délai",
                      value: deadline?.label ?? "—",
                      className: deadline?.urgent ? "text-orange-600 font-semibold" : "",
                    },
                    {
                      icon: Calendar,
                      label: "Date limite",
                      value: project.deadline
                        ? new Date(project.deadline).toLocaleDateString("fr-FR")
                        : "Non définie",
                    },
                    { icon: User, label: "Client", value: project.client.username },
                    {
                      icon: Users,
                      label: "Propositions",
                      value: `${project.proposals_count} candidat${project.proposals_count > 1 ? "s" : ""}`,
                      className: project.proposals_count > 0 ? "text-secondary font-semibold" : "",
                    },
                    { icon: LayoutGrid, label: "Catégorie", value: project.category?.name ?? "—" },
                    { icon: Briefcase, label: "Spécialité", value: project.speciality?.name ?? "—" },
                    {
                      icon: Calendar,
                      label: "Publié le",
                      value: new Date(project.created_at).toLocaleDateString("fr-FR"),
                    },
                    {
                      icon: Eye,
                      label: "Vues",
                      value: `${project.views_count} vue${project.views_count > 1 ? "s" : ""}`,
                    },
                    {
                      icon: MousePointerClick,
                      label: "Interactions",
                      value: `${project.interactions_count} clic${project.interactions_count > 1 ? "s" : ""}`,
                    },
                  ].map(({ icon: Icon, label, value, className }) => (
                    <div key={label} className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground flex-shrink-0">
                        <Icon size={12} />
                        {label}
                      </div>
                      <p className={`text-xs font-medium text-right ${className ?? "text-foreground"}`}>
                        {value}
                      </p>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Skills mini */}
              {project.skills?.length > 0 && (
                <Card className="p-5">
                  <h3 className="text-sm font-semibold mb-3 text-muted-foreground uppercase tracking-wide">
                    Compétences
                  </h3>
                  <div className="flex flex-wrap gap-1.5">
                    {project.skills.map((sk) => (
                      <span key={sk.id} className="text-xs px-2 py-1 rounded-full bg-muted text-foreground border border-border">
                        {sk.name}
                      </span>
                    ))}
                  </div>
                </Card>
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
