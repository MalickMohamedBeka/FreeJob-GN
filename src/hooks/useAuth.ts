import { useQuery, useMutation } from '@tanstack/react-query';
import { apiService } from '@/services/api.service';
import type {
  PublicStats,
  RegistrationOptions,
  ActivationResponse,
  ResendActivationRequest,
} from '@/types';

interface ForgotPasswordRequest { email: string }
interface ForgotPasswordResponse { message: string }
interface ResetPasswordRequest { uid: string; token: string; new_password: string; new_password_confirm: string }
interface ResetPasswordResponse { message: string }

export function usePublicStats() {
  return useQuery({
    queryKey: ['public-stats'],
    queryFn: () => apiService.getPublic<PublicStats>('/users/public/stats/'),
    staleTime: 10 * 60 * 1000, // 10 min
  });
}

export function useRegistrationOptions() {
  return useQuery({
    queryKey: ['registration-options'],
    queryFn: () => apiService.getPublic<RegistrationOptions>('/users/register/options/'),
    staleTime: Infinity,
  });
}

export function useResendActivation() {
  return useMutation({
    mutationFn: (data: ResendActivationRequest) =>
      apiService.postPublic<ActivationResponse>('/users/resend-activation/', data),
  });
}

interface ChangePasswordRequest { current_password: string; new_password: string; new_password_confirm: string }
interface ChangePasswordResponse { message: string }
interface DeleteAccountRequest { password: string }

export function useChangePassword() {
  return useMutation({
    mutationFn: (data: ChangePasswordRequest) =>
      apiService.post<ChangePasswordResponse>('/users/change-password/', data),
  });
}

export function useDeleteAccount() {
  return useMutation({
    mutationFn: (data: DeleteAccountRequest) =>
      apiService.post<void>('/users/delete-account/', data),
  });
}

export function useForgotPassword() {
  return useMutation({
    mutationFn: (data: ForgotPasswordRequest) =>
      apiService.postPublic<ForgotPasswordResponse>('/users/forgot-password/', data),
  });
}

export function useResetPassword() {
  return useMutation({
    mutationFn: (data: ResetPasswordRequest) =>
      apiService.postPublic<ResetPasswordResponse>('/users/reset-password/', data),
  });
}
