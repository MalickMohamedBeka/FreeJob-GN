import { useState, type ReactNode } from "react";
import DashboardSidebar from "./DashboardSidebar";
import DashboardHeader from "./DashboardHeader";

interface DashboardLayoutProps {
  children: ReactNode;
  userType: "freelancer" | "client";
}

const DashboardLayout = ({ children, userType }: DashboardLayoutProps) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [desktopOpen, setDesktopOpen] = useState(true);

  const handleMenuToggle = () => {
    if (typeof window !== "undefined" && window.innerWidth >= 1024) {
      setDesktopOpen((v) => !v);
    } else {
      setMobileOpen(true);
    }
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <DashboardSidebar
        userType={userType}
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
        desktopOpen={desktopOpen}
      />

      <div className={`transition-[padding] duration-300 ${desktopOpen ? "lg:pl-64" : ""}`}>
        <DashboardHeader
          userType={userType}
          onMenuToggle={handleMenuToggle}
        />
        <main className="p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
