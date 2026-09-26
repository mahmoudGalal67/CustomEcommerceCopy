"use client";

import { useCallback, useState } from "react";
import Cropper from "react-easy-crop";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";

type Props = {
    open: boolean;
    image: string;
    onClose: () => void;
    onSave: (file: File) => void;
};

export const getCroppedImage = (
    imageSrc: string,
    pixelCrop: any
): Promise<File> => {
    return new Promise((resolve) => {
        const image = new Image();
        image.src = imageSrc;
        image.crossOrigin = "anonymous";

        image.onload = () => {
            const canvas = document.createElement("canvas");
            canvas.width = pixelCrop.width;
            canvas.height = pixelCrop.height;

            const ctx = canvas.getContext("2d")!;
            ctx.drawImage(
                image,
                pixelCrop.x,
                pixelCrop.y,
                pixelCrop.width,
                pixelCrop.height,
                0,
                0,
                pixelCrop.width,
                pixelCrop.height
            );

            canvas.toBlob((blob) => {
                const file = new File(
                    [blob!],
                    `avatar-${Date.now()}.jpg`,
                    { type: "image/jpeg" }
                );
                resolve(file);
            }, "image/jpeg", 0.9);
        };
    });
};



export function CropAvatarModal({
    open,
    image,
    onClose,
    onSave,
}: Props) {
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] =
        useState<any>(null);

    const onCropComplete = useCallback(
        (_: any, croppedPixels: any) => {
            setCroppedAreaPixels(croppedPixels);
        },
        []
    );

    const handleSave = async () => {
        const croppedFile = await getCroppedImage(
            image,
            croppedAreaPixels
        );

        onSave(croppedFile);
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-md">
                <DialogHeader className="font-semibold">
                    Crop your avatar
                </DialogHeader>

                <div className="relative w-full h-64 bg-black rounded-md overflow-hidden">
                    <Cropper
                        image={image}
                        crop={crop}
                        zoom={zoom}
                        aspect={1}
                        onCropChange={setCrop}
                        onZoomChange={setZoom}
                        onCropComplete={onCropComplete}
                    />
                </div>

                <div className="space-y-4 mt-4">
                    <Slider
                        min={1}
                        max={3}
                        step={0.1}
                        value={[zoom]}
                        onValueChange={(v) => setZoom(v[0])}
                    />

                    <div className="flex justify-end gap-2">
                        <Button variant="secondary" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button onClick={handleSave}>
                            Save
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
