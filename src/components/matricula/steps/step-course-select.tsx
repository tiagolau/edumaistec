"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { useFormContext } from "react-hook-form";
import { useSearchParams } from "next/navigation";
import { BookOpen, Clock, Award, X, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Course, Category, CourseArea } from "@/types/course";
import type { EnrollmentFormData } from "@/lib/validators/enrollment";

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="mt-1 text-xs text-red-500">{message}</p>;
}

function getAreaLabel(area: Category | CourseArea): string {
  return "name" in area ? area.name : area.title;
}

export function StepCourseSelect() {
  const {
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<EnrollmentFormData>();

  const searchParams = useSearchParams();
  const selectedCourses = watch("courses") || [];
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const preselectedRef = useRef(false);

  const [courses, setCourses] = useState<Course[]>([]);
  const [areas, setAreas] = useState<(Category | CourseArea)[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [coursesRes, areasRes] = await Promise.all([
          fetch("/api/cursos"),
          fetch("/api/areas"),
        ]);
        if (coursesRes.ok) {
          const data = await coursesRes.json();
          setCourses(data.data || []);
        }
        if (areasRes.ok) {
          const data = await areasRes.json();
          setAreas(data.data || []);
        }
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // Pré-selecionar curso vindo da URL (?curso=slug)
  useEffect(() => {
    if (preselectedRef.current || courses.length === 0) return;
    const cursoSlug = searchParams.get("curso");
    if (!cursoSlug) return;

    const course = courses.find((c) => c.active && c.slug === cursoSlug);
    if (!course) return;

    const numId = toNumericId(course.id);
    if (selectedCourses.some((sc) => sc.id === numId)) return;

    const installmentValue = course.pricing?.promoInstallmentValue ?? course.price;

    setValue(
      "courses",
      [
        ...selectedCourses,
        {
          id: numId,
          title: course.name,
          installmentValue,
        },
      ],
      { shouldValidate: true },
    );
    preselectedRef.current = true;
  }, [courses, searchParams, selectedCourses, setValue]);

  const activeCourses = useMemo(
    () => courses.filter((c) => c.active),
    [courses],
  );

  const filteredCourses = useMemo(() => {
    let result = activeCourses;

    if (selectedCategory) {
      result = result.filter((c) => c.categorySlug === selectedCategory);
    }

    if (searchTerm.length >= 2) {
      const term = searchTerm.toLowerCase();
      result = result.filter((c) => c.name.toLowerCase().includes(term));
    }

    return result;
  }, [activeCourses, selectedCategory, searchTerm]);

  const toNumericId = (id: string | number): number => {
    if (typeof id === "number") return id;
    const num = Number(id);
    if (!isNaN(num)) return num;
    let hash = 0;
    for (let i = 0; i < id.length; i++) {
      hash = (hash << 5) - hash + id.charCodeAt(i);
      hash |= 0;
    }
    return Math.abs(hash);
  };

  const addCourse = (courseId: string | number) => {
    const course = activeCourses.find((c) => c.id === courseId);
    if (!course) return;

    const numId = toNumericId(course.id);
    if (selectedCourses.some((sc) => sc.id === numId)) return;

    const installmentValue = course.pricing?.promoInstallmentValue ?? course.price;

    setValue(
      "courses",
      [
        ...selectedCourses,
        {
          id: numId,
          title: course.name,
          installmentValue,
        },
      ],
      { shouldValidate: true },
    );
  };

  const removeCourse = (courseId: number) => {
    setValue(
      "courses",
      selectedCourses.filter((c) => c.id !== courseId),
      { shouldValidate: true },
    );
  };

  return (
    <div className="space-y-6">
      {/* Cursos selecionados */}
      {selectedCourses.length > 0 && (
        <div>
          <Label className="text-sm font-medium mb-2 block">
            Cursos selecionados ({selectedCourses.length})
          </Label>
          <div className="space-y-2">
            {selectedCourses.map((sc) => (
              <div
                key={sc.id}
                className="flex items-center justify-between gap-3 rounded-lg border border-primary/20 bg-primary/5 px-4 py-3"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <BookOpen className="h-4 w-4 text-primary shrink-0" />
                  <span className="text-sm font-medium text-foreground truncate">
                    {sc.title}
                  </span>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  {sc.installmentValue > 0 && (
                    <span className="text-sm text-primary font-semibold">
                      R$ {sc.installmentValue.toFixed(2).replace(".", ",")}
                      /mês
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => removeCourse(sc.id)}
                    className="text-muted-foreground hover:text-red-500 transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <FieldError message={errors.courses?.message as string} />

      {/* Busca e filtros */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar curso por nome..."
            className="pl-10"
          />
        </div>

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="flex h-11 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <option value="">Todas as áreas</option>
          {areas.map((area) => (
            <option key={area.slug} value={area.slug}>
              {getAreaLabel(area)}
            </option>
          ))}
        </select>
      </div>

      {/* Lista de cursos */}
      <div className="max-h-80 overflow-y-auto space-y-2 rounded-lg border border-border p-2">
        {loading ? (
          <p className="text-sm text-muted-foreground text-center py-8">
            Carregando cursos...
          </p>
        ) : filteredCourses.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">
            Nenhum curso encontrado
          </p>
        ) : (
          filteredCourses.map((course) => {
            const isSelected = selectedCourses.some(
              (sc) => sc.id === toNumericId(course.id),
            );
            const categoryName = course.area?.title || course.categorySlug;

            return (
              <button
                key={course.id}
                type="button"
                onClick={() => !isSelected && addCourse(course.id)}
                disabled={isSelected}
                className={`w-full text-left rounded-lg p-3 transition-colors ${
                  isSelected
                    ? "bg-primary/5 border border-primary/20 opacity-60 cursor-default"
                    : "hover:bg-muted/50 border border-transparent"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground">
                      {course.name}
                    </p>
                    <div className="flex flex-wrap items-center gap-2 mt-1">
                      {categoryName && (
                        <span className="text-xs text-primary bg-primary/10 px-2 py-0.5 rounded">
                          {categoryName}
                        </span>
                      )}
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
                  <div className="shrink-0 text-right">
                    {course.pricing && (
                      <p className="text-sm font-bold text-primary">
                        {course.pricing.promoInstallments}x R${" "}
                        {course.pricing.promoInstallmentValue
                          .toFixed(2)
                          .replace(".", ",")}
                      </p>
                    )}
                    {isSelected && (
                      <span className="text-xs text-success">Selecionado</span>
                    )}
                  </div>
                </div>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}
