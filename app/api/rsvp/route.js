import { NextResponse } from "next/server";
import { getSql, ensureTable } from "@/lib/db";

const clean = (v, max = 500) => (typeof v === "string" ? v.trim().slice(0, max) : "");
const num = (v) => Math.max(0, Math.min(20, parseInt(v, 10) || 0));

export async function POST(req) {
  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Requête invalide." }, { status: 400 });
  }

  const nom = clean(body.nom, 200);
  const present = body.present === "oui";
  if (!nom) return NextResponse.json({ error: "Merci d'indiquer votre nom." }, { status: 400 });
  if (body.present !== "oui" && body.present !== "non")
    return NextResponse.json({ error: "Merci d'indiquer si vous serez présent." }, { status: 400 });

  const adultes = present ? Math.max(1, num(body.adultes)) : 0;
  const enfants = present ? num(body.enfants) : 0;

  try {
    await ensureTable();
    const sql = getSql();
    await sql`
      INSERT INTO rsvp (nom, email, telephone, present, adultes, enfants, brunch, regime, message)
      VALUES (${nom}, ${clean(body.email, 200)}, ${clean(body.telephone, 50)}, ${present},
              ${adultes}, ${enfants}, ${present && body.brunch === "oui"},
              ${clean(body.regime)}, ${clean(body.message, 2000)})`;
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Oups, une erreur est survenue. Réessayez dans un instant." }, { status: 500 });
  }
}
