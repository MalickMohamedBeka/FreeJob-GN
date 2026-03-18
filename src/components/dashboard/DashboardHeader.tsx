import { motion } from "framer-motion";
import { Bell, Search, Menu, Briefcase, FileText, MessageSquare, FileCheck, Compass, Wallet as WalletIcon, Star, Crown } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useFreelanceProfile, useClientProfile } from "@/hooks/useProfile";
import { useUnreadCount } from "@/hooks/useNotifications";
import { useMySubscription } from "@/hooks/useSubscriptions";
import { useProviderRank } from "@/hooks/useRankings";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface DashboardHeaderProps {
  userType: "freelancer" | "client";
  onMenuToggle: () => void;
}

// ── Tier badge ─────────────────────────────────────────────────────────────────

const tierStyle: Record<string, { label: string; className: string }> = {
  FREE:    { label: "Free",    className: "bg-muted text-muted-foreground" },
  PRO:     { label: "Pro",     className: "bg-blue-100 text-blue-700" },
  PRO_MAX: { label: "Pro Max", className: "bg-primary/10 text-primary" },
  AGENCY:  { label: "Agency",  className: "bg-purple-100 text-purple-700" },
};

function TierBadge({ tier }: { tier: string }) {
  const style = tierStyle[tier] ?? tierStyle.FREE;
  return (
    <span className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-bold leading-none ${style.className}`}>
      <Crown size={9} />
      {style.label}
    </span>
  );
}

// ── Stars display ──────────────────────────────────────────────────────────────

function StarsDisplay({ stars }: { stars: number }) {
  if (stars === 0) return null;
  return (
    <span className="flex items-center gap-px">
      {Array.from({ length: 3 }).map((_, i) => (
        <Star
          key={i}
          size={10}
          className={i < stars ? "fill-amber-400 text-amber-400" : "fill-muted text-muted"}
        />
      ))}
    </span>
  );
}

// ── Avatar helpers ─────────────────────────────────────────────────────────────

function AvatarDisplay({ src, username }: { src?: string | null; username: string }) {
  const initials = username
    .split(/[\s._-]+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("") || "?";

  if (src) {
    return <img src={src} alt={username} className="w-8 h-8 rounded-full object-cover flex-shrink-0" />;
  }
  return (
    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
      <span className="text-white text-xs font-bold">{initials}</span>
    </div>
  );
}

// ── Shortcut icon button ───────────────────────────────────────────────────────

function NavIcon({
  to,
  icon: Icon,
  label,
  badge,
  active,
}: {
  to: string;
  icon: React.ElementType;
  label: string;
  badge?: number;
  active?: boolean;
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Link to={to}>
          <motion.div
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.93 }}
            className={`relative p-2 rounded-lg transition-colors cursor-pointer ${
              active ? "bg-primary/10 text-primary" : "hover:bg-muted text-muted-foreground hover:text-foreground"
            }`}
          >
            <Icon size={19} />
            {badge != null && badge > 0 && (
              <span className="absolute top-1 right-1 min-w-[15px] h-[15px] px-0.5 flex items-center justify-center rounded-full bg-primary text-white text-[9px] font-bold leading-none">
                {badge > 99 ? "99+" : badge}
              </span>
            )}
          </motion.div>
        </Link>
      </TooltipTrigger>
      <TooltipContent side="bottom" className="text-xs">{label}</TooltipContent>
    </Tooltip>
  );
}

// ── Freelancer header section ──────────────────────────────────────────────────

function FreelancerHeaderSection({ username }: { username: string }) {
  const location = useLocation();
  const { data: profile } = useFreelanceProfile();
  const { data: rank } = useProviderRank(profile?.id);
  const { data: subscription } = useMySubscription();

  const tier = subscription?.is_active ? subscription.plan.tier : "FREE";
  const stars = rank?.stars ?? 0;

  const shortcuts = [
    { to: "/dashboard/find-projects", icon: Compass,        label: "Trouver des projets" },
    { to: "/dashboard/projects",      icon: Briefcase,       label: "Mes Projets" },
    { to: "/dashboard/proposals",     icon: FileText,        label: "Propositions" },
    { to: "/dashboard/messages",      icon: MessageSquare,   label: "Messages" },
    { to: "/dashboard/wallet",        icon: WalletIcon,      label: "Portefeuille" },
  ];

  return (
    <>
      {/* Shortcut icons */}
      <div className="flex items-center gap-0.5">
        {shortcuts.map((s) => (
          <NavIcon
            key={s.to}
            to={s.to}
            icon={s.icon}
            label={s.label}
            active={location.pathname === s.to}
          />
        ))}
      </div>

      <div className="w-px h-5 bg-border mx-1" />

      {/* Profile (desktop) */}
      <div className="hidden lg:flex items-center gap-2.5">
        <div className="text-right">
          <div className="flex items-center justify-end gap-1.5 mb-0.5">
            <StarsDisplay stars={stars} />
            <TierBadge tier={tier} />
          </div>
          <p className="text-sm font-semibold leading-tight">{username}</p>
        </div>
        <Link to="/dashboard/profile">
          <AvatarDisplay src={profile?.profile_picture} username={username} />
        </Link>
      </div>
    </>
  );
}

// ── Client header section ──────────────────────────────────────────────────────

function ClientHeaderSection({ username }: { username: string }) {
  const location = useLocation();
  const { data: clientData } = useClientProfile();

  const shortcuts = [
    { to: "/client/projects",   icon: Briefcase,     label: "Mes Projets" },
    { to: "/client/proposals",  icon: FileText,       label: "Propositions" },
    { to: "/client/contracts",  icon: FileCheck,      label: "Contrats" },
    { to: "/client/messages",   icon: MessageSquare,  label: "Messages" },
  ];

  return (
    <>
      {/* Shortcut icons */}
      <div className="flex items-center gap-0.5">
        {shortcuts.map((s) => (
          <NavIcon
            key={s.to}
            to={s.to}
            icon={s.icon}
            label={s.label}
            active={location.pathname === s.to}
          />
        ))}
      </div>

      <div className="w-px h-5 bg-border mx-1" />

      {/* Profile (desktop) */}
      <div className="hidden lg:flex items-center gap-2.5">
        <div className="text-right">
          <p className="text-sm font-semibold leading-tight">{username}</p>
          <p className="text-xs text-muted-foreground leading-tight">Client</p>
        </div>
        <Link to="/client/profile">
          <AvatarDisplay src={clientData?.client_profile?.profile_picture} username={username} />
        </Link>
      </div>
    </>
  );
}

// ── Component ──────────────────────────────────────────────────────────────────

const DashboardHeader = ({ userType, onMenuToggle }: DashboardHeaderProps) => {
  const { user } = useAuth();
  const username = user?.username || "Utilisateur";
  const unreadCount = useUnreadCount();
  const notifPath =
    userType === "client" ? "/client/notifications" : "/dashboard/notifications";

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-border">
      <div className="flex items-center justify-between h-16 px-4 gap-2">
        {/* Sidebar toggle */}
        <button
          onClick={onMenuToggle}
          className="p-2 hover:bg-muted rounded-lg transition-colors flex-shrink-0"
          aria-label="Basculer le menu"
        >
          <Menu size={22} />
        </button>

        {/* Search Bar */}
        <div className="hidden md:flex flex-1 max-w-sm mx-2">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
            <input
              type="text"
              placeholder="Rechercher..."
              className="w-full h-9 pl-9 pr-4 rounded-lg border border-border bg-muted/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
          </div>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-1 ml-auto">
          {userType === "freelancer" ? (
            <FreelancerHeaderSection username={username} />
          ) : (
            <ClientHeaderSection username={username} />
          )}

          <div className="w-px h-5 bg-border mx-1" />

          {/* Notification bell */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Link to={notifPath}>
                <motion.div
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.93 }}
                  className="relative p-2 hover:bg-muted rounded-lg transition-colors cursor-pointer text-muted-foreground hover:text-foreground"
                >
                  <Bell size={19} />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 min-w-[15px] h-[15px] px-0.5 flex items-center justify-center rounded-full bg-red-500 text-white text-[9px] font-bold leading-none">
                      {unreadCount > 99 ? "99+" : unreadCount}
                    </span>
                  )}
                </motion.div>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="text-xs">Notifications</TooltipContent>
          </Tooltip>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
