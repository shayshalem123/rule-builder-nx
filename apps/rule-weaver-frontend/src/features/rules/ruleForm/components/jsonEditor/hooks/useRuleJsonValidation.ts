import { useCategoriesDestinations } from '@/features/rules/hooks/useCategoriesDestinations';
import { createBaseSchema } from '@/features/rules/shared/hooks/useRuleValidation';
import { CategoriesInfoMap } from '@/features/rules/types/rule';
import { SchemaDefinition } from '@/features/schemas/types/schema';
import { useMemo } from 'react';
import zodToJsonSchema from 'zod-to-json-schema';
import { jsonSchemaToZod } from '@n8n/json-schema-to-zod';
import * as z from 'zod';

export const useRuleJsonValidation = (options: {
  schema: SchemaDefinition;
  categoryDestinationsMap: CategoriesInfoMap;
  selectedDestination: string;
  selectedCategory: string;
}) => {
  const { categoriesDestinationsMap } = useCategoriesDestinations();

  const ruleJsonSchema = useMemo(() => {
    return createRuleJsonSchema({
      categoryDestinationsMap: categoriesDestinationsMap,
      schema: options.schema,
      selectedDestination: options.selectedDestination,
      selectedCategory: options.selectedCategory,
    });
  }, [
    categoriesDestinationsMap,
    options.schema,
    options.selectedDestination,
    options.selectedCategory,
  ]);

  return {
    ruleJsonSchema,
  };
};

export const createRuleJsonSchema = (options: {
  categoryDestinationsMap: CategoriesInfoMap;
  schema?: SchemaDefinition | null;
  selectedDestination?: string;
  selectedCategory?: string;
}) => {
  const {
    categoryDestinationsMap,
    schema,
    selectedDestination,
    selectedCategory,
  } = options;

  if (!selectedDestination || !selectedCategory || !schema) {
    return null;
  }

  const zodSchema = createSchemaForDestination({
    schema,
    categoryDestinationsMap,
    selectedDestination,
    selectedCategory,
  });

  const baseRuleSchema = zodToJsonSchema(zodSchema);

  return baseRuleSchema;
};

/**
 * Creates a schema for a specific destination
 */
export const createSchemaForDestination = (options: {
  schema: SchemaDefinition;
  categoryDestinationsMap: CategoriesInfoMap;
  selectedDestination: string;
  selectedCategory: string;
}) => {
  const {
    schema,
    categoryDestinationsMap,
    selectedDestination,
    selectedCategory,
  } = options;

  const categoryOptions = Object.keys(categoryDestinationsMap);
  const destinationOptions = Object.keys(
    categoryDestinationsMap[selectedCategory]?.destinations || {}
  );
  const typeOptions =
    categoryDestinationsMap?.[selectedCategory]?.destinations?.[
      selectedDestination
    ]?.typeOptions?.options || [];

  const extraPropertiesSchema =
    categoryDestinationsMap?.[selectedCategory]?.destinations?.[
      selectedDestination
    ]?.extraProperties;

  const baseRuleSchema = createBaseSchema({
    schema,
    categoryDestinationsMap,
    category: selectedCategory,
    destination: selectedDestination,
  });

  const baseSchema = baseRuleSchema
    .extend({
      destination: z.enum(destinationOptions as [string, ...string[]]),
      category: z.enum(categoryOptions as [string, ...string[]]),
      type: z.enum(typeOptions as [string, ...string[]]),
      ...(extraPropertiesSchema
        ? {
            extraProperties: jsonSchemaToZod(
              extraPropertiesSchema
            ) as z.ZodType,
          }
        : {}),
    })
    .strict();

  return baseSchema;
};
