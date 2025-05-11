import React, { useEffect, useRef } from "react";
import { Layers } from "lucide-react";
import { toast } from "sonner";

interface SettingsMenuProps {
  isOpen: boolean;
  onClose: () => void;
  stickyPropertiesEnabled: boolean;
  handleStickyPropertiesChange: (enabled: boolean) => void;
}

/**
 * Settings menu dropdown for the JSON editor
 */
const SettingsMenu: React.FC<SettingsMenuProps> = ({
  isOpen,
  onClose,
  stickyPropertiesEnabled,
  handleStickyPropertiesChange,
}) => {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        isOpen
      ) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose]);

  const handleToggleStickyProperties = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const isEnabled = e.target.checked;
    handleStickyPropertiesChange(isEnabled);
    toast.info(
      isEnabled ? "Sticky properties enabled" : "Sticky properties disabled"
    );
  };

  if (!isOpen) return null;

  return (
    <div
      ref={menuRef}
      className="absolute top-12 right-2 z-20 w-60 bg-background-secondary rounded-md shadow-lg border border-border-primary p-3 text-sm"
    >
      <div className="font-medium mb-2 text-text-secondary">
        JSON View Settings
      </div>
      <div className="space-y-3">
        <label className="flex items-center justify-between cursor-pointer">
          <div className="flex items-center gap-1.5">
            <Layers className="h-4 w-4 text-text-primary" />
            <span className="text-text-secondary">Sticky Properties</span>
          </div>
          <input
            type="checkbox"
            checked={stickyPropertiesEnabled}
            onChange={handleToggleStickyProperties}
            className="h-4 w-4 rounded border-border-primary text-info focus:ring-info"
          />
        </label>
      </div>
    </div>
  );
};

export default SettingsMenu;
