import React from "react";
import { User, Construction, PenLine, Link2, BadgeCheck } from "lucide-react";

const features = [
  {
    icon: PenLine,
    iconClass: "bg-emerald-100 text-emerald-500",
    title: "Personal Info & Bio",
    description: "Update your name, role, location, and public biography.",
  },
  {
    icon: Link2,
    iconClass: "bg-indigo-100 text-indigo-500",
    title: "Social & Website Links",
    description: "Connect your GitHub, LinkedIn, Instagram and portfolio URL.",
  },
  {
    icon: BadgeCheck,
    iconClass: "bg-violet-100 text-violet-500",
    title: "Skills & Highlights",
    description: "Showcase your skills, tools, and at-a-glance stats.",
  },
];

export default function ProfilePage() {
  return (
    <div className="flex flex-col gap-6">
      {/* Page header */}
      <div>
        <h2 className="text-lg font-bold tracking-tight">Profile</h2>
        <p className="text-sm text-muted-foreground">
          Your personal information, bio, and public links.
        </p>
      </div>

      {/* Hero coming-soon card */}
      <div className="relative overflow-hidden rounded-2xl border border-dashed border-border bg-white px-8 py-14 text-center">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              "linear-gradient(#10b981 1px, transparent 1px), linear-gradient(to right, #10b981 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />
        <div className="pointer-events-none absolute -top-16 left-1/2 h-48 w-72 -translate-x-1/2 rounded-full bg-linear-to-br from-emerald-400 to-teal-400 opacity-10 blur-3xl" />

        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-500 shadow-sm">
          <User className="h-8 w-8" />
        </div>

        <div className="mb-4 flex items-center justify-center gap-2">
          <Construction className="h-4 w-4 text-amber-500" />
          <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-amber-700">
            Coming Soon
          </span>
        </div>

        <h3 className="text-xl font-bold text-foreground">Profile Management</h3>
        <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
          This section is under active development. Full profile editing and management will be available shortly.
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
