import React from "react";
import { Input } from "@/shared/components/inputs/input";

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
      className="w-full"
    />
  );
};

export default StringValueInput; 