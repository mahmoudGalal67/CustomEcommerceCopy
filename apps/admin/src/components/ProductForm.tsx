"use client";
import React, { useEffect, useState } from "react";
import { useProductForm } from "@/hooks/useProductForm";
import { createProductFormData } from "@/actions/productActions";
import VariantFields from "@/components/VariantFields";
import { useGetCategoriesQuery } from "@/services/categorySlice";
import {
  useAddProductMutation,
  useGetProductByIdQuery,
  useUpdateProductMutation,
} from "@/services/ProductSlice";
import { X, UploadCloud } from "lucide-react";
import SuccessModal from "@/components/SuccessModal";
import LoadingSpinner from "@/components/LoadingSpinner";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import Loading from "@/components/loading";
import ErrorPoup from "@/components/ErrorPoup";

export default function ProductForm() {
  const [showSuccess, setShowSuccess] = useState(false);
  const [err, setErr] = useState();

  const { id } = useParams();
  const isEdit = Boolean(id);
  const [isDirty, setIsDirty] = useState(false);

  const { data: product, isLoading: isProductLoading } = useGetProductByIdQuery(
    id as string,
    {
      skip: !isEdit,
    },
  );

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
  const [
    addProduct,
    { isLoading: isAddLoading, isSuccess: isAddSuccess, reset: resetQuery },
  ] = useAddProductMutation();
  const [
    updateProduct,
    { isLoading: isUpdateLoading, isSuccess: isUpdateSuccess },
  ] = useUpdateProductMutation();
  const { data: categories } = useGetCategoriesQuery({ search: "" });

  const isLoading = isAddLoading || isUpdateLoading;
  const isSuccess = isAddSuccess || isUpdateSuccess;

  const onSubmit = async (data: any) => {
    const convertedData = createProductFormData(data, isEdit);
    console.log(data);
    try {
      if (isEdit) {
        await updateProduct({ id, data: convertedData }).unwrap();
        // router.push("/products");
      } else {
        await addProduct(convertedData).unwrap();
        resetQuery();
      }
      setShowSuccess(true);
    } catch (error: any) {
      console.error("❌ Error:", error.response?.data || error);
      setErr(error);
    }
  };

  console.log(product);

  useEffect(() => {
    if (!product) return;

    /**
     * ⚠️ IMPORTANT RULE
     * - File inputs must ALWAYS start empty
     * - Existing images are shown as previews ONLY
     */
    reset({
      name: product.translations[0]?.name,
      nameAR: product.translations[1]?.name,
      description: product.translations[0]?.description,
      descriptionAR: product.translations[1]?.description,
      base_price: product.base_price,
      category_id: String(product.categories?.[0]?.id) ?? "",
      base_images: [], // 👈 NEVER put URLs here
      existing_base_images: product.base_images,
      deleted_base_images: [],
      variants: product.variants?.map((v: any) => ({
        id: v.id,
        price: v.price,
        stock: String(v.stock),
        color_id: String(v.color_id),
        size_id: String(v.size_id),
        images_all: v.images.map((img: any) => ({
          ...img,
          type: "existing",
          dndId: `existing-${img.id}`,
        })),
        deleted_images: [],
      })),
    });
    setIsDirty(false);
  }, [product, categories, reset]);

  if (isProductLoading) return <Loading />;

  return (
    <div className="min-h-screen bg-background text-white p-8">
      <form
        onSubmit={handleSubmit(
          (data) => {
            console.log("VALID", data);
            onSubmit(data);
          },
          (errors) => {
            console.log("INVALID", errors);
          },
        )}
        className="max-w-3xl mx-auto space-y-8"
      >
        {/* Product Info */}
        <h1 className="text-2xl font-bold">
          {isEdit ? `Edit  ${product?.name} Product` : "Add Product"}
        </h1>
        <div>
          <label className="block text-primary text-sm mb-2">
            Product Name
          </label>
          <input
            {...register("name")}
            className="w-full rounded-lg p-2 bg-muted text-primary border border-gray-700"
            onChange={(e) => {
              register("name").onChange(e);
              setIsDirty(true);
            }}
          />
          {errors.name && (
            <p className="text-red-500 text-sm">{errors.name.message}</p>
          )}
        </div>
        <div>
          <label className="block text-primary text-sm mb-2">اسم المنتج </label>
          <input
            {...register("nameAR")}
            className="w-full rounded-lg p-2 bg-muted text-primary border border-gray-700"
            onChange={(e) => {
              register("nameAR").onChange(e);
              setIsDirty(true);
            }}
          />
          {errors.nameAR && (
            <p className="text-red-500 text-sm">{errors.nameAR.message}</p>
          )}
        </div>

        <div>
          <label className="block text-primary text-sm mb-2">Description</label>
          <textarea
            {...register("description")}
            className="w-full rounded-lg p-2 bg-muted text-primary border border-gray-700"
            onChange={(e) => {
              register("description").onChange(e);
              setIsDirty(true);
            }}
          />
          {errors.description && (
            <p className="text-red-500 text-sm">{errors.description.message}</p>
          )}
        </div>
        <div>
          <label className="block text-primary text-sm mb-2">وصف المنتج</label>
          <textarea
            {...register("descriptionAR")}
            className="w-full rounded-lg p-2 bg-muted text-primary border border-gray-700"
            onChange={(e) => {
              register("descriptionAR").onChange(e);
              setIsDirty(true);
            }}
          />
          {errors.descriptionAR && (
            <p className="text-red-500 text-sm">
              {errors.descriptionAR.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-primary text-sm mb-2">Base Price</label>
          <input
            type="number"
            {...register("base_price")}
            className="w-full rounded-lg p-2 bg-muted text-primary border border-gray-700"
            onChange={(e) => {
              register("base_price").onChange(e);
              setIsDirty(true);
            }}
          />
          {errors.base_price && (
            <p className="text-red-500 text-sm">{errors.base_price.message}</p>
          )}
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
              <p className="text-sm text-muted-foreground">
                Click or drag images here
              </p>
              <p className="text-xs text-muted-foreground">
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
                  setValue("base_images", [...(baseImages ?? []), ...files], {
                    shouldValidate: true,
                  });
                  setIsDirty(true);
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
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
              {/* EXISTING IMAGES */}
              {watch("existing_base_images")?.map((img: any, index: number) => (
                <div
                  key={`old-${index}`}
                  className="relative group aspect-square rounded-lg overflow-hidden border"
                >
                  <img
                    src={`${process.env.NEXT_PUBLIC_API_URL}/storage/${img}`}
                    className="h-full w-full object-cover"
                  />

                  {/* REMOVE OLD IMAGE */}
                  <button
                    type="button"
                    onClick={() => {
                      // mark as deleted
                      setValue("deleted_base_images", [
                        ...(watch("deleted_base_images") ?? []),
                        img,
                      ]);

                      // remove from preview list
                      const updated = [
                        ...(watch("existing_base_images") ?? []),
                      ];
                      updated.splice(index, 1);
                      setValue("existing_base_images", updated);
                      setIsDirty(true);
                    }}
                    className="
                absolute top-1 right-1
                bg-black/70 text-white rounded-full p-1
                opacity-0 group-hover:opacity-100 transition cursor-pointer
              "
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
              {baseImages?.map((file: any, index: number) => {
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
                        setIsDirty(true);
                      }}
                      className="
                absolute top-1 right-1
                bg-black/70 text-white rounded-full p-1
                opacity-0 group-hover:opacity-100 transition cursor-pointer
              "
                    >
                      <X size={14} />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        <div>
          <label className="block text-primary text-sm mb-2">Category</label>
          <select
            className="w-full rounded-lg p-2 bg-muted text-primary border border-gray-700"
            {...register("category_id")}
            onChange={(e) => {
              register("category_id").onChange(e);
              setIsDirty(true);
            }}
          >
            <option value="">Select category</option>
            {categories?.map((cat: any) => (
              <option key={cat.id} value={String(cat.id)}>
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
              setIsDirty={setIsDirty}
            />
          ))}

          <button
            type="button"
            className="bg-muted-foreground text-primary px-3 py-2 rounded-lg text-sm"
            onClick={() => {
              append({
                price: "",
                stock: "",
                color_id: "",
                size_id: "",
                images_all: [],
              });
              setIsDirty(true);
            }}
          >
            ➕ Add Variant
          </button>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={!isDirty || isLoading}
          className="bg-accent-foreground text-popover hover:bg-blue-600 px-4 py-2 rounded-lg  cursor-pointer"
        >
          {isLoading
            ? "Saving..."
            : isEdit
              ? "Update Product"
              : "Create Product"}
        </button>
      </form>
      {/* ✅ Success */}
      <SuccessModal
        open={showSuccess}
        title="Done"
        description="Product processed successfully"
        onClose={() => resetQuery()}
      />

      {/* 🔄 Loading */}
      <LoadingSpinner open={isLoading} onClose={() => {}} />
      <ErrorPoup error={err} />
    </div>
  );
}
