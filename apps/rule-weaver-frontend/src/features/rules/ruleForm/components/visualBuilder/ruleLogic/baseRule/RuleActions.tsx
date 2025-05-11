import React from "react";
import { Trash2, Plus } from "lucide-react";
import { Button } from "@/shared/components/inputs/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/components/inputs/dropdown-menu";

interface RuleActionsProps {
  onConvertToGroup: (type: "AND" | "OR") => void;
  onDelete?: () => void;
  showDelete?: boolean;
  parentGroupType?: "AND" | "OR" | null;
}

const RuleActions: React.FC<RuleActionsProps> = ({
  onConvertToGroup,
  onDelete,
  showDelete = true,
  parentGroupType = null,
}) => {
  const showAndOption = parentGroupType !== "AND";
  const showOrOption = parentGroupType !== "OR";

  return (
    <div className="flex items-center gap-1 ml-2 whitespace-nowrap flex-shrink-0">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="text-text-primary hover:text-blue-500 flex items-center justify-center h-8 w-8"
            title="Add condition"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {showAndOption && (
            <DropdownMenuItem onClick={() => onConvertToGroup("AND")}>
              Convert to AND Group
            </DropdownMenuItem>
          )}
          {showOrOption && (
            <DropdownMenuItem onClick={() => onConvertToGroup("OR")}>
              Convert to OR Group
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
      {showDelete && onDelete && (
        <Button
          variant="ghost"
          size="icon"
          type="button"
          onClick={onDelete}
          className="text-text-primary hover:text-red-500 flex items-center justify-center h-8 w-8"
          title="Delete rule"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};

export default RuleActions;
