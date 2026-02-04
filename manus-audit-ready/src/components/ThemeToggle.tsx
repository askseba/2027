"use client";

import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const { theme, setTheme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  const resolvedTheme = theme === "system" ? systemTheme : theme;
  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      className="min-touch-target inline-flex items-center justify-center rounded-full border border-primary/20 bg-white/90 px-3 py-2 text-sm font-medium shadow-sm transition-colors hover:bg-cream-bg dark:bg-surface-elevated dark:hover:bg-surface-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
      aria-label={isDark ? "تفعيل الوضع الفاتح" : "تفعيل الوضع الداكن"}
      onClick={() => setTheme(isDark ? "light" : "dark")}
    >
      {isDark ? (
        <Sun className="h-4 w-4 text-gold" />
      ) : (
        <Moon className="h-4 w-4 text-primary" />
      )}
    </button>
  );
}
