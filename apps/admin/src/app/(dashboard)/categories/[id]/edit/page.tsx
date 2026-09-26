"use client";

import { SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import Image from "next/image";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import React, { useState, useEffect } from "react";
import {
  useGetCategoryByIdQuery,
  useUpdateCategoryMutation,
} from "@/services/categorySlice";

// Zod schema
const categorySchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  nameAR: z.string().min(2, "Name must be at least 2 characters"),
  slug: z.string().min(2, "Slug must be at least 2 characters"),
  description: z.string().optional(),
  icon: z.any().optional(),
});

type CategoryFormValues = z.infer<typeof categorySchema>;

const CategoryDetailsPage = ({
  params,
}: {
  params: Promise<{ id: number }>;
}) => {
  const { id } = React.use(params);
  const {
    data: category,
    isLoading,
    isError,
    refetch,
  } = useGetCategoryByIdQuery(Number(id));
  const [updateCategory] = useUpdateCategoryMutation();

  const [preview, setPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: "",
      nameAR: "",
      slug: "",
      description: "",
      icon: undefined,
    },
  });

  // Populate form once category is fetched
  useEffect(() => {
    if (!category) return;
    form.reset({
      name: category.translations[0].name,
      nameAR: category.translations[1].name,
      slug: category.slug,
      description: category.description || "",
      icon: undefined,
    });
    setPreview(
      category.icon
        ? `${process.env.NEXT_PUBLIC_API_URL}/storage/${category.icon}`
        : null,
    );
  }, [category]);

  const handleFileChange = (file?: File) => {
    if (!file) return;
    form.setValue("icon", file);
    setPreview(URL.createObjectURL(file));
  };

  const onSubmit = async (data: CategoryFormValues) => {
    setIsSubmitting(true);
    setSuccessMessage("");
    setErrorMessage("");

    try {
      const formData = new FormData();
      formData.append("translations[0][locale]", "en");
      formData.append("translations[0][name]", data.name);
      formData.append("translations[1][locale]", "ar");
      formData.append("translations[1][name]", data.nameAR);
      formData.append("slug", data.slug);
      formData.append("description", data.description || "");
      if (data.icon) {
        formData.append("icon", data.icon);
      }

      await updateCategory({ id: Number(id), formData }).unwrap();

      setSuccessMessage("Category updated successfully!");
      refetch(); // Refresh category data
    } catch (err: any) {
      console.error(err);
      setErrorMessage("Failed to update category.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <p>Loading category...</p>;
  if (isError) return <p>Error loading category.</p>;

  return (
    <div className="p-4">
      <ScrollArea className="h-screen">
        <h1 className="mb-4">Edit {category.translations[0].name} Category</h1>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="nameAR"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>الاسم</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Slug */}
            <FormField
              control={form.control}
              name="slug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Slug</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Icon Upload */}
            <FormField
              control={form.control}
              name="icon"
              render={() => (
                <FormItem>
                  <FormLabel>Category Icon</FormLabel>
                  <FormControl>
                    <div className="space-y-3">
                      <Input
                        type="file"
                        accept="image/*"
                        id="icon-upload"
                        className="hidden"
                        onChange={(e) => handleFileChange(e.target.files?.[0])}
                      />
                      <label
                        htmlFor="icon-upload"
                        className="flex items-center justify-center gap-2 p-2 border rounded-md cursor-pointer hover:bg-accent w-fit"
                      >
                        <Upload className="w-4 h-4" />
                        <span>Choose Icon</span>
                      </label>
                      {preview && (
                        <div className="mt-2">
                          <Image
                            src={preview}
                            alt="Preview"
                            width={60}
                            height={60}
                            className="rounded-md object-cover border"
                          />
                        </div>
                      )}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Success/Error Messages */}
            {successMessage && (
              <p className="text-green-600">{successMessage}</p>
            )}
            {errorMessage && <p className="text-red-600">{errorMessage}</p>}

            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Updating..." : "Update Category"}
            </Button>
          </form>
        </Form>
      </ScrollArea>
    </div>
  );
};

export default CategoryDetailsPage;
