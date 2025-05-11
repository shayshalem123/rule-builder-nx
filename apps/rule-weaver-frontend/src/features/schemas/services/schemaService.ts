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
          properties: {
            name: {
              type: "string",
              description: "Image name",
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
          required: ["name"],
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
          properties: {
            name: {
              type: "string",
              description: "Algorithm name",
            },
            namespace: {
              type: "string",
              description: "Kubernetes namespace",
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
          required: ["name", "namespace"],
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
  {
    id: "3",
    name: "Data Processing Schema",
    description: "JSON Schema for data processing rules",
    category: "data-processing",
    version: "1.0.0",
    definition: {
      properties: {
        dataProcessing: {
          type: "object",
          description: "Data processing metadata",
          properties: {
            name: {
              type: "string",
              description: "Data processing name",
            },
            namespace: {
              type: "string",
              description: "Kubernetes namespace",
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
          required: ["name", "namespace"],
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
      required: ["dataProcessing"],
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: defaultUser,
    updatedBy: defaultUser,
  },
  // Adding missing schemas for the rest of the categories
  {
    id: "4",
    name: "Partners Content Schema",
    description: "JSON Schema for partners content rules",
    category: "partners-content",
    version: "1.0.0",
    definition: {
      properties: {
        content: {
          type: "object",
          description: "Content metadata",
          properties: {
            name: {
              type: "string",
              description: "Content name",
            },
            contentType: {
              type: "string",
              description: "Content type",
              enum: ["article", "video", "document"],
            },
            status: {
              type: "string",
              description: "Content status",
              enum: ["draft", "published", "archived"],
            },
          },
          required: ["name", "contentType"],
        },
      },
      required: ["content"],
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: defaultUser,
    updatedBy: defaultUser,
  },
  {
    id: "5",
    name: "User Content Schema",
    description: "JSON Schema for user content rules",
    category: "user-content",
    version: "1.0.0",
    definition: {
      properties: {
        userContent: {
          type: "object",
          description: "User content metadata",
          properties: {
            userId: {
              type: "string",
              description: "User ID",
            },
            contentId: {
              type: "string",
              description: "Content ID",
            },
            contentFormat: {
              type: "string",
              description: "Content format",
              enum: ["text", "image", "video", "audio"],
            },
          },
          required: ["userId", "contentId"],
        },
      },
      required: ["userContent"],
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: defaultUser,
    updatedBy: defaultUser,
  },
  {
    id: "6",
    name: "Development Resources Schema",
    description: "JSON Schema for development resources rules",
    category: "dev-resources",
    version: "1.0.0",
    definition: {
      properties: {
        devResource: {
          type: "object",
          description: "Development resource metadata",
          properties: {
            name: {
              type: "string",
              description: "Resource name",
            },
            type: {
              type: "string",
              description: "Resource type",
              enum: ["api", "library", "tool", "documentation"],
            },
            access: {
              type: "string",
              description: "Access level",
              enum: ["public", "private", "team"],
            },
          },
          required: ["name", "type"],
        },
      },
      required: ["devResource"],
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: defaultUser,
    updatedBy: defaultUser,
  },
  {
    id: "7",
    name: "Archive Schema",
    description: "JSON Schema for archive rules",
    category: "archive",
    version: "1.0.0",
    definition: {
      properties: {
        archive: {
          type: "object",
          description: "Archive metadata",
          properties: {
            name: {
              type: "string",
              description: "Archive name",
            },
            storageProvider: {
              type: "string",
              description: "Storage provider",
              enum: ["s3", "gcs", "azure"],
            },
            retentionPeriod: {
              type: "string",
              description: "Retention period",
              enum: ["30days", "90days", "1year", "7years"],
            },
          },
          required: ["name", "storageProvider"],
        },
      },
      required: ["archive"],
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: defaultUser,
    updatedBy: defaultUser,
  },
  {
    id: "8",
    name: "Compliance Schema",
    description: "JSON Schema for compliance rules",
    category: "compliance",
    version: "1.0.0",
    definition: {
      properties: {
        compliance: {
          type: "object",
          description: "Compliance metadata",
          properties: {
            name: {
              type: "string",
              description: "Compliance name",
            },
            regulation: {
              type: "string",
              description: "Regulation type",
              enum: ["GDPR", "HIPAA", "PCI", "SOX"],
            },
            classification: {
              type: "string",
              description: "Data classification",
              enum: ["public", "internal", "confidential", "restricted"],
            },
          },
          required: ["name", "regulation"],
        },
      },
      required: ["compliance"],
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: defaultUser,
    updatedBy: defaultUser,
  },
  {
    id: "9",
    name: "Real-time Schema",
    description: "JSON Schema for real-time rules",
    category: "real-time",
    version: "1.0.0",
    definition: {
      properties: {
        realtime: {
          type: "object",
          description: "Real-time data metadata",
          properties: {
            name: {
              type: "string",
              description: "Stream name",
            },
            dataFormat: {
              type: "string",
              description: "Data format",
              enum: ["json", "avro", "protobuf"],
            },
            latency: {
              type: "string",
              description: "Latency requirement",
              enum: ["low", "medium", "high"],
            },
          },
          required: ["name", "dataFormat"],
        },
      },
      required: ["realtime"],
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: defaultUser,
    updatedBy: defaultUser,
  },
  {
    id: "10",
    name: "ML Data Schema",
    description: "JSON Schema for machine learning data rules",
    category: "ml-data",
    version: "1.0.0",
    definition: {
      properties: {
        mlData: {
          type: "object",
          description: "ML data metadata",
          properties: {
            name: {
              type: "string",
              description: "Dataset name",
            },
            dataFormat: {
              type: "string",
              description: "Data format",
              enum: ["csv", "parquet", "tfrecord"],
            },
            version: {
              type: "string",
              description: "Dataset version",
            },
          },
          required: ["name", "dataFormat"],
        },
      },
      required: ["mlData"],
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: defaultUser,
    updatedBy: defaultUser,
  },
  {
    id: "11",
    name: "API Responses Schema",
    description: "JSON Schema for API responses rules",
    category: "api-responses",
    version: "1.0.0",
    definition: {
      properties: {
        apiResponse: {
          type: "object",
          description: "API response metadata",
          properties: {
            endpoint: {
              type: "string",
              description: "API endpoint",
            },
            responseFormat: {
              type: "string",
              description: "Response format",
              enum: ["json", "xml", "csv"],
            },
            statusCode: {
              type: "number",
              description: "HTTP status code",
            },
          },
          required: ["endpoint", "responseFormat"],
        },
      },
      required: ["apiResponse"],
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
