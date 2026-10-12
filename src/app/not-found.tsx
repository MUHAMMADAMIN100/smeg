import { ArrowLeft } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <Container className="flex min-h-[70dvh] flex-col items-start justify-center py-20">
      <p className="eyebrow">Ошибка 404</p>
      <h1 className="font-display mt-5 text-[clamp(4rem,16vw,12rem)] leading-none text-fg">404</h1>
      <p className="mt-6 max-w-md text-lg text-fg-muted">
        Такой страницы нет. Зато есть каталог с холодильниками, плитами и кофемашинами в десяти цветах.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Button href="/" icon={<ArrowLeft className="size-4" strokeWidth={2} />} iconPosition="left">
          На главную
        </Button>
        <Button href="/catalog" variant="outline">
          В каталог
        </Button>
      </div>
    </Container>
  );
}
