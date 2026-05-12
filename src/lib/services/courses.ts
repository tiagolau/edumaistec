import type { Course, Category, CourseArea } from "@/types/course";

const EXCLUDED_PREFIXES = ["CURSO DE EXTEN", "DISCIPLINA ISOLADA"];

function baseTitle(name: string): string {
  return name.replace(/\s*\(\d+[Hh]\)\s*$/, "").trim();
}

function deduplicateCourses(courses: Course[]): Course[] {
  const filtered = courses.filter(
    (c) => !EXCLUDED_PREFIXES.some((p) => c.name.startsWith(p)),
  );

  const map = new Map<string, Course>();
  for (const course of filtered) {
    const key = baseTitle(course.name);
    const existing = map.get(key);
    if (!existing || course.workload > existing.workload) {
      map.set(key, course);
    }
  }

  return Array.from(map.values());
}

export async function getCourses(areaSlug?: string): Promise<Course[]> {
  const { fetchCourses, mapEdunoCourseToFrontend } =
    await import("@/lib/eduno");

  const response = await fetchCourses();
  const all = response.lista.map((item) => mapEdunoCourseToFrontend(item));
  let courses = deduplicateCourses(all);

  if (areaSlug) {
    courses = courses.filter((c) => c.categorySlug === areaSlug);
  }

  return courses;
}

export async function getCourseBySlug(
  slug: string,
): Promise<Course | null> {
  const { fetchCourses, fetchCourseDetail, mapEdunoCourseToFrontend } =
    await import("@/lib/eduno");

  const coursesResponse = await fetchCourses();
  const courseItem = coursesResponse.lista.find(
    (c) =>
      c.titulo
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "") === slug,
  );

  if (!courseItem) return null;

  const detail = await fetchCourseDetail(courseItem.id);
  return mapEdunoCourseToFrontend(courseItem, detail);
}

export async function getCourseById(
  id: number | string,
): Promise<Course | null> {
  const { fetchCourseDetail, mapEdunoCourseToFrontend } =
    await import("@/lib/eduno");

  const numId = Number(id);
  if (isNaN(numId)) return null;

  const detail = await fetchCourseDetail(numId);

  return mapEdunoCourseToFrontend(
    {
      id: numId,
      titulo: detail.titulo,
      imagem: detail.imagem,
      temimagem: detail.temimagem,
      area: detail.area,
    },
    detail,
  );
}

export async function getAreas(): Promise<(Category | CourseArea)[]> {
  const { fetchAreas, mapEdunoAreaToFrontend } = await import("@/lib/eduno");
  const response = await fetchAreas();
  return response.lista.map(mapEdunoAreaToFrontend);
}

export async function getAllCourseSlugs(): Promise<string[]> {
  const { fetchCourses } = await import("@/lib/eduno");
  const response = await fetchCourses();
  return response.lista.map((c) =>
    c.titulo
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, ""),
  );
}
