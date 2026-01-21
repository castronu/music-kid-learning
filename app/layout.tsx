import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Music Helper - Riconoscimento Note",
  description: "Impara a riconoscere le note musicali con la tua voce",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
