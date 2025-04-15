import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ruleService } from "@/features/rules/services/ruleService";
import { RuleWithMeta } from "@/features/rules/types/rule";
import { toast } from "sonner";

export const useRules = () => {
  return useQuery({
    queryKey: ["rules"],
    queryFn: ruleService.getRules,
  });
};

export const useRule = (id: string) => {
  return useQuery({
    queryKey: ["rules", id],
    queryFn: () => ruleService.getRule(id),
    enabled: !!id,
  });
};

export const useCreateRule = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (rule: Omit<RuleWithMeta, "id" | "createdAt" | "updatedAt">) =>
      ruleService.createRule(rule),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rules"] });
      toast.success("Rule created successfully");
    },
    onError: (error: Error) => {
      toast.error(`Failed to create rule: ${error.message}`);
    },
  });
};

export const useUpdateRule = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      rule,
    }: {
      id: string;
      rule: Omit<RuleWithMeta, "id" | "createdAt" | "updatedAt">;
    }) => ruleService.updateRule(id, rule),
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
