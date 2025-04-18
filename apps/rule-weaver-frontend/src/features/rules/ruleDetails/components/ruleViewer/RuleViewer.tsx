import React, { useState } from "react";
import { RuleType } from "@/features/rules/types/rule";
import {
  isBaseRule,
  isAndRule,
  isOrRule,
} from "@/features/rules/shared/utils/ruleUtils";
import BaseRuleViewer from "./BaseRuleViewer";
import GroupRuleViewer from "./GroupRuleViewer";
import JsonRuleEditor from "@/features/rules/shared/components/JsonRuleEditor";
import TabNavigation from "@/features/rules/shared/components/TabNavigation";

const TABS = [
  { id: "visual", label: "Visual View" },
  { id: "json", label: "JSON View" },
];

interface RuleViewerProps {
  rule: RuleType;
}

const RuleViewer: React.FC<RuleViewerProps> = ({ rule }) => {
  const [activeTab, setActiveTab] = useState<string>("visual");

  // Recursively render the rule tree
  const renderRule = (currentRule: RuleType) => {
    if (isBaseRule(currentRule)) {
      return <BaseRuleViewer rule={currentRule} />;
    } else if (isAndRule(currentRule)) {
      return (
        <GroupRuleViewer
          rules={currentRule.AND}
          groupType="AND"
          renderRule={renderRule}
        />
      );
    } else if (isOrRule(currentRule)) {
      return (
        <GroupRuleViewer
          rules={currentRule.OR}
          groupType="OR"
          renderRule={renderRule}
        />
      );
    }

    return <div>Unknown rule type</div>;
  };

  return (
    <div className="space-y-4">
      <TabNavigation
        tabs={TABS}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {activeTab === "visual" ? (
        renderRule(rule)
      ) : (
        <JsonRuleEditor rule={rule} readOnly={true} />
      )}
    </div>
  );
};

export default RuleViewer;
