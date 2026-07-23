import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "UNESCO Youth Hackathon - Educational AI Board Game",
  description: "Web-based digital tabletop RPG for hoax/fact-checking education.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
