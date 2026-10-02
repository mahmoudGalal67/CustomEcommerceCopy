"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";

import { useRefreshMutation } from "@/services/authApi";
import { useMeQuery } from "@/services/categorySlice";
import { logout, setUser } from "@/context/authSlice";

export const AuthBootstrap = () => {
    const dispatch = useDispatch();

    const [refresh, { isSuccess: refreshSuccess, isError: refreshError }] =
        useRefreshMutation();

    const {
        data,
        isSuccess: meSuccess,
        isError: meError,
    } = useMeQuery(undefined, {
        skip: !refreshSuccess,
    });

    useEffect(() => {
        refresh();
    }, [refresh]);

    useEffect(() => {
        if (meSuccess && data) {
            dispatch(setUser(data));
        }
    }, [meSuccess, data, dispatch]);

    useEffect(() => {
        if (refreshError || meError) {
            dispatch(logout());
        }
    }, [refreshError, meError, dispatch]);

    return null;
};