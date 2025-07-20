import { ReactNode } from 'react';
import { Copy, Trash2 } from 'lucide-react';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
  ContextMenuSeparator,
} from '@/components/ui/context-menu';
import { graphStore } from '@/stores/graph';

interface ViewerContextMenuProps {
  children: ReactNode;
  nodeId: string;
  copyValue: string;
  disabled?: boolean;
}

export function ViewerContextMenu({ children, nodeId, copyValue, disabled = false }: ViewerContextMenuProps) {
  const copyToClipboard = () => {
    if (copyValue) {
      navigator.clipboard.writeText(copyValue);
    }
  };

  return (
    <ContextMenu>
      <ContextMenuTrigger>
        {children}
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem 
          onClick={copyToClipboard}
          disabled={disabled || !copyValue}
        >
          <Copy className="h-4 w-4 mr-2" />
          Copy to clipboard
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem 
          onClick={() => graphStore.deleteNode(nodeId)}
          className="text-red-600 focus:text-red-600"
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Delete node
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}