import React, { useEffect, useMemo, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { UploadCloud, Trash2 } from "lucide-react";
import { useGetSettingsQuery, useUpdateSettingsMutation } from "@/services/Settings";

interface Social {
  name: string;
  link: string;
  logo?: File | string | null;
}

interface Settings {
  site_name: string;
  logo?: File | string | null;
  favicon?: File | string | null;
  colors: {
    primary?: string;
    secondary?: string;
  };
  socials: Social[];
}

// ✅ Optimized Image Upload Component
const ImageUpload = React.memo(({ value, onChange }: any) => {
  const previewUrl = useMemo(() => {
    if (value instanceof File) {
      return URL.createObjectURL(value);
    }
    if (typeof value === "string") {
      return `http://localhost:8000/storage/${value}`;
    }
    return null;
  }, [value]);

  useEffect(() => {
    return () => {
      if (value instanceof File && previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl, value]);

  return (
    <label className="border-2 w-[200px] h-[200px] border-dashed rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-muted/50 transition relative overflow-hidden">
      {previewUrl ? (
        <img
          src={previewUrl}
          className="absolute inset-0 w-full h-full object-cover opacity-80"
        />
      ) : (
        <>
          <UploadCloud className="w-8 h-8 mb-2" />
          <span className="text-sm">Click or drag image</span>
        </>
      )}

      <input
        type="file"
        className="hidden"
        onChange={(e) => onChange(e.target.files?.[0])}
      />

      {previewUrl && (
        <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
          Change
        </div>
      )}
    </label>
  );
});

// ✅ Optimized Social Item
const SocialItem = React.memo(({ social, index, onChange, onDelete }: any) => {
  return (
    <div className="border p-4 rounded-2xl space-y-3 relative group hover:shadow-md transition">
      <button
        type="button"
        onClick={() => onDelete(index)}
        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition hover:scale-110"
      >
        <Trash2 size={14} />
      </button>

      <Input
        placeholder="Name"
        value={social.name}
        onChange={(e) => onChange(index, "name", e.target.value)}
      />

      <Input
        placeholder="Link"
        value={social.link}
        onChange={(e) => onChange(index, "link", e.target.value)}
      />

      <ImageUpload
        value={social.logo}
        onChange={(file: File) => onChange(index, "logo", file)}
      />
    </div>
  );
});

export default function SettingsPage() {
  const { data } = useGetSettingsQuery({});
  const [updateSettings, { isLoading }] = useUpdateSettingsMutation();

  const [settings, setSettings] = useState<Settings>({
    site_name: "",
    logo: null,
    favicon: null,
    colors: {},
    socials: [],
  });

  useEffect(() => {
    if (data) {
      setSettings({
        ...data,
        colors: data.colors || {},
        socials: data.socials || [],
      });
    }
  }, [data]);

  const handleChange = useCallback((field: keyof Settings, value: any) => {
    setSettings((prev) => ({ ...prev, [field]: value }));
  }, []);

  const handleColorChange = useCallback((key: string, value: string) => {
    setSettings((prev) => ({
      ...prev,
      colors: { ...prev.colors, [key]: value },
    }));
  }, []);

  const handleSocialChange = useCallback((index: number, field: string, value: any) => {
    setSettings((prev) => {
      const updated = [...prev.socials];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, socials: updated };
    });
  }, []);

  const addSocial = useCallback(() => {
    setSettings((prev) => ({
      ...prev,
      socials: [...prev.socials, { name: "", link: "", logo: null }],
    }));
  }, []);

  const removeSocial = useCallback((index: number) => {
    setSettings((prev) => ({
      ...prev,
      socials: prev.socials.filter((_, i) => i !== index),
    }));
  }, []);

  const handleSubmit = async () => {
    const formData = new FormData();

    formData.append("site_name", settings.site_name);

    if (settings.logo instanceof File) {
      formData.append("logo", settings.logo);
    }

    if (settings.favicon instanceof File) {
      formData.append("favicon", settings.favicon);
    }

    formData.append("colors", JSON.stringify(settings.colors));

    settings.socials.forEach((social, index) => {
      formData.append(`socials[${index}][name]`, social.name);
      formData.append(`socials[${index}][link]`, social.link);

      if (social.logo instanceof File) {
        formData.append(`socials[${index}][logo]`, social.logo);
      }
    });

    await updateSettings(formData);
  };

  return (
    <div className="p-6 grid gap-6">
      <Card>
        <CardContent className="p-4 space-y-4">
          <Label>Site Name</Label>
          <Input
            value={settings.site_name}
            onChange={(e) => handleChange("site_name", e.target.value)}
          />

          <Label>Logo</Label>
          <ImageUpload
            value={settings.logo}
            onChange={(file: File) => handleChange("logo", file)}
          />

          <Label>Favicon</Label>
          <ImageUpload
            value={settings.favicon}
            onChange={(file: File) => handleChange("favicon", file)}
          />

          <div className="flex items-center gap-4">
            <Label className="w-32">Primary Color</Label>
            <input
              type="color"
              value={settings.colors.primary || "#000000"}
              onChange={(e) => handleColorChange("primary", e.target.value)}
              className="w-10 h-10 border rounded cursor-pointer"
            />
          </div>

          <div className="flex items-center gap-4">
            <Label className="w-32">Secondary Color</Label>
            <input
              type="color"
              value={settings.colors.secondary || "#ffffff"}
              onChange={(e) => handleColorChange("secondary", e.target.value)}
              className="w-10 h-10 border rounded cursor-pointer"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4 space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold">Social Links</h2>
            <Button onClick={addSocial}>Add</Button>
          </div>

          {settings.socials.map((social, index) => (
            <SocialItem
              key={index}
              social={social}
              index={index}
              onChange={handleSocialChange}
              onDelete={removeSocial}
            />
          ))}
        </CardContent>
      </Card>

      <Button onClick={handleSubmit} disabled={isLoading} className="w-fit">
        {isLoading ? "Saving..." : "Save Settings"}
      </Button>
    </div>
  );
}
