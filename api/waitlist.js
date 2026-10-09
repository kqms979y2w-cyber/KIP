import { neon } from "@neondatabase/serverless";

const SOURCES = new Set(["TikTok", "Instagram", "Friend", "School", "Search", "Other"]);
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const body = typeof req.body === "string" ? safeParse(req.body) : req.body || {};
  const fullName = String(body.fullName || "").trim().slice(0, 120);
  const email = String(body.email || "").trim().toLowerCase().slice(0, 254);
  const age = Number(body.age);
  const source = String(body.source || "");

  if (fullName.length < 2) return res.status(400).json({ error: "Please enter your full name." });
  if (!Number.isInteger(age) || age < 1 || age > 120) return res.status(400).json({ error: "Please enter a valid age." });
  if (!EMAIL_RE.test(email)) return res.status(400).json({ error: "Please enter a valid email." });
  if (!SOURCES.has(source)) return res.status(400).json({ error: "Please tell us how you heard about Kip." });

  try {
    const sql = neon(process.env.DATABASE_URL);
    const rows = await sql`
      INSERT INTO waitlist (full_name, age, email, referral_source)
      VALUES (${fullName}, ${age}, ${email}, ${source})
      ON CONFLICT (email) DO NOTHING
      RETURNING id`;
    return res.status(200).json({ ok: true, alreadyJoined: rows.length === 0 });
  } catch (err) {
    console.error("Waitlist insert failed:", err);
    return res.status(500).json({ error: "Something went wrong. Please try again." });
  }
}

function safeParse(text) {
  try {
    return JSON.parse(text);
  } catch {
    return {};
  }
}
