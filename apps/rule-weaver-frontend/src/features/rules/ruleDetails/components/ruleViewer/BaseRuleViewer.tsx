import React from "react";
import { BaseRule } from "@/features/rules/types/rule";
import { CircleEqual } from "lucide-react";
import ValuesDisplayer from "./ValuesDisplayer";

interface BaseRuleViewerProps {
  rule: BaseRule;
}

const BaseRuleViewer: React.FC<BaseRuleViewerProps> = ({ rule }) => {
  // Generate colors based on the operator
  const getOperatorStyles = () => {
    switch (rule.operator) {
      case "EQUALS":
        return {
          bgColor: "bg-green-50",
          iconColor: "text-green-600",
          icon: <CircleEqual className="h-4 w-4" />,
          borderColor: "border-green-100",
        };
      case "NOT_EQUALS":
        return {
          bgColor: "bg-red-50",
          iconColor: "text-red-600",
          icon: <CircleEqual className="h-4 w-4" />,
          borderColor: "border-red-100",
        };
      case "IN":
        return {
          bgColor: "bg-indigo-50",
          iconColor: "text-indigo-600",
          icon: <CircleEqual className="h-4 w-4" />,
          borderColor: "border-indigo-100",
        };
      default:
        return {
          bgColor: "bg-background-primary",
          iconColor: "text-text-primary",
          icon: <CircleEqual className="h-4 w-4" />,
          borderColor: "border-border-primary",
        };
    }
  };

  const { bgColor, iconColor, icon, borderColor } = getOperatorStyles();

  return (
    <div className="p-4 bg-background-secondary rounded-md border border-border-primary shadow-sm hover:shadow-md transition-shadow">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-50 p-3 rounded-md border border-blue-100">
          <p className="text-xs font-semibold text-blue-600 uppercase mb-1">
            Field
          </p>
          <p className="font-medium text-blue-900 break-words">{rule.field}</p>
        </div>

        <div className={`${bgColor} p-3 rounded-md border ${borderColor}`}>
          <div className="flex items-center mb-1">
            <span className={iconColor}>{icon}</span>
            <p
              className={`text-xs font-semibold uppercase ml-1.5 ${iconColor}`}
            >
              Operator
            </p>
          </div>
          <p className={`font-medium ${iconColor}`}>{rule.operator}</p>
        </div>

        <div className="bg-purple-50 p-3 rounded-md border border-purple-100">
          <p className="text-xs font-semibold text-purple-600 uppercase mb-1">
            Value
          </p>
          <div className="font-medium text-purple-900 break-words">
            <ValuesDisplayer values={rule.value} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BaseRuleViewer;
