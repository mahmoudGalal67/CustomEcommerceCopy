"use client";

import Link from "next/link";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";

import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { loginSchema } from "@/schemas/schema";
import { useLogin } from "@/hooks/auth";
import { useDictionary } from "@/providers/dictionary-provider";
import { useGetSettingsQuery } from "@/services/SettingsApi";

function Login() {
  const router = useRouter();
  const { login, isLoading, isError, error } = useLogin();
  const params = useParams();
  const locale = (params.locale || "en") as string;
  const dict = useDictionary();
  const { data: settings } = useGetSettingsQuery(undefined);

  type loginForm = z.infer<typeof loginSchema>;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<loginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: loginForm) => {
    await login(data);
    if (router?.back) {
      router.back();
    } else {
      router.push(`/${locale}`);
    }
  };

  return (
    <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm  ">
        <Link href="/" className="flex items-center justify-center">
          <Image
            src={`${process.env.NEXT_PUBLIC_API_URL}/storage/${settings?.logo}`}
            alt={settings?.site_name || "Logo"}
            width={36}
            height={36}
            className="w-6 h-6 md:w-9 md:h-9"
          />
          <p className="hidden md:block text-md font-medium tracking-wider">
            {settings?.site_name}
          </p>
        </Link>
        <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight ">
          {locale === "ar"
            ? "تسجيل الدخول إلى حسابك"
            : "Sign in to your account"}
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label
              // for="email"
              className="block text-sm/6 font-medium "
            >
              {dict.labels.email}
            </label>
            <div className="mt-2">
              <input
                {...register("email")}
                id="email"
                type="email"
                name="email"
                autoComplete="email"
                className="block w-full rounded-md  px-3 py-1.5 text-base  outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
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
                className="block text-sm/6 font-medium "
              >
                {dict.labels.password}
              </label>
              <div className="text-sm">
                <a href="#" className="font-semibold  hover:text-amber-600">
                  {dict.labels.forgotPassword}
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
                className="block w-full rounded-md  px-3 py-1.5 text-base  outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
              />
              {errors.password && (
                <p className="text-red-500 text-sm">
                  {errors.password.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="flex w-full justify-center disabled:opacity-[.5] bg-primary rounded-md px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-iamber-600 focus-visible:outline-2 hover:bg-amber-600 focus-visible:outline-offset-2 focus-visible:outline-amber-600 cursor-pointer"
            >
              {isLoading ? dict.Buttons.loading : dict.Buttons.login}
            </button>
          </div>
        </form>
        {isError && (
          <p className="text-red-500 text-sm text-center my-2 ">
            {error?.data?.message ||
              "An error occurred during login. Please try again."}
          </p>
        )}
        <p className="mt-10 text-center text-sm/6 text-gray-500">
          {dict.labels.dontHaveAccount} {"  "}
          <Link
            href={`/${locale}/register`}
            className="font-semibold  hover:text-amber-600"
          >
            {dict.Buttons.register}
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
