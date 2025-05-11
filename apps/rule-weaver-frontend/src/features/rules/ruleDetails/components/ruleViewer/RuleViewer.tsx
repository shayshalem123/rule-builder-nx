import React, { useState } from "react";
import { RuleType } from "@/features/rules/types/rule";
import {
  isBaseRule,
  isAndRule,
  isOrRule,
} from "@/features/rules/shared/utils/ruleUtils";
import BaseRuleViewer from "./BaseRuleViewer";
import GroupRuleViewer from "./GroupRuleViewer";
import JsonEditor from "@/shared/components/jsonEditor/JsonEditor";
import TabNavigation from "@/features/rules/shared/components/TabNavigation";
import { Maximize2, Minimize2, Copy, Check } from "lucide-react";
import { Button } from "@/shared/components/inputs/button";
import { toast } from "sonner";

const TABS = [
  { id: "visual", label: "Visual View" },
  { id: "json", label: "JSON View" },
];

interface RuleViewerProps {
  rule: RuleType;
}

const RuleViewer: React.FC<RuleViewerProps> = ({ rule }) => {
  const [activeTab, setActiveTab] = useState<string>("visual");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [copied, setCopied] = useState(false);

  // Copy rule to clipboard
  const copyToClipboard = () => {
    navigator.clipboard
      .writeText(JSON.stringify(rule, null, 2))
      .then(() => {
        setCopied(true);
        toast.success("Rule copied to clipboard");
        setTimeout(() => setCopied(false), 2000);
      })
      .catch((err) => {
        toast.error("Failed to copy rule");
        console.error("Failed to copy rule:", err);
      });
  };

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
    <div
      className={`transition-all duration-300 ${
        isFullscreen
          ? "fixed inset-0 bg-background-secondary z-50 p-8 overflow-auto"
          : "space-y-4"
      }`}
    >
      <div className="flex justify-between items-center mb-4">
        <TabNavigation
          tabs={TABS}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={copyToClipboard}
            className="text-text-primary hover:text-text-secondary"
          >
            {copied ? (
              <Check className="h-4 w-4" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
            <span className="ml-1 text-sm">{copied ? "Copied" : "Copy"}</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="text-text-primary hover:text-text-secondary"
          >
            {isFullscreen ? (
              <Minimize2 className="h-4 w-4" />
            ) : (
              <Maximize2 className="h-4 w-4" />
            )}
            <span className="ml-1 text-sm">
              {isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
            </span>
          </Button>
        </div>
      </div>

      <div className={`${isFullscreen ? "mt-4" : ""}`}>
        {activeTab === "visual" ? (
          <div className="bg-background-primary p-4 rounded-lg border border-border-primary">
            {renderRule(rule)}
          </div>
        ) : (
          <div className="border border-border-primary rounded-lg overflow-hidden shadow-sm">
            <JsonEditor
              value={rule}
              readOnly={true}
              height={isFullscreen ? "80vh" : "400px"}
            />
          </div>
        )}
      </div>

      {isFullscreen && (
        <div className="absolute bottom-4 right-4">
          <Button onClick={() => setIsFullscreen(false)} className="shadow-lg">
            <Minimize2 className="h-4 w-4 mr-2" />
            Exit Fullscreen
          </Button>
        </div>
      )}
    </div>
  );
};

export default RuleViewer;
