import React, { useState, useEffect, useRef } from "react";
import { Input } from "@/shared/components/inputs/input";
import { cn } from "@/shared/utils/cn";
import { noBlackBorderFocus } from "@/shared/utils/styles";
import { Book, ChevronDown, FileJson, Search } from "lucide-react";
import { useSchemaByCategory } from "@/features/schemas/hooks/useSchemas";
import { useSchemaFields } from "@/shared/hooks/useSchemaFields";
import { useNavigate, useParams } from "react-router-dom";
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
  const { id } = useParams<{ id: string }>();
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
    <div className="flex-1 min-w-[200px] relative">
      <label className="text-xs text-gray-500 block mb-1">Field</label>
      {schema && (
        <Button
          variant="ghost"
          size="sm"
          className="absolute top-[-5px] right-0 h-6 p-0 text-blue-600 hover:bg-blue-50 hover:text-blue-800 rounded-full transition-colors gap-1 px-2"
          onClick={handleViewSchema}
        >
          <FileJson className="h-3.5 w-3.5" />
          <span className="text-xs">Schema</span>
        </Button>
      )}
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
