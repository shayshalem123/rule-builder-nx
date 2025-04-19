import React from "react";
import { AlertCircle } from "lucide-react";

interface ErrorMessageProps {
  error: string | null;
}

/**
 * Component to display JSON validation errors
 */
const ErrorMessage: React.FC<ErrorMessageProps> = ({ error }) => {
  if (!error) return null;

  return (
    <div className="text-red-500 mt-2 flex items-start">
      <AlertCircle className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
      <span>{error}</span>
    </div>
  );
};

export default ErrorMessage;
