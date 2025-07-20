import { useRef, useCallback, useState, useEffect } from 'react';
import {
  ReactFlow,
  Controls,
  Background,
  Panel,
  useReactFlow,
  OnConnectStart,
  OnConnectEnd,
  Edge,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/theme-provider";
import { Play, Loader2, CheckCircle2, XCircle } from "lucide-react";
import { CanvasContextMenu } from "./CanvasContextMenu";
import FunctionNode from './nodes/FunctionNode';
import { StringInputNode, NumberInputNode, BooleanInputNode } from './nodes/InputNodes';
import { StringViewerNode, BinaryViewerNode, JsonViewerNode } from './nodes/ViewerNodes';
import { useStore } from '@nanostores/react';
import { $nodes, $edges, updateNodes, updateEdges, connectEdge, executeGraph, addNode } from '@/stores/graph';
import { getFunctionById } from '@/lib/functions/index';

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
  const { theme } = useTheme()
  const nodes = useStore($nodes);
  const edges = useStore($edges);
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const { screenToFlowPosition } = useReactFlow();
  
  // Execution state management
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionStatus, setExecutionStatus] = useState<'idle' | 'success' | 'error'>('idle');
  
  // Connection drag state for creating input/output nodes (using ref to persist through React Flow's handling)
  const connectingFromRef = useRef<{
    nodeId: string;
    handleId: string;
    handleType: string;
    direction: 'input' | 'output'; // Track whether we're creating input or output nodes
  } | null>(null);

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

  // Clear canvas function
  const clearCanvas = useCallback(() => {
    $nodes.set([]);
    $edges.set([]);
  }, []);

  // Handle connection start for creating input/output nodes
  const onConnectStart: OnConnectStart = useCallback((_, { nodeId, handleId, handleType }) => {
    console.log('onConnectStart:', { nodeId, handleId, handleType });
    
    if (nodeId && handleId) {
      const node = nodes.find(n => n.id === nodeId);
      console.log('Found node:', node);
      
      if (node && node.type === 'function') {
        const func = getFunctionById(node.data.functionId);
        console.log('Found function:', func);
        
        if (func) {
          // Handle input ports (target handles) - create input nodes
          if (handleType === 'target') {
            const inputField = func.getInputFields().find((field: any) => field.name === handleId);
            console.log('Found input field:', inputField);
            
            if (inputField) {
              const connectionInfo = {
                nodeId,
                handleId,
                handleType: inputField.type,
                direction: 'input' as const
              };
              console.log('Setting connectingFrom for input:', connectionInfo);
              connectingFromRef.current = connectionInfo;
            }
          }
          // Handle output ports (source handles) - create viewer nodes
          else if (handleType === 'source') {
            const outputField = func.getOutputFields().find((field: any) => field.name === handleId);
            console.log('Found output field:', outputField);
            
            if (outputField) {
              const connectionInfo = {
                nodeId,
                handleId,
                handleType: outputField.type,
                direction: 'output' as const
              };
              console.log('Setting connectingFrom for output:', connectionInfo);
              connectingFromRef.current = connectionInfo;
            }
          }
        }
      }
    } else {
      // Clear state for other cases
      connectingFromRef.current = null;
    }
  }, [nodes]);

  // Handle connection end for creating input/output nodes
  const onConnectEnd: OnConnectEnd = useCallback((event, connectionState) => {
    console.log('onConnectEnd called, connectingFrom:', connectingFromRef.current);
    console.log('connectionState:', connectionState);
    
    if (!connectingFromRef.current || !reactFlowWrapper.current) {
      console.log('Early return - no connectingFrom or reactFlowWrapper');
      connectingFromRef.current = null;
      return;
    }

    // If a connection was made to an existing node, don't create a new node
    if (connectionState?.isValid) {
      console.log('Connection was made to existing node, not creating new node');
      connectingFromRef.current = null;
      return;
    }

    // Handle both mouse and touch events
    const clientX = 'clientX' in event ? event.clientX : event.touches[0]?.clientX || 0;
    const clientY = 'clientY' in event ? event.clientY : event.touches[0]?.clientY || 0;

    const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
    const position = screenToFlowPosition({
      x: clientX - reactFlowBounds.left,
      y: clientY - reactFlowBounds.top,
    });

    const connectingFrom = connectingFromRef.current;
    
    if (connectingFrom.direction === 'input') {
      // Create input node for function input ports
      const inputNodeType = `${connectingFrom.handleType}-input`;
      console.log('Creating input node of type:', inputNodeType);
      
      // Position the new node to the left of the target node
      const targetNode = nodes.find(n => n.id === connectingFrom.nodeId);
      const offsetX = targetNode ? position.x - 250 : position.x; // 250px offset to the left
      const nodePosition = { x: offsetX, y: position.y };
      
      console.log('Adding input node at position:', nodePosition);
      addNode(inputNodeType, nodePosition);

      // Create the connection after a small delay
      setTimeout(() => {
        const currentNodes = $nodes.get();
        const newNode = currentNodes.find(node => 
          node.type === inputNodeType && 
          !nodes.some(oldNode => oldNode.id === node.id)
        );
        
        if (newNode) {
          const newEdge = {
            id: `${newNode.id}-to-${connectingFrom.nodeId}`,
            source: newNode.id,
            sourceHandle: 'value',
            target: connectingFrom.nodeId,
            targetHandle: connectingFrom.handleId,
          };
          connectEdge(newEdge);
        }
      }, 50);
      
    } else if (connectingFrom.direction === 'output') {
      // Create viewer node for function output ports
      // Map data types to appropriate viewer types
      const getViewerType = (dataType: string) => {
        switch (dataType) {
          case 'string':
          case 'number':
          case 'boolean':
            return 'string-viewer'; // Default to string viewer for basic types
          case 'object':
          case 'array':
            return 'json-viewer'; // Use JSON viewer for complex types
          default:
            return 'string-viewer'; // Fallback to string viewer
        }
      };
      
      const viewerNodeType = getViewerType(connectingFrom.handleType);
      console.log('Creating viewer node of type:', viewerNodeType);
      
      // Position the new node to the right of the source node
      const sourceNode = nodes.find(n => n.id === connectingFrom.nodeId);
      const offsetX = sourceNode ? position.x + 250 : position.x; // 250px offset to the right
      const nodePosition = { x: offsetX, y: position.y };
      
      console.log('Adding viewer node at position:', nodePosition);
      addNode(viewerNodeType, nodePosition);

      // Create the connection after a small delay
      setTimeout(() => {
        const currentNodes = $nodes.get();
        const newNode = currentNodes.find(node => 
          node.type === viewerNodeType && 
          !nodes.some(oldNode => oldNode.id === node.id)
        );
        
        if (newNode) {
          const newEdge = {
            id: `${connectingFrom.nodeId}-to-${newNode.id}`,
            source: connectingFrom.nodeId,
            sourceHandle: connectingFrom.handleId,
            target: newNode.id,
            targetHandle: 'input',
          };
          connectEdge(newEdge);
        }
      }, 50);
    }

    connectingFromRef.current = null;
  }, [screenToFlowPosition, nodes, addNode, connectEdge]);

  // Handle double-click on edge to remove connection
  const onEdgeDoubleClick = useCallback((event: React.MouseEvent, edge: Edge) => {
    event.preventDefault();
    console.log('Double-clicked edge:', edge.id, 'removing connection');
    $edges.set($edges.get().filter(e => e.id !== edge.id));
  }, []);

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
      <CanvasContextMenu onClearCanvas={clearCanvas}>
        <div className="h-full w-full">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={updateNodes}
            onEdgesChange={updateEdges}
            onConnect={connectEdge}
            onConnectStart={onConnectStart}
            onConnectEnd={onConnectEnd}
            onEdgeDoubleClick={onEdgeDoubleClick}
            nodeTypes={nodeTypes}
            colorMode={theme}
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
      </CanvasContextMenu>
    </div>
  );
};

export default GraphEditor;
