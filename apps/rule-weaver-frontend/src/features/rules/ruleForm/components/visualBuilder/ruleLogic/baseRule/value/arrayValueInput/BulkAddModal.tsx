import React, { useState, useEffect, useMemo } from "react";
import { Badge } from "@/shared/components/inputs/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/shared/components/inputs/dialog";
import { Textarea } from "@/shared/components/inputs/textarea";
import { Button } from "@/shared/components/inputs/button";

interface BulkAddModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (newValues: string[]) => void;
  existingValues: string[];
  currentInputValue: string;
  onInputCleared: () => void;
}

// Helper function to format values for bulk editing
const formatValuesForBulkInput = (values: string[]): string => {
  return values.map((val) => (val.includes(" ") ? `"${val}"` : val)).join(" ");
};

export const BulkAddModal: React.FC<BulkAddModalProps> = ({
  isOpen,
  onClose,
  onAdd,
  existingValues,
  currentInputValue,
  onInputCleared,
}) => {
  const formattedExistingValues = useMemo(
    () => formatValuesForBulkInput(existingValues),
    [existingValues]
  );

  const [bulkInputValue, setBulkInputValue] = useState("");
  const [previewTags, setPreviewTags] = useState<string[]>([]);

  useEffect(() => {
    if (isOpen) setBulkInputValue(formattedExistingValues);
  }, [isOpen, formattedExistingValues]);

  useEffect(() => {
    if (bulkInputValue.trim()) {
      const newPreviewTags = parseInputToTags(bulkInputValue);
      setPreviewTags(newPreviewTags);
    } else {
      setPreviewTags([]);
    }
  }, [bulkInputValue]);

  const handleBulkAdd = () => {
    if (!bulkInputValue.trim() && !currentInputValue.trim()) {
      onClose();
      return;
    }

    const newItems = parseInputToTags(bulkInputValue);

    if (currentInputValue.trim()) {
      newItems.push(currentInputValue.trim());
      onInputCleared();
    }

    onAdd(newItems);
    onClose();
    setBulkInputValue("");
    setPreviewTags([]);
  };

  const handleBulkInputKeyDown = (
    e: React.KeyboardEvent<HTMLTextAreaElement>
  ) => {
    if (e.key === "Enter" && e.ctrlKey) {
      e.preventDefault();
      handleBulkAdd();
    }
  };

  const handleBulkInputPaste = () => {
    setTimeout(() => {
      const newPreviewTags = parseInputToTags(bulkInputValue);
      setPreviewTags(newPreviewTags);
    }, 0);
  };

  const handleClose = () => {
    onClose();
    setBulkInputValue("");
    setPreviewTags([]);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Values</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <p className="text-sm text-muted-foreground">
            Edit or enter multiple values separated by spaces. Use double quotes
            for values that include spaces. Press Ctrl+Enter to save changes.
          </p>
          <div className="border rounded-md">
            <Textarea
              value={bulkInputValue}
              onChange={(e) => setBulkInputValue(e.target.value)}
              onKeyDown={handleBulkInputKeyDown}
              onPaste={handleBulkInputPaste}
              className="min-h-[120px] focus:outline-none"
              placeholder='Example: value1 value2 "value with spaces" value3'
            />
          </div>

          {previewTags.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium">Preview:</p>
              <div className="flex flex-wrap gap-1 p-2 border border-dashed rounded-md min-h-[38px] max-h-[150px] overflow-y-auto">
                {previewTags.map((tag, index) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className="py-0 h-6 bg-background-primary"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button type="button" onClick={handleBulkAdd}>
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const parseInputToTags = (input: string): string[] => {
  const matches: string[] = input.match(/("([^"]*)")|([^\s]+)/g) ?? [];

  return matches.map((item) => {
    if (item.startsWith('"') && item.endsWith('"')) {
      return item.slice(1, -1);
    }
    return item;
  });
};
