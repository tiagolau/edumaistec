import { NextRequest, NextResponse } from "next/server";
import { getCourseById, getCourseBySlug } from "@/lib/services/courses";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  try {
    // Tenta buscar por ID numérico primeiro, depois por slug
    const numId = Number(id);
    const course = isNaN(numId)
      ? await getCourseBySlug(id)
      : await getCourseById(numId);

    if (!course) {
      return NextResponse.json(
        { error: "Curso não encontrado" },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { data: course },
      {
        headers: {
          "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=600",
        },
      },
    );
  } catch (error) {
    console.error(`GET /api/cursos/${id} error:`, error);
    return NextResponse.json(
      { error: "Falha ao buscar curso" },
      { status: 500 },
    );
  }
}
