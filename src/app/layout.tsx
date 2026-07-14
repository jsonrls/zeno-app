import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Fraunces } from "next/font/google";
import "./globals.css";
import AppShell from "@/components/AppShell";
import { AuthProvider } from "@/lib/auth";
import { siteDescription, siteName, siteUrl } from "@/lib/site";
import { SpeedInsights } from "@vercel/speed-insights/next";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["opsz"],
  display: "swap",
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#7c3aed',
}

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Find Study Groups and Study Partners | Synesis",
    template: "%s | Synesis",
  },
  description: siteDescription,
  applicationName: siteName,
  keywords: ["study groups", "study group finder", "study partners", "student collaboration"],
  category: "education",
  formatDetection: {
    telephone: false,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  icons: {
    icon: [{ url: "/favicon.ico", type: "image/x-icon" }],
    shortcut: ["/favicon.ico"],
  },
  openGraph: {
    type: "website",
    url: "/",
    siteName,
    title: "Find Study Groups and Study Partners | Synesis",
    description: siteDescription,
  },
  twitter: {
    card: "summary_large_image",
    title: "Find Study Groups and Study Partners | Synesis",
    description: siteDescription,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        suppressHydrationWarning
        className={`${geistSans.variable} ${geistMono.variable} ${fraunces.variable} antialiased`}
      >
        <AuthProvider>
          <AppShell>{children}</AppShell>
        </AuthProvider>
        <SpeedInsights />
      </body>
    </html>
  );
}
