import { useState, useRef } from "react";
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
} from "lucide-react";
import {
  useFreelanceProfile,
  useUpdateFreelanceProfile,
  useUpdateProfilePicture,
  useFreelanceDocuments,
  useUploadDocument,
  useDeleteDocument,
} from "@/hooks/useProfile";
import type { FreelanceProfilePatchRequest, FreelanceDocTypeEnum } from "@/types";
import { ApiError } from "@/services/api.service";

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
  };
}

function EditProfileDialog({ open, onOpenChange, initialValues }: EditProfileDialogProps) {
  const [form, setForm] = useState(initialValues);
  const [error, setError] = useState("");
  const update = useUpdateFreelanceProfile();

  // Reset form when dialog opens with fresh values
  const handleOpenChange = (v: boolean) => {
    if (v) setForm(initialValues);
    setError("");
    onOpenChange(v);
  };

  const set = (field: keyof typeof form, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSave = async () => {
    setError("");
    const payload: FreelanceProfilePatchRequest = {
      bio: form.bio || undefined,
      hourly_rate: form.hourly_rate || null,
      country: form.country || undefined,
      city_or_region: form.city_or_region || undefined,
      postal_code: form.postal_code || undefined,
      phone: form.phone || undefined,
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

// ── Main Page ──────────────────────────────────────────────────────────────────

const Profile = () => {
  const { data: profile, isLoading } = useFreelanceProfile();
  const { data: docsData, isLoading: docsLoading } = useFreelanceDocuments();
  const updatePicture = useUpdateProfilePicture();
  const deleteDoc = useDeleteDocument();

  const [editOpen, setEditOpen] = useState(false);
  const [uploadDocOpen, setUploadDocOpen] = useState(false);
  const [deleteDocId, setDeleteDocId] = useState<number | null>(null);

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
              onChangePicture={(file) => updatePicture.mutate(file)}
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
      <EditProfileDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        initialValues={editInitialValues}
      />

      <UploadDocumentDialog
        open={uploadDocOpen}
        onOpenChange={setUploadDocOpen}
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
    </DashboardLayout>
  );
};

export default Profile;
