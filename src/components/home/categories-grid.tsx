import Link from "next/link";
import {
  GraduationCap,
  Heart,
  Briefcase,
  HardHat,
  Monitor,
  Users,
  Palette,
  FlaskConical,
  Leaf,
  Wrench,
  LayoutGrid,
  MoreHorizontal,
  type LucideIcon,
} from "lucide-react";
import { getAreas } from "@/lib/services/courses";
import { SectionTitle } from "@/components/shared/section-title";
import { AnimatedSection } from "@/components/shared/animated-section";

const iconMap: Record<string, LucideIcon> = {
  GraduationCap,
  Heart,
  Briefcase,
  HardHat,
  Monitor,
  Users,
  Palette,
  FlaskConical,
  Leaf,
  Wrench,
  LayoutGrid,
  MoreHorizontal,
  BookOpen: GraduationCap,
  Scale: Briefcase,
  Brain: Heart,
};

function getLabel(area: { name?: string; title?: string }): string {
  return area.name || area.title || "";
}

function getCount(area: { courseCount?: number }): number | undefined {
  return area.courseCount;
}

export async function CategoriesGrid() {
  const areas = await getAreas();

  return (
    <section className="py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <AnimatedSection>
          <SectionTitle
            title="Explore nossas áreas de conhecimento"
            subtitle="Encontre o curso técnico ideal para sua carreira entre mais de 60 opções."
          />
        </AnimatedSection>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 sm:gap-4">
          {areas.map((area, i) => {
            const Icon = iconMap[area.icon] || LayoutGrid;
            const label = getLabel(area);
            const count = getCount(area);
            return (
              <AnimatedSection
                key={area.slug}
                animation="fade-up"
                delay={i * 60}
              >
                <Link
                  href={`/cursos?categoria=${area.slug}`}
                  className="group relative flex flex-col items-center gap-3 overflow-hidden rounded-xl border border-border bg-card p-4 text-center transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-0.5 sm:p-6"
                >
                  {/* Top accent bar */}
                  <div className="absolute inset-x-0 top-0 h-1 bg-primary/10 transition-all duration-300 group-hover:bg-accent group-hover:h-1" />

                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-all duration-300 group-hover:bg-primary group-hover:text-primary-foreground group-hover:scale-110">
                    <Icon className="h-6 w-6" />
                  </div>

                  <div>
                    <h3 className="text-xs font-semibold leading-tight text-foreground sm:text-sm">
                      {label}
                    </h3>
                    {count !== undefined && (
                      <p className="mt-1 text-[11px] text-muted-foreground">
                        {count} cursos
                      </p>
                    )}
                  </div>
                </Link>
              </AnimatedSection>
            );
          })}
        </div>
      </div>
    </section>
  );
}
