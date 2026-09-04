import { useRef, useState, type ChangeEvent, type ReactNode } from "react";
import { API_URL, uploadFile } from "@/lib/api";

const inputClass =
  "w-full rounded-lg border border-line bg-white px-3 py-2 text-sm text-ink outline-none transition-colors placeholder:text-muted/60 focus:border-accent";

export function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1 flex items-baseline justify-between">
        <span className="text-sm font-medium text-ink">{label}</span>
        {hint && <span className="text-xs text-muted">{hint}</span>}
      </span>
      {children}
    </label>
  );
}

export function Text({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <input
      type="text"
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      className={inputClass}
    />
  );
}

function EyeIcon({ open }: { open: boolean }) {
  return open ? (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ) : (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c6.5 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
      <path d="M6.61 6.61A13.526 13.526 0 0 0 2 11s3.5 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
      <line x1="2" x2="22" y1="2" y2="22" />
    </svg>
  );
}

export function Password({
  value,
  onChange,
  placeholder,
  autoComplete,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  autoComplete?: string;
}) {
  const [visible, setVisible] = useState(false);
  return (
    <div className="relative">
      <input
        type={visible ? "text" : "password"}
        value={value}
        placeholder={placeholder}
        autoComplete={autoComplete}
        onChange={(e) => onChange(e.target.value)}
        className={`${inputClass} pr-10`}
      />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        aria-label={visible ? "Hide password" : "Show password"}
        className="absolute inset-y-0 right-0 flex w-10 items-center justify-center text-muted transition-colors hover:text-ink"
      >
        <EyeIcon open={visible} />
      </button>
    </div>
  );
}

export function Area({
  value,
  onChange,
  rows = 3,
  placeholder,
}: {
  value: string;
  onChange: (value: string) => void;
  rows?: number;
  placeholder?: string;
}) {
  return (
    <textarea
      value={value}
      rows={rows}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      className={`${inputClass} resize-y leading-relaxed`}
    />
  );
}

export function Select({
  value,
  options,
  onChange,
}: {
  value: string;
  options: string[];
  onChange: (value: string) => void;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={inputClass}
    >
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
  );
}

export function StringList({
  value,
  onChange,
}: {
  value: string[];
  onChange: (value: string[]) => void;
}) {
  return (
    <div className="space-y-2">
      {value.map((item, i) => (
        <div key={i} className="flex gap-2">
          <input
            type="text"
            value={item}
            onChange={(e) =>
              onChange(value.map((v, idx) => (idx === i ? e.target.value : v)))
            }
            className={inputClass}
          />
          <button
            type="button"
            onClick={() => onChange(value.filter((_, idx) => idx !== i))}
            className="shrink-0 rounded-lg border border-line px-3 text-sm text-muted transition-colors hover:border-red-300 hover:text-red-500"
          >
            ×
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() => onChange([...value, ""])}
        className="rounded-lg border border-dashed border-line px-3 py-1.5 text-xs text-muted transition-colors hover:border-accent hover:text-accent"
      >
        + Add item
      </button>
    </div>
  );
}

export function ItemCard({
  title,
  onRemove,
  children,
}: {
  title: string;
  onRemove: () => void;
  children: ReactNode;
}) {
  return (
    <div className="rounded-xl border border-line bg-background p-4">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-sm font-semibold text-ink">{title}</span>
        <button
          type="button"
          onClick={onRemove}
          className="rounded-md border border-line px-2.5 py-1 text-xs text-muted transition-colors hover:border-red-300 hover:text-red-500"
        >
          Remove
        </button>
      </div>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

export function EditorBlock({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-line bg-white p-6">
      <header className="mb-5">
        <h2 className="text-lg font-bold tracking-tight text-ink">{title}</h2>
        {description && <p className="mt-1 text-sm text-muted">{description}</p>}
      </header>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

export function LinkFields({
  value,
  onChange,
}: {
  value: { label: string; href: string };
  onChange: (value: { label: string; href: string }) => void;
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <Field label="Label">
        <Text
          value={value.label}
          onChange={(label) => onChange({ ...value, label })}
        />
      </Field>
      <Field label="Href">
        <Text
          value={value.href}
          onChange={(href) => onChange({ ...value, href })}
        />
      </Field>
    </div>
  );
}

export function StatFields({
  value,
  onChange,
}: {
  value: { value: string; label: string };
  onChange: (value: { value: string; label: string }) => void;
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <Field label="Value">
        <Text
          value={value.value}
          onChange={(v) => onChange({ ...value, value: v })}
        />
      </Field>
      <Field label="Label">
        <Text
          value={value.label}
          onChange={(label) => onChange({ ...value, label })}
        />
      </Field>
    </div>
  );
}

const ACCEPT: Record<string, string> = {
  image: "image/jpeg,image/png,image/webp,image/gif",
  video: "video/mp4,video/webm",
  pdf: "application/pdf",
};

export function PhotoList({
  token,
  value,
  onChange,
}: {
  token: string;
  value: string[];
  onChange: (value: string[]) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const handleFile = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setUploading(true);
    setError("");
    try {
      const url = await uploadFile(token, file);
      onChange([...value, url.startsWith("http") ? url : `${API_URL}${url}`]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {value.map((url, i) => (
          <div key={i} className="group relative aspect-video overflow-hidden rounded-lg border border-line bg-background">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={url} alt={`photo ${i + 1}`} className="h-full w-full object-cover" />
            <button
              type="button"
              onClick={() => onChange(value.filter((_, idx) => idx !== i))}
              className="absolute right-1 top-1 rounded-md bg-black/60 px-1.5 py-0.5 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100"
            >
              ×
            </button>
          </div>
        ))}
      </div>
      <div className="flex items-center gap-2">
        <label className="cursor-pointer rounded-lg border border-accent/40 bg-accent/5 px-3 py-2 text-sm font-medium text-accent transition-colors hover:bg-accent/10">
          {uploading ? "Uploading…" : "+ Add photo"}
          <input
            type="file"
            accept={ACCEPT.image}
            onChange={handleFile}
            className="hidden"
          />
        </label>
        {error && <span className="text-xs text-red-500">{error}</span>}
      </div>
    </div>
  );
}

export function FileUpload({
  token,
  value,
  onChange,
  kind,
  label = "Choose file",
}: {
  token: string;
  value: string;
  onChange: (value: string) => void;
  kind: "image" | "video" | "pdf";
  label?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const handleFile = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setUploading(true);
    setError("");
    try {
      const url = await uploadFile(token, file);
      onChange(url.startsWith("http") ? url : `${API_URL}${url}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="rounded-lg border border-accent/40 bg-accent/5 px-3 py-2 text-sm font-medium text-accent transition-colors hover:bg-accent/10"
        >
          {uploading ? "Uploading…" : label}
        </button>
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPT[kind]}
          onChange={handleFile}
          className="hidden"
        />
        {value && (
          <>
            {kind === "image" ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={value}
                alt="preview"
                className="h-10 w-14 rounded-md border border-line object-cover"
              />
            ) : (
              <span className="truncate text-xs text-muted">{value.split("/").pop()}</span>
            )}
            <button
              type="button"
              onClick={() => onChange("")}
              className="shrink-0 rounded-md border border-line px-2 py-1 text-xs text-muted transition-colors hover:border-red-300 hover:text-red-500"
            >
              Remove
            </button>
          </>
        )}
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Or paste a URL here"
        className={inputClass}
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}