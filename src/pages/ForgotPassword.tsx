import { useState } from "react";
import { Mail, ArrowRight, ArrowLeft, CheckCircle2 } from "lucide-react";
import { Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { ROUTES } from "@/constants";
import { useForgotPassword } from "@/hooks/useAuth";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const { mutateAsync, isPending, error } = useForgotPassword();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await mutateAsync({ email });
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="pt-16 flex items-center justify-center min-h-screen">
        <div className="container mx-auto px-4 py-12 max-w-md">
          <div className="bg-white rounded-2xl border border-border p-8 shadow-sm">

            {submitted ? (
              <div className="text-center space-y-4">
                <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="text-green-600" size={28} />
                </div>
                <h1 className="text-2xl font-bold">Email envoyé</h1>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Si un compte actif existe avec cet email, vous recevrez un lien de
                  réinitialisation. Vérifiez aussi vos spams.
                </p>
                <Link
                  to={ROUTES.LOGIN}
                  className="inline-flex items-center gap-2 text-primary font-medium hover:underline text-sm mt-2"
                >
                  <ArrowLeft size={16} />
                  Retour à la connexion
                </Link>
              </div>
            ) : (
              <>
                <div className="mb-8">
                  <h1 className="text-2xl font-bold mb-1">Mot de passe oublié</h1>
                  <p className="text-muted-foreground text-sm">
                    Entrez votre email pour recevoir un lien de réinitialisation.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  {error && (
                    <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
                      {(error as any)?.message || "Une erreur est survenue."}
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

                  <button
                    type="submit"
                    disabled={isPending}
                    className="w-full h-11 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isPending ? (
                      <Loader2 size={18} className="animate-spin" />
                    ) : (
                      <>
                        Envoyer le lien
                        <ArrowRight size={18} />
                      </>
                    )}
                  </button>
                </form>

                <p className="mt-6 text-center text-sm text-muted-foreground">
                  <Link
                    to={ROUTES.LOGIN}
                    className="inline-flex items-center gap-1 text-primary font-medium hover:underline"
                  >
                    <ArrowLeft size={14} />
                    Retour à la connexion
                  </Link>
                </p>
              </>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ForgotPassword;
