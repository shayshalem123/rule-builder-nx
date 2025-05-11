import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/shared/components/inputs/dialog";
import { RuleWithMeta } from "../../types/rule";
import { useRuleImpact, DateRange } from "../hooks/useRuleImpact";
import { Button } from "@/shared/components/inputs/button";
import {
  Loader2,
  DatabaseIcon,
  BarChart2,
  AlertTriangle,
  RefreshCw,
  FileText,
  Percent,
  ArrowUp,
  ArrowDown,
  MinusIcon,
  ArrowRightLeft,
  HistoryIcon,
  CalendarIcon,
} from "lucide-react";
import { Progress } from "@/shared/components/inputs/progress";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/shared/components/inputs/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/inputs/select";

// Date range type
// type DateRange = "all" | "day" | "week" | "month";

interface ImpactAnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
  rule?: RuleWithMeta;
}

// Simulated previous impact data with slightly different numbers
const getPreviousImpactData = (currentData: any) => {
  if (!currentData) return null;

  // Generate realistic previous data that's somewhat different
  const percentDiff =
    Math.random() > 0.5
      ? Math.random() * 10 + 2 // Increase
      : -Math.random() * 10 - 2; // Decrease

  const prevPercentage = Math.max(
    0,
    Math.min(100, currentData.percentageImpact - percentDiff)
  );
  const prevTotal = currentData.totalDocuments;
  const prevAffected = Math.round((prevPercentage / 100) * prevTotal);

  return {
    affectedDocuments: prevAffected,
    totalDocuments: prevTotal,
    percentageImpact: prevPercentage,
  };
};

const ImpactAnalysisModal: React.FC<ImpactAnalysisModalProps> = ({
  isOpen,
  onClose,
  rule,
}) => {
  const [activeTab, setActiveTab] = useState<"current" | "comparison">(
    "current"
  );
  const [prevImpactData, setPrevImpactData] = useState<any>(null);
  const [dateRange, setDateRange] = useState<DateRange>("all");

  const { impactData, isLoading, isError, triggerImpactAnalysis, refetch } =
    useRuleImpact(rule, dateRange);

  // Run analysis when modal opens and rule is provided
  useEffect(() => {
    if (isOpen && rule && !impactData && !isLoading) {
      triggerImpactAnalysis.mutate();
    }
  }, [isOpen, rule, impactData, isLoading, triggerImpactAnalysis]);

  // Generate previous impact data for comparison
  useEffect(() => {
    if (impactData && !prevImpactData) {
      setPrevImpactData(getPreviousImpactData(impactData));
    }
  }, [impactData, prevImpactData]);

  const handleRefresh = () => {
    refetch();
    setPrevImpactData(null); // Reset the previous data when refreshing
  };

  const handleDateRangeChange = (value: DateRange) => {
    setDateRange(value);
    setPrevImpactData(null);
    refetch();
  };

  // Calculate changes between current and previous data
  const getChangeDetails = () => {
    if (!impactData || !prevImpactData) return null;

    const docChange =
      impactData.affectedDocuments - prevImpactData.affectedDocuments;
    const percentChange =
      impactData.percentageImpact - prevImpactData.percentageImpact;

    return {
      docChange,
      docChangePercent: (docChange / prevImpactData.affectedDocuments) * 100,
      percentChange,
      isIncrease: docChange > 0,
      isDecrease: docChange < 0,
      isNoChange: docChange === 0,
    };
  };

  const changeDetails = getChangeDetails();

  // Helper to get date range text
  const getDateRangeText = () => {
    switch (dateRange) {
      case "day":
        return "Last 24 hours";
      case "week":
        return "Last 7 days";
      case "month":
        return "Last 30 days";
      default:
        return "All time";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl w-full">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <DatabaseIcon className="h-5 w-5 text-primary" />
            <span>Rule Impact Analysis</span>
          </DialogTitle>
          <DialogDescription>
            See how many documents would be affected by this rule.
          </DialogDescription>
        </DialogHeader>

        {/* Date range selector */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <CalendarIcon className="h-4 w-4 text-muted-foreground mr-2" />
            <span className="text-sm text-muted-foreground mr-2">
              Time range:
            </span>
            <Select
              value={dateRange}
              onValueChange={(value) =>
                handleDateRangeChange(value as DateRange)
              }
            >
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Select range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All time</SelectItem>
                <SelectItem value="day">Last day</SelectItem>
                <SelectItem value="week">Last week</SelectItem>
                <SelectItem value="month">Last month</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {impactData && !isLoading && (
            <div className="text-sm text-muted-foreground">
              Analyzing impact for{" "}
              <span className="font-medium">{getDateRangeText()}</span>
            </div>
          )}
        </div>

        <Tabs
          value={activeTab}
          onValueChange={(value) =>
            setActiveTab(value as "current" | "comparison")
          }
          className="mt-2"
        >
          <TabsList className="w-full grid grid-cols-2 mb-4">
            <TabsTrigger value="current">Current Impact</TabsTrigger>
            <TabsTrigger value="comparison" disabled={!changeDetails}>
              <ArrowRightLeft className="mr-2 h-4 w-4" />
              Comparison
            </TabsTrigger>
          </TabsList>

          <TabsContent value="current" className="py-2">
            {/* Loading state */}
            {isLoading && (
              <div className="flex flex-col items-center justify-center py-10">
                <Loader2 className="h-10 w-10 text-primary animate-spin mb-4" />
                <p className="text-text-secondary">Analyzing rule impact...</p>
              </div>
            )}

            {/* Error state */}
            {isError && (
              <div className="bg-destructive/10 p-6 rounded-lg border border-destructive/20 text-center">
                <AlertTriangle className="h-10 w-10 text-destructive mx-auto mb-4" />
                <h3 className="text-lg font-medium text-destructive mb-2">
                  Analysis Failed
                </h3>
                <p className="text-text-secondary mb-4">
                  We couldn't analyze the impact of this rule. Please try again.
                </p>
                <Button
                  variant="outline"
                  onClick={handleRefresh}
                  className="mx-auto"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Retry Analysis
                </Button>
              </div>
            )}

            {/* Results state */}
            {impactData && !isLoading && !isError && (
              <div className="space-y-6">
                {/* Stats cards */}
                <div className="grid grid-cols-3 gap-6">
                  <div className="bg-background-primary p-6 rounded-lg border border-border-primary flex items-start">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mr-4 flex-shrink-0">
                      <FileText className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-text-secondary mb-1">
                        Affected Documents
                      </h3>
                      <p className="text-2xl font-bold">
                        {impactData.affectedDocuments.toLocaleString()}
                      </p>
                      <p className="text-xs text-text-secondary mt-1">
                        out of {impactData.totalDocuments.toLocaleString()}{" "}
                        total documents
                      </p>
                    </div>
                  </div>

                  <div className="bg-background-primary p-6 rounded-lg border border-border-primary flex items-start">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mr-4 flex-shrink-0">
                      <Percent className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-text-secondary mb-1">
                        Impact Percentage
                      </h3>
                      <p className="text-2xl font-bold">
                        {impactData.percentageImpact.toFixed(1)}%
                      </p>
                      <p className="text-xs text-text-secondary mt-1">
                        of your{" "}
                        {dateRange !== "all"
                          ? getDateRangeText().toLowerCase()
                          : "entire"}{" "}
                        document collection
                      </p>
                    </div>
                  </div>

                  <div className="bg-background-primary p-6 rounded-lg border border-border-primary flex items-start">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mr-4 flex-shrink-0">
                      <BarChart2 className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-text-secondary mb-1">
                        Impact Level
                      </h3>
                      <p className="text-2xl font-bold">
                        {impactData.percentageImpact < 1
                          ? "Minimal"
                          : impactData.percentageImpact < 10
                          ? "Low"
                          : impactData.percentageImpact < 30
                          ? "Moderate"
                          : impactData.percentageImpact < 70
                          ? "High"
                          : "Critical"}
                      </p>
                      <p className="text-xs text-text-secondary mt-1">
                        based on percentage of affected documents
                      </p>
                    </div>
                  </div>
                </div>

                {/* Visualization */}
                <div className="bg-background-primary p-6 rounded-lg border border-border-primary">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-medium">Impact Visualization</h3>
                    <div className="flex items-center px-3 py-1.5 bg-primary-muted rounded-full text-primary text-sm">
                      <BarChart2 className="h-4 w-4 mr-2" />
                      <span>
                        {impactData.percentageImpact.toFixed(1)}% impact
                      </span>
                    </div>
                  </div>

                  <div className="relative pt-8 pb-12">
                    <div className="absolute top-0 left-0 right-0 flex justify-between text-xs text-text-secondary">
                      <span>0%</span>
                      <span>25%</span>
                      <span>50%</span>
                      <span>75%</span>
                      <span>100%</span>
                    </div>

                    <Progress
                      value={impactData.percentageImpact}
                      className="h-8 rounded-md my-2 relative overflow-hidden"
                    />

                    {/* Impact marker */}
                    <div
                      className="absolute top-1/2 transform -translate-y-1/2 -translate-x-1/2 mt-0.5 z-10"
                      style={{
                        left: `${Math.min(
                          Math.max(impactData.percentageImpact, 1),
                          99
                        )}%`,
                      }}
                    >
                      <div className="bg-background-secondary text-text-primary px-2 py-1 rounded text-xs font-semibold border border-border-secondary">
                        {impactData.percentageImpact.toFixed(1)}%
                      </div>
                    </div>

                    {/* Scale */}
                    <div className="absolute bottom-0 left-0 right-0 flex justify-between">
                      <div className="text-center">
                        <div className="mx-auto h-4 border-l border-text-secondary/20"></div>
                        <span className="text-xs text-text-secondary">
                          Minimal
                        </span>
                      </div>
                      <div className="text-center">
                        <div className="mx-auto h-4 border-l border-text-secondary/20"></div>
                        <span className="text-xs text-text-secondary">Low</span>
                      </div>
                      <div className="text-center">
                        <div className="mx-auto h-4 border-l border-text-secondary/20"></div>
                        <span className="text-xs text-text-secondary">
                          Moderate
                        </span>
                      </div>
                      <div className="text-center">
                        <div className="mx-auto h-4 border-l border-text-secondary/20"></div>
                        <span className="text-xs text-text-secondary">
                          High
                        </span>
                      </div>
                      <div className="text-center">
                        <div className="mx-auto h-4 border-l border-text-secondary/20"></div>
                        <span className="text-xs text-text-secondary">
                          Critical
                        </span>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-text-secondary mt-4 text-center">
                    This rule would affect{" "}
                    {impactData.affectedDocuments.toLocaleString()} out of{" "}
                    {impactData.totalDocuments.toLocaleString()} documents
                    {dateRange !== "all" &&
                      ` in the ${getDateRangeText().toLowerCase()}`}
                    .
                  </p>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="comparison" className="py-2">
            {changeDetails && impactData && prevImpactData && (
              <div className="space-y-6">
                {/* Change Summary Card */}
                <div className="bg-background-primary p-6 rounded-lg border border-border-primary">
                  <div className="flex items-center mb-4">
                    <HistoryIcon className="h-5 w-5 text-primary mr-2" />
                    <h3 className="font-medium">Change Summary</h3>
                  </div>

                  <div className="flex items-center justify-center py-4">
                    <div
                      className={`text-center px-6 py-3 rounded-lg ${
                        changeDetails.isIncrease
                          ? "bg-red-50 text-red-700 border border-red-200"
                          : changeDetails.isDecrease
                          ? "bg-green-50 text-green-700 border border-green-200"
                          : "bg-amber-50 text-amber-700 border border-amber-200"
                      }`}
                    >
                      <div className="flex items-center justify-center mb-2">
                        {changeDetails.isIncrease && (
                          <ArrowUp className="h-5 w-5 mr-1" />
                        )}
                        {changeDetails.isDecrease && (
                          <ArrowDown className="h-5 w-5 mr-1" />
                        )}
                        {changeDetails.isNoChange && (
                          <MinusIcon className="h-5 w-5 mr-1" />
                        )}
                        <span className="text-lg font-semibold">
                          {changeDetails.isIncrease && "+"}
                          {changeDetails.isNoChange
                            ? "No change"
                            : `${Math.abs(
                                changeDetails.docChange
                              ).toLocaleString()} documents`}
                        </span>
                      </div>
                      <p className="text-sm">
                        {changeDetails.isIncrease &&
                          "This rule will affect more documents than before"}
                        {changeDetails.isDecrease &&
                          "This rule will affect fewer documents than before"}
                        {changeDetails.isNoChange &&
                          "This rule affects the same number of documents as before"}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6 mt-6">
                    <div>
                      <h4 className="text-sm font-medium text-text-secondary mb-3">
                        Before Changes
                      </h4>
                      <div className="bg-background-secondary p-4 rounded-lg border border-border-primary">
                        <div className="flex justify-between mb-2">
                          <span className="text-sm">Affected Documents:</span>
                          <span className="font-medium">
                            {prevImpactData.affectedDocuments.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Impact Percentage:</span>
                          <span className="font-medium">
                            {prevImpactData.percentageImpact.toFixed(1)}%
                          </span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-text-secondary mb-3">
                        After Changes
                      </h4>
                      <div className="bg-background-secondary p-4 rounded-lg border border-border-primary">
                        <div className="flex justify-between mb-2">
                          <span className="text-sm">Affected Documents:</span>
                          <span className="font-medium">
                            {impactData.affectedDocuments.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Impact Percentage:</span>
                          <span className="font-medium">
                            {impactData.percentageImpact.toFixed(1)}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Comparison Visualization */}
                <div className="bg-background-primary p-6 rounded-lg border border-border-primary">
                  <h3 className="font-medium mb-4">Impact Comparison</h3>

                  <div className="mb-8 relative">
                    <div className="text-xs text-text-secondary mb-1">
                      Before Changes
                    </div>
                    <div className="relative h-6">
                      <Progress
                        value={prevImpactData.percentageImpact}
                        className="h-6 rounded-md"
                      />
                      <div className="absolute right-0 -top-1 text-xs bg-background-primary px-1 rounded border border-border-primary">
                        {prevImpactData.percentageImpact.toFixed(1)}%
                      </div>
                    </div>
                  </div>

                  <div className="relative">
                    <div className="text-xs text-text-secondary mb-1">
                      After Changes
                    </div>
                    <div className="relative h-6">
                      <Progress
                        value={impactData.percentageImpact}
                        className="h-6 rounded-md"
                      />
                      <div className="absolute right-0 -top-1 text-xs bg-background-primary px-1 rounded border border-border-primary">
                        {impactData.percentageImpact.toFixed(1)}%
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 text-sm text-text-secondary">
                    <div className="flex items-center">
                      <div
                        className={`w-2 h-2 rounded-full mr-2 ${
                          changeDetails.isIncrease
                            ? "bg-red-500"
                            : changeDetails.isDecrease
                            ? "bg-green-500"
                            : "bg-amber-500"
                        }`}
                      ></div>
                      <span>
                        {changeDetails.isIncrease &&
                          `Impact increased by ${changeDetails.percentChange.toFixed(
                            1
                          )}%`}
                        {changeDetails.isDecrease &&
                          `Impact decreased by ${Math.abs(
                            changeDetails.percentChange
                          ).toFixed(1)}%`}
                        {changeDetails.isNoChange && "No change in impact"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>

        <DialogFooter>
          {!isLoading && impactData && (
            <Button
              variant="outline"
              onClick={handleRefresh}
              size="sm"
              className="mr-auto"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh Analysis
            </Button>
          )}
          <Button onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ImpactAnalysisModal;