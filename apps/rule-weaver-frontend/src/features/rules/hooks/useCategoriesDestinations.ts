import { useQuery } from "@tanstack/react-query";

import { ruleService } from "../services/ruleService";
import { JsonSchema } from "./useExtraPropertiesSchemas";
import { CategoriesInfoMap } from "../types/rule";
import { useMemo } from "react";

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
    queryKey: ["categories-destinations"],
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

  return {
    categoriesDestinationsMap,
    categoryDestinationsMap,
    getExtraPropertiesSchema,
    getSchemaIdForCategory,
    isLoading,
    error,
    categories,
  };
};
