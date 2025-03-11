import { CategoryType, CategorySchema } from "../types/category";

export const categoryService = new CategoryService();

// Re-export the schema for use in API routes
export { CategorySchema };
