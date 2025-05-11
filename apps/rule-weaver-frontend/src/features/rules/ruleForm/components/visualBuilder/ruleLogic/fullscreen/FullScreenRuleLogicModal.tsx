import React from "react";
import { RuleType } from "@/features/rules/types/rule";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { cn } from "@/shared/utils/cn";
import { RuleLogicHeader } from "../RuleLogicHeader";
import { RuleLogicContent } from "../RuleLogicContent";

interface FullScreenRuleLogicModalProps {
  isOpen: boolean;
  onClose: () => void;
  ruleLogic: RuleType;
  handleRuleLogicChange: (rule: RuleType) => void;
  category: string;
}

const FullScreenRuleLogicModal: React.FC<FullScreenRuleLogicModalProps> = ({
  isOpen,
  onClose,
  ruleLogic,
  handleRuleLogicChange,
  category,
}) => {
  return (
    <DialogPrimitive.Root
      open={isOpen}
      onOpenChange={(open) => !open && onClose()}
    >
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <DialogPrimitive.Content
          className={cn(
            "fixed left-[20px] right-[20px] top-[20px] bottom-[20px] z-50 flex flex-col bg-background-secondary p-0 shadow-lg rounded-lg overflow-hidden",
            "data-[state=open]:animate-in data-[state=closed]:animate-out",
            "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
            "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95"
          )}
        >
          <RuleLogicHeader
            ruleLogic={ruleLogic}
            onRuleChange={handleRuleLogicChange}
            isFullScreen={true}
            onFullScreenChange={onClose}
            className="sticky top-0 bg-background-secondary p-4 border-b shadow-sm z-10"
          />

          <RuleLogicContent
            ruleLogic={ruleLogic}
            onRuleChange={handleRuleLogicChange}
            category={category}
            className="p-4 overflow-y-auto flex-1"
          />
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
};

export default FullScreenRuleLogicModal;
