"use client";

import Image from "next/image";
import { UploadCloud } from "lucide-react";
import { useRef } from "react";

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

type Props = {
    title: string;

    preview?: string;

    onFileSelect: (
        file: File,
        preview: string
    ) => void;
};

export default function ImageUploader({
    title,
    preview,
    onFileSelect,
}: Props) {
    const inputRef =
        useRef<HTMLInputElement>(null);

    const handleFile = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const file = e.target.files?.[0];

        if (!file) return;

        const previewUrl =
            URL.createObjectURL(file);

        onFileSelect(file, previewUrl);
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>{title}</CardTitle>
            </CardHeader>

            <CardContent>
                <input
                    hidden
                    ref={inputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFile}
                />

                <div
                    onClick={() =>
                        inputRef.current?.click()
                    }
                    className="
            flex
            min-h-[220px]
            cursor-pointer
            flex-col
            items-center
            justify-center
            rounded-xl
            border-2
            border-dashed
            transition-all
            hover:bg-muted/50
          "
                >
                    {preview ? (
                        <div className="relative h-[220px] w-full overflow-hidden rounded-lg">
                            <Image
                                src={preview}
                                alt={title}
                                fill
                                className="object-cover"
                            />
                        </div>
                    ) : (
                        <>
                            <UploadCloud className="mb-4 h-10 w-10 text-muted-foreground" />

                            <p className="font-medium">
                                Upload {title}
                            </p>

                            <p className="mt-1 text-sm text-muted-foreground">
                                Click to browse
                            </p>
                        </>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}