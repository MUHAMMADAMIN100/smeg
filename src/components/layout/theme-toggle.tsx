"use client";

import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { useMounted } from "@/lib/use-mounted";
import { cn } from "@/lib/utils";

export function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useMounted();
  const isDark = mounted && resolvedTheme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={isDark ? "Включить светлую тему" : "Включить тёмную тему"}
      aria-pressed={isDark}
      title={isDark ? "Светлая тема" : "Тёмная тема"}
      className={cn(
        "relative inline-flex size-11 cursor-pointer items-center justify-center rounded-full border border-line text-fg transition-[border-color,background-color,transform] duration-300 ease-out-expo hover:border-fg hover:bg-surface-2 active:scale-95",
        className,
      )}
    >
      <Sun
        className={cn(
          "absolute size-[18px] transition-[transform,opacity] duration-500 ease-out-expo",
          isDark ? "rotate-90 scale-50 opacity-0" : "rotate-0 scale-100 opacity-100",
        )}
        strokeWidth={1.75}
      />
      <Moon
        className={cn(
          "absolute size-[18px] transition-[transform,opacity] duration-500 ease-out-expo",
          isDark ? "rotate-0 scale-100 opacity-100" : "-rotate-90 scale-50 opacity-0",
        )}
        strokeWidth={1.75}
      />
    </button>
  );
}
