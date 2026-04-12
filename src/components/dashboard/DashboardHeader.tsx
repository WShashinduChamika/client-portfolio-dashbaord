"use client";

import { Menu, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface DashboardHeaderProps {
  title: string;
  onMenuClick: () => void;
}

export default function DashboardHeader({
  title,
  onMenuClick,
}: DashboardHeaderProps) {
  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-border bg-white px-5">
      {/* Left: hamburger (mobile) + page title */}
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={onMenuClick}
          className="md:hidden text-muted-foreground"
        >
          <Menu className="h-5 w-5" />
        </Button>
        <h1 className="text-base font-semibold text-foreground">{title}</h1>
      </div>

      {/* Right: notifications + user chip */}
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="relative text-muted-foreground"
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5" />
          {/* notification dot */}
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-indigo-600" />
        </Button>

        {/* User chip */}
        <div className="flex items-center gap-2 rounded-full bg-muted px-3 py-1.5">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-linear-to-br from-indigo-600 to-violet-600 text-[10px] font-bold text-white">
            A
          </div>
          <span className="hidden text-xs font-medium text-foreground sm:block">
            Admin
          </span>
        </div>
      </div>
    </header>
  );
}
