import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";
import type { ExperienceContent } from "@/lib/contentTypes";

export default function Experience({ experience }: { experience: ExperienceContent | null }) {
  if (!experience) return null;

  return (
    <section id="experience" className="wrap py-16 sm:py-24">
      <Reveal>
        <SectionHeading index="04" label="Experience" title={experience.heading} />
      </Reveal>

      <Reveal delay={80}>
        <p className="mb-14 max-w-2xl text-base leading-relaxed text-muted">{experience.intro}</p>
      </Reveal>

      <div className="grid gap-16 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <div className="flex flex-col">
            {experience.items.map((job) => (
              <Reveal key={job.role} as="div">
                <div className="relative border-l border-line pl-8 pb-12 last:pb-0">
                  <span className="absolute -left-[5px] top-1.5 h-2.5 w-2.5 rounded-full bg-accent ring-4 ring-accent-muted" />
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <h3 className="text-lg font-semibold tracking-tight text-ink">{job.role}</h3>
                    <span className="font-mono text-xs text-muted">{job.period}</span>
                  </div>
                  <p className="mt-1 text-sm font-medium text-accent">{job.org}</p>
                  <ul className="mt-4 space-y-2.5">
                    {job.points.map((pt) => (
                      <li key={pt} className="flex gap-3 text-sm leading-relaxed text-muted">
                        <span className="mt-[9px] h-1 w-1 shrink-0 rounded-full bg-line-strong" />
                        {pt}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        <div className="lg:col-span-5">
          <Reveal delay={100}>
            <div className="card p-8">
              <h4 className="text-sm font-semibold uppercase tracking-wide text-ink">
                {experience.educationHeading}
              </h4>
              <div className="mt-6 flex flex-col gap-6">
                {experience.education.map((ed) => (
                  <div key={ed.degree} className="border-b border-line pb-6 last:border-0 last:pb-0">
                    <p className="font-semibold text-ink">{ed.degree}</p>
                    <p className="mt-1 text-sm text-muted">{ed.school}</p>
                    {ed.note && <p className="mt-0.5 text-xs text-muted">{ed.note}</p>}
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          <Reveal delay={160} className="mt-5">
            <div className="card p-8">
              <h4 className="text-sm font-semibold uppercase tracking-wide text-ink">
                {experience.licensesHeading}
              </h4>
              <div className="mt-5 flex flex-wrap gap-2">
                {experience.licenses.map((l) => (
                  <span key={l} className="rounded-full bg-accent-muted px-3 py-1.5 text-xs font-medium text-accent">
                    {l}
                  </span>
                ))}
              </div>
            </div>
          </Reveal>

          <Reveal delay={220} className="mt-5">
            <div className="card p-8">
              <h4 className="text-sm font-semibold uppercase tracking-wide text-ink">Software</h4>
              <div className="mt-5 flex flex-wrap gap-2">
                {experience.software.map((s) => (
                  <span key={s} className="rounded-md border border-line px-2.5 py-1.5 text-xs text-ink-dim">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}