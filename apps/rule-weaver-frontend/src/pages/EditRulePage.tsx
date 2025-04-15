
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import RuleBuilder from '@/components/rule/RuleBuilder';
import { useRule, useUpdateRule } from '@/hooks/useRules';
import { RuleWithMeta } from '@/types/rule';
import { Container, Paper, Loader, Text, Group, Button } from '@mantine/core';
import { IconAlertCircle, IconArrowLeft } from '@tabler/icons-react';

const EditRulePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: rule, isLoading, error } = useRule(id || '');
  const updateRuleMutation = useUpdateRule();

  const handleSave = (updatedRule: Omit<RuleWithMeta, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (id) {
      updateRuleMutation.mutate(
        { id, rule: updatedRule },
        {
          onSuccess: () => {
            navigate('/rules');
          },
        }
      );
    }
  };

  const handleCancel = () => {
    navigate('/rules');
  };

  if (isLoading) {
    return (
      <Container size="xl" py="xl">
        <Paper p="xl" withBorder>
          <Group justify="center" py="xl">
            <Loader size="lg" />
          </Group>
        </Paper>
      </Container>
    );
  }

  if (error || !rule) {
    return (
      <Container size="xl" py="xl" ta="center">
        <Paper p="xl" withBorder>
          <Group direction="column" align="center" gap="md">
            <IconAlertCircle size={48} color="red" />
            <Text size="lg" fw={500} c="red">Error loading rule</Text>
            <Text c="dimmed">{error?.message || 'Rule not found'}</Text>
            <Button variant="outline" onClick={() => navigate('/rules')} leftSection={<IconArrowLeft size={16} />}>
              Back to Rules
            </Button>
          </Group>
        </Paper>
      </Container>
    );
  }

  return (
    <Container size="xl" py="md">
      <RuleBuilder
        initialRule={rule}
        onSave={handleSave}
        onCancel={handleCancel}
        isLoading={updateRuleMutation.isPending}
      />
    </Container>
  );
};

export default EditRulePage;
