"use client";

import { useState } from "react";
import ProjectModal from "@/components/ProjectModal";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";
import type { ProjectItem, ProjectsContent } from "@/lib/contentTypes";

export default function Projects({ projects }: { projects: ProjectsContent | null }) {
  const [selected, setSelected] = useState<ProjectItem | null>(null);

  if (!projects) return null;

  return (
    <section id="projects" className="wrap py-16 sm:py-24">
      <Reveal>
        <SectionHeading index="03" label="Projects" title={projects.heading} />
      </Reveal>

      <div className="flex flex-col gap-4">
        {projects.items.map((project, i) => (
          <Reveal key={project.title} delay={i * 60} as="article">
            <button
              type="button"
              onClick={() => setSelected(project)}
              className="card card-hover group grid w-full gap-6 p-7 text-left md:grid-cols-12 md:items-center"
            >
              <div className="md:col-span-1">
                <span className="font-mono text-sm text-accent">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>

              <div className="md:col-span-4">
                <h3 className="text-xl font-semibold tracking-tight text-ink">{project.title}</h3>
                <p className="mt-1 text-sm text-muted">
                  {project.location} · {project.year}
                </p>
              </div>

              <div className="md:col-span-5">
                <p className="text-sm leading-relaxed text-muted">{project.description}</p>
                <p className="mt-2 text-xs font-medium text-ink-dim">{project.type}</p>
              </div>

              <div className="md:col-span-2 md:text-right">
                <span className="inline-flex items-center gap-1.5 text-sm font-medium text-ink transition-colors group-hover:text-accent">
                  View project
                  <span aria-hidden className="transition-transform group-hover:translate-x-0.5">
                    →
                  </span>
                </span>
              </div>
            </button>
          </Reveal>
        ))}
      </div>

      {selected && <ProjectModal project={selected} onClose={() => setSelected(null)} />}
    </section>
  );
}