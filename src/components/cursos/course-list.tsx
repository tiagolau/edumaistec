"use client";

import { useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { CourseCard } from "./course-card";
import { CourseFilters } from "./course-filters";
import type { Course, Category, CourseArea } from "@/types/course";

const PAGE_SIZE = 24;

type Props = {
  initialCourses: Course[];
  initialAreas: (Category | CourseArea)[];
};

export function CourseList({ initialCourses, initialAreas }: Props) {
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(searchParams.get("q") || "");
  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get("categoria") || ""
  );
  const [selectedDuration, setSelectedDuration] = useState(
    searchParams.get("duracao") || ""
  );
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const filteredCourses = useMemo(() => {
    return initialCourses.filter((course) => {
      if (!course.active) return false;

      const matchesSearch =
        !search ||
        course.name.toLowerCase().includes(search.toLowerCase()) ||
        (course.description &&
          course.description.toLowerCase().includes(search.toLowerCase()));

      const matchesCategory =
        !selectedCategory || course.categorySlug === selectedCategory;

      const matchesDuration =
        !selectedDuration || course.duration === selectedDuration;

      return matchesSearch && matchesCategory && matchesDuration;
    });
  }, [initialCourses, search, selectedCategory, selectedDuration]);

  const visibleCourses = filteredCourses.slice(0, visibleCount);
  const hasMore = visibleCount < filteredCourses.length;

  function handleFilterChange<T>(setter: (v: T) => void) {
    return (value: T) => {
      setter(value);
      setVisibleCount(PAGE_SIZE);
    };
  }

  return (
    <div>
      <CourseFilters
        search={search}
        onSearchChange={handleFilterChange(setSearch)}
        selectedCategory={selectedCategory}
        onCategoryChange={handleFilterChange(setSelectedCategory)}
        selectedDuration={selectedDuration}
        onDurationChange={handleFilterChange(setSelectedDuration)}
        resultCount={filteredCourses.length}
        areas={initialAreas}
        courses={initialCourses}
      />

      {visibleCourses.length > 0 ? (
        <>
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {visibleCourses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>

          {hasMore && (
            <div className="mt-8 text-center">
              <button
                onClick={() => setVisibleCount((prev) => prev + PAGE_SIZE)}
                className="inline-flex items-center rounded-lg border border-border bg-card px-6 py-3 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
              >
                Carregar mais cursos
                <span className="ml-2 text-xs text-muted-foreground">
                  ({filteredCourses.length - visibleCount} restantes)
                </span>
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="mt-12 text-center">
          <p className="text-lg font-medium text-foreground">
            Nenhum curso encontrado
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Tente alterar os filtros ou buscar por outro termo.
          </p>
        </div>
      )}
    </div>
  );
}
