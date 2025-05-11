import React from "react";
import { Operator } from "@/features/rules/types/rule";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/inputs/select";
import { operators } from "@/features/rules/shared/utils/ruleUtils";
import { noBlackBorderFocus } from "@/shared/utils/styles";

interface OperatorSelectProps {
  value: Operator;
  onChange: (value: Operator) => void;
}

const OperatorSelect: React.FC<OperatorSelectProps> = ({ value, onChange }) => {
  return (
    <div className="w-[140px]">
      <label className="text-xs text-gray-500 mb-1 block">Operator</label>
      <Select value={value} onValueChange={(val) => onChange(val as Operator)}>
        <SelectTrigger className={noBlackBorderFocus()}>
          <SelectValue placeholder="Select operator" />
        </SelectTrigger>
        <SelectContent>
          {operators.map((op) => (
            <SelectItem key={op.value} value={op.value}>
              {op.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default OperatorSelect;
