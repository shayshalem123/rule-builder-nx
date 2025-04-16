import React, { useState, useMemo, useEffect } from "react";
import { useSchemas, useDeleteSchema } from "../hooks/useSchemas";
import SchemaCard from "../components/SchemaCard";
import { Button } from "@/shared/components/inputs/button";
import { PlusCircle } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/shared/components/inputs/alert-dialog";
import { useToast } from "@/shared/components/inputs/use-toast";
import SchemaSearch from "../components/SchemaSearch";
import { SchemaWithMeta } from "../types/schema";

const SchemasPage: React.FC = () => {
  const { schemas, isLoading, error } = useSchemas();
  const { deleteSchema, isPending } = useDeleteSchema();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [schemaToDelete, setSchemaToDelete] = useState<string | null>(null);
  const [filteredSchemas, setFilteredSchemas] = useState<SchemaWithMeta[]>([]);

  // Set initial filtered schemas when schemas data loads
  useEffect(() => {
    if (schemas.length > 0) {
      setFilteredSchemas(schemas);
    }
  }, [schemas]);

  const handleEdit = (id: string) => {
    navigate(`/schemas/edit/${id}`);
  };

  const handleView = (id: string) => {
    navigate(`/schemas/${id}`);
  };

  const confirmDelete = (id: string) => {
    setSchemaToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (schemaToDelete) {
      try {
        await deleteSchema(schemaToDelete);
        toast({
          title: "Schema deleted",
          description: "The schema has been successfully deleted.",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete the schema. Please try again.",
          variant: "destructive",
        });
      } finally {
        setDeleteDialogOpen(false);
        setSchemaToDelete(null);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Schemas</h1>
        </div>
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-64 rounded-lg bg-gray-100 animate-pulse"
            ></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md">
          Error loading schemas. Please try again.
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Schemas</h1>
        <Link to="/schemas/create">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Create Schema
          </Button>
        </Link>
      </div>

      {schemas.length === 0 ? (
        <div className="text-center py-10 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-medium text-gray-600 mb-2">
            No Schemas Found
          </h3>
          <p className="text-gray-500 mb-4">
            Get started by creating your first schema.
          </p>
          <Link to="/schemas/create">
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Create Schema
            </Button>
          </Link>
        </div>
      ) : (
        <>
          <div className="mb-6">
            <SchemaSearch
              schemas={schemas}
              onFilteredSchemasChange={setFilteredSchemas}
            />
          </div>

          {filteredSchemas.length === 0 ? (
            <div className="text-center py-10 bg-gray-50 rounded-lg">
              <h3 className="text-lg font-medium text-gray-600 mb-2">
                No Schemas Match Your Search
              </h3>
              <p className="text-gray-500">
                Try adjusting your search query or clear the search.
              </p>
            </div>
          ) : (
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {filteredSchemas.map((schema) => (
                <SchemaCard
                  key={schema.id}
                  schema={schema}
                  onEdit={() => handleEdit(schema.id)}
                  onDelete={() => confirmDelete(schema.id)}
                  onView={() => handleView(schema.id)}
                />
              ))}
            </div>
          )}
        </>
      )}

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              schema.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={isPending}>
              {isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default SchemasPage;
