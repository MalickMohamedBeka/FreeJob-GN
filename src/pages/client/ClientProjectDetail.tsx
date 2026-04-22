import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import {
  ArrowLeft, Loader2, AlertCircle, Tag, Clock, Calendar, Briefcase,
  User, Pencil, Trash2, SendHorizonal, Paperclip, FileText, Zap,
  CheckCircle2, LayoutGrid, TrendingUp, ExternalLink, AlertTriangle,
  Users, Eye, MousePointerClick, Flame, Upload, X, FileCheck,
} from "lucide-react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
  AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  useProject, useProjectDocuments, useSubmitProjectForReview,
  useDeleteProject, useUploadProjectDocument, useDeleteProjectDocument,
} from "@/hooks/useProjects";
import { ApiError } from "@/services/api.service";
import { useToast } from "@/hooks/use-toast";
import { ROUTES } from "@/constants/routes";
import type { ProjectDocumentType } from "@/types";

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
  if (count === 0) return { label: "Aucune candidature", color: "text-muted-foreground", bar: "bg-muted-foreground", pct: 0 };
  if (count <= 2)  return { label: "Peu de candidats", color: "text-emerald-600", bar: "bg-emerald-500", pct: Math.round((count / 20) * 100) };
  if (count <= 7)  return { label: "Modéré", color: "text-amber-600", bar: "bg-amber-500", pct: Math.round((count / 20) * 100) };
  if (count <= 14) return { label: "Bonne réception", color: "text-primary", bar: "bg-primary", pct: Math.round((count / 20) * 100) };
  return { label: "Très populaire !", color: "text-secondary", bar: "bg-secondary", pct: 100 };
}

const STATUS_CONFIG: Record<string, { label: string; cls: string }> = {
  DRAFT:          { label: "Brouillon",   cls: "bg-muted text-foreground" },
  PENDING_REVIEW: { label: "En révision", cls: "bg-yellow-500 text-white" },
  PUBLISHED:      { label: "Publié",      cls: "bg-primary text-white" },
  IN_PROGRESS:    { label: "En cours",    cls: "bg-secondary text-white" },
  CLOSED:         { label: "Fermé",       cls: "bg-muted text-foreground" },
  REJECTED:       { label: "Rejeté",      cls: "bg-destructive text-white" },
  CANCELLED:      { label: "Annulé",      cls: "bg-muted text-foreground" },
};

// ── Animation variants ────────────────────────────────────────────────────────

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.38, ease: "easeOut" } },
};
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.07 } } };

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

// ── Documents section (client — with upload) ──────────────────────────────────

const DOC_TYPE_LABELS: Record<ProjectDocumentType, string> = {
  CAHIER_DE_CHARGE: "Cahier de charge",
  OTHER: "Autre",
};

function ClientDocumentsSection({ projectId }: { projectId: string }) {
  const { data: docs, isLoading } = useProjectDocuments(projectId);
  const upload = useUploadProjectDocument(projectId);
  const del = useDeleteProjectDocument(projectId);
  const { toast } = useToast();

  const [docType, setDocType] = useState<ProjectDocumentType>("CAHIER_DE_CHARGE");
  const [docTitle, setDocTitle] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleUpload = async () => {
    if (!file || !docTitle.trim()) { toast({ title: "Titre et fichier obligatoires", variant: "destructive" }); return; }
    setUploading(true);
    try {
      await upload.mutateAsync({ file, doc_type: docType, title: docTitle.trim() });
      setDocTitle(""); setFile(null);
      toast({ title: "Document ajouté" });
    } catch {
      toast({ title: "Erreur lors de l'upload", variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

  const list = docs ?? [];

  return (
    <div className="space-y-3">
      {isLoading ? (
        <div className="flex justify-center py-4"><Loader2 size={20} className="animate-spin text-muted-foreground" /></div>
      ) : list.length === 0 ? (
        <p className="text-sm text-muted-foreground">Aucun document joint pour l'instant.</p>
      ) : (
        <div className="space-y-2">
          {list.map((doc) => (
            <div key={doc.id} className="flex items-center gap-3 p-3.5 rounded-xl border border-border hover:border-primary/20 transition-colors group">
              <span className="w-9 h-9 rounded-xl bg-primary/8 flex items-center justify-center flex-shrink-0">
                <FileText size={15} className="text-primary" />
              </span>
              <div className="flex-1 min-w-0">
                <a href={doc.file} target="_blank" rel="noopener noreferrer"
                  className="text-sm font-medium truncate hover:text-primary transition-colors flex items-center gap-1.5 group-hover:text-primary">
                  {doc.title}
                  <ExternalLink size={11} className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
                <p className="text-xs text-muted-foreground">{doc.doc_type_display}</p>
              </div>
              <button onClick={() => del.mutate(doc.id)} disabled={del.isPending}
                className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/5 transition-colors flex-shrink-0"
                aria-label="Supprimer">
                <X size={13} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Upload form */}
      <div className="pt-2 border-t border-border/50">
        <p className="text-xs font-medium text-muted-foreground mb-2.5 flex items-center gap-1.5">
          <Upload size={11} />Ajouter un document
        </p>
        <div className="flex flex-wrap gap-2 items-end">
          <div className="space-y-1">
            <Label className="text-xs">Type</Label>
            <Select value={docType} onValueChange={(v) => setDocType(v as ProjectDocumentType)}>
              <SelectTrigger className="h-8 w-[150px] text-xs"><SelectValue /></SelectTrigger>
              <SelectContent>
                {(Object.keys(DOC_TYPE_LABELS) as ProjectDocumentType[]).map((k) => (
                  <SelectItem key={k} value={k} className="text-xs">{DOC_TYPE_LABELS[k]}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1 flex-1 min-w-[120px]">
            <Label className="text-xs">Titre</Label>
            <Input className="h-8 text-xs" placeholder="Ex: Cahier des charges" value={docTitle} onChange={(e) => setDocTitle(e.target.value)} />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Fichier</Label>
            <Input type="file" className="h-8 text-xs w-[170px]" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
          </div>
          <Button size="sm" className="h-8 gap-1.5 text-xs" onClick={handleUpload} disabled={uploading || !file || !docTitle.trim()}>
            {uploading ? <Loader2 size={12} className="animate-spin" /> : <Upload size={12} />}
            Ajouter
          </Button>
        </div>
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

const ClientProjectDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [confirmDelete, setConfirmDelete] = useState(false);

  const { data: project, isLoading, isError } = useProject(id ?? "");
  const submitForReview = useSubmitProjectForReview();
  const deleteProject = useDeleteProject();

  const deadline = project ? daysLeft(project.deadline) : null;
  const compInfo = project ? competitionInfo(project.proposals_count) : null;
  const sc = project ? (STATUS_CONFIG[project.status] ?? { label: project.status_display, cls: "bg-muted" }) : null;
  const budgetDisplay = project
    ? project.budget_amount
      ? `${Number(project.budget_amount).toLocaleString("fr-GN")} GNF`
      : project.budget_band_display
    : "";

  const handleDelete = () => {
    if (!id) return;
    deleteProject.mutate(id, {
      onSuccess: () => navigate(ROUTES.CLIENT.PROJECTS),
      onError: (err) => toast({
        title: "Impossible de supprimer",
        description: err instanceof ApiError ? err.message : "Une erreur est survenue.",
        variant: "destructive",
      }),
    });
  };

  const handleSubmit = () => {
    if (!id) return;
    submitForReview.mutate(id, {
      onSuccess: () => toast({ title: "Projet soumis pour révision" }),
      onError: (err) => toast({
        title: "Impossible de soumettre",
        description: err instanceof ApiError ? err.message : "Une erreur est survenue.",
        variant: "destructive",
      }),
    });
  };

  return (
    <DashboardLayout userType="client">
      <div className="max-w-5xl mx-auto">

        {/* ── Back ── */}
        <button
          onClick={() => navigate(ROUTES.CLIENT.PROJECTS)}
          className="group inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-7"
        >
          <span className="w-7 h-7 rounded-lg border border-border bg-background shadow-sm flex items-center justify-center group-hover:border-primary/30 group-hover:bg-primary/5 transition-all">
            <ArrowLeft size={13} />
          </span>
          Retour à mes projets
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
            <Button variant="outline" onClick={() => navigate(ROUTES.CLIENT.PROJECTS)} className="gap-2">
              <ArrowLeft size={14} /> Retour à mes projets
            </Button>
          </div>
        )}

        {/* ── Content ── */}
        {project && !isLoading && (
          <motion.div variants={stagger} initial="hidden" animate="show"
            className="grid lg:grid-cols-[1fr_288px] gap-6 items-start">

            {/* ════ LEFT COLUMN ════ */}
            <div className="space-y-5 min-w-0">

              {/* ── Hero card ── */}
              <motion.div variants={fadeUp}>
                <Card className="overflow-hidden shadow-sm border-border/70">

                  {/* Gradient header */}
                  <div className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-primary/4 to-secondary/4 p-7 pb-6">
                    <div className="pointer-events-none absolute -top-14 -right-14 w-52 h-52 rounded-full bg-primary/10 blur-3xl" />
                    <div className="pointer-events-none absolute -bottom-10 -left-10 w-40 h-40 rounded-full bg-secondary/8 blur-2xl" />

                    {/* Badges */}
                    <div className="relative flex flex-wrap gap-2 mb-5">
                      {sc && (
                        <Badge className={`${sc.cls} border-0 font-semibold text-xs py-0.5`}>
                          <Zap size={9} className="mr-1.5" />{sc.label}
                        </Badge>
                      )}
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
                        <Calendar size={11} />Créé {timeAgo(project.created_at)}
                      </span>
                      {project.updated_at !== project.created_at && (
                        <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <TrendingUp size={11} />Mis à jour {timeAgo(project.updated_at)}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Stats bar */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-y sm:divide-y-0 divide-border/50">
                    <div className="p-4 sm:p-5">
                      <p className="flex items-center gap-1.5 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                        <Tag size={10} className="text-primary" />Budget
                      </p>
                      <p className="font-bold text-foreground text-[0.95rem] leading-tight">{budgetDisplay}</p>
                      {project.budget_band_display && project.budget_amount && (
                        <p className="text-xs text-muted-foreground mt-0.5">{project.budget_band_display}</p>
                      )}
                    </div>

                    <div className={`p-4 sm:p-5 ${deadline?.urgent && deadline.value > 0 ? "bg-orange-50/60" : ""}`}>
                      <p className="flex items-center gap-1.5 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                        <Clock size={10} className={deadline?.urgent ? "text-orange-500" : "text-primary"} />Délai
                      </p>
                      <p className={`font-bold text-[0.95rem] leading-tight ${deadline?.urgent ? "text-orange-600" : "text-foreground"}`}>
                        {deadline?.label}
                      </p>
                      {project.deadline && (
                        <p className="text-xs text-muted-foreground mt-0.5">{new Date(project.deadline).toLocaleDateString("fr-FR")}</p>
                      )}
                    </div>

                    <div className="p-4 sm:p-5">
                      <p className="flex items-center gap-1.5 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                        <Users size={10} className="text-secondary" />Candidatures
                      </p>
                      <p className={`font-bold text-[0.95rem] leading-tight ${project.proposals_count > 0 ? "text-secondary" : "text-foreground"}`}>
                        {project.proposals_count}
                      </p>
                      <p className={`text-xs mt-0.5 ${compInfo?.color ?? "text-muted-foreground"}`}>{compInfo?.label}</p>
                    </div>

                    <div className="p-4 sm:p-5">
                      <p className="flex items-center gap-1.5 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                        <Eye size={10} className="text-primary" />Vues
                      </p>
                      <p className="font-bold text-foreground text-[0.95rem] leading-tight">{project.views_count}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{project.interactions_count} intéressé{project.interactions_count !== 1 ? "s" : ""}</p>
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
              <motion.div variants={fadeUp}>
                <Card className="p-6 shadow-sm border-border/70">
                  <SectionHeader
                    icon={Paperclip}
                    title="Documents du projet"
                    right={
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-muted text-muted-foreground border border-border">
                        {(project as any)?.documents_count ?? ""}
                      </span>
                    }
                  />
                  <ClientDocumentsSection projectId={project.id} />
                </Card>
              </motion.div>
            </div>

            {/* ════ SIDEBAR ════ */}
            <div className="space-y-4 lg:sticky lg:top-6">

              {/* ── Actions card ── */}
              <motion.div variants={fadeUp}>
                <Card className="overflow-hidden shadow-sm border-border/70">
                  <div className="bg-gradient-to-br from-primary/8 via-primary/4 to-transparent p-5 border-b border-primary/10">
                    <p className="text-xs text-muted-foreground mb-0.5">Statut du projet</p>
                    {sc && (
                      <Badge className={`${sc.cls} border-0 font-semibold`}>
                        <Zap size={10} className="mr-1.5" />{sc.label}
                      </Badge>
                    )}
                  </div>
                  <div className="p-4 space-y-2.5">
                    {project.status === "DRAFT" && (
                      <>
                        <Button
                          className="w-full gap-2 h-10 font-semibold"
                          onClick={handleSubmit}
                          disabled={submitForReview.isPending}
                        >
                          {submitForReview.isPending
                            ? <Loader2 size={15} className="animate-spin" />
                            : <SendHorizonal size={15} />}
                          Soumettre pour révision
                        </Button>
                        <Link to={`${ROUTES.CLIENT.PROJECTS}?edit=${project.id}`}>
                          <Button variant="outline" className="w-full gap-2 h-10">
                            <Pencil size={14} />Modifier le projet
                          </Button>
                        </Link>
                        <Button
                          variant="outline"
                          className="w-full gap-2 h-10 text-destructive hover:text-destructive hover:border-destructive/30 hover:bg-destructive/5"
                          onClick={() => setConfirmDelete(true)}
                        >
                          <Trash2 size={14} />Supprimer
                        </Button>
                      </>
                    )}
                    {project.status === "PUBLISHED" && (
                      <Link to={ROUTES.CLIENT.PROPOSALS}>
                        <Button className="w-full gap-2 h-10 font-semibold">
                          <Users size={15} />
                          Voir les propositions
                        </Button>
                      </Link>
                    )}
                    {project.status === "PENDING_REVIEW" && (
                      <div className="text-center py-2">
                        <div className="w-10 h-10 rounded-full bg-yellow-50 flex items-center justify-center mx-auto mb-2">
                          <Clock size={18} className="text-yellow-500" />
                        </div>
                        <p className="text-sm font-medium text-yellow-700">En cours de révision</p>
                        <p className="text-xs text-muted-foreground mt-1">Notre équipe examine votre projet.</p>
                      </div>
                    )}
                    {project.status === "REJECTED" && (
                      <div className="text-center py-2">
                        <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-2">
                          <AlertCircle size={18} className="text-red-500" />
                        </div>
                        <p className="text-sm font-medium text-red-600">Projet rejeté</p>
                        <p className="text-xs text-muted-foreground mt-1">Contactez le support pour plus d'infos.</p>
                      </div>
                    )}
                    {project.status === "IN_PROGRESS" && (
                      <div className="text-center py-2">
                        <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center mx-auto mb-2">
                          <FileCheck size={18} className="text-secondary" />
                        </div>
                        <p className="text-sm font-semibold text-secondary">En cours d'exécution</p>
                        <p className="text-xs text-muted-foreground mt-1">Un prestataire travaille sur ce projet.</p>
                      </div>
                    )}
                  </div>
                </Card>
              </motion.div>

              {/* ── Candidatures card ── */}
              <motion.div variants={fadeUp}>
                <Card className="p-5 shadow-sm border-border/70">
                  <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-4">
                    Candidatures reçues
                  </p>
                  {project.proposals_count === 0 ? (
                    <div className="text-center py-1">
                      <span className="w-11 h-11 rounded-full bg-muted/60 flex items-center justify-center mx-auto mb-2.5">
                        <Users size={20} className="text-muted-foreground" />
                      </span>
                      <p className="text-sm font-medium text-muted-foreground">Aucune candidature</p>
                      <p className="text-xs text-muted-foreground mt-1">Les prestataires pourront postuler une fois le projet publié.</p>
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
                        { icon: LayoutGrid, label: "Catégorie",   value: project.category?.name ?? "—", cls: "" },
                        { icon: Briefcase,  label: "Spécialité",  value: project.speciality?.name ?? "—", cls: "" },
                        { icon: Calendar,   label: "Créé le",     value: new Date(project.created_at).toLocaleDateString("fr-FR"), cls: "" },
                      ] as { icon: LucideIcon; label: string; value: string; cls: string }[]
                    ).map(({ icon: Icon, label, value, cls }) => (
                      <div key={label} className="flex items-center justify-between gap-3 py-2.5 border-b border-border/40 last:border-0">
                        <span className="flex items-center gap-1.5 text-xs text-muted-foreground flex-shrink-0">
                          <Icon size={11} className="flex-shrink-0" />{label}
                        </span>
                        <p className={`text-xs text-right truncate max-w-[120px] ${cls || "text-foreground font-medium"}`}>{value}</p>
                      </div>
                    ))}
                  </div>
                </Card>
              </motion.div>

              {/* ── Skills mini ── */}
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

      {/* Delete confirmation */}
      <AlertDialog open={confirmDelete} onOpenChange={setConfirmDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer ce projet ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. Le projet et toutes ses données seront définitivement supprimés.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction className="bg-destructive hover:bg-destructive/90" onClick={handleDelete}>
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
};

export default ClientProjectDetail;
