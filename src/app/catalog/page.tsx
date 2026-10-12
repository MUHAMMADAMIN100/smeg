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
      <div className="h-4 w-20 rounded bg-surface-2" />
      <div className="mt-4 h-16 w-72 rounded-xl bg-surface-2" />
      <div className="mt-10 h-28 rounded-2xl bg-surface-2" />
      <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="aspect-[3/4] rounded-[28px] bg-surface-2" />
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
