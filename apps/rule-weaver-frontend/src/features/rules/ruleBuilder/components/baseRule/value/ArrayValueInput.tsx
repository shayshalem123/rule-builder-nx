import React, { useState } from "react";
import { X, AlertTriangle } from "lucide-react";
import { Badge } from "@/shared/components/inputs/badge";
import { toast } from "sonner";
import { cn } from "@/shared/utils/cn";
import { noBlackBorderFocus } from "@/shared/utils/styles";

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

    const trimmedValue = inputValue.trim();

    if (values.includes(trimmedValue)) {
      toast("Duplicate value detected", {
        description: "This value already exists in the list",
        icon: <AlertTriangle className="h-5 w-5 text-amber-500" />,
        className: "bg-amber-50 border-amber-200 text-amber-700",
        duration: 3000,
      });
      setInputValue("");

      return;
    }

    onChange([...values, trimmedValue]);
    setInputValue("");
  };

  const handleRemoveValue = (index: number) => {
    const newValues = values.filter((_, i) => i !== index);
    onChange(newValues);
  };

  return (
    <div className="relative">
      <div
        className={cn(
          "flex flex-wrap items-center gap-1 p-2 border rounded-md min-h-[38px]",
          "focus-within:border-input",
          noBlackBorderFocus()
        )}
        onClick={() => {
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
          className="outline-none border-none flex-1 min-w-[60px] bg-transparent focus:outline-none focus:ring-0"
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
