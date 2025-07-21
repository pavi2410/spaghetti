import LZString from 'lz-string';
import type { Edge } from '@xyflow/react';
import type { FunctionNode } from '@/components/nodes/FunctionNode';
import type { StringInputNode, NumberInputNode, BooleanInputNode } from '@/components/nodes/InputNodes';
import type { StringViewerNode, BinaryViewerNode, JsonViewerNode } from '@/components/nodes/ViewerNodes';

type AppNode = FunctionNode | StringInputNode | NumberInputNode | BooleanInputNode | StringViewerNode | BinaryViewerNode | JsonViewerNode;

export interface GraphState {
  nodes: AppNode[];
  edges: Edge[];
}

/**
 * Encode graph state to a shareable URL
 */
export const encodeStateToURL = (nodes: AppNode[], edges: Edge[]): string => {
  try {
    // Create a clean state object without function references
    const cleanState: GraphState = {
      nodes: nodes.map(node => {
        // Remove function references from input nodes for serialization
        if (node.type === 'string-input' || node.type === 'number-input' || node.type === 'boolean-input') {
          const { onValueChange, ...cleanData } = node.data as any;
          return {
            ...node,
            data: cleanData
          };
        }
        return node;
      }),
      edges
    };

    const jsonString = JSON.stringify(cleanState);
    const compressed = LZString.compressToEncodedURIComponent(jsonString);
    
    // Create URL with compressed state
    const baseUrl = `${window.location.origin}${window.location.pathname}`;
    return `${baseUrl}?state=${compressed}`;
  } catch (error) {
    console.error('Failed to encode state to URL:', error);
    throw new Error('Failed to create shareable link');
  }
};

/**
 * Decode graph state from URL
 */
export const decodeStateFromURL = (): GraphState | null => {
  try {
    const params = new URLSearchParams(window.location.search);
    const compressed = params.get('state');
    
    if (!compressed) {
      return null;
    }

    const decompressed = LZString.decompressFromEncodedURIComponent(compressed);
    
    if (!decompressed) {
      console.warn('Failed to decompress state from URL');
      return null;
    }

    const state: GraphState = JSON.parse(decompressed);
    
    // Validate the state structure
    if (!state.nodes || !state.edges || !Array.isArray(state.nodes) || !Array.isArray(state.edges)) {
      console.warn('Invalid state structure in URL');
      return null;
    }

    return state;
  } catch (error) {
    console.error('Failed to decode state from URL:', error);
    return null;
  }
};

/**
 * Clear state from URL without page reload
 */
export const clearStateFromURL = (): void => {
  const url = new URL(window.location.href);
  url.searchParams.delete('state');
  window.history.replaceState({}, '', url.toString());
};

/**
 * Check if current URL contains state
 */
export const hasStateInURL = (): boolean => {
  const params = new URLSearchParams(window.location.search);
  return params.has('state');
};

/**
 * Get estimated URL length for the given state
 */
export const getEstimatedURLLength = (nodes: AppNode[], edges: Edge[]): number => {
  try {
    const url = encodeStateToURL(nodes, edges);
    return url.length;
  } catch (error) {
    return Infinity; // If encoding fails, assume it would be too long
  }
};

/**
 * Check if state would create a URL that's too long
 */
export const isStateTooLargeForURL = (nodes: AppNode[], edges: Edge[]): boolean => {
  // Conservative limit - most browsers support at least 2048 characters
  // We'll use 2000 as a safe limit
  const MAX_URL_LENGTH = 2000;
  return getEstimatedURLLength(nodes, edges) > MAX_URL_LENGTH;
};