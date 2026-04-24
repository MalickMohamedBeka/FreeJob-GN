import { useAuth } from "@/contexts/AuthContext";
import Profile from "./Profile";
import AgencyProfilePage from "@/pages/agency/AgencyProfile";

export default function ProviderProfile() {
  const { user } = useAuth();
  return user?.provider_kind === "AGENCY" ? <AgencyProfilePage /> : <Profile />;
}
