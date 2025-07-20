import { useRef, useCallback, useState, useEffect } from 'react';
import {
  ReactFlow,
  Controls,
  Background,
  Panel,
  useReactFlow,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Button } from "@/components/ui/button";
import { Play, Loader2, CheckCircle2, XCircle } from "lucide-react";
import FunctionNode from './nodes/FunctionNode';
import { StringInputNode, NumberInputNode, BooleanInputNode } from './nodes/InputNodes';
import { StringViewerNode, BinaryViewerNode, JsonViewerNode } from './nodes/ViewerNodes';
import { useStore } from '@nanostores/react';
import { $nodes, $edges, updateNodes, updateEdges, connectEdge, executeGraph, addNode } from '@/stores/graph';

const nodeTypes = {
  function: FunctionNode,
  'string-input': StringInputNode,
  'number-input': NumberInputNode,
  'boolean-input': BooleanInputNode,
  'string-viewer': StringViewerNode,
  'binary-viewer': BinaryViewerNode,
  'json-viewer': JsonViewerNode,
};

const GraphEditor = () => {
  const nodes = useStore($nodes);
  const edges = useStore($edges);
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const { screenToFlowPosition } = useReactFlow();
  
  // Execution state management
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionStatus, setExecutionStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleExecute = useCallback(async () => {
    if (isExecuting) return;
    
    setIsExecuting(true);
    setExecutionStatus('idle');
    
    try {
      await executeGraph();
      setExecutionStatus('success');
      // Reset success state after 2 seconds
      setTimeout(() => setExecutionStatus('idle'), 2000);
    } catch (error) {
      console.error('Execution failed:', error);
      setExecutionStatus('error');
      // Reset error state after 3 seconds
      setTimeout(() => setExecutionStatus('idle'), 3000);
    } finally {
      setIsExecuting(false);
    }
  }, [isExecuting]);

  // Keyboard shortcut for execution (Ctrl/Cmd+Enter)
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
        event.preventDefault();
        handleExecute();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleExecute]);

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const reactFlowBounds = reactFlowWrapper.current?.getBoundingClientRect();
      const functionId = event.dataTransfer.getData('application/reactflow');

      if (!reactFlowBounds || !functionId) return;

      const position = screenToFlowPosition({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });

      addNode(functionId, position);
    },
    [screenToFlowPosition]
  );

  return (
    <div
      className="h-full w-full"
      ref={reactFlowWrapper}
      onDragOver={onDragOver}
      onDrop={onDrop}
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={updateNodes}
        onEdgesChange={updateEdges}
        onConnect={connectEdge}
        nodeTypes={nodeTypes}
      >
        <Panel position="top-right" className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleExecute}
            disabled={isExecuting}
            className={`gap-2 ${
              executionStatus === 'success' ? 'border-green-500 text-green-600' :
              executionStatus === 'error' ? 'border-red-500 text-red-600' : ''
            }`}
            title={`Run execution (${navigator.platform.includes('Mac') ? 'Cmd' : 'Ctrl'}+Enter)`}
          >
            {isExecuting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : executionStatus === 'success' ? (
              <CheckCircle2 className="h-4 w-4" />
            ) : executionStatus === 'error' ? (
              <XCircle className="h-4 w-4" />
            ) : (
              <Play className="h-4 w-4" />
            )}
            <span className="hidden sm:inline">
              {isExecuting ? 'Running...' : 
               executionStatus === 'success' ? 'Success!' :
               executionStatus === 'error' ? 'Failed' : 'Run'}
            </span>
          </Button>
        </Panel>
        <Controls />
        <Background />
      </ReactFlow>
    </div>
  );
};

export default GraphEditor;
