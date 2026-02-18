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
  Bell
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface DashboardSidebarProps {
  userType: "freelancer" | "client";
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
  { icon: Bell, label: "Contrats", path: "/client/contracts" },
  { icon: MessageSquare, label: "Messages", path: "/client/messages" },
  { icon: User, label: "Mon Profil", path: "/client/profile" },
];

const DashboardSidebar = ({ userType }: DashboardSidebarProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const menuItems = userType === "freelancer" ? freelancerMenuItems : clientMenuItems;

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-col flex-grow bg-white border-r border-border overflow-y-auto">
          {/* Logo */}
          <div className="flex items-center justify-center h-16 px-4 border-b border-border">
            <Link to="/" className="flex items-center gap-3">
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
                <Link key={item.path} to={item.path}>
                  <motion.div
                    whileHover={{ x: 4 }}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors relative ${
                      isActive
                        ? "bg-primary text-white"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                  >
                    <Icon size={20} />
                    <span className="font-medium">{item.label}</span>
                    {item.badge && (
                      <span className="ml-auto bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </motion.div>
                </Link>
              );
            })}
          </nav>

          {/* User Section */}
          <div className="p-4 border-t border-border">
            <div className="flex items-center gap-3 mb-3">
              <img 
                src="/avatars/profile-main.jpg" 
                alt="Malick Mohamed"
                className="w-10 h-10 rounded-full object-cover"
              />
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm truncate">{user?.username || "Utilisateur"}</p>
                <p className="text-xs text-muted-foreground truncate">{userType === "freelancer" ? "Freelancer" : "Client"}</p>
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
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-border z-50">
        <div className="flex items-center justify-around px-2 py-2">
          {menuItems.slice(0, 5).map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;

            return (
              <Link key={item.path} to={item.path} className="flex-1">
                <div
                  className={`flex flex-col items-center gap-1 py-2 rounded-lg ${
                    isActive ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  <Icon size={20} />
                  <span className="text-xs font-medium">{item.label.split(" ")[0]}</span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default DashboardSidebar;
