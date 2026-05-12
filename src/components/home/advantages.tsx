import {
  Clock,
  Wallet,
  Award,
  Headphones,
  type LucideIcon,
} from "lucide-react";
import { advantages } from "@/data/advantages";
import { SectionTitle } from "@/components/shared/section-title";
import { INSTITUTION } from "@/lib/constants";

const iconMap: Record<string, LucideIcon> = {
  Clock,
  Wallet,
  Award,
  Headphones,
};

export function Advantages() {
  return (
    <section className="bg-background-alt py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionTitle
          title={`Por que escolher a ${INSTITUTION.name}?`}
          subtitle="Vantagens que fazem a diferença na sua formação e carreira profissional."
        />

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {advantages.map((advantage) => {
            const Icon = iconMap[advantage.icon] || Award;
            return (
              <div
                key={advantage.id}
                className="group rounded-xl bg-card p-6 shadow-sm transition-all hover:shadow-md"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10 text-accent transition-colors group-hover:bg-accent group-hover:text-accent-foreground">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-foreground">
                  {advantage.title}
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {advantage.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
