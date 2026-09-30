import { useDispatch } from "react-redux";
import {
  useLoginMutation,
  useLogoutMutation,
  useRegisterMutation,
} from "@/services/authApi";
import { useMergeCartMutation } from "@/services/cartApi";

import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";

import {
  handleLoginLogic,
  handleLogoutLogic,
  handleRegisterLogic,
} from "@/actions/auth";
import { useMergeChatMutation } from "@/services/chatService";

const getApiErrorMessage = (error: unknown): string => {
  if (typeof error === "object" && error !== null && "data" in error) {
    const apiError = error as FetchBaseQueryError;

    if (
      typeof apiError.data === "object" &&
      apiError.data !== null &&
      "message" in apiError.data &&
      typeof apiError.data.message === "string"
    ) {
      return apiError.data.message;
    }
  }

  return "An error occurred. Please try again.";
};

export const useLogin = () => {
  const dispatch = useDispatch();
  const [loginApi, { isLoading, isError, error }] = useLoginMutation();
  const [mergeCartApi] = useMergeCartMutation();
  const [mergeChatApi] = useMergeChatMutation();

  const login = async (data: any) => {
    return handleLoginLogic(
      data,
      loginApi,
      mergeCartApi,
      mergeChatApi,
      dispatch,
    );
  };

  return {
    login,
    isLoading,
    isError,
    error,
    errorMessage: getApiErrorMessage(error),
  };
};
export const useRegister = () => {
  const [registerApi, { isLoading, isError, error }] = useRegisterMutation();

  const registerHook = async (data: any, reset: () => void) => {
    return handleRegisterLogic(data, registerApi, reset);
  };

  return {
    registerHook,
    isLoading,
    isError,
    error,
    errorMessage: getApiErrorMessage(error),
  };
};
export const useLogout = () => {
  const [logoutAPi, { isLoading }] = useLogoutMutation();
  const dispatch = useDispatch();

  const logOutrHook = async () => {
    return handleLogoutLogic(logoutAPi, dispatch);
  };

  return { logOutrHook, isLoading };
};
