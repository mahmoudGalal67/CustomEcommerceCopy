"use client";

import {
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { Upload } from "lucide-react";
import Image from "next/image";
import { ScrollArea } from "./ui/scroll-area";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { axiosBaseApi } from "@/utilis/axios";
import { useState } from "react";

export type Category = {
  id: string;
  name: string;
  description: string;
  icon?: string;
  slug: string;
};

// Zod validation schema
const categorySchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  nameAR: z.string().min(2, "Name must be at least 2 characters"),
  slug: z.string().min(2, "Slug must be at least 2 characters"),
  description: z.string().optional(),
  icon: z.any().optional(),
});

type CategoryFormValues = z.infer<typeof categorySchema>;

const AddCategory = ({ setAddcategorySheet }: { setAddcategorySheet: (open: boolean) => void }) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: "",
      slug: "",
      description: "",
      icon: undefined,
    },
  });

  // Handle file selection
  const handleFileChange = (file?: File) => {
    if (!file) return;
    form.setValue("icon", file);
    const url = URL.createObjectURL(file);
    setPreview(url);
  };

  // Handle form submission
  const onSubmit = async (data: CategoryFormValues) => {
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("translations[0][locale]", 'en');
      formData.append("translations[0][name]", data.name);
      formData.append("translations[1][locale]", 'ar');
      formData.append("translations[1][name]", data.nameAR);
      formData.append("slug", data.slug);
      formData.append("description", data.description || "");
      if (data.icon) {
        formData.append("icon", data.icon);
      }

      const response = await axiosBaseApi.post("/categories", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setAddcategorySheet(false);

      console.log("Category added:", response.data);

      // Reset form & preview
      form.reset();
      setPreview(null);
      alert("Category added successfully!");
    } catch (error: any) {
      console.error(error);
      alert("Failed to add category. Check console for details.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SheetContent >
      <ScrollArea className="h-screen">
        <SheetHeader>
          <SheetTitle className="mb-4">Add Category</SheetTitle>
          <SheetDescription asChild>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
                encType="multipart/form-data"
              >
                {/* Name */}
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Category name" />
                      </FormControl>
                      <FormDescription>Enter category name.</FormDescription>
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
                        <Input {...field} placeholder="Category name" />
                      </FormControl>
                      <FormDescription>ادخل اسم التصنيف.</FormDescription>
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
                        <Input {...field} placeholder="category-slug" />
                      </FormControl>
                      <FormDescription>Enter category slug.</FormDescription>
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
                        <Textarea
                          {...field}
                          placeholder="Describe the category..."
                        />
                      </FormControl>
                      <FormDescription>
                        A short description of the category.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* File Upload */}
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
                            onChange={(e) =>
                              handleFileChange(e.target.files?.[0])
                            }
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
                      <FormDescription>
                        Upload category icon (JPG, PNG, WEBP up to 5MB)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Loading..." : "Submit"}
                </Button>
              </form>
            </Form>
          </SheetDescription>
        </SheetHeader>
      </ScrollArea>
    </SheetContent>
  );
};

export default AddCategory;
