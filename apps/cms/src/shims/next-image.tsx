import type { ImgHTMLAttributes } from "react";

type Props = Omit<ImgHTMLAttributes<HTMLImageElement>, "src"> & {
  src: string;
  fill?: boolean;
  priority?: boolean;
  quality?: number;
  placeholder?: string;
  blurDataURL?: string;
  unoptimized?: boolean;
};

export default function Image({
  src,
  alt,
  fill,
  priority,
  quality,
  placeholder,
  blurDataURL,
  unoptimized,
  style,
  loading,
  ...rest
}: Props) {
  return (
    <img
      src={src}
      alt={alt ?? ""}
      loading={priority ? "eager" : loading}
      style={
        fill
          ? { position: "absolute", inset: 0, width: "100%", height: "100%", ...style }
          : style
      }
      {...rest}
    />
  );
}
