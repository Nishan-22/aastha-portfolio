"use client";

import { useCallback, useEffect, useSyncExternalStore, useState } from "react";
import { fetchAdminContent, login, resetContent as apiResetContent, saveContent } from "@/lib/api";
import type { SiteContent } from "@/lib/contentTypes";
import {
  AboutEditor,
  ContactEditor,
  CtaEditor,
  ExperienceEditor,
  FooterEditor,
  HeroEditor,
  NavEditor,
  ProfileEditor,
  ProjectsEditor,
  ServicesEditor,
} from "./editors";
import { Field, Text } from "./ui";

const TOKEN_KEY = "portfolio_admin_token";

let cachedToken: string | null = typeof window === "undefined" ? null : sessionStorage.getItem(TOKEN_KEY);
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((l) => l());
}

function setStoredToken(token: string | null) {
  if (token === null) {
    sessionStorage.removeItem(TOKEN_KEY);
  } else {
    sessionStorage.setItem(TOKEN_KEY, token);
  }
  cachedToken = token;
  emit();
}

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

function getTokenSnapshot() {
  return cachedToken;
}

const TABS: { key: keyof SiteContent; label: string }[] = [
  { key: "profile", label: "Personal Info" },
  { key: "nav", label: "Menu" },
  { key: "hero", label: "Main Banner" },
  { key: "about", label: "About" },
  { key: "services", label: "Skills" },
  { key: "projects", label: "Projects" },
  { key: "experience", label: "Experience" },
  { key: "cta", label: "Call to Action" },
  { key: "contact", label: "Contact" },
  { key: "footer", label: "Footer" },
];

export default function AdminPage() {
  const token = useSyncExternalStore(subscribe, getTokenSnapshot, () => null);
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loggingIn, setLoggingIn] = useState(false);

  const [content, setContent] = useState<SiteContent | null>(null);
  const [activeTab, setActiveTab] = useState<keyof SiteContent>("profile");
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState<string | null>(null);
  const [saveError, setSaveError] = useState("");

  useEffect(() => {
    if (!token) return;
    fetchAdminContent()
      .then(setContent)
      .catch(() => setLoginError("Failed to load content. Is the backend running?"));
  }, [token]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoggingIn(true);
    setLoginError("");
    try {
      const t = await login(password);
      setStoredToken(t);
      setPassword("");
    } catch (err) {
      setLoginError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoggingIn(false);
    }
  };

  const handleLogout = () => {
    setStoredToken(null);
    setContent(null);
  };

  const update = useCallback(<K extends keyof SiteContent>(key: K, value: SiteContent[K]) => {
    setContent((prev) => (prev ? { ...prev, [key]: value } : prev));
  }, []);

  const handleSave = async () => {
    if (!token || !content) return;
    setSaving(true);
    setSaveError("");
    setSavedAt(null);
    try {
      const saved = await saveContent(token, content);
      setContent(saved);
      setSavedAt(new Date().toLocaleTimeString());
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : "Failed to save content");
    } finally {
      setSaving(false);
    }
  };

  const handleReset = async () => {
    if (!token) return;
    if (!window.confirm("Reset all content to the default seed content? This cannot be undone.")) {
      return;
    }
    setSaving(true);
    setSaveError("");
    try {
      const reset = await apiResetContent(token);
      setContent(reset);
      setSavedAt(new Date().toLocaleTimeString());
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : "Failed to reset content");
    } finally {
      setSaving(false);
    }
  };

  if (!token) {
    return (
      <main className="grid min-h-screen place-items-center bg-background px-5 font-sans">
        <div className="w-full max-w-sm">
          <div className="rounded-2xl border border-line bg-white p-8 shadow-[0_20px_60px_-30px_rgba(17,17,17,0.15)]">
            <p className="text-sm font-semibold text-muted">Website Admin</p>
            <h1 className="mt-2 text-2xl font-bold tracking-tight text-ink">Welcome back</h1>
            <p className="mt-2 text-sm text-muted">
              Enter your password to edit your website content.
            </p>
            <form onSubmit={handleLogin} className="mt-6 space-y-4">
              <Field label="Password">
                <Text
                  value={password}
                  onChange={setPassword}
                  placeholder="Admin password"
                />
              </Field>
              {loginError && <p className="text-sm text-red-600">{loginError}</p>}
              <button
                type="submit"
                disabled={loggingIn}
                className="btn-primary w-full justify-center py-3 disabled:opacity-60"
              >
                {loggingIn ? "Signing in..." : "Sign in"}
              </button>
            </form>
          </div>
        </div>
      </main>
    );
  }

  if (!content) {
    return (
      <main className="grid min-h-screen place-items-center bg-background px-5 font-sans">
        <p className="text-sm text-muted">Loading content…</p>
      </main>
    );
  }

  const editors: Record<keyof SiteContent, React.ReactNode> = {
    profile: <ProfileEditor value={content.profile} onChange={(v) => update("profile", v)} />,
    nav: <NavEditor value={content.nav} onChange={(v) => update("nav", v)} />,
    hero: <HeroEditor value={content.hero} onChange={(v) => update("hero", v)} />,
    about: <AboutEditor value={content.about} onChange={(v) => update("about", v)} />,
    services: <ServicesEditor value={content.services} onChange={(v) => update("services", v)} />,
    projects: <ProjectsEditor value={content.projects} onChange={(v) => update("projects", v)} token={token} />,
    experience: <ExperienceEditor value={content.experience} onChange={(v) => update("experience", v)} />,
    cta: <CtaEditor value={content.cta} onChange={(v) => update("cta", v)} />,
    contact: <ContactEditor value={content.contact} onChange={(v) => update("contact", v)} />,
    footer: <FooterEditor value={content.footer} onChange={(v) => update("footer", v)} />,
  };

  return (
    <main className="min-h-screen bg-background font-sans">
      <header className="sticky top-0 z-50 border-b border-line bg-background/90 backdrop-blur-md">
        <div className="mx-auto flex w-full max-w-[1200px] flex-wrap items-center justify-between gap-3 px-5 py-4 sm:px-8">
          <div>
            <p className="text-sm font-semibold text-ink">Website Admin</p>
            <p className="text-xs text-muted">Edit your website content</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary px-4 py-2"
            >
              View site
            </a>
            <button
              type="button"
              onClick={handleReset}
              className="rounded-lg border border-line px-4 py-2 text-sm text-muted transition-colors hover:border-red-300 hover:text-red-500"
            >
              Reset defaults
            </button>
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-lg border border-line px-4 py-2 text-sm text-muted transition-colors hover:border-ink"
            >
              Log out
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="btn-primary px-5 py-2 disabled:opacity-60"
            >
              {saving ? "Saving…" : "Save changes"}
            </button>
          </div>
        </div>
        <div className="mx-auto flex w-full max-w-[1200px] gap-2 overflow-x-auto px-5 pb-3 sm:px-8">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={`whitespace-nowrap rounded-lg px-4 py-1.5 text-xs font-medium transition-colors ${
                activeTab === tab.key
                  ? "bg-accent text-white"
                  : "border border-line text-muted hover:text-ink"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </header>

      <div className="mx-auto w-full max-w-[1200px] px-5 py-8 sm:px-8">
        {(savedAt || saveError) && (
          <div
            className={`mb-6 rounded-xl border px-4 py-3 text-sm ${
              saveError
                ? "border-red-300 bg-red-50 text-red-600"
                : "border-accent/30 bg-accent-muted text-accent"
            }`}
          >
            {saveError || `Saved at ${savedAt}. Refresh the site to see changes.`}
          </div>
        )}
        <div key={activeTab as string}>{editors[activeTab]}</div>
      </div>
    </main>
  );
}