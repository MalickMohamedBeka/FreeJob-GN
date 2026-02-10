import { ReactNode } from "react";
import DashboardSidebar from "./DashboardSidebar";
import DashboardHeader from "./DashboardHeader";

interface DashboardLayoutProps {
  children: ReactNode;
  userType: "freelancer" | "client";
}

const DashboardLayout = ({ children, userType }: DashboardLayoutProps) => {
  return (
    <div className="min-h-screen bg-muted/30">
      <DashboardSidebar userType={userType} />
      
      <div className="lg:pl-64">
        <DashboardHeader userType={userType} />
        
        <main className="p-6 lg:p-8 pb-24 lg:pb-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
