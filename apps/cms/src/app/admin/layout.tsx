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
      {/* Undo Button */}
      <button
        onClick={undo}
        className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
      >
        <ChevronLeft className="w-5 h-5" />
        Undo
      </button>

      {/* Redo Button */}
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
  return (
    <div className="flex h-screen overflow-hidden">
      <SidebarProvider>
        <AppSidebar />
        <main className="flex-1 px-6 overflow-y-auto bg-gray-50">
          {location.pathname.split('/')[2] !== 'calender' && location.pathname.split('/')[2] !== 'features' && location.pathname.split('/')[2] !== 'settings' && <UndoRedoToolbar />}
          <Outlet />
        </main>
        {location.pathname.split('/')[2] !== 'calender' && location.pathname.split('/')[2] !== 'features' && location.pathname.split('/')[2] !== 'settings' && <RightSidebar />}
        {location.pathname.split('/')[2] == 'features' && <FeaturesSidebar />}
      </SidebarProvider>
    </div>
  );
}
