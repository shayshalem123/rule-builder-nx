import React, { useCallback, memo, useState } from "react";
import { BaseRule, Operator } from "@/features/rules/types/rule";
import FieldInput from "./FieldInput";
import OperatorSelect from "./OperatorSelect";
import ValueInputContainer from "./value/ValueInputContainer";

interface BaseRuleFormProps {
  rule: BaseRule;
  onChange: (updatedRule: BaseRule) => void;
  onValidationChange: (isValid: boolean) => void;
  category?: string;
  className?: string;
}

type BaseRuleInputs = "field" | "operator" | "value";

/**
 * Component for editing a single base rule's field, operator, and value
 */
const BaseRuleForm: React.FC<BaseRuleFormProps> = memo(
  ({
    rule,
    onChange,
    onValidationChange,
    category,
    className,
  }) => {
    const [errors, setErrors] = useState<Record<BaseRuleInputs, boolean>>({
      field: false,
      operator: false,
      value: false,
    });

    const handleErrorChange = useCallback(
      (input: BaseRuleInputs, hasError: boolean) => {
        setErrors((prev) => {
          if (prev[input] === hasError) return prev;

          const hasInputErrors = Object.entries(prev).some(([key, value]) =>
            key === input ? hasError : value
          );

          onValidationChange(!hasInputErrors);

          return { ...prev, [input]: hasError };
        });
      },
      [onValidationChange]
    );

    const handleFieldChange = useCallback(
      (value: string) => {
        const defaultValue = rule.operator === "IN" ? [] : "";
        onChange({ ...rule, field: value, value: defaultValue });
      },
      [rule, onChange]
    );

    const handleOperatorChange = useCallback(
      (value: Operator) => {
        if (value === "IN") {
          onChange({ ...rule, operator: value, value: [] });
        } else {
          onChange({ ...rule, operator: value, value: "" });
        }
      },
      [rule, onChange]
    );

    const handleValueChange = useCallback(
      (value: string | string[]) => {
        onChange({ ...rule, value });
      },
      [rule, onChange]
    );

    return (
      <div className={`flex flex-col items-center pb-4 ${className || ""}`}>
        <div className="flex items-center justify-center gap-2 w-full">
          <FieldInput
            value={rule.field}
            onChange={handleFieldChange}
            category={category}
            onErrorChange={(hasError) => handleErrorChange("field", hasError)}
          />
          <OperatorSelect
            value={rule.operator}
            onChange={handleOperatorChange}
            onErrorChange={(hasError) =>
              handleErrorChange("operator", hasError)
            }
          />
          <ValueInputContainer
            rule={rule}
            category={category}
            onChange={handleValueChange}
            onErrorChange={(hasError) => handleErrorChange("value", hasError)}
          />
        </div>
      </div>
    );
  }
);

export default BaseRuleForm;
