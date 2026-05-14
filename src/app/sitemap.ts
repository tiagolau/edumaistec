import type { MetadataRoute } from "next";
import { INSTITUTION } from "@/lib/constants";

const BASE_URL = `https://${INSTITUTION.domain}`;

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${BASE_URL}/certificacao-por-competencia`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE_URL}/contato`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/politica-de-privacidade`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
  ];
}
