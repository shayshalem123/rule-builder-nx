import React from "react";
import { fieldSuggestions } from "@/features/rules/utils/ruleUtils";
import { Input } from "@/shared/components/inputs/input";
import { cn } from "@/shared/utils/cn";
import { noBlackBorderFocus } from "@/shared/utils/styles";
import { ChevronDown } from "lucide-react";

interface FieldInputProps {
  value: string;
  onChange: (value: string) => void;
}

const FieldInput: React.FC<FieldInputProps> = ({ value, onChange }) => {
  return (
    <div className="flex-1 min-w-[200px]">
      <label className="text-xs text-gray-500 mb-1 block">Field</label>
      <div className="relative">
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Enter field path (e.g. metadata.name)"
          className={cn(
            "w-full pr-10",
            "appearance-none",
            "[&::-webkit-calendar-picker-indicator]:opacity-0",
            noBlackBorderFocus()
          )}
          list="field-suggestions"
        />
        {/* Custom styled dropdown icon */}
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 opacity-50 pointer-events-none" />
        <datalist id="field-suggestions">
          {fieldSuggestions.map((field) => (
            <option key={field} value={field} />
          ))}
        </datalist>
      </div>
    </div>
  );
};

export default FieldInput;
