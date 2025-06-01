import React, { useState, useRef } from 'react';
import { AlertTriangle, X, ListPlus } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/shared/utils/cn';
import { noBlackBorderFocus } from '@/shared/utils/styles';
import { TagBadge } from './arrayValueInput/TagBadge';
import { BulkAddModal } from './arrayValueInput/BulkAddModal';

type ArrayValue<T> = T extends 'number' | 'integer' ? number[] : string[];

interface ArrayValueInputProps {
  values: string[] | number[];
  onChange: (values: string[] | number[]) => void;
  hasError?: boolean;
  fieldType?: string;
}

const ArrayValueInput: React.FC<ArrayValueInputProps> = ({
  values,
  onChange,
  fieldType,
}) => {
  const [inputValue, setInputValue] = useState('');
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const isNumberType = fieldType === 'number' || fieldType === 'integer';
  const inputType = isNumberType ? 'number' : 'text';
  const placeholder = isNumberType
    ? 'Type a number and press Enter to add'
    : 'Type and press Enter to add values';

  // Type-safe values based on fieldType
  const typedValues = isNumberType
    ? (values as number[])
    : (values as string[]);

  // Validate and parse the input value
  const validateInput = (value: string): string | number | null => {
    if (isNumberType) {
      const parsedValue = parseFloat(value);
      if (isNaN(parsedValue)) {
        toast('Invalid number', {
          description: 'Please enter a valid number',
          icon: <AlertTriangle className="h-5 w-5 text-amber-500" />,
          className: 'bg-amber-50 border-amber-200 text-amber-700',
          duration: 3000,
        });
        return null;
      }
      return parsedValue;
    }
    return value; // For string type, return as is
  };

  // Check if a value already exists in the array
  const valueExists = (newValue: string | number): boolean => {
    return typedValues.some(
      (value) => value === newValue || value.toString() === newValue.toString()
    );
  };

  const handleAddValue = () => {
    if (!inputValue.trim()) return;

    const trimmedValue = inputValue.trim();
    const parsedValue = validateInput(trimmedValue);

    if (parsedValue === null) {
      setInputValue('');
      return;
    }

    if (valueExists(parsedValue)) {
      toast('Duplicate value detected', {
        description: 'This value already exists in the list',
        icon: <AlertTriangle className="h-5 w-5 text-amber-500" />,
        className: 'bg-amber-50 border-amber-200 text-amber-700',
        duration: 3000,
      });
      setInputValue('');
      return;
    }

    if (isNumberType) {
      const newValues = [...typedValues, parsedValue as number] as number[];
      onChange(newValues);
    } else {
      const newValues = [...typedValues, parsedValue as string] as string[];
      onChange(newValues);
    }

    setInputValue('');
  };

  const handleRemoveValue = (index: number) => {
    if (isNumberType) {
      const newValues = (typedValues as number[]).filter((_, i) => i !== index);
      onChange(newValues);
    } else {
      const newValues = (typedValues as string[]).filter((_, i) => i !== index);
      onChange(newValues);
    }
  };

  const handleClearAll = () => {
    onChange(isNumberType ? ([] as number[]) : ([] as string[]));
  };

  const handleBlur = () => {
    if (inputValue.trim()) {
      handleAddValue();
    }
  };

  const handleBulkAdd = (newItems: string[]) => {
    const stringValues = typedValues as string[];
    onChange([...stringValues, ...newItems]);
  };

  const clearInputValue = () => setInputValue('');

  return (
    <div className="relative">
      <div
        className={cn(
          'flex flex-wrap items-center gap-1 p-2 border rounded-md min-h-[38px] bg-background-secondary',
          'focus-within:border-input',
          noBlackBorderFocus()
        )}
        onClick={() => {
          inputRef.current?.focus();
        }}
      >
        {typedValues.map((value, index) => (
          <TagBadge
            key={index}
            value={value}
            onRemove={() => handleRemoveValue(index)}
          />
        ))}
        <input
          ref={inputRef}
          type={inputType}
          className="outline-none border-none flex-1 min-w-[60px] focus:outline-none focus:ring-0 bg-transparent"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleAddValue();
            } else if (
              e.key === 'Backspace' &&
              !inputValue &&
              typedValues.length > 0
            ) {
              handleRemoveValue(typedValues.length - 1);
            }
          }}
          placeholder={typedValues.length === 0 ? placeholder : ''}
        />
        <div className="flex items-center gap-1 ml-1">
          {!isNumberType && (
            <button
              type="button"
              className="p-1 rounded hover:bg-accent focus:outline-none"
              onClick={(e) => {
                e.stopPropagation();
                setIsBulkModalOpen(true);
              }}
              title="Bulk add values"
            >
              <ListPlus className="h-4 w-4 text-text-primary" />
            </button>
          )}
          {typedValues.length > 0 && (
            <button
              type="button"
              className="p-1 rounded hover:bg-accent focus:outline-none"
              onClick={(e) => {
                e.stopPropagation();
                handleClearAll();
              }}
              title="Clear all values"
            >
              <X className="h-4 w-4 text-text-primary" />
            </button>
          )}
        </div>
      </div>

      {!isNumberType && (
        <BulkAddModal
          isOpen={isBulkModalOpen}
          onClose={() => setIsBulkModalOpen(false)}
          onAdd={handleBulkAdd}
          existingValues={typedValues as string[]}
          currentInputValue={inputValue}
          onInputCleared={clearInputValue}
        />
      )}
    </div>
  );
};

export default ArrayValueInput;
