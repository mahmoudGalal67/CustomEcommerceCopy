"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash, SignalZeroIcon, Footprints } from "lucide-react";
import ColorDialog from "@/components/ColorDialog";
import SuccessModal from "@/components/SuccessModal";
import LoadingSpinner from "@/components/LoadingSpinner";
import AlertModal from "@/components/AlertModal";
import Loading from "@/components/loading";
import LaravelErrorPopup from "@/components/ErrorPoup";
import { useAddSizeMutation, useDeleteSizeMutation, useGetSizesQuery, useUpdateSizeMutation } from "@/services/SizeSlice";
import SizeDialog from "@/components/SizeDialog";



interface Size {
    id: number;
    name: string;
    code: string;
}

export default function SizesPage() {
    const { data: sizes, isLoading, error } = useGetSizesQuery();
    const [deleteSize, { isLoading: deleteLoading, error: deleteError, isSuccess: deleteSuccess, reset: deleteReset }] = useDeleteSizeMutation();
    const [updateSize, { isLoading: updateLoading, error: updateError, isSuccess: updateSuccess, reset: updateReset }] = useUpdateSizeMutation();
    const [addSize, { isLoading: addLoading, error: addError, isSuccess: addSuccess, reset: addReset }] = useAddSizeMutation();
    const [open, setOpen] = useState(false);
    const [selectedSize, setSelectedSize] = useState<any | null>(null);
    const [showAlert, setShowAlert] = useState(false);


    // ➕ ADD
    const handleAdd = () => {
        setSelectedSize(null); // 👈 empty form
        setOpen(true);
    };

    // ✏️ EDIT
    const handleEdit = (size: any) => {
        setSelectedSize(size); // 👈 fill form
        setOpen(true);
    };

    const deleteSizeHandler = async (id: number) => {
        await deleteSize(id);
        deleteReset();
    };

    const updateSizeHandler = async (size: any) => {
        await updateSize(size);
        updateReset();
    };

    const addSizeHandler = async (size: any) => {
        await addSize(size);
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
                <h1 className="text-2xl font-bold"><Footprints />Sizes</h1>
                <Button onClick={handleAdd} className="cursor-pointer">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Size
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {sizes?.map((size: Size) => (
                    <div
                        key={size.id}
                        className="flex items-center justify-between p-4 rounded-lg border bg-background"
                    >
                        <div className="flex items-center gap-3">
                            <div
                                className="w-6 h-6 p-5 border-2 border-gray rounded-full border flex items-center justify-center"
                            >
                                {size.code}
                            </div>
                            <span className="font-medium">{size?.name}</span>
                        </div>

                        <div className="flex gap-2">
                            <Button
                                className="cursor-pointer"
                                size="icon"
                                variant="outline"
                                onClick={() => handleEdit(size)}
                            >
                                <Pencil className="w-4 h-4" />
                            </Button>
                            <Button className="cursor-pointer" size="icon" variant="destructive" onClick={() => {
                                setShowAlert(true)
                                setSelectedSize(size)
                            }}>
                                <Trash className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                ))}
            </div>

            <SizeDialog
                open={open}
                setOpen={setOpen}
                size={selectedSize}
                onSubmit={addSizeHandler}
                onUpdate={updateSizeHandler}
            />

            {/* ✅ Success */}
            <SuccessModal
                open={addSuccess || updateSuccess || deleteSuccess}
                title="Done"
                description="Size processed successfully"
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
                title={`Delete ${selectedSize?.name} size?`}
                description="Selected Size will be permanently removed."
                onCancel={() => setShowAlert(false)}
                onConfirm={() => {
                    deleteSizeHandler(selectedSize?.id);
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
