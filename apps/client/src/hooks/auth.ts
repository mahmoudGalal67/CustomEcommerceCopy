import { useDispatch } from "react-redux";
import {
  useLoginMutation,
  useLogoutMutation,
  useRegisterMutation,
} from "@/services/authApi";
import { useMergeCartMutation } from "@/services/cartApi";
import {
  handleLoginLogic,
  handleLogoutLogic,
  handleRegisterLogic,
} from "@/actions/auth";
import { useMergeChatMutation } from "@/services/chatService";

export const useLogin = () => {
  const dispatch = useDispatch();
  const [loginApi, { isLoading ,isError,error}] = useLoginMutation();
  const [mergeCartApi] = useMergeCartMutation();
  const [mergeChatApi] = useMergeChatMutation();

  const login = async (data: any) => {
    return handleLoginLogic(data, loginApi, mergeCartApi, mergeChatApi, dispatch);
  };

  return { login, isLoading, isError, error };
};
export const useRegister = () => {
  const [registerApi, { isLoading ,isError,error}] = useRegisterMutation();

  const registerHook = async (data: any, reset: () => void) => {
    return handleRegisterLogic(data, registerApi, reset);
  };

  return { registerHook, isLoading, isError, error };
};
export const useLogout = () => {
  const [logoutAPi, { isLoading }] = useLogoutMutation();
  const dispatch = useDispatch();

  const logOutrHook = async () => {
    return handleLogoutLogic(logoutAPi, dispatch);
  };

  return { logOutrHook, isLoading };
};
