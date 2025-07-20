import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ChevronDown, FileText } from "lucide-react"
import { exampleWorkflows } from "@/lib/examples"
import { graphStore } from "@/stores/graph"

export function ExamplesDropdown() {
  const handleExampleSelect = (exampleId: string) => {
    graphStore.loadExample(exampleId)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2 px-2">
          <FileText className="h-4 w-4" />
          <span className="hidden md:inline-flex">Examples</span>
          <ChevronDown className="h-3 w-3" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-56">
        {exampleWorkflows.map((example) => (
          <DropdownMenuItem
            key={example.id}
            onClick={() => handleExampleSelect(example.id)}
            className="flex flex-col items-start gap-1 py-3"
          >
            <div className="font-medium">{example.name}</div>
            <div className="text-xs text-muted-foreground">
              {example.description}
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}