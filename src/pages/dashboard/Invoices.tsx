import { useState } from "react";
import { motion } from "framer-motion";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, FileDown, Receipt } from "lucide-react";
import { useInvoices, downloadInvoicePdf } from "@/hooks/useInvoices";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import type { InvoiceType, InvoiceStatus } from "@/types";

const TYPE_CONFIG: Record<InvoiceType, { label: string; class: string }> = {
  CONTRACT:          { label: "Paiement contrat",    class: "bg-blue-100 text-blue-700" },
  CONTRACT_PROVIDER: { label: "Gain prestation",     class: "bg-green-100 text-green-700" },
  SUBSCRIPTION:      { label: "Abonnement",          class: "bg-purple-100 text-purple-700" },
};

const STATUS_CONFIG: Record<InvoiceStatus, { label: string; class: string }> = {
  DRAFT:     { label: "Brouillon",  class: "bg-muted text-muted-foreground" },
  ISSUED:    { label: "Émise",      class: "bg-yellow-100 text-yellow-700" },
  PAID:      { label: "Payée",      class: "bg-green-100 text-green-700" },
  CANCELLED: { label: "Annulée",    class: "bg-red-100 text-red-700" },
};

const Invoices = () => {
  const { user } = useAuth();
  const userType = user?.role === "CLIENT" ? "client" : "freelancer";
  const { data, isLoading } = useInvoices();
  const invoices = data?.results ?? [];
  const { toast } = useToast();
  const [downloading, setDownloading] = useState<string | null>(null);

  const handleDownload = async (id: string, invoiceNumber: string) => {
    setDownloading(id);
    try {
      await downloadInvoicePdf(id, invoiceNumber);
    } catch {
      toast({ title: "Erreur lors du téléchargement", variant: "destructive" });
    } finally {
      setDownloading(null);
    }
  };

  return (
    <DashboardLayout userType={userType}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Mes Factures</h1>
          <p className="text-muted-foreground">
            Téléchargez vos reçus de paiement et attestations
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="animate-spin text-primary" size={40} />
          </div>
        ) : invoices.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <Receipt className="mx-auto mb-4" size={48} />
            <p className="text-lg font-medium">Aucune facture pour le moment</p>
            <p className="text-sm mt-1">
              Les factures sont générées automatiquement après chaque paiement.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {invoices.map((invoice, index) => {
              const typeConf = TYPE_CONFIG[invoice.invoice_type] ?? {
                label: invoice.invoice_type_display,
                class: "bg-muted text-foreground",
              };
              const statusConf = STATUS_CONFIG[invoice.status] ?? {
                label: invoice.status_display,
                class: "bg-muted text-foreground",
              };
              const isDown = downloading === invoice.id;

              return (
                <motion.div
                  key={invoice.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.04 }}
                >
                  <Card className="p-5">
                    <div className="flex flex-wrap items-center gap-4">
                      {/* Left — invoice info */}
                      <div className="flex-1 min-w-0 space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-semibold text-sm">
                            {invoice.invoice_number}
                          </span>
                          <Badge className={`text-xs ${typeConf.class}`}>
                            {typeConf.label}
                          </Badge>
                          <Badge className={`text-xs ${statusConf.class}`}>
                            {statusConf.label}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Émise le{" "}
                          {new Date(invoice.issued_at).toLocaleDateString("fr-FR", {
                            day: "2-digit",
                            month: "long",
                            year: "numeric",
                          })}
                        </p>
                      </div>

                      {/* Center — amounts */}
                      <div className="flex gap-6 text-sm">
                        <div className="text-right">
                          <p className="text-muted-foreground text-xs">Montant</p>
                          <p className="font-semibold">
                            {Number(invoice.amount).toLocaleString("fr-FR")} GNF
                          </p>
                        </div>
                        {Number(invoice.fee_amount) > 0 && (
                          <div className="text-right">
                            <p className="text-muted-foreground text-xs">Frais</p>
                            <p className="text-sm text-muted-foreground">
                              {Number(invoice.fee_amount).toLocaleString("fr-FR")} GNF
                            </p>
                          </div>
                        )}
                        <div className="text-right">
                          <p className="text-muted-foreground text-xs">Net</p>
                          <p className="font-semibold text-primary">
                            {Number(invoice.net_amount).toLocaleString("fr-FR")} GNF
                          </p>
                        </div>
                      </div>

                      {/* Right — download */}
                      <Button
                        size="sm"
                        variant="outline"
                        className="gap-2 flex-shrink-0"
                        disabled={isDown}
                        onClick={() => handleDownload(invoice.id, invoice.invoice_number)}
                      >
                        {isDown ? (
                          <Loader2 size={14} className="animate-spin" />
                        ) : (
                          <FileDown size={14} />
                        )}
                        PDF
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Invoices;
