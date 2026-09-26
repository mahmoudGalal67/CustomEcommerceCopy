"use client";

import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAddCategoryMutation } from "@/services/categorySlice";
import { createCategoryFormData } from "@/actions/productActions";

// ✅ Schema definition
export const categorySchema = z.object({
  name: z.string().nonempty({ message: "Name is required!" }),
  slug: z.string().nonempty({ message: "Slug is required!" }),
  description: z.string().optional(),
  icon: z
    .instanceof(File)
    .refine((file) => file.size <= 5 * 1024 * 1024, "Max file size is 5MB")
    .refine(
      (file) => ["image/jpeg", "image/png", "image/webp"].includes(file.type),
      "Only .jpg, .png, .webp formats are supported."
    )
    .optional()
    .or(z.literal("")),
});

export type CategoryFormValues = z.infer<typeof categorySchema>;

export const useAddCategoryForm = () => {
  const [preview, setPreview] = useState<string | null>(null);
  const [addCategory, { isLoading }] = useAddCategoryMutation();

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: { name: "", slug: "", description: "", icon: undefined },
  });

  const handleFileChange = (file?: File) => {
    if (file) {
      form.setValue("icon", file);
      const url = URL.createObjectURL(file);
      setPreview(url);
    }
  };

  const onSubmit = async (values: CategoryFormValues) => {
    try {
      const formData = createCategoryFormData(values);
      const result = await addCategory(formData).unwrap();

      form.reset();
      setPreview(null);
    } catch (error) {
      console.error("❌ Error creating category:", error);
    }
  };

  return {
    form,
    preview,
    setPreview,
    handleFileChange,
    onSubmit,
    isLoading,
  };
};
