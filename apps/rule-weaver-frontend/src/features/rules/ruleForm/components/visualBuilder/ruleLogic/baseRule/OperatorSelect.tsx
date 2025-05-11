import React, { useState, useEffect, useCallback, useMemo } from "react";
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
import { cn } from "@/shared/utils/cn";
import { usePrevious } from "react-use";

interface OperatorSelectProps {
  value: Operator;
  onChange: (value: Operator) => void;
  onErrorChange: (hasError: boolean) => void;
}

const OperatorSelect: React.FC<OperatorSelectProps> = ({
  value,
  onChange,
  onErrorChange,
}) => {
  const isValidOperator = useMemo(() => {
    return operators.some((operator) => operator.value === value);
  }, [value]);

  const hasError = useMemo(() => {
    return !value || !isValidOperator;
  }, [value, isValidOperator]);

  const prevError = usePrevious(hasError);

  useEffect(() => {
    if (hasError !== prevError) onErrorChange(hasError);
  }, [onErrorChange, prevError, hasError]);

  return (
    <div className="w-[140px] relative">
      <label className="text-xs text-text-primary mb-1 block">Operator</label>
      <Select value={value} onValueChange={(val) => onChange(val as Operator)}>
        <SelectTrigger className={cn(noBlackBorderFocus())}>
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

      {hasError && (
        <div
          className="absolute left-0 top-full text-xs text-red-500"
          style={{ marginTop: "2px", marginLeft: "2px" }}
        >
          Required
        </div>
      )}
    </div>
  );
};

export default OperatorSelect;
