import React from "react";
import { Button } from "@/shared/components/inputs/button";
import { Maximize, Minimize2 } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/shared/components/inputs/tooltip";

interface FullScreenToggleProps {
  isFullScreen: boolean;
  onToggle: () => void;
}

const FullScreenToggle: React.FC<FullScreenToggleProps> = ({
  isFullScreen,
  onToggle,
}) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          onClick={onToggle}
          className="h-8 w-8 mr-2 bg-background-secondary"
          type="button"
          aria-label={isFullScreen ? "Exit full screen" : "Enter full screen"}
        >
          {isFullScreen ? (
            <Minimize2 className="h-4 w-4" />
          ) : (
            <Maximize className="h-4 w-4" />
          )}
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        {isFullScreen ? "Exit full screen" : "Enter full screen"}
      </TooltipContent>
    </Tooltip>
  );
};

export default FullScreenToggle;
