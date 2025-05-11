import React from "react";
import { Checkbox } from "@/shared/components/inputs/checkbox";
import { Label } from "@/shared/components/inputs/label";
import { PropertyFieldProps } from "./types";

export const BooleanPropertyField: React.FC<PropertyFieldProps> = ({
  propName,
  value,
  onChange,
  required,
}) => {
  const labelContent = required ? `${propName} *` : propName;

  return (
    <div className="flex items-center space-x-2">
      <Checkbox
        id={`extra-${propName}`}
        checked={!!value}
        onCheckedChange={(checked) => onChange(propName, !!checked)}
      />
      <Label
        htmlFor={`extra-${propName}`}
        className="text-sm font-medium text-text-secondary"
      >
        {labelContent}
      </Label>
    </div>
  );
};
