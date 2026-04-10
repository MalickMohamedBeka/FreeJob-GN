import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Building2, MapPin, Phone, Mail, Globe, Loader2, Camera, Pencil,
  FileText, Trash2, Upload, ExternalLink, CalendarDays, Briefcase,
  Plus, Users, CheckCircle, Clock,
} from "lucide-react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import { ApiError } from "@/services/api.service";
import { toast } from "@/hooks";
import {
  useMyAgencyProfile,
  useUpdateAgencyProfile,
  useUpdateAgencyProfilePicture,
  useAgencyDocuments,
  useUploadAgencyDocument,
  useDeleteAgencyDocument,
} from "@/hooks/useAgency";
import { useMyProjects } from "@/hooks/useProjects";
import { useContracts } from "@/hooks/useContracts";
import type { AgencyDocTypeEnum, ApiAgencyDocument } from "@/types";

// ── Constants ──────────────────────────────────────────────────────────────────

const DOC_TYPE_LABELS: Record<AgencyDocTypeEnum, string> = {
  RCCM: "RCCM",
  STATUTES: "Statuts",
  TAX: "Attestation fiscale",
  OTHER: "Autre",
};
const DOC_TYPES = Object.entries(DOC_TYPE_LABELS) as [AgencyDocTypeEnum, string][];

// ── Avatar ─────────────────────────────────────────────────────────────────────

function AgencyAvatar({
  src,
  name,
  onChange,
  uploading,
}: {
  src: string | null;
  name: string;
  onChange: (f: File) => void;
  uploading: boolean;
}) {
  const ref = useRef<HTMLInputElement>(null);
  const initial = name.charAt(0).toUpperCase();

  return (
    <div className="relative w-24 h-24 flex-shrink-0">
      {src ? (
        <img src={src} alt={name} className="w-24 h-24 rounded-2xl object-cover border-4 border-background shadow" />
      ) : (
        <div className="w-24 h-24 rounded-2xl bg-secondary/10 border-4 border-background shadow flex items-center justify-center text-3xl font-bold text-secondary">
          {initial}
        </div>
      )}
      <button
        type="button"
        onClick={() => ref.current?.click()}
        disabled={uploading}
        className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-secondary text-white flex items-center justify-center shadow hover:bg-secondary/90 transition-colors"
      >
        {uploading ? <Loader2 size={13} className="animate-spin" /> : <Camera size={13} />}
      </button>
      <input ref={ref} type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) onChange(f); e.target.value = ""; }} />
    </div>
  );
}

// ── Document row ───────────────────────────────────────────────────────────────

function DocRow({ doc, onDelete }: { doc: ApiAgencyDocument; onDelete: () => void }) {
  return (
    <div className="flex items-center justify-between p-3 rounded-xl border border-border hover:border-secondary/30 transition-colors">
      <div className="flex items-center gap-3 min-w-0">
        <div className="p-2 rounded-lg bg-secondary/10 flex-shrink-0">
          <FileText size={16} className="text-secondary" />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-medium truncate">{DOC_TYPE_LABELS[doc.doc_type] || doc.doc_type}</p>
          {doc.reference_number && (
            <p className="text-xs text-muted-foreground truncate">Réf: {doc.reference_number}</p>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        {doc.file && (
          <a href={doc.file} target="_blank" rel="noopener noreferrer">
            <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
              <ExternalLink size={14} />
            </Button>
          </a>
        )}
        <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10" onClick={onDelete}>
          <Trash2 size={14} />
        </Button>
      </div>
    </div>
  );
}

// ── Upload document dialog ──────────────────────────────────────────────────────

function UploadDocDialog({ open, onClose, onUpload, isPending }: {
  open: boolean;
  onClose: () => void;
  onUpload: (fd: FormData) => void;
  isPending: boolean;
}) {
  const [docType, setDocType] = useState<AgencyDocTypeEnum>("RCCM");
  const [refNum, setRefNum] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const reset = () => { setDocType("RCCM"); setRefNum(""); setFile(null); };

  const handleSubmit = () => {
    if (!file) return;
    const fd = new FormData();
    fd.append("doc_type", docType);
    fd.append("file", file);
    if (refNum.trim()) fd.append("reference_number", refNum.trim());
    onUpload(fd);
    reset();
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) { reset(); onClose(); } }}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ajouter un document</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label>Type de document</Label>
            <Select value={docType} onValueChange={(v) => setDocType(v as AgencyDocTypeEnum)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {DOC_TYPES.map(([val, label]) => (
                  <SelectItem key={val} value={val}>{label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Numéro de référence</Label>
            <Input value={refNum} onChange={(e) => setRefNum(e.target.value)} placeholder="Optionnel" />
          </div>
          <div className="space-y-2">
            <Label>Fichier <span className="text-destructive">*</span></Label>
            <label className="flex flex-col items-center justify-center border-2 border-dashed border-border rounded-xl p-6 cursor-pointer hover:border-secondary/50 hover:bg-secondary/5 transition-colors">
              <Upload size={24} className="text-muted-foreground mb-2" />
              <span className="text-sm text-muted-foreground">
                {file ? file.name : "Cliquez pour sélectionner"}
              </span>
              <input type="file" className="hidden" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
            </label>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => { reset(); onClose(); }}>Annuler</Button>
          <Button
            disabled={!file || isPending}
            onClick={handleSubmit}
            className="bg-secondary hover:bg-secondary/90"
          >
            {isPending ? <Loader2 size={15} className="animate-spin mr-2" /> : <Upload size={15} className="mr-2" />}
            Ajouter
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ── Main ───────────────────────────────────────────────────────────────────────

export default function AgencyDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const { data: profile, isLoading: loadingProfile, isError, error } = useMyAgencyProfile();
  const updateProfile = useUpdateAgencyProfile();
  const updatePicture = useUpdateAgencyProfilePicture();
  const { data: docsData, isLoading: loadingDocs } = useAgencyDocuments();
  const uploadDoc = useUploadAgencyDocument();
  const deleteDoc = useDeleteAgencyDocument();
  const { data: projectsData, isLoading: loadingProjects } = useMyProjects();
  const { data: contractsData, isLoading: loadingContracts } = useContracts();

  const [editOpen, setEditOpen] = useState(false);
  const [docDialogOpen, setDocDialogOpen] = useState(false);
  const [deleteDocId, setDeleteDocId] = useState<number | null>(null);

  // Edit form state
  const [form, setForm] = useState({
    agency_name: "",
    founded_at: "",
    bio: "",
    city_or_region: "",
    country: "",
    postal_code: "",
    phone: "",
    hourly_rate: "",
  });

  // Redirect to onboarding if profile not found
  if (isError) {
    const apiErr = error as ApiError | null;
    if (apiErr?.status === 404) {
      navigate("/agency/onboarding", { replace: true });
      return null;
    }
  }

  const docs = docsData?.results ?? [];
  const projects = (projectsData?.results ?? []).filter((p) => p.client.id === user?.id);
  const contracts = contractsData?.results ?? [];

  const stats = [
    { icon: Briefcase, label: "Projets", value: String(projects.length), loading: loadingProjects },
    { icon: CheckCircle, label: "Contrats terminés", value: String(contracts.filter((c) => c.status === "COMPLETED").length), loading: loadingContracts },
    { icon: Clock, label: "En cours", value: String(contracts.filter((c) => c.status === "IN_PROGRESS").length), loading: loadingContracts },
    { icon: Users, label: "Total contrats", value: String(contracts.length), loading: loadingContracts },
  ];

  const openEditDialog = () => {
    if (!profile) return;
    setForm({
      agency_name: profile.agency_details?.agency_name || "",
      founded_at: profile.agency_details?.founded_at || "",
      bio: profile.bio || "",
      city_or_region: profile.city_or_region || "",
      country: profile.country || "",
      postal_code: profile.postal_code || "",
      phone: profile.phone || "",
      hourly_rate: profile.hourly_rate || "",
    });
    setEditOpen(true);
  };

  const handleSaveProfile = async () => {
    try {
      await updateProfile.mutateAsync({
        bio: form.bio || undefined,
        city_or_region: form.city_or_region || undefined,
        country: form.country || undefined,
        postal_code: form.postal_code || undefined,
        phone: form.phone || undefined,
        hourly_rate: form.hourly_rate || null,
        agency: {
          agency_name: form.agency_name,
          founded_at: form.founded_at || null,
        },
      });
      setEditOpen(false);
      toast({ title: "Profil mis à jour" });
    } catch {
      toast({ title: "Erreur lors de la mise à jour", variant: "destructive" });
    }
  };

  const handlePicture = (file: File) => {
    if (!profile) return;
    updatePicture.mutate(
      { file, agency_name: profile.agency_details?.agency_name || user?.username || "" },
      { onSuccess: () => toast({ title: "Photo mise à jour" }) },
    );
  };

  const handleUploadDoc = (fd: FormData) => {
    uploadDoc.mutate(fd, {
      onSuccess: () => { setDocDialogOpen(false); toast({ title: "Document ajouté" }); },
      onError: () => toast({ title: "Échec de l'upload", variant: "destructive" }),
    });
  };

  const handleDeleteDoc = (id: number) => {
    deleteDoc.mutate(id, {
      onSuccess: () => { setDeleteDocId(null); toast({ title: "Document supprimé" }); },
      onError: () => toast({ title: "Erreur suppression", variant: "destructive" }),
    });
  };

  if (loadingProfile) {
    return (
      <DashboardLayout userType="agency">
        <div className="flex items-center justify-center py-32">
          <Loader2 className="animate-spin text-secondary" size={36} />
        </div>
      </DashboardLayout>
    );
  }

  const agencyName = profile?.agency_details?.agency_name || user?.username || "Agence";
  const location = [profile?.city_or_region, profile?.country].filter(Boolean).join(", ");

  return (
    <DashboardLayout userType="agency">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-1">{agencyName}</h1>
            <p className="text-muted-foreground flex items-center gap-1 text-sm">
              <Building2 size={14} />
              Tableau de bord Agence
            </p>
          </div>
          <Button onClick={openEditDialog} className="gap-2 bg-secondary hover:bg-secondary/90">
            <Pencil size={16} />
            Modifier le profil
          </Button>
        </div>

        {/* Stats */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <motion.div key={stat.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
                <Card className="p-5">
                  <div className="p-2.5 rounded-xl bg-secondary/10 w-fit mb-3">
                    <Icon size={20} className="text-secondary" />
                  </div>
                  <p className="text-xs text-muted-foreground mb-0.5">{stat.label}</p>
                  <p className="text-2xl font-bold">{stat.loading ? "…" : stat.value}</p>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Tabs */}
        <Tabs defaultValue="profile">
          <TabsList className="mb-6">
            <TabsTrigger value="profile">Profil</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <Card className="p-6">
              <div className="flex flex-col sm:flex-row gap-6">
                <AgencyAvatar
                  src={profile?.profile_picture ?? null}
                  name={agencyName}
                  onChange={handlePicture}
                  uploading={updatePicture.isPending}
                />
                <div className="flex-1 space-y-4">
                  <div>
                    <h2 className="text-xl font-bold">{agencyName}</h2>
                    {profile?.agency_details?.founded_at && (
                      <p className="text-sm text-muted-foreground flex items-center gap-1 mt-0.5">
                        <CalendarDays size={13} />
                        Fondée le {new Date(profile.agency_details.founded_at).toLocaleDateString("fr-FR")}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                    {location && (
                      <span className="flex items-center gap-1.5">
                        <MapPin size={14} />
                        {location}
                      </span>
                    )}
                    {profile?.phone && (
                      <span className="flex items-center gap-1.5">
                        <Phone size={14} />
                        {profile.phone}
                      </span>
                    )}
                    {profile?.email && (
                      <span className="flex items-center gap-1.5">
                        <Mail size={14} />
                        {profile.email}
                      </span>
                    )}
                    {profile?.hourly_rate && (
                      <span className="flex items-center gap-1.5">
                        <Globe size={14} />
                        {parseFloat(profile.hourly_rate).toLocaleString("fr-FR")} GNF/h
                      </span>
                    )}
                  </div>

                  {profile?.bio && (
                    <>
                      <Separator />
                      <p className="text-sm text-muted-foreground leading-relaxed">{profile.bio}</p>
                    </>
                  )}

                  {/* Skills */}
                  {profile?.skills && profile.skills.length > 0 && (
                    <>
                      <Separator />
                      <div>
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                          Compétences
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {profile.skills.map((s) => (
                            <Badge key={s.id} variant="secondary" className="text-xs">{s.name}</Badge>
                          ))}
                        </div>
                      </div>
                    </>
                  )}

                  {profile?.speciality && (
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">Spécialité</p>
                      <Badge className="bg-secondary/10 text-secondary border-secondary/20">{profile.speciality.name}</Badge>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Documents Tab */}
          <TabsContent value="documents">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-semibold flex items-center gap-2">
                  <FileText size={18} className="text-secondary" />
                  Documents officiels
                </h3>
                <Button size="sm" onClick={() => setDocDialogOpen(true)} className="gap-1.5 bg-secondary hover:bg-secondary/90">
                  <Plus size={15} />
                  Ajouter
                </Button>
              </div>

              {loadingDocs ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="animate-spin text-muted-foreground" size={24} />
                </div>
              ) : docs.length === 0 ? (
                <div className="text-center py-10 text-muted-foreground">
                  <FileText className="mx-auto mb-3 opacity-40" size={36} />
                  <p className="text-sm">Aucun document. Ajoutez vos documents officiels (RCCM, statuts, etc.).</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {docs.map((doc) => (
                    <DocRow key={doc.id} doc={doc} onDelete={() => setDeleteDocId(doc.id)} />
                  ))}
                </div>
              )}
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Edit Profile Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Modifier le profil de l'agence</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Nom de l'agence</Label>
                <Input value={form.agency_name} onChange={(e) => setForm((p) => ({ ...p, agency_name: e.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label>Date de fondation</Label>
                <Input type="date" value={form.founded_at} onChange={(e) => setForm((p) => ({ ...p, founded_at: e.target.value }))} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea value={form.bio} onChange={(e) => setForm((p) => ({ ...p, bio: e.target.value }))} rows={4} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Pays</Label>
                <Input value={form.country} onChange={(e) => setForm((p) => ({ ...p, country: e.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label>Ville</Label>
                <Input value={form.city_or_region} onChange={(e) => setForm((p) => ({ ...p, city_or_region: e.target.value }))} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Téléphone</Label>
                <Input value={form.phone} onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label>Tarif horaire (GNF)</Label>
                <Input type="number" value={form.hourly_rate} onChange={(e) => setForm((p) => ({ ...p, hourly_rate: e.target.value }))} placeholder="0" />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditOpen(false)}>Annuler</Button>
            <Button
              onClick={handleSaveProfile}
              disabled={updateProfile.isPending}
              className="bg-secondary hover:bg-secondary/90"
            >
              {updateProfile.isPending ? <Loader2 size={15} className="animate-spin mr-2" /> : null}
              Enregistrer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Upload Document Dialog */}
      <UploadDocDialog
        open={docDialogOpen}
        onClose={() => setDocDialogOpen(false)}
        onUpload={handleUploadDoc}
        isPending={uploadDoc.isPending}
      />

      {/* Delete confirm */}
      <AlertDialog open={deleteDocId !== null} onOpenChange={(v) => { if (!v) setDeleteDocId(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer ce document ?</AlertDialogTitle>
            <AlertDialogDescription>Cette action est irréversible.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-white hover:bg-destructive/90"
              onClick={() => deleteDocId !== null && handleDeleteDoc(deleteDocId)}
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
}
