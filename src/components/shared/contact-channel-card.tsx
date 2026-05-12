import type { LucideIcon } from "lucide-react";

interface ContactChannelCardProps {
  icon: LucideIcon;
  title: string;
  value: string;
  href: string;
  iconColor?: string;
  iconBgColor?: string;
}

export function ContactChannelCard({
  icon: Icon,
  title,
  value,
  href,
  iconColor = "text-primary",
  iconBgColor = "bg-primary/10",
}: ContactChannelCardProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-start gap-4 rounded-2xl border border-border bg-card p-5 transition-all duration-300 hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-0.5"
    >
      <div
        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${iconBgColor} transition-transform duration-300 group-hover:scale-110`}
      >
        <Icon className={`h-5 w-5 ${iconColor}`} />
      </div>
      <div className="min-w-0">
        <p className="text-sm font-semibold text-foreground">{title}</p>
        <p className="mt-0.5 text-sm text-muted-foreground break-all">
          {value}
        </p>
      </div>
    </a>
  );
}
