"use client";

import { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Plus } from "lucide-react";
import {
  useGetSettingsQuery,
  useUpdateSettingsMutation,
} from "@/services/SettingsApi";
import { Textarea } from "@/components/ui/textarea";

type NullableString = string | null;

type Social = {
  name: NullableString;
  link: NullableString;
  logo: File | string | null;
};

type SettingsForm = {
  site_name: NullableString;
  site_description: NullableString;
  site_location: NullableString;
  site_contact_phone: NullableString;
  site_contact_email: NullableString;
  logo: File | string | null;
  colors: {
    primary: NullableString;
    secondary: NullableString;
  };
  socials: Social[] | null;
};

export default function SettingsPage() {
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const { data: settings, isLoading } = useGetSettingsQuery(undefined);
  const [updateSettings, { isLoading: updateLoading }] =
    useUpdateSettingsMutation();

  const [serverErrors, setServerErrors] = useState<Record<string, string[]>>(
    {},
  );
  const [serverMessage, setServerMessage] = useState("");
  const [hasServerError, setHasServerError] = useState(false);

  const getSocialImageUrl = (value: string) => {
    if (!value) return "";

    // New uploaded/local image
    if (
      value.startsWith("blob:") ||
      value.startsWith("data:image") ||
      value.startsWith("http://") ||
      value.startsWith("https://")
    ) {
      return value;
    }

    // Existing image from Laravel storage
    return `${process.env.NEXT_PUBLIC_API_URL}/storage/${value}`;
  };

  const {
    register,
    control,
    setValue,
    watch,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<SettingsForm>({
    defaultValues: {
      site_name: "",
      logo: "",
      site_location: "",
      site_description: "",
      site_contact_phone: "",
      site_contact_email: "",
      colors: {
        primary: "#000000",
        secondary: "#ffffff",
      },
      socials: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "socials",
  });

  /* ==============================
       Load settings from backend
    =============================== */
  useEffect(() => {
    if (!settings) return;

    reset({
      site_name: settings.site_name ?? "",
      site_description: settings.site_description ?? "",
      site_location: settings.site_location ?? "",
      site_contact_phone: settings.site_contact_phone ?? "",
      site_contact_email: settings.site_contact_email ?? "",
      logo: settings.logo ?? "",
      colors: {
        primary: settings.colors?.primary ?? "#000000",
        secondary: settings.colors?.secondary ?? "#ffffff",
      },
      socials: (settings.socials ?? []).map((social: Social) => ({
        name: social.name ?? "",
        link: social.link ?? "",
        logo: social.logo ?? "",
      })),
    });
  }, [settings, reset]);

  const onSubmit = async (data: SettingsForm) => {
    try {
      setServerMessage("");
      setServerErrors({});

      const formData = new FormData();

      formData.append("site_name", data.site_name ?? "");
      formData.append("site_location", data.site_location ?? "");
      formData.append("site_description", data.site_description ?? "");
      formData.append("site_contact_phone", data.site_contact_phone ?? "");
      formData.append("site_contact_email", data.site_contact_email ?? "");

      if (data.logo instanceof File) {
        formData.append("logo", data.logo);
      }

      formData.append("colors[primary]", data.colors.primary ?? "");
      formData.append("colors[secondary]", data.colors.secondary ?? "");

      (data.socials ?? []).forEach((social, index) => {
        formData.append(`socials[${index}][name]`, social.name ?? "");
        formData.append(`socials[${index}][link]`, social.link ?? "");

        if (social.logo instanceof File) {
          formData.append(`socials[${index}][logo]`, social.logo);
        }
      });

      await updateSettings(formData).unwrap();
      setServerErrors({});
      setHasServerError(false);
      setServerMessage("Settings updated successfully.");
      setTimeout(() => {
        setServerMessage("");
      }, 4000);
    } catch (error: any) {
      const response = error?.data;

      setHasServerError(true);

      if (response?.errors) {
        setServerErrors(response.errors);
      }

      setServerMessage(
        response?.message || "Something went wrong. Please try again.",
      );
    }
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {serverMessage && (
        <div
          className={`rounded-lg border px-4 py-3 text-sm ${
            hasServerError
              ? "border-destructive/30 bg-destructive/10 text-destructive"
              : "border-green-500/30 bg-green-500/10 text-green-700 dark:text-green-400"
          }`}
        >
          {serverMessage}
        </div>
      )}
      <Card>
        <CardHeader>
          <CardTitle>Website Settings</CardTitle>
        </CardHeader>

        <CardContent className="space-y-8">
          {/* Site Name */}
          <div className="space-y-2">
            <Label>Site Name</Label>
            <Input {...register("site_name", {})} />
            {errors.site_name && (
              <p className="text-sm text-red-500">{errors.site_name.message}</p>
            )}
          </div>
          {/* Site Description */}
          <div className="space-y-2">
            <Label>Site Description</Label>
            <Textarea
              rows={4}
              placeholder="Enter site description"
              className="resize-none"
              {...register("site_description", {})}
            />
            {errors.site_description && (
              <p className="text-sm text-red-500">
                {errors.site_description.message}
              </p>
            )}
          </div>
          {/* Site Contact Phone */}
          <div className="space-y-2">
            <Label>Site Contact Phone</Label>
            <Input {...register("site_contact_phone")} />
            {errors.site_contact_phone && (
              <p className="text-sm text-red-500">
                {errors.site_contact_phone.message}
              </p>
            )}
          </div>
          {/* Site Contact Email */}
          <div className="space-y-2">
            <Label>Site Contact Email</Label>
            <Input type="email" {...register("site_contact_email")} />
            {errors.site_contact_email && (
              <p className="text-sm text-red-500">
                {errors.site_contact_email.message}
              </p>
            )}
          </div>
          {/* Site location */}
          <div className="space-y-2">
            <Label>Site Location</Label>
            <Textarea
              rows={4}
              placeholder="Enter site Location"
              className="resize-none"
              {...register("site_location")}
            />

            {errors.site_location && (
              <p className="text-sm text-red-500">
                {errors.site_location.message}
              </p>
            )}
          </div>

          <Separator />

          {/* Logo */}
          <div className="space-y-3">
            <Label>Logo</Label>

            {logoPreview ? (
              <img
                src={logoPreview}
                className="h-16 rounded border object-contain"
                alt="logo preview"
              />
            ) : settings?.logo ? (
              <img
                src={`${process.env.NEXT_PUBLIC_API_URL}/storage/${settings.logo}`}
                className="h-16 rounded border object-contain"
                alt="logo"
              />
            ) : (
              <img
                src="/logo.png"
                className="h-16 rounded border object-contain"
                alt="default logo"
              />
            )}

            <Label
              htmlFor="logo"
              className="flex h-32 cursor-pointer items-center justify-center rounded-lg border-2 border-dashed text-muted-foreground hover:bg-muted"
            >
              Click to upload logo
            </Label>

            <Input
              id="logo"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];

                if (!file) return;

                setValue("logo", file, {
                  shouldDirty: true,
                  shouldValidate: true,
                });

                setLogoPreview(URL.createObjectURL(file));
              }}
            />
          </div>

          <Separator />

          {/* Colors */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Primary Color</Label>
              <Input
                type="color"
                className="h-12 cursor-pointer"
                {...register("colors.primary", { required: true })}
              />
            </div>

            <div>
              <Label>Secondary Color</Label>
              <Input
                type="color"
                className="h-12 cursor-pointer"
                {...register("colors.secondary", { required: true })}
              />
            </div>
          </div>

          <Separator />

          {/* Socials */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-lg">Social Links</Label>
              <Button
                type="button"
                onClick={() => append({ name: "", link: "", logo: "" })}
              >
                Add Social <Plus />
              </Button>
            </div>
            {fields.map((field, index) => {
              const value = watch(`socials.${index}.logo`);

              const preview =
                value instanceof File
                  ? URL.createObjectURL(value)
                  : typeof value === "string" && value
                    ? getSocialImageUrl(value)
                    : null;

              return (
                <div
                  key={field.id}
                  className="grid grid-cols-6 items-end gap-3"
                >
                  <div>
                    <Input
                      placeholder="Name"
                      {...register(`socials.${index}.name`, {
                        required: "Required",
                      })}
                    />

                    {errors.socials?.[index]?.name && (
                      <p className="text-xs text-red-500">Required</p>
                    )}
                  </div>

                  <div>
                    <Input
                      placeholder="Link"
                      {...register(`socials.${index}.link`, {
                        required: "Required",
                      })}
                    />

                    {errors.socials?.[index]?.link && (
                      <p className="text-xs text-red-500">Required</p>
                    )}
                  </div>

                  {/* Social icon */}
                  {preview ? (
                    <img
                      src={preview}
                      className="h-10 w-10 rounded border object-contain"
                      alt="icon"
                    />
                  ) : (
                    <img
                      src="/logo.png"
                      className="h-10 w-10 rounded border object-contain"
                      alt="icon"
                    />
                  )}

                  {/* Upload */}
                  <Label
                    htmlFor={`social-${index}`}
                    className="
                    flex cursor-pointer
                    items-center justify-center
                    rounded-md border border-dashed
                    px-3 py-2 text-xs
                    hover:bg-muted
                "
                  >
                    Upload Icon
                  </Label>

                  <Input
                    id={`social-${index}`}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];

                      if (!file) return;

                      setValue(`socials.${index}.logo`, file, {
                        shouldDirty: true,
                        shouldValidate: true,
                      });
                    }}
                  />

                  <Button
                    type="button"
                    variant="destructive"
                    onClick={() => remove(index)}
                  >
                    Remove
                  </Button>
                </div>
              );
            })}
          </div>

          <Separator />

          <Button type="submit" className="w-full cursor-pointer">
            {updateLoading ? "Updating..." : " Save Settings"}
          </Button>
        </CardContent>
      </Card>
    </form>
  );
}
