import { cn } from "./cn";

/**
 * Utility function to get consistent focus styles without the ugly black border
 * @returns Tailwind classes for focus styles
 */
export const noBlackBorderFocus = () => {
  return cn(
    "focus:outline-none focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0",
    "focus:border-input focus-visible:border-input"
  );
};
