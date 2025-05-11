import React from "react";

interface ExtraPropertiesPanelProps {
  properties: Record<string, unknown>;
}

const ExtraPropertiesPanel: React.FC<ExtraPropertiesPanelProps> = ({
  properties,
}) => {
  if (!properties || Object.keys(properties).length === 0) {
    return null;
  }

  const renderPropertyValue = (value: unknown): React.ReactNode => {
    if (value === null)
      return <span className="text-text-muted italic">null</span>;

    if (typeof value === "boolean") {
      return value ? (
        <span className="text-success">true</span>
      ) : (
        <span className="text-destructive">false</span>
      );
    }

    if (typeof value === "number" || typeof value === "string") {
      return <span>{String(value)}</span>;
    }

    if (Array.isArray(value)) {
      if (value.length === 0)
        return <span className="text-text-muted italic">[]</span>;

      return (
        <ul className="list-disc list-inside">
          {value.map((item, index) => (
            <li key={index} className="ml-2">
              {renderPropertyValue(item)}
            </li>
          ))}
        </ul>
      );
    }

    if (typeof value === "object") {
      return (
        <div className="pl-4 border-l-2 border-border-primary">
          {Object.entries(value).map(([key, val]) => (
            <div key={key} className="mb-2">
              <span className="font-medium text-text-secondary">{key}: </span>
              {renderPropertyValue(val)}
            </div>
          ))}
        </div>
      );
    }

    return String(value);
  };

  return (
    <div className="bg-background-secondary p-6 rounded-lg shadow-sm">
      <h2 className="text-lg font-semibold mb-4">Extra Properties</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.entries(properties).map(([key, value]) => (
          <div key={key}>
            <h3 className="text-sm font-medium text-text-primary">{key}</h3>
            <div className="mt-1">
              <div className="text-sm text-text-secondary">
                {renderPropertyValue(value)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExtraPropertiesPanel;
