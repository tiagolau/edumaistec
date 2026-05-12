import { NextRequest, NextResponse } from "next/server";
import { getSupabaseClient } from "@/lib/supabase/client";
import {
  getTokenFromRequest,
  validateWorkspaceToken,
  unauthorizedResponse,
} from "@/lib/lp/auth";
import { submissionRowToCamel } from "@/lib/lp/types";
import type { LpSubmissionRow } from "@/lib/lp/types";

type Params = { params: Promise<{ id: string }> };

export async function GET(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const token = getTokenFromRequest(request);
    const workspace = await validateWorkspaceToken(token);
    if (!workspace) return unauthorizedResponse();

    const supabase = getSupabaseClient();

    // Verify the LP belongs to this workspace
    const { data: landingPage, error: lpError } = await supabase
      .from("landing_pages")
      .select("id")
      .eq("id", id)
      .eq("workspace_id", workspace.id)
      .single();

    if (lpError || !landingPage) {
      return NextResponse.json(
        { error: "Landing page não encontrada" },
        { status: 404 },
      );
    }

    const { searchParams } = new URL(request.url);
    const page = Math.max(1, Number(searchParams.get("page")) || 1);
    const limit = Math.min(100, Math.max(1, Number(searchParams.get("limit")) || 20));
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    // Fetch submissions with pagination
    const { data: submissions, error: subError, count } = await supabase
      .from("lp_submissions")
      .select("*", { count: "exact" })
      .eq("landing_page_id", id)
      .order("created_at", { ascending: false })
      .range(from, to);

    if (subError) {
      console.error("GET /api/lp/[id]/submissions supabase error:", subError);
      return NextResponse.json(
        { error: "Erro interno do servidor" },
        { status: 500 },
      );
    }

    const total = count ?? 0;

    return NextResponse.json({
      submissions: (submissions as LpSubmissionRow[] ?? []).map(submissionRowToCamel),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("GET /api/lp/[id]/submissions error:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 },
    );
  }
}
