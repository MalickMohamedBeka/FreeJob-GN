import { motion } from "framer-motion";
import { Bell, Search, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DashboardHeaderProps {
  userType: "freelancer" | "client";
}

const DashboardHeader = ({ userType }: DashboardHeaderProps) => {
  return (
    <header className="sticky top-0 z-40 bg-white border-b border-border">
      <div className="flex items-center justify-between h-16 px-6">
        {/* Mobile Menu Button */}
        <button className="lg:hidden p-2 hover:bg-muted rounded-lg">
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
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </motion.button>

          {/* Profile (Desktop) */}
          <div className="hidden lg:flex items-center gap-3 pl-3 border-l border-border">
            <div className="text-right">
              <p className="text-sm font-semibold">Malick Mohamed</p>
              <p className="text-xs text-muted-foreground">
                {userType === "freelancer" ? "Freelancer" : "Client"}
              </p>
            </div>
            <img 
              src="/avatars/profile-main.jpg" 
              alt="Malick Mohamed"
              className="w-10 h-10 rounded-full object-cover"
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
