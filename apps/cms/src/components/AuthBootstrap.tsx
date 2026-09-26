// src/components/AuthBootstrap.tsx
import { useEffect } from "react";
import { useRefreshMutation } from "@/services/authApi";

export default function AuthBootstrap() {
    const [refresh] = useRefreshMutation();

    useEffect(() => {
        refresh();
    }, []);

    return null;
}
