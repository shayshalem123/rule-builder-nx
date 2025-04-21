import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ruleService } from "@/features/rules/services/ruleService";
import { RuleWithMeta } from "@/features/rules/types/rule";
import { toast } from "sonner";

// Hook for fetching all rules
export const useRulesList = () => {
  return useQuery({
    queryKey: ["rules"],
    queryFn: ruleService.getRules,
  });
};

// Hook for deleting a rule
export const useDeleteRule = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => ruleService.deleteRule(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rules"] });
      toast.success("Rule deleted successfully");
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete rule: ${error.message}`);
    },
  });
};
