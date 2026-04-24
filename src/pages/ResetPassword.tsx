import { useState } from "react";
import { Eye, EyeOff, Lock, ArrowRight, CheckCircle2 } from "lucide-react";
import { Loader2 } from "lucide-react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { ROUTES } from "@/constants";
import { useResetPassword } from "@/hooks/useAuth";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const uid = searchParams.get("uid") ?? "";
  const token = searchParams.get("token") ?? "";

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formError, setFormError] = useState("");

  const { mutateAsync, isPending, error } = useResetPassword();

  // Lien invalide — uid ou token manquant
  if (!uid || !token) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <main className="pt-16 flex items-center justify-center min-h-screen">
          <div className="container mx-auto px-4 py-12 max-w-md">
            <div className="bg-white rounded-2xl border border-border p-8 shadow-sm text-center space-y-4">
              <h1 className="text-2xl font-bold text-destructive">Lien invalide</h1>
              <p className="text-muted-foreground text-sm">
                Ce lien de réinitialisation est invalide ou incomplet.
              </p>
              <Link
                to={ROUTES.FORGOT_PASSWORD}
                className="inline-flex items-center gap-2 text-primary font-medium hover:underline text-sm"
              >
                Demander un nouveau lien
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (newPassword !== confirmPassword) {
      setFormError("Les mots de passe ne correspondent pas.");
      return;
    }
    if (newPassword.length < 8) {
      setFormError("Le mot de passe doit contenir au moins 8 caractères.");
      return;
    }

    try {
      await mutateAsync({
        uid,
        token,
        new_password: newPassword,
        new_password_confirm: confirmPassword,
      });
      setSuccess(true);
      setTimeout(() => navigate(ROUTES.LOGIN), 3000);
    } catch (err: any) {
      const detail = err?.message || "";
      // Lien expiré → rediriger vers forgot-password
      if (detail.toLowerCase().includes("expiré") || detail.toLowerCase().includes("invalide")) {
        navigate(ROUTES.FORGOT_PASSWORD + "?expired=1");
      }
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <main className="pt-16 flex items-center justify-center min-h-screen">
          <div className="container mx-auto px-4 py-12 max-w-md">
            <div className="bg-white rounded-2xl border border-border p-8 shadow-sm text-center space-y-4">
              <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mx-auto">
                <CheckCircle2 className="text-green-600" size={28} />
              </div>
              <h1 className="text-2xl font-bold">Mot de passe modifié</h1>
              <p className="text-muted-foreground text-sm">
                Votre mot de passe a été réinitialisé avec succès. Vous allez être redirigé vers la
                connexion...
              </p>
              <Link to={ROUTES.LOGIN} className="inline-block text-primary font-medium hover:underline text-sm">
                Se connecter maintenant
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="pt-16 flex items-center justify-center min-h-screen">
        <div className="container mx-auto px-4 py-12 max-w-md">
          <div className="bg-white rounded-2xl border border-border p-8 shadow-sm">
            <div className="mb-8">
              <h1 className="text-2xl font-bold mb-1">Nouveau mot de passe</h1>
              <p className="text-muted-foreground text-sm">
                Choisissez un nouveau mot de passe sécurisé.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {(formError || error) && (
                <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
                  {formError || (error as any)?.message || "Une erreur est survenue."}
                </div>
              )}

              <div>
                <label htmlFor="new_password" className="block text-sm font-semibold mb-2">
                  Nouveau mot de passe
                </label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    id="new_password"
                    type={showPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    minLength={8}
                    className="w-full h-11 pl-10 pr-11 rounded-lg border border-border bg-white text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div>
                <label htmlFor="confirm_password" className="block text-sm font-semibold mb-2">
                  Confirmer le mot de passe
                </label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    id="confirm_password"
                    type={showConfirm ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full h-11 pl-10 pr-11 rounded-lg border border-border bg-white text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isPending}
                className="w-full h-11 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isPending ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <>
                    Réinitialiser le mot de passe
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ResetPassword;
