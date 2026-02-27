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
  desktopOpen: boolean;
}

const freelancerMenuItems = [
  { icon: LayoutDashboard, label: "Dashboard",          path: "/dashboard" },
  { icon: Search,          label: "Trouver des Projets", path: "/dashboard/find-projects" },
  { icon: Briefcase,       label: "Mes Projets",         path: "/dashboard/projects" },
  { icon: FileText,        label: "Propositions",        path: "/dashboard/proposals" },
  { icon: Coins,           label: "Revenus",             path: "/dashboard/earnings" },
  { icon: MessageSquare,   label: "Messages",            path: "/dashboard/messages" },
  { icon: User,            label: "Mon Profil",          path: "/dashboard/profile" },
  { icon: Settings,        label: "Paramètres",          path: "/dashboard/settings" },
];

const clientMenuItems = [
  { icon: LayoutDashboard, label: "Dashboard",    path: "/client/dashboard" },
  { icon: Briefcase,       label: "Mes Projets",  path: "/client/projects" },
  { icon: FileText,        label: "Propositions", path: "/client/proposals" },
  { icon: FileCheck,       label: "Contrats",     path: "/client/contracts" },
  { icon: MessageSquare,   label: "Messages",     path: "/client/messages" },
  { icon: User,            label: "Mon Profil",   path: "/client/profile" },
];

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

// ── Shared sidebar content ─────────────────────────────────────────────────────

function SidebarContent({
  userType,
  onItemClick,
  showClose,
  onClose,
}: {
  userType: "freelancer" | "client";
  onItemClick?: () => void;
  showClose?: boolean;
  onClose?: () => void;
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
    <div className="flex flex-col h-full bg-white overflow-y-auto">
      {/* Logo */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-border flex-shrink-0">
        <Link to="/" className="flex items-center gap-2.5" onClick={onItemClick}>
          <img src="/logo.png" alt="FreeJobGN" className="h-9 w-auto" />
          <span className="font-bold text-lg">FreeJobGN</span>
        </Link>
        {showClose && (
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            aria-label="Fermer"
          >
            <X size={17} />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          return (
            <Link key={item.path} to={item.path} onClick={onItemClick}>
              <motion.div
                whileHover={{ x: 3 }}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors text-sm ${
                  isActive
                    ? "bg-primary text-white font-medium"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <Icon size={18} className="flex-shrink-0" />
                <span>{item.label}</span>
              </motion.div>
            </Link>
          );
        })}
      </nav>

      {/* User section */}
      <div className="p-3 border-t border-border flex-shrink-0">
        <div className="flex items-center gap-2.5 px-2 py-2 mb-1">
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
          whileHover={{ x: 3 }}
          onClick={handleLogout}
          className="flex items-center gap-2.5 text-muted-foreground hover:text-foreground w-full px-3 py-2 rounded-xl hover:bg-muted transition-colors text-sm"
        >
          <LogOut size={17} />
          <span>Déconnexion</span>
        </motion.button>
      </div>
    </div>
  );
}

// ── Component ──────────────────────────────────────────────────────────────────

const DashboardSidebar = ({ userType, mobileOpen, onCloseMobile, desktopOpen }: DashboardSidebarProps) => {
  return (
    <>
      {/* Desktop Sidebar — slides in/out with CSS transform */}
      <div
        className={`fixed inset-y-0 left-0 w-64 border-r border-border z-30 transition-transform duration-300 hidden lg:block ${
          desktopOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <SidebarContent userType={userType} />
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/40 z-40 lg:hidden"
            onClick={onCloseMobile}
            aria-hidden="true"
          />
          <div className="fixed inset-y-0 left-0 w-72 z-50 lg:hidden shadow-xl">
            <SidebarContent
              userType={userType}
              onItemClick={onCloseMobile}
              showClose
              onClose={onCloseMobile}
            />
          </div>
        </>
      )}
    </>
  );
};

export default DashboardSidebar;
