import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowLeft, CalendarDays } from "lucide-react";

type PolicySection = {
  id: string;
  title: string;
  content: ReactNode;
};

type PolicyPageProps = {
  eyebrow: string;
  title: string;
  introduction: string;
  sections: PolicySection[];
};

const updatedDate = "July 14, 2026";

export default function PolicyPage({ eyebrow, title, introduction, sections }: PolicyPageProps) {
  return (
    <div className="bg-paper text-ink">
      <section className="relative overflow-hidden border-b border-ink/15 bg-ink px-5 py-14 text-paper sm:px-6 sm:py-20">
        <div className="absolute -right-20 -top-24 h-80 w-80 rounded-full bg-purple-700/30 blur-3xl" aria-hidden />
        <div className="relative mx-auto max-w-6xl">
          <Link
            href="/"
            className="mb-9 inline-flex items-center gap-2 font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-paper/70 transition-colors hover:text-paper"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Synesis
          </Link>
          <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.24em] text-marker">{eyebrow}</p>
          <h1 className="mt-4 max-w-3xl font-serif text-5xl font-medium leading-[1.02] tracking-[-0.04em] sm:text-6xl">{title}</h1>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-paper/75 sm:text-lg">{introduction}</p>
        </div>
      </section>

      <main className="mx-auto grid max-w-6xl gap-10 px-5 py-14 sm:px-6 sm:py-20 lg:grid-cols-[13rem_minmax(0,1fr)] lg:gap-16">
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="border-y border-ink/15 py-5">
            <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-ink-soft">On this page</p>
            <nav className="mt-4 space-y-3" aria-label={`${title} sections`}>
              {sections.map((section, index) => (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  className="block font-mono text-[11px] uppercase tracking-[0.08em] text-ink-soft transition-colors hover:text-purple-700"
                >
                  {String(index + 1).padStart(2, "0")} · {section.title}
                </a>
              ))}
            </nav>
          </div>
          <div className="mt-6 flex items-center gap-3 text-sm text-ink-soft">
            <CalendarDays className="h-4 w-4 text-purple-700" />
            <span>Last updated {updatedDate}</span>
          </div>
        </aside>

        <article className="max-w-3xl">
          <p className="border-l-2 border-purple-700 pl-5 text-lg leading-relaxed text-ink-soft">{introduction}</p>
          <div className="mt-12 space-y-12">
            {sections.map((section, index) => (
              <section key={section.id} id={section.id} className="scroll-mt-24 border-t border-ink/15 pt-8">
                <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-purple-700">Section {String(index + 1).padStart(2, "0")}</p>
                <h2 className="mt-3 font-serif text-3xl font-medium tracking-[-0.025em] text-ink sm:text-4xl">{section.title}</h2>
                <div className="mt-5 space-y-4 leading-relaxed text-ink-soft">{section.content}</div>
              </section>
            ))}
          </div>
        </article>
      </main>
    </div>
  );
}
