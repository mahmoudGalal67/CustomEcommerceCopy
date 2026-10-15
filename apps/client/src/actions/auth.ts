import type { AppDispatch } from "@/store/store";
import { logout, setCredentials } from "@/features/auth/authSlice";
import { cartApi } from "@/services/cartApi";
import type { LoginData, LoginResponse, RegisterData } from "@/types/user";
import { getGuestToken } from "@/lib/getGuestToken";

type Unwrappable<T> = {
  unwrap: () => Promise<T>;
};

type LoginMutation = (data: LoginData) => Unwrappable<LoginResponse>;

type GuestChatMergeMutation = (data: {
  guest_token: string;
}) => Unwrappable<unknown>;

type CartMergeMutation = (arg: void) => Unwrappable<unknown>;

type RegisterMutation = (data: RegisterData) => Unwrappable<unknown>;

type LogoutMutation = (arg: undefined) => Promise<unknown>;

export const handleLoginLogic = async (
  data: LoginData,
  loginApi: LoginMutation,
  mergeCartApi: CartMergeMutation,
  mergeChatApi: GuestChatMergeMutation,
  dispatch: AppDispatch,
) => {
  const guestToken = getGuestToken();

  try {
    const response = await loginApi(data).unwrap();

    dispatch(
      setCredentials({
        access_token: response.access_token,
        userInfo: response.userInfo,
      }),
    );

    await mergeChatApi({ guest_token: guestToken }).unwrap();
    await mergeCartApi(undefined).unwrap();

    dispatch(cartApi.util.invalidateTags(["Cart"]));

    return response;
  } catch (error: unknown) {
    console.error("Login failed:", error);
    throw error;
  }
};

export const handleRegisterLogic = async (
  data: RegisterData,
  registerApi: RegisterMutation,
  reset: () => void,
) => {
  try {
    const response = await registerApi({
      ...data,
    }).unwrap();

    reset();

    return response;
  } catch (error: unknown) {
    console.error("Registration failed:", error);
    throw error;
  }
};

export const handleLogoutLogic = async (
  logoutApi: LogoutMutation,
  dispatch: AppDispatch,
) => {
  try {
    await logoutApi(undefined);
    dispatch(cartApi.util.invalidateTags(["Cart"]));
    dispatch(logout());
  } catch (error: unknown) {
    console.error("Logout failed:", error);
    throw error;
  }
};
