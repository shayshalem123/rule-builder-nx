import React from "react";

interface LoadingStateProps {
  count?: number;
  type?: "card" | "row";
  columns?: 1 | 2 | 3 | 4;
}

const LoadingState: React.FC<LoadingStateProps> = ({
  count = 3,
  type = "card",
  columns = 3,
}) => {
  const items = Array.from({ length: count }, (_, i) => i);

  if (type === "card") {
    const gridCols =
      columns === 1
        ? "grid-cols-1"
        : columns === 2
        ? "grid-cols-1 sm:grid-cols-2"
        : columns === 3
        ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
        : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4";

    return (
      <div className="animate-pulse">
        <div className="h-6 bg-border-primary rounded w-1/4 mx-auto mb-4"></div>
        <div className={`grid gap-6 ${gridCols}`}>
          {items.map((i) => (
            <div key={i} className="h-64 rounded-lg bg-accent"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="animate-pulse space-y-4">
      <div className="h-6 bg-border-primary rounded w-1/4 mx-auto"></div>
      <div className="space-y-3">
        {items.map((i) => (
          <div key={i} className="h-10 bg-border-primary rounded"></div>
        ))}
      </div>
    </div>
  );
};

export default LoadingState;
