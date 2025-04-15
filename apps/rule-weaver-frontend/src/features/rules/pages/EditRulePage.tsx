
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import RuleBuilder from '@/features/rules/components/RuleBuilder';
import { useRule, useUpdateRule } from '@/features/rules/hooks/useRules';
import { RuleWithMeta } from '@/features/rules/types/rule';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/shared/components/inputs/button';

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
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse max-w-5xl mx-auto p-6 bg-white rounded-lg shadow-sm border">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="space-y-4">
            <div className="h-10 bg-gray-200 rounded"></div>
            <div className="h-24 bg-gray-200 rounded"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !rule) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="flex flex-col items-center text-red-500 py-12">
          <AlertCircle className="h-12 w-12 mb-4" />
          <h3 className="text-lg font-medium">Error loading rule</h3>
          <p className="mt-1">{error?.message || 'Rule not found'}</p>
          <Button variant="outline" className="mt-4" onClick={() => navigate('/rules')}>
            Back to Rules
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <RuleBuilder
        initialRule={rule}
        onSave={handleSave}
        onCancel={handleCancel}
        isLoading={updateRuleMutation.isPending}
      />
    </div>
  );
};

export default EditRulePage;
