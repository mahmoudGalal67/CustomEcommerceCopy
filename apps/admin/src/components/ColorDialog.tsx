"use client";

import { useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const colorSchema = z.object({
    name: z.string().min(2, "Color name is required"),
    hex: z
        .string()
        .regex(/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/, "Invalid HEX color"),
});

type ColorForm = z.infer<typeof colorSchema>;

const normalizeHex = (hex: string) => {
    if (!hex) return "#000000";

    if (hex.length === 4) {
        return (
            "#" +
            hex[1] + hex[1] +
            hex[2] + hex[2] +
            hex[3] + hex[3]
        );
    }

    return hex;
};


export default function ColorDialog({ open, setOpen, color, onSubmit, onUpdate }: any) {
    const form = useForm<ColorForm>({
        resolver: zodResolver(colorSchema),
        defaultValues: {
            name: "",
            hex: "#000000", // ✅ VALID DEFAULT
        },
    });

    const {
        reset,
        register,
        handleSubmit,
        formState: { errors },
    } = form;

    // 🔥 Fill / Reset form
    useEffect(() => {
        if (color) {
            reset({
                name: color.name,
                hex: normalizeHex(color.hex),
            });
        } else {
            reset({
                name: "",
                hex: "#000000",
            });
        }
    }, [color, reset]);


    const onSubmitHandler = (data: ColorForm) => {
        if (color) {
            onUpdate({ ...data, id: color.id });
        } else {
            onSubmit(data);
        }
        setOpen(false);
        reset();
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{color ? "Edit Color" : "Add Color"}</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmitHandler)} className="space-y-4">
                    {/* NAME */}
                    <div className="space-y-1">
                        <Input placeholder="Color name" {...register("name")} />
                        {errors.name && (
                            <p className="text-sm text-red-500">{errors.name.message}</p>
                        )}
                    </div>

                    {/* COLOR PICKER */}
                    <div className="flex items-center gap-4">
                        <Input type="color" {...register("hex")} />
                        <span className="text-sm text-muted-foreground">
                            {form.watch("hex")}
                        </span>
                    </div>

                    {errors.hex && (
                        <p className="text-sm text-red-500">{errors.hex.message}</p>
                    )}

                    <div className="flex justify-end gap-2 pt-4">
                        <Button type="button" variant="outline" onClick={() => setOpen(false)} className="cursor-pointer">
                            Cancel
                        </Button>
                        <Button type="submit" className="cursor-pointer">
                            {color ? "Update" : "Create"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
