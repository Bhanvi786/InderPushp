import multer from 'multer';

// Keep files in memory as buffer so we can stream directly to Cloudinary or validate
const storage = multer.memoryStorage();

// File type validation: only jpeg, png, webp, avif
const fileFilter = (
  req: Express.Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/jpg'];
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file format. Only JPG, PNG, WEBP, and AVIF images are allowed.'));
  }
};

// Size limit: 10MB max per image
export const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
    files: 6, // max 6 files per upload batch
  },
  fileFilter,
});
