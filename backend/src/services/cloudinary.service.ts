import { configureCloudinary } from '../config/cloudinary';
import streamifier from 'streamifier';
import { UploadApiResponse } from 'cloudinary';

export interface UploadResult {
  url: string;
  publicId: string;
  format?: string;
  width?: number;
  height?: number;
}

/**
 * Uploads an in-memory buffer to Cloudinary into the designated folder.
 * Gracefully handles cases where Cloudinary is not configured or fails.
 */
export const uploadBufferToCloudinary = async (
  buffer: Buffer,
  folder: string = 'inderpushp_gallery'
): Promise<UploadResult> => {
  const { isConfigured, cloudinary } = configureCloudinary();

  if (!isConfigured) {
    throw new Error(
      'Cloudinary is not configured. Please supply CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in backend/.env'
    );
  }

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: 'image',
        transformation: [
          { quality: 'auto', fetch_format: 'auto' } // Auto optimize delivery for luxury art web resolution
        ],
      },
      (error, result: UploadApiResponse | undefined) => {
        if (error || !result) {
          return reject(error || new Error('Upload to Cloudinary failed'));
        }
        resolve({
          url: result.secure_url,
          publicId: result.public_id,
          format: result.format,
          width: result.width,
          height: result.height,
        });
      }
    );

    streamifier.createReadStream(buffer).pipe(uploadStream);
  });
};

/**
 * Deletes an image from Cloudinary using its publicId.
 * Safe cleanup: fails silently or logs if public ID does not exist.
 */
export const deleteFromCloudinary = async (publicId: string): Promise<boolean> => {
  if (!publicId) return false;

  const { isConfigured, cloudinary } = configureCloudinary();
  if (!isConfigured) {
    console.warn('Cloudinary cleanup skipped: credentials not configured');
    return false;
  }

  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result.result === 'ok';
  } catch (error) {
    console.error(`Failed to delete Cloudinary asset ${publicId}:`, error);
    return false;
  }
};
