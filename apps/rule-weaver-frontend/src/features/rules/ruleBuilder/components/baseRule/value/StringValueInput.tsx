import React from "react";
import { Input } from "@/shared/components/inputs/input";
import { cn } from "@/shared/utils/cn";
import { noBlackBorderFocus } from "@/shared/utils/styles";

interface StringValueInputProps {
  value: string;
  onChange: (value: string) => void;
}

const StringValueInput: React.FC<StringValueInputProps> = ({
  value,
  onChange,
}) => {
  return (
    <Input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Enter value"
      className={cn("w-full", noBlackBorderFocus())}
    />
  );
};

export default StringValueInput;
