import React from "react";
import { RuleWithMeta } from "@/features/rules/types/rule";
import { RuleFormValues } from "../hooks/useRuleForm";
import { DiffModal } from "@/shared/components/diff";

interface RuleDiffModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialRule?: RuleWithMeta;
  currentValues: RuleFormValues;
}

const RuleDiffModal: React.FC<RuleDiffModalProps> = ({
  isOpen,
  onClose,
  initialRule,
  currentValues,
}) => {
  const formatRuleJson = (rule: RuleWithMeta | Record<string, unknown>) => {
    return JSON.stringify(rule, null, 2);
  };

  const originalJson = initialRule ? formatRuleJson(initialRule) : "{}"; // Empty object if no initial rule (new rule)

  const modifiedJson = formatRuleJson({
    ...initialRule,
    name: currentValues.name,
    description: currentValues.description,
    destination: currentValues.destination,
    category: currentValues.category,
    rule: currentValues.rule,
  });

  return (
    <DiffModal
      isOpen={isOpen}
      onClose={onClose}
      title="Rule Changes"
      original={originalJson}
      modified={modifiedJson}
      language="json"
      renderSideBySide={true}
    />
  );
};

export default RuleDiffModal;
