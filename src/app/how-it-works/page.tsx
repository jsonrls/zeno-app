import Link from "next/link";
import type { Metadata } from "next";
import {
  ArrowRight,
  BookOpen,
  CalendarDays,
  Check,
  ChevronDown,
  Clock3,
  Compass,
  MapPin,
  MessageCircle,
  Search,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "How to Find a Study Group",
  description:
    "Learn how to find, join, and build a study group that fits your subjects, schedule, and goals with Synesis.",
  alternates: {
    canonical: "/how-it-works",
  },
  openGraph: {
    url: "/how-it-works",
  },
};

const steps = [
  {
    number: "01",
    kicker: "Search the catalog",
    title: "Find a group that fits your actual week.",
    description:
      "Browse by subject, then check the meeting rhythm, location, and open seats. The right group should fit your calendar—not fight it.",
    note: "Tip: schedule fit beats a perfect subject tag.",
    icon: Search,
  },
  {
    number: "02",
    kicker: "Claim your seat",
    title: "Join in one click—or start the room yourself.",
    description:
      "Found your people? Join the roster. Nothing quite right? Create a group, set the expectations, and let matching classmates find you.",
    note: "You choose the size, cadence, and platform.",
    icon: Users,
  },
  {
    number: "03",
    kicker: "Show up together",
    title: "Turn a plan into a dependable study habit.",
    description:
      "Meet where your group agreed—online or in person. Bring a goal, compare approaches, and leave knowing what each person will tackle next.",
    note: "Small, regular sessions are easier to sustain.",
    icon: BookOpen,
  },
];

const tools = [
  {
    icon: Compass,
    label: "Precise discovery",
    copy: "Filter by subject, frequency, meeting style, and platform.",
  },
  {
    icon: CalendarDays,
    label: "Clear schedules",
    copy: "See the meeting plan before you commit your time.",
  },
  {
    icon: MessageCircle,
    label: "Your choice of room",
    copy: "Use Discord, Meet, Zoom, or a real table in the library.",
  },
  {
    icon: ShieldCheck,
    label: "You stay in control",
    copy: "Manage your groups and leave when the fit is no longer right.",
  },
];

const principles = [
  ["Explain it aloud", "Teaching a concept exposes the exact point where your understanding gets fuzzy."],
  ["Compare methods", "A classmate’s route to the same answer can unlock a problem you have been circling."],
  ["Create accountability", "A recurring session gives your study plan a place and a time—not just good intentions."],
  ["Share the load", "Divide review topics, pool useful resources, and spend the session on the hardest questions."],
];

const faqs = [
  ["Is Synesis free to use?", "Yes. Browsing, joining, and creating study groups are free for students."],
  ["How do I choose the right group?", "Start with your subject, then prioritize schedule, location, and group size. Those practical details usually determine whether a group becomes a real habit."],
  ["Can I create or join more than one group?", "Yes. You can organize different groups around different subjects, courses, or study goals."],
  ["Where do study sessions happen?", "Wherever the group agrees: Discord, Zoom, Google Meet, another online platform, or an in-person location."],
  ["What if a group is not working for me?", "You can leave and look for a better fit. Study needs change, and your group roster can change with them."],
];

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="flex items-center gap-3 font-mono text-[10px] font-semibold uppercase tracking-[0.24em] text-ink-soft">
      <span className="h-px w-9 bg-purple-700/60" aria-hidden />
      {children}
    </p>
  );
}

export default function HowItWorks() {
  return (
    <div className="bg-paper text-ink">
      <section className="relative overflow-hidden border-b border-ink/15 px-5 pb-14 pt-11 sm:px-6 sm:py-20 lg:py-24">
        <div className="bg-grid-paper absolute inset-0 opacity-70 mask-[radial-gradient(ellipse_at_top_right,black_15%,transparent_72%)]" aria-hidden />
        <div className="relative mx-auto grid max-w-6xl gap-11 sm:gap-14 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <div className="animate-fade-up"><Eyebrow>Synesis field guide · No. 01</Eyebrow></div>
            <h1 className="animate-fade-up mt-5 max-w-3xl font-serif text-[2.8rem] font-medium leading-[1.01] tracking-[-0.04em] [animation-delay:80ms] min-[390px]:text-[3.15rem] sm:mt-6 sm:text-6xl lg:text-7xl">
              How to find a study group that <em className="highlight-marker italic text-purple-700">fits your week.</em>
            </h1>
            <p className="animate-fade-up mt-6 max-w-xl text-[1.05rem] leading-relaxed text-ink-soft [animation-delay:160ms] sm:mt-7 sm:text-lg">
              Synesis turns the awkward work of finding study partners into three clear moves: discover a fit, join the roster, and build a rhythm together.
            </p>
            <div className="animate-fade-up mt-8 grid grid-cols-2 gap-3 [animation-delay:240ms] sm:mt-9 sm:flex sm:gap-4">
              <Button size="lg" asChild className="group h-12 w-full rounded-sm px-4 shadow-[4px_4px_0_#241a35] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0_#241a35] sm:w-auto sm:px-7">
                <Link href="/groups">Browse the catalog <ArrowRight className="transition-transform group-hover:translate-x-1" /></Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="h-12 w-full px-4 sm:w-auto sm:px-7">
                <Link href="/create-group">Start a group</Link>
              </Button>
            </div>
          </div>

          <div className="animate-fade-up relative mx-auto w-full max-w-md px-1 [animation-delay:180ms] sm:px-0">
            <div className="absolute -left-2 top-12 h-20 w-20 -rotate-6 border border-dashed border-purple-700/35 sm:-left-5 sm:h-24 sm:w-24" aria-hidden />
            <article className="relative border border-ink/20 bg-[#fffcf5] p-5 shadow-[7px_8px_0_rgba(36,26,53,0.09)] transition-transform duration-300 sm:rotate-1 sm:p-6 sm:shadow-[10px_12px_0_rgba(36,26,53,0.09)] sm:hover:rotate-0">
              <span className="absolute -top-3 left-1/2 h-6 w-24 -translate-x-1/2 -rotate-2 bg-marker/55" aria-hidden />
              <div className="flex items-start justify-between border-b border-ink/15 pb-4">
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-purple-700">Sample match</p>
                  <h2 className="mt-2 max-w-48 font-serif text-xl font-medium leading-tight sm:max-w-none sm:text-2xl">Calculus II Workroom</h2>
                </div>
                <span className="border border-purple-700/50 px-2 py-1 font-mono text-[9px] uppercase tracking-widest text-purple-700">Open</span>
              </div>
              <dl className="py-3">
                {[
                  [CalendarDays, "Meets", "Tue & Thu · 7:00 PM"],
                  [MapPin, "Where", "Library · Room 204"],
                  [Users, "Roster", "5 of 8 students"],
                  [Clock3, "Rhythm", "Twice a week"],
                ].map(([Icon, key, value]) => {
                  const ItemIcon = Icon as typeof CalendarDays;
                  return (
                    <div key={key as string} className="grid grid-cols-[18px_58px_1fr] items-center border-b border-dashed border-ink/15 py-3 text-xs min-[390px]:grid-cols-[20px_68px_1fr] min-[390px]:text-sm sm:grid-cols-[20px_72px_1fr]">
                      <ItemIcon className="h-4 w-4 text-purple-700" />
                      <dt className="font-mono text-[9px] uppercase tracking-[0.14em] text-ink-soft">{key as string}</dt>
                      <dd className="text-right text-ink">{value as string}</dd>
                    </div>
                  );
                })}
              </dl>
              <p className="mt-3 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.14em] text-ink-soft">
                <Sparkles className="h-3.5 w-3.5 text-amber-700" /> Looks like a strong fit
              </p>
            </article>
          </div>
        </div>
      </section>

      <section className="px-5 py-16 sm:px-6 sm:py-24">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 grid gap-5 sm:mb-14 sm:gap-6 md:grid-cols-2 md:items-end">
            <div>
              <Eyebrow>§ 01 · The route</Eyebrow>
              <h2 className="mt-4 font-serif text-[2.35rem] font-medium leading-[1.05] sm:text-5xl">Three moves. One better habit.</h2>
            </div>
            <p className="max-w-md text-base leading-relaxed text-ink-soft sm:text-lg md:justify-self-end">No feeds to maintain and no complicated setup. Synesis helps you get from search to study session with as little friction as possible.</p>
          </div>

          <ol className="relative border-t border-ink/20 before:absolute before:bottom-8 before:left-[1.1rem] before:top-8 before:w-px before:bg-purple-700/20 sm:before:hidden">
            {steps.map((step, index) => (
              <li key={step.number} className="group relative grid gap-4 border-b border-ink/20 py-8 pl-14 sm:gap-6 sm:py-10 sm:pl-0 md:grid-cols-[90px_1fr_1fr] md:items-start md:py-12">
                <div className="absolute left-0 top-8 flex h-9 w-9 items-center justify-center border border-purple-700/35 bg-paper sm:static sm:h-auto sm:w-auto sm:justify-start sm:border-0 sm:bg-transparent md:block">
                  <span className="font-mono text-[10px] tracking-[0.14em] text-purple-700 sm:text-xs sm:tracking-[0.2em]">/{step.number}</span>
                  <step.icon className="hidden h-8 w-8 text-ink sm:ml-4 sm:block md:ml-0 md:mt-7 md:h-10 md:w-10" strokeWidth={1.35} />
                </div>
                <div>
                  <p className="mb-3 font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-ink-soft">{step.kicker}</p>
                  <h3 className="max-w-lg font-serif text-[1.65rem] font-medium leading-[1.08] transition-colors group-hover:text-purple-700 sm:text-3xl">{step.title}</h3>
                </div>
                <div>
                  <p className="leading-relaxed text-ink-soft">{step.description}</p>
                  <p className="mt-5 inline-block -rotate-1 bg-marker/35 px-2 py-1 font-mono text-[10px] tracking-wide text-ink">{step.note}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="border-y border-ink/15 bg-paper-deep px-5 py-16 sm:px-6 sm:py-24">
        <div className="mx-auto max-w-6xl">
          <Eyebrow>§ 02 · Inside the toolkit</Eyebrow>
          <div className="mt-5 grid gap-10 lg:grid-cols-[0.75fr_1.25fr]">
            <div>
              <h2 className="font-serif text-[2.35rem] font-medium leading-[1.05] sm:text-5xl">Just enough structure to get everyone in the room.</h2>
              <p className="mt-6 max-w-md leading-relaxed text-ink-soft">Synesis handles discovery and coordination. Your group keeps ownership of how, where, and what you study.</p>
            </div>
            <div className="grid grid-cols-2 border-l border-t border-ink/20">
              {tools.map((tool, index) => (
                <article key={tool.label} className="group min-h-48 border-b border-r border-ink/20 bg-paper p-4 transition-colors hover:bg-[#fffcf5] min-[390px]:p-5 sm:min-h-52 sm:p-7">
                  <div className="flex items-start justify-between">
                    <tool.icon className="h-7 w-7 text-purple-700 transition-transform group-hover:-rotate-6" strokeWidth={1.5} />
                    <span className="font-mono text-[9px] tracking-[0.18em] text-ink-soft/60">0{index + 1}</span>
                  </div>
                  <h3 className="mt-6 font-serif text-lg font-medium leading-tight sm:mt-8 sm:text-xl">{tool.label}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-ink-soft">{tool.copy}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="px-5 py-16 sm:px-6 sm:py-24">
        <div className="mx-auto grid max-w-6xl gap-14 lg:grid-cols-2 lg:gap-24">
          <div>
            <Eyebrow>§ 03 · Why the group helps</Eyebrow>
            <h2 className="mt-4 font-serif text-[2.35rem] font-medium leading-[1.05] sm:text-5xl">Learning gets stronger when it leaves your notebook.</h2>
            <p className="mt-6 text-lg leading-relaxed text-ink-soft">A useful study group is not four people silently doing homework. It is a place to retrieve, explain, challenge, and refine what you know.</p>
          </div>
          <ul className="space-y-0 border-t border-ink/20">
            {principles.map(([title, copy]) => (
              <li key={title} className="grid grid-cols-[28px_1fr] gap-4 border-b border-ink/20 py-6">
                <Check className="mt-1 h-4 w-4 text-purple-700" />
                <div><h3 className="font-serif text-xl font-medium">{title}</h3><p className="mt-2 text-sm leading-relaxed text-ink-soft">{copy}</p></div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="border-t border-ink/15 px-5 py-16 sm:px-6 sm:py-24">
        <div className="mx-auto max-w-4xl">
          <div className="text-center">
            <div className="justify-center"><Eyebrow>§ 04 · Field notes</Eyebrow></div>
            <h2 className="mt-4 font-serif text-[2.35rem] font-medium leading-[1.05] sm:text-5xl">Questions before you join?</h2>
          </div>
          <div className="mt-12 border-t border-ink/20">
            {faqs.map(([question, answer], index) => (
              <details key={question} className="group border-b border-ink/20">
                <summary className="flex min-h-16 cursor-pointer list-none items-center gap-3 py-5 text-left sm:gap-5 sm:py-6 [&::-webkit-details-marker]:hidden">
                  <span className="font-mono text-[10px] tracking-[0.16em] text-purple-700">0{index + 1}</span>
                  <h3 className="flex-1 font-serif text-lg font-medium leading-tight sm:text-2xl">{question}</h3>
                  <ChevronDown className="h-5 w-5 text-ink-soft transition-transform group-open:rotate-180" />
                </summary>
                <p className="max-w-2xl pb-6 pl-8 text-sm leading-relaxed text-ink-soft sm:pb-7 sm:pl-12 sm:text-base">{answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-ink px-5 pb-24 pt-16 text-paper sm:px-6 sm:py-24">
        <div className="bg-grid-paper absolute inset-0 opacity-[0.08]" aria-hidden />
        <div className="relative mx-auto grid max-w-6xl gap-10 md:grid-cols-[1fr_auto] md:items-end">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-purple-300">Your next session starts here</p>
            <h2 className="mt-5 max-w-3xl font-serif text-[2.45rem] font-medium leading-[1.05] text-paper! sm:text-6xl">Find the people who make the hard chapter feel possible.</h2>
          </div>
          <div className="grid grid-cols-1 gap-3 min-[390px]:grid-cols-2 sm:flex sm:flex-row md:flex-col">
            <Button size="lg" asChild className="group h-12 w-full bg-paper px-5 text-ink shadow-[4px_4px_0_#7c3aed] hover:bg-white sm:w-auto sm:px-7">
              <Link href="/groups">Browse groups <ArrowRight className="transition-transform group-hover:translate-x-1" /></Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="h-12 w-full border-paper/50 px-5 text-ink hover:bg-paper hover:text-ink sm:w-auto sm:px-7">
              <Link href="/signup">Create free account</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
