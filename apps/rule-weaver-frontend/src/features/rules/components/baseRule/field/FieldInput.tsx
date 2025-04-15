import React from "react";
import { Input } from "@/shared/components/inputs/input";
import { fieldSuggestions } from "@/features/rules/utils/ruleUtils";

interface FieldInputProps {
  value: string;
  onChange: (value: string) => void;
}

const FieldInput: React.FC<FieldInputProps> = ({ value, onChange }) => {
  return (
    <div className="flex-1 min-w-[200px]">
      <label className="text-xs text-gray-500 mb-1 block">Field</label>
      <Input
        list="field-suggestions"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Enter field path (e.g. metadata.name)"
        className="w-full"
      />
      <datalist id="field-suggestions">
        {fieldSuggestions.map((field) => (
          <option key={field} value={field} />
        ))}
      </datalist>
    </div>
  );
};

export default FieldInput; 