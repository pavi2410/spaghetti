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

  const handleSelect = (functionId: string) => {
    addNode(functionId);
    $commandPaletteOpen.set(false);
  };

  return (
    <CommandDialog open={open} onOpenChange={(value) => $commandPaletteOpen.set(value)}>
      <CommandInput placeholder="Type a command or search for a function..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        {Object.entries(functionsByCategory).map(([category, fns]) => (
          <CommandGroup key={category} heading={category}>
            {fns.map(([id, fn]) => (
              <CommandItem
                key={id}
                onSelect={() => handleSelect(id)}
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
