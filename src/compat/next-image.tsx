import * as React from "react";

// Minimal drop-in replacement for `next/image` so portfolio components that
// `import Image from "next/image"` keep working on TanStack Start / Vite.
// Renders a plain <img>; Next-only props are accepted and ignored.
export interface ImageProps
  extends Omit<
    React.ImgHTMLAttributes<HTMLImageElement>,
    "width" | "height" | "src"
  > {
  src: string | { src: string };
  alt: string;
  width?: number | string;
  height?: number | string;
  fill?: boolean;
  priority?: boolean;
  quality?: number;
  placeholder?: string;
  blurDataURL?: string;
  unoptimized?: boolean;
  loader?: unknown;
  sizes?: string;
}

const Image = React.forwardRef<HTMLImageElement, ImageProps>(function Image(
  {
    src,
    alt,
    width,
    height,
    fill,
    priority,
    quality: _quality,
    placeholder: _placeholder,
    blurDataURL: _blurDataURL,
    unoptimized: _unoptimized,
    loader: _loader,
    style,
    sizes,
    ...rest
  },
  ref,
) {
  const resolvedSrc = typeof src === "string" ? src : src?.src;
  const fillStyle: React.CSSProperties | undefined = fill
    ? {
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        ...style,
      }
    : style;

  return (
    <img
      ref={ref}
      src={resolvedSrc}
      alt={alt}
      width={fill ? undefined : (width as number | undefined)}
      height={fill ? undefined : (height as number | undefined)}
      sizes={sizes}
      loading={priority ? "eager" : rest.loading}
      decoding={rest.decoding ?? "async"}
      style={fillStyle}
      {...rest}
    />
  );
});

export default Image;
