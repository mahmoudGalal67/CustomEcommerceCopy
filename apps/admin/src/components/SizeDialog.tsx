"use client";

import { useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const sizeSchema = z.object({
    name: z.string().min(2, "Size name is required"),
    code: z
        .string()
        .min(2, "Size code is required"),
});

type SizeForm = z.infer<typeof sizeSchema>;



export default function SizeDialog({ open, setOpen, size, onSubmit, onUpdate }: any) {
    const form = useForm<SizeForm>({
        resolver: zodResolver(sizeSchema),
        defaultValues: {
            name: "",
            code: "",
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
        if (size) {
            reset({
                name: size.name,
                code: size.code,
            });
        } else {
            reset({
                name: "",
                code: "",
            });
        }
    }, [size, reset]);


    const onSubmitHandler = (data: SizeForm) => {
        if (size) {
            onUpdate({ ...data, id: size.id });
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
                    <DialogTitle>{size ? "Edit Size" : "Add Size"}</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmitHandler)} className="space-y-4">
                    {/* NAME */}
                    <div className="space-y-1">
                        <Input placeholder="Size name" {...register("name")} />
                        {errors.name && (
                            <p className="text-sm text-red-500">{errors.name.message}</p>
                        )}
                    </div>

                    {/* CODE */}
                    <div className="space-y-1">
                        <Input placeholder="Size code" {...register("code")} />
                        {errors.code && (
                            <p className="text-sm text-red-500">{errors.code.message}</p>
                        )}
                    </div>
                    <div className="flex justify-end gap-2 pt-4">
                        <Button type="button" variant="outline" onClick={() => setOpen(false)} className="cursor-pointer">
                            Cancel
                        </Button>
                        <Button type="submit" className="cursor-pointer">
                            {size ? "Update" : "Create"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
