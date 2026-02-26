import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Loader2, CheckCircle2, AlertCircle, XCircle, KeyRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useCheckTransactionStatus, useConfirmOTP } from "@/hooks/useContracts";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { ROUTES } from "@/constants/routes";

const PENDING_PAYMENT_KEY = "pending_payment";

const PaymentReturn = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Try to get the transactionId from sessionStorage (set before redirect) or from query params
  const [transactionId, setTransactionId] = useState<string | null>(null);
  const [isCancelled, setIsCancelled] = useState(false);

  const [otp, setOtp] = useState("");
  const [showOtp, setShowOtp] = useState(false);

  const confirmOtp = useConfirmOTP();

  useEffect(() => {
    // Check sessionStorage first (most reliable)
    const raw = sessionStorage.getItem(PENDING_PAYMENT_KEY);
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        if (parsed.transactionId) {
          setTransactionId(parsed.transactionId);
          return;
        }
      } catch {
        sessionStorage.removeItem(PENDING_PAYMENT_KEY);
      }
    }
    // Fallback: check URL query params (some gateways pass transactionId back)
    const tid = searchParams.get("transactionId") || searchParams.get("transaction_id");
    if (tid) {
      setTransactionId(tid);
      return;
    }
    // Check if this was a cancellation
    const status = searchParams.get("status");
    if (status === "cancelled" || status === "cancel") {
      setIsCancelled(true);
    }
  }, [searchParams]);

  const { data, isLoading } = useCheckTransactionStatus(transactionId ?? "", !!transactionId);

  const status = data?.status;
  const isSuccess = status === "SUCCESS" || status === "COMPLETED";
  const isFailed = status === "FAILED";
  const needsOtp = status === "OTP_REQUIRED" || status === "PENDING_OTP";
  const isPending = !status || (!isSuccess && !isFailed && !needsOtp);

  // Auto-redirect on success after a short delay
  useEffect(() => {
    if (isSuccess) {
      sessionStorage.removeItem(PENDING_PAYMENT_KEY);
      queryClient.invalidateQueries({ queryKey: ["contracts"] });
      const timer = setTimeout(() => navigate(ROUTES.CLIENT.CONTRACTS), 3000);
      return () => clearTimeout(timer);
    }
  }, [isSuccess, navigate, queryClient]);

  const handleConfirmOtp = () => {
    if (!transactionId || otp.length < 4) return;
    confirmOtp.mutate(
      { transactionReference: transactionId, data: { one_time_pin: otp } },
      {
        onSuccess: () => {
          setShowOtp(false);
          toast({ title: "OTP confirmé", description: "Paiement en cours de traitement." });
        },
        onError: (err) => {
          toast({
            title: "OTP incorrect",
            description: err instanceof Error ? err.message : "Code OTP invalide.",
            variant: "destructive",
          });
        },
      }
    );
  };

  const handleBackToContracts = () => {
    sessionStorage.removeItem(PENDING_PAYMENT_KEY);
    navigate(ROUTES.CLIENT.CONTRACTS);
  };

  return (
    <div className="min-h-screen bg-muted/30 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 text-center">
        {isCancelled ? (
          <>
            <div className="flex justify-center mb-4">
              <XCircle size={64} className="text-muted-foreground" />
            </div>
            <h1 className="text-2xl font-bold mb-2">Paiement annulé</h1>
            <p className="text-muted-foreground mb-6">
              Votre paiement a été annulé. Aucun montant n'a été débité.
            </p>
            <Button className="w-full" onClick={handleBackToContracts}>
              Retour aux contrats
            </Button>
          </>
        ) : !transactionId ? (
          <>
            <div className="flex justify-center mb-4">
              <AlertCircle size={64} className="text-muted-foreground" />
            </div>
            <h1 className="text-2xl font-bold mb-2">Référence introuvable</h1>
            <p className="text-muted-foreground mb-6">
              Impossible de retrouver la référence de paiement.
            </p>
            <Button className="w-full" onClick={handleBackToContracts}>
              Retour aux contrats
            </Button>
          </>
        ) : isLoading || isPending ? (
          <>
            <div className="flex justify-center mb-4">
              <Loader2 size={64} className="animate-spin text-primary" />
            </div>
            <h1 className="text-2xl font-bold mb-2">Vérification du paiement…</h1>
            <p className="text-muted-foreground mb-2">
              Nous vérifions le statut de votre paiement.
            </p>
            <p className="text-xs text-muted-foreground">
              Référence : {transactionId}
            </p>
          </>
        ) : isSuccess ? (
          <>
            <div className="flex justify-center mb-4">
              <CheckCircle2 size={64} className="text-primary" />
            </div>
            <h1 className="text-2xl font-bold mb-2">Paiement confirmé !</h1>
            <p className="text-muted-foreground mb-6">
              Votre paiement a été traité avec succès. Vous allez être redirigé vers vos contrats.
            </p>
            <Button className="w-full" onClick={handleBackToContracts}>
              Voir mes contrats
            </Button>
          </>
        ) : isFailed ? (
          <>
            <div className="flex justify-center mb-4">
              <XCircle size={64} className="text-destructive" />
            </div>
            <h1 className="text-2xl font-bold mb-2">Paiement échoué</h1>
            <p className="text-muted-foreground mb-6">
              Le paiement n'a pas pu être traité. Veuillez réessayer.
            </p>
            <Button className="w-full" onClick={handleBackToContracts}>
              Retour aux contrats
            </Button>
          </>
        ) : needsOtp ? (
          <>
            <div className="flex justify-center mb-4">
              <KeyRound size={64} className="text-primary" />
            </div>
            <h1 className="text-2xl font-bold mb-2">Confirmation OTP requise</h1>
            <p className="text-muted-foreground mb-6">
              Saisissez le code OTP reçu par SMS pour confirmer votre paiement.
            </p>
            {!showOtp ? (
              <Button className="w-full gap-2" onClick={() => setShowOtp(true)}>
                <KeyRound size={16} />
                Saisir l'OTP
              </Button>
            ) : (
              <div className="space-y-4">
                <Input
                  placeholder="123456"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                  className="text-center text-2xl tracking-widest font-mono"
                  autoFocus
                />
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => setShowOtp(false)}
                    disabled={confirmOtp.isPending}
                  >
                    Annuler
                  </Button>
                  <Button
                    className="flex-1 gap-2"
                    onClick={handleConfirmOtp}
                    disabled={confirmOtp.isPending || otp.length < 4}
                  >
                    {confirmOtp.isPending ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : (
                      <KeyRound size={14} />
                    )}
                    Confirmer
                  </Button>
                </div>
              </div>
            )}
          </>
        ) : null}
      </Card>
    </div>
  );
};

export default PaymentReturn;
