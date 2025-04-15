import React, { useState } from "react";
import { X } from "lucide-react";
import { Badge } from "@/shared/components/inputs/badge";

interface ArrayValueInputProps {
  values: string[];
  onChange: (values: string[]) => void;
}

const ArrayValueInput: React.FC<ArrayValueInputProps> = ({
  values,
  onChange,
}) => {
  const [inputValue, setInputValue] = useState("");

  const handleAddValue = () => {
    if (!inputValue.trim()) return;

    const newValues = [...values, inputValue.trim()];
    onChange(newValues);
    setInputValue(""); // Clear input after adding
  };

  const handleRemoveValue = (index: number) => {
    const newValues = values.filter((_, i) => i !== index);
    onChange(newValues);
  };

  return (
    <div className="relative">
      <div
        className="flex flex-wrap items-center gap-1 p-2 border rounded-md focus-within:ring-2 focus-within:ring-offset-0 focus-within:ring-blue-500 focus-within:border-blue-500 min-h-[38px]"
        onClick={() => {
          // Focus the input when clicking anywhere in the container
          const input = document.getElementById("array-input");
          if (input) input.focus();
        }}
      >
        {values.map((value, index) => (
          <Badge
            key={index}
            variant="secondary"
            className="flex items-center gap-1 py-0 h-6"
          >
            {value}
            <button
              type="button"
              className="h-4 w-4 rounded-full inline-flex items-center justify-center hover:bg-gray-300/30 focus:outline-none"
              onClick={(e) => {
                e.stopPropagation();
                handleRemoveValue(index);
              }}
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}
        <input
          id="array-input"
          className="outline-none border-none flex-1 min-w-[60px] bg-transparent"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleAddValue();
            } else if (
              e.key === "Backspace" &&
              !inputValue &&
              values.length > 0
            ) {
              // Remove the last tag when pressing backspace in an empty input
              handleRemoveValue(values.length - 1);
            }
          }}
          placeholder={
            values.length === 0 ? "Type and press Enter to add values" : ""
          }
        />
      </div>
    </div>
  );
};

export default ArrayValueInput;
