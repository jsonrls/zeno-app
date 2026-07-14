import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Keep the development compiler output separate from production builds.
  // This prevents a `next build` from replacing files an active dev server is
  // reading (including development's _buildManifest.js).
  distDir: process.env.NODE_ENV === "development" ? ".next-dev" : ".next",
  async headers() {
    const nonIndexableRoutes = [
      "/api/:path*",
      "/create-group/:path*",
      "/dashboard/:path*",
      "/forgot-password/:path*",
      "/groups/:path*",
      "/login/:path*",
      "/maintenance/:path*",
      "/my-groups/:path*",
      "/profile/:path*",
      "/report-problem/:path*",
      "/reset-password/:path*",
      "/security-demo/:path*",
      "/signup/:path*",
    ];

    return nonIndexableRoutes.map((source) => ({
      source,
      headers: [{ key: "X-Robots-Tag", value: "noindex" }],
    }));
  },
};

export default nextConfig;
