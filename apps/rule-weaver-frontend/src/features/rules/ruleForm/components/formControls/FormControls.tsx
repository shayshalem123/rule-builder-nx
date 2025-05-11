import React, { useState } from "react";
import { Button } from "@/shared/components/inputs/button";
import DiffViewButton from "@/shared/components/diff/DiffViewButton";
import RuleDiffModal from "./RuleDiffModal";
import { RuleWithMeta } from "../../../types/rule";
import { FormikProps } from "formik";
import { RuleFormValues } from "../../hooks/useRuleForm";
import ConfirmationModal from "./ConfirmationModal";
import { useRuleContext } from "../../contexts/RuleFormContext";

interface FormControlsProps {
  formik: FormikProps<RuleFormValues>;
  isConfirmModalOpen: boolean;
  onConfirmModalClose: () => void;
  onConfirmModalConfirm: () => void;
  onCancel: () => void;
  onSubmit: (e?: React.FormEvent) => void;
  onReset?: () => void;
}

export const FormControls: React.FC<FormControlsProps> = ({
  onCancel,
  onReset,
  onSubmit,
  isConfirmModalOpen,
  onConfirmModalClose,
  onConfirmModalConfirm,
  formik,
}) => {
  const { isSavingRule, initialRule, mode } = useRuleContext();

  const isEditMode = mode === "edit";
  const hasChanges = formik.dirty;
  const isDisabled = !formik.isValid || !hasChanges;

  const [isDiffModalOpen, setIsDiffModalOpen] = useState(false);
  const closeDiffModal = () => {
    setIsDiffModalOpen(false);
  };

  const toggleDiffModal = () => {
    setIsDiffModalOpen(!isDiffModalOpen);
  };

  return (
    <>
      {isEditMode && (
        <RuleDiffModal
          isOpen={isDiffModalOpen}
          onClose={closeDiffModal}
          initialRule={initialRule}
          currentValues={formik.values}
        />
      )}

      <ConfirmationModal
        isOpen={isConfirmModalOpen}
        onClose={onConfirmModalClose}
        onConfirm={onConfirmModalConfirm}
        initialRule={initialRule}
        currentValues={formik.values}
      />

      <div className="flex justify-between w-full">
        <div>
          {isEditMode && (
            <DiffViewButton onClick={toggleDiffModal} disabled={!hasChanges} />
          )}
        </div>
        <div className="flex space-x-3">
          {onReset && (
            <Button
              variant="outline"
              onClick={onReset}
              disabled={isSavingRule || !hasChanges}
              type="button"
            >
              Reset
            </Button>
          )}
          <Button
            variant="outline"
            onClick={onCancel}
            disabled={isSavingRule}
            type="button"
          >
            Cancel
          </Button>
          <Button
            onClick={onSubmit}
            disabled={isSavingRule || isDisabled}
            type="submit"
          >
            {isSavingRule ? "Saving..." : "Save Rule"}
          </Button>
        </div>
      </div>
    </>
  );
};
