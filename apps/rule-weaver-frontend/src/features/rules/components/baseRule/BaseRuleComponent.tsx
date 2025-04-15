import React from "react";
import {
  BaseRule,
  Operator,
  AndRule,
  OrRule,
} from "@/features/rules/types/rule";
import {
  createEmptyAndRule,
  createEmptyOrRule,
} from "@/features/rules/utils/ruleUtils";
import FieldInput from "./field";
import OperatorSelect from "./operator";
import ValueInputContainer from "./value";
import RuleActions from "./actions";

interface BaseRuleComponentProps {
  rule: BaseRule;
  onChange: (updatedRule: BaseRule | AndRule | OrRule) => void;
  onDelete?: () => void;
  showDelete?: boolean;
}

const BaseRuleComponent: React.FC<BaseRuleComponentProps> = ({
  rule,
  onChange,
  onDelete,
  showDelete = true,
}) => {
  const handleFieldChange = (value: string) => {
    onChange({ ...rule, field: value });
  };

  const handleOperatorChange = (value: Operator) => {
    // Clear value when switching operators
    if (value === "IN") {
      // When switching to IN, set empty array
      onChange({ ...rule, operator: value, value: [] });
    } else {
      // When switching to other operators, set empty string
      onChange({ ...rule, operator: value, value: "" });
    }
  };

  const handleValueChange = (value: string | string[]) => {
    onChange({ ...rule, value });
  };

  const handleConvertToGroup = (type: "AND" | "OR") => {
    // Create a new group rule with the current rule as the first condition
    const currentRuleCopy = { ...rule };

    if (type === "AND") {
      const andRule = createEmptyAndRule();
      andRule.AND[0] = currentRuleCopy;
      onChange(andRule);
    } else {
      const orRule = createEmptyOrRule();
      orRule.OR[0] = currentRuleCopy;
      onChange(orRule);
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2 p-3 bg-white rounded-md border border-gray-200 shadow-sm animate-fade-in w-full">
      <FieldInput value={rule.field} onChange={handleFieldChange} />
      <OperatorSelect value={rule.operator} onChange={handleOperatorChange} />
      <ValueInputContainer rule={rule} onChange={handleValueChange} />
      <RuleActions
        onConvertToGroup={handleConvertToGroup}
        onDelete={onDelete}
        showDelete={showDelete}
      />
    </div>
  );
};

export default BaseRuleComponent;
