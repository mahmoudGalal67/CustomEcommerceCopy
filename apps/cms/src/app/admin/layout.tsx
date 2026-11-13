import { Navigate, Outlet, useLocation } from "react-router-dom";
import { AppSidebar } from "./Sidebar.jsx";
import RightSidebar from "../../cms/RightSidebar";
import { SidebarProvider } from "../../components/ui/sidebar";
import type { RootState } from "@/store/store";

import { useCMS } from "../../cms/store";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useSelector } from "react-redux";
import FeaturesSidebar from "@/cms/SideBarEditContentSections/FeaturesSideBar/Feattures..js";

function UndoRedoToolbar() {
  const { undo, redo } = useCMS();
  const token = useSelector((state: RootState) => state.auth.token);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex gap-2 mb-4">
      <button
        onClick={undo}
        className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
      >
        <ChevronLeft className="w-5 h-5" />
        Undo
      </button>

      <button
        onClick={redo}
        className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
      >
        Redo
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
}

export default function AdminLayout() {
  const location = useLocation();

  const currentSection = location.pathname.split("/")[2];

  const hideSidebars = ["calender", "features", "settings"].includes(
    currentSection,
  );

  return (
    <div className="flex h-dvh w-full overflow-hidden">
      {/* Left Sidebar */}
      <SidebarProvider defaultOpen={true} className="contents">
        <AppSidebar />
      </SidebarProvider>

      {/* Main Content */}
      <main className="relative flex-1 min-w-0 h-full overflow-y-auto overflow-x-hidden bg-gray-50 px-3 sm:px-6">
        {!hideSidebars && <UndoRedoToolbar />}
        <Outlet />
      </main>

      {/* Right Sidebar */}
      {!hideSidebars && (
        <SidebarProvider defaultOpen={true} className="contents">
          <RightSidebar />
        </SidebarProvider>
      )}

      {/* Features Sidebar */}
      {currentSection === "features" && (
        <SidebarProvider defaultOpen={true} className="contents">
          <FeaturesSidebar />
        </SidebarProvider>
      )}
    </div>
  );
}
