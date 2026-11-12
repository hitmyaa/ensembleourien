"use client";

import { useState } from "react";

export default function RsvpForm() {
  const [present, setPresent] = useState("");
  const [status, setStatus] = useState({ state: "idle", msg: "" });

  async function onSubmit(e) {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget));
    setStatus({ state: "loading", msg: "" });
    try {
      const res = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Erreur");
      setStatus({ state: "done", msg: "" });
    } catch (err) {
      setStatus({ state: "error", msg: err.message });
    }
  }

  if (status.state === "done") {
    return (
      <div className="thanks">
        <h3>Merci !</h3>
        <p>
          {present === "oui"
            ? "Votre réponse est bien enregistrée. Nous avons hâte de vous voir en Aveyron !"
            : "Votre réponse est bien enregistrée. Vous nous manquerez, nous penserons à vous."}
        </p>
      </div>
    );
  }

  return (
    <form className="rsvp" onSubmit={onSubmit}>
      <label className="full">
        Nom et prénom (ou noms du foyer)
        <input name="nom" required placeholder="Ex. Marie et Julien Martin" />
      </label>

      <label>
        Email
        <input name="email" type="email" placeholder="vous@exemple.fr" />
      </label>
      <label>
        Téléphone
        <input name="telephone" type="tel" placeholder="06 ..." />
      </label>

      <fieldset className="full choice">
        <legend>Serez-vous des nôtres ?</legend>
        <label className={present === "oui" ? "on" : ""}>
          <input type="radio" name="present" value="oui" required onChange={() => setPresent("oui")} />
          Avec joie, nous serons là
        </label>
        <label className={present === "non" ? "on" : ""}>
          <input type="radio" name="present" value="non" onChange={() => setPresent("non")} />
          Malheureusement, nous ne pourrons pas venir
        </label>
      </fieldset>

      {present === "oui" && (
        <>
          <label>
            Nombre d&apos;adultes
            <input name="adultes" type="number" min="1" max="20" defaultValue="1" required />
          </label>
          <label>
            Nombre d&apos;enfants
            <input name="enfants" type="number" min="0" max="20" defaultValue="0" />
          </label>

          <fieldset className="full choice small">
            <legend>Serez-vous au brunch du dimanche ?</legend>
            <label>
              <input type="radio" name="brunch" value="oui" defaultChecked /> Oui
            </label>
            <label>
              <input type="radio" name="brunch" value="non" /> Non
            </label>
          </fieldset>

          <label className="full">
            Régime alimentaire ou allergies
            <input name="regime" placeholder="Végétarien, sans gluten, allergie…" />
          </label>
        </>
      )}

      <label className="full">
        Un petit mot pour nous ?
        <textarea name="message" rows="3" />
      </label>

      {status.state === "error" && <p className="error full">{status.msg}</p>}

      <button className="full" type="submit" disabled={status.state === "loading"}>
        {status.state === "loading" ? "Envoi…" : "Envoyer ma réponse"}
      </button>
    </form>
  );
}
