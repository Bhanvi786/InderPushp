import ImageKit from 'imagekit';

export const configureImageKit = () => {
  const publicKey = process.env.IMAGEKIT_PUBLIC_KEY;
  const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;
  const urlEndpoint = process.env.IMAGEKIT_URL_ENDPOINT;

  const isConfigured = Boolean(
    publicKey &&
    privateKey &&
    urlEndpoint &&
    publicKey !== 'your_imagekit_public_key' &&
    privateKey !== 'your_imagekit_private_key' &&
    !urlEndpoint.includes('your_imagekit_id')
  );

  let imagekit: ImageKit | null = null;
  if (isConfigured) {
    imagekit = new ImageKit({
      publicKey: publicKey!,
      privateKey: privateKey!,
      urlEndpoint: urlEndpoint!,
    });
  }

  return { isConfigured, imagekit };
};

export default configureImageKit;
