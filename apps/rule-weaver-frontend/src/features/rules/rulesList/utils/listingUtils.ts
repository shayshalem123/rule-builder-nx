import { RuleWithMeta } from "@/features/rules/types/rule";

// Group rules by destination
export const getGroupedRulesByDestination = (
  rules: RuleWithMeta[]
): Record<string, RuleWithMeta[]> => {
  return rules.reduce<Record<string, RuleWithMeta[]>>((acc, rule) => {
    const destination = rule.destination;
    if (!acc[destination]) {
      acc[destination] = [];
    }
    acc[destination].push(rule);
    return acc;
  }, {});
};

// Filter rules by search query
export const filterRulesByQuery = (
  rules: RuleWithMeta[],
  query: string
): RuleWithMeta[] => {
  if (!query.trim()) return rules;

  const lowerQuery = query.toLowerCase();
  return rules.filter((rule) => {
    const searchableValues = [
      rule.name,
      rule.description || "",
      // Category and destination are now filtered with dropdown selects
    ].map((value) => value.toLowerCase());

    return searchableValues.some((value) => value.includes(lowerQuery));
  });
};
