"use client";

import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ProductForm } from "@/components/form/product-form";
import { ResultSection } from "@/components/result/result-section";
import { SeoCheckerSection } from "@/components/checker/seo-checker-section";
import { useGenerate } from "@/hooks/use-generate";

export default function Home() {
  const { loading, error, results, generate } = useGenerate();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="mx-auto max-w-4xl px-4 py-8 space-y-8">
        <ProductForm onSubmit={generate} loading={loading} />
        <ResultSection results={results} loading={loading} error={error} />
        <SeoCheckerSection />
      </main>
      <Footer />
    </div>
  );
}
