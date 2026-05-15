import type { Metadata } from "next";
import type { Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "VineScout AI",
  description: "Find, verify, and win Western vineyard deals.",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.svg", type: "image/svg+xml" }
    ],
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.svg"
  },
  manifest: "/site.webmanifest",
  openGraph: {
    title: "VineScout AI",
    description: "AI vineyard diligence for Western supply, investment, and acquisition.",
    siteName: "VineScout AI",
    type: "website"
  }
};

export const viewport: Viewport = {
  themeColor: "#f7f2ea",
  colorScheme: "light"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
