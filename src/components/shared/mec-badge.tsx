import { ShieldCheck } from "lucide-react";

export function MecBadge({ className = "" }: { className?: string }) {
  return (
    <div
      className={`inline-flex items-center gap-2 rounded-full bg-success/10 px-4 py-2 text-sm font-medium text-success ${className}`}
    >
      <ShieldCheck className="h-4 w-4" />
      Cadastrado no SISTEC/MEC
    </div>
  );
}
