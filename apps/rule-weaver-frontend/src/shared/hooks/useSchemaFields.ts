import { useMemo } from "react";
import {
  SchemaDefinition,
  SchemaProperty,
  Schema,
  SchemaWithMeta,
} from "../../features/schemas/types/schema";

export interface SchemaFieldInfo {
  fieldCount: number;
  fieldPaths: string[];
}

/**
 * Recursively processes a schema's properties to extract leaf field paths
 * @param properties The properties object to process
 * @param parentPath The current parent path (for nested fields)
 * @returns Array of leaf field paths
 */
export const getSchemaFieldPaths = (
  properties: Record<string, SchemaProperty> = {},
  parentPath = ""
): string[] => {
  const fieldPaths: string[] = [];

  for (const [key, property] of Object.entries(properties)) {
    const currentPath = parentPath ? `${parentPath}.${key}` : key;

    if (property.type === "object" && property.properties) {
      // For objects, process their nested properties and add to results
      const nestedPaths = getSchemaFieldPaths(property.properties, currentPath);
      fieldPaths.push(...nestedPaths);
    } else {
      // Only add leaf paths (non-object properties)
      fieldPaths.push(currentPath);
    }
  }

  return fieldPaths;
};

/**
 * Hook that analyzes a schema definition and returns field statistics and paths
 * @param schemaInput Schema or schema definition to analyze
 * @returns Object containing count of leaf fields and array of all field paths
 */
export const useSchemaFields = (
  schemaInput?: Schema | SchemaWithMeta | SchemaDefinition | null
): SchemaFieldInfo => {
  return useMemo(() => {
    if (!schemaInput) {
      return { fieldCount: 0, fieldPaths: [] };
    }

    // Extract definition if a full schema object was provided
    const definition =
      "definition" in schemaInput ? schemaInput.definition : schemaInput;

    const fieldPaths = getSchemaFieldPaths(definition.properties);

    return {
      fieldCount: fieldPaths.length,
      fieldPaths,
    };
  }, [schemaInput]);
};

export default useSchemaFields;
