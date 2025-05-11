// Define a generic type for JSON data
export type JsonValue =
  | string
  | number
  | boolean
  | null
  | { [key: string]: JsonValue }
  | JsonValue[];
export type JsonData = { [key: string]: JsonValue };

// Re-export TestCase from the main types file for convenience
export type { TestCase } from "@/features/rules/types/rule"; 