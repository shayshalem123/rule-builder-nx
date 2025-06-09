import React, { useEffect, useMemo } from 'react';
import { Operator } from '@/features/rules/types/rule';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/inputs/select';
import { operators } from '@/features/rules/shared/utils/ruleUtils';
import { noBlackBorderFocus } from '@/shared/utils/styles';
import { cn } from '@/shared/utils/cn';
import { usePrevious } from 'react-use';
import { useDestination } from '@/features/rules/ruleForm/contexts/DestinationContext';
import { useCategory } from '@/features/rules/ruleForm/contexts/CategoryContext';
import { useCategoriesDestinations } from '@/features/rules/hooks/useCategoriesDestinations';

interface OperatorSelectProps {
  value: Operator;
  onChange: (value: Operator) => void;
  onErrorChange: (hasError: boolean) => void;
}

const OperatorSelect: React.FC<OperatorSelectProps> = ({
  value,
  onChange,
  onErrorChange,
}) => {
  const { destination } = useDestination();
  const { category } = useCategory();
  const { getOperatorsForCategoryDestination } = useCategoriesDestinations();

  const availableOperators = useMemo(() => {
    const allowedOperators = getOperatorsForCategoryDestination(
      category,
      destination
    );

    return operators.filter((op) => allowedOperators.includes(op.value));
  }, [category, destination, getOperatorsForCategoryDestination]);

  const isValidOperator = useMemo(() => {
    return availableOperators.some((operator) => operator.value === value);
  }, [value, availableOperators]);

  const hasError = useMemo(() => {
    return !value || !isValidOperator;
  }, [value, isValidOperator]);

  const prevError = usePrevious(hasError);

  useEffect(() => {
    if (hasError !== prevError) onErrorChange(hasError);
  }, [onErrorChange, prevError, hasError]);

  return (
    <div className="w-[140px] relative">
      <label className="text-xs text-text-primary mb-1 block">Operator</label>
      <Select value={value} onValueChange={(val) => onChange(val as Operator)}>
        <SelectTrigger className={cn(noBlackBorderFocus())}>
          <SelectValue placeholder="Select operator" />
        </SelectTrigger>
        <SelectContent>
          {availableOperators.map((op) => (
            <SelectItem key={op.value} value={op.value}>
              {op.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {hasError && (
        <div
          className="absolute left-0 top-full text-xs text-red-500"
          style={{ marginTop: '2px', marginLeft: '2px' }}
        >
          Required
        </div>
      )}
    </div>
  );
};

export default OperatorSelect;
