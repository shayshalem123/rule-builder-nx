import React from "react";
import { cn } from "@/shared/utils/cn";

export type Tab = {
  id: string;
  label: string;
};

interface TabNavigationProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

const TabNavigation: React.FC<TabNavigationProps> = ({
  tabs,
  activeTab,
  onTabChange,
}) => {
  return (
    <div className="border-b mb-6">
      <nav className="flex space-x-6" aria-label="Tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={cn(
              "py-3 px-1 text-sm font-medium border-b-2 -mb-px",
              activeTab === tab.id
                ? "border-info text-info"
                : "border-transparent text-text-primary hover:text-text-secondary hover:border-border-primary"
            )}
            aria-current={activeTab === tab.id ? "page" : undefined}
          >
            {tab.label}
          </button>
        ))}
      </nav>
    </div>
  );
};

export default TabNavigation;
