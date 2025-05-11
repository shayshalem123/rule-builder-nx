import { RuleWithMeta } from "@/features/rules/types/rule";

// Default user for mock data
export const defaultUser = {
  id: "1",
  name: "Jane Doe",
};

// Initial mock data
export const mockRules: RuleWithMeta[] = [
  {
    id: "1",
    name: "Simple Rule",
    description: "Basic metadata name equals hello rule",
    destination: "A",
    category: "partners-images",
    type: "json",
    rule: {
      field: "metadata.name",
      operator: "EQUALS",
      value: "hello",
    },
    extraProperties: {
      resolution: "high",
      watermark: true,
      colorProfile: "sRGB",
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: defaultUser,
    updatedBy: defaultUser,
  },
  {
    id: "2",
    name: "AND Rule Example",
    description: "Example of an AND rule with nested conditions",
    destination: "B",
    category: "partners-algo",
    type: "json",
    rule: {
      AND: [
        {
          field: "metadata.name",
          operator: "EQUALS",
          value: "test",
        },
        {
          field: "metadata.namespace",
          operator: "EQUALS",
          value: "default",
        },
      ],
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: defaultUser,
    updatedBy: defaultUser,
  },
  {
    id: "3",
    name: "OR Rule Example",
    description: "Example of an OR rule with nested conditions",
    destination: "A",
    category: "partners-algo",
    type: "json",
    rule: {
      OR: [
        {
          field: "metadata.name",
          operator: "EQUALS",
          value: "app",
        },
        {
          field: "metadata.name",
          operator: "EQUALS",
          value: "service",
        },
      ],
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: defaultUser,
    updatedBy: defaultUser,
  },
  {
    id: "4",
    name: "Complex Nested Rule",
    description: "A complex rule with multiple nested levels",
    destination: "B",
    category: "partners-images",
    type: "json",
    rule: {
      AND: [
        {
          field: "metadata.name",
          operator: "EQUALS",
          value: "production-image",
        },
        {
          OR: [
            {
              field: "metadata.size",
              operator: "NOT_EQUALS",
              value: "1024",
            },
            {
              field: "metadata.format",
              operator: "EQUALS",
              value: "jpg",
            },
          ],
        },
      ],
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: defaultUser,
    updatedBy: defaultUser,
  },
  {
    id: "5",
    name: "Enterprise Image Routing Policy",
    description:
      "Complex enterprise policy for routing container images based on multiple criteria",
    destination: "A",
    category: "partners-images",
    type: "json",
    rule: {
      AND: [
        // Top level - must satisfy all these conditions
        {
          OR: [
            // Image name patterns
            {
              field: "metadata.name",
              operator: "EQUALS",
              value: "product-banner",
            },
            {
              field: "metadata.name",
              operator: "EQUALS",
              value: "company-logo",
            },
            {
              field: "metadata.name",
              operator: "EQUALS",
              value: "hero-image",
            },
            {
              field: "metadata.name",
              operator: "EQUALS",
              value: "profile-photo",
            },
            {
              // Special exception for feature images
              AND: [
                {
                  field: "metadata.name",
                  operator: "EQUALS",
                  value: "feature-image",
                },
                {
                  field: "metadata.format",
                  operator: "EQUALS",
                  value: "webp",
                },
              ],
            },
          ],
        },
        {
          OR: [
            // Format requirements
            {
              field: "metadata.format",
              operator: "EQUALS",
              value: "jpg",
            },
            {
              field: "metadata.format",
              operator: "EQUALS",
              value: "png",
            },
            {
              field: "metadata.format",
              operator: "EQUALS",
              value: "webp",
            },
            // Or have specific size characteristics
            {
              AND: [
                {
                  field: "metadata.format",
                  operator: "EQUALS",
                  value: "gif",
                },
                {
                  field: "metadata.size",
                  operator: "NOT_EQUALS",
                  value: "500000",
                },
              ],
            },
          ],
        },
        {
          AND: [
            // Must satisfy all dimension policies
            {
              OR: [
                // Various width requirements
                {
                  AND: [
                    {
                      field: "metadata.name",
                      operator: "EQUALS",
                      value: "banner",
                    },
                    {
                      field: "metadata.dimensions.width",
                      operator: "EQUALS",
                      value: "1200",
                    },
                  ],
                },
                {
                  AND: [
                    {
                      field: "metadata.name",
                      operator: "EQUALS",
                      value: "thumbnail",
                    },
                    {
                      field: "metadata.dimensions.width",
                      operator: "EQUALS",
                      value: "400",
                    },
                  ],
                },
                {
                  field: "metadata.dimensions.width",
                  operator: "EQUALS",
                  value: "800",
                },
              ],
            },
            {
              OR: [
                // Height requirements
                {
                  AND: [
                    {
                      field: "metadata.dimensions.height",
                      operator: "NOT_EQUALS",
                      value: "300",
                    },
                    {
                      field: "metadata.dimensions.height",
                      operator: "NOT_EQUALS",
                      value: "500",
                    },
                  ],
                },
                {
                  field: "metadata.format",
                  operator: "EQUALS",
                  value: "webp",
                },
              ],
            },
          ],
        },
        {
          OR: [
            // Size requirements
            {
              field: "metadata.size",
              operator: "NOT_EQUALS",
              value: "0",
            },
            {
              field: "metadata.size",
              operator: "NOT_EQUALS",
              value: "10000000",
            },
            {
              field: "metadata.format",
              operator: "EQUALS",
              value: "webp",
            },
          ],
        },
        {
          OR: [
            // Format and dimension combinations
            {
              field: "metadata.format",
              operator: "EQUALS",
              value: "jpg",
            },
            {
              field: "metadata.format",
              operator: "EQUALS",
              value: "png",
            },
            {
              field: "metadata.dimensions.width",
              operator: "NOT_EQUALS",
              value: "0",
            },
            {
              // Special handling for complex dimensions
              AND: [
                {
                  field: "metadata.dimensions.width",
                  operator: "EQUALS",
                  value: "1024",
                },
                {
                  field: "metadata.dimensions.height",
                  operator: "EQUALS",
                  value: "768",
                },
                {
                  OR: [
                    {
                      field: "metadata.format",
                      operator: "NOT_EQUALS",
                      value: "gif",
                    },
                    {
                      field: "metadata.size",
                      operator: "EQUALS",
                      value: "250000",
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          // Size requirements by format
          OR: [
            {
              // Size requirements for JPG
              AND: [
                {
                  field: "metadata.format",
                  operator: "EQUALS",
                  value: "jpg",
                },
                {
                  OR: [
                    {
                      field: "metadata.size",
                      operator: "NOT_EQUALS",
                      value: "5000000",
                    },
                    {
                      field: "metadata.dimensions.width",
                      operator: "EQUALS",
                      value: "1920",
                    },
                    {
                      field: "metadata.dimensions.height",
                      operator: "EQUALS",
                      value: "1080",
                    },
                  ],
                },
              ],
            },
            {
              // Size requirements for PNG
              field: "metadata.size",
              operator: "NOT_EQUALS",
              value: "8000000",
            },
            {
              // Special exception for high quality images
              AND: [
                {
                  field: "metadata.name",
                  operator: "EQUALS",
                  value: "high-quality",
                },
                {
                  field: "metadata.format",
                  operator: "NOT_EQUALS",
                  value: "123",
                },
              ],
            },
          ],
        },
        {
          // Dimension ratio requirements
          OR: [
            {
              field: "metadata.dimensions.width",
              operator: "EQUALS",
              value: "800",
            },
            {
              field: "metadata.dimensions.height",
              operator: "EQUALS",
              value: "600",
            },
            {
              // Special dimensions for banners
              AND: [
                {
                  field: "metadata.name",
                  operator: "EQUALS",
                  value: "site-banner",
                },
                {
                  field: "metadata.dimensions.width",
                  operator: "EQUALS",
                  value: "1600",
                },
                {
                  field: "metadata.dimensions.height",
                  operator: "EQUALS",
                  value: "400",
                },
                {
                  OR: [
                    {
                      field: "metadata.format",
                      operator: "EQUALS",
                      value: "jpg",
                    },
                    {
                      field: "metadata.format",
                      operator: "EQUALS",
                      value: "webp",
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          // Names and formats combinations
          OR: [
            {
              field: "metadata.name",
              operator: "EQUALS",
              value: "logo",
            },
            {
              field: "metadata.name",
              operator: "EQUALS",
              value: "icon",
            },
            {
              // Image quality check
              AND: [
                {
                  field: "metadata.name",
                  operator: "EQUALS",
                  value: "product-photo",
                },
                {
                  field: "metadata.format",
                  operator: "EQUALS",
                  value: "jpg",
                },
                {
                  field: "metadata.size",
                  operator: "NOT_EQUALS",
                  value: "100000",
                },
                {
                  OR: [
                    {
                      field: "metadata.dimensions.width",
                      operator: "EQUALS",
                      value: "1200",
                    },
                    {
                      field: "metadata.dimensions.height",
                      operator: "EQUALS",
                      value: "1200",
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: defaultUser,
    updatedBy: defaultUser,
  },
  // Additional rules for Destination A
  {
    id: "6",
    name: "Marketing Content Filter",
    description: "Filters marketing content based on metadata characteristics",
    destination: "A",
    category: "partners-content",
    type: "json",
    rule: {
      OR: [
        {
          field: "metadata.type",
          operator: "EQUALS",
          value: "marketing",
        },
        {
          field: "metadata.department",
          operator: "EQUALS",
          value: "sales",
        },
        {
          AND: [
            {
              field: "metadata.format",
              operator: "EQUALS",
              value: "pdf",
            },
            {
              field: "metadata.size",
              operator: "NOT_EQUALS",
              value: "10485760", // 10MB
            },
          ],
        },
      ],
    },
    extraProperties: {
      retention: "1 year",
      sensitivity: "public",
      distribution: "external",
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: defaultUser,
    updatedBy: defaultUser,
  },
  {
    id: "7",
    name: "Premium User Assets",
    description: "Routes premium user content to high-priority storage",
    destination: "A",
    category: "user-content",
    type: "json",
    rule: {
      AND: [
        {
          field: "metadata.userTier",
          operator: "EQUALS",
          value: "premium",
        },
        {
          OR: [
            {
              field: "metadata.contentType",
              operator: "EQUALS",
              value: "video",
            },
            {
              field: "metadata.contentType",
              operator: "EQUALS",
              value: "audio",
            },
          ],
        },
      ],
    },
    extraProperties: {
      priority: "high",
      caching: true,
      replication: 3,
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: defaultUser,
    updatedBy: defaultUser,
  },
  // Additional rules for Destination B
  {
    id: "8",
    name: "Development Environment Assets",
    description: "Routes development environment assets to appropriate storage",
    destination: "B",
    category: "dev-resources",
    type: "json",
    rule: {
      AND: [
        {
          field: "metadata.environment",
          operator: "EQUALS",
          value: "development",
        },
        {
          OR: [
            {
              field: "metadata.resourceType",
              operator: "EQUALS",
              value: "config",
            },
            {
              field: "metadata.resourceType",
              operator: "EQUALS",
              value: "template",
            },
            {
              field: "metadata.resourceType",
              operator: "EQUALS",
              value: "script",
            },
          ],
        },
      ],
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: defaultUser,
    updatedBy: defaultUser,
  },
  {
    id: "9",
    name: "Low-Resolution Image Filter",
    description: "Routes low-quality images to compression pipeline",
    destination: "B",
    category: "partners-images",
    type: "json",
    rule: {
      AND: [
        {
          OR: [
            {
              field: "metadata.format",
              operator: "EQUALS",
              value: "jpg",
            },
            {
              field: "metadata.format",
              operator: "EQUALS",
              value: "png",
            },
          ],
        },
        {
          OR: [
            {
              field: "metadata.dimensions.width",
              operator: "NOT_EQUALS",
              value: "1000",
            },
            {
              field: "metadata.dimensions.height",
              operator: "NOT_EQUALS",
              value: "1000",
            },
          ],
        },
        {
          field: "metadata.quality",
          operator: "EQUALS",
          value: "low",
        },
      ],
    },
    extraProperties: {
      compressionLevel: "high",
      optimization: true,
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: defaultUser,
    updatedBy: defaultUser,
  },
  {
    id: "10",
    name: "Batch Process Data",
    description: "Routes batch processing data to appropriate storage",
    destination: "B",
    category: "data-processing",
    type: "json",
    rule: {
      AND: [
        {
          field: "metadata.processType",
          operator: "EQUALS",
          value: "batch",
        },
        {
          field: "metadata.priority",
          operator: "NOT_EQUALS",
          value: "high",
        },
      ],
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: defaultUser,
    updatedBy: defaultUser,
  },
  // New Destination C rules
  {
    id: "11",
    name: "Archival Content",
    description: "Routes infrequently accessed content to cold storage",
    destination: "C",
    category: "archive",
    type: "json",
    rule: {
      AND: [
        {
          field: "metadata.accessFrequency",
          operator: "EQUALS",
          value: "infrequent",
        },
        {
          field: "metadata.retention",
          operator: "EQUALS",
          value: "long-term",
        },
      ],
    },
    extraProperties: {
      storageClass: "cold",
      compression: true,
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: defaultUser,
    updatedBy: defaultUser,
  },
  {
    id: "12",
    name: "Regulatory Compliance Documents",
    description: "Routes compliance documents to secure storage",
    destination: "C",
    category: "compliance",
    type: "json",
    rule: {
      AND: [
        {
          field: "metadata.documentType",
          operator: "EQUALS",
          value: "compliance",
        },
        {
          OR: [
            {
              field: "metadata.regulation",
              operator: "EQUALS",
              value: "GDPR",
            },
            {
              field: "metadata.regulation",
              operator: "EQUALS",
              value: "HIPAA",
            },
            {
              field: "metadata.regulation",
              operator: "EQUALS",
              value: "SOX",
            },
          ],
        },
      ],
    },
    extraProperties: {
      encryption: "AES-256",
      accessControl: "strict",
      auditLog: true,
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: defaultUser,
    updatedBy: defaultUser,
  },
  {
    id: "13",
    name: "Large Dataset Processing",
    description: "Routes large datasets to appropriate processing pipeline",
    destination: "C",
    category: "data-processing",
    type: "json",
    rule: {
      AND: [
        {
          field: "metadata.dataType",
          operator: "EQUALS",
          value: "dataset",
        },
        {
          field: "metadata.size",
          operator: "NOT_EQUALS",
          value: "104857600", // 100MB
        },
      ],
    },
    extraProperties: {
      partitioning: true,
      parallelProcessing: true,
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: defaultUser,
    updatedBy: defaultUser,
  },
  {
    id: "14",
    name: "Historical Records",
    description: "Routes historical records to appropriate storage",
    destination: "C",
    category: "archive",
    type: "json",
    rule: {
      AND: [
        {
          field: "metadata.recordType",
          operator: "EQUALS",
          value: "historical",
        },
        {
          field: "metadata.year",
          operator: "NOT_EQUALS",
          value: "2023",
        },
      ],
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: defaultUser,
    updatedBy: defaultUser,
  },
  // New Destination D rules
  {
    id: "15",
    name: "Real-time Processing",
    description: "Routes real-time data to streaming processors",
    destination: "D",
    category: "real-time",
    type: "json",
    rule: {
      AND: [
        {
          field: "metadata.streamType",
          operator: "EQUALS",
          value: "real-time",
        },
        {
          OR: [
            {
              field: "metadata.priority",
              operator: "EQUALS",
              value: "high",
            },
            {
              field: "metadata.source",
              operator: "EQUALS",
              value: "sensor",
            },
          ],
        },
      ],
    },
    extraProperties: {
      latencyRequirement: "low",
      bufferSize: "small",
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: defaultUser,
    updatedBy: defaultUser,
  },
  {
    id: "16",
    name: "User-generated Content",
    description: "Routes user-generated content to moderation queue",
    destination: "D",
    category: "user-content",
    type: "json",
    rule: {
      AND: [
        {
          field: "metadata.contentSource",
          operator: "EQUALS",
          value: "user",
        },
        {
          field: "metadata.moderationStatus",
          operator: "EQUALS",
          value: "pending",
        },
      ],
    },
    extraProperties: {
      moderationType: "manual",
      queuePriority: "medium",
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: defaultUser,
    updatedBy: defaultUser,
  },
  {
    id: "17",
    name: "ML Model Training Data",
    description: "Routes machine learning training data to appropriate storage",
    destination: "D",
    category: "ml-data",
    type: "json",
    rule: {
      AND: [
        {
          field: "metadata.dataUsage",
          operator: "EQUALS",
          value: "ml-training",
        },
        {
          OR: [
            {
              field: "metadata.dataType",
              operator: "EQUALS",
              value: "labeled",
            },
            {
              field: "metadata.dataType",
              operator: "EQUALS",
              value: "validated",
            },
          ],
        },
      ],
    },
    extraProperties: {
      dataQuality: "high",
      versioning: true,
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: defaultUser,
    updatedBy: defaultUser,
  },
  {
    id: "18",
    name: "API Response Cache",
    description: "Routes cacheable API responses to cache storage",
    destination: "D",
    category: "api-responses",
    type: "json",
    rule: {
      AND: [
        {
          field: "metadata.responseType",
          operator: "EQUALS",
          value: "api",
        },
        {
          field: "metadata.cacheable",
          operator: "EQUALS",
          value: "true",
        },
        {
          field: "metadata.ttl",
          operator: "NOT_EQUALS",
          value: "0",
        },
      ],
    },
    extraProperties: {
      cacheStrategy: "lru",
      maxAge: 3600,
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: defaultUser,
    updatedBy: defaultUser,
  },
];
