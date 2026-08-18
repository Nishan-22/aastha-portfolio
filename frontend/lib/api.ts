import type { SiteContent } from "./contentTypes";

function resolveApiUrl(): string {
  if (typeof window !== "undefined") {
    // Client-side: same-origin, routed to the backend by Vercel Services rewrites.
    return process.env.NEXT_PUBLIC_API_URL ?? "";
  }
  // Server-side (SSR): internal backend URL injected by the Vercel Services binding.
  return (
    process.env.BACKEND_URL ??
    process.env.NEXT_PUBLIC_API_URL ??
    "http://localhost:4000"
  );
}

export const API_URL = resolveApiUrl();

export async function getContent(): Promise<SiteContent | null> {
  try {
    const res = await fetch(`${API_URL}/api/content`, { cache: "no-store" });
    if (!res.ok) return null;
    return (await res.json()) as SiteContent;
  } catch {
    return null;
  }
}

export async function login(password: string): Promise<string> {
  const res = await fetch(`${API_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ password }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error ?? "Login failed");
  }
  return data.token as string;
}

export async function fetchAdminContent(): Promise<SiteContent> {
  const res = await fetch(`${API_URL}/api/content`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to load content");
  return (await res.json()) as SiteContent;
}

export async function saveContent(token: string, content: SiteContent): Promise<SiteContent> {
  const res = await fetch(`${API_URL}/api/content`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(content),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error ?? "Failed to save content");
  }
  return data as SiteContent;
}

export async function resetContent(token: string): Promise<SiteContent> {
  const res = await fetch(`${API_URL}/api/content/reset`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error ?? "Failed to reset content");
  }
  return data as SiteContent;
}

export async function uploadFile(token: string, file: File): Promise<string> {
  const body = new FormData();
  body.append("file", file);
  const res = await fetch(`${API_URL}/api/upload`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error ?? "Upload failed");
  }
  return data.url as string;
}