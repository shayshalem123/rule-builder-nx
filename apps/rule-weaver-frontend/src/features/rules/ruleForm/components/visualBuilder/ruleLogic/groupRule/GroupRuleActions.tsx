import React from "react";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/shared/components/inputs/button";
import { Rules, RuleType } from "@/features/rules/types/rule";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/components/inputs/dropdown-menu";

interface GroupRuleActionsProps {
  isCollapsed: boolean;
  isAnd: boolean;
  groupType: "AND" | "OR";
  onAddRule: (type: Rules, creator: () => RuleType) => void;
  ruleMap: Record<Rules, () => RuleType>;
  onDelete?: () => void;
}

const GroupRuleActions: React.FC<GroupRuleActionsProps> = ({
  isCollapsed,
  isAnd,
  groupType,
  onAddRule,
  ruleMap,
  onDelete,
}) => {
  return (
    <div className="flex items-center space-x-2 z-10">
      {!isCollapsed && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 px-2 hover:bg-background-secondary/30"
              onClick={(e) => e.stopPropagation()}
            >
              <Plus className="h-4 w-4 mr-1" />
              Add
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onAddRule("BASE", ruleMap.BASE)}>
              Condition
            </DropdownMenuItem>
            {!isAnd ? (
              <DropdownMenuItem onClick={() => onAddRule("AND", ruleMap.AND)}>
                AND Group
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem onClick={() => onAddRule("OR", ruleMap.OR)}>
                OR Group
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
      {onDelete && (
        <Button
          variant="ghost"
          size="icon"
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="h-7 w-7 text-text-primary hover:text-red-500 hover:bg-background-secondary/30"
          title={`Delete ${groupType} group`}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};

export default GroupRuleActions;
