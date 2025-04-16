import React from "react";
import { RuleType } from "../../types/rule";
import { isBaseRule, isAndRule, isOrRule } from "../../utils/ruleUtils";
import BaseRuleViewer from "./BaseRuleViewer";
import GroupRuleViewer from "./GroupRuleViewer";

interface RuleViewerProps {
  rule: RuleType;
}

const RuleViewer: React.FC<RuleViewerProps> = ({ rule }) => {
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

  return <div className="space-y-4">{renderRule(rule)}</div>;
};

export default RuleViewer;
