import { useCallback, useRef } from 'react';
import type { Node, Edge } from '@xyflow/react';

export interface GraphSnapshot {
  nodes: Node[];
  edges: Edge[];
}

export interface UseUndoRedoOptions {
  maxHistorySize?: number;
}

export function useUndoRedo(options: UseUndoRedoOptions = {}) {
  const { maxHistorySize = 50 } = options;
  
  const past = useRef<GraphSnapshot[]>([]);
  const future = useRef<GraphSnapshot[]>([]);
  
  const takeSnapshot = useCallback((nodes: Node[], edges: Edge[]) => {
    const snapshot: GraphSnapshot = {
      nodes: JSON.parse(JSON.stringify(nodes)), // Deep clone
      edges: JSON.parse(JSON.stringify(edges))
    };
    
    past.current.push(snapshot);
    
    // Limit history size
    if (past.current.length > maxHistorySize) {
      past.current.shift();
    }
    
    // Clear future when new action is taken
    future.current = [];
  }, [maxHistorySize]);
  
  const undo = useCallback((): GraphSnapshot | null => {
    if (past.current.length === 0) return null;
    
    const previousSnapshot = past.current.pop()!;
    future.current.push(previousSnapshot);
    
    // Return the snapshot before the current one, or null if none exists
    return past.current.length > 0 ? past.current[past.current.length - 1] : null;
  }, []);
  
  const redo = useCallback((): GraphSnapshot | null => {
    if (future.current.length === 0) return null;
    
    const nextSnapshot = future.current.pop()!;
    past.current.push(nextSnapshot);
    
    return nextSnapshot;
  }, []);
  
  const canUndo = useCallback(() => past.current.length > 1, []);
  const canRedo = useCallback(() => future.current.length > 0, []);
  
  const clear = useCallback(() => {
    past.current = [];
    future.current = [];
  }, []);
  
  return {
    takeSnapshot,
    undo,
    redo,
    canUndo,
    canRedo,
    clear
  };
}