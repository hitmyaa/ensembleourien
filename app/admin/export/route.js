import { isAdmin } from "@/lib/auth";
import { getSql, ensureTable } from "@/lib/db";

export const dynamic = "force-dynamic";

const esc = (v) => `"${String(v ?? "").replace(/"/g, '""')}"`;

export async function GET() {
  if (!(await isAdmin())) return new Response("Non autorisé", { status: 401 });
  await ensureTable();
  const rows = await getSql()`SELECT * FROM rsvp ORDER BY created_at`;
  const head = ["Date", "Nom", "Présent", "Adultes", "Enfants", "Brunch", "Régime", "Email", "Téléphone", "Message"];
  const lines = rows.map((r) =>
    [
      new Date(r.created_at).toLocaleString("fr-FR", { timeZone: "Europe/Paris" }),
      r.nom, r.present ? "Oui" : "Non", r.adultes, r.enfants, r.brunch ? "Oui" : "Non",
      r.regime, r.email, r.telephone, r.message,
    ].map(esc).join(";")
  );
  const csv = "﻿" + [head.map(esc).join(";"), ...lines].join("\n");
  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="reponses-mariage.csv"',
    },
  });
}
