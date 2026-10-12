import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

/** Официальный белый логотип SMEG с подписью «tajikistan», для чёрных фонов. */
export function Logo({ className, compact = false, priority = false }: { className?: string; compact?: boolean; priority?: boolean }) {
  return (
    <Link
      href="/"
      className={cn("inline-flex flex-col items-center text-white", className)}
      aria-label="SMEG Tajikistan, на главную"
    >
      <Image
        src="/brand/smeg-logo-white.png"
        alt="SMEG"
        width={964}
        height={188}
        priority={priority}
        className={cn("w-auto", compact ? "h-6" : "h-9 sm:h-10")}
      />
      <span
        className={cn(
          "mt-1 font-semibold uppercase tracking-[0.34em] text-white/70",
          compact ? "text-[7px]" : "text-[8px] sm:text-[9px]",
        )}
      >
        tajikistan
      </span>
    </Link>
  );
}
