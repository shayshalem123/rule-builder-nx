
import React, { useState } from 'react';
import { RuleWithMeta } from '@/types/rule';
import { SimpleGrid, Button, Title, Group, Box, Text, Modal, LoadingOverlay, Paper, Center } from '@mantine/core';
import { IconPlus, IconAlertCircle } from '@tabler/icons-react';
import RuleCard from './RuleCard';
import { useDeleteRule } from '@/hooks/useRules';

interface RuleListProps {
  rules: RuleWithMeta[];
  isLoading: boolean;
  error: Error | null;
  onCreateRule: () => void;
  onEditRule: (rule: RuleWithMeta) => void;
}

const RuleList: React.FC<RuleListProps> = ({
  rules,
  isLoading,
  error,
  onCreateRule,
  onEditRule,
}) => {
  const [ruleToDelete, setRuleToDelete] = useState<RuleWithMeta | null>(null);
  const deleteRuleMutation = useDeleteRule();

  const handleDeleteConfirm = () => {
    if (ruleToDelete?.id) {
      deleteRuleMutation.mutate(ruleToDelete.id, {
        onSettled: () => setRuleToDelete(null)
      });
    }
  };

  if (isLoading) {
    return (
      <Box pos="relative" h={400}>
        <LoadingOverlay visible={true} />
      </Box>
    );
  }

  if (error) {
    return (
      <Center py="xl">
        <Paper p="xl" withBorder>
          <Group direction="column" position="center" spacing="md">
            <IconAlertCircle size={48} color="red" />
            <Text size="lg" fw={500} c="red">Error loading rules</Text>
            <Text c="dimmed">{error.message}</Text>
            <Button variant="outline" onClick={() => window.location.reload()}>
              Retry
            </Button>
          </Group>
        </Paper>
      </Center>
    );
  }

  return (
    <Box>
      <Group position="apart" mb="xl">
        <Title order={2}>Rules</Title>
        <Button leftIcon={<IconPlus size={16} />} onClick={onCreateRule}>
          Create Rule
        </Button>
      </Group>

      {rules.length === 0 ? (
        <Paper p="xl" withBorder ta="center">
          <Text size="lg" fw={500} mb="sm" c="dimmed">No rules found</Text>
          <Text mb="md" c="dimmed">Get started by creating your first rule.</Text>
          <Button leftIcon={<IconPlus size={16} />} onClick={onCreateRule}>
            Create Rule
          </Button>
        </Paper>
      ) : (
        <SimpleGrid
          cols={3}
          spacing="md"
          breakpoints={[
            { maxWidth: 1200, cols: 2, spacing: 'md' },
            { maxWidth: 800, cols: 1, spacing: 'sm' },
          ]}
        >
          {rules.map((rule) => (
            <RuleCard
              key={rule.id}
              rule={rule}
              onEdit={() => onEditRule(rule)}
              onDelete={() => setRuleToDelete(rule)}
            />
          ))}
        </SimpleGrid>
      )}

      <Modal
        opened={!!ruleToDelete}
        onClose={() => setRuleToDelete(null)}
        title="Delete Rule"
        centered
      >
        <Text mb="md">
          Are you sure you want to delete "{ruleToDelete?.name}"? This action cannot be undone.
        </Text>
        <Group position="right">
          <Button variant="outline" onClick={() => setRuleToDelete(null)}>
            Cancel
          </Button>
          <Button color="red" onClick={handleDeleteConfirm} loading={deleteRuleMutation.isPending}>
            {deleteRuleMutation.isPending ? "Deleting..." : "Delete"}
          </Button>
        </Group>
      </Modal>
    </Box>
  );
};

export default RuleList;
