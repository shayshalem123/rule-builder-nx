# Theme Variables Replacement Guide

This guide will help you replace hardcoded Tailwind color classes with our theme variables for better dark mode support.

## Regular Expression Patterns for Search and Replace

You can use these regex patterns in VS Code's search and replace functionality to help with the migration.

### Text Colors

| Hard-coded Class                                  | Theme Variable      | Search Regex                      |
| ------------------------------------------------- | ------------------- | --------------------------------- |
| text-gray-400                                     | text-text-muted     | `\btext-gray-400\b`               |
| text-gray-500, text-gray-600                      | text-text-primary   | `\btext-gray-(500\|600)\b`        |
| text-gray-700, text-gray-800, text-gray-900       | text-text-secondary | `\btext-gray-(700\|800\|900)\b`   |
| text-red-500, text-red-600, text-red-700          | text-destructive    | `\btext-red-(500\|600\|700)\b`    |
| text-green-500, text-green-600, text-green-700    | text-success        | `\btext-green-(500\|600\|700)\b`  |
| text-blue-500, text-blue-600, text-blue-700       | text-info           | `\btext-blue-(500\|600\|700)\b`   |
| text-yellow-500, text-yellow-600, text-yellow-700 | text-warning        | `\btext-yellow-(500\|600\|700)\b` |
| text-indigo-500, text-indigo-600, text-indigo-700 | text-info           | `\btext-indigo-(500\|600\|700)\b` |

### Background Colors

| Hard-coded Class         | Theme Variable        | Search Regex             |
| ------------------------ | --------------------- | ------------------------ |
| bg-gray-50               | bg-background-primary | `\bbg-gray-50\b`         |
| bg-gray-100, bg-gray-200 | bg-accent             | `\bbg-gray-(100\|200)\b` |
| bg-red-50                | bg-destructive/10     | `\bbg-red-50\b`          |
| bg-red-100               | bg-destructive/20     | `\bbg-red-100\b`         |
| bg-green-50              | bg-success/10         | `\bbg-green-50\b`        |
| bg-green-100             | bg-success/20         | `\bbg-green-100\b`       |
| bg-blue-50               | bg-info/10            | `\bbg-blue-50\b`         |
| bg-blue-100              | bg-info/20            | `\bbg-blue-100\b`        |
| bg-yellow-50             | bg-warning/10         | `\bbg-yellow-50\b`       |
| bg-yellow-100            | bg-warning/20         | `\bbg-yellow-100\b`      |

### Border Colors

| Hard-coded Class                                  | Theme Variable        | Search Regex                      |
| ------------------------------------------------- | --------------------- | --------------------------------- |
| border-gray-100, border-gray-200, border-gray-300 | border-border-primary | `\bborder-gray-(100\|200\|300)\b` |
| border-red-200                                    | border-destructive/30 | `\bborder-red-200\b`              |
| border-green-200                                  | border-success/30     | `\bborder-green-200\b`            |
| border-blue-200                                   | border-info/30        | `\bborder-blue-200\b`             |

## VS Code Extension: Find and Replace

To make this process easier, you can install the "Find and Replace" extension in VS Code:

1. Press `Ctrl+Shift+X` (or `Cmd+Shift+X` on Mac) to open the Extensions panel
2. Search for "find and replace"
3. Install "Multi-Replace" by John Bito

### Setting up bulk replacements

Create a .replace.json file in your project with the content from our themeClasses.ts file converted to the format required by the extension.

## Suggestions for Replacing Classes

1. Start with one file at a time to ensure proper conversion
2. Begin with more isolated components before working on shared components
3. Test in both light and dark modes after each conversion
4. Use our themeClasses.ts as a reference for replacements

## Our Theme Color Variables

### Text colors

- text-text-primary: For medium emphasis text (replaces text-gray-500, text-gray-600)
- text-text-secondary: For high emphasis text (replaces text-gray-700+)
- text-text-muted: For low emphasis text (replaces text-gray-400)

### Semantic colors

- text-destructive / bg-destructive: For errors and destructive actions
- text-success / bg-success: For success states
- text-info / bg-info: For information and primary actions
- text-warning / bg-warning: For warnings and cautionary elements

### Background colors

- bg-background-primary: Main background (replaces bg-gray-50)
- bg-background-secondary: Component background (replaces white/bg-white)
- bg-accent: Subtle highlights and accents (replaces bg-gray-100)
