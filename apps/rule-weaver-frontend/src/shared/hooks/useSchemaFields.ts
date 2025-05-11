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
  fieldInfos: FieldInfo[];
  fieldMap: Record<string, string>;
}

export interface FieldInfo {
  path: string;
  type: string;
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
 * Recursively processes a schema's properties to extract leaf field paths with their types
 * @param properties The properties object to process
 * @param parentPath The current parent path (for nested fields)
 * @returns Array of field info objects with paths and types
 */
export const getSchemaFieldsWithTypes = (
  properties: Record<string, SchemaProperty> = {},
  parentPath = ""
): FieldInfo[] => {
  const fields: FieldInfo[] = [];

  for (const [key, property] of Object.entries(properties)) {
    const currentPath = parentPath ? `${parentPath}.${key}` : key;

    if (property.type === "object" && property.properties) {
      // For objects, process their nested properties and add to results
      const nestedFields = getSchemaFieldsWithTypes(
        property.properties,
        currentPath
      );
      fields.push(...nestedFields);
    } else {
      // Only add leaf paths (non-object properties)
      fields.push({
        path: currentPath,
        type: property.type,
      });
    }
  }

  return fields;
};

/**
 * Create a map of field paths to their types
 * @param properties The properties object to process
 * @param parentPath The current parent path (for nested fields)
 * @returns Object with field paths as keys and types as values
 */
export const getSchemaFieldMap = (
  properties: Record<string, SchemaProperty> = {},
  parentPath = ""
): Record<string, string> => {
  const fieldMap: Record<string, string> = {};

  for (const [key, property] of Object.entries(properties)) {
    const currentPath = parentPath ? `${parentPath}.${key}` : key;

    if (property.type === "object" && property.properties) {
      // For objects, process their nested properties and add to results
      const nestedMap = getSchemaFieldMap(property.properties, currentPath);
      Object.assign(fieldMap, nestedMap);
    } else {
      // Only add leaf paths (non-object properties)
      fieldMap[currentPath] = property.type;
    }
  }

  return fieldMap;
};

/**
 * Extract field paths from any schema definition format
 * This function can work with Schema objects, SchemaWithMeta objects, or direct SchemaDefinition objects
 *
 * @param schema The schema to extract fields from (can be Schema, SchemaWithMeta, or SchemaDefinition)
 * @returns Array of field paths
 */
export const extractFieldPathsFromSchema = (
  schema: Schema | SchemaWithMeta | SchemaDefinition | null | undefined
): string[] => {
  if (!schema) return [];

  // Extract definition if a full schema object was provided
  const definition = "definition" in schema ? schema.definition : schema;

  // If the schema has properties, extract field paths
  if (definition && definition.properties) {
    return getSchemaFieldPaths(definition.properties);
  }

  return [];
};

/**
 * Extract field information including paths and types from any schema definition format
 *
 * @param schema The schema to extract fields from (can be Schema, SchemaWithMeta, or SchemaDefinition)
 * @returns Array of field info objects with paths and types
 */
export const extractFieldInfoFromSchema = (
  schema: Schema | SchemaWithMeta | SchemaDefinition | null | undefined
): FieldInfo[] => {
  if (!schema) return [];

  // Extract definition if a full schema object was provided
  const definition = "definition" in schema ? schema.definition : schema;

  // If the schema has properties, extract field paths with types
  if (definition && definition.properties) {
    return getSchemaFieldsWithTypes(definition.properties);
  }

  return [];
};

/**
 * Extract field map with paths as keys and types as values from any schema definition format
 *
 * @param schema The schema to extract fields from (can be Schema, SchemaWithMeta, or SchemaDefinition)
 * @returns Object with field paths as keys and types as values
 */
export const extractFieldMapFromSchema = (
  schema: Schema | SchemaWithMeta | SchemaDefinition | null | undefined
): Record<string, string> => {
  if (!schema) return {};

  // Extract definition if a full schema object was provided
  const definition = "definition" in schema ? schema.definition : schema;

  // If the schema has properties, extract field map
  if (definition && definition.properties) {
    return getSchemaFieldMap(definition.properties);
  }

  return {};
};

/**
 * Hook that analyzes a schema definition and returns field statistics and paths
 * @param schemaInput Schema or schema definition to analyze
 * @returns Object containing count of leaf fields, array of all field paths, field infos, and field map
 */
export const useSchemaFields = (
  schemaInput?: Schema | SchemaWithMeta | SchemaDefinition | null
): SchemaFieldInfo => {
  const fieldMap = useMemo(() => {
    return extractFieldMapFromSchema(schemaInput);
  }, [schemaInput]);

  const fieldInfos = useMemo(() => {
    return extractFieldInfoFromSchema(schemaInput);;
  }, [schemaInput]);

  const fieldPaths = useMemo(() => {
    return Object.keys(fieldMap);
  }, [fieldMap]);

  return {
    fieldCount: fieldPaths.length,
    fieldPaths,
    fieldInfos,
    fieldMap,
  };
};

export default useSchemaFields;
