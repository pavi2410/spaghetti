import { useRef, useCallback } from 'react';
import {
  ReactFlow,
  Controls,
  Background,
  Panel,
  useReactFlow,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";
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
            size="icon"
            onClick={() => executeGraph()}
          >
            <Play className="h-4 w-4" />
          </Button>
        </Panel>
        <Controls />
        <Background />
      </ReactFlow>
    </div>
  );
};

export default GraphEditor;
