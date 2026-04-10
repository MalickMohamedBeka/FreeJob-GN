import { useState, useEffect, Component } from "react";
import type { ErrorInfo, ReactNode } from "react";
import {
  Eye, EyeOff, Lock, Loader2, KeyRound, TriangleAlert,
  Bell, BriefcaseBusiness, CalendarClock, Plus, Trash2,
} from "lucide-react";

class ErrorBoundary extends Component<{ children: ReactNode }, { error: Error | null }> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { error: null };
  }
  static getDerivedStateFromError(error: Error) {
    return { error };
  }
  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("Settings crash:", error, info);
  }
  render() {
    if (this.state.error) {
      return (
        <div className="p-6 rounded-xl border border-destructive/30 bg-destructive/5">
          <p className="text-destructive font-semibold mb-2">Erreur de chargement</p>
          <pre className="text-xs text-muted-foreground whitespace-pre-wrap">{this.state.error.message}</pre>
        </div>
      );
    }
    return this.props.children;
  }
}
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
import { useNotificationPreferences, useUpdateNotificationPreferences } from "@/hooks/useNotifications";
import { useUpdateFreelanceProfile, useFreelanceProfile } from "@/hooks/useProfile";
import { useJobAlerts, useCreateJobAlert, useUpdateJobAlert, useToggleJobAlert, useDeleteJobAlert } from "@/hooks/useJobAlerts";
import type { JobAlertFrequency } from "@/types";

// ── Toggle Switch helper ──────────────────────────────────────────────────────

function Toggle({ checked, onChange, disabled }: { checked: boolean; onChange: (v: boolean) => void; disabled?: boolean }) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed ${
        checked ? "bg-primary" : "bg-muted-foreground/30"
      }`}
    >
      <span
        className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow ring-0 transition-transform duration-200 ${
          checked ? "translate-x-5" : "translate-x-0"
        }`}
      />
    </button>
  );
}

// ── Section wrapper ───────────────────────────────────────────────────────────

function Section({ icon, title, subtitle, danger, children }: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  danger?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className={`bg-white rounded-2xl border p-6 shadow-sm ${danger ? "border-destructive/30" : "border-border"}`}>
      <div className="flex items-center gap-3 mb-6">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${danger ? "bg-destructive/10" : "bg-primary/10"}`}>
          <span className={danger ? "text-destructive" : "text-primary"}>{icon}</span>
        </div>
        <div>
          <h2 className={`text-lg font-semibold ${danger ? "text-destructive" : ""}`}>{title}</h2>
          <p className="text-sm text-muted-foreground">{subtitle}</p>
        </div>
      </div>
      {children}
    </div>
  );
}

// ── Notification Preferences ──────────────────────────────────────────────────

function NotificationPreferencesSection() {
  const { data: prefs, isLoading } = useNotificationPreferences();
  const { mutate: update, isPending } = useUpdateNotificationPreferences();

  if (isLoading) {
    return <div className="flex items-center gap-2 text-sm text-muted-foreground"><Loader2 size={14} className="animate-spin" /> Chargement…</div>;
  }

  const toggle = (field: "email_enabled" | "sms_enabled" | "push_enabled") => {
    if (!prefs) return;
    update({ [field]: !prefs[field] });
  };

  return (
    <div className="space-y-4">
      {(
        [
          { key: "email_enabled" as const, label: "Notifications par email" },
          { key: "sms_enabled" as const, label: "Notifications par SMS" },
          { key: "push_enabled" as const, label: "Notifications push" },
        ] as const
      ).map(({ key, label }) => (
        <div key={key} className="flex items-center justify-between py-2 border-b border-border last:border-0">
          <span className="text-sm font-medium">{label}</span>
          <Toggle
            checked={prefs?.[key] ?? false}
            onChange={() => toggle(key)}
            disabled={isPending}
          />
        </div>
      ))}
    </div>
  );
}

// ── Provider Availability ─────────────────────────────────────────────────────

function AvailabilitySection() {
  const { data: profile, isLoading } = useFreelanceProfile();
  const { mutate: update, isPending } = useUpdateFreelanceProfile();

  const [availableFrom, setAvailableFrom] = useState<string>("");

  useEffect(() => {
    if (profile) {
      setAvailableFrom(profile.available_from ?? "");
    }
  }, [profile]);

  if (isLoading) {
    return <div className="flex items-center gap-2 text-sm text-muted-foreground"><Loader2 size={14} className="animate-spin" /> Chargement…</div>;
  }

  const handleToggle = (v: boolean) => {
    update(
      { is_available: v },
      {
        onSuccess: () => toast({ title: v ? "Vous êtes maintenant disponible." : "Disponibilité désactivée." }),
        onError: () => toast({ title: "Erreur", variant: "destructive" }),
      }
    );
  };

  const handleSaveDate = () => {
    update(
      { available_from: availableFrom || null },
      {
        onSuccess: () => toast({ title: "Date de disponibilité enregistrée." }),
        onError: () => toast({ title: "Erreur", variant: "destructive" }),
      }
    );
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between py-2">
        <div>
          <p className="text-sm font-medium">Disponible pour des missions</p>
          <p className="text-xs text-muted-foreground mt-0.5">Visible sur votre profil public</p>
        </div>
        <Toggle checked={profile?.is_available ?? false} onChange={handleToggle} disabled={isPending} />
      </div>

      <div>
        <label className="block text-sm font-semibold mb-2">Disponible à partir du</label>
        <div className="flex gap-3">
          <input
            type="date"
            value={availableFrom}
            onChange={(e) => setAvailableFrom(e.target.value)}
            className="flex-1 h-10 px-3 rounded-lg border border-border bg-white text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors text-sm"
          />
          <button
            type="button"
            onClick={handleSaveDate}
            disabled={isPending}
            className="h-10 px-4 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {isPending ? <Loader2 size={14} className="animate-spin" /> : null}
            Enregistrer
          </button>
        </div>
        <p className="text-xs text-muted-foreground mt-1">Laissez vide si vous êtes disponible immédiatement.</p>
      </div>
    </div>
  );
}

// ── Job Alerts ────────────────────────────────────────────────────────────────

const FREQ_LABELS: Record<JobAlertFrequency, string> = {
  INSTANT: "Instantané",
  DAILY: "Quotidien",
  WEEKLY: "Hebdomadaire",
};

function JobAlertsSection() {
  const { data: alerts, isLoading } = useJobAlerts();
  const { mutate: createAlert, isPending: isCreating } = useCreateJobAlert();
  const { mutate: toggleAlert } = useToggleJobAlert();
  const { mutate: deleteAlert } = useDeleteJobAlert();
  const [newFreq, setNewFreq] = useState<JobAlertFrequency>("INSTANT");

  const handleCreate = () => {
    createAlert(
      { frequency: newFreq, filters: {} },
      {
        onSuccess: () => toast({ title: "Alerte créée." }),
        onError: () => toast({ title: "Erreur", variant: "destructive" }),
      }
    );
  };

  if (isLoading) {
    return <div className="flex items-center gap-2 text-sm text-muted-foreground"><Loader2 size={14} className="animate-spin" /> Chargement…</div>;
  }

  return (
    <div className="space-y-4">
      {/* Existing alerts */}
      {(alerts ?? []).length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-3">Aucune alerte configurée.</p>
      ) : (
        <ul className="space-y-2">
          {(alerts ?? []).map((alert) => (
            <li key={alert.id} className="flex items-center justify-between p-3 rounded-lg border border-border bg-muted/30">
              <div className="flex items-center gap-3">
                <Toggle
                  checked={alert.is_active}
                  onChange={() => toggleAlert(alert.id)}
                />
                <div>
                  <p className="text-sm font-medium">Fréquence : {FREQ_LABELS[alert.frequency]}</p>
                  <p className="text-xs text-muted-foreground">
                    {alert.last_sent_at
                      ? `Dernier envoi : ${new Date(alert.last_sent_at).toLocaleDateString("fr-FR")}`
                      : "Jamais envoyée"}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() =>
                  deleteAlert(alert.id, {
                    onSuccess: () => toast({ title: "Alerte supprimée." }),
                  })
                }
                className="text-destructive hover:bg-destructive/10 p-1.5 rounded-lg transition-colors"
              >
                <Trash2 size={15} />
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* Create new alert */}
      <div className="flex gap-3 pt-1">
        <select
          value={newFreq}
          onChange={(e) => setNewFreq(e.target.value as JobAlertFrequency)}
          className="flex-1 h-10 px-3 rounded-lg border border-border bg-white text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
        >
          {(Object.entries(FREQ_LABELS) as [JobAlertFrequency, string][]).map(([v, l]) => (
            <option key={v} value={v}>{l}</option>
          ))}
        </select>
        <button
          type="button"
          onClick={handleCreate}
          disabled={isCreating}
          className="h-10 px-4 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center gap-2"
        >
          {isCreating ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
          Nouvelle alerte
        </button>
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

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
      <ErrorBoundary>
      <div className="space-y-6 max-w-2xl">
        <div>
          <h1 className="text-3xl font-bold mb-2">Paramètres</h1>
          <p className="text-muted-foreground">Gérez vos préférences et votre compte</p>
        </div>

        {/* ── Notifications ── */}
        <ErrorBoundary>
          <Section icon={<Bell size={20} />} title="Préférences de notifications" subtitle="Choisissez comment vous voulez être notifié">
            <NotificationPreferencesSection />
          </Section>
        </ErrorBoundary>

        {/* ── Disponibilité ── */}
        <ErrorBoundary>
          <Section icon={<CalendarClock size={20} />} title="Disponibilité" subtitle="Indiquez votre disponibilité aux clients">
            <AvailabilitySection />
          </Section>
        </ErrorBoundary>

        {/* ── Alertes emploi ── */}
        <ErrorBoundary>
          <Section icon={<BriefcaseBusiness size={20} />} title="Alertes projets" subtitle="Recevez des notifications pour les nouveaux projets correspondant à votre profil">
            <JobAlertsSection />
          </Section>
        </ErrorBoundary>

        {/* ── Changement de mot de passe ── */}
        <Section icon={<KeyRound size={20} />} title="Changer le mot de passe" subtitle="Vous serez déconnecté après la modification">
          <form onSubmit={handleChangePassword} className="space-y-4">
            {formError && (
              <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
                {formError}
              </div>
            )}

            <div>
              <label htmlFor="current_password" className="block text-sm font-semibold mb-2">Mot de passe actuel</label>
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
                <button type="button" onClick={() => setShowCurrent(!showCurrent)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                  {showCurrent ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="new_password" className="block text-sm font-semibold mb-2">Nouveau mot de passe</label>
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
                <button type="button" onClick={() => setShowNew(!showNew)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                  {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="confirm_password" className="block text-sm font-semibold mb-2">Confirmer le nouveau mot de passe</label>
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
                <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
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
        </Section>

        {/* ── Zone dangereuse ── */}
        <Section icon={<TriangleAlert size={20} />} title="Zone dangereuse" subtitle="Ces actions sont irréversibles" danger>
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
        </Section>

      </div>
      </ErrorBoundary>
    </DashboardLayout>
  );
};

export default Settings;
