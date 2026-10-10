// actions/authActions.ts

import { AppDispatch } from "@/store/store";
import { logout, setCredentials } from "@/features/auth/authSlice";
import { cartApi } from "@/services/cartApi";
import { RegisterData, LoginData } from "@/types/user";
import { getGuestToken } from "@/lib/getGuestToken";

/**
 * Handles register logic
 */
export const handleLoginLogic = async (
  data: LoginData,
  loginApi: any,
  mergeCartApi: any,
  mergeChatApi: any,
  dispatch: AppDispatch,
) => {
  const guestToken = getGuestToken();

  try {
    // 1. Login
    const response = await loginApi(data).unwrap();
    // 2. Save token + user
    dispatch(
      setCredentials({
        access_token: response.access_token,
        userInfo: response.userInfo,
      }),
    );
    // 3. Merge guest chat → user messages
    await mergeChatApi({ guest_token: guestToken }).unwrap();
    // 3. Merge guest cart → user cart
    await mergeCartApi().unwrap();
    // 4. Force cart refetch
    dispatch(cartApi.util.invalidateTags(["Cart"]));

    return response;
  } catch (error: any) {
    console.error("❌ Login failed:", error);
    throw error;
  }
};

/**
 * Handles register logic
 */
export const handleRegisterLogic = async (
  data: RegisterData,
  registerAPi: any,
  reset: () => void,
) => {
  try {
    registerAPi({
      name: data.name,
      email: data.email,
      password: data.password,
      password_confirmation: data.password_confirmation,
      is_seller: data.is_seller,
      store_name: data.is_seller ? data.store_name : null,
    }).unwrap();

    reset(); // clears the form
  } catch (error: any) {
    console.error("❌ Registration failed:", error);
    throw error;
  }
};
/**
 * Handles register logic
 */
export const handleLogoutLogic = async (
  logoutAPi: any,
  dispatch: AppDispatch,
) => {
  try {
    await logoutAPi(undefined);
    dispatch(cartApi.util.invalidateTags(["Cart"]));
    dispatch(logout());
  } catch (error: any) {
    console.error("❌ Logout failed:", error);
    throw error;
  }
};
