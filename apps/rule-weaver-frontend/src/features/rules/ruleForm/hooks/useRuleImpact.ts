import { useMutation, useQuery } from "@tanstack/react-query";
import { ruleEvaluationService } from "@/features/rules/services/ruleEvaluationService";
import { RuleWithMeta } from "@/features/rules/types/rule";
import { useState, useEffect, useRef } from "react";

// Define the DateRange type
export type DateRange = "all" | "day" | "week" | "month";

/**
 * Hook to fetch and manage document impact analysis for rules
 * Shows how many documents would be affected by a rule change
 */
export function useRuleImpact(
  rule?: RuleWithMeta,
  dateRange: DateRange = "all"
) {
  const [shouldFetch, setShouldFetch] = useState(false);
  const isMounted = useRef(true);

  // Reset shouldFetch when rule or dateRange changes
  useEffect(() => {
    setShouldFetch(false);
  }, [rule, dateRange]);

  // Cleanup effect
  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  // Query for impact data
  const impactQuery = useQuery({
    queryKey: ["ruleImpact", rule?.id, dateRange, shouldFetch],
    queryFn: async () => {
      if (!rule || !shouldFetch) {
        return null;
      }
      return await ruleEvaluationService.evaluateDocumentImpact(
        rule,
        dateRange
      );
    },
    enabled: !!rule && shouldFetch,
    staleTime: 30000, // Consider data fresh for 30 seconds
  });

  // Mutation to trigger impact analysis
  const triggerImpactAnalysis = useMutation({
    mutationFn: async () => {
      setShouldFetch(true);
      return true;
    },
  });

  return {
    impactData: impactQuery.data,
    isLoading: shouldFetch && impactQuery.isPending,
    isError: impactQuery.isError,
    error: impactQuery.error,
    triggerImpactAnalysis,
    refetch: impactQuery.refetch,
  };
}
