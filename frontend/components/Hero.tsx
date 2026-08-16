import Image from "next/image";
import Counter from "@/components/Counter";
import type { HeroContent, Profile } from "@/lib/contentTypes";

export default function Hero({
  profile,
  hero,
}: {
  profile: Profile | null;
  hero: HeroContent | null;
}) {
  const badge = hero?.badge ?? "";
  const headline = hero?.headline ?? "";
  const role = profile?.role ?? "";
  const tagline = profile?.tagline ?? "";
  const location = profile?.location ?? "";
  const stats = hero?.stats ?? [];
  const primaryCta = hero?.primaryCta;
  const secondaryCta = hero?.secondaryCta;

  return (
    <section id="top" className="wrap pt-36 pb-20 sm:pt-40 sm:pb-28">
      <div className="grid items-center gap-12 lg:grid-cols-12">
        <div className="hero-in lg:col-span-7">
          {badge && (
            <span className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-4 py-1.5 text-xs font-medium text-muted">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              {badge}
            </span>
          )}
          <h1 className="display mt-6 text-ink">
            <span className="block">{headline}</span>
          </h1>
          <p className="mt-3 text-lg font-semibold text-ink-dim">{role}</p>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-muted">{tagline}</p>

          {(primaryCta || secondaryCta) && (
            <div className="mt-10 flex flex-wrap gap-3">
              {primaryCta && (
                <a href={primaryCta.href} className="btn-primary">
                  {primaryCta.label}
                  <span aria-hidden>→</span>
                </a>
              )}
              {secondaryCta && (
                <a href={secondaryCta.href} className="btn-secondary">
                  {secondaryCta.label}
                </a>
              )}
            </div>
          )}
        </div>

        <div className="hero-in-delay-1 lg:col-span-5">
          <div className="card relative mx-auto max-w-sm overflow-hidden lg:ml-auto">
            <div className="relative">
              <Image
                src="/profile.jpg"
                alt={headline}
                width={1080}
                height={1082}
                priority
                className="aspect-square w-full object-cover"
              />
              <div className="border-t border-line p-6">
                <p className="text-lg font-semibold text-ink">{headline}</p>
                <p className="mt-1 text-sm text-muted">{role}</p>
                {location && (
                  <p className="mt-4 flex items-center gap-2 border-t border-line pt-4 text-sm text-muted">
                    <span aria-hidden>📍</span>
                    {location}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {stats.length > 0 && (
        <div className="hero-in-delay-2 mt-20 grid grid-cols-2 gap-6 border-t border-line pt-10 md:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label}>
              <p className="text-3xl font-bold tracking-tight text-ink">
                <Counter value={s.value} />
              </p>
              <p className="mt-1 text-sm text-muted">{s.label}</p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}