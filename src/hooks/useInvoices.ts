import { useQuery } from '@tanstack/react-query';
import { apiService } from '@/services/api.service';
import type { ApiInvoice, ApiInvoiceDetail, DjangoPaginatedResponse } from '@/types';

export function useInvoices() {
  return useQuery({
    queryKey: ['invoices'],
    queryFn: () => apiService.get<DjangoPaginatedResponse<ApiInvoice>>('/invoices/'),
  });
}

export function useInvoice(id: string) {
  return useQuery({
    queryKey: ['invoice', id],
    queryFn: () => apiService.get<ApiInvoiceDetail>(`/invoices/${id}/`),
    enabled: !!id,
  });
}

export async function downloadInvoicePdf(id: string, invoiceNumber: string): Promise<void> {
  const blob = await apiService.getBlob(`/invoices/${id}/pdf/`);
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${invoiceNumber}.pdf`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
