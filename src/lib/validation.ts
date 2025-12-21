import { z } from "zod";

// Common validation schemas for user inputs
export const displayNameSchema = z
  .string()
  .trim()
  .min(1, "Display name is required")
  .max(100, "Display name must be less than 100 characters")
  .regex(/^[a-zA-Z0-9\s\-_.]+$/, "Display name can only contain letters, numbers, spaces, hyphens, underscores, and periods");

export const collectionNameSchema = z
  .string()
  .trim()
  .min(1, "Collection name is required")
  .max(100, "Collection name must be less than 100 characters");

export const collectionDescriptionSchema = z
  .string()
  .trim()
  .max(500, "Description must be less than 500 characters")
  .optional()
  .transform((val) => val || undefined);

export const searchQuerySchema = z
  .string()
  .trim()
  .max(200, "Search query must be less than 200 characters")
  .transform((val) => val.replace(/[%_]/g, "")); // Remove SQL wildcards

// Sanitize a string for safe use (removes potentially dangerous characters)
export const sanitizeString = (value: string, maxLength: number = 500): string => {
  return value
    .trim()
    .substring(0, maxLength)
    .replace(/[<>]/g, ""); // Remove angle brackets to prevent XSS
};

// Validate collection input
export const validateCollectionInput = (name: string, description?: string) => {
  const nameResult = collectionNameSchema.safeParse(name);
  const descResult = collectionDescriptionSchema.safeParse(description);

  if (!nameResult.success) {
    return { valid: false, error: nameResult.error.errors[0]?.message || "Invalid collection name" };
  }
  
  if (!descResult.success) {
    return { valid: false, error: descResult.error.errors[0]?.message || "Invalid description" };
  }

  return { 
    valid: true, 
    data: { 
      name: nameResult.data, 
      description: descResult.data 
    } 
  };
};

// Validate display name
export const validateDisplayName = (displayName: string) => {
  const result = displayNameSchema.safeParse(displayName);
  
  if (!result.success) {
    return { valid: false, error: result.error.errors[0]?.message || "Invalid display name" };
  }

  return { valid: true, data: result.data };
};

// Validate search query
export const validateSearchQuery = (query: string) => {
  const result = searchQuerySchema.safeParse(query);
  
  if (!result.success) {
    return { valid: false, error: result.error.errors[0]?.message || "Invalid search query" };
  }

  return { valid: true, data: result.data };
};
