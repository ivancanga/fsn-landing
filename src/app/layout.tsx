import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FSN 9 - summer edition",
  description: "fiestasinnombre 9",
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
