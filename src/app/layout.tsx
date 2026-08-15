import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "QuickPitch — Conecta Startups con Inversionistas",
  description:
    "Plataforma de matchmaking para emprendedores e inversionistas. Presenta tu startup en 3 minutos y recibe micro-inversiones en tiempo real.",
  keywords: ["startups", "inversión", "pitch", "emprendedores", "incubadora"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
