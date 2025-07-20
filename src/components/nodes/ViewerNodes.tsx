import { memo } from 'react';
import { Handle, Position, Node, NodeProps } from '@xyflow/react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Copy, Eye } from "lucide-react";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";

// String Viewer Node
export type StringViewerNode = Node<{
  value: any;
}, 'string-viewer'>;

export const StringViewerNode = memo(({ data, id }: NodeProps<StringViewerNode>) => {
  const displayValue = data.value !== undefined ? String(data.value) : '';
  
  const copyToClipboard = () => {
    if (displayValue) {
      navigator.clipboard.writeText(displayValue);
    }
  };

  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <Card className="w-[300px] relative">
          <Handle
            type="target"
            position={Position.Left}
            id="input"
            className="w-3 h-3 bg-blue-500"
            style={{ top: '50%', transform: 'translateY(-50%)' }}
          />
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Eye className="h-4 w-4" />
              String Viewer
              <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-800">
                string
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="p-3 bg-muted rounded-md min-h-[60px] max-h-[200px] overflow-auto">
                <pre className="text-xs whitespace-pre-wrap font-mono">
                  {displayValue || <span className="text-muted-foreground">No data</span>}
                </pre>
              </div>
              <div className="text-xs text-muted-foreground">
                Length: {displayValue.length} characters
              </div>
            </div>
          </CardContent>
        </Card>
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem 
          onClick={copyToClipboard}
          disabled={!displayValue}
        >
          <Copy className="h-4 w-4 mr-2" />
          Copy to clipboard
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
});

// Binary Viewer Node
export type BinaryViewerNode = Node<{
  value: any;
}, 'binary-viewer'>;

export const BinaryViewerNode = memo(({ data, id }: NodeProps<BinaryViewerNode>) => {
  const displayValue = data.value !== undefined ? String(data.value) : '';
  
  // Convert to binary representation
  const binaryValue = displayValue 
    ? Array.from(new TextEncoder().encode(displayValue))
        .map(byte => byte.toString(2).padStart(8, '0'))
        .join(' ')
    : '';

  const copyToClipboard = () => {
    if (binaryValue) {
      navigator.clipboard.writeText(binaryValue);
    }
  };

  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <Card className="w-[350px] relative">
          <Handle
            type="target"
            position={Position.Left}
            id="input"
            className="w-3 h-3 bg-orange-500"
            style={{ top: '50%', transform: 'translateY(-50%)' }}
          />
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Eye className="h-4 w-4" />
              Binary Viewer
              <Badge variant="secondary" className="text-xs bg-orange-100 text-orange-800">
                binary
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="p-3 bg-muted rounded-md min-h-[80px] max-h-[200px] overflow-auto">
                <pre className="text-xs font-mono break-all">
                  {binaryValue || <span className="text-muted-foreground">No data</span>}
                </pre>
              </div>
              <div className="text-xs text-muted-foreground">
                Original: {displayValue.length} chars | Binary: {binaryValue.split(' ').length} bytes
              </div>
            </div>
          </CardContent>
        </Card>
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem 
          onClick={copyToClipboard}
          disabled={!binaryValue}
        >
          <Copy className="h-4 w-4 mr-2" />
          Copy to clipboard
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
});

// JSON Viewer Node
export type JsonViewerNode = Node<{
  value: any;
}, 'json-viewer'>;

export const JsonViewerNode = memo(({ data, id }: NodeProps<JsonViewerNode>) => {
  let displayValue = '';
  let isValidJson = false;
  let parseError = '';

  try {
    if (data.value !== undefined) {
      if (typeof data.value === 'string') {
        // Try to parse as JSON and pretty-print
        const parsed = JSON.parse(data.value);
        displayValue = JSON.stringify(parsed, null, 2);
        isValidJson = true;
      } else {
        // Convert object to JSON
        displayValue = JSON.stringify(data.value, null, 2);
        isValidJson = true;
      }
    }
  } catch (error) {
    displayValue = String(data.value || '');
    parseError = error instanceof Error ? error.message : 'Invalid JSON';
  }

  const copyToClipboard = () => {
    if (displayValue) {
      navigator.clipboard.writeText(displayValue);
    }
  };

  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <Card className="w-[350px] relative">
          <Handle
            type="target"
            position={Position.Left}
            id="input"
            className="w-3 h-3 bg-gray-500"
            style={{ top: '50%', transform: 'translateY(-50%)' }}
          />
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Eye className="h-4 w-4" />
              JSON Viewer
              <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-800">
                json
              </Badge>
              {!isValidJson && parseError && (
                <Badge variant="destructive" className="text-xs">
                  Invalid
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className={`p-3 rounded-md min-h-[80px] max-h-[300px] overflow-auto ${
                isValidJson ? 'bg-muted' : 'bg-red-50 border border-red-200'
              }`}>
                <pre className="text-xs font-mono whitespace-pre-wrap">
                  {displayValue || <span className="text-muted-foreground">No data</span>}
                </pre>
              </div>
              {parseError && (
                <div className="text-xs text-red-600">
                  Error: {parseError}
                </div>
              )}
              {isValidJson && (
                <div className="text-xs text-muted-foreground">
                  Valid JSON • {displayValue.split('\n').length} lines
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem 
          onClick={copyToClipboard}
          disabled={!displayValue}
        >
          <Copy className="h-4 w-4 mr-2" />
          Copy to clipboard
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
});