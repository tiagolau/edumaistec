import { NextResponse } from "next/server";
import { getAreas } from "@/lib/services/courses";

export async function GET() {
  try {
    const areas = await getAreas();

    return NextResponse.json(
      { data: areas },
      {
        headers: {
          "Cache-Control":
            "public, s-maxage=86400, stale-while-revalidate=3600",
        },
      },
    );
  } catch (error) {
    console.error("GET /api/areas error:", error);
    return NextResponse.json(
      { error: "Falha ao buscar áreas de interesse" },
      { status: 500 },
    );
  }
}
