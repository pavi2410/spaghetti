import { ReactNode } from 'react';
import { Trash2 } from "lucide-react";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";

interface CanvasContextMenuProps {
  children: ReactNode;
  onClearCanvas: () => void;
}

export function CanvasContextMenu({ children, onClearCanvas }: CanvasContextMenuProps) {
  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        {children}
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem 
          onClick={onClearCanvas}
          className="text-red-600 focus:text-red-600"
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Clear Canvas
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}