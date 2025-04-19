import React, { useState, useEffect, useRef } from "react";
import { Layers, Maximize } from "lucide-react";
import { toast } from "sonner";

interface SettingsMenuProps {
  isOpen: boolean;
  onClose: () => void;
  defaultStickyProperties?: boolean;
  onStickyPropertiesChange: (enabled: boolean) => void;
  isFullscreen?: boolean;
  onToggleFullscreen?: () => void;
}

/**
 * Settings menu dropdown for the JSON editor
 */
const SettingsMenu: React.FC<SettingsMenuProps> = ({
  isOpen,
  onClose,
  defaultStickyProperties = false,
  onStickyPropertiesChange,
  isFullscreen = false,
  onToggleFullscreen,
}) => {
  const [stickyPropertiesEnabled, setStickyPropertiesEnabled] = useState(
    defaultStickyProperties
  );
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setStickyPropertiesEnabled(defaultStickyProperties);
  }, [defaultStickyProperties]);

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
    setStickyPropertiesEnabled(isEnabled);
    onStickyPropertiesChange(isEnabled);
    toast.info(
      isEnabled ? "Sticky properties enabled" : "Sticky properties disabled"
    );
  };

  const handleToggleFullscreen = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onToggleFullscreen) {
      onToggleFullscreen();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      ref={menuRef}
      className="absolute top-12 right-2 z-20 w-60 bg-white rounded-md shadow-lg border border-gray-200 p-3 text-sm"
    >
      <div className="font-medium mb-2 text-gray-700">JSON View Settings</div>
      <div className="space-y-3">
        <label className="flex items-center justify-between cursor-pointer">
          <div className="flex items-center gap-1.5">
            <Layers className="h-4 w-4 text-gray-500" />
            <span className="text-gray-700">Sticky Properties</span>
          </div>
          <input
            type="checkbox"
            checked={stickyPropertiesEnabled}
            onChange={handleToggleStickyProperties}
            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
        </label>

        {onToggleFullscreen && (
          <label className="flex items-center justify-between cursor-pointer">
            <div className="flex items-center gap-1.5">
              <Maximize className="h-4 w-4 text-gray-500" />
              <span className="text-gray-700">Fullscreen Mode</span>
            </div>
            <input
              type="checkbox"
              checked={isFullscreen}
              onChange={handleToggleFullscreen}
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
          </label>
        )}
      </div>
    </div>
  );
};

export default SettingsMenu;
