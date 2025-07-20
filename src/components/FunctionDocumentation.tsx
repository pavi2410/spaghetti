import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { functions, FunctionDefinition } from '@/functions';

const FunctionDocumentation: React.FC = () => {
  const functionsByCategory = Object.entries(functions).reduce<Record<string, Array<[string, FunctionDefinition]>>>((acc, entry) => {
    const category = entry[1].category;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(entry);
    return acc;
  }, {});

  return (
    <Accordion type="single" collapsible>
      {Object.entries(functionsByCategory).map(([category, fns]) => (
        <AccordionItem key={category} value={category}>
          <AccordionTrigger className="text-sm">{category}</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              {fns.map(([id, fn]) => (
                <div key={id} className="space-y-2">
                  <h3 className="font-medium">{fn.name}</h3>
                  <p className="text-sm text-muted-foreground">{fn.description}</p>
                  
                  {/* Inputs */}
                  <div>
                    <h4 className="text-xs font-medium mb-1">Inputs:</h4>
                    <ul className="text-xs text-muted-foreground list-disc list-inside">
                      {fn.inputs.map((input) => (
                        <li key={input.id}>
                          {input.name} ({input.type})
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Outputs */}
                  <div>
                    <h4 className="text-xs font-medium mb-1">Outputs:</h4>
                    <ul className="text-xs text-muted-foreground list-disc list-inside">
                      {fn.outputs.map((output) => (
                        <li key={output.id}>
                          {output.name} ({output.type})
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Example */}
                  <div>
                    <h4 className="text-xs font-medium mb-1">Example:</h4>
                    <div className="text-xs">
                      <div className="font-mono bg-muted p-2 rounded">
                        <div>Input: {JSON.stringify(fn.example.input)}</div>
                        <div>Output: {JSON.stringify(fn.example.output)}</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
};

export default FunctionDocumentation;
