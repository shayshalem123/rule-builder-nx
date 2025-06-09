import { jsonSchemaToZod } from '@n8n/json-schema-to-zod';
import * as z from 'zod';
import {
  extractFieldPathsFromSchema,
  extractFieldMapFromSchema,
} from '@/shared/hooks/useSchemaFields';
import { SchemaDefinition } from '@/features/schemas/types/schema';
import { CategoriesInfoMap } from '../../types/rule';
import { useMemo } from 'react';
import { getAvailableOperators } from '../../hooks/useCategoriesDestinations';

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
        const path = issue.path.join('.');
        if (!formikErrors[path]) {
          formikErrors[path] = issue.message;
        }
      });
    }

    return formikErrors;
  };
}

// Define all supported operators
export type Operator = 'EQUALS' | 'NOT_EQUALS' | 'IN';

/**
 * Split operators into single-value and array-value categories
 */
const categorizeOperators = (availableOperators: Operator[]) => {
  const singleValueOps = availableOperators.filter(
    (op) => op === 'EQUALS' || op === 'NOT_EQUALS'
  );
  const arrayValueOps = availableOperators.filter((op) => op === 'IN');

  return { singleValueOps, arrayValueOps };
};

export const createBaseRuleZodSchema = (options: {
  schema?: SchemaDefinition | null;
  categoryDestinationsMap?: CategoriesInfoMap;
  category?: string;
  destination?: string;
}) => {
  const {
    schema,
    categoryDestinationsMap = {},
    category,
    destination,
  } = options;
  const schemaFieldPaths = extractFieldPathsFromSchema(schema);
  const fieldMap = extractFieldMapFromSchema(schema);

  const availableOperators = getAvailableOperators(
    categoryDestinationsMap,
    category,
    destination
  );
  const { singleValueOps, arrayValueOps } =
    categorizeOperators(availableOperators);

  const createValueValidator = (
    fieldPath: string,
    operator: Operator
  ): z.ZodTypeAny => {
    const fieldType = fieldMap[fieldPath];

    const defaultValidators: Record<Operator, z.ZodTypeAny> = {
      EQUALS: z.string().min(1),
      NOT_EQUALS: z.string().min(1),
      IN: z.array(z.string().min(1)).min(1),
    };

    if (!fieldType) return defaultValidators[operator];

    switch (fieldType) {
      case 'number':
      case 'integer':
        return operator === 'IN' ? z.array(z.number()).min(1) : z.number();
      case 'boolean':
        return operator === 'IN' ? z.array(z.boolean()).min(1) : z.boolean();
      default:
        return defaultValidators[operator];
    }
  };

  const ruleSchemas: z.ZodTypeAny[] = [];

  schemaFieldPaths.forEach((fieldPath) => {
    if (singleValueOps.length > 0) {
      const singleValueSchema = z
        .object({
          field: z.literal(fieldPath),
          operator: z.enum(singleValueOps as [Operator, ...Operator[]]),
          value: createValueValidator(fieldPath, 'EQUALS'),
        })
        .strict();

      ruleSchemas.push(singleValueSchema);
    }

    if (arrayValueOps.length > 0) {
      const arrayValueSchema = z
        .object({
          field: z.literal(fieldPath),
          operator: z.enum(arrayValueOps as [Operator, ...Operator[]]),
          value: createValueValidator(fieldPath, 'IN'),
        })
        .strict();

      ruleSchemas.push(arrayValueSchema);
    }
  });

  if (ruleSchemas.length === 0) {
    return z
      .object({
        field: z.string(),
        operator:
          availableOperators.length > 0
            ? z.enum(availableOperators as [Operator, ...Operator[]])
            : z.enum(['EQUALS', 'NOT_EQUALS', 'IN'] as const),
        value: z.union([z.string(), z.array(z.string())]),
      })
      .strict();
  } else if (ruleSchemas.length === 1) {
    return ruleSchemas[0];
  } else {
    return z.union(
      ruleSchemas as unknown as [z.ZodTypeAny, z.ZodTypeAny, ...z.ZodTypeAny[]]
    );
  }
};

export const createBaseSchema = (options: {
  schema: SchemaDefinition;
  categoryDestinationsMap?: CategoriesInfoMap;
  category?: string;
  destination?: string;
}) => {
  const { schema, categoryDestinationsMap, category, destination } = options;

  const baseRuleSchema = createBaseRuleZodSchema({
    schema,
    categoryDestinationsMap,
    category,
    destination,
  });

  const ruleTypeSchema = z.lazy(() =>
    z.union([
      baseRuleSchema,
      z.object({ AND: z.array(ruleTypeSchema).min(1) }).strict(),
      z.object({ OR: z.array(ruleTypeSchema).min(1) }).strict(),
    ])
  );

  const baseSchema = z
    .object({
      name: z.string().min(1, 'Rule name is required'),
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

  const categoriesSchemas = Object.entries(categoryDestinationsMap)
    .map(([category, categoryInfo]) => {
      return Object.entries(categoryInfo.destinations).map(
        ([destinationKey, data]) => {
          const baseSchema = createBaseSchema({
            schema,
            categoryDestinationsMap,
            category,
            destination: destinationKey,
          });

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

  if (categoriesSchemas.length === 0) {
    throw new Error('No schemas found for categories and destinations');
  } else if (categoriesSchemas.length === 1) {
    return categoriesSchemas[0];
  } else {
    return z.union(
      categoriesSchemas as unknown as [
        z.ZodTypeAny,
        z.ZodTypeAny,
        ...z.ZodTypeAny[]
      ]
    );
  }
};
