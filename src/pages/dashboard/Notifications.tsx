import { useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Bell,
  BellOff,
  Trash2,
  CheckCheck,
  Loader2,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Settings2,
} from "lucide-react";
import {
  useNotifications,
  useMarkNotificationRead,
  useDeleteNotification,
  useMarkAllRead,
  useNotificationPreferences,
  useUpdateNotificationPreferences,
  useResetNotificationPreferences,
} from "@/hooks/useNotifications";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks";
import { ApiError } from "@/services/api.service";
import type { ApiNotification, ApiNotificationPreference } from "@/types";

// ── Helpers ────────────────────────────────────────────────────────────────────

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return "À l'instant";
  if (mins < 60) return `Il y a ${mins} min`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `Il y a ${hrs}h`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `Il y a ${days}j`;
  return new Date(dateStr).toLocaleDateString("fr-FR");
}

function notifColor(type: string): string {
  if (type.startsWith("PROJECT_")) return "bg-blue-500";
  if (type.startsWith("PROPOSAL_")) return "bg-secondary";
  if (type.startsWith("CONTRACT_")) return "bg-cta";
  if (type.startsWith("MESSAGE_")) return "bg-purple-500";
  if (type.startsWith("MILESTONE_")) return "bg-green-500";
  if (type.startsWith("SUBSCRIPTION_")) return "bg-orange-500";
  return "bg-muted-foreground";
}

// ── Preference Dialog ──────────────────────────────────────────────────────────

function PreferencesDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const { data: prefs, isLoading } = useNotificationPreferences();
  const update = useUpdateNotificationPreferences();
  const reset = useResetNotificationPreferences();

  const handleToggle = async (
    field: keyof Pick<
      ApiNotificationPreference,
      "email_enabled" | "sms_enabled" | "push_enabled"
    >,
  ) => {
    if (!prefs) return;
    try {
      await update.mutateAsync({ [field]: !prefs[field] });
    } catch (err) {
      toast({
        title: "Erreur",
        description:
          err instanceof ApiError ? err.message : "Une erreur est survenue.",
        variant: "destructive",
      });
    }
  };

  const handleReset = async () => {
    try {
      await reset.mutateAsync();
      toast({ title: "Préférences réinitialisées." });
    } catch (err) {
      toast({
        title: "Erreur",
        description:
          err instanceof ApiError ? err.message : "Une erreur est survenue.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Préférences de notification</DialogTitle>
        </DialogHeader>
        {isLoading ? (
          <div className="flex justify-center py-6">
            <Loader2 className="animate-spin text-muted-foreground" size={24} />
          </div>
        ) : !prefs ? (
          <p className="text-sm text-muted-foreground py-4">
            Impossible de charger les préférences.
          </p>
        ) : (
          <div className="space-y-4 py-2">
            {(
              [
                { field: "email_enabled", label: "Notifications par e-mail" },
                { field: "sms_enabled", label: "Notifications par SMS" },
                { field: "push_enabled", label: "Notifications push" },
              ] as const
            ).map(({ field, label }) => (
              <div key={field} className="flex items-center justify-between">
                <Label className="text-sm">{label}</Label>
                <Switch
                  checked={prefs[field]}
                  onCheckedChange={() => handleToggle(field)}
                  disabled={update.isPending}
                />
              </div>
            ))}
          </div>
        )}
        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5"
            onClick={handleReset}
            disabled={reset.isPending || isLoading}
          >
            {reset.isPending ? (
              <Loader2 size={13} className="animate-spin" />
            ) : (
              <RotateCcw size={13} />
            )}
            Réinitialiser
          </Button>
          <Button size="sm" onClick={() => onOpenChange(false)}>
            Fermer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ── Notification Row ───────────────────────────────────────────────────────────

function NotificationRow({
  notif,
  onRead,
  onDelete,
}: {
  notif: ApiNotification;
  onRead: (id: number) => void;
  onDelete: (id: number) => void;
}) {
  return (
    <div
      className={`flex items-start gap-3 p-4 rounded-xl border transition-colors ${
        notif.is_read
          ? "bg-background border-border"
          : "bg-primary/5 border-primary/20"
      }`}
    >
      {/* Color dot */}
      <div className="flex-shrink-0 mt-1">
        <span
          className={`block w-2.5 h-2.5 rounded-full ${notifColor(notif.notification_type)} ${
            notif.is_read ? "opacity-30" : ""
          }`}
        />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <p
            className={`text-sm font-medium leading-snug ${
              notif.is_read ? "text-muted-foreground" : "text-foreground"
            }`}
          >
            {notif.title}
          </p>
          <span className="text-xs text-muted-foreground whitespace-nowrap flex-shrink-0">
            {timeAgo(notif.created_at)}
          </span>
        </div>
        <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed line-clamp-2">
          {notif.message}
        </p>
        <div className="flex items-center gap-1.5 mt-2">
          <Badge variant="secondary" className="text-[10px] py-0 px-1.5 font-normal">
            {notif.notification_type_display}
          </Badge>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 flex-shrink-0">
        {!notif.is_read && (
          <button
            type="button"
            onClick={() => onRead(notif.id)}
            className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
            title="Marquer comme lu"
          >
            <CheckCheck size={14} />
          </button>
        )}
        <button
          type="button"
          onClick={() => onDelete(notif.id)}
          className="p-1.5 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
          title="Supprimer"
        >
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────────

const Notifications = () => {
  const { user } = useAuth();
  const userType = user?.role === "CLIENT" ? "client" : "freelancer";

  const [filter, setFilter] = useState<"all" | "unread">("all");
  const [page, setPage] = useState(1);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [prefOpen, setPrefOpen] = useState(false);

  const params = {
    ...(filter === "unread" ? { is_read: false } : {}),
    page,
  };
  const { data, isLoading, isFetching } = useNotifications(params);
  const markRead = useMarkNotificationRead();
  const deleteNotif = useDeleteNotification();
  const markAll = useMarkAllRead();

  const notifications = data?.results ?? [];
  const totalCount = data?.count ?? 0;
  const unreadCount = data?.unread_count ?? 0;
  const pageSize = 20;
  const totalPages = Math.ceil(totalCount / pageSize);

  const handleRead = async (id: number) => {
    try {
      await markRead.mutateAsync(id);
    } catch (err) {
      toast({
        title: "Erreur",
        description:
          err instanceof ApiError ? err.message : "Une erreur est survenue.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteNotif.mutateAsync(id);
      setDeleteId(null);
    } catch (err) {
      toast({
        title: "Erreur",
        description:
          err instanceof ApiError ? err.message : "Une erreur est survenue.",
        variant: "destructive",
      });
    }
  };

  const handleMarkAll = async () => {
    try {
      const result = await markAll.mutateAsync();
      toast({
        title: `${result?.count ?? 0} notification${(result?.count ?? 0) > 1 ? "s" : ""} marquée${(result?.count ?? 0) > 1 ? "s" : ""} comme lue${(result?.count ?? 0) > 1 ? "s" : ""}.`,
      });
      setPage(1);
    } catch (err) {
      toast({
        title: "Erreur",
        description:
          err instanceof ApiError ? err.message : "Une erreur est survenue.",
        variant: "destructive",
      });
    }
  };

  return (
    <DashboardLayout userType={userType}>
      <div className="space-y-5">
        {/* ── Header ── */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-bold flex items-center gap-2">
              Notifications
              {unreadCount > 0 && (
                <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-primary text-white text-[10px] font-bold">
                  {unreadCount > 99 ? "99+" : unreadCount}
                </span>
              )}
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              {totalCount} notification{totalCount !== 1 ? "s" : ""}
              {unreadCount > 0 && ` · ${unreadCount} non lue${unreadCount > 1 ? "s" : ""}`}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <Button
                variant="outline"
                size="sm"
                className="gap-1.5"
                onClick={handleMarkAll}
                disabled={markAll.isPending}
              >
                {markAll.isPending ? (
                  <Loader2 size={13} className="animate-spin" />
                ) : (
                  <CheckCheck size={13} />
                )}
                Tout marquer comme lu
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5"
              onClick={() => setPrefOpen(true)}
            >
              <Settings2 size={13} />
              Préférences
            </Button>
          </div>
        </div>

        {/* ── Filter tabs ── */}
        <div className="flex items-center bg-muted rounded-xl p-1 w-fit text-sm">
          {(["all", "unread"] as const).map((f) => (
            <button
              key={f}
              onClick={() => { setFilter(f); setPage(1); }}
              className={`px-4 py-1.5 rounded-lg font-medium transition-colors ${
                filter === f
                  ? "bg-white shadow-sm text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {f === "all" ? "Toutes" : "Non lues"}
            </button>
          ))}
        </div>

        {/* ── List ── */}
        <Card className="p-4">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="animate-spin text-primary" size={32} />
            </div>
          ) : notifications.length === 0 ? (
            <div className="text-center py-14 text-muted-foreground">
              {filter === "unread" ? (
                <>
                  <CheckCheck size={36} className="mx-auto mb-3 opacity-30" />
                  <p className="text-sm">Tout est à jour — aucune notification non lue.</p>
                </>
              ) : (
                <>
                  <BellOff size={36} className="mx-auto mb-3 opacity-30" />
                  <p className="text-sm">Aucune notification pour le moment.</p>
                </>
              )}
            </div>
          ) : (
            <>
              <div className={`space-y-2 transition-opacity ${isFetching ? "opacity-60" : ""}`}>
                {notifications.map((n) => (
                  <NotificationRow
                    key={n.id}
                    notif={n}
                    onRead={handleRead}
                    onDelete={(id) => setDeleteId(id)}
                  />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
                  <p className="text-xs text-muted-foreground">
                    Page {page} sur {totalPages}
                  </p>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage((p) => p - 1)}
                      disabled={page === 1 || isFetching}
                      className="h-8 w-8 p-0"
                    >
                      <ChevronLeft size={14} />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage((p) => p + 1)}
                      disabled={page >= totalPages || isFetching}
                      className="h-8 w-8 p-0"
                    >
                      <ChevronRight size={14} />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </Card>
      </div>

      {/* ── Delete confirmation ── */}
      <AlertDialog
        open={deleteId !== null}
        onOpenChange={(v) => !v && setDeleteId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer la notification ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => deleteId !== null && handleDelete(deleteId)}
              disabled={deleteNotif.isPending}
            >
              {deleteNotif.isPending && (
                <Loader2 size={13} className="animate-spin mr-1.5" />
              )}
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* ── Preferences dialog ── */}
      <PreferencesDialog open={prefOpen} onOpenChange={setPrefOpen} />
    </DashboardLayout>
  );
};

export default Notifications;
