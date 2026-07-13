import Link from "next/link";
import { Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="texture-grain relative overflow-hidden bg-ink text-paper border-t-[5px] [border-top-style:double] border-ink/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <div className="bg-paper text-ink w-10 h-10 rounded-[3px] flex items-center justify-center">
                <span className="font-serif font-semibold text-xl">Z</span>
              </div>
              <div>
                <div className="font-serif font-semibold text-2xl text-paper leading-tight">Zeno</div>
              </div>
            </div>
            <p className="text-paper/70 mb-6 max-w-md leading-relaxed">
              Connecting students worldwide to create meaningful study partnerships and achieve academic success together.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-mono text-[11px] font-semibold uppercase tracking-[0.25em] text-paper/50 mb-5">Index</h3>
            <div className="space-y-3">
              <Link href="/groups" className="block text-paper/75 hover:text-purple-300 transition-colors">
                Browse Groups
              </Link>
              <Link href="/create-group" className="block text-paper/75 hover:text-purple-300 transition-colors">
                Create Group
              </Link>
              <Link href="/how-it-works" className="block text-paper/75 hover:text-purple-300 transition-colors">
                How It Works
              </Link>
              <Link href="/report-problem" className="block text-paper/75 hover:text-purple-300 transition-colors">
                Report A Problem
              </Link>
            </div>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-mono text-[11px] font-semibold uppercase tracking-[0.25em] text-paper/50 mb-5">Support</h3>
            <div className="space-y-3">
              <Link href="/help" className="block text-paper/75 hover:text-purple-300 transition-colors">
                Help Center
              </Link>
              <Link href="/contact" className="block text-paper/75 hover:text-purple-300 transition-colors">
                Contact Us
              </Link>
              <Link href="/privacy" className="block text-paper/75 hover:text-purple-300 transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="block text-paper/75 hover:text-purple-300 transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-paper/15 flex flex-col md:flex-row justify-between items-center gap-3">
          <p className="font-mono text-xs tracking-wide text-paper/50">
            &copy; 2025 Zeno Study Group Finder. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
