import Reveal from "@/components/Reveal";
import type { AboutContent } from "@/lib/contentTypes";

export default function About({ about }: { about: AboutContent | null }) {
  if (!about) return null;

  return (
    <section id="about" className="wrap py-16 sm:py-24">
      <Reveal>
        <p className="eyebrow">
          <span>01</span>
          About Me
        </p>
      </Reveal>

      <Reveal delay={80}>
        <div className="card mt-12 overflow-hidden">
          <div className="p-8 sm:p-12">
            <p className="text-lg font-medium leading-relaxed text-ink">
              {about.supporting}
            </p>
            {about.detail && (
              <p className="mt-5 text-base leading-relaxed text-muted">{about.detail}</p>
            )}
          </div>

          {about.stats.length > 0 && (
            <div className="grid grid-cols-2 gap-px border-t border-line bg-line md:grid-cols-4">
              {about.stats.map((s) => (
                <div key={s.label} className="bg-surface p-6 text-center">
                  <p className="text-2xl font-bold tracking-tight text-ink">{s.value}</p>
                  <p className="mt-1 text-sm text-muted">{s.label}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </Reveal>
    </section>
  );
}