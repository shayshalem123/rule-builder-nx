import React from "react";
import { BaseRule, Operator } from "@/features/rules/types/rule";
import FieldInput from "./field";
import OperatorSelect from "./operator";
import ValueInputContainer from "./value";

interface BaseRuleFormProps {
  rule: BaseRule;
  onChange: (updatedRule: BaseRule) => void;
  category?: string;
  className?: string;
}

/**
 * Component for editing a single base rule's field, operator, and value
 */
const BaseRuleForm: React.FC<BaseRuleFormProps> = ({
  rule,
  onChange,
  category = "partners-images",
  className,
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

  return (
    <div className={`flex items-center gap-2 ${className || ""}`}>
      <FieldInput
        value={rule.field}
        onChange={handleFieldChange}
        category={category}
      />
      <OperatorSelect value={rule.operator} onChange={handleOperatorChange} />
      <ValueInputContainer rule={rule} onChange={handleValueChange} />
    </div>
  );
};

export default BaseRuleForm;
