
import React, { useState } from 'react';
import { RuleType, BaseRule, AndRule, OrRule, RuleWithMeta } from '@/types/rule';
import { 
  TextInput, Textarea, Button, Paper, Title, Tabs, 
  Stack, Group, Box, Space
} from '@mantine/core';
import BaseRuleComponent from './BaseRuleComponent';
import GroupRuleComponent from './GroupRuleComponent';
import {
  isBaseRule,
  isAndRule,
  isOrRule,
  createEmptyBaseRule,
  createEmptyAndRule,
  createEmptyOrRule,
} from '@/utils/ruleUtils';

interface RuleBuilderProps {
  initialRule?: RuleWithMeta;
  onSave: (rule: Omit<RuleWithMeta, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const RuleBuilder: React.FC<RuleBuilderProps> = ({
  initialRule,
  onSave,
  onCancel,
  isLoading = false,
}) => {
  const [name, setName] = useState(initialRule?.name || '');
  const [description, setDescription] = useState(initialRule?.description || '');
  
  // Extract the rule logic part (without metadata like name, description)
  const getInitialRuleLogic = (): RuleType => {
    if (!initialRule) return createEmptyBaseRule();
    
    if (initialRule.field && initialRule.operator && initialRule.value !== undefined) {
      return {
        field: initialRule.field,
        operator: initialRule.operator,
        value: initialRule.value,
      } as BaseRule;
    } else if (initialRule.AND) {
      return { AND: initialRule.AND } as AndRule;
    } else if (initialRule.OR) {
      return { OR: initialRule.OR } as OrRule;
    }
    
    return createEmptyBaseRule();
  };
  
  const [rule, setRule] = useState<RuleType>(getInitialRuleLogic());
  
  const handleSave = () => {
    if (!name.trim()) {
      alert('Please provide a name for the rule');
      return;
    }
    
    // Combine the rule logic with metadata
    let fullRule: Omit<RuleWithMeta, 'id' | 'createdAt' | 'updatedAt'>;
    
    if (isBaseRule(rule)) {
      fullRule = {
        name,
        description: description.trim() ? description : undefined,
        field: rule.field,
        operator: rule.operator,
        value: rule.value,
      };
    } else if (isAndRule(rule)) {
      fullRule = {
        name,
        description: description.trim() ? description : undefined,
        AND: rule.AND,
      };
    } else {
      fullRule = {
        name,
        description: description.trim() ? description : undefined,
        OR: rule.OR,
      };
    }
    
    onSave(fullRule);
  };
  
  const handleRuleTypeChange = (type: string) => {
    if (type === 'BASE') {
      setRule(createEmptyBaseRule());
    } else if (type === 'AND') {
      setRule(createEmptyAndRule());
    } else if (type === 'OR') {
      setRule(createEmptyOrRule());
    }
  };
  
  // Determine the current rule type for the tabs
  const getCurrentRuleType = (): string => {
    if (isBaseRule(rule)) return 'BASE';
    if (isAndRule(rule)) return 'AND';
    if (isOrRule(rule)) return 'OR';
    return 'BASE';
  };
  
  return (
    <Paper p="lg" radius="md" withBorder>
      <Stack spacing="lg">
        <Title order={2} size="h3">
          {initialRule ? 'Edit Rule' : 'Create New Rule'}
        </Title>
        
        <Stack spacing="md">
          <TextInput
            label="Rule Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter a descriptive name for this rule"
            required
            withAsterisk
          />
          
          <Textarea
            label="Description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the purpose of this rule"
            minRows={3}
          />
        </Stack>
        
        <Box pt="md">
          <Title order={3} size="h4" mb="md">
            Rule Configuration
          </Title>
          
          <Tabs value={getCurrentRuleType()} onChange={handleRuleTypeChange}>
            <Tabs.List>
              <Tabs.Tab value="BASE">Simple Rule</Tabs.Tab>
              <Tabs.Tab value="AND">AND Group</Tabs.Tab>
              <Tabs.Tab value="OR">OR Group</Tabs.Tab>
            </Tabs.List>
            
            <Space h="md" />
            
            <Tabs.Panel value="BASE">
              {isBaseRule(rule) && (
                <BaseRuleComponent
                  rule={rule}
                  onChange={setRule as (rule: BaseRule) => void}
                  showDelete={false}
                />
              )}
            </Tabs.Panel>
            
            <Tabs.Panel value="AND">
              {isAndRule(rule) ? (
                <GroupRuleComponent
                  rule={rule}
                  onChange={setRule as (rule: AndRule) => void}
                />
              ) : (
                <GroupRuleComponent
                  rule={createEmptyAndRule()}
                  onChange={setRule as (rule: AndRule) => void}
                />
              )}
            </Tabs.Panel>
            
            <Tabs.Panel value="OR">
              {isOrRule(rule) ? (
                <GroupRuleComponent
                  rule={rule}
                  onChange={setRule as (rule: OrRule) => void}
                />
              ) : (
                <GroupRuleComponent
                  rule={createEmptyOrRule()}
                  onChange={setRule as (rule: OrRule) => void}
                />
              )}
            </Tabs.Panel>
          </Tabs>
        </Box>
        
        <Group position="right" spacing="sm" mt="md">
          <Button variant="outline" onClick={onCancel} disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isLoading || !name.trim()} loading={isLoading}>
            {isLoading ? 'Saving...' : 'Save Rule'}
          </Button>
        </Group>
      </Stack>
    </Paper>
  );
};

export default RuleBuilder;
