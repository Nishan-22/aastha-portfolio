import type { SiteContent } from "./contentTypes.js";

export const defaultContent: SiteContent = {
  profile: {
    name: "Aastha Dhungana",
    role: "Structural Engineer",
    tagline:
      "Steel, concrete, and seismic systems for towers, bridges, and infrastructure that stand the test of time.",
    email: "astha.dhunagana@engineer.com",
    phone: "+1 (503) 555-0148",
    location: "Portland, OR",
    socials: {
      linkedin: "https://www.linkedin.com/",
      github: "https://github.com/",
    },
    monogram: "AD",
  },
  nav: [
    { label: "About", href: "#about" },
    { label: "Expertise", href: "#expertise" },
    { label: "Projects", href: "#projects" },
    { label: "Experience", href: "#experience" },
    { label: "Contact", href: "#contact" },
  ],
  hero: {
    contextLeft: "PORTLAND, OR · 2026",
    badge: "OPEN TO PROJECTS",
    eyebrow: "Structural Engineer",
    headline: "Aastha Dhungana",
    primaryCta: { label: "View Projects", href: "#projects" },
    secondaryCta: { label: "Contact", href: "#contact" },
    stats: [
      { value: "8+", label: "years" },
      { value: "60+", label: "projects" },
      { value: "15M+", label: "ft²" },
      { value: "3", label: "licenses" },
    ],
    verticalIndicator: ["01", "02", "03"],
    detailCard: { title: "Willow Creek Footbridge", meta: "240 ft span · TMD" },
  },
  about: {
    eyebrowIndex: "01",
    eyebrowLabel: "About",
    heading:
      "I'm Aastha Dhungana — a structural engineer who designs the invisible skeleton of the built world.",
    highlight: "the invisible skeleton",
    supporting:
      "Eight years of experience across high-rises, long-span bridges, and seismic-critical infrastructure. My work lives where physics meets elegance — every beam, column, and connection has a reason to exist.",
    detail:
      "I specialize in steel moment frames, post-tensioned concrete, seismic isolation, and performance-based design, carrying projects from concept through construction support.",
    stats: [
      { value: "8+", label: "Years in practice" },
      { value: "60+", label: "Projects delivered" },
      { value: "15M+", label: "Sq ft engineered" },
      { value: "3", label: "States licensed" },
    ],
  },
  services: {
    eyebrowIndex: "02",
    eyebrowLabel: "Expertise",
    heading: "Six disciplines.\nOne standard of care.",
    highlight: "care.",
    items: [
      {
        title: "Steel Design",
        description:
          "Moment frames, trusses, and long-span structures analyzed and detailed per AISC 360.",
        visual: "steel",
        tags: ["AISC 360", "Moment frames", "Long-span"],
      },
      {
        title: "Concrete & PT",
        description:
          "Reinforced concrete, post-tensioning, and masonry systems per ACI 318.",
        visual: "concrete",
        tags: ["ACI 318", "Post-tension", "Masonry"],
      },
      {
        title: "Seismic Engineering",
        description:
          "Seismic isolation, bracing systems, and performance-based design for high-risk zones.",
        visual: "seismic",
        tags: ["Base isolation", "Pushover", "Zone D"],
      },
      {
        title: "Foundations",
        description:
          "Shallow and deep foundations, retaining walls, and soil–structure interaction.",
        visual: "foundations",
        tags: ["Drilled piers", "Mat slabs", "Retaining walls"],
      },
      {
        title: "Bridge Engineering",
        description:
          "Highway and pedestrian bridges engineered with AASHTO LRFD methodology.",
        visual: "bridge",
        tags: ["AASHTO LRFD", "Truss", "Tuned mass dampers"],
      },
      {
        title: "Construction Support",
        description:
          "Shop drawing review, RFI responses, and hands-on field engineering.",
        visual: "construction",
        tags: ["RFIs", "Shop drawings", "Field"],
      },
    ],
  },
  projects: {
    eyebrowIndex: "03",
    eyebrowLabel: "Selected Work",
    heading: "Built to last,\ndrawn to scale.",
    highlight: "scale.",
    items: [
      {
        title: "Cascade Transit Terminal",
        location: "Portland, OR",
        year: "2025",
        type: "Steel · Seismic",
        description:
          "60,000 sq ft long-span steel canopy with seismic isolation bearings over a live transit yard.",
        metrics: ["180 ft span", "W36 girders", "Base isolation"],
        drawing: "truss",
        images: [],
        video: "",
        pdf: "",
      },
      {
        title: "Meridian Medical Tower",
        location: "Seattle, WA",
        year: "2023",
        type: "Concrete · PT",
        description:
          "22-story post-tensioned concrete hospital tower designed for high-seismic Zone D.",
        metrics: ["22 stories", "PT slabs", "Zone D"],
        drawing: "tower",
        images: [],
        video: "",
        pdf: "",
      },
      {
        title: "Willow Creek Footbridge",
        location: "Bend, OR",
        year: "2022",
        type: "Steel · Bridge",
        description:
          "Sculptural 240 ft pedestrian truss bridge with tuned mass dampers.",
        metrics: ["240 ft span", "Truss", "TMD system"],
        drawing: "arch",
        images: [],
        video: "",
        pdf: "",
      },
      {
        title: "Northgate Logistics Hub",
        location: "Boise, ID",
        year: "2021",
        type: "Steel · Foundations",
        description:
          "1.1M sq ft distribution center with 40 ft racking loads and drilled-pier foundations.",
        metrics: ["1.1M sq ft", "Racking loads", "Drilled piers"],
        drawing: "portal",
        images: [],
        video: "",
        pdf: "",
      },
      {
        title: "Riverside Housing District",
        location: "Portland, OR",
        year: "2020",
        type: "Concrete · Seismic",
        description:
          "Mixed-use, five-building podium design with CLT upper levels and concrete podiums.",
        metrics: ["5 buildings", "CLT + concrete", "Podium"],
        drawing: "tower",
        images: [],
        video: "",
        pdf: "",
      },
      {
        title: "Cascade Pavilion Roof",
        location: "Eugene, OR",
        year: "2019",
        type: "Steel · Space Frame",
        description:
          "Floating space-frame roof over a civic amphitheater, 90 ft clear span.",
        metrics: ["90 ft span", "Space frame", "Cantilever"],
        drawing: "truss",
        images: [],
        video: "",
        pdf: "",
      },
    ],
  },
  experience: {
    eyebrowIndex: "04",
    eyebrowLabel: "Experience",
    heading: "A decade of\nload paths.",
    highlight: "load paths.",
    intro:
      "From boutique firms to global consultancies — the same discipline applied at every scale.",
    items: [
      {
        role: "Senior Structural Engineer",
        org: "Thornton Tomasetti",
        period: "2021 — Present",
        points: [
          "Lead structural design on $100M+ steel, concrete, and seismic projects.",
          "Manage a six-person engineering team and review all contract documents.",
        ],
      },
      {
        role: "Structural Engineer II",
        org: "KPFF Consulting Engineers",
        period: "2018 — 2021",
        points: [
          "Designed lateral systems for 15+ high-rise and mid-rise buildings.",
          "Performed nonlinear pushover analyses with Perform-3D and ETABS.",
        ],
      },
      {
        role: "Structural Engineer I",
        org: "Magnusson Klemencic Associates",
        period: "2016 — 2018",
        points: [
          "Produced construction documents for concrete high-rises.",
          "Coordinated with general contractors during construction.",
        ],
      },
    ],
    educationHeading: "EDUCATION",
    licensesHeading: "LICENSES & TOOLS",
    education: [
      {
        degree: "M.S. Structural Engineering",
        school: "UC Berkeley",
        note: "Earthquake engineering",
      },
      {
        degree: "B.S. Civil Engineering",
        school: "Purdue University",
        note: "Magna cum laude",
      },
    ],
    licenses: ["PE — Oregon", "SE — California", "LEED AP"],
    software: [
      "ETABS",
      "SAP2000",
      "RAM",
      "Perform-3D",
      "OpenSees",
      "Revit",
      "AutoCAD",
      "Rhino + GH",
      "Python",
      "MATLAB",
      "MicroStation",
    ],
  },
  cta: {
    eyebrow: "Let's build it right",
    heading: "Have a structure\nin mind?",
    highlight: "in mind?",
    text: "High-rise, bridge, or seismic retrofit — I'll respond within one business day.",
    primaryCta: { label: "Contact Me", href: "#contact" },
    secondaryCta: { label: "Revisit the Work", href: "#projects" },
  },
  contact: {
    eyebrowIndex: "05",
    eyebrowLabel: "Contact",
    heading: "Start a\nconversation.",
    highlight: "conversation.",
    emailLabel: "EMAIL",
    phoneLabel: "PHONE",
    basedInLabel: "BASED IN",
    socials: [
      { label: "LinkedIn", href: "https://www.linkedin.com/" },
      { label: "GitHub", href: "https://github.com/" },
    ],
    form: {
      namePlaceholder: "Name",
      emailPlaceholder: "Email",
      projectPlaceholder: "Project type (steel, concrete, seismic…)",
      messagePlaceholder: "Tell me about your project…",
      submitLabel: "Send Message",
      sendingLabel: "Sending...",
    },
  },
  footer: {
    monogram: "AD",
    tagline: "STEEL · CONCRETE · SEISMIC",
  },
};