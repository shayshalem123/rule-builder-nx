import React from "react";
import { useNavigate } from "react-router-dom";

import { RuleWithMeta } from "@/features/rules/types/rule";
import RuleList from "./RuleList";

interface DestinationRulesSectionProps {
  destination: string;
  rules: RuleWithMeta[];
  isLoading: boolean;
  error: Error | null;
  onCreateRule: () => void;
  refetch: () => void;
}

const DestinationRulesSection: React.FC<DestinationRulesSectionProps> = ({
  destination,
  rules,
  isLoading,
  error,
  onCreateRule,
  refetch,
}) => {
  const navigate = useNavigate();

  const handleEditRule = (rule: RuleWithMeta) => {
    navigate(`/rules/edit/${rule.id}`);
  };

  const handleViewRule = (rule: RuleWithMeta) => {
    navigate(`/rules/${rule.id}`);
  };

  const handleRuleDelete = () => {
    refetch();
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Destination {destination}</h2>
      <RuleList
        rules={rules}
        isLoading={isLoading}
        error={error}
        onCreateRule={onCreateRule}
        onEditRule={handleEditRule}
        onViewRule={handleViewRule}
        onDelete={handleRuleDelete}
        showHeader={false}
      />
    </div>
  );
};

export default DestinationRulesSection;
