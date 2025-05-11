import React, { useState, useEffect, useCallback } from "react";
import { Input } from "@/shared/components/inputs/input";
import { cn } from "@/shared/utils/cn";
import { noBlackBorderFocus } from "@/shared/utils/styles";
import { useDebouncedCallback } from "use-debounce";

interface StringValueInputProps {
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
}

export const StringValueInput: React.FC<StringValueInputProps> = ({
  value,
  onChange,
  onBlur,
}) => {
  const [localValue, setLocalValue] = useState(value);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const debouncedOnChange = useDebouncedCallback(
    (newValue: string) => {
      onChange(newValue);
    },
    300
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;

      setLocalValue(newValue);
      debouncedOnChange(newValue);
    },
    [debouncedOnChange]
  );

  return (
    <Input
      value={localValue}
      onChange={handleChange}
      onBlur={onBlur}
      placeholder="Enter value"
      className={cn(
        "w-full",
        noBlackBorderFocus()
      )}
    />
  );
};
