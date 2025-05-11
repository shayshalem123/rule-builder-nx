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
      <div className="inline-flex p-0.5 rounded-md bg-gray-100 shadow-inner">
        <button
          type="button"
          onClick={() => onChange(true)}
          className={`py-1.5 px-4 rounded text-sm flex items-center transition-colors ${
            value
              ? "bg-green-100 text-green-700 font-medium shadow-sm"
              : "text-gray-600 hover:text-gray-800"
          }`}
        >
          <ThumbsUp
            className={`h-3.5 w-3.5 mr-1.5 ${
              value ? "text-green-600" : "text-gray-500"
            }`}
          />
          Rule Should Pass
        </button>
        <button
          type="button"
          onClick={() => onChange(false)}
          className={`py-1.5 px-4 rounded text-sm flex items-center transition-colors ${
            !value
              ? "bg-red-100 text-red-700 font-medium shadow-sm"
              : "text-gray-600 hover:text-gray-800"
          }`}
        >
          <ThumbsDown
            className={`h-3.5 w-3.5 mr-1.5 ${
              !value ? "text-red-600" : "text-gray-500"
            }`}
          />
          Rule Should Fail
        </button>
      </div>
    </div>
  );
};

export default PassFailToggle;
