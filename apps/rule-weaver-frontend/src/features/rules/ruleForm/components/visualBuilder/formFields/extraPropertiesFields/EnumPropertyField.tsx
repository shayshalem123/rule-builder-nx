import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/inputs/select";
import { Label } from "@/shared/components/inputs/label";
import { PropertyFieldProps } from "./types";

export const EnumPropertyField: React.FC<PropertyFieldProps> = ({
  propName,
  schema,
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
      <Select
        value={value as string}
        onValueChange={(val) => onChange(propName, val)}
      >
        <SelectTrigger id={`extra-${propName}`}>
          <SelectValue placeholder={`Select ${propName}`} />
        </SelectTrigger>
        <SelectContent>
          {schema.enum?.map((option: string) => (
            <SelectItem key={option} value={option}>
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
