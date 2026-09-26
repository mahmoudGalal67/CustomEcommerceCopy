import React from "react";
import { Checkbox } from "./ui/checkbox";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";

type Variant = {
  id: string;
  color: string[];
  size: string[];
  price: string;
  stock: string;
  images: string[];
};

// @ts-ignore
function ProductVariant({ form, colors, sizes }) {
  const addVariant = () => {
    const current = form.getValues("variants") || [];
    form.setValue("variants", [
      ...current,
      {
        id: crypto.randomUUID(),
        color: [],
        size: [],
        price: "",
        stock: "",
        images: [],
      },
    ]);
  };

  const deleteVariant = (id: string) => {
    const current = form.getValues("variants") || [];
    form.setValue(
      "variants",
      current.filter((v: Variant) => v.id !== id),
    );
  };

  const variants = form.watch("variants") || [];

  return (
    <div>
      {variants.map((variant: Variant, i: number) => (
        <div key={variant.id} className="border p-4 rounded mb-4">
          {/* Sizes */}
          <FormField
            control={form.control}
            name={`variants.${i}.size`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sizes</FormLabel>
                <FormControl>
                  <div className="grid grid-cols-3 gap-4 my-2">
                    {sizes.map((size: string) => (
                      <div className="flex items-center gap-2" key={size}>
                        <Checkbox
                          checked={field.value?.includes(size)}
                          onCheckedChange={(checked) => {
                            const newValue = checked
                              ? [...(field.value || []), size]
                              : (field.value || []).filter(
                                  (s: string) => s !== size,
                                );
                            field.onChange(newValue);
                          }}
                        />
                        <label className="text-xs">{size}</label>
                      </div>
                    ))}
                  </div>
                </FormControl>
                <FormDescription>
                  Select sizes for this variant.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Colors */}
          <FormField
            control={form.control}
            name={`variants.${i}.color`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Colors</FormLabel>
                <FormControl>
                  <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-4 my-2">
                      {colors.map((color: string) => (
                        <div className="flex items-center gap-2" key={color}>
                          <Checkbox
                            checked={field.value?.includes(color)}
                            onCheckedChange={(checked) => {
                              const newValue = checked
                                ? [...(field.value || []), color]
                                : (field.value || []).filter(
                                    (c: string) => c !== color,
                                  );
                              field.onChange(newValue);
                            }}
                          />
                          <label className="text-xs flex items-center gap-2">
                            <div
                              className="w-2 h-2 rounded-full"
                              style={{ backgroundColor: color }}
                            />
                            {color}
                          </label>
                        </div>
                      ))}
                    </div>

                    {/* Upload images for selected colors */}
                    {field.value && field.value.length > 0 && (
                      <div className="mt-8 space-y-4">
                        <p className="text-sm font-medium">
                          Upload images for selected colors:
                        </p>
                        {field.value.map((color: string) => (
                          <div className="flex items-center gap-2" key={color}>
                            <div
                              className="w-2 h-2 rounded-full"
                              style={{ backgroundColor: color }}
                            />
                            <span className="text-sm min-w-15">{color}</span>
                            <FormField
                              control={form.control}
                              name={`variants.${i}.images`}
                              render={({ field: imgField }) => (
                                <Input
                                  type="file"
                                  accept="image/*"
                                  onChange={(e) => {
                                    const files = e.target.files
                                      ? Array.from(e.target.files).map(
                                          (file) => file.name,
                                        )
                                      : [];
                                    imgField.onChange([
                                      ...(imgField.value || []),
                                      ...files,
                                    ]);
                                  }}
                                />
                              )}
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Price */}
          <FormField
            control={form.control}
            name={`variants.${i}.price`}
            render={({ field }) => (
              <FormItem className="my-5">
                <FormLabel>Price</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Stock */}
          <FormField
            control={form.control}
            name={`variants.${i}.stock`}
            render={({ field }) => (
              <FormItem className="my-5">
                <FormLabel>Stock</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Delete button */}
          {variants.length > 1 && (
            <button
              className="block my-5 bg-white rounded-2xl w-max text-sm cursor-pointer px-3 py-2 text-black"
              type="button"
              onClick={() => deleteVariant(variant.id)}
            >
              ❌ Delete Variant {i + 1}
            </button>
          )}
        </div>
      ))}

      {/* Add variant */}
      <div
        className="block mt-5 bg-white rounded-2xl w-max text-sm cursor-pointer px-3 py-2 text-black"
        onClick={addVariant}
      >
        Add Variant
      </div>
    </div>
  );
}

export default ProductVariant;
