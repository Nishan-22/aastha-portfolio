import {
  Area,
  EditorBlock,
  Field,
  FileUpload,
  ItemCard,
  LinkFields,
  PhotoList,
  StatFields,
  StringList,
  Text,
} from "./ui";
import type {
  AboutContent,
  ContactContent,
  CtaContent,
  ExperienceContent,
  FooterContent,
  HeroContent,
  NavItem,
  Profile,
  ProjectItem,
  ProjectsContent,
  ServiceItem,
  ServicesContent,
  SiteContent,
} from "@/lib/contentTypes";

export type UpdateFn = <K extends keyof SiteContent>(key: K, value: SiteContent[K]) => void;

export function ProfileEditor({
  value,
  onChange,
}: {
  value: Profile;
  onChange: (value: Profile) => void;
}) {
  return (
    <EditorBlock title="Personal information" description="Your name, contact details, and branding.">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Full name">
          <Text value={value.name} onChange={(name) => onChange({ ...value, name })} />
        </Field>
        <Field label="Job title">
          <Text value={value.role} onChange={(role) => onChange({ ...value, role })} />
        </Field>
      </div>
      <Field label="Short intro" hint="One or two sentences shown at the top of the page">
        <Area value={value.tagline} onChange={(tagline) => onChange({ ...value, tagline })} />
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Email">
          <Text value={value.email} onChange={(email) => onChange({ ...value, email })} />
        </Field>
        <Field label="Phone">
          <Text value={value.phone} onChange={(phone) => onChange({ ...value, phone })} />
        </Field>
      </div>
      <Field label="Location">
        <Text value={value.location} onChange={(location) => onChange({ ...value, location })} />
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="LinkedIn URL">
          <Text
            value={value.socials.linkedin}
            onChange={(linkedin) => onChange({ ...value, socials: { ...value.socials, linkedin } })}
          />
        </Field>
        <Field label="GitHub URL">
          <Text
            value={value.socials.github}
            onChange={(github) => onChange({ ...value, socials: { ...value.socials, github } })}
          />
        </Field>
      </div>
      <Field label="Logo text" hint="Two letters shown in the logo badge, e.g. AD">
        <Text value={value.monogram} onChange={(monogram) => onChange({ ...value, monogram })} />
      </Field>
    </EditorBlock>
  );
}

export function NavEditor({
  value,
  onChange,
}: {
  value: NavItem[];
  onChange: (value: NavItem[]) => void;
}) {
  return (
    <EditorBlock title="Menu links" description="Links shown at the top of the site.">
      {value.map((item, i) => (
        <ItemCard
          key={i}
          title={`Link ${i + 1}`}
          onRemove={() => onChange(value.filter((_, idx) => idx !== i))}
        >
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Name shown">
              <Text
                value={item.label}
                onChange={(label) =>
                  onChange(value.map((v, idx) => (idx === i ? { ...v, label } : v)))
                }
              />
            </Field>
            <Field label="Section it links to">
              <Text
                value={item.href}
                onChange={(href) =>
                  onChange(value.map((v, idx) => (idx === i ? { ...v, href } : v)))
                }
              />
            </Field>
          </div>
        </ItemCard>
      ))}
      <button
        type="button"
        onClick={() => onChange([...value, { label: "", href: "" }])}
        className="rounded-lg border border-dashed border-line px-3 py-1.5 text-xs text-muted transition-colors hover:border-accent hover:text-accent"
      >
        + Add link
      </button>
    </EditorBlock>
  );
}

export function HeroEditor({
  value,
  onChange,
}: {
  value: HeroContent;
  onChange: (value: HeroContent) => void;
}) {
  return (
    <EditorBlock title="Main banner" description="The big headline people see first.">
      <Field label="Headline" hint="Your name or a short headline">
        <Text value={value.headline} onChange={(headline) => onChange({ ...value, headline })} />
      </Field>
      <Field label="Status badge" hint="A small label, e.g. Open to work">
        <Text value={value.badge} onChange={(badge) => onChange({ ...value, badge })} />
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Field label="Primary button">
            <LinkFields
              value={value.primaryCta}
              onChange={(primaryCta) => onChange({ ...value, primaryCta })}
            />
          </Field>
        </div>
        <div>
          <Field label="Secondary button">
            <LinkFields
              value={value.secondaryCta}
              onChange={(secondaryCta) => onChange({ ...value, secondaryCta })}
            />
          </Field>
        </div>
      </div>
      <Field label="Statistics" hint="Numbers shown near the top, e.g. 8+ years">
        <div className="space-y-3">
          {value.stats.map((s, i) => (
            <ItemCard
              key={i}
              title={`Number ${i + 1}`}
              onRemove={() => onChange({ ...value, stats: value.stats.filter((_, idx) => idx !== i) })}
            >
              <StatFields
                value={s}
                onChange={(next) =>
                  onChange({ ...value, stats: value.stats.map((v, idx) => (idx === i ? next : v)) })
                }
              />
            </ItemCard>
          ))}
          <button
            type="button"
            onClick={() => onChange({ ...value, stats: [...value.stats, { value: "", label: "" }] })}
            className="rounded-lg border border-dashed border-line px-3 py-1.5 text-xs text-muted transition-colors hover:border-accent hover:text-accent"
          >
            + Add number
          </button>
        </div>
      </Field>
    </EditorBlock>
  );
}

export function AboutEditor({
  value,
  onChange,
}: {
  value: AboutContent;
  onChange: (value: AboutContent) => void;
}) {
  return (
    <EditorBlock title="About" description="What you write in the About section.">
      <Field label="Heading" hint="Use \n to start a new line">
        <Area value={value.heading} onChange={(heading) => onChange({ ...value, heading })} />
      </Field>
      <Field label="First paragraph">
        <Area value={value.supporting} onChange={(supporting) => onChange({ ...value, supporting })} />
      </Field>
      <Field label="Second paragraph">
        <Area value={value.detail} onChange={(detail) => onChange({ ...value, detail })} />
      </Field>
      <Field label="Key numbers" hint="e.g. years of experience, projects completed">
        <div className="space-y-3">
          {value.stats.map((s, i) => (
            <ItemCard
              key={i}
              title={`Number ${i + 1}`}
              onRemove={() => onChange({ ...value, stats: value.stats.filter((_, idx) => idx !== i) })}
            >
              <StatFields
                value={s}
                onChange={(next) =>
                  onChange({ ...value, stats: value.stats.map((v, idx) => (idx === i ? next : v)) })
                }
              />
            </ItemCard>
          ))}
          <button
            type="button"
            onClick={() => onChange({ ...value, stats: [...value.stats, { value: "", label: "" }] })}
            className="rounded-lg border border-dashed border-line px-3 py-1.5 text-xs text-muted transition-colors hover:border-accent hover:text-accent"
          >
            + Add number
          </button>
        </div>
      </Field>
    </EditorBlock>
  );
}

function ServiceEditor({
  value,
  onChange,
}: {
  value: ServiceItem[];
  onChange: (value: ServiceItem[]) => void;
}) {
  return (
    <div className="space-y-3">
      {value.map((item, i) => (
        <ItemCard
          key={i}
          title={`Skill ${i + 1}`}
          onRemove={() => onChange(value.filter((_, idx) => idx !== i))}
        >
          <Field label="Name">
            <Text
              value={item.title}
              onChange={(title) => onChange(value.map((v, idx) => (idx === i ? { ...v, title } : v)))}
            />
          </Field>
          <Field label="Description">
            <Area
              value={item.description}
              onChange={(description) =>
                onChange(value.map((v, idx) => (idx === i ? { ...v, description } : v)))
              }
            />
          </Field>
          <Field label="Related tags" hint="Small labels, e.g. AISC 360, Seismic">
            <StringList
              value={item.tags}
              onChange={(tags) => onChange(value.map((v, idx) => (idx === i ? { ...v, tags } : v)))}
            />
          </Field>
        </ItemCard>
      ))}
      <button
        type="button"
        onClick={() =>
          onChange([
            ...value,
            { title: "", description: "", visual: "steel", tags: [] },
          ])
        }
        className="rounded-lg border border-dashed border-line px-3 py-1.5 text-xs text-muted transition-colors hover:border-accent hover:text-accent"
      >
        + Add skill
      </button>
    </div>
  );
}

export function ServicesEditor({
  value,
  onChange,
}: {
  value: ServicesContent;
  onChange: (value: ServicesContent) => void;
}) {
  return (
    <EditorBlock title="Skills & expertise" description="The areas you specialize in.">
      <Field label="Heading" hint="Use \n to start a new line">
        <Area value={value.heading} onChange={(heading) => onChange({ ...value, heading })} />
      </Field>
      <ServiceEditor
        value={value.items}
        onChange={(items) => onChange({ ...value, items })}
      />
    </EditorBlock>
  );
}

function ProjectListEditor({
  value,
  onChange,
  token,
}: {
  value: ProjectItem[];
  onChange: (value: ProjectItem[]) => void;
  token: string;
}) {
  return (
    <div className="space-y-3">
      {value.map((item, i) => (
        <ItemCard
          key={i}
          title={`Project ${i + 1}`}
          onRemove={() => onChange(value.filter((_, idx) => idx !== i))}
        >
          <Field label="Project name">
            <Text
              value={item.title}
              onChange={(title) => onChange(value.map((v, idx) => (idx === i ? { ...v, title } : v)))}
            />
          </Field>
          <div className="grid gap-3 sm:grid-cols-3">
            <Field label="Location">
              <Text
                value={item.location}
                onChange={(location) => onChange(value.map((v, idx) => (idx === i ? { ...v, location } : v)))}
              />
            </Field>
            <Field label="Year">
              <Text
                value={item.year}
                onChange={(year) => onChange(value.map((v, idx) => (idx === i ? { ...v, year } : v)))}
              />
            </Field>
            <Field label="Type">
              <Text
                value={item.type}
                onChange={(type) => onChange(value.map((v, idx) => (idx === i ? { ...v, type } : v)))}
              />
            </Field>
          </div>
          <Field label="Description">
            <Area
              value={item.description}
              onChange={(description) =>
                onChange(value.map((v, idx) => (idx === i ? { ...v, description } : v)))
              }
            />
          </Field>
          <Field label="Highlights" hint="Short facts about the project, e.g. 240 ft span">
            <StringList
              value={item.metrics}
              onChange={(metrics) => onChange(value.map((v, idx) => (idx === i ? { ...v, metrics } : v)))}
            />
          </Field>
          <Field label="Photos" hint="Add photos from your computer. First photo is the main one.">
            <PhotoList
              token={token}
              value={item.images}
              onChange={(images) => onChange(value.map((v, idx) => (idx === i ? { ...v, images } : v)))}
            />
          </Field>
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Video" hint="Add a video from your computer, or paste a link">
              <FileUpload
                token={token}
                kind="video"
                value={item.video}
                onChange={(video) => onChange(value.map((v, idx) => (idx === i ? { ...v, video } : v)))}
              />
            </Field>
            <Field label="PDF" hint="Add a PDF from your computer, or paste a link">
              <FileUpload
                token={token}
                kind="pdf"
                value={item.pdf}
                onChange={(pdf) => onChange(value.map((v, idx) => (idx === i ? { ...v, pdf } : v)))}
              />
            </Field>
          </div>
        </ItemCard>
      ))}
      <button
        type="button"
        onClick={() =>
          onChange([
            ...value,
            {
              title: "",
              location: "",
              year: "",
              type: "",
              description: "",
              metrics: [],
              drawing: "truss",
              images: [],
              video: "",
              pdf: "",
            },
          ])
        }
        className="rounded-lg border border-dashed border-line px-3 py-1.5 text-xs text-muted transition-colors hover:border-accent hover:text-accent"
      >
        + Add project
      </button>
    </div>
  );
}

export function ProjectsEditor({
  value,
  onChange,
  token,
}: {
  value: ProjectsContent;
  onChange: (value: ProjectsContent) => void;
  token: string;
}) {
  return (
    <EditorBlock title="Projects" description="The work you want to showcase.">
      <Field label="Heading" hint="Use \n to start a new line">
        <Area value={value.heading} onChange={(heading) => onChange({ ...value, heading })} />
      </Field>
      <ProjectListEditor
        value={value.items}
        onChange={(items) => onChange({ ...value, items })}
        token={token}
      />
    </EditorBlock>
  );
}

export function ExperienceEditor({
  value,
  onChange,
}: {
  value: ExperienceContent;
  onChange: (value: ExperienceContent) => void;
}) {
  return (
    <EditorBlock title="Work experience" description="Your career history, education, and credentials.">
      <Field label="Intro text">
        <Area value={value.intro} onChange={(intro) => onChange({ ...value, intro })} />
      </Field>

      <div className="space-y-3">
        {value.items.map((job, i) => (
          <ItemCard
            key={i}
            title={`Position ${i + 1}`}
            onRemove={() => onChange({ ...value, items: value.items.filter((_, idx) => idx !== i) })}
          >
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Job title">
                <Text
                  value={job.role}
                  onChange={(role) =>
                    onChange({ ...value, items: value.items.map((v, idx) => (idx === i ? { ...v, role } : v)) })
                  }
                />
              </Field>
              <Field label="Company">
                <Text
                  value={job.org}
                  onChange={(org) =>
                    onChange({ ...value, items: value.items.map((v, idx) => (idx === i ? { ...v, org } : v)) })
                  }
                />
              </Field>
            </div>
            <Field label="Dates" hint="e.g. 2021 — Present">
              <Text
                value={job.period}
                onChange={(period) =>
                  onChange({ ...value, items: value.items.map((v, idx) => (idx === i ? { ...v, period } : v)) })
                }
              />
            </Field>
            <Field label="Responsibilities">
              <StringList
                value={job.points}
                onChange={(points) =>
                  onChange({ ...value, items: value.items.map((v, idx) => (idx === i ? { ...v, points } : v)) })
                }
              />
            </Field>
          </ItemCard>
        ))}
        <button
          type="button"
          onClick={() =>
            onChange({
              ...value,
              items: [...value.items, { role: "", org: "", period: "", points: [] }],
            })
          }
          className="rounded-lg border border-dashed border-line px-3 py-1.5 text-xs text-muted transition-colors hover:border-accent hover:text-accent"
        >
          + Add position
        </button>
      </div>

      <div className="space-y-3">
        {value.education.map((ed, i) => (
          <ItemCard
            key={i}
            title={`Education ${i + 1}`}
            onRemove={() => onChange({ ...value, education: value.education.filter((_, idx) => idx !== i) })}
          >
            <div className="grid gap-3 sm:grid-cols-3">
              <Field label="Degree">
                <Text
                  value={ed.degree}
                  onChange={(degree) =>
                    onChange({ ...value, education: value.education.map((v, idx) => (idx === i ? { ...v, degree } : v)) })
                  }
                />
              </Field>
              <Field label="School">
                <Text
                  value={ed.school}
                  onChange={(school) =>
                    onChange({ ...value, education: value.education.map((v, idx) => (idx === i ? { ...v, school } : v)) })
                  }
                />
              </Field>
              <Field label="Extra note">
                <Text
                  value={ed.note}
                  onChange={(note) =>
                    onChange({ ...value, education: value.education.map((v, idx) => (idx === i ? { ...v, note } : v)) })
                  }
                />
              </Field>
            </div>
          </ItemCard>
        ))}
        <button
          type="button"
          onClick={() =>
            onChange({
              ...value,
              education: [...value.education, { degree: "", school: "", note: "" }],
            })
          }
          className="rounded-lg border border-dashed border-line px-3 py-1.5 text-xs text-muted transition-colors hover:border-accent hover:text-accent"
        >
          + Add education
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Licenses / certifications">
          <StringList
            value={value.licenses}
            onChange={(licenses) => onChange({ ...value, licenses })}
          />
        </Field>
        <Field label="Software / tools">
          <StringList
            value={value.software}
            onChange={(software) => onChange({ ...value, software })}
          />
        </Field>
      </div>
    </EditorBlock>
  );
}

export function CtaEditor({
  value,
  onChange,
}: {
  value: CtaContent;
  onChange: (value: CtaContent) => void;
}) {
  return (
    <EditorBlock title="Call to action" description="The message shown just before the contact section.">
      <Field label="Small label">
        <Text value={value.eyebrow} onChange={(eyebrow) => onChange({ ...value, eyebrow })} />
      </Field>
      <Field label="Heading" hint="Use \n to start a new line">
        <Area value={value.heading} onChange={(heading) => onChange({ ...value, heading })} />
      </Field>
      <Field label="Text">
        <Area value={value.text} onChange={(text) => onChange({ ...value, text })} />
      </Field>
      <Field label="Primary button">
        <LinkFields value={value.primaryCta} onChange={(primaryCta) => onChange({ ...value, primaryCta })} />
      </Field>
      <Field label="Secondary button">
        <LinkFields value={value.secondaryCta} onChange={(secondaryCta) => onChange({ ...value, secondaryCta })} />
      </Field>
    </EditorBlock>
  );
}

export function ContactEditor({
  value,
  onChange,
}: {
  value: ContactContent;
  onChange: (value: ContactContent) => void;
}) {
  return (
    <EditorBlock title="Contact section" description="How visitors get in touch with you.">
      <Field label="Heading" hint="Use \n to start a new line">
        <Area value={value.heading} onChange={(heading) => onChange({ ...value, heading })} />
      </Field>
      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="Email label">
          <Text value={value.emailLabel} onChange={(emailLabel) => onChange({ ...value, emailLabel })} />
        </Field>
        <Field label="Phone label">
          <Text value={value.phoneLabel} onChange={(phoneLabel) => onChange({ ...value, phoneLabel })} />
        </Field>
        <Field label="Location label">
          <Text value={value.basedInLabel} onChange={(basedInLabel) => onChange({ ...value, basedInLabel })} />
        </Field>
      </div>

      <div className="space-y-3">
        {value.socials.map((s, i) => (
          <ItemCard
            key={i}
            title={`Social link ${i + 1}`}
            onRemove={() => onChange({ ...value, socials: value.socials.filter((_, idx) => idx !== i) })}
          >
            <LinkFields
              value={s}
              onChange={(next) =>
                onChange({ ...value, socials: value.socials.map((v, idx) => (idx === i ? next : v)) })
              }
            />
          </ItemCard>
        ))}
        <button
          type="button"
          onClick={() => onChange({ ...value, socials: [...value.socials, { label: "", href: "" }] })}
          className="rounded-lg border border-dashed border-line px-3 py-1.5 text-xs text-muted transition-colors hover:border-accent hover:text-accent"
        >
          + Add social link
        </button>
      </div>

      <Field label="Form placeholder texts" hint="Words shown inside the form fields">
        <div className="space-y-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Name field">
              <Text
                value={value.form.namePlaceholder}
                onChange={(namePlaceholder) =>
                  onChange({ ...value, form: { ...value.form, namePlaceholder } })
                }
              />
            </Field>
            <Field label="Email field">
              <Text
                value={value.form.emailPlaceholder}
                onChange={(emailPlaceholder) =>
                  onChange({ ...value, form: { ...value.form, emailPlaceholder } })
                }
              />
            </Field>
          </div>
          <Field label="Project type field">
            <Text
              value={value.form.projectPlaceholder}
              onChange={(projectPlaceholder) =>
                onChange({ ...value, form: { ...value.form, projectPlaceholder } })
              }
            />
          </Field>
          <Field label="Message field">
            <Text
              value={value.form.messagePlaceholder}
              onChange={(messagePlaceholder) =>
                onChange({ ...value, form: { ...value.form, messagePlaceholder } })
              }
            />
          </Field>
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Submit button text">
              <Text
                value={value.form.submitLabel}
                onChange={(submitLabel) => onChange({ ...value, form: { ...value.form, submitLabel } })}
              />
            </Field>
            <Field label="Sending button text">
              <Text
                value={value.form.sendingLabel}
                onChange={(sendingLabel) => onChange({ ...value, form: { ...value.form, sendingLabel } })}
              />
            </Field>
          </div>
        </div>
      </Field>
    </EditorBlock>
  );
}

export function FooterEditor({
  value,
  onChange,
}: {
  value: FooterContent;
  onChange: (value: FooterContent) => void;
}) {
  return (
    <EditorBlock title="Footer" description="The small strip at the bottom of the site.">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Logo text">
          <Text value={value.monogram} onChange={(monogram) => onChange({ ...value, monogram })} />
        </Field>
        <Field label="Tagline">
          <Text value={value.tagline} onChange={(tagline) => onChange({ ...value, tagline })} />
        </Field>
      </div>
    </EditorBlock>
  );
}