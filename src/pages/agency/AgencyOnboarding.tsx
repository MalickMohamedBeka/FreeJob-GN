import { useState } from "react";
import { Building2, MapPin, ArrowRight, ArrowLeft, CheckCircle2, Loader2, Sparkles } from "lucide-react";
import { useNavigate, Navigate } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import { useAuth } from "@/contexts/AuthContext";
import { useInitAgencyProfile } from "@/hooks/useAgency";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ApiError } from "@/services/api.service";

interface FormData {
  agency_name: string;
  founded_at: string;
  bio: string;
  country: string;
  city_or_region: string;
  postal_code: string;
  phone: string;
}

const INITIAL: FormData = {
  agency_name: "",
  founded_at: "",
  bio: "",
  country: "",
  city_or_region: "",
  postal_code: "",
  phone: "",
};

const features = [
  { icon: Building2, text: "Créez le profil de votre agence" },
  { icon: CheckCircle2, text: "Accédez aux projets disponibles" },
  { icon: Sparkles, text: "Développez votre activité" },
];

export default function AgencyOnboarding() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormData>(INITIAL);
  const [error, setError] = useState("");
  const { isAuthenticated, isLoading, user } = useAuth();
  const navigate = useNavigate();
  const initProfile = useInitAgencyProfile();

  if (isLoading) return null;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (user?.role !== "PROVIDER" || user?.provider_kind !== "AGENCY") {
    return <Navigate to="/dashboard" replace />;
  }

  const totalSteps = 2;

  const set = (field: keyof FormData, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const canAdvance = () => {
    if (step === 1) return form.agency_name.trim().length > 0;
    if (step === 2) return form.country.trim() && form.city_or_region.trim();
    return false;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      await initProfile.mutateAsync({
        city_or_region: form.city_or_region.trim(),
        country: form.country.trim(),
        postal_code: form.postal_code.trim() || undefined,
        phone: form.phone.trim() || undefined,
        bio: form.bio.trim() || undefined,
        agency: {
          agency_name: form.agency_name.trim(),
          founded_at: form.founded_at || null,
        },
      });
      navigate("/agency/dashboard");
    } catch (err) {
      if (err instanceof ApiError) {
        const msg = err.data?.detail || err.data?.agency_name?.[0] || "Une erreur est survenue.";
        setError(typeof msg === "string" ? msg : JSON.stringify(msg));
      } else {
        setError("Une erreur inattendue est survenue.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="pt-16 flex items-center justify-center min-h-screen">
        <div className="container mx-auto px-4 py-12">
          <div className="grid lg:grid-cols-2 gap-12 max-w-5xl mx-auto items-center">
            {/* Left — Branding */}
            <div className="hidden lg:block">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-secondary/10 rounded-2xl">
                  <Building2 className="text-secondary" size={32} />
                </div>
                <div>
                  <h2 className="text-3xl font-bold">
                    Bienvenue sur <span className="text-secondary">FreeJobGN</span>
                  </h2>
                  <p className="text-muted-foreground text-sm">Espace Agences</p>
                </div>
              </div>
              <p className="text-muted-foreground mb-8 leading-relaxed">
                Configurez le profil de votre agence en quelques étapes et accédez à
                des opportunités de projets exceptionnels.
              </p>
              <div className="space-y-4">
                {features.map((f, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="p-2 bg-secondary/10 rounded-lg flex-shrink-0">
                      <f.icon className="text-secondary" size={18} />
                    </div>
                    <span className="text-sm text-muted-foreground">{f.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — Form */}
            <div>
              <div className="bg-white rounded-2xl border border-border p-8 shadow-sm">
                {/* Progress */}
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium">
                      Étape {step} sur {totalSteps}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {step === 1 ? "Infos de l'agence" : "Localisation"}
                    </span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-secondary rounded-full transition-all duration-500"
                      style={{ width: `${(step / totalSteps) * 100}%` }}
                    />
                  </div>
                </div>

                <form onSubmit={step < totalSteps ? (e) => { e.preventDefault(); if (canAdvance()) setStep((s) => s + 1); } : handleSubmit}>
                  {/* Step 1 */}
                  {step === 1 && (
                    <div className="space-y-5">
                      <div>
                        <h3 className="text-xl font-bold mb-1">Votre agence</h3>
                        <p className="text-sm text-muted-foreground">
                          Donnez un nom et une identité à votre agence.
                        </p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="agency_name">Nom de l'agence <span className="text-destructive">*</span></Label>
                        <Input
                          id="agency_name"
                          value={form.agency_name}
                          onChange={(e) => set("agency_name", e.target.value)}
                          placeholder="Ex : Tech Solutions SARL"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="founded_at">Date de fondation</Label>
                        <Input
                          id="founded_at"
                          type="date"
                          value={form.founded_at}
                          onChange={(e) => set("founded_at", e.target.value)}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="bio">Description de l'agence</Label>
                        <Textarea
                          id="bio"
                          value={form.bio}
                          onChange={(e) => set("bio", e.target.value)}
                          placeholder="Décrivez les services et l'expertise de votre agence…"
                          rows={4}
                        />
                      </div>
                    </div>
                  )}

                  {/* Step 2 */}
                  {step === 2 && (
                    <div className="space-y-5">
                      <div>
                        <h3 className="text-xl font-bold mb-1">Localisation</h3>
                        <p className="text-sm text-muted-foreground">
                          Où votre agence est-elle basée ?
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="country">Pays <span className="text-destructive">*</span></Label>
                          <Input
                            id="country"
                            value={form.country}
                            onChange={(e) => set("country", e.target.value)}
                            placeholder="Guinée"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="city">Ville <span className="text-destructive">*</span></Label>
                          <Input
                            id="city"
                            value={form.city_or_region}
                            onChange={(e) => set("city_or_region", e.target.value)}
                            placeholder="Conakry"
                            required
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="postal_code">Code postal</Label>
                          <Input
                            id="postal_code"
                            value={form.postal_code}
                            onChange={(e) => set("postal_code", e.target.value)}
                            placeholder="00001"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phone">Téléphone</Label>
                          <Input
                            id="phone"
                            value={form.phone}
                            onChange={(e) => set("phone", e.target.value)}
                            placeholder="+224 6xx xxx xxx"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {error && (
                    <p className="text-sm text-destructive mt-4 bg-destructive/10 px-3 py-2 rounded-lg">
                      {error}
                    </p>
                  )}

                  {/* Navigation */}
                  <div className="flex items-center gap-3 mt-8">
                    {step > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        className="flex-1 gap-2"
                        onClick={() => setStep((s) => s - 1)}
                      >
                        <ArrowLeft size={16} />
                        Retour
                      </Button>
                    )}

                    {step < totalSteps ? (
                      <Button
                        type="submit"
                        className="flex-1 gap-2 bg-secondary hover:bg-secondary/90"
                        disabled={!canAdvance()}
                      >
                        Continuer
                        <ArrowRight size={16} />
                      </Button>
                    ) : (
                      <Button
                        type="submit"
                        className="flex-1 gap-2 bg-secondary hover:bg-secondary/90"
                        disabled={!canAdvance() || initProfile.isPending}
                      >
                        {initProfile.isPending ? (
                          <>
                            <Loader2 size={16} className="animate-spin" />
                            Création…
                          </>
                        ) : (
                          <>
                            <CheckCircle2 size={16} />
                            Créer mon agence
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
