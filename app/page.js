import RsvpForm from "./RsvpForm";

const maps = (q) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`;

const programme = [
  {
    jour: "Sam. 12 juin",
    heure: "16h30",
    titre: "Cérémonie à l'église",
    lieu: "Chapelle Notre-Dame de Gironde, Aveyron",
    q: "Chapelle Notre-Dame de Gironde Aveyron",
  },
  {
    jour: "Sam. 12 juin",
    heure: "18h30",
    titre: "Cocktail & banquet festif",
    lieu: "Le Vialenq, 12300 Saint-Parthem",
    q: "Le Vialenq 12300 Saint-Parthem",
  },
  {
    jour: "Dim. 13 juin",
    heure: "12h30",
    titre: "Brunch tous ensemble",
    lieu: "Le Vialenq, 12300 Saint-Parthem",
    q: "Le Vialenq 12300 Saint-Parthem",
  },
];

const infos = [
  {
    titre: "Venir",
    texte:
      "Tout se passe en Aveyron, entre la chapelle Notre-Dame de Gironde et Le Vialenq à Saint-Parthem. La voiture reste le plus simple : pensez au covoiturage ! Les détails d'accès arrivent bientôt.",
  },
  {
    titre: "Dormir",
    texte:
      "Les possibilités d'hébergement sur place et aux alentours seront détaillées ici très bientôt.",
  },
  {
    titre: "Tenue",
    texte:
      "Champêtre et élégante. Prévoyez des chaussures confortables : la soirée se passe en partie dans l'herbe !",
  },
];

function joursRestants() {
  const cible = new Date("2027-06-12T16:30:00+02:00");
  return Math.max(0, Math.ceil((cible - new Date()) / 86400000));
}

export const revalidate = 3600;

export default function Home() {
  const jours = joursRestants();
  return (
    <main>
      <header className="hero">
        <div className="hero-art" aria-hidden="true" />
        <div className="hero-text">
          <p className="kicker">Nous allons nous marier</p>
          <h1>
            Faustine
            <br />& Paul
          </h1>
          <p className="date">12 . 06 . 2027 . Aveyron</p>
        </div>
        <nav className="nav">
          <a href="#festivites">Les festivités</a>
          <a href="#infos">Infos pratiques</a>
          <a href="#reponse" className="nav-cta">Répondre</a>
        </nav>
      </header>

      <section className="intro">
        <img src="/monogramme.png" alt="" className="mono" width="120" height="120" />
        <p>
          Nous avons hâte de partager ce week-end avec vous, au cœur de l&apos;Aveyron.
          Vous trouverez ici tout ce qu&apos;il faut savoir pour nous rejoindre.
        </p>
        {jours > 0 && (
          <p className="countdown">
            Plus que <strong>{jours}</strong> jours
          </p>
        )}
      </section>

      <section id="festivites" className="section">
        <h2>Les festivités</h2>
        <ol className="timeline">
          {programme.map((e) => (
            <li key={e.titre}>
              <p className="when">
                {e.jour} · {e.heure}
              </p>
              <h3>{e.titre}</h3>
              <a className="where" href={maps(e.q)} target="_blank" rel="noreferrer">
                {e.lieu}
              </a>
            </li>
          ))}
        </ol>
      </section>

      <section id="infos" className="section soft">
        <h2>Infos pratiques</h2>
        <div className="cards">
          {infos.map((i) => (
            <article key={i.titre} className="card">
              <h3>{i.titre}</h3>
              <p>{i.texte}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="reponse" className="section">
        <h2>Confirmez votre présence</h2>
        <p className="lead">
          Merci de nous répondre <strong>avant le xx janvier 2027</strong>.
          Une réponse par foyer suffit.
        </p>
        <RsvpForm />
      </section>

      <footer className="footer">
        <img src="/monogramme.png" alt="Faustine & Paul" width="64" height="64" />
        <p>Une question ? Appelez-nous</p>
        <p className="tel">
          <a href="tel:+33673877571">Faustine 06 73 87 75 71</a>
          <span> · </span>
          <a href="tel:+33631153976">Paul 06 31 15 39 76</a>
        </p>
      </footer>
    </main>
  );
}
