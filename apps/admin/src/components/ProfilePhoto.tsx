"use client";

import { useRef, useState } from "react";
import { Camera, Loader2, User } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { CropAvatarModal } from "./CropAvatarModal";
import { Progress } from "@/components/ui/progress";
import { axiosBaseApi } from "@/utilis/axios";
import Image from "next/image";

export default function UserProfileAvatar({ user }: { user: any }) {
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [preview, setPreview] = useState<string | null>(user?.profile_image);
  const [cropImage, setCropImage] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    setCropImage(url);
  };

  const handleUpload = async (file: File) => {
    setProgress(0);
    setCropImage(null);
    setIsLoading(true);

    const formData = new FormData();
    formData.append("profile_image", file);

    const res = await axiosBaseApi.post(`/users/profile/${user.id}`, formData, {
      onUploadProgress: (e) => {
        if (!e.total) return;
        const percent = Math.round((e.loaded * 100) / e.total);
        setProgress(percent);
      },
    });

    setIsLoading(false);
    setPreview(res?.data?.user?.profile_image);
  };
  return (
    <div className="flex flex-col items-center gap-3 w-28">
      <div className="relative group">
        {preview ? (
          <Avatar className="w-24 h-24 shadow-lg ring-4 ring-background">
            <Image
              src={`${process.env.NEXT_PUBLIC_API_URL}/storage/${preview}`}
              width={100}
              height={100}
              objectFit="cover"
              alt=""
            />
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
        ) : (
          <Avatar className="w-24 h-24 shadow-lg ring-4 ring-background flex items-center justify-center">
            <User className="w-12 h-12" />
          </Avatar>
        )}

        <Button
          size="icon"
          variant="secondary"
          onClick={() => fileInputRef.current?.click()}
          className="absolute bottom-2 right-2 rounded-full cursor-pointer"
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Camera className="w-4 h-4" />
          )}
        </Button>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          hidden
          onChange={handleImageChange}
        />
      </div>

      {isLoading && <Progress value={progress} className="w-full" />}

      {cropImage && (
        <CropAvatarModal
          open={!!cropImage}
          image={cropImage}
          onClose={() => setCropImage(null)}
          onSave={handleUpload}
        />
      )}
    </div>
  );
}
