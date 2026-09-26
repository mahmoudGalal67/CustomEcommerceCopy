"use client";
import React, { useState } from "react";
import { useProductForm } from "@/hooks/useProductForm";
import { createProductFormData } from "@/actions/productActions";
import VariantFields from "@/components/VariantFields";
import { useGetCategoriesQuery } from "@/services/categorySlice";
import { useAddProductMutation } from "@/services/ProductSlice";
import { X, UploadCloud, ImageIcon } from "lucide-react";
import SuccessModal from "@/components/SuccessModal";
import LoadingSpinner from "@/components/LoadingSpinner";
import ErrorPoup from "@/components/ErrorPoup";


export default function ProductForm() {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    errors,
    fields,
    append,
    remove,
    reset,
  } = useProductForm();

  const baseImages = watch("base_images");
  const [addProduct, { isLoading, isSuccess, reset: resetQuery }] = useAddProductMutation();
  const { data: categories } = useGetCategoriesQuery({ search: "" });
  const [err, setErr] = useState()
  const onSubmit = async (data: any) => {
    const convertedData = createProductFormData(data);
    try {
      const result = await addProduct(convertedData).unwrap();
      reset();
    } catch (error: any) {
      console.error("❌ Error:", error.response?.data || error);
      setErr(error)
    }
  };
  console.log(isSuccess && !isLoading);
  return (
    <div className="min-h-screen bg-background text-white p-8">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="max-w-3xl mx-auto space-y-8"
      >
        {/* Product Info */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-primary text-sm mb-2">Product Name</label>
            <input
              {...register("name")}
              className="w-full text-primary rounded-lg p-2 bg-muted border border-gray-700"
            />
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name.message}</p>
            )}
          </div>
          <div>
            <label className="block text-primary text-sm mb-2 text-right">اسم المنتج</label>
            <input
              {...register("nameAR")}
              className="w-full text-primary rounded-lg p-2 bg-muted border border-gray-700"
            />
            {errors.nameAR && (
              <p className="text-red-500 text-sm">{errors.nameAR.message}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div >
            <label className="block text-primary text-sm mb-2">Description</label>
            <textarea
              {...register("description")}
              className="w-full text-primary rounded-lg p-2 bg-muted border border-gray-700"
            />
            {errors.description && (
              <p className="text-red-500 text-sm">{errors.description.message}</p>
            )}
          </div>
          <div>
            <label className="block text-primary text-sm mb-2 text-right">الوصف</label>
            <textarea
              {...register("descriptionAR")}
              className="w-full text-primary rounded-lg p-2 bg-muted border border-gray-700"
            />
            {errors.descriptionAR && (
              <p className="text-red-500 text-sm">{errors.descriptionAR.message}</p>
            )}
          </div>
        </div>
<div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-primary text-sm mb-2">Base Price</label>
          <input
            type="number"
            {...register("base_price")}
            className="w-full text-primary rounded-lg p-2 bg-muted border border-gray-700"
          />
          {errors.base_price && (
            <p className="text-red-500 text-sm">{errors.base_price.message}</p>
          )}
        </div>
        <div>
          <label className="block text-primary text-sm mb-2">Stock </label>
          <input
            type="number"
            {...register("stock")}
            className="w-full text-primary rounded-lg p-2 bg-muted border border-gray-700"
          />
          {errors.stock && (
            <p className="text-red-500 text-sm">{errors.stock.message}</p>
          )}
        </div>
        </div>
        <div>
          <label className="block text-primary text-sm mb-2">Base Imegs</label>


          <div className="space-y-3">
            <label className="text-sm font-medium">Base Images</label>

            {/* Upload box */}
            <label
              htmlFor="base-images"
              className={`
      flex flex-col items-center justify-center gap-2
      border-2 border-dashed rounded-xl p-6
      cursor-pointer transition
      hover:border-primary hover:bg-primary/5
      ${errors.base_images ? "border-red-500" : "border-muted"}
    `}
            >
              <UploadCloud className="h-8 w-8 text-muted-foreground" />
              <p className="text-sm text-primary">
                Click or drag images here
              </p>
              <p className="text-xs text-primary">
                PNG, JPG, WEBP (max 2MB)
              </p>

              <input
                id="base-images"
                type="file"
                multiple
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const files = Array.from(e.target.files || []);
                  setValue("base_images", files, { shouldValidate: true });
                }}
              />
            </label>

            {/* Error */}
            {errors.base_images && (
              <p className="text-sm text-red-500">
                {errors.base_images.message}
              </p>
            )}

            {/* Preview grid */}
            {baseImages && baseImages?.length > 0 && (
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                {baseImages.map((file, index) => {
                  const preview = URL.createObjectURL(file);

                  return (
                    <div
                      key={index}
                      className="relative group aspect-square rounded-lg overflow-hidden border"
                    >
                      <img
                        src={preview}
                        alt="preview"
                        className="h-full w-full object-cover"
                      />

                      {/* Remove button */}
                      <button
                        type="button"
                        onClick={() => {
                          const newFiles = [...baseImages];
                          newFiles.splice(index, 1);
                          setValue("base_images", newFiles, {
                            shouldValidate: true,
                          });
                        }}
                        className="
                absolute top-1 right-1
                bg-black/70 text-white rounded-full p-1
                opacity-0 group-hover:opacity-100 transition
              "
                      >
                        <X size={14} />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>


        </div>
        <div>
          <label className="block text-primary text-sm mb-2">Category</label>
          <select
            {...register("category_id")}
            className="w-full text-primary rounded-lg p-2 bg-muted border border-gray-700"
          >
            <option value="">Select category</option>
            {categories?.map((cat: any) => (
              <option key={cat.id} value={cat.id}>
                {cat.translations[0].name}
              </option>
            ))}
          </select>
          {errors.category_id && (
            <p className="text-red-500 text-sm">{errors.category_id.message}</p>
          )}
        </div>

        {/* Variants */}
        <div>
          <h2 className="text-lg font-bold mb-4">Variants</h2>
          {fields.map((field, index) => (
            <VariantFields
              key={field.id}
              index={index}
              field={field}
              register={register}
              watch={watch}
              setValue={setValue}
              remove={remove}
              errors={errors}
              totalFields={fields.length}
            />
          ))}

          <button
            type="button"
            className="bg-muted-foreground text-black px-3 py-2 rounded-lg text-sm"
            onClick={() =>
              append({
                id: crypto.randomUUID(),
                price: "",
                stock: "",
                color_id: "",
                size_id: "",
                images_all: [],
              })
            }
          >
            ➕ Add Variant
          </button>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isLoading}
          className="bg-accent-foreground hover:bg-blue-600 px-4 py-2 rounded-lg text-popover cursor-pointer"
        >
          {isLoading ? "Loading ..." : "Submit Product"}
        </button>
      </form>
      {/* ✅ Success */}
      <SuccessModal
        open={isSuccess && !isLoading}
        title="Done"
        description="Product processed successfully"
        onClose={() => resetQuery()}
      />

      {/* 🔄 Loading */}
      <LoadingSpinner
        open={isLoading}
        onClose={() => { }}
      />
      <ErrorPoup error={err} />

    </div>
  );
}
