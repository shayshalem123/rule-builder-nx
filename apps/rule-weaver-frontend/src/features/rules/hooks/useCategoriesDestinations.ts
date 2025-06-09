import { useQuery } from '@tanstack/react-query';

import { ruleService } from '../services/ruleService';
import { JsonSchema } from './useExtraPropertiesSchemas';
import { CategoriesInfoMap, Operator } from '../types/rule';
import { useMemo } from 'react';
import { operators } from '../shared/utils/ruleUtils';

/**
 * Get available operators for a specific category-destination combination
 */
export const getAvailableOperators = (
  categoriesDestinationsMap: CategoriesInfoMap,
  category?: string,
  destination?: string
): Operator[] => {
  if (!category || !destination) {
    return operators.map((op) => op.value);
  }

  const destinationOperators =
    categoriesDestinationsMap[category]?.destinations?.[destination]
      ?.validOperators;

  if (!destinationOperators) {
    return operators.map((op) => op.value);
  }

  return destinationOperators;
};

/**
 * Hook for fetching categories, destinations and their extra properties
 * Uses React Query with infinite cache persistence (fetches only once)
 */
export const useCategoriesDestinations = () => {
  const {
    data: categoriesDestinationsMap = {} as CategoriesInfoMap,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['categories-destinations'],
    queryFn: ruleService.getCategoriesInfo,
    staleTime: Infinity,
    refetchOnMount: true,
  });

  const categories = useMemo(
    () => Object.keys(categoriesDestinationsMap),
    [categoriesDestinationsMap]
  );

  const categoryDestinationsMap = useMemo(
    () =>
      Object.fromEntries(
        Object.entries(categoriesDestinationsMap).map(
          ([category, categoryInfo]) => [
            category,
            Object.keys(categoryInfo.destinations),
          ]
        )
      ),
    [categoriesDestinationsMap]
  );

  const getExtraPropertiesSchema = (
    category: string,
    destination: string
  ): JsonSchema | null => {
    return (
      categoriesDestinationsMap[category]?.destinations?.[destination]
        ?.extraProperties ?? null
    );
  };

  const getSchemaIdForCategory = (category: string): string | null => {
    return categoriesDestinationsMap[category]?.schemaId ?? null;
  };

  const getOperatorsForCategoryDestination = (
    category?: string,
    destination?: string
  ): Operator[] => {
    return getAvailableOperators(
      categoriesDestinationsMap,
      category,
      destination
    );
  };

  return {
    categoriesDestinationsMap,
    categoryDestinationsMap,
    getExtraPropertiesSchema,
    getSchemaIdForCategory,
    getOperatorsForCategoryDestination,
    isLoading,
    error,
    categories,
  };
};
