import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Schema, CreateSchema } from "../types/schema";
import { categoryOptions } from "../types/schema";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/components/inputs/form";
import { Input } from "@/shared/components/inputs/input";
import { Textarea } from "@/shared/components/inputs/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/inputs/select";
import { Button } from "@/shared/components/inputs/button";
import { SchemaJsonEditor } from "./SchemaJsonEditor";
import JsonEditor from "@/shared/components/json/JsonEditor";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  category: z.string().min(1, "Category is required"),
  version: z.string().min(1, "Version is required"),
  definitionJson: z
    .string()
    .min(1, "Schema definition is required")
    .refine(
      (val) => {
        try {
          const parsed = JSON.parse(val);
          return typeof parsed === "object" && parsed !== null;
        } catch {
          return false;
        }
      },
      {
        message: "Invalid JSON schema",
      }
    ),
});

type FormValues = z.infer<typeof formSchema>;

interface SchemaFormProps {
  initialData?: Schema;
  onSubmit: (data: CreateSchema) => void;
  isSubmitting?: boolean;
}

const SchemaForm: React.FC<SchemaFormProps> = ({
  initialData,
  onSubmit,
  isSubmitting = false,
}) => {
  const defaultDefinitionJson = `{
  "properties": {
    "metadata": {
      "type": "object",
      "description": "Metadata information",
      "required": true,
      "properties": {
        "name": {
          "type": "string",
          "description": "Resource name",
          "required": true
        },
        "namespace": {
          "type": "string",
          "description": "Resource namespace"
        }
      }
    }
  },
  "required": ["metadata"]
}`;

  const defaultValues: FormValues = {
    name: initialData?.name || "",
    description: initialData?.description || "",
    category: initialData?.category || categoryOptions[0],
    version: initialData?.version || "1.0.0",
    definitionJson: initialData
      ? JSON.stringify(initialData.definition, null, 2)
      : defaultDefinitionJson,
  };

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const handleSubmit = (values: FormValues) => {
    try {
      const definition = JSON.parse(values.definitionJson);
      const schemaData: CreateSchema = {
        name: values.name,
        description: values.description,
        category: values.category,
        version: values.version,
        definition,
      };

      onSubmit(schemaData);
    } catch (error) {
      form.setError("definitionJson", {
        type: "manual",
        message: "Invalid JSON schema",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Schema name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="version"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Version</FormLabel>
                <FormControl>
                  <Input placeholder="1.0.0" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe the purpose of this schema"
                  className="min-h-[80px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                value={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {categoryOptions.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="definitionJson"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Schema Definition (JSON)</FormLabel>
              <FormControl>
                <div className="[&_.absolute.top-2]:right-5">
                  <JsonEditor
                    value={field.value ? JSON.parse(field.value) : {}}
                    onChange={(parsedJson) => {
                      field.onChange(JSON.stringify(parsedJson, null, 2));
                    }}
                    height="300px"
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex w-full justify-end">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting
              ? "Saving..."
              : initialData
              ? "Update Schema"
              : "Create Schema"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default SchemaForm;
