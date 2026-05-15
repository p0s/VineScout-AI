import type { ReactNode } from "react";
import { AppHeader } from "@/components/AppHeader";
import { DemoModeBanner } from "@/components/DemoModeBanner";

export default function ProductLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <AppHeader />
      <main className="app-shell">
        <DemoModeBanner />
        {children}
      </main>
    </>
  );
}
