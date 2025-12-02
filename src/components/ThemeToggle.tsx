import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/use-theme";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    // When in system mode, determine the current appearance and toggle to the opposite
    if (theme === "system") {
      const isSystemDark = typeof window !== "undefined" && 
        window.matchMedia?.("(prefers-color-scheme: dark)").matches;
      setTheme(isSystemDark ? "light" : "dark");
    } else if (theme === "dark") {
      setTheme("light");
    } else {
      setTheme("dark");
    }
  };

  // Determine if currently displaying dark mode
  const isDark = theme === "dark" || 
    (theme === "system" && 
      typeof window !== "undefined" && 
      window.matchMedia?.("(prefers-color-scheme: dark)").matches);

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="h-9 w-9 rounded-full"
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {isDark ? (
        <Sun className="h-4 w-4 text-zinc-400 hover:text-zinc-100 transition-colors" />
      ) : (
        <Moon className="h-4 w-4 text-zinc-600 hover:text-zinc-900 transition-colors" />
      )}
    </Button>
  );
}
