import { Sidebar } from "../_components/layout/Sidebar";
import { MobileNav } from "../_components/layout/MobileNav";
import { ToastProvider } from "../_components/ui/Toast";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      <div className="dashboard-layout">
        <Sidebar />
        <div className="dashboard-main">
          <div className="dashboard-content">
            {children}
          </div>
        </div>
        <MobileNav />
      </div>
    </ToastProvider>
  );
}
