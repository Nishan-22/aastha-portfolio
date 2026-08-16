export interface CtaLink {
  label: string;
  href: string;
}

export interface Stat {
  value: string;
  label: string;
}

export interface Profile {
  name: string;
  role: string;
  tagline: string;
  email: string;
  phone: string;
  location: string;
  socials: { linkedin: string; github: string };
  monogram: string;
}

export interface NavItem {
  label: string;
  href: string;
}

export interface HeroDetailCard {
  title: string;
  meta: string;
}

export interface HeroContent {
  contextLeft: string;
  badge: string;
  eyebrow: string;
  headline: string;
  primaryCta: CtaLink;
  secondaryCta: CtaLink;
  stats: Stat[];
  verticalIndicator: string[];
  detailCard: HeroDetailCard;
}

export interface AboutContent {
  eyebrowIndex: string;
  eyebrowLabel: string;
  heading: string;
  highlight: string;
  supporting: string;
  detail: string;
  stats: Stat[];
}

export type ServiceVisualType =
  | "steel"
  | "concrete"
  | "seismic"
  | "foundations"
  | "bridge"
  | "construction";

export interface ServiceItem {
  title: string;
  description: string;
  tags: string[];
  visual: ServiceVisualType;
}

export interface ServicesContent {
  eyebrowIndex: string;
  eyebrowLabel: string;
  heading: string;
  highlight: string;
  items: ServiceItem[];
}

export type ProjectDrawingType = "truss" | "tower" | "arch" | "portal";

export interface ProjectItem {
  title: string;
  location: string;
  year: string;
  type: string;
  description: string;
  metrics: string[];
  drawing: ProjectDrawingType;
  images: string[];
  video: string;
  pdf: string;
}

export interface ProjectsContent {
  eyebrowIndex: string;
  eyebrowLabel: string;
  heading: string;
  highlight: string;
  items: ProjectItem[];
}

export interface ExperienceItem {
  role: string;
  org: string;
  period: string;
  points: string[];
}

export interface EducationItem {
  degree: string;
  school: string;
  note: string;
}

export interface ExperienceContent {
  eyebrowIndex: string;
  eyebrowLabel: string;
  heading: string;
  highlight: string;
  intro: string;
  items: ExperienceItem[];
  educationHeading: string;
  licensesHeading: string;
  education: EducationItem[];
  licenses: string[];
  software: string[];
}

export interface CtaContent {
  eyebrow: string;
  heading: string;
  highlight: string;
  text: string;
  primaryCta: CtaLink;
  secondaryCta: CtaLink;
}

export interface ContactFormContent {
  namePlaceholder: string;
  emailPlaceholder: string;
  projectPlaceholder: string;
  messagePlaceholder: string;
  submitLabel: string;
  sendingLabel: string;
}

export interface ContactContent {
  eyebrowIndex: string;
  eyebrowLabel: string;
  heading: string;
  highlight: string;
  emailLabel: string;
  phoneLabel: string;
  basedInLabel: string;
  socials: CtaLink[];
  form: ContactFormContent;
}

export interface FooterContent {
  monogram: string;
  tagline: string;
}

export interface SiteContent {
  profile: Profile;
  nav: NavItem[];
  hero: HeroContent;
  about: AboutContent;
  services: ServicesContent;
  projects: ProjectsContent;
  experience: ExperienceContent;
  cta: CtaContent;
  contact: ContactContent;
  footer: FooterContent;
}