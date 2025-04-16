import {
  Schema,
  SchemaWithMeta,
  CreateSchema,
  categoryOptions,
} from "../types/schema";
import { User } from "@/features/users/types/user";

// Default user for mock data
const defaultUser = {
  id: "1",
  name: "Jane Doe",
};

// Initial mock data with different schemas for each category
const mockSchemas: SchemaWithMeta[] = [
  {
    id: "1",
    name: "Partners Images Schema",
    description: "JSON Schema for partners images rules",
    category: "partners-images",
    version: "1.0.0",
    definition: {
      properties: {
        metadata: {
          type: "object",
          description: "Image metadata",
          required: true,
          properties: {
            name: {
              type: "string",
              description: "Image name",
              required: true,
            },
            size: {
              type: "number",
              description: "Image size in bytes",
            },
            format: {
              type: "string",
              description: "Image format",
              enum: ["jpg", "png", "gif", "webp"],
            },
            dimensions: {
              type: "object",
              description: "Image dimensions",
              properties: {
                width: {
                  type: "number",
                  description: "Image width in pixels",
                },
                height: {
                  type: "number",
                  description: "Image height in pixels",
                },
              },
            },
          },
        },
      },
      required: ["metadata"],
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: defaultUser,
    updatedBy: defaultUser,
  },
  {
    id: "2",
    name: "Partners Algorithms Schema",
    description: "JSON Schema for partners algorithms rules",
    category: "partners-algo",
    version: "1.0.0",
    definition: {
      properties: {
        metadata: {
          type: "object",
          description: "Algorithm metadata",
          required: true,
          properties: {
            name: {
              type: "string",
              description: "Algorithm name",
              required: true,
            },
            namespace: {
              type: "string",
              description: "Kubernetes namespace",
              required: true,
            },
            labels: {
              type: "object",
              description: "Metadata labels",
              properties: {
                tier: {
                  type: "string",
                  description: "Tier level",
                  enum: ["frontend", "backend", "database"],
                },
              },
            },
          },
        },
        spec: {
          type: "object",
          description: "Algorithm specification",
          properties: {
            replicas: {
              type: "number",
              description: "Number of replicas",
              default: 1,
            },
            container: {
              type: "object",
              description: "Container configuration",
              properties: {
                image: {
                  type: "string",
                  description: "Container image",
                  format: "uri",
                },
                resources: {
                  type: "object",
                  description: "Resource requirements",
                  properties: {
                    limits: {
                      type: "object",
                      description: "Resource limits",
                      properties: {
                        cpu: {
                          type: "string",
                          description: "CPU limit",
                        },
                        memory: {
                          type: "string",
                          description: "Memory limit",
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      required: ["metadata"],
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: defaultUser,
    updatedBy: defaultUser,
  },
];

// Helper function to simulate API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Mock API service for schemas
export const schemaService = {
  // Get all schemas
  getSchemas: async (): Promise<SchemaWithMeta[]> => {
    await delay(500); // Simulate network delay
    return [...mockSchemas];
  },

  // Get schema by ID
  getSchema: async (id: string): Promise<SchemaWithMeta | undefined> => {
    await delay(300);
    return mockSchemas.find((schema) => schema.id === id);
  },

  // Get schema by category
  getSchemaByCategory: async (
    category: string
  ): Promise<SchemaWithMeta | undefined> => {
    await delay(300);
    return mockSchemas.find((schema) => schema.category === category);
  },

  // Create new schema
  createSchema: async (
    schema: CreateSchema,
    user: User
  ): Promise<SchemaWithMeta> => {
    await delay(500);
    const newSchema: SchemaWithMeta = {
      ...schema,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: { id: user.id, name: user.name },
      updatedBy: { id: user.id, name: user.name },
    };
    mockSchemas.push(newSchema);
    return newSchema;
  },

  // Update existing schema
  updateSchema: async (
    id: string,
    schema: Schema,
    user: User
  ): Promise<SchemaWithMeta> => {
    await delay(500);
    const index = mockSchemas.findIndex((s) => s.id === id);
    if (index === -1) {
      throw new Error(`Schema with id ${id} not found`);
    }

    const updatedSchema: SchemaWithMeta = {
      ...schema,
      id,
      createdAt: mockSchemas[index].createdAt,
      createdBy: mockSchemas[index].createdBy,
      updatedAt: new Date().toISOString(),
      updatedBy: { id: user.id, name: user.name },
    };

    mockSchemas[index] = updatedSchema;
    return updatedSchema;
  },

  // Delete schema
  deleteSchema: async (id: string): Promise<void> => {
    await delay(300);
    const index = mockSchemas.findIndex((schema) => schema.id === id);
    if (index === -1) {
      throw new Error(`Schema with id ${id} not found`);
    }
    mockSchemas.splice(index, 1);
  },

  // Get available category options
  getCategories: async (): Promise<string[]> => {
    await delay(300);
    return [...categoryOptions];
  },
};
