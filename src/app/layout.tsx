import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FSN 9 - summer edition",
  description: "FSN 9: summer edition. ¡Especial cumpleaños!. 17 de enero 12:00hs.",
  openGraph: {
    title: "FSN 9 - summer edition",
    description: "FSN 9: summer edition. ¡Especial cumpleaños!. 17 de enero 12:00hs.",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "FSN 9 - summer edition",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "FSN 9 - summer edition",
    description: "FSN 9: summer edition. ¡Especial cumpleaños!. 17 de enero 12:00hs.",
    images: ["/logo.png"],
  },
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
