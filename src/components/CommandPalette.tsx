import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { useEffect } from "react";
import { useStore } from '@nanostores/react';
import { $commandPaletteOpen, $sortedFunctionsByCategory, addNode } from '@/stores/graph';

const CommandPalette = () => {
  const open = useStore($commandPaletteOpen);
  const functionsByCategory = useStore($sortedFunctionsByCategory);
  
  // Add input and viewer nodes
  const inputNodes = [
    { id: 'string-input', name: 'String Input', description: 'Provide string values' },
    { id: 'number-input', name: 'Number Input', description: 'Provide numeric values' },
    { id: 'boolean-input', name: 'Boolean Input', description: 'Provide true/false values' },
  ];

  const viewerNodes = [
    { id: 'string-viewer', name: 'String Viewer', description: 'View data as string' },
    { id: 'binary-viewer', name: 'Binary Viewer', description: 'View data as binary' },
    { id: 'json-viewer', name: 'JSON Viewer', description: 'View data as formatted JSON' },
  ];
  
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        $commandPaletteOpen.set(!open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [open]);

  const handleSelect = (nodeId: string) => {
    addNode(nodeId);
    $commandPaletteOpen.set(false);
  };

  return (
    <CommandDialog open={open} onOpenChange={(value: boolean) => $commandPaletteOpen.set(value)}>
      <CommandInput placeholder="Type a command or search for a function..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        
        {/* Input Providers */}
        <CommandGroup heading="Input Providers">
          {inputNodes.map((node) => (
            <CommandItem
              key={node.id}
              onSelect={() => handleSelect(node.id)}
            >
              <div className="flex flex-col">
                <span>{node.name}</span>
                <span className="text-xs text-muted-foreground">
                  {node.description}
                </span>
              </div>
            </CommandItem>
          ))}
        </CommandGroup>
        
        {/* Output Viewers */}
        <CommandGroup heading="Output Viewers">
          {viewerNodes.map((node) => (
            <CommandItem
              key={node.id}
              onSelect={() => handleSelect(node.id)}
            >
              <div className="flex flex-col">
                <span>{node.name}</span>
                <span className="text-xs text-muted-foreground">
                  {node.description}
                </span>
              </div>
            </CommandItem>
          ))}
        </CommandGroup>
        
        {/* Function Categories */}
        {Object.entries(functionsByCategory).map(([category, fns]) => (
          <CommandGroup key={category} heading={category}>
            {fns?.map((fn) => (
              <CommandItem
                key={fn.id}
                onSelect={() => handleSelect(fn.id)}
              >
                <div className="flex flex-col">
                  <span>{fn.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {fn.description}
                  </span>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        ))}
        <CommandSeparator />
      </CommandList>
    </CommandDialog>
  );
};

export default CommandPalette;
