import axios from "axios";
import { ProductForm } from "@/schemas/productSchema";
import { categoryType } from "@/types/types";

export const createProductFormData = (data: ProductForm, isEdit = false) => {
  const formData = new FormData();
  if (isEdit) {
    formData.append("_method", "PUT"); // ✅ Laravel magic
  }
  formData.append("translations[0][locale]", 'en');
  formData.append("translations[0][name]", data.name);
  formData.append("translations[0][description]", data.description);
  formData.append("translations[1][locale]", 'ar');
  formData.append("translations[1][name]", data.nameAR);
  formData.append("translations[1][description]", data.descriptionAR);
  formData.append("base_price", data.base_price || "0");
  formData.append("stock", data.stock || "0");
  formData.append("category_id", data.category_id);
  data.base_images?.forEach((file) => {
    formData.append("base_images[]", file);
  });
  data.deleted_base_images?.forEach((img: string) => {
    formData.append("deleted_base_images[]", img);
  });
  data.existing_base_images?.forEach((img: string) => {
    formData.append("existing_base_images[]", img);
  });
  data.variants?.forEach((variant: any, i: number) => {
    if (variant.id) {
      formData.append(`variants[${i}][id]`, String(variant.id));
    }
    formData.append(`variants[${i}][price]`, variant.price);
    formData.append(
      `variants[${i}][sku]`,
      variant.sku ?? ""
    );
    formData.append(`variants[${i}][stock]`, variant.stock);
    formData.append(`variants[${i}][color_id]`, variant.color_id);
    formData.append(`variants[${i}][size_id]`, variant.size_id);


    variant.images_all?.forEach((img: any, j: number) => {
      // Existing image
      if (img.type === "existing") {
        formData.append(`variants[${i}][images][${j}][type]`, img.type);
        formData.append(`variants[${i}][images][${j}][file_path]`, img.file_path);
        formData.append(`variants[${i}][images][${j}][variant_id]`, img.variant_id);
        formData.append(`variants[${i}][images][${j}][is_main]`, img.is_main);
        formData.append(`variants[${i}][images][${j}][sort_order]`, String(img.sort_order));
      }
      // New uploaded file
      if (img.type === "new") {
        formData.append(`variants[${i}][images][${j}][type]`, img.type);
        formData.append(
          `variants[${i}][images][${j}][sort_order]`,
          String(img.sort_order ?? j)
        );
        formData.append(`variants[${i}][images][${j}][file]`, img.file); // the File object
      }
    });
    variant.deleted_images?.forEach((img: any, j: number) => {
      formData.append(`variants[${i}][deleted_images][${j}]`, img);
    });

  });
  return formData;
};
export const createCategoryFormData = (data: categoryType) => {
  const formData = new FormData();
  formData.append("name", data.name);
  formData.append("description", data.description || "");
  formData.append("slug", data.slug || "0");
  formData.append("icon", data.icon || "0");

  return formData;
};
