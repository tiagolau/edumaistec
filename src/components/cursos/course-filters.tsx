"use client";

import { useMemo } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Course, Category, CourseArea } from "@/types/course";

interface CourseFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  selectedCategory: string;
  onCategoryChange: (value: string) => void;
  selectedDuration: string;
  onDurationChange: (value: string) => void;
  resultCount: number;
  areas: (Category | CourseArea)[];
  courses: Course[];
}

function getAreaLabel(area: Category | CourseArea): string {
  return "name" in area ? area.name : area.title;
}

export function CourseFilters({
  search,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  selectedDuration,
  onDurationChange,
  resultCount,
  areas,
  courses,
}: CourseFiltersProps) {
  const hasFilters = search || selectedCategory || selectedDuration;

  const durations = useMemo(() => {
    const set = new Set<string>();
    for (const c of courses) {
      if (c.duration) set.add(c.duration);
    }
    return Array.from(set).sort((a, b) => {
      const numA = parseInt(a) || 0;
      const numB = parseInt(b) || 0;
      return numA - numB;
    });
  }, [courses]);

  function clearFilters() {
    onSearchChange("");
    onCategoryChange("");
    onDurationChange("");
  }

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Buscar curso por nome..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="h-11 pl-10 text-sm"
        />
      </div>

      {/* Category pills */}
      <div>
        <div className="mb-2 flex items-center gap-2 text-sm font-medium text-foreground">
          <SlidersHorizontal className="h-4 w-4" />
          Área de Interesse
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge
            variant={selectedCategory === "" ? "default" : "outline"}
            className={`cursor-pointer text-xs ${
              selectedCategory === ""
                ? "bg-primary text-primary-foreground"
                : "hover:bg-secondary"
            }`}
            onClick={() => onCategoryChange("")}
          >
            Todas
          </Badge>
          {areas.map((area) => (
            <Badge
              key={area.slug}
              variant={selectedCategory === area.slug ? "default" : "outline"}
              className={`cursor-pointer text-xs ${
                selectedCategory === area.slug
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-secondary"
              }`}
              onClick={() => onCategoryChange(area.slug)}
            >
              {getAreaLabel(area)}
            </Badge>
          ))}
        </div>
      </div>

      {/* Duration pills */}
      <div>
        <div className="mb-2 text-sm font-medium text-foreground">Duração</div>
        <div className="flex flex-wrap gap-2">
          <Badge
            variant={selectedDuration === "" ? "default" : "outline"}
            className={`cursor-pointer text-xs ${
              selectedDuration === ""
                ? "bg-primary text-primary-foreground"
                : "hover:bg-secondary"
            }`}
            onClick={() => onDurationChange("")}
          >
            Todas
          </Badge>
          {durations.map((d) => (
            <Badge
              key={d}
              variant={selectedDuration === d ? "default" : "outline"}
              className={`cursor-pointer text-xs ${
                selectedDuration === d
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-secondary"
              }`}
              onClick={() => onDurationChange(d)}
            >
              {d}
            </Badge>
          ))}
        </div>
      </div>

      {/* Result count + clear */}
      <div className="flex items-center justify-between border-t border-border pt-3">
        <p className="text-sm text-muted-foreground">
          <span className="font-semibold text-foreground">{resultCount}</span>{" "}
          curso{resultCount !== 1 ? "s" : ""} encontrado{resultCount !== 1 ? "s" : ""}
        </p>
        {hasFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            <X className="mr-1 h-3 w-3" />
            Limpar filtros
          </Button>
        )}
      </div>
    </div>
  );
}
