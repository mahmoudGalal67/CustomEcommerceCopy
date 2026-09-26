"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash } from "lucide-react";
import ColorDialog from "@/components/ColorDialog";
import { useAddColorMutation, useDeleteColorMutation, useGetColorsQuery, useUpdateColorMutation } from "@/services/ColorSlice";
import SuccessModal from "@/components/SuccessModal";
import LoadingSpinner from "@/components/LoadingSpinner";
import AlertModal from "@/components/AlertModal";
import Loading from "@/components/loading";
import LaravelErrorPopup from "@/components/ErrorPoup";



interface Color {
    id: number;
    name: string;
    hex: string;
}

export default function ColorsPage() {
    const { data: colors, isLoading, error } = useGetColorsQuery();
    const [deleteColor, { isLoading: deleteLoading, error: deleteError, isSuccess: deleteSuccess, reset: deleteReset }] = useDeleteColorMutation();
    const [updateColor, { isLoading: updateLoading, error: updateError, isSuccess: updateSuccess, reset: updateReset }] = useUpdateColorMutation();
    const [addColor, { isLoading: addLoading, error: addError, isSuccess: addSuccess, reset: addReset }] = useAddColorMutation();
    const [open, setOpen] = useState(false);
    const [selectedColor, setSelectedColor] = useState<any | null>(null);
    const [showAlert, setShowAlert] = useState(false);


    // ➕ ADD
    const handleAdd = () => {
        setSelectedColor(null); // 👈 empty form
        setOpen(true);
    };

    // ✏️ EDIT
    const handleEdit = (color: any) => {
        setSelectedColor(color); // 👈 fill form
        setOpen(true);
    };

    const deleteColorHandler = async (id: number) => {
        await deleteColor(id);
        deleteReset();
    };

    const updateColorHandler = async (color: any) => {
        await updateColor(color);
        updateReset();
    };

    const addColorHandler = async (color: any) => {
        await addColor(color);
        addReset();
    };

    const resetHandler = () => {
        deleteReset();
        updateReset();
        addReset();
    };

    if (isLoading) {
        return <Loading fullWidth={true} />
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center py-4 px-2">
                <h1 className="text-2xl font-bold">🎨 Colors</h1>
                <Button onClick={handleAdd} className="cursor-pointer">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Color
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {colors?.map((color: Color) => (
                    <div
                        key={color.id}
                        className="flex items-center justify-between p-4 rounded-lg border bg-background"
                    >
                        <div className="flex items-center gap-3">
                            <div
                                className="w-6 h-6 rounded-full border"
                                style={{ backgroundColor: color.hex }}
                            />
                            <span className="font-medium">{color?.name}</span>
                        </div>

                        <div className="flex gap-2">
                            <Button
                                className="cursor-pointer"
                                size="icon"
                                variant="outline"
                                onClick={() => handleEdit(color)}
                            >
                                <Pencil className="w-4 h-4" />
                            </Button>
                            <Button className="cursor-pointer" size="icon" variant="destructive" onClick={() => {
                                setShowAlert(true)
                                setSelectedColor(color)
                            }}>
                                <Trash className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                ))}
            </div>

            <ColorDialog
                open={open}
                setOpen={setOpen}
                color={selectedColor}
                onSubmit={addColorHandler}
                onUpdate={updateColorHandler}
            />

            {/* ✅ Success */}
            <SuccessModal
                open={addSuccess || updateSuccess || deleteSuccess}
                title="Done"
                description="Order processed successfully"
                onClose={() => resetHandler()}
            />

            {/* 🔄 Loading */}
            <LoadingSpinner
                open={addLoading || updateLoading || deleteLoading}
                onClose={() => resetHandler()}
            />

            {/* ⚠️ Alert */}
            <AlertModal
                open={showAlert}
                title={`Delete ${selectedColor?.name} color?`}
                description="Selected users will be permanently removed."
                onCancel={() => setShowAlert(false)}
                onConfirm={() => {
                    deleteColorHandler(selectedColor?.id);
                    setShowAlert(false);
                }}
                confirmText="Delete"
                cancelText="Cancel"
            />
            <LaravelErrorPopup
                error={deleteError || updateError || addError || error}
            />
        </div>
    );
}
