import { useState } from "react";
import { Eye, EyeOff, Lock, Loader2, KeyRound, TriangleAlert } from "lucide-react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { useChangePassword, useDeleteAccount } from "@/hooks/useAuth";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const Settings = () => {
  const { logout } = useAuth();

  // ── Changement de mot de passe ─────────────────────────────
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [formError, setFormError] = useState("");

  const { mutateAsync: changePassword, isPending } = useChangePassword();

  // ── Suppression de compte ──────────────────────────────────
  const [deletePassword, setDeletePassword] = useState("");
  const [showDeletePassword, setShowDeletePassword] = useState(false);
  const [deleteError, setDeleteError] = useState("");
  const { mutateAsync: deleteAccount, isPending: isDeleting } = useDeleteAccount();

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (newPassword !== confirmPassword) {
      setFormError("Les nouveaux mots de passe ne correspondent pas.");
      return;
    }
    if (newPassword.length < 8) {
      setFormError("Le nouveau mot de passe doit contenir au moins 8 caractères.");
      return;
    }

    try {
      await changePassword({ current_password: currentPassword, new_password: newPassword, new_password_confirm: confirmPassword });
      toast({ title: "Mot de passe modifié avec succès.", description: "Vous allez être déconnecté." });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      // Déconnexion après changement de mot de passe (bonne pratique)
      setTimeout(() => logout(), 2000);
    } catch (err: any) {
      const msg = err?.message || "";
      if (msg.toLowerCase().includes("actuel")) {
        setFormError("Mot de passe actuel incorrect.");
      } else {
        setFormError(msg || "Une erreur est survenue.");
      }
    }
  };

  const handleDeleteAccount = async () => {
    setDeleteError("");
    if (!deletePassword) {
      setDeleteError("Le mot de passe est requis.");
      return;
    }
    try {
      await deleteAccount({ password: deletePassword });
      toast({ title: "Compte supprimé.", description: "Vous allez être redirigé." });
      setTimeout(() => logout(), 1500);
    } catch (err: any) {
      setDeleteError(err?.message || "Mot de passe incorrect.");
    }
  };

  return (
    <DashboardLayout userType="freelancer">
      <div className="space-y-6 max-w-2xl">
        <div>
          <h1 className="text-3xl font-bold mb-2">Paramètres</h1>
          <p className="text-muted-foreground">Gérez vos préférences et votre compte</p>
        </div>

        {/* ── Changement de mot de passe ── */}
        <div className="bg-white rounded-2xl border border-border p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <KeyRound className="text-primary" size={20} />
            </div>
            <div>
              <h2 className="text-lg font-semibold">Changer le mot de passe</h2>
              <p className="text-sm text-muted-foreground">Vous serez déconnecté après la modification</p>
            </div>
          </div>

          <form onSubmit={handleChangePassword} className="space-y-4">
            {formError && (
              <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
                {formError}
              </div>
            )}

            {/* Mot de passe actuel */}
            <div>
              <label htmlFor="current_password" className="block text-sm font-semibold mb-2">
                Mot de passe actuel
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  id="current_password"
                  type={showCurrent ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full h-11 pl-10 pr-11 rounded-lg border border-border bg-white text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrent(!showCurrent)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showCurrent ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Nouveau mot de passe */}
            <div>
              <label htmlFor="new_password" className="block text-sm font-semibold mb-2">
                Nouveau mot de passe
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  id="new_password"
                  type={showNew ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  minLength={8}
                  className="w-full h-11 pl-10 pr-11 rounded-lg border border-border bg-white text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Confirmation */}
            <div>
              <label htmlFor="confirm_password" className="block text-sm font-semibold mb-2">
                Confirmer le nouveau mot de passe
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

            <div className="pt-2">
              <button
                type="submit"
                disabled={isPending}
                className="h-11 px-6 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isPending ? <Loader2 size={16} className="animate-spin" /> : <KeyRound size={16} />}
                Modifier le mot de passe
              </button>
            </div>
          </form>
        </div>
        {/* ── Zone dangereuse ── */}
        <div className="bg-white rounded-2xl border border-destructive/30 p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-destructive/10 flex items-center justify-center">
              <TriangleAlert className="text-destructive" size={20} />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-destructive">Zone dangereuse</h2>
              <p className="text-sm text-muted-foreground">Ces actions sont irréversibles</p>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 rounded-xl border border-destructive/20 bg-destructive/5">
            <div>
              <p className="font-medium text-sm">Supprimer mon compte</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Votre compte sera désactivé définitivement. Vos données sont conservées conformément à la loi.
              </p>
            </div>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <button
                  onClick={() => { setDeletePassword(""); setDeleteError(""); }}
                  className="ml-4 shrink-0 h-9 px-4 rounded-lg border border-destructive text-destructive text-sm font-semibold hover:bg-destructive hover:text-white transition-colors"
                >
                  Supprimer
                </button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Supprimer votre compte ?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Cette action est irréversible. Votre compte sera désactivé immédiatement.
                    Confirmez en entrant votre mot de passe.
                  </AlertDialogDescription>
                </AlertDialogHeader>

                <div className="my-2">
                  {deleteError && (
                    <div className="mb-3 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
                      {deleteError}
                    </div>
                  )}
                  <div className="relative">
                    <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <input
                      type={showDeletePassword ? "text" : "password"}
                      value={deletePassword}
                      onChange={(e) => setDeletePassword(e.target.value)}
                      placeholder="Votre mot de passe"
                      className="w-full h-11 pl-10 pr-11 rounded-lg border border-border bg-white text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-destructive/20 focus:border-destructive transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowDeletePassword(!showDeletePassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showDeletePassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <AlertDialogFooter>
                  <AlertDialogCancel>Annuler</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDeleteAccount}
                    disabled={isDeleting || !deletePassword}
                    className="bg-destructive hover:bg-destructive/90 text-white disabled:opacity-50"
                  >
                    {isDeleting ? <Loader2 size={16} className="animate-spin mr-2" /> : null}
                    Supprimer définitivement
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
};

export default Settings;
