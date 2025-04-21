import React from "react";
import { AlertCircle } from "lucide-react";
import { Button } from "./inputs/button";

interface ErrorMessageProps {
  title?: string;
  message: string;
  onRetry?: () => void;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({
  title = "Error",
  message,
  onRetry,
}) => {
  return (
    <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md">
      {onRetry ? (
        <div className="flex flex-col items-center text-red-500">
          <AlertCircle className="h-12 w-12 mb-4" />
          <h3 className="text-lg font-medium">{title}</h3>
          <p className="mt-1">{message}</p>
          <Button variant="outline" className="mt-4" onClick={onRetry}>
            Retry
          </Button>
        </div>
      ) : (
        <>
          <div className="font-semibold mb-1">{title}</div>
          <div>{message}</div>
        </>
      )}
    </div>
  );
};

export default ErrorMessage;
