import { notFound } from "next/navigation";
import { getSupabaseClient } from "@/lib/supabase/client";
import { LpPageView } from "@/components/lp/public/lp-page-view";
import type { FormFieldConfig, LandingPageRow } from "@/lib/lp/types";
import type { Metadata } from "next";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const supabase = getSupabaseClient();

  const { data: lp } = await supabase
    .from("landing_pages")
    .select("title, banner_url")
    .eq("slug", slug)
    .single<Pick<LandingPageRow, "title" | "banner_url">>();

  if (!lp) return { title: "Página não encontrada" };

  return {
    title: lp.title,
    openGraph: {
      title: lp.title,
      ...(lp.banner_url && {
        images: [{ url: lp.banner_url }],
      }),
    },
  };
}

export default async function LandingPagePage({ params }: Props) {
  const { slug } = await params;
  const supabase = getSupabaseClient();

  const { data: lp } = await supabase
    .from("landing_pages")
    .select("id, title, banner_url, form_fields, active")
    .eq("slug", slug)
    .single<Pick<LandingPageRow, "id" | "title" | "banner_url" | "form_fields" | "active">>();

  if (!lp || !lp.active) {
    notFound();
  }

  return (
    <LpPageView
      id={lp.id}
      bannerUrl={lp.banner_url}
      formFields={lp.form_fields as FormFieldConfig[]}
    />
  );
}
