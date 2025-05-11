export interface SchemaProperty {
  type: string;
  description?: string;
  enum?: string[];
  format?: string;
  default?: string | number | boolean | null;
  required?: boolean | string[];
  properties?: Record<string, SchemaProperty>;
}

export type SchemaDefinition = Record<string, any>;

// Interface for creating a new schema (ID is not yet assigned)
export interface Schema {
  id: string;
  name: string;
  description?: string;
  category: string;
  version: string;
  definition: Record<string, any>;
}

// Interface for existing schemas (ID is required)
export type CreateSchema = Omit<Schema, "id">;

export interface SchemaWithMeta extends Schema {
  createdAt?: string;
  updatedAt?: string;
  createdBy?: {
    id: string;
    name: string;
  };
  updatedBy?: {
    id: string;
    name: string;
  };
}

// Categories matching the existing rule categories
export const categoryOptions = ["partners-images", "partners-algo"];
