
import React from 'react';
import { BaseRule, Operator } from '@/features/rules/types/rule';
import { Trash2, Edit } from 'lucide-react';
import { Button } from '@/shared/components/inputs/button';
import { Input } from '@/shared/components/inputs/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/inputs/select';
import { operators, fieldSuggestions } from '@/features/rules/utils/ruleUtils';

interface BaseRuleComponentProps {
  rule: BaseRule;
  onChange: (updatedRule: BaseRule) => void;
  onDelete?: () => void;
  showDelete?: boolean;
}

const BaseRuleComponent: React.FC<BaseRuleComponentProps> = ({
  rule,
  onChange,
  onDelete,
  showDelete = true,
}) => {
  const handleFieldChange = (value: string) => {
    onChange({ ...rule, field: value });
  };

  const handleOperatorChange = (value: string) => {
    onChange({ ...rule, operator: value as Operator });
  };

  const handleValueChange = (value: string) => {
    onChange({ ...rule, value });
  };

  return (
    <div className="flex flex-wrap items-center gap-2 p-3 bg-white rounded-md border border-gray-200 shadow-sm animate-fade-in">
      <div className="flex-1 min-w-[200px]">
        <label className="text-xs text-gray-500 mb-1 block">Field</label>
        <Input
          list="field-suggestions"
          value={rule.field}
          onChange={(e) => handleFieldChange(e.target.value)}
          placeholder="Enter field path (e.g. metadata.name)"
          className="w-full"
        />
        <datalist id="field-suggestions">
          {fieldSuggestions.map((field) => (
            <option key={field} value={field} />
          ))}
        </datalist>
      </div>

      <div className="w-[140px]">
        <label className="text-xs text-gray-500 mb-1 block">Operator</label>
        <Select value={rule.operator} onValueChange={handleOperatorChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select operator" />
          </SelectTrigger>
          <SelectContent>
            {operators.map((op) => (
              <SelectItem key={op.value} value={op.value}>
                {op.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex-1 min-w-[200px]">
        <label className="text-xs text-gray-500 mb-1 block">Value</label>
        <Input
          value={rule.value}
          onChange={(e) => handleValueChange(e.target.value)}
          placeholder="Enter value"
          className="w-full"
        />
      </div>

      {showDelete && onDelete && (
        <div className="flex items-end">
          <Button
            variant="ghost"
            size="icon"
            onClick={onDelete}
            className="text-gray-500 hover:text-red-500"
            title="Delete rule"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default BaseRuleComponent;
