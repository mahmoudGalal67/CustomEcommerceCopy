// actions/authActions.ts

// actions/authActions.ts
import type { AppDispatch } from "@/store/store";
import { logout, setCredentials } from "@/context/authSlice";

/**
 * Handles register logic
 */
export const handleLoginLogic = async (
    data: any,
    loginApi: any,
    dispatch: AppDispatch
) => {
    try {
        // 1. Login
        const response = await loginApi(data).unwrap();
        // 2. Save token + user
        dispatch(
            setCredentials({
                access_token: response.access_token,
            })
        );

        return response;
    } catch (error: any) {
        console.error("❌ Login failed:", error);
        throw error;
    }
};

/**
 * Handles register logic
 */

export const handleLogoutLogic = async (
    logoutAPi: any,
    dispatch: AppDispatch
) => {
    try {
        await logoutAPi(undefined);
        dispatch(logout());
    } catch (error: any) {
        console.error("❌ Logout failed:", error);
        throw error;
    }
};
