import { useState, useEffect } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { Loader2, User, MapPin, Phone, Pencil, Plus, FileText, Trash2, ExternalLink } from "lucide-react";
import {
  useClientProfile,
  useCreateClientProfile,
  useUpdateClientProfile,
  useClientCompanyDocuments,
  useUploadClientDocument,
  useDeleteClientDocument,
  usePatchClientDocument,
} from "@/hooks/useProfile";
import { useAuth } from "@/contexts/AuthContext";
import { ApiError } from "@/services/api.service";
import type { ClientProfileCreateRequest, PatchedClientProfileUpdateRequest, ApiClientCompanyDocument } from "@/types";

// ── Profile Form Dialog ───────────────────────────────────────────────────────

interface FormState {
  client_type: "INDIVIDUAL" | "COMPANY";
  first_name: string;
  last_name: string;
  company_name: string;
  city_or_region: string;
  country: string;
  postal_code: string;
  phone: string;
}

function ProfileFormDialog({
  open,
  onOpenChange,
  isEdit,
  initial,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  isEdit: boolean;
  initial?: FormState;
}) {
  const create = useCreateClientProfile();
  const update = useUpdateClientProfile();

  const [form, setForm] = useState<FormState>(
    initial ?? {
      client_type: "INDIVIDUAL",
      first_name: "",
      last_name: "",
      company_name: "",
      city_or_region: "",
      country: "",
      postal_code: "",
      phone: "",
    }
  );
  const [error, setError] = useState("");

  const isPending = create.isPending || update.isPending;

  const handleClose = () => {
    setError("");
    onOpenChange(false);
  };

  const handleSubmit = async () => {
    if (!form.city_or_region || !form.country) {
      setError("Ville/région et pays sont obligatoires.");
      return;
    }
    if (form.client_type === "INDIVIDUAL" && (!form.first_name || !form.last_name)) {
      setError("Prénom et nom sont obligatoires pour un particulier.");
      return;
    }
    if (form.client_type === "COMPANY" && !form.company_name) {
      setError("Le nom de l'entreprise est obligatoire.");
      return;
    }

    setError("");
    try {
      if (isEdit) {
        const payload: PatchedClientProfileUpdateRequest = {
          city_or_region: form.city_or_region,
          country: form.country,
          postal_code: form.postal_code || undefined,
          phone: form.phone || undefined,
          first_name: form.client_type === "INDIVIDUAL" ? form.first_name : undefined,
          last_name: form.client_type === "INDIVIDUAL" ? form.last_name : undefined,
          company_name: form.client_type === "COMPANY" ? form.company_name : undefined,
        };
        await update.mutateAsync(payload);
      } else {
        let payload: ClientProfileCreateRequest;
        if (form.client_type === "INDIVIDUAL") {
          payload = {
            client_type: "INDIVIDUAL",
            city_or_region: form.city_or_region,
            country: form.country,
            first_name: form.first_name,
            last_name: form.last_name,
            postal_code: form.postal_code || undefined,
            phone: form.phone || undefined,
          };
        } else {
          payload = {
            client_type: "COMPANY",
            city_or_region: form.city_or_region,
            country: form.country,
            company_name: form.company_name,
            postal_code: form.postal_code || undefined,
            phone: form.phone || undefined,
          };
        }
        await create.mutateAsync(payload);
      }
      handleClose();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Une erreur est survenue.");
    }
  };

  const set = (field: keyof FormState) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => setForm((f) => ({ ...f, [field]: e.target.value }));

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Modifier le profil" : "Créer mon profil"}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {!isEdit && (
            <div className="space-y-1.5">
              <Label>Type de compte *</Label>
              <Select
                value={form.client_type}
                onValueChange={(v) =>
                  setForm((f) => ({ ...f, client_type: v as "INDIVIDUAL" | "COMPANY" }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="INDIVIDUAL">Particulier</SelectItem>
                  <SelectItem value="COMPANY">Entreprise</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {form.client_type === "INDIVIDUAL" ? (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="cp-first">Prénom *</Label>
                <Input id="cp-first" value={form.first_name} onChange={set("first_name")} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="cp-last">Nom *</Label>
                <Input id="cp-last" value={form.last_name} onChange={set("last_name")} />
              </div>
            </div>
          ) : (
            <div className="space-y-1.5">
              <Label htmlFor="cp-company">Nom de l'entreprise *</Label>
              <Input id="cp-company" value={form.company_name} onChange={set("company_name")} />
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="cp-city">Ville / Région *</Label>
              <Input id="cp-city" value={form.city_or_region} onChange={set("city_or_region")} placeholder="Ex: Conakry" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="cp-country">Pays *</Label>
              <Input id="cp-country" value={form.country} onChange={set("country")} placeholder="Ex: GN" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="cp-postal">Code postal</Label>
              <Input id="cp-postal" value={form.postal_code} onChange={set("postal_code")} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="cp-phone">Téléphone</Label>
              <Input id="cp-phone" value={form.phone} onChange={set("phone")} placeholder="+224 6xx xxx xxx" />
            </div>
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>Annuler</Button>
          <Button onClick={handleSubmit} disabled={isPending} className="gap-2">
            {isPending && <Loader2 size={16} className="animate-spin" />}
            {isEdit ? "Enregistrer" : "Créer le profil"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ── Document Upload Dialog ────────────────────────────────────────────────────

function DocumentUploadDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const upload = useUploadClientDocument();
  const [docType, setDocType] = useState<"RCCM" | "LEGAL" | "OTHER">("RCCM");
  const [referenceNumber, setReferenceNumber] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState("");

  const handleClose = () => {
    setError("");
    setDocType("RCCM");
    setReferenceNumber("");
    setFile(null);
    onOpenChange(false);
  };

  const handleSubmit = async () => {
    if (!file) {
      setError("Veuillez sélectionner un fichier.");
      return;
    }
    setError("");
    try {
      const formData = new FormData();
      formData.append("doc_type", docType);
      formData.append("file", file);
      if (referenceNumber) formData.append("reference_number", referenceNumber);
      await upload.mutateAsync(formData);
      handleClose();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Erreur lors de l'upload.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Ajouter un document</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label>Type de document *</Label>
            <Select value={docType} onValueChange={(v) => setDocType(v as "RCCM" | "LEGAL" | "OTHER")}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="RCCM">RCCM</SelectItem>
                <SelectItem value="LEGAL">Document légal</SelectItem>
                <SelectItem value="OTHER">Autre</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="doc-ref">Numéro de référence</Label>
            <Input
              id="doc-ref"
              value={referenceNumber}
              onChange={(e) => setReferenceNumber(e.target.value)}
              placeholder="Ex: RCCM/GN/xxx/2024"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="doc-file">Fichier *</Label>
            <Input
              id="doc-file"
              type="file"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              accept=".pdf,.jpg,.jpeg,.png"
            />
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>Annuler</Button>
          <Button onClick={handleSubmit} disabled={upload.isPending} className="gap-2">
            {upload.isPending && <Loader2 size={16} className="animate-spin" />}
            Téléverser
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ── Edit Document Dialog ──────────────────────────────────────────────────────

function EditClientDocumentDialog({
  open,
  onOpenChange,
  doc,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  doc: ApiClientCompanyDocument | null;
}) {
  const [docType, setDocType] = useState<"RCCM" | "LEGAL" | "OTHER">("RCCM");
  const [referenceNumber, setReferenceNumber] = useState("");
  const [error, setError] = useState("");
  const patch = usePatchClientDocument();

  useEffect(() => {
    if (doc) {
      setDocType(doc.doc_type as "RCCM" | "LEGAL" | "OTHER");
      setReferenceNumber(doc.reference_number ?? "");
      setError("");
    }
  }, [doc]);

  const handleClose = () => { setError(""); onOpenChange(false); };

  const handleSave = async () => {
    if (!doc) return;
    setError("");
    try {
      await patch.mutateAsync({
        id: doc.id,
        data: { doc_type: docType, reference_number: referenceNumber || undefined },
      });
      handleClose();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Erreur lors de la mise à jour.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Modifier le document</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label>Type de document *</Label>
            <Select value={docType} onValueChange={(v) => setDocType(v as "RCCM" | "LEGAL" | "OTHER")}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="RCCM">RCCM</SelectItem>
                <SelectItem value="LEGAL">Document légal</SelectItem>
                <SelectItem value="OTHER">Autre</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="edit-client-ref">Numéro de référence</Label>
            <Input
              id="edit-client-ref"
              value={referenceNumber}
              onChange={(e) => setReferenceNumber(e.target.value)}
              maxLength={60}
              placeholder="Ex: RCCM/GN/xxx/2024"
            />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>Annuler</Button>
          <Button onClick={handleSave} disabled={patch.isPending} className="gap-2">
            {patch.isPending && <Loader2 size={16} className="animate-spin" />}
            Enregistrer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

const ClientProfile = () => {
  const [showForm, setShowForm] = useState(false);
  const [showDocUpload, setShowDocUpload] = useState(false);
  const [editDocId, setEditDocId] = useState<number | null>(null);
  const { user } = useAuth();
  const { data, isLoading } = useClientProfile();
  const { data: docsData, isLoading: docsLoading } = useClientCompanyDocuments();
  const deleteDoc = useDeleteClientDocument();

  const profile = data?.client_profile ?? null;
  const hasProfile = !!profile;
  const isCompany = profile?.client_type === "COMPANY";
  const documents = docsData?.results ?? [];

  const initialForm: FormState | undefined = profile
    ? {
        client_type: profile.client_type,
        first_name: profile.details.first_name ?? "",
        last_name: profile.details.last_name ?? "",
        company_name: profile.details.company_name ?? "",
        city_or_region: profile.city_or_region,
        country: profile.country,
        postal_code: profile.postal_code,
        phone: profile.phone,
      }
    : undefined;

  return (
    <DashboardLayout userType="client">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Mon Profil</h1>
            <p className="text-muted-foreground">Gérez vos informations personnelles</p>
          </div>
          {hasProfile && (
            <Button variant="outline" className="gap-2" onClick={() => setShowForm(true)}>
              <Pencil size={16} />
              Modifier
            </Button>
          )}
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="animate-spin text-primary" size={40} />
          </div>
        ) : !hasProfile ? (
          <div className="text-center py-16 text-muted-foreground">
            <User className="mx-auto mb-4" size={48} />
            <p className="text-lg font-medium mb-2">Profil non créé</p>
            <p className="text-sm mb-6">
              Complétez votre profil pour accéder à toutes les fonctionnalités.
            </p>
            <Button className="gap-2" onClick={() => setShowForm(true)}>
              <Plus size={18} />
              Créer mon profil
            </Button>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Main info */}
            <div className="lg:col-span-2 space-y-4">
              <Card className="p-6">
                <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                  <User size={20} className="text-primary" />
                  Informations personnelles
                </h3>
                <div className="grid sm:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground mb-0.5">Type de compte</p>
                    <p className="font-medium">
                      {profile.client_type === "INDIVIDUAL" ? "Particulier" : "Entreprise"}
                    </p>
                  </div>
                  {profile.client_type === "INDIVIDUAL" ? (
                    <>
                      <div>
                        <p className="text-muted-foreground mb-0.5">Prénom</p>
                        <p className="font-medium">{profile.details.first_name || "—"}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground mb-0.5">Nom</p>
                        <p className="font-medium">{profile.details.last_name || "—"}</p>
                      </div>
                    </>
                  ) : (
                    <div>
                      <p className="text-muted-foreground mb-0.5">Entreprise</p>
                      <p className="font-medium">{profile.details.company_name || "—"}</p>
                    </div>
                  )}
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                  <MapPin size={20} className="text-primary" />
                  Localisation
                </h3>
                <div className="grid sm:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground mb-0.5">Ville / Région</p>
                    <p className="font-medium">{profile.city_or_region || "—"}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground mb-0.5">Pays</p>
                    <p className="font-medium">{profile.country || "—"}</p>
                  </div>
                  {profile.postal_code && (
                    <div>
                      <p className="text-muted-foreground mb-0.5">Code postal</p>
                      <p className="font-medium">{profile.postal_code}</p>
                    </div>
                  )}
                </div>
              </Card>

              {/* Company documents — only for COMPANY clients */}
              {isCompany && (
                <Card className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-lg flex items-center gap-2">
                      <FileText size={20} className="text-primary" />
                      Documents de l'entreprise
                    </h3>
                    <Button
                      size="sm"
                      variant="outline"
                      className="gap-2"
                      onClick={() => setShowDocUpload(true)}
                    >
                      <Plus size={16} />
                      Ajouter
                    </Button>
                  </div>

                  {docsLoading ? (
                    <div className="flex justify-center py-6">
                      <Loader2 className="animate-spin text-muted-foreground" size={24} />
                    </div>
                  ) : documents.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-6">
                      Aucun document ajouté.
                    </p>
                  ) : (
                    <div className="divide-y divide-border">
                      {documents.map((doc) => (
                        <div
                          key={doc.id}
                          className="flex items-center justify-between py-3 text-sm"
                        >
                          <div className="flex-1 min-w-0">
                            <p className="font-medium">{doc.doc_type_display}</p>
                            {doc.reference_number && (
                              <p className="text-muted-foreground text-xs mt-0.5">
                                Réf: {doc.reference_number}
                              </p>
                            )}
                          </div>
                          <div className="flex items-center gap-2 ml-4 shrink-0">
                            {doc.file_url && (
                              <a
                                href={doc.file_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary hover:text-primary/80 transition-colors"
                              >
                                <ExternalLink size={16} />
                              </a>
                            )}
                            <button
                              onClick={() => setEditDocId(doc.id)}
                              className="text-muted-foreground hover:text-foreground transition-colors"
                              title="Modifier"
                            >
                              <Pencil size={16} />
                            </button>
                            <button
                              onClick={() => deleteDoc.mutate(doc.id)}
                              disabled={deleteDoc.isPending}
                              className="text-destructive hover:text-destructive/80 transition-colors disabled:opacity-50"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </Card>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-4">
              <Card className="p-6">
                <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                  <Phone size={20} className="text-primary" />
                  Contact
                </h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <p className="text-muted-foreground mb-0.5">Email</p>
                    <p className="font-medium">{user?.email || "—"}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground mb-0.5">Téléphone</p>
                    <p className="font-medium">{profile.phone || "—"}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground mb-0.5">Nom d'utilisateur</p>
                    <p className="font-medium">{user?.username || "—"}</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        )}
      </div>

      <ProfileFormDialog
        open={showForm}
        onOpenChange={setShowForm}
        isEdit={hasProfile}
        initial={initialForm}
      />

      {isCompany && (
        <DocumentUploadDialog
          open={showDocUpload}
          onOpenChange={setShowDocUpload}
        />
      )}

      {isCompany && (
        <EditClientDocumentDialog
          open={editDocId !== null}
          onOpenChange={(v) => !v && setEditDocId(null)}
          doc={documents.find((d) => d.id === editDocId) ?? null}
        />
      )}
    </DashboardLayout>
  );
};

export default ClientProfile;
