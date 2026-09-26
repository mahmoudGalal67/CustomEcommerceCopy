
import { useNavigate } from "react-router-dom";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { useForm } from "react-hook-form";
import { loginSchema } from "@/schemas/schema";
import { useLogin } from "@/hooks/auth";
import { Link } from "react-router-dom";
import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import SuccessButton from "@/components/SuccessButton";
import SuccessModal from "@/components/SuccessModal";

function Login() {
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();
    const { login, isLoading } = useLogin();
    type loginForm = z.infer<typeof loginSchema>;

    const {
        register,
        handleSubmit,
        setError,
        formState: { errors },
    } = useForm<loginForm>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (data: loginForm) => {
        try {
            const response = await login(data);
            console.log(response);

            // ❌ User is not admin
            if (response?.userInfo && response.userInfo.role !== "admin") {
                setError("root", {
                    type: "manual",
                    message: "You are not authorized to access the admin panel",
                });
                return;
            }
            // ✅ Success
            setSuccess(true);
            setTimeout(() => {
                navigate("/admin");
            }, 1200);
        } catch (error: any) {
            console.log(error);
            // ❌ Invalid email or password
            if (error?.data?.message === "Invalid credentials") {
                setError("email", {
                    type: "manual",
                    message: "Invalid email or password",
                });
                setError("password", {
                    type: "manual",
                    message: "Invalid email or password",
                });
                return;
            }

            setError("root", {
                type: "manual",
                message: "Something went wrong. Please try again.",
            });
        }
    };


    return (
        <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-sm  ">
                <Link to="/" className="flex items-center justify-center">
                    <img
                        src="/logo.png"
                        alt="GalalStore"
                        width={36}
                        height={36}
                        className="w-6 h-6 md:w-9 md:h-9"
                    />
                    <p className="hidden md:block text-md font-medium tracking-wider">
                        Galal Store CMS.
                    </p>
                </Link>
                <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-[#0F172A]">
                    Sign in to your account
                </h2>
            </div>

            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
                    <div>
                        <label
                            // for="email"
                            className="block text-sm/6 font-medium text-[#0F172A]"
                        >
                            Email address
                        </label>
                        <div className="mt-2">
                            <input
                                {...register("email")}
                                id="email"
                                type="email"
                                name="email"
                                autoComplete="email"
                                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-[#0F172A] outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                            />
                            {errors.email && (
                                <p className="text-red-500 text-sm">{errors.email.message}</p>
                            )}
                        </div>
                    </div>

                    <div>
                        <div className="flex items-center justify-between">
                            <label
                                // for="password"
                                className="block text-sm/6 font-medium text-[#0F172A]"
                            >
                                Password
                            </label>
                            <div className="text-sm">
                                <a
                                    href="#"
                                    className="font-semibold text-[#0F172A] hover:text-[#0F172A]"
                                >
                                    Forgot password?
                                </a>
                            </div>
                        </div>
                        <div className="mt-2">
                            <input
                                {...register("password")}
                                id="password"
                                type="password"
                                name="password"
                                autoComplete="current-password"
                                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-[#0F172A] outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                            />
                            {errors.password && (
                                <p className="text-red-500 text-sm">
                                    {errors.password.message}
                                </p>
                            )}
                        </div>
                    </div>

                    <div>
                        {errors.root && (
                            <p className="text-red-500 text-sm text-center mb-2">
                                {errors.root.message}
                            </p>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="flex w-full justify-center rounded-md bg-[#0F172A] px-3 py-2 text-sm font-semibold text-white disabled:opacity-50"
                        >
                            {success ?
                                <AnimatePresence mode="wait">
                                    <SuccessButton />
                                </AnimatePresence> : (isLoading ? "Loading..." : "Sign in")}

                        </button>

                    </div>
                </form>


            </div>
            <SuccessModal open={success} />
        </div>
    );
}

export default Login;
