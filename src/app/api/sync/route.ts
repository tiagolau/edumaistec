import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getSupabaseClient } from "@/lib/supabase/client";

export const maxDuration = 60;

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const {
      fetchCoursesDetailed,
      fetchAreas,
      mapEdunoCourseDetailedToFrontend,
      mapEdunoAreaToFrontend,
    } = await import("@/lib/eduno");

    // 1. Buscar dados da Eduno em paralelo
    const [coursesResponse, areasResponse] = await Promise.all([
      fetchCoursesDetailed(),
      fetchAreas(),
    ]);

    // 2. Mapear áreas
    const areas = areasResponse.lista.map(mapEdunoAreaToFrontend);

    // 3. Mapear e deduplicate cursos
    const allCourses = coursesResponse.lista.map(mapEdunoCourseDetailedToFrontend);

    const EXCLUDED_PREFIXES = ["CURSO DE EXTEN", "DISCIPLINA ISOLADA"];
    const filtered = allCourses.filter(
      (c) => !EXCLUDED_PREFIXES.some((p) => c.name.startsWith(p)),
    );

    const deduped = new Map<string, typeof filtered[0]>();
    for (const course of filtered) {
      const key = course.name.replace(/\s*\(\d+[Hh]\)\s*$/, "").trim();
      const existing = deduped.get(key);
      if (!existing || course.workload > existing.workload) {
        deduped.set(key, course);
      }
    }
    const courses = Array.from(deduped.values());

    const supabase = getSupabaseClient();

    // 4. Upsert áreas
    const areaRows = areas.map((a) => ({
      id: a.id,
      title: a.title,
      slug: a.slug,
      icon: a.icon,
    }));

    const { error: areaError } = await supabase
      .from("areas")
      .upsert(areaRows, { onConflict: "id" });

    if (areaError) {
      console.error("Sync areas error:", areaError);
    }

    // 5. Mapear cursos para as áreas corretas (IDs do Eduno diferem entre endpoints)
    const normalize = (s: string) =>
      s.replace(/-(?:e|de|da|do|das|dos)-/g, "-");

    function findMatchingArea(courseSlug: string) {
      const nc = normalize(courseSlug);
      // Match exato normalizado
      let match = areaRows.find((a) => normalize(a.slug) === nc);
      if (match) return match;
      // Curso começa com o slug da área
      match = areaRows.find((a) => nc.startsWith(normalize(a.slug)));
      if (match) return match;
      // Score de sobreposição de segmentos
      let best: (typeof areaRows)[0] | undefined;
      let bestScore = 0;
      for (const a of areaRows) {
        const ap = normalize(a.slug).split("-");
        const cp = nc.split("-");
        const hits = ap.filter((seg) =>
          cp.some((cs) => cs.startsWith(seg) || seg.startsWith(cs)),
        ).length;
        const score = ap.length > 0 ? hits / ap.length : 0;
        if (score > bestScore && score >= 0.5) {
          bestScore = score;
          best = a;
        }
      }
      return best;
    }

    const now = new Date().toISOString();
    const courseRows = courses.map((c) => {
      const matched = c.categorySlug
        ? findMatchingArea(c.categorySlug)
        : undefined;

      return {
        id: Number(c.id),
        slug: c.slug,
        title: c.name,
        description: c.description || "",
        image: c.image || null,
        has_image: c.hasImage ?? false,
        tcc_required: c.tccRequired || null,
        target_audience: c.targetAudience || "",
        curriculum: c.curriculum || [],
        workload: c.workload || 0,
        duration_months: c.durationMonths ?? null,
        category_slug: c.categorySlug || "",
        active: true,
        synced_at: now,
        area_id: matched?.id ?? null,
      };
    });

    // Upsert em batches de 500 (limite do PostgREST)
    const BATCH_SIZE = 500;
    let coursesUpserted = 0;
    for (let i = 0; i < courseRows.length; i += BATCH_SIZE) {
      const batch = courseRows.slice(i, i + BATCH_SIZE);
      const { error: courseError } = await supabase
        .from("courses")
        .upsert(batch, { onConflict: "id" });

      if (courseError) {
        console.error(`Sync courses batch ${i} error:`, courseError);
      } else {
        coursesUpserted += batch.length;
      }
    }

    // 6. Revalidar páginas
    revalidatePath("/cursos");
    revalidatePath("/");

    return NextResponse.json({
      synced: true,
      areas: areaRows.length,
      courses: coursesUpserted,
      totalFromEduno: coursesResponse.lista.length,
      afterDedup: courses.length,
      timestamp: now,
    });
  } catch (error) {
    console.error("Sync error:", error);
    return NextResponse.json(
      { error: "Falha no sync", details: String(error) },
      { status: 500 },
    );
  }
}

export async function GET(request: NextRequest) {
  return POST(request);
}
