import { memo } from 'react';
import { Handle, Position, Node, NodeProps } from '@xyflow/react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

// String Input Node
export type StringInputNode = Node<{
  value: string;
  onValueChange: (value: string) => void;
}, 'string-input'>;

export const StringInputNode = memo(({ data, id }: NodeProps<StringInputNode>) => {
  return (
    <Card className="w-[250px]">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2">
          String Input
          <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-800">
            string
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <Label htmlFor={`${id}-value`} className="text-xs">
            Value
          </Label>
          <Input
            id={`${id}-value`}
            value={data.value || ''}
            onChange={(e) => data.onValueChange?.(e.target.value)}
            placeholder="Enter string value"
          />
          <div className="flex justify-end">
            <div className="relative">
              <Handle
                type="source"
                position={Position.Right}
                id="value"
                className="w-3 h-3 bg-blue-500"
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
});

// Number Input Node
export type NumberInputNode = Node<{
  value: number;
  onValueChange: (value: number) => void;
}, 'number-input'>;

export const NumberInputNode = memo(({ data, id }: NodeProps<NumberInputNode>) => {
  return (
    <Card className="w-[250px]">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2">
          Number Input
          <Badge variant="secondary" className="text-xs bg-green-100 text-green-800">
            number
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <Label htmlFor={`${id}-value`} className="text-xs">
            Value
          </Label>
          <Input
            id={`${id}-value`}
            type="number"
            value={data.value || ''}
            onChange={(e) => data.onValueChange?.(Number(e.target.value))}
            placeholder="Enter number value"
          />
          <div className="flex justify-end">
            <div className="relative">
              <Handle
                type="source"
                position={Position.Right}
                id="value"
                className="w-3 h-3 bg-green-500"
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
});

// Boolean Input Node
export type BooleanInputNode = Node<{
  value: boolean;
  onValueChange: (value: boolean) => void;
}, 'boolean-input'>;

export const BooleanInputNode = memo(({ data, id }: NodeProps<BooleanInputNode>) => {
  return (
    <Card className="w-[250px]">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2">
          Boolean Input
          <Badge variant="secondary" className="text-xs bg-purple-100 text-purple-800">
            boolean
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <Label htmlFor={`${id}-value`} className="text-xs">
            Value
          </Label>
          <select
            id={`${id}-value`}
            value={String(data.value || false)}
            onChange={(e) => data.onValueChange?.(e.target.value === 'true')}
            className="w-full px-3 py-2 text-sm border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="false">false</option>
            <option value="true">true</option>
          </select>
          <div className="flex justify-end">
            <div className="relative">
              <Handle
                type="source"
                position={Position.Right}
                id="value"
                className="w-3 h-3 bg-purple-500"
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
});