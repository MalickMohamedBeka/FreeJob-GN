import { useMutation } from '@tanstack/react-query';
import { apiService } from '@/services/api.service';

interface ProfileInitData {
  city_or_region: string;
  country: string;
  postal_code?: string;
  phone?: string;
  bio?: string;
  hourly_rate?: string | null;
  skill_ids?: number[];
  speciality_id?: number | null;
  freelance: {
    first_name: string;
    last_name: string;
    business_name?: string;
  };
}

export function useProfileInit() {
  return useMutation({
    mutationFn: (data: ProfileInitData) =>
      apiService.post('/users/freelance/profile/init/', data),
  });
}
