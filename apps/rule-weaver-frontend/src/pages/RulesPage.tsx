
import React from 'react';
import { useRules } from '@/hooks/useRules';
import RuleList from '@/components/rule/RuleList';
import { RuleWithMeta } from '@/types/rule';
import { useNavigate } from 'react-router-dom';

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
    <div className="container mx-auto px-4 py-8">
      <RuleList
        rules={rules}
        isLoading={isLoading}
        error={error as Error}
        onCreateRule={handleCreateRule}
        onEditRule={handleEditRule}
      />
    </div>
  );
};

export default RulesPage;
