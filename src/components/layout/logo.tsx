import Link from "next/link";
import { cn } from "@/lib/utils";

export function Logo({ className, large = false }: { className?: string; large?: boolean }) {
  return (
    <Link
      href="/"
      className={cn("group inline-flex items-center gap-2.5 text-fg", className)}
      aria-label="SMEG Tajikistan, на главную"
    >
      <span className="flex items-center gap-[3px]" aria-hidden>
        <span className="size-[7px] rounded-full bg-pastel-blue transition-transform duration-500 ease-out-expo group-hover:-translate-y-0.5" />
        <span className="size-[7px] rounded-full bg-pastel-pink transition-transform duration-500 ease-out-expo delay-75 group-hover:-translate-y-0.5" />
        <span className="size-[7px] rounded-full bg-smeg transition-transform duration-500 ease-out-expo delay-150 group-hover:-translate-y-0.5" />
      </span>
      <span
        className={cn(
          "font-sans font-extrabold lowercase leading-none tracking-[-0.06em]",
          large ? "text-3xl" : "text-[22px]",
        )}
      >
        smeg
      </span>
      <span className="eyebrow mt-[3px] text-[10px] tracking-[0.2em]">tajikistan</span>
    </Link>
  );
}
