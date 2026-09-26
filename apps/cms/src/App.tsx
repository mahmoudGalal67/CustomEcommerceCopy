import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

import { Routes, Route, Navigate } from "react-router-dom";
import AdminLayout from "./app/admin/layout.tsx";
import HomeEditor from "./app/admin/pages/HomeEditor.tsx";
import Settings from "./app/admin/pages/Settings.js";
import Login from "./app/site/Login.tsx";
import ProtectedRoute from "./components/ProtectedRoute.js";
import StaticPages from './app/admin/pages/StaticPages.js';
import AddNewPage from './app/admin/pages/AddNewPage.js';
import CalenderPage from './app/admin/pages/CalendarPage.tsx';
import FeaturesPage from './app/admin/pages/Features.tsx';

export default function App() {
  return (
    <Routes>
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<Navigate to="admin/home" />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="home" />} />
          <Route path="home" element={<HomeEditor />} />
          <Route path="StaticPages/:id" element={<StaticPages />} />
          <Route path="AddStaticPage" element={<AddNewPage />} />
          <Route path="settings" element={<Settings />} />
          <Route path="calender" element={<CalenderPage />} />
          <Route path="features" element={<FeaturesPage />} />
        </Route>
      </Route>
      <Route path="/login" element={<Login />} />
    </Routes>
  );
}
