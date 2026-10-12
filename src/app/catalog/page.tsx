import { Suspense } from "react";
import type { Metadata } from "next";
import { CatalogView } from "@/components/catalog/catalog-view";
import { Container } from "@/components/ui/container";

export const metadata: Metadata = {
  title: "Каталог",
  description:
    "Каталог техники SMEG в Таджикистане: холодильники FAB, плиты Portofino и Victoria, кофемашины, тостеры, чайники, миксеры и аэрогриль. Фильтр по категории и цвету.",
};

function CatalogSkeleton() {
  return (
    <Container className="pb-24 pt-10 sm:pt-14" aria-busy="true" aria-label="Загрузка каталога">
      <div className="h-3 w-20 bg-smoke" />
      <div className="mt-4 h-12 w-72 bg-smoke" />
      <div className="mt-12 grid grid-cols-2 gap-5 md:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="aspect-[3/4] bg-smoke" />
        ))}
      </div>
    </Container>
  );
}

export default function CatalogPage() {
  return (
    <Suspense fallback={<CatalogSkeleton />}>
      <CatalogView />
    </Suspense>
  );
}
