import { useState } from "react";
import { Eye, EyeOff, Mail, Lock, ArrowRight, Shield, CheckCircle2, Sparkles } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useAuth } from "@/contexts/AuthContext";

const features = [
  { icon: Shield, text: "Connexion sécurisée" },
  { icon: CheckCircle2, text: "Accès instantané" },
  { icon: Sparkles, text: "Interface moderne" },
];

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    try {
      await login({ email, password });
      const stored = localStorage.getItem("user");
      const user = stored ? JSON.parse(stored) : null;
      navigate(user?.role === "CLIENT" ? "/client/dashboard" : "/dashboard");
    } catch (err: any) {
      setError(err?.message || "Email ou mot de passe incorrect");
    } finally {
      setIsLoading(false);
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
              <img src="/logo.png" alt="FreeJobGN" className="h-16 w-auto mb-8" />
              <h2 className="text-3xl font-bold mb-3">
                Bienvenue sur <span className="text-secondary">FreeJobGN</span>
              </h2>
              <p className="text-muted-foreground mb-8 leading-relaxed">
                La plateforme qui connecte les meilleurs talents africains avec des opportunités exceptionnelles
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
              </div>

              <div className="bg-white rounded-2xl border border-border p-8 shadow-sm">
                <div className="mb-8">
                  <h1 className="text-2xl font-bold mb-1">Connexion</h1>
                  <p className="text-muted-foreground text-sm">Accédez à votre espace</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  {error && (
                    <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
                      {error}
                    </div>
                  )}

                  <div>
                    <label htmlFor="email" className="block text-sm font-semibold mb-2">
                      Email
                    </label>
                    <div className="relative">
                      <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                      <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="votre@email.com"
                        required
                        className="w-full h-11 pl-10 pr-4 rounded-lg border border-border bg-white text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="password" className="block text-sm font-semibold mb-2">
                      Mot de passe
                    </label>
                    <div className="relative">
                      <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                      <input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        required
                        className="w-full h-11 pl-10 pr-11 rounded-lg border border-border bg-white text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                        aria-label={showPassword ? "Masquer" : "Afficher"}
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" className="rounded border-border" />
                      <span className="text-muted-foreground">Se souvenir de moi</span>
                    </label>
                    <Link to="#" className="text-primary hover:underline font-medium">
                      Mot de passe oublié ?
                    </Link>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-11 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isLoading ? (
                      <Loader2 size={18} className="animate-spin" />
                    ) : (
                      <>
                        Se Connecter
                        <ArrowRight size={18} />
                      </>
                    )}
                  </button>
                </form>

                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-border" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-3 bg-white text-muted-foreground">Ou continuer avec</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => console.log("Google login")}
                    className="h-11 rounded-lg border border-border bg-white hover:bg-muted transition-colors flex items-center justify-center gap-2 text-sm font-medium"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    Google
                  </button>
                  <button
                    type="button"
                    onClick={() => console.log("LinkedIn login")}
                    className="h-11 rounded-lg border border-border bg-white hover:bg-muted transition-colors flex items-center justify-center gap-2 text-sm font-medium"
                  >
                    <svg className="w-4 h-4" fill="#0A66C2" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                    LinkedIn
                  </button>
                </div>

                <p className="mt-6 text-center text-sm text-muted-foreground">
                  Pas encore de compte ?{" "}
                  <Link to="/signup" className="text-primary font-semibold hover:underline">
                    S'inscrire gratuitement
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Login;
