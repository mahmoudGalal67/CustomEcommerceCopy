"use client";
import {
  useShowAnnouncementBarQuery,
  useUpdateAnnouncementBarMutation,
} from "@/services/AnnouncementBarAoi";
import { useEffect, useState } from "react";
type LocalizedText = { en: string; ar: string };
type FormData = {
  enabled: boolean;
  message: LocalizedText;
  background_color: string;
};
const defaultFormData: FormData = {
  enabled: false,
  message: {
    en: "Special Offer: Get 20% off on all products! Limited time only.",
    ar: "عرض خاص: احصل على خصم 20٪ على جميع المنتجات! لفترة محدودة فقط.",
  },
  background_color: "#3b82f6",
};
export default function AnnouncementBarSettings() {
  const { data } = useShowAnnouncementBarQuery(undefined);
  const [updateBar, { isLoading: isSaving }] =
    useUpdateAnnouncementBarMutation();
  const [formData, setFormData] = useState<FormData>(defaultFormData);
  useEffect(() => {
    if (!data) return;
    setFormData({
      enabled: data.enabled ?? false,
      message:
        typeof data.message === "string"
          ? { en: data.message, ar: "" }
          : { en: data.message?.en ?? "", ar: data.message?.ar ?? "" },
      background_color: data.background_color ?? "#3b82f6",
    });
  }, [data]);
  const handleToggle = async () => {
    const newEnabled = !formData.enabled;
    setFormData((prev) => ({ ...prev, enabled: newEnabled }));
    try {
      const updated = await updateBar({
        data: { ...formData, enabled: newEnabled },
      }).unwrap();
      setFormData({
        enabled: updated.enabled ?? false,
        message:
          typeof updated.message === "string"
            ? { en: updated.message, ar: "" }
            : { en: updated.message?.en ?? "", ar: updated.message?.ar ?? "" },
        background_color: updated.background_color ?? "#3b82f6",
      });
    } catch (error) {
      console.error(error);
      setFormData((prev) => ({ ...prev, enabled: !newEnabled }));
    }
  };
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await updateBar({ data: formData }).unwrap();
      alert("Announcement updated successfully");
    } catch (error) {
      console.error(error);
      alert("Failed to update announcement");
    }
  };
  return (
    <div className="mx-auto max-w-2xl p-2">
      {" "}
      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        {" "}
        {/* Header */}{" "}
        <div className="flex items-center justify-between border-b border-slate-100 px-2 py-5">
          {" "}
          <div>
            {" "}
            <h2 className="text-xl font-semibold text-slate-900">
              {" "}
              Announcement Bar{" "}
            </h2>{" "}
            <p className="mt-1 px-1 text-sm text-slate-500">
              {" "}
              Show a promotional banner at the top of your website.{" "}
            </p>{" "}
          </div>{" "}
          {/* Switch */}{" "}
          <button
            type="button"
            onClick={handleToggle}
            disabled={isSaving}
            className={`relative h-8 w-14 cursor-pointer rounded-full transition-all duration-300 ${formData.enabled ? "bg-emerald-500" : "bg-slate-300"} ${isSaving ? "cursor-not-allowed opacity-70" : ""}`}
          >
            {" "}
            <span
              className={`absolute top-1 h-6 w-6 rounded-full bg-white shadow-md transition-all duration-300 ${formData.enabled ? "left-7" : "left-1"}`}
            />{" "}
          </button>{" "}
        </div>{" "}
        {/* Content */}{" "}
        <div className="p-6">
          {" "}
          {!formData.enabled ? (
            <div className="rounded-2xl border border-dashed border-slate-300 py-10 text-center text-slate-500">
              {" "}
              Enable the announcement bar to configure it.{" "}
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {" "}
              {/* Announcement Text */}{" "}
              <div>
                {" "}
                <label className="mb-3 block text-sm font-medium text-slate-700">
                  {" "}
                  Announcement Text{" "}
                </label>{" "}
                <div className="space-y-3">
                  {" "}
                  {/* English */}{" "}
                  <div>
                    {" "}
                    <label className="mb-1.5 block text-xs font-medium text-slate-500">
                      {" "}
                      English{" "}
                    </label>{" "}
                    <input
                      type="text"
                      dir="ltr"
                      value={formData.message.en}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          message: { ...prev.message, en: e.target.value },
                        }))
                      }
                      placeholder="🔥 Summer Sale - Get 30% Off"
                      className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                    />{" "}
                  </div>{" "}
                  {/* Arabic */}{" "}
                  <div>
                    {" "}
                    <label className="mb-1.5 block text-xs font-medium text-slate-500">
                      {" "}
                      العربية{" "}
                    </label>{" "}
                    <input
                      type="text"
                      dir="rtl"
                      value={formData.message.ar}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          message: { ...prev.message, ar: e.target.value },
                        }))
                      }
                      placeholder="🔥 خصم الصيف - احصل على خصم 30٪"
                      className="w-full rounded-xl border border-slate-300 px-4 py-3 text-right outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                    />{" "}
                  </div>{" "}
                </div>{" "}
              </div>{" "}
              {/* Background Color */}{" "}
              <div>
                {" "}
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  {" "}
                  Background Color{" "}
                </label>{" "}
                <div className="flex items-center gap-4">
                  {" "}
                  <input
                    type="color"
                    value={formData.background_color}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        background_color: e.target.value,
                      }))
                    }
                    className="h-12 w-20 cursor-pointer rounded-lg border border-slate-300"
                  />{" "}
                  <div className="rounded-lg bg-slate-100 px-3 py-2 font-mono text-sm text-slate-700">
                    {" "}
                    {formData.background_color}{" "}
                  </div>{" "}
                </div>{" "}
              </div>{" "}
              {/* Preview */}{" "}
              <div>
                {" "}
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  {" "}
                  Preview{" "}
                </label>{" "}
                <div className="space-y-3">
                  {" "}
                  {/* English Preview */}{" "}
                  <div
                    dir="ltr"
                    style={{ backgroundColor: formData.background_color }}
                    className="rounded-xl px-4 py-3 text-center font-medium text-white shadow-sm"
                  >
                    {" "}
                    {formData.message.en ||
                      "Your English announcement will appear here"}{" "}
                  </div>{" "}
                  {/* Arabic Preview */}{" "}
                  <div
                    dir="rtl"
                    style={{ backgroundColor: formData.background_color }}
                    className="rounded-xl px-4 py-3 text-center font-medium text-white shadow-sm"
                  >
                    {" "}
                    {formData.message.ar || "سيظهر الإعلان العربي هنا"}{" "}
                  </div>{" "}
                </div>{" "}
              </div>{" "}
              {/* Submit */}{" "}
              <button
                type="submit"
                disabled={isSaving}
                className="w-full cursor-pointer rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-3 font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {" "}
                {isSaving ? "Saving..." : "Save Announcement"}{" "}
              </button>{" "}
            </form>
          )}{" "}
        </div>{" "}
      </div>{" "}
    </div>
  );
}
