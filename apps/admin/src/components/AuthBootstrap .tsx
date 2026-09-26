'use client'

import { useMeQuery } from "@/services/categorySlice";
import { useDispatch } from "react-redux";
import { setUser } from "@/context/authSlice";
import { useEffect } from "react";

export const AuthBootstrap = () => {
    const dispatch = useDispatch();
    const { data, isSuccess } = useMeQuery(undefined);

    useEffect(() => {
        if (isSuccess && data) {
            dispatch(setUser(data));
        }
    }, [isSuccess, data, dispatch]);

    return null;
};
