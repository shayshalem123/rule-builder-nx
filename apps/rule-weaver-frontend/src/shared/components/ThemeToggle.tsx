import { useState, useEffect } from "react";
import { Sun, Moon } from "lucide-react";

type Theme = "light" | "dark";

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("light");
  const [isMounted, setIsMounted] = useState(false);

  // Initialize theme on component mount
  useEffect(() => {
    setIsMounted(true);
    const storedTheme = localStorage.getItem("theme") as Theme | null;
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;

    const initialTheme = storedTheme || (prefersDark ? "dark" : "light");
    setTheme(initialTheme);
    applyTheme(initialTheme);
  }, []);

  // Apply theme to document and localStorage
  const applyTheme = (newTheme: Theme) => {
    const root = window.document.documentElement;

    // Remove the old theme class
    root.classList.remove("light", "dark");
    // Add the new theme class
    root.classList.add(newTheme);

    // Store theme in localStorage
    localStorage.setItem("theme", newTheme);
  };

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    applyTheme(newTheme);
  };

  // Don't render anything until mounted to prevent hydration issues
  if (!isMounted) return null;

  return (
    <button
      onClick={toggleTheme}
      className="relative h-8 w-16 rounded-full bg-gradient-to-r from-gray-200 to-gray-300 p-1 shadow-inner transition-colors duration-300 dark:from-gray-700 dark:to-gray-800 overflow-hidden"
      aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
    >
      {/* Track background with glow effect */}
      <div className="absolute inset-0 rounded-full opacity-20 transition-opacity duration-300">
        {theme === "light" ? (
          <div className="absolute inset-0 bg-yellow-300 opacity-20"></div>
        ) : (
          <div className="absolute inset-0 bg-blue-400 opacity-20"></div>
        )}
      </div>

      {/* Toggle knob with slide animation */}
      <div
        className={`absolute top-1 flex h-6 w-6 items-center justify-center rounded-full bg-white shadow-md transition-all duration-300 ease-in-out ${
          theme === "dark" ? "translate-x-8 bg-gray-800" : "translate-x-0"
        }`}
      >
        {theme === "light" ? (
          <Sun size={14} className="text-yellow-500" />
        ) : (
          <Moon size={14} className="text-blue-400" />
        )}
      </div>

      {/* Background icons */}
      <span className="absolute right-2 top-1/2 -translate-y-1/2 transform opacity-40 dark:opacity-0 transition-opacity duration-300">
        <Moon size={12} className="text-gray-500" />
      </span>
      <span className="absolute left-2 top-1/2 -translate-y-1/2 transform opacity-0 dark:opacity-40 transition-opacity duration-300">
        <Sun size={12} className="text-yellow-300" />
      </span>
    </button>
  );
}
