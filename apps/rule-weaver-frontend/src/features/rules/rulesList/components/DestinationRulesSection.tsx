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
    <div className="bg-background-primary rounded-lg border border-border-primary shadow-sm dark:shadow-md dark:shadow-white/5 mb-8 overflow-hidden">
      <div className="bg-button-primary px-6 py-4">
        <h2 className="text-xl font-semibold text-button-primary-foreground">
          Destination: <span className="font-bold">{destination}</span>
        </h2>
      </div>
      <div className="p-6">
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
    </div>
  );
};

export default DestinationRulesSection;
