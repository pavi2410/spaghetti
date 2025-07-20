import { test, expect } from 'bun:test';
import { 
  allFunctions, 
  getFunctionById, 
  getFunctionsByCategory, 
  getCategories, 
  searchFunctions,
  getRegistryStats,
  categories 
} from '../../../src/lib/functions/index';

test('allFunctions: contains functions from all categories', () => {
  expect(allFunctions.length).toBeGreaterThan(0);
  
  // Should have functions from string and encoding categories
  const hasStringFunctions = allFunctions.some(fn => fn.category === categories.STRING);
  const hasEncodingFunctions = allFunctions.some(fn => fn.category === categories.ENCODING);
  
  expect(hasStringFunctions).toBe(true);
  expect(hasEncodingFunctions).toBe(true);
});

test('getFunctionById: returns correct function', () => {
  const uppercaseFn = getFunctionById('to-uppercase');
  expect(uppercaseFn).toBeDefined();
  expect(uppercaseFn?.name).toBe('To Uppercase');
  
  const nonExistentFn = getFunctionById('non-existent' as any);
  expect(nonExistentFn).toBeUndefined();
});

test('getFunctionsByCategory: filters by category correctly', () => {
  const stringFunctions = getFunctionsByCategory(categories.STRING);
  const encodingFunctions = getFunctionsByCategory(categories.ENCODING);
  
  expect(stringFunctions.length).toBeGreaterThan(0);
  expect(encodingFunctions.length).toBeGreaterThan(0);
  
  // All returned functions should have correct category
  stringFunctions.forEach(fn => {
    expect(fn.category).toBe(categories.STRING);
  });
  
  encodingFunctions.forEach(fn => {
    expect(fn.category).toBe(categories.ENCODING);
  });
});

test('getCategories: returns all available categories', () => {
  const categories = getCategories();
  
  expect(categories).toContain('String Operations');
  expect(categories).toContain('Encoding/Decoding');
  expect(categories.length).toBeGreaterThanOrEqual(2);
});

test('searchFunctions: finds functions by name', () => {
  const results = searchFunctions('uppercase');
  expect(results.length).toBeGreaterThan(0);
  expect(results[0].name).toBe('To Uppercase');
});

test('searchFunctions: finds functions by description', () => {
  const results = searchFunctions('encode');
  expect(results.length).toBeGreaterThan(0);
  
  // Should find base64 encoding function
  const base64Fn = results.find(fn => fn.name === 'To Base64');
  expect(base64Fn).toBeDefined();
});

test('searchFunctions: finds functions by tags', () => {
  const results = searchFunctions('text');
  expect(results.length).toBeGreaterThan(0);
  
  // Should find functions tagged with 'text'
  results.forEach(fn => {
    const hasTextTag = fn.tags?.includes('text') || 
                      fn.name.toLowerCase().includes('text') ||
                      fn.description.toLowerCase().includes('text');
    expect(hasTextTag).toBe(true);
  });
});

test('getRegistryStats: provides correct statistics', () => {
  const stats = getRegistryStats();
  
  expect(stats.totalFunctions).toBe(allFunctions.length);
  expect(stats.totalCategories).toBeGreaterThanOrEqual(2);
  expect(stats.categories).toEqual(
    expect.arrayContaining([
      expect.objectContaining({ category: 'String Operations', count: expect.any(Number) }),
      expect.objectContaining({ category: 'Encoding/Decoding', count: expect.any(Number) })
    ])
  );
  
  // Sum of category counts should equal total functions
  const sumOfCounts = stats.categories.reduce((sum, cat) => sum + cat.count, 0);
  expect(sumOfCounts).toBe(stats.totalFunctions);
});