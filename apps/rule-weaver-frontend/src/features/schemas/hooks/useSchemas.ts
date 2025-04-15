import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { schemaService } from "../services/schemaService";
import { Schema } from "../types/schema";
import { useUser } from "@/features/users/contexts/UserContext";

export const useSchemas = () => {
  const {
    data: schemas = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["schemas"],
    queryFn: schemaService.getSchemas,
  });

  return { schemas, isLoading, error };
};

export const useSchema = (id: string) => {
  const {
    data: schema,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["schemas", id],
    queryFn: () => schemaService.getSchema(id),
    enabled: !!id,
  });

  return { schema, isLoading, error };
};

export const useSchemaByCategory = (category: string) => {
  const {
    data: schema,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["schemas", "category", category],
    queryFn: () => schemaService.getSchemaByCategory(category),
    enabled: !!category,
  });

  return { schema, isLoading, error };
};

export const useCreateSchema = () => {
  const queryClient = useQueryClient();
  const { currentUser } = useUser();

  const { mutateAsync, isPending, error } = useMutation({
    mutationFn: (schema: Omit<Schema, "id">) => {
      if (!currentUser) {
        throw new Error("User not authenticated");
      }
      return schemaService.createSchema(schema, currentUser);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["schemas"] });
    },
  });

  return { createSchema: mutateAsync, isPending, error };
};

export const useUpdateSchema = () => {
  const queryClient = useQueryClient();
  const { currentUser } = useUser();

  const { mutateAsync, isPending, error } = useMutation({
    mutationFn: ({
      id,
      schema,
    }: {
      id: string;
      schema: Omit<Schema, "id">;
    }) => {
      if (!currentUser) {
        throw new Error("User not authenticated");
      }
      return schemaService.updateSchema(id, schema, currentUser);
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["schemas"] });
      queryClient.invalidateQueries({ queryKey: ["schemas", id] });
    },
  });

  return { updateSchema: mutateAsync, isPending, error };
};

export const useDeleteSchema = () => {
  const queryClient = useQueryClient();

  const { mutateAsync, isPending, error } = useMutation({
    mutationFn: (id: string) => schemaService.deleteSchema(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["schemas"] });
    },
  });

  return { deleteSchema: mutateAsync, isPending, error };
};

export const useCategories = () => {
  const {
    data: categories = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["schema-categories"],
    queryFn: schemaService.getCategories,
  });

  return { categories, isLoading, error };
};
