import React from "react";
import { RuleWithMeta } from "@/features/rules/types/rule";
import { RuleFormValues } from "../../hooks/useRuleForm";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/shared/components/inputs/dialog";
import { Button } from "@/shared/components/inputs/button";
import DiffViewModalTrigger from "@/features/rules/ruleForm/components/formControls/DiffViewModalTrigger";
import { createRuleObjectFromValues } from "@/features/rules/shared/utils/ruleUtils";
import { useRuleContext } from "../../contexts/RuleFormContext";

interface ConfirmationModalProps {
  isOpen: boolean;
  currentValues: RuleFormValues;
  onClose: () => void;
  onConfirm: () => void;
  initialRule?: RuleWithMeta;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  initialRule,
  currentValues,
}) => {
  const { mode, isSavingRule } = useRuleContext();

  const isEditMode = mode === "edit";

  const formatRuleJson = (rule: RuleWithMeta | Record<string, unknown>) => {
    return JSON.stringify(rule, null, 2);
  };

  const modifiedJson = formatRuleJson(
    createRuleObjectFromValues(currentValues, initialRule)
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? "Confirm Rule Update" : "Confirm Rule Creation"}
          </DialogTitle>
          <DialogDescription>
            {isEditMode
              ? "Are you sure you want to update this rule?"
              : "Are you sure you want to create this rule?"}
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          {!isEditMode ? (
            <div className="p-4 border rounded bg-background-primary">
              <pre className="whitespace-pre-wrap text-sm overflow-auto max-h-64">
                {modifiedJson}
              </pre>
            </div>
          ) : (
            <></>
          )}
        </div>

        <div className="flex justify-between items-center pt-4 border-t border-border-primary">
          {isEditMode && (
            <DiffViewModalTrigger
              initialRule={initialRule}
              currentValues={currentValues}
            />
          )}

          <div className="flex space-x-3">
            <Button variant="outline" onClick={onClose} disabled={isSavingRule}>
              Cancel
            </Button>
            <Button onClick={onConfirm} disabled={isSavingRule} type="submit">
              {isSavingRule
                ? "Saving..."
                : isEditMode
                ? "Update Rule"
                : "Create Rule"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmationModal;
