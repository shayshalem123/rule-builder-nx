import React from "react";
import { Button } from "@/shared/components/inputs/button";
import { GitCompare } from "lucide-react";

interface DiffViewButtonProps {
  onClick: () => void;
  disabled?: boolean;
  className?: string;
  text?: string;
}

/**
 * A reusable button component for triggering diff view modals
 */
const DiffViewButton: React.FC<DiffViewButtonProps> = ({
  onClick,
  disabled = false,
  className = "",
  text = "Show Changes",
}) => {
  return (
    <Button
      type="button"
      variant="outline"
      onClick={onClick}
      disabled={disabled}
      className={`flex items-center gap-2 ${className}`}
    >
      <GitCompare className="h-4 w-4" />
      {text}
    </Button>
  );
};

export default DiffViewButton;
