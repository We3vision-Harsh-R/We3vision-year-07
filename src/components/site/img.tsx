/* eslint-disable @next/next/no-img-element */
// Plain <img> on purpose: image links are editable in the admin panel and can point anywhere,
// which next/image would block. Our own images are already optimised .webp files.

export function Img({ src, alt = "", ...rest }: React.ImgHTMLAttributes<HTMLImageElement>) {
  if (!src) return null;
  return <img src={src} alt={alt} loading="lazy" decoding="async" {...rest} />;
}
