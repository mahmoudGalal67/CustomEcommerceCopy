import { Calendar, ChevronRight, Edit2, Home, Settings } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import CollapsibleMenu from "@/components/CollapsibleMenu";
import { useCMS } from "@/cms/store";
import { Link } from "react-router-dom";

// Menu items.
const items = [
  {
    title: "Home",
    url: "home",
    icon: Home,
  },
  {
    title: "Calendar",
    url: "calender",
    icon: Calendar,
  },
  {
    title: "Features",
    url: "features",
    icon: Edit2,
  },
  {
    title: "Settings",
    url: "settings",
    icon: Settings,
  },
];

export function AppSidebar() {
  const { pageLinks, setSelectedId } = useCMS();

  const { toggleSidebar, open, openMobile } = useSidebar();
  const isMobile = useIsMobile();

  const isOpen = isMobile ? openMobile : open;
  return (
    <Sidebar
      collapsible="icon"
      side="left"
      variant="sidebar"
      className="relative"
    >
      <Button
        onClick={toggleSidebar}
        className="w-6 h-6 absolute top-8 z-10 -right-4 rounded-full p-3 flex items-center justify-center transition-colors"
      >
        <ChevronRight
          className={`w-6 h-6 font-bold transition-transform duration-300 ${
            isOpen ? "rotate-180" : "rotate-0"
          }`}
        />
      </Button>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link
                      to={`/admin/${item.url}`}
                      onClick={() => setSelectedId("")}
                    >
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <CollapsibleMenu pageLinks={pageLinks} />
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
