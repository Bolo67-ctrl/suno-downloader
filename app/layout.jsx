import "./globals.css";

export const metadata = {
  title: "Suno Link Helper — Your music, one link away",
  description: "Open your Suno track or download audio files you have permission to save.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
