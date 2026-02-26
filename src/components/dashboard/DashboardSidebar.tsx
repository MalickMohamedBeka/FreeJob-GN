import { motion } from "framer-motion";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Briefcase,
  FileText,
  Coins,
  MessageSquare,
  Settings,
  User,
  LogOut,
  Search,
  FileCheck,
  X,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useFreelanceProfile } from "@/hooks/useProfile";
import { useClientProfile } from "@/hooks/useProfile";

interface DashboardSidebarProps {
  userType: "freelancer" | "client";
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

const freelancerMenuItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
  { icon: Search, label: "Trouver des Projets", path: "/dashboard/find-projects" },
  { icon: Briefcase, label: "Mes Projets", path: "/dashboard/projects" },
  { icon: FileText, label: "Propositions", path: "/dashboard/proposals" },
  { icon: Coins, label: "Revenus", path: "/dashboard/earnings" },
  { icon: MessageSquare, label: "Messages", path: "/dashboard/messages" },
  { icon: User, label: "Mon Profil", path: "/dashboard/profile" },
  { icon: Settings, label: "Paramètres", path: "/dashboard/settings" },
];

const clientMenuItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/client/dashboard" },
  { icon: Briefcase, label: "Mes Projets", path: "/client/projects" },
  { icon: FileText, label: "Propositions", path: "/client/proposals" },
  { icon: FileCheck, label: "Contrats", path: "/client/contracts" },
  { icon: MessageSquare, label: "Messages", path: "/client/messages" },
  { icon: User, label: "Mon Profil", path: "/client/profile" },
];

// ── Avatar helpers ─────────────────────────────────────────────────────────────

function AvatarDisplay({ src, username }: { src?: string | null; username: string }) {
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
        className="w-10 h-10 rounded-full object-cover flex-shrink-0"
      />
    );
  }
  return (
    <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
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

// ── Shared sidebar content ─────────────────────────────────────────────────────

function SidebarContent({
  userType,
  onItemClick,
}: {
  userType: "freelancer" | "client";
  onItemClick?: () => void;
}) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const menuItems = userType === "freelancer" ? freelancerMenuItems : clientMenuItems;
  const username = user?.username || "Utilisateur";

  const handleLogout = async () => {
    onItemClick?.();
    await logout();
    navigate("/login");
  };

  return (
    <div className="flex flex-col flex-grow bg-white overflow-y-auto h-full">
      {/* Logo */}
      <div className="flex items-center justify-center h-16 px-4 border-b border-border flex-shrink-0">
        <Link to="/" className="flex items-center gap-3" onClick={onItemClick}>
          <img src="/logo.png" alt="FreeJobGN" className="h-10 w-auto" />
          <span className="font-bold text-xl">FreeJobGN</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          return (
            <Link key={item.path} to={item.path} onClick={onItemClick}>
              <motion.div
                whileHover={{ x: 4 }}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                  isActive
                    ? "bg-primary text-white"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <Icon size={20} />
                <span className="font-medium">{item.label}</span>
              </motion.div>
            </Link>
          );
        })}
      </nav>

      {/* User Section */}
      <div className="p-4 border-t border-border flex-shrink-0">
        <div className="flex items-center gap-3 mb-3">
          {userType === "freelancer" ? (
            <FreelancerAvatar username={username} />
          ) : (
            <ClientAvatar username={username} />
          )}
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm truncate">{username}</p>
            <p className="text-xs text-muted-foreground truncate">
              {userType === "freelancer" ? "Freelancer" : "Client"}
            </p>
          </div>
        </div>
        <motion.button
          whileHover={{ x: 4 }}
          onClick={handleLogout}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground w-full px-3 py-2 rounded-lg hover:bg-muted transition-colors"
        >
          <LogOut size={18} />
          <span className="text-sm font-medium">Déconnexion</span>
        </motion.button>
      </div>
    </div>
  );
}

// ── Component ──────────────────────────────────────────────────────────────────

const DashboardSidebar = ({ userType, mobileOpen, onCloseMobile }: DashboardSidebarProps) => {
  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col border-r border-border">
        <SidebarContent userType={userType} />
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/40 z-40 lg:hidden"
            onClick={onCloseMobile}
            aria-hidden="true"
          />

          {/* Drawer panel */}
          <div className="fixed inset-y-0 left-0 w-72 z-50 lg:hidden shadow-xl flex flex-col">
            {/* Close button inside drawer header area */}
            <div className="absolute top-4 right-4 z-10">
              <button
                onClick={onCloseMobile}
                className="p-1.5 rounded-lg bg-muted/80 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Fermer le menu"
              >
                <X size={18} />
              </button>
            </div>
            <SidebarContent userType={userType} onItemClick={onCloseMobile} />
          </div>
        </>
      )}
    </>
  );
};

export default DashboardSidebar;
