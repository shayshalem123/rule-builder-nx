import React from "react";
import { useNavigate } from "react-router-dom";
import { CreateSchema } from "../types/schema";
import { useCreateSchema } from "../hooks/useSchemas";
import SchemaForm from "../components/SchemaForm";
import { toast } from "sonner";
import { Button } from "@/shared/components/inputs/button";
import { ArrowLeft } from "lucide-react";

const CreateSchemaPage: React.FC = () => {
  const navigate = useNavigate();
  const { createSchema, isPending } = useCreateSchema();

  const handleSubmit = async (data: CreateSchema) => {
    try {
      await createSchema(data);
      toast.success("The schema has been successfully created.");
      navigate("/schemas");
    } catch (error) {
      toast.error("Failed to create the schema. Please try again.");
    }
  };

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
        <h1 className="text-2xl font-bold">Create Schema</h1>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm">
        <SchemaForm onSubmit={handleSubmit} isSubmitting={isPending} />
      </div>
    </div>
  );
};

export default CreateSchemaPage;
