import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, Mail, Lock, User, Briefcase, ArrowRight, Sparkles, Shield, CheckCircle2, Building2 } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { LiquidGradientMesh } from "@/components/backgrounds/LiquidGradientMesh";
import { useAuth } from "@/contexts/AuthContext";
import type { RegisterRequest } from "@/types";

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [role, setRole] = useState<"freelancer" | "client">("freelancer");
  const [isLoading, setIsLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (formData.password !== formData.confirmPassword) {
      setError("Les mots de passe ne correspondent pas");
      return;
    }
    setIsLoading(true);
    try {
      const payload: RegisterRequest = {
        email: formData.email,
        username: formData.fullName,
        password: formData.password,
        password_confirm: formData.confirmPassword,
        role: role === "client" ? "CLIENT" : "PROVIDER",
      };
      if (role === "freelancer") {
        payload.provider_kind = "FREELANCE";
      }
      await register(payload);
      setSuccess(true);
    } catch (err: any) {
      setError(err?.message || "Erreur lors de l'inscription");
    } finally {
      setIsLoading(false);
    }
  };

  const features = [
    { icon: Shield, text: "Inscription 100% gratuite" },
    { icon: CheckCircle2, text: "Profil vérifié" },
    { icon: Sparkles, text: "Accès illimité" },
  ];

  return (
    <div className="min-h-screen bg-white">
      <LiquidGradientMesh />
      <div className="relative z-10">
        <Navbar />
      <main className="pt-20 pb-16 flex items-center justify-center min-h-screen">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto items-center">
            {/* Left Side - Branding & Features */}
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
                  Rejoignez <span className="text-primary">FreeJobGN</span>
                </h2>
                <p className="text-xl text-muted-foreground mb-8">
                  Créez votre compte et accédez à des milliers d'opportunités en Afrique
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

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="mt-8 p-6 glass rounded-2xl border border-white/20"
              >
                <p className="text-sm text-muted-foreground mb-3">Déjà membre de la communauté ?</p>
                <Link to="/login">
                  <motion.button
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full h-12 rounded-xl border-2 border-primary bg-primary/10 text-primary font-bold hover:bg-primary hover:text-white transition-all"
                  >
                    Se connecter
                  </motion.button>
                </Link>
              </motion.div>
            </motion.div>

            {/* Right Side - Signup Form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="w-full"
            >
              <div className="lg:hidden text-center mb-8">
                <img src="/logo.png" alt="FreeJobGN" className="h-20 w-auto mx-auto mb-4" />
                <h1 className="text-3xl font-bold mb-2">Créer un compte</h1>
                <p className="text-muted-foreground">Rejoignez la communauté</p>
              </div>

              <motion.div
                whileHover={{ y: -5 }}
                transition={{ duration: 0.3 }}
                className="glass rounded-3xl border-2 border-white/30 p-8 shadow-elevation-4 backdrop-blur-xl"
              >
                <div className="hidden lg:block text-center mb-6">
                  <h1 className="text-3xl font-bold mb-2">Inscription</h1>
                  <p className="text-muted-foreground">Créez votre compte gratuitement</p>
                </div>

                {success ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-8"
                  >
                    <CheckCircle2 className="mx-auto text-primary mb-4" size={64} />
                    <h2 className="text-2xl font-bold mb-3">Inscription réussie !</h2>
                    <p className="text-muted-foreground mb-6">
                      Un email d'activation a été envoyé à <strong>{formData.email}</strong>. Veuillez vérifier votre boîte de réception pour activer votre compte.
                    </p>
                    <Link to="/login" className="text-primary font-bold hover:underline">
                      Retour à la connexion
                    </Link>
                  </motion.div>
                ) : (<>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm mb-4"
                  >
                    {error}
                  </motion.div>
                )}

                {/* Role selector */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="grid grid-cols-2 gap-3 p-1.5 bg-muted/50 backdrop-blur-sm rounded-2xl mb-6"
                >
                  <motion.button
                    type="button"
                    onClick={() => setRole("freelancer")}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`py-3 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 ${
                      role === "freelancer"
                        ? "bg-primary text-primary-foreground shadow-elevation-2"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <Briefcase size={18} />
                    Freelancer
                  </motion.button>
                  <motion.button
                    type="button"
                    onClick={() => setRole("client")}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`py-3 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 ${
                      role === "client"
                        ? "bg-primary text-primary-foreground shadow-elevation-2"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <Building2 size={18} />
                    Client
                  </motion.button>
                </motion.div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <label htmlFor="fullName" className="block text-sm font-semibold mb-2">Nom complet</label>
                    <div className="relative">
                      <motion.div
                        animate={{ 
                          scale: focusedField === 'fullName' ? 1.1 : 1,
                          color: focusedField === 'fullName' ? 'hsl(var(--primary))' : 'hsl(var(--muted-foreground))'
                        }}
                        className="absolute left-3 top-1/2 -translate-y-1/2"
                      >
                        <User size={18} />
                      </motion.div>
                      <input
                        id="fullName"
                        name="fullName"
                        type="text"
                        value={formData.fullName}
                        onChange={handleChange}
                        onFocus={() => setFocusedField('fullName')}
                        onBlur={() => setFocusedField(null)}
                        placeholder="Votre nom complet"
                        required
                        className="w-full h-14 pl-11 pr-4 rounded-xl border-2 border-border bg-background/50 backdrop-blur-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                      />
                      <AnimatePresence>
                        {focusedField === 'fullName' && (
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

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25 }}
                  >
                    <label htmlFor="signupEmail" className="block text-sm font-semibold mb-2">Email</label>
                    <div className="relative">
                      <motion.div
                        animate={{ 
                          scale: focusedField === 'email' ? 1.1 : 1,
                          color: focusedField === 'email' ? 'hsl(var(--primary))' : 'hsl(var(--muted-foreground))'
                        }}
                        className="absolute left-3 top-1/2 -translate-y-1/2"
                      >
                        <Mail size={18} />
                      </motion.div>
                      <input
                        id="signupEmail"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        onFocus={() => setFocusedField('email')}
                        onBlur={() => setFocusedField(null)}
                        placeholder="votre@email.com"
                        required
                        className="w-full h-14 pl-11 pr-4 rounded-xl border-2 border-border bg-background/50 backdrop-blur-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                      />
                      <AnimatePresence>
                        {focusedField === 'email' && (
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

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <label htmlFor="signupPassword" className="block text-sm font-semibold mb-2">Mot de passe</label>
                    <div className="relative">
                      <motion.div
                        animate={{ 
                          scale: focusedField === 'password' ? 1.1 : 1,
                          color: focusedField === 'password' ? 'hsl(var(--primary))' : 'hsl(var(--muted-foreground))'
                        }}
                        className="absolute left-3 top-1/2 -translate-y-1/2"
                      >
                        <Lock size={18} />
                      </motion.div>
                      <input
                        id="signupPassword"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        value={formData.password}
                        onChange={handleChange}
                        onFocus={() => setFocusedField('password')}
                        onBlur={() => setFocusedField(null)}
                        placeholder="••••••••"
                        required
                        className="w-full h-14 pl-11 pr-12 rounded-xl border-2 border-border bg-background/50 backdrop-blur-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                      />
                      <motion.button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </motion.button>
                      <AnimatePresence>
                        {focusedField === 'password' && (
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

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.35 }}
                  >
                    <label htmlFor="confirmPassword" className="block text-sm font-semibold mb-2">Confirmer le mot de passe</label>
                    <div className="relative">
                      <motion.div
                        animate={{ 
                          scale: focusedField === 'confirmPassword' ? 1.1 : 1,
                          color: focusedField === 'confirmPassword' ? 'hsl(var(--primary))' : 'hsl(var(--muted-foreground))'
                        }}
                        className="absolute left-3 top-1/2 -translate-y-1/2"
                      >
                        <Lock size={18} />
                      </motion.div>
                      <input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        onFocus={() => setFocusedField('confirmPassword')}
                        onBlur={() => setFocusedField(null)}
                        placeholder="••••••••"
                        required
                        className="w-full h-14 pl-11 pr-12 rounded-xl border-2 border-border bg-background/50 backdrop-blur-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                      />
                      <motion.button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </motion.button>
                      <AnimatePresence>
                        {focusedField === 'confirmPassword' && (
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

                  <motion.label
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="flex items-start gap-2 text-sm pt-1 cursor-pointer group"
                  >
                    <input type="checkbox" required className="mt-0.5 rounded border-border cursor-pointer" />
                    <span className="text-muted-foreground group-hover:text-foreground transition-colors">
                      J'accepte les{" "}
                      <Link to="#" className="text-primary hover:underline font-medium">conditions d'utilisation</Link>{" "}
                      et la{" "}
                      <Link to="#" className="text-primary hover:underline font-medium">politique de confidentialité</Link>
                    </span>
                  </motion.label>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.45 }}
                  >
                    <motion.button
                      type="submit"
                      disabled={isLoading}
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full h-14 bg-primary text-primary-foreground rounded-xl font-bold text-lg shadow-elevation-3 hover:shadow-elevation-4 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
                    >
                      {isLoading ? (
                        <motion.div
                          className="w-6 h-6 border-3 border-primary-foreground border-t-transparent rounded-full"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        />
                      ) : (
                        <>
                          Créer mon Compte
                          <motion.div
                            animate={{ x: [0, 5, 0] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                          >
                            <ArrowRight size={20} />
                          </motion.div>
                        </>
                      )}
                    </motion.button>
                  </motion.div>
                </form>

                {/* Divider */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="relative my-6"
                >
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-border"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white/80 backdrop-blur-sm text-muted-foreground font-medium">Ou s'inscrire avec</span>
                  </div>
                </motion.div>

                {/* Social Signup */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="grid grid-cols-2 gap-3"
                >
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => console.log("Google signup")}
                    className="w-full h-12 rounded-xl border-2 border-border bg-background/50 backdrop-blur-sm hover:border-primary/50 transition-all flex items-center justify-center gap-2 font-medium"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    Google
                  </motion.button>
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => console.log("LinkedIn signup")}
                    className="w-full h-12 rounded-xl border-2 border-border bg-background/50 backdrop-blur-sm hover:border-primary/50 transition-all flex items-center justify-center gap-2 font-medium"
                  >
                    <svg className="w-5 h-5" fill="#0A66C2" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                    LinkedIn
                  </motion.button>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7 }}
                  className="mt-6 text-center text-sm lg:hidden"
                >
                  <span className="text-muted-foreground">Déjà un compte ?</span>{" "}
                  <Link to="/login" className="text-primary font-bold hover:underline">
                    Se connecter
                  </Link>
                </motion.div>
                </>)}
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

export default Signup;
