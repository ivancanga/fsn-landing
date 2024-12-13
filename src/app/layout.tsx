import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FSN 7 - el diamante",
  description: "fiestasinnombre 7",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
