import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FSN 8 - El rito",
  description: "fiestasinnombre 8",
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
