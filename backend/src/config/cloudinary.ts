import { v2 as cloudinary } from 'cloudinary';

export const configureCloudinary = () => {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  const isConfigured = Boolean(
    cloudName &&
    apiKey &&
    apiSecret &&
    cloudName !== 'your_cloud_name' &&
    apiKey !== 'your_api_key' &&
    apiSecret !== 'your_api_secret'
  );

  if (isConfigured) {
    cloudinary.config({
      cloud_name: cloudName,
      api_key: apiKey,
      api_secret: apiSecret,
      secure: true,
    });
  }

  return { isConfigured, cloudinary };
};

export default cloudinary;
