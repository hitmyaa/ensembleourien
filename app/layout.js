import "@fontsource/shrikhand/400.css";
import "@fontsource/jost/300.css";
import "@fontsource/jost/400.css";
import "@fontsource/jost/500.css";
import "@fontsource/jost/600.css";
import "./globals.css";

export const metadata = {
  metadataBase: new URL("https://ensembleourien.fr"),
  title: "Faustine & Paul · 12 juin 2027",
  description: "Nous allons nous marier ! Toutes les informations sur notre mariage en Aveyron, et la confirmation de présence.",
  openGraph: {
    title: "Faustine & Paul · 12 juin 2027",
    description: "Nous allons nous marier ! Toutes les infos et la confirmation de présence.",
    images: ["/aveyron.jpg"],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
