import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="texture-grain relative overflow-hidden bg-ink text-paper border-t-[5px] [border-top-style:double] border-ink/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="inline-flex rounded-[3px] px-3 py-2">
              <Image
                src="/images/2-transparent.png"
                alt="Synesis"
                width={250}
                height={100}
                className="h-12 w-auto sm:h-16"
              />
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
            &copy; 2025 Synesis Study Group Finder. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
