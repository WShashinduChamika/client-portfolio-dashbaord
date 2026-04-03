import { Construction, FolderOpen, BarChart3, Activity } from "lucide-react";

// ---------------------------------------------------------------------------
// Coming-soon sections
// ---------------------------------------------------------------------------

const comingSoonSections = [
  {
    title: "Stats Overview",
    description: "Live counts of your projects, blogs, and profile activity.",
    icon: BarChart3,
    iconClass: "bg-indigo-100 text-indigo-500",
  },
  {
    title: "Portfolio Sections",
    description: "Quick-access cards to manage projects, blogs, profile, and more.",
    icon: FolderOpen,
    iconClass: "bg-violet-100 text-violet-500",
  },
  {
    title: "Recent Activity",
    description: "A timeline of your latest changes across all sections.",
    icon: Activity,
    iconClass: "bg-amber-100 text-amber-500",
  },
];

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-8">
      {/* Welcome banner */}
      <div className="rounded-2xl bg-linear-to-r from-indigo-600 to-violet-600 px-7 py-6 text-white shadow-lg shadow-indigo-500/20">
        <p className="text-sm font-medium opacity-80">Welcome back 👋</p>
        <h2 className="mt-0.5 text-2xl font-bold tracking-tight">
          Portfolio Dashboard
        </h2>
        <p className="mt-1 text-sm opacity-75">
          Manage your projects, blogs, and personal profile from one place.
        </p>
      </div>

      {/* Coming soon sections */}
      <div className="grid gap-5 sm:grid-cols-1 md:grid-cols-3">
        {comingSoonSections.map(({ title, description, icon: Icon, iconClass }) => (
          <div
            key={title}
            className="relative overflow-hidden rounded-2xl border border-dashed border-border bg-white px-6 py-8 text-center shadow-none"
          >
            {/* Subtle grid background */}
            <div
              className="pointer-events-none absolute inset-0 opacity-[0.03]"
              style={{
                backgroundImage:
                  "linear-gradient(#6366f1 1px, transparent 1px), linear-gradient(to right, #6366f1 1px, transparent 1px)",
                backgroundSize: "24px 24px",
              }}
            />

            {/* Icon */}
            <div className={`mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl ${iconClass}`}>
              <Icon className="h-6 w-6" />
            </div>

            {/* Badge */}
            <div className="mb-3 flex items-center justify-center gap-1.5">
              <Construction className="h-3.5 w-3.5 text-amber-500" />
              <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-[11px] font-semibold text-amber-700 uppercase tracking-wide">
                Coming Soon
              </span>
            </div>

            <p className="text-sm font-semibold text-foreground">{title}</p>
            <p className="mt-1 text-xs text-muted-foreground">{description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

