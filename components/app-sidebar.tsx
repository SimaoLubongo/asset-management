'use client'
import * as React from "react";
import { usePathname } from "next/navigation";
import { VersionSwitcher } from "@/components/version-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";

import { data } from "@/components/menu";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname(); // Gets the current URL to check which item is active

  return (
    <Sidebar {...props} className="bg-card shadow-lg"> {/*Background color and shadow*/}
      <SidebarHeader>
        <VersionSwitcher versions={data.versions} defaultVersion={data.versions[0]} />
      </SidebarHeader>
      <SidebarContent>
        {data.navMain.map((parentItem) => (
          <SidebarGroup key={parentItem.title}>
            <SidebarGroupLabel>{parentItem.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {parentItem.items.map((item) => {
                  const isActive = pathname === item.url; // Checks if the current URL matches the item

                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        asChild
                        className={`flex items-center gap-2 w-full p-2 rounded-md transition-colors
                          ${isActive ? "bg-primary text-primary-foreground" : "hover:bg-muted hover:text-foreground"}`}
                      >
                        <a href={item.url} className="flex items-center gap-2 w-full">
                          <item.icon className="w-5 h-5" /> {/* Menu icon */}
                          {item.title}
                        </a>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
