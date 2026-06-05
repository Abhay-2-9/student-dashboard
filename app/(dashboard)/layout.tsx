import { Sidebar } from "../_components/layout/Sidebar";
import { MobileNav } from "../_components/layout/MobileNav";
import { ToastProvider } from "../_components/ui/Toast";
import { prisma } from "../_lib/prisma";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const settings = await prisma.settings.findUnique({ where: { id: "singleton" } });
  const academicYear = settings?.academicYear ?? "2025-26";

  return (
    <ToastProvider>
      <div className="dashboard-layout">
        <Sidebar academicYear={academicYear} />
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
