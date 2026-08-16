import type { FooterContent, NavItem, Profile } from "@/lib/contentTypes";

export default function Footer({
  footer,
  nav,
  profile,
}: {
  footer: FooterContent | null;
  nav: NavItem[];
  profile: Profile | null;
}) {
  const monogram = footer?.monogram || "AD";
  const name = profile?.name || "";
  const tagline = footer?.tagline || "";

  return (
    <footer className="border-t border-line">
      <div className="wrap flex flex-col items-center justify-between gap-6 py-10 md:flex-row">
        <div className="flex items-center gap-3">
          <span className="grid h-8 w-8 place-items-center rounded-md bg-ink font-mono text-[11px] font-bold text-background">
            {monogram}
          </span>
          {name && <span className="text-sm text-muted">© {new Date().getFullYear()} {name}</span>}
        </div>

        {nav.length > 0 && (
          <nav className="flex flex-wrap items-center justify-center gap-7">
            {nav.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-sm text-muted transition-colors hover:text-ink"
              >
                {item.label}
              </a>
            ))}
          </nav>
        )}

        {tagline && <p className="font-mono text-xs tracking-widest text-muted">{tagline}</p>}
      </div>
    </footer>
  );
}