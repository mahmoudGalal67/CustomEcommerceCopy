import { useDispatch } from "react-redux";
import {
    useLoginMutation,
    useLogoutMutation,
} from "@/services/authApi";
import {
    handleLoginLogic,
    handleLogoutLogic,
} from "@/actions/auth";

export const useLogin = () => {
    const dispatch = useDispatch();
    const [loginApi, { isLoading }] = useLoginMutation();

    const login = async (data: any) => {
        return handleLoginLogic(data, loginApi, dispatch);
    };

    return { login, isLoading };
};

export const useLogout = () => {
    const [logoutAPi, { isLoading }] = useLogoutMutation();
    const dispatch = useDispatch();

    const logOutrHook = async () => {
        return handleLogoutLogic(logoutAPi, dispatch);
    };

    return { logOutrHook, isLoading };
};
