import { ChevronLeft, PanelRightOpen, PanelRightClose } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  useSidebar,
} from "@/components/ui/sidebar";

import { Button } from "@/components/ui/button";
import PopupCampaign from "./PopupCampaign";
import MarqqueeOffer from "./MarqqueeOffer";

export default function RightSidebar() {
  const { toggleSidebar, open, openMobile, isMobile } = useSidebar();

  const isOpen = isMobile ? openMobile : open;

  return (
    <>
      {/* Mobile toggle */}
      {isMobile && (
        <Button
          onClick={toggleSidebar}
          variant="default"
          size="icon"
          className="fixed right-2 top-20 z-50 rounded-full shadow-md"
          aria-label="Toggle sidebar"
        >
          {isOpen ? (
            <PanelRightClose className="h-5 w-5" />
          ) : (
            <PanelRightOpen className="h-5 w-5" />
          )}
        </Button>
      )}

      <Sidebar
        collapsible="icon"
        side="right"
        variant="sidebar"
        style={
          {
            "--sidebar-width": "min(26rem, calc(100vw - 2rem))",
            "--sidebar-width-icon": "3rem",
          } as React.CSSProperties
        }
      >
        <Button
          onClick={toggleSidebar}
          className="w-6 h-6 absolute top-8 z-10 -left-4 rounded-full p-3 flex items-center justify-center transition-colors"
        >
          <ChevronLeft
            className={`w-6 h-6 font-bold transition-transform duration-300 ${
              isOpen ? "rotate-180" : "rotate-0"
            }`}
          />
        </Button>

        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Page Settings</SidebarGroupLabel>
            <MarqqueeOffer />
            <PopupCampaign />
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    </>
  );
}
