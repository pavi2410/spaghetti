import { z } from 'zod';
import { createFunction, categories, schemas } from './base';

export const stringFunctions = [
  createFunction('to-uppercase', {
    name: 'To Uppercase',
    description: 'Convert text to uppercase letters',
    category: categories.STRING,
    inputs: z.object({
      text: schemas.text('Text to convert to uppercase')
    }),
    outputs: z.object({
      result: schemas.text('Text converted to uppercase')
    }),
    tags: ['text', 'case'],
    execute: ({ text }) => ({
      result: text.toUpperCase()
    })
  }),

  createFunction('to-lowercase', {
    name: 'To Lowercase',
    description: 'Convert text to lowercase letters',
    category: categories.STRING,
    inputs: z.object({
      text: schemas.text('Text to convert to lowercase')
    }),
    outputs: z.object({
      result: schemas.text('Text converted to lowercase')
    }),
    tags: ['text', 'case'],
    execute: ({ text }) => ({
      result: text.toLowerCase()
    })
  }),

  createFunction('reverse-string', {
    name: 'Reverse String',
    description: 'Reverse the order of characters in text',
    category: categories.STRING,
    inputs: z.object({
      text: schemas.text('Text to reverse')
    }),
    outputs: z.object({
      result: schemas.text('Text with characters in reverse order')
    }),
    tags: ['text', 'manipulation'],
    execute: ({ text }) => ({
      result: text.split('').reverse().join('')
    })
  }),

  createFunction('trim-whitespace', {
    name: 'Trim Whitespace',
    description: 'Remove leading and trailing whitespace characters',
    category: categories.STRING,
    inputs: z.object({
      text: schemas.text('Text to trim')
    }),
    outputs: z.object({
      result: schemas.text('Text with whitespace removed from start and end')
    }),
    tags: ['text', 'cleanup'],
    execute: ({ text }) => ({
      result: text.trim()
    })
  }),

  createFunction('string-length', {
    name: 'String Length',
    description: 'Get the number of characters in text',
    category: categories.STRING,
    inputs: z.object({
      text: schemas.text('Text to measure')
    }),
    outputs: z.object({
      length: schemas.integer('Number of characters in the text')
    }),
    tags: ['text', 'analysis'],
    execute: ({ text }) => ({
      length: text.length
    })
  }),

  createFunction('split-string', {
    name: 'Split String',
    description: 'Split text into parts using a delimiter',
    category: categories.STRING,
    inputs: z.object({
      text: schemas.text('Text to split'),
      delimiter: schemas.text('Character or string to split by').default(' ')
    }),
    outputs: z.object({
      parts: schemas.array(z.string(), 'Array of text parts'),
      count: schemas.integer('Number of parts created')
    }),
    tags: ['text', 'manipulation'],
    execute: ({ text, delimiter }) => {
      const parts = text.split(delimiter);
      return { parts, count: parts.length };
    }
  }),

  createFunction('replace-text', {
    name: 'Replace Text',
    description: 'Replace all occurrences of a substring with another string',
    category: categories.STRING,
    inputs: z.object({
      text: schemas.text('Original text'),
      search: schemas.text('Text to find and replace'),
      replace: schemas.text('Replacement text')
    }),
    outputs: z.object({
      result: schemas.text('Text with replacements made'),
      replacements: schemas.integer('Number of replacements made')
    }),
    tags: ['text', 'manipulation'],
    execute: ({ text, search, replace }) => {
      const original = text;
      const result = text.replaceAll(search, replace);
      const replacements = original.split(search).length - 1;
      return { result, replacements };
    }
  })
] as const;