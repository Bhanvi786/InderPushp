/**
 * ImageKit URL optimization helper
 * Appends transformation parameters to ImageKit URLs for fast, responsive delivery
 * without quality loss.
 */
export function getImageKitUrl(
  url: string | undefined | null,
  options?: {
    width?: number;
    height?: number;
    quality?: number;
    format?: 'webp' | 'avif' | 'auto';
    blur?: number;
  }
): string {
  if (!url) return '';

  // If not an ImageKit URL (e.g. local static path /1.jpeg or picsum), return as-is
  if (!url.includes('ik.imagekit.io')) {
    return url;
  }

  const transforms: string[] = [];
  if (options?.width) transforms.push(`w-${options.width}`);
  if (options?.height) transforms.push(`h-${options.height}`);
  if (options?.quality) transforms.push(`q-${options.quality}`);
  if (options?.blur) transforms.push(`bl-${options.blur}`);
  if (options?.format) {
    transforms.push(`f-${options.format}`);
  } else {
    transforms.push('f-auto'); // Default to auto-format (WebP/AVIF depending on browser)
  }

  if (transforms.length === 0) return url;

  const trString = `tr=${transforms.join(',')}`;

  // If URL already has query parameters
  if (url.includes('?')) {
    return `${url}&${trString}`;
  }

  return `${url}?${trString}`;
}
