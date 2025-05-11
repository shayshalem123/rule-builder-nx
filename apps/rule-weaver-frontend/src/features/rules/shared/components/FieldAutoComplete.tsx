import React, { useState, useEffect } from "react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/shared/components/inputs/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/components/inputs/popover";
import { Check, ChevronsUpDown } from "lucide-react";
import { Button } from "@/shared/components/inputs/button";
import { useSchemaByCategory } from "@/features/schemas/hooks/useSchemas";
import { cn } from "@/shared/utils/cn";
import useSchemaFields from "@/shared/hooks/useSchemaFields";

interface FieldAutoCompleteProps {
  category: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export const FieldAutoComplete: React.FC<FieldAutoCompleteProps> = ({
  category,
  value,
  onChange,
  placeholder = "Select field...",
}) => {
  const [open, setOpen] = useState(false);
  const { schema } = useSchemaByCategory(category);
  const { fieldPaths } = useSchemaFields(schema);
  const [fieldOptions, setFieldOptions] = useState<string[]>([]);

  // Update field options when schema changes
  useEffect(() => {
    if (fieldPaths && fieldPaths.length > 0) {
      setFieldOptions(fieldPaths);
    } else {
      // Fallback options if no schema is found
      setFieldOptions([
        "metadata.name",
        "metadata.namespace",
        "spec.replicas",
        "metadata.labels.tier",
      ]);
    }
  }, [fieldPaths]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {value ? value : placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder={`Search fields...`} />
          <CommandEmpty>No field found.</CommandEmpty>
          <CommandGroup className="max-h-60 overflow-auto">
            {fieldOptions.map((path) => (
              <CommandItem
                key={path}
                value={path}
                onSelect={(currentValue) => {
                  onChange(currentValue);
                  setOpen(false);
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value === path ? "opacity-100" : "opacity-0"
                  )}
                />
                {path}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default FieldAutoComplete;
