"use client";

import { useState } from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { usePathname } from "next/navigation";

/** Derive a readable page title from the current path */
function getTitle(pathname: string) {
  const map: Record<string, string> = {
    "/dashboard": "Overview",
    "/dashboard/projects": "Projects",
    "/dashboard/blogs": "Blogs",
    "/dashboard/profile": "Profile",
    "/dashboard/settings": "Settings",
  };
  return map[pathname] ?? "Dashboard";
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen bg-muted/40">
      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main area — offset by sidebar width on md+ */}
      <div className="flex flex-1 flex-col md:ml-64">
        <DashboardHeader
          title={getTitle(pathname)}
          onMenuClick={() => setSidebarOpen(true)}
        />

        <main className="flex-1 overflow-auto p-5 md:p-7">
          {children}
        </main>
      </div>
    </div>
  );
}
