import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ruleService } from "@/features/rules/services/ruleService";
import { Rule, RuleWithMeta } from "@/features/rules/types/rule";
import { toast } from "sonner";
import { useUser } from "@/features/users/contexts/UserContext";

// Hook for creating a new rule
export const useCreateRule = () => {
  const queryClient = useQueryClient();
  const { currentUser } = useUser();

  return useMutation({
    mutationFn: (
      rule: Omit<RuleWithMeta, "id" | "createdAt" | "updatedAt">
    ) => {
      if (!currentUser) {
        throw new Error("User must be logged in to create a rule");
      }
      return ruleService.createRule(rule, currentUser);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rules"] });
      toast.success("Rule created successfully");
    },
    onError: (error: Error) => {
      toast.error(`Failed to create rule: ${error.message}`);
    },
  });
};

// Hook for updating an existing rule
export const useUpdateRule = () => {
  const queryClient = useQueryClient();
  const { currentUser } = useUser();

  return useMutation({
    mutationFn: ({
      id,
      rule,
    }: {
      id: string;
      rule: Omit<RuleWithMeta, "id" | "createdAt" | "updatedAt">;
    }) => {
      if (!currentUser) {
        throw new Error("User must be logged in to update a rule");
      }
      return ruleService.updateRule(id, rule, currentUser);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["rules"] });
      queryClient.invalidateQueries({ queryKey: ["rules", variables.id] });
      toast.success("Rule updated successfully");
    },
    onError: (error: Error) => {
      toast.error(`Failed to update rule: ${error.message}`);
    },
  });
};
