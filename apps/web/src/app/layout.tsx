import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SmartFellas",
  description: "Track bar trivia performance after game night.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
