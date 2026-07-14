import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/api/",
        "/create-group",
        "/dashboard",
        "/forgot-password",
        "/groups",
        "/login",
        "/maintenance",
        "/my-groups",
        "/profile",
        "/report-problem",
        "/reset-password",
        "/security-demo",
        "/signup",
      ],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
