import React, { useState } from "react";
import { X, Plus, ListFilter } from "lucide-react";
import { Button } from "@/shared/components/inputs/button";
import { Badge } from "@/shared/components/inputs/badge";

interface ValuesDisplayerProps {
  values: string[] | string;
}

const ValuesDisplayer: React.FC<ValuesDisplayerProps> = ({ values }) => {
  const [showModal, setShowModal] = useState(false);

  // If not an array, just display the value
  if (!Array.isArray(values)) {
    return <span>{String(values)}</span>;
  }

  // If array is empty
  if (values.length === 0) {
    return <span className="text-text-primary italic">No values</span>;
  }

  // Always show first 3 items (or all if 3 or fewer)
  const displayValues = values.slice(0, 3);
  const hasMoreValues = values.length > 3;
  const remainingCount = values.length - 3;

  return (
    <div>
      <div className="flex flex-wrap gap-2 items-center">
        {/* Show the first few values as badges */}
        {displayValues.map((val, idx) => (
          <Badge
            key={idx}
            variant="outline"
            className="bg-purple-50 text-purple-800 border-purple-200 hover:bg-purple-100 hover:text-purple-900"
          >
            {val}
          </Badge>
        ))}

        {/* Show count badge for remaining items */}
        {hasMoreValues && (
          <Badge
            variant="secondary"
            className="bg-purple-100 text-purple-800 hover:bg-purple-200 cursor-pointer"
            onClick={() => setShowModal(true)}
          >
            <Plus className="h-3 w-3 mr-1" />
            {remainingCount} more
          </Badge>
        )}
      </div>

      {/* Modal for viewing all values */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-background-secondary rounded-lg w-full max-w-md max-h-[80vh] flex flex-col">
            <div className="p-4 border-b border-border-primary flex justify-between items-center">
              <h3 className="text-lg font-medium">
                All Values ({values.length})
              </h3>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => setShowModal(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="p-4 overflow-y-auto flex-grow">
              <div className="flex flex-wrap gap-2">
                {values.map((val, idx) => (
                  <Badge
                    key={idx}
                    variant="outline"
                    className="bg-purple-50 text-purple-800 border-purple-200"
                  >
                    {val}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="p-4 border-t border-border-primary flex justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowModal(false)}
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ValuesDisplayer;
