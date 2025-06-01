import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Input } from '@/shared/components/inputs/input';
import { cn } from '@/shared/utils/cn';
import { noBlackBorderFocus } from '@/shared/utils/styles';
import { ChevronDown, FileJson, Info } from 'lucide-react';
import { useSchemaByCategory } from '@/features/schemas/hooks/useSchemas';
import { useSchemaFields } from '@/shared/hooks/useSchemaFields';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/shared/components/inputs/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/shared/components/inputs/popover';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/shared/components/inputs/tooltip';
import { Button } from '@/shared/components/inputs/button';
import { usePrevious } from 'react-use';

interface FieldInputProps {
  value: string;
  onChange: (value: string) => void;
  onErrorChange: (hasError: boolean) => void;
  category?: string;
}

const FieldInput: React.FC<FieldInputProps> = ({
  value,
  onChange,
  onErrorChange,
  category = 'partners-images',
}) => {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState(value);

  const navigate = useNavigate();
  const location = useLocation();
  const { schema } = useSchemaByCategory(category);
  const { fieldPaths, fieldInfos } = useSchemaFields(schema);

  const isValidField = useCallback(
    (val: string): boolean =>
      fieldPaths.length === 0 || fieldPaths.includes(val),
    [fieldPaths]
  );

  const hasError = useMemo(
    () => !!inputValue && !isValidField(inputValue),
    [inputValue, isValidField]
  );

  const prevHasError = usePrevious(hasError);

  const selectedFieldInfo = useMemo(
    () => fieldInfos.find((field) => field.path === value),
    [fieldInfos, value]
  );

  const filteredFieldInfos = useMemo(
    () =>
      fieldInfos.filter((field) =>
        field.path.toLowerCase().includes(inputValue.toLowerCase())
      ),
    [fieldInfos, inputValue]
  );

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  useEffect(() => {
    if (hasError !== prevHasError) onErrorChange(hasError);
  }, [hasError, onErrorChange, prevHasError]);

  const handleViewSchema = () => {
    const currentPath = encodeURIComponent(location.pathname);
    navigate(`/schemas/${schema.id}?returnTo=${currentPath}`);
  };

  return (
    <div className="flex-1 min-w-[200px] relative">
      <label className="text-xs text-text-primary block mb-1">Field</label>
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
              }}
              onClick={() => setOpen(true)}
              placeholder="Enter field path (e.g. metadata.name)"
              className={cn('w-full pr-10', noBlackBorderFocus())}
            />
            {selectedFieldInfo?.description && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="absolute right-8 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer" />
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p>{selectedFieldInfo.description}</p>
                </TooltipContent>
              </Tooltip>
            )}
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 opacity-50 pointer-events-none" />
          </div>
        </PopoverTrigger>
        <PopoverContent className="p-0 w-[400px]" align="start" side="bottom">
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
                {filteredFieldInfos.map((field) => (
                  <CommandItem
                    key={field.path}
                    value={field.path}
                    onSelect={(selectedValue) => {
                      onChange(selectedValue);
                      setInputValue(selectedValue);
                      setOpen(false);
                    }}
                    className="flex items-center justify-between p-3"
                  >
                    <span className="font-medium text-sm">{field.path}</span>
                    {field.description && (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="h-4 w-4 text-gray-400 hover:text-gray-600 transition-colors" />
                        </TooltipTrigger>
                        <TooltipContent className="max-w-xs">
                          <p>{field.description}</p>
                        </TooltipContent>
                      </Tooltip>
                    )}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {hasError && (
        <div
          className="absolute left-0 top-full text-xs text-red-500"
          style={{ marginTop: '2px', marginLeft: '2px' }}
        >
          Invalid field path
        </div>
      )}
    </div>
  );
};

export default FieldInput;
