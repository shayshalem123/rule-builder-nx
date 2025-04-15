
import React, { useState } from 'react';
import { RuleWithMeta } from '@/types/rule';
import { Button } from '@/components/ui/button';
import { Plus, AlertCircle } from 'lucide-react';
import RuleCard from './RuleCard';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useDeleteRule } from '@/features/rules/hooks/useRules';

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
      deleteRuleMutation.mutate(ruleToDelete.id);
    }
    setRuleToDelete(null);
  };

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/4 mx-auto"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-40 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="flex flex-col items-center text-red-500">
          <AlertCircle className="h-12 w-12 mb-4" />
          <h3 className="text-lg font-medium">Error loading rules</h3>
          <p className="mt-1">{error.message}</p>
          <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Rules</h1>
        <Button onClick={onCreateRule} className="flex items-center">
          <Plus className="h-4 w-4 mr-1" />
          Create Rule
        </Button>
      </div>

      {rules.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-300">
          <h3 className="text-lg font-medium text-gray-600 mb-2">No rules found</h3>
          <p className="text-gray-500 mb-4">Get started by creating your first rule.</p>
          <Button onClick={onCreateRule} className="flex items-center mx-auto">
            <Plus className="h-4 w-4 mr-1" />
            Create Rule
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {rules.map((rule) => (
            <RuleCard
              key={rule.id}
              rule={rule}
              onEdit={() => onEditRule(rule)}
              onDelete={() => setRuleToDelete(rule)}
            />
          ))}
        </div>
      )}

      <AlertDialog open={!!ruleToDelete} onOpenChange={(open) => !open && setRuleToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Rule</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{ruleToDelete?.name}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction className="bg-red-500 hover:bg-red-600" onClick={handleDeleteConfirm}>
              {deleteRuleMutation.isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default RuleList;
