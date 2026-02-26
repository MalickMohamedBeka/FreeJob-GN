import { motion } from "framer-motion";
import { Bell, Search, Menu } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useFreelanceProfile } from "@/hooks/useProfile";
import { useClientProfile } from "@/hooks/useProfile";

interface DashboardHeaderProps {
  userType: "freelancer" | "client";
  onOpenMobile: () => void;
}

// ── Avatar helpers ─────────────────────────────────────────────────────────────

function AvatarDisplay({
  src,
  username,
  size = "sm",
}: {
  src?: string | null;
  username: string;
  size?: "sm" | "md";
}) {
  const px = size === "sm" ? "w-9 h-9 text-sm" : "w-10 h-10 text-base";
  const initials = username
    .split(/[\s._-]+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("") || "?";

  if (src) {
    return (
      <img
        src={src}
        alt={username}
        className={`${px} rounded-full object-cover flex-shrink-0`}
      />
    );
  }
  return (
    <div className={`${px} rounded-full bg-primary flex items-center justify-center flex-shrink-0`}>
      <span className="text-white font-bold">{initials}</span>
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

const DashboardHeader = ({ userType, onOpenMobile }: DashboardHeaderProps) => {
  const { user } = useAuth();
  const username = user?.username || "Utilisateur";

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-border">
      <div className="flex items-center justify-between h-16 px-6">
        {/* Mobile Menu Button */}
        <button
          onClick={onOpenMobile}
          className="lg:hidden p-2 hover:bg-muted rounded-lg transition-colors"
          aria-label="Ouvrir le menu"
        >
          <Menu size={24} />
        </button>

        {/* Search Bar */}
        <div className="hidden md:flex flex-1 max-w-xl">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
            <input
              type="text"
              placeholder="Rechercher des projets, messages..."
              className="w-full h-10 pl-10 pr-4 rounded-lg border border-border bg-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          {/* Notifications */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative p-2 hover:bg-muted rounded-lg transition-colors"
          >
            <Bell size={20} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
          </motion.button>

          {/* Profile (Desktop) */}
          <div className="hidden lg:flex items-center gap-3 pl-3 border-l border-border">
            <div className="text-right">
              <p className="text-sm font-semibold">{username}</p>
              <p className="text-xs text-muted-foreground">
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
