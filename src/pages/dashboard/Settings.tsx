import { useState, useEffect, Component } from "react";
import type { ErrorInfo, ReactNode } from "react";
import {
  Eye, EyeOff, Lock, Loader2, KeyRound, TriangleAlert,
  Bell, BriefcaseBusiness, CalendarClock, Plus, Trash2, RotateCcw,
  ChevronDown, ChevronUp, Smartphone, ShieldCheck, UserCircle,
  EyeIcon, Mail, BadgeCheck, Link as LinkIcon,
  BarChart3, Activity, Star, Users, Zap, Crown,
} from "lucide-react";
import { Link } from "react-router-dom";
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
import {
  useNotificationPreferences,
  useUpdateNotificationPreferences,
  useNotificationTypes,
  useResetNotificationPreferences,
  usePushSubscription,
} from "@/hooks/useNotifications";
import { useUpdateFreelanceProfile, useFreelanceProfile } from "@/hooks/useProfile";
import {
  useJobAlerts,
  useCreateJobAlert,
  useToggleJobAlert,
  useDeleteJobAlert,
} from "@/hooks/useJobAlerts";
import { ROUTES } from "@/constants/routes";
import type { JobAlertFrequency } from "@/types";
import {
  useMySubscription,
  useSubscriptionUsage,
  useMonthlyUsage,
} from "@/hooks/useSubscriptions";

// ── Error boundary ─────────────────────────────────────────────────────────────

class ErrorBoundary extends Component<
  { children: ReactNode },
  { error: Error | null }
> {
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
          <p className="text-destructive font-semibold mb-1">Erreur de chargement</p>
          <pre className="text-xs text-muted-foreground whitespace-pre-wrap">
            {this.state.error.message}
          </pre>
        </div>
      );
    }
    return this.props.children;
  }
}

// ── Section types ──────────────────────────────────────────────────────────────

type SettingsSection = "compte" | "securite" | "notifications" | "confidentialite" | "utilisation";

const NAV_ITEMS: {
  id: SettingsSection;
  label: string;
  icon: React.ElementType;
}[] = [
  { id: "compte",           label: "Compte",          icon: UserCircle  },
  { id: "securite",         label: "Sécurité",        icon: ShieldCheck },
  { id: "notifications",    label: "Notifications",   icon: Bell        },
  { id: "confidentialite",  label: "Confidentialité", icon: EyeIcon     },
  { id: "utilisation",      label: "Utilisation",     icon: BarChart3   },
];

// ── Toggle switch ──────────────────────────────────────────────────────────────

function Toggle({
  checked,
  onChange,
  disabled,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-[22px] w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none disabled:opacity-40 disabled:cursor-not-allowed ${
        checked ? "bg-primary" : "bg-muted-foreground/25"
      }`}
    >
      <span
        className={`pointer-events-none inline-block h-[18px] w-[18px] rounded-full bg-white shadow ring-0 transition-transform duration-200 ${
          checked ? "translate-x-[18px]" : "translate-x-0"
        }`}
      />
    </button>
  );
}

// ── Sidebar ────────────────────────────────────────────────────────────────────

function SettingsSidebar({
  active,
  onChange,
}: {
  active: SettingsSection;
  onChange: (s: SettingsSection) => void;
}) {
  return (
    <>
      {/* Mobile — tabs */}
      <div className="flex lg:hidden gap-0.5 overflow-x-auto pb-0.5">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = active === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onChange(item.id)}
              className={`flex items-center gap-2 shrink-0 px-4 py-2 rounded-full text-sm transition-all ${
                isActive
                  ? "bg-foreground text-background font-medium"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon size={14} />
              {item.label}
            </button>
          );
        })}
      </div>

      {/* Desktop — sidebar */}
      <nav className="hidden lg:block w-48 shrink-0 pt-1">
        <ul className="space-y-px">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = active === item.id;
            return (
              <li key={item.id}>
                <button
                  onClick={() => onChange(item.id)}
                  className={`relative w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm text-left transition-colors ${
                    isActive
                      ? "text-foreground font-medium"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {/* Active indicator */}
                  <span
                    className={`absolute left-0 top-1/2 -translate-y-1/2 h-4 w-[3px] rounded-r-full transition-all ${
                      isActive ? "bg-primary opacity-100" : "opacity-0"
                    }`}
                  />
                  <Icon
                    size={15}
                    className={isActive ? "text-primary" : ""}
                  />
                  {item.label}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );
}

// ── Sub-section label ──────────────────────────────────────────────────────────

function SubLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[11px] font-semibold text-muted-foreground/70 uppercase tracking-widest mb-3">
      {children}
    </p>
  );
}

// ── Setting row (label + optional hint + action) ───────────────────────────────

function SettingRow({
  label,
  hint,
  last,
  children,
}: {
  label: string;
  hint?: string;
  last?: boolean;
  children?: React.ReactNode;
}) {
  return (
    <div
      className={`flex items-center justify-between gap-6 py-4 ${
        !last ? "border-b border-border/50" : ""
      }`}
    >
      <div className="min-w-0">
        <p className="text-sm text-foreground">{label}</p>
        {hint && <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{hint}</p>}
      </div>
      {children && <div className="shrink-0">{children}</div>}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 1 — Compte
// ─────────────────────────────────────────────────────────────────────────────

function ComptePanel() {
  const { user } = useAuth();
  const { data: profile, isLoading } = useFreelanceProfile();

  const roleLabel =
    user?.role === "CLIENT"
      ? "Client"
      : user?.provider_kind === "AGENCY"
      ? "Agence"
      : "Prestataire freelance";

  return (
    <div>
      <div className="mb-7">
        <h2 className="text-base font-semibold text-foreground">Informations du compte</h2>
        <p className="text-sm text-muted-foreground mt-0.5">
          Vos données d'identification sur FreeJob GN
        </p>
      </div>

      {isLoading ? (
        <div className="flex items-center gap-2 text-sm text-muted-foreground py-4">
          <Loader2 size={14} className="animate-spin" /> Chargement…
        </div>
      ) : (
        <div className="divide-y divide-border/50">
          <SettingRow label="Nom d'utilisateur" hint="Identifiant unique sur la plateforme">
            <span className="text-sm text-muted-foreground font-medium">{user?.username ?? "—"}</span>
          </SettingRow>

          <SettingRow label="Adresse email" hint="Utilisée pour la connexion et les notifications">
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <Mail size={13} />
              {user?.email ?? "—"}
            </div>
          </SettingRow>

          <SettingRow label="Téléphone">
            <span className="text-sm text-muted-foreground">
              {profile?.phone || "Non renseigné"}
            </span>
          </SettingRow>

          <SettingRow label="Rôle">
            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-primary bg-primary/8 px-2.5 py-1 rounded-full">
              <BadgeCheck size={11} />
              {roleLabel}
            </span>
          </SettingRow>

          <SettingRow label="Localisation" last>
            <span className="text-sm text-muted-foreground">
              {[profile?.city_or_region, profile?.country].filter(Boolean).join(", ") || "Non renseignée"}
            </span>
          </SettingRow>
        </div>
      )}

      <div className="mt-8 pt-6 border-t border-border/50 flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-foreground">Modifier le profil complet</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            Compétences, bio, tarif horaire, photo et plus encore.
          </p>
        </div>
        <Link
          to={ROUTES.DASHBOARD.PROFILE}
          className="flex items-center gap-1.5 text-sm font-medium text-primary hover:underline underline-offset-2 shrink-0"
        >
          Accéder
          <LinkIcon size={12} />
        </Link>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 2 — Sécurité
// ─────────────────────────────────────────────────────────────────────────────

function SecuritePanel({ onLogout }: { onLogout: () => void }) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [formError, setFormError] = useState("");

  const [deletePassword, setDeletePassword] = useState("");
  const [showDeletePassword, setShowDeletePassword] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  const { mutateAsync: changePassword, isPending } = useChangePassword();
  const { mutateAsync: deleteAccount, isPending: isDeleting } = useDeleteAccount();

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    if (newPassword !== confirmPassword) {
      setFormError("Les nouveaux mots de passe ne correspondent pas.");
      return;
    }
    if (newPassword.length < 8) {
      setFormError("Le mot de passe doit contenir au moins 8 caractères.");
      return;
    }
    try {
      await changePassword({
        current_password: currentPassword,
        new_password: newPassword,
        new_password_confirm: confirmPassword,
      });
      toast({ title: "Mot de passe modifié.", description: "Vous allez être déconnecté." });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setTimeout(() => onLogout(), 2000);
    } catch (err: any) {
      const msg = err?.message || "";
      setFormError(
        msg.toLowerCase().includes("actuel")
          ? "Mot de passe actuel incorrect."
          : msg || "Une erreur est survenue."
      );
    }
  };

  const handleDeleteAccount = async () => {
    setDeleteError("");
    if (!deletePassword) { setDeleteError("Le mot de passe est requis."); return; }
    try {
      await deleteAccount({ password: deletePassword });
      toast({ title: "Compte supprimé.", description: "Vous allez être redirigé." });
      setTimeout(() => onLogout(), 1500);
    } catch (err: any) {
      setDeleteError(err?.message || "Mot de passe incorrect.");
    }
  };

  const pwField = (
    id: string,
    value: string,
    onChange: (v: string) => void,
    show: boolean,
    toggle: () => void,
    minLength?: number
  ) => (
    <div className="relative">
      <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/60" />
      <input
        id={id}
        type={show ? "text" : "password"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="••••••••"
        required
        minLength={minLength}
        className="w-full h-10 pl-9 pr-10 rounded-lg border border-border bg-transparent text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-primary/30 focus:border-primary transition-colors"
      />
      <button
        type="button"
        onClick={toggle}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/60 hover:text-muted-foreground transition-colors"
      >
        {show ? <EyeOff size={14} /> : <Eye size={14} />}
      </button>
    </div>
  );

  return (
    <div>
      {/* Password section */}
      <div className="mb-7">
        <h2 className="text-base font-semibold text-foreground">Sécurité</h2>
        <p className="text-sm text-muted-foreground mt-0.5">
          Mot de passe et accès à votre compte
        </p>
      </div>

      <SubLabel>Modifier le mot de passe</SubLabel>

      <form onSubmit={handleChangePassword} className="space-y-4">
        {formError && (
          <p className="text-xs text-destructive bg-destructive/8 border border-destructive/20 px-3 py-2.5 rounded-lg">
            {formError}
          </p>
        )}

        <div className="space-y-3">
          <div>
            <label htmlFor="current_pw" className="block text-xs text-muted-foreground mb-1.5">
              Mot de passe actuel
            </label>
            {pwField("current_pw", currentPassword, setCurrentPassword, showCurrent, () => setShowCurrent(v => !v))}
          </div>
          <div>
            <label htmlFor="new_pw" className="block text-xs text-muted-foreground mb-1.5">
              Nouveau mot de passe
            </label>
            {pwField("new_pw", newPassword, setNewPassword, showNew, () => setShowNew(v => !v), 8)}
          </div>
          <div>
            <label htmlFor="confirm_pw" className="block text-xs text-muted-foreground mb-1.5">
              Confirmer le nouveau mot de passe
            </label>
            {pwField("confirm_pw", confirmPassword, setConfirmPassword, showConfirm, () => setShowConfirm(v => !v))}
          </div>
        </div>

        <div className="pt-1">
          <button
            type="submit"
            disabled={isPending}
            className="h-9 px-5 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isPending ? <Loader2 size={13} className="animate-spin" /> : <KeyRound size={13} />}
            Modifier le mot de passe
          </button>
        </div>
      </form>

      {/* Danger zone */}
      <div className="mt-10 pt-8 border-t border-border/50">
        <SubLabel>Zone dangereuse</SubLabel>

        <div className="flex items-center justify-between gap-4 py-4">
          <div>
            <p className="text-sm font-medium text-foreground">Supprimer mon compte</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Action irréversible — votre compte sera désactivé définitivement.
            </p>
          </div>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <button
                onClick={() => { setDeletePassword(""); setDeleteError(""); }}
                className="shrink-0 h-8 px-4 rounded-lg border border-destructive/40 text-destructive text-xs font-medium hover:bg-destructive hover:text-white transition-colors"
              >
                Supprimer
              </button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Supprimer votre compte ?</AlertDialogTitle>
                <AlertDialogDescription>
                  Cette action est irréversible. Votre compte sera désactivé
                  immédiatement. Confirmez en entrant votre mot de passe.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <div className="my-2">
                {deleteError && (
                  <p className="mb-3 text-xs text-destructive bg-destructive/8 border border-destructive/20 px-3 py-2.5 rounded-lg">
                    {deleteError}
                  </p>
                )}
                <div className="relative">
                  <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/60" />
                  <input
                    type={showDeletePassword ? "text" : "password"}
                    value={deletePassword}
                    onChange={(e) => setDeletePassword(e.target.value)}
                    placeholder="Votre mot de passe"
                    className="w-full h-10 pl-9 pr-10 rounded-lg border border-border text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-destructive/30 focus:border-destructive transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowDeletePassword(v => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/60 hover:text-muted-foreground transition-colors"
                  >
                    {showDeletePassword ? <EyeOff size={14} /> : <Eye size={14} />}
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
                  {isDeleting && <Loader2 size={13} className="animate-spin mr-1.5" />}
                  Supprimer définitivement
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 3 — Notifications
// ─────────────────────────────────────────────────────────────────────────────

const CHANNEL_LABELS: Record<string, string> = {
  email: "Email",
  sms: "SMS",
  push: "Push",
};

const FREQ_LABELS: Record<JobAlertFrequency, string> = {
  INSTANT: "Instantané",
  DAILY: "Quotidien",
  WEEKLY: "Hebdomadaire",
};

function PushToggle() {
  const { subscribe, unsubscribe } = usePushSubscription();
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [checking, setChecking] = useState(true);

  useState(() => {
    if (!("serviceWorker" in navigator)) { setChecking(false); return; }
    navigator.serviceWorker.getRegistration("/sw.js").then(async (reg) => {
      if (reg) { const sub = await reg.pushManager.getSubscription(); setIsSubscribed(!!sub); }
      setChecking(false);
    }).catch(() => setChecking(false));
  });

  const unsupported = !("serviceWorker" in navigator) || !("PushManager" in window);
  const isPending = subscribe.isPending || unsubscribe.isPending;

  const handleToggle = (v: boolean) => {
    if (v) {
      subscribe.mutate(undefined, {
        onSuccess: () => { setIsSubscribed(true); toast({ title: "Notifications push activées." }); },
        onError: (err) => toast({ title: "Erreur", description: err instanceof Error ? err.message : "Erreur.", variant: "destructive" }),
      });
    } else {
      unsubscribe.mutate(undefined, {
        onSuccess: () => { setIsSubscribed(false); toast({ title: "Notifications push désactivées." }); },
        onError: (err) => toast({ title: "Erreur", description: err instanceof Error ? err.message : "Erreur.", variant: "destructive" }),
      });
    }
  };

  return (
    <SettingRow
      label="Notifications push (navigateur)"
      hint={unsupported ? "Non supportées par ce navigateur." : isSubscribed ? "Activées sur cet appareil." : "Recevez des alertes même sans ouvrir l'application."}
      last
    >
      {checking ? (
        <Loader2 size={13} className="animate-spin text-muted-foreground" />
      ) : (
        <Toggle checked={unsupported ? false : isSubscribed} onChange={unsupported ? () => {} : handleToggle} disabled={unsupported || isPending} />
      )}
    </SettingRow>
  );
}

function AdvancedTypes() {
  const [expanded, setExpanded] = useState(false);
  const { data: types, isLoading: tl } = useNotificationTypes();
  const { data: prefs, isLoading: pl } = useNotificationPreferences();
  const { mutate: update, isPending: isUpdating } = useUpdateNotificationPreferences();
  const { mutate: reset, isPending: isResetting } = useResetNotificationPreferences();

  const toggle = (typeValue: string, channel: "email" | "sms" | "push") => {
    if (!prefs) return;
    const cur = prefs.preferences?.[typeValue] ?? {};
    update({ preferences: { ...prefs.preferences, [typeValue]: { ...cur, [channel]: !(cur[channel] ?? true) } } });
  };

  return (
    <div className="mt-1 pt-4 border-t border-border/50">
      <button
        type="button"
        onClick={() => setExpanded(v => !v)}
        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        Préférences avancées par type
      </button>

      {expanded && (
        <div className="mt-5">
          {tl || pl ? (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 size={13} className="animate-spin" /> Chargement…
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr>
                      <th className="text-left text-xs font-medium text-muted-foreground pb-3 pr-4">Type</th>
                      {["email", "sms", "push"].map(ch => (
                        <th key={ch} className="text-center text-xs font-medium text-muted-foreground pb-3 px-4 min-w-[60px]">
                          {CHANNEL_LABELS[ch]}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {(types ?? []).map((t, i, arr) => {
                      const typePref = prefs?.preferences?.[t.value] ?? {};
                      return (
                        <tr key={t.value} className={i < arr.length - 1 ? "border-b border-border/40" : ""}>
                          <td className="py-3 pr-4 text-sm text-foreground">{t.label}</td>
                          {(["email", "sms", "push"] as const).map(ch => (
                            <td key={ch} className="py-3 px-4 text-center">
                              <Toggle
                                checked={typePref[ch] ?? t.default_channels.includes(ch)}
                                onChange={() => toggle(t.value, ch)}
                                disabled={isUpdating}
                              />
                            </td>
                          ))}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <div className="flex justify-end mt-4">
                <button
                  type="button"
                  onClick={() => reset(undefined, {
                    onSuccess: () => toast({ title: "Préférences réinitialisées." }),
                    onError: () => toast({ title: "Erreur", variant: "destructive" }),
                  })}
                  disabled={isResetting}
                  className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
                >
                  {isResetting ? <Loader2 size={11} className="animate-spin" /> : <RotateCcw size={11} />}
                  Réinitialiser aux valeurs par défaut
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

function JobAlertsContent() {
  const { data: alerts, isLoading } = useJobAlerts();
  const { mutate: createAlert, isPending: isCreating } = useCreateJobAlert();
  const { mutate: toggleAlert } = useToggleJobAlert();
  const { mutate: deleteAlert } = useDeleteJobAlert();
  const [newFreq, setNewFreq] = useState<JobAlertFrequency>("INSTANT");

  if (isLoading) {
    return <div className="flex items-center gap-2 text-sm text-muted-foreground py-2"><Loader2 size={13} className="animate-spin" /> Chargement…</div>;
  }

  return (
    <div className="space-y-3">
      {(alerts ?? []).length === 0 ? (
        <p className="text-sm text-muted-foreground py-2">Aucune alerte configurée.</p>
      ) : (
        <ul className="space-y-0 divide-y divide-border/50">
          {(alerts ?? []).map((alert) => (
            <li key={alert.id} className="flex items-center justify-between py-3.5 gap-4">
              <div className="flex items-center gap-3">
                <Toggle checked={alert.is_active} onChange={() => toggleAlert(alert.id)} />
                <div>
                  <p className="text-sm text-foreground">{FREQ_LABELS[alert.frequency]}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {alert.last_sent_at
                      ? `Dernier envoi : ${new Date(alert.last_sent_at).toLocaleDateString("fr-FR")}`
                      : "Jamais envoyée"}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => deleteAlert(alert.id, { onSuccess: () => toast({ title: "Alerte supprimée." }) })}
                className="text-muted-foreground/50 hover:text-destructive transition-colors p-1"
              >
                <Trash2 size={14} />
              </button>
            </li>
          ))}
        </ul>
      )}

      <div className="flex gap-2 pt-1">
        <select
          value={newFreq}
          onChange={(e) => setNewFreq(e.target.value as JobAlertFrequency)}
          className="flex-1 h-9 px-3 rounded-lg border border-border bg-transparent text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary/30 focus:border-primary transition-colors"
        >
          {(Object.entries(FREQ_LABELS) as [JobAlertFrequency, string][]).map(([v, l]) => (
            <option key={v} value={v}>{l}</option>
          ))}
        </select>
        <button
          type="button"
          onClick={() => createAlert({ frequency: newFreq, filters: {} }, {
            onSuccess: () => toast({ title: "Alerte créée." }),
            onError: () => toast({ title: "Erreur", variant: "destructive" }),
          })}
          disabled={isCreating}
          className="h-9 px-4 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center gap-1.5"
        >
          {isCreating ? <Loader2 size={13} className="animate-spin" /> : <Plus size={13} />}
          Nouvelle alerte
        </button>
      </div>
    </div>
  );
}

function NotificationsPanel() {
  const { data: prefs, isLoading } = useNotificationPreferences();
  const { mutate: update, isPending } = useUpdateNotificationPreferences();

  const toggle = (field: "email_enabled" | "sms_enabled" | "push_enabled") => {
    if (!prefs) return;
    update({ [field]: !prefs[field] });
  };

  return (
    <div>
      <div className="mb-7">
        <h2 className="text-base font-semibold text-foreground">Notifications</h2>
        <p className="text-sm text-muted-foreground mt-0.5">
          Choisissez comment vous souhaitez être notifié
        </p>
      </div>

      <SubLabel>Canaux</SubLabel>

      {isLoading ? (
        <div className="flex items-center gap-2 text-sm text-muted-foreground py-2">
          <Loader2 size={13} className="animate-spin" /> Chargement…
        </div>
      ) : (
        <div className="divide-y divide-border/50">
          {(
            [
              { key: "email_enabled" as const, label: "Notifications par email",   hint: "Alertes importantes et récapitulatifs" },
              { key: "sms_enabled"   as const, label: "Notifications par SMS",      hint: "Messages urgents par texto"             },
              { key: "push_enabled"  as const, label: "Notifications push (API)",   hint: "Notifications en temps réel"            },
            ] as const
          ).map(({ key, label, hint }, i, arr) => (
            <SettingRow key={key} label={label} hint={hint} last={i === arr.length - 1}>
              <Toggle checked={prefs?.[key] ?? false} onChange={() => toggle(key)} disabled={isPending} />
            </SettingRow>
          ))}
          <PushToggle />
        </div>
      )}

      <AdvancedTypes />

      {/* Alertes projets */}
      <div className="mt-10 pt-8 border-t border-border/50">
        <SubLabel>Alertes projets</SubLabel>
        <p className="text-xs text-muted-foreground mb-4">
          Soyez notifié des nouveaux projets correspondant à votre profil.
        </p>
        <JobAlertsContent />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 4 — Confidentialité
// ─────────────────────────────────────────────────────────────────────────────

function ConfidentialitePanel() {
  const { data: profile, isLoading } = useFreelanceProfile();
  const { mutate: update, isPending } = useUpdateFreelanceProfile();
  const [availableFrom, setAvailableFrom] = useState("");

  useEffect(() => {
    if (profile) setAvailableFrom(profile.available_from ?? "");
  }, [profile]);

  return (
    <div>
      <div className="mb-7">
        <h2 className="text-base font-semibold text-foreground">Confidentialité</h2>
        <p className="text-sm text-muted-foreground mt-0.5">
          Contrôlez votre visibilité sur la plateforme
        </p>
      </div>

      <SubLabel>Disponibilité</SubLabel>

      {isLoading ? (
        <div className="flex items-center gap-2 text-sm text-muted-foreground py-2">
          <Loader2 size={13} className="animate-spin" /> Chargement…
        </div>
      ) : (
        <div className="divide-y divide-border/50">
          <SettingRow
            label="Disponible pour des missions"
            hint="Affiche un badge 'disponible' sur votre profil public"
          >
            <Toggle
              checked={profile?.is_available ?? false}
              onChange={(v) => update({ is_available: v }, {
                onSuccess: () => toast({ title: v ? "Vous êtes maintenant disponible." : "Disponibilité désactivée." }),
                onError: () => toast({ title: "Erreur", variant: "destructive" }),
              })}
              disabled={isPending}
            />
          </SettingRow>

          <div className="py-4">
            <p className="text-sm text-foreground mb-0.5">Disponible à partir du</p>
            <p className="text-xs text-muted-foreground mb-3">
              Laissez vide si vous êtes disponible immédiatement.
            </p>
            <div className="flex gap-2">
              <input
                type="date"
                value={availableFrom}
                onChange={(e) => setAvailableFrom(e.target.value)}
                className="flex-1 h-9 px-3 rounded-lg border border-border bg-transparent text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary/30 focus:border-primary transition-colors"
              />
              <button
                type="button"
                onClick={() => update({ available_from: availableFrom || null }, {
                  onSuccess: () => toast({ title: "Date de disponibilité enregistrée." }),
                  onError: () => toast({ title: "Erreur", variant: "destructive" }),
                })}
                disabled={isPending}
                className="h-9 px-4 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center gap-1.5 shrink-0"
              >
                {isPending ? <Loader2 size={13} className="animate-spin" /> : <CalendarClock size={13} />}
                Enregistrer
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="mt-10 pt-8 border-t border-border/50">
        <SubLabel>À propos</SubLabel>
        <p className="text-sm text-muted-foreground leading-relaxed max-w-prose">
          Votre profil public affiche uniquement les informations que vous avez renseignées.
          La visibilité de vos coordonnées dépend de votre plan d'abonnement actif.
        </p>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 5 — Utilisation
// ─────────────────────────────────────────────────────────────────────────────

const TIER_COLORS: Record<string, string> = {
  FREE: "#64748b",
  PRO: "#6366f1",
  PRO_MAX: "#8b5cf6",
  AGENCY: "#f59e0b",
};

const TIER_LABELS: Record<string, string> = {
  FREE: "Gratuit",
  PRO: "Pro",
  PRO_MAX: "Pro Max",
  AGENCY: "Agence",
};

function toPositiveLimit(value: unknown): number | null {
  if (value === null || value === undefined || value === "") return null;
  const parsed = typeof value === "number" ? value : Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
}

// SVG Donut gauge
function DonutGauge({
  value,
  max,
  color,
  label,
  sublabel,
  unlimited = false,
}: {
  value: number;
  max: number;
  color: string;
  label: string;
  sublabel: string;
  unlimited?: boolean;
}) {
  const r = 48;
  const cx = 60;
  const circumference = 2 * Math.PI * r;
  const ratio = unlimited || max <= 0 ? null : Math.min(value / max, 1);
  const offset = ratio !== null ? circumference * (1 - ratio) : 0;
  const pct = ratio !== null ? Math.round(ratio * 100) : null;
  const danger = pct !== null && pct >= 90;
  const warn = pct !== null && pct >= 70 && pct < 90;
  const activeColor = danger ? "#ef4444" : warn ? "#f59e0b" : color;

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-[120px] h-[120px]">
        <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
          <circle
            cx={cx} cy={cx} r={r}
            fill="none"
            strokeWidth="9"
            stroke="currentColor"
            className={unlimited ? "text-emerald-100" : "text-border/30"}
          />
          {ratio !== null && ratio > 0 && (
            <circle
              cx={cx} cy={cx} r={r}
              fill="none"
              strokeWidth="9"
              stroke={activeColor}
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              style={{ transition: "stroke-dashoffset 1.2s cubic-bezier(0.4,0,0.2,1)" }}
            />
          )}
          {unlimited && (
            <circle
              cx={cx} cy={cx} r={r}
              fill="none"
              strokeWidth="9"
              stroke="#10b981"
              strokeLinecap="round"
              strokeDasharray="10 7"
            />
          )}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-0.5">
          {pct !== null ? (
            <>
              <span className="text-xl font-bold leading-none" style={{ color: activeColor }}>
                {pct}%
              </span>
              <span className="text-[9px] text-muted-foreground leading-none">utilisé</span>
            </>
          ) : unlimited ? (
            <>
              <span className="text-xl font-bold text-emerald-600 leading-none">{value}</span>
              <span className="text-[9px] text-muted-foreground leading-none">illimité</span>
            </>
          ) : (
            <>
              <span className="text-xl font-bold text-foreground leading-none">{value}</span>
              <span className="text-[9px] text-muted-foreground leading-none">total</span>
            </>
          )}
        </div>
      </div>
      <p className="mt-2 text-xs font-semibold text-foreground text-center">{label}</p>
      <p className="text-[10px] text-muted-foreground text-center mt-0.5 leading-tight">{sublabel}</p>
    </div>
  );
}

// Detailed usage bar
function UsageBar({
  icon: Icon,
  label,
  hint,
  used,
  limit,
  color,
}: {
  icon: React.ElementType;
  label: string;
  hint?: string;
  used: number;
  limit: number | null;
  color: string;
}) {
  const unlimited = limit === null;
  const pct = unlimited || limit === 0 ? null : Math.min((used / limit) * 100, 100);
  const danger = pct !== null && pct >= 90;
  const warn = pct !== null && pct >= 70;

  return (
    <div className="py-3.5 border-b border-border/40 last:border-b-0">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
            style={{ backgroundColor: `${color}14` }}>
            <Icon size={14} style={{ color }} />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground leading-tight">{label}</p>
            {hint && <p className="text-[11px] text-muted-foreground leading-tight">{hint}</p>}
          </div>
        </div>
        <div className="text-right shrink-0 ml-3">
          {unlimited ? (
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
              Illimité
            </span>
          ) : (
            <div>
              <span className="text-sm font-bold" style={{ color: danger ? "#ef4444" : warn ? "#f59e0b" : color }}>
                {used}
              </span>
              <span className="text-xs text-muted-foreground"> / {limit}</span>
            </div>
          )}
        </div>
      </div>
      {pct !== null && (
        <div className="ml-[42px]">
          <div className="relative h-1.5 bg-border/25 rounded-full overflow-hidden">
            <div
              className="absolute inset-y-0 left-0 rounded-full transition-all duration-1000"
              style={{
                width: `${pct}%`,
                background: danger
                  ? "linear-gradient(90deg,#ef4444,#f87171)"
                  : warn
                  ? "linear-gradient(90deg,#f59e0b,#fbbf24)"
                  : `linear-gradient(90deg,${color},${color}bb)`,
              }}
            />
          </div>
          <div className="flex justify-between mt-1">
            <span className="text-[10px] text-muted-foreground/60">{pct >= 90 ? "⚠ Quota presque atteint" : pct >= 70 ? "Approche de la limite" : ""}</span>
            <span className="text-[10px] text-muted-foreground/60">{Math.round(pct)}%</span>
          </div>
        </div>
      )}
    </div>
  );
}

// Mini bar chart for history
function MiniBarChart({ data }: { data: { label: string; value: number; max: number }[] }) {
  const peak = Math.max(...data.map((d) => Math.max(d.max, d.value, 1)));

  return (
    <div className="flex items-end gap-2 h-20">
      {data.map((d, i) => {
        const isLast = i === data.length - 1;
        const heightPct = Math.max((d.value / peak) * 100, 3);
        const limitPct = d.max > 0 ? (d.max / peak) * 100 : 100;

        return (
          <div key={i} className="flex-1 flex flex-col items-center gap-1.5 group">
            <div className="relative w-full rounded-t-md overflow-hidden" style={{ height: "60px" }}>
              {/* Limit marker */}
              <div
                className="absolute bottom-0 left-0 right-0 rounded-t-md border-t-2 border-dashed border-border/50 pointer-events-none"
                style={{ height: `${limitPct}%` }}
              />
              {/* Bar */}
              <div
                className="absolute bottom-0 left-0 right-0 rounded-t-md transition-all duration-700"
                style={{
                  height: `${heightPct}%`,
                  background: isLast
                    ? "linear-gradient(to top,#6366f1,#818cf8)"
                    : "linear-gradient(to top,#e0e7ff,#c7d2fe)",
                }}
                title={`${d.value} proposition(s)`}
              />
            </div>
            <p className="text-[9px] font-medium text-muted-foreground/70 text-center">{d.label}</p>
          </div>
        );
      })}
    </div>
  );
}

// Entitlement pill
function EntitlementPill({
  icon: Icon,
  label,
  color,
}: {
  icon: React.ElementType;
  label: string;
  color: string;
}) {
  return (
    <div
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border"
      style={{ color, backgroundColor: `${color}12`, borderColor: `${color}28` }}
    >
      <Icon size={11} />
      {label}
    </div>
  );
}

function UtilisationPanel() {
  const { data: sub, isLoading: loadingSub } = useMySubscription();
  const { data: usageData, isLoading: loadingUsage } = useSubscriptionUsage();
  const { data: monthlyData, isLoading: loadingMonthly } = useMonthlyUsage();

  const isLoading = loadingSub || loadingUsage || loadingMonthly;

  const latestUsage = usageData?.results?.[0];
  const latestMonthly = monthlyData?.results?.[0];
  const plan = sub?.plan;
  const snapshot = sub?.credit_snapshot;
  const entitlements = sub?.entitlements;
  const tierColor = TIER_COLORS[plan?.tier ?? "FREE"] ?? "#6366f1";

  const creditsUsed = snapshot?.monthly_used ?? latestUsage?.credits_used ?? 0;
  const creditsLimit = toPositiveLimit(
    snapshot?.monthly_limit
      ?? latestUsage?.credits_limit
      ?? entitlements?.credits_per_month
      ?? plan?.limits?.credits_per_month
  );
  const creditsRemaining =
    creditsLimit !== null
      ? snapshot?.monthly_remaining ?? latestUsage?.credits_remaining ?? Math.max(0, creditsLimit - creditsUsed)
      : null;
  const proposalsUsed = latestMonthly?.proposals_used ?? 0;
  const planProposalsLimit = toPositiveLimit(
    entitlements?.proposals_per_month ?? plan?.limits?.proposals_per_month
  );
  const proposalsLimit =
    latestMonthly?.proposals_limit === null
      ? null
      : toPositiveLimit(latestMonthly?.proposals_limit) ?? planProposalsLimit;
  const proposalsRemaining =
    latestMonthly?.proposals_remaining
      ?? (proposalsLimit !== null ? Math.max(0, proposalsLimit - proposalsUsed) : null);
  const contactsUsed = latestUsage?.client_contacts_used ?? snapshot?.monthly_used ?? 0;
  const contactsLimit = toPositiveLimit(
    entitlements?.monthly_client_contacts
      ?? plan?.limits?.monthly_client_contacts
      ?? creditsLimit
  );
  const contactsRemaining =
    contactsLimit !== null ? Math.max(0, contactsLimit - contactsUsed) : null;
  const annualCreditsLimit = toPositiveLimit(
    snapshot?.annual_limit
      ?? entitlements?.annual_credits_total
      ?? plan?.limits?.annual_credits_total
  );
  const annualCreditsUsed = snapshot?.annual_used ?? 0;
  const annualCreditsRemaining =
    annualCreditsLimit !== null
      ? snapshot?.annual_remaining ?? Math.max(0, annualCreditsLimit - annualCreditsUsed)
      : null;
  const rankStars = Number(entitlements?.freejobgn_rank_stars ?? 0);

  // History: last 6 periods reversed for chronological display
  const historyItems = [...(monthlyData?.results ?? [])]
    .slice(0, 6)
    .reverse()
    .map((m) => ({
      label: new Date(m.period_start).toLocaleDateString("fr-FR", { month: "short" }),
      value: m.proposals_used,
      max: toPositiveLimit(m.proposals_limit) ?? proposalsLimit ?? m.proposals_used,
    }));

  const fmtDate = (d: string) =>
    new Date(d).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" });

  const daysLeft =
    sub?.current_period_end
      ? Math.max(0, Math.ceil((new Date(sub.current_period_end).getTime() - Date.now()) / 86400000))
      : null;

  const activeEntitlements: { label: string; icon: React.ElementType; color: string }[] = [];
  if (rankStars > 0) {
    activeEntitlements.push({
      label: `${rankStars} étoile${rankStars > 1 ? "s" : ""} classement`,
      icon: Star,
      color: "#f59e0b",
    });
  }
  if (entitlements?.client_contact_visible) {
    activeEntitlements.push({ label: "Contacts clients visibles", icon: Users, color: "#6366f1" });
  }
  if (entitlements?.premium_email_alerts) {
    activeEntitlements.push({ label: "Alertes email premium", icon: Zap, color: "#10b981" });
  }
  if (entitlements?.suggested_profile) {
    activeEntitlements.push({ label: "Profil mis en avant", icon: Crown, color: "#f59e0b" });
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground py-16">
        <Loader2 size={16} className="animate-spin" /> Chargement des données…
      </div>
    );
  }

  if (!sub) {
    return (
      <div className="py-14 text-center">
        <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-5">
          <BarChart3 size={22} className="text-muted-foreground" />
        </div>
        <p className="text-sm font-semibold text-foreground mb-1">Aucun abonnement actif</p>
        <p className="text-xs text-muted-foreground mb-5 max-w-xs mx-auto leading-relaxed">
          Souscrivez à un plan pour accéder aux statistiques détaillées de votre consommation.
        </p>
        <Link
          to={ROUTES.DASHBOARD.SUBSCRIPTION}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary bg-primary/8 hover:bg-primary/15 transition-colors px-4 py-2 rounded-lg"
        >
          Voir les plans disponibles
          <LinkIcon size={11} />
        </Link>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h2 className="text-base font-semibold text-foreground">Utilisation</h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            Consommation détaillée de votre plan
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <span
            className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full"
            style={{ color: tierColor, backgroundColor: `${tierColor}15` }}
          >
            <Crown size={11} />
            {TIER_LABELS[plan?.tier ?? "FREE"]}
          </span>
          {daysLeft !== null && daysLeft <= 15 && (
            <span className="text-[11px] font-semibold text-amber-600 bg-amber-50 border border-amber-200/60 px-2.5 py-1 rounded-full">
              {daysLeft}j restants
            </span>
          )}
          {sub.current_period_start && sub.current_period_end && (
            <span className="text-[11px] text-muted-foreground flex items-center gap-1">
              <CalendarClock size={11} />
              {fmtDate(sub.current_period_start)} – {fmtDate(sub.current_period_end)}
            </span>
          )}
        </div>
      </div>

      {/* ── Gauge row ── */}
      <div className="grid grid-cols-2 gap-4 mb-8 sm:grid-cols-3">
        {/* Credits donut */}
        <div className="flex items-center justify-center py-5 rounded-2xl border border-indigo-100/80 bg-gradient-to-br from-indigo-50/70 via-indigo-50/30 to-white">
          <DonutGauge
            value={creditsUsed}
            max={creditsLimit ?? 0}
            color="#6366f1"
            unlimited={creditsLimit === null}
            label="Crédits"
            sublabel={
              creditsLimit !== null
                ? `${creditsRemaining ?? 0} restant${(creditsRemaining ?? 0) > 1 ? "s" : ""} sur ${creditsLimit}`
                : "Sans limite mensuelle"
            }
          />
        </div>

        {/* Proposals donut */}
        <div className="flex items-center justify-center py-5 rounded-2xl border border-emerald-100/80 bg-gradient-to-br from-emerald-50/70 via-emerald-50/30 to-white">
          <DonutGauge
            value={proposalsUsed}
            max={proposalsLimit ?? 0}
            color="#10b981"
            unlimited={proposalsLimit === null}
            label="Propositions"
            sublabel={
              proposalsLimit !== null
                ? `${proposalsRemaining ?? 0} restante${(proposalsRemaining ?? 0) > 1 ? "s" : ""} sur ${proposalsLimit}`
                : "Sans limite"
            }
          />
        </div>

        {/* Contacts donut */}
        <div className="col-span-2 sm:col-span-1 flex items-center justify-center py-5 rounded-2xl border border-amber-100/80 bg-gradient-to-br from-amber-50/70 via-amber-50/30 to-white">
          <DonutGauge
            value={contactsUsed}
            max={contactsLimit ?? 0}
            color="#f59e0b"
            unlimited={contactsLimit === null}
            label="Contacts clients"
            sublabel={
              contactsLimit !== null
                ? `${contactsRemaining ?? 0} restant${(contactsRemaining ?? 0) > 1 ? "s" : ""} ce mois-ci`
                : "Sans limite ce mois-ci"
            }
          />
        </div>
      </div>

      {/* ── Detailed bars ── */}
      <SubLabel>Consommation par type</SubLabel>
      <div className="mb-2">
        <UsageBar
          icon={Activity}
          label="Crédits contacts"
          hint="1 premier message à un client = 1 crédit"
          used={creditsUsed}
          limit={creditsLimit}
          color="#6366f1"
        />
        <UsageBar
          icon={BriefcaseBusiness}
          label="Propositions envoyées"
          hint="Ce mois-ci"
          used={proposalsUsed}
          limit={proposalsLimit}
          color="#10b981"
        />
        <UsageBar
          icon={Users}
          label="Contacts clients"
          hint="Ce mois-ci"
          used={contactsUsed}
          limit={contactsLimit}
          color="#f59e0b"
        />
        {annualCreditsLimit !== null && (
          <UsageBar
            icon={Activity}
            label="Crédits annuels"
            hint={`${annualCreditsRemaining ?? 0} restants sur ${annualCreditsLimit}`}
            used={annualCreditsUsed}
            limit={annualCreditsLimit}
            color="#8b5cf6"
          />
        )}
      </div>

      {/* ── History chart ── */}
      {historyItems.length >= 2 && (
        <div className="mt-10 pt-8 border-t border-border/50">
          <div className="flex items-center justify-between mb-1">
            <SubLabel>Historique des propositions</SubLabel>
          </div>
          <p className="text-xs text-muted-foreground mb-5">
            Évolution sur les {historyItems.length} dernières périodes — barre en surbrillance = période actuelle
          </p>
          <MiniBarChart data={historyItems} />
        </div>
      )}

      {/* ── Active entitlements ── */}
      {activeEntitlements.length > 0 && (
        <div className="mt-8 pt-6 border-t border-border/50">
          <SubLabel>Avantages actifs</SubLabel>
          <div className="flex flex-wrap gap-2">
            {activeEntitlements.map((e) => (
              <EntitlementPill key={e.label} icon={e.icon} label={e.label} color={e.color} />
            ))}
          </div>
        </div>
      )}

      {/* ── Link ── */}
      <div className="mt-10 pt-6 border-t border-border/50 flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-foreground">Gérer l'abonnement</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            Changer de plan, consulter les paiements, annuler.
          </p>
        </div>
        <Link
          to={ROUTES.DASHBOARD.SUBSCRIPTION}
          className="flex items-center gap-1.5 text-sm font-medium text-primary hover:underline underline-offset-2 shrink-0"
        >
          Gérer
          <LinkIcon size={12} />
        </Link>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Page principale
// ─────────────────────────────────────────────────────────────────────────────

const Settings = () => {
  const { logout } = useAuth();
  const [activeSection, setActiveSection] = useState<SettingsSection>("compte");

  return (
    <DashboardLayout userType="freelancer">
      <ErrorBoundary>
        <div className="space-y-7">

          {/* Header */}
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Paramètres</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Gérez votre compte, sécurité et préférences
            </p>
          </div>

          {/* Layout */}
          <div className="flex flex-col lg:flex-row gap-8 items-start">

            {/* Sidebar */}
            <SettingsSidebar active={activeSection} onChange={setActiveSection} />

            {/* Content panel — one clean card */}
            <div className="flex-1 min-w-0 bg-white rounded-2xl border border-border/60 shadow-sm">
              <div className="px-8 py-8">
                <ErrorBoundary>
                  {activeSection === "compte"          && <ComptePanel />}
                  {activeSection === "securite"        && <SecuritePanel onLogout={logout} />}
                  {activeSection === "notifications"   && <NotificationsPanel />}
                  {activeSection === "confidentialite" && <ConfidentialitePanel />}
                  {activeSection === "utilisation"     && <UtilisationPanel />}
                </ErrorBoundary>
              </div>
            </div>

          </div>
        </div>
      </ErrorBoundary>
    </DashboardLayout>
  );
};

export default Settings;
