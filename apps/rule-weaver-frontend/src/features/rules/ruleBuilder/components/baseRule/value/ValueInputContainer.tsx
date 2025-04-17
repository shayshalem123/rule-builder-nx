import React from "react";
import { BaseRule } from "@/features/rules/types/rule";
import ArrayValueInput from "./ArrayValueInput";
import StringValueInput from "./StringValueInput";

interface ValueInputContainerProps {
  rule: BaseRule;
  onChange: (updatedValue: string | string[]) => void;
}

const ValueInputContainer: React.FC<ValueInputContainerProps> = ({
  rule,
  onChange,
}) => {
  return (
    <div className="flex-1 min-w-[200px]">
      <label className="text-xs text-gray-500 mb-1 block">Value</label>

      {rule.operator === "IN" ? (
        <ArrayValueInput
          values={Array.isArray(rule.value) ? rule.value : []}
          onChange={onChange}
        />
      ) : (
        <StringValueInput
          value={typeof rule.value === "string" ? rule.value : ""}
          onChange={onChange}
        />
      )}
    </div>
  );
};

export default ValueInputContainer;
