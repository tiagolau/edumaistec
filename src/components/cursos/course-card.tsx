import Link from "next/link";
import { Clock, BookOpen } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Course } from "@/types/course";
import { formatCurrency } from "@/lib/pricing";

interface CourseCardProps {
  course: Course;
}

export function CourseCard({ course }: CourseCardProps) {
  const categoryName = course.area?.title || course.categorySlug;
  const { pricing } = course;

  return (
    <div className="group flex flex-col rounded-xl border border-border bg-card transition-all hover:border-primary/30 hover:shadow-md">
      <div className="flex flex-1 flex-col p-5">
        {/* Category badge + competency badge */}
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <Badge
            variant="secondary"
            className="w-fit text-xs font-medium text-primary"
          >
            {categoryName}
          </Badge>
          <Badge
            variant="outline"
            className="w-fit text-[10px] font-medium text-accent border-accent/30"
          >
            Certificação por Competência
          </Badge>
        </div>

        {/* Title */}
        <h3 className="mb-2 text-base font-semibold leading-snug text-foreground group-hover:text-primary transition-colors sm:text-lg">
          {course.name}
        </h3>

        {/* Description */}
        {course.description && (
          <p className="mb-4 flex-1 text-sm leading-relaxed text-muted-foreground line-clamp-3">
            {course.description}
          </p>
        )}

        {/* Info */}
        <div className="mb-4 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
          {course.duration && (
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              {course.duration}
            </span>
          )}
          {course.workload > 0 && (
            <span className="flex items-center gap-1">
              <BookOpen className="h-3.5 w-3.5" />
              {course.workload}h
            </span>
          )}
          <Badge variant="outline" className="text-[10px]">
            {course.modality}
          </Badge>
        </div>

        {/* Price */}
        <div className="mb-4 border-t border-border pt-3">
          <p className="text-sm text-muted-foreground line-through">
            De: {pricing.originalInstallments}x R${" "}
            {formatCurrency(pricing.originalInstallmentValue)}
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">Por</p>
          <p className="text-xl font-bold text-primary">
            {pricing.promoInstallments}x{" "}
            <span className="text-2xl">
              R$ {formatCurrency(pricing.promoInstallmentValue)}
            </span>
          </p>
          <p className="text-xs text-muted-foreground">
            sem juros no cartão
          </p>
        </div>

        {/* CTA */}
        <Button
          className="mt-auto w-full bg-accent text-accent-foreground hover:bg-accent-dark"
          asChild
        >
          <Link href={`/cursos/${course.slug}`}>Ver detalhes</Link>
        </Button>
      </div>
    </div>
  );
}
