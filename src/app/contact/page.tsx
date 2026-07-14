import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Clock3, Mail, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { siteName, supportEmail } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Contact Synesis for account help, privacy requests, feedback, or technical support.",
  alternates: {
    canonical: "/contact",
  },
  openGraph: {
    url: "/contact",
  },
};

const topics = [
  ["Account help", "Sign-in, password reset, profile, or account-access questions."],
  ["Study groups", "Issues with groups, membership, inappropriate content, or user safety."],
  ["Privacy requests", "Access, correction, deletion, or other questions about your personal information."],
  ["Product feedback", "Ideas and bug reports that can help us make Synesis better."],
];

export default function ContactPage() {
  return (
    <div className="bg-paper text-ink">
      <section className="relative overflow-hidden border-b border-ink/15 bg-paper-deep px-5 py-14 sm:px-6 sm:py-20">
        <div className="bg-grid-paper absolute inset-0 opacity-70" aria-hidden />
        <div className="relative mx-auto max-w-6xl">
          <Link href="/" className="inline-flex items-center gap-2 font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-ink-soft transition-colors hover:text-purple-700">
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Synesis
          </Link>
          <div className="mt-11 grid gap-10 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-end">
            <div>
              <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.24em] text-purple-700">Support desk · Open channel</p>
              <h1 className="mt-4 max-w-3xl font-serif text-5xl font-medium leading-[1.02] tracking-[-0.04em] sm:text-6xl">A direct line when you need one.</h1>
              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-soft">Whether something is broken, unclear, or worth improving, tell us what happened. The more context you share, the faster we can help.</p>
            </div>
            <div className="border border-ink/20 bg-[#fffcf5] p-5 shadow-[5px_5px_0_0_rgba(36,26,53,0.12)]">
              <Clock3 className="h-5 w-5 text-purple-700" />
              <p className="mt-5 font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-ink-soft">Typical response</p>
              <p className="mt-2 font-serif text-2xl text-ink">Within one business day</p>
            </div>
          </div>
        </div>
      </section>

      <main className="mx-auto grid max-w-6xl gap-12 px-5 py-14 sm:px-6 sm:py-20 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <div>
          <h2 className="font-serif text-4xl font-medium tracking-[-0.03em]">Write to the support desk.</h2>
          <p className="mt-4 max-w-2xl leading-relaxed text-ink-soft">Email is the best way to reach us. Include your account email, the page or group involved, and screenshots or error details when relevant. Please do not send passwords or other sensitive information.</p>
          <Button asChild size="lg" className="mt-8 h-12 px-6 shadow-[4px_4px_0_#241a35] hover:shadow-[2px_2px_0_#241a35]">
            <a href={`mailto:${supportEmail}`}>
              <Mail />
              Email {supportEmail}
              <ArrowRight />
            </a>
          </Button>

          <div className="mt-14 grid gap-x-10 gap-y-9 sm:grid-cols-2">
            {topics.map(([title, description], index) => (
              <div key={title} className="border-t border-ink/20 pt-5">
                <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-purple-700">0{index + 1}</p>
                <h3 className="mt-2 font-serif text-2xl">{title}</h3>
                <p className="mt-2 leading-relaxed text-ink-soft">{description}</p>
              </div>
            ))}
          </div>
        </div>

        <aside className="self-start border border-ink/20 bg-ink p-6 text-paper shadow-[5px_5px_0_0_rgba(124,58,237,0.32)]">
          <ShieldCheck className="h-6 w-6 text-marker" />
          <h2 className="mt-5 font-serif text-3xl font-medium">Privacy requests</h2>
          <p className="mt-3 leading-relaxed text-paper/70">For a request about your personal information, clearly state the request and the email connected to your Synesis account. We may ask you to verify your identity first.</p>
          <Link href="/privacy" className="mt-6 inline-flex items-center gap-2 font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-marker underline decoration-marker/40 underline-offset-4 hover:decoration-marker">
            Read the privacy policy
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </aside>
      </main>
    </div>
  );
}
