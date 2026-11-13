import { useCMS } from "./store";
import { ChevronLeft } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { PanelRightOpen, PanelRightClose } from "lucide-react";
import { AnimatePresence } from "framer-motion";
import SuccessButton from "@/components/SuccessButton";
import SidebarEditFeatureSection from "@/cms/SideBarEditContentSections/FeaturedSliderProducts";
import BannersSideBar from "./SideBarEditContentSections/BannersSideBar";
import SideBarOfferProducts from "./SideBarEditContentSections/SideBarOfferProducts";
import CategorySecationSidear from "./SideBarEditContentSections/CategorySecationSidear";
import Hero2Sidebar from "./SideBarEditContentSections/Hero2Sidebar";
import { Input } from "@/components/ui/input";
import BrandMarqueeSidebar from "./SideBarEditContentSections/BrandsSectionSideBar";
import FeaturesSidebar from "./SideBarEditContentSections/FeaturesSidebar";
import GeneralCountdownOffersSidebar from "./SideBarEditContentSections/GeneralCountdownOffersSidebar";
import TestimonialsSidebar from "./SideBarEditContentSections/TestimonialsSidebar";
import RichTextSidebar from "./SideBarEditContentSections/RichTextSidebar";

export default function RightSidebar() {
  const {
    selectedSection,
    saveToBackend,
    success,
    isLoading,
    updatePageProp,
    currentPageData,
    updatePageTranslation,
  } = useCMS();

  const { toggleSidebar, open, openMobile, isMobile } = useSidebar();

  const isOpen = isMobile ? openMobile : open;

  if (!selectedSection) {
    return (
      <aside className="md:w-72 w-8 bg-gray-100 flex items-center justify-center">
        <p className="text-gray-500 text-md tracking-widest [writing-mode:vertical-lr] md:[writing-mode:horizontal-tb]">
          Select a section
        </p>
      </aside>
    );
  }

  return (
    <>
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
        className={`relative px-2 ${isOpen ? " px-2" : " px-5"}`}
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
            <SidebarGroupContent>
              <div className="flex flex-col gap-2">
                <Input
                  placeholder="Enter Page title..."
                  value={currentPageData?.title?.en ?? ""}
                  onChange={(e) =>
                    updatePageTranslation("title", "en", e.target.value)
                  }
                />

                <Input
                  dir="rtl"
                  placeholder="ادخل اسم الصفحة"
                  value={currentPageData?.title?.ar ?? ""}
                  onChange={(e) =>
                    updatePageTranslation("title", "ar", e.target.value)
                  }
                />
                <Input
                  placeholder="Enter Page slug..."
                  value={currentPageData?.slug}
                  onChange={(e) => updatePageProp("slug", e.target.value)}
                />
              </div>
            </SidebarGroupContent>
          </SidebarGroup>
          <SidebarGroup>
            <SidebarGroupLabel>Section Settings</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {selectedSection.type === "hero2" ? (
                  <Hero2Sidebar />
                ) : selectedSection.type === "sliderFeaturedProducts" ? (
                  <SidebarEditFeatureSection />
                ) : selectedSection.type === "CountDownOffers" ? (
                  <SideBarOfferProducts />
                ) : selectedSection.type === "CategorySecation" ? (
                  <CategorySecationSidear />
                ) : selectedSection.type === "brandMarquee" ? (
                  <BrandMarqueeSidebar />
                ) : selectedSection.type === "features" ? (
                  <FeaturesSidebar />
                ) : selectedSection.type === "generalCountdownOffers" ? (
                  <GeneralCountdownOffersSidebar />
                ) : selectedSection.type === "testimonials" ? (
                  <TestimonialsSidebar />
                ) : selectedSection.type === "twoColumnRichText" ? (
                  <RichTextSidebar />
                ) : (
                  <BannersSideBar />
                )}
              </SidebarMenu>
              <div className="flex gap-2 my-4">
                <button
                  type="submit"
                  onClick={saveToBackend}
                  disabled={isLoading}
                  className="cursor-pointer flex w-full justify-center rounded-md bg-[#0F172A] px-3 py-2 text-sm font-semibold text-white disabled:opacity-50"
                >
                  {success ? (
                    <AnimatePresence mode="wait">
                      <SuccessButton />
                    </AnimatePresence>
                  ) : isLoading ? (
                    "Loading..."
                  ) : (
                    "Update"
                  )}
                </button>
              </div>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    </>
  );
}
