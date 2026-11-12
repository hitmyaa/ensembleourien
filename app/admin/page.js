import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { isAdmin, tokenFor, COOKIE } from "@/lib/auth";
import { getSql, ensureTable } from "@/lib/db";

export const dynamic = "force-dynamic";
export const metadata = { title: "Admin · Faustine & Paul", robots: { index: false } };

async function login(formData) {
  "use server";
  const pwd = process.env.ADMIN_PASSWORD;
  if (pwd && formData.get("password") === pwd) {
    const store = await cookies();
    store.set(COOKIE, tokenFor(pwd), { httpOnly: true, secure: true, sameSite: "lax", maxAge: 60 * 60 * 24 * 90, path: "/" });
    redirect("/admin");
  }
  redirect("/admin?erreur=1");
}

async function logout() {
  "use server";
  const store = await cookies();
  store.delete(COOKIE);
  redirect("/admin");
}

async function supprimer(formData) {
  "use server";
  if (!(await isAdmin())) return;
  const id = parseInt(formData.get("id"), 10);
  if (id) await getSql()`DELETE FROM rsvp WHERE id = ${id}`;
  redirect("/admin");
}

const fmt = (d) =>
  new Date(d).toLocaleString("fr-FR", { timeZone: "Europe/Paris", day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" });

export default async function Admin({ searchParams }) {
  const params = await searchParams;

  if (!process.env.ADMIN_PASSWORD) {
    return (
      <main className="login">
        <h1 style={{ fontSize: 48 }}>Admin</h1>
        <p>Ajoute la variable <code>ADMIN_PASSWORD</code> dans Vercel puis redéploie pour activer cette page.</p>
      </main>
    );
  }

  if (!(await isAdmin())) {
    return (
      <form action={login} className="login">
        <h1 style={{ fontSize: 48 }}>Admin</h1>
        <input type="password" name="password" placeholder="Mot de passe" required autoFocus />
        {params?.erreur && <p className="error">Mot de passe incorrect.</p>}
        <button className="btn primary" type="submit">Entrer</button>
      </form>
    );
  }

  await ensureTable();
  const rows = await getSql()`SELECT * FROM rsvp ORDER BY created_at DESC`;
  const oui = rows.filter((r) => r.present);
  const adultes = oui.reduce((s, r) => s + r.adultes, 0);
  const enfants = oui.reduce((s, r) => s + r.enfants, 0);
  const brunch = oui.filter((r) => r.brunch).reduce((s, r) => s + r.adultes + r.enfants, 0);

  return (
    <main className="admin">
      <div className="admin-bar">
        <h1>Réponses</h1>
        <div style={{ display: "flex", gap: 10 }}>
          <a className="btn" href="/admin/export">Exporter (CSV)</a>
          <form action={logout}><button className="btn" type="submit">Déconnexion</button></form>
        </div>
      </div>

      <div className="stats">
        <div className="stat"><b>{rows.length}</b><span>réponses</span></div>
        <div className="stat"><b>{oui.length}</b><span>foyers présents</span></div>
        <div className="stat"><b>{rows.length - oui.length}</b><span>foyers absents</span></div>
        <div className="stat"><b>{adultes}</b><span>adultes</span></div>
        <div className="stat"><b>{enfants}</b><span>enfants</span></div>
        <div className="stat"><b>{brunch}</b><span>au brunch</span></div>
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Date</th><th>Nom</th><th>Présence</th><th>Adultes</th><th>Enfants</th><th>Brunch</th>
              <th>Régime</th><th>Contact</th><th>Message</th><th></th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && (
              <tr><td colSpan="10" style={{ textAlign: "center", color: "var(--muted)" }}>Aucune réponse pour l&apos;instant.</td></tr>
            )}
            {rows.map((r) => (
              <tr key={r.id}>
                <td>{fmt(r.created_at)}</td>
                <td><strong style={{ fontWeight: 500 }}>{r.nom}</strong></td>
                <td><span className={`pill ${r.present ? "oui" : "non"}`}>{r.present ? "Oui" : "Non"}</span></td>
                <td>{r.present ? r.adultes : ""}</td>
                <td>{r.present ? r.enfants : ""}</td>
                <td>{r.present ? (r.brunch ? "Oui" : "Non") : ""}</td>
                <td>{r.regime}</td>
                <td>{[r.email, r.telephone].filter(Boolean).join(" · ")}</td>
                <td style={{ maxWidth: 280 }}>{r.message}</td>
                <td>
                  <form action={supprimer}>
                    <input type="hidden" name="id" value={r.id} />
                    <button className="btn" style={{ padding: "4px 10px", fontSize: 13 }} type="submit">Suppr.</button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
