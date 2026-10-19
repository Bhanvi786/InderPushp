import { configureImageKit } from '../config/imagekit';

export interface UploadResult {
  url: string;
  publicId: string;
  format?: string;
  width?: number;
  height?: number;
  thumbnailUrl?: string;
}

/**
 * Uploads an in-memory buffer to ImageKit into the designated folder.
 */
export const uploadBufferToImageKit = async (
  buffer: Buffer,
  fileName: string = 'artwork.jpg',
  folder: string = '/inderpushp_artworks'
): Promise<UploadResult> => {
  const { isConfigured, imagekit } = configureImageKit();

  if (!isConfigured || !imagekit) {
    throw new Error(
      'ImageKit is not configured. Please supply IMAGEKIT_PUBLIC_KEY, IMAGEKIT_PRIVATE_KEY, and IMAGEKIT_URL_ENDPOINT in backend/.env'
    );
  }

  const cleanFolder = folder.startsWith('/') ? folder : `/${folder}`;
  const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9._-]/g, '_') || `artwork_${Date.now()}.jpg`;

  try {
    const response = await imagekit.upload({
      file: buffer.toString('base64'),
      fileName: sanitizedFileName,
      folder: cleanFolder,
      useUniqueFileName: true,
    });

    return {
      url: response.url,
      publicId: response.fileId,
      format: response.fileType,
      width: response.width,
      height: response.height,
      thumbnailUrl: response.thumbnailUrl,
    };
  } catch (error: any) {
    console.error('ImageKit upload error details:', error);
    throw new Error(error.message || 'Upload to ImageKit failed');
  }
};

/**
 * Deletes an image from ImageKit using its fileId (stored as publicId).
 */
export const deleteFromImageKit = async (fileId: string): Promise<boolean> => {
  if (!fileId) return false;

  const { isConfigured, imagekit } = configureImageKit();
  if (!isConfigured || !imagekit) {
    console.warn('ImageKit cleanup skipped: credentials not configured');
    return false;
  }

  try {
    await imagekit.deleteFile(fileId);
    return true;
  } catch (error) {
    console.error(`Failed to delete ImageKit asset ${fileId}:`, error);
    return false;
  }
};
