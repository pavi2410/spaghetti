import { memo, useState } from 'react';
import { Handle, Position, Node, NodeProps } from '@xyflow/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { getFunctionById, type FieldInfo } from '@/lib/functions/index';

export type FunctionNode = Node<{
  functionId: string;
  outputs: Record<string, any>;
  validationErrors: Record<string, string | undefined>;
}, 'function'>;

const TypeBadge = ({ type }: { type: string }) => {
  const colors = {
    string: 'bg-blue-100 text-blue-800',
    number: 'bg-green-100 text-green-800', 
    boolean: 'bg-purple-100 text-purple-800',
    array: 'bg-orange-100 text-orange-800',
    object: 'bg-gray-100 text-gray-800',
  } as const;

  return (
    <Badge variant="secondary" className={`text-xs ${colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800'}`}>
      {type}
    </Badge>
  );
};

const InputPort = ({ 
  field, 
  error
}: {
  field: FieldInfo;
  error?: string;
}) => {
  const getTypeColor = (type: string) => {
    const colors = {
      string: 'bg-blue-500',
      number: 'bg-green-500', 
      boolean: 'bg-purple-500',
      array: 'bg-orange-500',
      object: 'bg-gray-500',
    } as const;
    return colors[type as keyof typeof colors] || 'bg-gray-500';
  };

  return (
    <div className="flex items-center gap-2 py-1">
      <Handle
        type="target"
        position={Position.Left}
        id={field.name}
        className={`w-3 h-3 ${getTypeColor(field.type)} ${error ? 'ring-2 ring-red-500' : ''}`}
      />
      <div className="flex items-center gap-2 min-w-0">
        <span className="text-xs font-medium truncate">{field.name}</span>
        <TypeBadge type={field.type} />
        {!field.optional && <span className="text-red-500 text-xs">*</span>}
      </div>
      {error && (
        <AlertCircle className="h-3 w-3 text-red-500 flex-shrink-0" />
      )}
    </div>
  );
};

const OutputPort = ({ 
  field, 
  value,
  hasValue
}: {
  field: FieldInfo;
  value: any;
  hasValue: boolean;
}) => {
  const getTypeColor = (type: string) => {
    const colors = {
      string: 'bg-blue-500',
      number: 'bg-green-500', 
      boolean: 'bg-purple-500',
      array: 'bg-orange-500',
      object: 'bg-gray-500',
    } as const;
    return colors[type as keyof typeof colors] || 'bg-gray-500';
  };

  return (
    <div className="flex items-center justify-end gap-2 py-1">
      {hasValue && (
        <CheckCircle2 className="h-3 w-3 text-green-500 flex-shrink-0" />
      )}
      <div className="flex items-center gap-2 min-w-0">
        <TypeBadge type={field.type} />
        <span className="text-xs font-medium truncate">{field.name}</span>
      </div>
      <Handle
        type="source"
        position={Position.Right}
        id={field.name}
        className={`w-3 h-3 ${getTypeColor(field.type)} ${hasValue ? 'ring-2 ring-green-400' : ''}`}
      />
    </div>
  );
};

const FunctionNode = ({ data, id }: NodeProps<FunctionNode>) => {
  const fn = getFunctionById(data.functionId);

  if (!fn) {
    return (
      <Card className="w-[200px] border-red-500">
        <CardContent className="p-4">
          <p className="text-sm text-red-500">Function not found: {data.functionId}</p>
        </CardContent>
      </Card>
    );
  }

  const inputFields = fn.getInputFields();
  const outputFields = fn.getOutputFields();

  return (
    <Card className="w-[280px]">
      <CardHeader className="space-y-1 pb-2">
        <CardTitle className="text-sm flex items-center gap-2">
          {fn.name}
          {fn.tags && fn.tags.length > 0 && (
            <Badge variant="outline" className="text-xs">
              {fn.tags[0]}
            </Badge>
          )}
        </CardTitle>
        <CardDescription className="text-xs">{fn.description}</CardDescription>
      </CardHeader>
      <CardContent className="py-3">
        {/* General validation error */}
        {data.validationErrors?.['_general'] && (
          <div className="mb-3 p-2 bg-red-50 border border-red-200 rounded text-xs text-red-600">
            {data.validationErrors['_general']}
          </div>
        )}
        
        <div className="space-y-4">
          {/* Input Ports */}
          {inputFields.length > 0 && (
            <div className="space-y-1">
              <h4 className="text-xs font-medium text-muted-foreground mb-2">
                Inputs
              </h4>
              {inputFields.map((field) => (
                <InputPort
                  key={field.name}
                  field={field}
                  error={data.validationErrors?.[field.name]}
                />
              ))}
            </div>
          )}

          {/* Output Ports */}
          {outputFields.length > 0 && (
            <div className="space-y-1">
              <h4 className="text-xs font-medium text-muted-foreground mb-2 text-right">
                Outputs
              </h4>
              {outputFields.map((field) => (
                <OutputPort
                  key={field.name}
                  field={field}
                  value={data.outputs?.[field.name]}
                  hasValue={data.outputs?.[field.name] !== undefined}
                />
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default memo(FunctionNode);
