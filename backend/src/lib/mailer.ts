import { Resend } from "resend";

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM_EMAIL =
  process.env.RESEND_FROM_EMAIL ?? "portfolio <onboarding@resend.dev>";
const TO_EMAIL = process.env.RESEND_TO_EMAIL ?? "astha.dhunagana@engineer.com";

export interface EmailPayload {
  name: string;
  email: string;
  projectType: string;
  message: string;
}

export async function sendEmail(payload: EmailPayload): Promise<boolean> {
  if (!RESEND_API_KEY) {
    return false;
  }

  const resend = new Resend(RESEND_API_KEY);
  const { error } = await resend.emails.send({
    from: FROM_EMAIL,
    to: [TO_EMAIL],
    subject: `New portfolio message from ${payload.name}`,
    html: `
      <h2>New contact message</h2>
      <p><strong>Name:</strong> ${escapeHtml(payload.name)}</p>
      <p><strong>Email:</strong> ${escapeHtml(payload.email)}</p>
      <p><strong>Project type:</strong> ${escapeHtml(payload.projectType)}</p>
      <hr />
      <p>${escapeHtml(payload.message).replace(/\n/g, "<br />")}</p>
    `,
  });

  return !error;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
