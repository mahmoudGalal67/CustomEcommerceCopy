"use client";
import Marquee from "react-fast-marquee";
type LocalizedText = { en?: string; ar?: string };
type AnnouncementData = {
  message?: LocalizedText | string;
  background_color?: string;
  text_color?: string;
  speed?: number;
};
type AnnouncementMarqueeProps = { data: AnnouncementData; locale?: string };
export default function AnnouncementMarquee({
  data,
  locale = "en",
}: AnnouncementMarqueeProps) {
  const lang = locale === "ar" ? "ar" : "en";
  const getMessage = (value?: LocalizedText | string): string => {
    if (!value) return "";
    if (typeof value === "string") {
      return value;
    }
    console.log(value[lang]);
    return value[lang] ?? value.en ?? value.ar ?? "";
  };
  const message = getMessage(data.message);
  return (
    <div
      style={{ backgroundColor: data.background_color, color: data.text_color }}
      dir="ltr"
      className=" relative overflow-hidden rounded-b-lg border-b border-white/10 py-3 shadow-lg "
    >
      {" "}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent" />{" "}
      <Marquee
        speed={data.speed ?? 50}
        gradient={false}
        pauseOnHover
        direction={lang === "ar" ? "right" : "left"}
      >
        {" "}
        {Array.from({ length: 15 }).map((_, i) => (
          <div
            key={i}
            className=" mx-8 flex items-center gap-4 font-semibold tracking-wide "
          >
            {" "}
            <span>{message}</span>{" "}
          </div>
        ))}{" "}
      </Marquee>{" "}
    </div>
  );
}
