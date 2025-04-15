import { User } from "@/features/users/types/user";

export interface SchemaProperty {
  type: string;
  description?: string;
  enum?: string[];
  format?: string;
  default?: any;
  required?: boolean | string[];
  properties?: Record<string, SchemaProperty>;
}

export interface SchemaDefinition {
  properties: Record<string, SchemaProperty>;
  required?: string[];
}

export interface Schema {
  id?: string;
  name: string;
  description?: string;
  category: string;
  version: string;
  definition: SchemaDefinition;
}

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
