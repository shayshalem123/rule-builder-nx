import { useQuery } from "@tanstack/react-query";
import { ruleService } from "../services/ruleService";

// Define the type for JSON schema properties
export interface JsonSchemaProperty {
  type: "string" | "number" | "boolean";
  enum?: string[];
  minimum?: number;
  maximum?: number;
}

// Define the type for JSON schema
export interface JsonSchema {
  type: "object";
  properties: Record<string, JsonSchemaProperty>;
  additionalProperties?: boolean;
  required?: string[];
}

// Define the type for extra properties schemas
export type ExtraPropertiesSchemas = Record<string, Record<string, JsonSchema>>;

/**
 * Custom hook to fetch all extra properties schemas
 */
export const useExtraPropertiesSchemas = () => {
  return useQuery({
    queryKey: ["extraPropertiesSchemas"],
    queryFn: async (): Promise<ExtraPropertiesSchemas> => {
      const schemas = await ruleService.getExtraPropertiesSchemas();
      return schemas as ExtraPropertiesSchemas;
    },
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
    gcTime: 30 * 60 * 1000, // Keep in cache for 30 minutes
  });
};

/**
 * Custom hook to get the current schema based on category and destination
 */
export const useCurrentExtraPropertiesSchema = (
  category: string | undefined,
  destination: string | undefined
) => {
  const { data: schemas, isLoading, error } = useExtraPropertiesSchemas();

  return {
    schema: schemas?.[category]?.[destination] ?? null,
    isLoading,
    error,
    allSchemas: schemas,
  };
};
