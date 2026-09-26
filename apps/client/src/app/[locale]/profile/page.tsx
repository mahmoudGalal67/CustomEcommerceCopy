"use client";

import { useEffect, useState } from "react";

import Image from "next/image";

import { Camera, ShieldCheck } from "lucide-react";

import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import { profileSchema, ProfileFormValues } from "@/schemas/profileSchema";

import { useGetUserQuery, useUpdateUserMutation } from "@/services/userService";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function ProfilePage() {
  const { data: user } = useGetUserQuery(undefined);

  const [updateUser, { isLoading }] = useUpdateUserMutation();

  const [preview, setPreview] = useState<string>();

  const [imageFile, setImageFile] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),

    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    if (!user) return;

    reset({
      name: user.name,
      email: user.email,
    });
  }, [user, reset]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setImageFile(file);

    setPreview(URL.createObjectURL(file));
  };

  const onSubmit = async (values: ProfileFormValues) => {
    if (!user) return;

    const formData = new FormData();

    formData.append("name", values.name);

    formData.append("email", values.email);

    formData.append("role", user.role);

    if (values.password) {
      formData.append("password", values.password);

      formData.append("password_confirmation", values.confirmPassword || "");
    }

    if (imageFile) {
      formData.append("profile_image", imageFile);
    }

    await updateUser({
      id: user.id,
      data: formData,
    }).unwrap();
  };

  const imageSrc =
    preview ||
    (user?.profile_image
      ? `${API_URL}/storage/${user.profile_image}`
      : "/avatar-placeholder.png");

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mx-auto max-w-7xl p-6">
      <div className="grid gap-6 lg:grid-cols-4">
        {/* SIDEBAR */}

        <div>
          <div className="rounded-3xl border bg-secondary p-6 shadow-sm">
            <div className="flex flex-col items-center">
              <div className="relative">
                <Image
                  src={imageSrc}
                  alt=""
                  width={140}
                  height={140}
                  className="
                    h-36
                    w-36
                    rounded-full
                    border-4
                    object-cover
                  "
                />

                <label
                  className="
                    absolute
                    bottom-2
                    right-2
                    flex
                    h-10
                    w-10
                    cursor-pointer
                    items-center
                    justify-center
                    rounded-full
                    bg-black
                    text-white
                  "
                >
                  <Camera size={18} />

                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                </label>
              </div>

              <h2 className="mt-4 text-lg font-semibold">{user?.name}</h2>

              <p className="text-sm text-muted-foreground">{user?.email}</p>
            </div>
          </div>
        </div>

        {/* CONTENT */}

        <div className="space-y-6 lg:col-span-3">
          <div className="rounded-3xl border bg-secondary p-6 shadow-sm">
            <h2 className="mb-6 text-lg font-semibold">Personal Information</h2>

            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label>Name</label>

                <input
                  {...register("name")}
                  className="
                    mt-2
                    h-12
                    w-full
                    rounded-xl
                    border
                    px-4
                  "
                />

                <p className="mt-1 text-sm text-red-500">
                  {errors.name?.message}
                </p>
              </div>

              <div>
                <label>Email</label>

                <input
                  {...register("email")}
                  className="
                    mt-2
                    h-12
                    w-full
                    rounded-xl
                    border
                    px-4
                  "
                />

                <p className="mt-1 text-sm text-red-500">
                  {errors.email?.message}
                </p>
              </div>
            </div>
          </div>

          {/* SECURITY */}

          <div className="rounded-3xl border bg-secondary p-6 shadow-sm">
            <div className="mb-5 flex items-center gap-2">
              <ShieldCheck size={20} />

              <h2 className="text-lg font-semibold">Security</h2>
            </div>

            <div className="grid gap-5">
              <div>
                <label>New Password</label>

                <input
                  type="password"
                  {...register("password")}
                  className="
                    mt-2
                    h-12
                    w-full
                    rounded-xl
                    border
                    px-4
                  "
                />
              </div>

              <div>
                <label>Confirm Password</label>

                <input
                  type="password"
                  {...register("confirmPassword")}
                  className="
                    mt-2
                    h-12
                    w-full
                    rounded-xl
                    border
                    px-4
                  "
                />

                <p className="mt-1 text-sm text-red-500">
                  {errors.confirmPassword?.message}
                </p>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="
              h-14
              w-full
              rounded-2xl
              bg-primary
              text-lg
              font-medium
              text-popover
            "
          >
            {isLoading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </form>
  );
}
