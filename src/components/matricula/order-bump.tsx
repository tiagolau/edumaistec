"use client";

import { useMemo } from "react";
import { Plus, Check, Sparkles, Clock, Award } from "lucide-react";
import {
  PRICING,
  BUNDLE_PRICING,
  getInstallmentForPosition,
  formatCurrency,
} from "@/lib/pricing";
import type { Course } from "@/types/course";

interface OrderBumpProps {
  mainCourse: { id: number; categorySlug: string };
  allCourses: Course[];
  selectedExtras: number[];
  onToggleCourse: (courseId: number, courseTitle: string) => void;
}

export function OrderBump({
  mainCourse,
  allCourses,
  selectedExtras,
  onToggleCourse,
}: OrderBumpProps) {
  const suggestions = useMemo(() => {
    const sameCat = allCourses.filter(
      (c) =>
        c.active &&
        c.categorySlug === mainCourse.categorySlug &&
        Number(c.id) !== mainCourse.id,
    );

    const others = allCourses.filter(
      (c) =>
        c.active &&
        c.categorySlug !== mainCourse.categorySlug &&
        Number(c.id) !== mainCourse.id,
    );

    // Prioriza mesma area, depois preenche com outras
    const pool = [...sameCat, ...others];
    // Shuffle simples para variar sugestoes
    for (let i = pool.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [pool[i], pool[j]] = [pool[j], pool[i]];
    }
    return pool.slice(0, 6);
  }, [mainCourse.id, mainCourse.categorySlug, allCourses]);

  if (suggestions.length === 0) return null;

  return (
    <div className="mt-6 rounded-xl border-2 border-dashed border-accent/40 bg-accent/5 p-5">
      <div className="flex items-center gap-2 mb-3">
        <Sparkles className="h-5 w-5 text-accent" />
        <h3 className="text-base font-semibold text-foreground">
          Aproveite e adicione mais cursos com desconto!
        </h3>
      </div>
      <p className="text-sm text-muted-foreground mb-4">
        2o curso por apenas{" "}
        <span className="font-semibold text-accent">
          12x R$ {formatCurrency(BUNDLE_PRICING.secondCourse.installmentValue)}
        </span>{" "}
        | 3o em diante por{" "}
        <span className="font-semibold text-accent">
          12x R${" "}
          {formatCurrency(BUNDLE_PRICING.thirdAndBeyond.installmentValue)}
        </span>
      </p>

      <div className="space-y-2 max-h-64 overflow-y-auto">
        {suggestions.map((course) => {
          const courseId =
            typeof course.id === "number" ? course.id : Number(course.id);
          const isSelected = selectedExtras.includes(courseId);

          // Posicao no bundle: main (1) + quantos extras antes deste + 1
          const positionIfAdded = isSelected
            ? 1 + selectedExtras.indexOf(courseId) + 1
            : 1 + selectedExtras.length + 1;
          const installmentValue = getInstallmentForPosition(positionIfAdded);
          const discount = Math.round(
            ((PRICING.card.installmentValue - installmentValue) /
              PRICING.card.installmentValue) *
              100,
          );

          return (
            <button
              key={courseId}
              type="button"
              onClick={() => onToggleCourse(courseId, course.name)}
              className={`w-full text-left rounded-lg p-3 transition-all border-2 ${
                isSelected
                  ? "border-accent bg-accent/10"
                  : "border-transparent bg-background hover:bg-muted/50"
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md border-2 transition-colors ${
                    isSelected
                      ? "border-accent bg-accent text-white"
                      : "border-muted-foreground/30"
                  }`}
                >
                  {isSelected ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Plus className="h-4 w-4 text-muted-foreground/50" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {course.name}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5">
                    {course.duration && (
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {course.duration}
                      </span>
                    )}
                    {course.workload > 0 && (
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Award className="h-3 w-3" />
                        {course.workload}h
                      </span>
                    )}
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <p className="text-xs text-muted-foreground line-through">
                    12x R$ {formatCurrency(PRICING.card.installmentValue)}
                  </p>
                  <p className="text-sm font-bold text-accent">
                    12x R$ {formatCurrency(installmentValue)}
                  </p>
                  {discount > 0 && (
                    <span className="text-xs font-semibold text-white bg-accent rounded px-1.5 py-0.5">
                      {discount}% OFF
                    </span>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
