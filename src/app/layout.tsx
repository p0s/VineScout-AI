import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "VineScout AI",
  description: "Find, verify, and win Western vineyard deals."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
