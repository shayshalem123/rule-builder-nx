import { useState, useEffect } from "react";

type Theme = "vs-dark" | "light";

/**
 * Hook to get the current theme for the Monaco editor based on the app's dark/light mode
 * @returns The current Monaco editor theme: 'vs-dark' for dark mode, 'light' for light mode
 */
export const useTheme = (): Theme => {
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    // Initial theme detection
    const detectTheme = () => {
      const isDarkMode = document.documentElement.classList.contains("dark");
      setTheme(isDarkMode ? "vs-dark" : "light");
    };

    // Detect theme on mount
    detectTheme();

    // Set up a mutation observer to detect theme changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (
          mutation.type === "attributes" &&
          mutation.attributeName === "class"
        ) {
          detectTheme();
        }
      });
    });

    // Start observing the document element for class changes
    observer.observe(document.documentElement, { attributes: true });

    // Cleanup
    return () => {
      observer.disconnect();
    };
  }, []);

  return theme;
};

export default useTheme;
