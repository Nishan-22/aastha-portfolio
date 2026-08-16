"use client";

import { useState, type FormEvent } from "react";
import type { ContactFormContent } from "@/lib/contentTypes";
import { API_URL } from "@/lib/api";

type Status =
  | { kind: "idle" }
  | { kind: "loading" }
  | { kind: "success"; message: string }
  | { kind: "error"; message: string };

const inputClass =
  "w-full rounded-lg border border-line bg-background px-4 py-3 text-sm text-ink outline-none transition-colors placeholder:text-muted/70 focus:border-accent focus:ring-2 focus:ring-accent/10";

export default function ContactForm({ form }: { form: ContactFormContent }) {
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus({ kind: "loading" });

    const formEl = e.currentTarget;
    const data = new FormData(formEl);
    const body = {
      name: String(data.get("name") ?? ""),
      email: String(data.get("email") ?? ""),
      projectType: String(data.get("projectType") ?? ""),
      message: String(data.get("message") ?? ""),
    };

    try {
      const res = await fetch(`${API_URL}/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const result = await res.json();

      if (!res.ok) {
        const details = result.details
          ? Object.values(result.details).flat().join(" \u00b7 ")
          : result.error ?? "Something went wrong.";
        setStatus({ kind: "error", message: details });
        return;
      }

      setStatus({ kind: "success", message: result.message });
      formEl.reset();
    } catch {
      setStatus({
        kind: "error",
        message: "Could not reach the server. Is the backend running?",
      });
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <input
          name="name"
          type="text"
          placeholder={form.namePlaceholder}
          required
          minLength={2}
          className={inputClass}
        />
        <input
          name="email"
          type="email"
          placeholder={form.emailPlaceholder}
          required
          className={inputClass}
        />
      </div>
      <input
        name="projectType"
        type="text"
        placeholder={form.projectPlaceholder}
        className={inputClass}
      />
      <textarea
        name="message"
        rows={5}
        placeholder={form.messagePlaceholder}
        required
        minLength={10}
        className={`${inputClass} resize-none`}
      />
      <button
        type="submit"
        disabled={status.kind === "loading"}
        className="btn-primary w-full justify-center py-3.5 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {status.kind === "loading" ? form.sendingLabel : form.submitLabel}
        {status.kind !== "loading" && <span aria-hidden>\u2192</span>}
      </button>
      {status.kind === "success" && (
        <p className="rounded-lg border border-accent/30 bg-accent-muted px-4 py-3 text-sm text-accent">
          {status.message}
        </p>
      )}
      {status.kind === "error" && (
        <p className="rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-600">
          {status.message}
        </p>
      )}
    </form>
  );
}