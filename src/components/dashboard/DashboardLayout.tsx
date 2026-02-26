import { useState, type ReactNode } from "react";
import DashboardSidebar from "./DashboardSidebar";
import DashboardHeader from "./DashboardHeader";

interface DashboardLayoutProps {
  children: ReactNode;
  userType: "freelancer" | "client";
}

const DashboardLayout = ({ children, userType }: DashboardLayoutProps) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-muted/30">
      <DashboardSidebar
        userType={userType}
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
      />

      <div className="lg:pl-64">
        <DashboardHeader
          userType={userType}
          onOpenMobile={() => setMobileOpen(true)}
        />

        <main className="p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
