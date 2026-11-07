"use client";

import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Input } from "@/components/ui/input";

import { Label } from "@/components/ui/label";

import { Switch } from "@/components/ui/switch";

import { Button } from "@/components/ui/button";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { defaultSettings } from "./settings.types";

import { settingsSchema, SettingsFormValues } from "./settings.schema";

import PaymentMethods from "./PaymentMethods";
import ImageUploader from "./ImageUploader";
import {
  useGetFeaturesQuery,
  useUpdateFeaturesMutation,
} from "@/services/FeaturesApi";

export default function SettingsForm() {
  const [serverErrors, setServerErrors] = useState<Record<string, string[]>>(
    {},
  );
  const [serverMessage, setServerMessage] = useState("");
  const [hasServerError, setHasServerError] = useState(false);
  const { data, isLoading } = useGetFeaturesQuery(undefined);

  const [updateSettings, updateState] = useUpdateFeaturesMutation();

  const [backgroundFile, setBackgroundFile] = useState<File | null>(null);

  const [logoFile, setLogoFile] = useState<File | null>(null);

  const [faviconFile, setFaviconFile] = useState<File | null>(null);

  const [backgroundPreview, setBackgroundPreview] = useState("");

  const [logoPreview, setLogoPreview] = useState("");

  const [faviconPreview, setFaviconPreview] = useState("");

  const {
    register,
    reset,
    watch,
    setValue,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsSchema),
    defaultValues: defaultSettings,
  });

  useEffect(() => {
    if (!data) return;

    reset({
      ...defaultSettings,
      ...data,
      currency: data.currency,
      footer_font_size: Number(data.footer_font_size),
    });

    if (data.background_image) {
      setBackgroundPreview(
        process.env.NEXT_PUBLIC_API_URL + data.background_image,
      );
    }

    if (data.store_logo) {
      setLogoPreview(process.env.NEXT_PUBLIC_API_URL + data.store_logo);
    }

    if (data.favicon) {
      setFaviconPreview(process.env.NEXT_PUBLIC_API_URL + data.favicon);
    }
  }, [data, reset]);

  if (isLoading) {
    return <div className="p-10">Loading Features...</div>;
  }

  const languages = watch("languages");

  const addLanguage = (language: string) => {
    if (languages.includes(language)) return;

    setValue("languages", [...languages, language], {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });
  };

  const removeLanguage = (language: string) => {
    setValue(
      "languages",
      languages.filter((item) => item !== language),
      { shouldValidate: true, shouldDirty: true, shouldTouch: true },
    );
  };

  const onSubmit = async (values: SettingsFormValues) => {
    setServerErrors({});
    setServerMessage("");
    try {
      const formData = new FormData();

      const imageFields = ["background_image", "store_logo", "favicon"];

      Object.entries(values).forEach(([key, value]) => {
        // Image URLs are not uploaded files.
        if (imageFields.includes(key)) return;

        if (key === "payment_methods") {
          formData.append(key, JSON.stringify(value));
        } else if (Array.isArray(value)) {
          value.forEach((item) => {
            formData.append(`${key}[]`, String(item));
          });
        } else if (value !== undefined && value !== null) {
          formData.append(key, String(value));
        }
      });

      if (backgroundFile) {
        formData.append("background_image", backgroundFile);
      }

      if (logoFile) {
        formData.append("store_logo", logoFile);
      }

      if (faviconFile) {
        formData.append("favicon", faviconFile);
      }
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
  function FieldError({ message }: { message?: string }) {
    if (!message) return null;

    return <p className="mt-1.5 text-sm text-destructive">{message}</p>;
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit, (errors) => {
        console.log("ZOD / FORM ERRORS:", errors);
      })}
      className="space-y-6"
    >
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

      <div className="grid gap-6 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>General Settings</CardTitle>
          </CardHeader>

          <CardContent className="space-y-6">
            <div>
              <Label className="mb-2">Website Name</Label>

              <Input {...register("website_name")} />
              <FieldError message={errors.website_name?.message} />
            </div>

            <div className="flex items-center justify-between">
              <Label className="mb-2">Show contact page</Label>

              <Switch
                checked={watch("show_contact_page")}
                onCheckedChange={(value) =>
                  setValue("show_contact_page", value)
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <Label className="mb-2">Show about page</Label>

              <Switch
                checked={watch("show_about_page")}
                onCheckedChange={(value) => setValue("show_about_page", value)}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label className="mb-2">Show terms page</Label>

              <Switch
                checked={watch("show_terms_page")}
                onCheckedChange={(value) => setValue("show_terms_page", value)}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label className="mb-2">Show privacy page</Label>

              <Switch
                checked={watch("show_privacy_page")}
                onCheckedChange={(value) =>
                  setValue("show_privacy_page", value)
                }
              />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
          </CardHeader>

          <CardContent>
            <div className="flex items-center justify-between">
              <Label className="mb-2">Email Notifications</Label>

              <Switch
                checked={watch("email_notifications")}
                onCheckedChange={(value) =>
                  setValue("email_notifications", value)
                }
              />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Localization</CardTitle>
          </CardHeader>

          <CardContent className="space-y-5">
            <div>
              <Label className="mb-2">Languages</Label>

              <div className="mt-3 flex flex-wrap gap-2">
                {["en", "ar", "fr", "de"].map((lang) => {
                  const selected = languages?.includes(lang);

                  return (
                    <Button
                      key={lang}
                      type="button"
                      variant={selected ? "default" : "outline"}
                      onClick={() =>
                        selected ? removeLanguage(lang) : addLanguage(lang)
                      }
                    >
                      {lang.toUpperCase()}
                    </Button>
                  );
                })}
              </div>
              <FieldError message={errors.languages?.message} />
            </div>

            <div>
              <Label className="mb-2 block">Currency</Label>

              <Controller
                name="currency"
                control={control}
                render={({ field }) => (
                  <div className="relative">
                    <select
                      {...field}
                      value={field.value ?? ""}
                      className="
            h-10 w-full appearance-none rounded-md
            border border-input bg-background
            px-3 py-2 pr-10 text-sm text-foreground
            shadow-sm outline-none
            transition-colors
            hover:bg-accent/30
            focus-visible:border-ring
            focus-visible:ring-2
            focus-visible:ring-ring/50
            disabled:cursor-not-allowed disabled:opacity-50
          "
                    >
                      <option value="" disabled>
                        Select currency
                      </option>
                      <option value="USD">USD — US Dollar</option>
                      <option value="EUR">EUR — Euro</option>
                      <option value="EGP">EGP — Egyptian Pound</option>
                      <option value="SAR">SAR — Saudi Riyal</option>
                    </select>

                    <svg
                      className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="m6 9 6 6 6-6" />
                    </svg>
                  </div>
                )}
              />

              <FieldError message={errors.currency?.message} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Homepage Settings</CardTitle>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <Label className="mb-2">Show Featured Products</Label>

              <Switch
                checked={watch("show_featured_products")}
                onCheckedChange={(value) =>
                  setValue("show_featured_products", value)
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <Label className="mb-2">Show Best Sellers</Label>

              <Switch
                checked={watch("show_best_sellers")}
                onCheckedChange={(value) =>
                  setValue("show_best_sellers", value)
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <Label className="mb-2">Show New Arrivals</Label>

              <Switch
                checked={watch("show_new_arrivals")}
                onCheckedChange={(value) =>
                  setValue("show_new_arrivals", value)
                }
              />
            </div>
          </CardContent>
        </Card>
        <div className="grid gap-6 xl:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Appearance</CardTitle>
            </CardHeader>

            <CardContent className="space-y-5">
              <div>
                <Label className="mb-2">Footer Font Size</Label>

                <Input
                  type="number"
                  min={10}
                  max={40}
                  {...register("footer_font_size", {
                    valueAsNumber: true,
                  })}
                />
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          <ImageUploader
            title="Background Image"
            preview={backgroundPreview}
            onFileSelect={(file, preview) => {
              setBackgroundFile(file);
              setBackgroundPreview(preview);
            }}
          />

          <ImageUploader
            title="Store Logo"
            preview={logoPreview}
            onFileSelect={(file, preview) => {
              setLogoFile(file);
              setLogoPreview(preview);
            }}
          />

          <ImageUploader
            title="Favicon"
            preview={faviconPreview}
            onFileSelect={(file, preview) => {
              setFaviconFile(file);
              setFaviconPreview(preview);
            }}
          />
        </div>
        <PaymentMethods control={control} register={register} />
      </div>
      <div className="sticky bottom-5 z-50 flex justify-end">
        <Button
          size="lg"
          type="submit"
          className="cursor-pointer"
          disabled={updateState.isLoading}
        >
          {updateState.isLoading ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </form>
  );
}
