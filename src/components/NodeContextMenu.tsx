import { ReactNode } from 'react';
import { Trash2 } from "lucide-react";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";

interface NodeContextMenuProps {
  children: ReactNode;
  nodeId: string;
  onDeleteNode: (nodeId: string) => void;
}

export function NodeContextMenu({ children, nodeId, onDeleteNode }: NodeContextMenuProps) {
  const handleDelete = () => {
    onDeleteNode(nodeId);
  };

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        {children}
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem 
          onClick={handleDelete}
          className="text-red-600 focus:text-red-600"
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Delete Node
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}