import React, { useState, useMemo } from "react";
import { useRules } from "@/features/rules/hooks/useRules";
import RuleList from "@/features/rules/components/RuleList";
import { RuleWithMeta } from "@/features/rules/types/rule";
import { useNavigate } from "react-router-dom";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/shared/components/inputs/tabs";

const RulesPage: React.FC = () => {
  const { data: rules = [], isLoading, error } = useRules();
  const navigate = useNavigate();

  const groupedRules = useMemo(() => {
    return rules.reduce<Record<string, RuleWithMeta[]>>((acc, rule) => {
      acc[rule.destination] = [...(acc[rule.destination] ?? []), rule];

      return acc;
    }, {});
  }, [rules]);

  const destinations = useMemo(
    () => Object.keys(groupedRules).sort(),
    [groupedRules]
  );

  const [activeDestination, setActiveDestination] = useState<string>(
    destinations.length > 0 ? destinations[0] : ""
  );

  const handleCreateRule = () => {
    navigate("/rules/create");
  };

  const handleEditRule = (rule: RuleWithMeta) => {
    if (rule.id) {
      navigate(`/rules/edit/${rule.id}`);
    }
  };

  const handleViewRule = (rule: RuleWithMeta) => {
    if (rule.id) {
      navigate(`/rules/${rule.id}`);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-800">
          Rules by Destination
        </h1>

        {isLoading ? (
          <div className="animate-pulse h-10 bg-gray-200 rounded w-full max-w-md"></div>
        ) : destinations.length > 0 ? (
          <Tabs
            value={activeDestination}
            onValueChange={setActiveDestination}
            className="w-full"
          >
            <TabsList className="mb-6">
              {destinations.map((destination) => (
                <TabsTrigger key={destination} value={destination}>
                  Destination {destination} ({groupedRules[destination].length})
                </TabsTrigger>
              ))}
            </TabsList>

            {destinations.map((destination) => (
              <TabsContent key={destination} value={destination}>
                <RuleList
                  rules={groupedRules[destination]}
                  isLoading={isLoading}
                  error={error as Error}
                  onCreateRule={handleCreateRule}
                  onEditRule={handleEditRule}
                  // onViewRule={handleViewRule}
                />
              </TabsContent>
            ))}
          </Tabs>
        ) : !isLoading ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-300">
            <h3 className="text-lg font-medium text-gray-600 mb-2">
              No rules found
            </h3>
            <p className="text-gray-500 mb-4">
              Get started by creating your first rule.
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default RulesPage;
