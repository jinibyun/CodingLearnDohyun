"use client";

import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();

  if (!resolvedTheme) {
    return (
      <Button
        variant="outline"
        size="sm"
        className="bg-white text-black hover:bg-zinc-100 dark:bg-zinc-900 dark:text-white"
        disabled
      >
        Theme
      </Button>
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      className="bg-white text-black hover:bg-zinc-100 dark:bg-zinc-900 dark:text-white"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label="Toggle theme"
    >
      {isDark ? "Light" : "Dark"}
    </Button>
  );
}
