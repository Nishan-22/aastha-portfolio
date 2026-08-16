import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";
import type { ServicesContent } from "@/lib/contentTypes";

export default function Services({ services }: { services: ServicesContent | null }) {
  if (!services) return null;

  return (
    <section id="expertise" className="wrap py-16 sm:py-24">
      <Reveal>
        <SectionHeading index="02" label="Expertise" title={services.heading} />
      </Reveal>

      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {services.items.map((service, i) => (
          <Reveal key={service.title} delay={i * 70} as="article">
            <div className="card card-hover flex h-full flex-col p-7">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs text-accent">0{i + 1}</span>
                <span className="font-mono text-[10px] uppercase tracking-wider text-muted">
                  {service.visual}
                </span>
              </div>
              <h3 className="mt-6 text-lg font-semibold text-ink">{service.title}</h3>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-muted">{service.description}</p>
              {service.tags.length > 0 && (
                <div className="mt-6 flex flex-wrap gap-1.5">
                  {service.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-accent-muted px-2.5 py-1 text-xs text-accent"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}