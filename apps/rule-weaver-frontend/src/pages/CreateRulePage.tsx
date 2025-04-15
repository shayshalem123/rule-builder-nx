
import React from 'react';
import { useNavigate } from 'react-router-dom';
import RuleBuilder from '@/features/rules/components/RuleBuilder';
import { useCreateRule } from '@/features/rules/hooks/useRules';
import { RuleWithMeta } from '@/types/rule';

const CreateRulePage: React.FC = () => {
  const navigate = useNavigate();
  const createRuleMutation = useCreateRule();

  const handleSave = (rule: Omit<RuleWithMeta, 'id' | 'createdAt' | 'updatedAt'>) => {
    createRuleMutation.mutate(rule, {
      onSuccess: () => {
        navigate('/rules');
      },
    });
  };

  const handleCancel = () => {
    navigate('/rules');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <RuleBuilder
        onSave={handleSave}
        onCancel={handleCancel}
        isLoading={createRuleMutation.isPending}
      />
    </div>
  );
};

export default CreateRulePage;
