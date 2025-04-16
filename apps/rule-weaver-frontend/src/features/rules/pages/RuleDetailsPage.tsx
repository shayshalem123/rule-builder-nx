import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useRule } from "../hooks/useRules";
import { Button } from "@/shared/components/inputs/button";
import { ArrowLeft, Calendar, MapPin, Tag, User } from "lucide-react";
import { Badge } from "@/shared/components/inputs/badge";
import RuleViewer from "../components/ruleViewer";

const RuleDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: rule, isLoading, error } = useRule(id || "");

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate("/rules")}
            className="mb-2"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Rules
          </Button>
          <h1 className="text-2xl font-bold">Rule Details</h1>
        </div>
        <div className="h-48 rounded-lg bg-gray-100 animate-pulse"></div>
      </div>
    );
  }

  if (error || !rule) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate("/rules")}
            className="mb-2"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Rules
          </Button>
          <h1 className="text-2xl font-bold">Rule Details</h1>
        </div>
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md">
          {error instanceof Error
            ? error.message
            : "Rule not found or error loading rule."}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => navigate("/rules")}
          className="mb-2"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Rules
        </Button>
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">{rule.name}</h1>
          <Button onClick={() => navigate(`/rules/edit/${id}`)}>
            Edit Rule
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Rule Information</h2>

            <div className="space-y-4">
              {rule.description && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    Description
                  </h3>
                  <p className="mt-1 text-sm text-gray-900">
                    {rule.description}
                  </p>
                </div>
              )}

              <div>
                <h3 className="text-sm font-medium text-gray-500">
                  Destination
                </h3>
                <div className="mt-1 flex items-center gap-1">
                  <MapPin className="h-4 w-4 text-amber-600" />
                  <span className="text-sm text-gray-900">
                    Destination {rule.destination}
                  </span>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500">Category</h3>
                <div className="mt-1 flex items-center gap-1">
                  <Tag className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-gray-900">{rule.category}</span>
                </div>
              </div>

              {rule.createdBy && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    Created By
                  </h3>
                  <div className="mt-1 flex items-center gap-1">
                    <User className="h-4 w-4 text-gray-600" />
                    <span className="text-sm text-gray-900">
                      {rule.createdBy.name}
                    </span>
                  </div>
                </div>
              )}

              {rule.createdAt && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    Created At
                  </h3>
                  <div className="mt-1 flex items-center gap-1">
                    <Calendar className="h-4 w-4 text-gray-600" />
                    <span className="text-sm text-gray-900">
                      {new Date(rule.createdAt).toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                </div>
              )}

              {rule.updatedAt && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    Last Updated
                  </h3>
                  <div className="mt-1 flex items-center gap-1">
                    <Calendar className="h-4 w-4 text-gray-600" />
                    <span className="text-sm text-gray-900">
                      {new Date(rule.updatedAt).toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Rule Logic</h2>
            <RuleViewer rule={rule.rule} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RuleDetailsPage;
