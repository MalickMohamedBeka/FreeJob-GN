import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Building2, MapPin, Phone, Mail, Loader2, Camera, Pencil, Save,
  FileText, Trash2, Upload, ExternalLink, CalendarDays, Globe, X, Plus,
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
import { useSpecialities, useSkillsBySpeciality } from "@/hooks/useSkills";
import type { AgencyDocTypeEnum, ApiAgencyDocument } from "@/types";

// ── Constants ──────────────────────────────────────────────────────────────────

const DOC_LABELS: Record<AgencyDocTypeEnum, string> = {
  RCCM: "RCCM",
  STATUTES: "Statuts",
  TAX: "Attestation fiscale",
  OTHER: "Autre",
};
const DOC_TYPES = Object.entries(DOC_LABELS) as [AgencyDocTypeEnum, string][];

// ── Subcomponents ──────────────────────────────────────────────────────────────

function Avatar({ src, name, onChange, uploading }: { src: string | null; name: string; onChange: (f: File) => void; uploading: boolean }) {
  const ref = useRef<HTMLInputElement>(null);
  return (
    <div className="relative w-28 h-28 flex-shrink-0">
      {src ? (
        <img src={src} alt={name} className="w-28 h-28 rounded-2xl object-cover border-4 border-background shadow-md" />
      ) : (
        <div className="w-28 h-28 rounded-2xl bg-secondary/10 border-4 border-background shadow-md flex items-center justify-center text-3xl font-bold text-secondary">
          {name.charAt(0).toUpperCase()}
        </div>
      )}
      <button type="button" onClick={() => ref.current?.click()} disabled={uploading}
        className="absolute -bottom-1.5 -right-1.5 w-9 h-9 rounded-full bg-secondary text-white flex items-center justify-center shadow-md hover:bg-secondary/90 transition-colors">
        {uploading ? <Loader2 size={14} className="animate-spin" /> : <Camera size={14} />}
      </button>
      <input ref={ref} type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) onChange(f); e.target.value = ""; }} />
    </div>
  );
}

function DocRow({ doc, onDelete }: { doc: ApiAgencyDocument; onDelete: () => void }) {
  return (
    <div className="flex items-center justify-between p-3 rounded-xl border border-border hover:border-secondary/30 transition-colors group">
      <div className="flex items-center gap-3 min-w-0">
        <div className="p-2 rounded-lg bg-secondary/10 flex-shrink-0">
          <FileText size={15} className="text-secondary" />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-medium">{DOC_LABELS[doc.doc_type] ?? doc.doc_type}</p>
          {doc.reference_number && <p className="text-xs text-muted-foreground">Réf : {doc.reference_number}</p>}
          <p className="text-[11px] text-muted-foreground">{new Date(doc.created_at).toLocaleDateString("fr-FR")}</p>
        </div>
      </div>
      <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
        {doc.file && (
          <a href={doc.file} target="_blank" rel="noopener noreferrer">
            <Button size="icon" variant="ghost" className="h-8 w-8"><ExternalLink size={14} /></Button>
          </a>
        )}
        <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10" onClick={onDelete}>
          <Trash2 size={14} />
        </Button>
      </div>
    </div>
  );
}

// ── Main ───────────────────────────────────────────────────────────────────────

export default function AgencyProfilePage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const { data: profile, isLoading, isError, error } = useMyAgencyProfile();
  const updateProfile = useUpdateAgencyProfile();
  const updatePicture = useUpdateAgencyProfilePicture();
  const { data: docsData, isLoading: loadingDocs } = useAgencyDocuments();
  const uploadDoc = useUploadAgencyDocument();
  const deleteDoc = useDeleteAgencyDocument();
  const { data: specialitiesData } = useSpecialities();

  const [editing, setEditing] = useState(false);
  const [docDialogOpen, setDocDialogOpen] = useState(false);
  const [deleteDocId, setDeleteDocId] = useState<number | null>(null);

  // Edit form
  const [form, setForm] = useState({
    agency_name: "",
    founded_at: "",
    bio: "",
    city_or_region: "",
    country: "",
    postal_code: "",
    phone: "",
    hourly_rate: "",
    speciality_id: "" as string,
    skill_ids: [] as number[],
  });

  // Upload doc form
  const [docType, setDocType] = useState<AgencyDocTypeEnum>("RCCM");
  const [docRef, setDocRef] = useState("");
  const [docFile, setDocFile] = useState<File | null>(null);

  const selectedSpecialityId = form.speciality_id ? Number(form.speciality_id) : null;
  const { data: specialityData } = useSkillsBySpeciality(selectedSpecialityId);
  const availableSkills = specialityData?.skills ?? [];
  const allSpecialities = specialitiesData?.results ?? [];

  if (isError) {
    const e = error as ApiError | null;
    if (e?.status === 404) { navigate("/agency/onboarding", { replace: true }); return null; }
  }

  const docs = docsData?.results ?? [];
  const agencyName = profile?.agency_details?.agency_name || user?.username || "Agence";
  const location = [profile?.city_or_region, profile?.country].filter(Boolean).join(", ");

  const startEditing = () => {
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
      speciality_id: profile.speciality ? String(profile.speciality.id) : "",
      skill_ids: profile.skills.map((s) => s.id),
    });
    setEditing(true);
  };

  const handleSave = async () => {
    try {
      await updateProfile.mutateAsync({
        bio: form.bio || undefined,
        city_or_region: form.city_or_region || undefined,
        country: form.country || undefined,
        postal_code: form.postal_code || undefined,
        phone: form.phone || undefined,
        hourly_rate: form.hourly_rate || null,
        speciality_id: form.speciality_id ? Number(form.speciality_id) : null,
        skill_ids: form.skill_ids,
        agency: {
          agency_name: form.agency_name,
          founded_at: form.founded_at || null,
        },
      });
      setEditing(false);
      toast({ title: "Profil mis à jour" });
    } catch {
      toast({ title: "Erreur lors de la mise à jour", variant: "destructive" });
    }
  };

  const toggleSkill = (id: number) => {
    setForm((p) => ({
      ...p,
      skill_ids: p.skill_ids.includes(id) ? p.skill_ids.filter((s) => s !== id) : [...p.skill_ids, id],
    }));
  };

  const handleUploadDoc = () => {
    if (!docFile) return;
    const fd = new FormData();
    fd.append("doc_type", docType);
    fd.append("file", docFile);
    if (docRef.trim()) fd.append("reference_number", docRef.trim());
    uploadDoc.mutate(fd, {
      onSuccess: () => {
        setDocDialogOpen(false);
        setDocType("RCCM"); setDocRef(""); setDocFile(null);
        toast({ title: "Document ajouté" });
      },
      onError: () => toast({ title: "Échec de l'upload", variant: "destructive" }),
    });
  };

  if (isLoading) {
    return (
      <DashboardLayout userType="agency">
        <div className="flex items-center justify-center py-32">
          <Loader2 className="animate-spin text-secondary" size={36} />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout userType="agency">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="p-6">
            <div className="flex flex-col sm:flex-row gap-6 items-start">
              <Avatar
                src={profile?.profile_picture ?? null}
                name={agencyName}
                onChange={(f) => {
                  updatePicture.mutate(
                    { file: f, agency_name: agencyName },
                    { onSuccess: () => toast({ title: "Photo mise à jour" }) },
                  );
                }}
                uploading={updatePicture.isPending}
              />
              <div className="flex-1 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h1 className="text-2xl font-bold">{agencyName}</h1>
                    {profile?.agency_details?.founded_at && (
                      <p className="text-sm text-muted-foreground flex items-center gap-1.5 mt-1">
                        <CalendarDays size={13} />
                        Fondée le {new Date(profile.agency_details.founded_at).toLocaleDateString("fr-FR")}
                      </p>
                    )}
                  </div>
                  {!editing && (
                    <Button onClick={startEditing} variant="outline" size="sm" className="gap-1.5">
                      <Pencil size={14} />
                      Modifier
                    </Button>
                  )}
                </div>

                <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                  {location && <span className="flex items-center gap-1.5"><MapPin size={13} />{location}</span>}
                  {profile?.phone && <span className="flex items-center gap-1.5"><Phone size={13} />{profile.phone}</span>}
                  {profile?.email && <span className="flex items-center gap-1.5"><Mail size={13} />{profile.email}</span>}
                  {profile?.hourly_rate && (
                    <span className="flex items-center gap-1.5">
                      <Globe size={13} />{parseFloat(profile.hourly_rate).toLocaleString("fr-FR")} GNF/h
                    </span>
                  )}
                </div>

                {profile?.bio && (
                  <p className="text-sm text-muted-foreground leading-relaxed">{profile.bio}</p>
                )}

                {/* Skills */}
                {profile?.skills && profile.skills.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {profile.skills.map((s) => (
                      <Badge key={s.id} variant="secondary" className="text-xs">{s.name}</Badge>
                    ))}
                  </div>
                )}
                {profile?.speciality && (
                  <Badge className="bg-secondary/10 text-secondary border-secondary/20 text-xs">
                    {profile.speciality.name}
                  </Badge>
                )}
              </div>
            </div>

            {/* Edit Form */}
            {editing && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="mt-6 pt-6 border-t border-border space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label>Nom de l'agence</Label>
                    <Input value={form.agency_name} onChange={(e) => setForm((p) => ({ ...p, agency_name: e.target.value }))} />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Date de fondation</Label>
                    <Input type="date" value={form.founded_at} onChange={(e) => setForm((p) => ({ ...p, founded_at: e.target.value }))} />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label>Description</Label>
                  <Textarea value={form.bio} onChange={(e) => setForm((p) => ({ ...p, bio: e.target.value }))} rows={3} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label>Pays</Label>
                    <Input value={form.country} onChange={(e) => setForm((p) => ({ ...p, country: e.target.value }))} />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Ville</Label>
                    <Input value={form.city_or_region} onChange={(e) => setForm((p) => ({ ...p, city_or_region: e.target.value }))} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label>Téléphone</Label>
                    <Input value={form.phone} onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))} />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Tarif horaire (GNF)</Label>
                    <Input type="number" value={form.hourly_rate} onChange={(e) => setForm((p) => ({ ...p, hourly_rate: e.target.value }))} />
                  </div>
                </div>

                {/* Speciality */}
                <div className="space-y-1.5">
                  <Label>Spécialité</Label>
                  <Select
                    value={form.speciality_id || "__none__"}
                    onValueChange={(v) => setForm((p) => ({ ...p, speciality_id: v === "__none__" ? "" : v, skill_ids: [] }))}
                  >
                    <SelectTrigger><SelectValue placeholder="Choisir une spécialité" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="__none__">Aucune</SelectItem>
                      {allSpecialities.map((sp) => (
                        <SelectItem key={sp.id} value={String(sp.id)}>{sp.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Skills */}
                {availableSkills.length > 0 && (
                  <div className="space-y-1.5">
                    <Label>Compétences</Label>
                    <div className="flex flex-wrap gap-2">
                      {availableSkills.map((skill) => {
                        const selected = form.skill_ids.includes(skill.id);
                        return (
                          <button
                            key={skill.id}
                            type="button"
                            onClick={() => toggleSkill(skill.id)}
                            className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                              selected ? "bg-secondary text-white border-secondary" : "bg-transparent border-border text-muted-foreground hover:border-secondary/50"
                            }`}
                          >
                            {skill.name}
                            {selected && <X size={10} className="inline ml-1" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                <div className="flex justify-end gap-3">
                  <Button variant="outline" onClick={() => setEditing(false)}>Annuler</Button>
                  <Button onClick={handleSave} disabled={updateProfile.isPending} className="bg-secondary hover:bg-secondary/90 gap-2">
                    {updateProfile.isPending ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
                    Enregistrer
                  </Button>
                </div>
              </motion.div>
            )}
          </Card>
        </motion.div>

        {/* Documents */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-semibold text-base flex items-center gap-2">
                <FileText size={18} className="text-secondary" />
                Documents officiels
              </h2>
              <Button size="sm" onClick={() => setDocDialogOpen(true)} className="gap-1.5 bg-secondary hover:bg-secondary/90">
                <Plus size={14} />
                Ajouter
              </Button>
            </div>

            {loadingDocs ? (
              <div className="flex justify-center py-8">
                <Loader2 className="animate-spin text-muted-foreground" size={22} />
              </div>
            ) : docs.length === 0 ? (
              <div className="text-center py-10 text-muted-foreground">
                <FileText className="mx-auto mb-3 opacity-40" size={32} />
                <p className="text-sm">Aucun document. Ajoutez vos documents légaux (RCCM, statuts, attestation fiscale).</p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {docs.map((doc) => (
                  <DocRow key={doc.id} doc={doc} onDelete={() => setDeleteDocId(doc.id)} />
                ))}
              </div>
            )}
          </Card>
        </motion.div>
      </div>

      {/* Upload Document Dialog */}
      <Dialog open={docDialogOpen} onOpenChange={(v) => { if (!v) { setDocType("RCCM"); setDocRef(""); setDocFile(null); } setDocDialogOpen(v); }}>
        <DialogContent>
          <DialogHeader><DialogTitle>Ajouter un document</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Type</Label>
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
              <Input value={docRef} onChange={(e) => setDocRef(e.target.value)} placeholder="Optionnel" />
            </div>
            <div className="space-y-2">
              <Label>Fichier <span className="text-destructive">*</span></Label>
              <label className="flex flex-col items-center justify-center border-2 border-dashed border-border rounded-xl p-6 cursor-pointer hover:border-secondary/50 hover:bg-secondary/5 transition-colors">
                <Upload size={22} className="text-muted-foreground mb-2" />
                <span className="text-sm text-muted-foreground">{docFile ? docFile.name : "Cliquez pour sélectionner"}</span>
                <input type="file" className="hidden" onChange={(e) => setDocFile(e.target.files?.[0] ?? null)} />
              </label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDocDialogOpen(false)}>Annuler</Button>
            <Button disabled={!docFile || uploadDoc.isPending} onClick={handleUploadDoc} className="bg-secondary hover:bg-secondary/90">
              {uploadDoc.isPending ? <Loader2 size={14} className="animate-spin mr-1.5" /> : <Upload size={14} className="mr-1.5" />}
              Ajouter
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
              onClick={() => deleteDocId !== null && deleteDoc.mutate(deleteDocId, {
                onSuccess: () => { setDeleteDocId(null); toast({ title: "Document supprimé" }); },
              })}
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
}
