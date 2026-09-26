"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { productSchema, ProductForm } from "../schemas/productSchema";

export const useProductForm = () => {
  const {
    register,
    handleSubmit,
    watch,
    control,
    setValue,
    reset,
    formState: { errors },
  } = useForm<ProductForm>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      nameAR: "",
      description: "",
      base_price: "",
      base_images: [],
      category_id: "",
      existing_base_images: [],
      deleted_base_images: [],
      variants: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "variants",
  });

  return {
    register,
    handleSubmit,
    watch,
    control,
    setValue,
    errors,
    fields,
    append,
    remove,
    reset,
  };
};
