import Reveal from "@/components/Reveal";
import type { CtaContent } from "@/lib/contentTypes";

export default function CTA({ cta }: { cta: CtaContent | null }) {
  if (!cta) return null;

  return (
    <section className="wrap py-8">
      <Reveal>
        <div className="card flex flex-col items-center px-8 py-20 text-center sm:py-24">
          <p className="eyebrow">{cta.eyebrow}</p>
          <h2 className="display-md mt-6 max-w-3xl whitespace-pre-line">{cta.heading}</h2>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-muted">{cta.text}</p>

          {(cta.primaryCta || cta.secondaryCta) && (
            <div className="mt-10 flex flex-wrap justify-center gap-3">
              {cta.primaryCta && (
                <a href={cta.primaryCta.href} className="btn-primary">
                  {cta.primaryCta.label}
                  <span aria-hidden>→</span>
                </a>
              )}
              {cta.secondaryCta && (
                <a href={cta.secondaryCta.href} className="btn-secondary">
                  {cta.secondaryCta.label}
                </a>
              )}
            </div>
          )}
        </div>
      </Reveal>
    </section>
  );
}