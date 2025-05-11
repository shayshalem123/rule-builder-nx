import React from "react";
import { ThumbsUp, ThumbsDown } from "lucide-react";

interface PassFailToggleProps {
  value: boolean;
  onChange: (value: boolean) => void;
  className?: string;
}

const PassFailToggle: React.FC<PassFailToggleProps> = ({
  value,
  onChange,
  className = "",
}) => {
  return (
    <div className={`flex justify-center ${className}`}>
      <div className="inline-flex p-0.5 rounded-md bg-accent shadow-inner">
        <button
          type="button"
          onClick={() => onChange(true)}
          className={`py-1.5 px-4 rounded text-sm flex items-center transition-colors ${
            value
              ? "bg-success/20 text-success font-medium shadow-sm"
              : "text-text-primary hover:text-text-secondary"
          }`}
        >
          <ThumbsUp
            className={`h-3.5 w-3.5 mr-1.5 ${
              value ? "text-success" : "text-text-primary"
            }`}
          />
          Rule Should Pass
        </button>
        <button
          type="button"
          onClick={() => onChange(false)}
          className={`py-1.5 px-4 rounded text-sm flex items-center transition-colors ${
            !value
              ? "bg-destructive/20 text-destructive font-medium shadow-sm"
              : "text-text-primary hover:text-text-secondary"
          }`}
        >
          <ThumbsDown
            className={`h-3.5 w-3.5 mr-1.5 ${
              !value ? "text-destructive" : "text-text-primary"
            }`}
          />
          Rule Should Fail
        </button>
      </div>
    </div>
  );
};

export default PassFailToggle;
