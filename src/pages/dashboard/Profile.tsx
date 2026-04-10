import { useState, useRef, useEffect } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  MapPin,
  Mail,
  Phone,
  Briefcase,
  Loader2,
  Coins,
  Pencil,
  Camera,
  FileText,
  Trash2,
  Upload,
  ExternalLink,
  CalendarDays,
  User,
  Trophy,
  Star,
  BarChart2,
  Eye,
  Plus,
  Link as LinkIcon,
  Award,
  X,
} from "lucide-react";
import {
  useFreelanceProfile,
  useUpdateFreelanceProfile,
  useUpdateProfilePicture,
  useFreelanceDocuments,
  useUploadDocument,
  useDeleteDocument,
  usePatchFreelanceDocument,
  usePortfolioItems,
  useCreatePortfolioItem,
  usePatchPortfolioItem,
  useDeletePortfolioItem,
  useCertifications,
  useCreateCertification,
  usePatchCertification,
  useDeleteCertification,
} from "@/hooks/useProfile";
import { useSkills, useSpecialities, useSkillsBySpeciality } from "@/hooks/useSkills";
import { useProviderRank, useProviderReviews, usePortfolio } from "@/hooks/useRankings";
import { PublicProfileSheet } from "@/components/dashboard/PublicProfileSheet";
import type { FreelanceProfilePatchRequest, FreelanceDocTypeEnum, ApiFreelanceDocument, StarsEnum, ApiPortfolioItemCustom, ApiCertification } from "@/types";
import { ApiError } from "@/services/api.service";
import { toast } from "@/hooks";

// ── Constants ──────────────────────────────────────────────────────────────────

const DOC_TYPE_LABELS: Record<FreelanceDocTypeEnum, string> = {
  CV: "CV",
  CERTIFICATION: "Certification",
  PORTFOLIO: "Portfolio",
  IDENTITY: "Pièce d'identité",
  OTHER: "Autre",
  RCCM: "RCCM",
  STATUTES: "Statuts",
  TAX: "Attestation fiscale",
};

const DOC_TYPES = Object.entries(DOC_TYPE_LABELS) as [FreelanceDocTypeEnum, string][];

// ── Subcomponents ──────────────────────────────────────────────────────────────

function ProfileAvatar({
  src,
  name,
  onChangePicture,
  isUploading,
}: {
  src: string | null;
  name: string;
  onChangePicture: (file: File) => void;
  isUploading: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onChangePicture(file);
    e.target.value = "";
  };

  return (
    <div className="relative w-28 h-28 flex-shrink-0">
      {src ? (
        <img
          src={src}
          alt={name}
          className="w-28 h-28 rounded-full object-cover border-4 border-background shadow"
        />
      ) : (
        <div className="w-28 h-28 rounded-full bg-primary/10 border-4 border-background shadow flex items-center justify-center text-3xl font-bold text-primary">
          {name.charAt(0).toUpperCase()}
        </div>
      )}
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={isUploading}
        className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow hover:bg-primary/90 transition-colors disabled:opacity-60"
        title="Changer la photo"
      >
        {isUploading ? (
          <Loader2 size={14} className="animate-spin" />
        ) : (
          <Camera size={14} />
        )}
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
}

// ── Edit Profile Dialog ────────────────────────────────────────────────────────

interface EditProfileDialogProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  initialValues: {
    first_name: string;
    last_name: string;
    business_name: string;
    bio: string;
    hourly_rate: string;
    country: string;
    city_or_region: string;
    postal_code: string;
    phone: string;
    skill_ids: number[];
    speciality_id: number | null;
    is_available: boolean;
    available_from: string;
  };
}

function EditProfileDialog({ open, onOpenChange, initialValues }: EditProfileDialogProps) {
  const [form, setForm] = useState(initialValues);
  const [error, setError] = useState("");
  const update = useUpdateFreelanceProfile();
  const { data: skillsData } = useSkills();
  const { data: specialitiesData } = useSpecialities();
  const { data: specialityData } = useSkillsBySpeciality(form.speciality_id);
  const allSkills = skillsData?.results ?? [];
  const allSpecialities = specialitiesData?.results ?? [];
  const availableSkills = form.speciality_id
    ? (specialityData?.skills ?? [])
    : allSkills;

  // Reset form when dialog opens with fresh values
  const handleOpenChange = (v: boolean) => {
    if (v) setForm(initialValues);
    setError("");
    onOpenChange(v);
  };

  const set = (field: keyof typeof form, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const toggleSkill = (id: number) => {
    setForm((prev) => ({
      ...prev,
      skill_ids: prev.skill_ids.includes(id)
        ? prev.skill_ids.filter((s) => s !== id)
        : [...prev.skill_ids, id],
    }));
  };

  const handleSave = async () => {
    setError("");
    const payload: FreelanceProfilePatchRequest = {
      bio: form.bio || undefined,
      hourly_rate: form.hourly_rate || null,
      country: form.country || undefined,
      city_or_region: form.city_or_region || undefined,
      postal_code: form.postal_code || undefined,
      phone: form.phone || undefined,
      skill_ids: form.skill_ids,
      speciality_id: form.speciality_id,
      is_available: form.is_available,
      available_from: form.available_from || null,
      freelance: {
        first_name: form.first_name,
        last_name: form.last_name,
        business_name: form.business_name || undefined,
      },
    };

    try {
      await update.mutateAsync(payload);
      onOpenChange(false);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Une erreur est survenue.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Modifier le profil</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="identity" className="mt-2">
          <TabsList className="w-full">
            <TabsTrigger value="identity" className="flex-1">Identité</TabsTrigger>
            <TabsTrigger value="professional" className="flex-1">Professionnel</TabsTrigger>
            <TabsTrigger value="location" className="flex-1">Localisation</TabsTrigger>
            <TabsTrigger value="skills" className="flex-1">Compétences</TabsTrigger>
          </TabsList>

          {/* ── Identity ── */}
          <TabsContent value="identity" className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="first_name">Prénom *</Label>
                <Input
                  id="first_name"
                  value={form.first_name}
                  onChange={(e) => set("first_name", e.target.value)}
                  maxLength={80}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="last_name">Nom *</Label>
                <Input
                  id="last_name"
                  value={form.last_name}
                  onChange={(e) => set("last_name", e.target.value)}
                  maxLength={80}
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="business_name">Nom commercial <span className="text-muted-foreground text-xs">(optionnel)</span></Label>
              <Input
                id="business_name"
                value={form.business_name}
                onChange={(e) => set("business_name", e.target.value)}
                maxLength={120}
                placeholder="Nom de votre entreprise ou activité"
              />
            </div>
          </TabsContent>

          {/* ── Professional ── */}
          <TabsContent value="professional" className="space-y-4 mt-4">
            <div className="space-y-1.5">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                value={form.bio}
                onChange={(e) => set("bio", e.target.value)}
                rows={5}
                placeholder="Décrivez votre expertise et votre expérience…"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="hourly_rate">Taux horaire (GNF) <span className="text-muted-foreground text-xs">(optionnel)</span></Label>
              <Input
                id="hourly_rate"
                type="number"
                min="0"
                step="0.01"
                value={form.hourly_rate}
                onChange={(e) => set("hourly_rate", e.target.value)}
                placeholder="Ex: 15000"
              />
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg border bg-muted/20">
              <div>
                <p className="text-sm font-medium">Disponible pour de nouveaux projets</p>
                <p className="text-xs text-muted-foreground mt-0.5">Visible sur votre profil public</p>
              </div>
              <button
                type="button"
                onClick={() => setForm((prev) => ({ ...prev, is_available: !prev.is_available }))}
                className={`relative inline-flex h-5 w-9 rounded-full transition-colors focus:outline-none ${form.is_available ? "bg-primary" : "bg-muted-foreground/30"}`}
              >
                <span className={`inline-block h-4 w-4 rounded-full bg-white shadow transform transition-transform mt-0.5 ${form.is_available ? "translate-x-4" : "translate-x-0.5"}`} />
              </button>
            </div>
            {form.is_available && (
              <div className="space-y-1.5">
                <Label htmlFor="available_from">Disponible à partir du <span className="text-muted-foreground text-xs">(optionnel)</span></Label>
                <Input
                  id="available_from"
                  type="date"
                  value={form.available_from}
                  onChange={(e) => set("available_from", e.target.value)}
                />
              </div>
            )}
          </TabsContent>

          {/* ── Location ── */}
          <TabsContent value="location" className="space-y-4 mt-4">
            <div className="space-y-1.5">
              <Label htmlFor="country">Pays *</Label>
              <Input
                id="country"
                value={form.country}
                onChange={(e) => set("country", e.target.value)}
                maxLength={120}
                placeholder="Ex: Guinée"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="city_or_region">Ville ou région *</Label>
              <Input
                id="city_or_region"
                value={form.city_or_region}
                onChange={(e) => set("city_or_region", e.target.value)}
                maxLength={120}
                placeholder="Ex: Conakry"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="postal_code">Code postal <span className="text-muted-foreground text-xs">(optionnel)</span></Label>
                <Input
                  id="postal_code"
                  value={form.postal_code}
                  onChange={(e) => set("postal_code", e.target.value)}
                  maxLength={20}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="phone">Téléphone <span className="text-muted-foreground text-xs">(optionnel)</span></Label>
                <Input
                  id="phone"
                  type="tel"
                  value={form.phone}
                  onChange={(e) => set("phone", e.target.value)}
                  maxLength={30}
                  placeholder="+224 XXX XXX XXX"
                />
              </div>
            </div>
          </TabsContent>

          {/* ── Skills & Speciality ── */}
          <TabsContent value="skills" className="space-y-5 mt-4">
            <div className="space-y-1.5">
              <Label>Spécialité</Label>
              <Select
                value={form.speciality_id ? String(form.speciality_id) : ""}
                onValueChange={(v) =>
                  setForm((prev) => ({ ...prev, speciality_id: v ? Number(v) : null, skill_ids: [] }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choisir une spécialité" />
                </SelectTrigger>
                <SelectContent>
                  {allSpecialities.map((sp) => (
                    <SelectItem key={sp.id} value={String(sp.id)}>
                      {sp.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Compétences</Label>
              {!form.speciality_id ? (
                <p className="text-sm text-muted-foreground">Sélectionnez une spécialité pour voir les compétences disponibles.</p>
              ) : availableSkills.length === 0 ? (
                <p className="text-sm text-muted-foreground">Chargement des compétences…</p>
              ) : (
                <div className="flex flex-wrap gap-2 max-h-52 overflow-y-auto p-1">
                  {availableSkills.map((skill) => {
                    const selected = form.skill_ids.includes(skill.id);
                    return (
                      <button
                        key={skill.id}
                        type="button"
                        onClick={() => toggleSkill(skill.id)}
                        className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                          selected
                            ? "bg-primary text-primary-foreground border-primary"
                            : "bg-background text-muted-foreground border-border hover:border-primary/50"
                        }`}
                      >
                        {skill.name}
                      </button>
                    );
                  })}
                </div>
              )}
              {form.skill_ids.length > 0 && (
                <p className="text-xs text-muted-foreground">
                  {form.skill_ids.length} compétence{form.skill_ids.length > 1 ? "s" : ""} sélectionnée{form.skill_ids.length > 1 ? "s" : ""}
                </p>
              )}
            </div>
          </TabsContent>
        </Tabs>

        {error && (
          <p className="text-sm text-destructive mt-2">{error}</p>
        )}

        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Annuler
          </Button>
          <Button onClick={handleSave} disabled={update.isPending}>
            {update.isPending && <Loader2 size={16} className="animate-spin mr-2" />}
            Enregistrer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ── Upload Document Dialog ─────────────────────────────────────────────────────

function UploadDocumentDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const [docType, setDocType] = useState<FreelanceDocTypeEnum | "">("");
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [error, setError] = useState("");
  const upload = useUploadDocument();

  const reset = () => {
    setDocType("");
    setFile(null);
    setTitle("");
    setError("");
  };

  const handleOpenChange = (v: boolean) => {
    if (!v) reset();
    onOpenChange(v);
  };

  const handleSubmit = async () => {
    if (!docType || !file) {
      setError("Le type et le fichier sont obligatoires.");
      return;
    }
    setError("");
    const formData = new FormData();
    formData.append("doc_type", docType);
    formData.append("file", file);
    if (title.trim()) formData.append("title", title.trim());

    try {
      await upload.mutateAsync(formData);
      handleOpenChange(false);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Erreur lors de l'envoi.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Ajouter un document</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-2">
          <div className="space-y-1.5">
            <Label>Type de document *</Label>
            <Select value={docType} onValueChange={(v) => setDocType(v as FreelanceDocTypeEnum)}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un type" />
              </SelectTrigger>
              <SelectContent>
                {DOC_TYPES.map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label>Fichier *</Label>
            <div className="flex items-center gap-3">
              <label className="flex-1 flex items-center gap-2 h-10 px-3 rounded-md border border-input bg-background cursor-pointer hover:bg-muted/50 transition-colors text-sm text-muted-foreground">
                <Upload size={16} className="flex-shrink-0" />
                <span className="truncate">{file ? file.name : "Choisir un fichier…"}</span>
                <input
                  type="file"
                  className="hidden"
                  onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                />
              </label>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="doc_title">Titre <span className="text-muted-foreground text-xs">(optionnel)</span></Label>
            <Input
              id="doc_title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={120}
              placeholder="Ex: CV 2024"
            />
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}
        </div>

        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={() => handleOpenChange(false)}>
            Annuler
          </Button>
          <Button onClick={handleSubmit} disabled={upload.isPending}>
            {upload.isPending && <Loader2 size={16} className="animate-spin mr-2" />}
            Envoyer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ── Edit Document Dialog ────────────────────────────────────────────────────────

function EditFreelanceDocumentDialog({
  open,
  onOpenChange,
  doc,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  doc: ApiFreelanceDocument | null;
}) {
  const [docType, setDocType] = useState<FreelanceDocTypeEnum | "">("");
  const [title, setTitle] = useState("");
  const [referenceNumber, setReferenceNumber] = useState("");
  const [issuedAt, setIssuedAt] = useState("");
  const [newFile, setNewFile] = useState<File | null>(null);
  const [error, setError] = useState("");
  const patch = usePatchFreelanceDocument();

  useEffect(() => {
    if (doc) {
      setDocType(doc.doc_type);
      setTitle(doc.title ?? "");
      setReferenceNumber(doc.reference_number ?? "");
      setIssuedAt(doc.issued_at ?? "");
      setNewFile(null);
      setError("");
    }
  }, [doc]);

  const handleOpenChange = (v: boolean) => {
    if (!v) setError("");
    onOpenChange(v);
  };

  const handleSave = async () => {
    if (!doc || !docType) {
      setError("Le type de document est obligatoire.");
      return;
    }
    setError("");
    try {
      await patch.mutateAsync({
        id: doc.id,
        data: {
          doc_type: docType as FreelanceDocTypeEnum,
          title: title || undefined,
          reference_number: referenceNumber || undefined,
          issued_at: issuedAt || null,
          file: newFile ?? undefined,
        },
      });
      handleOpenChange(false);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Erreur lors de la mise à jour.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Modifier le document</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-2">
          <div className="space-y-1.5">
            <Label>Type de document *</Label>
            <Select value={docType} onValueChange={(v) => setDocType(v as FreelanceDocTypeEnum)}>
              <SelectTrigger><SelectValue placeholder="Sélectionner un type" /></SelectTrigger>
              <SelectContent>
                {DOC_TYPES.map(([value, label]) => (
                  <SelectItem key={value} value={value}>{label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="edit-doc-title">
              Titre <span className="text-muted-foreground text-xs">(optionnel)</span>
            </Label>
            <Input
              id="edit-doc-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={120}
              placeholder="Ex: CV 2024"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="edit-doc-ref">
              Numéro de référence <span className="text-muted-foreground text-xs">(optionnel)</span>
            </Label>
            <Input
              id="edit-doc-ref"
              value={referenceNumber}
              onChange={(e) => setReferenceNumber(e.target.value)}
              maxLength={60}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="edit-doc-issued">
              Date d'émission <span className="text-muted-foreground text-xs">(optionnel)</span>
            </Label>
            <Input
              id="edit-doc-issued"
              type="date"
              value={issuedAt}
              onChange={(e) => setIssuedAt(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label>
              Remplacer le fichier <span className="text-muted-foreground text-xs">(optionnel)</span>
            </Label>
            <label className="flex items-center gap-2 h-10 px-3 rounded-md border border-input bg-background cursor-pointer hover:bg-muted/50 transition-colors text-sm text-muted-foreground">
              <Upload size={16} className="flex-shrink-0" />
              <span className="truncate">{newFile ? newFile.name : "Garder le fichier actuel"}</span>
              <input type="file" className="hidden" onChange={(e) => setNewFile(e.target.files?.[0] ?? null)} />
            </label>
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
        </div>
        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={() => handleOpenChange(false)}>Annuler</Button>
          <Button onClick={handleSave} disabled={patch.isPending}>
            {patch.isPending && <Loader2 size={16} className="animate-spin mr-2" />}
            Enregistrer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────────

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

const Profile = () => {
  const { data: profile, isLoading } = useFreelanceProfile();
  const { data: docsData, isLoading: docsLoading } = useFreelanceDocuments();
  const { data: rank } = useProviderRank(profile?.id);
  const { data: reviewsData } = useProviderReviews(profile?.id);
  const { data: portfolioData } = usePortfolio(profile?.id);
  const { data: portfolioItemsData } = usePortfolioItems(profile?.id);
  const { data: certificationsData } = useCertifications(profile?.id);
  const updatePicture = useUpdateProfilePicture();
  const deleteDoc = useDeleteDocument();

  const createPortfolioItem = useCreatePortfolioItem(profile?.id);
  const patchPortfolioItem = usePatchPortfolioItem(profile?.id);
  const deletePortfolioItem = useDeletePortfolioItem(profile?.id);
  const createCertification = useCreateCertification(profile?.id);
  const patchCertification = usePatchCertification(profile?.id);
  const deleteCertification = useDeleteCertification(profile?.id);

  const [portfolioDialogOpen, setPortfolioDialogOpen] = useState(false);
  const [portfolioEditing, setPortfolioEditing] = useState<ApiPortfolioItemCustom | null>(null);
  const [certDialogOpen, setCertDialogOpen] = useState(false);
  const [certEditing, setCertEditing] = useState<ApiCertification | null>(null);

  const portfolioItems = portfolioItemsData?.results ?? [];
  const certifications = certificationsData?.results ?? [];

  const totalReviews = reviewsData?.count ?? 0;
  const avgRating = totalReviews > 0
    ? (reviewsData?.results ?? []).reduce((sum, r) => sum + r.rating, 0) / (reviewsData?.results.length ?? 1)
    : null;

  const [editOpen, setEditOpen] = useState(false);
  const [uploadDocOpen, setUploadDocOpen] = useState(false);
  const [deleteDocId, setDeleteDocId] = useState<number | null>(null);
  const [editDocId, setEditDocId] = useState<number | null>(null);
  const [publicProfileOpen, setPublicProfileOpen] = useState(false);

  // ── Loading state ──
  if (isLoading) {
    return (
      <DashboardLayout userType="freelancer">
        <div className="flex justify-center py-20">
          <Loader2 className="animate-spin text-primary" size={40} />
        </div>
      </DashboardLayout>
    );
  }

  if (!profile) {
    return (
      <DashboardLayout userType="freelancer">
        <div className="text-center py-20">
          <p className="text-muted-foreground">Impossible de charger le profil.</p>
        </div>
      </DashboardLayout>
    );
  }

  // ── Derived values ──
  const profileName =
    `${profile.freelance_details?.first_name || ""} ${profile.freelance_details?.last_name || ""}`.trim() ||
    profile.username;
  const profileLocation = [profile.city_or_region, profile.country].filter(Boolean).join(", ");
  const documents = docsData?.results ?? [];

  // ── Edit initial values ──
  const editInitialValues = {
    first_name: profile.freelance_details?.first_name ?? "",
    last_name: profile.freelance_details?.last_name ?? "",
    business_name: profile.freelance_details?.business_name ?? "",
    bio: profile.bio ?? "",
    hourly_rate: profile.hourly_rate ?? "",
    country: profile.country ?? "",
    city_or_region: profile.city_or_region ?? "",
    postal_code: profile.postal_code ?? "",
    phone: profile.phone ?? "",
    skill_ids: profile.skills?.map((s) => s.id) ?? [],
    speciality_id: profile.speciality?.id ?? null,
    is_available: profile.is_available ?? true,
    available_from: profile.available_from ?? "",
  };

  return (
    <DashboardLayout userType="freelancer">
      <div className="space-y-6">

        {/* ── Page header ── */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Mon Profil</h1>
            <p className="text-muted-foreground text-sm mt-0.5">Vos informations professionnelles</p>
          </div>
          <Button onClick={() => setEditOpen(true)} className="gap-2">
            <Pencil size={16} />
            Modifier
          </Button>
        </div>

        {/* ── Profile header card ── */}
        <Card className="p-6">
          <div className="flex flex-col sm:flex-row gap-5 items-start">
            <ProfileAvatar
              src={profile.profile_picture}
              name={profileName}
              onChangePicture={(file) =>
                updatePicture.mutate(
                  {
                    file,
                    freelance: {
                      first_name: profile.freelance_details?.first_name ?? "",
                      last_name: profile.freelance_details?.last_name ?? "",
                      business_name: profile.freelance_details?.business_name,
                    },
                  },
                  {
                    onSuccess: () =>
                      toast({ title: "Photo mise à jour avec succès." }),
                    onError: (err) =>
                      toast({
                        title: "Échec du téléchargement",
                        description:
                          err instanceof ApiError
                            ? err.message
                            : "Une erreur est survenue. Veuillez réessayer.",
                        variant: "destructive",
                      }),
                  },
                )
              }
              isUploading={updatePicture.isPending}
            />
            <div className="flex-1 min-w-0">
              <h2 className="text-xl font-bold truncate">{profileName}</h2>
              <p className="text-muted-foreground text-sm mb-3">
                {profile.speciality?.name ?? "Freelancer"}
              </p>
              <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                {profileLocation && (
                  <div className="flex items-center gap-1.5">
                    <MapPin size={14} />
                    <span>{profileLocation}</span>
                  </div>
                )}
                <div className="flex items-center gap-1.5">
                  <Briefcase size={14} />
                  <span>Freelancer</span>
                </div>
                {profile.hourly_rate && (
                  <div className="flex items-center gap-1.5">
                    <Coins size={14} />
                    <span>
                      {parseFloat(profile.hourly_rate).toLocaleString("fr-FR")} GNF/h
                    </span>
                  </div>
                )}
              </div>
              {profile.freelance_details?.business_name && (
                <p className="text-xs text-muted-foreground mt-2">
                  Entreprise : {profile.freelance_details.business_name}
                </p>
              )}
            </div>
          </div>
        </Card>

        {/* ── Body grid ── */}
        <div className="grid lg:grid-cols-3 gap-6">

          {/* ── Left column ── */}
          <div className="lg:col-span-2 space-y-6">

            {/* Bio */}
            <Card className="p-6">
              <h3 className="text-base font-semibold mb-3">À propos</h3>
              {profile.bio ? (
                <p className="text-sm text-muted-foreground whitespace-pre-line leading-relaxed">
                  {profile.bio}
                </p>
              ) : (
                <p className="text-sm text-muted-foreground italic">
                  Aucune biographie renseignée.{" "}
                  <button
                    type="button"
                    onClick={() => setEditOpen(true)}
                    className="text-primary underline-offset-2 hover:underline"
                  >
                    Ajouter
                  </button>
                </p>
              )}
            </Card>

            {/* Skills */}
            {profile.skills.length > 0 && (
              <Card className="p-6">
                <h3 className="text-base font-semibold mb-3">Compétences</h3>
                <div className="flex flex-wrap gap-2">
                  {profile.skills.map((skill) => (
                    <Badge key={skill.id} variant="secondary" className="text-xs py-1 px-2.5">
                      {skill.name}
                    </Badge>
                  ))}
                </div>
              </Card>
            )}

            {/* Portfolio items personnels */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-semibold flex items-center gap-2">
                  <Briefcase size={16} className="text-primary" />
                  Portfolio personnel
                </h3>
                <Button
                  size="sm"
                  variant="outline"
                  className="gap-1.5"
                  onClick={() => { setPortfolioEditing(null); setPortfolioDialogOpen(true); }}
                >
                  <Plus size={14} />
                  Ajouter
                </Button>
              </div>

              {portfolioItems.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground text-sm">
                  <Briefcase size={32} className="mx-auto mb-2 opacity-30" />
                  <p>Aucun item de portfolio personnel.</p>
                  <p className="text-xs mt-1 opacity-70">Ajoutez des projets, réalisations ou travaux personnels.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {portfolioItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-start gap-3 p-3 rounded-lg border bg-muted/20 hover:bg-muted/40 transition-colors"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{item.title}</p>
                        {item.description && (
                          <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{item.description}</p>
                        )}
                        {item.skills.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1.5">
                            {item.skills.map((s) => (
                              <span key={s.id} className="text-[10px] px-1.5 py-0.5 bg-primary/8 text-primary rounded-full">{s.name}</span>
                            ))}
                          </div>
                        )}
                        <div className="flex items-center gap-3 mt-1.5 text-[10px] text-muted-foreground">
                          {item.url && (
                            <a href={item.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-primary">
                              <LinkIcon size={9} /> Lien
                            </a>
                          )}
                          {item.file && (
                            <a href={item.file} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-primary">
                              <FileText size={9} /> Fichier
                            </a>
                          )}
                          <span>{new Date(item.created_at).toLocaleDateString("fr-FR", { month: "short", year: "numeric" })}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <button
                          type="button"
                          onClick={() => { setPortfolioEditing(item); setPortfolioDialogOpen(true); }}
                          className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                          title="Modifier"
                        >
                          <Pencil size={13} />
                        </button>
                        <button
                          type="button"
                          onClick={() => deletePortfolioItem.mutate(item.id, {
                            onSuccess: () => toast({ title: "Item supprimé." }),
                          })}
                          className="p-1.5 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                          title="Supprimer"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>

            {/* Certifications */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-semibold flex items-center gap-2">
                  <Award size={16} className="text-primary" />
                  Certifications
                </h3>
                <Button
                  size="sm"
                  variant="outline"
                  className="gap-1.5"
                  onClick={() => { setCertEditing(null); setCertDialogOpen(true); }}
                >
                  <Plus size={14} />
                  Ajouter
                </Button>
              </div>

              {certifications.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground text-sm">
                  <Award size={32} className="mx-auto mb-2 opacity-30" />
                  <p>Aucune certification renseignée.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {certifications.map((cert) => (
                    <div
                      key={cert.id}
                      className="flex items-start gap-3 p-3 rounded-lg border bg-muted/20 hover:bg-muted/40 transition-colors"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium">{cert.name}</p>
                        <p className="text-xs text-muted-foreground">{cert.issuer}</p>
                        <div className="flex items-center gap-3 mt-1 text-[10px] text-muted-foreground">
                          {cert.issued_at && (
                            <span>Obtenue : {new Date(cert.issued_at).toLocaleDateString("fr-FR", { month: "short", year: "numeric" })}</span>
                          )}
                          {cert.expires_at && (
                            <span>Expire : {new Date(cert.expires_at).toLocaleDateString("fr-FR", { month: "short", year: "numeric" })}</span>
                          )}
                          {cert.file && (
                            <a href={cert.file} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-primary">
                              <FileText size={9} /> Certificat
                            </a>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <button
                          type="button"
                          onClick={() => { setCertEditing(cert); setCertDialogOpen(true); }}
                          className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                          title="Modifier"
                        >
                          <Pencil size={13} />
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteCertification.mutate(cert.id, {
                            onSuccess: () => toast({ title: "Certification supprimée." }),
                          })}
                          className="p-1.5 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                          title="Supprimer"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>

            {/* Documents */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-semibold">Documents</h3>
                <Button
                  size="sm"
                  variant="outline"
                  className="gap-1.5"
                  onClick={() => setUploadDocOpen(true)}
                >
                  <Upload size={14} />
                  Ajouter
                </Button>
              </div>

              {docsLoading ? (
                <div className="flex justify-center py-6">
                  <Loader2 className="animate-spin text-muted-foreground" size={24} />
                </div>
              ) : documents.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground text-sm">
                  <FileText size={32} className="mx-auto mb-2 opacity-30" />
                  <p>Aucun document déposé.</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {documents.map((doc) => (
                    <div
                      key={doc.id}
                      className="flex items-center gap-3 p-3 rounded-lg border bg-muted/30 hover:bg-muted/50 transition-colors"
                    >
                      <FileText size={18} className="text-muted-foreground flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {doc.title || DOC_TYPE_LABELS[doc.doc_type]}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {DOC_TYPE_LABELS[doc.doc_type]}
                          {doc.issued_at && (
                            <> · {new Date(doc.issued_at).toLocaleDateString("fr-FR")}</>
                          )}
                        </p>
                      </div>
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <a
                          href={doc.file}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                          title="Ouvrir"
                        >
                          <ExternalLink size={14} />
                        </a>
                        <button
                          type="button"
                          onClick={() => setEditDocId(doc.id)}
                          className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                          title="Modifier"
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteDocId(doc.id)}
                          className="p-1.5 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                          title="Supprimer"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>

          {/* ── Right column ── */}
          <div className="space-y-6">

            {/* Public profile preview */}
            {profile?.id && (
              <button
                type="button"
                onClick={() => setPublicProfileOpen(true)}
                className="flex items-center justify-between w-full p-4 rounded-xl border border-border bg-white hover:border-primary/40 hover:bg-primary/5 transition-colors group text-left"
              >
                <div>
                  <p className="text-sm font-semibold text-foreground">Voir mon profil public</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Tel qu'il apparaît aux clients</p>
                </div>
                <Eye size={16} className="text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
              </button>
            )}

            {/* Ranking & reputation */}
            {(rank || totalReviews > 0 || portfolioData?.summary?.total_completed) ? (
              <Card className="p-5">
                <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
                  <BarChart2 size={15} className="text-primary" />
                  Réputation publique
                </h3>
                <div className="space-y-3">
                  {/* Ranking */}
                  {rank && (
                    <>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground flex items-center gap-1.5">
                          <Trophy size={13} className="text-cta" />
                          Classement
                        </span>
                        <span className="font-bold text-primary">#{rank.position}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Score</span>
                        <span className="font-bold text-cta">{parseFloat(rank.score).toFixed(2)}</span>
                      </div>
                      {rank.stars > 0 && (
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Étoiles</span>
                          <span className="inline-flex gap-0.5">
                            {Array.from({ length: rank.stars as number }).map((_, i) => (
                              <Star key={i} size={12} className="fill-cta text-cta" />
                            ))}
                          </span>
                        </div>
                      )}
                      {rank.tier !== "FREE" && (
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Niveau</span>
                          <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${TIER_COLORS[rank.tier]}`}>
                            {TIER_LABELS[rank.tier]}
                          </span>
                        </div>
                      )}
                      <div className="border-t border-border pt-3 mt-1" />
                    </>
                  )}

                  {/* Reviews */}
                  {totalReviews > 0 && (
                    <>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground flex items-center gap-1.5">
                          <Star size={13} className="text-cta" />
                          Avis clients
                        </span>
                        <span className="font-semibold">{totalReviews}</span>
                      </div>
                      {avgRating !== null && (
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Note moyenne</span>
                          <span className="font-bold">{avgRating.toFixed(1)} / 5</span>
                        </div>
                      )}
                    </>
                  )}

                  {/* Portfolio */}
                  {portfolioData?.summary?.total_completed > 0 && (
                    <>
                      {totalReviews > 0 && <div className="border-t border-border pt-3 mt-1" />}
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Missions terminées</span>
                        <span className="font-semibold">{portfolioData.summary.total_completed}</span>
                      </div>
                      {portfolioData.summary.average_rating !== null && (
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Note portfolio</span>
                          <span className="font-bold">{portfolioData.summary.average_rating.toFixed(1)} / 5</span>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </Card>
            ) : null}

            {/* Personal info */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-semibold">Informations personnelles</h3>
                <button
                  type="button"
                  onClick={() => setEditOpen(true)}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  title="Modifier"
                >
                  <Pencil size={14} />
                </button>
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-2">
                  <User size={14} className="text-muted-foreground mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">{profileName}</p>
                    {profile.freelance_details?.business_name && (
                      <p className="text-muted-foreground text-xs">
                        {profile.freelance_details.business_name}
                      </p>
                    )}
                  </div>
                </div>
                <Separator />
                <div className="flex items-center gap-2">
                  <Mail size={14} className="text-muted-foreground flex-shrink-0" />
                  <span className="truncate">{profile.email}</span>
                </div>
                {profile.phone && (
                  <div className="flex items-center gap-2">
                    <Phone size={14} className="text-muted-foreground flex-shrink-0" />
                    <span>{profile.phone}</span>
                  </div>
                )}
                {profileLocation && (
                  <div className="flex items-start gap-2">
                    <MapPin size={14} className="text-muted-foreground flex-shrink-0 mt-0.5" />
                    <span>{profileLocation}</span>
                  </div>
                )}
                {profile.postal_code && (
                  <p className="text-xs text-muted-foreground pl-5">
                    CP : {profile.postal_code}
                  </p>
                )}
              </div>
            </Card>

            {/* Account info */}
            <Card className="p-6">
              <h3 className="text-base font-semibold mb-4">Compte</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <User size={14} className="flex-shrink-0" />
                  <span className="font-mono text-foreground">@{profile.username}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <CalendarDays size={14} className="flex-shrink-0" />
                  <span>
                    Membre depuis{" "}
                    {new Date(profile.created_at).toLocaleDateString("fr-FR", {
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                </div>
                <div className="text-xs text-muted-foreground pl-5">
                  Mis à jour le{" "}
                  {new Date(profile.updated_at).toLocaleDateString("fr-FR")}
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* ── Dialogs ── */}
      {profile?.id && (
        <PublicProfileSheet
          userId={profile.id}
          open={publicProfileOpen}
          onOpenChange={setPublicProfileOpen}
        />
      )}

      <EditProfileDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        initialValues={editInitialValues}
      />

      <UploadDocumentDialog
        open={uploadDocOpen}
        onOpenChange={setUploadDocOpen}
      />

      <EditFreelanceDocumentDialog
        open={editDocId !== null}
        onOpenChange={(v) => !v && setEditDocId(null)}
        doc={documents.find((d) => d.id === editDocId) ?? null}
      />

      <AlertDialog open={deleteDocId !== null} onOpenChange={(v) => !v && setDeleteDocId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer le document ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. Le document sera définitivement supprimé.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => {
                if (deleteDocId !== null) {
                  deleteDoc.mutate(deleteDocId);
                  setDeleteDocId(null);
                }
              }}
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      {/* ── Portfolio item dialog ── */}
      <PortfolioItemDialog
        open={portfolioDialogOpen}
        onOpenChange={setPortfolioDialogOpen}
        item={portfolioEditing}
        onCreate={(fd) => createPortfolioItem.mutate(fd, {
          onSuccess: () => { toast({ title: "Item ajouté." }); setPortfolioDialogOpen(false); },
        })}
        onUpdate={(id, fd) => patchPortfolioItem.mutate({ id, formData: fd }, {
          onSuccess: () => { toast({ title: "Item mis à jour." }); setPortfolioDialogOpen(false); },
        })}
        isPending={createPortfolioItem.isPending || patchPortfolioItem.isPending}
      />

      {/* ── Certification dialog ── */}
      <CertificationDialog
        open={certDialogOpen}
        onOpenChange={setCertDialogOpen}
        cert={certEditing}
        onCreate={(fd) => createCertification.mutate(fd, {
          onSuccess: () => { toast({ title: "Certification ajoutée." }); setCertDialogOpen(false); },
        })}
        onUpdate={(id, fd) => patchCertification.mutate({ id, formData: fd }, {
          onSuccess: () => { toast({ title: "Certification mise à jour." }); setCertDialogOpen(false); },
        })}
        isPending={createCertification.isPending || patchCertification.isPending}
      />
    </DashboardLayout>
  );
};

// ── Portfolio item dialog ──────────────────────────────────────────────────────

function PortfolioItemDialog({
  open,
  onOpenChange,
  item,
  onCreate,
  onUpdate,
  isPending,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  item: ApiPortfolioItemCustom | null;
  onCreate: (fd: FormData) => void;
  onUpdate: (id: number, fd: FormData) => void;
  isPending: boolean;
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [url, setUrl] = useState("");
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    if (open) {
      setTitle(item?.title ?? "");
      setDescription(item?.description ?? "");
      setUrl(item?.url ?? "");
      setFile(null);
    }
  }, [open, item]);

  const handleSubmit = () => {
    const fd = new FormData();
    fd.append("title", title.trim());
    fd.append("description", description.trim());
    if (url.trim()) fd.append("url", url.trim());
    if (file) fd.append("file", file);
    if (item) {
      onUpdate(item.id, fd);
    } else {
      onCreate(fd);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Briefcase size={15} className="text-primary" />
            {item ? "Modifier l'item" : "Ajouter un item de portfolio"}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-3 py-1">
          <div className="space-y-1.5">
            <Label>Titre *</Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Nom du projet ou réalisation" />
          </div>
          <div className="space-y-1.5">
            <Label>Description</Label>
            <Textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} placeholder="Décrivez ce projet…" className="resize-none" />
          </div>
          <div className="space-y-1.5">
            <Label>URL (lien)</Label>
            <Input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://…" />
          </div>
          <div className="space-y-1.5">
            <Label>Fichier</Label>
            <Input type="file" onChange={(e) => setFile(e.target.files?.[0] ?? null)} className="cursor-pointer" />
            {item?.file && !file && (
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <FileText size={11} />
                Fichier actuel — laissez vide pour conserver.
              </p>
            )}
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isPending}>Annuler</Button>
          <Button onClick={handleSubmit} disabled={isPending || !title.trim()} className="gap-2">
            {isPending && <Loader2 size={13} className="animate-spin" />}
            {item ? "Mettre à jour" : "Ajouter"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ── Certification dialog ───────────────────────────────────────────────────────

function CertificationDialog({
  open,
  onOpenChange,
  cert,
  onCreate,
  onUpdate,
  isPending,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  cert: ApiCertification | null;
  onCreate: (fd: FormData) => void;
  onUpdate: (id: number, fd: FormData) => void;
  isPending: boolean;
}) {
  const [name, setName] = useState("");
  const [issuer, setIssuer] = useState("");
  const [issuedAt, setIssuedAt] = useState("");
  const [expiresAt, setExpiresAt] = useState("");
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    if (open) {
      setName(cert?.name ?? "");
      setIssuer(cert?.issuer ?? "");
      setIssuedAt(cert?.issued_at ?? "");
      setExpiresAt(cert?.expires_at ?? "");
      setFile(null);
    }
  }, [open, cert]);

  const handleSubmit = () => {
    const fd = new FormData();
    fd.append("name", name.trim());
    fd.append("issuer", issuer.trim());
    if (issuedAt) fd.append("issued_at", issuedAt);
    if (expiresAt) fd.append("expires_at", expiresAt);
    if (file) fd.append("file", file);
    if (cert) {
      onUpdate(cert.id, fd);
    } else {
      onCreate(fd);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Award size={15} className="text-primary" />
            {cert ? "Modifier la certification" : "Ajouter une certification"}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-3 py-1">
          <div className="space-y-1.5">
            <Label>Nom de la certification *</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Ex: AWS Cloud Practitioner" />
          </div>
          <div className="space-y-1.5">
            <Label>Organisme émetteur *</Label>
            <Input value={issuer} onChange={(e) => setIssuer(e.target.value)} placeholder="Ex: Amazon Web Services" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Date d'obtention</Label>
              <Input type="date" value={issuedAt} onChange={(e) => setIssuedAt(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>Date d'expiration</Label>
              <Input type="date" value={expiresAt} onChange={(e) => setExpiresAt(e.target.value)} />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>Fichier (certificat PDF/image)</Label>
            <Input type="file" onChange={(e) => setFile(e.target.files?.[0] ?? null)} className="cursor-pointer" />
            {cert?.file && !file && (
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <FileText size={11} />
                Fichier actuel — laissez vide pour conserver.
              </p>
            )}
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isPending}>Annuler</Button>
          <Button onClick={handleSubmit} disabled={isPending || !name.trim() || !issuer.trim()} className="gap-2">
            {isPending && <Loader2 size={13} className="animate-spin" />}
            {cert ? "Mettre à jour" : "Ajouter"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default Profile;
