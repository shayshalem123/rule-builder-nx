import React, { useState } from "react";
import DiffViewButton from "../../../../../shared/components/diff/DiffViewButton";
import { RuleWithMeta } from "@/features/rules/types/rule";
import { RuleFormValues } from "@/features/rules/ruleForm/hooks/useRuleForm";
import RuleDiffModal from "@/features/rules/ruleForm/components/formControls/RuleDiffModal";

interface DiffViewModalTriggerProps {
  initialRule?: RuleWithMeta;
  currentValues: RuleFormValues;
  buttonText?: string;
  disabled?: boolean;
  className?: string;
}

/**
 * A component that combines a DiffViewButton with a RuleDiffModal
 * Clicking the button opens the diff modal showing changes
 */
const DiffViewModalTrigger: React.FC<DiffViewModalTriggerProps> = ({
  initialRule,
  currentValues,
  buttonText = "View Changes",
  disabled = false,
  className = "",
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <DiffViewButton
        onClick={openModal}
        disabled={disabled}
        text={buttonText}
        className={className}
      />

      <RuleDiffModal
        isOpen={isModalOpen}
        onClose={closeModal}
        initialRule={initialRule}
        currentValues={currentValues}
      />
    </>
  );
};

export default DiffViewModalTrigger;
