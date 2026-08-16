"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import type { ProjectItem } from "@/lib/contentTypes";

export default function ProjectModal({
  project,
  onClose,
}: {
  project: ProjectItem;
  onClose: () => void;
}) {
  const [activeImage, setActiveImage] = useState(0);
  const hasImages = project.images.length > 0;
  const hasVideo = Boolean(project.video);
  const hasPdf = Boolean(project.pdf);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto bg-ink/60 p-4 backdrop-blur-sm sm:p-8"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={project.title}
    >
      <div
        className="card my-4 w-full max-w-4xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-line p-5 sm:p-6">
          <div>
            <h3 className="text-lg font-semibold tracking-tight text-ink">{project.title}</h3>
            <p className="mt-0.5 text-sm text-muted">
              {project.location} · {project.year} · {project.type}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-line text-ink transition-colors hover:border-ink"
          >
            ✕
          </button>
        </div>

        <div className="grid gap-6 p-5 sm:p-6 md:grid-cols-12">
          <div className="md:col-span-8">
            {hasImages && (
              <div className="overflow-hidden rounded-lg border border-line">
                <div className="relative aspect-[4/3] bg-background">
                  <Image
                    src={project.images[activeImage]}
                    alt={`${project.title} ${activeImage + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
                {project.images.length > 1 && (
                  <div className="flex items-center gap-2 border-t border-line bg-background p-3">
                    {project.images.map((img, i) => (
                      <button
                        key={img}
                        type="button"
                        onClick={() => setActiveImage(i)}
                        aria-label={`Image ${i + 1}`}
                        className={`relative aspect-square w-14 overflow-hidden rounded-md border transition-colors ${
                          activeImage === i
                            ? "border-ink"
                            : "border-line opacity-70 hover:opacity-100"
                        }`}
                      >
                        <Image
                          src={img}
                          alt=""
                          fill
                          className="object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {!hasImages && (
              <div className="flex aspect-[4/3] items-center justify-center rounded-lg border border-dashed border-line bg-background text-sm text-muted">
                No photos yet
              </div>
            )}

            {hasVideo && (
              <div className="mt-4 overflow-hidden rounded-lg border border-line bg-ink">
                <video
                  src={project.video}
                  controls
                  preload="metadata"
                  className="aspect-video w-full"
                />
              </div>
            )}
          </div>

          <div className="md:col-span-4">
            <p className="text-base leading-relaxed text-ink">{project.description}</p>
            {project.metrics.length > 0 && (
              <div className="mt-5 flex flex-wrap gap-2">
                {project.metrics.map((m) => (
                  <span
                    key={m}
                    className="rounded-full bg-accent-muted px-3 py-1 text-xs font-medium text-accent"
                  >
                    {m}
                  </span>
                ))}
              </div>
            )}

            {(hasVideo || hasPdf) && (
              <div className="mt-6 flex flex-col gap-3 border-t border-line pt-6">
                {hasVideo && (
                  <a
                    href={project.video}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary w-full justify-center"
                  >
                    Watch video
                    <span aria-hidden>▶</span>
                  </a>
                )}
                {hasPdf && (
                  <a
                    href={project.pdf}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-secondary w-full justify-center"
                  >
                    View PDF
                    <span aria-hidden>↓</span>
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}