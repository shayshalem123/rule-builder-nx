import React, { useState, useEffect } from "react";
import { RuleWithMeta } from "@/features/rules/types/rule";
import { useDeleteRule } from "@/features/rules/hooks/useRules";
import DeleteConfirmationDialog from "@/shared/components/DeleteConfirmationDialog";
import EmptyStateMessage from "./EmptyStateMessage";
import ErrorMessage from "@/shared/components/ErrorMessage";
import LoadingState from "@/shared/components/LoadingState";
import RuleGrid from "./RuleGrid";
import RuleHeader from "./RuleHeader";
import { Plus } from "lucide-react";

interface RuleListProps {
  rules: RuleWithMeta[];
  isLoading: boolean;
  error: Error | null;
  onCreateRule: () => void;
  onEditRule: (rule: RuleWithMeta) => void;
  onViewRule?: (rule: RuleWithMeta) => void;
  onDelete?: () => void;
  showHeader?: boolean;
  headerTitle?: string;
}

const RuleList: React.FC<RuleListProps> = ({
  rules,
  isLoading,
  error,
  onCreateRule,
  onEditRule,
  onViewRule,
  onDelete,
  showHeader = true,
  headerTitle = "Rules",
}) => {
  const [ruleToDelete, setRuleToDelete] = useState<RuleWithMeta | null>(null);
  const deleteRuleMutation = useDeleteRule();

  useEffect(() => {
    if (deleteRuleMutation.isSuccess && onDelete) {
      onDelete();
    }
  }, [deleteRuleMutation.isSuccess, onDelete]);

  const handleDeleteConfirm = () => {
    if (ruleToDelete?.id) {
      deleteRuleMutation.mutate(ruleToDelete.id);
    }
    setRuleToDelete(null);
  };

  if (isLoading) {
    return <LoadingState count={6} type="card" columns={3} />;
  }

  if (error) {
    return (
      <ErrorMessage
        title="Error loading rules"
        message={error.message}
        onRetry={() => window.location.reload()}
      />
    );
  }

  return (
    <div>
      {showHeader && (
        <RuleHeader title={headerTitle} onCreateRule={onCreateRule} />
      )}

      {rules.length === 0 ? (
        <EmptyStateMessage
          title="No rules found"
          message={
            showHeader
              ? "Get started by creating your first rule."
              : "No rules exist for this destination yet."
          }
          actionButton={
            showHeader
              ? {
                  label: "Create Rule",
                  onClick: onCreateRule,
                  icon: <Plus className="h-4 w-4 mr-1" />,
                }
              : undefined
          }
        />
      ) : (
        <RuleGrid
          rules={rules}
          onEdit={onEditRule}
          onDelete={setRuleToDelete}
          onView={onViewRule}
        />
      )}

      <DeleteConfirmationDialog
        open={!!ruleToDelete}
        onOpenChange={(open) => !open && setRuleToDelete(null)}
        onConfirm={handleDeleteConfirm}
        isDeleting={deleteRuleMutation.isPending}
        entityName={ruleToDelete?.name}
        title="Delete Rule"
      />
    </div>
  );
};

export default RuleList;
