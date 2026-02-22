"use client";

import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { PhaseProvider } from "@/lib/phase/phase-context";
import { PhaseProgress } from "@/components/phase/phase-progress";
import { PhaseContainer } from "@/components/phase/phase-container";

export default function Home() {
  return (
    <PhaseProvider>
      <div className="min-h-screen bg-background">
        <Header />
        <main className="mx-auto max-w-4xl px-4 py-8 space-y-8">
          <PhaseProgress />
          <PhaseContainer />
        </main>
        <Footer />
      </div>
    </PhaseProvider>
  );
}
