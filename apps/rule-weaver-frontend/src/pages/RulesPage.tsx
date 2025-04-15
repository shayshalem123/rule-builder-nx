
import React from 'react';
import { useRules } from '@/hooks/useRules';
import RuleList from '@/components/rule/RuleList';
import { RuleWithMeta } from '@/types/rule';
import { useNavigate } from 'react-router-dom';
import { Container } from '@mantine/core';

const RulesPage: React.FC = () => {
  const { data: rules = [], isLoading, error } = useRules();
  const navigate = useNavigate();

  const handleCreateRule = () => {
    navigate('/rules/create');
  };

  const handleEditRule = (rule: RuleWithMeta) => {
    if (rule.id) {
      navigate(`/rules/edit/${rule.id}`);
    }
  };

  return (
    <Container size="xl" py="md">
      <RuleList
        rules={rules}
        isLoading={isLoading}
        error={error as Error}
        onCreateRule={handleCreateRule}
        onEditRule={handleEditRule}
      />
    </Container>
  );
};

export default RulesPage;
