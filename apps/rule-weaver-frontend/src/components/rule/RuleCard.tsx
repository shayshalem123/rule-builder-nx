
import React from 'react';
import { RuleWithMeta } from '@/types/rule';
import { Card, Group, Text, Badge, ActionIcon, Stack } from '@mantine/core';
import { IconEdit, IconTrash } from '@tabler/icons-react';
import { isBaseRule, isAndRule, isOrRule } from '@/utils/ruleUtils';
import { formatDistanceToNow } from 'date-fns';

interface RuleCardProps {
  rule: RuleWithMeta;
  onEdit: () => void;
  onDelete: () => void;
}

const RuleCard: React.FC<RuleCardProps> = ({ rule, onEdit, onDelete }) => {
  const getRuleTypeBadge = () => {
    if (rule.field && rule.operator) {
      return <Badge variant="light" color="gray">Simple Rule</Badge>;
    } else if (rule.AND) {
      return <Badge variant="light" color="blue">AND Rule</Badge>;
    } else if (rule.OR) {
      return <Badge variant="light" color="violet">OR Rule</Badge>;
    }
    return null;
  };

  const getUpdatedTime = () => {
    if (!rule.updatedAt) return null;
    try {
      return formatDistanceToNow(new Date(rule.updatedAt), { addSuffix: true });
    } catch (e) {
      return null;
    }
  };
  
  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Card.Section withBorder inheritPadding py="xs">
        <Group position="apart">
          <Text fw={500} truncate>{rule.name}</Text>
          {getRuleTypeBadge()}
        </Group>
      </Card.Section>
      
      <Stack spacing="xs" py="sm">
        {rule.description && (
          <Text size="sm" c="dimmed" lineClamp={2}>
            {rule.description}
          </Text>
        )}
        
        {getUpdatedTime() && (
          <Text size="xs" c="dimmed">
            Updated {getUpdatedTime()}
          </Text>
        )}
      </Stack>
      
      <Group position="right" mt="auto">
        <ActionIcon 
          variant="subtle" 
          onClick={onEdit}
          aria-label="Edit"
        >
          <IconEdit size={18} />
        </ActionIcon>
        <ActionIcon 
          variant="subtle" 
          color="red" 
          onClick={onDelete}
          aria-label="Delete"
        >
          <IconTrash size={18} />
        </ActionIcon>
      </Group>
    </Card>
  );
};

export default RuleCard;
