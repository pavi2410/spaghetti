import React from 'react';
import GraphEditor from './components/GraphEditor';
import CommandPalette from './components/CommandPalette';
import { ReactFlowProvider } from '@xyflow/react';
import { SidebarInset, SidebarProvider } from './components/ui/sidebar';
import { AppSidebar } from './components/app-sidebar';
import { AppHeader } from './components/AppHeader';

const App: React.FC = () => {
  return (
    <ReactFlowProvider>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <div className="relative flex min-h-screen flex-col">
            <AppHeader />

            {/* Main Content */}
            <div className="flex-1">
              <div className="">
                <div className="flex h-[calc(100vh-3.5rem)]">
                  {/* Main Area */}
                  <main className="flex-1 overflow-y-auto">
                    <GraphEditor />
                    <CommandPalette />
                  </main>
                </div>
              </div>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </ReactFlowProvider>
  );
};

export default App;
