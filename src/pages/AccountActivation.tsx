import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle2, XCircle, Loader2, Mail, Send } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { apiService } from "@/services/api.service";
import { useResendActivation } from "@/hooks/useAuth";
import type { ActivationResponse } from "@/types";

const AccountActivation = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");

  // Resend activation state
  const resend = useResendActivation();
  const [resendEmail, setResendEmail] = useState("");
  const [resendStatus, setResendStatus] = useState<"idle" | "success" | "error">("idle");
  const [resendMessage, setResendMessage] = useState("");

  useEffect(() => {
    const uid = searchParams.get("uid");
    const token = searchParams.get("token");

    if (!uid || !token) {
      setStatus("error");
      setMessage("Lien d'activation invalide. Paramètres manquants.");
      return;
    }

    apiService
      .postPublic<ActivationResponse>("/users/activate/", { uid, token })
      .then((res) => {
        setStatus("success");
        setMessage(res.message || "Votre compte a été activé avec succès !");
      })
      .catch((err) => {
        setStatus("error");
        setMessage(err?.message || "Erreur lors de l'activation du compte.");
      });
  }, [searchParams]);

  const handleResend = async (e: React.FormEvent) => {
    e.preventDefault();
    setResendStatus("idle");
    setResendMessage("");
    try {
      const res = await resend.mutateAsync({ email: resendEmail });
      setResendStatus("success");
      setResendMessage(res.message || "Email d'activation renvoyé avec succès.");
    } catch (err) {
      setResendStatus("error");
      setResendMessage(err instanceof Error ? err.message : "Erreur lors de l'envoi de l'email.");
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="pt-20 pb-16 flex items-center justify-center min-h-screen">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md mx-auto px-4"
        >
          {status === "loading" && (
            <>
              <Loader2 className="mx-auto text-primary mb-4 animate-spin" size={64} />
              <h1 className="text-2xl font-bold mb-2">Activation en cours...</h1>
              <p className="text-muted-foreground">Veuillez patienter pendant que nous activons votre compte.</p>
            </>
          )}

          {status === "success" && (
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }}>
              <CheckCircle2 className="mx-auto text-primary mb-4" size={64} />
              <h1 className="text-2xl font-bold mb-2">Compte activé !</h1>
              <p className="text-muted-foreground mb-6">{message}</p>
              <Link
                to="/login"
                className="inline-block bg-primary text-primary-foreground px-8 py-3 rounded-xl font-bold hover:opacity-90 transition-opacity"
              >
                Se connecter
              </Link>
            </motion.div>
          )}

          {status === "error" && (
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }}>
              <XCircle className="mx-auto text-destructive mb-4" size={64} />
              <h1 className="text-2xl font-bold mb-2">Erreur d'activation</h1>
              <p className="text-muted-foreground mb-6">{message}</p>
              <Link
                to="/login"
                className="inline-block bg-primary text-primary-foreground px-8 py-3 rounded-xl font-bold hover:opacity-90 transition-opacity mb-8"
              >
                Retour à la connexion
              </Link>

              {/* Resend activation section */}
              <div className="mt-8 p-6 border border-border rounded-xl text-left">
                <div className="flex items-center gap-2 mb-2">
                  <Mail size={18} className="text-primary" />
                  <h2 className="font-semibold text-sm">Renvoyer l'email d'activation</h2>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Entrez votre adresse email pour recevoir un nouveau lien d'activation.
                </p>

                {resendStatus === "success" ? (
                  <div className="flex items-center gap-2 text-sm text-primary">
                    <CheckCircle2 size={16} />
                    <span>{resendMessage}</span>
                  </div>
                ) : (
                  <form onSubmit={handleResend} className="space-y-3">
                    <input
                      type="email"
                      value={resendEmail}
                      onChange={(e) => setResendEmail(e.target.value)}
                      placeholder="votre@email.com"
                      required
                      className="w-full h-10 px-3 rounded-lg border border-border bg-white text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors text-sm"
                    />
                    {resendStatus === "error" && (
                      <p className="text-xs text-destructive">{resendMessage}</p>
                    )}
                    <button
                      type="submit"
                      disabled={resend.isPending}
                      className="w-full h-10 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm"
                    >
                      {resend.isPending ? (
                        <Loader2 size={16} className="animate-spin" />
                      ) : (
                        <>
                          <Send size={16} />
                          Renvoyer l'email
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </motion.div>
          )}
        </motion.div>
      </main>
      <Footer />
    </div>
  );
};

export default AccountActivation;
