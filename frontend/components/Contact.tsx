import ContactForm from "@/components/ContactForm";
import Reveal from "@/components/Reveal";
import type { ContactContent, Profile } from "@/lib/contentTypes";

export default function Contact({
  profile,
  contact,
}: {
  profile: Profile | null;
  contact: ContactContent | null;
}) {
  if (!contact) return null;

  const email = profile?.email ?? "";
  const phone = profile?.phone ?? "";
  const location = profile?.location ?? "";

  return (
    <section id="contact" className="wrap py-16 sm:py-24">
      <Reveal>
        <p className="eyebrow">
          <span>05</span>
          Contact
        </p>
        <h2 className="display-md mt-5 max-w-3xl whitespace-pre-line">{contact.heading}</h2>
      </Reveal>

      <div className="mt-14 grid gap-10 lg:grid-cols-12">
        <Reveal delay={80} className="lg:col-span-5">
          <div className="flex flex-col gap-4">
            {email && (
              <a href={"mailto:" + email} className="card card-hover group flex items-center justify-between p-6">
                <div>
                  <p className="text-xs uppercase tracking-wide text-muted">{contact.emailLabel}</p>
                  <p className="mt-1 font-medium text-ink">{email}</p>
                </div>
                <span aria-hidden className="text-muted transition-colors group-hover:text-accent">
                  →
                </span>
              </a>
            )}
            {phone && (
              <a href={"tel:" + phone.replace(/[^+\d]/g, "")} className="card card-hover group flex items-center justify-between p-6">
                <div>
                  <p className="text-xs uppercase tracking-wide text-muted">{contact.phoneLabel}</p>
                  <p className="mt-1 font-medium text-ink">{phone}</p>
                </div>
                <span aria-hidden className="text-muted transition-colors group-hover:text-accent">→</span>
              </a>
            )}
            {location && (
              <div className="card flex items-center justify-between p-6">
                <div>
                  <p className="text-xs uppercase tracking-wide text-muted">{contact.basedInLabel}</p>
                  <p className="mt-1 font-medium text-ink">{location}</p>
                </div>
                <span className="h-2 w-2 rounded-full bg-accent" />
              </div>
            )}

            {contact.socials.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-3">
                {contact.socials.map((s) => (
                  <a
                    key={s.href}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-secondary"
                  >
                    {s.label}
                    <span aria-hidden>↗</span>
                  </a>
                ))}
              </div>
            )}
          </div>
        </Reveal>

        <Reveal delay={140} className="lg:col-span-7">
          <div className="card p-7 sm:p-10">
            <ContactForm form={contact.form} />
          </div>
        </Reveal>
      </div>
    </section>
  );
}