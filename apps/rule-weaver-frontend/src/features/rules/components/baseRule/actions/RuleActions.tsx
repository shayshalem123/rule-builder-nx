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
    <div className="flex items-center self-end gap-1">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="text-gray-500 hover:text-blue-500 flex items-center justify-center"
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
          onClick={onDelete}
          className="text-gray-500 hover:text-red-500 flex items-center justify-center"
          title="Delete rule"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};

export default RuleActions;
