import { ChevronLeft } from "lucide-react";

import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupLabel,
    useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";

import PopupCampaign from "./PopupCampaign";
import PopupCampaign1 from "./PopupCampaign1";
import MarqqueeOffer from "./MarqqueeOffer";

export default function RightSidebar() {



    const { toggleSidebar, open, openMobile } = useSidebar();
    const isMobile = useIsMobile();


    const isOpen = isMobile ? openMobile : open;

    return (
        <Sidebar
            collapsible="icon"
            side="right"
            variant="sidebar"
            style={
                {
                    "--sidebar-width": "26rem",
                    "--sidebar-width-icon": "1rem",
                } as React.CSSProperties
            }
            className=""
        >
            <Button
                onClick={toggleSidebar}
                className="w-6 h-6 absolute top-8 z-10 -left-4 rounded-full p-3 flex items-center justify-center transition-colors"
            >
                <ChevronLeft
                    className={`w-6 h-6 font-bold transition-transform duration-300 ${isOpen ? "rotate-180" : "rotate-0"
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

        </Sidebar >
    );
}
