import React from "react";
import { Input } from "@/shared/components/inputs/input";
import { Label } from "@/shared/components/inputs/label";
import { PropertyFieldProps } from "./types";

export const StringPropertyField: React.FC<PropertyFieldProps> = ({
  propName,
  value,
  onChange,
  required,
}) => {
  const labelContent = required ? `${propName} *` : propName;

  return (
    <div>
      <Label
        htmlFor={`extra-${propName}`}
        className="block text-sm font-medium text-text-secondary mb-1"
      >
        {labelContent}
      </Label>
      <Input
        id={`extra-${propName}`}
        value={value.toString()}
        onChange={(e) => onChange(propName, e.target.value)}
        placeholder={`Enter ${propName}`}
        className="w-full"
      />
    </div>
  );
};
