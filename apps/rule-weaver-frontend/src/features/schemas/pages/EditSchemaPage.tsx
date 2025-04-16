import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Schema, CreateSchema } from "../types/schema";
import { useSchema, useUpdateSchema } from "../hooks/useSchemas";
import SchemaForm from "../components/SchemaForm";
import { useToast } from "@/shared/components/inputs/use-toast";
import { Button } from "@/shared/components/inputs/button";
import { ArrowLeft } from "lucide-react";

const EditSchemaPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { schema, isLoading, error } = useSchema(id || "");
  const { updateSchema, isPending } = useUpdateSchema();
  const { toast } = useToast();

  const handleSubmit = async (data: CreateSchema) => {
    if (!id) return;

    try {
      // Create a complete Schema object with the ID
      const completeSchema: Schema = {
        ...data,
        id, // Add the ID from the URL
      };

      await updateSchema({ id, schema: completeSchema });
      toast({
        title: "Schema updated",
        description: "The schema has been successfully updated.",
      });
      navigate("/schemas");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update the schema. Please try again.",
        variant: "destructive",
      });
    }
  };

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
          <h1 className="text-2xl font-bold">Edit Schema</h1>
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
          <h1 className="text-2xl font-bold">Edit Schema</h1>
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
        <h1 className="text-2xl font-bold">Edit Schema</h1>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm">
        <SchemaForm
          initialData={schema}
          onSubmit={handleSubmit}
          isSubmitting={isPending}
        />
      </div>
    </div>
  );
};

export default EditSchemaPage;
