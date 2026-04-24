import { useState } from "react";
import {
  User,
  Building2,
  MapPin,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import { useNavigate, Navigate } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { useCreateClientProfile } from "@/hooks";
import { ApiError } from "@/services/api.service";
import type { ClientProfileCreateRequest } from "@/types";

type ClientType = "INDIVIDUAL" | "COMPANY";

interface FormData {
  client_type: ClientType;
  first_name: string;
  last_name: string;
  company_name: string;
  country: string;
  city_or_region: string;
  postal_code: string;
  phone: string;
}

const INITIAL_DATA: FormData = {
  client_type: "INDIVIDUAL",
  first_name: "",
  last_name: "",
  company_name: "",
  country: "",
  city_or_region: "",
  postal_code: "",
  phone: "",
};

const features = [
  { icon: User, text: "Identifiez-vous comme particulier ou entreprise" },
  { icon: CheckCircle2, text: "Publiez vos projets en quelques clics" },
  { icon: Sparkles, text: "Trouvez les meilleurs freelances de Guinée" },
];

const ClientOnboarding = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>(INITIAL_DATA);
  const [error, setError] = useState("");
  const { isAuthenticated, isLoading, profileInitialized, setProfileInitialized, user } = useAuth();
  const navigate = useNavigate();
  const createProfile = useCreateClientProfile();

  if (isLoading) return null;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (user?.role !== "CLIENT") return <Navigate to="/" replace />;
  if (profileInitialized === true) return <Navigate to="/client/dashboard" replace />;

  const totalSteps = 3;

  const updateField = <K extends keyof FormData>(field: K, value: FormData[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const canAdvance = () => {
    if (step === 1) return !!formData.client_type;
    if (step === 2) {
      return formData.client_type === "INDIVIDUAL"
        ? formData.first_name.trim() && formData.last_name.trim()
        : formData.company_name.trim();
    }
    if (step === 3) return formData.country.trim() && formData.city_or_region.trim();
    return false;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const basePayload = {
      city_or_region: formData.city_or_region.trim(),
      country: formData.country.trim(),
      ...(formData.postal_code.trim() ? { postal_code: formData.postal_code.trim() } : {}),
      ...(formData.phone.trim() ? { phone: formData.phone.trim() } : {}),
    };

    const payload: ClientProfileCreateRequest =
      formData.client_type === "INDIVIDUAL"
        ? {
            client_type: "INDIVIDUAL",
            ...basePayload,
            first_name: formData.first_name.trim(),
            last_name: formData.last_name.trim(),
          }
        : {
            client_type: "COMPANY",
            ...basePayload,
            company_name: formData.company_name.trim(),
          };

    try {
      await createProfile.mutateAsync(payload);
      setProfileInitialized(true);
      navigate("/client/dashboard");
    } catch (err) {
      if (err instanceof ApiError && err.status === 409) {
        setProfileInitialized(true);
        navigate("/client/dashboard");
        return;
      }
      setError(
        err instanceof ApiError
          ? err.message
          : "Une erreur est survenue. Veuillez réessayer."
      );
    }
  };

  const inputClass =
    "w-full h-11 px-4 rounded-lg border border-border bg-white text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors";

  const renderInput = (
    id: string,
    label: string,
    field: keyof FormData,
    placeholder: string,
    required = false,
    type = "text"
  ) => (
    <div>
      <label htmlFor={id} className="block text-sm font-semibold mb-2">
        {label} {required && <span className="text-destructive">*</span>}
      </label>
      <input
        id={id}
        type={type}
        value={formData[field] as string}
        onChange={(e) => updateField(field, e.target.value as FormData[typeof field])}
        placeholder={placeholder}
        required={required}
        className={inputClass}
      />
    </div>
  );

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="pt-16 flex items-center justify-center min-h-screen">
        <div className="container mx-auto px-4 py-12">
          <div className="grid lg:grid-cols-2 gap-12 max-w-5xl mx-auto items-center">
            {/* Left — Branding */}
            <div className="hidden lg:block">
              <img src="/logo.svg" alt="FreeJobGN" className="h-10 w-auto mb-8" />
              <h2 className="text-3xl font-bold mb-3">
                Complétez votre <span className="text-secondary">profil client</span>
              </h2>
              <p className="text-muted-foreground mb-8 leading-relaxed">
                Quelques informations pour publier vos projets et contacter les freelances
              </p>
              <div className="space-y-3">
                {features.map((feature) => (
                  <div
                    key={feature.text}
                    className="flex items-center gap-3 p-4 rounded-xl border border-border bg-muted/30"
                  >
                    <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <feature.icon className="text-primary" size={18} />
                    </div>
                    <span className="font-medium text-sm">{feature.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — Form */}
            <div className="w-full">
              <div className="lg:hidden text-center mb-8">
                <img src="/logo.svg" alt="FreeJobGN" className="h-10 w-auto mx-auto mb-4" />
                <h1 className="text-2xl font-bold mb-1">Complétez votre profil</h1>
                <p className="text-muted-foreground text-sm">
                  Étape {step} sur {totalSteps}
                </p>
              </div>

              <div className="bg-white rounded-2xl border border-border p-8 shadow-sm">
                <div className="flex gap-2 mb-6">
                  {Array.from({ length: totalSteps }, (_, i) => (
                    <div
                      key={i}
                      className={`flex-1 h-1.5 rounded-full transition-colors ${
                        i + 1 <= step ? "bg-primary" : "bg-border"
                      }`}
                    />
                  ))}
                </div>

                <div className="hidden lg:flex items-center gap-2 mb-6">
                  {step === 1 ? (
                    <User className="text-primary" size={20} />
                  ) : step === 2 ? (
                    formData.client_type === "COMPANY" ? (
                      <Building2 className="text-primary" size={20} />
                    ) : (
                      <User className="text-primary" size={20} />
                    )
                  ) : (
                    <MapPin className="text-primary" size={20} />
                  )}
                  <div>
                    <h1 className="text-xl font-bold">
                      {step === 1
                        ? "Type de client"
                        : step === 2
                        ? formData.client_type === "COMPANY"
                          ? "Entreprise"
                          : "Identité"
                        : "Localisation"}
                    </h1>
                    <p className="text-xs text-muted-foreground">
                      Étape {step} sur {totalSteps}
                    </p>
                  </div>
                </div>

                {error && (
                  <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm mb-4">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  {step === 1 && (
                    <div className="space-y-3">
                      <label className="block text-sm font-semibold mb-2">
                        Vous êtes : <span className="text-destructive">*</span>
                      </label>
                      {(["INDIVIDUAL", "COMPANY"] as const).map((type) => {
                        const Icon = type === "INDIVIDUAL" ? User : Building2;
                        const label = type === "INDIVIDUAL" ? "Particulier" : "Entreprise";
                        const desc =
                          type === "INDIVIDUAL"
                            ? "Je publie des projets en mon nom propre"
                            : "Je représente une société ou une organisation";
                        const selected = formData.client_type === type;
                        return (
                          <button
                            key={type}
                            type="button"
                            onClick={() => updateField("client_type", type)}
                            className={`w-full flex items-start gap-3 p-4 rounded-xl border text-left transition-colors ${
                              selected
                                ? "border-primary bg-primary/5"
                                : "border-border hover:border-primary/50"
                            }`}
                          >
                            <div
                              className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                                selected ? "bg-primary text-white" : "bg-muted text-primary"
                              }`}
                            >
                              <Icon size={20} />
                            </div>
                            <div>
                              <div className="font-semibold">{label}</div>
                              <div className="text-xs text-muted-foreground">{desc}</div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {step === 2 && formData.client_type === "INDIVIDUAL" && (
                    <div className="space-y-4">
                      {renderInput("first_name", "Prénom", "first_name", "Votre prénom", true)}
                      {renderInput("last_name", "Nom", "last_name", "Votre nom", true)}
                    </div>
                  )}

                  {step === 2 && formData.client_type === "COMPANY" && (
                    <div className="space-y-4">
                      {renderInput(
                        "company_name",
                        "Nom de l'entreprise",
                        "company_name",
                        "Ex: FreeJobGN SARL",
                        true
                      )}
                    </div>
                  )}

                  {step === 3 && (
                    <div className="space-y-4">
                      {renderInput("country", "Pays", "country", "Ex: Guinée", true)}
                      {renderInput(
                        "city_or_region",
                        "Ville ou région",
                        "city_or_region",
                        "Ex: Conakry",
                        true
                      )}
                      {renderInput("postal_code", "Code postal", "postal_code", "Optionnel")}
                      {renderInput(
                        "phone",
                        "Téléphone",
                        "phone",
                        "+224 XXX XXX XXX",
                        false,
                        "tel"
                      )}
                    </div>
                  )}

                  <div className="flex gap-3 mt-6">
                    {step > 1 && (
                      <button
                        type="button"
                        onClick={() => setStep(step - 1)}
                        className="flex-1 h-11 rounded-lg border border-border bg-white font-semibold flex items-center justify-center gap-2 hover:bg-muted transition-colors"
                      >
                        <ArrowLeft size={16} />
                        Retour
                      </button>
                    )}

                    {step < totalSteps ? (
                      <button
                        type="button"
                        onClick={() => setStep(step + 1)}
                        disabled={!canAdvance()}
                        className="flex-1 h-11 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        Suivant
                        <ArrowRight size={16} />
                      </button>
                    ) : (
                      <button
                        type="submit"
                        disabled={!canAdvance() || createProfile.isPending}
                        className="flex-1 h-11 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        {createProfile.isPending ? (
                          <Loader2 size={16} className="animate-spin" />
                        ) : (
                          <>
                            Terminer
                            <CheckCircle2 size={16} />
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ClientOnboarding;
