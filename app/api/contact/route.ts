import nodemailer from "nodemailer";
import { pickContactData, validateAll } from "@/lib/contact";
import { projectTypes } from "@/data/contact";

// Simple per-IP limit (in memory: enough to stop casual spam, not a substitute for a real WAF).
const WINDOW_MS = 10 * 60 * 1000;
const MAX_REQUESTS = 5;
const hits = new Map<string, number[]>();

function rateLimited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > MAX_REQUESTS;
}

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

/** Header-safe single line (no CR/LF, no quotes or angle brackets). */
const oneLine = (value: string) => value.replace(/[\r\n"<>]+/g, " ").trim();

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid request." }, { status: 400 });
  }

  // Honeypot: real visitors never see or fill this field. Pretend it worked.
  if (body && typeof body === "object" && (body as Record<string, unknown>).website_url) {
    return Response.json({ ok: true });
  }

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (rateLimited(ip)) {
    return Response.json(
      { error: "Too many requests. Please try again in a few minutes." },
      { status: 429 },
    );
  }

  const data = pickContactData(body);
  const errors = validateAll(data);
  if (Object.keys(errors).length) {
    return Response.json({ error: "Please check your details and try again.", fields: errors }, { status: 400 });
  }

  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, CONTACT_TO, CONTACT_FROM } = process.env;
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS || !CONTACT_TO) {
    console.error("Contact form: SMTP_HOST, SMTP_USER, SMTP_PASS and CONTACT_TO must be set (see .env.example).");
    return Response.json(
      { error: "The contact form is not set up yet. Please try again later." },
      { status: 503 },
    );
  }

  const typeLabel = projectTypes.find((t) => t.value === data.projectType)?.label ?? data.projectType;
  const phone = `${data.countryCode} ${data.phone.trim()}`;
  const rows: [string, string][] = [
    ["Project type", typeLabel],
    ["Project title", data.title.trim()],
    ["Description", data.description.trim()],
    ["Reference website", data.website.trim() || "Not provided"],
    ["Timeline", data.timeline],
    ["Budget", data.budget],
    ["Priority", data.priority || "Not specified"],
    ["Name", data.name.trim()],
    ["Email", data.email.trim()],
    ["Phone", phone],
    ["Company", data.company.trim() || "Not specified"],
  ];

  const text = rows.map(([label, value]) => `${label}: ${value}`).join("\n");
  const html = `<div style="font-family:Arial,sans-serif;max-width:600px">
<h2 style="color:#fb752f;margin:0 0 16px">New project request</h2>
<table style="border-collapse:collapse;width:100%">${rows
    .map(
      ([label, value]) =>
        `<tr><td style="padding:8px 12px;border-bottom:1px solid #eee;color:#666;white-space:nowrap;vertical-align:top">${escapeHtml(label)}</td><td style="padding:8px 12px;border-bottom:1px solid #eee;white-space:pre-wrap">${escapeHtml(value)}</td></tr>`,
    )
    .join("")}</table>
<p style="color:#888;font-size:12px;margin-top:16px">Reply to this email to answer ${escapeHtml(oneLine(data.name))} directly.</p>
</div>`;

  const port = Number(SMTP_PORT) || 465;
  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port,
    secure: port === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });

  try {
    await transporter.sendMail({
      from: CONTACT_FROM || `"Portfolio contact" <${SMTP_USER}>`,
      to: CONTACT_TO,
      replyTo: `"${oneLine(data.name)}" <${data.email.trim()}>`,
      subject: `New project request: ${oneLine(data.title)} (${typeLabel})`,
      text,
      html,
    });
  } catch (error) {
    console.error("Contact form: sending the email failed.", error);
    return Response.json(
      { error: "Sorry, your request could not be sent. Please try again in a moment." },
      { status: 502 },
    );
  }

  return Response.json({ ok: true });
}
