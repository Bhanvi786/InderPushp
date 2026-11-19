import multer from 'multer';

// Keep files in memory as buffer so we can stream directly to Cloudinary or validate
const storage = multer.memoryStorage();

// File type validation: images (jpeg, png, webp, avif) and videos (mp4, webm, quicktime, mov)
const fileFilter = (
  req: Express.Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  const allowedMimeTypes = [
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/avif',
    'image/jpg',
    'video/mp4',
    'video/webm',
    'video/quicktime',
    'video/x-matroska',
  ];
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file format. Supported: JPG, PNG, WEBP, AVIF, MP4, WEBM, and MOV.'));
  }
};

// Size limit: 100MB max per media file to comfortably handle HD videos & photos
export const upload = multer({
  storage,
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB
    files: 6, // max 6 files per upload batch
  },
  fileFilter,
});
