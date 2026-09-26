// src/components/ProtectedRoute.tsx
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";

export default function ProtectedRoute() {
    const { token, status } = useSelector((s: RootState) => s.auth);

    if (status === "checking") return null; // or spinner

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
}
