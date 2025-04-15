
import React from 'react';
import { AndRule, OrRule, RuleType, BaseRule } from '@/types/rule';
import { Box, Stack, Group, Button, Text, ActionIcon } from '@mantine/core';
import { IconPlus, IconTrash } from '@tabler/icons-react';
import BaseRuleComponent from './BaseRuleComponent';
import { createEmptyBaseRule, isBaseRule, isAndRule, isOrRule } from '@/utils/ruleUtils';

interface GroupRuleComponentProps {
  rule: AndRule | OrRule;
  onChange: (updatedRule: AndRule | OrRule) => void;
  onDelete?: () => void;
}

const GroupRuleComponent: React.FC<GroupRuleComponentProps> = ({
  rule,
  onChange,
  onDelete,
}) => {
  const isAnd = isAndRule(rule);
  const rules = isAnd ? rule.AND : rule.OR;
  const groupType = isAnd ? 'AND' : 'OR';
  const groupColor = isAnd ? 'blue' : 'violet';

  const handleAddRule = () => {
    const newRules = [...rules, createEmptyBaseRule()];
    onChange(
      isAnd ? { ...rule, AND: newRules } : { ...rule, OR: newRules }
    );
  };

  const handleRuleChange = (index: number, updatedRule: RuleType) => {
    const newRules = [...rules];
    newRules[index] = updatedRule;
    onChange(
      isAnd ? { ...rule, AND: newRules } : { ...rule, OR: newRules }
    );
  };

  const handleRuleDelete = (index: number) => {
    if (rules.length <= 1) {
      onDelete && onDelete();
      return;
    }
    
    const newRules = [...rules];
    newRules.splice(index, 1);
    onChange(
      isAnd ? { ...rule, AND: newRules } : { ...rule, OR: newRules }
    );
  };

  return (
    <Box 
      p="md" 
      style={{ 
        borderRadius: 'var(--mantine-radius-md)', 
        backgroundColor: isAnd ? 'rgba(51, 102, 255, 0.05)' : 'rgba(134, 76, 232, 0.05)',
        border: '1px solid',
        borderColor: isAnd ? 'rgba(51, 102, 255, 0.2)' : 'rgba(134, 76, 232, 0.2)',
      }}
    >
      <Group justify="space-between" mb="md">
        <Text fw={500} c={groupColor}>
          {groupType} Group (all conditions {isAnd ? 'must' : 'can'} match)
        </Text>
        {onDelete && (
          <ActionIcon
            variant="subtle"
            color="red"
            onClick={onDelete}
            title={`Delete ${groupType} group`}
          >
            <IconTrash size={18} />
          </ActionIcon>
        )}
      </Group>

      <Stack gap="md">
        {rules.map((nestedRule, index) => {
          if (isBaseRule(nestedRule)) {
            return (
              <BaseRuleComponent
                key={index}
                rule={nestedRule}
                onChange={(updatedRule: BaseRule) => handleRuleChange(index, updatedRule)}
                onDelete={() => handleRuleDelete(index)}
              />
            );
          } else if (isAndRule(nestedRule) || isOrRule(nestedRule)) {
            return (
              <GroupRuleComponent
                key={index}
                rule={nestedRule}
                onChange={(updatedRule) => handleRuleChange(index, updatedRule)}
                onDelete={() => handleRuleDelete(index)}
              />
            );
          }
          return null;
        })}
      </Stack>

      <Group mt="md">
        <Button 
          variant="light" 
          size="sm" 
          leftSection={<IconPlus size={16} />}
          onClick={handleAddRule}
        >
          Add Condition
        </Button>
      </Group>
    </Box>
  );
};

export default GroupRuleComponent;
