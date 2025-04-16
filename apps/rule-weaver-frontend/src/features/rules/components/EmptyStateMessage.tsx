import React, { ReactNode } from "react";
import { Button } from "@/shared/components/inputs/button";
import { PlusCircle } from "lucide-react";

interface EmptyStateMessageProps {
  title: string;
  message: string;
  actionButton?: {
    label: string;
    onClick: () => void;
    icon?: ReactNode;
  };
}

const EmptyStateMessage: React.FC<EmptyStateMessageProps> = ({
  title,
  message,
  actionButton,
}) => {
  return (
    <div className="text-center py-10 bg-gray-50 rounded-lg">
      <h3 className="text-lg font-medium text-gray-600 mb-2">{title}</h3>
      <p className="text-gray-500 mb-4">{message}</p>
      {actionButton && (
        <Button onClick={actionButton.onClick}>
          {actionButton.icon || <PlusCircle className="mr-2 h-4 w-4" />}
          {actionButton.label}
        </Button>
      )}
    </div>
  );
};

export default EmptyStateMessage;
