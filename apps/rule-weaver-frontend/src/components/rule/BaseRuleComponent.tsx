
import React from 'react';
import { BaseRule, Operator } from '@/types/rule';
import { Group, TextInput, Select, ActionIcon, Box, Stack } from '@mantine/core';
import { IconTrash } from '@tabler/icons-react';
import { operators, fieldSuggestions } from '@/utils/ruleUtils';

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

  const handleOperatorChange = (value: string | null) => {
    if (value) {
      onChange({ ...rule, operator: value as Operator });
    }
  };

  const handleValueChange = (value: string) => {
    onChange({ ...rule, value });
  };

  return (
    <Box p="md" bg="gray.0" sx={{ border: '1px solid', borderColor: 'gray.3', borderRadius: 'md' }}>
      <Stack spacing="sm">
        <Group grow align="flex-start">
          <TextInput
            label="Field"
            value={rule.field}
            onChange={(e) => handleFieldChange(e.target.value)}
            placeholder="Enter field path (e.g. metadata.name)"
            data-list="field-suggestions"
          />
          
          <Select
            label="Operator"
            value={rule.operator}
            onChange={handleOperatorChange}
            data={operators.map(op => ({ value: op.value, label: op.label }))}
            placeholder="Select operator"
          />
          
          <TextInput
            label="Value"
            value={rule.value}
            onChange={(e) => handleValueChange(e.target.value)}
            placeholder="Enter value"
          />
          
          {showDelete && onDelete && (
            <ActionIcon
              variant="subtle"
              color="red"
              onClick={onDelete}
              title="Delete rule"
              mt={28}
            >
              <IconTrash size={20} />
            </ActionIcon>
          )}
        </Group>
      </Stack>
    </Box>
  );
};

export default BaseRuleComponent;
