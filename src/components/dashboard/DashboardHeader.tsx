import { motion } from "framer-motion";
import { Bell, Search, Menu } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useFreelanceProfile } from "@/hooks/useProfile";
import { useClientProfile } from "@/hooks/useProfile";

interface DashboardHeaderProps {
  userType: "freelancer" | "client";
  onMenuToggle: () => void;
}

// ── Avatar helpers ─────────────────────────────────────────────────────────────

function AvatarDisplay({ src, username }: { src?: string | null; username: string }) {
  const initials = username
    .split(/[\s._-]+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("") || "?";

  if (src) {
    return <img src={src} alt={username} className="w-9 h-9 rounded-full object-cover flex-shrink-0" />;
  }
  return (
    <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
      <span className="text-white text-sm font-bold">{initials}</span>
    </div>
  );
}

function FreelancerAvatar({ username }: { username: string }) {
  const { data } = useFreelanceProfile();
  return <AvatarDisplay src={data?.profile_picture} username={username} />;
}

function ClientAvatar({ username }: { username: string }) {
  const { data } = useClientProfile();
  return <AvatarDisplay src={data?.client_profile?.profile_picture} username={username} />;
}

// ── Component ──────────────────────────────────────────────────────────────────

const DashboardHeader = ({ userType, onMenuToggle }: DashboardHeaderProps) => {
  const { user } = useAuth();
  const username = user?.username || "Utilisateur";

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-border">
      <div className="flex items-center justify-between h-16 px-6">
        {/* Sidebar toggle — works on both mobile (opens drawer) and desktop (collapses sidebar) */}
        <button
          onClick={onMenuToggle}
          className="p-2 hover:bg-muted rounded-lg transition-colors"
          aria-label="Basculer le menu"
        >
          <Menu size={22} />
        </button>

        {/* Search Bar */}
        <div className="hidden md:flex flex-1 max-w-xl mx-4">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
            <input
              type="text"
              placeholder="Rechercher des projets, messages..."
              className="w-full h-9 pl-9 pr-4 rounded-lg border border-border bg-muted/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative p-2 hover:bg-muted rounded-lg transition-colors"
          >
            <Bell size={19} />
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-red-500 rounded-full" />
          </motion.button>

          {/* Profile (Desktop) */}
          <div className="hidden lg:flex items-center gap-2.5 pl-2.5 border-l border-border ml-1">
            <div className="text-right">
              <p className="text-sm font-semibold leading-tight">{username}</p>
              <p className="text-xs text-muted-foreground leading-tight">
                {userType === "freelancer" ? "Freelancer" : "Client"}
              </p>
            </div>
            {userType === "freelancer" ? (
              <FreelancerAvatar username={username} />
            ) : (
              <ClientAvatar username={username} />
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
