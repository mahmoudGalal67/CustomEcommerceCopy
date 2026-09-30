"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";

import { registerSchema } from "@/schemas/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";
import { useRegister } from "@/hooks/auth";
import { useDictionary } from "@/providers/dictionary-provider";
import { useGetSettingsQuery } from "@/services/SettingsApi";

function Register() {
  const router = useRouter();
  const { registerHook, isLoading } = useRegister();
  const params = useParams();
  const locale = (params.locale || "en") as string;
  const dict = useDictionary();
  const { data: settings } = useGetSettingsQuery(undefined);

  type RegisterForm = z.infer<typeof registerSchema>;

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      is_seller: false,
      store_name: "",
      phone: "",
    },
  });

  const isSeller = watch("is_seller");

  const onSubmit = async (data: RegisterForm) => {
    await registerHook(data, reset);
    router.push(`/${locale}/login`);
  };

  return (
    <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm  ">
        <Link href="/" className="flex items-center justify-center">
          <Image
            src={
              settings?.logo
                ? `${process.env.NEXT_PUBLIC_API_URL}/storage/${settings?.logo}`
                : "/logo.png"
            }
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
          {locale === "ar" ? "إنشاء حساب جديد" : "Create a new account"}
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label className="block text-sm font-medium ">
              {dict.labels.name}
            </label>
            <input
              {...register("name")}
              className="block w-full rounded-md  px-3 py-1.5   outline-1 outline-gray-300 focus:outline-2 focus:outline-indigo-600 sm:text-sm"
            />
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium ">
              {dict.labels.email}
            </label>
            <input
              {...register("email")}
              type="email"
              className="block w-full rounded-md  px-3 py-1.5   outline-1 outline-gray-300 focus:outline-2 focus:outline-indigo-600 sm:text-sm"
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium ">
              {dict.labels.password}
            </label>
            <input
              {...register("password")}
              type="password"
              className="block w-full rounded-md  px-3 py-1.5   outline-1 outline-gray-300 focus:outline-2 focus:outline-indigo-600 sm:text-sm"
            />
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium ">
              {dict.labels.confirmPassword}
            </label>
            <input
              {...register("password_confirmation")}
              type="password"
              className="block w-full rounded-md  px-3 py-1.5   outline-1 outline-gray-300 focus:outline-2 focus:outline-indigo-600 sm:text-sm"
            />
            {errors.password_confirmation && (
              <p className="text-red-500 text-sm">
                {errors.password_confirmation.message}
              </p>
            )}
          </div>
          <div className="flex items-center gap-3">
            <input
              {...register("is_seller")}
              type="checkbox"
              id="is_seller"
              className="h-4 w-4 rounded border-gray-300"
            />

            <label htmlFor="is_seller" className="text-sm font-medium ">
              Register as a seller
            </label>
          </div>
          {isSeller && (
            <>
              <div>
                <label className="block text-sm font-medium ">Store Name</label>

                <input
                  {...register("store_name")}
                  type="text"
                  placeholder="Enter your store name"
                  className="block w-full rounded-md  px-3 py-1.5  outline-1 outline-gray-300 focus:outline-2 focus:outline-indigo-600 sm:text-sm"
                />

                {errors.store_name && (
                  <p className="text-red-500 text-sm">
                    {errors.store_name.message}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium ">Phone</label>

                <input
                  {...register("phone")}
                  type="text"
                  placeholder="Enter your phone number"
                  className="block w-full rounded-md  px-3 py-1.5  outline-1 outline-gray-300 focus:outline-2 focus:outline-indigo-600 sm:text-sm"
                />

                {errors.phone && (
                  <p className="text-red-500 text-sm">{errors.phone.message}</p>
                )}
              </div>
            </>
          )}
          <button
            type="submit"
            disabled={isLoading}
            className="flex w-full justify-center cursor-pointer rounded-md bg-primary px-3 py-1.5 text-sm font-semibold text-white shadow hover:bg-amber-600 focus-visible:outline-2 focus-visible:outline-amber-600"
          >
            {isLoading ? dict.Buttons.loading : dict.Buttons.register}
          </button>
        </form>

        <p className="mt-10 text-center text-sm text-gray-500">
          {dict.labels.alreadyHaveAccount} {"  "}
          <Link
            href={`/${locale}/login`}
            className="font-semibold  hover:text-amber-600"
          >
            {dict.Buttons.login}
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
