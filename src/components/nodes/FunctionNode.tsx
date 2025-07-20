import { memo } from 'react';
import { Handle, Position, Node, NodeProps } from '@xyflow/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { functions } from '@/lib/functions';

export type FunctionNode = Node<{
  functionId: string;
  inputs: Record<string, string>;
  outputs: Record<string, string>;
  onInputChange: (inputId: string, value: string) => void;
}, 'function'>;

const FunctionNode = ({ data, id }: NodeProps<FunctionNode>) => {
  const fn = functions.find((func) => func.id === data.functionId);

  if (!fn) {
    return null;
  }

  return (
    <Card className="w-[300px]">
      <CardHeader className="space-y-1">
        <CardTitle className="text-base">{fn.name}</CardTitle>
        <CardDescription className="text-xs">{fn.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Inputs */}
          <div className="space-y-2">
            {fn.inputs.map((input) => (
              <div key={input.id} className="grid gap-2">
                <Label htmlFor={`${id}-${input.id}`} className="text-xs">
                  {input.name}
                </Label>
                <div className="relative">
                  <Handle
                    type="target"
                    position={Position.Left}
                    id={input.id}
                    className="w-2 h-2 bg-primary!"
                  />
                  <Input
                    id={`${id}-${input.id}`}
                    value={data.inputs?.[input.id] || ''}
                    onChange={(e) => data.onInputChange?.(input.id, e.target.value)}
                    placeholder={`Enter ${input.name.toLowerCase()}`}
                    className="pl-6"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Outputs */}
          <div className="space-y-2">
            {fn.outputs.map((output) => (
              <div key={output.id} className="grid gap-2">
                <Label htmlFor={`${id}-${output.id}`} className="text-xs">
                  {output.name}
                </Label>
                <div className="relative">
                  <Input
                    id={`${id}-${output.id}`}
                    value={data.outputs?.[output.id] || ''}
                    readOnly
                    className="pr-6 bg-muted"
                  />
                  <Handle
                    type="source"
                    position={Position.Right}
                    id={output.id}
                    className="w-2 h-2 bg-primary!"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default memo(FunctionNode);
