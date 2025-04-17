import React from "react";
import { BaseRule } from "@/features/rules/types/rule";

interface BaseRuleViewerProps {
  rule: BaseRule;
}

const BaseRuleViewer: React.FC<BaseRuleViewerProps> = ({ rule }) => {
  return (
    <div className="p-3 bg-white rounded-md border border-gray-200 shadow-sm">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
        <div className="bg-gray-50 p-2 rounded">
          <p className="text-xs text-gray-500">Field</p>
          <p className="font-medium">{rule.field}</p>
        </div>
        <div className="bg-gray-50 p-2 rounded">
          <p className="text-xs text-gray-500">Operator</p>
          <p className="font-medium">{rule.operator}</p>
        </div>
        <div className="bg-gray-50 p-2 rounded">
          <p className="text-xs text-gray-500">Value</p>
          <p className="font-medium overflow-x-auto">
            {Array.isArray(rule.value)
              ? rule.value.join(", ")
              : String(rule.value)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default BaseRuleViewer;
