import React from "react";

type SafeImageProps = {
  src: string | null | undefined;
  fallbackSrc?: string;
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
  fit?: "cover" | "contain";
};

// Use a plain <img> to avoid any optimization-domain issues under Turbopack and ensure
// consistent rendering across devices; fallback to a visible placeholder on error.
export default function SafeImage({ src, fallbackSrc, alt, className, fit = "cover", ...rest }: SafeImageProps) {
  const placeholder = fallbackSrc || "https://via.placeholder.com/800x600/eeeeee/555555?text=Car+Image";
  const initial = (src && typeof src === "string" ? src : placeholder) || placeholder;
  const [currentSrc, setCurrentSrc] = React.useState(initial);

  return (
    <img
      src={currentSrc}
      alt={alt}
      className={className}
      loading={rest.priority ? "eager" : "lazy"}
      style={{ width: "100%", height: "100%", objectFit: fit, display: "block", backgroundColor: "#f5f5f5" }}
      onError={() => {
        if (currentSrc !== placeholder) {
          setCurrentSrc(placeholder);
        }
      }}
    />
  );
}
