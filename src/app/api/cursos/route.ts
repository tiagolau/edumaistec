import { NextRequest, NextResponse } from "next/server";
import { getCourses } from "@/lib/services/courses";

export async function GET(request: NextRequest) {
  const area = request.nextUrl.searchParams.get("area");

  try {
    const courses = await getCourses(area || undefined);

    return NextResponse.json(
      { data: courses, count: courses.length },
      {
        headers: {
          "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=600",
        },
      },
    );
  } catch (error) {
    console.error("GET /api/cursos error:", error);
    return NextResponse.json(
      { error: "Falha ao buscar cursos" },
      { status: 500 },
    );
  }
}
