import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { Users, BookOpen, Calendar, Zap, ArrowRight, Circle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { siteDescription } from "@/lib/site";

export const metadata: Metadata = {
  alternates: {
    canonical: "/",
  },
  openGraph: {
    url: "/",
  },
  description: siteDescription,
};

const SUBJECTS = [
  "Calculus II",
  "Organic Chemistry",
  "Data Structures",
  "Microeconomics",
  "World Literature",
  "Human Anatomy",
  "Linear Algebra",
  "Psychology 101",
  "Thermodynamics",
  "Statistics",
  "Art History",
  "Genetics",
];

const FEATURES = [
  {
    no: "01",
    icon: Users,
    title: "Find your study tribe",
    body: "Connect with students who share your academic interests and learning goals in your field.",
  },
  {
    no: "02",
    icon: BookOpen,
    title: "Subject-focused groups",
    body: "Filter groups by subject, course level, and study preferences to find exactly what you need.",
  },
  {
    no: "03",
    icon: Calendar,
    title: "Flexible scheduling",
    body: "Find groups that work with your busy schedule, from daily sessions to weekend meetups.",
  },
  {
    no: "04",
    icon: Zap,
    title: "Quick & simple",
    body: "An interface designed for busy students. Join groups and start studying in minutes.",
  },
];

const STATS = [
  { value: "10,000", suffix: "+", label: "Active students" },
  { value: "2,500", suffix: "+", label: "Study groups" },
  { value: "50", suffix: "+", label: "Subjects covered" },
  { value: "98", suffix: "%", label: "Satisfaction rate" },
];

const CATALOG_CARDS = [
  {
    code: "CHEM 201",
    cardNo: "Card no. 042",
    title: "Organic Chemistry Circle",
    rows: [
      ["Meets", "Tue & Thu · 7:00 PM"],
      ["Where", "Library, Rm 204"],
      ["Members", "5 of 8"],
    ],
    stamp: "3 seats open",
    position: "left-0 top-8 w-60 -rotate-3 z-10",
    delay: "250ms",
  },
  {
    code: "CS 310",
    cardNo: "Card no. 117",
    title: "Data Structures Crew",
    rows: [
      ["Meets", "Mon & Wed · 4:30 PM"],
      ["Where", "Online · Room A"],
      ["Members", "8 of 10"],
    ],
    stamp: "Open",
    position: "right-0 top-0 w-60 rotate-2",
    delay: "370ms",
  },
  {
    code: "ECON 101",
    cardNo: "Card no. 009",
    title: "Micro Study Society",
    rows: [
      ["Meets", "Sat · 10:00 AM"],
      ["Where", "Coffee Hall"],
      ["Members", "4 of 6"],
    ],
    stamp: "New this week",
    position: "left-1/2 -translate-x-1/2 bottom-0 w-64 -rotate-1 z-20",
    delay: "490ms",
  },
];

function SectionEyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="flex items-center gap-3 font-mono text-[11px] font-medium uppercase tracking-[0.25em] text-ink-soft">
      <span aria-hidden className="h-px w-10 bg-purple-700/60" />
      {children}
    </p>
  );
}

export default function Home() {
  return (
    <div className="bg-paper text-ink">
      {/* ============ Hero ============ */}
      <section className="texture-grain relative overflow-hidden px-4 pt-16 pb-20 lg:pt-24 lg:pb-28">
        <div
          aria-hidden
          className="bg-grid-paper absolute inset-0 mask-[radial-gradient(ellipse_at_top_left,black_25%,transparent_70%)]"
        />
        <div className="relative mx-auto grid max-w-6xl items-center gap-14 lg:grid-cols-12">
          {/* Left: statement */}
          <div className="lg:col-span-7">
            <p className="animate-fade-up mb-8 inline-flex -rotate-1 items-center gap-2 border-[1.5px] border-dashed border-emerald-700/60 bg-emerald-100/60 px-3 py-1.5 font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-emerald-900">
              <Circle className="h-2.5 w-2.5 fill-emerald-600 text-emerald-600" />
              Live
            </p>

            <div className="animate-fade-up [animation-delay:90ms]">
              <SectionEyebrow>Synesis · Study group finder</SectionEyebrow>
            </div>

            <h1 className="animate-fade-up mt-5 mb-6 font-serif text-5xl font-medium leading-[1.04] tracking-tight text-ink [animation-delay:160ms] sm:text-6xl lg:text-[4.4rem]">
              Find a study group that makes good grades a{" "}
              <em className="highlight-marker italic text-purple-700">group project</em>.
            </h1>

            <p className="animate-fade-up mb-9 max-w-xl text-lg leading-relaxed text-ink-soft [animation-delay:240ms] md:text-xl">
              Synesis connects you with classmates who share your subjects, your
              schedule, and your deadlines. Find your people — and never cram
              alone again.
            </p>

            <div className="animate-fade-up flex flex-col gap-4 [animation-delay:320ms] sm:flex-row sm:items-center">
              <Button
                size="lg"
                variant="primary"
                asChild
                className="group h-12 rounded-sm bg-purple-700 px-7 text-base shadow-[0.25rem_0.25rem_0_0_#241a35] transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:bg-purple-800 hover:shadow-[0.1rem_0.1rem_0_0_#241a35]"
              >
                <Link href="/groups">
                  Browse study groups
                  <ArrowRight className="ml-1 size-5! transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                asChild
                className="h-12 border-ink/70 bg-[#fffcf5] px-7 text-base text-ink hover:border-ink hover:bg-paper-deep"
              >
                <Link href="/signup">Join free today</Link>
              </Button>
            </div>

            <p className="animate-fade-up mt-7 font-mono text-xs tracking-wide text-ink-soft [animation-delay:400ms]">
              * No fees, no clutter — just students helping students.
            </p>
          </div>

          {/* Right: library catalog cards */}
          <div className="animate-fade-up mx-auto w-full max-w-md lg:col-span-5 lg:max-w-none [animation-delay:200ms]">
            <div className="relative h-107.5 sm:h-115">
              {CATALOG_CARDS.map((card) => (
                <article
                  key={card.code}
                  className={`animate-fade-up absolute ${card.position} rounded-[3px] border border-ink/15 bg-[#fffcf5] p-5 pb-9 shadow-[0_10px_24px_-14px_rgba(36,26,53,0.45)] transition-transform duration-300 hover:z-30 hover:rotate-0 hover:-translate-y-1`}
                  style={{ animationDelay: card.delay }}
                >
                  <span
                    aria-hidden
                    className="absolute -top-2.5 left-1/2 h-5 w-16 -translate-x-1/2 -rotate-3 bg-marker/50"
                  />
                  <div className="mb-3 flex items-baseline justify-between gap-2 border-b border-ink/15 pb-2">
                    <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-purple-700">
                      {card.code}
                    </span>
                    <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-ink-soft/70">
                      {card.cardNo}
                    </span>
                  </div>
                  <p className="mb-3 font-serif text-lg leading-snug text-ink">{card.title}</p>
                  <dl>
                    {card.rows.map(([k, v]) => (
                      <div
                        key={k}
                        className="flex justify-between gap-3 border-b border-dashed border-ink/15 py-1.5"
                      >
                        <dt className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-soft/80">
                          {k}
                        </dt>
                        <dd className="text-right font-mono text-[10px] tracking-wide text-ink">
                          {v}
                        </dd>
                      </div>
                    ))}
                  </dl>
                  <span className="mt-4 inline-block -rotate-2 rounded-xs border border-purple-700/60 px-2 py-1 font-mono text-[9px] font-semibold uppercase tracking-[0.18em] text-purple-700">
                    {card.stamp}
                  </span>
                  <span
                    aria-hidden
                    className="absolute bottom-2.5 left-1/2 h-3.5 w-3.5 -translate-x-1/2 rounded-full border border-ink/20 bg-paper"
                  />
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============ Subject ticker ============ */}
      <div aria-hidden className="overflow-hidden border-y border-ink/15 bg-paper-deep py-3">
        <div className="animate-marquee flex w-max">
          {[0, 1].map((copy) => (
            <ul
              key={copy}
              className="flex items-center font-mono text-[11px] uppercase tracking-[0.22em] text-ink-soft"
            >
              {SUBJECTS.map((subject) => (
                <li key={subject} className="flex items-center">
                  <span className="px-6">{subject}</span>
                  <span className="text-[8px] text-purple-700/70">◆</span>
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>

      {/* ============ Features ============ */}
      <section className="px-4 py-24">
        <div className="mx-auto max-w-6xl">
          <div className="mb-14 flex flex-col justify-between gap-8 md:flex-row md:items-end">
            <div>
              <SectionEyebrow>§ 01 — The case for Synesis</SectionEyebrow>
              <h2 className="mt-4 font-serif text-4xl font-medium tracking-tight text-ink md:text-5xl">
                Why students choose <em className="italic text-purple-700">Synesis</em>
              </h2>
            </div>
            <div className="max-w-sm">
              <p className="mb-4 leading-relaxed text-ink-soft">
                Everything you need to find study partners and excel in your
                academics.
              </p>
              <Link
                href="/how-it-works"
                className="inline-flex items-center gap-2 font-mono text-xs font-semibold uppercase tracking-[0.2em] text-purple-700 underline decoration-purple-700/40 underline-offset-4 transition-colors hover:decoration-purple-700"
              >
                How it works
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>

          <div className="grid gap-x-14 md:grid-cols-2">
            {FEATURES.map((feature) => (
              <div key={feature.no} className="group border-t border-ink/20 py-10">
                <div className="mb-6 flex items-center justify-between">
                  <span className="font-mono text-xs tracking-[0.2em] text-ink-soft">
                    No. {feature.no}
                  </span>
                  <feature.icon className="h-5 w-5 text-purple-700 transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-110" />
                </div>
                <h3 className="mb-3 font-serif text-2xl text-ink">{feature.title}</h3>
                <p className="max-w-md leading-relaxed text-ink-soft">{feature.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ Stats ============ */}
      <section className="border-y border-ink/15 bg-paper-deep px-4 py-16">
        <h2 className="sr-only">Synesis by the numbers</h2>
        <div className="mx-auto max-w-6xl">
          <div className="mb-10">
            <SectionEyebrow>§ 02 — By the numbers</SectionEyebrow>
          </div>
          <div className="grid grid-cols-2 gap-y-10 md:grid-cols-4 md:divide-x md:divide-ink/10">
            {STATS.map((stat, i) => (
              <div key={stat.label} className={`md:px-8 ${i === 0 ? "md:pl-0" : ""}`}>
                <p className="font-serif text-5xl text-ink md:text-6xl">
                  {stat.value}
                  <span className="text-purple-700">{stat.suffix}</span>
                </p>
                <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.2em] text-ink-soft">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
          <p className="mt-10 text-right font-mono text-[10px] uppercase tracking-[0.2em] text-ink-soft/70">
            * Figures grow every semester
          </p>
        </div>
      </section>

      {/* ============ CTA ============ */}
      <section className="texture-grain relative overflow-hidden bg-ink px-4 py-24">
        <div className="relative mx-auto max-w-3xl text-center">
          <p className="mb-6 flex items-center justify-center gap-3 font-mono text-[11px] font-medium uppercase tracking-[0.25em] text-purple-300/90">
            <span aria-hidden className="h-px w-10 bg-purple-300/50" />
            § 03 — Enrollment is open
            <span aria-hidden className="h-px w-10 bg-purple-300/50" />
          </p>
          <h2 className="mb-6 font-serif text-4xl font-medium tracking-tight text-paper md:text-5xl">
            Ready to start studying{" "}
            <em className="italic text-purple-300">together</em>?
          </h2>
          <p className="mb-10 text-lg leading-relaxed text-paper/70">
            Join thousands of students who have already found their perfect
            study partners and improved their grades.
          </p>
          <Button
            size="lg"
            asChild
            className="h-12 rounded-sm bg-paper px-8 text-base font-semibold text-ink shadow-[0.3rem_0.3rem_0_0_#7c3aed] transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:bg-white hover:shadow-[0.15rem_0.15rem_0_0_#7c3aed]"
          >
            <Link href="/signup">Get started for free</Link>
          </Button>
          <p className="mt-7 font-mono text-[10px] uppercase tracking-[0.25em] text-paper/50">
            Free for students. Forever.
          </p>
        </div>
      </section>
    </div>
  );
}
