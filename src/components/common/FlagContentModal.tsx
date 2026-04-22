import { useState } from "react";
import { Flag, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useFlagContent } from "@/hooks/useProfile";

const FLAG_REASONS = [
  { value: "SPAM", label: "Spam ou contenu non pertinent" },
  { value: "INAPPROPRIATE", label: "Contenu inapproprié ou offensant" },
  { value: "FRAUD", label: "Fraude ou tromperie" },
  { value: "COPYRIGHT", label: "Violation de droits d'auteur" },
  { value: "OTHER", label: "Autre" },
];

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  contentType: string;
  objectId: number | string;
  label?: string;
}

export function FlagContentModal({ open, onOpenChange, contentType, objectId, label }: Props) {
  const [reason, setReason] = useState("");
  const [details, setDetails] = useState("");
  const [done, setDone] = useState(false);

  const { mutate, isPending } = useFlagContent();

  const handleClose = () => {
    onOpenChange(false);
    setTimeout(() => { setReason(""); setDetails(""); setDone(false); }, 200);
  };

  const handleSubmit = () => {
    if (!reason) return;
    mutate(
      { content_type: contentType, object_id: objectId, reason, details },
      { onSuccess: () => setDone(true) }
    );
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && handleClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base">
            <Flag size={15} className="text-destructive" />
            Signaler{label ? ` : ${label}` : " ce contenu"}
          </DialogTitle>
        </DialogHeader>

        {done ? (
          <div className="py-6 text-center space-y-2">
            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mx-auto">
              <Flag size={20} className="text-green-600" />
            </div>
            <p className="font-semibold text-sm">Signalement envoyé</p>
            <p className="text-xs text-muted-foreground">
              Notre équipe examinera votre signalement dans les plus brefs délais.
            </p>
            <Button size="sm" variant="outline" className="mt-2" onClick={handleClose}>
              Fermer
            </Button>
          </div>
        ) : (
          <div className="space-y-4 py-1">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Motif *
              </Label>
              <Select value={reason} onValueChange={setReason}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un motif" />
                </SelectTrigger>
                <SelectContent>
                  {FLAG_REASONS.map((r) => (
                    <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Détails <span className="normal-case font-normal">(optionnel)</span>
              </Label>
              <Textarea
                rows={3}
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder="Précisez votre signalement…"
                className="resize-none"
              />
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={handleClose} disabled={isPending}>
                Annuler
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={!reason || isPending}
                variant="destructive"
                className="gap-2"
              >
                {isPending ? <Loader2 size={14} className="animate-spin" /> : <Flag size={14} />}
                Signaler
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
