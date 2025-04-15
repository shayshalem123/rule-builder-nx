import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSchema } from "../hooks/useSchemas";
import { Button } from "@/shared/components/inputs/button";
import { ArrowLeft, Book, Calendar, Tag, User } from "lucide-react";
import { Badge } from "@/shared/components/inputs/badge";
import SchemaViewer from "../components/SchemaViewer";
import useSchemaFields from "../hooks/useSchemaFields";

const SchemaDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { schema, isLoading, error } = useSchema(id!);
  const { leafFieldCount } = useSchemaFields(schema);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate("/schemas")}
            className="mb-2"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Schemas
          </Button>
          <h1 className="text-2xl font-bold">Schema Details</h1>
        </div>
        <div className="h-48 rounded-lg bg-gray-100 animate-pulse"></div>
      </div>
    );
  }

  if (error || !schema) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate("/schemas")}
            className="mb-2"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Schemas
          </Button>
          <h1 className="text-2xl font-bold">Schema Details</h1>
        </div>
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md">
          {error instanceof Error
            ? error.message
            : "Schema not found or error loading schema."}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => navigate("/schemas")}
          className="mb-2"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Schemas
        </Button>
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">{schema.name}</h1>
          <Button onClick={() => navigate(`/schemas/edit/${id}`)}>
            Edit Schema
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Schema Information</h2>

            <div className="space-y-4">
              {schema.description && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    Description
                  </h3>
                  <p className="mt-1 text-sm text-gray-900">
                    {schema.description}
                  </p>
                </div>
              )}

              <div>
                <h3 className="text-sm font-medium text-gray-500">Version</h3>
                <div className="mt-1">
                  <Badge
                    variant="outline"
                    className="bg-blue-50 text-blue-700 border-blue-200"
                  >
                    v{schema.version}
                  </Badge>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500">Category</h3>
                <div className="mt-1 flex items-center gap-1">
                  <Tag className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-gray-900">
                    {schema.category}
                  </span>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500">Fields</h3>
                <div className="mt-1 flex items-center gap-1">
                  <Book className="h-4 w-4 text-purple-600" />
                  <span className="text-sm text-gray-900">
                    {leafFieldCount} value fields defined
                  </span>
                </div>
              </div>

              {schema.createdBy && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    Created By
                  </h3>
                  <div className="mt-1 flex items-center gap-1">
                    <User className="h-4 w-4 text-gray-600" />
                    <span className="text-sm text-gray-900">
                      {schema.createdBy.name}
                    </span>
                  </div>
                </div>
              )}

              {schema.createdAt && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    Created At
                  </h3>
                  <div className="mt-1 flex items-center gap-1">
                    <Calendar className="h-4 w-4 text-gray-600" />
                    <span className="text-sm text-gray-900">
                      {new Date(schema.createdAt).toLocaleDateString(
                        undefined,
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        }
                      )}
                    </span>
                  </div>
                </div>
              )}

              {schema.updatedAt && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    Last Updated
                  </h3>
                  <div className="mt-1 flex items-center gap-1">
                    <Calendar className="h-4 w-4 text-gray-600" />
                    <span className="text-sm text-gray-900">
                      {new Date(schema.updatedAt).toLocaleDateString(
                        undefined,
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        }
                      )}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          <SchemaViewer definition={schema.definition} />
        </div>
      </div>
    </div>
  );
};

export default SchemaDetailsPage;
