import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { apiService } from "@/services/api.service";
import type { ActivationResponse } from "@/types";

const AccountActivation = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const uid = searchParams.get("uid");
    const token = searchParams.get("token");

    if (!uid || !token) {
      setStatus("error");
      setMessage("Lien d'activation invalide. Paramètres manquants.");
      return;
    }

    apiService
      .post<ActivationResponse>("/users/activate/", { uid, token })
      .then((res) => {
        setStatus("success");
        setMessage(res.message || "Votre compte a été activé avec succès !");
      })
      .catch((err) => {
        setStatus("error");
        setMessage(err?.message || "Erreur lors de l'activation du compte.");
      });
  }, [searchParams]);

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
                className="inline-block bg-primary text-primary-foreground px-8 py-3 rounded-xl font-bold hover:opacity-90 transition-opacity"
              >
                Retour à la connexion
              </Link>
            </motion.div>
          )}
        </motion.div>
      </main>
      <Footer />
    </div>
  );
};

export default AccountActivation;
