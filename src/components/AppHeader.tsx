import { Button } from "@/components/ui/button"
import ShareButton from './ShareButton'
import { Search, Settings, Github } from "lucide-react"
import { ModeToggle } from "./mode-toggle"
import { Separator } from "./ui/separator"

export function AppHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur-sm supports-backdrop-filter:bg-background/60">
      <div className="container flex h-14 max-w-(--breakpoint-2xl) items-center px-4">
        <div className="flex items-center gap-4">
          <a href="/" className="flex items-center gap-2 font-semibold">
            <div className="flex aspect-square h-8 items-center justify-center rounded bg-primary text-primary-foreground">
              CC
            </div>
            <span className="hidden md:inline-block">spaghetti</span>
          </a>
          <Separator orientation="vertical" className="h-6" />
          <nav className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="gap-2 px-2"
              onClick={() => {
                const e = new KeyboardEvent('keydown', {
                  key: 'k',
                  metaKey: true,
                  bubbles: true
                });
                document.dispatchEvent(e);
              }}
            >
              <Search className="h-4 w-4" />
              <span className="hidden md:inline-flex">Search functions...</span>
              <kbd className="pointer-events-none hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 md:flex">
                <span className="text-xs">⌘</span>K
              </kbd>
            </Button>
          </nav>
        </div>

        <div className="flex flex-1 items-center justify-end gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            asChild
          >
            <a
              href="https://github.com/pavi2410/spaghetti"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Github className="h-4 w-4" />
              <span className="sr-only">GitHub</span>
            </a>
          </Button>
          <ShareButton />
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
          >
            <Settings className="h-4 w-4" />
            <span className="sr-only">Settings</span>
          </Button>
          <ModeToggle />
        </div>
      </div>
    </header>
  )
}
