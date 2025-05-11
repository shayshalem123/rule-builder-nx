import React, { useEffect, useMemo } from "react";
import { BaseRule } from "@/features/rules/types/rule";
import ArrayValueInput from "./ArrayValueInput";
import { StringValueInput } from "./StringValueInput";
import { NumberValueInput } from "./NumberValueInput";
import { usePrevious } from "react-use";
import useSchemaFields from "@/shared/hooks/useSchemaFields";

import { useSchemaByCategory } from "@/features/schemas/hooks/useSchemas";

interface ValueInputContainerProps {
  rule: BaseRule;
  category: string;
  onChange: (updatedValue: (string | number) | (string | number)[]) => void;
  onErrorChange: (hasError: boolean) => void;
}

const ValueInputContainer: React.FC<ValueInputContainerProps> = ({
  rule,
  onChange,
  onErrorChange,
  category,
}) => {
  const { schema } = useSchemaByCategory(category);
  const { fieldMap } = useSchemaFields(schema);

  const fieldType = useMemo(() => fieldMap[rule.field], [fieldMap, rule.field]);

  const isValueEmpty = useMemo((): boolean => {
    if (rule.operator === "IN") {
      return !Array.isArray(rule.value) || rule.value.length === 0;
    }

    if (rule.value === "" || rule.value === null || rule.value === undefined) {
      return true;
    }

    return false;
  }, [rule.operator, rule.value]);

  const hasError = useMemo(() => isValueEmpty, [isValueEmpty]);
  const prevHasError = usePrevious(hasError);

  useEffect(() => {
    if (hasError !== prevHasError) onErrorChange(hasError);
  }, [hasError, onErrorChange, prevHasError]);

  const renderValueInput = () => {
    if (rule.operator === "IN") {
      return (
        <ArrayValueInput
          values={Array.isArray(rule.value) ? rule.value : []}
          onChange={(values) => onChange(values)}
          hasError={hasError}
          fieldType={fieldType}
        />
      );
    }

    if (fieldType === "number" || fieldType === "integer") {
      const numericValue =
        typeof rule.value === "number"
          ? rule.value
          : parseFloat(rule.value as string);

      return (
        <NumberValueInput
          value={isNaN(numericValue) ? 0 : numericValue}
          onChange={(value) => onChange(value)}
        />
      );
    }

    return (
      <StringValueInput value={rule.value as string} onChange={onChange} />
    );
  };

  return (
    <div className="flex-1 min-w-[200px] relative">
      <label className="text-xs text-text-primary mb-1 block">Value</label>

      {renderValueInput()}

      {hasError && (
        <div
          className="absolute left-0 top-full text-xs text-red-500"
          style={{ marginTop: "2px", marginLeft: "2px" }}
        >
          {rule.operator === "IN"
            ? "At least one value required"
            : "Value required"}
        </div>
      )}
    </div>
  );
};

export default ValueInputContainer;
