import { NextRequest, NextResponse } from "next/server";
import { getSupabaseClient } from "@/lib/supabase/client";
import {
  getTokenFromRequest,
  validateWorkspaceToken,
  unauthorizedResponse,
} from "@/lib/lp/auth";
import { createLandingPageSchema } from "@/lib/lp/validators";
import { lpRowToCamel, lpRowToCamelWithCount } from "@/lib/lp/types";
import type { LandingPageRow } from "@/lib/lp/types";
import { generateId } from "@/lib/lp/id";

export async function GET(request: NextRequest) {
  try {
    const token = getTokenFromRequest(request);
    const workspace = await validateWorkspaceToken(token);
    if (!workspace) return unauthorizedResponse();

    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from("landing_pages")
      .select("*, lp_submissions(count)")
      .eq("workspace_id", workspace.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("GET /api/lp supabase error:", error);
      return NextResponse.json(
        { error: "Erro interno do servidor" },
        { status: 500 },
      );
    }

    const landingPages = (data ?? []).map(lpRowToCamelWithCount);

    return NextResponse.json(landingPages);
  } catch (error) {
    console.error("GET /api/lp error:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = getTokenFromRequest(request);
    const workspace = await validateWorkspaceToken(token);
    if (!workspace) return unauthorizedResponse();

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: "Corpo da requisição inválido" },
        { status: 400 },
      );
    }

    const result = createLandingPageSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        {
          error: "Dados inválidos",
          details: result.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    const { slug, title, redirectUrl, webhookUrl, formFields, bannerUrl, bannerPath } =
      result.data;

    const supabase = getSupabaseClient();

    // Check slug uniqueness
    const { data: existing } = await supabase
      .from("landing_pages")
      .select("id")
      .eq("slug", slug)
      .single();

    if (existing) {
      return NextResponse.json(
        { error: "Slug já está em uso" },
        { status: 409 },
      );
    }

    const { data: created, error: insertError } = await supabase
      .from("landing_pages")
      .insert({
        id: generateId(),
        slug,
        title,
        redirect_url: redirectUrl,
        webhook_url: webhookUrl || null,
        form_fields: formFields,
        banner_url: bannerUrl || null,
        banner_path: bannerPath || null,
        workspace_id: workspace.id,
        updated_at: new Date().toISOString(),
      })
      .select()
      .single<LandingPageRow>();

    if (insertError || !created) {
      console.error("POST /api/lp insert error:", insertError);
      return NextResponse.json(
        { error: "Erro interno do servidor" },
        { status: 500 },
      );
    }

    return NextResponse.json(lpRowToCamel(created), { status: 201 });
  } catch (error) {
    console.error("POST /api/lp error:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 },
    );
  }
}
