import { useQuery } from "@tanstack/react-query";
import { ruleService } from "@/features/rules/services/ruleService";

export const useRuleDetails = (id: string) => {
  return useQuery({
    queryKey: ["rules", id],
    queryFn: () => ruleService.getRule(id),
    enabled: !!id,
  });
};
