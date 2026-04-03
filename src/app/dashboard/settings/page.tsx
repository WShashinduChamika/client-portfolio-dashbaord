import React from "react";
import { Settings, Construction, ShieldCheck, ToggleRight, AlertTriangle } from "lucide-react";

const features = [
  {
    icon: ShieldCheck,
    iconClass: "bg-indigo-100 text-indigo-500",
    title: "Account Security",
    description: "Change your email, password, and enable two-factor authentication.",
  },
  {
    icon: ToggleRight,
    iconClass: "bg-violet-100 text-violet-500",
    title: "Portfolio Controls",
    description: "Toggle visibility of projects, blogs, and enable maintenance mode.",
  },
  {
    icon: AlertTriangle,
    iconClass: "bg-red-100 text-red-400",
    title: "Danger Zone",
    description: "Irreversible account actions like deactivation will live here.",
  },
];

export default function SettingsPage() {
  return (
    <div className="flex flex-col gap-6">
      {/* Page header */}
      <div>
        <h2 className="text-lg font-bold tracking-tight">Settings</h2>
        <p className="text-sm text-muted-foreground">
          Configure your account and portfolio preferences.
        </p>
      </div>

      {/* Hero coming-soon card */}
      <div className="relative overflow-hidden rounded-2xl border border-dashed border-border bg-white px-8 py-14 text-center">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              "linear-gradient(#8b5cf6 1px, transparent 1px), linear-gradient(to right, #8b5cf6 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />
        <div className="pointer-events-none absolute -top-16 left-1/2 h-48 w-72 -translate-x-1/2 rounded-full bg-linear-to-br from-violet-400 to-purple-500 opacity-10 blur-3xl" />

        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-100 text-violet-500 shadow-sm">
          <Settings className="h-8 w-8" />
        </div>

        <div className="mb-4 flex items-center justify-center gap-2">
          <Construction className="h-4 w-4 text-amber-500" />
          <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-amber-700">
            Coming Soon
          </span>
        </div>

        <h3 className="text-xl font-bold text-foreground">Settings</h3>
        <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
          This section is under active development. Full account and portfolio settings will be available shortly.
        </p>
      </div>

      {/* Feature cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        {features.map(({ icon: Icon, iconClass, title, description }) => (
          <div key={title} className="rounded-xl border border-border bg-white px-5 py-5">
            <div className={`mb-3 flex h-9 w-9 items-center justify-center rounded-lg ${iconClass}`}>
              <Icon className="h-4.5 w-4.5" />
            </div>
            <p className="text-sm font-semibold text-foreground">{title}</p>
            <p className="mt-1 text-xs text-muted-foreground">{description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
