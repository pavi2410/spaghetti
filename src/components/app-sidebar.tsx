import * as React from "react"
import { GalleryVerticalEnd, GripVertical } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import { functions } from "@/lib/functions"

// Group functions by category
const groupedFunctions = Object.groupBy(functions, (func) => func.category)

// Generate navigation data
const data = {
  navMain: Object.entries(groupedFunctions).map(([category, funcs]) => ({
    title: category,
    url: `#${category.toLowerCase().replace(/[\s/]+/g, '-')}`,
    items: funcs.map(func => ({
      title: func.name,
      url: `#${func.id}`,
      description: func.description,
      id: func.id,
    }))
  }))
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const onDragStart = (event: React.DragEvent, functionId: string) => {
    event.dataTransfer.setData('application/reactflow', functionId)
    event.dataTransfer.effectAllowed = 'move'
  }

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <GalleryVerticalEnd className="size-4" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-semibold">Documentation</span>
                  <span className="">Functions</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu className="gap-2">
            {data.navMain.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild>
                  <a href={item.url} className="font-medium">
                    {item.title}
                  </a>
                </SidebarMenuButton>
                {item.items?.length ? (
                  <SidebarMenuSub className="ml-0 border-l-0 px-1.5">
                    {item.items.map((item) => (
                      <SidebarMenuSubItem key={item.title}>
                        <SidebarMenuSubButton
                          asChild
                          title={item.description}
                          className="group"
                          draggable
                          onDragStart={(e) => onDragStart(e, item.id)}
                        >
                          <a href={item.url} className="flex items-center gap-2">
                            <GripVertical className="size-4 opacity-0 group-hover:opacity-50" />
                            {item.title}
                          </a>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                ) : null}
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
