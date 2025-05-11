import { jsonSchemaToZod } from "@n8n/json-schema-to-zod";
import * as z from "zod";
import {
  extractFieldPathsFromSchema,
  extractFieldInfoFromSchema,
  extractFieldMapFromSchema,
} from "@/shared/hooks/useSchemaFields";
import { SchemaDefinition } from "@/features/schemas/types/schema";
import { CategoriesInfoMap } from "../../types/rule";
import { useMemo } from "react";

/**
 * Hook for rule validation that combines all validation functionality
 */
export const useRuleValidation = (options: {
  schema?: SchemaDefinition | null;
  categoryDestinationsMap: CategoriesInfoMap;
  selectedDestination?: string;
  selectedCategory?: string;
}) => {
  const { schema, categoryDestinationsMap } = options;

  const zodValidationSchema = useMemo(() => {
    if (Object.keys(categoryDestinationsMap).length === 0) return null;

    return createRuleValidationSchemaZod({
      schema,
      categoryDestinationsMap,
    });
  }, [schema, categoryDestinationsMap]);

  const formikValidationSchema = useMemo(() => {
    if (!zodValidationSchema) return null;

    return customZodToFormik(zodValidationSchema);
  }, [zodValidationSchema]);

  return {
    zodValidationSchema,
    formikValidationSchema,
  };
};

export function customZodToFormik(schema: z.ZodType) {
  return (values: unknown) => {
    const result = schema.safeParse(values);
    if (result.success) return {};

    const formikErrors: Record<string, string> = {};
    if (!result.success) {
      result.error.issues.forEach((issue) => {
        const path = issue.path.join(".");
        if (!formikErrors[path]) {
          formikErrors[path] = issue.message;
        }
      });
    }

    return formikErrors;
  };
}

// Define all supported operators
export type Operator = "EQUALS" | "NOT_EQUALS" | "IN";
const SINGLE_VALUE_OPERATORS = ["EQUALS", "NOT_EQUALS"] as const;
const ARRAY_VALUE_OPERATORS = ["IN"] as const;

export const createBaseRuleZodSchema = (options: {
  schema?: SchemaDefinition | null;
}) => {
  const { schema } = options;
  const schemaFieldPaths = extractFieldPathsFromSchema(schema);
  const fieldMap = extractFieldMapFromSchema(schema);

  // Helper to create appropriate validator based on field type
  const createValueValidator = (
    fieldPath: string,
    operator: Operator
  ): z.ZodTypeAny => {
    // Get the field type directly from the field map
    const fieldType = fieldMap[fieldPath];

    // Default validators if type isn't found or isn't supported
    const defaultValidators: Record<Operator, z.ZodTypeAny> = {
      EQUALS: z.string().min(1),
      NOT_EQUALS: z.string().min(1),
      IN: z.array(z.string().min(1)).min(1),
    };

    if (!fieldType) return defaultValidators[operator];

    // Create type-specific validators
    switch (fieldType) {
      case "number":
      case "integer":
        return operator === "IN" ? z.array(z.number()).min(1) : z.number();
      case "boolean":
        return operator === "IN" ? z.array(z.boolean()).min(1) : z.boolean();
      // Handle more types here as needed
      default:
        return defaultValidators[operator];
    }
  };

  // Create a union of all possible field-operator combinations
  const ruleSchemas = schemaFieldPaths.flatMap((fieldPath) => {
    // Create schema for single-value operators
    const singleValueSchema = z
      .object({
        field: z.literal(fieldPath),
        operator: z.enum(SINGLE_VALUE_OPERATORS),
        value: createValueValidator(fieldPath, "EQUALS"), // Use EQUALS as representative for single value types
      })
      .strict();

    // Create schema for array-value operators
    const arrayValueSchema = z
      .object({
        field: z.literal(fieldPath),
        operator: z.enum(ARRAY_VALUE_OPERATORS),
        value: createValueValidator(fieldPath, "IN"),
      })
      .strict();

    return [singleValueSchema, arrayValueSchema];
  });

  // Create a discriminated union with both field and operator as discriminants
  if (ruleSchemas.length === 0) {
    // Fallback for empty schemas
    return z
      .object({
        field: z.string(),
        operator: z.enum(["EQUALS", "NOT_EQUALS", "IN"] as const),
        value: z.union([z.string(), z.array(z.string())]),
      })
      .strict();
  } else if (ruleSchemas.length === 1) {
    return ruleSchemas[0];
  } else {
    // Use a type assertion to create the union
    return z.union(
      ruleSchemas as unknown as [z.ZodTypeAny, z.ZodTypeAny, ...z.ZodTypeAny[]]
    );
  }
};

export const createBaseSchema = (options: { schema: SchemaDefinition }) => {
  const { schema } = options;

  const baseRuleSchema = createBaseRuleZodSchema({ schema });

  const ruleTypeSchema = z.lazy(() =>
    z.union([
      baseRuleSchema,
      z.object({ AND: z.array(ruleTypeSchema).min(1) }).strict(),
      z.object({ OR: z.array(ruleTypeSchema).min(1) }).strict(),
    ])
  );

  const baseSchema = z
    .object({
      name: z.string().min(1, "Rule name is required"),
      description: z.string().optional(),
      rule: ruleTypeSchema,
    })
    .strict();

  return baseSchema;
};

/**
 * Creates a rule validation schema using Zod
 */
export const createRuleValidationSchemaZod = (options: {
  schema?: SchemaDefinition | null;
  categoryDestinationsMap: CategoriesInfoMap;
}) => {
  const { schema, categoryDestinationsMap } = options;

  const baseSchema = createBaseSchema({ schema });

  const categoriesSchemas = Object.entries(categoryDestinationsMap)
    .map(([category, categoryInfo]) => {
      return Object.entries(categoryInfo.destinations).map(
        ([destinationKey, data]) => {
          const schemaObj = {
            category: z.literal(category),
            destination: z.literal(destinationKey),
            type: z.string(),
          };

          if (data.extraProperties) {
            return baseSchema
              .extend({
                ...schemaObj,
                extraProperties: jsonSchemaToZod(
                  data.extraProperties
                ) as z.ZodType,
              })
              .strict();
          }

          return baseSchema.extend(schemaObj).strict();
        }
      );
    })
    .flat();

  // Handle the case with multiple schemas or a single schema
  if (categoriesSchemas.length === 0) {
    throw new Error("No schemas found for categories and destinations");
  } else if (categoriesSchemas.length === 1) {
    return categoriesSchemas[0];
  } else {
    // When we have 2+ schemas, we need to use type assertion
    // This is safe because we've verified we have at least 2 schemas
    return z.union(
      categoriesSchemas as unknown as [
        z.ZodTypeAny,
        z.ZodTypeAny,
        ...z.ZodTypeAny[]
      ]
    );
  }
};
