"use client";

import { useEffect, useState } from "react";
import type { NavItem, Profile } from "@/lib/contentTypes";

export default function Navbar({ nav, profile }: { nav: NavItem[]; profile: Profile | null }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const ids = nav.map((n) => n.href.replace(/^#/, "")).filter(Boolean);
    if (ids.length === 0) return;

    const sections = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el));

    const onScroll = () => {
      const pos = window.scrollY + 120;
      let current = "";
      for (const sec of sections) {
        if (sec.offsetTop <= pos) current = sec.id;
      }
      const bottom = document.documentElement.scrollHeight - window.innerHeight;
      if (window.scrollY >= bottom - 4 && sections.length > 0) {
        current = sections[sections.length - 1].id;
      }
      setActive(current);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [nav]);

  const monogram = profile?.monogram || "AD";
  const name = profile?.name || "";
  const email = profile?.email || "";

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled || open
          ? "border-b border-line bg-background/90 backdrop-blur-md"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <div className="wrap flex items-center justify-between py-4">
        <a href="#top" className="flex items-center gap-3" aria-label="Back to top">
          <span className="grid h-10 w-10 place-items-center rounded-lg bg-ink font-mono text-sm font-bold text-background">
            {monogram}
          </span>
          {name && (
            <span className="hidden font-semibold tracking-tight text-ink sm:inline">{name}</span>
          )}
        </a>

        <nav className="hidden items-center gap-8 md:flex">
          {nav.map((item) => {
            const target = item.href.replace(/^#/, "");
            const isActive = active === target;
            return (
              <a
                key={item.href}
                href={item.href}
                className={`text-sm font-medium transition-colors ${
                  isActive ? "text-ink" : "text-muted hover:text-ink"
                }`}
              >
                {item.label}
              </a>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          {email && (
            <a
              href={`mailto:${email}`}
              className="btn-primary hidden md:inline-flex"
            >
              Let&apos;s Talk
            </a>
          )}

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
            aria-expanded={open}
            className="grid h-10 w-10 place-items-center rounded-lg border border-line text-ink md:hidden"
          >
            <div className="flex flex-col gap-1.5">
              <span
                className={`block h-px w-4 bg-current transition-transform duration-300 ${
                  open ? "translate-y-[3.5px] rotate-45" : ""
                }`}
              />
              <span
                className={`block h-px w-4 bg-current transition-transform duration-300 ${
                  open ? "-translate-y-[3.5px] -rotate-45" : ""
                }`}
              />
            </div>
          </button>
        </div>
      </div>

      {open && (
        <nav className="border-t border-line bg-background px-6 pb-6 pt-4 md:hidden">
          <div className="flex flex-col gap-4">
            {nav.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="text-base font-medium text-ink transition-colors hover:text-accent"
              >
                {item.label}
              </a>
            ))}
            {email && (
              <a
                href={`mailto:${email}`}
                onClick={() => setOpen(false)}
                className="btn-primary mt-2 w-fit"
              >
                Let&apos;s Talk
              </a>
            )}
          </div>
        </nav>
      )}
    </header>
  );
}