import React from "react";
import { Button } from "@/shared/components/inputs/button";

interface FormActionsProps {
  onCancel: () => void;
  onSubmit: () => void;
  isLoading: boolean;
  isDisabled: boolean;
}

export const FormActions: React.FC<FormActionsProps> = ({
  onCancel,
  onSubmit,
  isLoading,
  isDisabled,
}) => {
  return (
    <div className="flex justify-end space-x-3">
      <Button
        variant="outline"
        onClick={onCancel}
        disabled={isLoading}
        type="button"
      >
        Cancel
      </Button>
      <Button
        onClick={onSubmit}
        disabled={isLoading || isDisabled}
        type="button"
      >
        {isLoading ? "Saving..." : "Save Rule"}
      </Button>
    </div>
  );
};
