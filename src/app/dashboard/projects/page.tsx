import { FolderOpen, Construction, Layers, MousePointerClick, Sparkles } from "lucide-react";

const features = [
  {
    icon: Layers,
    iconClass: "bg-indigo-100 text-indigo-500",
    title: "Project Gallery",
    description: "Add, arrange, and publish your portfolio case studies.",
  },
  {
    icon: MousePointerClick,
    iconClass: "bg-violet-100 text-violet-500",
    title: "Rich Project Editor",
    description: "Write detailed project descriptions with images and links.",
  },
  {
    icon: Sparkles,
    iconClass: "bg-pink-100 text-pink-500",
    title: "Visibility Controls",
    description: "Publish or draft projects and control what visitors see.",
  },
];

export default function ProjectsPage() {
  return <ComingSoonPage
    title="Projects"
    subtitle="Manage and organise your portfolio projects."
    icon={FolderOpen}
    iconClass="bg-indigo-100 text-indigo-500"
    accentFrom="from-indigo-500"
    accentTo="to-violet-500"
    features={features}
  />;
}

// ---------------------------------------------------------------------------
// Shared Coming Soon shell
// ---------------------------------------------------------------------------

function ComingSoonPage({
  title,
  subtitle,
  icon: PageIcon,
  iconClass,
  accentFrom,
  accentTo,
  features,
}: {
  title: string;
  subtitle: string;
  icon: React.ElementType;
  iconClass: string;
  accentFrom: string;
  accentTo: string;
  features: { icon: React.ElementType; iconClass: string; title: string; description: string }[];
}) {
  return (
    <div className="flex flex-col gap-6">
      {/* Page header */}
      <div>
        <h2 className="text-lg font-bold tracking-tight">{title}</h2>
        <p className="text-sm text-muted-foreground">{subtitle}</p>
      </div>

      {/* Hero coming-soon card */}
      <div className="relative overflow-hidden rounded-2xl border border-dashed border-border bg-white px-8 py-14 text-center">
        {/* Grid background */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              "linear-gradient(#6366f1 1px, transparent 1px), linear-gradient(to right, #6366f1 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />
        {/* Gradient blob */}
        <div className={`pointer-events-none absolute -top-16 left-1/2 h-48 w-72 -translate-x-1/2 rounded-full bg-linear-to-br ${accentFrom} ${accentTo} opacity-10 blur-3xl`} />

        <div className={`mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl ${iconClass} shadow-sm`}>
          <PageIcon className="h-8 w-8" />
        </div>

        <div className="mb-4 flex items-center justify-center gap-2">
          <Construction className="h-4 w-4 text-amber-500" />
          <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-amber-700">
            Coming Soon
          </span>
        </div>

        <h3 className="text-xl font-bold text-foreground">{title} Management</h3>
        <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
          This section is under active development. Full {title.toLowerCase()} management will be available shortly.
        </p>
      </div>

      {/* Feature cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        {features.map(({ icon: Icon, iconClass: ic, title: ft, description }) => (
          <div
            key={ft}
            className="rounded-xl border border-border bg-white px-5 py-5"
          >
            <div className={`mb-3 flex h-9 w-9 items-center justify-center rounded-lg ${ic}`}>
              <Icon className="h-4.5 w-4.5" />
            </div>
            <p className="text-sm font-semibold text-foreground">{ft}</p>
            <p className="mt-1 text-xs text-muted-foreground">{description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

import React from "react";
