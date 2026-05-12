import type { MetadataRoute } from "next";
import { INSTITUTION } from "@/lib/constants";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/"],
      },
    ],
    sitemap: `https://${INSTITUTION.domain}/sitemap.xml`,
  };
}
