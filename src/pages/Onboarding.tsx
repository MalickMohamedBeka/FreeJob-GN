import { useState } from "react";
import {
  User,
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
import { useProfileInit } from "@/hooks";
import { ApiError } from "@/services/api.service";

interface FormData {
  first_name: string;
  last_name: string;
  business_name: string;
  country: string;
  city_or_region: string;
  postal_code: string;
  phone: string;
}

const INITIAL_DATA: FormData = {
  first_name: "",
  last_name: "",
  business_name: "",
  country: "",
  city_or_region: "",
  postal_code: "",
  phone: "",
};

const features = [
  { icon: User, text: "Créez votre profil professionnel" },
  { icon: CheckCircle2, text: "Accédez aux projets disponibles" },
  { icon: Sparkles, text: "Commencez à gagner de l'argent" },
];

const Onboarding = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>(INITIAL_DATA);
  const [error, setError] = useState("");
  const { isAuthenticated, isLoading, profileInitialized, setProfileInitialized } = useAuth();
  const navigate = useNavigate();
  const profileInit = useProfileInit();

  if (isLoading) return null;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (profileInitialized === true) return <Navigate to="/dashboard" replace />;

  const totalSteps = 2;

  const updateField = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const canAdvance = () => {
    if (step === 1) return formData.first_name.trim() && formData.last_name.trim();
    if (step === 2) return formData.country.trim() && formData.city_or_region.trim();
    return false;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const freelance: { first_name: string; last_name: string; business_name?: string } = {
      first_name: formData.first_name.trim(),
      last_name: formData.last_name.trim(),
    };
    if (formData.business_name.trim()) freelance.business_name = formData.business_name.trim();

    const payload: {
      city_or_region: string;
      country: string;
      postal_code?: string;
      phone?: string;
      freelance: typeof freelance;
    } = {
      city_or_region: formData.city_or_region.trim(),
      country: formData.country.trim(),
      freelance,
    };
    if (formData.postal_code.trim()) payload.postal_code = formData.postal_code.trim();
    if (formData.phone.trim()) payload.phone = formData.phone.trim();

    try {
      await profileInit.mutateAsync(payload);
      setProfileInitialized(true);
      navigate("/dashboard");
    } catch (err) {
      if (err instanceof ApiError && err.status === 409) {
        setProfileInitialized(true);
        navigate("/dashboard");
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
        value={formData[field]}
        onChange={(e) => updateField(field, e.target.value)}
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
              <img src="/logo.png" alt="FreeJobGN" className="h-16 w-auto mb-8" />
              <h2 className="text-3xl font-bold mb-3">
                Complétez votre <span className="text-secondary">profil</span>
              </h2>
              <p className="text-muted-foreground mb-8 leading-relaxed">
                Quelques informations pour démarrer sur la plateforme et accéder aux opportunités
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
                <img src="/logo.png" alt="FreeJobGN" className="h-14 w-auto mx-auto mb-4" />
                <h1 className="text-2xl font-bold mb-1">Complétez votre profil</h1>
                <p className="text-muted-foreground text-sm">Étape {step} sur {totalSteps}</p>
              </div>

              <div className="bg-white rounded-2xl border border-border p-8 shadow-sm">
                {/* Progress */}
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
                  ) : (
                    <MapPin className="text-primary" size={20} />
                  )}
                  <div>
                    <h1 className="text-xl font-bold">
                      {step === 1 ? "Informations personnelles" : "Localisation"}
                    </h1>
                    <p className="text-xs text-muted-foreground">Étape {step} sur {totalSteps}</p>
                  </div>
                </div>

                {error && (
                  <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm mb-4">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  {step === 1 && (
                    <div className="space-y-4">
                      {renderInput("first_name", "Prénom", "first_name", "Votre prénom", true)}
                      {renderInput("last_name", "Nom", "last_name", "Votre nom", true)}
                      {renderInput("business_name", "Nom commercial", "business_name", "Nom de votre entreprise (optionnel)")}
                    </div>
                  )}

                  {step === 2 && (
                    <div className="space-y-4">
                      {renderInput("country", "Pays", "country", "Ex: Guinée", true)}
                      {renderInput("city_or_region", "Ville ou région", "city_or_region", "Ex: Conakry", true)}
                      {renderInput("postal_code", "Code postal", "postal_code", "Optionnel")}
                      {renderInput("phone", "Téléphone", "phone", "+224 XXX XXX XXX", false, "tel")}
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
                        disabled={!canAdvance() || profileInit.isPending}
                        className="flex-1 h-11 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        {profileInit.isPending ? (
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

export default Onboarding;
