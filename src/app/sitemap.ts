import type { MetadataRoute } from "next";
import { getAllCourseSlugs } from "@/lib/services/courses";
import { INSTITUTION } from "@/lib/constants";

const BASE_URL = `https://${INSTITUTION.domain}`;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${BASE_URL}/cursos`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE_URL}/contato`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/politica-de-privacidade`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
    { url: `${BASE_URL}/matricula`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
  ];

  const slugs = await getAllCourseSlugs();
  const coursePages: MetadataRoute.Sitemap = slugs.map((slug) => ({
    url: `${BASE_URL}/cursos/${slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...staticPages, ...coursePages];
}
