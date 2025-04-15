import { useMemo } from "react";
import {
  SchemaDefinition,
  SchemaProperty,
  Schema,
  SchemaWithMeta,
} from "../types/schema";

interface SchemaFieldInfo {
  leafFieldCount: number;
  fieldPaths: string[];
}

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
      return { leafFieldCount: 0, fieldPaths: [] };
    }

    // Extract definition if a full schema object was provided
    const definition =
      "definition" in schemaInput ? schemaInput.definition : schemaInput;

    const fieldPaths: string[] = [];

    // Recursively process the properties to count leaf fields and build paths
    const processProperties = (
      properties: Record<string, SchemaProperty> = {},
      parentPath = ""
    ): number => {
      let count = 0;

      for (const [key, property] of Object.entries(properties)) {
        const currentPath = parentPath ? `${parentPath}.${key}` : key;

        // Always add the current path to our list of paths
        fieldPaths.push(currentPath);

        if (property.type === "object" && property.properties) {
          // For objects, process their nested properties
          count += processProperties(property.properties, currentPath);
        } else {
          // Count non-object property as a leaf field
          count += 1;
        }
      }

      return count;
    };

    const leafFieldCount = processProperties(definition.properties);

    // Sort paths by length and then alphabetically for predictable autocomplete
    fieldPaths.sort((a, b) => {
      // First sort by number of segments (dots)
      const aDots = (a.match(/\./g) || []).length;
      const bDots = (b.match(/\./g) || []).length;

      if (aDots !== bDots) {
        return aDots - bDots;
      }

      // Then sort alphabetically
      return a.localeCompare(b);
    });

    return { leafFieldCount, fieldPaths };
  }, [schemaInput]);
};

export default useSchemaFields;
