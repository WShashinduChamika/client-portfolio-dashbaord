import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: string | number;
  description?: string;
  icon: LucideIcon;
  /** Tailwind colour classes for the icon container */
  iconClass?: string;
  trend?: {
    value: string;
    positive?: boolean;
  };
}

export default function StatCard({
  label,
  value,
  description,
  icon: Icon,
  iconClass = "bg-indigo-100 text-indigo-600",
  trend,
}: StatCardProps) {
  return (
    <Card className="border border-border shadow-none">
      <CardContent className="flex items-start gap-4 pt-5">
        {/* Icon */}
        <div
          className={cn(
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
            iconClass
          )}
        >
          <Icon className="h-5 w-5" />
        </div>

        {/* Text */}
        <div className="flex flex-col gap-0.5">
          <p className="text-xs font-medium text-muted-foreground">{label}</p>
          <p className="text-2xl font-bold tracking-tight text-foreground">
            {value}
          </p>
          {description && (
            <p className="text-xs text-muted-foreground">{description}</p>
          )}
          {trend && (
            <p
              className={cn(
                "text-xs font-medium",
                trend.positive ? "text-emerald-600" : "text-red-500"
              )}
            >
              {trend.positive ? "↑" : "↓"} {trend.value}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
