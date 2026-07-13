"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Home, Search, ArrowLeft, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-purple-50 via-white to-purple-100 flex items-center justify-center px-4 py-16">
      <div
        className="max-w-2xl mx-auto text-center"
        style={{
          opacity: mounted ? 1 : 0,
          transform: mounted ? "translateY(0)" : "translateY(16px)",
          transition: "opacity 0.5s ease, transform 0.5s ease",
        }}
      >
        {/* Decorative background orbs */}
        <div
          aria-hidden="true"
          className="absolute inset-0 overflow-hidden pointer-events-none"
        >
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-200 rounded-full opacity-20 blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-purple-300 rounded-full opacity-15 blur-3xl" />
        </div>

        {/* 404 large number */}
        <div className="relative mb-4 select-none">
          <span
            className="text-[10rem] md:text-[14rem] font-bold leading-none text-purple-100"
            aria-hidden="true"
          >
            404
          </span>
          {/* Floating icon centered over the numbers */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-white border border-purple-200 shadow-lg shadow-purple-100 w-20 h-20 rounded-2xl flex items-center justify-center">
              <BookOpen className="w-10 h-10 text-purple-600" />
            </div>
          </div>
        </div>

        {/* Heading & description */}
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Page Not Found
        </h1>
        <p className="text-lg text-gray-600 mb-10 max-w-md mx-auto leading-relaxed">
          Looks like this page went off-script. The study session you&apos;re
          looking for doesn&apos;t exist or may have moved.
        </p>

        {/* Quick links card */}
        <div className="bg-white rounded-2xl p-6 mb-8 shadow-lg border border-gray-100 text-left">
          <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
            Where would you like to go?
          </p>
          <div className="grid sm:grid-cols-2 gap-3">
            <Link
              href="/"
              className="flex items-center gap-3 p-3 rounded-xl hover:bg-purple-50 transition-colors group"
            >
              <div className="bg-purple-100 w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-purple-200 transition-colors">
                <Home className="w-4 h-4 text-purple-600" />
              </div>
              <div>
                <div className="text-sm font-semibold text-gray-900">Home</div>
                <div className="text-xs text-gray-500">Back to the start</div>
              </div>
            </Link>

            <Link
              href="/groups"
              className="flex items-center gap-3 p-3 rounded-xl hover:bg-purple-50 transition-colors group"
            >
              <div className="bg-purple-100 w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-purple-200 transition-colors">
                <Search className="w-4 h-4 text-purple-600" />
              </div>
              <div>
                <div className="text-sm font-semibold text-gray-900">
                  Browse Groups
                </div>
                <div className="text-xs text-gray-500">Find a study group</div>
              </div>
            </Link>

            <Link
              href="/dashboard"
              className="flex items-center gap-3 p-3 rounded-xl hover:bg-purple-50 transition-colors group"
            >
              <div className="bg-purple-100 w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-purple-200 transition-colors">
                <BookOpen className="w-4 h-4 text-purple-600" />
              </div>
              <div>
                <div className="text-sm font-semibold text-gray-900">
                  Dashboard
                </div>
                <div className="text-xs text-gray-500">Your study hub</div>
              </div>
            </Link>

            <Link
              href="/how-it-works"
              className="flex items-center gap-3 p-3 rounded-xl hover:bg-purple-50 transition-colors group"
            >
              <div className="bg-purple-100 w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-purple-200 transition-colors">
                <ArrowLeft className="w-4 h-4 text-purple-600" />
              </div>
              <div>
                <div className="text-sm font-semibold text-gray-900">
                  How It Works
                </div>
                <div className="text-xs text-gray-500">Learn about Zeno</div>
              </div>
            </Link>
          </div>
        </div>

        {/* Primary CTA */}
        <Button size="lg" variant="primary" asChild>
          <Link href="/">
            <Home className="w-4 h-4 mr-2" />
            Go Back Home
          </Link>
        </Button>

        <p className="mt-6 text-sm text-gray-400">
          Error 404 &mdash; The page you were looking for doesn&apos;t exist.
        </p>
      </div>
    </div>
  );
}
