import { useState } from "react";
import { AlertTriangle, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useOpenDispute } from "@/hooks/useContracts";
import { useToast } from "@/hooks/use-toast";

interface DisputeModalProps {
  contractId: string;
  contractTitle: string;
  open: boolean;
  onClose: () => void;
}

export function DisputeModal({ contractId, contractTitle, open, onClose }: DisputeModalProps) {
  const [reason, setReason] = useState("");
  const { toast } = useToast();
  const openDispute = useOpenDispute();

  const handleSubmit = () => {
    if (!reason.trim()) {
      toast({ title: "Raison requise", description: "Décrivez le motif du litige.", variant: "destructive" });
      return;
    }
    openDispute.mutate(
      { contractId, reason: reason.trim() },
      {
        onSuccess: () => {
          toast({ title: "Litige ouvert", description: "L'équipe FreeJobGN va examiner votre demande." });
          setReason("");
          onClose();
        },
        onError: (err) => {
          toast({
            title: "Erreur",
            description: err instanceof Error ? err.message : "Une erreur est survenue.",
            variant: "destructive",
          });
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle size={18} />
            Ouvrir un litige
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="p-3 bg-destructive/5 border border-destructive/20 rounded-lg text-sm text-muted-foreground">
            <p className="font-medium text-foreground mb-0.5">Contrat : {contractTitle}</p>
            <p>Le contrat sera mis en pause le temps de la résolution. L'équipe FreeJobGN traitera votre demande.</p>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">
              Motif du litige <span className="text-destructive">*</span>
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Décrivez précisément le problème rencontré…"
              rows={4}
              className="w-full px-3 py-2 rounded-lg border border-border bg-white text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-destructive/20 focus:border-destructive transition-colors resize-none text-sm"
            />
            <p className="text-xs text-muted-foreground mt-1">{reason.length}/500 caractères</p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={openDispute.isPending}>
            Annuler
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={openDispute.isPending || !reason.trim()}
            className="gap-2 bg-destructive hover:bg-destructive/90 text-white"
          >
            {openDispute.isPending ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <AlertTriangle size={14} />
            )}
            Ouvrir le litige
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
