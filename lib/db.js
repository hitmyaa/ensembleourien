import { neon } from "@neondatabase/serverless";

let ready = false;

export function getSql() {
  const url = process.env.DATABASE_URL || process.env.POSTGRES_URL;
  if (!url) throw new Error("DATABASE_URL manquante");
  return neon(url);
}

export async function ensureTable() {
  if (ready) return;
  const sql = getSql();
  await sql`
    CREATE TABLE IF NOT EXISTS rsvp (
      id SERIAL PRIMARY KEY,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
      nom TEXT NOT NULL,
      email TEXT,
      telephone TEXT,
      present BOOLEAN NOT NULL,
      adultes INTEGER NOT NULL DEFAULT 0,
      enfants INTEGER NOT NULL DEFAULT 0,
      brunch BOOLEAN NOT NULL DEFAULT false,
      regime TEXT,
      message TEXT
    )`;
  ready = true;
}
