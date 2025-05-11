/**
 * Theme class mappings to replace hardcoded Tailwind classes with theme variables
 */

// Text color mappings
export const textColors = {
  // Gray text colors
  "text-text-muted": "text-text-muted",
  "text-gray-500": "text-text-primary",
  "text-text-primary": "text-text-primary",
  "text-gray-700": "text-text-secondary",
  "text-gray-800": "text-text-secondary",
  "text-gray-900": "text-text-secondary",

  // Status colors
  "text-red-500": "text-destructive",
  "text-red-600": "text-destructive",
  "text-red-700": "text-destructive",
  "text-red-800": "text-destructive",

  "text-green-500": "text-success",
  "text-green-600": "text-success",
  "text-green-700": "text-success",
  "text-green-800": "text-success",

  "text-blue-500": "text-info",
  "text-blue-600": "text-info",
  "text-blue-700": "text-info",
  "text-blue-800": "text-info",
  "text-blue-900": "text-info",

  "text-yellow-500": "text-warning",
  "text-yellow-600": "text-warning",
  "text-yellow-700": "text-warning",
  "text-yellow-800": "text-warning",

  "text-indigo-500": "text-info",
  "text-indigo-600": "text-info",
  "text-indigo-700": "text-info",
};

// Background color mappings
export const backgroundColors = {
  // Gray backgrounds
  "bg-gray-50": "bg-background-primary",
  "bg-gray-100": "bg-accent",
  "bg-gray-200": "bg-accent",
  "bg-gray-300": "bg-accent",

  // Status backgrounds
  "bg-red-50": "bg-destructive/10",
  "bg-red-100": "bg-destructive/20",
  "bg-red-200": "bg-destructive/30",

  "bg-green-50": "bg-success/10",
  "bg-green-100": "bg-success/20",
  "bg-green-200": "bg-success/30",

  "bg-blue-50": "bg-info/10",
  "bg-blue-100": "bg-info/20",
  "bg-blue-200": "bg-info/30",

  "bg-yellow-50": "bg-warning/10",
  "bg-yellow-100": "bg-warning/20",
  "bg-yellow-200": "bg-warning/30",

  "bg-indigo-50": "bg-info/10",
  "bg-indigo-100": "bg-info/20",
  "bg-indigo-200": "bg-info/30",
};

// Border color mappings
export const borderColors = {
  "border-gray-100": "border-border-primary",
  "border-gray-200": "border-border-primary",
  "border-gray-300": "border-border-primary",

  "border-red-200": "border-destructive/30",
  "border-green-200": "border-success/30",
  "border-blue-200": "border-info/30",
  "border-yellow-200": "border-warning/30",
  "border-indigo-200": "border-info/30",
};

// Hover color mappings
export const hoverColors = {
  "hover:bg-gray-100": "hover:bg-accent",
  "hover:bg-gray-200": "hover:bg-accent/70",
  "hover:bg-gray-300": "hover:bg-accent/90",

  "hover:text-text-primary": "hover:text-text-primary",
  "hover:text-gray-700": "hover:text-text-secondary",
  "hover:text-gray-800": "hover:text-text-secondary",

  "hover:bg-red-50": "hover:bg-destructive/10",
  "hover:text-red-500": "hover:text-destructive",
  "hover:text-red-700": "hover:text-destructive",

  "hover:bg-blue-50": "hover:bg-info/10",
  "hover:bg-blue-100": "hover:bg-info/20",
  "hover:text-blue-600": "hover:text-info",
  "hover:text-blue-700": "hover:text-info",
  "hover:text-blue-800": "hover:text-info",

  "hover:bg-green-200": "hover:bg-success/30",
  "hover:text-green-600": "hover:text-success",
  "hover:text-green-700": "hover:text-success",
};

// Active color mappings
export const activeColors = {
  "active:bg-gray-300": "active:bg-accent/90",
  "active:bg-green-300": "active:bg-success/40",
  "active:bg-blue-200": "active:bg-info/30",
};
