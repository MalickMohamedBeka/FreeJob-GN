import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  MapPin,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import { useNavigate, Navigate } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { LiquidGradientMesh } from "@/components/backgrounds/LiquidGradientMesh";
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

const Onboarding = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>(INITIAL_DATA);
  const [error, setError] = useState("");
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const { isAuthenticated, isLoading, profileInitialized, setProfileInitialized } = useAuth();
  const navigate = useNavigate();
  const profileInit = useProfileInit();

  // Route guards
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

  const handleNext = () => {
    if (step < totalSteps) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
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
        // Profile already exists
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

  const features = [
    { icon: User, text: "Créez votre profil professionnel" },
    { icon: CheckCircle2, text: "Accédez aux projets disponibles" },
    { icon: Sparkles, text: "Commencez à gagner de l'argent" },
  ];

  const renderInput = (
    id: string,
    label: string,
    field: keyof FormData,
    placeholder: string,
    required = false,
    type = "text"
  ) => (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
    >
      <label htmlFor={id} className="block text-sm font-semibold mb-2">
        {label} {required && <span className="text-destructive">*</span>}
      </label>
      <div className="relative">
        <input
          id={id}
          type={type}
          value={formData[field]}
          onChange={(e) => updateField(field, e.target.value)}
          onFocus={() => setFocusedField(id)}
          onBlur={() => setFocusedField(null)}
          placeholder={placeholder}
          required={required}
          className="w-full h-12 px-4 rounded-xl border-2 border-border bg-background/50 backdrop-blur-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
        />
        <AnimatePresence>
          {focusedField === id && (
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              exit={{ scaleX: 0 }}
              className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
            />
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-white">
      <LiquidGradientMesh />
      <div className="relative z-10">
        <Navbar />
        <main className="pt-20 pb-16 flex items-center justify-center min-h-screen">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto items-center">
              {/* Left Side - Branding */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="hidden lg:block"
              >
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="mb-8"
                >
                  <img src="/logo.png" alt="FreeJobGN" className="h-24 w-auto mb-6" />
                  <h2 className="text-4xl font-bold mb-4">
                    Complétez votre <span className="text-primary">profil</span>
                  </h2>
                  <p className="text-xl text-muted-foreground mb-8">
                    Quelques informations pour démarrer sur la plateforme et accéder aux opportunités
                  </p>
                </motion.div>

                <div className="space-y-4">
                  {features.map((feature, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 + index * 0.1 }}
                      className="flex items-center gap-4 glass rounded-2xl p-4 border border-white/20"
                    >
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                        <feature.icon className="text-primary" size={24} />
                      </div>
                      <span className="font-medium">{feature.text}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Right Side - Form */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full"
              >
                <div className="lg:hidden text-center mb-8">
                  <img src="/logo.png" alt="FreeJobGN" className="h-20 w-auto mx-auto mb-4" />
                  <h1 className="text-3xl font-bold mb-2">Complétez votre profil</h1>
                  <p className="text-muted-foreground">Étape {step} sur {totalSteps}</p>
                </div>

                <motion.div
                  whileHover={{ y: -5 }}
                  transition={{ duration: 0.3 }}
                  className="glass rounded-3xl border-2 border-white/30 p-8 shadow-elevation-4 backdrop-blur-xl"
                >
                  {/* Progress indicator */}
                  <div className="flex items-center gap-2 mb-6">
                    {Array.from({ length: totalSteps }, (_, i) => (
                      <div key={i} className="flex-1 flex items-center gap-2">
                        <div
                          className={`h-2 flex-1 rounded-full transition-colors ${
                            i + 1 <= step ? "bg-primary" : "bg-border"
                          }`}
                        />
                      </div>
                    ))}
                  </div>

                  <div className="hidden lg:block text-center mb-6">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      {step === 1 ? (
                        <User className="text-primary" size={24} />
                      ) : (
                        <MapPin className="text-primary" size={24} />
                      )}
                      <h1 className="text-2xl font-bold">
                        {step === 1 ? "Informations personnelles" : "Localisation"}
                      </h1>
                    </div>
                    <p className="text-muted-foreground text-sm">
                      Étape {step} sur {totalSteps}
                    </p>
                  </div>

                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm mb-4"
                    >
                      {error}
                    </motion.div>
                  )}

                  <form onSubmit={handleSubmit}>
                    <AnimatePresence mode="wait">
                      {step === 1 && (
                        <motion.div
                          key="step1"
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          transition={{ duration: 0.3 }}
                          className="space-y-4"
                        >
                          {renderInput("first_name", "Prénom", "first_name", "Votre prénom", true)}
                          {renderInput("last_name", "Nom", "last_name", "Votre nom", true)}
                          {renderInput(
                            "business_name",
                            "Nom commercial",
                            "business_name",
                            "Nom de votre entreprise (optionnel)"
                          )}
                        </motion.div>
                      )}

                      {step === 2 && (
                        <motion.div
                          key="step2"
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          transition={{ duration: 0.3 }}
                          className="space-y-4"
                        >
                          {renderInput("country", "Pays", "country", "Ex: Guinée", true)}
                          {renderInput(
                            "city_or_region",
                            "Ville ou région",
                            "city_or_region",
                            "Ex: Conakry",
                            true
                          )}
                          {renderInput("postal_code", "Code postal", "postal_code", "Optionnel")}
                          {renderInput("phone", "Téléphone", "phone", "+224 XXX XXX XXX", false, "tel")}
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Navigation buttons */}
                    <div className="flex gap-3 mt-6">
                      {step > 1 && (
                        <motion.button
                          type="button"
                          onClick={handleBack}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="flex-1 h-12 rounded-xl border-2 border-border bg-background/50 font-semibold flex items-center justify-center gap-2 hover:border-primary/50 transition-all"
                        >
                          <ArrowLeft size={18} />
                          Retour
                        </motion.button>
                      )}

                      {step < totalSteps ? (
                        <motion.button
                          type="button"
                          onClick={handleNext}
                          disabled={!canAdvance()}
                          whileHover={{ scale: 1.02, y: -2 }}
                          whileTap={{ scale: 0.98 }}
                          className="flex-1 h-12 bg-primary text-primary-foreground rounded-xl font-bold shadow-elevation-3 hover:shadow-elevation-4 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                          Suivant
                          <ArrowRight size={18} />
                        </motion.button>
                      ) : (
                        <motion.button
                          type="submit"
                          disabled={!canAdvance() || profileInit.isPending}
                          whileHover={{ scale: 1.02, y: -2 }}
                          whileTap={{ scale: 0.98 }}
                          className="flex-1 h-12 bg-primary text-primary-foreground rounded-xl font-bold shadow-elevation-3 hover:shadow-elevation-4 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                          {profileInit.isPending ? (
                            <motion.div
                              className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full"
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            />
                          ) : (
                            <>
                              Terminer
                              <CheckCircle2 size={18} />
                            </>
                          )}
                        </motion.button>
                      )}
                    </div>
                  </form>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default Onboarding;
