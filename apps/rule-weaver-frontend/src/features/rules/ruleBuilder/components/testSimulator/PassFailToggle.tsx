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
      <div className="inline-flex p-1 rounded-lg bg-gray-100 shadow-inner">
        <button
          type="button"
          onClick={() => onChange(true)}
          className={`py-2.5 px-5 rounded-md flex items-center transition-colors ${
            value
              ? "bg-green-100 text-green-700 font-medium shadow-sm"
              : "text-gray-600 hover:text-gray-800"
          }`}
        >
          <ThumbsUp
            className={`h-4 w-4 mr-2 ${
              value ? "text-green-600" : "text-gray-500"
            }`}
          />
          Rule Should Pass
        </button>
        <button
          type="button"
          onClick={() => onChange(false)}
          className={`py-2.5 px-5 rounded-md flex items-center transition-colors ${
            !value
              ? "bg-red-100 text-red-700 font-medium shadow-sm"
              : "text-gray-600 hover:text-gray-800"
          }`}
        >
          <ThumbsDown
            className={`h-4 w-4 mr-2 ${
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
