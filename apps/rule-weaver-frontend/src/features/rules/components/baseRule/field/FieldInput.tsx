import React, { useState, useEffect, useRef } from "react";
import { fieldSuggestions } from "@/features/rules/utils/ruleUtils";
import { Input } from "@/shared/components/inputs/input";
import { cn } from "@/shared/utils/cn";
import { noBlackBorderFocus } from "@/shared/utils/styles";
import { ChevronDown, Eye, Search } from "lucide-react";
import { useSchemaByCategory } from "@/features/schemas/hooks/useSchemas";
import { useSchemaFields } from "@/shared/hooks/useSchemaFields";
import { useNavigate } from "react-router-dom";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/shared/components/inputs/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/components/inputs/popover";
import { Button } from "@/shared/components/inputs/button";

interface FieldInputProps {
  value: string;
  onChange: (value: string) => void;
  category?: string;
}

const FieldInput: React.FC<FieldInputProps> = ({
  value,
  onChange,
  category = "partners-images",
}) => {
  const navigate = useNavigate();
  const { schema } = useSchemaByCategory(category);
  const { fieldPaths } = useSchemaFields(schema);
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState(value);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  const handleViewSchema = () => {
    navigate(`/schemas/${schema.id}`);
  };

  return (
    <div className="flex-1 min-w-[200px]">
      <div className="flex justify-between items-center mb-1">
        <label className="text-xs text-gray-500 block">Field</label>
        {schema && (
          <Button
            variant="ghost"
            size="sm"
            className="h-6 p-0 text-blue-600 hover:text-blue-800"
            onClick={handleViewSchema}
          >
            <Eye className="h-3 w-3 mr-1" />
            <span className="text-xs">View Schema</span>
          </Button>
        )}
      </div>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <div className="relative">
            <Input
              value={inputValue}
              onChange={(e) => {
                setInputValue(e.target.value);
                onChange(e.target.value);
              }}
              onClick={() => setOpen(true)}
              placeholder="Enter field path (e.g. metadata.name)"
              className={cn("w-full pr-10", noBlackBorderFocus())}
            />
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 opacity-50 pointer-events-none" />
          </div>
        </PopoverTrigger>
        <PopoverContent className="p-0 w-[300px]" align="start">
          <Command>
            <CommandInput
              placeholder="Search field path..."
              className="h-9"
              value={inputValue}
              onValueChange={(value) => {
                setInputValue(value);
              }}
            />
            <CommandList>
              <CommandEmpty>No fields found</CommandEmpty>
              <CommandGroup heading="Field Paths">
                {fieldPaths
                  .filter((path) =>
                    path.toLowerCase().includes(inputValue.toLowerCase())
                  )
                  .map((path) => (
                    <CommandItem
                      key={path}
                      value={path}
                      onSelect={(selectedValue) => {
                        onChange(selectedValue);
                        setInputValue(selectedValue);
                        setOpen(false);
                      }}
                    >
                      {path}
                    </CommandItem>
                  ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default FieldInput;
