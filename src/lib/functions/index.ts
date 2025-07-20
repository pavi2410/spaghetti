// Function registry - combines all function categories
import { stringFunctions } from './string';
import { encodingFunctions } from './encoding';

// Export all individual categories
export { stringFunctions } from './string';
export { encodingFunctions } from './encoding';

// Export base types and utilities
export * from './base';

// Combined registry of all functions
export const allFunctions = [
  ...stringFunctions,
  ...encodingFunctions,
] as const;

// Type for the complete function registry
export type FunctionRegistry = typeof allFunctions;
export type FunctionId = FunctionRegistry[number]['id'];

// Helper to get function by ID with type safety
export function getFunctionById<T extends FunctionId>(
  id: T
): Extract<FunctionRegistry[number], { id: T }> | undefined {
  return allFunctions.find(fn => fn.id === id) as Extract<FunctionRegistry[number], { id: T }> | undefined;
}

// Helper to get functions by category
export function getFunctionsByCategory(category: string) {
  return allFunctions.filter(fn => fn.category === category);
}

// Helper to get all available categories
export function getCategories() {
  const categories = new Set(allFunctions.map(fn => fn.category));
  return Array.from(categories).sort();
}

// Helper to search functions by name or description
export function searchFunctions(query: string) {
  const lowercaseQuery = query.toLowerCase();
  return allFunctions.filter(fn => 
    fn.name.toLowerCase().includes(lowercaseQuery) ||
    fn.description.toLowerCase().includes(lowercaseQuery) ||
    fn.tags?.some(tag => tag.toLowerCase().includes(lowercaseQuery))
  );
}

// Statistics about the function registry
export function getRegistryStats() {
  const categories = getCategories();
  const totalFunctions = allFunctions.length;
  const functionsByCategory = categories.map(category => ({
    category,
    count: getFunctionsByCategory(category).length
  }));

  return {
    totalFunctions,
    totalCategories: categories.length,
    categories: functionsByCategory
  };
}