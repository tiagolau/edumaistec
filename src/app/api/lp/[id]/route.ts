import { NextRequest, NextResponse } from "next/server";
import { getSupabaseClient } from "@/lib/supabase/client";
import {
  getTokenFromRequest,
  validateWorkspaceToken,
  unauthorizedResponse,
} from "@/lib/lp/auth";
import { updateLandingPageSchema } from "@/lib/lp/validators";
import { deleteBanner } from "@/lib/supabase/storage";
import { lpRowToCamel, lpRowToCamelWithCount } from "@/lib/lp/types";
import type { LandingPageRow } from "@/lib/lp/types";

type Params = { params: Promise<{ id: string }> };

export async function GET(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const token = getTokenFromRequest(request);
    const workspace = await validateWorkspaceToken(token);
    if (!workspace) return unauthorizedResponse();

    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from("landing_pages")
      .select("*, lp_submissions(count)")
      .eq("id", id)
      .eq("workspace_id", workspace.id)
      .single();

    if (error || !data) {
      return NextResponse.json(
        { error: "Landing page não encontrada" },
        { status: 404 },
      );
    }

    return NextResponse.json(lpRowToCamelWithCount(data));
  } catch (error) {
    console.error("GET /api/lp/[id] error:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 },
    );
  }
}

export async function PUT(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const token = getTokenFromRequest(request);
    const workspace = await validateWorkspaceToken(token);
    if (!workspace) return unauthorizedResponse();

    const supabase = getSupabaseClient();

    // Check the LP exists and belongs to this workspace
    const { data: existing, error: findError } = await supabase
      .from("landing_pages")
      .select("*")
      .eq("id", id)
      .eq("workspace_id", workspace.id)
      .single<LandingPageRow>();

    if (findError || !existing) {
      return NextResponse.json(
        { error: "Landing page não encontrada" },
        { status: 404 },
      );
    }

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: "Corpo da requisição inválido" },
        { status: 400 },
      );
    }

    const result = updateLandingPageSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        {
          error: "Dados inválidos",
          details: result.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    const { slug, webhookUrl, title, redirectUrl, formFields, bannerUrl, bannerPath, ...rest } =
      result.data;

    // Check slug uniqueness if changed
    if (slug && slug !== existing.slug) {
      const { data: slugTaken } = await supabase
        .from("landing_pages")
        .select("id")
        .eq("slug", slug)
        .single();

      if (slugTaken) {
        return NextResponse.json(
          { error: "Slug já está em uso" },
          { status: 409 },
        );
      }
    }

    // If the banner changed, delete the old one from Storage
    if (bannerPath && existing.banner_path && bannerPath !== existing.banner_path) {
      await deleteBanner(existing.banner_path);
    }

    // Build the update payload (only include fields that were provided)
    const updatePayload: Record<string, unknown> = {};
    if (title !== undefined) updatePayload.title = title;
    if (slug !== undefined) updatePayload.slug = slug;
    if (redirectUrl !== undefined) updatePayload.redirect_url = redirectUrl;
    if (webhookUrl !== undefined) updatePayload.webhook_url = webhookUrl || null;
    if (formFields !== undefined) updatePayload.form_fields = formFields;
    if (bannerUrl !== undefined) updatePayload.banner_url = bannerUrl || null;
    if (bannerPath !== undefined) updatePayload.banner_path = bannerPath || null;
    updatePayload.updated_at = new Date().toISOString();

    const { data: updated, error: updateError } = await supabase
      .from("landing_pages")
      .update(updatePayload)
      .eq("id", id)
      .select()
      .single<LandingPageRow>();

    if (updateError || !updated) {
      console.error("PUT /api/lp/[id] update error:", updateError);
      return NextResponse.json(
        { error: "Erro interno do servidor" },
        { status: 500 },
      );
    }

    return NextResponse.json(lpRowToCamel(updated));
  } catch (error) {
    console.error("PUT /api/lp/[id] error:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const token = getTokenFromRequest(request);
    const workspace = await validateWorkspaceToken(token);
    if (!workspace) return unauthorizedResponse();

    const supabase = getSupabaseClient();

    const { data: landingPage, error: findError } = await supabase
      .from("landing_pages")
      .select("*")
      .eq("id", id)
      .eq("workspace_id", workspace.id)
      .single<LandingPageRow>();

    if (findError || !landingPage) {
      return NextResponse.json(
        { error: "Landing page não encontrada" },
        { status: 404 },
      );
    }

    if (landingPage.banner_path) {
      await deleteBanner(landingPage.banner_path);
    }

    const { error: deleteError } = await supabase
      .from("landing_pages")
      .delete()
      .eq("id", id);

    if (deleteError) {
      console.error("DELETE /api/lp/[id] error:", deleteError);
      return NextResponse.json(
        { error: "Erro interno do servidor" },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/lp/[id] error:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 },
    );
  }
}
